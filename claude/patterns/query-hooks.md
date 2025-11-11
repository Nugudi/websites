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
4. [Container Method Naming](#container-method-naming)
5. [Query Hook Pattern](#query-hook-pattern)
6. [MUST / MUST NOT Rules](#must--must-not-rules)
7. [Real-World Examples](#real-world-examples)
8. [Testing Query Hooks](#testing-query-hooks)

## What are Query Hooks?

**Query Hooks** are custom React hooks that wrap TanStack Query's `useQuery` to provide:

- **DI Container integration**: Access to UseCases via Client Container
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

## Container Method Naming

### ✅ CORRECT: Individual UseCase Getters

**Pattern**: Container provides `getGet[UseCase]()` method

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
import { getBenefitClientContainer } from '@benefit/di/benefit-client-container';
import { BenefitAdapter } from '@benefit/presentation/shared/adapters';
import { BENEFIT_QUERY_KEYS } from '@benefit/presentation/shared/constants';

/**
 * Query hook to fetch benefit list
 *
 * @description
 * Fetches benefits from API via UseCase and transforms to UI type using Adapter.
 * Uses Client Container for singleton UseCase instance.
 * Automatically caches with TanStack Query.
 *
 * @returns TanStack Query result with BenefitItem[]
 */
export function useGetBenefitList() {
  // 1. Get Client Container (lazy singleton)
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
import { getBenefitClientContainer } from '@benefit/di/benefit-client-container';
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

1. **MUST** use Client Container in Query Hooks

   ```typescript
   // ✅ CORRECT: Client Container in hook
   const container = getBenefitClientContainer();
   ```

2. **MUST** use individual UseCase getters from container

   ```typescript
   // ✅ CORRECT: Individual getter
   const getBenefitsUseCase = container.getGetBenefits();
   ```

3. **MUST** follow file naming convention: `get-[feature].query.ts`

   ```
   ✅ get-benefit-list.query.ts
   ✅ get-my-profile.query.ts
   ```

4. **MUST** follow hook naming convention: `useGet[Feature]`

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

   ```typescript
   // ✅ CORRECT: Using Adapter
   queryFn: async () => {
     const entity = await useCase.execute();
     return BenefitAdapter.toUiItem(entity);
   };
   ```

6. **MUST** include all parameters in queryKey

   ```typescript
   // ✅ CORRECT: Parameters in queryKey
   queryKey: BENEFIT_QUERY_KEYS.detail(benefitId),
   ```

7. **MUST** use constants for queryKeys

   ```typescript
   // ✅ CORRECT: Centralized queryKeys
   queryKey: BENEFIT_QUERY_KEYS.list(),
   ```

8. **MUST** add `'use client'` directive at top of file

   ```typescript
   // ✅ CORRECT: Client directive
   'use client';

   import { useQuery } from '@tanstack/react-query';
   ```

9. **MUST** provide comprehensive JSDoc for hook

   ```typescript
   // ✅ CORRECT: Complete JSDoc
   /**
    * Query hook to fetch benefit list
    *
    * @description
    * Fetches benefits from API via UseCase and transforms to UI type using Adapter.
    * Uses Client Container for singleton UseCase instance.
    *
    * @param options - Query options
    * @returns TanStack Query result with BenefitItem[]
    */
   ```

10. **MUST** use `enabled` option for conditional queries
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

1. **MUST NOT** use Server Container in Query Hooks

   ```typescript
   // ❌ WRONG: Server Container in client hook
   const container = createBenefitServerContainer();
   ```

2. **MUST NOT** use deprecated factory method pattern

   ```typescript
   // ❌ WRONG: Deprecated pattern
   const useCase = container.createGetBenefitsUseCase();

   // ✅ CORRECT: Individual getter
   const useCase = container.getGetBenefits();
   ```

3. **MUST NOT** directly instantiate UseCase

   ```typescript
   // ❌ WRONG: Direct instantiation
   const useCase = new GetBenefitsUseCase(repository);

   // ✅ CORRECT: Through container
   const useCase = container.getGetBenefits();
   ```

4. **MUST NOT** skip Adapter transformation

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

   ```typescript
   // ❌ WRONG: Hardcoded queryKey
   queryKey: ['benefit', 'list'],

   // ✅ CORRECT: Use constants
   queryKey: BENEFIT_QUERY_KEYS.list(),
   ```

6. **MUST NOT** omit parameters from queryKey

   ```typescript
   // ❌ WRONG: Parameter not in queryKey
   queryKey: BENEFIT_QUERY_KEYS.list(), // Missing category!
   queryFn: () => useCase.execute({ category: 'lunch' }),

   // ✅ CORRECT: Include all parameters
   queryKey: BENEFIT_QUERY_KEYS.list({ category: 'lunch' }),
   ```

7. **MUST NOT** use hooks in non-React functions

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
import { getUserClientContainer } from '@user/di/user-client-container';
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
import { getCafeteriaClientContainer } from '@cafeteria/di/cafeteria-client-container';
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
import { getBenefitClientContainer } from '@benefit/di/benefit-client-container';
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
import { getBenefitClientContainer } from '@benefit/di/benefit-client-container';

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
3. **Container**: Use Client Container (`getXXXClientContainer()`)
4. **UseCase Getter**: Individual getter pattern (`container.getGetBenefits()`)
5. **Transformation**: Entity → UI Type with Adapter
6. **Query Keys**: Centralized constants with hierarchical structure (see [query-keys.md](./query-keys.md))
7. **Type Safety**: Full TypeScript inference from `useQuery`

**Never use Query Hooks in Server Components** - they are client-side only with `'use client'` directive.

---

**Related Documentation**:

- [mutation-hooks.md](./mutation-hooks.md) - Mutation hooks and invalidation patterns
- [query-keys.md](./query-keys.md) - Query key conventions and hierarchical structure
- [adapter-pattern.md](./adapter-pattern.md) - Entity → UI transformations
- [di-containers.md](../di-containers.md) - Client Container patterns
- [frontend.md](../frontend.md) - Component integration
