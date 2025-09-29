# Next.js App Router Component Architecture Rules

## Component Hierarchy Overview

```
Page (Server Component) → View → Section (with Suspense/ErrorBoundary) → Component
```

## 🎨 IMPORTANT: Always Use Design Tokens

**MUST use `vars` and `classes` from `@nugudi/themes`:**

- Colors: Use `vars.colors.$scale.zinc[500]` NOT hard-coded colors
- Spacing: Use `vars.box.spacing[16]` NOT `16px`
- Radius: Use `vars.box.radii.lg` NOT `12px`
- Shadows: Use `vars.box.shadows.sm` NOT custom shadows

## Domain Structure Patterns

```
domains/
├── auth/                    # Complex domain with sub-features
│   ├── sign-up/
│   ├── sign-in/
│   ├── login/
│   ├── profile/
│   └── forgot-password/
├── benefit/                 # Simple domain without sub-features
│   └── ui/
└── cafeteria/               # Simple domain without sub-features
    └── ui/
```

## Layer-by-Layer Rules

### 1. Page Layer (`app/[domain]/[feature]/page.tsx`)

**Type**: Server Component
**Purpose**: Route entry point, data prefetching, metadata setup

```typescript
// MUST: Server Component
// MUST: Handle URL/search params
// MUST: Prefetch data for SSR
// MUST: Wrap with HydrationBoundary
// MAY: Set metadata for SEO
// NEVER: Contain UI logic directly
// NEVER: Use hooks or browser APIs

// Example: app/page.tsx (home page shows cafeteria)
import { HydrationBoundary } from "@tanstack/react-query";
import { CafeteriaHomeView } from "@/src/domains/cafeteria/ui/views/cafeteria-home-view";

const Page = async ({ params, searchParams }) => {
  // 1. Extract parameters
  const { filter } = searchParams;

  // 2. Prefetch data on server
  await queryClient.prefetchQuery({
    queryKey: ["cafeterias", filter],
    queryFn: () => api.cafeterias.getList({ filter }),
  });

  // 3. Return View wrapped in HydrationBoundary
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CafeteriaHomeView filter={filter} />
    </HydrationBoundary>
  );
};

export default Page; // Pages MUST use default export
```

### 2. View Layer (`ui/views/`)

**Type**: Client or Server Component  
**Purpose**: Page layout composition and section orchestration

```typescript
// MUST: Import and compose Sections
// MUST: Define page-level layout structure
// MUST: Pass props to Sections
// MAY: Manage page-level state (if client component)
// MAY: Coordinate data flow between sections
// NEVER: Fetch data directly
// NEVER: Contain business logic
// NEVER: Implement error/loading states

// Example: domains/cafeteria/ui/views/cafeteria-home-view/index.tsx
import { Flex } from "@nugudi/react-components-layout";
import { AppHeader } from "@/src/shared/ui/components/app-header";
import { CafeteriaBrowseMenuSection } from "../../sections/cafeteria-browse-menu-section";
import { CafeteriaRecommendSection } from "../../sections/cafeteria-recommend-section";
import * as styles from "./index.css";

export const CafeteriaHomeView = ({ filter }) => {
  return (
    <Flex direction="column" className={styles.container} gap={16}>
      <AppHeader />
      <CafeteriaBrowseMenuSection filter={filter} />
      <CafeteriaRecommendSection />
    </Flex>
  );
};

};

// Views use named export
```

### 3. Section Layer (`ui/sections/`)

**Type**: Client Component (typically)  
**Purpose**: Feature-specific logic encapsulation with error and loading boundaries

```typescript
// MUST: Implement Suspense boundary
// MUST: Implement ErrorBoundary
// MUST: Provide skeleton/loading UI
// MUST: Handle data fetching (via hooks)
// MAY: Manage section-specific state
// MAY: Handle user interactions
// NEVER: Define page layout
// NEVER: Import other sections

// Example: domains/cafeteria/ui/sections/cafeteria-browse-menu-section/index.tsx
import { ErrorBoundary } from 'react-error-boundary';
import { Suspense } from 'react';
import { CafeteriaMenuList } from "../../components/cafeteria-menu-list";

// Main Section Component (handles boundaries)
export const CafeteriaBrowseMenuSection = ({ filter }) => {
  return (
    <ErrorBoundary fallback={<CafeteriaBrowseMenuSectionError />}>
      <Suspense fallback={<CafeteriaBrowseMenuSectionSkeleton />}>
        <CafeteriaBrowseMenuSectionContent filter={filter} />
      </Suspense>
    </ErrorBoundary>
  );
};

// Skeleton Component (shown during loading)
const CafeteriaBrowseMenuSectionSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="h-32 bg-zinc-200 rounded" />
    </div>
  );
};

// Error Component (shown on error)
const CafeteriaBrowseMenuSectionError = ({ error }) => {
  return (
    <div className="error-container">
      <p>메뉴를 불러오는 중 오류가 발생했습니다.</p>
    </div>
  );
};

// Content Component (actual data fetching and rendering)
const CafeteriaBrowseMenuSectionContent = ({ filter }) => {
  const { data } = useSuspenseQuery({
    queryKey: ['cafeterias', filter],
    queryFn: () => api.cafeterias.getList({ filter }),
  });

  return <CafeteriaMenuList cafeteriaList={data} />;
};

};

// Sections use named export
```

### 4. Component Layer (`ui/components/`)

**Type**: Client or Server Component  
**Purpose**: Reusable, presentational UI components

```typescript
// MUST: Be pure/presentational
// MUST: Accept data via props
// MUST: Emit events via callback props
// MAY: Have internal UI state (open/closed, etc.)
// NEVER: Fetch data directly
// NEVER: Have business logic
// NEVER: Know about routes or navigation

export const [Component] = ({ data, onAction }) => {
  // Pure UI rendering
  return <div onClick={onAction}>{data}</div>;
};
```

## Folder Structure Rules

### Each Component Must Have Its Own Folder

**MANDATORY**: Every view, section, and component must be in its own folder with these files:

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

### File Structure

```
apps/web/src/
└── domains/
    └── auth/                              # Domain
        ├── sign-up/                       # Feature
        │   ├── constants/
        │   │   └── sign-up.ts             # Feature constants
        │   ├── schemas/
        │   │   └── sign-up-schema.ts      # Zod validation schemas
        │   ├── stores/
        │   │   └── use-sign-up-store.ts   # Zustand store
        │   ├── types/
        │   │   └── sign-up.ts             # TypeScript types
        │   └── ui/
        │       ├── views/
        │       │   └── sign-up-view/
        │       │       ├── index.tsx
        │       │       └── index.css.ts
        │       ├── sections/
        │       │   └── sign-up-section/
        │       │       └── index.tsx
        │       └── components/
        │           └── sign-up-form/
        │               ├── index.tsx
        │               ├── index.css.ts
        │               └── steps/
        │                   ├── email-form/
        │                   │   ├── index.tsx
        │                   │   └── index.css.ts
        │                   └── password-form/
        │                       ├── index.tsx
        │                       └── index.css.ts
        └── my/                            # Another feature in same domain
            └── ui/
                ├── views/
                │   └── my-page-view/
                ├── sections/
                │   ├── profile-section/
                │   └── menu-section/
                └── components/
                    └── logout-button/
```

### Component Naming Pattern

```typescript
// Views: [Feature]View (in feature-view folder)
// File: domains/auth/sign-up/ui/views/sign-up-view/index.tsx
export const SignUpView = () => {};
// ✅ Views use named export

// Sections: [Feature]Section (in feature-section folder)
// File: domains/auth/sign-up/ui/sections/sign-up-section/index.tsx
export const SignUpSection = () => {};
// ✅ Sections use named export
// Note: Skeleton and Error components are in the same file (not exported)

// Components: Descriptive name (in component-name folder)
// File: domains/auth/sign-up/ui/components/sign-up-form/index.tsx
export const SignUpForm = () => {};
// ✅ Components use named export

// Sub-components in steps folder
// File: domains/auth/sign-up/ui/components/sign-up-form/steps/email-form/index.tsx
export const EmailForm = () => {};
// ✅ Sub-components also use named export
```

## Import Patterns

### Within the Same Domain - MUST Use Relative Imports

```typescript
// ✅ CORRECT - Use relative imports + named exports within same domain
// In: apps/web/src/domains/auth/sign-up/ui/views/sign-up-view/index.tsx
import { SignUpSection } from "../../sections/sign-up-section";

// In: apps/web/src/domains/auth/sign-up/ui/sections/sign-up-section/index.tsx
import { SignUpForm } from "../../components/sign-up-form";
import { useSignUpStore } from "../../../stores/use-sign-up-store"; // Named export for hooks
import type { SignUpFormData } from "../../../types/sign-up";

// In: apps/web/src/domains/auth/sign-up/ui/components/sign-up-form/index.tsx
import { EmailForm } from "./steps/email-form";
import { PasswordForm } from "./steps/password-form";

// ❌ WRONG - Don't use absolute imports within same domain
import { SignUpSection } from "@/src/domains/auth/sign-up/ui/sections/sign-up-section"; // NO!
```

### From Page to View - MUST Use Absolute Imports

```typescript
// ✅ CORRECT - Pages use absolute imports for views
// Public route example
// In: app/(public)/auth/sign-up/page.tsx
import { SignUpView } from "@/src/domains/auth/sign-up/ui/views/sign-up-view";

// Protected route example
// In: app/(auth)/profile/page.tsx
import { ProfilePageView } from "@/src/domains/auth/profile/ui/views/profile-page-view";

// In: app/page.tsx (home page shows cafeteria)
import { CafeteriaHomeView } from "@/src/domains/cafeteria/ui/views/cafeteria-home-view";
```

### Cross-Domain Imports - MUST Use Absolute Imports

```typescript
// ✅ CORRECT - Use absolute imports for cross-domain
// In: apps/web/src/domains/cafeteria/...
import { useAuth } from "@/src/domains/auth/hooks/use-auth";
import { LoginWelcome } from "@/src/domains/auth/login/ui/components/login-welcome";

// In: apps/web/src/shared/ui/components/...
import { ProfileSection } from "@/src/domains/auth/profile/ui/sections/profile-section";

// ❌ WRONG - Don't use relative imports for cross-domain
import { useAuth } from "../../../auth/hooks/use-auth"; // NO!
```

### Using Monorepo Packages - Package Import Rules

```typescript
// Individual component packages - Named exports
import { Button } from "@nugudi/react-components-button"; // ✅ Named
import { Input } from "@nugudi/react-components-input"; // ✅ Named
import { Switch } from "@nugudi/react-components-switch"; // ✅ Named

// Layout package - Named exports
import { Box, Flex, VStack, HStack } from "@nugudi/react-components-layout"; // ✅ Named
import {
  Heading,
  Title,
  Body,
  Emphasis,
} from "@nugudi/react-components-layout"; // ✅ Named

// Hooks - Named exports
import { useToggle } from "@nugudi/react-hooks-toggle"; // ✅ Named
import { useStepper } from "@nugudi/react-hooks-use-stepper"; // ✅ Named

// Themes - Named exports
import { vars, classes } from "@nugudi/themes"; // ✅ Named

// Icons - Named exports
import { AppleIcon, HeartIcon, ArrowRightIcon } from "@nugudi/assets-icons"; // ✅ Named

// API - Named export
import { api } from "@nugudi/api"; // ✅ Named
```

## Data Flow Rules

### Server → Client Data Flow

```typescript
// 1. Page prefetches data
await queryClient.prefetchQuery({ queryKey: ["data"] });

// 2. View receives props
<FeatureView initialData={data} />;

// 3. Section fetches/uses prefetched data
const { data } = useSuspenseQuery({ queryKey: ["data"] });

// 4. Component receives data as props
<Component data={data} />;
```

### State Management Rules

```
- Page: URL state only (params, searchParams)
- View: Page-level state (if needed)
- Section: Feature-specific state
- Component: UI-only state
```

## Error Handling Pattern

```typescript
// Each Section MUST follow this pattern:
export const DataSection = () => {
  return (
    <ErrorBoundary
      fallback={<DataSectionError />}
      onError={(error) => console.error("DataSection error:", error)}
    >
      <Suspense fallback={<DataSectionSkeleton />}>
        <DataSectionContent />
      </Suspense>
    </ErrorBoundary>
  );
};

// Internal components - NOT exported
const DataSectionSkeleton = () => {
  return <div className="animate-pulse">Loading...</div>;
};

const DataSectionError = ({ error }) => {
  return <div>오류가 발생했습니다: {error.message}</div>;
};

const DataSectionContent = () => {
  const { data } = useSuspenseQuery(/* ... */);
  return <div>{/* Actual content */}</div>;
};

// Only export the main section with named export
```

## Query Hooks Pattern

```typescript
// In Section Content components:
const SectionContent = ({ param }) => {
  // For single data fetch
  const { data } = useSuspenseQuery({
    queryKey: ["resource", param],
    queryFn: () => api.fetch(param),
  });

  // For infinite scroll
  const { data, fetchNextPage, hasNextPage } = useSuspenseInfiniteQuery({
    queryKey: ["resources", param],
    queryFn: ({ pageParam }) => api.fetchPage({ param, page: pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

  return <ComponentList data={data} onLoadMore={fetchNextPage} />;
};
```

## Best Practices Summary

1. **Route Groups**: Use `(auth)` for protected pages, `(public)` for public pages
2. **Page**: Server-side data prefetching only (`app/(auth|public)/[domain]/page.tsx`)
3. **View**: Layout composition only (`domains/[domain]/[feature?]/ui/views/`)
4. **Section**: Business logic + Error/Loading boundaries (`ui/sections/`)
5. **Component**: Pure UI components (`ui/components/`)
6. **Always use** Suspense + ErrorBoundary in Sections
7. **Never skip** the hierarchy (Page → View → Section → Component)
8. **Keep components** pure and reusable
9. **Domain Structure**: Use sub-features for complex domains (auth), direct UI for simple domains (benefit)
10. **Name consistently** following the patterns above
11. **Separate concerns** strictly between layers
12. **Each component** must be in its own folder with `index.tsx` and `index.css.ts`
13. **Domain logic** (stores, schemas, types) stays outside the `ui/` folder
14. **Use Vanilla Extract** with `vars` and `classes` from `@nugudi/themes`
15. **Always prefer** existing packages from `@nugudi/*` namespace
16. **Client Components**: Add `"use client"` when using event handlers or hooks
17. **Follow monorepo** import conventions from packages.md

## TypeScript Interface Rules

```typescript
// Views
interface [Feature]ViewProps {
  // Props from page params/searchParams
}

// Sections
interface [Feature]SectionProps {
  // Props from View
}

// Components
interface [Component]Props {
  // Data and callback props only
  data: DataType;
  onAction: (value: ValueType) => void;
}
```

## Quick Reference: Import/Export Rules

### Export Rules by File Type

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

### Import Rules by Context

| From → To               | Same Domain                                                          | Cross Domain                                                  | Shared/App      | Packages                                                   |
| ----------------------- | -------------------------------------------------------------------- | ------------------------------------------------------------- | --------------- | ---------------------------------------------------------- |
| **Pattern**             | Relative                                                             | Absolute                                                      | Absolute        | Package                                                    |
| **Example**             | `../../sections/`                                                    | `@/domains/auth/`                                             | `@/src/shared/` | `@nugudi/themes`                                           |
| **View → Section**      | `import { SignUpSection } from '../../sections/sign-up-section'`     | N/A                                                           | N/A             | N/A                                                        |
| **Section → Component** | `import { SignUpForm } from '../../components/sign-up-form'`         | N/A                                                           | N/A             | N/A                                                        |
| **Component → Store**   | `import { useSignUpStore } from '../../../stores/use-sign-up-store'` | `import { useAuth } from '@/src/domains/auth/hooks/use-auth'` | N/A             | N/A                                                        |
| **Any → Package**       | N/A                                                                  | N/A                                                           | N/A             | `import { Button } from '@nugudi/react-components-button'` |

### Common Import Patterns

```typescript
// ✅ CORRECT Examples
// Within same domain (auth/sign-up)
import { SignUpSection } from "../../sections/sign-up-section";
import { useSignUpStore } from "../../../stores/use-sign-up-store";

// Cross-domain
import { LoginWelcome } from "@/src/domains/auth/login/ui/components/login-welcome";

// Shared components
import { AppHeader } from "@/src/shared/ui/components/app-header";

// Packages
import { Button } from "@nugudi/react-components-button";
import { Box, Flex } from "@nugudi/react-components-layout";

// ❌ WRONG Examples
// Using absolute path within same domain
import { SignUpSection } from "@/src/domains/auth/sign-up/ui/sections/sign-up-section";

// Using relative path for cross-domain
import { LoginWelcome } from "../../../auth/login/ui/components/login-welcome";

// Wrong export pattern for packages
import Button from "@nugudi/react-components-button"; // Should be named export
```

This architecture ensures:

- **Predictable** component behavior
- **Maintainable** codebase
- **Testable** components
- **Optimal** performance with SSR/streaming
- **Clear** separation of concerns
