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
