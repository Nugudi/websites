/**
 * User Client DI Container
 */

import { AuthenticatedHttpClient } from "@core/infrastructure/http/authenticated-http-client";
import { ClientTokenProvider } from "@core/infrastructure/http/client-token-provider";
import { FetchHttpClient } from "@core/infrastructure/http/fetch-http-client";
import { ClientSessionManager } from "@core/infrastructure/storage/client-session-manager";
import type { UserRemoteDataSource } from "@user/data";
import { UserRemoteDataSourceImpl, UserRepositoryImpl } from "@user/data";
import type { UserRepository } from "@user/domain";
import {
  type CheckNicknameAvailabilityUseCase,
  CheckNicknameAvailabilityUseCaseImpl,
  type GetMyProfileUseCase,
  GetMyProfileUseCaseImpl,
} from "@user/domain";

export interface UserClientContainer {
  getGetMyProfile(): GetMyProfileUseCase;
  getCheckNicknameAvailability(): CheckNicknameAvailabilityUseCase;
}

class UserClientContainerImpl implements UserClientContainer {
  // Infrastructure Layer (Lazy)
  private _sessionManager?: ClientSessionManager;
  private _tokenProvider?: ClientTokenProvider;
  private _baseClient?: FetchHttpClient;
  private _httpClient?: AuthenticatedHttpClient;

  // Data Layer (Lazy)
  private _dataSource?: UserRemoteDataSource;
  private _repository?: UserRepository;

  // Domain Layer (UseCases - Lazy)
  private _getMyProfileUseCase?: GetMyProfileUseCase;
  private _checkNicknameAvailabilityUseCase?: CheckNicknameAvailabilityUseCase;

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
      this._baseClient = new FetchHttpClient({
        baseUrl: process.env.NEXT_PUBLIC_API_URL || "",
      });
    }
    return this._baseClient;
  }

  private getHttpClient(): AuthenticatedHttpClient {
    if (!this._httpClient) {
      this._httpClient = new AuthenticatedHttpClient(
        this.getBaseClient(),
        this.getTokenProvider(),
        this.getSessionManager(),
        undefined,
      );
    }
    return this._httpClient;
  }

  // Data Layer Getters (Private - Lazy Initialization)
  private getDataSource(): UserRemoteDataSource {
    if (!this._dataSource) {
      this._dataSource = new UserRemoteDataSourceImpl(this.getHttpClient());
    }
    return this._dataSource;
  }

  private getRepository(): UserRepository {
    if (!this._repository) {
      this._repository = new UserRepositoryImpl(this.getDataSource());
    }
    return this._repository;
  }

  // Domain Layer UseCase Getters (Public - Lazy Initialization)
  getGetMyProfile(): GetMyProfileUseCase {
    if (!this._getMyProfileUseCase) {
      this._getMyProfileUseCase = new GetMyProfileUseCaseImpl(
        this.getRepository(),
      );
    }
    return this._getMyProfileUseCase;
  }

  getCheckNicknameAvailability(): CheckNicknameAvailabilityUseCase {
    if (!this._checkNicknameAvailabilityUseCase) {
      this._checkNicknameAvailabilityUseCase =
        new CheckNicknameAvailabilityUseCaseImpl(this.getRepository());
    }
    return this._checkNicknameAvailabilityUseCase;
  }
}

let clientContainerInstance: UserClientContainer | null = null;

export function getUserClientContainer(): UserClientContainer {
  if (!clientContainerInstance) {
    clientContainerInstance = new UserClientContainerImpl();
  }
  return clientContainerInstance;
}
