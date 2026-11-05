import { useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { config } from "../config";
import { Reveal } from "../components/shared/Reveal";
import { Heading } from "./Heading";

export function Schedule() {
  const { schedule } = config;
  const courses = ["Tất cả", ...new Set(schedule.classes.map((c) => c.course))];
  const [filter, setFilter] = useState("Tất cả");
  const rows = filter === "Tất cả" ? schedule.classes : schedule.classes.filter((c) => c.course === filter);

  return (
    <section id="lich" className="bg-surface py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Heading eyebrow={schedule.eyebrow} title={schedule.title} center />
        <Reveal className="mt-10 flex flex-wrap justify-center gap-2" role="group" aria-label="Lọc theo khoá">
          {courses.map((c) => (
            <button key={c} aria-pressed={filter === c} onClick={() => setFilter(c)} className={`font-display rounded-full border-2 border-ink px-4 py-2 text-sm font-semibold transition ${filter === c ? "bg-ink text-white" : "bg-white hover:bg-lime"}`}>
              {c}
            </button>
          ))}
        </Reveal>
        <ul className="mt-10 space-y-4">
          <AnimatePresence initial={false} mode="popLayout">
            {rows.map((c) => {
              const pct = Math.round(((c.total - c.seats) / c.total) * 100);
              const hot = c.seats <= 3;
              return (
                <m.li layout key={c.code} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98 }} className="pop grid items-center gap-4 rounded-3xl bg-white p-5 sm:grid-cols-[1.3fr_1fr_1.3fr_1fr_auto] sm:gap-6 sm:p-6">
                  <div>
                    <div className="font-display text-lg font-bold">{c.course}</div>
                    <div className="text-xs text-muted">Mã lớp {c.code} · {c.campus}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted">Khai giảng</div>
                    <div className="font-display font-bold text-primary">{c.start}</div>
                  </div>
                  <div className="text-sm">{c.time}</div>
                  <div>
                    <div className="flex justify-between text-xs">
                      <span className={hot ? "font-bold text-coral" : "text-muted"}>{hot ? `🔥 Còn ${c.seats} chỗ` : `Còn ${c.seats}/${c.total} chỗ`}</span>
                    </div>
                    <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-surface" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Tỉ lệ đã đăng ký">
                      <div className={`h-full rounded-full ${hot ? "bg-coral" : "bg-primary"}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                  <a href="#hoc-thu" className="font-display rounded-full bg-lime px-5 py-2.5 text-center text-sm font-bold ring-2 ring-ink transition hover:bg-ink hover:text-lime">Giữ chỗ</a>
                </m.li>
              );
            })}
          </AnimatePresence>
        </ul>
        <p className="mt-6 text-center text-sm text-muted">{schedule.note}</p>
      </div>
    </section>
  );
}
