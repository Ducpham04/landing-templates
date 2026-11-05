/** Tiêu đề section: vạch vàng mảnh + tiêu đề serif. Không dùng nhãn nhỏ (kicker) phía trên. */
export function Heading({ title, center = false }: { title: string; center?: boolean }) {
  return (
    <div className={center ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      <div className={`gold-line h-px w-24 ${center ? "mx-auto" : ""}`} />
      <h2 className="font-display mt-6 text-4xl leading-[1.1] font-normal sm:text-5xl lg:text-6xl">{title}</h2>
    </div>
  );
}
