---
description: "Dependency Injection Containers overview, Server vs Client containers, factory vs singleton patterns, UseCase instantiation"
globs:
  - "src/domains/*/di/**/*"
  - "src/core/infrastructure/**/*"
alwaysApply: true
---

# Dependency Injection Containers Guide

> **Document Type**: DI Container Index & Navigation
> **Target Audience**: All developers and AI agents
> **Purpose**: Central entry point for understanding DI Container patterns
> **Last Updated**: 2025-01-12

## 📖 What This Document Covers

This is the **central index** for understanding Dependency Injection (DI) Containers in Nugudi. Read this first to understand:

- 🏭 **DI Container Types**: Server DI vs Client DI containers
- 🎯 **Usage Patterns**: When to use each container type
- 🔧 **DI Container Methods**: Factory pattern for UseCases
- 🚫 **Critical Rules**: Never instantiate directly, always use DI containers

---

## 🚀 Quick Start (Read These in Order)

### 1. Server-Side DI Containers (SSR & Server Components) 🖥️

**📄 [ddd/di-server-containers.md](./ddd/di-server-containers.md)**

**Server DI containers** for stateless, per-request dependency injection (Server Components, API routes).

**What You'll Learn**:
- Factory pattern: `createXXXServerContainer()` creates NEW instance per request
- Server-side infrastructure: `ServerSessionManager`, `AuthenticatedHttpClient`
- When to use Server DI Containers (Pages, API routes, Server Actions)
- Per-request isolation for SSR safety
- UseCase instantiation in server context

**When to Read**:
- ✅ Working on Next.js Pages (Server Components)
- ✅ Creating API routes
- ✅ Implementing Server Actions
- ✅ SSR data prefetching

**Key Pattern**:
```typescript
// Page.tsx (Server Component)
import { createUserServerContainer } from '@user/di/user-server-container';
import { ServerSessionManager } from '@core/infrastructure/storage/server-session-manager';

const MyPage = async () => {
  // ✅ CORRECT - Create NEW DI container instance per request
  const sessionManager = new ServerSessionManager();
  const container = createUserServerContainer(sessionManager);

  // Get UseCase from container
  const useCase = container.getGetUser();
  const user = await useCase.execute(userId);

  return <div>{user.getName()}</div>;
};
```

**Critical Rules**:
- ✅ **ALWAYS** use `createXXXServerContainer()` (factory function)
- ✅ **ALWAYS** pass `ServerSessionManager` instance
- ❌ **NEVER** use Client DI Container in Server Components (singleton breaks SSR)
- ❌ **NEVER** reuse Server DI Container across requests (must be per-request)

---

### 2. Client-Side DI Containers (Client Components) 🌐

**📄 [ddd/di-client-containers.md](./ddd/di-client-containers.md)**

**Client DI containers** for lazy singleton pattern (Client Components, browser environment).

**What You'll Learn**:
- Singleton pattern: `getXXXClientContainer()` returns same instance
- Lazy initialization: DI Container created only when first accessed
- Client-side infrastructure: `ClientSessionManager`, `FetchHttpClient`
- When to use Client DI Containers (Sections, Client Components)
- Browser-safe singleton usage

**When to Read**:
- ✅ Working on Sections (Client Components with data fetching)
- ✅ Creating TanStack Query hooks
- ✅ Implementing client-side features
- ✅ Building interactive UI components

**Key Pattern**:
```typescript
// ProfileSection.tsx (Client Component)
'use client';

import { getUserClientContainer } from '@user/di/user-client-container';

export const ProfileSection = ({ userId }: { userId: string }) => {
  // ✅ CORRECT - Get lazy singleton DI container
  const container = getUserClientContainer();

  // Use in TanStack Query hook
  const { data } = useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      const useCase = container.getGetUser();
      return await useCase.execute(userId);
    },
  });

  return <div>{data?.getName()}</div>;
};
```

**Critical Rules**:
- ✅ **ALWAYS** use `getXXXClientContainer()` (singleton getter)
- ✅ **ALWAYS** use in Client Components (`'use client'`)
- ❌ **NEVER** use in Server Components (singleton breaks per-request isolation)
- ❌ **NEVER** create multiple instances manually

---

## 🎯 Common Workflows

### "I'm creating a Page (Server Component)"

**Step 1**: Use Server DI Container
```typescript
import { createUserServerContainer } from '@user/di/user-server-container';
import { ServerSessionManager } from '@core/infrastructure/storage/server-session-manager';

const MyPage = async () => {
  const sessionManager = new ServerSessionManager();
  const container = createUserServerContainer(sessionManager);
  // ...
};
```

**Step 2**: Get UseCase from container
```typescript
const useCase = container.getGetUser();
const user = await useCase.execute(userId);
```

**Step 3**: Prefetch data for client
```typescript
await queryClient.prefetchQuery({
  queryKey: getUserQueryKey(userId),
  queryFn: async () => {
    const useCase = container.getGetUser();
    return await useCase.execute(userId);
  },
});
```

**Read More**: [ddd/di-server-containers.md](./ddd/di-server-containers.md)

---

### "I'm creating a Section (Client Component)"

**Step 1**: Use Client DI Container
```typescript
'use client';

import { getUserClientContainer } from '@user/di/user-client-container';

export const ProfileSection = ({ userId }: { userId: string }) => {
  const container = getUserClientContainer();
  // ...
};
```

**Step 2**: Use in TanStack Query Hook
```typescript
const { data, isLoading } = useQuery({
  queryKey: ['user', userId],
  queryFn: async () => {
    const useCase = container.getGetUser();
    return await useCase.execute(userId);
  },
});
```

**Read More**: [ddd/di-client-containers.md](./ddd/di-client-containers.md)

---

### "I need to test UseCase with DI Container"

**Unit Test Pattern** (Mock dependencies):

```typescript
// Mock Repository and SessionManager
const mockRepository = {
  getById: vi.fn(),
};

const mockSessionManager = {
  getAccessToken: vi.fn(),
};

// Directly instantiate UseCase for testing (exception to "never instantiate" rule)
const useCase = new GetUserUseCase(mockRepository, mockSessionManager);

it('should return user', async () => {
  mockRepository.getById.mockResolvedValue(userEntity);

  const result = await useCase.execute('1');
  expect(result.getId()).toBe('1');
});
```

**Integration Test Pattern** (Use real container):

```typescript
// Use real container for integration tests
const sessionManager = new ClientSessionManager();
const container = getUserClientContainer();

it('should fetch user through container', async () => {
  const useCase = container.getGetUser();
  const result = await useCase.execute('1');
  expect(result).toBeDefined();
});
```

**Read More**: [../testing/unit-testing.md](./testing/unit-testing.md#usecase-testing)

---

## 📋 DI Container Comparison

| Aspect | Server DI Container | Client DI Container |
|--------|-----------------|------------------|
| **Pattern** | Factory (`createXXX()`) | Lazy Singleton (`getXXX()`) |
| **Instance** | NEW per request | SAME instance (singleton) |
| **Context** | Server Components, API routes | Client Components, browser |
| **SessionManager** | `ServerSessionManager` | `ClientSessionManager` |
| **HttpClient** | `AuthenticatedHttpClient` | `FetchHttpClient` |
| **Usage** | Pages, Server Actions | Sections, TanStack Query |
| **Import** | Function call with param | Function call no param |
| **Example** | `createUserServerContainer(sessionManager)` | `getUserClientContainer()` |

---

## 🚨 Critical Rules (MUST READ)

### Server vs Client DI Container Usage

```typescript
// ✅ CORRECT - Server DI Container in Page (Server Component)
const MyPage = async () => {
  const sessionManager = new ServerSessionManager();
  const container = createUserServerContainer(sessionManager); // Factory
  // ...
};

// ✅ CORRECT - Client DI Container in Section (Client Component)
const MySection = () => {
  const container = getUserClientContainer(); // Singleton
  // ...
};

// ❌ WRONG - Client DI Container in Server Component
const MyPage = async () => {
  const container = getUserClientContainer(); // NO! Singleton breaks SSR
};

// ❌ WRONG - Server DI Container in Client Component
const MySection = () => {
  const sessionManager = new ServerSessionManager(); // NO! Wrong context
  const container = createUserServerContainer(sessionManager);
};
```

### Never Instantiate Directly

```typescript
// ❌ WRONG - Direct instantiation bypasses DI
const repository = new UserRepository(httpClient);
const useCase = new GetUserUseCase(repository);

// ✅ CORRECT - Use DI Container
const container = getUserClientContainer();
const useCase = container.getGetUser(); // Container handles dependencies
```

### DI Container Method Naming

```typescript
// ✅ CORRECT - DI Container method naming pattern
container.getGetUser();       // Returns GetUserUseCase instance
container.getUpdateUser();    // Returns UpdateUserUseCase instance
container.getUserRepository(); // Returns UserRepository instance

// Pattern: container.get[UseCaseName]() or container.get[DependencyName]()
```

---

## 🏗️ DI Container Structure

Each domain has TWO DI container files in `src/domains/{domain}/di/`:

### Server DI Container (`{domain}-server-container.ts`)
```typescript
// Factory function - creates NEW instance per call
export const createAuthServerContainer = (
  sessionManager: ServerSessionManager
): AuthServerContainer => {
  // Infrastructure
  const httpClient = new AuthenticatedHttpClient(sessionManager);
  const tokenProvider = new ServerTokenProvider(sessionManager);

  // Data Layer
  const userRepository = new UserRepository(httpClient);

  // Domain Layer
  const getUserUseCase = new GetUserUseCase(userRepository, sessionManager);

  // Return DI container with getter methods
  return {
    getGetUser: () => getUserUseCase,
    getUserRepository: () => userRepository,
  };
};
```

### Client DI Container (`{domain}-client-container.ts`)
```typescript
// Lazy singleton - same instance across all calls
let container: AuthClientContainer | null = null;

export const getAuthClientContainer = (): AuthClientContainer => {
  if (!container) {
    // Lazy initialization
    const sessionManager = new ClientSessionManager();
    const httpClient = new FetchHttpClient();

    // Data Layer
    const userRepository = new UserRepository(httpClient);

    // Domain Layer
    const getUserUseCase = new GetUserUseCase(userRepository, sessionManager);

    container = {
      getGetUser: () => getUserUseCase,
      getUserRepository: () => userRepository,
    };
  }

  return container;
};
```

---

## 🔗 Related Documentation

### DDD Architecture
- [../ddd/entity-patterns.md](./ddd/entity-patterns.md) — Entity design patterns
- [../ddd/usecase-patterns.md](./ddd/usecase-patterns.md) — UseCase implementation
- [../ddd/repository-patterns.md](./ddd/repository-patterns.md) — Repository patterns

### Frontend Architecture
- [../frontend/page-patterns.md](./frontend/page-patterns.md) — Server DI Container usage in Pages
- [../frontend/section-patterns.md](./frontend/section-patterns.md) — Client DI Container usage in Sections

### Infrastructure
- [../core/architecture.md](./core/architecture.md) — Infrastructure layer overview

### Testing
- [../testing/unit-testing.md](./testing/unit-testing.md) — Testing with DI Containers

---

## 🎓 Learning Path

For new developers or AI agents:

1. **Start** (Required): Read [ddd/di-server-containers.md](./ddd/di-server-containers.md) (15 min)
2. **Next**: Read [ddd/di-client-containers.md](./ddd/di-client-containers.md) (15 min)
3. **Context**: Read [../frontend/page-patterns.md](./frontend/page-patterns.md) (15 min)
4. **Context**: Read [../frontend/section-patterns.md](./frontend/section-patterns.md) (20 min)

**Total Time**: ~65 minutes to master DI Container patterns.

**Next Steps**:
- Read [../ddd/usecase-patterns.md](./ddd/usecase-patterns.md) for UseCase design
- Read [../ddd/repository-patterns.md](./ddd/repository-patterns.md) for Repository patterns
- Read [../testing/unit-testing.md](./testing/unit-testing.md) for testing with containers

---

## 📞 Need Help?

- **Working on Server Component?** → Read [ddd/di-server-containers.md](./ddd/di-server-containers.md)
- **Working on Client Component?** → Read [ddd/di-client-containers.md](./ddd/di-client-containers.md)
- **Creating a Page?** → Read [../frontend/page-patterns.md](./frontend/page-patterns.md)
- **Creating a Section?** → Read [../frontend/section-patterns.md](./frontend/section-patterns.md)
- **Testing with containers?** → Read [../testing/unit-testing.md](./testing/unit-testing.md)

---

**Remember**: This is an **index document**. For detailed container implementation patterns, follow the links to specific documents listed above.
