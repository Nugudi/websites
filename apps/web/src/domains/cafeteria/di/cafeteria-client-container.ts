/**
 * Cafeteria Client Container
 *
 * Client-side only DI Container
 * - Uses ClientSessionManager and ClientTokenProvider
 * - Singleton instance
 */

// Data Layer
import {
  CafeteriaRepositoryStub,
  CafeteriaReviewRemoteDataSource,
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
import { AuthenticatedHttpClient } from "@/src/shared/infrastructure/http/authenticated-http-client";
import { ClientTokenProvider } from "@/src/shared/infrastructure/http/client-token-provider";
import { FetchHttpClient } from "@/src/shared/infrastructure/http/fetch-http-client";
import { ClientSessionManager } from "@/src/shared/infrastructure/storage/client-session-manager";

/**
 * Cafeteria Client Container
 */
class CafeteriaClientContainer {
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
    const sessionManager = new ClientSessionManager();
    const tokenProvider = new ClientTokenProvider(sessionManager);
    const baseClient = new FetchHttpClient({ baseUrl });
    const httpClient = new AuthenticatedHttpClient(
      baseClient,
      tokenProvider,
      sessionManager,
      undefined,
    );

    // Data Layer - Use Stub for Mock Data
    const cafeteriaRepository = new CafeteriaRepositoryStub();
    const reviewDataSource = new CafeteriaReviewRemoteDataSource(httpClient);
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
 * Client Container Factory (Singleton)
 */
let clientContainerInstance: CafeteriaClientContainer | null = null;

export function getCafeteriaClientContainer(): CafeteriaClientContainer {
  if (!clientContainerInstance) {
    clientContainerInstance = new CafeteriaClientContainer();
  }
  return clientContainerInstance;
}
