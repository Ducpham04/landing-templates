/** Tiêu đề section: vạch kẻ mảnh + tiêu đề serif; 2 chữ cuối đổi màu nhấn (không in nghiêng). */
export function Heading({ title, light = false }: { title: string; light?: boolean }) {
  const words = title.split(" ");
  const tail = words.splice(-2).join(" ");
  return (
    <div className="border-t border-current/15 pt-8">
      <h2 className="font-display max-w-4xl text-4xl leading-[1.1] sm:text-5xl lg:text-[3.5rem]">
        {words.join(" ")} <span className={light ? "text-primary-on-dark" : "text-primary"}>{tail}</span>
      </h2>
    </div>
  );
}

export const Arrow = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

/** Dấu đầu dòng vẽ bằng CSS (không dùng ký tự unicode làm icon) */
export const Bullet = ({ className = "bg-primary" }: { className?: string }) => (
  <span className={`mt-[0.55em] h-1.5 w-1.5 shrink-0 rounded-full ${className}`} aria-hidden />
);
