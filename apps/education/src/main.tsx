import { createRoot, hydrateRoot } from "react-dom/client";
import "@fontsource/lexend/400.css";
import "@fontsource/lexend/600.css";
import "@fontsource/lexend/700.css";
import "./index.css";
import { Root } from "./Root";

const el = document.getElementById("root")!;
// Bản build đã prerender HTML sẵn → hydrate; khi chạy dev → render bình thường
if (el.hasChildNodes()) hydrateRoot(el, <Root />);
else createRoot(el).render(<Root />);
