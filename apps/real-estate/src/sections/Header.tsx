import { useEffect, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { config } from "../config";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${
        scrolled || open ? "bg-bg/90 py-3 backdrop-blur-md" : "bg-transparent py-6"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 sm:px-8">
        <a href="#" className="font-display text-2xl tracking-[0.12em] uppercase" aria-label={config.site.name}>
          {config.site.name.replace(/^The\s/, "")}
        </a>
        <nav className="hidden items-center gap-9 lg:flex" aria-label="Chính">
          {config.nav.map((n) => (
            <a key={n.href} href={n.href} className="text-[12px] tracking-[0.2em] text-ink/80 uppercase transition-colors hover:text-primary">
              {n.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <a href={`tel:${config.contact.phone}`} className="hidden text-sm tracking-widest text-primary sm:block">
            {config.contact.hotline}
          </a>
          <a href="#dang-ky" className="btn-gold hidden !px-5 !py-3 md:inline-flex">Đăng ký</a>
          <button
            className="grid h-10 w-10 place-items-center lg:hidden"
            aria-label={open ? "Đóng menu" : "Mở menu"}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            <span className="relative block h-3 w-6">
              <span className={`absolute left-0 h-px w-6 bg-ink transition-all ${open ? "top-1.5 rotate-45" : "top-0"}`} />
              <span className={`absolute left-0 h-px w-6 bg-ink transition-all ${open ? "top-1.5 -rotate-45" : "top-3"}`} />
            </span>
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <m.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden lg:hidden"
            aria-label="Di động"
          >
            <div className="flex flex-col gap-1 px-5 pt-4 pb-6">
              {config.nav.map((n) => (
                <a key={n.href} href={n.href} onClick={() => setOpen(false)} className="font-display border-b border-ink/10 py-3 text-2xl">
                  {n.label}
                </a>
              ))}
              <a href="#dang-ky" onClick={() => setOpen(false)} className="btn-gold mt-4">Đăng ký tư vấn</a>
            </div>
          </m.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
