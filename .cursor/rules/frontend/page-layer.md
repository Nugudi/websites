---
description: Page layer rules - Server Component, data prefetching with DI Container
globs:
  - "app/**/**/page.tsx"
  - "app/**/page.ts"
alwaysApply: true
---

# Page Layer Rules

**Type**: Server Component
**Purpose**: Route entry point, data prefetching with DI Container, metadata setup

## Table of Contents

- [MUST Rules](#must-rules)
- [NEVER Rules](#never-rules)
- [Example: Correct Page Implementation](#example-correct-page-implementation)
- [Example: Wrong Patterns](#example-wrong-patterns)
- [Server Container Usage](#server-container-usage)
- [Data Flow](#data-flow)
- [Key Benefits](#key-benefits)

## MUST Rules

1. **MUST be Server Component** — Pages are Server Components by default in Next.js 16 App Router
2. **MUST use Server Container** — Use `createXXXServerContainer()` for UseCase injection (creates new instance per request)
3. **MUST prefetch data for SSR** — Use `queryClient.prefetchQuery()` with UseCase for server-side data fetching
4. **MUST wrap with HydrationBoundary** — Wrap View in `<HydrationBoundary state={dehydrate(queryClient)}>` for cache hydration
5. **MUST use default export** — Pages MUST use `export default` (Next.js requirement)
6. **MUST get UseCases from Container** — Use `container.getGetXXX()` pattern (individual UseCase getters)
7. **MUST call UseCase.execute()** — UseCases are executed with `.execute()` method

## NEVER Rules

1. **NEVER contain UI logic** — Pages are routing entry points, not UI components
2. **NEVER use hooks** — Server Components cannot use `useState`, `useEffect`, etc.
3. **NEVER use browser APIs** — Server Components run on server, no `window`, `document`, etc.
4. **NEVER use Client Container** — NEVER use `getXXXClientContainer()` on server (breaks SSR with singleton)
5. **NEVER instantiate Repository/UseCase directly** — ALWAYS get from DI Container
6. **NEVER use named export** — Pages require default export for Next.js routing

**Why These Rules Exist:**

**MUST Rules Explained:**

1. **Why MUST be Server Component?**
   - **SSR Performance**: Server Components fetch data on server before HTML sent to browser
   - **SEO Optimization**: Search engines see fully rendered HTML with data
   - **Reduced Bundle Size**: Server Components don't ship JavaScript to client
   - **Security**: Sensitive logic stays on server (API keys, database access)
   - **Next.js Default**: App Router makes all components Server Components by default

2. **Why MUST use Server Container?**
   - **Stateless Per-Request**: Each request gets fresh container, prevents state pollution
   - **httpOnly Cookie Access**: Server Container uses ServerSessionManager for secure cookies
   - **No Singleton Issues**: Factory pattern ensures no memory leaks in server environment
   - **Automatic Token Injection**: ServerTokenProvider reads tokens from cookies automatically
   - **Thread Safety**: New instance per request = No concurrent request conflicts

3. **Why MUST prefetch data for SSR?**
   - **Eliminates Client Waterfall**: Data fetched on server before HTML sent to browser
   - **Faster Initial Load**: User sees content immediately without loading states
   - **SEO Benefit**: Search engines index real content, not loading skeletons
   - **Better UX**: No flash of loading states on initial page load
   - **Cache Reuse**: Prefetched data hydrates client-side query cache automatically

4. **Why MUST wrap with HydrationBoundary?**
   - **Cache Hydration**: Transfers server-side query cache to client-side React Query
   - **No Double Fetch**: Client Components reuse prefetched data from same Query Key
   - **Seamless Transition**: Server → Client handoff without refetching
   - **Type Safety**: Dehydrated state maintains type information
   - **React Query Requirement**: Without HydrationBoundary, client-side queries refetch

5. **Why MUST use default export?**
   - **Next.js Routing Requirement**: File-based routing only recognizes default exports
   - **Build Error Prevention**: Named export = Page not recognized = 404
   - **Convention Consistency**: All Next.js pages use default export
   - **Framework Contract**: Breaking this rule breaks Next.js routing system

6. **Why MUST get UseCases from Container?**
   - **Dependency Injection**: Container manages dependencies (Repository, HttpClient, SessionManager)
   - **Testability**: Can mock container in tests instead of mocking multiple dependencies
   - **Flexibility**: Swap implementations without changing Page code
   - **Type Safety**: Container provides type-safe UseCase instances
   - **Single Source of Truth**: Container centralizes dependency wiring

7. **Why MUST call UseCase.execute()?**
   - **Command Pattern**: Execute method clearly signals action execution
   - **Consistency**: All UseCases have same interface (`.execute()`)
   - **Type Safety**: Execute method enforces parameter types
   - **Error Handling**: Execute method can handle errors consistently
   - **Testability**: Easy to verify execute was called with correct params

**NEVER Rules Explained:**

1. **Why NEVER contain UI logic?**
   - **Separation of Concerns**: Pages are routing entry points, Views handle UI orchestration
   - **Maintainability**: UI logic in Views = Easier to find and modify
   - **Reusability**: Views can be reused across multiple Pages/routes
   - **Testability**: UI logic in Views = Can test independently from routing
   - **Clear Responsibilities**: Page = Data prefetch, View = Layout, Section = Feature logic

2. **Why NEVER use hooks?**
   - **Server Component Constraint**: Hooks are client-side React APIs, incompatible with server
   - **Build Error**: Using hooks in Server Component = React error at runtime
   - **Wrong Layer**: Hooks belong in Client Components (Sections, Components)
   - **Execution Context**: Server Components render once on server, hooks need client lifecycle

3. **Why NEVER use browser APIs?**
   - **Execution Environment**: Server Components run in Node.js, not browser
   - **Runtime Error**: `window`, `document`, `localStorage` are undefined on server
   - **SSR Safety**: Browser APIs break server-side rendering
   - **Use Client Components**: Browser APIs belong in Client Components with `'use client'` directive

4. **Why NEVER use Client Container?**
   - **Singleton in SSR**: Client Container is lazy singleton, shares state across requests
   - **Memory Leak**: Singleton in server environment = Data persists between users
   - **Security Risk**: User A's session tokens could leak to User B
   - **State Pollution**: One user's cache/state contaminates another user's request
   - **Use Server Container**: Server Container creates new instance per request (stateless)

5. **Why NEVER instantiate Repository/UseCase directly?**
   - **Tight Coupling**: Direct instantiation = Hard-coded dependencies
   - **No Testability**: Can't mock dependencies in tests
   - **Missing Infrastructure**: Repository needs HttpClient, TokenProvider, SessionManager
   - **Type Unsafety**: Manual wiring = Easy to forget required dependencies
   - **Container Benefits**: Container handles all dependency wiring automatically

6. **Why NEVER use named export?**
   - **Next.js Routing Failure**: Named export = Page not registered in routing system
   - **404 Error**: Route exists but Next.js can't find page component
   - **Framework Contract**: Next.js specifically looks for `export default`
   - **Build Warning**: Next.js may emit warnings about missing default export
   - **Convention Violation**: All Next.js pages use default export universally

## Example: Correct Page Implementation

```typescript
// ✅ CORRECT Page Implementation
// File: app/page.tsx (home page shows cafeteria)
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { createUserServerContainer } from '@/src/domains/user/di/user-server-container';
import { CafeteriaHomeView } from '@/src/domains/cafeteria/presentation/views/cafeteria-home-view';
import getQueryClient from '@core/infrastructure/configs/tanstack-query/get-query-client';

const Page = async ({ params, searchParams }) => {
  const queryClient = getQueryClient();

  // ✅ Server Container (new instance per request)
  const container = createUserServerContainer();
  const getMyProfileUseCase = container.getGetMyProfile();

  // ✅ Prefetch data with UseCase (auto token injection)
  await queryClient.prefetchQuery({
    queryKey: ['user', 'profile'],
    queryFn: () => getMyProfileUseCase.execute(),
  });

  // ✅ Return View with HydrationBoundary
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CafeteriaHomeView />
    </HydrationBoundary>
  );
};

export default Page; // ✅ Default export
```

## Example: Wrong Patterns

```typescript
// ❌ WRONG Examples
const Page = () => {
  // ❌ Using Client Container on server
  const container = getUserClientContainer();

  // ❌ Using hooks in Server Component
  const [state, setState] = useState();

  // ❌ Direct Repository instantiation
  const repository = new UserRepository();

  // ❌ No HydrationBoundary
  return <CafeteriaHomeView />;
};

export const Page = () => {}; // ❌ Named export (should be default)
```

## Server Container Usage

```typescript
// ✅ CORRECT - Regular usage
const container = createAuthServerContainer(); // Uses env var

// ✅ CORRECT - Edge Runtime (explicit baseUrl)
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const container = createAuthServerContainer(apiUrl);
```

## Data Flow

```
Page (Server Container)
  ↓ prefetchQuery with UseCase
  ↓ dehydrate query cache
  ↓ pass to HydrationBoundary
  ↓
View
  ↓ compose Sections
  ↓
Section (Client Container)
  ↓ reuse cached data with same Query Key
```

## Key Benefits

- **SSR Performance**: Data prefetched on server, no client waterfall
- **SEO**: Fully rendered HTML with data
- **Cache Reuse**: Page prefetches, Section reuses from cache
- **Type Safety**: UseCase layer provides type-safe data flow

---

**Related**: See `ddd/di-containers.md` for Container patterns, `section-layer.md` for data fetching
