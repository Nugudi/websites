# Next.js App Router Component Architecture Rules

## Component Hierarchy Overview

```
app/                           # Next.js App Router pages
├── [domain]/
│   └── [feature]/
│       └── page.tsx          # Server Component - Entry Point
apps/web/src/
└── domains/                   # Domain-based architecture
    └── [domain]/             # e.g., auth, menu, benefits
        └── [feature]/        # e.g., sign-in, sign-up, password-forgot
            ├── constants/    # Feature constants
            ├── schemas/      # Validation schemas (Zod)
            ├── stores/       # State management (Zustand)
            ├── types/        # TypeScript types
            └── ui/
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
└── index.css.ts     # Vanilla Extract styles
```

**Example Structure:**

```
views/
└── category-search-view/    # Folder name in kebab-case
    ├── index.tsx            # Export: CategorySearchView
    └── index.css.ts         # Styles for this view

sections/
└── results-section/         # Folder name in kebab-case
    ├── index.tsx            # Export: ResultsSection
    └── index.css.ts         # Styles for this section

components/
└── search-input/            # Folder name in kebab-case
    ├── index.tsx            # Export: SearchInput
    └── index.css.ts         # Styles for this component
```

## Naming Conventions

### File Structure

```
apps/web/src/
└── domains/
    └── search/                              # Domain
        └── category-search/                 # Feature
            ├── constants/
            │   └── category-search.ts       # Feature constants
            ├── schemas/
            │   └── search-schema.ts         # Zod validation schemas
            ├── stores/
            │   └── use-search-store.ts      # Zustand store
            ├── types/
            │   └── search.ts                # TypeScript types
            └── ui/
                ├── views/
                │   └── category-search-view/
                │       ├── index.tsx
                │       └── index.css.ts
                ├── sections/
                │   ├── results-section/
                │   │   ├── index.tsx
                │   │   └── index.css.ts
                │   └── filters-section/
                │       ├── index.tsx
                │       └── index.css.ts
                └── components/
                    ├── search-input/
                    │   ├── index.tsx
                    │   └── index.css.ts
                    └── result-card/
                        ├── index.tsx
                        └── index.css.ts
```

### Component Naming Pattern

```typescript
// Views: [Feature]View (in feature-view folder)
// File: domains/search/category-search/ui/views/category-search-view/index.tsx
export const CategorySearchView = () => {};

// Sections: [Feature]Section (in feature-section folder)
// File: domains/search/category-search/ui/sections/results-section/index.tsx
export const ResultsSection = () => {};
export const ResultsSectionSkeleton = () => {};
export const ResultsSectionError = () => {};

// Components: Descriptive name (in component-name folder)
// File: domains/search/category-search/ui/components/search-input/index.tsx
export const SearchInput = () => {};
// File: domains/search/category-search/ui/components/result-card/index.tsx
export const ResultCard = () => {};
```

## Import Patterns

### Within the Same Domain

```typescript
// In: apps/web/src/domains/search/category-search/ui/views/category-search-view/index.tsx
import { ResultsSection } from '../../sections/results-section';
import { FiltersSection } from '../../sections/filters-section';

// In: apps/web/src/domains/search/category-search/ui/sections/results-section/index.tsx
import { SearchInput } from '../../components/search-input';
import { ResultCard } from '../../components/result-card';
import { useSearchStore } from '../../../stores/use-search-store';
import type { SearchResult } from '../../../types/search';
```

### From Page to View

```typescript
// In: app/search/category/page.tsx
import { CategorySearchView } from '@/domains/search/category-search/ui/views/category-search-view';
```

### Cross-Domain Imports

```typescript
// In: apps/web/src/domains/menu/daily-menu/ui/sections/menu-section/index.tsx
import { useAuth } from '@/domains/auth/hooks/use-auth';
```

## Data Flow Rules

### Server → Client Data Flow

```typescript
// 1. Page prefetches data
await queryClient.prefetchQuery({ queryKey: ["data"] });

// 2. View receives props
<FeatureView initialData={data} />

// 3. Section fetches/uses prefetched data
const { data } = useSuspenseQuery({ queryKey: ["data"] });

// 4. Component receives data as props
<Component data={data} />
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
  const {
    data,
    fetchNextPage,
    hasNextPage,
  } = useSuspenseInfiniteQuery({
    queryKey: ["resources", param],
    queryFn: ({ pageParam }) => api.fetchPage({ param, page: pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

  return <ComponentList data={data} onLoadMore={fetchNextPage} />;
};
```

## Best Practices Summary

1. **Page**: Server-side data prefetching only (`app/[domain]/[feature]/page.tsx`)
2. **View**: Layout composition only (`domains/[domain]/[feature]/ui/views/`)
3. **Section**: Business logic + Error/Loading boundaries (`ui/sections/`)
4. **Component**: Pure UI components (`ui/components/`)
5. **Always use** Suspense + ErrorBoundary in Sections
6. **Never skip** the hierarchy (Page → View → Section → Component)
7. **Keep components** pure and reusable
8. **Colocate** related files within domains
9. **Name consistently** following the patterns above
10. **Separate concerns** strictly between layers
11. **Each component** must be in its own folder with `index.tsx` and `index.css.ts`
12. **Domain logic** (stores, schemas, types) stays outside the `ui/` folder

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
