import { config } from "../config";
import { SmartImage } from "../components/shared/SmartImage";
import { Heading } from "./Heading";

const tilt = ["-rotate-2", "rotate-2", "-rotate-1", "rotate-1"];
const bg = ["bg-lime", "bg-[#C7D2FE]", "bg-[#FBCFE8]", "bg-[#FDE68A]"];

export function Teachers() {
  const { teachers } = config;
  return (
    <section id="giang-vien" className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Heading title={teachers.title} />
        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {teachers.items.map((t, i) => (
            <div key={t.name}>
              <article className="group">
                <div className={`relative aspect-[4/5] overflow-hidden rounded-3xl border-2 border-ink ${bg[i % 4]} ${tilt[i % 4]} transition-transform duration-300 group-hover:rotate-0`}>
                  <SmartImage src={t.image} alt={t.name} maxWidth={768} sizes="(min-width:1024px) 25vw, (min-width:640px) 50vw, 100vw" className="h-full w-full object-cover mix-blend-multiply grayscale-[20%] transition duration-500 group-hover:mix-blend-normal group-hover:grayscale-0" />
                </div>
                <h3 className="mt-6 text-xl font-bold">{t.name}</h3>
                <p className="text-sm font-semibold text-primary">{t.role}</p>
                <p className="mt-2 text-sm text-muted">{t.bio}</p>
              </article>
            </div>
          ))}
        </div>
        <p className="mt-8 text-sm text-muted">{teachers.note}</p>
      </div>
    </section>
  );
}
