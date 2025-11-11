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
