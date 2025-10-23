import path from "node:path";
import { fileURLToPath } from "node:url";
import { withSentryConfig } from "@sentry/nextjs";
import { createVanillaExtractPlugin } from "@vanilla-extract/next-plugin";
import type { NextConfig } from "next";

const withVanillaExtract = createVanillaExtractPlugin();

const __dirname = fileURLToPath(new URL(".", import.meta.url));

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // TypedRoutes - 타입 안전한 라우팅
  typedRoutes: true,

  // Cache Components - Sentry 호환성 문제로 비활성화
  // TODO: Sentry가 Next.js 16 cacheComponents를 지원하면 재활성화
  cacheComponents: false,

  // React Compiler - 리액트 컴파일러 활성화
  reactCompiler: true,

  // 모노레포 외부 패키지 사용 허용 및 트랜스파일 설정
  // - externalDir: 패키지 외부(모노레포 루트)의 소스 접근 허용
  // - transpilePackages: 워크스페이스 패키지 트랜스파일 (ex. @nugudi/themes)
  experimental: {
    externalDir: true,
  },

  // 워크스페이스 패키지 트랜스파일 (pnpm + 모노레포 환경 호환)
  transpilePackages: ["@nugudi/themes", "@nugudi/assets-icons", "@nugudi/ui"],

  images: {
    formats: ["image/avif", "image/webp"],
  },

  // 모듈 해석 안정화를 위한 별칭 설정 (Vercel + pnpm 워크스페이스)
  webpack(config) {
    config.resolve = config.resolve || {};
    config.resolve.alias = config.resolve.alias || {};
    config.resolve.alias["@nugudi/themes"] = path.resolve(
      __dirname,
      "../../packages/themes",
    );
    config.resolve.symlinks = true;
    return config;
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
