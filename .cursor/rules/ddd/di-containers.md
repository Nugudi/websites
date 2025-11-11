---
description: Dependency Injection Container rules - Server vs Client
globs:
  - "**/di/**/*-container.ts"
  - "**/di/**/*-container.tsx"
alwaysApply: true
---

# DI Container Rules

## Container Types

### Server Container (Stateless, Per-Request)

**File**: `{domain}-server-container.ts`
**Location**: `apps/web/src/domains/{domain}/di/`
**Function**: `createXXXServerContainer(baseUrl?: string)`

#### WHEN TO USE

- ✅ Server Components (Pages)
- ✅ API Routes (`app/api/**/route.ts`)
- ✅ Server Actions (`'use server'`)
- ✅ Middleware (Edge Runtime)

#### MUST Rules

- **MUST** create new instance per request (stateless)
- **MUST** use `ServerSessionManager` (httpOnly cookies)
- **MUST** use `ServerTokenProvider` (reads from cookies)
- **MUST** accept optional `baseUrl` parameter for Edge Runtime
- **MUST** throw error if no baseUrl and no env var

#### Implementation Pattern

```typescript
// apps/web/src/domains/auth/di/auth-server-container.ts
import "server-only";
import { FetchHttpClient, AuthenticatedHttpClient } from "@core/infrastructure/http";
import { ServerSessionManager } from "@core/infrastructure/storage";
import { ServerTokenProvider } from "@core/infrastructure/http";
import { AuthRepositoryImpl } from "@auth/data";
import { LoginUseCaseImpl, LogoutUseCaseImpl } from "@auth/domain";

export function createAuthServerContainer(baseUrl?: string) {
  // ✅ MUST: Support Edge Runtime via baseUrl parameter
  const apiUrl = baseUrl ?? process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl || apiUrl.trim() === "") {
    throw new Error("[ServerContainer] API baseUrl required");
  }

  // 1. Infrastructure
  const sessionManager = new ServerSessionManager();
  const tokenProvider = new ServerTokenProvider(sessionManager);
  const httpClient = new FetchHttpClient({ baseUrl: apiUrl });
  const authenticatedClient = new AuthenticatedHttpClient(
    httpClient,
    tokenProvider
  );

  // 2. Data
  const repository = new AuthRepositoryImpl(authenticatedClient);

  // 3. Domain - Individual UseCase getters
  return {
    getLoginWithOAuth: () => new LoginUseCaseImpl(repository, sessionManager),
    getLogout: () => new LogoutUseCaseImpl(repository, sessionManager),
    getRefreshToken: () => new RefreshTokenUseCaseImpl(repository, sessionManager),
  };
}

export type AuthServerContainer = ReturnType<typeof createAuthServerContainer>;
```

#### Usage Examples

```typescript
// ✅ Server Component (Regular usage)
const MyPage = async () => {
  const container = createAuthServerContainer(); // Uses env var
  const useCase = container.getLoginWithOAuth();
};

// ✅ Middleware (Edge Runtime - explicit baseUrl)
export async function middleware(request: NextRequest) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const container = createAuthServerContainer(apiUrl); // Explicit
  const useCase = container.getRefreshToken();
}
```

### Client Container (Singleton, Lazy Initialized)

**File**: `{domain}-client-container.ts`
**Location**: `apps/web/src/domains/{domain}/di/`
**Function**: `getXXXClientContainer()`

#### WHEN TO USE

- ✅ Client Components (`'use client'`)
- ✅ Event handlers
- ✅ Query hooks (useQuery, useMutation)
- ✅ Zustand stores

#### MUST Rules

- **MUST** be lazy singleton (one instance per app)
- **MUST** use `ClientSessionManager` (localStorage)
- **MUST** use `ClientTokenProvider` (reads from localStorage)
- **MUST** include `'use client'` directive at top
- **MUST** set `credentials: 'include'` in FetchHttpClient

#### Implementation Pattern

```typescript
// apps/web/src/domains/auth/di/auth-client-container.ts
"use client";

import { FetchHttpClient, AuthenticatedHttpClient } from "@core/infrastructure/http";
import { ClientSessionManager } from "@core/infrastructure/storage";
import { ClientTokenProvider } from "@core/infrastructure/http";
import { AuthRepositoryImpl } from "@auth/data";
import { LoginUseCaseImpl, LogoutUseCaseImpl } from "@auth/domain";

let clientContainer: AuthClientContainer | null = null;

export function getAuthClientContainer() {
  if (!clientContainer) {
    // 1. Infrastructure
    const sessionManager = new ClientSessionManager();
    const tokenProvider = new ClientTokenProvider(sessionManager);
    const httpClient = new FetchHttpClient({
      baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
      credentials: "include", // ✅ MUST for cookies
    });
    const authenticatedClient = new AuthenticatedHttpClient(
      httpClient,
      tokenProvider
    );

    // 2. Data
    const repository = new AuthRepositoryImpl(authenticatedClient);

    // 3. Domain - Individual UseCase getters
    clientContainer = {
      getLoginWithOAuth: () => new LoginUseCaseImpl(repository, sessionManager),
      getLogout: () => new LogoutUseCaseImpl(repository, sessionManager),
    };
  }

  return clientContainer;
}

export type AuthClientContainer = {
  getLoginWithOAuth: () => LoginUseCaseImpl;
  getLogout: () => LogoutUseCaseImpl;
};
```

#### Usage Examples

```typescript
// ✅ Client Component
"use client";
export const LogoutButton = () => {
  const handleLogout = async () => {
    const container = getAuthClientContainer();
    const useCase = container.getLogout();
    await useCase.execute();
  };
  return <Button onClick={handleLogout}>Logout</Button>;
};

// ✅ Query Hook
"use client";
export function useGetMyProfile() {
  const container = getUserClientContainer();
  const useCase = container.getGetMyProfile();

  return useQuery({
    queryKey: ["user", "profile", "me"],
    queryFn: () => useCase.execute(),
  });
}
```

## Infrastructure Layer

### HttpClient (Decorator Pattern)

```
FetchHttpClient (Base)
    ↓
AuthenticatedHttpClient (adds Authorization header)
    ↓
Repository (API calls)
```

### SessionManager (Server vs Client)

| Feature | Server | Client |
|---------|--------|--------|
| **Storage** | httpOnly cookies | localStorage |
| **Access** | Next.js `cookies()` | Browser localStorage API |
| **Security** | High (httpOnly, secure) | Medium (XSS vulnerable) |
| **Use Case** | Server Components, SSR | Client Components, CSR |

## NEVER Rules

- **NEVER** use Client Container in Server Components
  - ❌ `getXXXClientContainer()` in Server Component = Singleton in SSR!

- **NEVER** use Server Container in Client Components
  - ❌ `createXXXServerContainer()` in Client = No cookies() API!

- **NEVER** directly instantiate Repository or UseCase
  - ❌ `new UserRepository(httpClient)`
  - ✅ `container.getUserRepository()`

- **NEVER** forget `'use client'` directive in client container
  - ❌ Client container without directive = Build error

- **NEVER** omit `credentials: 'include'` in client HttpClient
  - ❌ No credentials = No cookies sent

## Quick Reference

| Context | Container | SessionManager | TokenProvider |
|---------|-----------|----------------|---------------|
| Server Component | `createXXXServerContainer()` | ServerSessionManager | ServerTokenProvider |
| Client Component | `getXXXClientContainer()` | ClientSessionManager | ClientTokenProvider |
| Middleware (Edge) | `createXXXServerContainer(apiUrl)` | ServerSessionManager | ServerTokenProvider |

## baseUrl Parameter (Edge Runtime)

### When to Use

- ✅ Middleware (Edge Runtime)
- ✅ Edge API Routes
- ✅ Testing (mock API URL)
- ✅ Multi-tenant (API URL varies)

### When NOT to Use

- ❌ Regular Server Components (use env var)
- ❌ Client Components (not applicable)

### Pattern

```typescript
// Regular Server Component - NO baseUrl needed
const container = createAuthServerContainer();

// Edge Runtime - EXPLICIT baseUrl
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const container = createAuthServerContainer(apiUrl);
```

---

**Related**: See `ddd/` for Repository/UseCase patterns
