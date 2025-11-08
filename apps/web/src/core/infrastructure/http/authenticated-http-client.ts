import type { RefreshTokenService } from "@/src/domains/auth/infrastructure/services/refresh-token.service";
import type { SessionManager } from "../storage/session-manager";
import { HttpError } from "./fetch-http-client";
import type {
  HttpClient,
  HttpResponse,
  RequestOptions,
} from "./http-client.interface";
import type { TokenProvider } from "./token-provider.interface";

/**
 * 인증된 HttpClient (Decorator 패턴 + Interceptor 패턴)
 *
 * 책임:
 * 1. 모든 요청에 자동으로 Authorization 헤더 추가
 * 2. 401 에러 감지 시 자동 Refresh Token 시도 (Response Interceptor)
 * 3. Refresh 성공 시 원래 요청 자동 재시도
 *
 * TokenProvider를 통해 환경에 맞는 토큰 획득 방식을 추상화합니다.
 *
 * 토큰 갱신 전략 (환경별):
 * - Server-side (Middleware, Server Component): RefreshTokenService 사용 (Spring API 직접 호출)
 * - Client-side (Browser): BFF 호출 (/api/auth/refresh) + localStorage 동기화
 */
export class AuthenticatedHttpClient implements HttpClient {
  private isRefreshing = false;
  private refreshPromise: Promise<{
    success: boolean;
    accessToken?: string;
    refreshToken?: string;
  }> | null = null;

  constructor(
    private readonly baseClient: HttpClient,
    private readonly tokenProvider: TokenProvider,
    private readonly sessionManager?: SessionManager,
    private readonly refreshTokenProvider?: RefreshTokenService,
  ) {}

  async get<T = unknown>(
    url: string,
    options?: RequestOptions,
  ): Promise<HttpResponse<T>> {
    return this.executeWithRetry(async () => {
      const authenticatedOptions = await this.injectToken(options);
      return this.baseClient.get<T>(url, authenticatedOptions);
    });
  }

  async post<T = unknown>(
    url: string,
    body?: unknown,
    options?: RequestOptions,
  ): Promise<HttpResponse<T>> {
    return this.executeWithRetry(async () => {
      const authenticatedOptions = await this.injectToken(options);
      return this.baseClient.post<T>(url, body, authenticatedOptions);
    });
  }

  async put<T = unknown>(
    url: string,
    body?: unknown,
    options?: RequestOptions,
  ): Promise<HttpResponse<T>> {
    return this.executeWithRetry(async () => {
      const authenticatedOptions = await this.injectToken(options);
      return this.baseClient.put<T>(url, body, authenticatedOptions);
    });
  }

  async patch<T = unknown>(
    url: string,
    body?: unknown,
    options?: RequestOptions,
  ): Promise<HttpResponse<T>> {
    return this.executeWithRetry(async () => {
      const authenticatedOptions = await this.injectToken(options);
      return this.baseClient.patch<T>(url, body, authenticatedOptions);
    });
  }

  async delete<T = unknown>(
    url: string,
    options?: RequestOptions,
  ): Promise<HttpResponse<T>> {
    return this.executeWithRetry(async () => {
      const authenticatedOptions = await this.injectToken(options);
      return this.baseClient.delete<T>(url, authenticatedOptions);
    });
  }

  /**
   * Response Interceptor: 401 에러 감지 시 자동 Refresh Token 시도
   *
   * Issue #2 해결: BFF 응답에서 받은 새 토큰을 명시적으로 사용
   * (캐시된 Cookie 문제 회피)
   *
   * @param requestFn - 실행할 HTTP 요청 함수
   * @returns HTTP 응답 또는 에러
   */
  private async executeWithRetry<T>(
    requestFn: () => Promise<HttpResponse<T>>,
  ): Promise<HttpResponse<T>> {
    try {
      return await requestFn();
    } catch (error) {
      if (!(error instanceof HttpError) || error.status !== 401) {
        throw error;
      }

      const refreshResult = await this.refreshAccessToken();

      if (!refreshResult.success) {
        if (typeof window !== "undefined") {
          window.location.href = "/auth/login";
        }
        throw error;
      }

      return await requestFn();
    }
  }

  /**
   * Refresh Token 호출 (BFF 경유)
   *
   * 중복 호출 방지: 동시 다발적 401 에러 발생 시 한 번만 Refresh
   *
   * @returns Refresh 결과 (성공 여부 및 새 토큰)
   */
  private async refreshAccessToken(): Promise<{
    success: boolean;
    accessToken?: string;
    refreshToken?: string;
  }> {
    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise;
    }

    this.isRefreshing = true;
    this.refreshPromise = this.performRefresh();

    try {
      const refreshResult = await this.refreshPromise;
      return refreshResult;
    } finally {
      this.isRefreshing = false;
      this.refreshPromise = null;
    }
  }

  /**
   * 실제 Refresh Token 수행
   *
   * 환경별 처리:
   * - Server-side: RefreshTokenService 사용 (Spring API 직접 호출)
   * - Client-side: BFF 호출 (/api/auth/refresh) + localStorage 동기화
   *
   * @returns Refresh 결과 (성공 여부 및 새 토큰)
   */
  private async performRefresh(): Promise<{
    success: boolean;
    accessToken?: string;
    refreshToken?: string;
  }> {
    try {
      const isClientSide = typeof window !== "undefined";

      if (!isClientSide && this.refreshTokenProvider) {
        return await this.refreshTokenProvider.refresh();
      }

      const response = await fetch("/api/auth/refresh", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        return { success: false };
      }

      const refreshResponseData = await response.json();

      if (
        isClientSide &&
        refreshResponseData.success === true &&
        refreshResponseData.data &&
        this.sessionManager
      ) {
        const { accessToken, refreshToken, userId } = refreshResponseData.data;
        if (accessToken && refreshToken && userId) {
          await this.sessionManager.saveSession({
            accessToken,
            refreshToken,
            userId,
          });

          return {
            success: true,
            accessToken,
            refreshToken,
          };
        }
      }

      return { success: refreshResponseData.success === true };
    } catch (error) {
      console.error("Token refresh failed:", error);
      return { success: false };
    }
  }

  /**
   * Request Interceptor: 요청 전에 Authorization 헤더 주입
   *
   * @param options - 원본 요청 옵션
   * @returns Authorization 헤더가 추가된 요청 옵션
   */
  private async injectToken(options?: RequestOptions): Promise<RequestOptions> {
    const token = await this.tokenProvider.getToken();

    if (!token) {
      return options ?? {};
    }

    return {
      ...options,
      headers: {
        ...options?.headers,
        Authorization: `Bearer ${token}`,
      },
    };
  }
}
