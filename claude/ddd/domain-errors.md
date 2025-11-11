---
description: "Domain errors, error hierarchy, error handling strategies"
globs:
  - "src/domains/**/domain/errors/**/*.ts"
alwaysApply: true
---

# Domain Errors

> **Related Documents**: [entity-patterns.md](./entity-patterns.md), [usecase-patterns.md](./usecase-patterns.md)

## Overview

Domain errors represent business rule violations and exceptional cases in your domain logic. They provide clear, typed errors that can be handled appropriately at the presentation layer.

## Error Hierarchy

```
DomainError (Base)
├── UserError
│   ├── InvalidUserIdError
│   ├── UserNotFoundError
│   ├── InactiveUserError
│   └── DuplicateEmailError
├── AuthError
│   ├── InvalidTokenError
│   ├── ExpiredTokenError
│   └── InvalidCredentialsError
├── StampError
│   ├── StampNotFoundError
│   ├── StampExpiredError
│   └── StampAlreadyUsedError
└── BenefitError
    ├── BenefitNotFoundError
    ├── BenefitUnavailableError
    └── InsufficientBalanceError
```

## Base Domain Error

```typescript
// ✅ CORRECT: Base domain error
export class DomainError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly cause?: Error
  ) {
    super(message);
    this.name = 'DomainError';
    Object.setPrototypeOf(this, DomainError.prototype);
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      cause: this.cause?.message,
    };
  }
}
```

## Domain-Specific Errors

### User Errors

```typescript
// ✅ CORRECT: User domain errors
export const USER_ERROR_CODES = {
  INVALID_USER_ID: 'USER_001',
  USER_NOT_FOUND: 'USER_002',
  INACTIVE_USER: 'USER_003',
  DUPLICATE_EMAIL: 'USER_004',
  INVALID_EMAIL: 'USER_005',
} as const;

export class UserError extends DomainError {
  constructor(
    message: string,
    code: string,
    cause?: Error
  ) {
    super(message, code, cause);
    this.name = 'UserError';
    Object.setPrototypeOf(this, UserError.prototype);
  }
}

// Specific error classes for common cases
export class UserNotFoundError extends UserError {
  constructor(userId: string) {
    super(
      `User not found: ${userId}`,
      USER_ERROR_CODES.USER_NOT_FOUND
    );
    this.name = 'UserNotFoundError';
  }
}

export class InactiveUserError extends UserError {
  constructor(userId: string) {
    super(
      `User is inactive: ${userId}`,
      USER_ERROR_CODES.INACTIVE_USER
    );
    this.name = 'InactiveUserError';
  }
}

export class DuplicateEmailError extends UserError {
  constructor(email: string) {
    super(
      `User with email already exists: ${email}`,
      USER_ERROR_CODES.DUPLICATE_EMAIL
    );
    this.name = 'DuplicateEmailError';
  }
}
```

### Auth Errors

```typescript
// ✅ CORRECT: Auth domain errors
export const AUTH_ERROR_CODES = {
  INVALID_TOKEN: 'AUTH_001',
  EXPIRED_TOKEN: 'AUTH_002',
  INVALID_CREDENTIALS: 'AUTH_003',
  INVALID_USER_DATA: 'AUTH_004',
  OAUTH_ERROR: 'AUTH_005',
} as const;

export class AuthError extends DomainError {
  constructor(
    message: string,
    code: string,
    cause?: Error
  ) {
    super(message, code, cause);
    this.name = 'AuthError';
    Object.setPrototypeOf(this, AuthError.prototype);
  }
}

export class InvalidTokenError extends AuthError {
  constructor(message: string = 'Invalid token') {
    super(message, AUTH_ERROR_CODES.INVALID_TOKEN);
    this.name = 'InvalidTokenError';
  }
}

export class ExpiredTokenError extends AuthError {
  constructor() {
    super('Token has expired', AUTH_ERROR_CODES.EXPIRED_TOKEN);
    this.name = 'ExpiredTokenError';
  }
}

export class InvalidCredentialsError extends AuthError {
  constructor() {
    super('Invalid credentials', AUTH_ERROR_CODES.INVALID_CREDENTIALS);
    this.name = 'InvalidCredentialsError';
  }
}
```

### Stamp Errors

```typescript
// ✅ CORRECT: Stamp domain errors
export const STAMP_ERROR_CODES = {
  INVALID_INPUT: 'STAMP_001',
  STAMP_NOT_FOUND: 'STAMP_002',
  STAMP_EXPIRED: 'STAMP_003',
  STAMP_ALREADY_USED: 'STAMP_004',
  STAMP_UNUSABLE: 'STAMP_005',
  NO_BENEFITS: 'STAMP_006',
  UNAUTHORIZED: 'STAMP_007',
  STAMP_NOT_TRANSFERABLE: 'STAMP_008',
  INVALID_TRANSFER: 'STAMP_009',
} as const;

export class StampError extends DomainError {
  constructor(
    message: string,
    code: string,
    cause?: Error
  ) {
    super(message, code, cause);
    this.name = 'StampError';
    Object.setPrototypeOf(this, StampError.prototype);
  }
}

export class StampNotFoundError extends StampError {
  constructor(stampId: string) {
    super(
      `Stamp not found: ${stampId}`,
      STAMP_ERROR_CODES.STAMP_NOT_FOUND
    );
    this.name = 'StampNotFoundError';
  }
}

export class StampExpiredError extends StampError {
  constructor(stampId: string) {
    super(
      `Stamp has expired: ${stampId}`,
      STAMP_ERROR_CODES.STAMP_EXPIRED
    );
    this.name = 'StampExpiredError';
  }
}

export class StampAlreadyUsedError extends StampError {
  constructor(stampId: string) {
    super(
      `Stamp already used: ${stampId}`,
      STAMP_ERROR_CODES.STAMP_ALREADY_USED
    );
    this.name = 'StampAlreadyUsedError';
  }
}
```

## Usage in Entities

```typescript
// ✅ CORRECT: Throw errors in entity validation
export class UserEntity implements User {
  constructor(
    private readonly userId: string,
    private readonly email: string,
    private readonly nickname: string,
    private readonly status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED',
    private readonly emailVerified: boolean
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.email.includes('@')) {
      throw new UserError(
        'Invalid email format',
        USER_ERROR_CODES.INVALID_EMAIL
      );
    }

    if (!this.nickname || this.nickname.trim().length === 0) {
      throw new UserError(
        'Nickname is required',
        USER_ERROR_CODES.INVALID_USER_ID
      );
    }
  }

  // Business methods...
}
```

## Usage in UseCases

```typescript
// ✅ CORRECT: Throw domain errors in UseCases
export class GetUserProfileUseCaseImpl implements GetUserProfileUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(userId: string): Promise<User> {
    // Input validation
    if (!userId || userId.trim().length === 0) {
      throw new UserError(
        'User ID is required',
        USER_ERROR_CODES.INVALID_USER_ID
      );
    }

    // Business logic
    const user = await this.userRepository.getById(userId);

    if (!user) {
      throw new UserNotFoundError(userId);
    }

    if (!user.isActive()) {
      throw new InactiveUserError(userId);
    }

    return user;
  }
}
```

## Error Handling in Presentation Layer

### React Component

```typescript
'use client';

import { useGetUser } from '@user/presentation/hooks/queries/get-user.query';
import { UserError } from '@user/domain/errors/user-error';

export function ProfileSection() {
  const { data, error, isLoading } = useGetUser();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    // Handle specific domain errors
    if (error instanceof UserError) {
      if (error.code === USER_ERROR_CODES.USER_NOT_FOUND) {
        return <div>User not found</div>;
      }
      if (error.code === USER_ERROR_CODES.INACTIVE_USER) {
        return <div>Account is inactive</div>;
      }
    }

    // Generic error
    return <div>An error occurred: {error.message}</div>;
  }

  return <ProfileView user={data} />;
}
```

### Error Boundary

```typescript
'use client';

import { Component, ReactNode } from 'react';
import { DomainError } from '@/shared/core/domain/errors/domain-error';

interface Props {
  children: ReactNode;
  fallback?: (error: Error) => ReactNode;
}

interface State {
  error: Error | null;
}

export class DomainErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error) {
    // Log domain errors
    if (error instanceof DomainError) {
      console.error('Domain Error:', error.toJSON());
    } else {
      console.error('Unexpected Error:', error);
    }
  }

  render() {
    if (this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error);
      }

      // Default error UI
      if (this.state.error instanceof DomainError) {
        return (
          <div>
            <h2>Error: {this.state.error.code}</h2>
            <p>{this.state.error.message}</p>
          </div>
        );
      }

      return <div>An unexpected error occurred</div>;
    }

    return this.props.children;
  }
}
```

### Server Action Error Handling

```typescript
'use server';

import { revalidatePath } from 'next/cache';
import { createUserServerContainer } from '@user/di';
import { ServerSessionManager } from '@core/infrastructure/storage/server-session-manager';
import { UserError } from '@user/domain/errors/user-error';

export async function updateUserProfile(
  userId: string,
  updates: UserProfileUpdates
): Promise<{ success: boolean; error?: string }> {
  try {
    const sessionManager = new ServerSessionManager();
    const container = createUserServerContainer(sessionManager);
    const updateUserProfile = container.getUpdateUserProfile();

    await updateUserProfile.execute(userId, updates);

    revalidatePath('/profile');

    return { success: true };
  } catch (error) {
    // Handle domain errors
    if (error instanceof UserError) {
      return {
        success: false,
        error: error.message,
      };
    }

    // Handle unexpected errors
    console.error('Unexpected error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred',
    };
  }
}
```

## Error Wrapping

When catching infrastructure errors, wrap them in domain errors:

```typescript
// ✅ CORRECT: Wrap infrastructure errors
export class UserRepositoryImpl implements UserRepository {
  constructor(private readonly remoteDataSource: UserRemoteDataSource) {}

  async getById(userId: string): Promise<User | null> {
    try {
      const dto = await this.remoteDataSource.getUserById(userId);
      if (!dto) return null;
      return UserMapper.toDomain(dto);
    } catch (error) {
      // Handle specific HTTP errors
      if (this.isNotFoundError(error)) {
        return null;
      }

      // Wrap network errors as domain errors
      if (this.isNetworkError(error)) {
        throw new UserError(
          'Network error while fetching user',
          'NETWORK_ERROR',
          error instanceof Error ? error : undefined
        );
      }

      // Re-throw domain errors as-is
      if (error instanceof DomainError) {
        throw error;
      }

      // Wrap other errors
      throw new UserError(
        'Failed to fetch user',
        'UNKNOWN_ERROR',
        error instanceof Error ? error : undefined
      );
    }
  }

  private isNotFoundError(error: unknown): boolean {
    return (
      error instanceof Error &&
      'status' in error &&
      (error as { status: number }).status === 404
    );
  }

  private isNetworkError(error: unknown): boolean {
    return (
      error instanceof Error &&
      (error.message.includes('Network') || error.message.includes('ECONNREFUSED'))
    );
  }
}
```

## Validation Errors

For input validation:

```typescript
// ✅ CORRECT: Validation error
export class ValidationError extends DomainError {
  constructor(
    field: string,
    message: string,
    code: string = 'VALIDATION_ERROR'
  ) {
    super(`Validation failed for ${field}: ${message}`, code);
    this.name = 'ValidationError';
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

// Usage
export class CreateUserUseCaseImpl {
  async execute(request: CreateUserRequest): Promise<User> {
    // Validate email
    if (!request.email || !request.email.includes('@')) {
      throw new ValidationError('email', 'Invalid email format');
    }

    // Validate nickname
    if (!request.nickname || request.nickname.trim().length === 0) {
      throw new ValidationError('nickname', 'Nickname is required');
    }

    // ... rest of logic
  }
}
```

## Best Practices

1. **Extend Base Error**: All domain errors should extend `DomainError`
2. **Use Error Codes**: Define constants for error codes
3. **Descriptive Messages**: Error messages should be clear and actionable
4. **Type Safety**: Use specific error classes for common cases
5. **Wrap Infrastructure Errors**: Convert infrastructure errors to domain errors
6. **Preserve Cause**: Include original error as `cause` when wrapping
7. **Consistent Naming**: Follow pattern: `{Domain}{Error}` (e.g., `UserError`, `StampError`)

## Error Code Patterns

```typescript
// ✅ CORRECT: Consistent error code patterns
export const DOMAIN_ERROR_CODES = {
  // Format: DOMAIN_XXX
  USER_001: 'INVALID_USER_ID',
  USER_002: 'USER_NOT_FOUND',
  USER_003: 'INACTIVE_USER',

  AUTH_001: 'INVALID_TOKEN',
  AUTH_002: 'EXPIRED_TOKEN',
  AUTH_003: 'INVALID_CREDENTIALS',

  STAMP_001: 'INVALID_INPUT',
  STAMP_002: 'STAMP_NOT_FOUND',
  STAMP_003: 'STAMP_EXPIRED',
} as const;
```

## Testing Domain Errors

```typescript
describe('GetUserProfileUseCaseImpl', () => {
  let useCase: GetUserProfileUseCase;
  let mockRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    mockRepository = {
      getById: jest.fn(),
    } as jest.Mocked<UserRepository>;

    useCase = new GetUserProfileUseCaseImpl(mockRepository);
  });

  it('should throw UserError when user not found', async () => {
    mockRepository.getById.mockResolvedValue(null);

    await expect(useCase.execute('123')).rejects.toThrow(UserError);
    await expect(useCase.execute('123')).rejects.toThrow('User not found');
  });

  it('should throw specific UserNotFoundError', async () => {
    mockRepository.getById.mockResolvedValue(null);

    await expect(useCase.execute('123')).rejects.toThrow(UserNotFoundError);
  });

  it('should throw InactiveUserError when user is inactive', async () => {
    const inactiveUser = new UserEntity(
      '123',
      'test@example.com',
      'Test',
      'INACTIVE',
      true
    );
    mockRepository.getById.mockResolvedValue(inactiveUser);

    await expect(useCase.execute('123')).rejects.toThrow(InactiveUserError);
  });
});
```

## Summary

Domain errors provide:
- **Type Safety**: Specific error types for different failure cases
- **Error Codes**: Machine-readable error identification
- **Clear Messages**: Human-readable error descriptions
- **Error Hierarchy**: Structured error organization
- **Easy Handling**: Straightforward error handling in UI
- **Testability**: Easy to test error scenarios

By using domain-specific errors, you create a clear contract between your domain logic and presentation layer, making error handling predictable and maintainable.
