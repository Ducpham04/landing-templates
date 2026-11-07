import { createRoot, hydrateRoot } from "react-dom/client";
import "@fontsource/playfair-display/400.css";
import "@fontsource/playfair-display/400-italic.css";
import "@fontsource-variable/inter";
import "./index.css";
import { Root } from "./Root";

const el = document.getElementById("root")!;
// Bản build đã prerender HTML sẵn → hydrate; khi chạy dev → render bình thường
if (el.hasChildNodes()) hydrateRoot(el, <Root />);
else createRoot(el).render(<Root />);
