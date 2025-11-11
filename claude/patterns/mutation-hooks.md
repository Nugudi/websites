---
description: Mutation hooks with TanStack Query, use[Action][Resource] patterns, invalidation strategies, and optimistic updates
globs:
  - "**/hooks/mutations/**/*.mutation.ts"
  - "**/hooks/mutations/**/*.mutation.tsx"
alwaysApply: true
---

# Mutation Hooks Guide

> **Target Audience**: Frontend developers working with TanStack Query mutations
> **Prerequisites**: Read [../di-containers.md](../di-containers.md) and [query-hooks.md](./query-hooks.md) first
> **Related Docs**: [query-keys.md](./query-keys.md), [../frontend.md](../frontend.md)

## 📋 Table of Contents

1. [What are Mutation Hooks?](#what-are-mutation-hooks)
2. [File Naming Conventions](#file-naming-conventions)
3. [Hook Naming Conventions](#hook-naming-conventions)
4. [Mutation Hook Pattern](#mutation-hook-pattern)
5. [Query Invalidation Patterns](#query-invalidation-patterns)
6. [MUST / MUST NOT Rules](#must--must-not-rules)
7. [Real-World Examples](#real-world-examples)
8. [Testing Mutation Hooks](#testing-mutation-hooks)

## What are Mutation Hooks?

**Mutation Hooks** are custom React hooks that wrap TanStack Query's `useMutation` to provide:

- **DI Container integration**: Access to UseCases via Client Container
- **Type safety**: Full TypeScript inference
- **Query invalidation**: Automatic cache updates after mutations
- **Optimistic updates**: Instant UI feedback before server response
- **Error handling**: Automatic rollback on failure

### Before Mutation Hooks (❌ Anti-Pattern)

```typescript
// ❌ WRONG: Component directly using UseCase
'use client';
const ReviewForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const container = getCafeteriaClientContainer();
      const useCase = container.getCreateCafeteriaReview();
      await useCase.execute(data);
      // Manual cache invalidation? Forgot it...
    } catch (error) {
      // Manual error handling
    } finally {
      setIsSubmitting(false);
    }
  };

  // No automatic cache updates, manual loading state
};
```

### After Mutation Hooks (✅ Clean)

```typescript
// ✅ CORRECT: Using Mutation Hook
'use client';
const ReviewForm = () => {
  const { mutate, isPending } = useCreateCafeteriaReview();

  const handleSubmit = (data) => {
    mutate(data); // Automatic invalidation, error handling!
  };

  // Automatic loading state, cache updates!
};
```

## File Naming Conventions

### Mutation Hook Files

**Pattern**: `[action]-[resource].mutation.ts`

```
domains/benefit/presentation/client/hooks/mutations/
  ✅ create-benefit-review.mutation.ts  # ✅ CORRECT
  ✅ update-benefit-status.mutation.ts  # ✅ CORRECT
  ✅ delete-benefit.mutation.ts         # ✅ CORRECT
  ✅ submit-cafeteria-review.mutation.ts # ✅ CORRECT
  ✅ toggle-stamp-status.mutation.ts    # ✅ CORRECT
```

**Why this naming?**

- **`[action]-`**: Verb indicating operation (create, update, delete, submit, toggle)
- **`[resource]`**: Resource being mutated (kebab-case)
- **`.mutation.ts`**: File type designation for mutations

### Common Action Verbs

- **create**: Creating new resources
- **update**: Updating existing resources
- **delete**: Deleting resources
- **submit**: Submitting forms/data
- **toggle**: Toggling boolean states
- **add**: Adding items to collections
- **remove**: Removing items from collections

### ❌ Wrong Naming Examples

```
❌ createReview.mutation.ts       # camelCase instead of kebab-case
❌ benefit-review.mutation.ts     # Missing action verb
❌ create-review.ts               # Missing '.mutation' suffix
❌ useCreateReview.mutation.ts    # Don't include 'use' in filename
```

## Hook Naming Conventions

### Mutation Hook Names

**Pattern**: `use[Action][Resource]`

```typescript
// ✅ CORRECT: Mutation hook names
export function useCreateBenefitReview() {
  /* ... */
}
export function useUpdateBenefitStatus() {
  /* ... */
}
export function useDeleteBenefit() {
  /* ... */
}
export function useSubmitCafeteriaReview() {
  /* ... */
}
export function useToggleStampStatus() {
  /* ... */
}
```

**Why this naming?**

- **`use`**: React hook convention (required)
- **`[Action]`**: PascalCase action verb (Create, Update, Delete, Submit, Toggle)
- **`[Resource]`**: PascalCase resource name
- **Type inference**: Return type automatically inferred from `useMutation`

### ❌ Wrong Hook Names

```typescript
❌ export function useBenefitReviewCreate() { }  // Action after resource
❌ export function createBenefitReview() { }     // Missing 'use' prefix
❌ export function useMutateBenefitReview() { }  // Don't use 'Mutate' in name
❌ export function useCreatereview() { }         // Wrong casing
```

## Mutation Hook Pattern

### Basic Structure

```typescript
// File: domains/cafeteria/presentation/client/hooks/mutations/create-cafeteria-review.mutation.ts
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCafeteriaClientContainer } from '@cafeteria/di/cafeteria-client-container';
import { CAFETERIA_QUERY_KEYS } from '@cafeteria/presentation/shared/constants';

/**
 * Mutation hook to create cafeteria review
 *
 * @description
 * Creates a new review via UseCase and invalidates related queries.
 * Uses Client Container for UseCase instance.
 *
 * @returns TanStack Mutation result
 */
export function useCreateCafeteriaReview() {
  const queryClient = useQueryClient();

  // 1. Get Client Container
  const container = getCafeteriaClientContainer();

  // 2. Get individual UseCase
  const createReviewUseCase = container.getCreateCafeteriaReview();

  // 3. Return useMutation
  return useMutation({
    mutationFn: async (params: {
      cafeteriaId: string;
      content: string;
      rating: number;
    }) => {
      // 4. Execute UseCase with params
      return await createReviewUseCase.execute(params);
    },
    onSuccess: (data, variables) => {
      // 5. Invalidate related queries after successful mutation
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

### With Error Handling

```typescript
// File: update-benefit-status.mutation.ts
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getBenefitClientContainer } from '@benefit/di/benefit-client-container';
import { BENEFIT_QUERY_KEYS } from '@benefit/presentation/shared/constants';

interface UpdateStatusParams {
  benefitId: string;
  status: 'active' | 'inactive';
}

/**
 * Mutation hook to update benefit status
 *
 * @returns TanStack Mutation result
 */
export function useUpdateBenefitStatus() {
  const queryClient = useQueryClient();
  const container = getBenefitClientContainer();
  const updateStatusUseCase = container.getUpdateBenefitStatus();

  return useMutation({
    mutationFn: async (params: UpdateStatusParams) => {
      return await updateStatusUseCase.execute(params);
    },
    onSuccess: (data, variables) => {
      // Invalidate specific benefit detail
      queryClient.invalidateQueries({
        queryKey: BENEFIT_QUERY_KEYS.detail(variables.benefitId),
      });

      // Invalidate all benefit lists
      queryClient.invalidateQueries({
        queryKey: BENEFIT_QUERY_KEYS.lists(),
      });
    },
    onError: (error, variables) => {
      // Error handling can be done in component
      console.error('Failed to update benefit status:', error);
    },
  });
}
```

### With Optimistic Updates

```typescript
// File: toggle-stamp-status.mutation.ts
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getStampClientContainer } from '@stamp/di/stamp-client-container';
import { STAMP_QUERY_KEYS } from '@stamp/presentation/shared/constants';
import type { StampItem } from '@stamp/presentation/shared/types';

/**
 * Mutation hook to toggle stamp used status
 *
 * @description
 * Optimistically updates the UI before server response.
 * Automatically rolls back on error.
 *
 * @returns TanStack Mutation result
 */
export function useToggleStampStatus() {
  const queryClient = useQueryClient();
  const container = getStampClientContainer();
  const toggleStampUseCase = container.getToggleStamp();

  return useMutation({
    mutationFn: async (stampId: string) => {
      return await toggleStampUseCase.execute(stampId);
    },
    onMutate: async (stampId) => {
      // 1. Cancel outgoing refetches (prevent race conditions)
      await queryClient.cancelQueries({
        queryKey: STAMP_QUERY_KEYS.collection(),
      });

      // 2. Snapshot previous value for rollback
      const previousStamps = queryClient.getQueryData<StampItem[]>(
        STAMP_QUERY_KEYS.collection()
      );

      // 3. Optimistically update UI
      queryClient.setQueryData<StampItem[]>(
        STAMP_QUERY_KEYS.collection(),
        (old) => {
          if (!old) return old;
          return old.map((stamp) =>
            stamp.id === stampId ? { ...stamp, isUsed: !stamp.isUsed } : stamp
          );
        }
      );

      // 4. Return context with snapshot for rollback
      return { previousStamps };
    },
    onError: (err, stampId, context) => {
      // 5. Rollback on error
      if (context?.previousStamps) {
        queryClient.setQueryData(
          STAMP_QUERY_KEYS.collection(),
          context.previousStamps
        );
      }
    },
    onSettled: () => {
      // 6. Always refetch after mutation (success or error)
      queryClient.invalidateQueries({
        queryKey: STAMP_QUERY_KEYS.collection(),
      });
    },
  });
}
```

### With Multiple Invalidations

```typescript
// File: delete-benefit.mutation.ts
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getBenefitClientContainer } from '@benefit/di/benefit-client-container';
import { BENEFIT_QUERY_KEYS } from '@benefit/presentation/shared/constants';

/**
 * Mutation hook to delete a benefit
 *
 * @description
 * Deletes a benefit and invalidates all related queries.
 *
 * @returns TanStack Mutation result
 */
export function useDeleteBenefit() {
  const queryClient = useQueryClient();
  const container = getBenefitClientContainer();
  const deleteBenefitUseCase = container.getDeleteBenefit();

  return useMutation({
    mutationFn: async (benefitId: string) => {
      return await deleteBenefitUseCase.execute(benefitId);
    },
    onSuccess: (data, benefitId) => {
      // Invalidate all lists (benefit might be in any list)
      queryClient.invalidateQueries({
        queryKey: BENEFIT_QUERY_KEYS.lists(),
      });

      // Invalidate specific detail
      queryClient.invalidateQueries({
        queryKey: BENEFIT_QUERY_KEYS.detail(benefitId),
      });

      // Invalidate categories (counts might change)
      queryClient.invalidateQueries({
        queryKey: BENEFIT_QUERY_KEYS.categories(),
      });
    },
  });
}
```

## Query Invalidation Patterns

### Invalidation Strategies

See [query-keys.md](./query-keys.md) for detailed query key structure.

#### 1. Invalidate All Domain Queries

```typescript
// Invalidates ALL benefit queries
queryClient.invalidateQueries({
  queryKey: BENEFIT_QUERY_KEYS.all,
});
// Invalidates: ['benefit', ...]
```

#### 2. Invalidate All Lists

```typescript
// Invalidates ALL list queries (with any options)
queryClient.invalidateQueries({
  queryKey: BENEFIT_QUERY_KEYS.lists(),
});
// Invalidates: ['benefit', 'list', ...]
```

#### 3. Invalidate Specific Detail

```typescript
// Invalidates only specific benefit detail
queryClient.invalidateQueries({
  queryKey: BENEFIT_QUERY_KEYS.detail(benefitId),
});
// Invalidates: ['benefit', 'detail', '123']
```

#### 4. Invalidate Multiple Related Queries

```typescript
onSuccess: (data, variables) => {
  // Invalidate list (contains the new item)
  queryClient.invalidateQueries({
    queryKey: CAFETERIA_QUERY_KEYS.lists(),
  });

  // Invalidate detail (review count changed)
  queryClient.invalidateQueries({
    queryKey: CAFETERIA_QUERY_KEYS.detail(variables.cafeteriaId),
  });

  // Invalidate reviews (new review added)
  queryClient.invalidateQueries({
    queryKey: CAFETERIA_QUERY_KEYS.reviews(variables.cafeteriaId),
  });
};
```

### When to Invalidate What

| Mutation Type | Invalidation Strategy                                                       |
| ------------- | --------------------------------------------------------------------------- |
| **Create**    | Invalidate lists + categories (new item might appear)                       |
| **Update**    | Invalidate specific detail + lists (if list display data changed)           |
| **Delete**    | Invalidate lists + specific detail + categories                             |
| **Toggle**    | Invalidate specific item (or use optimistic update)                         |
| **Reorder**   | Invalidate specific list (with exact options)                                |
| **Batch**     | Invalidate all domain queries (safest for multiple changes)                 |

## MUST / MUST NOT Rules

### ✅ MUST

1. **MUST** use Client Container in Mutation Hooks

   ```typescript
   // ✅ CORRECT: Client Container in hook
   const container = getCafeteriaClientContainer();
   ```

2. **MUST** use `useQueryClient` for invalidations

   ```typescript
   // ✅ CORRECT: Get queryClient instance
   const queryClient = useQueryClient();
   ```

3. **MUST** follow file naming convention: `[action]-[resource].mutation.ts`

   ```
   ✅ create-cafeteria-review.mutation.ts
   ✅ update-benefit-status.mutation.ts
   ✅ delete-stamp.mutation.ts
   ```

4. **MUST** follow hook naming convention: `use[Action][Resource]`

   ```typescript
   // ✅ CORRECT: Hook names
   export function useCreateCafeteriaReview() {
     /* ... */
   }
   export function useUpdateBenefitStatus() {
     /* ... */
   }
   ```

5. **MUST** invalidate related queries after mutation

   ```typescript
   // ✅ CORRECT: Invalidate on success
   onSuccess: (data, variables) => {
     queryClient.invalidateQueries({
       queryKey: CAFETERIA_QUERY_KEYS.lists(),
     });
   };
   ```

6. **MUST** use constants for query keys in invalidations

   ```typescript
   // ✅ CORRECT: Centralized queryKeys
   queryClient.invalidateQueries({
     queryKey: BENEFIT_QUERY_KEYS.lists(),
   });
   ```

7. **MUST** add `'use client'` directive at top of file

   ```typescript
   // ✅ CORRECT: Client directive
   'use client';

   import { useMutation } from '@tanstack/react-query';
   ```

8. **MUST** provide comprehensive JSDoc for hook

   ```typescript
   // ✅ CORRECT: Complete JSDoc
   /**
    * Mutation hook to create cafeteria review
    *
    * @description
    * Creates a new review via UseCase and invalidates related queries.
    *
    * @returns TanStack Mutation result
    */
   ```

9. **MUST** return context from `onMutate` for optimistic updates

   ```typescript
   // ✅ CORRECT: Return context for rollback
   onMutate: async (variables) => {
     const previousData = queryClient.getQueryData(queryKey);
     // ... optimistic update
     return { previousData }; // For rollback
   };
   ```

10. **MUST** use `onSettled` for final refetch after optimistic update
    ```typescript
    // ✅ CORRECT: Always refetch after optimistic update
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: STAMP_QUERY_KEYS.collection() });
    };
    ```

### ❌ MUST NOT

1. **MUST NOT** use Server Container in Mutation Hooks

   ```typescript
   // ❌ WRONG: Server Container in client hook
   const container = createCafeteriaServerContainer();
   ```

2. **MUST NOT** directly instantiate UseCase

   ```typescript
   // ❌ WRONG: Direct instantiation
   const useCase = new CreateReviewUseCase(repository);

   // ✅ CORRECT: Through container
   const useCase = container.getCreateCafeteriaReview();
   ```

3. **MUST NOT** forget to invalidate queries after mutation

   ```typescript
   // ❌ WRONG: No invalidation
   return useMutation({
     mutationFn: async (params) => {
       return await useCase.execute(params);
     },
     // Missing onSuccess with invalidation!
   });

   // ✅ CORRECT: Always invalidate
   onSuccess: () => {
     queryClient.invalidateQueries({
       queryKey: CAFETERIA_QUERY_KEYS.lists(),
     });
   };
   ```

4. **MUST NOT** hardcode query keys in invalidations

   ```typescript
   // ❌ WRONG: Hardcoded queryKey
   queryClient.invalidateQueries({
     queryKey: ['cafeteria', 'list'],
   });

   // ✅ CORRECT: Use constants
   queryClient.invalidateQueries({
     queryKey: CAFETERIA_QUERY_KEYS.lists(),
   });
   ```

5. **MUST NOT** skip `onError` rollback for optimistic updates

   ```typescript
   // ❌ WRONG: Optimistic update without rollback
   onMutate: async (variables) => {
     queryClient.setQueryData(queryKey, newData);
     // No context returned!
   };
   // Missing onError rollback!

   // ✅ CORRECT: Always implement rollback
   onMutate: async (variables) => {
     const previousData = queryClient.getQueryData(queryKey);
     queryClient.setQueryData(queryKey, newData);
     return { previousData };
   },
   onError: (err, variables, context) => {
     queryClient.setQueryData(queryKey, context.previousData);
   };
   ```

6. **MUST NOT** use hooks in non-React functions

   ```typescript
   // ❌ WRONG: Hook in regular function
   function submitReview(data) {
     const { mutate } = useCreateCafeteriaReview(); // ❌
   }

   // ✅ CORRECT: Hook in React component
   const ReviewForm = () => {
     const { mutate } = useCreateCafeteriaReview(); // ✅
   };
   ```

7. **MUST NOT** skip `'use client'` directive

   ```typescript
   // ❌ WRONG: No client directive
   import { useMutation } from '@tanstack/react-query';

   // ✅ CORRECT: Client directive at top
   ('use client');
   import { useMutation } from '@tanstack/react-query';
   ```

8. **MUST NOT** invalidate too broadly (unless necessary)

   ```typescript
   // ❌ WRONG: Over-invalidation
   onSuccess: () => {
     queryClient.invalidateQueries(); // Invalidates EVERYTHING!
   };

   // ✅ CORRECT: Targeted invalidation
   onSuccess: () => {
     queryClient.invalidateQueries({
       queryKey: BENEFIT_QUERY_KEYS.lists(), // Only relevant queries
     });
   };
   ```

## Real-World Examples

### Example 1: Create Mutation with Multiple Invalidations

```typescript
// File: domains/cafeteria/presentation/client/hooks/mutations/create-cafeteria-review.mutation.ts
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCafeteriaClientContainer } from '@cafeteria/di/cafeteria-client-container';
import { CAFETERIA_QUERY_KEYS } from '@cafeteria/presentation/shared/constants';

interface CreateReviewParams {
  cafeteriaId: string;
  content: string;
  selectedRatings: string[];
}

/**
 * Mutation hook to create cafeteria review
 *
 * @returns TanStack Mutation result
 */
export function useCreateCafeteriaReview() {
  const queryClient = useQueryClient();
  const container = getCafeteriaClientContainer();
  const createReviewUseCase = container.getCreateCafeteriaReview();

  return useMutation({
    mutationFn: async (params: CreateReviewParams) => {
      return await createReviewUseCase.execute(params);
    },
    onSuccess: (_, variables) => {
      // Invalidate cafeteria detail (includes reviews)
      queryClient.invalidateQueries({
        queryKey: CAFETERIA_QUERY_KEYS.detail(variables.cafeteriaId),
      });

      // Invalidate reviews list
      queryClient.invalidateQueries({
        queryKey: CAFETERIA_QUERY_KEYS.reviews(variables.cafeteriaId),
      });
    },
  });
}
```

### Example 2: Update Mutation with Optimistic Update

```typescript
// File: domains/stamp/presentation/client/hooks/mutations/toggle-stamp-status.mutation.ts
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getStampClientContainer } from '@stamp/di/stamp-client-container';
import { STAMP_QUERY_KEYS } from '@stamp/presentation/shared/constants';
import type { StampItem } from '@stamp/presentation/shared/types';

/**
 * Mutation hook to toggle stamp used status
 *
 * @description
 * Optimistically updates the UI for instant feedback.
 * Rolls back on error.
 *
 * @returns TanStack Mutation result
 */
export function useToggleStampStatus() {
  const queryClient = useQueryClient();
  const container = getStampClientContainer();
  const toggleStampUseCase = container.getToggleStamp();

  return useMutation({
    mutationFn: async (stampId: string) => {
      return await toggleStampUseCase.execute(stampId);
    },
    onMutate: async (stampId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: STAMP_QUERY_KEYS.collection(),
      });

      // Snapshot previous value
      const previousStamps = queryClient.getQueryData<StampItem[]>(
        STAMP_QUERY_KEYS.collection()
      );

      // Optimistically update UI
      queryClient.setQueryData<StampItem[]>(
        STAMP_QUERY_KEYS.collection(),
        (old) => {
          if (!old) return old;
          return old.map((stamp) =>
            stamp.id === stampId ? { ...stamp, isUsed: !stamp.isUsed } : stamp
          );
        }
      );

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
    onSettled: () => {
      // Always refetch after mutation
      queryClient.invalidateQueries({
        queryKey: STAMP_QUERY_KEYS.collection(),
      });
    },
  });
}
```

### Example 3: Delete Mutation with Broad Invalidation

```typescript
// File: domains/benefit/presentation/client/hooks/mutations/delete-benefit.mutation.ts
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getBenefitClientContainer } from '@benefit/di/benefit-client-container';
import { BENEFIT_QUERY_KEYS } from '@benefit/presentation/shared/constants';

/**
 * Mutation hook to delete a benefit
 *
 * @description
 * Deletes benefit and invalidates all related queries.
 *
 * @returns TanStack Mutation result
 */
export function useDeleteBenefit() {
  const queryClient = useQueryClient();
  const container = getBenefitClientContainer();
  const deleteBenefitUseCase = container.getDeleteBenefit();

  return useMutation({
    mutationFn: async (benefitId: string) => {
      return await deleteBenefitUseCase.execute(benefitId);
    },
    onSuccess: (data, benefitId) => {
      // Invalidate all lists
      queryClient.invalidateQueries({
        queryKey: BENEFIT_QUERY_KEYS.lists(),
      });

      // Invalidate specific detail
      queryClient.invalidateQueries({
        queryKey: BENEFIT_QUERY_KEYS.detail(benefitId),
      });

      // Invalidate categories (counts changed)
      queryClient.invalidateQueries({
        queryKey: BENEFIT_QUERY_KEYS.categories(),
      });
    },
  });
}
```

## Testing Mutation Hooks

### Unit Testing Mutation Hooks

```typescript
// File: domains/cafeteria/presentation/client/hooks/mutations/__tests__/create-cafeteria-review.mutation.test.tsx
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useCreateCafeteriaReview } from '../create-cafeteria-review.mutation';
import { getCafeteriaClientContainer } from '@cafeteria/di/cafeteria-client-container';

// Mock DI Container
vi.mock('@cafeteria/di/cafeteria-client-container');

describe('useCreateCafeteriaReview', () => {
  it('should create review and invalidate queries', async () => {
    // Setup
    const queryClient = new QueryClient({
      defaultOptions: { mutations: { retry: false } },
    });

    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    // Mock UseCase
    const mockExecute = vi.fn().mockResolvedValue({ success: true });

    (getCafeteriaClientContainer as any).mockReturnValue({
      getCreateCafeteriaReview: () => ({
        execute: mockExecute,
      }),
    });

    // Spy on invalidateQueries
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

    // Execute
    const { result } = renderHook(() => useCreateCafeteriaReview(), {
      wrapper,
    });

    result.current.mutate({
      cafeteriaId: '123',
      content: 'Great food!',
      selectedRatings: ['taste', 'service'],
    });

    // Assert
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockExecute).toHaveBeenCalledWith({
      cafeteriaId: '123',
      content: 'Great food!',
      selectedRatings: ['taste', 'service'],
    });
    expect(invalidateSpy).toHaveBeenCalled();
  });
});
```

## Summary

Mutation Hooks are the **bridge between UseCases and React Components for data modifications**:

1. **File Naming**: `[action]-[resource].mutation.ts`
2. **Hook Naming**: `use[Action][Resource]`
3. **Container**: Use Client Container (`getXXXClientContainer()`)
4. **UseCase Getter**: Individual getter pattern (`container.getCreateCafeteriaReview()`)
5. **Query Keys**: Centralized constants for invalidation (see [query-keys.md](./query-keys.md))
6. **Invalidation**: Always invalidate related queries after mutations
7. **Optimistic Updates**: Use `onMutate` + `onError` rollback for instant feedback

**Never use Mutation Hooks in Server Components** - they are client-side only with `'use client'` directive.

---

**Related Documentation**:

- [query-hooks.md](./query-hooks.md) - Query hooks and data fetching patterns
- [query-keys.md](./query-keys.md) - Query key conventions and hierarchical structure
- [di-containers.md](../di-containers.md) - Client Container patterns
- [frontend.md](../frontend.md) - Component integration
