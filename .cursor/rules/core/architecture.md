---
description: System architecture rules - Clean Architecture, DDD, bounded contexts
globs:
  - "**/*"
alwaysApply: true
---

# Architecture Rules

## Monorepo Structure

```
nugudi/
├── apps/web/src/
│   ├── domains/           # 6 bounded contexts (auth, benefit, cafeteria, notification, stamp, user)
│   └── shared/core/       # Cross-domain utilities & infrastructure
└── packages/              # Design system (react/components, react/hooks, themes)
```

**Technology Stack**: Next.js 16 + React 19 + TypeScript + Vanilla Extract + TanStack Query + Turbo + pnpm

## Clean Architecture (4 Layers)

```
PRESENTATION (Pages, Views, Sections, Hooks)
     ↓
DI CONTAINER (Server: createXXX | Client: getXXX)
     ↓
DOMAIN (UseCases, Entities, Repository Interfaces)
     ↓
DATA (Repository Implementations)
     ↓
INFRASTRUCTURE (HttpClient, SessionManager, TokenProvider)
```

### Layer Responsibilities

| Layer | Contains | Never Contains |
|-------|----------|----------------|
| **Presentation** | UI components, hooks | Business logic, API calls |
| **Domain** | UseCases, Entities | UI code, HTTP calls |
| **Data** | Repository implementations | Business rules, UI |
| **Infrastructure** | Technical capabilities | Domain knowledge |

## 6 Bounded Contexts

- **auth**: Authentication & authorization
- **benefit**: Employee benefits management
- **cafeteria**: Cafeteria services
- **notification**: User notifications
- **stamp**: Loyalty stamp system
- **user**: User profile management

## MUST Rules

- **MUST** use DI Containers to get UseCases
  - Server: `createXXXServerContainer()` (new instance per request)
  - Client: `getXXXClientContainer()` (lazy singleton)

- **MUST** follow layer hierarchy (Presentation → Domain → Data → Infrastructure)

- **MUST** use TypeScript path aliases: `@{domain}/presentation/*`, `@{domain}/di`, `@core/*`

- **MUST** keep domains isolated (no cross-domain imports except via `@core`)

- **MUST** use Repository pattern for data access (interface in Domain, implementation in Data)

- **MUST** use UseCase pattern for business logic

## NEVER Rules

- **NEVER** directly instantiate Repository or UseCase
  - ❌ `new UserRepository()`
  - ✅ `container.getUserRepository()`

- **NEVER** use Client Container in Server Components/Pages
  - ❌ `getXXXClientContainer()` in Server Components
  - ✅ `createXXXServerContainer()` in Server Components

- **NEVER** use deprecated `@nugudi/api` package (use UseCase layer)

- **NEVER** skip layers
  - ❌ Page → Repository
  - ✅ Page → UseCase → Repository

- **NEVER** put business logic in Presentation layer

- **NEVER** access external APIs from Presentation layer

## Quick Examples

### ✅ CORRECT Container Usage

```typescript
// Server Component
const MyPage = async () => {
  const container = createAuthServerContainer(); // ✅ New instance
  const useCase = container.getGetUser();
  const user = await useCase.execute(id);
};

// Client Component
const useUserData = () => {
  const container = getAuthClientContainer(); // ✅ Singleton
  const useCase = container.getGetUser();
};
```

### ❌ WRONG Patterns

```typescript
// ❌ Direct instantiation
const repository = new UserRepository(httpClient);

// ❌ Client Container in Server Component
const MyPage = async () => {
  const container = getAuthClientContainer(); // ❌ Singleton in SSR!
};

// ❌ Skipping UseCase layer
const MyPage = async () => {
  const repository = container.getUserRepository();
  const user = await repository.getById(id); // ❌ No business logic!
};

// ❌ Cross-domain import
import { UserEntity } from '@user/domain/entities'; // ❌
import type { UserId } from '@core/types/user'; // ✅
```

## Key Concepts

- **Domain**: Bounded context with business logic
- **Entity**: Domain model with validation
- **UseCase**: Business logic orchestration
- **Repository**: Data access abstraction (interface in Domain, implementation in Data)
- **DI Container**: Factory for UseCases
- **Adapter**: Entity → UI transformation (when 7+ Entity methods needed)

---

**Related**: See `ddd/` for DDD patterns, `packages/` for monorepo structure
