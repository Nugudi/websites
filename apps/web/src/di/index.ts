/**
 * DI Container Module
 *
 * 의존성 주입 컨테이너 모듈 Export
 *
 * ⚠️ IMPORTANT: Client와 Server Container를 barrel export하면
 * 서버 전용 코드(next/headers)가 클라이언트 번들에 포함됩니다.
 * 따라서 각 파일을 직접 import해야 합니다:
 *
 * - Client: import { authClientContainer } from "@/src/di/auth-client-container"
 * - Server: import { createAuthServerContainer } from "@/src/di/auth-server-container"
 */

// ❌ DO NOT use barrel export here - it causes server code to be bundled in client
// export * from "./auth-client-container";
// export * from "./auth-server-container";
