/**
 * HTTP 요청/응답 타입 정의
 */
export interface HttpResponse<T = unknown> {
  data: T;
  status: number;
  headers: Headers;
}

export interface HttpClientConfig {
  baseUrl: string;
  timeout?: number;
  headers?: Record<string, string>;
}

export interface RequestOptions {
  headers?: Record<string, string>;
  signal?: AbortSignal;
  cache?: RequestCache;
  params?: Record<string, string | number | boolean>;
}

/**
 * HttpClient 인터페이스
 *
 * 모든 HTTP 클라이언트 구현체가 따라야 하는 표준 인터페이스
 */
export interface HttpClient {
  get<T = unknown>(
    url: string,
    options?: RequestOptions,
  ): Promise<HttpResponse<T>>;

  post<T = unknown>(
    url: string,
    body?: unknown,
    options?: RequestOptions,
  ): Promise<HttpResponse<T>>;

  put<T = unknown>(
    url: string,
    body?: unknown,
    options?: RequestOptions,
  ): Promise<HttpResponse<T>>;

  patch<T = unknown>(
    url: string,
    body?: unknown,
    options?: RequestOptions,
  ): Promise<HttpResponse<T>>;

  delete<T = unknown>(
    url: string,
    options?: RequestOptions,
  ): Promise<HttpResponse<T>>;
}

/**
 * Interceptor 패턴을 위한 타입
 */
export interface RequestInterceptor {
  beforeRequest?: (
    url: string,
    options: RequestInit,
  ) => Promise<{ url: string; options: RequestInit }>;
}

export interface ResponseInterceptor {
  afterResponse?: <T>(response: HttpResponse<T>) => Promise<HttpResponse<T>>;
  onError?: (error: Error) => Promise<Error>;
}
