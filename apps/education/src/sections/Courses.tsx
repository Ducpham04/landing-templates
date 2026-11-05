import { config } from "../config";
import { Icon } from "../components/shared/Icon";
import { Heading } from "./Heading";

export function Courses() {
  const { courses } = config;
  return (
    <section id="khoa-hoc" className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Heading title={courses.title} />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {courses.items.map((c) => (
            <div key={c.name} className="h-full">
              <article className="pop pop-hover flex h-full flex-col rounded-3xl bg-white p-6">
                <span className="font-display self-start rounded-full border-2 border-ink px-3 py-1 text-xs font-semibold" style={{ background: c.color }}>{c.tag}</span>
                <h3 className="mt-5 text-2xl font-bold">{c.name}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{c.desc}</p>
                <ul className="mt-5 space-y-1.5 border-t-2 border-dashed border-ink/10 pt-4 text-sm">
                  <li className="flex items-center gap-2"><Icon name="clock" className="h-4 w-4 text-primary" />{c.duration}</li>
                  <li className="flex items-center gap-2"><Icon name="calendar" className="h-4 w-4 text-primary" />{c.sessions}</li>
                </ul>
                <div className="font-display mt-4 text-lg font-bold tabular-nums">{c.price}</div>
                <a href="#hoc-thu" className="font-display mt-5 inline-flex items-center justify-center rounded-full bg-ink py-3 text-sm font-semibold text-white transition hover:bg-primary">
                  Học thử khoá này
                </a>
              </article>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm text-muted">{courses.note}</p>
      </div>
    </section>
  );
}
