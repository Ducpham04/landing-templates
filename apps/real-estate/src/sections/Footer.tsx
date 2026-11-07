import { config } from "../config";

export function Footer() {
  const { site, contact, footer, nav } = config;
  return (
    <footer className="border-t border-ink/10 py-16">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 md:grid-cols-3">
        <div>
          <div className="font-display text-3xl tracking-[0.12em] uppercase">{site.name.replace(/^The\s/, "")}</div>
          <p className="mt-3 text-sm text-muted">{footer.tagline}</p>
        </div>
        <nav aria-label="Chân trang" className="grid grid-cols-2 gap-2 text-sm text-ink/70">
          {nav.map((n) => <a key={n.href} href={n.href} className="hover:text-primary">{n.label}</a>)}
        </nav>
        <address className="space-y-2 text-sm text-ink/70 not-italic">
          <p>{contact.address}</p>
          <p><a href={`tel:${contact.phone}`} className="text-primary">{contact.hotline}</a></p>
          <p><a href={`mailto:${contact.email}`}>{contact.email}</a></p>
        </address>
      </div>
      <div className="mx-auto mt-12 max-w-7xl px-5 text-xs text-muted/80 sm:px-8">
        © {new Date().getFullYear()} {site.name}. {footer.legal}
      </div>
    </footer>
  );
}
