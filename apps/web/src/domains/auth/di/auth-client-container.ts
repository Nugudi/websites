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
  type CheckNicknameAvailabilityUseCase,
  CheckNicknameAvailabilityUseCaseImpl,
  type GetCurrentSessionUseCase,
  GetCurrentSessionUseCaseImpl,
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
import { ClientTokenProvider } from "@core/infrastructure/http/client-token-provider";
import { FetchHttpClient } from "@core/infrastructure/http/fetch-http-client";
import { ClientSessionManager } from "@core/infrastructure/storage/client-session-manager";

/**
 * Auth Client Container
 */
class AuthClientContainer {
  private loginWithOAuthUseCase: LoginWithOAuthUseCase;
  private logoutUseCase: LogoutUseCase;
  private refreshTokenUseCase: RefreshTokenUseCase;
  private signUpWithSocialUseCase: SignUpWithSocialUseCase;
  private getCurrentSessionUseCase: GetCurrentSessionUseCase;
  private checkNicknameAvailabilityUseCase: CheckNicknameAvailabilityUseCase;

  constructor(baseUrl: string = process.env.NEXT_PUBLIC_API_URL || "") {
    // Infrastructure Layer
    const sessionManager = new ClientSessionManager();
    const tokenProvider = new ClientTokenProvider(sessionManager);
    const baseClient = new FetchHttpClient({ baseUrl });
    const httpClient = new AuthenticatedHttpClient(
      baseClient,
      tokenProvider,
      sessionManager, // Client-side: provide session manager for localStorage sync
      undefined, // Client-side: BFF 사용 (RefreshTokenService 불필요)
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

    this.checkNicknameAvailabilityUseCase =
      new CheckNicknameAvailabilityUseCaseImpl(authRepository);
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

  getCheckNicknameAvailability(): CheckNicknameAvailabilityUseCase {
    return this.checkNicknameAvailabilityUseCase;
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
