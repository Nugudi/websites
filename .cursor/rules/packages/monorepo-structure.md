---
description: Monorepo structure, Turbo config, DDD architecture, route groups, layer responsibilities
globs:
  - "**/*"
alwaysApply: true
---

# Monorepo Structure & Architecture

**Type**: Turbo-powered pnpm workspace with Design System-first approach and DDD architecture

## Repository Structure

```
nugudi/
├── apps/                    # Applications
│   └── web/                # Next.js 16 + React 19
│       ├── app/           # Next.js App Router
│       │   ├── (auth)/    # 🔒 Protected routes
│       │   └── (public)/  # 🌍 Public routes
│       └── src/
│           ├── domains/   # DDD Domain Layer
│           └── core/      # Core Infrastructure & UI
└── packages/              # Shared packages
    ├── ui/               # Storybook documentation
    ├── types/            # Shared TypeScript types
    ├── themes/           # Design tokens
    ├── assets/           # Icons
    └── react/            # Component & Hook packages
```

## MUST Rules

1. **MUST use Turbo** — All build tasks orchestrated through `turbo.json`
2. **MUST use pnpm workspaces** — Package manager for monorepo
3. **MUST follow route groups** — `(auth)` for protected, `(public)` for public routes
4. **MUST follow DDD structure** — Each domain has `di/`, `domain/`, `data/`, `infrastructure/`, `presentation/`
5. **MUST check packages first** — Before creating new code, check if functionality exists in `packages/`

## NEVER Rules

1. **NEVER skip packages** — Don't create custom implementations of existing package functionality
2. **NEVER mix route groups** — Protected routes only in `(auth)`, public only in `(public)`
3. **NEVER violate layer dependencies** — Presentation → Application → Domain → Data → Infrastructure

## Route Groups

### Protected Routes `(auth)`
```
app/(auth)/
├── profile/        # User profile page
├── benefits/       # Benefits listing
├── cafeterias/     # Cafeteria listing
└── my/             # My page
```

**Access**: Requires authentication
**URL Structure**: Route groups don't affect URL (`/profile` not `/(auth)/profile`)

### Public Routes `(public)`
```
app/(public)/
├── auth/
│   ├── sign-in/    # Sign in page
│   └── sign-up/    # Sign up pages
└── home/           # Public home page
```

**Access**: No authentication required

## DDD Domain Structure

### Per-Domain Folders

```
domains/[domain-name]/
├── di/                    # DI Containers (per-domain)
│   ├── [domain]-server-container.ts  # Server DI (Stateless)
│   └── [domain]-client-container.ts  # Client DI (Lazy Singleton)
├── domain/                # Domain Layer
│   ├── repositories/      # Repository Interfaces
│   ├── usecases/          # Business Logic
│   ├── entities/          # Domain Entities
│   └── interfaces/        # Domain Interfaces
├── data/                  # Data Layer
│   ├── repositories/      # Repository Implementations
│   ├── data-sources/      # Data Sources
│   ├── mappers/           # DTO → Entity Mappers
│   └── dto/               # Data Transfer Objects
├── infrastructure/        # Infrastructure Layer
│   └── services/          # External Services
└── presentation/          # Presentation Layer
    ├── ui/
    │   ├── views/         # Page-level layouts
    │   ├── sections/      # Feature sections
    │   └── components/    # Reusable components
    ├── adapters/          # Entity → UI Type (optional, 7+ methods)
    ├── hooks/
    │   └── queries/       # TanStack Query hooks
    ├── mappers/           # Simple transformations
    ├── types/             # UI-specific types
    ├── utils/             # Presentation utilities
    ├── constants/         # Query keys, constants
    ├── schemas/           # Validation schemas
    └── stores/            # State management
```

## Architecture Layers

```
┌─────────────────────────────────────┐
│      Presentation Layer             │
│   (app/, domains/*/presentation/)   │
└─────────────────────────────────────┘
              ↓ depends on
┌─────────────────────────────────────┐
│    Application Layer (UseCase)      │
│   (domains/*/domain/usecases/)      │
└─────────────────────────────────────┘
              ↓ depends on
┌─────────────────────────────────────┐
│         Domain Layer                │
│ (domains/*/domain/repositories/,    │
│           entities/)                │
└─────────────────────────────────────┘
              ↓ depends on
┌─────────────────────────────────────┐
│          Data Layer                 │
│ (domains/*/data/repositories/,      │
│       data-sources/)                │
└─────────────────────────────────────┘
              ↓ depends on
┌─────────────────────────────────────┐
│     Infrastructure Layer            │
│ (core/infrastructure/http/,         │
│       storage/, logging/)           │
└─────────────────────────────────────┘
```

## Layer Responsibilities

| Layer | Location | Responsibility | Examples |
|-------|----------|----------------|----------|
| **Presentation** | `app/`, `domains/*/presentation/` | User interface, routing, UI logic | Pages, Views, Sections, Components |
| **Application** | `domains/*/domain/usecases/` | Business logic, orchestration | LoginWithOAuthUseCase, GetMyProfileUseCase |
| **Domain** | `domains/*/domain/repositories/`, `entities/` | Data access interfaces, domain models | AuthRepository, User Entity |
| **Data** | `domains/*/data/repositories/`, `data-sources/` | Repository implementations, DTO mappings | AuthRepositoryImpl, DTO Mappers |
| **Infrastructure** | `core/infrastructure/` | External services, HTTP clients | HttpClient, SessionManager, Logger |
| **DI Container** | `domains/*/di/` | Dependency injection, lifecycle management | Server/Client Containers |
| **Core Utils** | `core/utils/` | Domain-agnostic utilities | formatPriceWithCurrency, formatDate |
| **Core UI** | `core/ui/` | Shared UI components | AppHeader, Providers, Global Styles |

## Core Folder Structure

```
core/
├── infrastructure/         # Infrastructure Layer
│   ├── http/              # HttpClient, TokenProvider
│   ├── storage/           # SessionManager
│   ├── logging/           # Logger
│   └── configs/           # TanStack Query, PWA
├── utils/                 # Pure utility functions
│   ├── currency/
│   ├── date/
│   └── validation/
├── shared/
│   └── type/              # Domain-agnostic types
└── ui/                    # UI Interface Adapters
    ├── components/
    ├── providers/
    └── styles/
```

## Technology Stack

**Framework**: Next.js 16 (App Router)
**React**: 19.x
**TypeScript**: 5.8.3 (strict mode)
**Package Manager**: pnpm with workspaces
**Build Tool**: Turborepo
**Linting/Formatting**: Biome (NOT ESLint/Prettier)
**Styling**: Vanilla Extract + CSS Modules
**State Management**: TanStack Query + Zustand
**Forms**: React Hook Form + Zod
**Testing**: Vitest + Playwright + MSW
**Documentation**: Storybook

## Package Organization

```
packages/
├── ui/                    # Storybook aggregated UI
├── types/                 # Shared TypeScript types
├── themes/                # Design tokens system
├── assets/                # Icons and static assets
└── react/
    ├── components/        # React components
    │   ├── button/
    │   ├── input/
    │   ├── layout/        # Box, Flex, VStack, HStack, Typography
    │   ├── chip/
    │   ├── tab/
    │   ├── switch/
    │   ├── textarea/
    │   ├── input-otp/
    │   ├── step-indicator/
    │   ├── menu-card/
    │   ├── bottom-sheet/
    │   └── backdrop/
    └── hooks/             # React hooks
        ├── button/
        ├── switch/
        ├── toggle/
        └── use-stepper/
```

## Development Commands

```bash
# Install dependencies
pnpm install

# Start development (all apps)
pnpm dev

# Start specific app
pnpm dev --filter=web

# Build (packages first, then apps)
pnpm build

# Format and lint
pnpm biome check --write .

# Type checking
pnpm check-types

# Run tests
pnpm test

# Commit with commitizen
pnpm commit
```

## Component Folder Structure

**MANDATORY**: Every component MUST be in its own folder:

```
component-name/
├── index.tsx        # Component implementation
├── index.css.ts     # Vanilla Extract styles
└── types.ts         # Type definitions (optional)
```

**Example**:

```
components/
└── sign-up-form/
    ├── index.tsx
    ├── index.css.ts
    └── steps/
        ├── email-form/
        │   ├── index.tsx
        │   └── index.css.ts
        └── password-form/
            ├── index.tsx
            └── index.css.ts
```

---

**Related**: See `packages/package-usage.md` for package import rules, `packages/tooling-stack.md` for development tools
