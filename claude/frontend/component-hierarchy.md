---
description: Component hierarchy patterns - Page→View→Section→Component layer responsibilities, import patterns, and architectural rules
globs:
  - "**/presentation/ui/**/*.tsx"
  - "**/presentation/ui/**/*.ts"
alwaysApply: true
---

# Component Hierarchy Architecture

> **Document Type**: Frontend Component Architecture - Layer Hierarchy
> **Target Audience**: Frontend developers working on component structure
> **Related Documents**: [page-patterns.md](./page-patterns.md), [view-patterns.md](./view-patterns.md), [section-patterns.md](./section-patterns.md), [component-patterns.md](./component-patterns.md)
> **Last Updated**: 2025-11-11

## Component Hierarchy Overview

```
Page (Server Component) → View → Section (with Suspense/ErrorBoundary) → Component
```

This hierarchy ensures:
- **Predictable** component behavior
- **Maintainable** codebase
- **Testable** components
- **Optimal** performance with SSR/streaming
- **Clear** separation of concerns

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│ PAGE (Server Component)                                         │
│ - Route entry point                                             │
│ - Server Container (createXXXServerContainer)                   │
│ - Data prefetching with UseCases                                │
│ - HydrationBoundary setup                                       │
│ - Metadata generation                                           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ VIEW (Client or Server Component)                               │
│ - Page layout composition                                       │
│ - Section orchestration                                         │
│ - Page-level UI state (tabs, active sections)                   │
│ - NO data fetching                                              │
│ - NO business logic                                             │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ SECTION (Client Component)                                      │
│ - Feature-specific logic encapsulation                          │
│ - Client Container (getXXXClientContainer)                      │
│ - Data fetching with TanStack Query                             │
│ - ErrorBoundary + Suspense boundaries                           │
│ - Feature-specific state management                             │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ COMPONENT (Pure/Presentational)                                 │
│ - Reusable UI components                                        │
│ - Props-only data                                               │
│ - Callback props for events                                     │
│ - UI-only state (isOpen, isHovered)                             │
│ - NO data fetching                                              │
│ - NO business logic                                             │
└─────────────────────────────────────────────────────────────────┘
```

## Layer Responsibilities Table

| Layer     | Type           | Container                    | Data Fetching | State Management             | Error Handling   | Export Pattern      |
| --------- | -------------- | ---------------------------- | ------------- | ---------------------------- | ---------------- | ------------------- |
| **Page**  | Server         | `createXXXServerContainer()` | Prefetch only | URL (params, searchParams)   | N/A              | `export default`    |
| **View**  | Client/Server  | None                         | NO            | Page-level UI (tabs, active) | NO               | `export const`      |
| **Section** | Client       | `getXXXClientContainer()`    | YES (TanStack Query) | Feature-specific        | YES (ErrorBoundary + Suspense) | `export const` |
| **Component** | Client/Server | None                      | NO            | UI-only (isOpen, isHovered)  | NO               | `export const`      |

## When to Use Each Layer

### Use Page When:
- Creating a new route in Next.js App Router
- Setting up SSR data prefetching for initial page load
- Defining metadata (title, description, OpenGraph)
- Configuring route-specific settings

**See**: [page-patterns.md](./page-patterns.md) for complete Page implementation guide

### Use View When:
- Composing multiple Sections into a page layout
- Defining the overall page structure (header, content, footer)
- Managing page-level UI state (active tab, selected filter)
- Orchestrating Section relationships

**See**: [view-patterns.md](./view-patterns.md) for complete View implementation guide

### Use Section When:
- Implementing a feature with its own data fetching needs
- Creating a logical unit with loading/error states
- Building a self-contained feature module
- Handling feature-specific state management

**See**: [section-patterns.md](./section-patterns.md) for complete Section implementation guide

### Use Component When:
- Building reusable UI elements (buttons, cards, forms)
- Creating presentational components
- Implementing pure rendering logic
- Making components that work in any context

**See**: [component-patterns.md](./component-patterns.md) for complete Component implementation guide

## Import Patterns

### Rule 1: Same Domain - MUST Use Relative Imports

Components within the same domain MUST use relative imports:

```typescript
// ✅ CORRECT - Use relative imports within same domain
// In: apps/web/src/domains/auth/presentation/ui/views/sign-up-view/index.tsx
import { SignUpSection } from '../../sections/sign-up-section';

// In: apps/web/src/domains/auth/presentation/ui/sections/sign-up-section/index.tsx
import { SignUpForm } from '../../components/sign-up-form';
import { useSignUpStore } from '../../../stores/use-sign-up-store';
import type { SignUpFormData } from '../../../types/sign-up';

// In: apps/web/src/domains/auth/presentation/ui/components/sign-up-form/index.tsx
import { EmailForm } from './steps/email-form';
import { PasswordForm } from './steps/password-form';

// ❌ WRONG - Don't use absolute imports within same domain
import { SignUpSection } from '@/src/domains/auth/presentation/ui/sections/sign-up-section'; // NO!
```

### Rule 2: Page to View - MUST Use Absolute Imports

Pages MUST use absolute imports when importing Views:

```typescript
// ✅ CORRECT - Pages use absolute imports for views
// Public route example
// In: app/(public)/auth/sign-up/page.tsx
import { SignUpView } from '@/src/domains/auth/presentation/ui/views/sign-up-view';

// Protected route example
// In: app/(auth)/profile/page.tsx
import { ProfilePageView } from '@/src/domains/user/presentation/ui/views/profile-page-view';

// Home page example
// In: app/page.tsx
import { CafeteriaHomeView } from '@/src/domains/cafeteria/presentation/ui/views/cafeteria-home-view';
```

### Rule 3: Cross-Domain - MUST Use Absolute Imports

Cross-domain imports MUST use absolute paths:

```typescript
// ✅ CORRECT - Use absolute imports for cross-domain
// In: apps/web/src/domains/cafeteria/...
import { useAuth } from '@/src/domains/auth/presentation/hooks/use-auth';
import { LoginWelcome } from '@/src/domains/auth/presentation/ui/components/login-welcome';

// In: apps/web/src/core/ui/components/...
import { ProfileSection } from '@/src/domains/user/presentation/ui/sections/profile-section';

// ❌ WRONG - Don't use relative imports for cross-domain
import { useAuth } from '../../../auth/presentation/hooks/use-auth'; // NO!
```

### Rule 4: Shared Components - Use @core Alias

Shared components in `src/core` use `@core` alias:

```typescript
// ✅ CORRECT - Shared components and utilities
import { AppHeader } from '@core/ui/components/app-header';
import { formatPriceWithCurrency } from '@core/utils/currency';

// ❌ WRONG
import { AppHeader } from '@/src/core/ui/components/app-header';
```

> **Note**: The `@core/utils` alias resolves to `src/core/shared/util/`, not direct `src/core/utils/`. Similarly, `@core/types` resolves to `src/core/shared/type/`. This is because utilities and types are nested inside the `shared/` subdirectory within `core/`.

### Rule 5: Monorepo Packages - Use Package Imports

Monorepo packages use named imports from package namespace:

```typescript
// ✅ CORRECT - Package imports with named exports
import { Button } from '@nugudi/react-components-button';
import { Box, Flex } from '@nugudi/react-components-layout';
import { vars, classes } from '@nugudi/themes';
import { AppleIcon, HeartIcon } from '@nugudi/assets-icons';

// ❌ WRONG - Default imports
import Button from '@nugudi/react-components-button'; // NO!
```

## Folder Structure Rules

### Each Component Must Have Its Own Folder

**MANDATORY**: Every view, section, and component must be in its own folder:

```
component-name/
├── index.tsx        # Component implementation
└── index.css.ts     # Vanilla Extract styles (NOT CSS Modules)
```

**Example Structure:**

```
views/
└── sign-up-view/            # Folder name in kebab-case
    ├── index.tsx            # Export: SignUpView
    └── index.css.ts         # Vanilla Extract styles

sections/
└── password-forgot-section/ # Folder name in kebab-case
    ├── index.tsx            # Export: PasswordForgotSection
    └── index.css.ts         # Optional (sections may not need styles)

components/
└── email-sign-in-form/      # Folder name in kebab-case
    ├── index.tsx            # Export: EmailSignInForm
    └── index.css.ts         # Vanilla Extract styles
    └── steps/               # Optional sub-components folder
        └── email-form/
            ├── index.tsx
            └── index.css.ts
```

## Naming Conventions

### Component Naming Pattern

```typescript
// Views: [Feature]View (in feature-view folder)
// File: domains/auth/presentation/ui/views/sign-up-view/index.tsx
export const SignUpView = () => {};
// ✅ Views use named export

// Sections: [Feature]Section (in feature-section folder)
// File: domains/auth/presentation/ui/sections/sign-up-section/index.tsx
export const SignUpSection = () => {};
// ✅ Sections use named export
// Note: Skeleton and Error components are in the same file (not exported)

// Components: Descriptive name (in component-name folder)
// File: domains/auth/presentation/ui/components/sign-up-form/index.tsx
export const SignUpForm = () => {};
// ✅ Components use named export

// Sub-components in steps folder
// File: domains/auth/presentation/ui/components/sign-up-form/steps/email-form/index.tsx
export const EmailForm = () => {};
// ✅ Sub-components also use named export
```

## MUST/NEVER Rules for Hierarchy

### Page Layer

#### ✅ MUST
1. Be Server Component by default
2. Use Server Container (`createXXXServerContainer()`)
3. Prefetch data with `queryClient.prefetchQuery()`
4. Wrap View in `<HydrationBoundary>`
5. Use default export (`export default Page`)
6. Get UseCases from Container individually

#### ❌ MUST NOT
1. Contain UI logic
2. Use hooks (`useState`, `useEffect`)
3. Use browser APIs
4. Use Client Container (`getXXXClientContainer()`)
5. Instantiate Repository/UseCase directly
6. Use named export

**See**: [page-patterns.md](./page-patterns.md) for detailed rules

### View Layer

#### ✅ MUST
1. Compose Sections
2. Define page-level layout
3. Pass props to Sections
4. Use named export
5. Be stateless or minimal state

#### ❌ MUST NOT
1. Fetch data
2. Contain business logic
3. Implement error/loading states
4. Import Components directly
5. Use DI Container

**See**: [view-patterns.md](./view-patterns.md) for detailed rules

### Section Layer

#### ✅ MUST
1. Be Client Component (`"use client"`)
2. Implement Suspense boundary
3. Implement ErrorBoundary
4. Provide Skeleton component
5. Provide Error component
6. Use Client Container (`getXXXClientContainer()`)
7. Fetch data with TanStack Query
8. Use named export
9. Create Content sub-component

#### ❌ MUST NOT
1. Use Server Container
2. Skip error handling
3. Skip loading state
4. Define page layout
5. Import other Sections
6. Instantiate Repository/UseCase directly

**See**: [section-patterns.md](./section-patterns.md) for detailed rules

### Component Layer

#### ✅ MUST
1. Be pure/presentational
2. Accept data via props
3. Emit events via callback props
4. Be reusable
5. Use named export
6. Have minimal or no state

#### ❌ MUST NOT
1. Fetch data
2. Use DI Container
3. Contain business logic
4. Know about routes
5. Import Sections or Views
6. Manage complex state

**See**: [component-patterns.md](./component-patterns.md) for detailed rules

## Quick Reference Table

### Import/Export Rules by Context

| From → To               | Same Domain                                                          | Cross Domain                                                               | Shared/App | Packages                                                   |
| ----------------------- | -------------------------------------------------------------------- | -------------------------------------------------------------------------- | ---------- | ---------------------------------------------------------- |
| **Pattern**             | Relative                                                             | Absolute                                                                   | Absolute   | Package                                                    |
| **Example**             | `../../sections/`                                                    | `@/domains/auth/`                                                          | `@core/`   | `@nugudi/themes`                                           |
| **View → Section**      | `import { SignUpSection } from '../../sections/sign-up-section'`     | N/A                                                                        | N/A        | N/A                                                        |
| **Section → Component** | `import { SignUpForm } from '../../components/sign-up-form'`         | N/A                                                                        | N/A        | N/A                                                        |
| **Component → Store**   | `import { useSignUpStore } from '../../../stores/use-sign-up-store'` | `import { useAuth } from '@/src/domains/auth/presentation/hooks/use-auth'` | N/A        | N/A                                                        |
| **Any → Package**       | N/A                                                                  | N/A                                                                        | N/A        | `import { Button } from '@nugudi/react-components-button'` |

### Export Pattern Summary

| File Type      | Export Pattern                      | Example                            |
| -------------- | ----------------------------------- | ---------------------------------- |
| **Pages**      | `export default`                    | `export default Page`              |
| **Views**      | `export const`                      | `export const SignUpView`          |
| **Sections**   | `export const`                      | `export const SignUpSection`       |
| **Components** | `export const`                      | `export const SignUpForm`          |
| **Hooks**      | `export const` or `export function` | `export const useSignUpStore`      |
| **Types**      | `export type` or `export interface` | `export type SignUpFormData`       |
| **Constants**  | `export const`                      | `export const TOTAL_SIGN_UP_STEPS` |
| **Utils**      | `export const` or `export function` | `export const validateEmail`       |

## Common Patterns

### Pattern 1: Full Page Implementation

```typescript
// 1. Page (Server Component)
// File: app/(public)/auth/sign-up/page.tsx
import { SignUpView } from '@/src/domains/auth/presentation/ui/views/sign-up-view';

export default function Page() {
  return <SignUpView />;
}

// 2. View (Layout Composition)
// File: domains/auth/presentation/ui/views/sign-up-view/index.tsx
import { SignUpSection } from '../../sections/sign-up-section';

export const SignUpView = () => {
  return (
    <div>
      <SignUpSection />
    </div>
  );
};

// 3. Section (with boundaries)
// File: domains/auth/presentation/ui/sections/sign-up-section/index.tsx
"use client";

import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { SignUpForm } from '../../components/sign-up-form';

export const SignUpSection = () => {
  return (
    <ErrorBoundary fallback={<SignUpSectionError />}>
      <Suspense fallback={<SignUpSectionSkeleton />}>
        <SignUpSectionContent />
      </Suspense>
    </ErrorBoundary>
  );
};

const SignUpSectionContent = () => {
  // Data fetching logic here
  return <SignUpForm />;
};

// 4. Component (Pure UI)
// File: domains/auth/presentation/ui/components/sign-up-form/index.tsx
export const SignUpForm = () => {
  return <form>{/* Pure UI */}</form>;
};
```

### Pattern 2: Data Flow Example

```typescript
// Page: Prefetch data (SSR)
const Page = async () => {
  const queryClient = getQueryClient();
  const container = createUserServerContainer();
  const getMyProfileUseCase = container.getGetMyProfile();

  await queryClient.prefetchQuery({
    queryKey: ['user', 'profile'],
    queryFn: () => getMyProfileUseCase.execute(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProfileView />
    </HydrationBoundary>
  );
};

// View: Compose sections
export const ProfileView = () => {
  return (
    <div>
      <ProfileSection />
    </div>
  );
};

// Section: Reuse cached data (Client)
"use client";

const ProfileSectionContent = () => {
  const container = getUserClientContainer();
  const getMyProfileUseCase = container.getGetMyProfile();

  const { data } = useSuspenseQuery({
    queryKey: ['user', 'profile'], // Same key = cache hit!
    queryFn: () => getMyProfileUseCase.execute(),
  });

  return <ProfileCard data={data} />;
};

// Component: Pure UI rendering
export const ProfileCard = ({ data }) => {
  return <div>{data.name}</div>;
};
```

## Related Documentation

- **[page-patterns.md](./page-patterns.md)** - Complete Page layer implementation guide
- **[view-patterns.md](./view-patterns.md)** - Complete View layer implementation guide
- **[section-patterns.md](./section-patterns.md)** - Complete Section layer implementation guide
- **[component-patterns.md](./component-patterns.md)** - Complete Component layer implementation guide
- **[../packages.md](../packages.md)** - DDD Architecture, DI Containers, Repository/UseCase patterns
- **[../adapter-pattern.md](../adapter-pattern.md)** - Entity → UI Type transformation guide
- **[../hooks-guide.md](../hooks-guide.md)** - TanStack Query custom hooks and general hooks
