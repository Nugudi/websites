/**
 * DEPRECATED: Use @/src/domains/auth/di/auth-container instead
 *
 * This file provides backward compatibility for existing code.
 * New code should use the new Clean Architecture DI container.
 */

// IMPORTANT: Use dynamic import to avoid bundling server-only code in client
// import { getAuthClientContainer as getNewAuthClientContainer } from "@/src/domains/auth/di/auth-container";
import { UserRepositoryImpl } from "@/src/domains/user/repositories/user-repository";
import { UserServiceImpl } from "@/src/domains/user/services/user-service";
import {
  AuthenticatedHttpClient,
  ClientTokenProvider,
  FetchHttpClient,
} from "@/src/shared/infrastructure/http";
import { ClientSessionManager } from "@/src/shared/infrastructure/storage/client-session-manager";

class AuthClientContainer {
  private static instance: AuthClientContainer;

  private _authService?: any; // Legacy compatibility
  private _userService?: UserServiceImpl;
  private _authenticatedHttpClient?: AuthenticatedHttpClient;
  private _sessionManager?: ClientSessionManager;

  private constructor() {}

  static getInstance(): AuthClientContainer {
    if (!AuthClientContainer.instance) {
      AuthClientContainer.instance = new AuthClientContainer();
    }
    return AuthClientContainer.instance;
  }

  /**
   * SessionManager Singleton (중요!)
   *
   * Client Container는 Singleton이므로 SessionManager도 Singleton이어야 함
   * - AuthenticatedHttpClient와 AuthService가 같은 SessionManager 인스턴스를 공유
   * - 상태 일관성 보장
   */
  private getSessionManager(): ClientSessionManager {
    if (!this._sessionManager) {
      this._sessionManager = new ClientSessionManager();
    }

    return this._sessionManager;
  }

  /**
   * AuthenticatedHttpClient 획득 (Client-side)
   *
   * Client-side에서는 RefreshTokenService를 주입하지 않습니다.
   * - BFF 호출 (/api/auth/refresh)을 사용
   * - 브라우저가 자동으로 Cookie 전달
   * - SessionManager를 주입하여 BFF 응답 토큰으로 localStorage 동기화
   */
  private getAuthenticatedHttpClient(): AuthenticatedHttpClient {
    if (!this._authenticatedHttpClient) {
      const sessionManager = this.getSessionManager();
      const tokenProvider = new ClientTokenProvider(sessionManager);
      const baseClient = new FetchHttpClient({
        baseUrl: process.env.NEXT_PUBLIC_API_URL || "",
      });

      this._authenticatedHttpClient = new AuthenticatedHttpClient(
        baseClient,
        tokenProvider,
        sessionManager, // Client-side: localStorage 동기화를 위해 SessionManager 주입
        undefined, // Client-side: BFF 사용, RefreshTokenService 불필요
      );
    }

    return this._authenticatedHttpClient;
  }

  async getAuthService(): Promise<any> {
    if (!this._authService) {
      // Use dynamic import to avoid bundling server-only code in client
      const { getAuthClientContainer } = await import(
        "@/src/domains/auth/di/auth-client-container"
      );
      const newContainer = getAuthClientContainer();

      // Wrap UseCases in a service-like interface for backward compatibility
      this._authService = {
        loginWithOAuth: newContainer.getLoginWithOAuth(),
        logout: newContainer.getLogout(),
        refreshToken: newContainer.getRefreshToken(),
        signUpWithSocial: newContainer.getSignUpWithSocial(),
        getCurrentSession: newContainer.getCurrentSession(),
      };
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

  reset(): void {
    this._authService = undefined;
    this._userService = undefined;
  }
}

export const authClientContainer = AuthClientContainer.getInstance();
