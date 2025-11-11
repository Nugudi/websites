---
description: "Server DI patterns, factory functions, stateless per-request instantiation for Server Components and API Routes"
globs:
  - "src/domains/**/di/*-server-container.ts"
  - "app/**/page.tsx"
  - "app/**/layout.tsx"
  - "app/api/**/route.ts"
alwaysApply: true
---

# Server DI Containers - Complete Guide

> **Target Audience**: Developers working with Server Components, API Routes, and Server Actions
> **Prerequisites**: Read [architecture.md](../architecture.md) first
> **Related Docs**: [di-client-patterns.md](./di-client-patterns.md), [usecase-patterns.md](./usecase-patterns.md)

## 📋 Table of Contents

1. [Why DI Containers?](#why-di-containers)
2. [Server Container Type](#server-container-type)
3. [When to Use](#when-to-use)
4. [Implementation Guide](#implementation-guide)
5. [Infrastructure Layer](#infrastructure-layer)
6. [Per-Domain Container Location](#per-domain-container-location)
7. [MUST / MUST NOT Rules](#must--must-not-rules)
8. [Common Patterns](#common-patterns)
9. [Testing Server Containers](#testing-server-containers)

## Why DI Containers?

DI Containers manage dependencies and their lifecycles, providing:

- **Testability**: Easy to mock dependencies in tests
- **Flexibility**: Easy to swap implementations (e.g., mock HttpClient)
- **Maintainability**: Centralized dependency configuration
- **Type Safety**: Full TypeScript support with compile-time checks
- **Separation of Concerns**: Components don't know how to create their dependencies

### Before DI Container (❌ Anti-Pattern)

```typescript
// ❌ Components tightly coupled to implementations
const Page = async () => {
  const httpClient = new FetchHttpClient({ baseUrl: '...' });
  const tokenProvider = new ServerTokenProvider();
  const authenticatedClient = new AuthenticatedHttpClient(
    httpClient,
    tokenProvider
  );
  const dataSource = new AuthRemoteDataSource(authenticatedClient);
  const repository = new AuthRepositoryImpl(dataSource);
  const useCase = new LoginWithOAuthUseCase(repository);

  // Too much construction logic!
};
```

### After DI Container (✅ Clean)

```typescript
// ✅ Single entry point, clean code
const Page = async () => {
  const container = createAuthServerContainer();
  const useCase = container.getLoginWithOAuth();

  // Just use it!
};
```

## Server Container Type

### Overview

**File Naming**: `{domain}-server-container.ts`
**Location**: `apps/web/src/domains/{domain}/di/`
**Factory Function**: `createXXXServerContainer()`

### When to Use

- ✅ Server Components (Next.js Pages)
- ✅ API Routes (`app/api/**/route.ts`)
- ✅ Server Actions (`'use server'` functions)
- ✅ Middleware
- ✅ Any server-side code

### Characteristics

| Feature            | Implementation                   | Reason                                  |
| ------------------ | -------------------------------- | --------------------------------------- |
| **Lifecycle**      | Creates new instance per request | Prevents state leakage between requests |
| **Pattern**        | Factory function                 | Always returns fresh instance           |
| **Initialization** | Eager (constructor)              | All dependencies created upfront        |
| **SessionManager** | `ServerSessionManager` (cookies) | Secure, httpOnly cookies for auth       |
| **TokenProvider**  | `ServerTokenProvider` (cookies)  | Reads tokens from secure cookies        |
| **HttpClient**     | Server-side fetch with cookies   | Automatic cookie forwarding to API      |

### Core Principles

#### 1. Stateless Per-Request

Server Containers are created NEW for each request. They do NOT persist across requests.

```typescript
// ✅ CORRECT: Factory function creates NEW instance
export function createUserServerContainer(): UserServerContainer {
  return {
    getGetUserProfile: () => new GetUserProfileUseCase(repository),
    // ... other getters
  };
}

// ❌ WRONG: Singleton pattern (DON'T USE on server)
let serverContainerInstance: UserServerContainer | null = null;

export function getUserServerContainer(): UserServerContainer {
  if (!serverContainerInstance) {
    serverContainerInstance = {
      /* ... */
    }; // WRONG! Shared across requests
  }
  return serverContainerInstance;
}
```

#### 2. Eager Initialization

Server Containers initialize ALL dependencies in the factory function (eager, not lazy).

```typescript
// ✅ CORRECT: Eager initialization
export function createAuthServerContainer(baseUrl?: string) {
  // Get API URL from parameter or environment variable
  const apiUrl = baseUrl ?? process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl || apiUrl.trim() === '') {
    throw new Error('[AuthServerContainer] API baseUrl is required.');
  }

  // 1. Infrastructure layer - Initialize immediately
  const sessionManager = new ServerSessionManager();
  const tokenProvider = new ServerTokenProvider(sessionManager);
  const httpClient = new FetchHttpClient({ baseUrl: apiUrl });
  const authenticatedClient = new AuthenticatedHttpClient(
    httpClient,
    tokenProvider
  );

  // 2. Data layer - Initialize immediately
  const authRepository = new AuthRepositoryImpl(authenticatedClient);

  // 3. Domain layer - Individual UseCase getters
  return {
    getLoginWithOAuth: () =>
      new LoginWithOAuthUseCase(authRepository, sessionManager),
    getLogout: () => new LogoutUseCase(authRepository, sessionManager),
    getRefreshToken: () =>
      new RefreshTokenUseCase(authRepository, sessionManager),
  };
}
```

## Implementation Guide

### Basic Implementation Example

```typescript
// apps/web/src/domains/auth/di/auth-server-container.ts
import { FetchHttpClient } from '@core/infrastructure/http';
import { ServerSessionManager } from '@core/infrastructure/storage';
import { ServerTokenProvider } from '@core/infrastructure/auth';
import { AuthRepositoryImpl } from '@auth/data/repositories';
import {
  LoginWithOAuthUseCase,
  LogoutUseCase,
  RefreshTokenUseCase,
} from '@auth/domain/use-cases';

export function createAuthServerContainer(baseUrl?: string) {
  // Get API URL from parameter (Edge Runtime) or environment variable
  const apiUrl = baseUrl ?? process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl || apiUrl.trim() === '') {
    throw new Error(
      '[AuthServerContainer] API baseUrl is required. ' +
        'Please ensure NEXT_PUBLIC_API_URL is set or pass baseUrl explicitly.'
    );
  }

  // 1. Infrastructure layer
  const sessionManager = new ServerSessionManager();
  const tokenProvider = new ServerTokenProvider(sessionManager);
  const httpClient = new FetchHttpClient({ baseUrl: apiUrl });
  const authenticatedClient = new AuthenticatedHttpClient(
    httpClient,
    tokenProvider
  );

  // 2. Data layer
  const authRepository = new AuthRepositoryImpl(authenticatedClient);

  // 3. Domain layer - Individual UseCase getters
  return {
    getLoginWithOAuth: () =>
      new LoginWithOAuthUseCase(authRepository, sessionManager),
    getLogout: () => new LogoutUseCase(authRepository, sessionManager),
    getRefreshToken: () =>
      new RefreshTokenUseCase(authRepository, sessionManager),
    getOAuthAuthorizeUrl: () => new GetOAuthAuthorizeUrlUseCase(authRepository),
    getCurrentSession: () => new GetCurrentSessionUseCase(sessionManager),
  };
}

// Type export for TypeScript inference
export type AuthServerContainer = ReturnType<typeof createAuthServerContainer>;
```

### Usage in Server Component

```typescript
// app/(auth)/login/page.tsx
import { createAuthServerContainer } from '@auth/di/auth-server-container';
import { redirect } from 'next/navigation';

const LoginPage = async ({
  searchParams,
}: {
  searchParams: { code?: string };
}) => {
  const container = createAuthServerContainer();

  // Get individual UseCases as needed
  const loginUseCase = container.getLoginWithOAuth();
  const getCurrentSessionUseCase = container.getCurrentSession();

  // Check if already logged in
  const session = await getCurrentSessionUseCase.execute();
  if (session) {
    redirect('/dashboard');
  }

  // Handle OAuth callback
  if (searchParams.code) {
    const result = await loginUseCase.execute({
      code: searchParams.code,
      provider: 'google',
    });

    if (result.success) {
      redirect('/dashboard');
    }
  }

  return <LoginPageView />;
};

export default LoginPage;
```

### Using baseUrl Parameter (Edge Runtime)

The Server Container accepts an optional `baseUrl` parameter for Edge Runtime environments where environment variables may not be available or need to be explicitly provided:

```typescript
// Regular usage (uses process.env.NEXT_PUBLIC_API_URL)
const container = createAuthServerContainer();

// Edge Runtime usage (explicit baseUrl)
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const container = createAuthServerContainer(apiUrl);
```

**When to use `baseUrl` parameter:**

- ✅ Edge Runtime (Middleware, Edge API Routes) when environment variables need explicit access
- ✅ Testing scenarios where you want to mock the API URL
- ✅ Multi-tenant scenarios where API URL varies per request

**Important Notes:**

- The `baseUrl` parameter is **optional** - most Server Components don't need it
- If `baseUrl` is not provided, the container automatically uses `process.env.NEXT_PUBLIC_API_URL`
- The container will throw an error if neither `baseUrl` nor environment variable is available
- This feature is primarily for Edge Runtime compatibility

**Example: Edge Runtime (Middleware)**

```typescript
// middleware.ts (Edge Runtime)
import { createAuthServerContainer } from '@auth/di/auth-server-container';

export async function middleware(request: NextRequest) {
  // Edge Runtime: Explicitly pass baseUrl
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const container = createAuthServerContainer(apiUrl);

  const useCase = container.getRefreshToken();
  // ... use the UseCase
}
```

### Multi-Repository Container

For UseCases that need multiple repositories:

```typescript
// ✅ CORRECT: Container with multiple repositories
export function createDashboardServerContainer(baseUrl?: string) {
  const apiUrl = baseUrl ?? process.env.NEXT_PUBLIC_API_URL;

  // Infrastructure
  const sessionManager = new ServerSessionManager();
  const tokenProvider = new ServerTokenProvider(sessionManager);
  const httpClient = new FetchHttpClient({ baseUrl: apiUrl });
  const authenticatedClient = new AuthenticatedHttpClient(
    httpClient,
    tokenProvider
  );

  // Data Layer - Multiple DataSources
  const userDataSource = new UserRemoteDataSource(authenticatedClient);
  const stampDataSource = new StampRemoteDataSource(authenticatedClient);
  const benefitDataSource = new BenefitRemoteDataSource(authenticatedClient);

  // Data Layer - Multiple Repositories
  const userRepository = new UserRepositoryImpl(userDataSource);
  const stampRepository = new StampRepositoryImpl(stampDataSource);
  const benefitRepository = new BenefitRepositoryImpl(benefitDataSource);

  // Domain Layer - UseCase with multiple repositories
  return {
    getGetUserDashboard: () =>
      new GetUserDashboardUseCase(
        userRepository,
        stampRepository,
        benefitRepository
      ),
  };
}

export type DashboardServerContainer = ReturnType<
  typeof createDashboardServerContainer
>;
```

## Infrastructure Layer

### HttpClient Architecture

The HttpClient uses Decorator pattern for layered functionality:

```
FetchHttpClient (Base)
    ↓
AuthenticatedHttpClient (adds Authorization header)
    ↓
Repository (uses client for API calls)
```

#### HttpClient Interface

```typescript
// apps/web/src/core/infrastructure/http/http-client.interface.ts
export interface HttpClient {
  get<T>(url: string, options?: RequestOptions): Promise<HttpResponse<T>>;
  post<T>(
    url: string,
    body?: unknown,
    options?: RequestOptions
  ): Promise<HttpResponse<T>>;
  put<T>(
    url: string,
    body?: unknown,
    options?: RequestOptions
  ): Promise<HttpResponse<T>>;
  patch<T>(
    url: string,
    body?: unknown,
    options?: RequestOptions
  ): Promise<HttpResponse<T>>;
  delete<T>(url: string, options?: RequestOptions): Promise<HttpResponse<T>>;
}
```

#### FetchHttpClient (Base Implementation)

```typescript
// apps/web/src/core/infrastructure/http/fetch-http-client.ts
export class FetchHttpClient implements HttpClient {
  constructor(private readonly config: HttpClientConfig) {}

  async get<T>(
    url: string,
    options?: RequestOptions
  ): Promise<HttpResponse<T>> {
    const response = await fetch(`${this.config.baseUrl}${url}`, {
      method: 'GET',
      headers: this.buildHeaders(options?.headers),
      credentials: this.config.credentials ?? 'include',
    });

    return this.handleResponse<T>(response);
  }

  // ... other methods
}
```

#### AuthenticatedHttpClient (Decorator)

```typescript
// apps/web/src/core/infrastructure/http/authenticated-http-client.ts
export class AuthenticatedHttpClient implements HttpClient {
  constructor(
    private readonly baseClient: HttpClient,
    private readonly tokenProvider: TokenProvider
  ) {}

  async get<T>(
    url: string,
    options?: RequestOptions
  ): Promise<HttpResponse<T>> {
    const token = await this.tokenProvider.getToken();

    const enhancedOptions: RequestOptions = {
      ...options,
      headers: {
        ...options?.headers,
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    };

    return this.baseClient.get<T>(url, enhancedOptions);
  }

  // ... other methods delegate to baseClient with token injection
}
```

### SessionManager (Server Implementation)

#### Server SessionManager (Cookies)

```typescript
// apps/web/src/core/infrastructure/storage/server-session-manager.ts
import { cookies } from 'next/headers';

export class ServerSessionManager implements SessionManager {
  async saveSession(data: SessionData): Promise<void> {
    cookies().set('session', JSON.stringify(data), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
  }

  async getSession(): Promise<SessionData | null> {
    const session = cookies().get('session');
    return session ? JSON.parse(session.value) : null;
  }

  async clearSession(): Promise<void> {
    cookies().delete('session');
  }
}
```

### TokenProvider Pattern

```typescript
// apps/web/src/core/infrastructure/auth/token-provider.interface.ts
export interface TokenProvider {
  getToken(): Promise<string | null>;
}

// Server implementation
export class ServerTokenProvider implements TokenProvider {
  constructor(private readonly sessionManager: SessionManager) {}

  async getToken(): Promise<string | null> {
    const session = await this.sessionManager.getSession();
    return session?.accessToken ?? null;
  }
}
```

## Per-Domain Container Location

### ✅ CORRECT: Per-Domain Containers

Each domain manages its own containers in its own `di/` directory:

```
apps/web/src/domains/
├── auth/
│   └── di/
│       ├── auth-server-container.ts    # createAuthServerContainer()
│       └── auth-client-container.ts    # getAuthClientContainer()
├── user/
│   └── di/
│       ├── user-server-container.ts    # createUserServerContainer()
│       └── user-client-container.ts    # getUserClientContainer()
├── cafeteria/
│   └── di/
│       ├── cafeteria-server-container.ts
│       └── cafeteria-client-container.ts
└── ... (other domains)
```

### ❌ WRONG: Global Containers

```
❌ apps/web/src/di/server-container.ts    # DON'T create global container
❌ apps/web/src/di/client-container.ts    # DON'T create global container
```

**Why per-domain?**

- **Domain Isolation**: Each domain manages its own dependencies
- **Bounded Context**: Aligns with DDD principles
- **Scalability**: Easy to add/remove domains
- **Team Autonomy**: Teams can work independently on their domains

## MUST / MUST NOT Rules

### ✅ MUST Rules (Server)

1. **MUST** use DI Container to get UseCases

   ```typescript
   // ✅ CORRECT
   const container = createAuthServerContainer();
   const useCase = container.getLoginWithOAuth();
   ```

2. **MUST** use Server Container in Server Components/Pages

   ```typescript
   // ✅ CORRECT: Server Component
   const MyPage = async () => {
     const container = createAuthServerContainer(); // New instance per request
     // ...
   };
   ```

3. **MUST** place containers in per-domain `di/` directories

   ```
   ✅ apps/web/src/domains/auth/di/auth-server-container.ts
   ✅ apps/web/src/domains/user/di/user-server-container.ts
   ```

4. **MUST** use factory function pattern for Server Container

   ```typescript
   // ✅ CORRECT: Function returns new instance
   export function createAuthServerContainer() {
     return {
       /* ... */
     };
   }
   ```

5. **MUST** provide individual UseCase getters (NOT factory methods)

   ```typescript
   // ✅ CORRECT: Direct getter methods
   return {
     getLoginWithOAuth: () => new LoginWithOAuthUseCase(...),
     getLogout: () => new LogoutUseCase(...),
   };

   // ❌ WRONG: Factory method pattern (deprecated)
   return {
     createLoginWithOAuthUseCase: () => new LoginWithOAuthUseCase(...),
   };
   ```

6. **MUST** initialize all infrastructure eagerly

   ```typescript
   // ✅ CORRECT: Initialize in factory function
   export function createAuthServerContainer() {
     const sessionManager = new ServerSessionManager(); // Eager
     const httpClient = new FetchHttpClient({ baseUrl: '...' }); // Eager
     // ...
   }
   ```

### ❌ MUST NOT Rules (Server)

1. **MUST NOT** directly instantiate Repository or UseCase

   ```typescript
   // ❌ WRONG: Direct instantiation
   const repository = new AuthRepositoryImpl(httpClient);
   const useCase = new LoginWithOAuthUseCase(repository);

   // ✅ CORRECT: Through container
   const container = createAuthServerContainer();
   const useCase = container.getLoginWithOAuth();
   ```

2. **MUST NOT** use Client Container in Server Components

   ```typescript
   // ❌ WRONG: Singleton in Server Component causes state leakage
   const MyPage = async () => {
     const container = getAuthClientContainer(); // ❌ WRONG!
   };

   // ✅ CORRECT: Use Server Container
   const MyPage = async () => {
     const container = createAuthServerContainer(); // ✅
   };
   ```

3. **MUST NOT** create global containers

   ```typescript
   // ❌ WRONG: Global container file
   // apps/web/src/di/global-container.ts

   // ✅ CORRECT: Per-domain containers
   // apps/web/src/domains/auth/di/auth-server-container.ts
   ```

4. **MUST NOT** cache Server Container instances

   ```typescript
   // ❌ WRONG: Caching Server Container (state leakage!)
   let serverContainer: AuthServerContainer | null = null;

   export function createAuthServerContainer() {
     if (!serverContainer) {
       serverContainer = {
         /* ... */
       };
     }
     return serverContainer; // ❌ WRONG!
   }

   // ✅ CORRECT: Always create new instance
   export function createAuthServerContainer() {
     return {
       /* new instance every call */
     };
   }
   ```

5. **MUST NOT** use deprecated `@nugudi/api` package

   ```typescript
   // ❌ WRONG: Using deprecated API package
   import { authApi } from '@nugudi/api';

   // ✅ CORRECT: Use UseCase through DI Container
   const container = createAuthServerContainer();
   const useCase = container.getLoginWithOAuth();
   ```

## Common Patterns

### Pattern 1: Server Component with Prefetch

```typescript
// app/(auth)/benefits/page.tsx
import { createBenefitServerContainer } from '@benefit/di/benefit-server-container';
import {
  getQueryClient,
  dehydrate,
  HydrationBoundary,
} from '@tanstack/react-query';

const BenefitsPage = async ({ searchParams }: PageProps) => {
  const queryClient = getQueryClient();
  const container = createBenefitServerContainer();

  // Prefetch data on server
  const getBenefitsUseCase = container.getGetBenefits();
  await queryClient.prefetchQuery({
    queryKey: ['benefits', 'list'],
    queryFn: () => getBenefitsUseCase.execute(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <BenefitPageView />
    </HydrationBoundary>
  );
};
```

### Pattern 2: Server Action with Container

```typescript
// app/(auth)/profile/actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { createUserServerContainer } from '@user/di/user-server-container';

export async function updateUserProfile(
  userId: string,
  updates: UserProfileUpdates
): Promise<{ success: boolean; error?: string }> {
  try {
    // Create Container per action call
    const container = createUserServerContainer();

    // Get UseCase and execute
    const updateUserProfile = container.getUpdateUserProfile();
    await updateUserProfile.execute(userId, updates);

    revalidatePath('/profile');

    return { success: true };
  } catch (error) {
    console.error('Update profile error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
```

### Pattern 3: API Route with Container

```typescript
// app/api/user/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createUserServerContainer } from '@user/di/user-server-container';

export async function GET(request: NextRequest) {
  try {
    // Create Container per request
    const container = createUserServerContainer();

    // Get UseCase and execute
    const getUserProfile = container.getGetUserProfile();
    const user = await getUserProfile.execute();

    return NextResponse.json({
      success: true,
      data: {
        userId: user.getUserId(),
        email: user.getEmail(),
        nickname: user.getNickname(),
      },
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
```

### Pattern 4: Layout with Container

```typescript
// app/(auth)/layout.tsx
import { createUserServerContainer } from '@user/di/user-server-container';

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const container = createUserServerContainer();
  const getUserProfile = container.getGetUserProfile();
  const user = await getUserProfile.execute();

  return (
    <div>
      <Header user={user} />
      {children}
    </div>
  );
}
```

## Testing Server Containers

### Unit Testing UseCases (Without Container)

```typescript
// src/domains/auth/domain/use-cases/__tests__/login-with-oauth.use-case.test.ts
import { LoginWithOAuthUseCase } from '../login-with-oauth.use-case';
import type { AuthRepository } from '../../repositories';
import type { SessionManager } from '@core/infrastructure/storage';

describe('LoginWithOAuthUseCase', () => {
  it('should login successfully and save session', async () => {
    // Mock dependencies
    const mockRepository: AuthRepository = {
      loginWithGoogle: vi.fn().mockResolvedValue({
        success: true,
        data: { accessToken: 'token', refreshToken: 'refresh' },
      }),
    };

    const mockSessionManager: SessionManager = {
      saveSession: vi.fn(),
      getSession: vi.fn(),
      clearSession: vi.fn(),
    };

    // Create UseCase with mocks (no container needed in tests)
    const useCase = new LoginWithOAuthUseCase(
      mockRepository,
      mockSessionManager
    );

    // Execute
    const result = await useCase.execute({
      provider: 'google',
      code: 'code123',
    });

    // Assert
    expect(result.success).toBe(true);
    expect(mockRepository.loginWithGoogle).toHaveBeenCalledWith({
      provider: 'google',
      code: 'code123',
    });
    expect(mockSessionManager.saveSession).toHaveBeenCalledWith({
      accessToken: 'token',
      refreshToken: 'refresh',
    });
  });
});
```

### Integration Testing with Container

```typescript
// src/domains/auth/di/__tests__/auth-server-container.test.ts
import { createAuthServerContainer } from '../auth-server-container';

describe('AuthServerContainer', () => {
  it('should create container with all UseCases', () => {
    const container = createAuthServerContainer();

    expect(container.getLoginWithOAuth).toBeDefined();
    expect(container.getLogout).toBeDefined();
    expect(container.getRefreshToken).toBeDefined();
  });

  it('should create new instance per call', () => {
    const container1 = createAuthServerContainer();
    const container2 = createAuthServerContainer();

    expect(container1).not.toBe(container2); // Different instances
  });

  it('should throw error when baseUrl is missing', () => {
    // Clear environment variable
    const originalUrl = process.env.NEXT_PUBLIC_API_URL;
    delete process.env.NEXT_PUBLIC_API_URL;

    expect(() => createAuthServerContainer()).toThrow(
      '[AuthServerContainer] API baseUrl is required'
    );

    // Restore
    process.env.NEXT_PUBLIC_API_URL = originalUrl;
  });
});
```

## Best Practices

1. **Factory Function**: Always use factory function, never singleton
2. **Per-Request**: Create new container for each request
3. **Eager Initialization**: Initialize all dependencies in factory function
4. **NO State**: Server containers should NOT store request-specific state
5. **Environment Variables**: Use `process.env` for configuration (or `baseUrl` parameter for Edge Runtime)
6. **Error Handling**: Wrap container creation in try-catch
7. **Type Exports**: Export container type using `ReturnType<typeof createXXX>`

## Common Pitfalls

### ❌ WRONG: Singleton Pattern on Server

```typescript
// DON'T DO THIS
let serverContainerInstance: UserServerContainer | null = null;

export function getUserServerContainer(): UserServerContainer {
  if (!serverContainerInstance) {
    serverContainerInstance = {
      /* ... */
    };
  }
  return serverContainerInstance; // Shared across requests!
}
```

### ✅ CORRECT: Factory Function

```typescript
export function createUserServerContainer(): UserServerContainer {
  // New infrastructure per request
  const sessionManager = new ServerSessionManager();
  const httpClient = new FetchHttpClient({ baseUrl: '...' });

  return {
    getGetUserProfile: () => new GetUserProfileUseCase(/* ... */),
  };
}
```

### ❌ WRONG: Using Client Container on Server

```typescript
// app/(auth)/profile/page.tsx
import { getUserClientContainer } from '@user/di'; // WRONG!

export default async function ProfilePage() {
  const container = getUserClientContainer(); // DON'T USE CLIENT CONTAINER ON SERVER
  // ...
}
```

### ✅ CORRECT: Using Server Container

```typescript
// app/(auth)/profile/page.tsx
import { createUserServerContainer } from '@user/di'; // CORRECT!

export default async function ProfilePage() {
  const container = createUserServerContainer(); // CORRECT
  // ...
}
```

## Server vs Client Containers

| Aspect             | Server Container                                    | Client Container                       |
| ------------------ | --------------------------------------------------- | -------------------------------------- |
| Pattern            | Factory function                                    | Lazy singleton                         |
| Initialization     | Eager (factory function)                            | Lazy (getters)                         |
| Lifetime           | Per-request                                         | App lifetime                           |
| baseUrl Parameter  | Optional (for Edge Runtime)                         | Not applicable                         |
| Token Refresh      | RefreshTokenService (server handles)                | No refresh (BFF handles)               |
| Usage              | Server Components, Actions, API Routes              | Client Components, Hooks               |
| Instance Creation  | New per call                                        | Cached singleton                       |
| SessionManager     | ServerSessionManager (cookies)                      | ClientSessionManager (localStorage)    |
| Import Restriction | NEVER import Client Container in server-side code   | NEVER import Server Container in hooks |

## Summary

Server Containers provide:

- **Request Isolation**: Fresh container per request
- **Thread Safety**: No shared state across requests
- **Dependency Management**: Centralized dependency wiring
- **Testability**: Easy to mock dependencies
- **Type Safety**: Compile-time validation of dependencies
- **Edge Runtime Support**: Optional `baseUrl` parameter for flexibility

**Always use Server Containers** in server-side code (Server Components, Server Actions, API Routes). For client-side code, see [di-client-patterns.md](./di-client-patterns.md).

---

**Next Steps**:

- Read [di-client-patterns.md](./di-client-patterns.md) for Client Container patterns
- Read [usecase-patterns.md](./usecase-patterns.md) for UseCase and Entity patterns
- Read [infrastructure-layer.md](./infrastructure-layer.md) for HttpClient and SessionManager details
