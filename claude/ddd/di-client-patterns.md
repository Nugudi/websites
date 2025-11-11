---
description: "Client DI patterns, lazy singleton, browser-side instantiation for Client Components and hooks"
globs:
  - "src/domains/**/di/*-client-container.ts"
  - "src/domains/**/presentation/client/**/*.tsx"
  - "src/domains/**/presentation/client/hooks/**/*.ts"
alwaysApply: true
---

# Client DI Containers - Complete Guide

> **Target Audience**: Developers working with Client Components, hooks, and browser-side code
> **Prerequisites**: Read [architecture.md](../architecture.md) first
> **Related Docs**: [di-server-patterns.md](./di-server-patterns.md), [usecase-patterns.md](./usecase-patterns.md)

## 📋 Table of Contents

1. [Client Container Type](#client-container-type)
2. [When to Use](#when-to-use)
3. [Implementation Guide](#implementation-guide)
4. [Infrastructure Layer](#infrastructure-layer)
5. [MUST / MUST NOT Rules](#must--must-not-rules)
6. [Common Patterns](#common-patterns)
7. [Testing Client Containers](#testing-client-containers)

## Client Container Type

### Overview

**File Naming**: `{domain}-client-container.ts`
**Location**: `apps/web/src/domains/{domain}/di/`
**Getter Function**: `getXXXClientContainer()`

### When to Use

- ✅ Client Components (`'use client'`)
- ✅ Event handlers in Client Components
- ✅ Query hooks (useQuery, useMutation)
- ✅ Client-side Zustand stores
- ✅ Any browser-side code

### Characteristics

| Feature            | Implementation                        | Reason                                  |
| ------------------ | ------------------------------------- | --------------------------------------- |
| **Lifecycle**      | Lazy singleton (one instance for app) | Efficient, maintains state consistency  |
| **Pattern**        | Lazy singleton                        | Reuse single instance across app        |
| **Initialization** | Lazy (getters)                        | Create dependencies only when needed    |
| **SessionManager** | `ClientSessionManager` (localStorage) | Accessible in browser, survives refresh |
| **TokenProvider**  | `ClientTokenProvider` (localStorage)  | Reads tokens from localStorage          |
| **HttpClient**     | Browser fetch with credentials        | Automatic cookie sending                |

### Core Principles

#### 1. Lazy Singleton

Client Containers are initialized ONCE and reused throughout the app lifetime.

```typescript
// ✅ CORRECT: Lazy singleton pattern
let clientContainerInstance: UserClientContainer | null = null;

export function getUserClientContainer(): UserClientContainer {
  if (!clientContainerInstance) {
    clientContainerInstance = {
      /* initialize once */
    };
  }
  return clientContainerInstance; // Singleton
}

// ❌ WRONG: Factory function (DON'T USE on client)
export function createUserClientContainer(): UserClientContainer {
  return {
    /* creates new instance every time */
  }; // WRONG! Inefficient
}
```

#### 2. Lazy Initialization

Client Containers initialize dependencies ONLY when first accessed (lazy, not eager).

```typescript
// ✅ CORRECT: Lazy initialization
let clientContainer: AuthClientContainer | null = null;

export function getAuthClientContainer() {
  if (!clientContainer) {
    // 1. Infrastructure layer - Lazy
    let sessionManager: ClientSessionManager | undefined;
    let tokenProvider: ClientTokenProvider | undefined;
    let httpClient: FetchHttpClient | undefined;
    let authenticatedClient: AuthenticatedHttpClient | undefined;

    const getSessionManager = () => {
      if (!sessionManager) {
        sessionManager = new ClientSessionManager();
      }
      return sessionManager;
    };

    const getAuthenticatedClient = () => {
      if (!authenticatedClient) {
        if (!httpClient) {
          httpClient = new FetchHttpClient({
            baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
            credentials: 'include',
          });
        }
        if (!tokenProvider) {
          tokenProvider = new ClientTokenProvider(getSessionManager());
        }
        authenticatedClient = new AuthenticatedHttpClient(
          httpClient,
          tokenProvider
        );
      }
      return authenticatedClient;
    };

    // 2. Data layer - Lazy
    let authRepository: AuthRepositoryImpl | undefined;

    const getAuthRepository = () => {
      if (!authRepository) {
        authRepository = new AuthRepositoryImpl(getAuthenticatedClient());
      }
      return authRepository;
    };

    // 3. Domain layer - Individual UseCase getters
    clientContainer = {
      getLoginWithOAuth: () =>
        new LoginWithOAuthUseCase(getAuthRepository(), getSessionManager()),
      getLogout: () => new LogoutUseCase(getAuthRepository(), getSessionManager()),
      getRefreshToken: () =>
        new RefreshTokenUseCase(getAuthRepository(), getSessionManager()),
    };
  }

  return clientContainer;
}

export type AuthClientContainer = {
  getLoginWithOAuth: () => LoginWithOAuthUseCase;
  getLogout: () => LogoutUseCase;
  getRefreshToken: () => RefreshTokenUseCase;
};
```

## Implementation Guide

### Basic Implementation Example

```typescript
// apps/web/src/domains/auth/di/auth-client-container.ts
'use client';

import { FetchHttpClient } from '@core/infrastructure/http';
import { ClientSessionManager } from '@core/infrastructure/storage';
import { ClientTokenProvider } from '@core/infrastructure/auth';
import { AuthRepositoryImpl } from '@auth/data/repositories';
import { LoginWithOAuthUseCase, LogoutUseCase } from '@auth/domain/use-cases';

let clientContainer: AuthClientContainer | null = null;

export function getAuthClientContainer() {
  if (!clientContainer) {
    // 1. Infrastructure layer
    const sessionManager = new ClientSessionManager();
    const tokenProvider = new ClientTokenProvider(sessionManager);
    const httpClient = new FetchHttpClient({
      baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
      credentials: 'include', // Important for cookies
    });
    const authenticatedClient = new AuthenticatedHttpClient(
      httpClient,
      tokenProvider
    );

    // 2. Data layer
    const authRepository = new AuthRepositoryImpl(authenticatedClient);

    // 3. Domain layer - Individual UseCase getters
    clientContainer = {
      getLoginWithOAuth: () =>
        new LoginWithOAuthUseCase(authRepository, sessionManager),
      getLogout: () => new LogoutUseCase(authRepository, sessionManager),
      getRefreshToken: () =>
        new RefreshTokenUseCase(authRepository, sessionManager),
    };
  }

  return clientContainer;
}

export type AuthClientContainer = {
  getLoginWithOAuth: () => LoginWithOAuthUseCase;
  getLogout: () => LogoutUseCase;
  getRefreshToken: () => RefreshTokenUseCase;
};
```

### Usage in Client Component

```typescript
// src/domains/auth/presentation/client/components/logout-button/index.tsx
'use client';

import { getAuthClientContainer } from '@auth/di/auth-client-container';
import { Button } from '@nugudi/react-components-button';

export const LogoutButton = () => {
  const handleLogout = async () => {
    const container = getAuthClientContainer();
    const logoutUseCase = container.getLogout();

    const result = await logoutUseCase.execute();

    if (result.success) {
      window.location.href = '/login';
    }
  };

  return <Button onClick={handleLogout}>로그아웃</Button>;
};
```

### Usage in Query Hook

```typescript
// src/domains/user/presentation/client/hooks/queries/get-my-profile.query.ts
'use client';

import { useQuery } from '@tanstack/react-query';
import { getUserClientContainer } from '@user/di/user-client-container';

export function useGetMyProfile() {
  const container = getUserClientContainer();
  const getMyProfileUseCase = container.getGetMyProfile();

  return useQuery({
    queryKey: ['user', 'profile', 'me'],
    queryFn: async () => {
      const result = await getMyProfileUseCase.execute();
      return result;
    },
  });
}
```

### Multi-Repository Container

For UseCases that need multiple repositories:

```typescript
// ✅ CORRECT: Container with multiple repositories
let dashboardClientContainer: DashboardClientContainer | null = null;

export function getDashboardClientContainer(): DashboardClientContainer {
  if (!dashboardClientContainer) {
    // Infrastructure
    const sessionManager = new ClientSessionManager();
    const tokenProvider = new ClientTokenProvider(sessionManager);
    const httpClient = new FetchHttpClient({
      baseUrl: process.env.NEXT_PUBLIC_API_URL || '',
    });
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
    dashboardClientContainer = {
      getGetUserDashboard: () =>
        new GetUserDashboardUseCase(
          userRepository,
          stampRepository,
          benefitRepository
        ),
    };
  }

  return dashboardClientContainer;
}

export type DashboardClientContainer = {
  getGetUserDashboard: () => GetUserDashboardUseCase;
};
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

### SessionManager (Client Implementation)

#### Client SessionManager (localStorage)

```typescript
// apps/web/src/core/infrastructure/storage/client-session-manager.ts
'use client';

export class ClientSessionManager implements SessionManager {
  private readonly STORAGE_KEY = 'session';

  async saveSession(data: SessionData): Promise<void> {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }

  async getSession(): Promise<SessionData | null> {
    const session = localStorage.getItem(this.STORAGE_KEY);
    return session ? JSON.parse(session) : null;
  }

  async clearSession(): Promise<void> {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}
```

### TokenProvider Pattern

```typescript
// apps/web/src/core/infrastructure/auth/token-provider.interface.ts
export interface TokenProvider {
  getToken(): Promise<string | null>;
}

// Client implementation
export class ClientTokenProvider implements TokenProvider {
  constructor(private readonly sessionManager: SessionManager) {}

  async getToken(): Promise<string | null> {
    const session = await this.sessionManager.getSession();
    return session?.accessToken ?? null;
  }
}
```

### Token Refresh Handling

Client containers do NOT handle token refresh (BFF handles it):

```typescript
// ✅ CORRECT: No RefreshTokenService on client
const authenticatedClient = new AuthenticatedHttpClient(
  httpClient,
  tokenProvider
  // No RefreshTokenService - BFF handles token refresh
);
```

## MUST / MUST NOT Rules

### ✅ MUST Rules (Client)

1. **MUST** use DI Container to get UseCases

   ```typescript
   // ✅ CORRECT
   const container = getAuthClientContainer();
   const useCase = container.getLoginWithOAuth();
   ```

2. **MUST** use Client Container in Client Components/Hooks

   ```typescript
   // ✅ CORRECT: Client Component
   'use client';
   const MyComponent = () => {
     const container = getAuthClientContainer(); // Singleton
     // ...
   };
   ```

3. **MUST** place containers in per-domain `di/` directories

   ```
   ✅ apps/web/src/domains/auth/di/auth-client-container.ts
   ✅ apps/web/src/domains/user/di/user-client-container.ts
   ```

4. **MUST** use lazy singleton pattern for Client Container

   ```typescript
   // ✅ CORRECT: Lazy-initialized singleton
   let container: AuthClientContainer | null = null;

   export function getAuthClientContainer() {
     if (!container) {
       container = {
         /* initialize once */
       };
     }
     return container;
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

6. **MUST** add `'use client'` directive to container file

   ```typescript
   // ✅ CORRECT: 'use client' at top of file
   'use client';

   import { FetchHttpClient } from '@core/infrastructure/http';
   // ...
   ```

### ❌ MUST NOT Rules (Client)

1. **MUST NOT** directly instantiate Repository or UseCase

   ```typescript
   // ❌ WRONG: Direct instantiation
   const repository = new AuthRepositoryImpl(httpClient);
   const useCase = new LoginWithOAuthUseCase(repository);

   // ✅ CORRECT: Through container
   const container = getAuthClientContainer();
   const useCase = container.getLoginWithOAuth();
   ```

2. **MUST NOT** use Server Container in Client Components

   ```typescript
   // ❌ WRONG: Creates new instance unnecessarily
   'use client';
   const MyComponent = () => {
     const container = createAuthServerContainer(); // ❌ WRONG!
   };

   // ✅ CORRECT: Use Client Container
   'use client';
   const MyComponent = () => {
     const container = getAuthClientContainer(); // ✅
   };
   ```

3. **MUST NOT** create global containers

   ```typescript
   // ❌ WRONG: Global container file
   // apps/web/src/di/global-container.ts

   // ✅ CORRECT: Per-domain containers
   // apps/web/src/domains/auth/di/auth-client-container.ts
   ```

4. **MUST NOT** use factory function pattern on client

   ```typescript
   // ❌ WRONG: Factory function (creates new instance every time)
   export function createAuthClientContainer() {
     return {
       /* new instance */
     };
   }

   // ✅ CORRECT: Lazy singleton
   let container: AuthClientContainer | null = null;
   export function getAuthClientContainer() {
     if (!container) {
       container = {
         /* cached instance */
       };
     }
     return container;
   }
   ```

5. **MUST NOT** use server-side SessionManager

   ```typescript
   // ❌ WRONG: Using ServerSessionManager in Client Container
   export function getAuthClientContainer() {
     const sessionManager = new ServerSessionManager(); // ❌
     // ...
   }

   // ✅ CORRECT: Use ClientSessionManager
   export function getAuthClientContainer() {
     if (!clientContainer) {
       const sessionManager = new ClientSessionManager(); // ✅
       // ...
     }
   }
   ```

6. **MUST NOT** use deprecated `@nugudi/api` package

   ```typescript
   // ❌ WRONG: Using deprecated API package
   import { authApi } from '@nugudi/api';

   // ✅ CORRECT: Use UseCase through DI Container
   const container = getAuthClientContainer();
   const useCase = container.getLoginWithOAuth();
   ```

## Common Patterns

### Pattern 1: Client Component with Query

```typescript
// ✅ CORRECT: Use Client Container in Client Component
'use client';

import { getUserClientContainer } from '@user/di';

export function ProfileSection() {
  const container = getUserClientContainer(); // Singleton

  const { data, isLoading, error } = useQuery({
    queryKey: ['user', 'profile'],
    queryFn: async () => {
      const getUserProfile = container.getGetUserProfile();
      return getUserProfile.execute();
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <ProfileView user={data} />;
}
```

### Pattern 2: Client Hook with Container

```typescript
// src/domains/user/presentation/client/hooks/queries/get-my-profile.query.ts
'use client';

import { useQuery } from '@tanstack/react-query';
import { getUserClientContainer } from '@user/di/user-client-container';

export function useGetMyProfile() {
  const container = getUserClientContainer();
  const getMyProfileUseCase = container.getGetMyProfile();

  return useQuery({
    queryKey: ['user', 'profile', 'me'],
    queryFn: () => getMyProfileUseCase.execute(),
  });
}
```

### Pattern 3: Event Handler with Container

```typescript
// src/domains/auth/presentation/client/components/login-form/index.tsx
'use client';

import { getAuthClientContainer } from '@auth/di/auth-client-container';

export const LoginForm = () => {
  const handleSubmit = async (data: LoginFormData) => {
    const container = getAuthClientContainer();
    const loginUseCase = container.getLoginWithOAuth();

    const result = await loginUseCase.execute({
      provider: data.provider,
      code: data.code,
    });

    if (result.success) {
      // Handle success
    }
  };

  return <form onSubmit={handleSubmit}>...</form>;
};
```

### Pattern 4: Mutation Hook with Container

```typescript
// ✅ CORRECT: Mutation hook using container
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserClientContainer } from '@user/di';

export function useUpdateUserProfile() {
  const container = getUserClientContainer();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: UserProfileUpdates) => {
      const updateUserProfile = container.getUpdateUserProfile();
      const userId = await getUserId(); // Get from session
      return updateUserProfile.execute(userId, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
    },
  });
}

async function getUserId(): Promise<string> {
  const container = getUserClientContainer();
  // Access session manager through container if needed
  return 'user-id';
}
```

### Pattern 5: Component with Mutation

```typescript
// ✅ CORRECT: Use Container for mutations
'use client';

import { getUserClientContainer } from '@user/di';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function ProfileEditSection() {
  const container = getUserClientContainer();
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: async (updates: UserProfileUpdates) => {
      const updateUserProfile = container.getUpdateUserProfile();
      return updateUserProfile.execute('user-id', updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
    },
  });

  const handleSubmit = (updates: UserProfileUpdates) => {
    updateMutation.mutate(updates);
  };

  return <EditForm onSubmit={handleSubmit} />;
}
```

## Testing Client Containers

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
describe('UserClientContainer', () => {
  beforeEach(() => {
    // Reset singleton between tests
    jest.resetModules();
  });

  it('should return singleton instance', () => {
    const container1 = getUserClientContainer();
    const container2 = getUserClientContainer();

    // Same instance
    expect(container1).toBe(container2);
  });

  it('should lazily initialize UseCases', () => {
    const container = getUserClientContainer();

    // First call creates instance
    const useCase1 = container.getGetUserProfile();
    expect(useCase1).toBeDefined();

    // Second call returns same instance
    const useCase2 = container.getGetUserProfile();
    expect(useCase1).toBe(useCase2);
  });

  it('should provide all UseCases', () => {
    const container = getUserClientContainer();

    expect(container.getGetUserProfile).toBeDefined();
    expect(container.getUpdateUserProfile).toBeDefined();
    expect(container.getDeleteUserAccount).toBeDefined();
  });
});
```

## Best Practices

1. **Singleton Pattern**: Always use singleton, never factory function
2. **Lazy Initialization**: Initialize dependencies only when needed (optional optimization)
3. **Reuse Instances**: Cache infrastructure instances (HttpClient, Repository)
4. **NO Parameters**: Client container getter takes NO parameters
5. **Browser Only**: Container is client-side only (`'use client'` directive)
6. **NO Token Refresh**: BFF handles token refresh on client
7. **SessionManager Internal**: Create SessionManager internally

## Common Pitfalls

### ❌ WRONG: Factory Function on Client

```typescript
// DON'T DO THIS
export function createUserClientContainer(): UserClientContainer {
  return {
    /* creates new instance every time! */
  };
}
```

### ✅ CORRECT: Singleton Pattern

```typescript
let clientContainerInstance: UserClientContainer | null = null;

export function getUserClientContainer(): UserClientContainer {
  if (!clientContainerInstance) {
    clientContainerInstance = {
      /* cached instance */
    };
  }
  return clientContainerInstance;
}
```

### ❌ WRONG: Using Server Container on Client

```typescript
'use client';

import { createUserServerContainer } from '@user/di'; // WRONG!

export function ProfileSection() {
  const container = createUserServerContainer(); // WRONG! Can't use server APIs
  // ...
}
```

### ✅ CORRECT: Using Client Container

```typescript
'use client';

import { getUserClientContainer } from '@user/di'; // CORRECT!

export function ProfileSection() {
  const container = getUserClientContainer(); // CORRECT
  // ...
}
```

### ❌ WRONG: Missing 'use client' Directive

```typescript
// DON'T DO THIS - Missing 'use client'
import { FetchHttpClient } from '@core/infrastructure/http';

let clientContainer: AuthClientContainer | null = null;

export function getAuthClientContainer() {
  // ...
}
```

### ✅ CORRECT: With 'use client' Directive

```typescript
'use client'; // MUST have this

import { FetchHttpClient } from '@core/infrastructure/http';

let clientContainer: AuthClientContainer | null = null;

export function getAuthClientContainer() {
  // ...
}
```

## Server vs Client Containers

| Aspect             | Server Container                                  | Client Container                       |
| ------------------ | ------------------------------------------------- | -------------------------------------- |
| Pattern            | Factory function                                  | Lazy singleton                         |
| Initialization     | Eager (factory function)                          | Lazy (optional, but often eager)       |
| Lifetime           | Per-request                                       | App lifetime                           |
| SessionManager     | ServerSessionManager (cookies)                    | ClientSessionManager (localStorage)    |
| Token Refresh      | RefreshTokenService (server handles)              | No refresh (BFF handles)               |
| Usage              | Server Components, Actions, API Routes            | Client Components, Hooks               |
| Parameters         | Optional baseUrl (Edge Runtime)                   | No parameters                          |
| Instance Creation  | New per call                                      | Cached singleton                       |
| Import Restriction | NEVER import Client Container in server-side code | NEVER import Server Container in hooks |
| Directive Required | No                                                | Yes (`'use client'`)                   |

## Environment Detection (Optional)

Ensure client code only runs in browser:

```typescript
// ✅ CORRECT: Check environment (optional safety check)
export function getUserClientContainer(): UserClientContainer {
  if (typeof window === 'undefined') {
    throw new Error('UserClientContainer can only be used in browser');
  }

  if (!clientContainerInstance) {
    clientContainerInstance = {
      /* ... */
    };
  }
  return clientContainerInstance;
}
```

## Summary

Client Containers provide:

- **Singleton Pattern**: One instance for entire app
- **Lazy Initialization**: Create dependencies only when needed (optional)
- **Memory Efficiency**: Reuse instances across components
- **Type Safety**: Compile-time validation of dependencies
- **Testability**: Easy to reset for testing
- **Browser-Only**: Optimized for client-side execution

**Always use Client Containers** in client-side code (Client Components, hooks). For server-side code, see [di-server-patterns.md](./di-server-patterns.md).

**Critical Rule**: NEVER use Client Container (`getUserClientContainer()`) in Server Components or Server Actions. Always use Server Container (`createUserServerContainer()`) instead.

---

**Next Steps**:

- Read [di-server-patterns.md](./di-server-patterns.md) for Server Container patterns
- Read [usecase-patterns.md](./usecase-patterns.md) for UseCase and Entity patterns
- Read [infrastructure-layer.md](./infrastructure-layer.md) for HttpClient and SessionManager details
