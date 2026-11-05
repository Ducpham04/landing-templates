import { renderToString } from "react-dom/server";
import { Root } from "./Root";

/** Dùng lúc build (prerender.mjs) để sinh HTML tĩnh → tải nhanh, SEO tốt. */
export function render() {
  return renderToString(<Root />);
}
