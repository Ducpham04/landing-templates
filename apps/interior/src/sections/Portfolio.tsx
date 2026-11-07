import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { config } from "../config";
import { SmartImage } from "../components/shared/SmartImage";
import { Heading } from "./Heading";

type Project = (typeof config.portfolio.projects)[number];

export function Portfolio() {
  const { portfolio } = config;
  const [filter, setFilter] = useState(portfolio.categories[0]);
  const [index, setIndex] = useState<number | null>(null);
  const items = filter === portfolio.categories[0] ? portfolio.projects : portfolio.projects.filter((p) => p.category === filter);

  return (
    <section id="du-an" className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Heading title={portfolio.title} />
        <div className="mt-12 flex flex-wrap gap-2" role="group" aria-label="Lọc dự án">
          {portfolio.categories.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              aria-pressed={filter === c}
              className={`rounded-full px-5 py-2 text-sm transition-colors ${filter === c ? "bg-ink text-bg" : "bg-surface hover:bg-ink/10"}`}
            >
              {c}
            </button>
          ))}
        </div>

        <m.div layout className="mt-10 columns-1 gap-5 sm:columns-2 lg:columns-3">
          <AnimatePresence mode="popLayout">
            {items.map((p, i) => (
              <m.button
                layout
                key={p.title}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.5 }}
                onClick={() => setIndex(i)}
                className="group mb-5 block w-full break-inside-avoid text-left"
                aria-label={`Xem ảnh lớn: ${p.title}`}
              >
                <div className={`relative overflow-hidden ${p.ratio}`}>
                  <SmartImage src={p.image} alt={p.title} maxWidth={768} sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw" className="h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105" />
                  <span className="absolute top-4 right-4 grid h-11 w-11 scale-75 place-items-center rounded-full bg-bg/90 opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100" aria-hidden>
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M4 9V4h5M20 15v5h-5M4 4l6 6M20 20l-6-6" /></svg>
                  </span>
                </div>
                <div className="mt-3 flex items-baseline justify-between gap-4">
                  <h3 className="font-display text-xl">{p.title}</h3>
                  <span className="text-xs text-muted">{p.meta}</span>
                </div>
              </m.button>
            ))}
          </AnimatePresence>
        </m.div>
      </div>
      <Lightbox items={items} index={index} setIndex={setIndex} />
    </section>
  );
}

function Lightbox({ items, index, setIndex }: { items: Project[]; index: number | null; setIndex: (i: number | null) => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const go = useCallback((d: number) => index !== null && setIndex((index + d + items.length) % items.length), [index, items.length, setIndex]);

  useEffect(() => {
    if (index === null) return;
    const prevFocus = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIndex(null);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      prevFocus?.focus();
    };
  }, [index, go, setIndex]);

  const p = index !== null ? items[index] : null;
  return (
    <AnimatePresence>
      {p && (
        <m.div
          role="dialog"
          aria-modal="true"
          aria-label={p.title}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex flex-col bg-[#14110e]/95 text-[#f3eee6]"
          onClick={() => setIndex(null)}
        >
          <div className="flex items-center justify-between px-5 py-4 sm:px-8" onClick={(e) => e.stopPropagation()}>
            <span className="text-sm opacity-70">{index! + 1} / {items.length}</span>
            <button ref={closeRef} onClick={() => setIndex(null)} className="rounded-full border border-white/30 px-4 py-2 text-sm hover:bg-white hover:text-black" aria-label="Đóng">
              Đóng
            </button>
          </div>
          <div className="relative flex flex-1 items-center justify-center px-4 pb-4 sm:px-20" onClick={(e) => e.stopPropagation()}>
            <AnimatePresence mode="wait">
              <m.figure key={p.title} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.35 }} className="flex max-h-full flex-col items-center">
                <SmartImage src={p.image} alt={p.title} maxWidth={1920} sizes="90vw" className="max-h-[75vh] w-auto max-w-full object-contain" />
                <figcaption className="mt-4 text-center">
                  <span className="font-display text-2xl">{p.title}</span>
                  <span className="ml-3 text-sm opacity-60">{p.meta}</span>
                </figcaption>
              </m.figure>
            </AnimatePresence>
            {items.length > 1 && (
              <>
                <button onClick={() => go(-1)} className="absolute left-2 grid h-12 w-12 place-items-center rounded-full bg-white/10 hover:bg-white/25 sm:left-6" aria-label="Ảnh trước"><svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden><path d="M15 6l-6 6 6 6" /></svg></button>
                <button onClick={() => go(1)} className="absolute right-2 grid h-12 w-12 place-items-center rounded-full bg-white/10 hover:bg-white/25 sm:right-6" aria-label="Ảnh sau"><svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden><path d="M9 6l6 6-6 6" /></svg></button>
              </>
            )}
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
