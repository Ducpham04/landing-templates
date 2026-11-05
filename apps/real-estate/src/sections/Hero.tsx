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
        <p className="eyebrow">{hero.eyebrow}</p>
        <h1 className="font-display mt-6 text-[clamp(3rem,9vw,7.5rem)] leading-[0.95] font-normal">
          {hero.title.map((line, i) => (
            <span key={i} className={`block ${i === 1 ? "text-primary italic" : ""}`}>
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

        <div className="mt-16 grid grid-cols-2 border-t border-ink/15 md:grid-cols-4">
          {hero.stats.map((s, i) => (
            <m.div
              key={s.label}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 + i * 0.1 }}
              className={`py-6 ${i % 2 === 1 ? "pl-6 md:pl-8" : "md:pl-8"} ${i === 0 ? "md:!pl-0" : ""} ${i > 0 ? "md:border-l md:border-ink/15" : ""}`}
            >
              <div className="font-display text-3xl text-primary sm:text-4xl">{s.value}</div>
              <div className="mt-1 text-[11px] tracking-[0.2em] text-muted uppercase">{s.label}</div>
            </m.div>
          ))}
        </div>
        <p className="text-[10px] tracking-widest text-muted/70 uppercase">* Số liệu mẫu</p>
      </div>
    </section>
  );
}
