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

import { AuthenticatedHttpClient } from "@/src/shared/infrastructure/http/authenticated-http-client";
import { ClientTokenProvider } from "@/src/shared/infrastructure/http/client-token-provider";
import { FetchHttpClient } from "@/src/shared/infrastructure/http/fetch-http-client";
import { ClientSessionManager } from "@/src/shared/infrastructure/storage/client-session-manager";
import {
  type UserRemoteDataSource,
  UserRemoteDataSourceImpl,
} from "../data/data-sources/user-remote-data-source";
import { UserRepositoryImpl } from "../data/repositories/user-repository.impl";
import type { UserRepository } from "../domain/repositories/user-repository.interface";
import {
  type CheckNicknameAvailabilityUseCase,
  CheckNicknameAvailabilityUseCaseImpl,
} from "../domain/usecases/check-nickname-availability.usecase";
import {
  type GetMyProfileUseCase,
  GetMyProfileUseCaseImpl,
} from "../domain/usecases/get-my-profile.usecase";

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
      sessionManager, // Client-side: localStorage 동기화를 위해 SessionManager 주입
      undefined, // Client-side: BFF 사용 (RefreshTokenService 불필요)
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
 * User Client Container Singleton
 *
 * IMPORTANT: Singleton for client-side use only
 * DO NOT use in Server Components/Pages
 */
export const userClientContainer: UserClientContainer =
  new UserClientContainerImpl();
