import { config } from "../config";
import { Reveal } from "../components/shared/Reveal";
import { Heading } from "./Heading";

const colors = ["bg-lime", "bg-white", "bg-[#C7D2FE]"];

export function Testimonials() {
  const { testimonials } = config;
  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Heading eyebrow={testimonials.eyebrow} title={testimonials.title} />
          <span className="rounded-full border-2 border-dashed border-ink/40 px-4 py-1.5 text-sm font-semibold text-muted">⚠ {testimonials.badge}</span>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {testimonials.items.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.1} className="h-full">
              <figure className={`pop flex h-full flex-col rounded-3xl p-7 ${colors[i % 3]}`}>
                <div className="text-lg tracking-widest text-ink" aria-label="5 sao">★★★★★</div>
                <blockquote className="mt-4 flex-1 text-lg leading-relaxed">“{t.quote}”</blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t-2 border-ink/10 pt-5">
                  <span className="font-display grid h-11 w-11 place-items-center rounded-full bg-ink font-bold text-white" aria-hidden>{t.name.split(" ").pop()?.[0]}</span>
                  <div>
                    <div className="font-display font-bold">{t.name}</div>
                    <div className="text-sm text-muted">{t.role}</div>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
