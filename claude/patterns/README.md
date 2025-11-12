---
description: "Patterns documentation directory - Query/Mutation hooks, Adapter patterns, Query keys, and Migration guides"
globs:
  - "apps/web/src/domains/**/presentation/adapters/**/*.ts"
  - "apps/web/src/domains/**/hooks/**/*.ts"
  - "apps/web/src/domains/**/constants/**/*-query-keys.ts"
alwaysApply: true
---

# Patterns Documentation

This directory contains focused pattern documentation split from larger guides.

## Query & Mutation Patterns

### 📊 [query-hooks.md](./query-hooks.md)
Query hooks with TanStack Query, useGet patterns, DI Container integration
- **Lines**: ~684
- **Topics**: Query hook patterns, file/hook naming, DI container usage, real-world examples
- **Globs**: `**/hooks/queries/**/*.query.ts`, `**/hooks/queries/**/*.query.tsx`

### 🔄 [mutation-hooks.md](./mutation-hooks.md)
Mutation hooks with TanStack Query, use[Action][Resource] patterns, invalidation strategies
- **Lines**: ~909
- **Topics**: Mutation hook patterns, invalidation strategies, optimistic updates
- **Globs**: `**/hooks/mutations/**/*.mutation.ts`, `**/hooks/mutations/**/*.mutation.tsx`

### 🔑 [query-keys.md](./query-keys.md)
Query key conventions, hierarchical patterns, invalidation strategies
- **Lines**: ~620
- **Topics**: Hierarchical key structure, invalidation patterns, best practices
- **Globs**: `**/constants/query-keys.ts`, `**/constants/**/*-query-keys.ts`

## Adapter Patterns

### 📦 [adapter-basics.md](./adapter-basics.md)
Core adapter concepts, when to use adapters, and basic patterns
- **Lines**: ~279
- **Topics**: Adapter fundamentals, decision criteria, basic examples

### 🛠️ [adapter-implementation.md](./adapter-implementation.md)
Detailed adapter implementation patterns and advanced use cases
- **Lines**: ~816
- **Topics**: Complex transformations, error handling, performance optimization

### 🧪 [adapter-testing.md](./adapter-testing.md)
Comprehensive testing strategies for adapters
- **Lines**: ~920
- **Topics**: Unit testing, edge cases, test patterns

## Reading Order

For new developers:
1. Start with **query-hooks.md** - Understand data fetching patterns
2. Then **query-keys.md** - Learn cache management
3. Then **mutation-hooks.md** - Master data mutations
4. Then **adapter-basics.md** - Understand data transformations
5. Finally **adapter-implementation.md** and **adapter-testing.md** - Deep dive into adapters

## Related Documentation

- [../di-containers.md](../di-containers.md) - Dependency injection patterns
- [../frontend.md](../frontend.md) - Component architecture
- [../packages.md](../packages.md) - Monorepo structure and rules
