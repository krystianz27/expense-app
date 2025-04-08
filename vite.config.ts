import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

import { URL } from "url";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@components": new URL("./src/components", import.meta.url).pathname,
      "@pages": new URL("./src/pages", import.meta.url).pathname,
      "@fbconfig": new URL("./src/firebase", import.meta.url).pathname,
    },
  },
});
