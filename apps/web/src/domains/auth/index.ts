/**
 * Auth Module - Public API
 *
 * Server Actions만 export합니다.
 * AuthClient 인스턴스는 Server Component에서만 사용 가능하며,
 * `auth-server.ts`에서 직접 import하세요.
 */

// Server Actions (Client Component에서 호출 가능)
export { getClientSession, getOrCreateDeviceId } from "./auth-actions";
