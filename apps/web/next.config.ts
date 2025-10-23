import { withSentryConfig } from "@sentry/nextjs";
import { createVanillaExtractPlugin } from "@vanilla-extract/next-plugin";
import type { NextConfig } from "next";

const withVanillaExtract = createVanillaExtractPlugin();

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // TypedRoutes - 타입 안전한 라우팅
  typedRoutes: true,

  // Cache Components - Sentry 호환성 문제로 비활성화
  // TODO: Sentry가 Next.js 16 cacheComponents를 지원하면 재활성화
  cacheComponents: false,

  // React Compiler - 리액트 컴파일러 활성화
  reactCompiler: true,

  images: {
    formats: ["image/avif", "image/webp"],
  },
};

const plugins = [
  withVanillaExtract,
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
        // 소스맵 업로드 시 존재하지 않는 파일 에러 무시
        ignore: ["proxy.js"],
      },
      telemetry: false,
      tunnelRoute: "/monitoring",
      // widenClientFileUpload 제거하여 안정성 향상
      widenClientFileUpload: true,
    }),
];

export default plugins.reduce((acc, plugin) => plugin(acc), nextConfig);
