import { createRoot, hydrateRoot } from "react-dom/client";
import "@fontsource/cormorant-garamond/400.css";
import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/cormorant-garamond/400-italic.css";
import "@fontsource/be-vietnam-pro/300.css";
import "@fontsource/be-vietnam-pro/400.css";
import "@fontsource/be-vietnam-pro/500.css";
import "./index.css";
import { Root } from "./Root";

const el = document.getElementById("root")!;
// Bản build đã prerender HTML sẵn → hydrate; khi chạy dev → render bình thường
if (el.hasChildNodes()) hydrateRoot(el, <Root />);
else createRoot(el).render(<Root />);
