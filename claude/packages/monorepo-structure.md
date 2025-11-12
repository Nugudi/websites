---
description: Monorepo architecture, DDD structure, domain organization, and architectural patterns
globs:
  - '**/*'
alwaysApply: true
---

# Monorepo Structure & DDD Architecture

> **Document Type**: Monorepo Structure & DDD Architecture Guide
> **Target Audience**: All developers
> **Related Documents**:
> - [package-usage.md](./package-usage.md) — Package import conventions and usage guidelines
> - [package-setup.md](./package-setup.md) — Package setup requirements and configuration
> - [../ddd/di-server-containers.md](../ddd/di-server-containers.md) — Server-side DI Container patterns
> - [../ddd/di-client-containers.md](../ddd/di-client-containers.md) — Client-side DI Container patterns
> - [../frontend.md](../frontend.md) — Frontend architecture patterns
> **Last Updated**: 2025-11-11

## 🏗️ Monorepo Architecture Overview

This is a **Turbo-powered pnpm workspace monorepo** with a **Design System-first approach** and **DDD (Domain-Driven Design) architecture**.

### Repository Structure

```
nugudi/
├── apps/                    # Applications
│   └── web/                # Next.js 16 + React 19 (Main Web App)
│       ├── app/           # Next.js App Router
│       │   ├── (auth)/    # 🔒 Protected routes - Require authentication
│       │   │   └── profile/      # Profile page (authenticated users only)
│       │   └── (public)/  # 🌍 Public routes - No authentication required
│       │       └── auth/        # Auth-related public pages
│       │           ├── sign-in/  # Sign in with credentials page
│       │           └── sign-up/  # Sign up pages
│       └── src/
│           ├── domains/   # 🆕 DDD Domain Layer
│           │   ├── auth/
│           │   │   ├── di/             # 🆕 DI Containers (per-domain)
│           │   │   │   ├── auth-server-container.ts  # Server DI (Stateless)
│           │   │   │   └── auth-client-container.ts  # Client DI (Lazy Singleton)
│           │   │   ├── domain/         # Domain Layer
│           │   │   │   ├── repositories/  # Repository Interfaces
│           │   │   │   ├── usecases/      # Business Logic (UseCase pattern)
│           │   │   │   ├── entities/      # Domain Entities
│           │   │   │   └── interfaces/    # Domain Interfaces
│           │   │   ├── data/           # Data Layer
│           │   │   │   ├── repositories/  # Repository Implementations
│           │   │   │   ├── data-sources/  # Data Sources
│           │   │   │   ├── mappers/       # DTO → Entity Mappers
│           │   │   │   └── dto/           # Data Transfer Objects
│           │   │   ├── presentation/   # Presentation Layer (UI & Logic)
│           │   │   │   ├── ui/         # UI Components Hierarchy
│           │   │   │   │   ├── views/      # Page-level layouts
│           │   │   │   │   ├── sections/   # Feature sections with boundaries
│           │   │   │   │   └── components/ # Reusable components
│           │   │   │   ├── adapters/   # 🆕 Entity → UI Type Adapters (optional)
│           │   │   │   ├── hooks/      # React Hooks & TanStack Query
│           │   │   │   │   └── queries/   # Query custom hooks
│           │   │   │   ├── mappers/    # Simple transformations (alternative to adapters)
│           │   │   │   ├── types/      # UI-specific types
│           │   │   │   ├── utils/      # Presentation utilities
│           │   │   │   ├── constants/  # Presentation constants (query keys)
│           │   │   │   ├── schemas/    # Validation schemas
│           │   │   │   ├── stores/     # State management stores
│           │   │   │   └── actions/    # Server Actions
│           │   ├── user/
│           │   │   ├── di/
│           │   │   ├── domain/
│           │   │   ├── data/
│           │   │   └── presentation/   # (same structure as auth above)
│           │   └── [other-domains]/
│           └── core/       # Core Infrastructure & UI Components
│               ├── infrastructure/  # 🆕 Infrastructure Layer
│               │   ├── http/       # HttpClient, TokenProvider
│               │   ├── storage/    # SessionManager
│               │   ├── logging/    # Logger
│               │   └── configs/    # TanStack Query, PWA
│               ├── shared/          # Domain-Agnostic Shared Code
│               │   ├── type/       # 🆕 TypeScript Types
│               │   └── util/       # Pure utility functions
│               │       ├── currency/   # Currency formatting (formatPriceWithCurrency)
│               │       ├── date/       # Date utilities (formatDate, parseDate)
│               │       └── validation/ # Common validation helpers
│               └── ui/              # 🆕 UI Components & Providers
│                   ├── components/
│                   ├── providers/
│                   └── styles/
├── packages/               # Shared packages (ALWAYS use these!)
│   ├── ui/                # Aggregated UI library with Storybook
│   ├── types/             # 🆕 Shared TypeScript types
│   ├── themes/            # Design tokens system
│   ├── assets/            # Icons and static assets
│   └── react/             # Component packages (button, input, etc.)
│       ├── components/    # React components
│       └── hooks/         # React hooks
└── turbo.json             # Monorepo task orchestration
```

### 🔐 Route Groups: Authentication Structure

Next.js 16 route groups organize pages by authentication requirements:

- **(auth)**: Protected pages requiring user authentication
  - All pages inside this group require a logged-in user
  - Examples: `/profile`, user dashboard, etc.
- **(public)**: Public pages accessible without authentication
  - All pages inside this group are accessible to everyone
  - Examples: `/auth/login`, `/auth/sign-in/email`, `/auth/sign-up`, etc.

**Note**: Route groups (parentheses folders) don't affect the URL structure - they're purely for organization.

---

## 🏛️ DDD Architecture & Clean Architecture

This project follows **Domain-Driven Design (DDD)** principles with **Clean Architecture** layers:

### Architecture Layers

```
┌─────────────────────────────────────────────────────────────┐
│                     Presentation Layer                      │
│              (app/, domains/*/presentation/)                │
│              Pages → Views → Sections → Components          │
└─────────────────────────────────────────────────────────────┘
                            ↓ depends on
┌─────────────────────────────────────────────────────────────┐
│                   Application Layer (UseCase)               │
│                  (domains/*/domain/usecases/)               │
│             Business Logic & Orchestration                  │
└─────────────────────────────────────────────────────────────┘
                            ↓ depends on
┌─────────────────────────────────────────────────────────────┐
│                      Domain Layer                           │
│          (domains/*/domain/repositories/, entities/)        │
│              Repository Interfaces & Domain Models          │
└─────────────────────────────────────────────────────────────┘
                            ↓ depends on
┌─────────────────────────────────────────────────────────────┐
│                      Data Layer                             │
│       (domains/*/data/repositories/, data-sources/)         │
│         Repository Implementations & Data Sources           │
└─────────────────────────────────────────────────────────────┘
                            ↓ depends on
┌─────────────────────────────────────────────────────────────┐
│                  Infrastructure Layer                       │
│      (core/infrastructure/http/, storage/, logging/)      │
│         HttpClient, SessionManager, External APIs           │
└─────────────────────────────────────────────────────────────┘
```

### Key Principles

1. **Dependency Rule**: Dependencies flow inward (Presentation → Application → Domain → Infrastructure)
2. **Interface Segregation**: Each layer defines interfaces that outer layers implement
3. **Dependency Inversion**: High-level modules don't depend on low-level modules; both depend on abstractions

### Layer Responsibilities

| Layer              | Location                                            | Responsibility                                                              | Examples                                               |
| ------------------ | --------------------------------------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------ |
| **Presentation**   | `app/`, `domains/*/presentation/`                   | User interface, user interactions, routing, UI logic                        | Pages, Views, Sections, Components, Adapters, Hooks    |
| **Application**    | `domains/*/domain/usecases/`                        | Business logic, orchestration, use cases                                    | LoginWithOAuthUseCase, GetMyProfileUseCase             |
| **Domain**         | `domains/*/domain/repositories/`, `entities/`       | Data access interfaces, domain models, domain logic                         | AuthRepository, UserRepository, User Entity            |
| **Data**           | `domains/*/data/repositories/`, `data-sources/`     | Repository implementations, data sources, DTO mappings                      | AuthRepositoryImpl, AuthDataSource, DTO Mappers        |
| **Infrastructure** | `domains/*/infrastructure/`, `core/infrastructure/` | External services, frameworks, databases, HTTP clients                      | HttpClient, SessionManager, Logger, External APIs      |
| **DI Container**   | `domains/*/di/` 🆕 (per-domain)                     | Dependency injection, object creation, lifecycle management (per-domain)    | AuthServerContainer, AuthClientContainer               |
| **Core Utils**     | `core/shared/util/`, `core/shared/type/` 🆕         | Domain-agnostic utilities, pure functions, shared types (no business logic) | formatPriceWithCurrency, formatDate, PaginatedResponse |
| **Core UI**        | `core/ui/` 🆕                                       | Shared UI components, providers (connects Infrastructure to Presentation)   | AppHeader, Providers, Global Styles                    |

---

## 📦 DDD Architecture Patterns

> **Note**: For detailed guides on DDD patterns, see the following documents:
> - **[../ddd/di-server-containers.md](../ddd/di-server-containers.md)** — Server-side DI Container patterns
> - **[../ddd/di-client-containers.md](../ddd/di-client-containers.md)** — Client-side DI Container patterns
> - **[../ddd-guide.md](../ddd-guide.md)** — Complete guide to Repository & UseCase patterns

### Quick Reference: DI Container Usage

```typescript
// Server-side (Pages, Server Actions)
import { createAuthServerContainer } from '@/src/domains/auth/di/auth-server-container';
const container = createAuthServerContainer(); // ✅ Stateless, per-request
const useCase = container.getLoginWithOAuth();

// Client-side (Client Components, Hooks)
import { getAuthClientContainer } from '@/src/domains/auth/di/auth-client-container';
const container = getAuthClientContainer(); // ✅ Lazy-initialized singleton
const useCase = container.getLoginWithOAuth();
```

**Key Rules:**
- ✅ ALWAYS use DI Container to get UseCases (NEVER instantiate directly)
- ✅ ALWAYS use Server DI Container in Server Components
- ✅ ALWAYS use Client DI Container in Client Components
- ❌ NEVER mix Server DI Container with Client Components
- ❌ NEVER mix Client DI Container with Server Components

---

## 🏛️ Architecture Patterns

### Domain-Based DDD Structure

```
apps/web/
├── app/                           # Next.js App Router
│   ├── (auth)/                   # Protected routes
│   │   └── profile/             # Profile page
│   └── (public)/                 # Public routes
│       └── auth/
│           ├── sign-in/         # Sign in page
│           └── sign-up/         # Sign up page
├── src/
│   ├── domains/                  # 🆕 DDD Domain Layer
│   │   ├── auth/                # Auth domain
│   │   │   ├── di/             # 🆕 DI Containers (per-domain)
│   │   │   │   ├── auth-server-container.ts  # Server DI (Stateless)
│   │   │   │   └── auth-client-container.ts  # Client DI (Lazy Singleton)
│   │   │   ├── domain/         # Domain Layer
│   │   │   │   ├── repositories/  # Repository Interfaces
│   │   │   │   ├── usecases/      # Business Logic (UseCase pattern)
│   │   │   │   ├── entities/      # Domain Entities
│   │   │   │   └── interfaces/    # Domain Interfaces
│   │   │   ├── data/           # Data Layer
│   │   │   │   ├── repositories/  # Repository Implementations
│   │   │   │   ├── data-sources/  # Data Sources
│   │   │   │   ├── mappers/       # DTO → Entity Mappers
│   │   │   │   └── dto/           # Data Transfer Objects
│   │   │   └── presentation/   # Presentation Layer (UI)
│   │   │       ├── views/
│   │   │       ├── sections/
│   │   │       └── components/
│   │   ├── user/               # User domain
│   │   │   ├── di/
│   │   │   ├── domain/
│   │   │   ├── data/
│   │   │   └── presentation/
│   │   ├── benefit/            # Benefit domain
│   │   │   ├── di/
│   │   │   ├── domain/
│   │   │   ├── data/
│   │   │   └── presentation/
│   │   ├── cafeteria/          # Cafeteria domain
│   │   │   ├── di/
│   │   │   ├── domain/
│   │   │   ├── data/
│   │   │   └── presentation/
│   │   ├── notification/       # Notification domain
│   │   │   ├── di/
│   │   │   ├── domain/
│   │   │   ├── data/
│   │   │   └── presentation/
│   │   └── stamp/              # Stamp domain
│   │       ├── di/
│   │       ├── domain/
│   │       ├── data/
│   │       └── presentation/
│   └── core/                  # Shared Infrastructure & Adapters
│       ├── infrastructure/     # 🆕 Infrastructure Layer
│       │   ├── http/          # HttpClient, AuthenticatedHttpClient
│       │   │   ├── http-client.interface.ts
│       │   │   ├── fetch-http-client.ts
│       │   │   ├── authenticated-http-client.ts
│       │   │   ├── token-provider.interface.ts
│       │   │   ├── server-token-provider.ts
│       │   │   └── client-token-provider.ts
│       │   ├── storage/       # SessionManager
│       │   │   ├── session-manager.ts (interface)
│       │   │   ├── server-session-manager.ts
│       │   │   └── client-session-manager.ts
│       │   ├── logging/       # Logger
│       │   │   └── logger.ts
│       │   └── configs/       # TanStack Query, PWA
│       │       ├── tanstack-query/
│       │       └── pwa/
│       └── ui/ # 🆕 UI Interface Adapters
│           ├── components/    # Shared components (AppHeader, etc)
│           ├── providers/     # Providers
│           └── styles/        # Global styles
└── tests/                      # Test files
```

### Component Organization Pattern

Each domain follows this structure:

- **components/**: Smallest reusable UI pieces
- **sections/**: Composed components forming page sections
- **views/**: Complete page views

#### Component Folder Structure

Each component MUST follow this folder structure:

```
component-name/
├── index.tsx        # Component implementation
├── index.css.ts     # Vanilla Extract styles
└── types.ts         # Type definitions (optional)
```

```typescript
// Domain component structure example
// src/domains/auth/sign-up/presentation/ui/components/sign-up-form/index.tsx
interface SignUpFormProps {
  // Props interface
}

export const SignUpForm = (props: SignUpFormProps) => {
  // Component implementation
};

// src/domains/auth/sign-up/presentation/ui/components/sign-up-form/index.css.ts
import { style } from '@vanilla-extract/css';
import { vars } from '@nugudi/themes';

export const formContainer = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.box.spacing[16],
});
```

### Store Pattern with Zustand

```typescript
// domains/auth/sign-up/stores/use-sign-up-store.ts
interface SignUpStore {
  step: number;
  formData: SignUpFormData;
  setStep: (step: number) => void;
  setFormData: (data: Partial<SignUpFormData>) => void;
}

export const useSignUpStore = create<SignUpStore>((set) => ({
  // Store implementation
}));
```

---

## 🔧 Technology Stack

### Core Technologies

- **Framework**: Next.js 16 (App Router)
  - ⚠️ **Note**: `cacheComponents` is disabled due to Sentry compatibility issues
  - Will be re-enabled when Sentry fully supports Next.js 16
- **React Version**: 19.x
- **TypeScript**: 5.8.3 with strict configuration
- **Package Manager**: pnpm with workspaces
- **Build Tool**: Turborepo
- **Backend**: External API server
- **Linting/Formatting**: Biome (NOT ESLint/Prettier)
- **Styling**: Vanilla Extract + CSS Modules
- **State Management**: TanStack Query
- **Forms**: React Hook Form + Zod validation
- **Testing**: Vitest + Playwright + MSW
- **Documentation**: Storybook

---

## 🎯 Core Development Rules

### MANDATORY: Always Use Existing Packages

```typescript
// ✅ CORRECT - Use packages
import { Button } from '@nugudi/react-components-button'; // Named export
import { useToggle } from '@nugudi/react-hooks-toggle';
import { vars } from '@nugudi/themes'; // Use 'vars' not 'variables'
import { AppleIcon, HeartIcon } from '@nugudi/assets-icons'; // Import individual icons

// ❌ WRONG - Don't create new implementations
import Button from './components/button'; // NO!
```

### Package Import Priority

1. **FIRST**: Check if functionality exists in `packages/`
2. **SECOND**: Import from the appropriate package
3. **LAST RESORT**: Only create new code if absolutely necessary

---

## 📝 Commit Convention

> **Note**: For complete commit convention guide, see **[../core/commit-conventions.md](../core/commit-conventions.md)**

### Quick Reference

**Format**: `[NUGUDI-{번호}] {type}({scope}): {subject}`

**Critical Rules:**
- ❌ **NEVER add Co-Author lines** (breaks CI/CD pipeline)
- ✅ Keep subject under 72 characters
- ✅ Use defined commit types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `perf`, `ci`

**Example:**
```bash
# ✅ CORRECT
git commit -m "[NUGUDI-105] feat(react): BottomSheet 컴포넌트 구현"
```

---

## 📝 Naming Conventions

### File & Folder Naming

#### Folder Structure Rules

```
✅ CORRECT Component Structure:
button/                  # Component folder (kebab-case)
├── index.tsx           # Main component file
├── index.css.ts        # Vanilla Extract styles
└── types.ts            # Type definitions (optional)

sign-up-form/           # Multi-word component folder
├── index.tsx
├── index.css.ts
└── steps/              # Sub-components folder
    ├── email-form/
    │   ├── index.tsx
    │   └── index.css.ts
    └── password-form/
        ├── index.tsx
        └── index.css.ts
```

#### File Naming Rules

```
✅ CORRECT:
- kebab-case/            # All folders use kebab-case
- index.tsx              # Main component/export files
- index.css.ts           # Vanilla Extract style files
- use-auth.ts            # Hook files (kebab-case)
- types.ts               # Type definition files

❌ WRONG:
- MyComponent.tsx        # NO PascalCase files
- myComponent.tsx        # NO camelCase files
- my_component.tsx       # NO snake_case
- Button.tsx             # NO component name as filename (use index.tsx)
- styles.css.ts          # NO other names for styles (use index.css.ts)
```

### Code Naming

```typescript
// Components: PascalCase
export const MyComponent: React.FC = () => {};

// Props: ComponentName + Props
interface MyComponentProps {}

// Hooks: camelCase with 'use' prefix
export const useMyCustomHook = () => {};

// Event handlers: on + Action + Target
const onClickSubmit = () => {};
const onChangeInput = () => {};

// Stores: use + Feature + Store
export const useSignUpStore = () => {};
```

---

## 🏷️ Naming Conventions - Real World Examples

### Domain Entity Naming Consistency

When working with domain entities, maintain consistent naming throughout the codebase:

#### Example: Cafeteria Domain

```typescript
// ✅ CORRECT - Consistent "cafeteria" naming
interface CafeteriaRecommendCardProps {
  cafeteriaId: string;
  cafeteriaName: string;
  cafeteriaAddress: string;
  cafeteriaTime: string;
}

export interface Cafeteria {
  id: string;
  name: string;
  // ...
}

const MOCK_CAFETERIA_LIST: Cafeteria[] = [];

// Link routing
<Link href={`/cafeterias/${cafeteriaId}`}>

// ❌ WRONG - Mixed naming (restaurant/cafeteria)
interface CafeteriaRecommendCardProps {
  restaurantId: string;  // NO! Use cafeteriaId
  restaurantName: string;  // NO! Use cafeteriaName
}
```

#### Example: Benefit Domain

```typescript
// ✅ CORRECT - Consistent "benefit" naming
export const BenefitPageView = () => {};
export const BenefitHighlightSection = () => {};
export const BenefitCard = () => {};

// Routes should match
// app/(auth)/benefits/page.tsx
```

### Import/Export Consistency

```typescript
// ✅ CORRECT - Named exports for ALL components/sections/views
// domains/cafeteria/presentation/ui/components/cafeteria-menu-list/index.tsx
export const CafeteriaMenuList = () => {};

// domains/cafeteria/presentation/ui/sections/cafeteria-recommend-section/index.tsx
export const CafeteriaRecommendSection = () => {};

// domains/cafeteria/presentation/ui/views/cafeteria-home-view/index.tsx
export const CafeteriaHomeView = () => {};

// ✅ CORRECT - Default export ONLY for page.tsx files
// app/page.tsx
import { CafeteriaHomeView } from '@/src/domains/cafeteria/presentation/ui/views/cafeteria-home-view';
const HomePage = () => {
  return <CafeteriaHomeView />;
};
export default HomePage;

// ✅ CORRECT - Named exports for hooks and utilities
export const useCafeteriaList = () => {};
export type CafeteriaData = {};
```

---

## 🚀 Development Workflow

### Starting Development

```bash
# Install dependencies
pnpm install

# Start development (all apps)
pnpm dev

# Start specific app
pnpm dev --filter=web

# Build packages first, then apps
pnpm build
```

### Adding New Features

1. **Check packages first**: Can you use existing components/hooks?
2. **Follow domain structure**: Place code in appropriate domain
3. **Use TypeScript strictly**: No any types
4. **Apply Biome**: Format and lint before committing
5. **Write tests**: Unit tests for logic, integration tests for features

### Testing Strategy

```bash
# Unit tests
pnpm test

# Type checking
pnpm check-types

# Linting
pnpm biome check --write .

# Component testing in Storybook
pnpm storybook --filter=ui
```

---

## 🔍 Quick Reference

### Project Structure

- **Apps**: `web` (Next.js 16)
- **Architecture**: Domain-based DDD
- **Styling**: Vanilla Extract + CSS Modules
- **State**: TanStack Query + Zustand
- **Backend**: External API
- **Linting**: Biome (NOT ESLint/Prettier)

### Common Commands

```bash
pnpm dev                     # Start development
pnpm build                   # Build all
pnpm biome check --write .   # Format & lint
pnpm test                    # Run tests
pnpm check-types            # Type checking
pnpm commit                 # Commit with commitizen
```

---

## ⚠️ Critical Rules

### DO's ✅

- **ALWAYS** use packages from `packages/` folder
- **ALWAYS** use Biome for formatting/linting
- **ALWAYS** use kebab-case for folders, index.tsx for main files
- **ALWAYS** use TanStack Query for data fetching
- **ALWAYS** use existing components from packages
- **ALWAYS** follow domain-based architecture
- **ALWAYS** write tests for new features
- **ALWAYS** use TypeScript strict mode

### DON'Ts ❌

- **NEVER** use ESLint or Prettier (use Biome)
- **NEVER** bypass DI Containers (직접 UseCase/Repository 인스턴스 생성하지 말것)
- **NEVER** use HttpClient directly (always use through DI Container)
- **NEVER** create components that exist in packages
- **NEVER** use PascalCase for file/folder names (except index.tsx)
- **NEVER** use inline styles (use Vanilla Extract)
- **NEVER** add Co-Author lines in commits
- **NEVER** use any type in TypeScript
- **NEVER** skip tests for new features
- **NEVER** mix server and client containers (서버는 서버 컨테이너, 클라이언트는 클라이언트 컨테이너)
- **NEVER** create new instances of Client DI Container (항상 singleton 사용)
