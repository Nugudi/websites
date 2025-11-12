---
description: Next.js Page patterns - Server DI Container usage, data prefetching with UseCases, HydrationBoundary setup, and metadata generation
globs:
  - "app/**/page.tsx"
  - "app/**/page.ts"
alwaysApply: true
---

# Page Layer Patterns

> **Document Type**: Frontend Component Architecture - Page Layer
> **Target Audience**: Frontend developers implementing Next.js pages
> **Related Documents**: [component-hierarchy.md](./component-hierarchy.md), [view-patterns.md](./view-patterns.md), [../packages.md](../packages.md)
> **Last Updated**: 2025-11-11

## What is a Page?

A **Page** is a Next.js App Router route entry point that:
- Defines a URL route in your application
- Prefetches data on the server for optimal SSR performance
- Sets up data hydration for client-side components
- Configures page metadata (title, description, OpenGraph)
- Passes route parameters and search params to Views

**Type**: Server Component (default in Next.js App Router)
**Location**: `app/(auth|public)/[route]/page.tsx`
**Export**: MUST use `export default` (Next.js requirement)

## Page Responsibilities

### ✅ What Pages MUST Do

1. **Server Component by Default** - Pages are Server Components in Next.js 16 App Router
2. **Use Server DI Container** - Get UseCases from `createXXXServerContainer()` (creates new instance per request)
3. **Prefetch Data for SSR** - Use `queryClient.prefetchQuery()` with UseCase for server-side data fetching
4. **Wrap with HydrationBoundary** - Wrap View in `<HydrationBoundary state={dehydrate(queryClient)}>` for cache hydration
5. **Use Default Export** - Pages MUST use `export default` (Next.js routing requirement)
6. **Get UseCases from Container** - Use `container.getGetXXX()` pattern (individual UseCase getters)
7. **Call UseCase.execute()** - UseCases are executed with `.execute()` method

### ❌ What Pages MUST NOT Do

1. **Contain UI Logic** - Pages are routing entry points, not UI components
2. **Use Hooks** - Server Components cannot use `useState`, `useEffect`, etc.
3. **Use Browser APIs** - Server Components run on server, no `window`, `document`, etc.
4. **Use Client DI Container** - NEVER use `getXXXClientContainer()` on server (breaks SSR with singleton)
5. **Instantiate Repository/UseCase Directly** - ALWAYS get from DI Container
6. **Use Named Export** - Pages require default export for Next.js routing

## Server DI Container Usage

### ⚠️ Critical: Direct Import Required

**ALWAYS import Server DI Container directly from the specific file**, NOT from barrel exports:

```typescript
// ✅ CORRECT: Direct import from server-container file
import { createUserServerContainer } from '@/src/domains/user/di/user-server-container';

// ❌ WRONG: Barrel export from @user/di
import { createUserServerContainer } from '@user/di';
```

**Why?** Barrel exports bundle both server and client containers together, causing webpack to fail tree-shaking. This leads to `server-only` package errors in client code and build failures.

### Why Server DI Container?

Pages run on the server and need:
- **Fresh instances per request** - Stateless, no shared state between requests
- **Automatic token injection** - Server DI Container reads cookies/headers automatically
- **Type-safe UseCase access** - Individual getters for each UseCase

### Server DI Container Pattern

```typescript
// ✅ CORRECT - Server DI Container in Page
import { createUserServerContainer } from '@/src/domains/user/di/user-server-container';

const Page = async () => {
  // 1. Create Server DI Container (new instance per request)
  const container = createUserServerContainer();

  // 2. Get individual UseCase
  const getMyProfileUseCase = container.getGetMyProfile();

  // 3. Execute UseCase (auto token injection from cookies)
  const result = await getMyProfileUseCase.execute();

  return <ProfileView data={result} />;
};

export default Page;
```

### ❌ Wrong Patterns

```typescript
// ❌ WRONG - Using Client DI Container on server
import { getUserClientContainer } from '@/src/domains/user/di/user-client-container';

const Page = async () => {
  const container = getUserClientContainer(); // NO! Singleton breaks SSR
  // ...
};

// ❌ WRONG - Direct Repository instantiation
import { UserRepository } from '@/src/domains/user/data/repositories/user.repository';

const Page = async () => {
  const repository = new UserRepository(); // NO! Breaks DI
  // ...
};

// ❌ WRONG - Direct UseCase instantiation
import { GetMyProfileUseCase } from '@/src/domains/user/domain/usecases/get-my-profile.usecase';

const Page = async () => {
  const useCase = new GetMyProfileUseCase(); // NO! Breaks DI
  // ...
};
```

## Data Prefetching with TanStack Query

### Why Prefetch?

Prefetching data on the server:
- Enables **Server-Side Rendering (SSR)** - HTML includes actual data, not loading states
- Improves **SEO** - Search engines see real content
- Reduces **Time to Interactive (TTI)** - Faster initial page load
- Eliminates **Loading States** - Users see content immediately

### Prefetch Pattern with HydrationBoundary

```typescript
// ✅ CORRECT - Complete Prefetch Pattern
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { createUserServerContainer } from '@/src/domains/user/di/user-server-container';
import { ProfileView } from '@/src/domains/user/presentation/ui/views/profile-view';
import getQueryClient from '@core/infrastructure/configs/tanstack-query/get-query-client';

const Page = async () => {
  // 1. Get TanStack Query Client (server-side instance)
  const queryClient = getQueryClient();

  // 2. Create Server DI Container
  const container = createUserServerContainer();
  const getMyProfileUseCase = container.getGetMyProfile();

  // 3. Prefetch data with UseCase
  await queryClient.prefetchQuery({
    queryKey: ['user', 'profile'], // Same key as client-side query
    queryFn: () => getMyProfileUseCase.execute(), // UseCase → Repository → DataSource
  });

  // 4. Dehydrate query client state
  const dehydratedState = dehydrate(queryClient);

  // 5. Wrap View with HydrationBoundary
  return (
    <HydrationBoundary state={dehydratedState}>
      <ProfileView />
    </HydrationBoundary>
  );
};

export default Page;
```

### How HydrationBoundary Works

```
┌─────────────────────────────────────────────────────────┐
│ SERVER (Page)                                           │
│ 1. queryClient.prefetchQuery({ queryKey: ['user'] })   │
│ 2. Data fetched: { id: 1, name: "John" }               │
│ 3. dehydrate(queryClient) → Serialized cache            │
└─────────────────────────────────────────────────────────┘
                         │
                         ▼ (Hydration)
┌─────────────────────────────────────────────────────────┐
│ CLIENT (Section)                                        │
│ 1. useSuspenseQuery({ queryKey: ['user'] })            │
│ 2. TanStack Query checks cache → CACHE HIT!            │
│ 3. No network request - instant render                 │
└─────────────────────────────────────────────────────────┘
```

**Key Points**:
- **Same queryKey** - Client and server must use identical query keys
- **Cache Reuse** - Client components reuse prefetched data
- **Zero Extra Requests** - No duplicate API calls on client
- **Fast Rendering** - No loading states on initial render

## Complete Implementation Examples

### Example 1: Simple Page with Single Data Source

```typescript
// File: app/(auth)/profile/page.tsx
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { createUserServerContainer } from '@/src/domains/user/di/user-server-container';
import { ProfileView } from '@/src/domains/user/presentation/ui/views/profile-view';
import getQueryClient from '@core/infrastructure/configs/tanstack-query/get-query-client';

const Page = async () => {
  const queryClient = getQueryClient();

  // Server DI Container for User domain
  const container = createUserServerContainer();
  const getMyProfileUseCase = container.getGetMyProfile();

  // Prefetch user profile
  await queryClient.prefetchQuery({
    queryKey: ['user', 'profile'],
    queryFn: () => getMyProfileUseCase.execute(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProfileView />
    </HydrationBoundary>
  );
};

export default Page;
```

### Example 2: Page with Multiple Data Sources

```typescript
// File: app/(auth)/dashboard/page.tsx
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { createUserServerContainer } from '@/src/domains/user/di/user-server-container';
import { createBenefitServerContainer } from '@/src/domains/benefit/di/benefit-server-container';
import { DashboardView } from '@/src/domains/user/presentation/ui/views/dashboard-view';
import getQueryClient from '@core/infrastructure/configs/tanstack-query/get-query-client';

const Page = async () => {
  const queryClient = getQueryClient();

  // Multiple Server DI Containers
  const userContainer = createUserServerContainer();
  const benefitContainer = createBenefitServerContainer();

  const getMyProfileUseCase = userContainer.getGetMyProfile();
  const getBenefitListUseCase = benefitContainer.getGetBenefitList();

  // Prefetch multiple queries in parallel
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ['user', 'profile'],
      queryFn: () => getMyProfileUseCase.execute(),
    }),
    queryClient.prefetchQuery({
      queryKey: ['benefits', 'list'],
      queryFn: () => getBenefitListUseCase.execute(),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DashboardView />
    </HydrationBoundary>
  );
};

export default Page;
```

### Example 3: Page with Dynamic Route Params

```typescript
// File: app/(auth)/cafeterias/[cafeteriaId]/page.tsx
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { createCafeteriaServerContainer } from '@/src/domains/cafeteria/di/cafeteria-server-container';
import { CafeteriaDetailView } from '@/src/domains/cafeteria/presentation/ui/views/cafeteria-detail-view';
import getQueryClient from '@core/infrastructure/configs/tanstack-query/get-query-client';

type PageProps = {
  params: Promise<{
    cafeteriaId: string;
  }>;
};

const Page = async ({ params }: PageProps) => {
  const queryClient = getQueryClient();

  // Await params (Next.js 16 requirement)
  const { cafeteriaId } = await params;

  // Server DI Container
  const container = createCafeteriaServerContainer();
  const getCafeteriaDetailUseCase = container.getGetCafeteriaDetail();

  // Prefetch with dynamic params
  await queryClient.prefetchQuery({
    queryKey: ['cafeterias', 'detail', cafeteriaId],
    queryFn: () => getCafeteriaDetailUseCase.execute({ id: cafeteriaId }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CafeteriaDetailView cafeteriaId={cafeteriaId} />
    </HydrationBoundary>
  );
};

export default Page;
```

### Example 4: Page with Search Params

```typescript
// File: app/(auth)/cafeterias/page.tsx
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { createCafeteriaServerContainer } from '@/src/domains/cafeteria/di/cafeteria-server-container';
import { CafeteriaListView } from '@/src/domains/cafeteria/presentation/ui/views/cafeteria-list-view';
import getQueryClient from '@core/infrastructure/configs/tanstack-query/get-query-client';

type PageProps = {
  searchParams: Promise<{
    filter?: string;
    page?: string;
  }>;
};

const Page = async ({ searchParams }: PageProps) => {
  const queryClient = getQueryClient();

  // Await searchParams (Next.js 16 requirement)
  const params = await searchParams;
  const filter = params.filter ?? 'all';
  const page = parseInt(params.page ?? '1', 10);

  // Server DI Container
  const container = createCafeteriaServerContainer();
  const getCafeteriaListUseCase = container.getGetCafeteriaList();

  // Prefetch with search params
  await queryClient.prefetchQuery({
    queryKey: ['cafeterias', 'list', filter, page],
    queryFn: () => getCafeteriaListUseCase.execute({ filter, page }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CafeteriaListView filter={filter} page={page} />
    </HydrationBoundary>
  );
};

export default Page;
```

## Metadata Generation

### Static Metadata

```typescript
// File: app/(auth)/profile/page.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Profile | Nugudi',
  description: 'View and edit your profile',
  openGraph: {
    title: 'Profile | Nugudi',
    description: 'View and edit your profile',
    type: 'website',
  },
};

const Page = async () => {
  // ... page implementation
};

export default Page;
```

### Dynamic Metadata with Route Params

```typescript
// File: app/(auth)/cafeterias/[cafeteriaId]/page.tsx
import type { Metadata } from 'next';
import { createCafeteriaServerContainer } from '@/src/domains/cafeteria/di/cafeteria-server-container';

type PageProps = {
  params: Promise<{
    cafeteriaId: string;
  }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { cafeteriaId } = await params;

  // Fetch cafeteria data for metadata with Server DI Container
  const container = createCafeteriaServerContainer();
  const getCafeteriaDetailUseCase = container.getGetCafeteriaDetail();
  const cafeteria = await getCafeteriaDetailUseCase.execute({ id: cafeteriaId });

  return {
    title: `${cafeteria.name} | Nugudi`,
    description: cafeteria.description,
    openGraph: {
      title: `${cafeteria.name} | Nugudi`,
      description: cafeteria.description,
      images: [cafeteria.imageUrl],
      type: 'website',
    },
  };
}

const Page = async ({ params }: PageProps) => {
  // ... page implementation
};

export default Page;
```

## MUST/NEVER Rules for Pages

### ✅ MUST Rules

1. **MUST be Server Component** - Pages are Server Components by default in Next.js 16

   **Why?** Server Components enable SSR data prefetching for faster initial page loads, reduce JavaScript bundle size (no client-side React for static content), and allow secure server-only operations (database queries, API keys). Pages being Server Components by default in Next.js 16 App Router provides better performance, SEO, and security compared to client-side rendering.

2. **MUST use Server DI Container** - Use `createXXXServerContainer()` for UseCase injection

   **Why?** Server DI Container uses factory pattern (creates new instance per request), ensuring each page request gets fresh instances for proper SSR isolation and preventing state leakage between requests. Client DI Container uses lazy singleton pattern, which would share state across all requests in SSR, causing security issues and data corruption. Server Container provides request-level isolation.

3. **MUST prefetch data for SSR** - Use `queryClient.prefetchQuery()` with UseCase

   **Why?** Prefetching data during SSR populates TanStack Query cache before hydration, enabling instant page display without loading states (better UX and perceived performance). Without prefetching, users see Skeleton components even though the server could have rendered complete content, wasting SSR benefits. Prefetching provides fast initial loads and smooth hydration with no loading flicker.

4. **MUST wrap with HydrationBoundary** - Wrap View in `<HydrationBoundary state={dehydrate(queryClient)}>`

   **Why?** HydrationBoundary transfers server-prefetched data to the client TanStack Query cache, enabling seamless hydration without refetching (preventing duplicate requests and loading states). Without HydrationBoundary, client-side queries refetch data the server already loaded, wasting bandwidth and showing unnecessary loading states. HydrationBoundary ensures efficient cache reuse between server and client.

5. **MUST use default export** - Pages require `export default` (Next.js requirement)

   **Why?** Next.js App Router file-based routing requires default exports to identify page components, making this a framework requirement not a convention choice. Named exports won't be recognized as pages by Next.js, causing routing failures. Default export is the standard contract between Next.js and page components for automatic route generation.

6. **MUST get UseCases from Container** - Use `container.getGetXXX()` pattern

   **Why?** DI Container provides dependency injection, loose coupling, and testability by abstracting UseCase instantiation and dependency management. Direct instantiation creates tight coupling to concrete implementations, makes testing difficult (can't mock dependencies), and violates dependency inversion principle. Containers enable clean architecture, test isolation, and flexible dependency swapping.

7. **MUST call UseCase.execute()** - UseCases are executed with `.execute()` method

   **Why?** The `.execute()` method is the standard interface for all UseCases, providing consistent API across the entire application and clear intent (executing business logic). This convention makes code predictable, improves IDE autocomplete, and follows Command pattern where UseCases encapsulate operations. Consistency in UseCase invocation improves code readability and maintainability.

8. **MUST await params/searchParams** - In Next.js 16, params and searchParams are Promises

   **Why?** Next.js 16 changed params and searchParams to Promises to support streaming and partial prerendering, requiring await for proper SSR. Without await, you get Promise objects instead of actual values, causing runtime errors and type mismatches. This breaking change in Next.js 16 ensures compatibility with modern rendering features and proper async data flow.

### ❌ NEVER Rules

1. **NEVER contain UI logic** - Pages are routing entry points, not UI components

   **Why?** Pages mixing UI logic with routing concerns violates Single Responsibility Principle, reduces component reusability (UI becomes coupled to specific routes), and makes testing difficult. Pages should delegate UI rendering to View components, focusing solely on data prefetching, authentication, and routing. Separating concerns improves maintainability, testability, and allows Views to be reused across different routes.

2. **NEVER use hooks** - Server Components cannot use `useState`, `useEffect`, etc.

   **Why?** React hooks (useState, useEffect, useContext) are client-side APIs that rely on browser runtime and component lifecycle, causing runtime errors in Server Components ("Hooks can only be called from Client Components"). Server Components run during SSR without browser context, making hooks incompatible. Use Server Components for data prefetching and Client Components (Sections) for interactive features requiring hooks.

3. **NEVER use browser APIs** - No `window`, `document`, `localStorage`, etc.

   **Why?** Browser APIs (window, document, localStorage) don't exist in Node.js server environment where Server Components execute during SSR, causing runtime errors ("window is not defined"). Attempting to access these APIs breaks SSR and causes hydration mismatches. Browser APIs must be used only in Client Components where they safely execute in the browser environment.

4. **NEVER use Client DI Container** - `getXXXClientContainer()` breaks SSR with singleton

   **Why?** Client DI Container uses lazy singleton pattern, which shares a single instance across all SSR requests, causing state leakage between different users' requests (security vulnerability) and data corruption. Server Components need Server DI Container's factory pattern to create fresh instances per request, ensuring proper isolation. Using Client Container in SSR creates critical security and correctness issues.

5. **NEVER instantiate Repository/UseCase directly** - Always get from DI Container

   **Why?** Direct instantiation bypasses dependency injection, creating tight coupling to concrete implementations (making code untestable and inflexible). It forces manual dependency management (error-prone, especially with complex dependency graphs), and violates dependency inversion principle. DI Containers provide loose coupling, testability through mock injection, and centralized dependency configuration.

6. **NEVER use named export** - Pages require default export for Next.js routing

   **Why?** Next.js App Router file-based routing system specifically looks for default exports to identify page components, making named exports invisible to the routing system and causing 404 errors. This is a framework requirement, not a style choice. Default export is the contract between Next.js and developers for automatic route generation from file structure.

7. **NEVER skip HydrationBoundary** - Required for cache hydration

   **Why?** Without HydrationBoundary, server-prefetched data in TanStack Query cache doesn't transfer to the client, forcing complete refetching of all data (wasting SSR effort, bandwidth, and showing loading states). HydrationBoundary serializes server cache and rehydrates it on the client, enabling instant page display with prefetched data. Skipping it negates the main benefit of SSR data prefetching.

8. **NEVER use deprecated `@nugudi/api`** - Use UseCase layer instead

   **Why?** The deprecated `@nugudi/api` package bypasses the UseCase layer, violating Clean Architecture by allowing Presentation to directly call Data layer. This eliminates business logic encapsulation (no validation, no single place for rules), creates tight coupling to API implementation, and prevents proper testing. UseCases provide business logic layer, testability, and clean separation of concerns following architectural principles.

## Common Patterns

### Pattern 1: Protected Page with Auth Check

```typescript
// File: app/(auth)/benefits/page.tsx
import { redirect } from 'next/navigation';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { createUserServerContainer } from '@/src/domains/user/di/user-server-container';
import { createBenefitServerContainer } from '@/src/domains/benefit/di/benefit-server-container';
import { BenefitView } from '@/src/domains/benefit/presentation/ui/views/benefit-view';
import getQueryClient from '@core/infrastructure/configs/tanstack-query/get-query-client';

const Page = async () => {
  const queryClient = getQueryClient();

  // Check authentication
  const userContainer = createUserServerContainer();
  const getMyProfileUseCase = userContainer.getGetMyProfile();

  try {
    await queryClient.prefetchQuery({
      queryKey: ['user', 'profile'],
      queryFn: () => getMyProfileUseCase.execute(),
    });
  } catch (error) {
    // Redirect to login if not authenticated
    redirect('/auth/sign-in');
  }

  // Prefetch benefit data
  const benefitContainer = createBenefitServerContainer();
  const getBenefitListUseCase = benefitContainer.getGetBenefitList();

  await queryClient.prefetchQuery({
    queryKey: ['benefits', 'list'],
    queryFn: () => getBenefitListUseCase.execute(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <BenefitView />
    </HydrationBoundary>
  );
};

export default Page;
```

### Pattern 2: Page with Conditional Prefetch

```typescript
// File: app/(auth)/dashboard/page.tsx
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { createUserServerContainer } from '@/src/domains/user/di/user-server-container';
import { DashboardView } from '@/src/domains/user/presentation/ui/views/dashboard-view';
import getQueryClient from '@core/infrastructure/configs/tanstack-query/get-query-client';

type PageProps = {
  searchParams: Promise<{
    tab?: 'profile' | 'settings' | 'history';
  }>;
};

const Page = async ({ searchParams }: PageProps) => {
  const queryClient = getQueryClient();
  const params = await searchParams;
  const tab = params.tab ?? 'profile';

  // Server DI Container
  const container = createUserServerContainer();

  // Conditional prefetch based on active tab
  if (tab === 'profile') {
    const getMyProfileUseCase = container.getGetMyProfile();
    await queryClient.prefetchQuery({
      queryKey: ['user', 'profile'],
      queryFn: () => getMyProfileUseCase.execute(),
    });
  } else if (tab === 'history') {
    const getMyHistoryUseCase = container.getGetMyHistory();
    await queryClient.prefetchQuery({
      queryKey: ['user', 'history'],
      queryFn: () => getMyHistoryUseCase.execute(),
    });
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DashboardView activeTab={tab} />
    </HydrationBoundary>
  );
};

export default Page;
```

## Related Documentation

- **[component-hierarchy.md](./component-hierarchy.md)** - Overall component hierarchy and layer responsibilities
- **[view-patterns.md](./view-patterns.md)** - View layer implementation guide
- **[section-patterns.md](./section-patterns.md)** - Section layer with Client DI Container usage
- **[../packages.md](../packages.md)** - DDD Architecture, DI Containers, Server vs Client DI Containers
- **[../patterns/hooks-guide.md](../patterns/hooks-guide.md)** - TanStack Query custom hooks for client-side data fetching
