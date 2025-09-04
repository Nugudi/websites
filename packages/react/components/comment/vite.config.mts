import react from "@vitejs/plugin-react";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    dts({
      include: ["src"],
      rollupTypes: true,
      exclude: ["**/*.stories.tsx", "**/*.test.tsx"],
    }),
    vanillaExtractPlugin(),
  ],
  build: {
    lib: {
      entry: "src/index.ts",
      name: "@nugudi/react-components-comment",
      fileName: "index",
      formats: ["es"],
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime"],
      output: {
        preserveModules: false,
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === "style.css") {
            return "index.css";
          }
          return assetInfo.name || "";
        },
      },
    },
  },
});