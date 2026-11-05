import { useEffect, useState } from "react";
import { m } from "framer-motion";
import { config } from "../config";
import { SmartImage } from "../components/shared/SmartImage";

export function Hero() {
  const { hero } = config;
  const [showVideo, setShowVideo] = useState(false);
  useEffect(() => {
    // Chỉ tải video trên màn hình lớn & khi không bật tiết kiệm dữ liệu → giữ Lighthouse cao
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (hero.video && window.matchMedia("(min-width: 1024px)").matches && !conn?.saveData) {
      const t = setTimeout(() => setShowVideo(true), 1200);
      return () => clearTimeout(t);
    }
  }, [hero.video]);

  return (
    <section className="relative flex min-h-[100svh] items-end overflow-hidden" aria-label="Giới thiệu">
      <div className="absolute inset-0">
        <SmartImage src={hero.image} alt={config.site.name} priority className="kenburns h-full w-full object-cover" />
        {showVideo && (
          <video className="absolute inset-0 h-full w-full object-cover" src={hero.video} autoPlay muted loop playsInline preload="none" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/50 to-bg/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-bg/70 to-transparent" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-5 pt-40 pb-10 sm:px-8 lg:pb-14">
        <h1 className="font-display text-[clamp(3rem,8vw,6rem)] leading-[0.98] font-normal tracking-[-0.02em]">
          {hero.title.map((line, i) => (
            <span key={i} className={`block ${i === 1 ? "text-primary" : ""}`}>
              {line}
            </span>
          ))}
        </h1>
        <p className="mt-8 max-w-xl text-base leading-relaxed text-ink/80 sm:text-lg"
        >
          {hero.subtitle}
        </p>
        <m.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.9 }}
          className="mt-10 flex flex-col gap-4 sm:flex-row"
        >
          <a href="#dang-ky" className="btn-gold">{hero.ctaPrimary}</a>
          <a href="#tong-quan" className="btn-ghost">{hero.ctaSecondary}</a>
        </m.div>

        {/* Thông số dự án viết thành một dòng thông tin, không phải dãy "số to – nhãn nhỏ" */}
        <ul className="mt-16 flex flex-wrap gap-x-8 gap-y-3 border-t border-ink/15 pt-6 text-sm text-ink/85">
          {hero.stats.map((s) => (
            <li key={s.label}>
              <span className="text-primary tabular-nums">{s.value}</span> {s.label.toLowerCase()}
            </li>
          ))}
          <li className="text-muted">(số liệu mẫu)</li>
        </ul>
      </div>
    </section>
  );
}
