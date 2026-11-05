import { m } from "framer-motion";
import { config } from "../config";
import { SmartImage } from "../components/shared/SmartImage";
import { Arrow } from "./Heading";

export function Hero() {
  const { hero, services } = config;
  return (
    <section className="relative overflow-hidden pt-28 lg:pt-32" aria-label="Giới thiệu">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-12 lg:gap-8">
        <div className="flex flex-col justify-center lg:col-span-6">
          <h1 className="font-display text-[clamp(2.5rem,5vw,4.25rem)] leading-[1.06] tracking-[-0.02em]">
            {hero.titleStart} <span className="text-primary">{hero.titleItalic}</span> {hero.titleEnd}
          </h1>
          <p className="mt-8 max-w-lg text-lg leading-relaxed text-muted">
            {hero.subtitle}
          </p>
          <m.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8 }} className="mt-10 flex flex-wrap gap-3">
            <a href="#lien-he" className="btn-ink">{hero.cta} <Arrow /></a>
            <a href="#du-an" className="btn-line">Xem dự án</a>
          </m.div>
          <p className="mt-12 max-w-lg border-t border-ink/15 pt-5 text-sm text-muted">
            {hero.stats.map((st, i) => (
              <span key={st.label}>
                {i > 0 && " · "}
                <span className="font-medium text-ink tabular-nums">{st.value}</span> {st.label.toLowerCase()}
              </span>
            ))}{" "}
            (số liệu mẫu)
          </p>
        </div>

        <div className="relative lg:col-span-6">
          <m.div initial={{ clipPath: "inset(100% 0 0 0)" }} animate={{ clipPath: "inset(0% 0 0 0)" }} transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }} className="relative ml-auto aspect-[4/5] w-[88%] overflow-hidden rounded-t-[999px]">
            <SmartImage src={hero.imageMain} alt="Không gian nội thất tiêu biểu" priority maxWidth={1080} sizes="(min-width:1024px) 45vw, 90vw" className="h-full w-full object-cover" />
          </m.div>
          <m.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 1 }} className="absolute bottom-[-6%] left-0 aspect-square w-[42%] overflow-hidden border-8 border-bg">
            <SmartImage src={hero.imageSecondary} alt="Chi tiết phòng ngủ" maxWidth={480} sizes="40vw" className="h-full w-full object-cover" />
          </m.div>
        </div>
      </div>

      <div className="mt-24 bg-ink py-6 text-bg">
        <ul className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-8 gap-y-2 px-5 text-sm sm:px-8" aria-label="Hạng mục nhận thiết kế">
          <li className="text-bg/70">Nhận thiết kế:</li>
          {services.map((s) => (
            <li key={s} className="font-display text-lg">{s}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
