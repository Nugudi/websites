import type {
  HttpClient,
  HttpClientConfig,
  HttpResponse,
  RequestOptions,
} from "./http-client.interface";

export class FetchHttpClient implements HttpClient {
  private readonly baseUrl: string;
  private readonly timeout: number;
  private readonly defaultHeaders: Record<string, string>;

  constructor(config: HttpClientConfig) {
    this.baseUrl = config.baseUrl;
    this.timeout = config.timeout ?? 30000;
    this.defaultHeaders = config.headers ?? {};
  }

  async get<T = unknown>(
    url: string,
    options?: RequestOptions,
  ): Promise<HttpResponse<T>> {
    return this.request<T>(url, {
      method: "GET",
      ...options,
    });
  }

  async post<T = unknown>(
    url: string,
    body?: unknown,
    options?: RequestOptions,
  ): Promise<HttpResponse<T>> {
    return this.request<T>(url, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    });
  }

  async put<T = unknown>(
    url: string,
    body?: unknown,
    options?: RequestOptions,
  ): Promise<HttpResponse<T>> {
    return this.request<T>(url, {
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    });
  }

  async patch<T = unknown>(
    url: string,
    body?: unknown,
    options?: RequestOptions,
  ): Promise<HttpResponse<T>> {
    return this.request<T>(url, {
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    });
  }

  async delete<T = unknown>(
    url: string,
    options?: RequestOptions,
  ): Promise<HttpResponse<T>> {
    return this.request<T>(url, {
      method: "DELETE",
      ...options,
    });
  }

  private async request<T>(
    url: string,
    options: RequestInit & RequestOptions,
  ): Promise<HttpResponse<T>> {
    const fullUrl = this.buildUrl(url, options.params);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const mergedHeaders = this.mergeHeaders(options.headers);

      const response = await fetch(fullUrl, {
        ...options,
        headers: mergedHeaders,
        signal: options.signal ?? controller.signal,
      });

      clearTimeout(timeoutId);

      const contentType = response.headers.get("content-type");
      const isJson = contentType?.includes("application/json");

      let data: T;
      if (isJson) {
        data = await response.json();
      } else {
        data = (await response.text()) as T;
      }

      if (!response.ok) {
        throw new HttpError(
          `HTTP Error: ${response.status} ${response.statusText}`,
          response.status,
          data,
        );
      }

      return {
        data,
        status: response.status,
        headers: response.headers,
      };
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof HttpError) {
        throw error;
      }

      if (error instanceof Error) {
        if (error.name === "AbortError") {
          throw new HttpError("Request timeout", 408, null);
        }
        throw new HttpError(error.message, 0, null);
      }

      throw new HttpError("Unknown error", 0, null);
    }
  }

  private buildUrl(
    url: string,
    params?: Record<string, string | number | boolean>,
  ): string {
    let fullUrl: string;

    if (url.startsWith("http://") || url.startsWith("https://")) {
      fullUrl = url;
    } else {
      const base = this.baseUrl.endsWith("/")
        ? this.baseUrl.slice(0, -1)
        : this.baseUrl;
      const path = url.startsWith("/") ? url : `/${url}`;
      fullUrl = `${base}${path}`;
    }

    if (params && Object.keys(params).length > 0) {
      const searchParams = new URLSearchParams();
      for (const [key, value] of Object.entries(params)) {
        searchParams.append(key, String(value));
      }
      fullUrl = `${fullUrl}?${searchParams.toString()}`;
    }

    return fullUrl;
  }

  private mergeHeaders(
    requestHeaders?: Record<string, string>,
  ): Record<string, string> {
    return {
      "Content-Type": "application/json",
      ...this.defaultHeaders,
      ...requestHeaders,
    };
  }
}

export class HttpError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly data: unknown,
  ) {
    super(message);
    this.name = "HttpError";
  }
}
