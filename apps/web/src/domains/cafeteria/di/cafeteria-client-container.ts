/**
 * Cafeteria Client DI Container
 */

// Data Layer
import {
  CafeteriaRemoteDataSourceMockImpl,
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
  // Data Layer (Lazy)
  private _cafeteriaDataSource?: CafeteriaRemoteDataSourceMockImpl;
  private _cafeteriaRepository?: CafeteriaRepositoryImpl;
  private _reviewDataSource?: CafeteriaReviewRemoteDataSourceMockImpl;
  private _reviewRepository?: CafeteriaReviewRepositoryImpl;

  // Cafeteria UseCases (Lazy)
  private _getCafeteriasWithMenuUseCase?: GetCafeteriasWithMenuUseCase;
  private _getCafeteriaByIdUseCase?: GetCafeteriaByIdUseCase;
  private _getCafeteriaMenuByDateUseCase?: GetCafeteriaMenuByDateUseCase;
  private _getCafeteriaMenuTimelineUseCase?: GetCafeteriaMenuTimelineUseCase;
  private _getCafeteriaMenuAvailabilityUseCase?: GetCafeteriaMenuAvailabilityUseCase;
  private _registerCafeteriaUseCase?: RegisterCafeteriaUseCase;
  private _registerCafeteriaMenuUseCase?: RegisterCafeteriaMenuUseCase;

  // Review UseCases (Lazy)
  private _createReviewUseCase?: CreateReviewUseCase;
  private _getReviewCommentsUseCase?: GetReviewCommentsUseCase;
  private _createReviewCommentUseCase?: CreateReviewCommentUseCase;
  private _createReviewCommentReplyUseCase?: CreateReviewCommentReplyUseCase;

  // Data Layer Getters (Private - Lazy Initialization)
  private getCafeteriaDataSource(): CafeteriaRemoteDataSourceMockImpl {
    if (!this._cafeteriaDataSource) {
      this._cafeteriaDataSource = new CafeteriaRemoteDataSourceMockImpl();
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

  // Cafeteria UseCase Getters (Public - Lazy Initialization)
  getGetCafeteriasWithMenu(): GetCafeteriasWithMenuUseCase {
    if (!this._getCafeteriasWithMenuUseCase) {
      this._getCafeteriasWithMenuUseCase = new GetCafeteriasWithMenuUseCaseImpl(
        this.getCafeteriaRepository(),
      );
    }
    return this._getCafeteriasWithMenuUseCase;
  }

  getGetCafeteriaById(): GetCafeteriaByIdUseCase {
    if (!this._getCafeteriaByIdUseCase) {
      this._getCafeteriaByIdUseCase = new GetCafeteriaByIdUseCaseImpl(
        this.getCafeteriaRepository(),
      );
    }
    return this._getCafeteriaByIdUseCase;
  }

  getGetCafeteriaMenuByDate(): GetCafeteriaMenuByDateUseCase {
    if (!this._getCafeteriaMenuByDateUseCase) {
      this._getCafeteriaMenuByDateUseCase =
        new GetCafeteriaMenuByDateUseCaseImpl(this.getCafeteriaRepository());
    }
    return this._getCafeteriaMenuByDateUseCase;
  }

  getGetCafeteriaMenuTimeline(): GetCafeteriaMenuTimelineUseCase {
    if (!this._getCafeteriaMenuTimelineUseCase) {
      this._getCafeteriaMenuTimelineUseCase =
        new GetCafeteriaMenuTimelineUseCaseImpl(this.getCafeteriaRepository());
    }
    return this._getCafeteriaMenuTimelineUseCase;
  }

  getGetCafeteriaMenuAvailability(): GetCafeteriaMenuAvailabilityUseCase {
    if (!this._getCafeteriaMenuAvailabilityUseCase) {
      this._getCafeteriaMenuAvailabilityUseCase =
        new GetCafeteriaMenuAvailabilityUseCaseImpl(
          this.getCafeteriaRepository(),
        );
    }
    return this._getCafeteriaMenuAvailabilityUseCase;
  }

  getRegisterCafeteria(): RegisterCafeteriaUseCase {
    if (!this._registerCafeteriaUseCase) {
      this._registerCafeteriaUseCase = new RegisterCafeteriaUseCaseImpl(
        this.getCafeteriaRepository(),
      );
    }
    return this._registerCafeteriaUseCase;
  }

  getRegisterCafeteriaMenu(): RegisterCafeteriaMenuUseCase {
    if (!this._registerCafeteriaMenuUseCase) {
      this._registerCafeteriaMenuUseCase = new RegisterCafeteriaMenuUseCaseImpl(
        this.getCafeteriaRepository(),
      );
    }
    return this._registerCafeteriaMenuUseCase;
  }

  // Review UseCase Getters (Public - Lazy Initialization)
  getCreateReview(): CreateReviewUseCase {
    if (!this._createReviewUseCase) {
      this._createReviewUseCase = new CreateReviewUseCaseImpl(
        this.getReviewRepository(),
      );
    }
    return this._createReviewUseCase;
  }

  getGetReviewComments(): GetReviewCommentsUseCase {
    if (!this._getReviewCommentsUseCase) {
      this._getReviewCommentsUseCase = new GetReviewCommentsUseCaseImpl(
        this.getReviewRepository(),
      );
    }
    return this._getReviewCommentsUseCase;
  }

  getCreateReviewComment(): CreateReviewCommentUseCase {
    if (!this._createReviewCommentUseCase) {
      this._createReviewCommentUseCase = new CreateReviewCommentUseCaseImpl(
        this.getReviewRepository(),
      );
    }
    return this._createReviewCommentUseCase;
  }

  getCreateReviewCommentReply(): CreateReviewCommentReplyUseCase {
    if (!this._createReviewCommentReplyUseCase) {
      this._createReviewCommentReplyUseCase =
        new CreateReviewCommentReplyUseCaseImpl(this.getReviewRepository());
    }
    return this._createReviewCommentReplyUseCase;
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
