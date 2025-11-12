---
description: "Client DI Containers - Complete Guide for Client Components and Hooks"
globs:
  - "src/domains/**/di/*-client-container.ts"
  - "src/domains/**/presentation/client/**/*.tsx"
  - "src/domains/**/presentation/client/hooks/**/*.ts"
alwaysApply: true
---

# Client DI Containers - Complete Guide

> **Target Audience**: Developers working with Client Components, hooks, and browser-side code
> **Prerequisites**: Read [architecture.md](../core/architecture.md) and [di-server-containers.md](./di-server-containers.md) first
> **Related Docs**: [usecase-patterns.md](./usecase-patterns.md), [infrastructure-layer.md](./infrastructure-layer.md)

## 📋 Table of Contents

1. [⚠️ Critical Import Pattern](#️-critical-import-pattern) ← **READ THIS FIRST**
2. [Client DI Container Overview](#client-di-container-overview)
3. [When to Use](#when-to-use)
4. [Core Principles](#core-principles)
5. [Implementation Guide](#implementation-guide)
6. [Infrastructure Layer](#infrastructure-layer)
7. [MUST / MUST NOT Rules](#must--must-not-rules)
8. [Common Patterns](#common-patterns)
9. [Testing Client DI Containers](#testing-client-di-containers)
10. [Best Practices](#best-practices)
11. [Common Pitfalls](#common-pitfalls)
12. [Server vs Client DI Containers](#server-vs-client-di-containers)

---

## ⚠️ Critical Import Pattern

**🚨 MOST IMPORTANT RULE: ALWAYS import containers directly from the specific file, NOT from barrel exports at `@domain/di`.**

### ✅ CORRECT Pattern

```typescript
// ✅ CORRECT: Direct import from client-container file
import { getUserClientContainer } from '@/src/domains/user/di/user-client-container';

// ✅ CORRECT: Direct import from server-container file (if in server code)
import { createUserServerContainer } from '@/src/domains/user/di/user-server-container';
```

### ❌ WRONG Pattern

```typescript
// ❌ WRONG: Barrel export from @user/di
import { getUserClientContainer } from '@user/di';

// ❌ WRONG: Barrel export bundles BOTH server and client containers
import { createUserServerContainer, getUserClientContainer } from '@user/di';
```

### Why Direct Imports? (Understanding the Problem)

Using barrel exports at `@domain/di` causes **both server and client containers to bundle together**, breaking webpack's tree-shaking:

**The Problem:**
1. Barrel export (`export * from './di'`) bundles BOTH `*-server-container.ts` AND `*-client-container.ts`
2. Webpack cannot tree-shake properly when using `export *`
3. `server-only` package gets bundled in client code → **Build fails with error**
4. Client bundle becomes bloated with unused server dependencies (SessionManager, next/headers, etc.)

**Real-World Impact:**

```typescript
// domains/user/di/index.ts (barrel export)
export * from './user-server-container'; // ❌ Contains server-only imports
export * from './user-client-container';

// Client Component using barrel export
'use client';
import { getUserClientContainer } from '@user/di'; // ❌ WRONG

// What happens:
// 1. Webpack bundles BOTH server-container.ts AND client-container.ts
// 2. server-container.ts imports 'server-only' package and next/headers
// 3. Build fails with: "You're importing a component that needs 'server-only'"
// 4. Even if it doesn't fail, client bundle includes unnecessary server code
```

**The Solution:**

```typescript
// ✅ CORRECT: Direct import from specific file
import { getUserClientContainer } from '@/src/domains/user/di/user-client-container';

// Why this works:
// 1. Webpack only bundles user-client-container.ts
// 2. user-server-container.ts is NOT included in bundle
// 3. No server-only code in client bundle
// 4. Smaller bundle size
// 5. Build succeeds
```

### Critical Rules

1. **Client Code MUST Use Direct Imports**
   - ✅ `import { getUserClientContainer } from '@/src/domains/user/di/user-client-container'`
   - ❌ `import { getUserClientContainer } from '@user/di'`

2. **Server Code MUST Use Direct Imports**
   - ✅ `import { createUserServerContainer } from '@/src/domains/user/di/user-server-container'`
   - ❌ `import { createUserServerContainer } from '@user/di'`

3. **NEVER Mix Server and Client Imports from Barrel**
   - ❌ `import { createUserServerContainer, getUserClientContainer } from '@user/di'`

---

## Client DI Container Overview

### What is a Client DI Container?

**File Naming**: `{domain}-client-container.ts`
**Location**: `apps/web/src/domains/{domain}/di/`
**Getter Function**: `getXXXClientContainer()`

Client DI Containers are used in Client Components and hooks. They follow a **lazy singleton** pattern where one instance is shared across the entire client-side application lifetime.

### Characteristics

| Feature            | Implementation                        | Reason                                  |
| ------------------ | ------------------------------------- | --------------------------------------- |
| **Lifecycle**      | Lazy singleton (one instance for app) | Efficient, maintains state consistency  |
| **Pattern**        | Lazy singleton                        | Reuse single instance across app        |
| **Initialization** | Lazy (getters)                        | Create dependencies only when needed    |
| **SessionManager** | `ClientSessionManager` (localStorage) | Accessible in browser, survives refresh |
| **TokenProvider**  | `ClientTokenProvider` (localStorage)  | Reads tokens from localStorage          |
| **HttpClient**     | Browser fetch with credentials        | Automatic cookie sending                |

---

## When to Use

### ✅ Use Client DI Container In

- Client Components (`'use client'`)
- Event handlers in Client Components
- Query hooks (useQuery, useMutation)
- Client-side Zustand stores
- Any browser-side code

### ❌ NEVER Use Client DI Container In

- Server Components (use Server DI Container instead)
- Server Actions (use Server DI Container instead)
- API Routes (use Server DI Container instead)
- Middleware (use Server DI Container instead)

---

## Core Principles

### 1. Lazy Singleton Pattern

Client DI Containers are initialized ONCE and reused throughout the app lifetime.

```typescript
// ✅ CORRECT: Lazy singleton pattern
let clientContainerInstance: UserClientContainer | null = null;

export function getUserClientContainer(): UserClientContainer {
  if (!clientContainerInstance) {
    clientContainerInstance = {
      /* initialize once */
    };
  }
  return clientContainerInstance; // Returns same instance every time
}

// ❌ WRONG: Factory function (DON'T USE on client)
export function createUserClientContainer(): UserClientContainer {
  return {
    /* creates new instance every time */
  }; // WRONG! Inefficient, loses state
}
```

**Why Singleton?**
- Memory efficiency (one instance for entire app)
- State consistency (shared SessionManager, HttpClient)
- Performance (no repeated initialization)
- Matches browser's single-instance nature

### 2. Lazy Initialization (Optional but Recommended)

Client DI Containers initialize dependencies ONLY when first accessed (lazy, not eager).

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

### 3. No Parameters Required

Unlike Server DI Containers, Client DI Containers take NO parameters (SessionManager is created internally).

```typescript
// ✅ CORRECT: Client DI Container (no parameters)
export function getUserClientContainer(): UserClientContainer {
  if (!clientContainerInstance) {
    const sessionManager = new ClientSessionManager(); // Created internally
    clientContainerInstance = { /* ... */ };
  }
  return clientContainerInstance;
}

// ❌ WRONG: Client DI Container with parameters (like server)
export function getUserClientContainer(sessionManager: SessionManager): UserClientContainer {
  // WRONG! Client DI Containers don't accept parameters
}
```

---

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

### Interface-Based Implementation (Advanced)

```typescript
// ✅ CORRECT: Container interface + implementation class
export interface UserClientContainer {
  getGetUserProfile(): GetUserProfileUseCase;
  getUpdateUserProfile(): UpdateUserProfileUseCase;
  getDeleteUserAccount(): DeleteUserAccountUseCase;
}

class UserClientContainerImpl implements UserClientContainer {
  // Infrastructure Layer (Lazy)
  private _sessionManager?: ClientSessionManager;
  private _tokenProvider?: ClientTokenProvider;
  private _baseClient?: FetchHttpClient;
  private _httpClient?: AuthenticatedHttpClient;

  // Data Layer (Lazy)
  private _dataSource?: UserRemoteDataSource;
  private _repository?: UserRepository;

  // Domain Layer (Lazy)
  private _getUserProfileUseCase?: GetUserProfileUseCase;
  private _updateUserProfileUseCase?: UpdateUserProfileUseCase;
  private _deleteUserAccountUseCase?: DeleteUserAccountUseCase;

  private getSessionManager(): ClientSessionManager {
    if (!this._sessionManager) {
      this._sessionManager = new ClientSessionManager();
    }
    return this._sessionManager;
  }

  private getTokenProvider(): ClientTokenProvider {
    if (!this._tokenProvider) {
      this._tokenProvider = new ClientTokenProvider(this.getSessionManager());
    }
    return this._tokenProvider;
  }

  private getBaseClient(): FetchHttpClient {
    if (!this._baseClient) {
      this._baseClient = new FetchHttpClient({
        baseUrl: process.env.NEXT_PUBLIC_API_URL || '',
        timeout: 30000,
      });
    }
    return this._baseClient;
  }

  private getHttpClient(): AuthenticatedHttpClient {
    if (!this._httpClient) {
      this._httpClient = new AuthenticatedHttpClient(
        this.getBaseClient(),
        this.getTokenProvider(),
        this.getSessionManager(), // Client-side: provide session manager
        undefined // Client-side: BFF handles refresh (no RefreshTokenService)
      );
    }
    return this._httpClient;
  }

  private getDataSource(): UserRemoteDataSource {
    if (!this._dataSource) {
      this._dataSource = new UserRemoteDataSource(this.getHttpClient());
    }
    return this._dataSource;
  }

  private getRepository(): UserRepository {
    if (!this._repository) {
      this._repository = new UserRepositoryImpl(this.getDataSource());
    }
    return this._repository;
  }

  getGetUserProfile(): GetUserProfileUseCase {
    if (!this._getUserProfileUseCase) {
      this._getUserProfileUseCase = new GetUserProfileUseCaseImpl(
        this.getRepository()
      );
    }
    return this._getUserProfileUseCase;
  }

  getUpdateUserProfile(): UpdateUserProfileUseCase {
    if (!this._updateUserProfileUseCase) {
      this._updateUserProfileUseCase = new UpdateUserProfileUseCaseImpl(
        this.getRepository()
      );
    }
    return this._updateUserProfileUseCase;
  }

  getDeleteUserAccount(): DeleteUserAccountUseCase {
    if (!this._deleteUserAccountUseCase) {
      this._deleteUserAccountUseCase = new DeleteUserAccountUseCaseImpl(
        this.getRepository()
      );
    }
    return this._deleteUserAccountUseCase;
  }
}

// Singleton instance at module level
let clientContainerInstance: UserClientContainer | null = null;

export function getUserClientContainer(): UserClientContainer {
  if (!clientContainerInstance) {
    clientContainerInstance = new UserClientContainerImpl();
  }
  return clientContainerInstance;
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

---

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

---

## MUST / MUST NOT Rules

### ✅ MUST Rules (Client)

1. **MUST** use DI Container to get UseCases

   **Why?** DI Container provides centralized dependency management, making code testable (can mock entire container in tests), loosely coupled (can swap implementations without changing call sites), and ensures all dependencies are properly configured. Direct UseCase access bypasses these benefits.

   ```typescript
   // ✅ CORRECT
   const container = getAuthClientContainer();
   const useCase = container.getLoginWithOAuth();
   ```

2. **MUST** use Client DI Container in Client Components/Hooks

   **Why?** Client DI Container is specifically designed for browser environments with lazy singleton pattern, uses ClientSessionManager (localStorage), and ensures consistent state across all Client Components. Using Server DI Container in client code would create new instances on every render, breaking state management and TanStack Query cache.

   ```typescript
   // ✅ CORRECT: Client Component
   'use client';
   const MyComponent = () => {
     const container = getAuthClientContainer(); // Singleton
     // ...
   };
   ```

3. **MUST** place containers in per-domain `di/` directories

   **Why?** Per-domain DI directories enforce domain isolation (each bounded context manages its own dependencies), make container files easy to locate (consistent structure across domains), prevent tight coupling between domains, and support independent evolution of each domain's infrastructure needs.

   ```
   ✅ apps/web/src/domains/auth/di/auth-client-container.ts
   ✅ apps/web/src/domains/user/di/user-client-container.ts
   ```

4. **MUST** use lazy singleton pattern for Client DI Container

   **Why?** Lazy singleton ensures exactly one container instance exists across the entire client application (preventing duplicate HttpClient instances and broken TanStack Query cache), defers initialization until first use (faster initial page load), and maintains consistent UseCase state across all components. Eager initialization or factory pattern would waste resources and break caching.

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

   **Why?** Getter methods follow natural naming conventions (getLoginWithOAuth reads better than createLoginWithOAuthUseCase), provide cleaner API surface, and align with modern JavaScript conventions. The deprecated factory pattern (createXXX) is verbose and creates unnecessary friction for developers. Getters clearly communicate intent while remaining concise.

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

   **Why?** The 'use client' directive ensures the container code executes in browser context where Client APIs (localStorage, window, fetch with credentials) are available. Without it, Next.js may try to execute the container during Server-Side Rendering, causing runtime errors when accessing browser-only APIs. This directive explicitly marks the boundary between server and client code.

   ```typescript
   // ✅ CORRECT: 'use client' at top of file
   'use client';

   import { FetchHttpClient } from '@core/infrastructure/http';
   // ...
   ```

7. **MUST** use direct imports from container files

   **Why?** Direct imports prevent barrel export bundling issues where Server DI Container code gets included in Client bundles (or vice versa), causing build failures or runtime errors. Barrel exports (index.ts) in DI folders create circular dependencies and break Next.js code splitting. Direct imports ensure clean separation and optimal bundle sizes.

   ```typescript
   // ✅ CORRECT
   import { getUserClientContainer } from '@/src/domains/user/di/user-client-container';

   // ❌ WRONG
   import { getUserClientContainer } from '@user/di';
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

   **Why?** Direct instantiation bypasses dependency injection, making code untestable (can't mock dependencies), tightly coupled (hard to change implementations), and error-prone (easy to forget dependencies). DI Container ensures all dependencies are properly initialized with correct configurations.

2. **MUST NOT** use Server DI Container in Client Components

   ```typescript
   // ❌ WRONG: Creates new instance unnecessarily
   'use client';
   const MyComponent = () => {
     const container = createAuthServerContainer(); // ❌ WRONG!
   };

   // ✅ CORRECT: Use Client DI Container
   'use client';
   const MyComponent = () => {
     const container = getAuthClientContainer(); // ✅
   };
   ```

   **Why?** Server DI Container uses factory pattern (`createXXX()`), creating a NEW instance on every component render, wasting memory and breaking UseCase state. Client DI Container uses singleton pattern, ensuring the same instance is reused across all components for optimal performance.

3. **MUST NOT** create global containers

   ```typescript
   // ❌ WRONG: Global container file
   // apps/web/src/di/global-container.ts

   // ✅ CORRECT: Per-domain containers
   // apps/web/src/domains/auth/di/auth-client-container.ts
   ```

   **Why?** Global containers violate domain isolation, create tight coupling between domains, and make it impossible to evolve domains independently. Per-domain containers ensure each bounded context manages its own dependencies, enabling clean architecture and independent testing.

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

   **Why?** Factory pattern creates a new container instance on every call, leading to multiple HttpClient instances, broken TanStack Query cache (each container has different UseCase instances), and memory leaks. Lazy singleton ensures all components share the same container instance, maintaining consistent state and cache.

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

   **Why?** ServerSessionManager uses cookies which are only accessible on the server (Next.js Server Components). In the browser, it throws errors when trying to access cookies. ClientSessionManager uses localStorage, which is the correct browser-side storage mechanism for session tokens.

6. **MUST NOT** use deprecated `@nugudi/api` package

   ```typescript
   // ❌ WRONG: Using deprecated API package
   import { authApi } from '@nugudi/api';

   // ✅ CORRECT: Use UseCase through DI Container
   const container = getAuthClientContainer();
   const useCase = container.getLoginWithOAuth();
   ```

   **Why?** The `@nugudi/api` package is deprecated and violates Clean Architecture by mixing presentation, domain, and data layers. It bypasses UseCases, making code untestable and tightly coupled to API implementation. Using DI Container + UseCases ensures proper layer separation and testability.

7. **MUST NOT** import from barrel exports at `@domain/di`

   ```typescript
   // ❌ WRONG: Barrel export
   import { getUserClientContainer } from '@user/di';

   // ✅ CORRECT: Direct import
   import { getUserClientContainer } from '@/src/domains/user/di/user-client-container';
   ```

   **Why?** Barrel exports (index.ts) in DI folders cause bundling issues where Server DI Container code gets included in Client bundles (or vice versa), breaking the build or causing runtime errors. Direct imports ensure proper code splitting between server and client bundles.

---

## Common Patterns

### Pattern 1: Client Component with Query

```typescript
// ✅ CORRECT: Use Client Container in Client Component
'use client';

import { getUserClientContainer } from '@/src/domains/user/di/user-client-container';

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
import { getUserClientContainer } from '@/src/domains/user/di/user-client-container';

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

import { getAuthClientContainer } from '@/src/domains/auth/di/auth-client-container';

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
import { getUserClientContainer } from '@/src/domains/user/di/user-client-container';

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

import { getUserClientContainer } from '@/src/domains/user/di/user-client-container';
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

---

## Testing Client DI Containers

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

    // Second call returns same instance (if lazy initialization caches)
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

---

## Best Practices

1. **Singleton Pattern**: Always use singleton, never factory function
2. **Lazy Initialization**: Initialize dependencies only when needed (optional optimization)
3. **Reuse Instances**: Cache infrastructure instances (HttpClient, Repository)
4. **NO Parameters**: Client container getter takes NO parameters
5. **Browser Only**: Container is client-side only (`'use client'` directive)
6. **NO Token Refresh**: BFF handles token refresh on client
7. **SessionManager Internal**: Create SessionManager internally
8. **Direct Imports**: Always import from specific container file, NOT barrel export

---

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

### ❌ WRONG: Using Server DI Container on Client

```typescript
'use client';

import { createUserServerContainer } from '@user/di'; // WRONG!

export function ProfileSection() {
  const container = createUserServerContainer(); // WRONG! Can't use server APIs
  // ...
}
```

### ✅ CORRECT: Using Client DI Container

```typescript
'use client';

import { getUserClientContainer } from '@/src/domains/user/di/user-client-container'; // CORRECT!

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

### ❌ WRONG: Importing from Barrel Export

```typescript
// ❌ WRONG: Barrel export bundles server and client code
import { getUserClientContainer } from '@user/di';
```

### ✅ CORRECT: Direct Import from Container File

```typescript
// ✅ CORRECT: Direct import
import { getUserClientContainer } from '@/src/domains/user/di/user-client-container';
```

### ❌ WRONG: Eager Initialization

```typescript
// DON'T DO THIS
class UserClientContainerImpl {
  private readonly httpClient: AuthenticatedHttpClient;
  private readonly repository: UserRepository;

  constructor() {
    // WRONG: Eager initialization in constructor
    this.httpClient = new AuthenticatedHttpClient(/* ... */);
    this.repository = new UserRepositoryImpl(/* ... */);
  }
}
```

### ✅ CORRECT: Lazy Initialization

```typescript
class UserClientContainerImpl {
  private _httpClient?: AuthenticatedHttpClient;
  private _repository?: UserRepository;

  private getHttpClient(): AuthenticatedHttpClient {
    if (!this._httpClient) {
      this._httpClient = new AuthenticatedHttpClient(/* ... */);
    }
    return this._httpClient;
  }

  private getRepository(): UserRepository {
    if (!this._repository) {
      this._repository = new UserRepositoryImpl(this.getDataSource());
    }
    return this._repository;
  }
}
```

---

## Server vs Client DI Containers

| Aspect             | Server DI Container                               | Client DI Container                    |
| ------------------ | ------------------------------------------------- | -------------------------------------- |
| **Pattern**            | Factory function                                  | Lazy singleton                         |
| **Initialization**     | Eager (factory function)                          | Lazy (optional, but often eager)       |
| **Lifetime**           | Per-request                                       | App lifetime                           |
| **SessionManager**     | ServerSessionManager (cookies)                    | ClientSessionManager (localStorage)    |
| **Token Refresh**      | RefreshTokenService (server handles)              | No refresh (BFF handles)               |
| **Usage**              | Server Components, Actions, API Routes            | Client Components, Hooks               |
| **Parameters**         | Optional baseUrl (Edge Runtime)                   | No parameters                          |
| **Instance Creation**  | New per call                                      | Cached singleton                       |
| **Import Restriction** | NEVER import Client DI Container in server-side code | NEVER import Server DI Container in hooks |
| **Directive Required** | No                                                | Yes (`'use client'`)                   |
| **Import Pattern**     | Direct from `*-server-container.ts`               | Direct from `*-client-container.ts`    |

---

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

---

## Summary

Client DI Containers provide:

- **Singleton Pattern**: One instance for entire app
- **Lazy Initialization**: Create dependencies only when needed (optional)
- **Memory Efficiency**: Reuse instances across components
- **Type Safety**: Compile-time validation of dependencies
- **Testability**: Easy to reset for testing
- **Browser-Only**: Optimized for client-side execution
- **Direct Imports**: Webpack tree-shaking works correctly

**Always use Client DI Containers** in client-side code (Client Components, hooks). For server-side code, see [di-server-containers.md](./di-server-containers.md).

**Critical Rule**: NEVER use Client DI Container (`getUserClientContainer()`) in Server Components or Server Actions. Always use Server DI Container (`createUserServerContainer()`) instead.

**Import Rule**: ALWAYS use direct imports from `*-client-container.ts` files, NEVER from barrel exports at `@domain/di`.

---

**Next Steps**:

- Read [di-server-containers.md](./di-server-containers.md) for Server Container patterns
- Read [usecase-patterns.md](./usecase-patterns.md) for UseCase and Entity patterns
- Read [infrastructure-layer.md](./infrastructure-layer.md) for HttpClient and SessionManager details
- Read [repository-patterns.md](./repository-patterns.md) for Repository implementation patterns
