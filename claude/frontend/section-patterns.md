---
description: Section patterns - Client DI Container usage, data fetching with TanStack Query, Suspense/ErrorBoundary implementation, Adapter usage, and feature state management
globs:
  - "**/presentation/ui/sections/**/*.tsx"
alwaysApply: true
---

# Section Layer Patterns

> **Document Type**: Frontend Component Architecture - Section Layer
> **Target Audience**: Frontend developers implementing Section components
> **Related Documents**: [component-hierarchy.md](./component-hierarchy.md), [page-patterns.md](./page-patterns.md), [view-patterns.md](./view-patterns.md), [../patterns/adapter-basics.md](../patterns/adapter-basics.md), [../patterns/hooks-guide.md](../patterns/hooks-guide.md)
> **Last Updated**: 2025-11-11

## What is a Section?

A **Section** is a feature-specific component that:
- Encapsulates a self-contained feature with its own data and logic
- Fetches data using Client DI Container and TanStack Query
- Implements error and loading boundaries (ErrorBoundary + Suspense)
- Manages feature-specific state (form state, selection, etc.)
- Orchestrates multiple Components to build the feature UI

**Type**: Client Component (requires `"use client"` directive)
**Location**: `domains/[domain]/presentation/ui/sections/[feature]-section/`
**Export**: MUST use named export (e.g., `export const UserWelcomeSection`)

## Section Responsibilities

### ✅ What Sections MUST Do

1. **Be Client Component** - Sections use `"use client"` directive (data fetching requires client)
2. **Implement Suspense Boundary** - Wrap Content with `<Suspense fallback={<Skeleton />}>`
3. **Implement ErrorBoundary** - Wrap Suspense with `<ErrorBoundary fallback={<Error />}>`
4. **Provide Skeleton Component** - Create Skeleton that matches actual layout
5. **Provide Error Component** - Create Error fallback for failed data fetching
6. **Use Client DI Container** - Get UseCases from `getXXXClientContainer()` (Lazy-initialized Singleton)
7. **Fetch Data with TanStack Query** - Use `useSuspenseQuery` or `useQuery` with UseCase
8. **Use Named Export** - `export const MySection`
9. **Create Content Sub-component** - Separate data fetching logic from boundary setup

### ❌ What Sections MUST NOT Do

1. **Use Server DI Container** - NEVER use `createXXXServerContainer()` in Client Components
2. **Skip Error Handling** - Every Section MUST have ErrorBoundary
3. **Skip Loading State** - Every Section MUST have Suspense with Skeleton
4. **Define Page Layout** - Layout structure is View's responsibility
5. **Import Other Sections** - Sections are independent, composed by Views
6. **Instantiate Repository/UseCase Directly** - ALWAYS get from DI Container

## Client DI Container Usage

### ⚠️ Critical: Direct Import Required

**ALWAYS import Client DI Container directly from the specific file**, NOT from barrel exports:

```typescript
// ✅ CORRECT: Direct import from client-container file
import { getUserClientContainer } from '@/src/domains/user/di/user-client-container';

// ❌ WRONG: Barrel export from @user/di
import { getUserClientContainer } from '@user/di';
```

**Why?** Barrel exports bundle both server and client containers together, causing webpack to fail tree-shaking. This leads to `server-only` package errors in client code and build failures.

### Why Client DI Container?

Sections run on the client and need:
- **Lazy-initialized Singleton** - One shared instance across all components
- **Automatic token injection** - Client DI Container reads from cookies/storage
- **Type-safe UseCase access** - Individual getters for each UseCase
- **Optimized for client-side** - Reuses connection pools, caches tokens

### Client DI Container Pattern

```typescript
// ✅ CORRECT - Client DI Container in Section
"use client";

import { getUserClientContainer } from '@/src/domains/user/di/user-client-container';
import { useSuspenseQuery } from '@tanstack/react-query';

const UserWelcomeSectionContent = () => {
  // 1. Get Client DI Container (Lazy-initialized Singleton)
  const container = getUserClientContainer();

  // 2. Get individual UseCase
  const getMyProfileUseCase = container.getGetMyProfile();

  // 3. Fetch data with TanStack Query
  const { data } = useSuspenseQuery({
    queryKey: ['user', 'profile'],
    queryFn: () => getMyProfileUseCase.execute(),
  });

  return <div>{data.profile?.nickname}</div>;
};
```

### ❌ Wrong Patterns

```typescript
// ❌ WRONG - Using Server DI Container in Client Component
"use client";

import { createUserServerContainer } from '@/src/domains/user/di/user-server-container';

const UserSection = () => {
  const container = createUserServerContainer(); // NO! Breaks on client
  // ...
};

// ❌ WRONG - Direct Repository instantiation
import { UserRepository } from '@/src/domains/user/data/repositories/user.repository';

const UserSection = () => {
  const repository = new UserRepository(); // NO! Breaks DI
  // ...
};

// ❌ WRONG - Using deprecated @nugudi/api
import { getMyProfile } from '@nugudi/api';

const UserSection = () => {
  const { data } = useSuspenseQuery({
    queryKey: ['user', 'profile'],
    queryFn: () => getMyProfile(), // NO! Use UseCase
  });
};
```

## TanStack Query Pattern

### useSuspenseQuery Pattern (Recommended)

```typescript
// ✅ CORRECT - useSuspenseQuery with Suspense Boundary
"use client";

import { useSuspenseQuery } from '@tanstack/react-query';
import { getUserClientContainer } from '@/src/domains/user/di/user-client-container';

const ProfileSectionContent = () => {
  const container = getUserClientContainer();
  const getMyProfileUseCase = container.getGetMyProfile();

  // useSuspenseQuery throws during loading - caught by Suspense
  const { data } = useSuspenseQuery({
    queryKey: ['user', 'profile'],
    queryFn: () => getMyProfileUseCase.execute(),
  });

  // data is ALWAYS defined (never undefined)
  return <div>{data.profile.nickname}</div>;
};
```

**Why useSuspenseQuery?**
- **No loading state checks** - Suspense handles loading automatically
- **Type safety** - `data` is never undefined
- **Better UX** - Skeleton UI replaces loading state
- **Cleaner code** - No `isLoading` conditionals

### useQuery Pattern (When needed)

```typescript
// ✅ CORRECT - useQuery with Manual Loading State
"use client";

import { useQuery } from '@tanstack/react-query';
import { getUserClientContainer } from '@/src/domains/user/di/user-client-container';

const OptionalProfileSectionContent = () => {
  const container = getUserClientContainer();
  const getMyProfileUseCase = container.getGetMyProfile();

  // useQuery for optional data (won't throw on loading/error)
  const { data, isLoading, isError } = useQuery({
    queryKey: ['user', 'profile'],
    queryFn: () => getMyProfileUseCase.execute(),
    retry: false, // Don't retry if user is not logged in
  });

  if (isLoading) return <Skeleton />;
  if (isError) return <ErrorMessage />;
  if (!data) return <EmptyState />;

  return <div>{data.profile.nickname}</div>;
};
```

**When to use useQuery:**
- Optional data that may not exist
- Conditional queries (based on user state)
- Need manual control over loading/error states

## Suspense and ErrorBoundary Implementation

### Complete Boundary Pattern

```typescript
// ✅ CORRECT - Complete Section with Boundaries
"use client";

import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Box } from '@nugudi/react-components-layout';
import { getUserClientContainer } from '@/src/domains/user/di/user-client-container';
import * as styles from './index.css';

// 1. Main Section Component (with boundaries)
export const UserWelcomeSection = () => {
  return (
    <ErrorBoundary fallback={<UserWelcomeSectionError />}>
      <Suspense fallback={<UserWelcomeSectionSkeleton />}>
        <UserWelcomeSectionContent />
      </Suspense>
    </ErrorBoundary>
  );
};

// 2. Skeleton Component (matches actual layout)
const UserWelcomeSectionSkeleton = () => {
  return (
    <Box borderRadius="xl" className={styles.container}>
      <div className={styles.textWrapper}>
        <div className="flex flex-col gap-2">
          <div className="h-7 w-44 animate-pulse rounded bg-zinc-200" />
          <div className="h-7 w-52 animate-pulse rounded bg-zinc-200" />
        </div>
      </div>
    </Box>
  );
};

// 3. Error Component (fallback UI with graceful degradation)
const UserWelcomeSectionError = () => {
  return (
    <Box borderRadius="xl" className={styles.container}>
      <div className={styles.textWrapper}>
        <span className={styles.name}>손님</span>님 오늘도 <br />
        맛난 점심식사다 너굴
      </div>
    </Box>
  );
};

// 4. Content Component (actual data fetching)
const UserWelcomeSectionContent = () => {
  const container = getUserClientContainer();
  const getMyProfileUseCase = container.getGetMyProfile();

  const { data } = useSuspenseQuery({
    queryKey: ['user', 'profile'],
    queryFn: () => getMyProfileUseCase.execute(),
  });

  const nickname = data.profile?.nickname ?? '손님';

  return (
    <Box borderRadius="xl" className={styles.container}>
      <div className={styles.textWrapper}>
        <span className={styles.name}>{nickname}</span>님 오늘도 <br />
        맛난 점심식사다 너굴
      </div>
    </Box>
  );
};
```

### Skeleton Best Practices

```typescript
// ✅ CORRECT - Skeleton Matches Actual Layout
const BenefitListSectionSkeleton = () => {
  return (
    <div className={styles.listContainer}>
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className={styles.skeletonCard}>
          {/* Image Skeleton */}
          <div className="h-48 w-full animate-pulse rounded-t-lg bg-zinc-200" />

          {/* Content Skeleton */}
          <div className="p-4 space-y-3">
            <div className="h-6 w-3/4 animate-pulse rounded bg-zinc-200" />
            <div className="h-4 w-full animate-pulse rounded bg-zinc-200" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-zinc-200" />
          </div>
        </div>
      ))}
    </div>
  );
};
```

**Skeleton Guidelines:**
- **Match layout** - Skeleton should match actual component structure
- **Realistic count** - Show expected number of items (3-5 cards, etc.)
- **Proper sizing** - Use actual dimensions, not placeholders
- **Smooth animation** - Use `animate-pulse` or custom animation

### Error Fallback Best Practices

```typescript
// ✅ CORRECT - Error Fallback with Retry Option
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';

const BenefitListSectionError = ({ error, resetErrorBoundary }: FallbackProps) => {
  return (
    <div className={styles.errorContainer}>
      <div className={styles.errorIcon}>⚠️</div>
      <h3 className={styles.errorTitle}>Failed to load benefits</h3>
      <p className={styles.errorMessage}>
        {error instanceof Error ? error.message : 'Unknown error occurred'}
      </p>
      <button onClick={resetErrorBoundary} className={styles.retryButton}>
        Retry
      </button>
    </div>
  );
};

// Use with onReset callback
export const BenefitListSection = () => {
  return (
    <ErrorBoundary
      fallbackRender={BenefitListSectionError}
      onReset={() => {
        // Optional: Clear cache, refetch data
        queryClient.invalidateQueries({ queryKey: ['benefits', 'list'] });
      }}
    >
      <Suspense fallback={<BenefitListSectionSkeleton />}>
        <BenefitListSectionContent />
      </Suspense>
    </ErrorBoundary>
  );
};
```

## Adapter Usage (Entity → UI Type)

### When to Use Adapter

Use **Adapter Pattern** when Entity → UI Type transformation requires **7+ Entity method calls**.

**See**: [../patterns/adapter-basics.md](../patterns/adapter-basics.md) for comprehensive guide

### Section with Adapter Example

```typescript
// ✅ CORRECT - Section Using Adapter for Complex Transformation
"use client";

import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getBenefitClientContainer } from '@/src/domains/benefit/di/benefit-client-container';
import { BenefitAdapter } from '../../../adapters/benefit.adapter';
import { BenefitCard } from '../../components/benefit-card';
import * as styles from './index.css';

export const BenefitListSection = () => {
  return (
    <ErrorBoundary fallback={<BenefitListSectionError />}>
      <Suspense fallback={<BenefitListSectionSkeleton />}>
        <BenefitListSectionContent />
      </Suspense>
    </ErrorBoundary>
  );
};

const BenefitListSectionContent = () => {
  const container = getBenefitClientContainer();
  const getBenefitListUseCase = container.getGetBenefitList();

  const { data } = useSuspenseQuery({
    queryKey: ['benefits', 'list'],
    queryFn: async () => {
      // 1. UseCase returns Domain Entity (BenefitList)
      const result = await getBenefitListUseCase.execute();

      // 2. Adapter transforms Entity → UI Type (orchestrates 7+ Entity methods)
      return BenefitAdapter.benefitListToUi(result);
    },
  });

  return (
    <div className={styles.grid}>
      {data.benefits.map((benefit) => (
        <BenefitCard key={benefit.id} benefit={benefit} />
      ))}
    </div>
  );
};
```

### Custom Hook with Adapter (Recommended)

```typescript
// ✅ BETTER - Extract to Custom Hook
// File: presentation/hooks/queries/get-benefit-list.query.ts
import { useSuspenseQuery } from '@tanstack/react-query';
import { getBenefitClientContainer } from '@/src/domains/benefit/di/benefit-client-container';
import { BenefitAdapter } from '../../adapters/benefit.adapter';
import { BENEFIT_LIST_QUERY_KEY } from '../../constants/query-keys';

export const useGetBenefitList = () => {
  const container = getBenefitClientContainer();
  const getBenefitListUseCase = container.getGetBenefitList();

  return useSuspenseQuery({
    queryKey: BENEFIT_LIST_QUERY_KEY,
    queryFn: async () => {
      const result = await getBenefitListUseCase.execute();
      return BenefitAdapter.benefitListToUi(result);
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });
};

// File: presentation/ui/sections/benefit-list-section/index.tsx
"use client";

import { useGetBenefitList } from '../../../hooks/queries/get-benefit-list.query';

const BenefitListSectionContent = () => {
  const { data } = useGetBenefitList();

  return (
    <div>
      {data.benefits.map((benefit) => (
        <BenefitCard key={benefit.id} benefit={benefit} />
      ))}
    </div>
  );
};
```

**See**: [../patterns/hooks-guide.md](../patterns/hooks-guide.md) for complete Query Hook patterns

## Feature-Specific State Management

### Form State Example

```typescript
// ✅ CORRECT - Section Managing Form State
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { getUserClientContainer } from '@/src/domains/user/di/user-client-container';
import { profileSchema } from '../../../schemas/profile.schema';
import type { ProfileFormData } from '../../../types/profile';

const ProfileEditSectionContent = () => {
  const container = getUserClientContainer();
  const updateProfileUseCase = container.getUpdateProfile();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  const mutation = useMutation({
    mutationFn: (data: ProfileFormData) => updateProfileUseCase.execute(data),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
    },
  });

  const onSubmit = (data: ProfileFormData) => {
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('nickname')} />
      {errors.nickname && <span>{errors.nickname.message}</span>}
      <button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? 'Saving...' : 'Save'}
      </button>
    </form>
  );
};
```

### Selection State Example

```typescript
// ✅ CORRECT - Section Managing Selection State
"use client";

import { useState } from 'react';
import { useGetBenefitList } from '../../../hooks/queries/get-benefit-list.query';
import { BenefitCard } from '../../components/benefit-card';

const BenefitListSectionContent = () => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const { data } = useGetBenefitList();

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div>
      {data.benefits.map((benefit) => (
        <BenefitCard
          key={benefit.id}
          benefit={benefit}
          isSelected={selectedIds.has(benefit.id)}
          onToggleSelect={() => handleToggleSelect(benefit.id)}
        />
      ))}
    </div>
  );
};
```

### Pagination State Example

```typescript
// ✅ CORRECT - Section Managing Pagination State
"use client";

import { useState } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getCafeteriaClientContainer } from '@/src/domains/cafeteria/di/cafeteria-client-container';

const CafeteriaListSectionContent = () => {
  const [page, setPage] = useState(1);
  const container = getCafeteriaClientContainer();
  const getCafeteriaListUseCase = container.getGetCafeteriaList();

  const { data } = useSuspenseQuery({
    queryKey: ['cafeterias', 'list', page],
    queryFn: () => getCafeteriaListUseCase.execute({ page }),
  });

  return (
    <div>
      <div className={styles.grid}>
        {data.cafeterias.map((cafeteria) => (
          <CafeteriaCard key={cafeteria.id} cafeteria={cafeteria} />
        ))}
      </div>

      <Pagination
        currentPage={page}
        totalPages={data.totalPages}
        onPageChange={setPage}
      />
    </div>
  );
};
```

## Complete Implementation Examples

### Example 1: Simple Data Display Section

```typescript
// ✅ CORRECT - Complete Simple Section
// File: domains/user/presentation/ui/sections/user-stats-section/index.tsx
"use client";

import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Box, Grid } from '@nugudi/react-components-layout';
import { getUserClientContainer } from '@/src/domains/user/di/user-client-container';
import { StatCard } from '../../components/stat-card';
import * as styles from './index.css';

export const UserStatsSection = () => {
  return (
    <ErrorBoundary fallback={<UserStatsSectionError />}>
      <Suspense fallback={<UserStatsSectionSkeleton />}>
        <UserStatsSectionContent />
      </Suspense>
    </ErrorBoundary>
  );
};

const UserStatsSectionSkeleton = () => {
  return (
    <Grid columns={{ mobile: 2, desktop: 4 }} gap={16}>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-24 animate-pulse rounded-lg bg-zinc-200" />
      ))}
    </Grid>
  );
};

const UserStatsSectionError = () => {
  return (
    <Box className={styles.error}>
      <p>Failed to load stats</p>
    </Box>
  );
};

const UserStatsSectionContent = () => {
  const container = getUserClientContainer();
  const getUserStatsUseCase = container.getGetUserStats();

  const { data } = useSuspenseQuery({
    queryKey: ['user', 'stats'],
    queryFn: () => getUserStatsUseCase.execute(),
  });

  return (
    <Grid columns={{ mobile: 2, desktop: 4 }} gap={16}>
      <StatCard label="Reviews" value={data.reviewCount} />
      <StatCard label="Stamps" value={data.stampCount} />
      <StatCard label="Benefits" value={data.benefitCount} />
      <StatCard label="Level" value={data.level} />
    </Grid>
  );
};
```

### Example 2: Section with Props

```typescript
// ✅ CORRECT - Section Receiving Props from View
// File: domains/cafeteria/presentation/ui/sections/cafeteria-menu-section/index.tsx
"use client";

import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getCafeteriaClientContainer } from '@/src/domains/cafeteria/di/cafeteria-client-container';
import { MenuCard } from '../../components/menu-card';

interface CafeteriaMenuSectionProps {
  cafeteriaId: string;
  date?: string; // Optional prop with default
}

export const CafeteriaMenuSection = ({
  cafeteriaId,
  date = new Date().toISOString().split('T')[0], // Default to today
}: CafeteriaMenuSectionProps) => {
  return (
    <ErrorBoundary fallback={<CafeteriaMenuSectionError />}>
      <Suspense fallback={<CafeteriaMenuSectionSkeleton />}>
        <CafeteriaMenuSectionContent cafeteriaId={cafeteriaId} date={date} />
      </Suspense>
    </ErrorBoundary>
  );
};

const CafeteriaMenuSectionContent = ({
  cafeteriaId,
  date,
}: CafeteriaMenuSectionProps) => {
  const container = getCafeteriaClientContainer();
  const getMenuUseCase = container.getGetMenu();

  const { data } = useSuspenseQuery({
    queryKey: ['cafeterias', 'menu', cafeteriaId, date],
    queryFn: () => getMenuUseCase.execute({ cafeteriaId, date }),
  });

  return (
    <div>
      {data.menus.map((menu) => (
        <MenuCard key={menu.id} menu={menu} />
      ))}
    </div>
  );
};
```

### Example 3: Section with Mutation

```typescript
// ✅ CORRECT - Section with Create/Update Mutation
// File: domains/cafeteria/presentation/ui/sections/review-create-section/index.tsx
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCafeteriaClientContainer } from '@/src/domains/cafeteria/di/cafeteria-client-container';
import { ReviewForm } from '../../components/review-form';
import type { ReviewFormData } from '../../../types/review';

interface ReviewCreateSectionProps {
  cafeteriaId: string;
  onSuccess?: () => void;
}

export const ReviewCreateSection = ({
  cafeteriaId,
  onSuccess,
}: ReviewCreateSectionProps) => {
  const queryClient = useQueryClient();
  const container = getCafeteriaClientContainer();
  const createReviewUseCase = container.getCreateReview();

  const form = useForm<ReviewFormData>();

  const mutation = useMutation({
    mutationFn: (data: ReviewFormData) =>
      createReviewUseCase.execute({ cafeteriaId, ...data }),
    onSuccess: () => {
      // Invalidate reviews list
      queryClient.invalidateQueries({
        queryKey: ['cafeterias', 'reviews', cafeteriaId],
      });
      form.reset();
      onSuccess?.();
    },
  });

  return (
    <ReviewForm
      form={form}
      onSubmit={(data) => mutation.mutate(data)}
      isSubmitting={mutation.isPending}
      error={mutation.error}
    />
  );
};
```

## MUST/NEVER Rules for Sections

### ✅ MUST Rules

1. **MUST be Client Component** - Add `"use client"` directive

   **Why?** Sections use browser-only APIs (TanStack Query, React hooks, event handlers) that cannot run on the server, causing runtime errors in Next.js App Router without the directive. The 'use client' directive marks the module boundary between Server and Client Components, ensuring Sections only execute in the browser where they can safely access client-side features.

2. **MUST implement Suspense boundary** - Wrap Content with `<Suspense>`

   **Why?** Suspense boundaries enable React's concurrent rendering features, allowing the UI to show loading states (Skeleton) while data fetches, preventing the entire page from blocking. Without Suspense, users see a blank screen during data loading, degrading UX. Suspense provides granular loading states at the Section level, making the UI feel more responsive.

3. **MUST implement ErrorBoundary** - Wrap Suspense with `<ErrorBoundary>`

   **Why?** ErrorBoundary prevents runtime errors in one Section from crashing the entire application, providing fault isolation and graceful degradation. Without ErrorBoundary, a failed data fetch or rendering error crashes the whole page, showing users a blank screen. ErrorBoundary catches errors and displays a fallback UI, allowing other Sections to continue working normally.

4. **MUST provide Skeleton component** - Matches actual layout

   **Why?** Skeleton components prevent layout shift by reserving space that matches the actual content's dimensions, providing better perceived performance and UX. Without Skeletons, users see content suddenly appearing (jarring), or the page jumping as content loads (poor UX). Skeletons give users visual feedback that content is loading, making the app feel faster and more polished.

5. **MUST provide Error component** - Graceful degradation

   **Why?** Custom Error components provide user-friendly error messages and recovery actions (retry, contact support), maintaining a professional UX even when things go wrong. Generic error boundaries show technical stack traces or blank screens, confusing users. Well-designed Error components guide users on what went wrong and how to proceed, preserving trust in the application.

6. **MUST use Client DI Container** - `getXXXClientContainer()` for UseCases

   **Why?** Client DI Container uses lazy singleton pattern, ensuring all Sections and hooks share the same container instance for consistent cache behavior with TanStack Query. Server DI Container uses factory pattern (creates new instance per call), which would create different UseCase instances on every render, breaking cache management and wasting memory. Client Container provides testability and loose coupling.

7. **MUST fetch data with TanStack Query** - `useSuspenseQuery` or `useQuery`

   **Why?** TanStack Query provides built-in caching, request deduplication, background refetching, and optimistic updates, eliminating boilerplate and preventing common bugs (race conditions, stale data, duplicate requests). Manual data fetching with useState/useEffect is error-prone, requires extensive custom code, and lacks these critical features. TanStack Query is the industry standard for React data fetching.

8. **MUST use named export** - `export const MySection`

   **Why?** Named exports provide better IDE autocomplete, tree-shaking, and refactoring support compared to default exports. Named exports make imports explicit (`import { MySection }` vs `import MySection from '...'`), prevent naming inconsistencies across the codebase, and align with component hierarchy conventions, improving code maintainability and developer experience.

9. **MUST create Content sub-component** - Separate boundaries from content

   **Why?** Separating Content from boundary components (Suspense, ErrorBoundary) keeps concerns isolated—boundaries handle loading/error states while Content focuses on rendering data. This pattern improves testability (test Content independently), readability (clear separation of concerns), and maintainability (change boundaries without affecting Content logic). It follows the Single Responsibility Principle.

### ❌ NEVER Rules

1. **NEVER use Server DI Container** - `createXXXServerContainer()` breaks on client

   **Why?** Server DI Container uses factory pattern (creates new instance per call) and is designed for Server Components where each request gets a fresh instance. In Client Components/Sections, this creates different container and UseCase instances on every render, breaking TanStack Query's cache management, wasting memory, and causing hydration mismatches. Client Sections MUST use Client DI Container's lazy singleton pattern.

2. **NEVER skip error handling** - Every Section needs ErrorBoundary

   **Why?** Without ErrorBoundary, runtime errors in one Section crash the entire application, showing users a blank screen or error page instead of just the affected Section. This violates fault isolation principles and creates poor UX. ErrorBoundary provides graceful degradation, allowing other Sections to continue working normally even when one Section fails, maintaining application stability.

3. **NEVER skip loading state** - Every Section needs Suspense with Skeleton

   **Why?** Without Suspense and Skeleton, users see blank screens or layout shifts during data loading, creating jarring UX and making the app feel slow. Suspense enables concurrent rendering for better perceived performance, while Skeleton components prevent layout shift by reserving space. Skipping loading states is a common UX anti-pattern that significantly degrades user experience.

4. **NEVER define page layout** - Use Components, not layout structure

   **Why?** Sections are responsible for data fetching and business logic presentation, NOT page-level layout structure (headers, footers, navigation). Mixing layout concerns into Sections violates Single Responsibility Principle, reduces reusability (Section becomes coupled to specific layouts), and creates maintenance issues. Layout structure belongs in Page or View layers, Sections focus on domain-specific content.

5. **NEVER import other Sections** - Sections are independent

   **Why?** Sections importing other Sections creates tight coupling and breaks component hierarchy (Sections should be composed by Views, not by other Sections). This prevents independent development, makes testing difficult (can't test one Section without its dependencies), and creates circular dependency risks. Sections should be loosely coupled, composable units that Views orchestrate, not hierarchical trees.

6. **NEVER instantiate Repository/UseCase directly** - Use DI Container

   **Why?** Direct instantiation bypasses dependency injection, creating tight coupling between Sections and concrete implementations (making code untestable and inflexible). It forces manual dependency management (error-prone), breaks the DI pattern, and makes it impossible to swap implementations or mock dependencies in tests. DI Containers provide loose coupling, testability, and centralized dependency management.

7. **NEVER use deprecated `@nugudi/api`** - Use UseCase layer

   **Why?** The deprecated `@nugudi/api` package bypasses the UseCase layer, violating Clean Architecture by allowing Presentation to directly call Data layer. This skips business logic validation, eliminates the single place for business rules, and creates tight coupling to API implementation details. UseCases provide business logic encapsulation, testability, and proper layer separation following Clean Architecture principles.

8. **NEVER skip Content component** - Always separate boundaries from logic

   **Why?** Mixing boundary logic (Suspense, ErrorBoundary) with content rendering creates components with multiple responsibilities, reducing testability (can't test content independently from boundaries), readability (unclear separation of concerns), and reusability. The Content sub-component pattern enforces Single Responsibility Principle, improves test isolation, and makes the code structure clearer and more maintainable.

## Common Patterns

### Pattern 1: Infinite Scroll Section

```typescript
// File: presentation/ui/sections/cafeteria-infinite-list-section/index.tsx
"use client";

import { useInfiniteQuery } from '@tanstack/react-query';
import { useIntersection } from '@nugudi/react-hooks-use-intersection';
import { getCafeteriaClientContainer } from '@/src/domains/cafeteria/di/cafeteria-client-container';

const CafeteriaInfiniteListSectionContent = () => {
  const container = getCafeteriaClientContainer();
  const getCafeteriaListUseCase = container.getGetCafeteriaList();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['cafeterias', 'infinite'],
    queryFn: ({ pageParam = 0 }) => getCafeteriaListUseCase.execute({ page: pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.hasNext ? lastPage.nextPage : undefined,
  });

  const { ref } = useIntersection({
    onIntersect: () => {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
  });

  return (
    <div>
      {data.pages.map((page) =>
        page.cafeterias.map((cafeteria) => (
          <CafeteriaCard key={cafeteria.id} cafeteria={cafeteria} />
        ))
      )}
      <div ref={ref}>{isFetchingNextPage && <Spinner />}</div>
    </div>
  );
};
```

## Related Documentation

- **[component-hierarchy.md](./component-hierarchy.md)** - Overall component hierarchy
- **[page-patterns.md](./page-patterns.md)** - Page layer with Server DI Container
- **[view-patterns.md](./view-patterns.md)** - View layer composition
- **[component-patterns.md](./component-patterns.md)** - Component layer patterns
- **[../packages.md](../packages.md)** - DDD Architecture, Client DI Container, UseCase patterns
- **[../patterns/adapter-basics.md](../patterns/adapter-basics.md)** - Entity → UI Type transformation guide
- **[../patterns/hooks-guide.md](../patterns/hooks-guide.md)** - TanStack Query custom hooks patterns
