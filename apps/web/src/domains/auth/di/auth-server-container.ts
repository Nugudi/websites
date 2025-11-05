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

/**
 * Auth Server Container
 */
class AuthServerContainer {
  private loginWithOAuthUseCase: LoginWithOAuth;
  private logoutUseCase: Logout;
  private refreshTokenUseCase: RefreshToken;
  private signUpWithSocialUseCase: SignUpWithSocial;
  private getCurrentSessionUseCase: GetCurrentSession;
  private getOAuthAuthorizeUrlUseCase: GetOAuthAuthorizeUrl;

  constructor(baseUrl: string = process.env.NEXT_PUBLIC_API_URL || "") {
    // Infrastructure Layer
    const sessionManager = new ServerSessionManager();
    const tokenProvider = new ServerTokenProvider(sessionManager);
    const baseClient = new FetchHttpClient({ baseUrl });
    const httpClient = new AuthenticatedHttpClient(
      baseClient,
      tokenProvider,
      undefined, // Server-side: no session manager for client sync
      undefined, // RefreshTokenService can be added if needed
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
}

/**
 * Server Container Factory (Per-Request)
 */
export function createAuthServerContainer(): AuthServerContainer {
  return new AuthServerContainer();
}
