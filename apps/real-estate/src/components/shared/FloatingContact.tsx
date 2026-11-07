import { m } from "framer-motion";

type Props = { zalo?: string; messenger?: string; phone?: string };

/** Nút liên hệ nổi Zalo / Messenger / Gọi điện (góc phải dưới). */
export function FloatingContact({ zalo, messenger, phone }: Props) {
  const items = [
    zalo && {
      href: `https://zalo.me/${zalo.replace(/\D/g, "")}`,
      label: "Chat Zalo",
      bg: "#0068FF",
      icon: (
        <svg viewBox="0 0 48 48" className="h-7 w-7" aria-hidden>
          <path fill="#fff" d="M24 6C13 6 4 13.6 4 23c0 5.4 3 10.2 7.6 13.3L10 42l6.6-3.4c2.3.7 4.8 1.1 7.4 1.1 11 0 20-7.6 20-17S35 6 24 6Z" />
          <text x="24" y="27.5" textAnchor="middle" fontSize="11" fontWeight="700" fill="#0068FF" fontFamily="Arial, sans-serif">Zalo</text>
        </svg>
      ),
    },
    messenger && {
      href: `https://m.me/${messenger}`,
      label: "Chat Messenger",
      bg: "linear-gradient(135deg,#00B2FF 0%,#7A5CFF 55%,#FF5C87 100%)",
      icon: (
        <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden>
          <path fill="#fff" d="M12 2C6.4 2 2 6.1 2 11.7c0 2.9 1.2 5.5 3.2 7.2v3.5l3-1.7c1.2.3 2.4.5 3.8.5 5.6 0 10-4.1 10-9.6S17.6 2 12 2Zm1 12.9-2.6-2.7-5 2.7 5.5-5.8 2.6 2.7 5-2.7-5.5 5.8Z" />
        </svg>
      ),
    },
    phone && {
      href: `tel:${phone.replace(/\s/g, "")}`,
      label: `Gọi ${phone}`,
      bg: "var(--c-primary)",
      icon: (
        <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden>
          <path fill="#fff" d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1l-2.3 2.2Z" />
        </svg>
      ),
    },
  ].filter(Boolean) as { href: string; label: string; bg: string; icon: React.ReactNode }[];

  return (
    <div className="fixed right-4 bottom-4 z-50 flex flex-col gap-3 sm:right-6 sm:bottom-6">
      {items.map((it, i) => (
        <m.a
          key={it.label}
          href={it.href}
          target={it.href.startsWith("tel:") ? undefined : "_blank"}
          rel="noopener noreferrer"
          aria-label={it.label}
          title={it.label}
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.8 + i * 0.12, type: "spring", stiffness: 260, damping: 18 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="fab-ring relative grid h-12 w-12 place-items-center sm:h-14 sm:w-14 rounded-full shadow-lg shadow-black/25"
          style={{ background: it.bg }}
        >
          {it.icon}
        </m.a>
      ))}
    </div>
  );
}
