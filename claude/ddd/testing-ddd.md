---
description: "DDD layer testing: Entity, UseCase, Repository testing strategies"
globs:
  - "src/domains/**/*.test.ts"
  - "src/domains/**/*.spec.ts"
alwaysApply: false
---

# Testing DDD Layers

> **Related Documents**: [entity-patterns.md](./entity-patterns.md), [usecase-patterns.md](./usecase-patterns.md), [repository-patterns.md](./repository-patterns.md)

## Overview

Testing in DDD architecture requires understanding each layer's responsibilities. This guide covers testing strategies for Entities, UseCases, Repositories, and infrastructure components.

## Testing Pyramid for DDD

```
                    ┌───────────────┐
                    │   E2E Tests   │  (Few - Full integration)
                    └───────────────┘
                ┌───────────────────────┐
                │  Integration Tests    │  (Some - Repository + HttpClient)
                └───────────────────────┘
        ┌───────────────────────────────────┐
        │        Unit Tests                 │  (Many - Entity, UseCase)
        └───────────────────────────────────┘
```

## Entity Testing

### Basic Entity Tests

```typescript
// ✅ CORRECT: Test entity business logic
describe('UserEntity', () => {
  describe('constructor', () => {
    it('should create valid user entity', () => {
      const user = new UserEntity(
        '123',
        'test@example.com',
        'Test User',
        'ACTIVE',
        true
      );

      expect(user.getUserId()).toBe('123');
      expect(user.getEmail()).toBe('test@example.com');
      expect(user.getNickname()).toBe('Test User');
      expect(user.isActive()).toBe(true);
      expect(user.isEmailVerified()).toBe(true);
    });

    it('should throw error for invalid email', () => {
      expect(() => {
        new UserEntity('123', 'invalid-email', 'Test User', 'ACTIVE', true);
      }).toThrow(UserError);
      expect(() => {
        new UserEntity('123', 'invalid-email', 'Test User', 'ACTIVE', true);
      }).toThrow('Invalid email format');
    });

    it('should throw error for empty nickname', () => {
      expect(() => {
        new UserEntity('123', 'test@example.com', '', 'ACTIVE', true);
      }).toThrow(UserError);
    });
  });

  describe('business logic methods', () => {
    it('should return true for active user', () => {
      const user = new UserEntity(
        '123',
        'test@example.com',
        'Test User',
        'ACTIVE',
        true
      );

      expect(user.isActive()).toBe(true);
    });

    it('should return false for inactive user', () => {
      const user = new UserEntity(
        '123',
        'test@example.com',
        'Test User',
        'INACTIVE',
        true
      );

      expect(user.isActive()).toBe(false);
    });

    it('should allow premium access for active verified user', () => {
      const user = new UserEntity(
        '123',
        'test@example.com',
        'Test User',
        'ACTIVE',
        true
      );

      expect(user.canAccessPremiumFeatures()).toBe(true);
    });

    it('should deny premium access for unverified user', () => {
      const user = new UserEntity(
        '123',
        'test@example.com',
        'Test User',
        'ACTIVE',
        false
      );

      expect(user.canAccessPremiumFeatures()).toBe(false);
    });
  });
});
```

### Value Object Tests

```typescript
describe('LocalTime', () => {
  it('should create valid time', () => {
    const time = new LocalTime(14, 30);

    expect(time.getHour()).toBe(14);
    expect(time.getMinute()).toBe(30);
  });

  it('should throw error for invalid hour', () => {
    expect(() => new LocalTime(25, 0)).toThrow('Invalid hour');
    expect(() => new LocalTime(-1, 0)).toThrow('Invalid hour');
  });

  it('should throw error for invalid minute', () => {
    expect(() => new LocalTime(14, 60)).toThrow('Invalid minute');
    expect(() => new LocalTime(14, -1)).toThrow('Invalid minute');
  });

  it('should compare times correctly', () => {
    const time1 = new LocalTime(14, 30);
    const time2 = new LocalTime(15, 30);
    const time3 = new LocalTime(14, 45);

    expect(time1.isBefore(time2)).toBe(true);
    expect(time1.isBefore(time3)).toBe(true);
    expect(time2.isBefore(time1)).toBe(false);
  });

  it('should check equality correctly', () => {
    const time1 = new LocalTime(14, 30);
    const time2 = new LocalTime(14, 30);
    const time3 = new LocalTime(14, 45);

    expect(time1.equals(time2)).toBe(true);
    expect(time1.equals(time3)).toBe(false);
  });
});
```

## UseCase Testing

### Query UseCase Tests

```typescript
// ✅ CORRECT: Mock Repository, test business logic
describe('GetUserProfileUseCaseImpl', () => {
  let useCase: GetUserProfileUseCase;
  let mockRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    mockRepository = {
      getById: jest.fn(),
      getByEmail: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as jest.Mocked<UserRepository>;

    useCase = new GetUserProfileUseCaseImpl(mockRepository);
  });

  describe('execute', () => {
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
      expect(mockRepository.getById).toHaveBeenCalledWith('123');
    });

    it('should throw error when user ID is empty', async () => {
      await expect(useCase.execute('')).rejects.toThrow(UserError);
      await expect(useCase.execute('')).rejects.toThrow('User ID is required');

      expect(mockRepository.getById).not.toHaveBeenCalled();
    });

    it('should throw error when user not found', async () => {
      mockRepository.getById.mockResolvedValue(null);

      await expect(useCase.execute('123')).rejects.toThrow(UserNotFoundError);
      expect(mockRepository.getById).toHaveBeenCalledWith('123');
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

      await expect(useCase.execute('123')).rejects.toThrow(InactiveUserError);
    });
  });
});
```

### Command UseCase Tests

```typescript
describe('UpdateUserProfileUseCaseImpl', () => {
  let useCase: UpdateUserProfileUseCase;
  let mockRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    mockRepository = {
      getById: jest.fn(),
      update: jest.fn(),
    } as jest.Mocked<UserRepository>;

    useCase = new UpdateUserProfileUseCaseImpl(mockRepository);
  });

  it('should update user successfully', async () => {
    const existingUser = new UserEntity(
      '123',
      'old@example.com',
      'Old Name',
      'ACTIVE',
      true
    );

    const updatedUser = new UserEntity(
      '123',
      'new@example.com',
      'New Name',
      'ACTIVE',
      true
    );

    mockRepository.getById.mockResolvedValue(existingUser);
    mockRepository.update.mockResolvedValue(updatedUser);

    const result = await useCase.execute('123', {
      email: 'new@example.com',
      nickname: 'New Name',
    });

    expect(result.getEmail()).toBe('new@example.com');
    expect(result.getNickname()).toBe('New Name');
    expect(mockRepository.update).toHaveBeenCalled();
  });

  it('should throw error when user not found', async () => {
    mockRepository.getById.mockResolvedValue(null);

    await expect(
      useCase.execute('123', { nickname: 'New Name' })
    ).rejects.toThrow(UserNotFoundError);

    expect(mockRepository.update).not.toHaveBeenCalled();
  });

  it('should throw error when updating inactive user', async () => {
    const inactiveUser = new UserEntity(
      '123',
      'test@example.com',
      'Test User',
      'INACTIVE',
      true
    );

    mockRepository.getById.mockResolvedValue(inactiveUser);

    await expect(
      useCase.execute('123', { nickname: 'New Name' })
    ).rejects.toThrow('Cannot update inactive user');
  });
});
```

### Multi-Repository UseCase Tests

```typescript
describe('GetUserDashboardUseCaseImpl', () => {
  let useCase: GetUserDashboardUseCase;
  let mockUserRepository: jest.Mocked<UserRepository>;
  let mockStampRepository: jest.Mocked<StampRepository>;
  let mockBenefitRepository: jest.Mocked<BenefitRepository>;

  beforeEach(() => {
    mockUserRepository = {
      getById: jest.fn(),
    } as jest.Mocked<UserRepository>;

    mockStampRepository = {
      getByUserId: jest.fn(),
    } as jest.Mocked<StampRepository>;

    mockBenefitRepository = {
      getActiveForUser: jest.fn(),
    } as jest.Mocked<BenefitRepository>;

    useCase = new GetUserDashboardUseCaseImpl(
      mockUserRepository,
      mockStampRepository,
      mockBenefitRepository
    );
  });

  it('should return dashboard data', async () => {
    const mockUser = new UserEntity(
      '123',
      'test@example.com',
      'Test User',
      'ACTIVE',
      true
    );
    const mockStamps = [
      /* stamp entities */
    ];
    const mockBenefits = [
      /* benefit entities */
    ];

    mockUserRepository.getById.mockResolvedValue(mockUser);
    mockStampRepository.getByUserId.mockResolvedValue(mockStamps);
    mockBenefitRepository.getActiveForUser.mockResolvedValue(mockBenefits);

    const result = await useCase.execute('123');

    expect(result.user).toBe(mockUser);
    expect(result.stamps).toBe(mockStamps);
    expect(result.benefits).toBe(mockBenefits);
  });
});
```

## Repository Testing

### Mock HttpClient, NOT DataSource

```typescript
// ✅ CORRECT: Mock HttpClient
describe('UserRepositoryImpl', () => {
  let repository: UserRepository;
  let mockHttpClient: jest.Mocked<HttpClient>;
  let dataSource: UserRemoteDataSource;

  beforeEach(() => {
    mockHttpClient = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
    } as jest.Mocked<HttpClient>;

    dataSource = new UserRemoteDataSource(mockHttpClient);
    repository = new UserRepositoryImpl(dataSource);
  });

  describe('getById', () => {
    it('should return user entity when found', async () => {
      const mockDto: UserDto = {
        id: '123',
        email: 'test@example.com',
        nickname: 'Test User',
        status: 'ACTIVE',
        emailVerified: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      };

      mockHttpClient.get.mockResolvedValue({
        data: mockDto,
        status: 200,
        statusText: 'OK',
        headers: {},
      });

      const user = await repository.getById('123');

      expect(user).not.toBeNull();
      expect(user?.getUserId()).toBe('123');
      expect(user?.getEmail()).toBe('test@example.com');
      expect(mockHttpClient.get).toHaveBeenCalledWith('/users/123');
    });

    it('should return null when user not found', async () => {
      mockHttpClient.get.mockRejectedValue({
        status: 404,
        message: 'Not Found',
      });

      const user = await repository.getById('999');

      expect(user).toBeNull();
    });

    it('should handle network errors', async () => {
      mockHttpClient.get.mockRejectedValue(new Error('Network error'));

      await expect(repository.getById('123')).rejects.toThrow();
    });
  });

  describe('create', () => {
    it('should create user successfully', async () => {
      const newUser = new UserEntity(
        '',
        'new@example.com',
        'New User',
        'ACTIVE',
        false
      );

      const createdDto: UserDto = {
        id: '456',
        email: 'new@example.com',
        nickname: 'New User',
        status: 'ACTIVE',
        emailVerified: false,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      };

      mockHttpClient.post.mockResolvedValue({
        data: createdDto,
        status: 201,
        statusText: 'Created',
        headers: {},
      });

      const result = await repository.create(newUser);

      expect(result.getUserId()).toBe('456');
      expect(result.getEmail()).toBe('new@example.com');
      expect(mockHttpClient.post).toHaveBeenCalledWith(
        '/users',
        expect.any(Object)
      );
    });
  });
});
```

## Mapper Testing

```typescript
describe('UserMapper', () => {
  describe('toDomain', () => {
    it('should map DTO to Entity correctly', () => {
      const dto: UserDto = {
        id: '123',
        email: 'test@example.com',
        nickname: 'Test User',
        status: 'ACTIVE',
        emailVerified: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      };

      const entity = UserMapper.toDomain(dto);

      expect(entity).toBeInstanceOf(UserEntity);
      expect(entity.getUserId()).toBe('123');
      expect(entity.getEmail()).toBe('test@example.com');
      expect(entity.isActive()).toBe(true);
    });

    it('should throw error for invalid DTO', () => {
      const invalidDto = {
        id: '',
        email: 'invalid',
        nickname: 'Test',
        status: 'ACTIVE',
        emailVerified: true,
      } as UserDto;

      expect(() => UserMapper.toDomain(invalidDto)).toThrow();
    });
  });

  describe('toDto', () => {
    it('should map Entity to DTO correctly', () => {
      const entity = new UserEntity(
        '123',
        'test@example.com',
        'Test User',
        'ACTIVE',
        true
      );

      const dto = UserMapper.toDto(entity);

      expect(dto.id).toBe('123');
      expect(dto.email).toBe('test@example.com');
      expect(dto.status).toBe('ACTIVE');
    });
  });
});
```

## Component Testing (with hooks)

```typescript
// ✅ CORRECT: Mock Query Hook
jest.mock('@user/presentation/hooks/queries/get-user.query', () => ({
  useGetUser: jest.fn(),
}));

describe('ProfileSection', () => {
  it('should render user profile when loaded', () => {
    const mockUser = {
      userId: '123',
      email: 'test@example.com',
      nickname: 'Test User',
    };

    (useGetUser as jest.Mock).mockReturnValue({
      data: mockUser,
      isLoading: false,
      error: null,
    });

    render(<ProfileSection />);

    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
  });

  it('should show loading state', () => {
    (useGetUser as jest.Mock).mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    });

    render(<ProfileSection />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should show error state', () => {
    (useGetUser as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      error: new Error('Failed to load user'),
    });

    render(<ProfileSection />);

    expect(screen.getByText(/Failed to load user/)).toBeInTheDocument();
  });
});
```

## Integration Testing

### Repository + HttpClient Integration

```typescript
describe('UserRepository Integration', () => {
  let repository: UserRepository;
  let httpClient: HttpClient;

  beforeEach(() => {
    httpClient = new FetchHttpClient({
      baseUrl: 'http://localhost:3000/api',
    });

    const dataSource = new UserRemoteDataSource(httpClient);
    repository = new UserRepositoryImpl(dataSource);
  });

  it('should fetch user from real API', async () => {
    // Requires running API server
    const user = await repository.getById('123');

    expect(user).not.toBeNull();
    expect(user?.getUserId()).toBe('123');
  }, 10000); // Longer timeout for integration test
});
```

## Test Utilities

### Mock Data Factories

```typescript
// test/factories/user.factory.ts
export class UserFactory {
  static createUser(overrides?: Partial<{
    id: string;
    email: string;
    nickname: string;
    status: 'ACTIVE' | 'INACTIVE';
    emailVerified: boolean;
  }>): User {
    return new UserEntity(
      overrides?.id ?? '123',
      overrides?.email ?? 'test@example.com',
      overrides?.nickname ?? 'Test User',
      overrides?.status ?? 'ACTIVE',
      overrides?.emailVerified ?? true
    );
  }

  static createUserDto(overrides?: Partial<UserDto>): UserDto {
    return {
      id: overrides?.id ?? '123',
      email: overrides?.email ?? 'test@example.com',
      nickname: overrides?.nickname ?? 'Test User',
      status: overrides?.status ?? 'ACTIVE',
      emailVerified: overrides?.emailVerified ?? true,
      createdAt: overrides?.createdAt ?? '2024-01-01T00:00:00Z',
      updatedAt: overrides?.updatedAt ?? '2024-01-01T00:00:00Z',
    };
  }
}
```

### Mock Repository Factory

```typescript
// test/factories/repository.factory.ts
export class RepositoryFactory {
  static createMockUserRepository(): jest.Mocked<UserRepository> {
    return {
      getById: jest.fn(),
      getByEmail: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as jest.Mocked<UserRepository>;
  }
}
```

## Best Practices

1. **Test Behavior, Not Implementation**: Focus on what the code does, not how
2. **Mock at Layer Boundaries**: Repository tests mock HttpClient, UseCase tests mock Repository
3. **Use Test Factories**: Create reusable factory functions for test data
4. **Arrange-Act-Assert**: Structure tests clearly
5. **One Assertion Focus**: Each test should verify one thing
6. **Test Error Cases**: Don't just test happy path
7. **Descriptive Test Names**: Use clear, specific test names

## What to Test

### ✅ DO Test

- Entity validation logic
- Entity business methods
- UseCase business logic
- Repository mapping (DTO ↔ Entity)
- Error handling
- Edge cases

### ❌ DON'T Test

- Framework internals (Next.js, React)
- Third-party libraries
- Type definitions
- Simple getters/setters (unless they have logic)

## Summary

Testing DDD layers requires:
- **Entity Tests**: Validation and business logic
- **UseCase Tests**: Business orchestration with mocked repositories
- **Repository Tests**: DTO mapping with mocked HttpClient
- **Component Tests**: UI behavior with mocked hooks
- **Integration Tests**: End-to-end with real dependencies

By testing at the right layer with appropriate mocks, you ensure each component works correctly while maintaining fast, reliable tests.
