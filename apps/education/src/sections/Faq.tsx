import { useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { config } from "../config";
import { Heading } from "./Heading";

export function Faq() {
  const { faq } = config;
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="pb-20 lg:pb-28">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[1fr_1.6fr]">
        <div>
          <Heading eyebrow={faq.eyebrow} title={faq.title} />
          <p className="mt-5 text-muted">
            Chưa thấy câu trả lời? Gọi <a href={`tel:${config.contact.phone}`} className="font-semibold text-primary">{config.contact.hotline}</a> hoặc chat Zalo với chúng tôi.
          </p>
        </div>
        <div className="space-y-3">
          {faq.items.map((f, i) => {
            const isOpen = open === i;
            const id = `faq-${i}`;
            return (
              <div key={f.q} className={`rounded-3xl border-2 border-ink transition-colors ${isOpen ? "bg-white shadow-[5px_5px_0_var(--c-text)]" : "bg-transparent"}`}>
                <h3>
                  <button className="font-display flex w-full items-center justify-between gap-4 px-6 py-5 text-left text-lg font-semibold" aria-expanded={isOpen} aria-controls={id} onClick={() => setOpen(isOpen ? null : i)}>
                    {f.q}
                    <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-xl transition-transform duration-300 ${isOpen ? "rotate-45 bg-primary text-white" : "bg-lime"}`} aria-hidden>+</span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <m.div id={id} initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                      <p className="px-6 pb-6 leading-relaxed text-muted">{f.a}</p>
                    </m.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
      {/* FAQ structured data cho Google */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faq.items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
          }).replace(/</g, "\\u003c"),
        }}
      />
    </section>
  );
}
