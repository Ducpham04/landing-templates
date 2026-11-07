export function Heading({ title, center = false, light = false }: { title: string; center?: boolean; light?: boolean }) {
  return (
    <h2 className={`text-4xl leading-[1.1] font-bold sm:text-5xl ${center ? "mx-auto max-w-3xl text-center" : "max-w-3xl"} ${light ? "text-white" : ""}`}>
      {title}
    </h2>
  );
}
