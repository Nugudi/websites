import type { SessionManager } from "../storage/session-manager";
import type { TokenProvider } from "./token-provider.interface";

/**
 * 서버 환경에서 토큰을 제공하는 구현체
 *
 * Token 조회 우선순위:
 * 1. Request Headers의 x-access-token (Middleware에서 갱신한 Token)
 * 2. Cookie의 access_token (기존 Token)
 *
 * Why SessionManager를 통해 조회?
 * - next/headers는 Server Component에서만 사용 가능
 * - ServerSessionManager가 headers() 호출을 대신하여 Provider는 범용적으로 사용 가능
 */
export class ServerTokenProvider implements TokenProvider {
  constructor(private readonly sessionManager: SessionManager) {}

  async getToken(): Promise<string | null> {
    // SessionManager가 Headers와 Cookie를 모두 확인
    // (Middleware에서 갱신한 Token을 Headers로 전달)
    const session = await this.sessionManager.getSession();
    return session?.accessToken ?? null;
  }
}
