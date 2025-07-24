import { copyFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import svgr from "vite-plugin-svgr";
import tsconfigPaths from "vite-tsconfig-paths";

const _filename = fileURLToPath(import.meta.url);
const _dirname = dirname(_filename);

function copyAppCssPlugin() {
  return {
    name: "copy-app-css",
    apply: "build" as const,
    closeBundle: async () => {
      await copyFile("src/app.css", "dist/app.css");
    },
  };
}

export default defineConfig({
  plugins: [
    react(),
    vanillaExtractPlugin(),
    svgr(),
    copyAppCssPlugin(),
    dts({
      include: ["src"],
      insertTypesEntry: true,
      outDir: "dist",
      entryRoot: "src",
      rollupTypes: true,
      tsconfigPath: "./tsconfig.json",
    }),
    tsconfigPaths(),
  ],

  build: {
    lib: {
      entry: resolve(_dirname, "src/index.ts"),
      fileName: "index",
      formats: ["es"],
    },
    rollupOptions: {
      external: ["react", "react-dom", "@vanilla-extract/css"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
        entryFileNames: "index.js",
      },
    },
    sourcemap: true,
    outDir: "dist",
  },
});
