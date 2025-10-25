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
