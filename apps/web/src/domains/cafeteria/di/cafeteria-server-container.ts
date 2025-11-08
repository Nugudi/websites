/**
 * Cafeteria Server DI Container
 */

import "server-only";

// Data Layer
import {
  CafeteriaRepositoryStub,
  CafeteriaReviewMockDataSource,
  CafeteriaReviewRepositoryImpl,
} from "@cafeteria/data";
// Domain Layer (UseCases)
import {
  type CreateReviewCommentReplyUseCase,
  CreateReviewCommentReplyUseCaseImpl,
  type CreateReviewCommentUseCase,
  CreateReviewCommentUseCaseImpl,
  type CreateReviewUseCase,
  CreateReviewUseCaseImpl,
  type GetCafeteriaByIdUseCase,
  GetCafeteriaByIdUseCaseImpl,
  type GetCafeteriaMenuAvailabilityUseCase,
  GetCafeteriaMenuAvailabilityUseCaseImpl,
  type GetCafeteriaMenuByDateUseCase,
  GetCafeteriaMenuByDateUseCaseImpl,
  type GetCafeteriaMenuTimelineUseCase,
  GetCafeteriaMenuTimelineUseCaseImpl,
  type GetCafeteriasWithMenuUseCase,
  GetCafeteriasWithMenuUseCaseImpl,
  type GetReviewCommentsUseCase,
  GetReviewCommentsUseCaseImpl,
  type RegisterCafeteriaMenuUseCase,
  RegisterCafeteriaMenuUseCaseImpl,
  type RegisterCafeteriaUseCase,
  RegisterCafeteriaUseCaseImpl,
} from "@cafeteria/domain";
import { AuthenticatedHttpClient } from "@core/infrastructure/http/authenticated-http-client";
import { FetchHttpClient } from "@core/infrastructure/http/fetch-http-client";
import { ServerTokenProvider } from "@core/infrastructure/http/server-token-provider";
import { ServerSessionManager } from "@core/infrastructure/storage/server-session-manager";
import { RefreshTokenService } from "@/src/domains/auth/infrastructure/services/refresh-token.service";

class CafeteriaServerContainer {
  // Cafeteria UseCases
  private getCafeteriasWithMenuUseCase: GetCafeteriasWithMenuUseCase;
  private getCafeteriaByIdUseCase: GetCafeteriaByIdUseCase;
  private getCafeteriaMenuByDateUseCase: GetCafeteriaMenuByDateUseCase;
  private getCafeteriaMenuTimelineUseCase: GetCafeteriaMenuTimelineUseCase;
  private getCafeteriaMenuAvailabilityUseCase: GetCafeteriaMenuAvailabilityUseCase;
  private registerCafeteriaUseCase: RegisterCafeteriaUseCase;
  private registerCafeteriaMenuUseCase: RegisterCafeteriaMenuUseCase;

  // Review UseCases
  private createReviewUseCase: CreateReviewUseCase;
  private getReviewCommentsUseCase: GetReviewCommentsUseCase;
  private createReviewCommentUseCase: CreateReviewCommentUseCase;
  private createReviewCommentReplyUseCase: CreateReviewCommentReplyUseCase;

  constructor(baseUrl: string = process.env.NEXT_PUBLIC_API_URL || "") {
    // Infrastructure Layer
    const sessionManager = new ServerSessionManager();
    const tokenProvider = new ServerTokenProvider(sessionManager);
    const baseClient = new FetchHttpClient({ baseUrl });

    // RefreshTokenService 생성 (Spring API 직접 호출)
    const refreshTokenService = new RefreshTokenService(
      sessionManager,
      baseUrl,
    );

    const _httpClient = new AuthenticatedHttpClient(
      baseClient,
      tokenProvider,
      undefined, // Server-side: no session manager for client sync
      refreshTokenService, // Server-side: RefreshTokenService 주입
    );

    // Data Layer - Use Stub for Mock Data
    const cafeteriaRepository = new CafeteriaRepositoryStub();
    const reviewDataSource = new CafeteriaReviewMockDataSource();
    const reviewRepository = new CafeteriaReviewRepositoryImpl(
      reviewDataSource,
    );

    // Domain Layer (Cafeteria UseCases)
    this.getCafeteriasWithMenuUseCase = new GetCafeteriasWithMenuUseCaseImpl(
      cafeteriaRepository,
    );
    this.getCafeteriaByIdUseCase = new GetCafeteriaByIdUseCaseImpl(
      cafeteriaRepository,
    );
    this.getCafeteriaMenuByDateUseCase = new GetCafeteriaMenuByDateUseCaseImpl(
      cafeteriaRepository,
    );
    this.getCafeteriaMenuTimelineUseCase =
      new GetCafeteriaMenuTimelineUseCaseImpl(cafeteriaRepository);
    this.getCafeteriaMenuAvailabilityUseCase =
      new GetCafeteriaMenuAvailabilityUseCaseImpl(cafeteriaRepository);
    this.registerCafeteriaUseCase = new RegisterCafeteriaUseCaseImpl(
      cafeteriaRepository,
    );
    this.registerCafeteriaMenuUseCase = new RegisterCafeteriaMenuUseCaseImpl(
      cafeteriaRepository,
    );

    // Domain Layer (Review UseCases)
    this.createReviewUseCase = new CreateReviewUseCaseImpl(reviewRepository);
    this.getReviewCommentsUseCase = new GetReviewCommentsUseCaseImpl(
      reviewRepository,
    );
    this.createReviewCommentUseCase = new CreateReviewCommentUseCaseImpl(
      reviewRepository,
    );
    this.createReviewCommentReplyUseCase =
      new CreateReviewCommentReplyUseCaseImpl(reviewRepository);
  }

  // Cafeteria UseCase Getters
  getGetCafeteriasWithMenu(): GetCafeteriasWithMenuUseCase {
    return this.getCafeteriasWithMenuUseCase;
  }

  getGetCafeteriaById(): GetCafeteriaByIdUseCase {
    return this.getCafeteriaByIdUseCase;
  }

  getGetCafeteriaMenuByDate(): GetCafeteriaMenuByDateUseCase {
    return this.getCafeteriaMenuByDateUseCase;
  }

  getGetCafeteriaMenuTimeline(): GetCafeteriaMenuTimelineUseCase {
    return this.getCafeteriaMenuTimelineUseCase;
  }

  getGetCafeteriaMenuAvailability(): GetCafeteriaMenuAvailabilityUseCase {
    return this.getCafeteriaMenuAvailabilityUseCase;
  }

  getRegisterCafeteria(): RegisterCafeteriaUseCase {
    return this.registerCafeteriaUseCase;
  }

  getRegisterCafeteriaMenu(): RegisterCafeteriaMenuUseCase {
    return this.registerCafeteriaMenuUseCase;
  }

  // Review UseCase Getters
  getCreateReview(): CreateReviewUseCase {
    return this.createReviewUseCase;
  }

  getGetReviewComments(): GetReviewCommentsUseCase {
    return this.getReviewCommentsUseCase;
  }

  getCreateReviewComment(): CreateReviewCommentUseCase {
    return this.createReviewCommentUseCase;
  }

  getCreateReviewCommentReply(): CreateReviewCommentReplyUseCase {
    return this.createReviewCommentReplyUseCase;
  }
}

/**
 * Server Container Factory (Per-Request)
 */
export function createCafeteriaServerContainer(): CafeteriaServerContainer {
  return new CafeteriaServerContainer();
}
