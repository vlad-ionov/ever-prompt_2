import path from "node:path";
import { fileURLToPath } from "node:url";

import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
      },
    }),
    tsconfigPaths(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "app"),
      "@/components": path.resolve(__dirname, "app/components"),
      "@/styles": path.resolve(__dirname, "app/styles"),
      "@/assets": path.resolve(__dirname, "app/assets"),
      "@/lib": path.resolve(__dirname, "app/lib"),
    },
  },
});
