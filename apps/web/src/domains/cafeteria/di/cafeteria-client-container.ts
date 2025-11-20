/**
 * Cafeteria Client DI Container
 */

// Data Layer
import {
  CafeteriaRemoteDataSourceImpl,
  CafeteriaRepositoryImpl,
  CafeteriaReviewRemoteDataSourceMockImpl,
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
// Infrastructure Layer
import { AuthenticatedHttpClient } from "@core/infrastructure/http/authenticated-http-client";
import { ClientTokenProvider } from "@core/infrastructure/http/client-token-provider";
import { FetchHttpClient } from "@core/infrastructure/http/fetch-http-client";
import type { HttpClient } from "@core/infrastructure/http/http-client.interface";
import { ClientSessionManager } from "@core/infrastructure/storage/client-session-manager";

export interface CafeteriaClientContainer {
  // Cafeteria UseCase Getters
  getGetCafeteriasWithMenu(): GetCafeteriasWithMenuUseCase;
  getGetCafeteriaById(): GetCafeteriaByIdUseCase;
  getGetCafeteriaMenuByDate(): GetCafeteriaMenuByDateUseCase;
  getGetCafeteriaMenuTimeline(): GetCafeteriaMenuTimelineUseCase;
  getGetCafeteriaMenuAvailability(): GetCafeteriaMenuAvailabilityUseCase;
  getRegisterCafeteria(): RegisterCafeteriaUseCase;
  getRegisterCafeteriaMenu(): RegisterCafeteriaMenuUseCase;
  // Review UseCase Getters
  getCreateReview(): CreateReviewUseCase;
  getGetReviewComments(): GetReviewCommentsUseCase;
  getCreateReviewComment(): CreateReviewCommentUseCase;
  getCreateReviewCommentReply(): CreateReviewCommentReplyUseCase;
}

class CafeteriaClientContainerImpl implements CafeteriaClientContainer {
  private _sessionManager?: ClientSessionManager;
  private _tokenProvider?: ClientTokenProvider;
  private _baseClient?: FetchHttpClient;
  private _httpClient?: HttpClient;

  private _cafeteriaDataSource?: CafeteriaRemoteDataSourceImpl;
  private _cafeteriaRepository?: CafeteriaRepositoryImpl;
  private _reviewDataSource?: CafeteriaReviewRemoteDataSourceMockImpl;
  private _reviewRepository?: CafeteriaReviewRepositoryImpl;

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

  private getHttpClient(): HttpClient {
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

  private getCafeteriaDataSource(): CafeteriaRemoteDataSourceImpl {
    if (!this._cafeteriaDataSource) {
      this._cafeteriaDataSource = new CafeteriaRemoteDataSourceImpl(
        this.getHttpClient(),
      );
    }
    return this._cafeteriaDataSource;
  }

  private getCafeteriaRepository(): CafeteriaRepositoryImpl {
    if (!this._cafeteriaRepository) {
      this._cafeteriaRepository = new CafeteriaRepositoryImpl(
        this.getCafeteriaDataSource(),
      );
    }
    return this._cafeteriaRepository;
  }

  private getReviewDataSource(): CafeteriaReviewRemoteDataSourceMockImpl {
    if (!this._reviewDataSource) {
      this._reviewDataSource = new CafeteriaReviewRemoteDataSourceMockImpl();
    }
    return this._reviewDataSource;
  }

  private getReviewRepository(): CafeteriaReviewRepositoryImpl {
    if (!this._reviewRepository) {
      this._reviewRepository = new CafeteriaReviewRepositoryImpl(
        this.getReviewDataSource(),
      );
    }
    return this._reviewRepository;
  }

  getGetCafeteriasWithMenu(): GetCafeteriasWithMenuUseCase {
    return new GetCafeteriasWithMenuUseCaseImpl(this.getCafeteriaRepository());
  }

  getGetCafeteriaById(): GetCafeteriaByIdUseCase {
    return new GetCafeteriaByIdUseCaseImpl(this.getCafeteriaRepository());
  }

  getGetCafeteriaMenuByDate(): GetCafeteriaMenuByDateUseCase {
    return new GetCafeteriaMenuByDateUseCaseImpl(this.getCafeteriaRepository());
  }

  getGetCafeteriaMenuTimeline(): GetCafeteriaMenuTimelineUseCase {
    return new GetCafeteriaMenuTimelineUseCaseImpl(
      this.getCafeteriaRepository(),
    );
  }

  getGetCafeteriaMenuAvailability(): GetCafeteriaMenuAvailabilityUseCase {
    return new GetCafeteriaMenuAvailabilityUseCaseImpl(
      this.getCafeteriaRepository(),
    );
  }

  getRegisterCafeteria(): RegisterCafeteriaUseCase {
    return new RegisterCafeteriaUseCaseImpl(this.getCafeteriaRepository());
  }

  getRegisterCafeteriaMenu(): RegisterCafeteriaMenuUseCase {
    return new RegisterCafeteriaMenuUseCaseImpl(this.getCafeteriaRepository());
  }

  // Review UseCase Getters (Public - 매번 새로 생성)
  getCreateReview(): CreateReviewUseCase {
    return new CreateReviewUseCaseImpl(this.getReviewRepository());
  }

  getGetReviewComments(): GetReviewCommentsUseCase {
    return new GetReviewCommentsUseCaseImpl(this.getReviewRepository());
  }

  getCreateReviewComment(): CreateReviewCommentUseCase {
    return new CreateReviewCommentUseCaseImpl(this.getReviewRepository());
  }

  getCreateReviewCommentReply(): CreateReviewCommentReplyUseCase {
    return new CreateReviewCommentReplyUseCaseImpl(this.getReviewRepository());
  }
}

/**
 * Client Container Factory (Singleton)
 */
let clientContainerInstance: CafeteriaClientContainer | null = null;

export function getCafeteriaClientContainer(): CafeteriaClientContainer {
  if (!clientContainerInstance) {
    clientContainerInstance = new CafeteriaClientContainerImpl();
  }
  return clientContainerInstance;
}
