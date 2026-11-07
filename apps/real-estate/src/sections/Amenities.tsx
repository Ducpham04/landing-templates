import { config } from "../config";
import { SmartImage } from "../components/shared/SmartImage";
import { Heading } from "./Heading";

export function Amenities() {
  const { amenities } = config;
  return (
    <section id="tien-ich" className="bg-surface py-24 lg:py-36">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Heading title={amenities.title} center />
        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {amenities.featured.map((a, i) => (
            <div key={a.title}>
              <article className="group relative aspect-[3/4] overflow-hidden">
                <SmartImage
                  src={a.image}
                  alt={a.title}
                  maxWidth={768}
                  sizes="(min-width:1024px) 25vw, (min-width:640px) 50vw, 100vw"
                  className="h-full w-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <span className="font-display text-sm text-primary">0{i + 1}</span>
                  <h3 className="font-display mt-1 text-2xl">{a.title}</h3>
                  <p className="mt-2 max-h-0 overflow-hidden text-sm text-ink/70 opacity-0 transition-all duration-500 group-hover:max-h-20 group-hover:opacity-100 max-lg:max-h-20 max-lg:opacity-100">
                    {a.desc}
                  </p>
                </div>
              </article>
            </div>
          ))}
        </div>
        <div>
          <ul className="mt-16 grid grid-cols-1 gap-x-10 sm:grid-cols-2 lg:grid-cols-4">
            {amenities.list.map((item) => (
              <li key={item} className="flex items-center gap-4 border-b border-ink/10 py-4 text-sm text-ink/80">
                <span className="h-1.5 w-1.5 rotate-45 bg-primary" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
