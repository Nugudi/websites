/**
 * Cafeteria Server Container
 *
 * Server-side only DI Container
 * - Uses ServerSessionManager and ServerTokenProvider
 * - Creates new instance per request
 */

import "server-only";

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
import { RefreshTokenService } from "@/src/domains/auth/infrastructure/services/refresh-token.service";
import { AuthenticatedHttpClient } from "@/src/shared/infrastructure/http/authenticated-http-client";
import { FetchHttpClient } from "@/src/shared/infrastructure/http/fetch-http-client";
import { ServerTokenProvider } from "@/src/shared/infrastructure/http/server-token-provider";
import { ServerSessionManager } from "@/src/shared/infrastructure/storage/server-session-manager";

/**
 * Cafeteria Server Container
 */
class CafeteriaServerContainer {
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
    const sessionManager = new ServerSessionManager();
    const tokenProvider = new ServerTokenProvider(sessionManager);
    const baseClient = new FetchHttpClient({ baseUrl });

    // RefreshTokenService 생성 (Spring API 직접 호출)
    const refreshTokenService = new RefreshTokenService(
      sessionManager,
      baseUrl,
    );

    const httpClient = new AuthenticatedHttpClient(
      baseClient,
      tokenProvider,
      undefined, // Server-side: no session manager for client sync
      refreshTokenService, // Server-side: RefreshTokenService 주입
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
 * Server Container Factory (Per-Request)
 */
export function createCafeteriaServerContainer(): CafeteriaServerContainer {
  return new CafeteriaServerContainer();
}
