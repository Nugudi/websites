/**
 * User Client DI Container
 */

import { AuthenticatedHttpClient } from "@core/infrastructure/http/authenticated-http-client";
import { ClientTokenProvider } from "@core/infrastructure/http/client-token-provider";
import { FetchHttpClient } from "@core/infrastructure/http/fetch-http-client";
import { ClientSessionManager } from "@core/infrastructure/storage/client-session-manager";
import {
  type UserRemoteDataSource,
  UserRemoteDataSourceImpl,
  UserRepositoryImpl,
} from "@user/data";
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
  private readonly dataSource: UserRemoteDataSource;
  private readonly repository: UserRepository;

  constructor() {
    // Infrastructure Layer
    const sessionManager = new ClientSessionManager();
    const tokenProvider = new ClientTokenProvider(sessionManager);
    const baseClient = new FetchHttpClient({
      baseUrl: process.env.NEXT_PUBLIC_API_URL || "",
    });
    const httpClient = new AuthenticatedHttpClient(
      baseClient,
      tokenProvider,
      sessionManager,
      undefined,
    );

    // Data Layer
    this.dataSource = new UserRemoteDataSourceImpl(httpClient);
    this.repository = new UserRepositoryImpl(this.dataSource);
  }

  getGetMyProfile(): GetMyProfileUseCase {
    return new GetMyProfileUseCaseImpl(this.repository);
  }

  getCheckNicknameAvailability(): CheckNicknameAvailabilityUseCase {
    return new CheckNicknameAvailabilityUseCaseImpl(this.repository);
  }
}

let clientContainerInstance: UserClientContainer | null = null;

export function getUserClientContainer(): UserClientContainer {
  if (!clientContainerInstance) {
    clientContainerInstance = new UserClientContainerImpl();
  }
  return clientContainerInstance;
}
