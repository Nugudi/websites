---
description: "Infrastructure layer: HttpClient, SessionManager, TokenProvider, decorator patterns"
globs:
  - "src/core/infrastructure/**/*.ts"
alwaysApply: true
---

# Infrastructure Layer

> **Related Documents**: [repository-patterns.md](./repository-patterns.md), [di-server-containers.md](./di-server-containers.md), [di-client-containers.md](./di-client-containers.md)

## Overview

The Infrastructure layer provides shared technical capabilities that are used across all domains. This layer contains NO business logic and NO domain-specific code. It's purely technical infrastructure.

## Layer Structure

```
core/infrastructure/
├── http/                  # HTTP clients
│   ├── fetch-http-client.ts          # Base HTTP client
│   ├── authenticated-http-client.ts  # With authentication
│   ├── client-token-provider.ts      # Client-side token provider
│   └── server-token-provider.ts      # Server-side token provider
├── storage/               # Session management
│   ├── session-manager.ts            # Interface
│   ├── client-session-manager.ts     # Client implementation (localStorage)
│   ├── server-session-manager.ts     # Server implementation (cookies)
│   └── middleware-session-manager.ts # Middleware implementation
├── services/              # External services
│   └── auth/
│       └── refresh-token.service.ts
├── logging/               # Logging utilities
└── configs/               # Infrastructure configs
    ├── tanstack-query.config.ts
    └── pwa.config.ts
```

## HttpClient Abstraction

### Base HttpClient

```typescript
// ✅ CORRECT: Generic HTTP client interface
export interface HttpClientConfig {
  baseUrl: string;
  timeout?: number;
  headers?: Record<string, string>;
}

export interface RequestConfig {
  headers?: Record<string, string>;
  params?: Record<string, string>;
  timeout?: number;
}

export interface HttpResponse<T> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
}

export interface HttpClient {
  get<T>(url: string, config?: RequestConfig): Promise<HttpResponse<T>>;
  post<T>(
    url: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<HttpResponse<T>>;
  put<T>(
    url: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<HttpResponse<T>>;
  delete<T>(url: string, config?: RequestConfig): Promise<HttpResponse<T>>;
}
```

### FetchHttpClient Implementation

```typescript
// ✅ CORRECT: Fetch-based implementation
export class FetchHttpClient implements HttpClient {
  constructor(private config: HttpClientConfig) {}

  async get<T>(url: string, config?: RequestConfig): Promise<HttpResponse<T>> {
    const fullUrl = this.buildUrl(url, config?.params);
    const headers = this.mergeHeaders(config?.headers);

    const response = await fetch(fullUrl, {
      method: 'GET',
      headers,
      signal: this.getAbortSignal(config?.timeout),
    });

    return this.handleResponse<T>(response);
  }

  async post<T>(
    url: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<HttpResponse<T>> {
    const fullUrl = this.buildUrl(url);
    const headers = this.mergeHeaders(config?.headers);

    const response = await fetch(fullUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
      signal: this.getAbortSignal(config?.timeout),
    });

    return this.handleResponse<T>(response);
  }

  async put<T>(
    url: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<HttpResponse<T>> {
    const fullUrl = this.buildUrl(url);
    const headers = this.mergeHeaders(config?.headers);

    const response = await fetch(fullUrl, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
      signal: this.getAbortSignal(config?.timeout),
    });

    return this.handleResponse<T>(response);
  }

  async delete<T>(url: string, config?: RequestConfig): Promise<HttpResponse<T>> {
    const fullUrl = this.buildUrl(url, config?.params);
    const headers = this.mergeHeaders(config?.headers);

    const response = await fetch(fullUrl, {
      method: 'DELETE',
      headers,
      signal: this.getAbortSignal(config?.timeout),
    });

    return this.handleResponse<T>(response);
  }

  private buildUrl(path: string, params?: Record<string, string>): string {
    const url = new URL(path, this.config.baseUrl);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }
    return url.toString();
  }

  private mergeHeaders(
    requestHeaders?: Record<string, string>
  ): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      ...this.config.headers,
      ...requestHeaders,
    };
  }

  private getAbortSignal(timeout?: number): AbortSignal | undefined {
    if (!timeout) return undefined;
    const controller = new AbortController();
    setTimeout(() => controller.abort(), timeout);
    return controller.signal;
  }

  private async handleResponse<T>(response: Response): Promise<HttpResponse<T>> {
    const data = await response.json();

    if (!response.ok) {
      throw {
        data,
        status: response.status,
        statusText: response.statusText,
        headers: this.getHeaders(response),
      };
    }

    return {
      data,
      status: response.status,
      statusText: response.statusText,
      headers: this.getHeaders(response),
    };
  }

  private getHeaders(response: Response): Record<string, string> {
    const headers: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      headers[key] = value;
    });
    return headers;
  }
}
```

## Authenticated HttpClient (Decorator Pattern)

```typescript
// ✅ CORRECT: Decorator that adds authentication
export class AuthenticatedHttpClient implements HttpClient {
  constructor(
    private readonly baseClient: HttpClient,
    private readonly tokenProvider: TokenProvider,
    private readonly sessionManager: SessionManager | undefined,
    private readonly refreshTokenService: RefreshTokenService | undefined
  ) {}

  async get<T>(url: string, config?: RequestConfig): Promise<HttpResponse<T>> {
    return this.executeWithAuth(() => this.baseClient.get<T>(url, config));
  }

  async post<T>(
    url: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<HttpResponse<T>> {
    return this.executeWithAuth(() => this.baseClient.post<T>(url, data, config));
  }

  async put<T>(
    url: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<HttpResponse<T>> {
    return this.executeWithAuth(() => this.baseClient.put<T>(url, data, config));
  }

  async delete<T>(url: string, config?: RequestConfig): Promise<HttpResponse<T>> {
    return this.executeWithAuth(() => this.baseClient.delete<T>(url, config));
  }

  private async executeWithAuth<T>(
    operation: () => Promise<HttpResponse<T>>
  ): Promise<HttpResponse<T>> {
    // Add authentication header
    const token = await this.tokenProvider.getAccessToken();
    if (!token) {
      throw new Error('No access token available');
    }

    try {
      return await operation();
    } catch (error) {
      // Handle 401 and refresh token if possible
      if (this.isUnauthorized(error) && this.refreshTokenService) {
        await this.refreshTokenService.refreshToken();
        return operation(); // Retry with new token
      }
      throw error;
    }
  }

  private isUnauthorized(error: unknown): boolean {
    return (
      typeof error === 'object' &&
      error !== null &&
      'status' in error &&
      (error as { status: number }).status === 401
    );
  }
}
```

## TokenProvider Abstraction

### Interface

```typescript
export interface TokenProvider {
  getAccessToken(): Promise<string | null>;
  getRefreshToken(): Promise<string | null>;
}
```

### Client Implementation

```typescript
// ✅ CORRECT: Client-side token provider (uses SessionManager)
export class ClientTokenProvider implements TokenProvider {
  constructor(private readonly sessionManager: SessionManager) {}

  async getAccessToken(): Promise<string | null> {
    return this.sessionManager.getAccessToken();
  }

  async getRefreshToken(): Promise<string | null> {
    return this.sessionManager.getRefreshToken();
  }
}
```

### Server Implementation

```typescript
// ✅ CORRECT: Server-side token provider (uses SessionManager)
export class ServerTokenProvider implements TokenProvider {
  constructor(private readonly sessionManager: SessionManager) {}

  async getAccessToken(): Promise<string | null> {
    return this.sessionManager.getAccessToken();
  }

  async getRefreshToken(): Promise<string | null> {
    return this.sessionManager.getRefreshToken();
  }
}
```

## SessionManager Abstraction

### Interface

```typescript
export interface SessionData {
  accessToken: string;
  refreshToken: string;
  userId: string;
}

export interface SessionManager {
  saveSession(data: SessionData): Promise<void>;
  getSession(): Promise<SessionData | null>;
  clearSession(): Promise<void>;
  getDeviceId(): Promise<string>;
  getAccessToken(): Promise<string | null>;
  getRefreshToken(): Promise<string | null>;
  getUserId(): Promise<string | null>;
}
```

### Client Implementation (Browser)

```typescript
// ✅ CORRECT: Client-side session manager (uses localStorage)
export class ClientSessionManager implements SessionManager {
  private readonly SESSION_KEY = 'nugudi_session';
  private readonly DEVICE_ID_KEY = 'nugudi_device_id';

  async saveSession(data: SessionData): Promise<void> {
    if (typeof window === 'undefined') {
      throw new Error('ClientSessionManager can only be used in browser');
    }
    localStorage.setItem(this.SESSION_KEY, JSON.stringify(data));
  }

  async getSession(): Promise<SessionData | null> {
    if (typeof window === 'undefined') {
      return null;
    }
    const sessionStr = localStorage.getItem(this.SESSION_KEY);
    if (!sessionStr) return null;
    return JSON.parse(sessionStr);
  }

  async clearSession(): Promise<void> {
    if (typeof window === 'undefined') {
      throw new Error('ClientSessionManager can only be used in browser');
    }
    localStorage.removeItem(this.SESSION_KEY);
  }

  async getDeviceId(): Promise<string> {
    if (typeof window === 'undefined') {
      throw new Error('ClientSessionManager can only be used in browser');
    }

    let deviceId = localStorage.getItem(this.DEVICE_ID_KEY);
    if (!deviceId) {
      deviceId = this.generateDeviceId();
      localStorage.setItem(this.DEVICE_ID_KEY, deviceId);
    }
    return deviceId;
  }

  async getAccessToken(): Promise<string | null> {
    const session = await this.getSession();
    return session?.accessToken ?? null;
  }

  async getRefreshToken(): Promise<string | null> {
    const session = await this.getSession();
    return session?.refreshToken ?? null;
  }

  async getUserId(): Promise<string | null> {
    const session = await this.getSession();
    return session?.userId ?? null;
  }

  private generateDeviceId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
```

### Server Implementation (Cookies)

```typescript
// ✅ CORRECT: Server-side session manager (uses cookies)
import { cookies } from 'next/headers';

export class ServerSessionManager implements SessionManager {
  private readonly SESSION_COOKIE = 'nugudi_session';
  private readonly DEVICE_ID_COOKIE = 'nugudi_device_id';

  async saveSession(data: SessionData): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.set(this.SESSION_COOKIE, JSON.stringify(data), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
  }

  async getSession(): Promise<SessionData | null> {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(this.SESSION_COOKIE);
    if (!sessionCookie?.value) return null;
    return JSON.parse(sessionCookie.value);
  }

  async clearSession(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete(this.SESSION_COOKIE);
  }

  async getDeviceId(): Promise<string> {
    const cookieStore = await cookies();
    let deviceId = cookieStore.get(this.DEVICE_ID_COOKIE)?.value;

    if (!deviceId) {
      deviceId = this.generateDeviceId();
      cookieStore.set(this.DEVICE_ID_COOKIE, deviceId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 365, // 1 year
      });
    }

    return deviceId;
  }

  async getAccessToken(): Promise<string | null> {
    const session = await this.getSession();
    return session?.accessToken ?? null;
  }

  async getRefreshToken(): Promise<string | null> {
    const session = await this.getSession();
    return session?.refreshToken ?? null;
  }

  async getUserId(): Promise<string | null> {
    const session = await this.getSession();
    return session?.userId ?? null;
  }

  private generateDeviceId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
```

## Refresh Token Service

```typescript
// ✅ CORRECT: Token refresh service
export class RefreshTokenService {
  constructor(
    private readonly httpClient: HttpClient,
    private readonly sessionManager: SessionManager
  ) {}

  async refreshToken(): Promise<void> {
    const refreshToken = await this.sessionManager.getRefreshToken();

    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await this.httpClient.post<{
        accessToken: string;
        refreshToken: string;
        userId: string;
      }>('/auth/refresh', {
        refreshToken,
      });

      await this.sessionManager.saveSession({
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
        userId: response.data.userId,
      });
    } catch (error) {
      // If refresh fails, clear session
      await this.sessionManager.clearSession();
      throw error;
    }
  }
}
```

## Usage in DI Containers

### Server DI Container

```typescript
export function createUserServerContainer(
  sessionManager: SessionManager
): UserServerContainer {
  // 1. Create base HTTP client
  const baseClient = new FetchHttpClient({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || '',
  });

  // 2. Create token provider
  const tokenProvider = new ServerTokenProvider(sessionManager);

  // 3. Create refresh token service
  const refreshTokenService = new RefreshTokenService(baseClient, sessionManager);

  // 4. Create authenticated HTTP client
  const httpClient = new AuthenticatedHttpClient(
    baseClient,
    tokenProvider,
    undefined, // No session manager for server
    refreshTokenService
  );

  // 5. Use httpClient in DataSources, Repositories, UseCases...
  // ...
}
```

### Client DI Container

```typescript
class UserClientContainerImpl implements UserClientContainer {
  private _sessionManager?: ClientSessionManager;
  private _httpClient?: AuthenticatedHttpClient;

  private getSessionManager(): ClientSessionManager {
    if (!this._sessionManager) {
      this._sessionManager = new ClientSessionManager();
    }
    return this._sessionManager;
  }

  private getHttpClient(): AuthenticatedHttpClient {
    if (!this._httpClient) {
      const baseClient = new FetchHttpClient({
        baseUrl: process.env.NEXT_PUBLIC_API_URL || '',
      });
      const tokenProvider = new ClientTokenProvider(this.getSessionManager());

      this._httpClient = new AuthenticatedHttpClient(
        baseClient,
        tokenProvider,
        this.getSessionManager(), // Client-side: provide session manager
        undefined // Client-side: BFF handles refresh (no RefreshTokenService)
      );
    }
    return this._httpClient;
  }
}
```

## Best Practices

1. **Abstraction**: Define interfaces for all infrastructure services
2. **Dependency Injection**: Inject infrastructure dependencies, don't instantiate directly
3. **Environment Awareness**: Use different implementations for client/server
4. **Error Handling**: Handle infrastructure errors gracefully
5. **Testability**: Easy to mock for testing
6. **NO Business Logic**: Infrastructure layer contains NO domain logic

## Summary

Infrastructure layer provides:
- **HTTP Communication**: Generic HTTP clients with authentication
- **Session Management**: Cross-platform session storage (cookies/localStorage)
- **Token Management**: Automatic token refresh and authentication
- **Abstraction**: Clean interfaces for swapping implementations

These services are consumed by the Data layer and managed by DI Containers.
