import type { SessionManager } from "../storage/session-manager";
import type { TokenProvider } from "./token-provider.interface";

/**
 * 서버 환경에서 토큰을 제공하는 구현체
 *
 * ServerSessionManager를 통해 HttpOnly 쿠키에서 토큰을 가져옴
 */
export class ServerTokenProvider implements TokenProvider {
  constructor(private readonly sessionManager: SessionManager) {}

  async getToken(): Promise<string | null> {
    const session = await this.sessionManager.getSession();
    return session?.accessToken ?? null;
  }
}
