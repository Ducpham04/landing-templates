import { m } from "framer-motion";
import { config } from "../config";
import { Icon } from "../components/shared/Icon";
import { SmartImage } from "../components/shared/SmartImage";

export function Hero() {
  const { hero } = config;
  return (
    <section className="relative overflow-hidden pt-28 pb-20 lg:pt-36 lg:pb-28" aria-label="Giới thiệu">
      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-2">
        <div>
          <m.span initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="inline-block rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white">
            {hero.badge}
          </m.span>
          <h1 className="mt-7 text-[clamp(2.6rem,6vw,4.5rem)] leading-[1.05] font-bold tracking-[-0.02em]">
            {hero.titleBefore} <span className="marker">{hero.titleHighlight}</span>{" "}
            <span className="text-primary">{hero.titleAfter}</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">{hero.subtitle}</p>
          <div className="mt-9 flex flex-col gap-4 sm:flex-row">
            <a href="#hoc-thu" className="btn-primary">{hero.ctaPrimary} <Icon name="arrow" /></a>
            <a href="#khoa-hoc" className="btn-light">{hero.ctaSecondary}</a>
          </div>
          <p className="mt-10 text-sm text-muted">
            {hero.stats.map((st, i) => (
              <span key={st.label}>
                {i > 0 && " · "}
                <strong className="font-display font-semibold text-ink tabular-nums">{st.value}</strong> {st.label.toLowerCase()}
              </span>
            ))}{" "}
            (số liệu mẫu)
          </p>
        </div>

        <div className="relative mx-auto w-full max-w-lg">
          <div className="absolute -inset-3 rotate-3 rounded-[2.5rem] bg-lime" aria-hidden />
          <div className="pop relative aspect-[4/5] overflow-hidden rounded-[2.5rem]">
            <SmartImage src={hero.image} alt="Học viên trong lớp học" priority maxWidth={1080} sizes="(min-width:1024px) 40vw, 90vw" className="h-full w-full object-cover" />
          </div>
          {hero.floatingCards.map((c, i) => (
            <m.div
              key={c.title}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
              transition={{ delay: 0.5 + i * 0.2, y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: i } }}
              className={`pop absolute rounded-2xl bg-white px-5 py-4 ${i === 0 ? "top-10 -left-4 sm:-left-10" : "-right-3 bottom-12 sm:-right-8"}`}
            >
              <div className="font-display text-2xl font-bold text-primary">{c.title}</div>
              <div className="text-sm text-muted">{c.desc}</div>
            </m.div>
          ))}
          <div className="absolute -bottom-6 left-10 grid h-20 w-20 rotate-12 place-items-center rounded-full border-2 border-ink bg-coral text-center font-display text-xs leading-tight font-bold text-white" aria-hidden>
            HỌC THỬ<br />FREE
          </div>
        </div>
      </div>
    </section>
  );
}
