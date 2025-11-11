---
description: "Repository patterns, interfaces, implementations, data access"
globs:
  - "src/domains/**/domain/repositories/**/*.ts"
  - "src/domains/**/data/repositories/**/*.ts"
alwaysApply: true
---

# Repository Patterns

> **Related Documents**: [usecase-patterns.md](./usecase-patterns.md), [dto-mapper.md](./dto-mapper.md), [infrastructure-layer.md](./infrastructure-layer.md)

## Overview

Repositories provide an abstraction over data access, implementing the Repository pattern to separate domain logic from data persistence concerns. They follow the Dependency Inversion Principle: domain defines interfaces, data layer implements them.

## Core Principles

### 1. Dependency Inversion

Domain layer defines Repository interfaces, Data layer implements them.

```
┌─────────────────────────────────┐
│      Domain Layer               │
│  ┌───────────────────────────┐  │
│  │ UserRepository (interface)│  │  ← Domain defines contract
│  └───────────────────────────┘  │
└─────────────────────────────────┘
           ↑ implements
┌─────────────────────────────────┐
│      Data Layer                 │
│  ┌───────────────────────────┐  │
│  │ UserRepositoryImpl        │  │  ← Data implements
│  └───────────────────────────┘  │
└─────────────────────────────────┘
```

### 2. Repository Interface (Domain Layer)

```typescript
// ✅ CORRECT: Repository interface in domain layer
// domain/repositories/user-repository.ts
export interface UserRepository {
  getById(id: string): Promise<User | null>;
  getByEmail(email: string): Promise<User | null>;
  create(user: User): Promise<User>;
  update(user: User): Promise<User>;
  delete(id: string): Promise<void>;
}
```

### 3. Repository Implementation (Data Layer)

```typescript
// ✅ CORRECT: Repository implementation in data layer
// data/repositories/impl/user-repository-impl.ts
export class UserRepositoryImpl implements UserRepository {
  constructor(private readonly remoteDataSource: UserRemoteDataSource) {}

  async getById(userId: string): Promise<User | null> {
    const dto = await this.remoteDataSource.getUserById(userId);

    if (!dto) {
      return null;
    }

    // Use mapper to convert DTO to Entity
    return UserMapper.toDomain(dto);
  }

  async getByEmail(email: string): Promise<User | null> {
    const dto = await this.remoteDataSource.getUserByEmail(email);

    if (!dto) {
      return null;
    }

    return UserMapper.toDomain(dto);
  }

  async create(user: User): Promise<User> {
    // Convert Entity to DTO
    const dto = UserMapper.toDto(user);
    const createdDto = await this.remoteDataSource.createUser(dto);
    return UserMapper.toDomain(createdDto);
  }

  async update(user: User): Promise<User> {
    // Convert Entity to DTO
    const dto = UserMapper.toDto(user);
    const updatedDto = await this.remoteDataSource.updateUser(dto);
    return UserMapper.toDomain(updatedDto);
  }

  async delete(userId: string): Promise<void> {
    await this.remoteDataSource.deleteUser(userId);
  }
}
```

## DataSource Pattern

DataSources handle HTTP/API calls. Repositories use DataSources to fetch data.

```typescript
// ✅ CORRECT: DataSource handles HTTP calls
// data/datasource/remote/user-remote-datasource.ts
export class UserRemoteDataSource {
  constructor(
    private readonly httpClient: HttpClient // Infrastructure dependency
  ) {}

  async getUserById(userId: string): Promise<UserDto> {
    const response = await this.httpClient.get<UserDto>(`/users/${userId}`);
    return response.data;
  }

  async getUserByEmail(email: string): Promise<UserDto | null> {
    try {
      const response = await this.httpClient.get<UserDto>(
        `/users/by-email/${email}`
      );
      return response.data;
    } catch (error) {
      if (this.isNotFoundError(error)) {
        return null;
      }
      throw error;
    }
  }

  async createUser(dto: CreateUserDto): Promise<UserDto> {
    const response = await this.httpClient.post<UserDto>('/users', dto);
    return response.data;
  }

  async updateUser(dto: UserDto): Promise<UserDto> {
    const response = await this.httpClient.put<UserDto>(
      `/users/${dto.id}`,
      dto
    );
    return response.data;
  }

  async deleteUser(userId: string): Promise<void> {
    await this.httpClient.delete(`/users/${userId}`);
  }

  private isNotFoundError(error: unknown): boolean {
    return (
      error instanceof Error &&
      'status' in error &&
      (error as { status: number }).status === 404
    );
  }
}
```

## Query Repositories

For complex queries or list operations:

```typescript
// ✅ CORRECT: Query repository
export interface BenefitRepository {
  getById(id: string): Promise<Benefit | null>;
  getActiveForUser(userId: string): Promise<Benefit[]>;
  getAvailableForStamp(stampId: string): Promise<Benefit[]>;
  search(filters: BenefitSearchFilters): Promise<Benefit[]>;
}

export class BenefitRepositoryImpl implements BenefitRepository {
  constructor(private readonly remoteDataSource: BenefitRemoteDataSource) {}

  async getById(benefitId: string): Promise<Benefit | null> {
    const dto = await this.remoteDataSource.getBenefitById(benefitId);
    if (!dto) return null;
    return BenefitMapper.toDomain(dto);
  }

  async getActiveForUser(userId: string): Promise<Benefit[]> {
    const dtos = await this.remoteDataSource.getActiveBenefitsForUser(userId);
    return dtos.map(dto => BenefitMapper.toDomain(dto));
  }

  async getAvailableForStamp(stampId: string): Promise<Benefit[]> {
    const dtos = await this.remoteDataSource.getBenefitsForStamp(stampId);
    return dtos.map(dto => BenefitMapper.toDomain(dto));
  }

  async search(filters: BenefitSearchFilters): Promise<Benefit[]> {
    const dtos = await this.remoteDataSource.searchBenefits({
      menuType: filters.menuType,
      cafeteriaId: filters.cafeteriaId,
      hasDiscount: filters.hasDiscount,
    });
    return dtos.map(dto => BenefitMapper.toDomain(dto));
  }
}
```

## Pagination

Handle paginated responses:

```typescript
export interface PaginatedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  hasNextPage: boolean;
}

export interface StampRepository {
  getByUserId(
    userId: string,
    page: number,
    pageSize: number
  ): Promise<PaginatedResult<Stamp>>;
}

export class StampRepositoryImpl implements StampRepository {
  constructor(private readonly remoteDataSource: StampRemoteDataSource) {}

  async getByUserId(
    userId: string,
    page: number = 1,
    pageSize: number = 20
  ): Promise<PaginatedResult<Stamp>> {
    const response = await this.remoteDataSource.getStampsByUserId(
      userId,
      page,
      pageSize
    );

    return {
      items: response.items.map(dto => StampMapper.toDomain(dto)),
      totalCount: response.totalCount,
      page: response.page,
      pageSize: response.pageSize,
      hasNextPage: response.page * response.pageSize < response.totalCount,
    };
  }
}
```

## Error Handling

Repositories should handle data-layer errors and convert to domain errors when appropriate:

```typescript
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

      // Handle network errors
      if (this.isNetworkError(error)) {
        throw new UserError(
          'Network error while fetching user',
          'NETWORK_ERROR',
          error instanceof Error ? error : undefined
        );
      }

      // Re-throw other errors
      throw error;
    }
  }

  async create(user: User): Promise<User> {
    try {
      const dto = UserMapper.toDto(user);
      const createdDto = await this.remoteDataSource.createUser(dto);
      return UserMapper.toDomain(createdDto);
    } catch (error) {
      // Handle duplicate email error
      if (this.isDuplicateError(error)) {
        throw new UserError(
          'User with this email already exists',
          'DUPLICATE_EMAIL',
          error instanceof Error ? error : undefined
        );
      }

      throw error;
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

  private isDuplicateError(error: unknown): boolean {
    return (
      error instanceof Error &&
      'status' in error &&
      (error as { status: number }).status === 409
    );
  }
}
```

## Mock DataSource Pattern

For testing or development without backend:

```typescript
// ✅ CORRECT: Mock DataSource for testing
// data/datasource/remote/mock/user-mock-datasource.ts
export class UserMockDataSource {
  private users: Map<string, UserDto> = new Map();

  constructor() {
    // Initialize with test data
    this.users.set('1', {
      id: '1',
      email: 'test@example.com',
      nickname: 'Test User',
      status: 'ACTIVE',
      emailVerified: true,
    });
  }

  async getUserById(userId: string): Promise<UserDto | null> {
    return this.users.get(userId) || null;
  }

  async getUserByEmail(email: string): Promise<UserDto | null> {
    return Array.from(this.users.values()).find(u => u.email === email) || null;
  }

  async createUser(dto: CreateUserDto): Promise<UserDto> {
    const newUser: UserDto = {
      id: Math.random().toString(36).substr(2, 9),
      email: dto.email,
      nickname: dto.nickname,
      status: 'ACTIVE',
      emailVerified: false,
    };
    this.users.set(newUser.id, newUser);
    return newUser;
  }

  async updateUser(dto: UserDto): Promise<UserDto> {
    this.users.set(dto.id, dto);
    return dto;
  }

  async deleteUser(userId: string): Promise<void> {
    this.users.delete(userId);
  }
}
```

## Caching Strategy

Implement caching at the Repository level (optional):

```typescript
export class CachedUserRepositoryImpl implements UserRepository {
  private cache: Map<string, { user: User; timestamp: number }> = new Map();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  constructor(private readonly remoteDataSource: UserRemoteDataSource) {}

  async getById(userId: string): Promise<User | null> {
    // Check cache
    const cached = this.cache.get(userId);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.user;
    }

    // Fetch from remote
    const dto = await this.remoteDataSource.getUserById(userId);
    if (!dto) {
      return null;
    }

    const user = UserMapper.toDomain(dto);

    // Update cache
    this.cache.set(userId, { user, timestamp: Date.now() });

    return user;
  }

  async update(user: User): Promise<User> {
    const dto = UserMapper.toDto(user);
    const updatedDto = await this.remoteDataSource.updateUser(dto);
    const updatedUser = UserMapper.toDomain(updatedDto);

    // Invalidate cache
    this.cache.delete(user.getUserId());

    return updatedUser;
  }
}
```

## Testing Repositories

Mock HttpClient, NOT the entire DataSource:

```typescript
// ✅ CORRECT: Mock HttpClient
describe('UserRepositoryImpl', () => {
  let repository: UserRepository;
  let mockHttpClient: jest.Mocked<HttpClient>;

  beforeEach(() => {
    mockHttpClient = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
    } as jest.Mocked<HttpClient>;

    const dataSource = new UserRemoteDataSource(mockHttpClient);
    repository = new UserRepositoryImpl(dataSource);
  });

  it('should return user when found', async () => {
    const mockDto: UserDto = {
      id: '123',
      email: 'test@example.com',
      nickname: 'Test User',
      status: 'ACTIVE',
      emailVerified: true,
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
    expect(mockHttpClient.post).toHaveBeenCalledWith('/users', expect.any(Object));
  });
});
```

## Repository Location

```
✅ CORRECT:
domains/
├── user/
│   ├── domain/
│   │   └── repositories/
│   │       └── user-repository.ts        # Interface
│   └── data/
│       ├── repositories/
│       │   └── impl/
│       │       └── user-repository-impl.ts   # Implementation
│       └── datasource/
│           └── remote/
│               └── user-remote-datasource.ts
```

## Best Practices

1. **Interface in Domain**: Define Repository interface in domain layer
2. **Implementation in Data**: Implement Repository in data layer
3. **Use DataSources**: Separate data fetching into DataSource classes
4. **Map DTOs to Entities**: Use Mappers to convert between DTOs and Entities
5. **Handle Errors**: Convert infrastructure errors to domain errors
6. **No Business Logic**: Repositories only handle data access, not business logic
7. **Return Domain Types**: Always return Entities, never DTOs
8. **Testability**: Design for easy mocking (mock HttpClient, not DataSource)

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
// data/repositories/impl/user-repository-impl.ts
export class UserRepositoryImpl {
  async getById(userId: string): Promise<User | null> {
    const dto = await this.dataSource.getById(userId);
    return dto ? UserMapper.toDomain(dto) : null;
  }
}

// domain/usecases/get-user-profile.usecase.ts
export class GetUserProfileUseCaseImpl {
  async execute(userId: string): Promise<User> {
    const user = await this.repository.getById(userId);

    // CORRECT: Business logic in UseCase
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

Repositories provide:
- **Abstraction**: Hide data access details from domain
- **Testability**: Easy to mock for testing
- **Separation**: Clear boundary between domain and data layers
- **Flexibility**: Can swap implementations (remote, local, mock)

For more on how Repositories are instantiated, see [di-server-patterns.md](./di-server-patterns.md) and [di-client-patterns.md](./di-client-patterns.md).
