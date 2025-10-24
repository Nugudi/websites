import type {
  HttpClient,
  HttpResponse,
  RequestOptions,
} from "./http-client.interface";
import type { TokenProvider } from "./token-provider.interface";

/**
 * 인증된 HttpClient (Decorator 패턴 + Interceptor 패턴)
 *
 * 모든 요청에 자동으로 Authorization 헤더를 추가합니다.
 * TokenProvider를 통해 환경에 맞는 토큰 획득 방식을 추상화합니다.
 */
export class AuthenticatedHttpClient implements HttpClient {
  constructor(
    private readonly baseClient: HttpClient,
    private readonly tokenProvider: TokenProvider,
  ) {}

  async get<T = unknown>(
    url: string,
    options?: RequestOptions,
  ): Promise<HttpResponse<T>> {
    const authenticatedOptions = await this.injectToken(options);
    return this.baseClient.get<T>(url, authenticatedOptions);
  }

  async post<T = unknown>(
    url: string,
    body?: unknown,
    options?: RequestOptions,
  ): Promise<HttpResponse<T>> {
    const authenticatedOptions = await this.injectToken(options);
    return this.baseClient.post<T>(url, body, authenticatedOptions);
  }

  async put<T = unknown>(
    url: string,
    body?: unknown,
    options?: RequestOptions,
  ): Promise<HttpResponse<T>> {
    const authenticatedOptions = await this.injectToken(options);
    return this.baseClient.put<T>(url, body, authenticatedOptions);
  }

  async patch<T = unknown>(
    url: string,
    body?: unknown,
    options?: RequestOptions,
  ): Promise<HttpResponse<T>> {
    const authenticatedOptions = await this.injectToken(options);
    return this.baseClient.patch<T>(url, body, authenticatedOptions);
  }

  async delete<T = unknown>(
    url: string,
    options?: RequestOptions,
  ): Promise<HttpResponse<T>> {
    const authenticatedOptions = await this.injectToken(options);
    return this.baseClient.delete<T>(url, authenticatedOptions);
  }

  /**
   * Interceptor: 요청 전에 Authorization 헤더 주입
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
