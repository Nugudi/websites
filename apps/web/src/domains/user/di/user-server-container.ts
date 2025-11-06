/**
 * User Domain Server DI Container
 *
 * Dependency injection container for SERVER-SIDE components
 * - Creates NEW instances each time (for SSR safety)
 * - Use in Server Components/Pages for data prefetching
 * - Wires: HttpClient → DataSource → Repository → UseCases
 *
 * NEVER use this in Client Components (use userClientContainer instead)
 */

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
import { RefreshTokenService } from "@/src/domains/auth/infrastructure/services/refresh-token.service";
import { AuthenticatedHttpClient } from "@/src/shared/infrastructure/http/authenticated-http-client";
import { FetchHttpClient } from "@/src/shared/infrastructure/http/fetch-http-client";
import { ServerTokenProvider } from "@/src/shared/infrastructure/http/server-token-provider";
import { ServerSessionManager } from "@/src/shared/infrastructure/storage/server-session-manager";

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

/**
 * Create User Server Container
 *
 * IMPORTANT: Always creates NEW instance for SSR safety
 *
 * @returns UserServerContainer
 */
export function createUserServerContainer(): UserServerContainer {
  return new UserServerContainerImpl();
}
