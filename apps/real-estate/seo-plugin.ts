import type { Plugin } from "vite";

/**
 * Sinh thẻ SEO + Open Graph + JSON-LD + biến màu chủ đạo vào index.html
 * lúc build, lấy dữ liệu từ src/config.ts. Nhờ vậy crawler (Google, Facebook,
 * Zalo) đọc được meta mà không cần chạy JavaScript.
 * Đồng thời xuất robots.txt và sitemap.xml vào dist/.
 */
export interface SeoInput {
  site: {
    name: string;
    title: string;
    description: string;
    url: string;
    ogImage: string;
    locale?: string;
    keywords?: string[];
    schemaType?: string;
    /** Ảnh hero: dùng để preconnect tới domain chứa ảnh (giảm thời gian tải LCP) */
    preloadImage?: string;
  };
  theme: Record<string, string>;
  contact?: { phone?: string; email?: string; address?: string };
}

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const kebab = (s: string) => s.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase());

export function seoPlugin(cfg: SeoInput): Plugin {
  const { site, theme, contact } = cfg;
  const url = site.url.replace(/\/$/, "") + "/";
  const abs = (p: string) => (/^https?:\/\//.test(p) ? p : url + p.replace(/^\//, ""));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": site.schemaType ?? "Organization",
    name: site.name,
    description: site.description,
    url,
    image: abs(site.ogImage),
    ...(contact?.phone ? { telephone: contact.phone } : {}),
    ...(contact?.email ? { email: contact.email } : {}),
    ...(contact?.address ? { address: contact.address } : {}),
  };

  const cssVars = Object.entries(theme)
    .map(([k, v]) => `--c-${kebab(k)}:${v}`)
    .join(";");

  const preloadOrigin = site.preloadImage?.match(/^https?:\/\/[^/]+/)?.[0];

  const head = [
    `<title>${esc(site.title)}</title>`,
    `<meta name="description" content="${esc(site.description)}" />`,
    site.keywords?.length ? `<meta name="keywords" content="${esc(site.keywords.join(", "))}" />` : "",
    `<link rel="canonical" href="${esc(url)}" />`,
    `<meta name="theme-color" content="${esc(theme.background ?? theme.primary)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${esc(site.name)}" />`,
    `<meta property="og:title" content="${esc(site.title)}" />`,
    `<meta property="og:description" content="${esc(site.description)}" />`,
    `<meta property="og:url" content="${esc(url)}" />`,
    `<meta property="og:image" content="${esc(abs(site.ogImage))}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:locale" content="${esc(site.locale ?? "vi_VN")}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(site.title)}" />`,
    `<meta name="twitter:description" content="${esc(site.description)}" />`,
    `<meta name="twitter:image" content="${esc(abs(site.ogImage))}" />`,
    preloadOrigin ? `<link rel="preconnect" href="${preloadOrigin}" crossorigin />` : "",
    `<style>:root{${cssVars}}</style>`,
    `<script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, "\\u003c")}</script>`,
  ]
    .filter(Boolean)
    .join("\n    ");

  return {
    name: "seo-from-config",
    transformIndexHtml(html) {
      return html.replace("<!--app-head-->", head);
    },
    generateBundle() {
      this.emitFile({
        type: "asset",
        fileName: "robots.txt",
        source: `User-agent: *\nAllow: /\n\nSitemap: ${url}sitemap.xml\n`,
      });
      this.emitFile({
        type: "asset",
        fileName: "sitemap.xml",
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${url}</loc><changefreq>weekly</changefreq><priority>1.0</priority></url>\n</urlset>\n`,
      });
    },
  };
}
