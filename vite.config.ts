import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@src": new URL("./src", import.meta.url).pathname,
      "@components": new URL("./src/components", import.meta.url).pathname,
      "@pages": new URL("./src/pages", import.meta.url).pathname,
      "@fbconfig": new URL("./src/firebase", import.meta.url).pathname,
      "@features": new URL("./src/features", import.meta.url).pathname,
      "@lib": new URL("./src/lib", import.meta.url).pathname,
    },
  },
});
