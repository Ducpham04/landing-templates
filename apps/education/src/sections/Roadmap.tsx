import { m } from "framer-motion";
import { config } from "../config";
import { Reveal } from "../components/shared/Reveal";
import { Heading } from "./Heading";

export function Roadmap() {
  const { roadmap } = config;
  return (
    <section id="lo-trinh" className="relative overflow-hidden bg-ink py-20 text-white lg:py-28">
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-[480px] w-[480px] rounded-full bg-primary/40 blur-3xl" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <Heading eyebrow={roadmap.eyebrow} title={roadmap.title} light />
        <div className="relative mt-16">
          <div className="absolute top-7 right-0 left-0 hidden h-1 rounded-full bg-white/10 lg:block" aria-hidden>
            <m.div className="h-full origin-left rounded-full bg-lime" initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 1.6, ease: "easeInOut" }} />
          </div>
          <ol className="grid gap-6 lg:grid-cols-4">
            {roadmap.steps.map((s, i) => (
              <Reveal as="li" key={s.name} delay={0.2 + i * 0.15} className="relative list-none">
                  <span className="font-display relative z-10 grid h-14 w-14 place-items-center rounded-full border-2 border-lime bg-ink text-xl font-bold text-lime">{i + 1}</span>
                  <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                    <div className="text-xs font-semibold tracking-widest text-white/60 uppercase">{s.level} · {s.duration}</div>
                    <h3 className="mt-2 text-2xl font-bold">{s.name}</h3>
                    <div className="font-display mt-3 inline-block rounded-full bg-lime px-3 py-1 text-sm font-bold text-ink">{s.target}</div>
                    <ul className="mt-5 space-y-2 text-sm text-white/80">
                      {s.points.map((p) => <li key={p} className="flex gap-2"><span className="text-lime">✓</span>{p}</li>)}
                    </ul>
                  </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
