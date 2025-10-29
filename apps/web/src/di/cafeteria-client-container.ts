/**
 * Cafeteria Client Container (Singleton)
 *
 * Client-side에서 사용되는 Singleton DI Container
 * - 브라우저 환경에서 실행
 * - Singleton 패턴으로 동일한 인스턴스 재사용
 * - AuthenticatedHttpClient를 통한 자동 토큰 주입
 *
 * Usage:
 * import { cafeteriaClientContainer } from "@/src/di/cafeteria-client-container";
 * const service = cafeteriaClientContainer.getCafeteriaService();
 */

import {
  CafeteriaRepositoryImpl,
  CafeteriaReviewRepositoryImpl,
} from "@/src/domains/cafeteria/repositories";
import { CafeteriaRepositoryStub } from "@/src/domains/cafeteria/repositories/cafeteria-repository.stub";
import { CafeteriaReviewRepositoryStub } from "@/src/domains/cafeteria/repositories/cafeteria-review-repository.stub";
import {
  CafeteriaReviewServiceImpl,
  CafeteriaServiceImpl,
} from "@/src/domains/cafeteria/services";
import {
  AuthenticatedHttpClient,
  ClientTokenProvider,
  FetchHttpClient,
} from "@/src/shared/infrastructure/http";
import { ClientSessionManager } from "@/src/shared/infrastructure/storage/client-session-manager";

class CafeteriaClientContainer {
  private static instance: CafeteriaClientContainer;

  private _cafeteriaService?: CafeteriaServiceImpl;
  private _reviewService?: CafeteriaReviewServiceImpl;
  private _authenticatedHttpClient?: AuthenticatedHttpClient;
  private _sessionManager?: ClientSessionManager;

  private constructor() {}

  static getInstance(): CafeteriaClientContainer {
    if (!CafeteriaClientContainer.instance) {
      CafeteriaClientContainer.instance = new CafeteriaClientContainer();
    }
    return CafeteriaClientContainer.instance;
  }

  /**
   * SessionManager Singleton
   *
   * Client Container는 Singleton이므로 SessionManager도 Singleton
   */
  private getSessionManager(): ClientSessionManager {
    if (!this._sessionManager) {
      this._sessionManager = new ClientSessionManager();
    }

    return this._sessionManager;
  }

  /**
   * AuthenticatedHttpClient 획득 (Client-side)
   *
   * Client-side에서는 BFF를 통한 토큰 갱신 사용
   */
  private getAuthenticatedHttpClient(): AuthenticatedHttpClient {
    if (!this._authenticatedHttpClient) {
      const sessionManager = this.getSessionManager();
      const tokenProvider = new ClientTokenProvider(sessionManager);
      const baseClient = new FetchHttpClient({
        baseUrl: process.env.NEXT_PUBLIC_API_URL || "",
      });

      this._authenticatedHttpClient = new AuthenticatedHttpClient(
        baseClient,
        tokenProvider,
        sessionManager, // Client-side: localStorage 동기화
        undefined, // Client-side: BFF 사용, RefreshTokenService 불필요
      );
    }

    return this._authenticatedHttpClient;
  }

  /**
   * CafeteriaService 획득
   */
  getCafeteriaService(): CafeteriaServiceImpl {
    if (!this._cafeteriaService) {
      const useMock = process.env.NEXT_PUBLIC_USE_MOCK === "true";

      const cafeteriaRepository = useMock
        ? new CafeteriaRepositoryStub()
        : new CafeteriaRepositoryImpl(this.getAuthenticatedHttpClient());

      this._cafeteriaService = new CafeteriaServiceImpl(cafeteriaRepository);
    }

    return this._cafeteriaService;
  }

  /**
   * CafeteriaReviewService 획득
   */
  getReviewService(): CafeteriaReviewServiceImpl {
    if (!this._reviewService) {
      const useMock = process.env.NEXT_PUBLIC_USE_MOCK === "true";

      const reviewRepository = useMock
        ? new CafeteriaReviewRepositoryStub()
        : new CafeteriaReviewRepositoryImpl(this.getAuthenticatedHttpClient());

      this._reviewService = new CafeteriaReviewServiceImpl(reviewRepository);
    }

    return this._reviewService;
  }

  /**
   * 컨테이너 리셋 (테스트용)
   */
  reset(): void {
    this._cafeteriaService = undefined;
    this._reviewService = undefined;
    this._authenticatedHttpClient = undefined;
  }
}

export const cafeteriaClientContainer = CafeteriaClientContainer.getInstance();
