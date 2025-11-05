/**
 * Auth Client Container
 *
 * Client-side only DI Container
 * - Uses ClientSessionManager and ClientTokenProvider
 * - Singleton instance
 */

// Data Layer
import { AuthRemoteDataSource, AuthRepositoryImpl } from "@auth/data";
// Domain Layer (UseCases)
import {
  GetCurrentSession,
  LoginWithOAuth,
  Logout,
  RefreshToken,
  SignUpWithSocial,
} from "@auth/domain";
import { AuthenticatedHttpClient } from "@/src/shared/infrastructure/http/authenticated-http-client";
import { ClientTokenProvider } from "@/src/shared/infrastructure/http/client-token-provider";
import { FetchHttpClient } from "@/src/shared/infrastructure/http/fetch-http-client";
import { ClientSessionManager } from "@/src/shared/infrastructure/storage/client-session-manager";

/**
 * Auth Client Container
 */
class AuthClientContainer {
  private loginWithOAuthUseCase: LoginWithOAuth;
  private logoutUseCase: Logout;
  private refreshTokenUseCase: RefreshToken;
  private signUpWithSocialUseCase: SignUpWithSocial;
  private getCurrentSessionUseCase: GetCurrentSession;

  constructor(baseUrl: string = process.env.NEXT_PUBLIC_API_URL || "") {
    // Infrastructure Layer
    const sessionManager = new ClientSessionManager();
    const tokenProvider = new ClientTokenProvider(sessionManager);
    const baseClient = new FetchHttpClient({ baseUrl });
    const httpClient = new AuthenticatedHttpClient(
      baseClient,
      tokenProvider,
      sessionManager, // Client-side: provide session manager for localStorage sync
      undefined, // RefreshTokenService not needed (uses BFF)
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
}

/**
 * Client Container Factory (Singleton)
 */
let clientContainerInstance: AuthClientContainer | null = null;

export function getAuthClientContainer(): AuthClientContainer {
  if (!clientContainerInstance) {
    clientContainerInstance = new AuthClientContainer();
  }
  return clientContainerInstance;
}
