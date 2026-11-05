import { useEffect, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { config } from "../config";
import { SmartImage } from "../components/shared/SmartImage";
import { Heading } from "./Heading";

export function Testimonials() {
  const { testimonials } = config;
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = testimonials.items.length;
  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setI((x) => (x + 1) % n), 7000);
    return () => clearInterval(t);
  }, [n, paused]);
  const t = testimonials.items[i];

  return (
    <section id="danh-gia" className="bg-surface py-24 lg:py-32" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Heading index="04" eyebrow={testimonials.eyebrow} title={testimonials.title} />
        <div className="mt-16 grid gap-10 md:grid-cols-12">
          <div className="md:col-span-3">
            <span className="inline-block rounded-full border border-primary/40 px-3 py-1 text-xs text-primary">{testimonials.badge}</span>
          </div>
          <div className="md:col-span-9" aria-live="polite">
            <AnimatePresence mode="wait">
              <m.figure key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }}>
                <blockquote className="font-display text-2xl leading-snug sm:text-3xl lg:text-4xl">
                  <span className="text-primary">“</span>{t.quote}<span className="text-primary">”</span>
                </blockquote>
                <figcaption className="mt-10 flex items-center gap-4">
                  <SmartImage src={t.avatar} alt="" maxWidth={480} sizes="56px" className="h-14 w-14 rounded-full object-cover" />
                  <div>
                    <div className="font-medium">{t.name}</div>
                    <div className="text-sm text-muted">{t.role}</div>
                  </div>
                </figcaption>
              </m.figure>
            </AnimatePresence>
            <div className="mt-10 flex gap-2" role="tablist" aria-label="Chọn nhận xét">
              {testimonials.items.map((_, k) => (
                <button key={k} role="tab" aria-selected={k === i} aria-label={`Nhận xét ${k + 1}`} onClick={() => setI(k)} className="py-3">
                  <span className={`block h-0.5 transition-all duration-500 ${k === i ? "w-14 bg-primary" : "w-8 bg-ink/20"}`} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
