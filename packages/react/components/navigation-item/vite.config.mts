import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import tsconfigPaths from "vite-tsconfig-paths";

const _filename = fileURLToPath(import.meta.url);
const _dirname = dirname(_filename);

export default defineConfig({
  plugins: [
    react(),
    vanillaExtractPlugin(),
    dts({
      include: ["src"],
      exclude: ["src/**/*.stories.tsx", "src/**/*.test.tsx"],
      outDir: "dist",
      entryRoot: "src",
      insertTypesEntry: true,
      rollupTypes: false,
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
      external: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "@vanilla-extract/css",
        "@radix-ui/react-slot",
      ],
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith(".css")) return "index.css";
          return assetInfo.name || "assets/[name].[ext]";
        },
      },
    },
    sourcemap: true,
    minify: false,
    outDir: "dist",
  },
  resolve: {
    alias: {
      "@": resolve(_dirname, "./src"),
    },
  },
});
