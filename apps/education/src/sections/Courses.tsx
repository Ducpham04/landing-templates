import { config } from "../config";
import { Reveal } from "../components/shared/Reveal";
import { Heading } from "./Heading";

export function Courses() {
  const { courses } = config;
  return (
    <section id="khoa-hoc" className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Heading eyebrow={courses.eyebrow} title={courses.title} />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {courses.items.map((c, i) => (
            <Reveal key={c.name} delay={i * 0.08} className="h-full">
              <article className="pop pop-hover flex h-full flex-col rounded-3xl bg-white p-6">
                <div className="flex items-center justify-between">
                  <span className="grid h-14 w-14 place-items-center rounded-2xl border-2 border-ink text-2xl" style={{ background: c.color }} aria-hidden>{c.icon}</span>
                  <span className="rounded-full bg-surface px-3 py-1 text-xs font-semibold text-primary">{c.tag}</span>
                </div>
                <h3 className="mt-6 text-2xl font-bold">{c.name}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{c.desc}</p>
                <ul className="mt-5 space-y-1.5 border-t-2 border-dashed border-ink/10 pt-4 text-sm">
                  <li>⏱ {c.duration}</li>
                  <li>📅 {c.sessions}</li>
                </ul>
                <div className="font-display mt-4 text-lg font-bold">{c.price}</div>
                <a href="#hoc-thu" className="font-display mt-5 inline-flex items-center justify-center rounded-full bg-ink py-3 text-sm font-semibold text-white transition hover:bg-primary">
                  Học thử khoá này
                </a>
              </article>
            </Reveal>
          ))}
        </div>
        <p className="mt-6 text-sm text-muted">{courses.note}</p>
      </div>
    </section>
  );
}
