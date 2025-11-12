---
description: "Domain-Driven Design (DDD) overview, 6 bounded contexts, Entity/UseCase/Repository patterns, Clean Architecture layers"
globs:
  - "src/domains/**/domain/**/*"
  - "src/domains/**/data/**/*"
  - "src/domains/**/di/**/*"
alwaysApply: true
---

# Domain-Driven Design (DDD) Guide

> **Document Type**: DDD Architecture Index & Navigation
> **Target Audience**: Backend developers and AI agents
> **Purpose**: Central entry point for understanding DDD patterns in Nugudi
> **Last Updated**: 2025-01-12

## 📖 What This Document Covers

This is the **central index** for understanding Domain-Driven Design (DDD) architecture in Nugudi. Read this first to understand:

- 🏛️ **6 Bounded Contexts**: auth, user, cafeteria, benefit, notification, stamp
- 🎯 **3 Core Patterns**: Entity, UseCase, Repository
- 🏗️ **Clean Architecture**: Domain → Data → Infrastructure layers
- 🔧 **DI Containers**: Server vs Client dependency injection

---

## 🚀 Quick Start (Read These in Order)

### 1. Entity Patterns (Domain Models) 📦

**📄 [ddd/entity-patterns.md](./ddd/entity-patterns.md)**

**Domain Entities** with business logic and validation.

**What You'll Learn**:
- Boolean-based business logic (NO UI formatting)
- Entity encapsulation and validation
- Entity method design patterns
- When to use Entities vs simple objects

**When to Read**:
- ✅ Creating domain models
- ✅ Implementing business rules
- ✅ Designing domain logic

**Key Pattern**:
```typescript
export class UserEntity implements User {
  constructor(
    private readonly userId: string,
    private readonly email: string,
    private readonly status: 'ACTIVE' | 'INACTIVE'
  ) {
    this.validate();
  }

  // ✅ CORRECT - Boolean-based business logic
  isActive(): boolean {
    return this.status === 'ACTIVE';
  }

  canAccessPremiumFeatures(): boolean {
    return this.isActive() && this.isPremiumUser();
  }

  // ❌ WRONG - UI formatting in Entity
  getStatusLabel(): string {
    return this.isActive() ? '활성' : '비활성'; // NO! Use Adapter
  }
}
```

---

### 2. UseCase Patterns (Business Logic) 🎯

**📄 [ddd/usecase-patterns.md](./ddd/usecase-patterns.md)**

**UseCases** orchestrate business logic with single responsibility.

**What You'll Learn**:
- UseCase naming conventions
- Single Responsibility Principle
- UseCase dependencies (Repository, SessionManager)
- Error handling in UseCases
- UseCase testing patterns

**When to Read**:
- ✅ Creating new business operations
- ✅ Orchestrating domain logic
- ✅ Implementing authentication checks
- ✅ Handling business errors

**Key Pattern**:
```typescript
export class GetUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly sessionManager: SessionManager
  ) {}

  async execute(userId: string): Promise<UserEntity> {
    // 1. Authentication check
    const token = await this.sessionManager.getAccessToken();
    if (!token) {
      throw new AuthError('Not authenticated', 'NOT_AUTHENTICATED');
    }

    // 2. Business logic
    const user = await this.userRepository.getById(userId);
    if (!user) {
      throw new UserError('User not found', 'USER_NOT_FOUND');
    }

    // 3. Authorization check
    if (!user.isActive()) {
      throw new UserError('User is inactive', 'USER_INACTIVE');
    }

    return user;
  }
}
```

---

### 3. Repository Patterns (Data Access) 🗄️

**📄 [ddd/repository-patterns.md](./ddd/repository-patterns.md)**

**Repositories** abstract data access layer.

**What You'll Learn**:
- Repository interface in Domain layer
- Repository implementation in Data layer
- DTO → Entity transformation
- HttpClient usage patterns
- Repository testing with mocks

**When to Read**:
- ✅ Creating data access layer
- ✅ Implementing API calls
- ✅ Transforming DTO to Entity

**Key Pattern**:
```typescript
// Domain Layer - Interface
export interface UserRepository {
  getById(userId: string): Promise<UserEntity>;
  save(user: UserEntity): Promise<void>;
}

// Data Layer - Implementation
export class UserRepositoryImpl implements UserRepository {
  constructor(private readonly httpClient: HttpClient) {}

  async getById(userId: string): Promise<UserEntity> {
    const response = await this.httpClient.get<UserDTO>(`/users/${userId}`);
    return UserMapper.toDomain(response.data); // DTO → Entity
  }

  async save(user: UserEntity): Promise<void> {
    const dto = UserMapper.toDTO(user); // Entity → DTO
    await this.httpClient.put(`/users/${user.getUserId()}`, dto);
  }
}
```

---

### 4. DTO Mapper Patterns (Data Transformation) 🔄

**📄 [ddd/dto-mapper.md](./ddd/dto-mapper.md)**

**DTO Mappers** transform between DTO and Entity.

**What You'll Learn**:
- DTO → Entity transformation (API response to domain model)
- Entity → DTO transformation (domain model to API request)
- Mapper naming conventions
- Validation during transformation

**When to Read**:
- ✅ Implementing Repository data transformations
- ✅ Converting API responses to Entities
- ✅ Preparing Entities for API requests

**Key Pattern**:
```typescript
export class UserMapper {
  // DTO → Entity (from API response)
  static toDomain(dto: UserDTO): UserEntity {
    return new UserEntity(
      dto.id,
      dto.email,
      dto.nickname,
      dto.status,
      dto.email_verified
    );
  }

  // Entity → DTO (for API request)
  static toDTO(entity: UserEntity): UserDTO {
    return {
      id: entity.getUserId(),
      email: entity.getEmail(),
      nickname: entity.getNickname(),
      status: entity.isActive() ? 'ACTIVE' : 'INACTIVE',
      email_verified: entity.isEmailVerified(),
    };
  }
}
```

---

### 5. Domain Errors (Error Handling) ⚠️

**📄 [ddd/domain-errors.md](./ddd/domain-errors.md)**

**Domain Errors** for typed error handling.

**What You'll Learn**:
- Custom error classes for domain
- Error codes and error messages
- Error propagation through layers
- Error handling best practices

**When to Read**:
- ✅ Creating domain-specific errors
- ✅ Implementing error handling
- ✅ Propagating errors to UI

**Key Pattern**:
```typescript
export class UserError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number = 400
  ) {
    super(message);
    this.name = 'UserError';
  }
}

// Usage in UseCase
if (!user.isActive()) {
  throw new UserError('User is inactive', 'USER_INACTIVE', 403);
}
```

---

### 6. Infrastructure Layer (Technical Capabilities) 🔧

**📄 [ddd/infrastructure-layer.md](./ddd/infrastructure-layer.md)**

**Infrastructure** provides technical capabilities (HTTP, storage, auth).

**What You'll Learn**:
- HttpClient interface and implementations
- SessionManager (Server vs Client)
- TokenProvider patterns
- Infrastructure dependency injection

**When to Read**:
- ✅ Understanding HTTP client usage
- ✅ Implementing authentication infrastructure
- ✅ Working with session management

**Key Components**:
- `HttpClient` - HTTP request abstraction
- `FetchHttpClient` - Browser fetch implementation
- `AuthenticatedHttpClient` - HTTP client with auth headers
- `ServerSessionManager` - Server-side session storage
- `ClientSessionManager` - Client-side session storage
- `TokenProvider` - Token retrieval interface

---

### 7. DI Container Patterns (Dependency Injection) 🏭

**📄 [di-containers.md](./di-containers.md)**

**DI Containers** manage dependencies and UseCase instantiation.

**What You'll Learn**:
- Server DI Container (factory pattern)
- Client DI Container (lazy singleton)
- When to use each container type
- DI Container method naming patterns

**When to Read**:
- ✅ Creating new domains
- ✅ Setting up DI for UseCases
- ✅ Understanding Server vs Client containers

**Read the full guide**: [di-containers.md](./di-containers.md)

---

### 8. Testing DDD Layers (Test Patterns) 🧪

**📄 [ddd/testing-ddd.md](./ddd/testing-ddd.md)**

**Testing patterns** for Entity, UseCase, Repository.

**What You'll Learn**:
- Entity testing (domain logic)
- UseCase testing (mock dependencies)
- Repository testing (mock HttpClient)
- Integration testing patterns

**When to Read**:
- ✅ Writing tests for domain layer
- ✅ Testing business logic
- ✅ Testing data access layer

**Key Testing Approaches**:
- Entity tests: Pure function testing
- UseCase tests: Mock Repository + SessionManager
- Repository tests: Mock HttpClient
- Integration tests: Real dependencies

---

## 📋 6 Bounded Contexts (Domains)

| Domain | Purpose | Key Entities | Key UseCases |
|--------|---------|-------------|--------------|
| **auth** | Authentication & authorization | User, Session | SignIn, SignUp, SignOut, RefreshToken |
| **user** | User profile management | User, Profile | GetUser, UpdateUser, GetProfile |
| **cafeteria** | Cafeteria services | Menu, Review, MealTicket | GetMenu, CreateReview, UseMealTicket |
| **benefit** | Employee benefits | Benefit, Application | ListBenefits, ApplyBenefit |
| **notification** | User notifications | Notification | GetNotifications, MarkAsRead |
| **stamp** | Loyalty stamp system | Stamp, Reward | CollectStamp, RedeemReward |

Each domain is a **bounded context** with:
- **Domain Layer**: Entities, UseCases, Repository interfaces
- **Data Layer**: Repository implementations, DTOs, Mappers
- **Presentation Layer**: UI components, Adapters, Hooks
- **DI Layer**: Server DI Container, Client DI Container

---

## 🏗️ Clean Architecture Layers

```
┌─────────────────────────────────────────────────────────┐
│                   PRESENTATION                          │
│  UI Components, Adapters, Hooks, TanStack Query        │
└─────────────────────┬───────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│                  DI CONTAINER                           │
│  createXXXServerContainer() / getXXXClientContainer()  │
└─────────────────────┬───────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│                      DOMAIN                             │
│  Entities (models) + UseCases (logic) + Interfaces     │
└─────────────────────┬───────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│                       DATA                              │
│  Repository Implementations + DTOs + Mappers           │
└─────────────────────┬───────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│                  INFRASTRUCTURE                         │
│  HttpClient + SessionManager + TokenProvider           │
└─────────────────────────────────────────────────────────┘
```

**Layer Dependencies** (Dependency Rule):
- Presentation → Domain (through DI Container)
- Domain → Interfaces only (NO direct Data/Infrastructure dependency)
- Data → Domain interfaces + Infrastructure
- Infrastructure → NO domain knowledge

---

## 🎯 Common Workflows

### "I need to create a new domain feature"

**Step 1**: Define Entity (Domain Layer)
- Create in `src/domains/{domain}/domain/entities/`
- Add business logic methods (boolean-based)
- Read: [ddd/entity-patterns.md](./ddd/entity-patterns.md)

**Step 2**: Define UseCase (Domain Layer)
- Create in `src/domains/{domain}/domain/usecases/`
- Orchestrate business logic
- Read: [ddd/usecase-patterns.md](./ddd/usecase-patterns.md)

**Step 3**: Define Repository Interface (Domain Layer)
- Create in `src/domains/{domain}/domain/repositories/`
- Define data access methods
- Read: [ddd/repository-patterns.md](./ddd/repository-patterns.md)

**Step 4**: Implement Repository (Data Layer)
- Create in `src/domains/{domain}/data/repositories/`
- Use HttpClient for API calls
- Create DTO Mapper for transformations
- Read: [ddd/dto-mapper.md](./ddd/dto-mapper.md)

**Step 5**: Register in DI Container
- Add to `src/domains/{domain}/di/` containers
- Server DI Container for SSR
- Client DI Container for browser
- Read: [di-containers.md](./di-containers.md)

---

### "I need to understand the data flow"

**Request Flow**:
```
1. UI Component (Presentation)
   ↓
2. TanStack Query Hook (Presentation)
   ↓
3. Client DI Container (DI)
   ↓
4. UseCase.execute() (Domain)
   ↓
5. Repository.method() (Domain Interface → Data Implementation)
   ↓
6. HttpClient.request() (Infrastructure)
   ↓
7. DTO → Entity Mapper (Data)
   ↓
8. Entity returned to UseCase (Domain)
   ↓
9. Entity → Adapter → UI Type (Presentation)
   ↓
10. Rendered in UI (Presentation)
```

**Read More**:
- Data flow: [../frontend/section-patterns.md](./frontend/section-patterns.md)
- DI Container: [di-containers.md](./di-containers.md)

---

## 🚨 Critical Rules (MUST READ)

### Entity Rules

```typescript
// ✅ CORRECT - Boolean business logic
isActive(): boolean { return this.status === 'ACTIVE'; }
canEdit(): boolean { return this.isActive() && this.isOwner(); }

// ❌ WRONG - UI formatting in Entity
getStatusLabel(): string { return this.isActive() ? '활성' : '비활성'; } // NO!
```

### UseCase Rules

```typescript
// ✅ CORRECT - Single responsibility
class GetUserUseCase { ... }
class UpdateUserUseCase { ... }

// ❌ WRONG - Multiple responsibilities
class UserUseCase {
  getUser() { ... }
  updateUser() { ... }
  deleteUser() { ... }
}
```

### Repository Rules

```typescript
// ✅ CORRECT - Interface in Domain, Implementation in Data
// domain/repositories/user.repository.ts
export interface UserRepository { ... }

// data/repositories/user.repository.impl.ts
export class UserRepositoryImpl implements UserRepository { ... }

// ❌ WRONG - Implementation in Domain layer
// domain/repositories/user.repository.ts
export class UserRepository { ... } // NO! Must be in Data layer
```

---

## 🔗 Related Documentation

### Architecture
- [../core/architecture.md](./core/architecture.md) — High-level architecture overview

### Frontend Integration
- [../frontend/page-patterns.md](./frontend/page-patterns.md) — Server DI Container usage
- [../frontend/section-patterns.md](./frontend/section-patterns.md) — Client DI Container usage
- [../patterns/adapter-basics.md](./patterns/adapter-basics.md) — Entity → UI transformation

### Testing
- [../testing/unit-testing.md](./testing/unit-testing.md) — Testing DDD layers

---

## 🎓 Learning Path

For new developers or AI agents:

1. **Start**: Read [ddd/entity-patterns.md](./ddd/entity-patterns.md) (15 min)
2. **Next**: Read [ddd/usecase-patterns.md](./ddd/usecase-patterns.md) (15 min)
3. **Then**: Read [ddd/repository-patterns.md](./ddd/repository-patterns.md) (15 min)
4. **Context**: Read [ddd/dto-mapper.md](./ddd/dto-mapper.md) (10 min)
5. **Context**: Read [di-containers.md](./di-containers.md) (15 min)
6. **Advanced**: Read [ddd/domain-errors.md](./ddd/domain-errors.md) (10 min)
7. **Advanced**: Read [ddd/infrastructure-layer.md](./ddd/infrastructure-layer.md) (10 min)

**Total Time**: ~90 minutes to master DDD patterns.

---

## 📞 Need Help?

- **Creating domain models?** → Read [ddd/entity-patterns.md](./ddd/entity-patterns.md)
- **Implementing business logic?** → Read [ddd/usecase-patterns.md](./ddd/usecase-patterns.md)
- **Creating data access?** → Read [ddd/repository-patterns.md](./ddd/repository-patterns.md)
- **Transforming data?** → Read [ddd/dto-mapper.md](./ddd/dto-mapper.md)
- **Handling errors?** → Read [ddd/domain-errors.md](./ddd/domain-errors.md)
- **Using DI Containers?** → Read [di-containers.md](./di-containers.md)

---

**Remember**: This is an **index document**. For detailed DDD patterns and implementation details, follow the links to specific documents listed above.
