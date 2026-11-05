import { config } from "../config";
import { Reveal } from "../components/shared/Reveal";
import { Arrow, Heading } from "./Heading";

export function Packages() {
  const { packages } = config;
  return (
    <section id="bao-gia" className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Heading index="03" eyebrow={packages.eyebrow} title={packages.title} />
        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {packages.plans.map((p, i) => (
            <Reveal
              key={p.name}
              delay={i * 0.1}
              className={`relative flex flex-col p-8 lg:p-10 ${p.highlight ? "bg-primary text-bg lg:-translate-y-4" : "border border-ink/15 bg-bg"}`}
            >
              {p.highlight && <span className="absolute top-6 right-6 rounded-full bg-bg px-3 py-1 text-xs font-medium text-primary">Phổ biến nhất</span>}
              <h3 className="font-display text-3xl italic">{p.name}</h3>
              <p className={`mt-2 text-sm ${p.highlight ? "text-bg/80" : "text-muted"}`}>{p.desc}</p>
              <div className={`mt-8 border-t pt-6 ${p.highlight ? "border-bg/25" : "border-ink/10"}`}>
                <span className="font-display text-5xl">{p.price}</span>
                <span className={`ml-2 text-sm ${p.highlight ? "text-bg/80" : "text-muted"}`}>{p.unit}</span>
              </div>
              <ul className="mt-8 flex-1 space-y-3">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-3 text-sm">
                    <span className={p.highlight ? "text-bg" : "text-primary"} aria-hidden>✦</span>
                    {f}
                  </li>
                ))}
              </ul>
              <a href="#lien-he" className={`mt-10 justify-center ${p.highlight ? "btn-ink !bg-bg !text-ink hover:!bg-ink hover:!text-bg" : "btn-line"}`}>
                Chọn gói {p.name} <Arrow />
              </a>
            </Reveal>
          ))}
        </div>
        <p className="mt-8 text-sm text-muted">{packages.note}</p>
      </div>
    </section>
  );
}
