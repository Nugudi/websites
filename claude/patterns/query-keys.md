---
description: Query key conventions, hierarchical patterns, invalidation strategies, and TanStack Query cache management
globs:
  - "**/constants/query-keys.ts"
  - "**/constants/**/*-query-keys.ts"
alwaysApply: true
---

# Query Keys Guide

> **Target Audience**: Frontend developers working with TanStack Query
> **Prerequisites**: Read [query-hooks.md](./query-hooks.md) and [mutation-hooks.md](./mutation-hooks.md) first
> **Related Docs**: [frontend.md](../frontend.md)

## 📋 Table of Contents

1. [What are Query Keys?](#what-are-query-keys)
2. [File Location](#file-location)
3. [Query Key Structure](#query-key-structure)
4. [Hierarchical Pattern](#hierarchical-pattern)
5. [Usage Examples](#usage-examples)
6. [Invalidation Patterns](#invalidation-patterns)
7. [Best Practices](#best-practices)
8. [Quick Reference](#quick-reference)

## What are Query Keys?

**Query Keys** are unique identifiers for TanStack Query cache entries. They determine:

- **Cache identity**: Which queries share the same cached data
- **Invalidation scope**: Which queries get refetched when data changes
- **Type safety**: TypeScript inference for query parameters
- **Debugging**: Easy to identify queries in DevTools

### Why Centralized Query Keys?

**Before (❌ Anti-Pattern):**

```typescript
// Component A
useQuery({ queryKey: ['benefit', 'list'] });

// Component B
useQuery({ queryKey: ['benefits', 'list'] }); // Typo! Different cache!

// Mutation
queryClient.invalidateQueries({ queryKey: ['benefit'] }); // Partial match
```

**After (✅ Clean):**

```typescript
// Centralized constants
export const BENEFIT_QUERY_KEYS = {
  all: ['benefit'] as const,
  lists: () => [...BENEFIT_QUERY_KEYS.all, 'list'] as const,
};

// Component A
useQuery({ queryKey: BENEFIT_QUERY_KEYS.lists() });

// Component B
useQuery({ queryKey: BENEFIT_QUERY_KEYS.lists() }); // Same cache!

// Mutation
queryClient.invalidateQueries({ queryKey: BENEFIT_QUERY_KEYS.lists() });
```

## File Location

**Pattern**: `domains/[domain]/presentation/shared/constants/query-keys.ts`

```
domains/benefit/presentation/shared/constants/
  ✅ query-keys.ts                    # ✅ CORRECT: All benefit query keys
```

**Alternative for large domains**:

```
domains/benefit/presentation/shared/constants/
  ✅ benefit-query-keys.ts            # ✅ CORRECT: Scoped to benefit
  ✅ benefit-review-query-keys.ts     # ✅ CORRECT: Scoped to reviews
```

### ❌ Wrong Locations

```
❌ src/constants/query-keys.ts              # Too global
❌ domains/benefit/query-keys.ts            # Wrong layer (not in presentation)
❌ domains/benefit/presentation/client/     # Should be in shared, not client
❌ domains/benefit/hooks/query-keys.ts      # Should be in constants
```

## Query Key Structure

### Basic Pattern

**Pattern**: `[domain, feature, ...params]` with hierarchical composition

```typescript
// File: domains/benefit/presentation/shared/constants/query-keys.ts
export const BENEFIT_QUERY_KEYS = {
  // Level 1: Domain root (invalidates ALL benefit queries)
  all: ['benefit'] as const,

  // Level 2: Feature groups (invalidates ALL lists, ALL details, etc.)
  lists: () => [...BENEFIT_QUERY_KEYS.all, 'list'] as const,
  details: () => [...BENEFIT_QUERY_KEYS.all, 'detail'] as const,

  // Level 3: Specific queries (invalidates specific list/detail)
  list: (options?: { category?: string; sortBy?: string }) =>
    [...BENEFIT_QUERY_KEYS.lists(), options] as const,
  detail: (id: string) => [...BENEFIT_QUERY_KEYS.details(), id] as const,

  // Additional features
  categories: () => [...BENEFIT_QUERY_KEYS.all, 'categories'] as const,
  myBenefits: () => [...BENEFIT_QUERY_KEYS.all, 'my-benefits'] as const,
};
```

### Why `as const`?

```typescript
// Without 'as const'
const keys = ['benefit', 'list'];
// Type: string[] - Too loose!

// With 'as const'
const keys = ['benefit', 'list'] as const;
// Type: readonly ["benefit", "list"] - Type-safe!
```

**Benefits:**

- TypeScript infers exact tuple types
- Prevents accidental mutations
- Better autocomplete in IDEs
- Compile-time error detection

## Hierarchical Pattern

### The Hierarchy Explained

```
BENEFIT_QUERY_KEYS
│
├─ all: ['benefit']
│  │
│  ├─ lists: ['benefit', 'list']
│  │  │
│  │  └─ list(options): ['benefit', 'list', { category: 'lunch' }]
│  │
│  ├─ details: ['benefit', 'detail']
│  │  │
│  │  └─ detail(id): ['benefit', 'detail', '123']
│  │
│  ├─ categories: ['benefit', 'categories']
│  │
│  └─ myBenefits: ['benefit', 'my-benefits']
```

### Example: Complete Domain Query Keys

```typescript
// File: domains/cafeteria/presentation/shared/constants/query-keys.ts
export const CAFETERIA_QUERY_KEYS = {
  // Level 1: Domain root
  all: ['cafeteria'] as const,

  // Level 2: Feature groups
  lists: () => [...CAFETERIA_QUERY_KEYS.all, 'list'] as const,
  details: () => [...CAFETERIA_QUERY_KEYS.all, 'detail'] as const,
  reviews: () => [...CAFETERIA_QUERY_KEYS.all, 'reviews'] as const,

  // Level 3: Specific queries
  list: (options?: {
    campus?: string;
    mealType?: 'breakfast' | 'lunch' | 'dinner';
  }) => [...CAFETERIA_QUERY_KEYS.lists(), options] as const,

  detail: (id: string) => [...CAFETERIA_QUERY_KEYS.details(), id] as const,

  reviewList: (cafeteriaId: string) =>
    [...CAFETERIA_QUERY_KEYS.reviews(), cafeteriaId] as const,

  // Additional features
  myFavorites: () => [...CAFETERIA_QUERY_KEYS.all, 'favorites'] as const,
  menuWeek: (date: string) =>
    [...CAFETERIA_QUERY_KEYS.all, 'menu-week', date] as const,
};
```

### Example: User Domain Query Keys

```typescript
// File: domains/user/presentation/shared/constants/query-keys.ts
export const USER_QUERY_KEYS = {
  // Level 1: Domain root
  all: ['user'] as const,

  // Level 2: Feature groups
  profiles: () => [...USER_QUERY_KEYS.all, 'profile'] as const,
  preferences: () => [...USER_QUERY_KEYS.all, 'preferences'] as const,

  // Level 3: Specific queries
  myProfile: () => [...USER_QUERY_KEYS.profiles(), 'me'] as const,
  profile: (userId: string) =>
    [...USER_QUERY_KEYS.profiles(), userId] as const,
  myPreferences: () => [...USER_QUERY_KEYS.preferences(), 'me'] as const,
};
```

### Example: Stamp Domain Query Keys

```typescript
// File: domains/stamp/presentation/shared/constants/query-keys.ts
export const STAMP_QUERY_KEYS = {
  // Level 1: Domain root
  all: ['stamp'] as const,

  // Level 2: Feature groups
  collections: () => [...STAMP_QUERY_KEYS.all, 'collection'] as const,
  details: () => [...STAMP_QUERY_KEYS.all, 'detail'] as const,

  // Level 3: Specific queries
  collection: (options?: { status?: 'used' | 'unused' | 'all' }) =>
    [...STAMP_QUERY_KEYS.collections(), options] as const,

  detail: (stampId: string) =>
    [...STAMP_QUERY_KEYS.details(), stampId] as const,

  // Statistics
  stats: () => [...STAMP_QUERY_KEYS.all, 'stats'] as const,
};
```

## Usage Examples

### In Query Hooks

```typescript
// File: get-benefit-list.query.ts
export function useGetBenefitList(options?: {
  category?: string;
  sortBy?: string;
}) {
  const container = getBenefitClientContainer();
  const getBenefitsUseCase = container.getGetBenefits();

  return useQuery({
    // Query key includes all parameters
    queryKey: BENEFIT_QUERY_KEYS.list(options),
    // Result: ['benefit', 'list', { category: 'lunch', sortBy: 'price' }]
    queryFn: async () => {
      const benefits = await getBenefitsUseCase.execute(options);
      return BenefitAdapter.benefitListToUi(benefits);
    },
  });
}
```

### In Mutation Hooks

```typescript
// File: create-cafeteria-review.mutation.ts
export function useCreateCafeteriaReview() {
  const queryClient = useQueryClient();
  const container = getCafeteriaClientContainer();
  const createReviewUseCase = container.getCreateCafeteriaReview();

  return useMutation({
    mutationFn: async (params: CreateReviewParams) => {
      return await createReviewUseCase.execute(params);
    },
    onSuccess: (_, variables) => {
      // Invalidate all review lists for this cafeteria
      queryClient.invalidateQueries({
        queryKey: CAFETERIA_QUERY_KEYS.reviewList(variables.cafeteriaId),
      });

      // Invalidate cafeteria detail (review count changed)
      queryClient.invalidateQueries({
        queryKey: CAFETERIA_QUERY_KEYS.detail(variables.cafeteriaId),
      });
    },
  });
}
```

### In Components

```typescript
// Component with specific options
const BenefitList = () => {
  const { data, isLoading } = useGetBenefitList({
    category: 'lunch',
    sortBy: 'price',
  });
  // Query Key: ['benefit', 'list', { category: 'lunch', sortBy: 'price' }]

  // Different options = different cache entry
  const { data: dinnerData } = useGetBenefitList({
    category: 'dinner',
  });
  // Query Key: ['benefit', 'list', { category: 'dinner' }]
};
```

## Invalidation Patterns

### Pattern 1: Invalidate All Domain Queries

**Use Case**: Nuclear option - when you're not sure what changed

```typescript
queryClient.invalidateQueries({
  queryKey: BENEFIT_QUERY_KEYS.all,
});
// Invalidates: ALL queries starting with ['benefit', ...]
// Example: ['benefit', 'list', ...], ['benefit', 'detail', ...], etc.
```

### Pattern 2: Invalidate All Lists

**Use Case**: After create/delete operations (new item might appear in any list)

```typescript
queryClient.invalidateQueries({
  queryKey: BENEFIT_QUERY_KEYS.lists(),
});
// Invalidates: ALL list queries regardless of options
// Example: ['benefit', 'list', undefined]
//          ['benefit', 'list', { category: 'lunch' }]
//          ['benefit', 'list', { sortBy: 'price' }]
```

### Pattern 3: Invalidate Specific List

**Use Case**: When you know exact options (e.g., reordering a specific list)

```typescript
queryClient.invalidateQueries({
  queryKey: BENEFIT_QUERY_KEYS.list({ category: 'lunch' }),
});
// Invalidates: ONLY this specific list query
// Example: ['benefit', 'list', { category: 'lunch' }]
```

### Pattern 4: Invalidate Specific Detail

**Use Case**: After update operation on a specific item

```typescript
queryClient.invalidateQueries({
  queryKey: BENEFIT_QUERY_KEYS.detail('123'),
});
// Invalidates: ONLY this specific detail query
// Example: ['benefit', 'detail', '123']
```

### Pattern 5: Invalidate Multiple Related Queries

**Use Case**: Complex mutations affecting multiple query types

```typescript
onSuccess: (data, variables) => {
  // Invalidate all lists (new item might appear)
  queryClient.invalidateQueries({
    queryKey: CAFETERIA_QUERY_KEYS.lists(),
  });

  // Invalidate specific detail (review count changed)
  queryClient.invalidateQueries({
    queryKey: CAFETERIA_QUERY_KEYS.detail(variables.cafeteriaId),
  });

  // Invalidate reviews (new review added)
  queryClient.invalidateQueries({
    queryKey: CAFETERIA_QUERY_KEYS.reviewList(variables.cafeteriaId),
  });
};
```

### Pattern 6: Partial Match Invalidation

**How TanStack Query matches keys:**

```typescript
// These query keys exist in cache:
['benefit', 'list', { category: 'lunch' }]
['benefit', 'list', { category: 'dinner' }]
['benefit', 'detail', '123']

// Invalidation with BENEFIT_QUERY_KEYS.lists()
queryClient.invalidateQueries({
  queryKey: ['benefit', 'list'], // Partial match!
});
// Invalidates: BOTH list queries (lunch and dinner)
// Does NOT invalidate: detail queries
```

### Invalidation Decision Tree

```
Did data change?
│
├─ New item created
│  └─ Invalidate: lists() + categories()
│
├─ Item updated
│  ├─ List display data changed? → Invalidate: lists()
│  └─ Only detail changed? → Invalidate: detail(id)
│
├─ Item deleted
│  └─ Invalidate: lists() + detail(id) + categories()
│
├─ Relationship changed (e.g., new review added)
│  └─ Invalidate: parent detail() + related list()
│
└─ Not sure what changed
   └─ Invalidate: all (nuclear option)
```

## Best Practices

### ✅ DO

1. **DO** use hierarchical structure

   ```typescript
   export const BENEFIT_QUERY_KEYS = {
     all: ['benefit'] as const,
     lists: () => [...BENEFIT_QUERY_KEYS.all, 'list'] as const,
     list: (options) => [...BENEFIT_QUERY_KEYS.lists(), options] as const,
   };
   ```

2. **DO** use `as const` for type safety

   ```typescript
   all: ['benefit'] as const, // ✅ Type-safe
   ```

3. **DO** include ALL parameters in query key

   ```typescript
   queryKey: BENEFIT_QUERY_KEYS.list({ category, sortBy, page }), // ✅
   ```

4. **DO** use functions for dynamic keys

   ```typescript
   detail: (id: string) => [...BENEFIT_QUERY_KEYS.details(), id] as const,
   ```

5. **DO** group related queries

   ```typescript
   lists: () => [...BENEFIT_QUERY_KEYS.all, 'list'] as const,
   details: () => [...BENEFIT_QUERY_KEYS.all, 'detail'] as const,
   ```

6. **DO** use consistent naming (singular domain)

   ```typescript
   all: ['benefit'] as const, // ✅ CORRECT: singular
   // Not 'benefits'
   ```

7. **DO** invalidate at appropriate levels
   ```typescript
   // Create → Invalidate lists (new item might appear anywhere)
   queryClient.invalidateQueries({ queryKey: BENEFIT_QUERY_KEYS.lists() });
   // Update → Invalidate specific detail
   queryClient.invalidateQueries({ queryKey: BENEFIT_QUERY_KEYS.detail(id) });
   ```

### ❌ DON'T

1. **DON'T** hardcode query keys

   ```typescript
   ❌ queryKey: ['benefit', 'list']
   ✅ queryKey: BENEFIT_QUERY_KEYS.list()
   ```

2. **DON'T** forget `as const`

   ```typescript
   ❌ all: ['benefit']              // Type: string[]
   ✅ all: ['benefit'] as const     // Type: readonly ["benefit"]
   ```

3. **DON'T** omit parameters from query key

   ```typescript
   ❌ queryKey: BENEFIT_QUERY_KEYS.list() // Missing category!
      queryFn: () => fetchBenefits({ category: 'lunch' })

   ✅ queryKey: BENEFIT_QUERY_KEYS.list({ category: 'lunch' })
      queryFn: () => fetchBenefits({ category: 'lunch' })
   ```

4. **DON'T** use different query keys for same data

   ```typescript
   ❌ // Component A
      queryKey: ['benefit', 'list']
      // Component B
      queryKey: ['benefits', 'list'] // Typo! Different cache!

   ✅ // Both components
      queryKey: BENEFIT_QUERY_KEYS.list()
   ```

5. **DON'T** create flat structures (no hierarchy)

   ```typescript
   ❌ export const BENEFIT_QUERY_KEYS = {
        benefitList: ['benefit', 'list'] as const,
        benefitDetail: ['benefit', 'detail'] as const,
      };

   ✅ export const BENEFIT_QUERY_KEYS = {
        all: ['benefit'] as const,
        lists: () => [...BENEFIT_QUERY_KEYS.all, 'list'] as const,
        details: () => [...BENEFIT_QUERY_KEYS.all, 'detail'] as const,
      };
   ```

6. **DON'T** over-invalidate

   ```typescript
   ❌ queryClient.invalidateQueries() // Invalidates EVERYTHING!

   ✅ queryClient.invalidateQueries({
        queryKey: BENEFIT_QUERY_KEYS.lists(), // Only relevant queries
      });
   ```

7. **DON'T** use inconsistent naming
   ```typescript
   ❌ all: ['benefits'] as const,     // Plural
      lists: () => ['benefit', ...],  // Singular
   ✅ all: ['benefit'] as const,      // Consistent singular
      lists: () => [...BENEFIT_QUERY_KEYS.all, ...],
   ```

## Quick Reference

### Common Query Key Patterns

| Pattern           | Query Key Structure                   | When to Use                 |
| ----------------- | ------------------------------------- | --------------------------- |
| **Domain Root**   | `['benefit']`                         | Invalidate ALL domain data  |
| **Feature Group** | `['benefit', 'list']`                 | Invalidate ALL lists        |
| **Specific List** | `['benefit', 'list', { category }]`   | Specific filtered list      |
| **Detail Group**  | `['benefit', 'detail']`               | Invalidate ALL details      |
| **Specific Item** | `['benefit', 'detail', '123']`        | Single item detail          |
| **User-Specific** | `['benefit', 'my-benefits']`          | User-scoped data            |
| **Time-Based**    | `['cafeteria', 'menu-week', '2024']`  | Time-scoped data            |
| **Nested Data**   | `['cafeteria', 'reviews', '123']`     | Child resources             |

### Invalidation Cheat Sheet

| Mutation Type | Recommended Invalidation                                         | Example                                       |
| ------------- | ---------------------------------------------------------------- | --------------------------------------------- |
| **Create**    | `lists()` + `categories()` (if exists)                           | New benefit → invalidate all lists            |
| **Update**    | `detail(id)` + `lists()` (if list display changed)               | Update benefit → detail + lists               |
| **Delete**    | `lists()` + `detail(id)` + `categories()`                        | Delete benefit → all related queries          |
| **Toggle**    | `detail(id)` OR optimistic update                                | Toggle stamp → specific detail                |
| **Reorder**   | `list(exactOptions)`                                             | Reorder items → specific list                 |
| **Nested Create** | parent `detail(id)` + child `list(parentId)`                 | New review → cafeteria detail + reviews       |
| **Batch**     | `all` (nuclear option)                                           | Multiple changes → invalidate all             |

### Template for New Domain

```typescript
// File: domains/[DOMAIN]/presentation/shared/constants/query-keys.ts
export const [DOMAIN]_QUERY_KEYS = {
  // Level 1: Domain root
  all: ['[domain]'] as const,

  // Level 2: Feature groups
  lists: () => [...[DOMAIN]_QUERY_KEYS.all, 'list'] as const,
  details: () => [...[DOMAIN]_QUERY_KEYS.all, 'detail'] as const,

  // Level 3: Specific queries
  list: (options?: { /* filter options */ }) =>
    [...[DOMAIN]_QUERY_KEYS.lists(), options] as const,
  detail: (id: string) =>
    [...[DOMAIN]_QUERY_KEYS.details(), id] as const,

  // Additional features as needed
  // categories: () => [...[DOMAIN]_QUERY_KEYS.all, 'categories'] as const,
  // myItems: () => [...[DOMAIN]_QUERY_KEYS.all, 'my-items'] as const,
};
```

## Summary

Query Keys are **the foundation of TanStack Query caching and invalidation**:

1. **Centralized**: All query keys in `presentation/shared/constants/query-keys.ts`
2. **Hierarchical**: Domain → Feature Group → Specific Query
3. **Type-Safe**: Always use `as const` for exact types
4. **Consistent**: Same structure across all domains
5. **Invalidation**: Use hierarchy to target exact scope
6. **Parameters**: Always include ALL parameters in query key

**Remember**: Query keys determine cache identity. Same key = same cache. Different key = different cache.

---

**Related Documentation**:

- [query-hooks.md](./query-hooks.md) - Using query keys in query hooks
- [mutation-hooks.md](./mutation-hooks.md) - Using query keys for invalidation
- [frontend.md](../frontend.md) - Component integration patterns
