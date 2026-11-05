import { config } from "../config";

export function Footer() {
  const { site, footer, nav, contact } = config;
  return (
    <footer className="border-t-2 border-ink bg-white py-14">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 md:grid-cols-[1.4fr_1fr_1.2fr]">
        <div>
          <div className="font-display flex items-center gap-2 text-2xl font-bold">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-sm text-lime">N</span>
            {site.name}
          </div>
          <p className="mt-3 text-muted">{footer.tagline}</p>
        </div>
        <nav className="grid grid-cols-2 gap-2 text-sm" aria-label="Chân trang">
          {nav.map((n) => <a key={n.href} href={n.href} className="hover:text-primary">{n.label}</a>)}
        </nav>
        <address className="space-y-1.5 text-sm not-italic">
          <p>{contact.address}</p>
          <p>Hotline: <a href={`tel:${contact.phone}`} className="font-semibold text-primary">{contact.hotline}</a></p>
          <p><a href={`mailto:${contact.email}`}>{contact.email}</a></p>
        </address>
      </div>
      <p className="mx-auto mt-10 max-w-7xl px-5 text-xs text-muted sm:px-8">© {new Date().getFullYear()} {site.name}. {footer.legal}</p>
    </footer>
  );
}
