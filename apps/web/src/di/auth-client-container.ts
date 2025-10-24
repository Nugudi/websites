import { AuthRepositoryImpl } from "@/src/domains/auth/repositories/auth-repository";
import { AuthServiceImpl } from "@/src/domains/auth/services/auth-service";
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

  private _authService?: AuthServiceImpl;
  private _userService?: UserServiceImpl;
  private _authenticatedHttpClient?: AuthenticatedHttpClient;

  private constructor() {}

  static getInstance(): AuthClientContainer {
    if (!AuthClientContainer.instance) {
      AuthClientContainer.instance = new AuthClientContainer();
    }
    return AuthClientContainer.instance;
  }

  private getAuthenticatedHttpClient(): AuthenticatedHttpClient {
    if (!this._authenticatedHttpClient) {
      const sessionManager = new ClientSessionManager();
      const tokenProvider = new ClientTokenProvider(sessionManager);
      const baseClient = new FetchHttpClient({
        baseUrl: process.env.NEXT_PUBLIC_API_URL || "",
      });

      this._authenticatedHttpClient = new AuthenticatedHttpClient(
        baseClient,
        tokenProvider,
      );
    }

    return this._authenticatedHttpClient;
  }

  getAuthService(): AuthServiceImpl {
    if (!this._authService) {
      const authenticatedClient = this.getAuthenticatedHttpClient();
      const sessionManager = new ClientSessionManager();
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

  reset(): void {
    this._authService = undefined;
    this._userService = undefined;
  }
}

export const authClientContainer = AuthClientContainer.getInstance();
