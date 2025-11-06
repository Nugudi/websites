/**
 * User Domain Client DI Container
 *
 * Dependency injection container for CLIENT-SIDE components
 * - Singleton instance (shared across client components)
 * - Use in Client Components/Sections for data fetching
 * - Wires: HttpClient → DataSource → Repository → UseCases
 *
 * NEVER use this in Server Components/Pages (use createUserServerContainer instead)
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
import { AuthenticatedHttpClient } from "@/src/shared/infrastructure/http/authenticated-http-client";
import { ClientTokenProvider } from "@/src/shared/infrastructure/http/client-token-provider";
import { FetchHttpClient } from "@/src/shared/infrastructure/http/fetch-http-client";
import { ClientSessionManager } from "@/src/shared/infrastructure/storage/client-session-manager";

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

/**
 * User Client Container Factory (Lazy-initialized Singleton)
 *
 * IMPORTANT: Singleton for client-side use only
 * DO NOT use in Server Components/Pages
 *
 * Benefits of Lazy Initialization:
 * - Only creates instance when first accessed (better for tree-shaking)
 * - Easier to test (can reset instance between tests)
 * - Explicit dependency tracking
 */
let clientContainerInstance: UserClientContainer | null = null;

export function getUserClientContainer(): UserClientContainer {
  if (!clientContainerInstance) {
    clientContainerInstance = new UserClientContainerImpl();
  }
  return clientContainerInstance;
}
