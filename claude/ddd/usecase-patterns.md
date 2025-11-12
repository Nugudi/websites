---
description: "UseCase patterns, business logic orchestration, error handling"
globs:
  - "src/domains/**/domain/usecases/**/*.ts"
alwaysApply: true
---

# UseCase Patterns

> **Related Documents**: [entity-patterns.md](./entity-patterns.md), [repository-patterns.md](./repository-patterns.md), [domain-errors.md](./domain-errors.md)

## Overview

UseCases represent application-specific business logic. They orchestrate the flow of data between Entities and Repositories, implementing business rules and coordinating domain operations.

## Core Principles

### 1. Single Responsibility

Each UseCase should handle ONE specific business operation.

```typescript
// ✅ CORRECT: Single responsibility
export interface GetUserProfileUseCase {
  execute(userId: string): Promise<User>;
}

export interface UpdateUserProfileUseCase {
  execute(userId: string, updates: UserUpdates): Promise<User>;
}

// ❌ WRONG: Multiple responsibilities
export interface UserUseCase {
  getProfile(userId: string): Promise<User>;
  updateProfile(userId: string, updates: UserUpdates): Promise<User>;
  deleteAccount(userId: string): Promise<void>;
}
```

### 2. Business Logic Orchestration

UseCases contain business logic, NOT data access logic.

```typescript
// ✅ CORRECT: UseCase contains business logic
export interface GetUserProfileUseCase {
  execute(userId: string): Promise<User>;
}

export class GetUserProfileUseCaseImpl implements GetUserProfileUseCase {
  constructor(
    private readonly userRepository: UserRepository // Interface, not implementation
  ) {}

  async execute(userId: string): Promise<User> {
    // Business logic here
    if (!userId) {
      throw new UserError('User ID is required', 'INVALID_USER_ID');
    }

    const user = await this.userRepository.getById(userId);

    if (!user) {
      throw new UserError('User not found', 'USER_NOT_FOUND');
    }

    // Business rule: Inactive users cannot be retrieved
    if (!user.isActive()) {
      throw new UserError('User is inactive', 'INACTIVE_USER');
    }

    return user;
  }
}
```

### 3. Dependency on Abstractions

UseCases depend on Repository interfaces, NOT implementations.

```typescript
// ✅ CORRECT: Depends on interface
export class GetUserProfileUseCaseImpl implements GetUserProfileUseCase {
  constructor(
    private readonly userRepository: UserRepository // Interface
  ) {}
}

// ❌ WRONG: Depends on implementation
export class GetUserProfileUseCaseImpl implements GetUserProfileUseCase {
  constructor(
    private readonly userRepository: UserRepositoryImpl // Implementation
  ) {}
}
```

## UseCase Patterns

### Query UseCase (Read)

```typescript
// ✅ CORRECT: Query UseCase
export interface GetUserProfileUseCase {
  execute(userId: string): Promise<User>;
}

export class GetUserProfileUseCaseImpl implements GetUserProfileUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(userId: string): Promise<User> {
    // Validation
    if (!userId || userId.trim().length === 0) {
      throw new UserError('User ID is required', 'INVALID_USER_ID');
    }

    // Data retrieval
    const user = await this.userRepository.getById(userId);

    // Business rule validation
    if (!user) {
      throw new UserError('User not found', 'USER_NOT_FOUND');
    }

    if (!user.isActive()) {
      throw new UserError('User is inactive', 'INACTIVE_USER');
    }

    return user;
  }
}
```

### Command UseCase (Write)

```typescript
// ✅ CORRECT: Command UseCase
export interface UpdateUserProfileUseCase {
  execute(userId: string, updates: UserProfileUpdates): Promise<User>;
}

export class UpdateUserProfileUseCaseImpl implements UpdateUserProfileUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(userId: string, updates: UserProfileUpdates): Promise<User> {
    // Validation
    if (!userId) {
      throw new UserError('User ID is required', 'INVALID_USER_ID');
    }

    // Get existing user
    const user = await this.userRepository.getById(userId);

    if (!user) {
      throw new UserError('User not found', 'USER_NOT_FOUND');
    }

    // Business rule: Cannot update inactive user
    if (!user.isActive()) {
      throw new UserError('Cannot update inactive user', 'INACTIVE_USER');
    }

    // Create updated user (entities are immutable)
    const updatedUser = new UserEntity(
      user.getUserId(),
      updates.email ?? user.getEmail(),
      updates.nickname ?? user.getNickname(),
      user.isActive() ? 'ACTIVE' : 'INACTIVE',
      user.isEmailVerified()
    );

    // Persist changes
    return this.userRepository.update(updatedUser);
  }
}
```

### Complex Business Logic UseCase

```typescript
// ✅ CORRECT: Complex orchestration
export interface UseStampUseCase {
  execute(userId: string, stampId: string): Promise<StampUsageResult>;
}

export class UseStampUseCaseImpl implements UseStampUseCase {
  constructor(
    private readonly stampRepository: StampRepository,
    private readonly userRepository: UserRepository,
    private readonly benefitRepository: BenefitRepository
  ) {}

  async execute(userId: string, stampId: string): Promise<StampUsageResult> {
    // 1. Validate input
    if (!userId || !stampId) {
      throw new StampError('User ID and Stamp ID are required', 'INVALID_INPUT');
    }

    // 2. Get entities
    const [stamp, user] = await Promise.all([
      this.stampRepository.getById(stampId),
      this.userRepository.getById(userId),
    ]);

    // 3. Validate entities exist
    if (!stamp) {
      throw new StampError('Stamp not found', 'STAMP_NOT_FOUND');
    }
    if (!user) {
      throw new UserError('User not found', 'USER_NOT_FOUND');
    }

    // 4. Business rule: Check stamp ownership
    if (stamp.getUserId() !== userId) {
      throw new StampError('Stamp does not belong to user', 'UNAUTHORIZED');
    }

    // 5. Business rule: Check if stamp can be used
    if (!stamp.canBeUsed()) {
      throw new StampError('Stamp cannot be used', 'STAMP_UNUSABLE');
    }

    // 6. Get available benefits
    const benefits = await this.benefitRepository.getAvailableForStamp(stampId);

    if (benefits.length === 0) {
      throw new StampError('No benefits available', 'NO_BENEFITS');
    }

    // 7. Mark stamp as used
    const usedStamp = stamp.markAsUsed();
    await this.stampRepository.update(usedStamp);

    // 8. Return result
    return {
      stamp: usedStamp,
      benefits,
    };
  }
}
```

## Multi-Repository UseCases

When a UseCase needs data from multiple repositories:

```typescript
// ✅ CORRECT: Multiple repositories
export interface GetUserDashboardUseCase {
  execute(userId: string): Promise<UserDashboard>;
}

export class GetUserDashboardUseCaseImpl implements GetUserDashboardUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly stampRepository: StampRepository,
    private readonly benefitRepository: BenefitRepository
  ) {}

  async execute(userId: string): Promise<UserDashboard> {
    // Validate input
    if (!userId) {
      throw new UserError('User ID is required', 'INVALID_USER_ID');
    }

    // Fetch data in parallel
    const [user, stamps, benefits] = await Promise.all([
      this.userRepository.getById(userId),
      this.stampRepository.getByUserId(userId),
      this.benefitRepository.getActiveForUser(userId),
    ]);

    // Validate user exists
    if (!user) {
      throw new UserError('User not found', 'USER_NOT_FOUND');
    }

    // Business rule: Only active users can view dashboard
    if (!user.isActive()) {
      throw new UserError('User is inactive', 'INACTIVE_USER');
    }

    // Aggregate data
    return {
      user,
      stamps,
      benefits,
      hasActiveStamps: stamps.some(s => s.canBeUsed()),
      totalBenefitValue: benefits.reduce((sum, b) => sum + b.getDiscountAmount(), 0),
    };
  }
}
```

## Transactional UseCases

For operations requiring transactions:

```typescript
// ✅ CORRECT: Transactional UseCase
export interface TransferStampUseCase {
  execute(fromUserId: string, toUserId: string, stampId: string): Promise<void>;
}

export class TransferStampUseCaseImpl implements TransferStampUseCase {
  constructor(
    private readonly stampRepository: StampRepository,
    private readonly userRepository: UserRepository
  ) {}

  async execute(fromUserId: string, toUserId: string, stampId: string): Promise<void> {
    // Validation
    if (!fromUserId || !toUserId || !stampId) {
      throw new StampError('All parameters are required', 'INVALID_INPUT');
    }

    if (fromUserId === toUserId) {
      throw new StampError('Cannot transfer to the same user', 'INVALID_TRANSFER');
    }

    // Get entities
    const [stamp, fromUser, toUser] = await Promise.all([
      this.stampRepository.getById(stampId),
      this.userRepository.getById(fromUserId),
      this.userRepository.getById(toUserId),
    ]);

    // Validate entities
    if (!stamp) {
      throw new StampError('Stamp not found', 'STAMP_NOT_FOUND');
    }
    if (!fromUser) {
      throw new UserError('Sender not found', 'USER_NOT_FOUND');
    }
    if (!toUser) {
      throw new UserError('Recipient not found', 'USER_NOT_FOUND');
    }

    // Business rules
    if (stamp.getUserId() !== fromUserId) {
      throw new StampError('Stamp does not belong to sender', 'UNAUTHORIZED');
    }

    if (!stamp.canBeTransferred()) {
      throw new StampError('Stamp cannot be transferred', 'STAMP_NOT_TRANSFERABLE');
    }

    if (!toUser.isActive()) {
      throw new UserError('Recipient is inactive', 'INACTIVE_USER');
    }

    // Transfer stamp (creates new entity)
    const transferredStamp = stamp.transferTo(toUserId);

    // Persist (in a transaction if supported)
    await this.stampRepository.update(transferredStamp);
  }
}
```

## Error Handling

UseCases should throw domain-specific errors:

```typescript
// ✅ CORRECT: Domain-specific errors
export class LoginWithOAuthUseCaseImpl implements LoginWithOAuthUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly sessionManager: SessionManager
  ) {}

  async execute(provider: OAuthProvider, code: string): Promise<Session> {
    try {
      // Validate input
      if (!code) {
        throw new AuthError('Authorization code is required', 'INVALID_CODE');
      }

      // Get user from OAuth provider
      const oauthUser = await this.getOAuthUser(provider, code);

      // Find or create user
      let user = await this.userRepository.getByEmail(oauthUser.email);

      if (!user) {
        // Create new user
        user = new UserEntity(
          generateUserId(),
          oauthUser.email,
          oauthUser.name,
          'ACTIVE',
          true // OAuth emails are pre-verified
        );
        user = await this.userRepository.create(user);
      }

      // Business rule: Only active users can login
      if (!user.isActive()) {
        throw new AuthError('User account is inactive', 'INACTIVE_USER');
      }

      // Create session
      const session = new SessionEntity({
        accessToken: generateAccessToken(user),
        refreshToken: generateRefreshToken(user),
        userId: user.getUserId(),
        expiresAt: calculateExpiry(),
      });

      // Save session
      await this.sessionManager.saveSession({
        accessToken: session.getAccessToken(),
        refreshToken: session.getRefreshToken(),
        userId: session.getUserId(),
      });

      return session;
    } catch (error) {
      // Re-throw domain errors
      if (error instanceof DomainError) {
        throw error;
      }

      // Wrap infrastructure errors
      throw new AuthError(
        'OAuth login failed',
        'OAUTH_ERROR',
        error instanceof Error ? error : undefined
      );
    }
  }

  private async getOAuthUser(
    provider: OAuthProvider,
    code: string
  ): Promise<OAuthUser> {
    // Implementation details...
  }
}
```

## Naming Conventions

UseCases should follow verb-noun naming:

```typescript
// ✅ CORRECT: Verb-based UseCase names
GetUserProfileUseCase
UpdateUserProfileUseCase
DeleteUserAccountUseCase
LoginWithOAuthUseCase
CreateStampUseCase
UseStampUseCase
TransferStampUseCase
ListActiveBenefitsUseCase

// ❌ WRONG: Noun-based names
UserProfileUseCase
UserUseCase
ProfileUseCase
StampUseCase
```

## Testing UseCases

Mock Repository and SessionManager:

```typescript
// ✅ CORRECT: Mock Repository and SessionManager
describe('GetUserProfileUseCaseImpl', () => {
  let useCase: GetUserProfileUseCase;
  let mockRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    mockRepository = {
      getById: jest.fn(),
      update: jest.fn(),
    } as jest.Mocked<UserRepository>;

    useCase = new GetUserProfileUseCaseImpl(mockRepository);
  });

  it('should return user when found and active', async () => {
    const mockUser = new UserEntity(
      '123',
      'test@example.com',
      'Test User',
      'ACTIVE',
      true
    );

    mockRepository.getById.mockResolvedValue(mockUser);

    const result = await useCase.execute('123');

    expect(result).toBe(mockUser);
    expect(result.isActive()).toBe(true);
  });

  it('should throw error when user is inactive', async () => {
    const mockUser = new UserEntity(
      '123',
      'test@example.com',
      'Test User',
      'INACTIVE',
      true
    );

    mockRepository.getById.mockResolvedValue(mockUser);

    await expect(useCase.execute('123')).rejects.toThrow('User is inactive');
  });

  it('should throw error when user not found', async () => {
    mockRepository.getById.mockResolvedValue(null);

    await expect(useCase.execute('123')).rejects.toThrow('User not found');
  });
});
```

## Best Practices

1. **Single Responsibility**: One UseCase per business operation
2. **Interface Segregation**: Separate interface and implementation
3. **Dependency Inversion**: Depend on Repository interfaces
4. **Input Validation**: Always validate input parameters
5. **Business Rules**: Enforce business rules before data operations
6. **Error Handling**: Use domain-specific errors
7. **Immutability**: Create new entities instead of modifying
8. **Testability**: Design for easy mocking and testing

## Common Pitfalls

### ❌ WRONG: Business Logic in Repository

```typescript
// DON'T DO THIS
export class UserRepositoryImpl {
  async getById(userId: string): Promise<User | null> {
    const user = await this.dataSource.getById(userId);

    // WRONG: Business logic here!
    if (user && !user.isActive()) {
      throw new Error('User is inactive');
    }

    return user;
  }
}
```

### ✅ CORRECT: Business Logic in UseCase

```typescript
export class GetUserProfileUseCaseImpl {
  async execute(userId: string): Promise<User> {
    const user = await this.repository.getById(userId);

    // CORRECT: Business logic here!
    if (!user) {
      throw new UserError('User not found', 'USER_NOT_FOUND');
    }

    if (!user.isActive()) {
      throw new UserError('User is inactive', 'INACTIVE_USER');
    }

    return user;
  }
}
```

## Summary

UseCases are the entry point for all business operations. They:
- Orchestrate business logic between Entities and Repositories
- Enforce business rules and validation
- Handle errors and edge cases
- Provide a clear API for the Presentation layer
- Are easily testable with mocked dependencies

For more on how UseCases are instantiated and used, see [di-server-containers.md](./di-server-containers.md) and [di-client-containers.md](./di-client-containers.md).
