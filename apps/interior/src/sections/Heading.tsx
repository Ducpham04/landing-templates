import { Reveal } from "../components/shared/Reveal";

/** Tiêu đề kiểu tạp chí: số thứ tự (01) + nhãn + tiêu đề serif, chữ cuối in nghiêng màu nhấn */
export function Heading({ index, eyebrow, title, light = false }: { index: string; eyebrow: string; title: string; light?: boolean }) {
  const words = title.split(" ");
  const tail = words.splice(-2).join(" ");
  return (
    <Reveal className="grid gap-6 border-t border-current/15 pt-6 md:grid-cols-12">
      <p className={`label md:col-span-3 ${light ? "!text-bg/60" : ""}`}>
        <span className="text-primary">({index})</span> {eyebrow}
      </p>
      <h2 className="font-display text-4xl leading-[1.08] sm:text-5xl md:col-span-9 lg:text-6xl">
        {words.join(" ")} <em className="text-primary">{tail}</em>
      </h2>
    </Reveal>
  );
}

export const Arrow = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);
