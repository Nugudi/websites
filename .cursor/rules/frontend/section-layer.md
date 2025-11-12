---
description: Section layer rules - Data fetching with Client Container, error boundaries, Suspense
globs:
  - "**/presentation/ui/sections/**/*.tsx"
  - "**/presentation/ui/sections/**/*.ts"
alwaysApply: true
---

# Section Layer Rules

**Type**: Client Component (typically)
**Purpose**: Feature-specific logic encapsulation with error and loading boundaries

## Table of Contents

- [MUST Rules](#must-rules)
- [NEVER Rules](#never-rules)
- [Example: Complete Section Pattern](#example-complete-section-pattern)
- [Example: Wrong Patterns](#example-wrong-patterns)
- [Data Flow in Sections](#data-flow-in-sections)
- [Skeleton Guidelines](#skeleton-guidelines)
- [Error Fallback Guidelines](#error-fallback-guidelines)
- [Section Structure Pattern](#section-structure-pattern)
- [Import Patterns](#import-patterns)

## MUST Rules

1. **MUST be Client Component** — Sections use `"use client"` directive (data fetching with hooks requires client)
2. **MUST implement Suspense boundary** — Wrap Content component with `<Suspense fallback={<Skeleton />}>`
3. **MUST implement ErrorBoundary** — Wrap Suspense with `<ErrorBoundary fallback={<Error />}>`
4. **MUST provide Skeleton component** — Create Skeleton that matches actual layout for loading state
5. **MUST provide Error component** — Create Error fallback for failed data fetching
6. **MUST use Client Container** — Get UseCases from `getXXXClientContainer()` (Lazy-initialized Singleton)
7. **MUST fetch data with TanStack Query** — Use `useSuspenseQuery` or `useQuery` with UseCase
8. **MUST use named export** — Sections use named export (e.g., `export const UserWelcomeSection`)
9. **MUST create Content sub-component** — Separate data fetching logic from boundary setup

## NEVER Rules

1. **NEVER use Server Container** — NEVER use `createXXXServerContainer()` in Client Components
2. **NEVER skip error handling** — Every Section MUST have ErrorBoundary (data fetching can fail)
3. **NEVER skip loading state** — Every Section MUST have Suspense with Skeleton
4. **NEVER define page layout** — Layout structure is View's responsibility, Sections focus on features
5. **NEVER import other Sections** — Sections are independent, composed by Views
6. **NEVER instantiate Repository/UseCase directly** — ALWAYS get from DI Container

**Why These Rules Exist:**

**MUST Rules Explained:**

1. **Why MUST be Client Component?**
   - **Hook Requirement**: `useSuspenseQuery`, `useQuery`, `useState` are client-side React hooks
   - **Interactive Features**: Sections often need event handlers, state, effects
   - **Browser APIs**: May need `localStorage`, `window`, DOM manipulation
   - **React Query**: TanStack Query hooks ONLY work in Client Components
   - **`'use client'` Directive**: Explicitly marks component for client-side execution

2. **Why MUST implement Suspense boundary?**
   - **Loading State Management**: Suspense automatically handles async data loading
   - **No Manual Loading Flags**: Eliminates `isLoading` state management boilerplate
   - **Better UX**: Shows skeleton while data fetches, preventing layout shift
   - **React 18 Feature**: Suspense is the React-idiomatic way to handle async UI
   - **Streaming SSR**: Works with React Server Components streaming

3. **Why MUST implement ErrorBoundary?**
   - **Graceful Degradation**: Failed data fetch shouldn't crash entire app
   - **User Experience**: Show friendly error message instead of blank screen
   - **Resilience**: Other Sections continue working even if one fails
   - **Error Isolation**: Contains errors to Section boundary, not global crash
   - **Retry Mechanism**: ErrorBoundary can provide retry button

4. **Why MUST provide Skeleton component?**
   - **Layout Stability**: Skeleton prevents Cumulative Layout Shift (CLS)
   - **Perceived Performance**: Users perceive faster load with skeleton than spinner
   - **Matches Layout**: Skeleton shows where content will appear
   - **Accessibility**: Screen readers can announce loading state
   - **Better UX**: No jarring content pop-in after load

5. **Why MUST provide Error component?**
   - **Fallback UI**: ErrorBoundary requires fallback component
   - **Graceful Degradation**: Show default/fallback data instead of nothing
   - **User Guidance**: Error component can suggest retry or alternate action
   - **Maintains Layout**: Error component preserves Section's layout structure
   - **Debugging**: Can display error details in development mode

6. **Why MUST use Client Container?**
   - **Lazy Singleton**: Client Container initializes once and reuses instance
   - **Browser Environment**: Client Container uses ClientSessionManager (localStorage)
   - **State Consistency**: Same container = Same session/auth state
   - **Performance**: One container instance for entire app lifecycle
   - **Credentials**: Client Container includes `credentials: 'include'` for cookies

7. **Why MUST fetch data with TanStack Query?**
   - **Cache Management**: Automatic caching, deduplication, background refetch
   - **SSR Hydration**: Reuses data prefetched in Page (HydrationBoundary)
   - **Suspense Integration**: `useSuspenseQuery` works seamlessly with Suspense
   - **Error Handling**: Automatic error propagation to ErrorBoundary
   - **Devtools**: React Query Devtools for debugging
   - **Optimistic Updates**: Built-in support for mutations and rollback

8. **Why MUST use named export?**
   - **Component Clarity**: Named export = Clear component name in imports
   - **Tree-shaking**: Named exports enable better dead code elimination
   - **Refactoring**: Easier to rename with IDE tools
   - **Consistency**: All Sections use named export convention
   - **Not a Page**: Only Pages require default export for Next.js routing

9. **Why MUST create Content sub-component?**
   - **Separation of Concerns**: Boundary setup vs data fetching logic
   - **Cleaner Code**: Main Section = Boundaries only, Content = Business logic
   - **Easier Testing**: Can test Content component independently
   - **Better Readability**: Clear separation between error handling and feature logic
   - **Pattern Consistency**: All Sections follow same structure

**NEVER Rules Explained:**

1. **Why NEVER use Server Container?**
   - **Stateless Factory**: Server Container creates new instance per call (not singleton)
   - **Wrong SessionManager**: Server Container uses httpOnly cookies, needs `cookies()` from `next/headers`
   - **No `cookies()` API**: Client Components can't access `cookies()` from `next/headers`
   - **Build Error**: Using server-only code in client = Webpack bundling error
   - **Use Client Container**: Client Container is designed for client-side usage

2. **Why NEVER skip error handling?**
   - **Network Failures**: API calls can fail (timeout, 500 error, network offline)
   - **User Experience**: Unhandled errors crash React tree = Blank screen
   - **Production Stability**: ErrorBoundary prevents cascading failures
   - **Debugging**: ErrorBoundary can log errors to monitoring service
   - **Required by Pattern**: Section = Data fetching = Must handle errors

3. **Why NEVER skip loading state?**
   - **User Feedback**: Users need visual indication that data is loading
   - **Layout Shift**: Content appearing without skeleton causes jarring CLS
   - **Perceived Performance**: Skeleton makes app feel faster
   - **Accessibility**: Screen readers need loading announcement
   - **Required by Pattern**: Section = Async data = Must show loading

4. **Why NEVER define page layout?**
   - **Separation of Concerns**: View = Layout, Section = Feature logic
   - **Reusability**: Sections focus on feature, not where they're placed
   - **Flexibility**: Same Section can be reused in different layouts
   - **Maintainability**: Layout changes happen in View, not scattered across Sections
   - **Clear Hierarchy**: Page → View (layout) → Section (feature) → Component (UI)

5. **Why NEVER import other Sections?**
   - **Independence**: Sections are independent feature units
   - **Composition**: Views compose Sections, not Sections composing Sections
   - **Tight Coupling**: Section importing Section = Hard to refactor
   - **Wrong Layer**: If Section needs another Section, both belong in same Section
   - **Use View**: Multiple Sections = View responsibility to compose them

6. **Why NEVER instantiate Repository/UseCase directly?**
   - **Tight Coupling**: Direct instantiation = Hard-coded dependencies
   - **No Testability**: Can't mock dependencies in tests
   - **Missing Infrastructure**: Repository needs HttpClient, TokenProvider, SessionManager
   - **Type Unsafety**: Manual wiring = Easy to forget required dependencies
   - **Container Benefits**: Container handles all dependency wiring automatically

## Example: Complete Section Pattern

```typescript
// ✅ CORRECT Section Implementation
// domains/user/presentation/ui/sections/user-welcome-section/index.tsx
"use client";

import { Box } from "@nugudi/react-components-layout";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { getUserClientContainer } from "@/src/domains/user/di/user-client-container";
import * as styles from "./index.css";

// ✅ Main Section Component (with boundaries)
export const UserWelcomeSection = () => {
  return (
    <ErrorBoundary fallback={<UserWelcomeSectionError />}>
      <Suspense fallback={<UserWelcomeSectionSkeleton />}>
        <UserWelcomeSectionContent />
      </Suspense>
    </ErrorBoundary>
  );
};

// ✅ Skeleton Component (matches actual layout)
const UserWelcomeSectionSkeleton = () => {
  return (
    <Box borderRadius="xl" className={styles.container}>
      <div className={styles.textWrapper}>
        <div className="flex flex-col gap-2">
          <div className="h-7 w-44 animate-pulse rounded bg-zinc-200" />
          <div className="h-7 w-52 animate-pulse rounded bg-zinc-200" />
        </div>
      </div>
    </Box>
  );
};

// ✅ Error Component (fallback UI)
const UserWelcomeSectionError = () => {
  return (
    <Box borderRadius="xl" className={styles.container}>
      <div className={styles.textWrapper}>
        <span className={styles.name}>손님</span>님 오늘도 <br />
        맛난 점심식사다 너굴
      </div>
    </Box>
  );
};

// ✅ Content Component (actual data fetching)
const UserWelcomeSectionContent = () => {
  // ✅ Client Container (Lazy-initialized Singleton)
  const container = getUserClientContainer();
  const getMyProfileUseCase = container.getGetMyProfile();

  // ✅ TanStack Query with UseCase
  const { data } = useSuspenseQuery({
    queryKey: ['user', 'profile'],
    queryFn: () => getMyProfileUseCase.execute()
  });

  const nickname = data.profile?.nickname ?? "손님";

  return (
    <Box borderRadius="xl" className={styles.container}>
      <div className={styles.textWrapper}>
        <span className={styles.name}>{nickname}</span>님 오늘도 <br />
        맛난 점심식사다 너굴
      </div>
    </Box>
  );
};
```

## Example: Wrong Patterns

```typescript
// ❌ WRONG Examples
export const UserWelcomeSection = () => {
  const container = createUserServerContainer(); // ❌ Server Container in Client Component
  const repository = new UserRepository(); // ❌ Direct instantiation

  const { data } = useSuspenseQuery(...); // ❌ No ErrorBoundary

  return <Box>{data.nickname}</Box>; // ❌ No Suspense boundary
};
```

## Data Flow in Sections

```typescript
// ✅ CORRECT - Cache reuse from Page prefetch
const UserWelcomeSectionContent = () => {
  const container = getUserClientContainer();
  const getMyProfileUseCase = container.getGetMyProfile();

  // Page prefetched with same Query Key → Cache hit!
  const { data } = useSuspenseQuery({
    queryKey: ['user', 'profile'], // Same key as Page prefetch
    queryFn: () => getMyProfileUseCase.execute(),
  });

  return <WelcomeMessage nickname={data.profile?.nickname} />;
};
```

## Skeleton Guidelines

Skeletons MUST match the actual layout:

```typescript
// ✅ CORRECT - Matches actual layout
const BenefitListSectionSkeleton = () => {
  return (
    <VStack gap={16}>
      {[1, 2, 3].map((i) => (
        <Box key={i} className="h-32 w-full animate-pulse rounded-lg bg-zinc-200" />
      ))}
    </VStack>
  );
};

// ❌ WRONG - Doesn't match layout
const BenefitListSectionSkeleton = () => {
  return <div>Loading...</div>;
};
```

## Error Fallback Guidelines

Error fallbacks MUST provide graceful degradation:

```typescript
// ✅ CORRECT - Graceful degradation with default values
const UserWelcomeSectionError = () => {
  return (
    <Box>
      <span>손님</span>님 환영합니다
    </Box>
  );
};

// ✅ CORRECT - Retry option for critical features
const BenefitListSectionError = ({ error, resetErrorBoundary }) => {
  return (
    <Box>
      <p>혜택 목록을 불러오는데 실패했습니다.</p>
      <Button onClick={resetErrorBoundary}>다시 시도</Button>
    </Box>
  );
};
```

## Section Structure Pattern

Every Section file MUST follow this structure:

```typescript
"use client";

// 1. Imports
import { ... } from '...';

// 2. Main Section Component (ONLY EXPORT)
export const [Feature]Section = () => {
  return (
    <ErrorBoundary fallback={<[Feature]SectionError />}>
      <Suspense fallback={<[Feature]SectionSkeleton />}>
        <[Feature]SectionContent />
      </Suspense>
    </ErrorBoundary>
  );
};

// 3. Skeleton Component (NOT EXPORTED)
const [Feature]SectionSkeleton = () => { /* ... */ };

// 4. Error Component (NOT EXPORTED)
const [Feature]SectionError = () => { /* ... */ };

// 5. Content Component (NOT EXPORTED)
const [Feature]SectionContent = () => { /* ... */ };
```

## Import Patterns

```typescript
// ✅ CORRECT - Relative imports within same domain
import { BenefitCard } from '../../components/benefit-card';
import { useGetBenefitList } from '../../../hooks/queries/get-benefit-list.query';

// ✅ CORRECT - DI Container absolute import
import { getBenefitClientContainer } from '@/src/domains/benefit/di/benefit-client-container';

// ✅ CORRECT - Package imports
import { Box, VStack } from '@nugudi/react-components-layout';
```

---

**Related**: See `patterns/hooks-guide.md` for Query Hook patterns, `ddd/di-containers.md` for Client Container usage
