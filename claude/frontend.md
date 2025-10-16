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
├── auth/                          # Complex domain (flat structure)
│   ├── constants/                 # Constants (session, sign-up, etc.)
│   ├── errors/                    # Auth error classes
│   ├── hooks/
│   │   ├── queries/               # TanStack Query options (미래)
│   │   └── use-*.ts               # 일반 커스텀 훅
│   ├── providers/                 # OAuth providers
│   ├── schemas/                   # Zod validation schemas
│   ├── stores/                    # Zustand stores
│   ├── types/                     # TypeScript types
│   ├── ui/
│   │   ├── components/
│   │   ├── sections/
│   │   └── views/
│   ├── utils/                     # Utility functions
│   ├── auth-actions.ts            # Server Actions
│   └── auth-server.ts             # Server-only auth client
├── benefit/                       # Simple domain
│   ├── hooks/
│   │   └── queries/               # TanStack Query options
│   └── ui/
├── cafeteria/                     # Simple domain
│   ├── hooks/
│   │   └── queries/               # TanStack Query options
│   └── ui/
└── user/                          # Simple domain
    ├── constants/
    │   └── query-keys.ts          # Query Key constants ONLY
    ├── hooks/
    │   └── queries/               # TanStack Query options
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
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { auth } from "@/src/domains/auth/auth-server";
import { CafeteriaHomeView } from "@/src/domains/cafeteria/ui/views/cafeteria-home-view";
import { userProfileQueryServer } from "@/src/domains/user/hooks/queries/user-profile.query";
import getQueryClient from "@/src/shared/configs/tanstack-query/get-query-client";

const Page = async ({ params, searchParams }) => {
  const queryClient = getQueryClient();
  const session = await auth.getSession({ refresh: false });

  // Prefetch data using Server Query Factory (토큰 자동 주입)
  await queryClient.prefetchQuery(
    userProfileQueryServer(session!.tokenSet.accessToken)
  );

  // Return View wrapped in HydrationBoundary
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CafeteriaHomeView />
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

// Example: shared/ui/sections/user-welcome-section/index.tsx
"use client";

import { Box } from "@nugudi/react-components-layout";
import { useSuspenseQuery } from "@tanstack/react-query";
import Image from "next/image";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { userProfileQueryClient } from "@/src/domains/user/hooks/queries/user-profile.query";
import * as styles from "./index.css";

// Main Section Component (with boundaries)
export const UserWelcomeSection = () => {
  return (
    <ErrorBoundary fallback={<UserWelcomeSectionError />}>
      <Suspense fallback={<UserWelcomeSectionSkeleton />}>
        <UserWelcomeSectionContent />
      </Suspense>
    </ErrorBoundary>
  );
};

// Skeleton Component (실제 레이아웃과 일치)
const UserWelcomeSectionSkeleton = () => {
  return (
    <Box borderRadius="xl" className={styles.container}>
      <div className={styles.textWrapper}>
        <div className="flex flex-col gap-2">
          <div className="h-7 w-44 animate-pulse rounded bg-zinc-200" />
          <div className="h-7 w-52 animate-pulse rounded bg-zinc-200" />
        </div>
      </div>
      <div
        className="absolute right-[-4px] bottom-[-16px] h-[110px] w-[110px] animate-pulse rounded-lg bg-zinc-100"
        aria-hidden="true"
      />
    </Box>
  );
};

// Error Component (폴백 UI)
const UserWelcomeSectionError = () => {
  return (
    <Box borderRadius="xl" className={styles.container}>
      <div className={styles.textWrapper}>
        <span className={styles.name}>손님</span>님 오늘도 <br />
        맛난 점심식사다 너굴
      </div>
      <Image
        src="/images/level-2-nuguri.png"
        alt="level-2 너구리"
        className={styles.image}
        width={150}
        height={100}
        priority
      />
    </Box>
  );
};

// Content Component (actual data fetching)
const UserWelcomeSectionContent = () => {
  // Page에서 prefetch한 데이터를 동일한 Query로 재사용 (캐시 hit!)
  // HTTP 클라이언트가 자동으로 인증 토큰을 헤더에 추가
  const { data } = useSuspenseQuery(userProfileQueryClient);

  const nickname = data.data.data?.profile?.nickname ?? "손님";
  const profileImageUrl = data.data.data?.profile?.profileImageUrl;

  return (
    <Box borderRadius="xl" className={styles.container}>
      <div className={styles.textWrapper}>
        <span className={styles.name}>{nickname}</span>님 오늘도 <br />
        맛난 점심식사다 너굴
      </div>
      <Image
        src={profileImageUrl ?? "/images/level-2-nuguri.png"}
        alt="level-2 너구리"
        className={styles.image}
        width={150}
        height={100}
        priority
      />
    </Box>
  );
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
    └── user/                              # Domain (simple structure)
        ├── constants/
        │   └── query-keys.ts              # Query Key 상수만 정의 (NOT Query Options)
        ├── hooks/
        │   └── queries/                   # TanStack Query Options 정의
        │       └── user-profile.query.ts  # Server/Client Query Factory
        ├── types/
        │   └── index.ts                   # TypeScript types
        ├── utils/
        │   └── format-points.ts           # Utility functions
        └── ui/
            ├── views/
            │   └── user-profile-view/
            │       ├── index.tsx
            │       └── index.css.ts
            ├── sections/
            │   └── user-profile-section/
            │       └── index.tsx
            └── components/
                └── user-profile-card/
                    ├── index.tsx
                    └── index.css.ts
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

## Hooks Folder Structure

### Query vs. General Hooks 분리

**IMPORTANT**: `hooks/` 폴더 내에서 TanStack Query Options와 일반 커스텀 훅을 명확히 분리합니다.

```
hooks/
├── queries/                        # TanStack Query Options만 정의
│   ├── user-profile.query.ts      # Query Factory (Server/Client)
│   └── user-settings.query.ts
└── use-*.ts                        # 일반 커스텀 훅
    ├── use-user-actions.ts        # UI 로직, 상태 관리
    └── use-user-validation.ts     # Side effects (데이터 fetching 제외)
```

### Query Options 파일 작성 규칙

1. **파일명**: `[feature].query.ts` 형식 사용
2. **Import**: Query Key는 `constants/query-keys.ts`에서 import
3. **Export**: Server Factory (`xxxQueryServer`) + Client Options (`xxxQueryClient`)
4. **캐싱**: 데이터 특성에 맞는 캐싱 전략 설정 (staleTime, gcTime, refetch options)
5. **DRY**: 공통 옵션은 `baseQuery`로 추출하여 재사용

```typescript
// ✅ CORRECT - hooks/queries/user-profile.query.ts
import { getMyProfile } from "@nugudi/api";
import { USER_PROFILE_QUERY_KEY } from "../../constants/query-keys";

// Private: 캐싱 옵션
const USER_PROFILE_QUERY_OPTIONS = {
  staleTime: 10 * 60 * 1000,
  gcTime: 30 * 60 * 1000,
  refetchOnWindowFocus: false,
  refetchOnMount: false,
  refetchOnReconnect: false,
} as const;

// Private: Base Query (공통 부분)
const baseUserProfileQuery = {
  queryKey: USER_PROFILE_QUERY_KEY,
  ...USER_PROFILE_QUERY_OPTIONS,
} as const;

// Public: Server Factory
export const userProfileQueryServer = (accessToken: string) => ({
  ...baseUserProfileQuery,
  queryFn: () =>
    getMyProfile({
      headers: { Authorization: `Bearer ${accessToken}` },
    }),
});

// Public: Client Options
export const userProfileQueryClient = {
  ...baseUserProfileQuery,
  queryFn: () => getMyProfile(),
} as const;
```

### 일반 커스텀 훅 작성 규칙

1. **파일명**: `use-[feature].ts` 형식 사용
2. **Export**: Named export로 `use` prefix 필수
3. **책임**: UI 로직, 상태 관리, Side effects (데이터 fetching은 Query Options에서 처리)
4. **위치**: `hooks/` 폴더 루트 (queries 폴더 밖)

```typescript
// ✅ CORRECT - hooks/use-user-actions.ts
import { useRouter } from "next/navigation";

export const useUserActions = () => {
  const router = useRouter();

  const navigateToProfile = () => {
    router.push("/profile");
  };

  return { navigateToProfile };
};

// ❌ WRONG - 데이터 fetching은 Query Options에서
export const useUserProfile = () => {
  // Don't fetch data here, use useSuspenseQuery with xxxQueryClient instead
  const response = await fetch("/api/user/profile"); // NO!
  return response.json();
};
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

**실제 UserProfile 데이터 흐름 예시**:

```typescript
// 1. Page: Server Query Factory로 Prefetch (SSR)
// File: app/page.tsx
import { userProfileQueryServer } from "@/src/domains/user/hooks/queries/user-profile.query";

const HomePage = async () => {
  const queryClient = getQueryClient();
  const session = await auth.getSession({ refresh: false });

  // Server Query Factory 사용 (토큰 명시적 주입)
  await queryClient.prefetchQuery(
    userProfileQueryServer(session!.tokenSet.accessToken)
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CafeteriaHomeView />
    </HydrationBoundary>
  );
};

// 2. View: Section 조합
// File: domains/cafeteria/home/ui/views/cafeteria-home-view/index.tsx
export const CafeteriaHomeView = () => {
  return (
    <Flex direction="column" gap={16}>
      <UserWelcomeSection /> {/* User 도메인 Section 사용 */}
      <CafeteriaListSection />
    </Flex>
  );
};

// 3. Section: Client Query Options로 캐시 재사용
// File: shared/ui/sections/user-welcome-section/index.tsx
import { userProfileQueryClient } from "@/src/domains/user/hooks/queries/user-profile.query";

const UserWelcomeSectionContent = () => {
  // Page에서 prefetch한 데이터를 동일한 Query Key로 조회 (캐시 hit!)
  const { data } = useSuspenseQuery(userProfileQueryClient);

  const nickname = data.data.data?.profile?.nickname ?? "손님";

  return <WelcomeMessage nickname={nickname} />;
};

// 4. Component: Pure UI rendering
// File: shared/ui/components/welcome-message/index.tsx
export const WelcomeMessage = ({ nickname }: { nickname: string }) => {
  return <span>{nickname}님 환영합니다</span>;
};
```

**핵심 포인트**:
- Page에서 1번의 API 호출 (prefetch)
- Section에서 캐시 재사용 (추가 네트워크 요청 없음)
- Component는 순수 UI만 담당

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

## TanStack Query Pattern

### Query Key와 Query Options 분리 규칙

**IMPORTANT**: Query Key와 Query Options는 명확히 분리하여 관리합니다.

```typescript
// ✅ CORRECT - constants/query-keys.ts (Query Key만 정의)
export const USER_PROFILE_QUERY_KEY = ["user", "profile", "me"] as const;

// ✅ CORRECT - hooks/queries/user-profile.query.ts (Query Options 정의)
import { getMyProfile } from "@nugudi/api";
import { USER_PROFILE_QUERY_KEY } from "../../constants/query-keys";

// 캐싱 옵션 (private, 재사용)
const USER_PROFILE_QUERY_OPTIONS = {
  staleTime: 10 * 60 * 1000,
  gcTime: 30 * 60 * 1000,
  refetchOnWindowFocus: false,
  refetchOnMount: false,
  refetchOnReconnect: false,
} as const;

// Base Query (공통 부분 추출)
const baseUserProfileQuery = {
  queryKey: USER_PROFILE_QUERY_KEY,
  ...USER_PROFILE_QUERY_OPTIONS,
} as const;

// Server-side용: 토큰 주입 Factory
export const userProfileQueryServer = (accessToken: string) => ({
  ...baseUserProfileQuery,
  queryFn: () =>
    getMyProfile({
      headers: { Authorization: `Bearer ${accessToken}` },
    }),
});

// Client-side용: 토큰 자동 주입 (HTTP 클라이언트가 처리)
export const userProfileQueryClient = {
  ...baseUserProfileQuery,
  queryFn: () => getMyProfile(),
} as const;
```

### 사용 패턴

```typescript
// Page (Server Component) - userProfileQueryServer 사용
import { userProfileQueryServer } from "@/src/domains/user/hooks/queries/user-profile.query";

const Page = async () => {
  const session = await auth.getSession({ refresh: false });

  await queryClient.prefetchQuery(
    userProfileQueryServer(session!.tokenSet.accessToken)
  );

  return <HydrationBoundary state={dehydrate(queryClient)}>...</HydrationBoundary>;
};

// Section Content (Client Component) - userProfileQueryClient 사용
import { userProfileQueryClient } from "@/src/domains/user/hooks/queries/user-profile.query";

const SectionContent = () => {
  const { data } = useSuspenseQuery(userProfileQueryClient);
  return <Component data={data} />;
};

// Infinite Scroll 패턴 (필터 파라미터 포함)
const CafeteriaListSectionContent = ({ filter }: { filter: string }) => {
  const { data, fetchNextPage, hasNextPage } = useSuspenseInfiniteQuery({
    // queryKey에 필터 파라미터 포함 (각 필터별 별도 캐시)
    queryKey: ["cafeterias", filter],
    queryFn: ({ pageParam }) =>
      getCafeteriaList({ filter, page: pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const hasNext = lastPage.data.hasNext;
      return hasNext ? lastPage.data.nextPage : undefined;
    },
  });

  const cafeterias = data.pages.flatMap((page) => page.data.items);

  return (
    <div>
      <CafeteriaList items={cafeterias} />
      {hasNextPage && (
        <button onClick={() => fetchNextPage()}>더 보기</button>
      )}
    </div>
  );
};
```

### 네이밍 규칙

- **Query Key 상수**: `[DOMAIN]_[FEATURE]_QUERY_KEY`
- **Server Factory**: `[feature]QueryServer(token)` - 함수
- **Client Options**: `[feature]QueryClient` - 객체
- **Base Query**: `base[Feature]Query` - private

## Best Practices Summary

1. **Route Groups**: Use `(auth)` for protected pages, `(public)` for public pages
2. **Page**: Server-side data prefetching only (`app/(auth|public)/[domain]/page.tsx`)
3. **View**: Layout composition only (`domains/[domain]/[feature?]/ui/views/`)
4. **Section**: Business logic + Error/Loading boundaries (`ui/sections/`)
5. **Component**: Pure UI components (`ui/components/`)
6. **Always use** Suspense + ErrorBoundary in Sections
7. **Never skip** the hierarchy (Page → View → Section → Component)
8. **Keep components** pure and reusable
9. **Domain Structure**: Complex domains CAN use flat structure (auth) OR sub-features. Simple domains use flat structure (benefit, user)
10. **Name consistently** following the patterns above
11. **Separate concerns** strictly between layers
12. **Each component** must be in its own folder with `index.tsx` and `index.css.ts`
13. **Domain logic** (stores, schemas, types) stays outside the `ui/` folder
14. **Use Vanilla Extract** with `vars` and `classes` from `@nugudi/themes`
15. **Always prefer** existing packages from `@nugudi/*` namespace
16. **Client Components**: Add `"use client"` when using event handlers or hooks
17. **Follow monorepo** import conventions from packages.md
18. **TanStack Query**: Separate Query Keys (`constants/`) from Query Options (`hooks/queries/`)
19. **Query Naming**: Use `xxxQueryServer(token)` for Server, `xxxQueryClient` for Client
20. **Query Structure**: Extract common parts to `baseQuery`, use factory pattern for token injection

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
