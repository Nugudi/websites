---
description: Component layer, data flow patterns, import conventions, TanStack Query usage
globs:
  - "**/presentation/ui/components/**/*.tsx"
  - "**/presentation/ui/components/**/*.ts"
  - "**/presentation/hooks/**/*.ts"
alwaysApply: true
---

# Component Layer & Data Flow Rules

## Component Layer

**Type**: Client or Server Component
**Purpose**: Reusable, presentational UI components

### MUST Rules

1. **MUST be pure/presentational** — Components only render UI, no side effects or data fetching
2. **MUST accept data via props** — All data comes from parent components through props
3. **MUST emit events via callback props** — Use callback props (e.g., `onClick`, `onSubmit`) for user interactions
4. **MUST be reusable** — Components should work in any context with the same props
5. **MUST use named export** — Components use named export (e.g., `export const UserProfileCard`)
6. **MUST have minimal or no state** — Only UI state (e.g., `isOpen`, `isHovered`), no business state

### NEVER Rules

1. **NEVER fetch data** — Components never call APIs, UseCases, or use TanStack Query
2. **NEVER use DI Container** — Components don't fetch data, so no Container needed
3. **NEVER contain business logic** — Business logic belongs in Domain layer (UseCases)
4. **NEVER know about routes** — Components are route-agnostic, no `useRouter` or navigation
5. **NEVER import Sections or Views** — Components are the lowest layer in presentation hierarchy
6. **NEVER manage complex state** — Complex state belongs in Sections or use Zustand stores

### Example: Correct Component

```typescript
// ✅ CORRECT Component Implementation
// domains/user/presentation/ui/components/user-profile-card/index.tsx
import { Box } from "@nugudi/react-components-layout";
import { Avatar } from "@nugudi/react-components-avatar";
import * as styles from "./index.css";

interface UserProfileCardProps {
  nickname: string;
  profileImageUrl?: string;
  level: number;
  onEditClick: () => void;
}

export const UserProfileCard = ({
  nickname,
  profileImageUrl,
  level,
  onEditClick
}: UserProfileCardProps) => {
  return (
    <Box className={styles.container}>
      <Avatar src={profileImageUrl} alt={nickname} size="large" />
      <div className={styles.info}>
        <h3 className={styles.nickname}>{nickname}</h3>
        <span className={styles.level}>Lv. {level}</span>
      </div>
      <button onClick={onEditClick} className={styles.editButton}>
        편집
      </button>
    </Box>
  );
};
```

### Example: Wrong Patterns

```typescript
// ❌ WRONG Examples
export const UserProfileCard = () => {
  const container = getUserClientContainer(); // ❌ Components don't use Container
  const { data } = useSuspenseQuery(...); // ❌ Components don't fetch data
  const router = useRouter(); // ❌ Components don't handle routing

  const handleEdit = () => {
    router.push('/profile/edit'); // ❌ Components don't navigate
  };

  return <Box>{data.nickname}</Box>; // ❌ Data should come from props
};
```

## Data Flow Patterns

### Server → Client Data Flow

```typescript
// 1. Page: Server Container + Prefetch (SSR)
// File: app/page.tsx
import { createUserServerContainer } from '@/src/domains/user/di/user-server-container';

const HomePage = async () => {
  const queryClient = getQueryClient();
  const container = createUserServerContainer();
  const getMyProfileUseCase = container.getGetMyProfile();

  await queryClient.prefetchQuery({
    queryKey: ['user', 'profile'],
    queryFn: () => getMyProfileUseCase.execute(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CafeteriaHomeView />
    </HydrationBoundary>
  );
};

// 2. View: Section composition
export const CafeteriaHomeView = () => {
  return (
    <Flex direction='column' gap={16}>
      <UserWelcomeSection />
      <CafeteriaListSection />
    </Flex>
  );
};

// 3. Section: Client Container + Cache reuse
import { getUserClientContainer } from '@/src/domains/user/di/user-client-container';

const UserWelcomeSectionContent = () => {
  const container = getUserClientContainer();
  const getMyProfileUseCase = container.getGetMyProfile();

  // Reuses Page's prefetched data (cache hit!)
  const { data } = useSuspenseQuery({
    queryKey: ['user', 'profile'], // Same key as Page
    queryFn: () => getMyProfileUseCase.execute(),
  });

  return <WelcomeMessage nickname={data.profile?.nickname ?? '손님'} />;
};

// 4. Component: Pure UI rendering
export const WelcomeMessage = ({ nickname }: { nickname: string }) => {
  return <span>{nickname}님 환영합니다</span>;
};
```

### Key Points

- **Server Container**: Page Layer uses `createXXXServerContainer()` (new instance per request)
- **Client Container**: Section/Component uses `getXXXClientContainer()` (Singleton)
- **UseCase Layer**: Business logic + Repository calls
- **Auto Token Injection**: DI Container handles via AuthenticatedHttpClient
- **Cache Reuse**: Page prefetches once, Section reuses from cache (no additional network calls)

### Layer Responsibilities

| Layer | Environment | DI Container | Responsibility |
|-------|-------------|--------------|----------------|
| **Page** | Server | `createXXXServerContainer()` | SSR data prefetch |
| **UseCase** | Both | Injected from Container | Business logic + Repository calls |
| **Repository** | Both | Injected from Container | Pure data access (HttpClient) |
| **Section** | Client | `getXXXClientContainer()` | Cache reuse + UI state |
| **Component** | Both | - | Pure UI rendering (Props only) |

## TanStack Query Hooks

### Query Hook Structure

**Location**: `presentation/hooks/queries/get-[feature].query.ts`
**Pattern**: `useGet[Feature]`

```typescript
// ✅ CORRECT - Query Hook
// File: presentation/hooks/queries/get-user-profile.query.ts
import { useQuery } from '@tanstack/react-query';
import { getUserClientContainer } from '@/src/domains/user/di/user-client-container';
import { USER_PROFILE_QUERY_KEY } from '../../constants/query-keys';

export const useGetUserProfile = () => {
  const container = getUserClientContainer();
  const getMyProfileUseCase = container.getGetMyProfile();

  return useQuery({
    queryKey: USER_PROFILE_QUERY_KEY,
    queryFn: () => getMyProfileUseCase.execute(),
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};
```

### With Adapter (Complex Transformation)

```typescript
// ✅ CORRECT - Query Hook with Adapter
import { BenefitAdapter } from '../../adapters/benefit.adapter';

export const useGetBenefitList = () => {
  const container = getBenefitClientContainer();
  const getBenefitListUseCase = container.getGetBenefitList();

  return useQuery({
    queryKey: BENEFIT_LIST_QUERY_KEY,
    queryFn: async () => {
      const result = await getBenefitListUseCase.execute();
      return BenefitAdapter.benefitListToUi(result); // Entity → UI Type
    },
    staleTime: 5 * 60 * 1000,
  });
};
```

### Query Key Constants

**Location**: `presentation/constants/query-keys.ts`

```typescript
// ✅ CORRECT - Query Key constants
export const USER_PROFILE_QUERY_KEY = ['user', 'profile', 'me'] as const;
export const BENEFIT_LIST_QUERY_KEY = ['benefits', 'list'] as const;
export const CAFETERIA_LIST_QUERY_KEY = ['cafeterias', 'list'] as const;
```

### Hooks Folder Structure

```
presentation/hooks/
├── queries/                        # TanStack Query hooks
│   ├── get-user-profile.query.ts
│   └── get-benefit-list.query.ts
└── use-*.ts                        # General hooks
    ├── use-user-actions.ts
    └── use-user-validation.ts
```

## Import Patterns

### Within Same Domain

```typescript
// ✅ CORRECT - Relative imports within same domain
// From: domains/auth/presentation/ui/views/sign-up-view/index.tsx
import { SignUpSection } from '../../sections/sign-up-section';

// From: domains/auth/presentation/ui/sections/sign-up-section/index.tsx
import { SignUpForm } from '../../components/sign-up-form';
import { useSignUpStore } from '../../../stores/use-sign-up-store';
import type { SignUpFormData } from '../../../types/sign-up';

// ❌ WRONG - Absolute imports within same domain
import { SignUpSection } from '@/src/domains/auth/presentation/ui/sections/sign-up-section';
```

### From Page to View

```typescript
// ✅ CORRECT - Pages use absolute imports for views
// app/(public)/auth/sign-up/page.tsx
import { SignUpView } from '@/src/domains/auth/presentation/ui/views/sign-up-view';

// app/(auth)/profile/page.tsx
import { ProfilePageView } from '@/src/domains/user/presentation/ui/views/profile-page-view';
```

### Cross-Domain

```typescript
// ✅ CORRECT - Absolute imports for cross-domain
// In: domains/cafeteria/...
import { useAuth } from '@/src/domains/auth/presentation/hooks/use-auth';
import { LoginWelcome } from '@/src/domains/auth/presentation/ui/components/login-welcome';

// ❌ WRONG - Relative imports for cross-domain
import { useAuth } from '../../../auth/presentation/hooks/use-auth';
```

### Packages

```typescript
// ✅ CORRECT - Package imports (ALWAYS absolute)
import { Button } from '@nugudi/react-components-button';
import { Box, Flex, VStack } from '@nugudi/react-components-layout';
import { vars } from '@nugudi/themes';
import { AppleIcon, HeartIcon } from '@nugudi/assets-icons';
```

## Design Tokens

**MUST** use `vars` from `@nugudi/themes`:

```typescript
import { vars } from '@nugudi/themes';

// ✅ CORRECT
vars.colors.$scale.zinc[500]
vars.box.spacing[16]
vars.box.radii.lg
vars.box.shadows.sm

// ❌ WRONG
color: '#71717a'
padding: '16px'
borderRadius: '12px'
```

## State Management

```
- Page: URL state only (params, searchParams)
- View: Page-level UI state (active tab, etc.)
- Section: Feature-specific state
- Component: UI-only state (isOpen, isHovered)
```

## Quick Reference

| File Type | Export Pattern | Import Pattern |
|-----------|----------------|----------------|
| **Pages** | `export default` | Absolute to Views |
| **Views** | `export const` | Relative to Sections |
| **Sections** | `export const` | Relative to Components |
| **Components** | `export const` | Receive data via props |
| **Hooks** | `export const` | Relative within domain |

---

**Related**: See `patterns/hooks-guide.md` for Query Hooks, `ddd/adapters.md` for Entity → UI transformation
