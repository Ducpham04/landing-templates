import { useEffect, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { config } from "../config";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header className="fixed inset-x-0 top-0 z-40 px-3 pt-3 sm:px-5">
      <div className={`mx-auto max-w-7xl rounded-full border-2 transition-all duration-300 ${scrolled || open ? "border-ink bg-white/95 shadow-[4px_4px_0_var(--c-text)] backdrop-blur" : "border-transparent"}`}>
        <div className="flex h-14 items-center justify-between pr-2 pl-5">
          <a href="#" className="font-display flex items-center gap-2 text-xl font-bold">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-sm text-lime">N</span>
            {config.site.name}
          </a>
          <nav className="hidden items-center gap-7 lg:flex" aria-label="Chính">
            {config.nav.map((n) => (
              <a key={n.href} href={n.href} className="font-display text-sm font-semibold hover:text-primary">{n.label}</a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <a href="#hoc-thu" className="font-display hidden rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary sm:inline-flex">Học thử miễn phí</a>
            <button className="grid h-10 w-10 place-items-center rounded-full bg-lime lg:hidden" aria-label={open ? "Đóng menu" : "Mở menu"} aria-expanded={open} onClick={() => setOpen((o) => !o)}>
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
                {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h10" />}
              </svg>
            </button>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <m.nav initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="pop mx-auto mt-2 max-w-7xl rounded-3xl bg-white p-4 lg:hidden" aria-label="Di động">
            {config.nav.map((n) => (
              <a key={n.href} href={n.href} onClick={() => setOpen(false)} className="font-display block rounded-xl px-4 py-3 text-lg font-semibold hover:bg-surface">{n.label}</a>
            ))}
            <a href="#hoc-thu" onClick={() => setOpen(false)} className="btn-primary mt-3 w-full">Học thử miễn phí</a>
          </m.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
