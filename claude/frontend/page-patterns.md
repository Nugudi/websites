---
description: Next.js Page patterns - Server Container usage, data prefetching with UseCases, HydrationBoundary setup, and metadata generation
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
2. **Use Server Container** - Get UseCases from `createXXXServerContainer()` (creates new instance per request)
3. **Prefetch Data for SSR** - Use `queryClient.prefetchQuery()` with UseCase for server-side data fetching
4. **Wrap with HydrationBoundary** - Wrap View in `<HydrationBoundary state={dehydrate(queryClient)}>` for cache hydration
5. **Use Default Export** - Pages MUST use `export default` (Next.js routing requirement)
6. **Get UseCases from Container** - Use `container.getGetXXX()` pattern (individual UseCase getters)
7. **Call UseCase.execute()** - UseCases are executed with `.execute()` method

### ❌ What Pages MUST NOT Do

1. **Contain UI Logic** - Pages are routing entry points, not UI components
2. **Use Hooks** - Server Components cannot use `useState`, `useEffect`, etc.
3. **Use Browser APIs** - Server Components run on server, no `window`, `document`, etc.
4. **Use Client Container** - NEVER use `getXXXClientContainer()` on server (breaks SSR with singleton)
5. **Instantiate Repository/UseCase Directly** - ALWAYS get from DI Container
6. **Use Named Export** - Pages require default export for Next.js routing

## Server Container Usage

### ⚠️ Critical: Direct Import Required

**ALWAYS import Server Container directly from the specific file**, NOT from barrel exports:

```typescript
// ✅ CORRECT: Direct import from server-container file
import { createUserServerContainer } from '@/src/domains/user/di/user-server-container';

// ❌ WRONG: Barrel export from @user/di
import { createUserServerContainer } from '@user/di';
```

**Why?** Barrel exports bundle both server and client containers together, causing webpack to fail tree-shaking. This leads to `server-only` package errors in client code and build failures.

### Why Server Container?

Pages run on the server and need:
- **Fresh instances per request** - Stateless, no shared state between requests
- **Automatic token injection** - Server Container reads cookies/headers automatically
- **Type-safe UseCase access** - Individual getters for each UseCase

### Server Container Pattern

```typescript
// ✅ CORRECT - Server Container in Page
import { createUserServerContainer } from '@/src/domains/user/di/user-server-container';

const Page = async () => {
  // 1. Create Server Container (new instance per request)
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
// ❌ WRONG - Using Client Container on server
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

  // 2. Create Server Container
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

  // Server Container for User domain
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

  // Multiple Server Containers
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

  // Server Container
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

  // Server Container
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

  // Fetch cafeteria data for metadata
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
2. **MUST use Server Container** - Use `createXXXServerContainer()` for UseCase injection
3. **MUST prefetch data for SSR** - Use `queryClient.prefetchQuery()` with UseCase
4. **MUST wrap with HydrationBoundary** - Wrap View in `<HydrationBoundary state={dehydrate(queryClient)}>`
5. **MUST use default export** - Pages require `export default` (Next.js requirement)
6. **MUST get UseCases from Container** - Use `container.getGetXXX()` pattern
7. **MUST call UseCase.execute()** - UseCases are executed with `.execute()` method
8. **MUST await params/searchParams** - In Next.js 16, params and searchParams are Promises

### ❌ NEVER Rules

1. **NEVER contain UI logic** - Pages are routing entry points, not UI components
2. **NEVER use hooks** - Server Components cannot use `useState`, `useEffect`, etc.
3. **NEVER use browser APIs** - No `window`, `document`, `localStorage`, etc.
4. **NEVER use Client Container** - `getXXXClientContainer()` breaks SSR with singleton
5. **NEVER instantiate Repository/UseCase directly** - Always get from DI Container
6. **NEVER use named export** - Pages require default export for Next.js routing
7. **NEVER skip HydrationBoundary** - Required for cache hydration
8. **NEVER use deprecated `@nugudi/api`** - Use UseCase layer instead

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
- **[section-patterns.md](./section-patterns.md)** - Section layer with Client Container usage
- **[../packages.md](../packages.md)** - DDD Architecture, DI Containers, Server vs Client Containers
- **[../hooks-guide.md](../hooks-guide.md)** - TanStack Query custom hooks for client-side data fetching
