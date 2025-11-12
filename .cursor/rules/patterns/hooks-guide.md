---
description: Query and Mutation hooks rules with TanStack Query
globs:
  - "**/hooks/queries/**/*.query.ts"
  - "**/hooks/queries/**/*.query.tsx"
  - "**/hooks/mutations/**/*.mutation.ts"
  - "**/hooks/mutations/**/*.mutation.tsx"
alwaysApply: true
---

# Query & Mutation Hooks Rules

## Table of Contents

- [File Naming](#file-naming)
- [Hook Naming](#hook-naming)
- [Container Method Naming](#container-method-naming)
- [Query Hook Pattern](#query-hook-pattern)
- [Mutation Hook Pattern](#mutation-hook-pattern)
- [Query Key Conventions](#query-key-conventions)
- [MUST Rules](#must-rules)
- [NEVER Rules](#never-rules)
- [Quick Reference](#quick-reference)

## File Naming

### Query Hook Files

**Pattern**: `get-[feature].query.ts`

```
domains/benefit/presentation/client/hooks/queries/
  ✅ get-benefit-list.query.ts
  ✅ get-benefit-detail.query.ts
  ✅ get-my-profile.query.ts
```

### Mutation Hook Files

**Pattern**: `[action]-[resource].mutation.ts`

```
domains/benefit/presentation/client/hooks/mutations/
  ✅ create-benefit-review.mutation.ts
  ✅ update-benefit-status.mutation.ts
  ✅ delete-benefit.mutation.ts
```

## Hook Naming

### Query Hooks

**Pattern**: `useGet[Feature]`

```typescript
// ✅ CORRECT
export function useGetBenefitList() { }
export function useGetBenefitDetail() { }
export function useGetMyProfile() { }
```

### Mutation Hooks

**Pattern**: `use[Action][Resource]`

```typescript
// ✅ CORRECT
export function useCreateBenefitReview() { }
export function useUpdateBenefitStatus() { }
export function useDeleteBenefit() { }
```

## Container Method Naming

### ✅ CORRECT: Individual UseCase Getters

**Pattern**: Container provides `getGet[UseCase]()` method

```typescript
// benefit-client-container.ts
export function getBenefitClientContainer() {
  return {
    // ✅ CORRECT: Individual getter methods
    getGetBenefits: () => new GetBenefitsUseCase(repository),
    getGetBenefitDetail: () => new GetBenefitDetailUseCase(repository),
    getCreateBenefitReview: () => new CreateBenefitReviewUseCase(repository),
  };
}
```

### ❌ WRONG: Factory Method Pattern (Deprecated)

```typescript
// ❌ WRONG: Old factory pattern
export function getBenefitClientContainer() {
  return {
    // ❌ WRONG: 'create' prefix is deprecated
    createGetBenefitsUseCase: () => new GetBenefitsUseCase(repository),
  };
}
```

## Query Hook Pattern

### Basic Structure

```typescript
// File: get-benefit-list.query.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { getBenefitClientContainer } from "@benefit/di/benefit-client-container";
import { BenefitAdapter } from "@benefit/presentation/shared/adapters";
import { BENEFIT_QUERY_KEYS } from "@benefit/presentation/shared/constants";

/**
 * Query hook to fetch benefit list
 *
 * @description
 * Fetches benefits via UseCase, transforms to UI type using Adapter.
 * Uses Client Container for singleton UseCase instance.
 *
 * @returns TanStack Query result with BenefitItem[]
 */
export function useGetBenefitList() {
  // 1. Get Client Container (lazy singleton)
  const container = getBenefitClientContainer();

  // 2. Get individual UseCase
  const getBenefitsUseCase = container.getGetBenefits();

  // 3. Return useQuery
  return useQuery({
    queryKey: BENEFIT_QUERY_KEYS.list(),
    queryFn: async () => {
      // 4. Execute UseCase (returns Entity)
      const benefitList = await getBenefitsUseCase.execute();

      // 5. Transform Entity → UI Type with Adapter
      return BenefitAdapter.benefitListToUi(benefitList);
    },
  });
}
```

### With Parameters

```typescript
export function useGetBenefitDetail(benefitId: string) {
  const container = getBenefitClientContainer();
  const useCase = container.getGetBenefitDetail();

  return useQuery({
    // ✅ Include parameter in queryKey for proper caching
    queryKey: BENEFIT_QUERY_KEYS.detail(benefitId),
    queryFn: async () => {
      const benefit = await useCase.execute(benefitId);
      return BenefitAdapter.toUiItem(benefit);
    },
    // ✅ Only fetch if benefitId exists
    enabled: !!benefitId,
  });
}
```

### With Query Options

```typescript
export function useGetBenefitList(options?: {
  category?: string;
  sortBy?: "price" | "discount";
}) {
  const container = getBenefitClientContainer();
  const useCase = container.getGetBenefits();

  return useQuery({
    // ✅ Include options in queryKey for cache separation
    queryKey: BENEFIT_QUERY_KEYS.list(options),
    queryFn: async () => {
      const benefitList = await useCase.execute(options);
      return BenefitAdapter.benefitListToUi(benefitList);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}
```

## Mutation Hook Pattern

### Basic Structure

```typescript
// File: create-cafeteria-review.mutation.ts
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getCafeteriaClientContainer } from "@cafeteria/di/cafeteria-client-container";
import { CAFETERIA_QUERY_KEYS } from "@cafeteria/presentation/shared/constants";

/**
 * Mutation hook to create cafeteria review
 *
 * @description
 * Creates review via UseCase and invalidates related queries.
 *
 * @returns TanStack Mutation result
 */
export function useCreateCafeteriaReview() {
  const queryClient = useQueryClient();

  // 1. Get Client Container
  const container = getCafeteriaClientContainer();

  // 2. Get individual UseCase
  const useCase = container.getCreateCafeteriaReview();

  // 3. Return useMutation
  return useMutation({
    mutationFn: async (params: {
      cafeteriaId: string;
      content: string;
      rating: number;
    }) => {
      // 4. Execute UseCase with params
      return await useCase.execute(params);
    },
    onSuccess: (data, variables) => {
      // 5. Invalidate related queries after success
      queryClient.invalidateQueries({
        queryKey: CAFETERIA_QUERY_KEYS.reviews(variables.cafeteriaId),
      });
      queryClient.invalidateQueries({
        queryKey: CAFETERIA_QUERY_KEYS.detail(variables.cafeteriaId),
      });
    },
  });
}
```

### With Optimistic Updates

```typescript
export function useToggleStamp() {
  const queryClient = useQueryClient();
  const container = getStampClientContainer();
  const useCase = container.getToggleStamp();

  return useMutation({
    mutationFn: async (stampId: string) => {
      return await useCase.execute(stampId);
    },
    onMutate: async (stampId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: STAMP_QUERY_KEYS.collection(),
      });

      // Snapshot previous value
      const previousStamps = queryClient.getQueryData(
        STAMP_QUERY_KEYS.collection()
      );

      // Optimistically update UI
      queryClient.setQueryData(
        STAMP_QUERY_KEYS.collection(),
        (old: StampItem[] | undefined) => {
          if (!old) return old;
          return old.map((stamp) =>
            stamp.id === stampId ? { ...stamp, isUsed: !stamp.isUsed } : stamp
          );
        }
      );

      // Return context with snapshot
      return { previousStamps };
    },
    onError: (err, stampId, context) => {
      // Rollback on error
      if (context?.previousStamps) {
        queryClient.setQueryData(
          STAMP_QUERY_KEYS.collection(),
          context.previousStamps
        );
      }
    },
  });
}
```

## Query Key Conventions

### Pattern

**File**: `presentation/shared/constants/query-keys.ts`

```typescript
export const BENEFIT_QUERY_KEYS = {
  all: () => ["benefits"] as const,
  lists: () => [...BENEFIT_QUERY_KEYS.all(), "list"] as const,
  list: (filters?: object) =>
    [...BENEFIT_QUERY_KEYS.lists(), filters] as const,
  details: () => [...BENEFIT_QUERY_KEYS.all(), "detail"] as const,
  detail: (id: string) => [...BENEFIT_QUERY_KEYS.details(), id] as const,
};
```

### Usage

```typescript
// Query keys in hooks
queryKey: BENEFIT_QUERY_KEYS.list({ category: "lunch" });
// Result: ["benefits", "list", { category: "lunch" }]

queryKey: BENEFIT_QUERY_KEYS.detail("123");
// Result: ["benefits", "detail", "123"]
```

### Invalidation

```typescript
// Invalidate all benefits queries
queryClient.invalidateQueries({ queryKey: BENEFIT_QUERY_KEYS.all() });

// Invalidate all benefit lists
queryClient.invalidateQueries({ queryKey: BENEFIT_QUERY_KEYS.lists() });

// Invalidate specific detail
queryClient.invalidateQueries({ queryKey: BENEFIT_QUERY_KEYS.detail("123") });
```

## MUST Rules

- **MUST** use Client Container (NOT Server Container)
- **MUST** use individual UseCase getter (`getGet[UseCase]`)
- **MUST** include `'use client'` directive at top
- **MUST** transform Entity → UI Type with Adapter
- **MUST** include parameters in queryKey for proper caching
- **MUST** invalidate related queries after mutations
- **MUST** document hooks with JSDoc

**Why These Rules Exist:**

**MUST Rules Explained:**

1. **Why MUST use Client Container?**
   - **Client-Side Execution**: React hooks ONLY run in browser, not on server
   - **Lazy Singleton**: Client Container reuses same instance across all hooks (performance)
   - **Session Persistence**: Client Container uses ClientSessionManager with localStorage
   - **No SSR Conflicts**: Client Container designed for browser environment only
   - **Credentials Included**: Client Container's HttpClient includes `credentials: 'include'` for cookies

2. **Why MUST use individual UseCase getter?**
   - **Clear Intent**: `container.getGetBenefits()` explicitly names the UseCase being used
   - **Type Safety**: Individual getters provide autocomplete and type checking
   - **Deprecation**: Factory pattern (`createGetBenefitsUseCase`) is deprecated and harder to read
   - **Consistency**: All hooks across codebase use same getter pattern
   - **Testability**: Easy to verify specific UseCase getter was called in tests

3. **Why MUST include 'use client' directive?**
   - **React Server Components**: Next.js 16 treats files as Server Components by default
   - **Hook Requirement**: React hooks (`useQuery`, `useMutation`) ONLY work in Client Components
   - **Build Error Prevention**: Missing directive = "Hooks can only be used in Client Components" error
   - **Explicit Boundary**: Directive clearly marks where server/client boundary is
   - **Framework Requirement**: Next.js App Router requires explicit client-side marking

4. **Why MUST transform Entity → UI Type with Adapter?**
   - **Separation of Concerns**: Domain Entities don't belong in Presentation layer
   - **Type Safety**: Adapter eliminates unsafe `as` assertions with validated conversions
   - **UI-Specific Data**: Adapter adds UI-only fields (colors, badges, formatted strings)
   - **Reusability**: Same Entity can be transformed differently for mobile/desktop UIs
   - **Maintainability**: UI changes don't require Domain layer changes

5. **Why MUST include parameters in queryKey?**
   - **Cache Separation**: Different params = Different cache entries (no data collision)
   - **Automatic Refetch**: Param change = TanStack Query automatically refetches
   - **Cache Invalidation**: Can invalidate specific param combinations precisely
   - **Stale Data Prevention**: Without params in key, stale data shown for wrong params
   - **React Query Requirement**: Query key MUST uniquely identify the query data

6. **Why MUST invalidate related queries after mutations?**
   - **Cache Synchronization**: Mutation changes server data, cache must update to match
   - **Stale Data Prevention**: Without invalidation, users see outdated data until manual refresh
   - **UX Consistency**: Immediate UI update reflects backend changes
   - **Optimistic Updates**: Invalidation triggers background refetch to confirm optimistic UI
   - **Related Data**: Mutation may affect multiple queries (e.g., list + detail + count)

7. **Why MUST document hooks with JSDoc?**
   - **Developer Experience**: IDE shows JSDoc hints during hook usage
   - **Usage Examples**: `@example` shows correct hook invocation patterns
   - **Parameter Clarity**: `@param` explains what parameters mean and expect
   - **Return Type Clarity**: `@returns` explains query result structure
   - **Maintainability**: New developers understand hook purpose without reading implementation
   - **Contract Documentation**: JSDoc is the hook's public API contract

**NEVER Rules Explained:**

1. **Why NEVER use Server Container in hooks?**
   - **Stateless Factory**: Server Container creates new instance per call (not singleton)
   - **Wrong SessionManager**: Server Container uses ServerSessionManager (httpOnly cookies)
   - **No `cookies()` API**: Client Components can't access `cookies()` from `next/headers`
   - **Build Error**: Server-only code in client = Webpack bundling error
   - **Performance**: Creating new container per hook call = Wasteful re-initialization

2. **Why NEVER use deprecated factory pattern?**
   - **Naming Confusion**: `createGetBenefitsUseCase()` implies factory, but it's a getter
   - **Code Clarity**: `getGetBenefits()` is more explicit about returning a UseCase
   - **Migration Completed**: All new code uses getter pattern, factory is legacy
   - **Consistency**: Mixed patterns = Harder to learn and maintain codebase
   - **Deprecation Warning**: Using factory pattern = Code smell, should be refactored

3. **Why NEVER return Entity directly?**
   - **Layer Violation**: Returning Entity = Domain leaking into Presentation layer
   - **Type Mismatch**: UI components expect UI Types, not Domain Entities
   - **Missing UI Data**: Entities lack UI-specific fields (colors, badges, formatted strings)
   - **Coupling**: UI tied to Entity shape = Can't change Entity without breaking UI
   - **Adapter Purpose**: Adapter exists to decouple Domain from Presentation

4. **Why NEVER forget parameters in queryKey?**
   - **Cache Collision**: Same key for different params = Wrong data shown to user
   - **Stale Data Bug**: Changing params doesn't refetch = User sees old results
   - **Invalidation Failure**: Can't invalidate specific param queries without params in key
   - **React Query Violation**: Query key MUST uniquely identify data, params are part of identity
   - **Production Bug**: Hard-to-debug issue where cache returns wrong data

5. **Why NEVER forget to invalidate queries after mutations?**
   - **Stale Cache**: Mutation updates server, but cache still has old data
   - **User Confusion**: User performs action, but UI doesn't reflect the change
   - **Manual Refresh Required**: User must refresh page to see updated data
   - **Lost Trust**: Users think action failed because UI didn't update
   - **Cache Consistency**: Cache and server must stay synchronized

6. **Why NEVER skip error handling?**
   - **User Experience**: Unhandled errors = Blank screen or crash
   - **TanStack Query Built-in**: `useQuery` provides `error` state automatically, no extra work
   - **Network Failures**: API calls can fail (timeout, 500 error, network offline)
   - **User Feedback**: Error state allows showing retry button or fallback UI
   - **Production Stability**: Graceful error handling prevents cascading failures

## NEVER Rules

- **NEVER** use Server Container in hooks
  - ❌ `createXXXServerContainer()` in Client Component

- **NEVER** use deprecated factory pattern
  - ❌ `container.createGetBenefitsUseCase()`
  - ✅ `container.getGetBenefits()`

- **NEVER** return Entity directly (always transform to UI Type)
  - ❌ `return benefitEntity;`
  - ✅ `return BenefitAdapter.toUiItem(benefitEntity);`

- **NEVER** forget to include parameters in queryKey
  - ❌ `queryKey: ["benefits"]` when using filter params
  - ✅ `queryKey: ["benefits", "list", { category }]`

- **NEVER** forget to invalidate queries after mutations
  - Stale data will persist in cache

- **NEVER** skip error handling
  - TanStack Query provides `error` state automatically

## Quick Reference

| Hook Type | File Pattern | Hook Pattern | Container Method |
|-----------|--------------|--------------|------------------|
| Query | `get-[feature].query.ts` | `useGet[Feature]` | `getGet[UseCase]()` |
| Mutation | `[action]-[resource].mutation.ts` | `use[Action][Resource]` | `get[Action][Resource]()` |

---

**Related**: See `ddd/adapters.md` for Entity → UI transformation, `ddd/di-containers.md` for Container usage
