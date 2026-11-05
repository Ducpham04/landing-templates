import { Reveal } from "../components/shared/Reveal";

export function Heading({ eyebrow, title, center = false }: { eyebrow: string; title: string; center?: boolean }) {
  return (
    <Reveal className={center ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      <p className="eyebrow">{eyebrow}</p>
      <div className={`gold-line mt-5 h-px w-24 ${center ? "mx-auto" : ""}`} />
      <h2 className="font-display mt-6 text-4xl leading-[1.1] font-normal sm:text-5xl lg:text-6xl">{title}</h2>
    </Reveal>
  );
}
