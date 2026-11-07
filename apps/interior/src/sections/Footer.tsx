import { config } from "../config";

export function Footer() {
  const { site, footer, nav, contact } = config;
  return (
    <footer className="bg-ink pt-20 pb-10 text-bg">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <p className="font-display text-[clamp(3rem,12vw,10rem)] leading-none italic">
          {site.name}<span className="text-primary">.</span>
        </p>
        <div className="mt-12 grid gap-8 border-t border-bg/15 pt-8 text-sm text-bg/70 md:grid-cols-3">
          <p>{footer.tagline}</p>
          <nav className="flex flex-wrap gap-6" aria-label="Chân trang">
            {nav.map((n) => <a key={n.href} href={n.href} className="hover:text-bg">{n.label}</a>)}
          </nav>
          <p className="md:text-right"><a href={`tel:${contact.phone}`} className="hover:text-bg">{contact.hotline}</a> · {contact.email}</p>
        </div>
        <p className="mt-10 text-xs text-bg/60">© {new Date().getFullYear()} {site.name}. {footer.legal}</p>
      </div>
    </footer>
  );
}
