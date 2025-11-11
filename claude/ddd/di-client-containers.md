---
description: "Client DI Containers, lazy singleton, browser-side patterns"
globs:
  - "src/domains/**/di/*-client-container.ts"
alwaysApply: true
---

# Client DI Containers

> **Related Documents**: [di-server-containers.md](./di-server-containers.md), [infrastructure-layer.md](./infrastructure-layer.md), [usecase-patterns.md](./usecase-patterns.md)

## Overview

Client Containers are used in Client Components and hooks. They follow a **lazy singleton** pattern where one instance is shared across the entire client-side application lifetime.

## Core Principles

### 1. Lazy Singleton

Client Containers are initialized ONCE and reused throughout the app lifetime.

```typescript
// ✅ CORRECT: Lazy singleton pattern
let clientContainerInstance: UserClientContainer | null = null;

export function getUserClientContainer(): UserClientContainer {
  if (!clientContainerInstance) {
    clientContainerInstance = new UserClientContainerImpl();
  }
  return clientContainerInstance; // Singleton
}

// ❌ WRONG: Factory function (DON'T USE on client)
export function createUserClientContainer(): UserClientContainer {
  return new UserClientContainerImpl(); // Creates new instance every time
}
```

### 2. Lazy Initialization

Client Containers initialize dependencies ONLY when first accessed (lazy, not eager).

```typescript
// ✅ CORRECT: Lazy initialization
class UserClientContainerImpl implements UserClientContainer {
  // Infrastructure Layer (Lazy)
  private _sessionManager?: ClientSessionManager;
  private _httpClient?: AuthenticatedHttpClient;

  // Data Layer (Lazy)
  private _repository?: UserRepository;

  // Domain Layer (Lazy)
  private _getUserProfileUseCase?: GetUserProfileUseCase;

  // Lazy getter
  private getSessionManager(): ClientSessionManager {
    if (!this._sessionManager) {
      this._sessionManager = new ClientSessionManager();
    }
    return this._sessionManager;
  }

  // Lazy getter
  private getHttpClient(): AuthenticatedHttpClient {
    if (!this._httpClient) {
      const baseClient = new FetchHttpClient({
        baseUrl: process.env.NEXT_PUBLIC_API_URL || '',
      });
      const tokenProvider = new ClientTokenProvider(this.getSessionManager());

      this._httpClient = new AuthenticatedHttpClient(
        baseClient,
        tokenProvider,
        this.getSessionManager(), // Client-side: provide session manager
        undefined // Client-side: BFF handles refresh (no RefreshTokenService)
      );
    }
    return this._httpClient;
  }

  // Public getter (returns cached or creates)
  getGetUserProfile(): GetUserProfileUseCase {
    if (!this._getUserProfileUseCase) {
      this._getUserProfileUseCase = new GetUserProfileUseCaseImpl(
        this.getRepository()
      );
    }
    return this._getUserProfileUseCase;
  }
}
```

## Client Container Pattern

### Interface

```typescript
// ✅ CORRECT: Container interface
export interface UserClientContainer {
  getGetUserProfile(): GetUserProfileUseCase;
  getUpdateUserProfile(): UpdateUserProfileUseCase;
  getDeleteUserAccount(): DeleteUserAccountUseCase;
}
```

### Implementation

```typescript
// ✅ CORRECT: Client Container implementation
class UserClientContainerImpl implements UserClientContainer {
  // Infrastructure Layer (Lazy)
  private _sessionManager?: ClientSessionManager;
  private _tokenProvider?: ClientTokenProvider;
  private _baseClient?: FetchHttpClient;
  private _httpClient?: AuthenticatedHttpClient;

  // Data Layer (Lazy)
  private _dataSource?: UserRemoteDataSource;
  private _repository?: UserRepository;

  // Domain Layer (Lazy)
  private _getUserProfileUseCase?: GetUserProfileUseCase;
  private _updateUserProfileUseCase?: UpdateUserProfileUseCase;
  private _deleteUserAccountUseCase?: DeleteUserAccountUseCase;

  private getSessionManager(): ClientSessionManager {
    if (!this._sessionManager) {
      this._sessionManager = new ClientSessionManager();
    }
    return this._sessionManager;
  }

  private getTokenProvider(): ClientTokenProvider {
    if (!this._tokenProvider) {
      this._tokenProvider = new ClientTokenProvider(this.getSessionManager());
    }
    return this._tokenProvider;
  }

  private getBaseClient(): FetchHttpClient {
    if (!this._baseClient) {
      this._baseClient = new FetchHttpClient({
        baseUrl: process.env.NEXT_PUBLIC_API_URL || '',
        timeout: 30000,
      });
    }
    return this._baseClient;
  }

  private getHttpClient(): AuthenticatedHttpClient {
    if (!this._httpClient) {
      this._httpClient = new AuthenticatedHttpClient(
        this.getBaseClient(),
        this.getTokenProvider(),
        this.getSessionManager(), // Client-side: provide session manager
        undefined // Client-side: BFF handles refresh (no RefreshTokenService)
      );
    }
    return this._httpClient;
  }

  private getDataSource(): UserRemoteDataSource {
    if (!this._dataSource) {
      this._dataSource = new UserRemoteDataSource(this.getHttpClient());
    }
    return this._dataSource;
  }

  private getRepository(): UserRepository {
    if (!this._repository) {
      this._repository = new UserRepositoryImpl(this.getDataSource());
    }
    return this._repository;
  }

  getGetUserProfile(): GetUserProfileUseCase {
    if (!this._getUserProfileUseCase) {
      this._getUserProfileUseCase = new GetUserProfileUseCaseImpl(
        this.getRepository()
      );
    }
    return this._getUserProfileUseCase;
  }

  getUpdateUserProfile(): UpdateUserProfileUseCase {
    if (!this._updateUserProfileUseCase) {
      this._updateUserProfileUseCase = new UpdateUserProfileUseCaseImpl(
        this.getRepository()
      );
    }
    return this._updateUserProfileUseCase;
  }

  getDeleteUserAccount(): DeleteUserAccountUseCase {
    if (!this._deleteUserAccountUseCase) {
      this._deleteUserAccountUseCase = new DeleteUserAccountUseCaseImpl(
        this.getRepository()
      );
    }
    return this._deleteUserAccountUseCase;
  }
}

// Singleton instance at module level
let clientContainerInstance: UserClientContainer | null = null;

export function getUserClientContainer(): UserClientContainer {
  if (!clientContainerInstance) {
    clientContainerInstance = new UserClientContainerImpl();
  }
  return clientContainerInstance;
}
```

## Multi-Repository Container

```typescript
// ✅ CORRECT: Container with multiple repositories
class DashboardClientContainerImpl implements DashboardClientContainer {
  private _sessionManager?: ClientSessionManager;
  private _httpClient?: AuthenticatedHttpClient;

  private _userRepository?: UserRepository;
  private _stampRepository?: StampRepository;
  private _benefitRepository?: BenefitRepository;

  private _getUserDashboardUseCase?: GetUserDashboardUseCase;

  private getHttpClient(): AuthenticatedHttpClient {
    if (!this._httpClient) {
      const baseClient = new FetchHttpClient({
        baseUrl: process.env.NEXT_PUBLIC_API_URL || '',
      });
      const sessionManager = this.getSessionManager();
      const tokenProvider = new ClientTokenProvider(sessionManager);

      this._httpClient = new AuthenticatedHttpClient(
        baseClient,
        tokenProvider,
        sessionManager,
        undefined
      );
    }
    return this._httpClient;
  }

  private getUserRepository(): UserRepository {
    if (!this._userRepository) {
      const dataSource = new UserRemoteDataSource(this.getHttpClient());
      this._userRepository = new UserRepositoryImpl(dataSource);
    }
    return this._userRepository;
  }

  private getStampRepository(): StampRepository {
    if (!this._stampRepository) {
      const dataSource = new StampRemoteDataSource(this.getHttpClient());
      this._stampRepository = new StampRepositoryImpl(dataSource);
    }
    return this._stampRepository;
  }

  private getBenefitRepository(): BenefitRepository {
    if (!this._benefitRepository) {
      const dataSource = new BenefitRemoteDataSource(this.getHttpClient());
      this._benefitRepository = new BenefitRepositoryImpl(dataSource);
    }
    return this._benefitRepository;
  }

  getGetUserDashboard(): GetUserDashboardUseCase {
    if (!this._getUserDashboardUseCase) {
      this._getUserDashboardUseCase = new GetUserDashboardUseCaseImpl(
        this.getUserRepository(),
        this.getStampRepository(),
        this.getBenefitRepository()
      );
    }
    return this._getUserDashboardUseCase;
  }

  private getSessionManager(): ClientSessionManager {
    if (!this._sessionManager) {
      this._sessionManager = new ClientSessionManager();
    }
    return this._sessionManager;
  }
}

let dashboardClientContainerInstance: DashboardClientContainer | null = null;

export function getDashboardClientContainer(): DashboardClientContainer {
  if (!dashboardClientContainerInstance) {
    dashboardClientContainerInstance = new DashboardClientContainerImpl();
  }
  return dashboardClientContainerInstance;
}
```

## Usage in Client Components

### Section Component

```typescript
// ✅ CORRECT: Use Client Container in Client Component
'use client';

import { getUserClientContainer } from '@user/di';

export function ProfileSection() {
  const container = getUserClientContainer(); // Singleton

  const { data, isLoading, error } = useQuery({
    queryKey: ['user', 'profile'],
    queryFn: async () => {
      const getUserProfile = container.getGetUserProfile();
      return getUserProfile.execute();
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <ProfileView user={data} />;
}
```

### Component with Mutation

```typescript
// ✅ CORRECT: Use Container for mutations
'use client';

import { getUserClientContainer } from '@user/di';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function ProfileEditSection() {
  const container = getUserClientContainer();
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: async (updates: UserProfileUpdates) => {
      const updateUserProfile = container.getUpdateUserProfile();
      return updateUserProfile.execute('user-id', updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
    },
  });

  const handleSubmit = (updates: UserProfileUpdates) => {
    updateMutation.mutate(updates);
  };

  return <EditForm onSubmit={handleSubmit} />;
}
```

## Usage in Custom Hooks

### Query Hook

```typescript
// ✅ CORRECT: Query hook using container
// domains/user/presentation/hooks/queries/get-user-profile.query.ts
'use client';

import { useQuery } from '@tanstack/react-query';
import { getUserClientContainer } from '@user/di';

export function useGetUserProfile() {
  const container = getUserClientContainer();

  return useQuery({
    queryKey: ['user', 'profile'],
    queryFn: async () => {
      const getUserProfile = container.getGetUserProfile();
      return getUserProfile.execute();
    },
  });
}
```

### Mutation Hook

```typescript
// ✅ CORRECT: Mutation hook using container
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserClientContainer } from '@user/di';

export function useUpdateUserProfile() {
  const container = getUserClientContainer();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: UserProfileUpdates) => {
      const updateUserProfile = container.getUpdateUserProfile();
      const userId = await getUserId(); // Get from session
      return updateUserProfile.execute(userId, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
    },
  });
}

async function getUserId(): Promise<string> {
  const container = getUserClientContainer();
  // Access session manager through container if needed
  // Or get from another source
  return 'user-id';
}
```

## Token Refresh Handling

Client containers do NOT handle token refresh (BFF handles it):

```typescript
// ✅ CORRECT: No RefreshTokenService on client
private getHttpClient(): AuthenticatedHttpClient {
  if (!this._httpClient) {
    this._httpClient = new AuthenticatedHttpClient(
      this.getBaseClient(),
      this.getTokenProvider(),
      this.getSessionManager(), // Client-side: provide session manager
      undefined // Client-side: BFF handles refresh (no RefreshTokenService)
    );
  }
  return this._httpClient;
}
```

## Environment Detection

Ensure client code only runs in browser:

```typescript
// ✅ CORRECT: Check environment
export function getUserClientContainer(): UserClientContainer {
  if (typeof window === 'undefined') {
    throw new Error('UserClientContainer can only be used in browser');
  }

  if (!clientContainerInstance) {
    clientContainerInstance = new UserClientContainerImpl();
  }
  return clientContainerInstance;
}
```

## Testing Client Containers

```typescript
describe('UserClientContainer', () => {
  beforeEach(() => {
    // Reset singleton between tests
    jest.resetModules();
  });

  it('should return singleton instance', () => {
    const container1 = getUserClientContainer();
    const container2 = getUserClientContainer();

    // Same instance
    expect(container1).toBe(container2);
  });

  it('should lazily initialize UseCases', () => {
    const container = getUserClientContainer();

    // First call creates instance
    const useCase1 = container.getGetUserProfile();
    expect(useCase1).toBeDefined();

    // Second call returns same instance
    const useCase2 = container.getGetUserProfile();
    expect(useCase1).toBe(useCase2);
  });

  it('should provide all UseCases', () => {
    const container = getUserClientContainer();

    expect(container.getGetUserProfile).toBeDefined();
    expect(container.getUpdateUserProfile).toBeDefined();
    expect(container.getDeleteUserAccount).toBeDefined();
  });
});
```

## Best Practices

1. **Singleton Pattern**: Always use singleton, never factory function
2. **Lazy Initialization**: Initialize dependencies only when needed
3. **Reuse Instances**: Cache all instances (HttpClient, Repository, UseCase)
4. **NO Parameters**: Client container getter takes NO parameters
5. **Browser Only**: Throw error if used on server
6. **NO Token Refresh**: BFF handles token refresh on client
7. **SessionManager Internal**: Create SessionManager internally

## Common Pitfalls

### ❌ WRONG: Factory Function on Client

```typescript
// DON'T DO THIS
export function createUserClientContainer(): UserClientContainer {
  return new UserClientContainerImpl(); // Creates new instance every time!
}
```

### ✅ CORRECT: Singleton Pattern

```typescript
let clientContainerInstance: UserClientContainer | null = null;

export function getUserClientContainer(): UserClientContainer {
  if (!clientContainerInstance) {
    clientContainerInstance = new UserClientContainerImpl();
  }
  return clientContainerInstance;
}
```

### ❌ WRONG: Using Server Container on Client

```typescript
'use client';

import { createUserServerContainer } from '@user/di'; // WRONG!
import { ServerSessionManager } from '@core/infrastructure/storage/server-session-manager';

export function ProfileSection() {
  const sessionManager = new ServerSessionManager(); // WRONG! Can't use server APIs
  const container = createUserServerContainer(sessionManager); // WRONG!
  // ...
}
```

### ✅ CORRECT: Using Client Container

```typescript
'use client';

import { getUserClientContainer } from '@user/di'; // CORRECT!

export function ProfileSection() {
  const container = getUserClientContainer(); // CORRECT
  // ...
}
```

### ❌ WRONG: Eager Initialization

```typescript
// DON'T DO THIS
class UserClientContainerImpl {
  private readonly httpClient: AuthenticatedHttpClient;
  private readonly repository: UserRepository;

  constructor() {
    // WRONG: Eager initialization in constructor
    this.httpClient = new AuthenticatedHttpClient(/* ... */);
    this.repository = new UserRepositoryImpl(/* ... */);
  }
}
```

### ✅ CORRECT: Lazy Initialization

```typescript
class UserClientContainerImpl {
  private _httpClient?: AuthenticatedHttpClient;
  private _repository?: UserRepository;

  private getHttpClient(): AuthenticatedHttpClient {
    if (!this._httpClient) {
      this._httpClient = new AuthenticatedHttpClient(/* ... */);
    }
    return this._httpClient;
  }

  private getRepository(): UserRepository {
    if (!this._repository) {
      this._repository = new UserRepositoryImpl(this.getDataSource());
    }
    return this._repository;
  }
}
```

## Server vs Client Containers

| Aspect | Server Container | Client Container |
|--------|------------------|------------------|
| Pattern | Factory function | Lazy singleton |
| Initialization | Eager (constructor) | Lazy (getters) |
| Lifetime | Per-request | App lifetime |
| SessionManager | Parameter | Internal instance |
| Token Refresh | RefreshTokenService | No refresh (BFF handles) |
| Usage | Server Components, Actions, API Routes | Client Components, Hooks |
| Parameters | Accepts SessionManager | No parameters |
| Instance Creation | New per call | Cached singleton |

## Summary

Client Containers provide:
- **Singleton Pattern**: One instance for entire app
- **Lazy Initialization**: Create dependencies only when needed
- **Memory Efficiency**: Reuse instances across components
- **Type Safety**: Compile-time validation of dependencies
- **Testability**: Easy to reset for testing

Use Client Containers in all client-side code (Client Components, hooks). For server-side code, see [di-server-containers.md](./di-server-containers.md).

**Critical Rule**: NEVER use Client Container (`getUserClientContainer()`) in Server Components or Server Actions. Always use Server Container (`createUserServerContainer()`) instead.
