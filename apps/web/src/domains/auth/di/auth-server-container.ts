/**
 * Auth Server Container
 *
 * Server-side only DI Container
 * - Uses ServerSessionManager and ServerTokenProvider
 * - Creates new instance per request
 */

import "server-only";

// Data Layer
import { AuthRemoteDataSource, AuthRepositoryImpl } from "@auth/data";
// Domain Layer (UseCases)
import {
  GetCurrentSession,
  GetOAuthAuthorizeUrl,
  LoginWithOAuth,
  Logout,
  RefreshToken,
  SignUpWithSocial,
} from "@auth/domain";
import { AuthenticatedHttpClient } from "@/src/shared/infrastructure/http/authenticated-http-client";
import { FetchHttpClient } from "@/src/shared/infrastructure/http/fetch-http-client";
import { ServerTokenProvider } from "@/src/shared/infrastructure/http/server-token-provider";
import { ServerSessionManager } from "@/src/shared/infrastructure/storage/server-session-manager";
// Infrastructure Layer
import { RefreshTokenService } from "../infrastructure/services/refresh-token.service";

/**
 * Auth Server Container
 */
class AuthServerContainer {
  private sessionManager: ServerSessionManager;
  private refreshTokenService: RefreshTokenService;
  private loginWithOAuthUseCase: LoginWithOAuth;
  private logoutUseCase: Logout;
  private refreshTokenUseCase: RefreshToken;
  private signUpWithSocialUseCase: SignUpWithSocial;
  private getCurrentSessionUseCase: GetCurrentSession;
  private getOAuthAuthorizeUrlUseCase: GetOAuthAuthorizeUrl;

  constructor(baseUrl?: string) {
    // baseUrl 검증 - Edge Runtime에서도 절대 URL 보장
    const apiUrl = baseUrl ?? process.env.NEXT_PUBLIC_API_URL;

    if (!apiUrl || apiUrl.trim() === "") {
      throw new Error(
        `[AuthServerContainer] API baseUrl is required but not provided. ` +
          `Please ensure NEXT_PUBLIC_API_URL environment variable is set. ` +
          `Current value: "${apiUrl}". ` +
          `This is critical for Edge Runtime (middleware) to make API calls.`,
      );
    }

    // Infrastructure Layer
    this.sessionManager = new ServerSessionManager();
    const sessionManager = this.sessionManager;
    const tokenProvider = new ServerTokenProvider(sessionManager);
    const baseClient = new FetchHttpClient({ baseUrl: apiUrl });

    // RefreshTokenService 생성 (Spring API 직접 호출)
    this.refreshTokenService = new RefreshTokenService(sessionManager, apiUrl);

    const httpClient = new AuthenticatedHttpClient(
      baseClient,
      tokenProvider,
      undefined, // Server-side: no session manager for client sync
      this.refreshTokenService, // Server-side: RefreshTokenService 주입
    );

    // Data Layer
    const authDataSource = new AuthRemoteDataSource(httpClient);
    const authRepository = new AuthRepositoryImpl(authDataSource);

    // Domain Layer (UseCases)
    this.loginWithOAuthUseCase = new LoginWithOAuth(
      authRepository,
      sessionManager,
    );

    this.logoutUseCase = new Logout(authRepository, sessionManager);

    this.refreshTokenUseCase = new RefreshToken(authRepository, sessionManager);

    this.signUpWithSocialUseCase = new SignUpWithSocial(authRepository);

    this.getCurrentSessionUseCase = new GetCurrentSession(sessionManager);

    this.getOAuthAuthorizeUrlUseCase = new GetOAuthAuthorizeUrl(authRepository);
  }

  getLoginWithOAuth(): LoginWithOAuth {
    return this.loginWithOAuthUseCase;
  }

  getLogout(): Logout {
    return this.logoutUseCase;
  }

  getRefreshToken(): RefreshToken {
    return this.refreshTokenUseCase;
  }

  getSignUpWithSocial(): SignUpWithSocial {
    return this.signUpWithSocialUseCase;
  }

  getCurrentSession(): GetCurrentSession {
    return this.getCurrentSessionUseCase;
  }

  getOAuthAuthorizeUrl(): GetOAuthAuthorizeUrl {
    return this.getOAuthAuthorizeUrlUseCase;
  }

  getSessionManager(): ServerSessionManager {
    return this.sessionManager;
  }

  getRefreshTokenService(): RefreshTokenService {
    return this.refreshTokenService;
  }
}

/**
 * Server Container Factory (Per-Request)
 *
 * @param baseUrl - Optional API base URL. If not provided, uses NEXT_PUBLIC_API_URL
 */
export function createAuthServerContainer(
  baseUrl?: string,
): AuthServerContainer {
  // Edge Runtime에서 명시적으로 baseUrl 전달 가능
  return new AuthServerContainer(baseUrl);
}
