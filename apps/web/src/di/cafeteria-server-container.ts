/**
 * Cafeteria Server Container (Per-Request)
 *
 * Server-side에서 사용되는 DI Container
 * - SSR/SSG 환경에서 실행
 * - 매 요청마다 새로운 인스턴스 생성 (stateless)
 * - AuthenticatedHttpClient를 통한 자동 토큰 주입
 *
 * Usage:
 * import { createCafeteriaServerContainer } from "@/src/di/cafeteria-server-container";
 * const container = createCafeteriaServerContainer();
 * const service = container.getCafeteriaService();
 */

import { RefreshTokenService } from "@/src/domains/auth/services";
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
  FetchHttpClient,
  ServerTokenProvider,
} from "@/src/shared/infrastructure/http";
import { ServerSessionManager } from "@/src/shared/infrastructure/storage/server-session-manager";

class CafeteriaServerContainer {
  private _cafeteriaService?: CafeteriaServiceImpl;
  private _reviewService?: CafeteriaReviewServiceImpl;
  private _authenticatedHttpClient?: AuthenticatedHttpClient;
  private _sessionManager?: ServerSessionManager;
  private _refreshTokenService?: RefreshTokenService;

  /**
   * SessionManager 획득 (Server-side)
   */
  getSessionManager(): ServerSessionManager {
    if (!this._sessionManager) {
      this._sessionManager = new ServerSessionManager();
    }

    return this._sessionManager;
  }

  /**
   * RefreshTokenService 획득
   *
   * SSR Prefetch 시 사용
   */
  getRefreshTokenService(): RefreshTokenService {
    if (!this._refreshTokenService) {
      const sessionManager = this.getSessionManager();
      const springApiUrl = process.env.NEXT_PUBLIC_API_URL || "";

      this._refreshTokenService = new RefreshTokenService(
        sessionManager,
        springApiUrl,
      );
    }

    return this._refreshTokenService;
  }

  /**
   * AuthenticatedHttpClient 획득 (Server-side)
   *
   * Server-side에서는 RefreshTokenService를 주입하여
   * SSR Prefetch 시 자동 토큰 갱신 처리
   */
  private getAuthenticatedHttpClient(): AuthenticatedHttpClient {
    if (!this._authenticatedHttpClient) {
      const sessionManager = this.getSessionManager();
      const tokenProvider = new ServerTokenProvider(sessionManager);
      const refreshTokenService = this.getRefreshTokenService();
      const baseClient = new FetchHttpClient({
        baseUrl: process.env.NEXT_PUBLIC_API_URL || "",
      });

      this._authenticatedHttpClient = new AuthenticatedHttpClient(
        baseClient,
        tokenProvider,
        undefined, // Server-side: SessionManager 불필요 (Cookie 기반)
        refreshTokenService, // Server-side: RefreshTokenService 주입
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
}

/**
 * Cafeteria Server Container Factory
 *
 * 매 요청마다 새로운 Container 인스턴스 생성
 */
export function createCafeteriaServerContainer(): CafeteriaServerContainer {
  return new CafeteriaServerContainer();
}
