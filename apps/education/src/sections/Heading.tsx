import { Reveal } from "../components/shared/Reveal";

export function Heading({ eyebrow, title, center = false, light = false }: { eyebrow: string; title: string; center?: boolean; light?: boolean }) {
  return (
    <Reveal className={center ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      <span className="chip">{eyebrow}</span>
      <h2 className={`mt-5 text-4xl leading-[1.1] font-bold sm:text-5xl ${light ? "text-white" : ""}`}>{title}</h2>
    </Reveal>
  );
}
