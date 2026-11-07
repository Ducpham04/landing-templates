// Prerender (SSG): chèn HTML đã render vào dist/index.html, inline CSS (bỏ 1 request chặn hiển thị)
// rồi dọn thư mục SSR tạm.
import { readFileSync, writeFileSync, rmSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, resolve } from "node:path";

const root = dirname(fileURLToPath(import.meta.url));
const dist = resolve(root, "dist");
const { render } = await import(pathToFileURL(resolve(root, "dist-ssr/entry-server.js")).href);

let html = readFileSync(resolve(dist, "index.html"), "utf8");
html = html.replace('<div id="root"></div>', `<div id="root">${render()}</div>`);
html = html.replace(/<link rel="stylesheet"[^>]*href="([^"]+\.css)"[^>]*>/g, (tag, href) => {
  const file = href.replace(/^.*?assets\//, "assets/");
  try {
    return `<style>${readFileSync(resolve(dist, file), "utf8")}</style>`;
  } catch {
    return tag;
  }
});
// Preload font chính (chữ Latin + tiếng Việt) để tránh nhảy layout (CLS) khi font tải xong
const PRELOAD_FONTS = /\/(lexend-(latin|vietnamese)-(400|700)-normal)-[^/]*\.woff2$/;
const fonts = [...new Set([...html.matchAll(/url\(([^)]+\.woff2)\)/g)].map((m) => m[1]))].filter((u) => PRELOAD_FONTS.test(u));
html = html.replace(
  "<style>",
  fonts.map((u) => `<link rel="preload" as="font" type="font/woff2" href="${u}" crossorigin />`).join("\n    ") + "\n    <style>",
);
writeFileSync(resolve(dist, "index.html"), html);
rmSync(resolve(root, "dist-ssr"), { recursive: true, force: true });
console.log("✓ prerendered dist/index.html");
