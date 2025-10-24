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

  // 워크스페이스 패키지 트랜스파일 (Vercel 빌드 환경 호환)
  transpilePackages: ["@nugudi/themes"],

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
      },
      telemetry: false,
      tunnelRoute: "/monitoring",
      widenClientFileUpload: true,
    }),
];

export default plugins.reduce((acc, plugin) => plugin(acc), nextConfig);
