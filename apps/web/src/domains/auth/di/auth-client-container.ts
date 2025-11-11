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

export interface AuthClientContainer {
  getLoginWithOAuth(): LoginWithOAuthUseCase;
  getLogout(): LogoutUseCase;
  getRefreshToken(): RefreshTokenUseCase;
  getSignUpWithSocial(): SignUpWithSocialUseCase;
  getCurrentSession(): GetCurrentSessionUseCase;
  getCheckNicknameAvailability(): CheckNicknameAvailabilityUseCase;
}

/**
 * Auth Client Container Implementation
 */
class AuthClientContainerImpl implements AuthClientContainer {
  private baseUrl: string;

  // Infrastructure Layer (Lazy)
  private _sessionManager?: ClientSessionManager;
  private _tokenProvider?: ClientTokenProvider;
  private _baseClient?: FetchHttpClient;
  private _httpClient?: AuthenticatedHttpClient;

  // Data Layer (Lazy)
  private _authDataSource?: AuthRemoteDataSource;
  private _authRepository?: AuthRepositoryImpl;

  // Domain Layer (UseCases - Lazy)
  private _loginWithOAuthUseCase?: LoginWithOAuthUseCase;
  private _logoutUseCase?: LogoutUseCase;
  private _refreshTokenUseCase?: RefreshTokenUseCase;
  private _signUpWithSocialUseCase?: SignUpWithSocialUseCase;
  private _getCurrentSessionUseCase?: GetCurrentSessionUseCase;
  private _checkNicknameAvailabilityUseCase?: CheckNicknameAvailabilityUseCase;

  constructor(baseUrl: string = process.env.NEXT_PUBLIC_API_URL || "") {
    this.baseUrl = baseUrl;
  }

  // Infrastructure Layer Getters (Private - Lazy Initialization)
  private getSessionManager(): ClientSessionManager {
    if (!this._sessionManager) {
      this._sessionManager = new ClientSessionManager();
    }
    return this._sessionManager;
  }

  private getTokenProvider(): ClientTokenProvider {
    if (!this._tokenProvider) {
      this._tokenProvider = new ClientTokenProvider(this.getSessionManager());
    }
    return this._tokenProvider;
  }

  private getBaseClient(): FetchHttpClient {
    if (!this._baseClient) {
      this._baseClient = new FetchHttpClient({ baseUrl: this.baseUrl });
    }
    return this._baseClient;
  }

  private getHttpClient(): AuthenticatedHttpClient {
    if (!this._httpClient) {
      this._httpClient = new AuthenticatedHttpClient(
        this.getBaseClient(),
        this.getTokenProvider(),
        this.getSessionManager(), // Client-side: provide session manager for localStorage sync
        undefined, // Client-side: BFF 사용 (RefreshTokenService 불필요)
      );
    }
    return this._httpClient;
  }

  // Data Layer Getters (Private - Lazy Initialization)
  private getDataSource(): AuthRemoteDataSource {
    if (!this._authDataSource) {
      this._authDataSource = new AuthRemoteDataSource(this.getHttpClient());
    }
    return this._authDataSource;
  }

  private getRepository(): AuthRepositoryImpl {
    if (!this._authRepository) {
      this._authRepository = new AuthRepositoryImpl(this.getDataSource());
    }
    return this._authRepository;
  }

  // Domain Layer UseCase Getters (Public - Lazy Initialization)
  getLoginWithOAuth(): LoginWithOAuthUseCase {
    if (!this._loginWithOAuthUseCase) {
      this._loginWithOAuthUseCase = new LoginWithOAuthUseCaseImpl(
        this.getRepository(),
        this.getSessionManager(),
      );
    }
    return this._loginWithOAuthUseCase;
  }

  getLogout(): LogoutUseCase {
    if (!this._logoutUseCase) {
      this._logoutUseCase = new LogoutUseCaseImpl(
        this.getRepository(),
        this.getSessionManager(),
      );
    }
    return this._logoutUseCase;
  }

  getRefreshToken(): RefreshTokenUseCase {
    if (!this._refreshTokenUseCase) {
      this._refreshTokenUseCase = new RefreshTokenUseCaseImpl(
        this.getRepository(),
        this.getSessionManager(),
      );
    }
    return this._refreshTokenUseCase;
  }

  getSignUpWithSocial(): SignUpWithSocialUseCase {
    if (!this._signUpWithSocialUseCase) {
      this._signUpWithSocialUseCase = new SignUpWithSocialUseCaseImpl(
        this.getRepository(),
      );
    }
    return this._signUpWithSocialUseCase;
  }

  getCurrentSession(): GetCurrentSessionUseCase {
    if (!this._getCurrentSessionUseCase) {
      this._getCurrentSessionUseCase = new GetCurrentSessionUseCaseImpl(
        this.getSessionManager(),
      );
    }
    return this._getCurrentSessionUseCase;
  }

  getCheckNicknameAvailability(): CheckNicknameAvailabilityUseCase {
    if (!this._checkNicknameAvailabilityUseCase) {
      this._checkNicknameAvailabilityUseCase =
        new CheckNicknameAvailabilityUseCaseImpl(this.getRepository());
    }
    return this._checkNicknameAvailabilityUseCase;
  }
}

/**
 * Client Container Factory (Singleton)
 */
let clientContainerInstance: AuthClientContainer | null = null;

export function getAuthClientContainer(): AuthClientContainer {
  if (!clientContainerInstance) {
    clientContainerInstance = new AuthClientContainerImpl();
  }
  return clientContainerInstance;
}
