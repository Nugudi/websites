---
description: Dependency Injection Container rules - Server vs Client
globs:
  - "**/di/**/*-container.ts"
  - "**/di/**/*-container.tsx"
alwaysApply: true
---

# DI Container Rules

## Table of Contents

- [⚠️ Critical Import Pattern (HIGHEST PRIORITY)](#️-critical-import-pattern-highest-priority)
  - [Why Direct Imports? (Understanding the Problem)](#why-direct-imports-understanding-the-problem)
- [Container Types](#container-types)
  - [Server Container (Stateless, Per-Request)](#server-container-stateless-per-request)
  - [Client Container (Singleton, Lazy Initialized)](#client-container-singleton-lazy-initialized)
- [Infrastructure Layer](#infrastructure-layer)
  - [HttpClient (Decorator Pattern)](#httpclient-decorator-pattern)
  - [SessionManager (Server vs Client)](#sessionmanager-server-vs-client)
- [NEVER Rules](#never-rules)
- [Quick Reference](#quick-reference)
- [baseUrl Parameter (Edge Runtime)](#baseurl-parameter-edge-runtime)

## ⚠️ Critical Import Pattern (HIGHEST PRIORITY)

**ALWAYS import containers directly from the specific file**, NOT from barrel exports at `@domain/di`.

```typescript
// ✅ CORRECT: Direct imports from specific files
import { createUserServerContainer } from '@/src/domains/user/di/user-server-container';
import { getUserClientContainer } from '@/src/domains/user/di/user-client-container';

// ❌ WRONG: Barrel export from @user/di
import { createUserServerContainer, getUserClientContainer } from '@user/di';
```

### Why Direct Imports? (Understanding the Problem)

Using barrel exports at `@domain/di` causes **both server and client containers to bundle together**, breaking webpack's tree-shaking:

**The Problem:**
1. Barrel export (`export * from './di'`) bundles BOTH `*-server-container.ts` AND `*-client-container.ts`
2. Webpack cannot tree-shake properly when using `export *`
3. `server-only` package gets bundled in client code → **Build fails with error**
4. Client bundle becomes bloated with unused server dependencies (SessionManager, localStorage, etc.)

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

**Solution:** Always use direct file imports with absolute paths.

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

**Why These Rules Exist:**

1. **Why stateless (new instance per request)?**
   - Prevents memory leaks in server environment (each request gets fresh container)
   - Avoids state pollution between concurrent requests
   - Ensures thread safety in Next.js server runtime
   - Container lifecycle = Request lifecycle (automatic cleanup)

2. **Why ServerSessionManager (httpOnly cookies)?**
   - **Security**: httpOnly cookies are immune to XSS attacks (JavaScript cannot access)
   - **SSR Compatibility**: Server Components can read cookies via `cookies()` from `next/headers`
   - **Automatic Token Injection**: SessionManager provides tokens to ServerTokenProvider
   - **No localStorage**: Server environment has no browser APIs

3. **Why ServerTokenProvider?**
   - Automatically injects Authorization headers from cookies
   - Decouples authentication logic from repositories
   - Centralized token refresh logic
   - Works seamlessly with httpOnly cookies

4. **Why optional baseUrl parameter?**
   - **Edge Runtime Compatibility**: Edge Runtime cannot access Node.js `process.env` directly
   - **Testing**: Allows mocking API URL in tests
   - **Multi-tenant**: Different tenants might use different API URLs
   - **Fallback to env var**: Regular Server Components use `process.env.NEXT_PUBLIC_API_URL`

5. **Why throw error if no baseUrl?**
   - **Fail Fast**: Better to fail at container creation than during API call
   - **Clear Error Message**: Immediately tells developer what's missing
   - **Prevents Silent Failures**: No undefined URL in HTTP client

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

**Why These Rules Exist:**

1. **Why lazy singleton (one instance per app)?**
   - **Performance**: Creating repositories/HttpClients is expensive, do it once
   - **State Consistency**: Same container = Same session manager = Consistent auth state
   - **Memory Efficiency**: One container for entire client-side app lifecycle
   - **Lazy Initialization**: Container only created when first needed, not on module load

2. **Why ClientSessionManager (localStorage)?**
   - **Browser Environment**: Client Components run in browser, have access to localStorage
   - **Token Persistence**: Tokens survive page refreshes (unlike in-memory state)
   - **Accessibility**: JavaScript can read/write tokens (needed for client-side auth flows)
   - **Complementary to httpOnly**: Works alongside server's httpOnly cookies

3. **Why ClientTokenProvider?**
   - Automatically injects Authorization headers from localStorage
   - Centralized token refresh logic for client-side requests
   - Decouples auth logic from business logic
   - Consistent with Server Container pattern (same interface)

4. **Why 'use client' directive at top?**
   - **Required by Next.js**: Container uses browser APIs (localStorage, window)
   - **Build Error Prevention**: Without directive, Next.js tries to bundle for server
   - **Clear Intent**: Signals this code ONLY runs in browser
   - **Tree-shaking**: Helps bundler separate client from server code

5. **Why credentials: 'include'?**
   - **httpOnly Cookie Transmission**: Browser must send httpOnly cookies with requests
   - **CORS Credentials**: Required for cross-origin requests with cookies
   - **Dual Auth**: Client uses localStorage tokens + server uses httpOnly cookies
   - **Security**: Ensures server can validate httpOnly session cookie

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
