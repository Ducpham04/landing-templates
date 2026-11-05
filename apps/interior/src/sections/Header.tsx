import { useEffect, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { config } from "../config";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${scrolled || open ? "bg-bg/90 shadow-[0_1px_0_rgb(0_0_0/0.06)] backdrop-blur-md" : ""}`}>
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 sm:px-8">
        <a href="#" className="font-display text-2xl italic">
          {config.site.name}
          <span className="text-primary">.</span>
        </a>
        <nav className="hidden items-center gap-10 md:flex" aria-label="Chính">
          {config.nav.map((n) => (
            <a key={n.href} href={n.href} className="group relative text-sm">
              {n.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-primary transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>
        <a href="#lien-he" className="btn-ink hidden !py-3 md:inline-flex">Nhận tư vấn</a>
        <button className="md:hidden" aria-label={open ? "Đóng menu" : "Mở menu"} aria-expanded={open} onClick={() => setOpen((o) => !o)}>
          <span className="text-sm font-medium tracking-widest uppercase">{open ? "Đóng" : "Menu"}</span>
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <m.nav initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden md:hidden" aria-label="Di động">
            <div className="flex flex-col px-5 pb-8">
              {config.nav.map((n, i) => (
                <a key={n.href} href={n.href} onClick={() => setOpen(false)} className="font-display flex items-baseline gap-4 border-b border-ink/10 py-4 text-3xl">
                  <span className="font-sans text-xs text-primary">0{i + 1}</span>
                  {n.label}
                </a>
              ))}
              <a href="#lien-he" onClick={() => setOpen(false)} className="btn-ink mt-6 justify-center">Nhận tư vấn miễn phí</a>
            </div>
          </m.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
