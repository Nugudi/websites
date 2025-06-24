import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

const plugins = [
  (config: NextConfig) =>
    withSentryConfig(config, {
      org: "nugudi",
      project: "nugudi-web",
      bundleSizeOptimizations: {
        excludeDebugStatements: true,
        excludeReplayShadowDom: true,
        excludeReplayIframe: true,
        excludeReplayWorker: true,
      },
      disableLogger: true,
      silent: !process.env.CI,
      sourcemaps: {
        deleteSourcemapsAfterUpload: true,
      },
      telemetry: false,
      tunnelRoute: "/monitoring",
      widenClientFileUpload: true,
    }),
];

export default plugins.reduce((acc, plugin) => plugin(acc), {
  reactStrictMode: true,
} as NextConfig);
