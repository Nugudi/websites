---
description: Query hooks with TanStack Query, useGet patterns, DI Container integration, and Entity-to-UI transformation using Adapters
globs:
  - "**/hooks/queries/**/*.query.ts"
  - "**/hooks/queries/**/*.query.tsx"
alwaysApply: true
---

# Query Hooks Guide

> **Target Audience**: Frontend developers working with TanStack Query
> **Prerequisites**: Read [../di-containers.md](../di-containers.md) and [adapter-basics.md](./adapter-basics.md) first
> **Related Docs**: [mutation-hooks.md](./mutation-hooks.md), [query-keys.md](./query-keys.md), [../frontend.md](../frontend.md)

## 📋 Table of Contents

1. [What are Query Hooks?](#what-are-query-hooks)
2. [File Naming Conventions](#file-naming-conventions)
3. [Hook Naming Conventions](#hook-naming-conventions)
4. [DI Container Method Naming](#di-container-method-naming)
5. [Query Hook Pattern](#query-hook-pattern)
6. [MUST / MUST NOT Rules](#must--must-not-rules)
7. [Real-World Examples](#real-world-examples)
8. [Testing Query Hooks](#testing-query-hooks)

## What are Query Hooks?

**Query Hooks** are custom React hooks that wrap TanStack Query's `useQuery` to provide:

- **DI Container integration**: Access to UseCases via Client DI Container
- **Adapter integration**: Entity → UI Type transformation
- **Type safety**: Full TypeScript inference
- **Reusability**: Centralized data fetching logic
- **Caching**: Automatic caching and invalidation

### Before Query Hooks (❌ Anti-Pattern)

```typescript
// ❌ WRONG: Component directly using UseCase
'use client';
const BenefitList = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const container = getBenefitClientContainer();
    const useCase = container.getGetBenefits();
    useCase.execute().then((result) => {
      const uiData = BenefitAdapter.toUiList(result);
      setData(uiData);
    });
  }, []);

  // No caching, no loading state, no error handling
};
```

### After Query Hooks (✅ Clean)

```typescript
// ✅ CORRECT: Using Query Hook
'use client';
const BenefitList = () => {
  const { data, isLoading, error } = useGetBenefits();

  // Automatic caching, loading, error handling!
};
```

## File Naming Conventions

### Query Hook Files

**Pattern**: `get-[feature].query.ts`

```
domains/benefit/presentation/client/hooks/queries/
  ✅ get-benefit-list.query.ts       # ✅ CORRECT
  ✅ get-benefit-detail.query.ts     # ✅ CORRECT
  ✅ get-benefit-categories.query.ts # ✅ CORRECT
```

**Why this naming?**

- **`get-`**: Indicates data fetching (read operation)
- **`[feature]`**: Descriptive feature name (kebab-case)
- **`.query.ts`**: File type designation for queries

### ❌ Wrong Naming Examples

```
❌ useBenefitList.ts          # Missing 'get-' prefix and '.query' suffix
❌ benefit-list.ts            # Missing 'get-' prefix and '.query' suffix
❌ getBenefitList.query.ts    # camelCase instead of kebab-case
❌ get-benefit.ts             # Missing '.query' suffix
```

## Hook Naming Conventions

### Query Hook Names

**Pattern**: `useGet[Feature]`

```typescript
// ✅ CORRECT: Hook names
export function useGetBenefitList() {
  /* ... */
}
export function useGetBenefitDetail() {
  /* ... */
}
export function useGetMyProfile() {
  /* ... */
}
export function useGetStampCollection() {
  /* ... */
}
```

**Why this naming?**

- **`use`**: React hook convention (required)
- **`Get`**: Indicates data fetching
- **`[Feature]`**: PascalCase feature name
- **Type inference**: Return type automatically inferred from `useQuery`

### ❌ Wrong Hook Names

```typescript
❌ export function useBenefitList() { }     // Missing 'Get' prefix
❌ export function getBenefitList() { }      // Not a hook (missing 'use')
❌ export function useGetbenefitList() { }   // Wrong casing (lowercase 'b')
❌ export function useFetchBenefitList() { } // Use 'Get' not 'Fetch'
```

## ⚠️ Critical: Client DI Container Import Pattern

**ALWAYS import Client DI Container directly from the specific file**, NOT from barrel exports:

```typescript
// ✅ CORRECT: Direct import from client-container file
import { getBenefitClientContainer } from '@/src/domains/benefit/di/benefit-client-container';
import { getUserClientContainer } from '@/src/domains/user/di/user-client-container';

// ❌ WRONG: Barrel export from @domain/di
import { getBenefitClientContainer } from '@benefit/di';
import { getUserClientContainer } from '@user/di';
```

**Why Direct Imports?**

Using barrel exports at `@domain/di` causes serious bundling issues:
- Barrel exports bundle BOTH `*-server-container.ts` AND `*-client-container.ts`
- Webpack cannot tree-shake properly
- `server-only` package gets bundled in client code → **Build fails**
- Bundle size increases with unused server dependencies

**Solution:** Always use direct file imports with absolute paths (`@/src/domains/.../di/*-client-container`).

## DI Container Method Naming

### ✅ CORRECT: Individual UseCase Getters

**Pattern**: DI Container provides `getGet[UseCase]()` method

```typescript
// File: domains/benefit/di/benefit-client-container.ts
export function getBenefitClientContainer() {
  // ...
  return {
    // ✅ CORRECT: Individual UseCase getter methods
    getGetBenefits: () => new GetBenefitsUseCase(repository),
    getGetBenefitDetail: () => new GetBenefitDetailUseCase(repository),
    getCreateBenefitReview: () => new CreateBenefitReviewUseCase(repository),
  };
}
```

**Usage in Query Hook:**

```typescript
// File: get-benefit-list.query.ts
export function useGetBenefitList() {
  const container = getBenefitClientContainer();
  const getBenefitsUseCase = container.getGetBenefits(); // ✅ Individual getter

  return useQuery({
    queryKey: ['benefits', 'list'],
    queryFn: () => getBenefitsUseCase.execute(),
  });
}
```

### ❌ WRONG: Factory Method Pattern (Deprecated)

```typescript
// ❌ WRONG: Old factory pattern (DEPRECATED)
export function getBenefitClientContainer() {
  return {
    // ❌ WRONG: Factory method with 'create' prefix
    createGetBenefitsUseCase: () => new GetBenefitsUseCase(repository),
  };
}

// ❌ Usage in hook (deprecated pattern)
const useCase = container.createGetBenefitsUseCase();
```

**Why deprecated?**

- Inconsistent with getter pattern
- Confusing naming (create vs get)
- Less discoverable in IDEs

## Query Hook Pattern

### Basic Structure

```typescript
// File: domains/benefit/presentation/client/hooks/queries/get-benefit-list.query.ts
'use client';

import { useQuery } from '@tanstack/react-query';
import { getBenefitClientContainer } from '@/src/domains/benefit/di/benefit-client-container';
import { BenefitAdapter } from '@benefit/presentation/shared/adapters';
import { BENEFIT_QUERY_KEYS } from '@benefit/presentation/shared/constants';

/**
 * Query hook to fetch benefit list
 *
 * @description
 * Fetches benefits from API via UseCase and transforms to UI type using Adapter.
 * Uses Client DI Container for singleton UseCase instance.
 * Automatically caches with TanStack Query.
 *
 * @returns TanStack Query result with BenefitItem[]
 */
export function useGetBenefitList() {
  // 1. Get Client DI Container (lazy singleton)
  const container = getBenefitClientContainer();

  // 2. Get individual UseCase
  const getBenefitsUseCase = container.getGetBenefits();

  // 3. Return useQuery with queryKey and queryFn
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
// File: get-benefit-detail.query.ts
'use client';

import { useQuery } from '@tanstack/react-query';
import { getBenefitClientContainer } from '@/src/domains/benefit/di/benefit-client-container';
import { BenefitAdapter } from '@benefit/presentation/shared/adapters';
import { BENEFIT_QUERY_KEYS } from '@benefit/presentation/shared/constants';

/**
 * Query hook to fetch benefit detail by ID
 *
 * @param benefitId - Benefit ID to fetch
 * @returns TanStack Query result with BenefitDetailItem
 */
export function useGetBenefitDetail(benefitId: string) {
  const container = getBenefitClientContainer();
  const getBenefitDetailUseCase = container.getGetBenefitDetail();

  return useQuery({
    // Include parameter in queryKey for proper caching
    queryKey: BENEFIT_QUERY_KEYS.detail(benefitId),
    queryFn: async () => {
      // Pass parameter to UseCase
      const benefit = await getBenefitDetailUseCase.execute(benefitId);
      return BenefitAdapter.toUiItem(benefit);
    },
    // Only fetch if benefitId exists
    enabled: !!benefitId,
  });
}
```

### With Query Options

```typescript
// File: get-benefit-list.query.ts
export function useGetBenefitList(options?: {
  category?: string;
  sortBy?: 'price' | 'discount' | 'popular';
}) {
  const container = getBenefitClientContainer();
  const getBenefitsUseCase = container.getGetBenefits();

  return useQuery({
    // Include options in queryKey for proper cache separation
    queryKey: BENEFIT_QUERY_KEYS.list(options),
    queryFn: async () => {
      const benefitList = await getBenefitsUseCase.execute(options);
      return BenefitAdapter.benefitListToUi(benefitList);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}
```

### With Conditional Fetching

```typescript
// File: get-user-preferences.query.ts
export function useGetUserPreferences(options?: { enabled?: boolean }) {
  const container = getUserClientContainer();
  const getPreferencesUseCase = container.getGetUserPreferences();

  return useQuery({
    queryKey: USER_QUERY_KEYS.preferences(),
    queryFn: async () => {
      const preferences = await getPreferencesUseCase.execute();
      return UserAdapter.toPreferencesUi(preferences);
    },
    // Only fetch when explicitly enabled
    enabled: options?.enabled ?? true,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}
```

## MUST / MUST NOT Rules

### ✅ MUST

1. **MUST** use Client DI Container in Query Hooks

   **Why?** Client DI Container uses lazy singleton pattern, ensuring the same UseCase instance is reused across all hook calls, which is essential for TanStack Query cache consistency. This prevents duplicate HttpClient instances and maintains proper state management. Server DI Container would create new instances on every hook call, breaking the cache.

   ```typescript
   // ✅ CORRECT: Client DI Container in hook
   const container = getBenefitClientContainer();
   ```

2. **MUST** use individual UseCase getters from container

   **Why?** Individual getters (e.g., `container.getGetBenefits()`) follow modern naming conventions and provide cleaner API surface than deprecated factory methods (e.g., `createGetBenefitsUseCase()`). Getters clearly communicate intent, are more concise, and align with JavaScript getter conventions, making code more readable and maintainable.

   ```typescript
   // ✅ CORRECT: Individual getter
   const getBenefitsUseCase = container.getGetBenefits();
   ```

3. **MUST** follow file naming convention: `get-[feature].query.ts`

   **Why?** Consistent file naming convention makes Query Hooks immediately identifiable in the codebase (`.query.ts` suffix), distinguishes them from Mutation Hooks (`.mutation.ts`), and enables IDE file search and autocomplete. The `get-` prefix clearly indicates read operations, improving code organization and discoverability across the monorepo.

   ```
   ✅ get-benefit-list.query.ts
   ✅ get-my-profile.query.ts
   ```

4. **MUST** follow hook naming convention: `useGet[Feature]`

   **Why?** The `useGet` prefix follows React Hooks naming convention (`use` prefix for hooks), clearly indicates read operations (GET), and distinguishes Query Hooks from Mutation Hooks (`useMutate` prefix). Consistent naming improves code readability, makes hooks easy to discover via autocomplete, and follows established React ecosystem patterns.

   ```typescript
   // ✅ CORRECT: Hook names
   export function useGetBenefitList() {
     /* ... */
   }
   export function useGetMyProfile() {
     /* ... */
   }
   ```

5. **MUST** use Adapter to transform Entity → UI Type

   **Why?** Adapters ensure type-safe transformations from Domain Entities to Presentation UI Types, eliminating unsafe `as` type assertions and potential runtime errors. They centralize transformation logic (making changes easier), enforce presentation layer boundaries, and ensure UI components receive properly shaped data that matches their needs, not raw domain models.

   ```typescript
   // ✅ CORRECT: Using Adapter
   queryFn: async () => {
     const entity = await useCase.execute();
     return BenefitAdapter.toUiItem(entity);
   };
   ```

6. **MUST** include all parameters in queryKey

   **Why?** Including all parameters in queryKey is essential for TanStack Query cache to work correctly. Different parameter values should produce different cache entries (e.g., `list({category: 'lunch'})` vs `list({category: 'dinner'})`). Missing parameters cause cache collisions where requests with different parameters incorrectly share cached data, leading to stale or wrong data being displayed.

   ```typescript
   // ✅ CORRECT: Parameters in queryKey
   queryKey: BENEFIT_QUERY_KEYS.detail(benefitId),
   ```

7. **MUST** use constants for queryKeys

   **Why?** Centralized queryKey constants prevent typos (hardcoded strings are error-prone), enable type-safe invalidation (TypeScript autocomplete for keys), and make cache management easier (single source of truth for all query keys). When refactoring, you only need to change keys in one place, and grep/find-all works reliably for tracking key usage.

   ```typescript
   // ✅ CORRECT: Centralized queryKeys
   queryKey: BENEFIT_QUERY_KEYS.list(),
   ```

8. **MUST** add `'use client'` directive at top of file

   **Why?** The 'use client' directive ensures the Query Hook executes in browser context where React hooks (useQuery), browser APIs (localStorage via ClientSessionManager), and client-side state management work. Without it, Next.js may try to execute the hook during SSR, causing runtime errors. This directive marks the client/server boundary explicitly.

   ```typescript
   // ✅ CORRECT: Client directive
   'use client';

   import { useQuery } from '@tanstack/react-query';
   ```

9. **MUST** provide comprehensive JSDoc for hook

   **Why?** Comprehensive JSDoc documents the hook's purpose, behavior, parameters, and return type, making it easier for other developers (and AI assistants) to understand usage without reading implementation. JSDoc enables IDE autocomplete and inline documentation, reduces onboarding time for new developers, and serves as living documentation that stays in sync with code.

   ```typescript
   // ✅ CORRECT: Complete JSDoc
   /**
    * Query hook to fetch benefit list
    *
    * @description
    * Fetches benefits from API via UseCase and transforms to UI type using Adapter.
    * Uses Client DI Container for singleton UseCase instance.
    *
    * @param options - Query options
    * @returns TanStack Query result with BenefitItem[]
    */
   ```

10. **MUST** use `enabled` option for conditional queries

    **Why?** The `enabled` option prevents unnecessary API calls when required parameters are missing (e.g., `benefitId` is null/undefined), avoiding 400/404 errors and wasted network requests. It ensures queries only run when data dependencies are satisfied, improving performance and preventing console errors. TanStack Query will automatically refetch when `enabled` becomes true.

    ```typescript
    // ✅ CORRECT: Conditional fetching
    return useQuery({
      queryKey: BENEFIT_QUERY_KEYS.detail(benefitId),
      queryFn: async () => {
        /* ... */
      },
      enabled: !!benefitId, // Only fetch when benefitId exists
    });
    ```

### ❌ MUST NOT

1. **MUST NOT** use Server DI Container in Query Hooks

   **Why?** Server DI Container uses factory pattern (`createXXX()`), creating a NEW instance on every hook call (every component render), wasting memory and breaking TanStack Query cache (each container has different UseCase instances, so cache keys don't match). Client DI Container uses singleton pattern, ensuring all components share the same instance for proper caching.

   ```typescript
   // ❌ WRONG: Server DI Container in client hook
   const container = createBenefitServerContainer();
   ```

2. **MUST NOT** use deprecated factory method pattern

   **Why?** The factory method pattern (`createGetBenefitsUseCase()`) is deprecated because it's verbose, creates unnecessary friction for developers, and doesn't align with modern JavaScript conventions. Individual getters (`getGetBenefits()`) are more concise, readable, and follow established patterns. Using deprecated patterns creates inconsistency and technical debt.

   ```typescript
   // ❌ WRONG: Deprecated pattern
   const useCase = container.createGetBenefitsUseCase();

   // ✅ CORRECT: Individual getter
   const useCase = container.getGetBenefits();
   ```

3. **MUST NOT** directly instantiate UseCase

   **Why?** Direct instantiation bypasses dependency injection, making code untestable (can't mock dependencies), tightly coupled (hard to change implementations), error-prone (easy to forget dependencies), and breaks the architecture. DI Container ensures all dependencies are properly initialized and maintains clean architecture boundaries between layers.

   ```typescript
   // ❌ WRONG: Direct instantiation
   const useCase = new GetBenefitsUseCase(repository);

   // ✅ CORRECT: Through container
   const useCase = container.getGetBenefits();
   ```

4. **MUST NOT** skip Adapter transformation

   **Why?** Skipping Adapter transformation exposes Domain Entities directly to Presentation layer, violating layer boundaries and creating tight coupling. UI components would depend on Entity structure, making Entity changes break components. Adapters ensure proper separation, enable Entity evolution without UI changes, and eliminate unsafe `as` type assertions that cause runtime errors.

   ```typescript
   // ❌ WRONG: Returning Entity directly
   queryFn: () => useCase.execute(), // Returns Entity!

   // ✅ CORRECT: Transform to UI Type
   queryFn: async () => {
     const entity = await useCase.execute();
     return BenefitAdapter.toUiItem(entity);
   }
   ```

5. **MUST NOT** hardcode query keys

   **Why?** Hardcoded queryKeys are error-prone (easy to make typos), difficult to maintain (changes require finding all occurrences), and impossible to type-check (no autocomplete). Centralized constants enable type-safe invalidation, make refactoring easy (change in one place), and allow grep/find-all to reliably track key usage across the codebase.

   ```typescript
   // ❌ WRONG: Hardcoded queryKey
   queryKey: ['benefit', 'list'],

   // ✅ CORRECT: Use constants
   queryKey: BENEFIT_QUERY_KEYS.list(),
   ```

6. **MUST NOT** omit parameters from queryKey

   **Why?** Omitting parameters from queryKey causes cache collisions where requests with different parameters incorrectly share cached data. For example, `list()` for `category: 'lunch'` and `list()` for `category: 'dinner'` would use the same cache key, returning wrong data. Including all parameters ensures each unique request has its own cache entry, preventing stale/incorrect data bugs.

   ```typescript
   // ❌ WRONG: Parameter not in queryKey
   queryKey: BENEFIT_QUERY_KEYS.list(), // Missing category!
   queryFn: () => useCase.execute({ category: 'lunch' }),

   // ✅ CORRECT: Include all parameters
   queryKey: BENEFIT_QUERY_KEYS.list({ category: 'lunch' }),
   ```

7. **MUST NOT** use hooks in non-React functions

   **Why?** React Hooks (including custom hooks that use useQuery) can only be called inside React components or other hooks. Calling hooks in regular functions violates React's Rules of Hooks, causing runtime errors ("Hooks can only be called inside the body of a function component"). This is a fundamental React constraint for proper hook state management.

   ```typescript
   // ❌ WRONG: Hook in regular function
   function fetchBenefits() {
     const { data } = useGetBenefitList(); // ❌
   }

   // ✅ CORRECT: Hook in React component
   const BenefitList = () => {
     const { data } = useGetBenefitList(); // ✅
   };
   ```

8. **MUST NOT** skip `'use client'` directive

   **Why?** Without 'use client' directive, Next.js may try to execute the Query Hook during Server-Side Rendering, causing runtime errors when accessing browser-only APIs (useQuery, localStorage via ClientSessionManager, window object). The directive explicitly marks the file as client-side code, ensuring it only runs in browser context where React hooks and client APIs work correctly.

   ```typescript
   // ❌ WRONG: No client directive
   import { useQuery } from '@tanstack/react-query';

   // ✅ CORRECT: Client directive at top
   ('use client');
   import { useQuery } from '@tanstack/react-query';
   ```

## Real-World Examples

### Example 1: Simple Query Hook

```typescript
// File: domains/user/presentation/client/hooks/queries/get-my-profile.query.ts
'use client';

import { useQuery } from '@tanstack/react-query';
import { getUserClientContainer } from '@/src/domains/user/di/user-client-container';
import { UserAdapter } from '@user/presentation/shared/adapters';
import { USER_QUERY_KEYS } from '@user/presentation/shared/constants';

/**
 * Query hook to fetch current user's profile
 *
 * @returns TanStack Query result with UserProfileItem
 */
export function useGetMyProfile() {
  const container = getUserClientContainer();
  const getMyProfileUseCase = container.getGetMyProfile();

  return useQuery({
    queryKey: USER_QUERY_KEYS.myProfile(),
    queryFn: async () => {
      const user = await getMyProfileUseCase.execute();
      return UserAdapter.toProfileUi(user);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
```

### Example 2: Parametrized Query Hook

```typescript
// File: domains/cafeteria/presentation/client/hooks/queries/get-cafeteria-detail.query.ts
'use client';

import { useQuery } from '@tanstack/react-query';
import { getCafeteriaClientContainer } from '@/src/domains/cafeteria/di/cafeteria-client-container';
import { CafeteriaAdapter } from '@cafeteria/presentation/shared/adapters';
import { CAFETERIA_QUERY_KEYS } from '@cafeteria/presentation/shared/constants';

/**
 * Query hook to fetch cafeteria detail by ID
 *
 * @param cafeteriaId - Cafeteria ID to fetch
 * @param options - Query options
 * @returns TanStack Query result with CafeteriaDetailItem
 */
export function useGetCafeteriaDetail(
  cafeteriaId: string,
  options?: {
    enabled?: boolean;
  }
) {
  const container = getCafeteriaClientContainer();
  const getCafeteriaDetailUseCase = container.getGetCafeteriaDetail();

  return useQuery({
    queryKey: CAFETERIA_QUERY_KEYS.detail(cafeteriaId),
    queryFn: async () => {
      const cafeteria = await getCafeteriaDetailUseCase.execute(cafeteriaId);
      return CafeteriaAdapter.toDetailUi(cafeteria);
    },
    enabled: !!cafeteriaId && (options?.enabled ?? true),
  });
}
```

### Example 3: Query Hook with Multiple Parameters

```typescript
// File: domains/benefit/presentation/client/hooks/queries/get-benefit-list.query.ts
'use client';

import { useQuery } from '@tanstack/react-query';
import { getBenefitClientContainer } from '@/src/domains/benefit/di/benefit-client-container';
import { BenefitAdapter } from '@benefit/presentation/shared/adapters';
import { BENEFIT_QUERY_KEYS } from '@benefit/presentation/shared/constants';

interface BenefitListOptions {
  category?: string;
  sortBy?: 'price' | 'discount' | 'popular';
  page?: number;
  limit?: number;
}

/**
 * Query hook to fetch filtered benefit list
 *
 * @param options - Filter and pagination options
 * @returns TanStack Query result with BenefitItem[]
 */
export function useGetBenefitList(options?: BenefitListOptions) {
  const container = getBenefitClientContainer();
  const getBenefitsUseCase = container.getGetBenefits();

  return useQuery({
    // All options included in queryKey for proper caching
    queryKey: BENEFIT_QUERY_KEYS.list(options),
    queryFn: async () => {
      const benefitList = await getBenefitsUseCase.execute(options);
      return BenefitAdapter.benefitListToUi(benefitList);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}
```

## Testing Query Hooks

### Unit Testing Query Hooks

```typescript
// File: domains/benefit/presentation/client/hooks/queries/__tests__/get-benefit-list.query.test.tsx
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useGetBenefitList } from '../get-benefit-list.query';
import { getBenefitClientContainer } from '@/src/domains/benefit/di/benefit-client-container';

// Mock DI Container
vi.mock('@benefit/di/benefit-client-container');

describe('useGetBenefitList', () => {
  it('should fetch and transform benefit list', async () => {
    // Setup
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    // Mock UseCase
    const mockExecute = vi.fn().mockResolvedValue({
      benefits: [
        /* mock entities */
      ],
      totalCount: 10,
    });

    (getBenefitClientContainer as any).mockReturnValue({
      getGetBenefits: () => ({
        execute: mockExecute,
      }),
    });

    // Execute
    const { result } = renderHook(() => useGetBenefitList(), { wrapper });

    // Assert
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockExecute).toHaveBeenCalledOnce();
    expect(result.current.data).toBeDefined();
  });
});
```

## Summary

Query Hooks are the **bridge between UseCases and React Components**:

1. **File Naming**: `get-[feature].query.ts`
2. **Hook Naming**: `useGet[Feature]`
3. **Container**: Use Client DI Container (`getXXXClientContainer()`)
4. **UseCase Getter**: Individual getter pattern (`container.getGetBenefits()`)
5. **Transformation**: Entity → UI Type with Adapter
6. **Query Keys**: Centralized constants with hierarchical structure (see [query-keys.md](./query-keys.md))
7. **Type Safety**: Full TypeScript inference from `useQuery`

**Never use Query Hooks in Server Components** - they are client-side only with `'use client'` directive.

---

**Related Documentation**:

- [mutation-hooks.md](./mutation-hooks.md) - Mutation hooks and invalidation patterns
- [query-keys.md](./query-keys.md) - Query key conventions and hierarchical structure
- [adapter-pattern.md](./adapter-basics.md) - Entity → UI transformations
- [di-containers.md](../di-containers.md) - Client DI Container patterns
- [frontend.md](../frontend.md) - Component integration
