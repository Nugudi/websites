import { AuthRepositoryImpl } from "@/src/domains/auth/repositories/auth-repository";
import { AuthServiceImpl } from "@/src/domains/auth/services/auth-service";
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

  private getAuthenticatedHttpClient(): AuthenticatedHttpClient {
    if (!this._authenticatedHttpClient) {
      const sessionManager = new ServerSessionManager();
      const tokenProvider = new ServerTokenProvider(sessionManager);
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
      const sessionManager = new ServerSessionManager();
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
}

export function createAuthServerContainer(): AuthServerContainer {
  return new AuthServerContainer();
}
