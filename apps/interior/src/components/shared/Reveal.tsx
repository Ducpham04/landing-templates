import { m, type HTMLMotionProps } from "framer-motion";

type Props = HTMLMotionProps<"div"> & { delay?: number; y?: number; as?: "div" | "li" };

/** Hiện dần khi cuộn tới. Tự tắt chuyển động nếu người dùng bật "reduce motion". */
export function Reveal({ delay = 0, y = 28, as = "div", children, ...rest }: Props) {
  const Comp = (as === "li" ? m.li : m.div) as typeof m.div;
  return (
    <Comp
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    >
      {children}
    </Comp>
  );
}
