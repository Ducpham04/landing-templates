import { config } from "../config";
import { Reveal } from "../components/shared/Reveal";
import { Heading } from "./Heading";

export function Process() {
  const { process } = config;
  return (
    <section id="quy-trinh" className="bg-ink py-24 text-bg lg:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Heading index="02" eyebrow={process.eyebrow} title={process.title} light />
        <ol className="mt-16 grid gap-px overflow-hidden bg-bg/10 sm:grid-cols-2 lg:grid-cols-3">
          {process.steps.map((s, i) => (
            <Reveal as="li" key={s.title} delay={(i % 3) * 0.1} className="group relative list-none bg-ink p-8 transition-colors duration-500 hover:bg-[#2e2924] lg:p-10">
                <div className="flex items-start justify-between">
                  <span className="font-display text-6xl text-primary italic">{String(i + 1).padStart(2, "0")}</span>
                  <span className="rounded-full border border-bg/20 px-3 py-1 text-xs text-bg/70">{s.time}</span>
                </div>
                <h3 className="font-display mt-10 text-2xl">{s.title}</h3>
                <p className="mt-3 leading-relaxed text-bg/65">{s.desc}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
