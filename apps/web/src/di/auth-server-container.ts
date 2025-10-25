import { AuthRepositoryImpl } from "@/src/domains/auth/repositories/auth-repository";
import {
  AuthServiceImpl,
  RefreshTokenService,
} from "@/src/domains/auth/services";
import { UserRepositoryImpl } from "@/src/domains/user/repositories/user-repository";
import { UserServiceImpl } from "@/src/domains/user/services/user-service";
import {
  AuthenticatedHttpClient,
  FetchHttpClient,
  ServerTokenProvider,
} from "@/src/shared/infrastructure/http";
import { ServerSessionManager } from "@/src/shared/infrastructure/storage/server-session-manager";

class AuthServerContainer {
  private _authService?: AuthServiceImpl;
  private _userService?: UserServiceImpl;
  private _authenticatedHttpClient?: AuthenticatedHttpClient;
  private _sessionManager?: ServerSessionManager;
  private _refreshTokenService?: RefreshTokenService;

  /**
   * AuthenticatedHttpClient 획득 (Server-side)
   *
   * Server-side에서는 RefreshTokenService를 주입하여
   * SSR Prefetch 시 Cookie 전달 문제를 해결합니다.
   *
   * Why RefreshTokenService?
   * - Server-side fetch()는 Cookie를 자동 전달하지 않음
   * - RefreshTokenService가 SessionManager를 통해 직접 토큰 조회
   * - BFF를 우회하여 성능 향상
   */
  private getAuthenticatedHttpClient(): AuthenticatedHttpClient {
    if (!this._authenticatedHttpClient) {
      const sessionManager = this.getSessionManager();
      const tokenProvider = new ServerTokenProvider(sessionManager);
      const refreshTokenService = this.getRefreshTokenService();
      const baseClient = new FetchHttpClient({
        baseUrl: process.env.NEXT_PUBLIC_API_URL || "",
      });

      this._authenticatedHttpClient = new AuthenticatedHttpClient(
        baseClient,
        tokenProvider,
        refreshTokenService, // Server-side용: RefreshTokenService 주입
      );
    }

    return this._authenticatedHttpClient;
  }

  getSessionManager(): ServerSessionManager {
    if (!this._sessionManager) {
      this._sessionManager = new ServerSessionManager();
    }

    return this._sessionManager;
  }

  getAuthService(): AuthServiceImpl {
    if (!this._authService) {
      const authenticatedClient = this.getAuthenticatedHttpClient();
      const sessionManager = this.getSessionManager();
      const authRepository = new AuthRepositoryImpl(authenticatedClient);

      this._authService = new AuthServiceImpl(authRepository, sessionManager);
    }

    return this._authService;
  }

  getUserService(): UserServiceImpl {
    if (!this._userService) {
      const authenticatedClient = this.getAuthenticatedHttpClient();
      const userRepository = new UserRepositoryImpl(authenticatedClient);
      this._userService = new UserServiceImpl(userRepository);
    }

    return this._userService;
  }

  /**
   * RefreshTokenService 획득 (BFF 전용)
   *
   * BFF Route에서만 사용
   * - AuthenticatedHttpClient를 우회하여 무한 루프 방지
   * - Spring API를 직접 호출
   */
  getRefreshTokenService(): RefreshTokenService {
    if (!this._refreshTokenService) {
      const sessionManager = this.getSessionManager();
      const springApiUrl = process.env.NEXT_PUBLIC_API_URL || "";

      this._refreshTokenService = new RefreshTokenService(
        sessionManager,
        springApiUrl,
      );
    }

    return this._refreshTokenService;
  }
}

export function createAuthServerContainer(): AuthServerContainer {
  return new AuthServerContainer();
}
