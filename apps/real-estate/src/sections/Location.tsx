import { useState } from "react";
import { config } from "../config";
import { Reveal } from "../components/shared/Reveal";
import { Heading } from "./Heading";

export function Location() {
  const { location } = config;
  // Bản đồ chỉ tải khi người dùng bấm → không ảnh hưởng tốc độ trang
  const [loadMap, setLoadMap] = useState(false);
  return (
    <section id="vi-tri" className="bg-surface py-24 lg:py-36">
      <div className="mx-auto grid max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Heading eyebrow={location.eyebrow} title={location.title} />
          <Reveal delay={0.1}>
            <ul className="mt-10">
              {location.distances.map((d) => (
                <li key={d.place} className="flex items-baseline justify-between gap-4 border-b border-ink/10 py-4">
                  <span className="text-ink/80">{d.place}</span>
                  <span className="font-display text-2xl whitespace-nowrap text-primary">{d.time}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-muted">* Thời gian di chuyển mẫu, tham khảo.</p>
          </Reveal>
        </div>
        <Reveal delay={0.15} className="relative min-h-[380px] overflow-hidden border border-ink/10 lg:col-span-7">
          {loadMap ? (
            <iframe
              title={`Bản đồ vị trí ${config.site.name}`}
              src={location.mapEmbed}
              className="absolute inset-0 h-full w-full grayscale-[60%] invert-[90%] hue-rotate-180"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          ) : (
            <button
              onClick={() => setLoadMap(true)}
              className="group absolute inset-0 grid place-items-center bg-[radial-gradient(circle_at_center,rgb(198_161_91/0.15),transparent_60%)]"
              aria-label="Tải bản đồ Google Maps"
            >
              <svg className="absolute inset-0 h-full w-full opacity-20" aria-hidden>
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M40 0H0V40" fill="none" stroke="var(--c-text)" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
              <span className="relative flex flex-col items-center gap-4">
                <span className="grid h-16 w-16 place-items-center rounded-full border border-primary text-primary transition-transform duration-500 group-hover:scale-110">
                  <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor" aria-hidden>
                    <path d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z" />
                  </svg>
                </span>
                <span className="text-[12px] tracking-[0.25em] uppercase">Xem bản đồ</span>
                <span className="max-w-xs text-center text-xs text-muted">{config.contact.address}</span>
              </span>
            </button>
          )}
        </Reveal>
      </div>
    </section>
  );
}
