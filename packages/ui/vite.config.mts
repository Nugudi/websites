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

export default defineConfig({
  plugins: [
    react(),
    vanillaExtractPlugin(),
    svgr(),
    dts({
      include: ["src"],
      insertTypesEntry: true,
      outDir: "dist",
      entryRoot: "src",
      rollupTypes: false,
      tsconfigPath: "./tsconfig.json",
    }),
    tsconfigPaths(),
  ],

  build: {
    lib: {
      entry: {
        index: resolve(_dirname, "src/index.ts"),
        "utils/index": resolve(_dirname, "src/utils/index.ts"),
      },
      formats: ["es"],
    },
    rollupOptions: {
      external: ["react", "react-dom", "@vanilla-extract/css"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
        entryFileNames: "[name].js",
      },
    },
    sourcemap: true,
    outDir: "dist",
  },
});
