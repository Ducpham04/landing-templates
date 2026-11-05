import { useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { config } from "../config";
import { SmartImage } from "../components/shared/SmartImage";
import { Heading } from "./Heading";

type Unit = (typeof config.floorPlans.units)[number];

function PlanDrawing({ unit }: { unit: Unit }) {
  // Sơ đồ minh hoạ sinh từ config (toạ độ 0–100). Dùng khi chưa có ảnh bản vẽ thật.
  return (
    <svg viewBox="-4 -4 108 108" className="h-full w-full" role="img" aria-label={`Mặt bằng ${unit.name}`}>
      <rect x="-2" y="-2" width="104" height="104" fill="none" stroke="var(--c-primary)" strokeWidth="0.6" />
      {unit.rooms.map((r) => (
        <g key={r.label}>
          <rect x={r.x} y={r.y} width={r.w} height={r.h} fill="rgb(198 161 91 / 0.05)" stroke="var(--c-text)" strokeOpacity="0.55" strokeWidth="0.4" />
          <text x={r.x + r.w / 2} y={r.y + r.h / 2} textAnchor="middle" dominantBaseline="middle" fill="var(--c-text)" fillOpacity="0.8" fontSize="3.4" fontFamily="Be Vietnam Pro, sans-serif" letterSpacing="0.2">
            {r.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

export function FloorPlans() {
  const { floorPlans } = config;
  const [active, setActive] = useState(floorPlans.units[0].id);
  const unit = floorPlans.units.find((u) => u.id === active)!;

  return (
    <section id="mat-bang" className="py-24 lg:py-36">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Heading title={floorPlans.title} />
        <div className="mt-12 flex flex-wrap gap-2" role="tablist" aria-label="Loại căn hộ">
          {floorPlans.units.map((u) => (
            <button
              key={u.id}
              role="tab"
              aria-selected={u.id === active}
              onClick={() => setActive(u.id)}
              className={`border px-6 py-3 text-[12px] tracking-[0.2em] uppercase transition-colors duration-300 ${
                u.id === active ? "border-primary bg-primary text-bg" : "border-ink/20 text-ink/70 hover:border-primary hover:text-primary"
              }`}
            >
              {u.name}
            </button>
          ))}
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-12">
          <div className="relative aspect-square border border-ink/10 bg-surface p-6 sm:p-10 lg:col-span-7">
            <AnimatePresence mode="wait">
              <m.div
                key={unit.id}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.45 }}
                className="h-full w-full"
              >
                {unit.image ? (
                  <SmartImage src={unit.image} alt={`Mặt bằng ${unit.name}`} className="h-full w-full object-contain" />
                ) : (
                  <PlanDrawing unit={unit} />
                )}
              </m.div>
            </AnimatePresence>
          </div>
          <AnimatePresence mode="wait">
            <m.div
              key={unit.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.45 }}
              className="flex flex-col justify-center lg:col-span-5"
            >
              <h3 className="font-display text-4xl sm:text-5xl">{unit.name}</h3>
              <dl className="mt-10 grid grid-cols-2 gap-px bg-ink/10">
                {[
                  ["Diện tích", unit.area],
                  ["Phòng ngủ", String(unit.bedrooms)],
                  ["Phòng tắm", String(unit.bathrooms)],
                  ["Tầm nhìn", unit.view],
                ].map(([k, v]) => (
                  <div key={k} className="bg-bg p-6">
                    <dt className="text-[11px] tracking-[0.2em] text-muted uppercase">{k}</dt>
                    <dd className="font-display mt-2 text-2xl text-primary">{v}</dd>
                  </div>
                ))}
              </dl>
              <a href="#dang-ky" className="btn-gold mt-10 self-start">Nhận mặt bằng chi tiết</a>
              <p className="mt-6 text-xs text-muted">{floorPlans.note}</p>
            </m.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
