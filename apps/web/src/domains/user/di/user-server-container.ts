/**
 * User Server DI Container
 */

import { AuthenticatedHttpClient } from "@core/infrastructure/http/authenticated-http-client";
import { FetchHttpClient } from "@core/infrastructure/http/fetch-http-client";
import { ServerTokenProvider } from "@core/infrastructure/http/server-token-provider";
import { RefreshTokenService } from "@core/infrastructure/services/auth/refresh-token.service";
import { ServerSessionManager } from "@core/infrastructure/storage/server-session-manager";
import type { UserRemoteDataSource } from "@user/data";
import { UserRemoteDataSourceImpl, UserRepositoryImpl } from "@user/data";
import type { UserRepository } from "@user/domain";
import {
  type CheckNicknameAvailabilityUseCase,
  CheckNicknameAvailabilityUseCaseImpl,
  type GetMyProfileUseCase,
  GetMyProfileUseCaseImpl,
} from "@user/domain";

export interface UserServerContainer {
  getGetMyProfile(): GetMyProfileUseCase;
  getCheckNicknameAvailability(): CheckNicknameAvailabilityUseCase;
}

class UserServerContainerImpl implements UserServerContainer {
  private readonly dataSource: UserRemoteDataSource;
  private readonly repository: UserRepository;

  constructor() {
    // Infrastructure Layer
    const sessionManager = new ServerSessionManager();
    const tokenProvider = new ServerTokenProvider(sessionManager);
    const baseClient = new FetchHttpClient({
      baseUrl: process.env.NEXT_PUBLIC_API_URL || "",
    });
    const refreshTokenService = new RefreshTokenService(
      sessionManager,
      process.env.NEXT_PUBLIC_API_URL || "",
    );

    const httpClient = new AuthenticatedHttpClient(
      baseClient,
      tokenProvider,
      undefined,
      refreshTokenService,
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

export function createUserServerContainer(): UserServerContainer {
  return new UserServerContainerImpl();
}
