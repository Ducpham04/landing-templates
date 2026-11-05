import { config } from "../config";
import { Icon } from "../components/shared/Icon";
import { Heading } from "./Heading";

const colors = ["bg-lime", "bg-white", "bg-[#C7D2FE]"];

export function Testimonials() {
  const { testimonials } = config;
  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Heading title={testimonials.title} />
          <span className="flex items-center gap-1.5 rounded-full border-2 border-dashed border-ink/40 px-4 py-1.5 text-sm font-semibold text-ink/80"><Icon name="info" />{testimonials.badge}</span>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {testimonials.items.map((t, i) => (
            <div key={t.name} className="h-full">
              <figure className={`pop flex h-full flex-col rounded-3xl p-7 ${colors[i % 3]}`}>
                <div className="flex gap-0.5 text-ink" role="img" aria-label="5 sao">{[0, 1, 2, 3, 4].map((k) => <Icon key={k} name="star" filled className="h-4 w-4" />)}</div>
                <blockquote className="mt-4 flex-1 text-lg leading-relaxed">“{t.quote}”</blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t-2 border-ink/10 pt-5">
                  <span className="font-display grid h-11 w-11 place-items-center rounded-full bg-ink font-bold text-white" aria-hidden>{t.name.split(" ").pop()?.[0]}</span>
                  <div>
                    <div className="font-display font-bold">{t.name}</div>
                    <div className="text-sm text-ink/75">{t.role}</div>
                  </div>
                </figcaption>
              </figure>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
