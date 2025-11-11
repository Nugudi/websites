---
description: "Server DI Containers, stateless patterns, per-request instantiation"
globs:
  - "src/domains/**/di/*-server-container.ts"
alwaysApply: true
---

# Server DI Containers

> **Related Documents**: [di-client-containers.md](./di-client-containers.md), [infrastructure-layer.md](./infrastructure-layer.md), [usecase-patterns.md](./usecase-patterns.md)

## Overview

Server Containers are used in Server Components, Server Actions, and API Routes. They follow a **stateless, per-request** pattern where each request creates a fresh container instance.

## Core Principles

### 1. Stateless Per-Request

Server Containers are created NEW for each request. They do NOT persist across requests.

```typescript
// ✅ CORRECT: Factory function creates NEW instance
export function createUserServerContainer(
  sessionManager: SessionManager
): UserServerContainer {
  return new UserServerContainerImpl(sessionManager);
}

// ❌ WRONG: Singleton pattern (DON'T USE on server)
let serverContainerInstance: UserServerContainer | null = null;

export function getUserServerContainer(): UserServerContainer {
  if (!serverContainerInstance) {
    serverContainerInstance = new UserServerContainerImpl();
  }
  return serverContainerInstance; // WRONG! Shared across requests
}
```

### 2. Eager Initialization

Server Containers initialize ALL dependencies in the constructor (eager, not lazy).

```typescript
// ✅ CORRECT: Eager initialization
class UserServerContainerImpl implements UserServerContainer {
  private readonly httpClient: AuthenticatedHttpClient;
  private readonly dataSource: UserRemoteDataSource;
  private readonly repository: UserRepository;
  private readonly getUserProfileUseCase: GetUserProfileUseCase;

  constructor(sessionManager: SessionManager) {
    // Initialize everything in constructor (eager)
    const baseClient = new FetchHttpClient({
      baseUrl: process.env.NEXT_PUBLIC_API_URL || '',
    });
    const tokenProvider = new ServerTokenProvider(sessionManager);
    const refreshTokenService = new RefreshTokenService(
      baseClient,
      sessionManager
    );

    this.httpClient = new AuthenticatedHttpClient(
      baseClient,
      tokenProvider,
      undefined, // No session manager for server
      refreshTokenService
    );

    this.dataSource = new UserRemoteDataSource(this.httpClient);
    this.repository = new UserRepositoryImpl(this.dataSource);
    this.getUserProfileUseCase = new GetUserProfileUseCaseImpl(this.repository);
  }

  getGetUserProfile(): GetUserProfileUseCase {
    return this.getUserProfileUseCase; // Return pre-initialized instance
  }
}
```

## Server Container Pattern

### Interface

```typescript
// ✅ CORRECT: Container interface
export interface UserServerContainer {
  getGetUserProfile(): GetUserProfileUseCase;
  getUpdateUserProfile(): UpdateUserProfileUseCase;
  getDeleteUserAccount(): DeleteUserAccountUseCase;
}
```

### Implementation

```typescript
// ✅ CORRECT: Server Container implementation
class UserServerContainerImpl implements UserServerContainer {
  // Infrastructure Layer (Initialized in constructor)
  private readonly httpClient: AuthenticatedHttpClient;

  // Data Layer (Initialized in constructor)
  private readonly dataSource: UserRemoteDataSource;
  private readonly repository: UserRepository;

  // Domain Layer (Initialized in constructor)
  private readonly getUserProfileUseCase: GetUserProfileUseCase;
  private readonly updateUserProfileUseCase: UpdateUserProfileUseCase;
  private readonly deleteUserAccountUseCase: DeleteUserAccountUseCase;

  constructor(sessionManager: SessionManager) {
    // 1. Infrastructure Layer
    const baseClient = new FetchHttpClient({
      baseUrl: process.env.NEXT_PUBLIC_API_URL || '',
      timeout: 30000,
    });

    const tokenProvider = new ServerTokenProvider(sessionManager);
    const refreshTokenService = new RefreshTokenService(
      baseClient,
      sessionManager
    );

    this.httpClient = new AuthenticatedHttpClient(
      baseClient,
      tokenProvider,
      undefined, // Server-side: no session manager in HTTP client
      refreshTokenService // Server-side: handle token refresh
    );

    // 2. Data Layer
    this.dataSource = new UserRemoteDataSource(this.httpClient);
    this.repository = new UserRepositoryImpl(this.dataSource);

    // 3. Domain Layer (UseCases)
    this.getUserProfileUseCase = new GetUserProfileUseCaseImpl(
      this.repository
    );
    this.updateUserProfileUseCase = new UpdateUserProfileUseCaseImpl(
      this.repository
    );
    this.deleteUserAccountUseCase = new DeleteUserAccountUseCaseImpl(
      this.repository
    );
  }

  getGetUserProfile(): GetUserProfileUseCase {
    return this.getUserProfileUseCase;
  }

  getUpdateUserProfile(): UpdateUserProfileUseCase {
    return this.updateUserProfileUseCase;
  }

  getDeleteUserAccount(): DeleteUserAccountUseCase {
    return this.deleteUserAccountUseCase;
  }
}

// Factory function creates NEW instance per request
export function createUserServerContainer(
  sessionManager: SessionManager
): UserServerContainer {
  return new UserServerContainerImpl(sessionManager);
}
```

## Multi-Repository Container

For UseCases that need multiple repositories:

```typescript
// ✅ CORRECT: Container with multiple repositories
class DashboardServerContainerImpl implements DashboardServerContainer {
  private readonly userRepository: UserRepository;
  private readonly stampRepository: StampRepository;
  private readonly benefitRepository: BenefitRepository;
  private readonly getUserDashboardUseCase: GetUserDashboardUseCase;

  constructor(sessionManager: SessionManager) {
    // Infrastructure
    const baseClient = new FetchHttpClient({
      baseUrl: process.env.NEXT_PUBLIC_API_URL || '',
    });
    const tokenProvider = new ServerTokenProvider(sessionManager);
    const httpClient = new AuthenticatedHttpClient(
      baseClient,
      tokenProvider,
      undefined,
      new RefreshTokenService(baseClient, sessionManager)
    );

    // Data Layer - Multiple DataSources
    const userDataSource = new UserRemoteDataSource(httpClient);
    const stampDataSource = new StampRemoteDataSource(httpClient);
    const benefitDataSource = new BenefitRemoteDataSource(httpClient);

    // Data Layer - Multiple Repositories
    this.userRepository = new UserRepositoryImpl(userDataSource);
    this.stampRepository = new StampRepositoryImpl(stampDataSource);
    this.benefitRepository = new BenefitRepositoryImpl(benefitDataSource);

    // Domain Layer - UseCase with multiple repositories
    this.getUserDashboardUseCase = new GetUserDashboardUseCaseImpl(
      this.userRepository,
      this.stampRepository,
      this.benefitRepository
    );
  }

  getGetUserDashboard(): GetUserDashboardUseCase {
    return this.getUserDashboardUseCase;
  }
}

export function createDashboardServerContainer(
  sessionManager: SessionManager
): DashboardServerContainer {
  return new DashboardServerContainerImpl(sessionManager);
}
```

## Usage in Server Components

### Page Component

```typescript
// ✅ CORRECT: Use Server Container in Server Component
// app/(auth)/profile/page.tsx
import { createUserServerContainer } from '@user/di';
import { ServerSessionManager } from '@core/infrastructure/storage/server-session-manager';

export default async function ProfilePage() {
  // Create SessionManager per request
  const sessionManager = new ServerSessionManager();

  // Create Container per request
  const container = createUserServerContainer(sessionManager);

  // Get UseCase and execute
  const getUserProfile = container.getGetUserProfile();
  const user = await getUserProfile.execute();

  return <ProfileView user={user} />;
}
```

### Layout Component

```typescript
// ✅ CORRECT: Use Server Container in Layout
// app/(auth)/layout.tsx
import { createUserServerContainer } from '@user/di';
import { ServerSessionManager } from '@core/infrastructure/storage/server-session-manager';

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sessionManager = new ServerSessionManager();
  const container = createUserServerContainer(sessionManager);

  const getUserProfile = container.getGetUserProfile();
  const user = await getUserProfile.execute();

  return (
    <div>
      <Header user={user} />
      {children}
    </div>
  );
}
```

## Usage in Server Actions

```typescript
// ✅ CORRECT: Use Server Container in Server Action
'use server';

import { revalidatePath } from 'next/cache';
import { createUserServerContainer } from '@user/di';
import { ServerSessionManager } from '@core/infrastructure/storage/server-session-manager';

export async function updateUserProfile(
  userId: string,
  updates: UserProfileUpdates
): Promise<{ success: boolean; error?: string }> {
  try {
    // Create SessionManager per action call
    const sessionManager = new ServerSessionManager();

    // Create Container per action call
    const container = createUserServerContainer(sessionManager);

    // Get UseCase and execute
    const updateUserProfile = container.getUpdateUserProfile();
    await updateUserProfile.execute(userId, updates);

    revalidatePath('/profile');

    return { success: true };
  } catch (error) {
    console.error('Update profile error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
```

## Usage in API Routes

```typescript
// ✅ CORRECT: Use Server Container in API Route
// app/api/user/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createUserServerContainer } from '@user/di';
import { MiddlewareSessionManager } from '@core/infrastructure/storage/middleware-session-manager';

export async function GET(request: NextRequest) {
  try {
    // Create SessionManager per request
    const sessionManager = new MiddlewareSessionManager(request);

    // Create Container per request
    const container = createUserServerContainer(sessionManager);

    // Get UseCase and execute
    const getUserProfile = container.getGetUserProfile();
    const user = await getUserProfile.execute();

    return NextResponse.json({
      success: true,
      data: {
        userId: user.getUserId(),
        email: user.getEmail(),
        nickname: user.getNickname(),
      },
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
```

## SessionManager Variants

### Server SessionManager (Cookies)

```typescript
// ✅ CORRECT: For Server Components and Server Actions
const sessionManager = new ServerSessionManager();
const container = createUserServerContainer(sessionManager);
```

### Middleware SessionManager (Next Request)

```typescript
// ✅ CORRECT: For API Routes and Middleware
const sessionManager = new MiddlewareSessionManager(request);
const container = createUserServerContainer(sessionManager);
```

## Container Location

```
✅ CORRECT: Per-Domain DI Containers
domains/
├── auth/
│   └── di/
│       ├── auth-container.ts           # Base container interface
│       ├── auth-server-container.ts    # Server implementation
│       ├── auth-client-container.ts    # Client implementation
│       └── index.ts                    # Exports
├── user/
│   └── di/
│       ├── user-container.ts           # Base container interface
│       ├── user-server-container.ts    # Server implementation
│       ├── user-client-container.ts    # Client implementation
│       └── index.ts                    # Exports
└── cafeteria/
    └── di/
        ├── cafeteria-container.ts      # Base container interface
        ├── cafeteria-server-container.ts  # Server implementation
        ├── cafeteria-client-container.ts  # Client implementation
        └── index.ts                    # Exports

❌ WRONG: Global DI container
src/
└── di/  # DON'T DO THIS - containers must be per-domain
    ├── server-container.ts
    └── client-container.ts
```

## Error Handling

```typescript
// ✅ CORRECT: Handle container creation errors
export function createUserServerContainer(
  sessionManager: SessionManager
): UserServerContainer {
  try {
    return new UserServerContainerImpl(sessionManager);
  } catch (error) {
    console.error('Failed to create UserServerContainer:', error);
    throw new Error('Container initialization failed', { cause: error });
  }
}
```

## Testing Server Containers

```typescript
describe('UserServerContainer', () => {
  let sessionManager: SessionManager;

  beforeEach(() => {
    sessionManager = {
      getAccessToken: jest.fn().mockResolvedValue('test-token'),
      getRefreshToken: jest.fn().mockResolvedValue('refresh-token'),
      getUserId: jest.fn().mockResolvedValue('user-123'),
      getDeviceId: jest.fn().mockResolvedValue('device-123'),
      saveSession: jest.fn(),
      getSession: jest.fn(),
      clearSession: jest.fn(),
    } as jest.Mocked<SessionManager>;
  });

  it('should create container successfully', () => {
    const container = createUserServerContainer(sessionManager);

    expect(container).toBeDefined();
    expect(container.getGetUserProfile).toBeDefined();
    expect(container.getUpdateUserProfile).toBeDefined();
  });

  it('should return UseCases', () => {
    const container = createUserServerContainer(sessionManager);

    const getUserProfile = container.getGetUserProfile();
    const updateUserProfile = container.getUpdateUserProfile();

    expect(getUserProfile).toBeDefined();
    expect(updateUserProfile).toBeDefined();
    expect(getUserProfile.execute).toBeDefined();
    expect(updateUserProfile.execute).toBeDefined();
  });

  it('should create new instance per request', () => {
    const container1 = createUserServerContainer(sessionManager);
    const container2 = createUserServerContainer(sessionManager);

    // Different instances
    expect(container1).not.toBe(container2);

    // But same UseCase behavior
    expect(container1.getGetUserProfile).toBeDefined();
    expect(container2.getGetUserProfile).toBeDefined();
  });
});
```

## Best Practices

1. **Factory Function**: Always use factory function, never singleton
2. **Per-Request**: Create new container for each request
3. **Eager Initialization**: Initialize all dependencies in constructor
4. **SessionManager Parameter**: Always accept SessionManager as parameter
5. **NO State**: Server containers should NOT store request-specific state
6. **Environment Variables**: Use `process.env` for configuration
7. **Error Handling**: Wrap container creation in try-catch

## Common Pitfalls

### ❌ WRONG: Singleton Pattern on Server

```typescript
// DON'T DO THIS
let serverContainerInstance: UserServerContainer | null = null;

export function getUserServerContainer(): UserServerContainer {
  if (!serverContainerInstance) {
    serverContainerInstance = new UserServerContainerImpl();
  }
  return serverContainerInstance; // Shared across requests!
}
```

### ✅ CORRECT: Factory Function

```typescript
export function createUserServerContainer(
  sessionManager: SessionManager
): UserServerContainer {
  return new UserServerContainerImpl(sessionManager);
}
```

### ❌ WRONG: Using Client Container on Server

```typescript
// app/(auth)/profile/page.tsx
import { getUserClientContainer } from '@user/di'; // WRONG!

export default async function ProfilePage() {
  const container = getUserClientContainer(); // DON'T USE CLIENT CONTAINER ON SERVER
  // ...
}
```

### ✅ CORRECT: Using Server Container

```typescript
// app/(auth)/profile/page.tsx
import { createUserServerContainer } from '@user/di'; // CORRECT!
import { ServerSessionManager } from '@core/infrastructure/storage/server-session-manager';

export default async function ProfilePage() {
  const sessionManager = new ServerSessionManager();
  const container = createUserServerContainer(sessionManager); // CORRECT
  // ...
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

## Summary

Server Containers provide:
- **Request Isolation**: Fresh container per request
- **Thread Safety**: No shared state across requests
- **Dependency Management**: Centralized dependency wiring
- **Testability**: Easy to mock SessionManager
- **Type Safety**: Compile-time validation of dependencies

Use Server Containers in all server-side code (Server Components, Server Actions, API Routes). For client-side code, see [di-client-containers.md](./di-client-containers.md).
