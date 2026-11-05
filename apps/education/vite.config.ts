import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { seoPlugin } from "./seo-plugin.ts";
import { config } from "./src/config.ts";

// BASE_PATH: đặt khi deploy vào thư mục con (vd. GitHub Pages: /landing-templates/education/)
export default defineConfig({
  base: process.env.BASE_PATH ?? "/",
  plugins: [react(), tailwindcss(), seoPlugin(config)],
  build: { target: "es2020", cssMinify: true },
});
