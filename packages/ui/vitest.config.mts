import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    projects: [
      {
        extends: true,
        plugins: [react(), vanillaExtractPlugin(), tsconfigPaths(), svgr()],
        test: {
          name: "js-dom",
          environment: "jsdom",
          include: ["tests/**/*.{test,spec}.?(c|m)[jt]s?(x)"],
        },
      },
      {
        extends: true,
        plugins: [
          storybookTest({ configDir: ".storybook" }),
          react(),
          vanillaExtractPlugin(),
          tsconfigPaths(),
          svgr(),
        ],
        test: {
          name: "storybook",
          browser: {
            enabled: true,
            provider: "playwright",
            headless: true,
            instances: [{ browser: "chromium" }],
          },
          setupFiles: [".storybook/vitest.setup.ts"],
        },
      },
    ],
  },
});
