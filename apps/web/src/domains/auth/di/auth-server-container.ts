/**
 * Auth Server Container
 */

import "server-only";

// Data Layer
import { AuthRemoteDataSource, AuthRepositoryImpl } from "@auth/data";
// Domain Layer (UseCases)
import {
  type GetCurrentSessionUseCase,
  GetCurrentSessionUseCaseImpl,
  type GetOAuthAuthorizeUrlUseCase,
  GetOAuthAuthorizeUrlUseCaseImpl,
  type LoginWithOAuthUseCase,
  LoginWithOAuthUseCaseImpl,
  type LogoutUseCase,
  LogoutUseCaseImpl,
  type RefreshTokenUseCase,
  RefreshTokenUseCaseImpl,
  type SignUpWithSocialUseCase,
  SignUpWithSocialUseCaseImpl,
} from "@auth/domain";
import { AuthenticatedHttpClient } from "@core/infrastructure/http/authenticated-http-client";
import { FetchHttpClient } from "@core/infrastructure/http/fetch-http-client";
import { ServerTokenProvider } from "@core/infrastructure/http/server-token-provider";
import { ServerSessionManager } from "@core/infrastructure/storage/server-session-manager";
// Infrastructure Layer
import { RefreshTokenService } from "../infrastructure/services/refresh-token.service";

class AuthServerContainer {
  private sessionManager: ServerSessionManager;
  private refreshTokenService: RefreshTokenService;
  private loginWithOAuthUseCase: LoginWithOAuthUseCase;
  private logoutUseCase: LogoutUseCase;
  private refreshTokenUseCase: RefreshTokenUseCase;
  private signUpWithSocialUseCase: SignUpWithSocialUseCase;
  private getCurrentSessionUseCase: GetCurrentSessionUseCase;
  private getOAuthAuthorizeUrlUseCase: GetOAuthAuthorizeUrlUseCase;

  constructor(baseUrl?: string) {
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
    this.refreshTokenService = new RefreshTokenService(sessionManager, apiUrl);

    const httpClient = new AuthenticatedHttpClient(
      baseClient,
      tokenProvider,
      undefined,
      this.refreshTokenService,
    );

    // Data Layer
    const authDataSource = new AuthRemoteDataSource(httpClient);
    const authRepository = new AuthRepositoryImpl(authDataSource);

    // Domain Layer (UseCases)
    this.loginWithOAuthUseCase = new LoginWithOAuthUseCaseImpl(
      authRepository,
      sessionManager,
    );

    this.logoutUseCase = new LogoutUseCaseImpl(authRepository, sessionManager);

    this.refreshTokenUseCase = new RefreshTokenUseCaseImpl(
      authRepository,
      sessionManager,
    );

    this.signUpWithSocialUseCase = new SignUpWithSocialUseCaseImpl(
      authRepository,
    );

    this.getCurrentSessionUseCase = new GetCurrentSessionUseCaseImpl(
      sessionManager,
    );

    this.getOAuthAuthorizeUrlUseCase = new GetOAuthAuthorizeUrlUseCaseImpl(
      authRepository,
    );
  }

  getLoginWithOAuth(): LoginWithOAuthUseCase {
    return this.loginWithOAuthUseCase;
  }

  getLogout(): LogoutUseCase {
    return this.logoutUseCase;
  }

  getRefreshToken(): RefreshTokenUseCase {
    return this.refreshTokenUseCase;
  }

  getSignUpWithSocial(): SignUpWithSocialUseCase {
    return this.signUpWithSocialUseCase;
  }

  getCurrentSession(): GetCurrentSessionUseCase {
    return this.getCurrentSessionUseCase;
  }

  getOAuthAuthorizeUrl(): GetOAuthAuthorizeUrlUseCase {
    return this.getOAuthAuthorizeUrlUseCase;
  }

  getSessionManager(): ServerSessionManager {
    return this.sessionManager;
  }

  getRefreshTokenService(): RefreshTokenService {
    return this.refreshTokenService;
  }
}

export function createAuthServerContainer(
  baseUrl?: string,
): AuthServerContainer {
  // Edge Runtime에서 명시적으로 baseUrl 전달 가능
  return new AuthServerContainer(baseUrl);
}
