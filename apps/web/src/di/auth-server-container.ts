/**
 * DEPRECATED: Use @/src/domains/auth/di/auth-container instead
 *
 * This file provides backward compatibility for existing code.
 * New code should use the new Clean Architecture DI container.
 */

import { createAuthServerContainer as createNewAuthServerContainer } from "@/src/domains/auth/di/auth-container";
import { UserRepositoryImpl } from "@/src/domains/user/repositories/user-repository";
import { UserServiceImpl } from "@/src/domains/user/services/user-service";
import {
  AuthenticatedHttpClient,
  FetchHttpClient,
  ServerTokenProvider,
} from "@/src/shared/infrastructure/http";
import { ServerSessionManager } from "@/src/shared/infrastructure/storage/server-session-manager";

class AuthServerContainer {
  private _authService?: any; // Legacy compatibility
  private _userService?: UserServiceImpl;
  private _authenticatedHttpClient?: AuthenticatedHttpClient;
  private _sessionManager?: ServerSessionManager;
  private _refreshTokenService?: any; // Legacy compatibility

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
        undefined, // Server-side: SessionManager 불필요 (Cookie 기반)
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

  getAuthService(): any {
    if (!this._authService) {
      // Create new Clean Architecture container for auth
      const newContainer = createNewAuthServerContainer();

      // Wrap UseCases in a service-like interface for backward compatibility
      this._authService = {
        loginWithOAuth: (provider: string, code: string, redirectUri: string) =>
          newContainer
            .getLoginWithOAuth()
            .execute({ provider: provider as any, code, redirectUri }),
        logout: () => newContainer.getLogout().execute(),
        refreshToken: () => newContainer.getRefreshToken().execute(),
        signUpWithSocial: newContainer.getSignUpWithSocial(),
        getCurrentSession: () => newContainer.getCurrentSession().execute(),
        getOAuthAuthorizeUrl: (provider: string, redirectUri: string) =>
          newContainer
            .getOAuthAuthorizeUrl()
            .execute(provider as any, redirectUri),
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

  /**
   * RefreshTokenService 획득 (BFF 전용)
   *
   * DEPRECATED: Use new Clean Architecture RefreshToken UseCase instead
   */
  getRefreshTokenService(): any {
    if (!this._refreshTokenService) {
      const newContainer = createNewAuthServerContainer();

      // Wrap RefreshToken UseCase for backward compatibility
      this._refreshTokenService = {
        execute: () => newContainer.getRefreshToken().execute(),
      };
    }

    return this._refreshTokenService;
  }
}

export function createAuthServerContainer(): AuthServerContainer {
  return new AuthServerContainer();
}
