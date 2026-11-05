import { config } from "../config";
import { Reveal } from "../components/shared/Reveal";
import { SmartImage } from "../components/shared/SmartImage";
import { Heading } from "./Heading";

export function Overview() {
  const { overview } = config;
  return (
    <section id="tong-quan" className="py-24 lg:py-36">
      <div className="mx-auto grid max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-12 lg:gap-20">
        <div className="lg:col-span-6">
          <Heading eyebrow={overview.eyebrow} title={overview.title} />
          <Reveal delay={0.1} className="mt-8 space-y-5 leading-relaxed text-ink/75">
            {overview.body.map((p, i) => <p key={i}>{p}</p>)}
          </Reveal>
          <Reveal delay={0.2}>
            <dl className="mt-12 grid grid-cols-2 gap-x-8">
              {overview.facts.map((f) => (
                <div key={f.label} className="border-t border-ink/10 py-5">
                  <dt className="text-[11px] tracking-[0.2em] text-muted uppercase">{f.label}</dt>
                  <dd className="font-display mt-1 text-xl">{f.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
        <Reveal delay={0.15} className="relative lg:col-span-6">
          <div className="absolute -top-6 -right-6 hidden h-full w-full border border-primary/40 lg:block" />
          <SmartImage
            src={overview.image}
            alt={overview.title}
            maxWidth={1080}
            sizes="(min-width:1024px) 50vw, 100vw"
            className="relative aspect-[4/5] w-full object-cover"
          />
        </Reveal>
      </div>
    </section>
  );
}
