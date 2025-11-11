---
description: Component hierarchy, route groups, domain structure overview
globs:
  - "app/**/*.tsx"
  - "app/**/*.ts"
  - "src/domains/**/presentation/**"
alwaysApply: true
---

# Component Hierarchy Rules

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

---

**Related**: See `page-layer.md`, `view-layer.md`, `section-layer.md`, `component-layer.md` for layer-specific rules
