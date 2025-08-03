import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import type { StorybookConfig } from "@storybook/react-vite";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import svgr from "vite-plugin-svgr";

const require = createRequire(import.meta.url);

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, "package.json")));
}
const config: StorybookConfig = {
  stories: ["../src/*.mdx", "../src/*/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    getAbsolutePath("@storybook/addon-onboarding"),
    getAbsolutePath("@chromatic-com/storybook"),
    getAbsolutePath("@storybook/addon-docs"),
    getAbsolutePath("@storybook/addon-a11y"),
    getAbsolutePath("@storybook/addon-vitest"),
  ],
  framework: {
    name: getAbsolutePath("@storybook/react-vite"),
    options: {},
  },

  viteFinal: async (config) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@": join(__dirname, "../src"),
      "@nugudi/themes": join(__dirname, "../../themes/dist"),
      "@nugudi/assets-icons": join(__dirname, "../../assets/icons/src"),
    };

    // Add plugins
    config.plugins = config.plugins || [];
    config.plugins.push(vanillaExtractPlugin());
    config.plugins.push(svgr());

    // Ensure vanilla-extract files are processed
    config.optimizeDeps = config.optimizeDeps || {};
    config.optimizeDeps.include = [
      ...(config.optimizeDeps.include || []),
      "@vanilla-extract/css",
      "@vanilla-extract/recipes",
      "@vanilla-extract/recipes/createRuntimeFn",
      "@nugudi/assets-icons",
    ];

    // Exclude workspace packages from optimization
    config.optimizeDeps.exclude = [
      ...(config.optimizeDeps.exclude || []),
      "@nugudi/react-components-layout",
      "@nugudi/react-components-button",
      "@nugudi/react-components-input",
      "@nugudi/react-components-tab",
      "@nugudi/react-hooks-button",
      "@nugudi/themes",
    ];

    // Optimize bundle size
    config.build = config.build || {};
    config.build.chunkSizeWarningLimit = 1000;

    return config;
  },
};
export default config;
