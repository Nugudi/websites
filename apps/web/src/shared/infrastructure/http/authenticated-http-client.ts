import type { RefreshTokenProvider } from "../auth/refresh-token-provider.interface";
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
 * RefreshTokenProvider (Optional):
 * - Server-side: RefreshTokenProvider 구현체 사용 (BFF 우회)
 * - Client-side: BFF 호출 (/api/auth/refresh)
 *
 * DIP (Dependency Inversion Principle):
 * - Infrastructure Layer가 Application Layer (RefreshTokenService)를 직접 의존하지 않음
 * - RefreshTokenProvider 인터페이스에 의존 (Infrastructure Layer 인터페이스)
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
    private readonly refreshTokenProvider?: RefreshTokenProvider,
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
   * Server-side Issue #2 해결:
   * - RefreshTokenProvider가 새 토큰 반환
   * - 재시도 시 새 토큰을 명시적으로 사용 (캐시된 Cookie 문제 회피)
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
      // 401 에러가 아니면 그대로 throw
      if (!(error instanceof HttpError) || error.status !== 401) {
        throw error;
      }

      // Refresh Token 시도
      const refreshResult = await this.refreshAccessToken();

      if (!refreshResult.success) {
        // Refresh 실패 → 로그인 페이지로 리다이렉트
        if (typeof window !== "undefined") {
          window.location.href = "/auth/login";
        }
        throw error;
      }

      // Refresh 성공 → 원래 요청 재시도
      // Server-side에서는 새 토큰이 Cookie에 저장되어 있음
      // Client-side에서는 localStorage에 저장되어 있음
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
    // 이미 갱신 중이면 기존 Promise 재사용
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
   * Server-side:
   * - RefreshTokenProvider 구현체 사용 (BFF 우회)
   * - fetch()는 Server-side에서 Cookie를 자동 전달하지 않으므로
   * - RefreshTokenProvider가 SessionManager를 통해 직접 토큰 조회
   *
   * Client-side:
   * - BFF 호출 (/api/auth/refresh)
   * - 브라우저가 자동으로 Cookie 전달
   * - BFF 응답의 새 토큰으로 localStorage 동기화
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

      // Server-side: RefreshTokenProvider 직접 사용
      if (!isClientSide && this.refreshTokenProvider) {
        return await this.refreshTokenProvider.refresh();
      }

      // Client-side: BFF 호출
      const response = await fetch("/api/auth/refresh", {
        method: "POST",
        credentials: "include", // 브라우저가 자동으로 Cookie 전달
      });

      if (!response.ok) {
        return { success: false };
      }

      const refreshResponseData = await response.json();

      // Client-side localStorage 동기화 (Issue #1 해결)
      if (
        isClientSide &&
        refreshResponseData.success === true &&
        refreshResponseData.data &&
        this.sessionManager
      ) {
        const { accessToken, refreshToken } = refreshResponseData.data;
        if (accessToken && refreshToken) {
          const currentSession = await this.sessionManager.getSession();
          await this.sessionManager.saveSession({
            accessToken,
            refreshToken,
            userId: currentSession?.userId,
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

    // 토큰이 없으면 원본 옵션 그대로 반환
    if (!token) {
      return options ?? {};
    }

    // Authorization 헤더 추가
    return {
      ...options,
      headers: {
        ...options?.headers,
        Authorization: `Bearer ${token}`,
      },
    };
  }
}
