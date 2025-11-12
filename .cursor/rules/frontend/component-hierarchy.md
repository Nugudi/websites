---
description: Component hierarchy, route groups, domain structure overview
globs:
  - "app/**/*.tsx"
  - "app/**/*.ts"
  - "src/domains/**/presentation/**"
alwaysApply: true
---

# Component Hierarchy Rules

## Table of Contents

- [Component Flow](#component-flow)
- [Route Groups](#route-groups)
- [Directory Structure](#directory-structure)
- [Page-to-Domain Mapping](#page-to-domain-mapping)
- [Domain Structure (DDD)](#domain-structure-ddd)
- [DDD Layer Responsibilities](#ddd-layer-responsibilities)
- [Folder Structure Rules](#folder-structure-rules)
- [Naming Conventions](#naming-conventions)
- [MUST Rules](#must-rules)
- [NEVER Rules](#never-rules)

## Component Flow

```
Page (Server Component) → View → Section (with Suspense/ErrorBoundary) → Component
```

## Route Groups

Next.js 16 uses route groups to organize pages by authentication requirements:

- **(auth)**: Protected pages requiring user authentication
- **(public)**: Public pages accessible without authentication

**Note**: Route groups (parentheses folders) don't affect URL structure.

## Directory Structure

```
apps/web/
├── app/
│   ├── (auth)/               # 🔒 Protected routes
│   │   ├── benefits/
│   │   ├── cafeterias/
│   │   └── my/
│   └── (public)/             # 🌍 Public routes
│       ├── auth/
│       │   ├── sign-in/
│       │   ├── sign-up/
│       │   └── password/
│       └── home/
└── src/
    └── domains/
```

## Page-to-Domain Mapping

**Protected Routes (auth)**:

```
/benefits          → domains/benefit/presentation/ui/views/benefit-page-view
/cafeterias        → domains/cafeteria/home/presentation/ui/views/cafeteria-home-view
/cafeterias/[id]   → domains/cafeteria/detail/presentation/ui/views/cafeteria-detail-view
/my                → domains/user/presentation/ui/views/my-page-view
```

**Public Routes (public)**:

```
/auth/sign-in       → domains/auth/presentation/ui/views/credentials-sign-in-view
/auth/sign-up/social → domains/auth/presentation/ui/views/social-sign-up-view
/home              → domains/cafeteria/home/presentation/ui/views/cafeteria-home-view
```

## Domain Structure (DDD)

```
domains/
├── auth/
│   ├── di/                    # DI Containers (per-domain)
│   │   ├── auth-server-container.ts
│   │   └── auth-client-container.ts
│   ├── domain/                # Domain Layer
│   │   ├── repositories/
│   │   ├── usecases/
│   │   ├── entities/
│   │   └── interfaces/
│   ├── data/                  # Data Layer
│   │   ├── repositories/
│   │   ├── data-sources/
│   │   ├── mappers/
│   │   └── dto/
│   ├── infrastructure/        # Infrastructure Layer
│   │   ├── services/
│   │   └── actions/
│   └── presentation/          # Presentation Layer
│       ├── ui/
│       │   ├── views/
│       │   ├── sections/
│       │   └── components/
│       ├── adapters/          # Entity → UI Type (7+ methods)
│       ├── hooks/
│       │   └── queries/       # TanStack Query hooks
│       ├── mappers/           # Simple transformations
│       ├── types/
│       ├── utils/
│       ├── constants/
│       ├── schemas/
│       └── stores/
```

## DDD Layer Responsibilities

| Layer | Responsibility |
|-------|----------------|
| **di/** | DI Containers - Server (stateless) & Client (lazy singleton) |
| **domain/repositories/** | Repository Interfaces (dependency inversion) |
| **domain/usecases/** | Business Logic (UseCase pattern) |
| **domain/entities/** | Domain Entities (business objects) |
| **data/repositories/** | Repository Implementations (HTTP API calls) |
| **data/data-sources/** | Data Sources (HttpClient usage) |
| **data/mappers/** | DTO → Entity transformation |
| **infrastructure/services/** | External Services (third-party) |
| **infrastructure/actions/** | Next.js Server Actions |
| **presentation/ui/** | UI Components Hierarchy |
| **presentation/adapters/** | Entity → UI Type (optional, 7+ methods) |
| **presentation/mappers/** | Simple transformations (alternative to adapters) |
| **presentation/hooks/** | React Hooks & TanStack Query |
| **presentation/types/** | UI-specific TypeScript types |
| **presentation/utils/** | Presentation-layer utilities |
| **presentation/constants/** | Presentation constants |
| **presentation/schemas/** | Validation schemas |
| **presentation/stores/** | State management stores |

## Folder Structure Rules

**MANDATORY**: Every view, section, and component must be in its own folder:

```
component-name/
├── index.tsx        # Component implementation
└── index.css.ts     # Vanilla Extract styles
```

**Example**:

```
views/
└── sign-up-view/
    ├── index.tsx
    └── index.css.ts

sections/
└── password-forgot-section/
    ├── index.tsx
    └── index.css.ts

components/
└── email-sign-in-form/
    ├── index.tsx
    └── index.css.ts
    └── steps/
        └── email-form/
            ├── index.tsx
            └── index.css.ts
```

## Naming Conventions

```typescript
// Views: [Feature]View (in feature-view folder)
export const SignUpView = () => {}; // ✅ Named export

// Sections: [Feature]Section (in feature-section folder)
export const SignUpSection = () => {}; // ✅ Named export

// Components: Descriptive name (in component-name folder)
export const SignUpForm = () => {}; // ✅ Named export

// Sub-components in steps folder
export const EmailForm = () => {}; // ✅ Named export
```

## MUST Rules

- **MUST** follow Page → View → Section → Component hierarchy
- **MUST** place each component in its own folder with `index.tsx` and `index.css.ts`
- **MUST** use kebab-case for folder names
- **MUST** use PascalCase for component names
- **MUST** use named exports (except Pages which require default export)
- **MUST** organize by route groups: `(auth)` for protected, `(public)` for public

## NEVER Rules

- **NEVER** skip hierarchy levels (e.g., Page → Component directly)
- **NEVER** place multiple components in a single file
- **NEVER** use CSS Modules (use Vanilla Extract)
- **NEVER** create components without their own folder

**Why These Rules Exist:**

**MUST Rules Explained:**

1. **Why follow Page → View → Section → Component hierarchy?**
   - **Separation of Concerns**: Each layer has clear, distinct responsibilities
   - **Maintainability**: Easy to locate code (data fetch = Section, layout = View, UI = Component)
   - **Testability**: Isolated layers are easier to test independently
   - **Scalability**: Hierarchy prevents component trees from becoming too deep
   - **Team Collaboration**: Clear conventions reduce merge conflicts

2. **Why each component in its own folder?**
   - **Co-location**: Styles (`index.css.ts`) stay next to component code (`index.tsx`)
   - **Discoverability**: Folder structure mirrors component hierarchy visually
   - **Refactoring**: Moving components = moving folders (keeps everything together)
   - **Tests**: Can add `index.test.tsx` alongside component

3. **Why kebab-case for folders, PascalCase for components?**
   - **Consistency**: Matches file system conventions (URLs, routes)
   - **Import Clarity**: `from './user-profile'` vs `export const UserProfile`
   - **Next.js Routing**: Route folders are kebab-case (`/user-profile`)
   - **Standard Practice**: Industry convention for React components

4. **Why named exports (except Pages)?**
   - **Tree-shaking**: Bundlers can remove unused exports
   - **Consistency**: Predictable import pattern across codebase
   - **Refactoring**: Easier to rename with IDE tools
   - **Exception for Pages**: Next.js requires default export for file-based routing

5. **Why route groups (auth) vs (public)?**
   - **Access Control**: Visual separation of protected vs public routes
   - **Layout Sharing**: Route groups can share layouts without affecting URL
   - **Middleware**: Easy to apply auth middleware to `(auth)` group
   - **Organization**: Clear distinction between authenticated and public features

**NEVER Rules Explained:**

1. **Why NEVER skip hierarchy levels?**
   - **Lost Abstraction**: Skipping View = No layout orchestration layer
   - **Tight Coupling**: Page directly importing Components = Harder to refactor
   - **Responsibility Blur**: Each layer enforces single responsibility principle
   - **Testing Difficulty**: Can't test layout separately from data fetching

2. **Why NEVER multiple components in one file?**
   - **Module Boundaries**: One file = One component = Clear ownership
   - **Import Specificity**: `import { UserProfile }` is more specific than `import { UserProfile, UserSettings, UserStats }`
   - **Code Splitting**: Bundlers can split files, not functions
   - **Git Conflicts**: Multiple developers editing same file = merge hell

3. **Why NEVER use CSS Modules?**
   - **Type Safety**: Vanilla Extract generates TypeScript types for styles
   - **Design Tokens**: Vanilla Extract integrates with `@nugudi/themes` design system
   - **Static Extraction**: Vanilla Extract extracts CSS at build time (zero runtime)
   - **Consistency**: Entire codebase uses Vanilla Extract, mixing CSS Modules breaks patterns

4. **Why NEVER create components without folders?**
   - **Scalability**: Flat file structure doesn't scale (100+ components in one directory)
   - **Co-location Lost**: Styles must live separately, breaking co-location principle
   - **Discoverability**: Hard to find related files (component, styles, tests)
   - **Refactoring**: Moving component = manually moving multiple files

---

**Related**: See `page-layer.md`, `view-layer.md`, `section-layer.md`, `component-layer.md` for layer-specific rules
