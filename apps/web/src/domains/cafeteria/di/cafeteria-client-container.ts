/**
 * Cafeteria Client Container
 *
 * Client-side only DI Container
 * - Uses ClientSessionManager and ClientTokenProvider
 * - Singleton instance
 */

// Data Layer
import {
  CafeteriaRemoteDataSource,
  CafeteriaRepositoryImpl,
  CafeteriaReviewRemoteDataSource,
  CafeteriaReviewRepositoryImpl,
} from "@cafeteria/data";
// Domain Layer (UseCases)
import {
  CreateReview,
  CreateReviewComment,
  CreateReviewCommentReply,
  GetCafeteriaById,
  GetCafeteriaMenuAvailability,
  GetCafeteriaMenuByDate,
  GetCafeteriasWithMenu,
  GetReviewComments,
  RegisterCafeteria,
  RegisterCafeteriaMenu,
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
  private getCafeteriasWithMenuUseCase: GetCafeteriasWithMenu;
  private getCafeteriaByIdUseCase: GetCafeteriaById;
  private getCafeteriaMenuByDateUseCase: GetCafeteriaMenuByDate;
  private getCafeteriaMenuAvailabilityUseCase: GetCafeteriaMenuAvailability;
  private registerCafeteriaUseCase: RegisterCafeteria;
  private registerCafeteriaMenuUseCase: RegisterCafeteriaMenu;

  // Review UseCases
  private createReviewUseCase: CreateReview;
  private getReviewCommentsUseCase: GetReviewComments;
  private createReviewCommentUseCase: CreateReviewComment;
  private createReviewCommentReplyUseCase: CreateReviewCommentReply;

  constructor(baseUrl: string = process.env.NEXT_PUBLIC_API_URL || "") {
    // Infrastructure Layer
    const sessionManager = new ClientSessionManager();
    const tokenProvider = new ClientTokenProvider(sessionManager);
    const baseClient = new FetchHttpClient({ baseUrl });
    const httpClient = new AuthenticatedHttpClient(
      baseClient,
      tokenProvider,
      sessionManager, // Client-side: provide session manager for localStorage sync
      undefined, // Client-side: BFF 사용 (RefreshTokenService 불필요)
    );

    // Data Layer
    const cafeteriaDataSource = new CafeteriaRemoteDataSource(httpClient);
    const reviewDataSource = new CafeteriaReviewRemoteDataSource(httpClient);
    const cafeteriaRepository = new CafeteriaRepositoryImpl(
      cafeteriaDataSource,
    );
    const reviewRepository = new CafeteriaReviewRepositoryImpl(
      reviewDataSource,
    );

    // Domain Layer (Cafeteria UseCases)
    this.getCafeteriasWithMenuUseCase = new GetCafeteriasWithMenu(
      cafeteriaRepository,
    );
    this.getCafeteriaByIdUseCase = new GetCafeteriaById(cafeteriaRepository);
    this.getCafeteriaMenuByDateUseCase = new GetCafeteriaMenuByDate(
      cafeteriaRepository,
    );
    this.getCafeteriaMenuAvailabilityUseCase = new GetCafeteriaMenuAvailability(
      cafeteriaRepository,
    );
    this.registerCafeteriaUseCase = new RegisterCafeteria(cafeteriaRepository);
    this.registerCafeteriaMenuUseCase = new RegisterCafeteriaMenu(
      cafeteriaRepository,
    );

    // Domain Layer (Review UseCases)
    this.createReviewUseCase = new CreateReview(reviewRepository);
    this.getReviewCommentsUseCase = new GetReviewComments(reviewRepository);
    this.createReviewCommentUseCase = new CreateReviewComment(reviewRepository);
    this.createReviewCommentReplyUseCase = new CreateReviewCommentReply(
      reviewRepository,
    );
  }

  // Cafeteria UseCase Getters
  getGetCafeteriasWithMenu(): GetCafeteriasWithMenu {
    return this.getCafeteriasWithMenuUseCase;
  }

  getGetCafeteriaById(): GetCafeteriaById {
    return this.getCafeteriaByIdUseCase;
  }

  getGetCafeteriaMenuByDate(): GetCafeteriaMenuByDate {
    return this.getCafeteriaMenuByDateUseCase;
  }

  getGetCafeteriaMenuAvailability(): GetCafeteriaMenuAvailability {
    return this.getCafeteriaMenuAvailabilityUseCase;
  }

  getRegisterCafeteria(): RegisterCafeteria {
    return this.registerCafeteriaUseCase;
  }

  getRegisterCafeteriaMenu(): RegisterCafeteriaMenu {
    return this.registerCafeteriaMenuUseCase;
  }

  // Review UseCase Getters
  getCreateReview(): CreateReview {
    return this.createReviewUseCase;
  }

  getGetReviewComments(): GetReviewComments {
    return this.getReviewCommentsUseCase;
  }

  getCreateReviewComment(): CreateReviewComment {
    return this.createReviewCommentUseCase;
  }

  getCreateReviewCommentReply(): CreateReviewCommentReply {
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
