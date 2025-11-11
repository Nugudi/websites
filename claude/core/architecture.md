---
description: "High-level architecture overview, monorepo structure, Clean Architecture layers, bounded contexts, technology stack"
globs:
  - "**/*"
alwaysApply: true
---

# Architecture Overview

> **Target Audience**: New developers, AI agents needing high-level context
> **Reading Time**: 5 minutes
> **Next Steps**: Read [../ddd/entity-patterns.md](../ddd/entity-patterns.md) for DDD patterns, [../ddd/di-server-containers.md](../ddd/di-server-containers.md) for dependency injection

## 🏗️ High-Level Structure

### Monorepo Layout

```
nugudi/
├── apps/
│   └── web/                    # Next.js 16 App Router application
│       └── src/
│           ├── domains/        # 6 bounded contexts (DDD)
│           │   ├── auth/
│           │   ├── benefit/
│           │   ├── cafeteria/
│           │   ├── notification/
│           │   ├── stamp/
│           │   └── user/
│           └── core/           # Core utilities & infrastructure
│               ├── infrastructure/  # Technical capabilities
│               ├── shared/          # Shared types & utilities
│               │   ├── type/
│               │   └── util/
│               └── ui/              # Shared UI components
└── packages/                   # Design system & shared packages
    ├── react/
    │   ├── components/         # Reusable UI components
    │   └── hooks/              # Reusable React hooks
    └── themes/                 # Design tokens (colors, spacing, etc.)
```

### Technology Stack

- **Frontend**: Next.js 16 + React 19 + TypeScript
- **Styling**: Vanilla Extract (CSS-in-JS)
- **State Management**: TanStack Query + Zustand
- **Build Tool**: Turbo (monorepo)
- **Package Manager**: pnpm
- **Code Quality**: Biome

## 🏛️ Clean Architecture (4 Layers)

Each domain follows Clean Architecture with strict layer separation:

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │
│  │   Pages   │  │   Views   │  │  Sections (RSC)  │  │
│  │  (Server) │  │  (Client) │  │    (Client)      │  │
│  └──────────┘  └──────────┘  └──────────────────┘  │
│         ↓                ↓                 ↓            │
│  ┌──────────────────────────────────────────────────┐  │
│  │         Hooks (useQuery, useMutation)            │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────┬───────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                   DI CONTAINER                               │
│  Server: createXXXServerContainer() - Per-request           │
│  Client: getXXXClientContainer()    - Singleton             │
└─────────────────────────┬───────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                      DOMAIN                                  │
│  ┌──────────────┐  ┌────────────┐  ┌──────────────┐  │
│  │   UseCases   │  │  Entities   │  │  Repository   │  │
│  │  (Business)  │  │  (Models)   │  │  (Interface)  │  │
│  └──────────────┘  └────────────┘  └──────────────┘  │
└─────────────────────────┬───────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                       DATA                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │      Repository Implementation                       │  │
│  │      (API calls via HttpClient)                      │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────┬───────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                  INFRASTRUCTURE                              │
│  ┌────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ HttpClient │  │SessionManager│  │TokenProvider  │  │
│  └────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Layer Responsibilities

| Layer | Responsibility | Examples | Never Contains |
|-------|---------------|----------|----------------|
| **Presentation** | UI components, user interaction | Pages, Views, Sections, Components, Hooks | Business logic, API calls |
| **Domain** | Business logic, validation | UseCases, Entities, Repository interfaces | UI code, HTTP calls |
| **Data** | Data access, external APIs | Repository implementations | Business rules, UI |
| **Infrastructure** | Technical capabilities | HttpClient, SessionManager | Domain knowledge |

## 🎯 6 Bounded Contexts (Domains)

| Domain | Purpose | Key Features |
|--------|---------|--------------|
| **auth** | Authentication & authorization | Login, token management |
| **benefit** | Employee benefits management | Benefit listings, applications |
| **cafeteria** | Cafeteria services | Menu, reviews, meal tickets |
| **notification** | User notifications | Push notifications, alerts |
| **stamp** | Loyalty stamp system | Stamp collection, rewards |
| **user** | User profile management | Profile, settings |

## 🔧 Core Architectural Rules

### ✅ MUST

1. **MUST** use DI Containers to get UseCases
   - Server-side: `createXXXServerContainer()` (new instance per request)
   - Client-side: `getXXXClientContainer()` (lazy singleton)

2. **MUST** follow layer hierarchy (Presentation → Domain → Data → Infrastructure)
   - No layer can skip or bypass intermediate layers

3. **MUST** use TypeScript path aliases for imports
   - Format: `@{domain}/presentation/*`, `@{domain}/di`, `@core/*`

4. **MUST** keep domains isolated (no cross-domain imports except via `@core`)

5. **MUST** use Repository pattern for all data access
   - Interface in Domain layer, Implementation in Data layer

6. **MUST** use UseCase pattern for business logic
   - All business rules must be in UseCases, not in UI or Repository

### ❌ MUST NOT

1. **MUST NOT** directly instantiate Repository or UseCase
   - ❌ `new UserRepository()`
   - ✅ `container.getUserRepository()`

2. **MUST NOT** use Client Container in Server Components/Pages
   - ❌ `getXXXClientContainer()` in Server Components
   - ✅ `createXXXServerContainer()` in Server Components

3. **MUST NOT** use deprecated `@nugudi/api` package
   - Use UseCase layer instead

4. **MUST NOT** skip layers
   - ❌ Page directly calling Repository
   - ✅ Page → UseCase → Repository

5. **MUST NOT** put business logic in Presentation layer
   - Business logic belongs in Domain layer (UseCases)

6. **MUST NOT** access external APIs from Presentation layer
   - Use Repository through UseCase instead

## 📚 Learning Path

For new developers or AI agents working on this codebase:

### 1. **Start Here** (High-Level Understanding)
   - ✅ You are here: `architecture.md`
   - Understand monorepo structure and 4-layer architecture

### 2. **Core Patterns** (Deep Dive)
   - Read [../ddd/entity-patterns.md](../ddd/entity-patterns.md) → Entity design patterns
   - Read [../ddd/usecase-patterns.md](../ddd/usecase-patterns.md) → UseCase implementation
   - Read [../ddd/di-server-containers.md](../ddd/di-server-containers.md) → Server DI containers
   - Read [../ddd/di-client-containers.md](../ddd/di-client-containers.md) → Client DI containers

### 3. **Implementation Guides** (Practical)
   - Read [../frontend/component-hierarchy.md](../frontend/component-hierarchy.md) → Component hierarchy
   - Read [../patterns/adapter-basics.md](../patterns/adapter-basics.md) → Entity → UI transformation
   - Read [../patterns/query-hooks.md](../patterns/query-hooks.md) → Query hooks patterns

### 4. **Development Workflow** (Day-to-Day)
   - Read [../packages/package-usage.md](../packages/package-usage.md) → Import rules, package usage
   - Read [commit-conventions.md](./commit-conventions.md) → Commit format, PR workflow

### 5. **Specialized Topics** (As Needed)
   - Read [../patterns/storybook-guideline.md](../patterns/storybook-guideline.md) → Component documentation
   - Read [../testing/testing-principles.md](../testing/testing-principles.md) → Testing strategies

## ⚠️ Common Mistakes to Avoid

### 1. Wrong Container Usage
```typescript
// ❌ WRONG: Using Client Container in Server Component
const MyPage = async () => {
  const container = getAuthClientContainer(); // ❌ Singleton in SSR!
  // ...
};

// ✅ CORRECT: Using Server Container in Server Component
const MyPage = async () => {
  const container = createAuthServerContainer(); // ✅ New instance per request
  // ...
};
```

### 2. Direct Instantiation
```typescript
// ❌ WRONG: Direct instantiation
const repository = new UserRepository(httpClient);
const useCase = new GetUserUseCase(repository);

// ✅ CORRECT: Use DI Container
const container = getAuthClientContainer();
const useCase = container.getGetUser();
```

### 3. Skipping Layers
```typescript
// ❌ WRONG: Page directly calling Repository
const MyPage = async () => {
  const repository = container.getUserRepository();
  const user = await repository.getById(id); // ❌ Skipping UseCase layer!
};

// ✅ CORRECT: Page → UseCase → Repository
const MyPage = async () => {
  const useCase = container.getGetUser();
  const user = await useCase.execute(id); // ✅ Through UseCase
};
```

### 4. Cross-Domain Imports
```typescript
// ❌ WRONG: Direct domain-to-domain import
import { UserEntity } from '@user/domain/entities';

// ✅ CORRECT: Use @core or duplicate types
import type { UserId } from '@core/types/user';
```

## 🗺️ Document Map

See [../../CLAUDE.md](../../CLAUDE.md) for complete documentation index with all files organized by category.

## 🔑 Key Concepts Quick Reference

- **Domain**: A bounded context with its own business logic (e.g., auth, cafeteria)
- **Entity**: Domain model with business logic and validation
- **UseCase**: Business logic orchestration (single responsibility)
- **Repository**: Data access abstraction (interface in Domain, implementation in Data)
- **DI Container**: Factory for creating UseCases with dependencies
- **Adapter**: Transforms Entity to UI-friendly format (when 7+ Entity methods needed)
- **TypeScript Path Alias**: Import shortcut (e.g., `@auth/domain/entities`)

---

**Next Steps**: Continue to [../ddd/entity-patterns.md](../ddd/entity-patterns.md) for detailed Entity patterns, or see [../../CLAUDE.md](../../CLAUDE.md) for complete documentation map.
