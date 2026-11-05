import { m } from "framer-motion";
import { config } from "../config";
import { SmartImage } from "../components/shared/SmartImage";
import { Arrow } from "./Heading";

export function Hero() {
  const { hero, services } = config;
  return (
    <section className="grain relative overflow-hidden pt-28 lg:pt-32" aria-label="Giới thiệu">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-12 lg:gap-8">
        <div className="flex flex-col justify-center lg:col-span-6">
          <p className="label">{hero.eyebrow}</p>
          <h1 className="font-display mt-6 text-[clamp(2.75rem,6.5vw,5.75rem)] leading-[1.02]">
            {hero.titleStart} <em className="text-primary">{hero.titleItalic}</em> {hero.titleEnd}
          </h1>
          <p className="mt-8 max-w-lg text-lg leading-relaxed text-muted">
            {hero.subtitle}
          </p>
          <m.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8 }} className="mt-10 flex flex-wrap gap-3">
            <a href="#lien-he" className="btn-ink">{hero.cta} <Arrow /></a>
            <a href="#du-an" className="btn-line">Xem dự án</a>
          </m.div>
          <dl className="mt-14 grid max-w-lg grid-cols-3 gap-6 border-t border-ink/15 pt-6">
            {hero.stats.map((s) => (
              <div key={s.label}>
                <dt className="sr-only">{s.label}</dt>
                <dd className="font-display text-3xl sm:text-4xl">{s.value}</dd>
                <dd className="mt-1 text-xs text-muted">{s.label}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-3 text-[11px] text-muted/80">* Số liệu mẫu</p>
        </div>

        <div className="relative lg:col-span-6">
          <m.div initial={{ clipPath: "inset(100% 0 0 0)" }} animate={{ clipPath: "inset(0% 0 0 0)" }} transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }} className="relative ml-auto aspect-[4/5] w-[88%] overflow-hidden rounded-t-[999px]">
            <SmartImage src={hero.imageMain} alt="Không gian nội thất tiêu biểu" priority maxWidth={1080} sizes="(min-width:1024px) 45vw, 90vw" className="h-full w-full object-cover" />
          </m.div>
          <m.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 1 }} className="absolute bottom-[-6%] left-0 aspect-square w-[42%] overflow-hidden border-8 border-bg">
            <SmartImage src={hero.imageSecondary} alt="Chi tiết phòng ngủ" maxWidth={480} sizes="40vw" className="h-full w-full object-cover" />
          </m.div>
          <div className="absolute top-8 left-[6%] hidden h-28 w-28 animate-[spin_24s_linear_infinite] motion-reduce:animate-none sm:block" aria-hidden>
            <svg viewBox="0 0 100 100" className="h-full w-full">
              <defs><path id="c" d="M50 50m-38 0a38 38 0 1 1 76 0a38 38 0 1 1-76 0" /></defs>
              <text fontSize="9.5" letterSpacing="3" fill="var(--c-primary)"><textPath href="#c">THIẾT KẾ · THI CÔNG · TRỌN GÓI ·</textPath></text>
            </svg>
          </div>
        </div>
      </div>

      <div className="mt-24 overflow-hidden border-y border-ink/10 bg-ink py-5 text-bg" aria-hidden>
        <div className="marquee flex w-max gap-12 whitespace-nowrap">
          {[...services, ...services, ...services, ...services].map((s, i) => (
            <span key={i} className="font-display flex items-center gap-12 text-2xl italic">
              {s} <span className="text-primary not-italic">✦</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
