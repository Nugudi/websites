# Next.js App Router Component Architecture Rules

## Component Hierarchy Overview

```
apps/web/
├── app/                       # Next.js App Router pages
│   ├── (auth)/               # 🔒 Protected routes (require authentication)
│   │   ├── benefits/         # Benefits page for logged-in users
│   │   │   └── page.tsx
│   │   └── my/               # My page/profile for logged-in users
│   │       └── page.tsx
│   └── (public)/             # 🌍 Public routes (no authentication required)
│       ├── auth/             # Authentication-related public pages
│       │   ├── sign-in/
│       │   │   ├── page.tsx
│       │   │   └── email/
│       │   │       └── page.tsx
│       │   ├── sign-up/
│       │   │   └── page.tsx
│       │   └── password/
│       │       └── forgot/
│       │           └── page.tsx
│       └── home/             # Public home page
│           └── page.tsx
└── src/
    └── domains/              # Domain-based architecture
        └── [domain]/         # e.g., auth, menu, benefit
            # Option 1: Complex domains with multiple features
            └── [feature]/    # e.g., auth/sign-in, auth/sign-up, auth/my
                ├── constants/
                ├── schemas/
                ├── stores/
                ├── types/
                └── ui/
                    ├── views/
                    ├── sections/
                    └── components/

            # Option 2: Simple domains without sub-features
            └── ui/           # e.g., benefit/ui (directly under domain)
                ├── views/
                ├── sections/
                └── components/
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

const Page = async ({ params, searchParams }) => {
  // 1. Extract parameters
  // 2. Prefetch data on server
  // 3. Return View wrapped in HydrationBoundary
};
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

export const [Feature]View = ({ prop1, prop2 }) => {
  return (
    <div className="page-layout">
      <FirstSection />
      <SecondSection prop={prop1} />
      <ThirdSection prop={prop2} />
    </div>
  );
};
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

// Pattern: Three components per section
export const [Feature]Section = (props) => {
  return (
    <ErrorBoundary fallback={<[Feature]SectionError />}>
      <Suspense fallback={<[Feature]SectionSkeleton />}>
        <[Feature]SectionContent {...props} />
      </Suspense>
    </ErrorBoundary>
  );
};

const [Feature]SectionSkeleton = () => { /* Loading UI */ };
const [Feature]SectionError = () => { /* Error UI */ };
const [Feature]SectionContent = (props) => { /* Actual content with data fetching */ };
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

// Sections: [Feature]Section (in feature-section folder)
// File: domains/auth/sign-up/ui/sections/sign-up-section/index.tsx
export const SignUpSection = () => {};
// Note: Skeleton and Error components are in the same file (not exported separately)

// Components: Descriptive name (in component-name folder)
// File: domains/auth/sign-up/ui/components/sign-up-form/index.tsx
export const SignUpForm = () => {};
// File: domains/auth/sign-in/ui/components/email-sign-in-form/index.tsx
export const EmailSignInForm = () => {};
// File: domains/auth/sign-in/ui/components/social-sign-in-button-list/index.tsx
export const SocialSignInButtonList = () => {};
```

## Import Patterns

### Within the Same Domain

```typescript
// In: apps/web/src/domains/auth/sign-up/ui/views/sign-up-view/index.tsx
import { SignUpSection } from "../../sections/sign-up-section";

// In: apps/web/src/domains/auth/sign-up/ui/sections/sign-up-section/index.tsx
import { SignUpForm } from "../../components/sign-up-form";
import { useSignUpStore } from "../../../stores/use-sign-up-store";
import type { SignUpFormData } from "../../../types/sign-up";

// In: apps/web/src/domains/auth/sign-up/ui/components/sign-up-form/index.tsx
import { EmailForm } from "./steps/email-form";
import { PasswordForm } from "./steps/password-form";
```

### From Page to View

```typescript
// Public route example
// In: app/(public)/auth/sign-up/page.tsx
import { SignUpView } from "@/domains/auth/sign-up/ui/views/sign-up-view";

// Protected route example
// In: app/(auth)/benefits/page.tsx
import { BenefitPageView } from "@/domains/benefit/ui/views/benefit-page-view";
```

### Cross-Domain Imports

```typescript
// NO cross-domain imports in current structure - each domain is self-contained
// Future example:
// import { useAuth } from '@/domains/auth/hooks/use-auth';
```

### Using Monorepo Packages

```typescript
// Always use existing packages from monorepo
import Button from "@nugudi/react-components-button";
import Input from "@nugudi/react-components-input";
import { Box, Flex, VStack } from "@nugudi/react-components-layout";
import { useToggle } from "@nugudi/react-hooks-toggle";
import { variables } from "@nugudi/themes";
import { Icons } from "@nugudi/assets-icons";
import { api } from "@nugudi/api";
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

This architecture ensures:

- **Predictable** component behavior
- **Maintainable** codebase
- **Testable** components
- **Optimal** performance with SSR/streaming
- **Clear** separation of concerns
