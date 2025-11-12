---
description: Package usage guidelines, import conventions, and component patterns
globs:
  - '**/*.tsx'
  - '**/*.ts'
alwaysApply: true
---

# Package Usage Guidelines

> **Document Type**: Package Import & Usage Guide
> **Target Audience**: All developers
> **Related Documents**:
> - [monorepo-structure.md](./monorepo-structure.md) — Monorepo architecture and DDD structure
> - [package-setup.md](./package-setup.md) — Package setup requirements
> - [../frontend.md](../frontend.md) — Frontend component architecture
> - [../ddd/di-server-containers.md](../ddd/di-server-containers.md) — Server-side DI Container patterns
> - [../ddd/di-client-containers.md](../ddd/di-client-containers.md) — Client-side DI Container patterns
> **Last Updated**: 2025-11-11

## 📦 Package Usage Guidelines

### 🎯 PRIORITY: Layout & Typography Components

#### 🚨 MUST USE: Layout Components First (`@nugudi/react-components-layout`)

**ALWAYS use these layout components BEFORE creating custom styles:**

```typescript
// ✅ CORRECT - Use layout components for structure
import {
  Box,
  Flex,
  VStack,
  HStack,
  Stack,
  Grid,
  GridItem,
  Divider,
} from '@nugudi/react-components-layout';

// ❌ WRONG - Don't create custom layouts with vanilla extract
const customLayout = style({ display: 'flex' }); // NO! Use Flex instead
```

##### Layout Component Usage Guide

| Component    | Use Case                | Props                                  | Example                                              |
| ------------ | ----------------------- | -------------------------------------- | ---------------------------------------------------- |
| **Box**      | Basic container/wrapper | All style props                        | `<Box padding={16} margin={8}>`                      |
| **Flex**     | Flexbox layouts         | `direction`, `justify`, `align`, `gap` | `<Flex justify="space-between" align="center">`      |
| **VStack**   | Vertical stacking       | `spacing`, `align`                     | `<VStack spacing={16}>` (children stack vertically)  |
| **HStack**   | Horizontal stacking     | `spacing`, `align`                     | `<HStack spacing={8}>` (children stack horizontally) |
| **Stack**    | Generic stacking        | `direction`, `spacing`                 | `<Stack direction="row" spacing={12}>`               |
| **Grid**     | CSS Grid layouts        | `templateColumns`, `gap`               | `<Grid templateColumns="1fr 2fr" gap={16}>`          |
| **GridItem** | Grid children           | `colSpan`, `rowSpan`                   | `<GridItem colSpan={2}>`                             |
| **Divider**  | Visual separator        | `orientation`, `color`                 | `<Divider orientation="horizontal" />`               |

##### 🆕 Spacing & Size System (Direct Pixel Values)

**IMPORTANT**: Layout components now accept direct pixel values instead of spacing tokens:

```typescript
// ✅ NEW SYSTEM - Direct pixel values
<Box padding={20} margin={16}>        // 20px padding, 16px margin
<VStack spacing={24}>                  // 24px gap between children
<Flex gap={32}>                        // 32px gap

// Numbers are treated as pixels
<Box p={10} m={20}>                    // 10px padding, 20px margin
<Box width={300} height={150}>         // 300px width, 150px height

// Special keywords work as expected
<Box width="full" height="auto">       // 100% width, auto height
<Box width="screen">                   // 100vw width
<Box width="50%" height="100vh">       // Percentage and viewport units

// TypeScript autocomplete for common values
<Box width="">  // Autocompletes: "full", "auto", "screen", "min", "max", "fit"
<Box gap="">    // Autocompletes: "auto", template literals like "10px", "2rem"
```

**Size Keywords**:

- `"full"` → `100%`
- `"screen"` → `100vw`
- `"auto"` → `auto`
- `"min"` → `min-content`
- `"max"` → `max-content`
- `"fit"` → `fit-content`

**All Spacing Props Accept Pixels**:

- Margin: `m`, `margin`, `mt`, `mr`, `mb`, `ml`, `mX`, `mY`
- Padding: `p`, `padding`, `pt`, `pr`, `pb`, `pl`, `pX`, `pY`
- Gap: `gap`, `columnGap`, `rowGap`
- Size: `width`, `w`, `height`, `h`, `size`, `minWidth`, `maxWidth`, etc.

##### Common Layout Patterns

```typescript
// Page wrapper
<Box padding={24}>
  <VStack spacing={32}>
    {/* Page content */}
  </VStack>
</Box>

// Card layout
<Box padding={16} borderRadius="lg" backgroundColor="white">
  <VStack spacing={12}>
    {/* Card content */}
  </VStack>
</Box>

// Header with actions
<Flex justify="space-between" align="center" padding={16}>
  <Title fontSize="t1">Page Title</Title>
  <HStack spacing={8}>
    <Button>Action 1</Button>
    <Button>Action 2</Button>
  </HStack>
</Flex>

// Responsive grid
<Grid
  templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }}
  gap={16}
>
  <GridItem>{/* Item 1 */}</GridItem>
  <GridItem>{/* Item 2 */}</GridItem>
  <GridItem>{/* Item 3 */}</GridItem>
</Grid>
```

#### 🚨 MUST USE: Typography Components (`@nugudi/react-components-layout`)

**NEVER use HTML heading tags directly. ALWAYS use typography components:**

```typescript
// ✅ CORRECT - Use typography components
import { Heading, Title, Body, Emphasis, Logo } from '@nugudi/react-components-layout';

// ❌ WRONG - Don't use HTML tags directly
<h1>Title</h1>  // NO! Use <Heading fontSize="h1">
<p>Text</p>     // NO! Use <Body fontSize="b1">
<span>Note</span> // NO! Use <Emphasis fontSize="e1">
```

##### Typography Component Usage Guide

| Component    | Use Case            | fontSize Options                                                                         | Semantic HTML             | Example                                          |
| ------------ | ------------------- | ---------------------------------------------------------------------------------------- | ------------------------- | ------------------------------------------------ |
| **Logo**     | Brand/App name      | `l1` (34px), `l2` (20px)                                                                 | `as="h1"` or `as="span"`  | `<Logo fontSize="l1">너구디</Logo>`              |
| **Heading**  | Page titles         | `h1` (30px)                                                                              | `as="h1"` (default)       | `<Heading fontSize="h1">페이지 제목</Heading>`   |
| **Title**    | Section titles      | `t1` (28px), `t2` (22px), `t3` (20px)                                                    | `as="h2"`, `as="h3"`      | `<Title fontSize="t2" as="h2">섹션 제목</Title>` |
| **Body**     | Body text           | `b1` (17px), `b2` (16px), `b3` (15px), `b3b` (15px bold), `b4` (13px), `b4b` (13px bold) | `as="p"`, `as="span"`     | `<Body fontSize="b2">본문 텍스트</Body>`         |
| **Emphasis** | Small text/captions | `e1` (12px), `e2` (11px)                                                                 | `as="span"`, `as="small"` | `<Emphasis fontSize="e1">캡션</Emphasis>`        |

##### Typography Usage by Context

```typescript
// App header/brand
<Logo fontSize="l1" as="h1">너구디</Logo>
<Logo fontSize="l2" as="span">NUGUDI</Logo>

// Page structure
<Heading fontSize="h1">마이페이지</Heading>  // Main page title

// Section titles
<Title fontSize="t1" as="h2">프로필 정보</Title>  // Major section
<Title fontSize="t2" as="h3">기본 정보</Title>    // Subsection
<Title fontSize="t3" as="h4">연락처</Title>       // Minor subsection

// Content
<Body fontSize="b1">중요한 본문 내용입니다.</Body>           // Primary body text
<Body fontSize="b2">일반적인 설명 텍스트입니다.</Body>       // Regular body text
<Body fontSize="b3">추가 정보나 부가 설명입니다.</Body>       // Secondary text
<Body fontSize="b3b">강조된 작은 텍스트입니다.</Body>        // Bold small text
<Body fontSize="b4">작은 안내 텍스트입니다.</Body>           // Small text
<Body fontSize="b4b">작고 강조된 레이블입니다.</Body>        // Bold label

// Captions and metadata
<Emphasis fontSize="e1">2024년 1월 15일</Emphasis>  // Date, time
<Emphasis fontSize="e2">© 2024 Nugudi</Emphasis>    // Copyright, fine print
```

##### Complete Example: Combining Layout & Typography

```typescript
import {
  Box,
  Flex,
  VStack,
  HStack,
  Divider,
} from '@nugudi/react-components-layout';
import {
  Heading,
  Title,
  Body,
  Emphasis,
} from '@nugudi/react-components-layout';

// Example: User profile card
export const ProfileCard = () => {
  return (
    <Box padding={24} borderRadius='lg'>
      <VStack spacing={20}>
        {/* Header */}
        <Heading fontSize='h1'>사용자 프로필</Heading>

        <Divider />

        {/* Content sections */}
        <VStack spacing={16}>
          <Box>
            <Title fontSize='t2' as='h2'>
              기본 정보
            </Title>
            <VStack spacing={8} marginTop={8}>
              <Body fontSize='b2'>홍길동</Body>
              <Body fontSize='b3' color='zinc'>
                소프트웨어 엔지니어
              </Body>
            </VStack>
          </Box>

          <Box>
            <Title fontSize='t3' as='h3'>
              연락처
            </Title>
            <VStack spacing={4} marginTop={8}>
              <Body fontSize='b3'>email@example.com</Body>
              <Body fontSize='b3'>010-1234-5678</Body>
            </VStack>
          </Box>
        </VStack>

        {/* Footer */}
        <Emphasis fontSize='e1' color='zinc'>
          마지막 업데이트: 2024년 1월 15일
        </Emphasis>
      </VStack>
    </Box>
  );
};
```

#### Priority Order for Layout Development

1. **FIRST**: Check if `@nugudi/react-components-layout` has the component you need
2. **SECOND**: Use layout components (Box, Flex, VStack, etc.) for structure
3. **THIRD**: Use typography components (Heading, Title, Body, etc.) for text
4. **LAST RESORT**: Only create custom styles with vanilla extract if no existing component works

---

### React Components (`@nugudi/react-components-*`)

```typescript
// Individual component imports - All use named exports
import { Button } from '@nugudi/react-components-button';
import { Input } from '@nugudi/react-components-input';
import { Chip } from '@nugudi/react-components-chip';
import { NavigationItem } from '@nugudi/react-components-navigation-item';
import { Switch } from '@nugudi/react-components-switch';
import { Tab } from '@nugudi/react-components-tab';
import { Textarea } from '@nugudi/react-components-textarea';
import { InputOTP } from '@nugudi/react-components-input-otp';
import { StepIndicator } from '@nugudi/react-components-step-indicator';
import { MenuCard } from '@nugudi/react-components-menu-card';
import { BottomSheet } from '@nugudi/react-components-bottom-sheet';
import { Backdrop } from '@nugudi/react-components-backdrop';

// NavigationItem usage example
<NavigationItem
  leftIcon={<CoinIcon />}
  rightIcon={<ArrowRightIcon />}
  onClick={() => console.log('clicked')}
>
  <div>Content with title and description</div>
</NavigationItem>;
```

---

### React Hooks (`@nugudi/react-hooks-*`)

```typescript
// Individual hook imports
import { useButton, useToggleButton } from '@nugudi/react-hooks-button';
import { useSwitch, useToggleSwitch } from '@nugudi/react-hooks-switch';
import { useToggle } from '@nugudi/react-hooks-toggle';
import { useStepper } from '@nugudi/react-hooks-use-stepper';
```

---

### ~~API Client~~ → DI Container + UseCases (DEPRECATED)

> **⚠️ IMPORTANT**: The `@nugudi/api` package has been **completely removed** from this project.
>
> **Migration Required**: All API calls must now go through the **Clean Architecture** pattern:
> **Repository** (Data Layer) → **UseCase** (Domain Layer) → **DI Container** (Dependency Injection)

#### Why This Change?

1. **Clean Architecture Compliance**: Separates business logic (UseCase) from data access (Repository)
2. **Better Testability**: Each layer can be tested independently with proper mocks
3. **Dependency Inversion**: High-level modules don't depend on low-level modules
4. **Domain-Driven Design**: Each domain manages its own data access patterns

#### Migration Pattern

```typescript
// ❌ OLD (REMOVED - This will NOT work)
import { api } from '@nugudi/api';
const response = await api.users.getProfile(userId);

// ✅ NEW - Server-side (in Page Components or Server Actions)
import { createUserServerContainer } from '@/domains/user/di/user-server-container';

const container = createUserServerContainer(); // Creates NEW instance per request
const getMyProfileUseCase = container.getGetMyProfile();
const profile = await getMyProfileUseCase.execute();

// ✅ NEW - Client-side (in Client Components with TanStack Query)
import { getUserClientContainer } from '@/domains/user/di/user-client-container';
import { useSuspenseQuery } from '@tanstack/react-query';

const container = getUserClientContainer(); // Returns singleton instance
const getMyProfileUseCase = container.getGetMyProfile();

const { data: profile } = useSuspenseQuery({
  queryKey: ['user', 'profile', 'me'],
  queryFn: () => getMyProfileUseCase.execute(),
});
```

#### Complete Migration Steps

1. **Identify the API call** you want to migrate (e.g., `api.users.getProfile()`)
2. **Find or create the UseCase** in the domain layer (e.g., `GetMyProfileUseCase`)
3. **Add UseCase to DI Container** getter method (e.g., `container.getGetMyProfile()`)
4. **Use Server DI Container** in Pages/Server Actions (stateless, per-request)
5. **Use Client DI Container** in Client Components (singleton, lazy-initialized)

**See `../migration-guide.md` for detailed migration examples.**

---

### Types Package (`@nugudi/types`)

**NEW**: Shared TypeScript types across the monorepo

```typescript
// Shared types for multiple packages
import type { ApiResponse, ErrorResponse } from '@nugudi/types';
```

---

### Themes (`@nugudi/themes`)

#### Design Foundation Structure

**vars** - Design tokens available:

```typescript
// Colors
vars.colors.$static       // Static colors
vars.colors.$scale        // Color scales
  - whiteAlpha[100, 200, 300, 400, 500, 600, 700, 800, 900]
  - blackAlpha[100, 200, 300, 400, 500, 600, 700, 800, 900]
  - zinc[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
  - red, yellow, main, blue, purple, etc. (same scale)

// Spacing
vars.box.spacing[0, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64]

// Border Radius
vars.box.radii
  - none, sm, md, lg, xl, 2xl, 3xl, full

// Shadows
vars.box.shadows
  - xs, sm, md, lg, xl, 2xl, inner

// Typography
vars.typography.fontSize
vars.typography.fontWeight
vars.typography.lineHeight
```

**classes** - Pre-defined utility classes:

```typescript
// Common classes available
classes.container;
classes.flexCenter;
classes.stack;
// Check the actual theme package for full list
```

#### Usage Example

```typescript
import { vars, classes } from '@nugudi/themes';
import { style } from '@vanilla-extract/css';

// Use pre-defined classes when available
export const container = classes.container;

// Use design tokens for custom styles
export const customCard = style({
  backgroundColor: vars.colors.$scale.whiteAlpha[100],
  borderRadius: vars.box.radii.lg,
  padding: vars.box.spacing[16],
  boxShadow: vars.box.shadows.sm,
});
```

---

### Assets (`@nugudi/assets-icons`)

```typescript
// Icon components - Import individual icons directly
import { AppleIcon, HeartIcon, CalendarIcon } from '@nugudi/assets-icons';
import { ChevronRightIcon, ArrowRightIcon } from '@nugudi/assets-icons';
import { CoinIcon } from '@nugudi/assets-icons';

// Use icons as components
<AppleIcon />
<HeartIcon />
<CalendarIcon />
<ChevronRightIcon />

// Example usage in NavigationItem
<NavigationItem
  leftIcon={<CoinIcon />}
  rightIcon={<ArrowRightIcon />}
>
  Content
</NavigationItem>
```

---

## 🎨 Styling Guidelines

### 🚨 CRITICAL: Style Priority Rules

**YOU MUST check and use existing styles in this EXACT order:**

1. **FIRST - Check `classes`**: Always check if a pre-defined class exists
   - `classes.container`, `classes.flexCenter`, etc.
2. **SECOND - Use `vars`**: Use design tokens for all style properties
   - Colors: `vars.colors.$scale.zinc[500]` NOT `#6B7280`
   - Spacing: `vars.box.spacing[16]` NOT `16px`
   - Radius: `vars.box.radii.lg` NOT `12px`
   - Shadows: `vars.box.shadows.sm` NOT custom shadows
3. **LAST - Custom values**: Only for specific requirements
   - Specific widths/heights: `width: "149px"` (when design requires exact size)

**❌ NEVER use hard-coded values when vars exist!**

### Vanilla Extract Usage

```typescript
// ✅ CORRECT - Always prioritize existing theme values
// index.css.ts
import { style } from '@vanilla-extract/css';
import { vars, classes } from '@nugudi/themes';

// FIRST: Check if there's a pre-defined class
export const container = classes.container; // If exists

// SECOND: Use design tokens from vars
export const customCard = style({
  // Always use vars for consistent design
  padding: vars.box.spacing[16], // NOT: padding: '16px'
  borderRadius: vars.box.radii.lg, // NOT: borderRadius: '12px'
  backgroundColor: vars.colors.$scale.whiteAlpha[100], // NOT: backgroundColor: 'white'
  boxShadow: vars.box.shadows.sm, // NOT: boxShadow: '0 1px 3px rgba(0,0,0,0.1)'

  // Only use custom values when absolutely necessary
  width: '149px', // OK if specific requirement
});

// Component file
import * as styles from './index.css';

<div className={styles.customCard}>Content</div>;
```

### CSS Modules for App-specific Styles

```css
/* page.module.css */
.container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
```

---

## 🔌 Backend Integration with DI Containers

### Server-Side Data Fetching (Pages, Server Actions)

```typescript
// app/(auth)/profile/page.tsx
import { createUserServerContainer } from '@/src/domains/user/di/user-server-container';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import getQueryClient from '@core/infrastructure/configs/tanstack-query/get-query-client';

const ProfilePage = async () => {
  // 1. DI Container로 UseCase 획득
  const container = createUserServerContainer();
  const getMyProfileUseCase = container.getGetMyProfile();

  // 2. 서버사이드에서 데이터 prefetch
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['user', 'profile'],
    queryFn: () => getMyProfileUseCase.execute(),
  });

  // 3. HydrationBoundary로 클라이언트에 전달
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProfileView />
    </HydrationBoundary>
  );
};

export default ProfilePage;
```

### Client-Side Data Fetching (Client Components)

```typescript
// domains/user/presentation/sections/user-profile-section/index.tsx
'use client';
import { getUserClientContainer } from '@/src/domains/user/di/user-client-container';
import { useSuspenseQuery } from '@tanstack/react-query';

const UserProfileSectionContent = () => {
  // 1. 클라이언트 컨테이너 사용 (Lazy-initialized singleton)
  const container = getUserClientContainer();
  const getMyProfileUseCase = container.getGetMyProfile();

  // 2. TanStack Query로 데이터 조회 (Page에서 prefetch한 데이터 재사용)
  const { data } = useSuspenseQuery({
    queryKey: ['user', 'profile'],
    queryFn: () => getMyProfileUseCase.execute(),
  });

  return <div>{data.profile.nickname}</div>;
};
```

### Server Action with DI Container

```typescript
// domains/auth/infrastructure/actions/auth-actions.ts
'use server';
import { createAuthServerContainer } from '@/src/domains/auth/di/auth-server-container';

export async function loginWithGoogle(code: string) {
  const container = createAuthServerContainer();
  const loginWithOAuthUseCase = container.getLoginWithOAuth();

  const result = await loginWithOAuthUseCase.execute({
    provider: 'google',
    code,
    redirectUri: '/auth/callback/google',
  });

  return result;
}
```

### Form Handling with React Hook Form

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signUpSchema } from '../schemas/sign-up-schema';

const form = useForm({
  resolver: zodResolver(signUpSchema),
  defaultValues: {
    email: '',
    password: '',
  },
});
```

---

## 🧹 Code Quality with Biome

### Biome Configuration

```bash
# Format code
pnpm biome format --write .

# Lint code
pnpm biome lint --write .

# Check everything
pnpm biome check --write .
```

### Biome Rules

- **Import sorting**: Automatic with Biome
- **Formatting**: Consistent across monorepo
- **Linting**: Strict TypeScript rules
- **NO ESLint/Prettier**: Biome handles everything

---

## 📚 Package Documentation

### Available Packages

```typescript
// Component Packages
@nugudi/react-components-button
@nugudi/react-components-input
@nugudi/react-components-chip
@nugudi/react-components-layout
@nugudi/react-components-navigation-item
@nugudi/react-components-switch
@nugudi/react-components-tab
@nugudi/react-components-textarea
@nugudi/react-components-input-otp
@nugudi/react-components-step-indicator
@nugudi/react-components-menu-card
@nugudi/react-components-bottom-sheet
@nugudi/react-components-backdrop

// Hook Packages
@nugudi/react-hooks-button
@nugudi/react-hooks-switch
@nugudi/react-hooks-toggle
@nugudi/react-hooks-use-stepper

// Core Packages
@nugudi/types                // 🆕 Shared TypeScript types
@nugudi/themes               // Design tokens
@nugudi/assets-icons         // Icon components
@nugudi/ui                   // Storybook UI documentation
```

### Import Examples

```typescript
// Component usage - All named exports
import { Button } from '@nugudi/react-components-button';
import { Box, Flex } from '@nugudi/react-components-layout';

// Hook usage
import { useToggle } from '@nugudi/react-hooks-toggle';
import { useStepper } from '@nugudi/react-hooks-use-stepper';

// Types usage
import type { ApiResponse } from '@nugudi/types';

// Theme usage
import { vars } from '@nugudi/themes';

// Icon usage - Import individual icons
import { AppleIcon, HeartIcon, ArrowRightIcon } from '@nugudi/assets-icons';

// DI Container usage
// Server-side
import { createAuthServerContainer } from '@/src/domains/auth/di/auth-server-container';

// Client-side
import { getAuthClientContainer } from '@/src/domains/auth/di/auth-client-container';
```

---

## 🔍 Import Priority

1. `@nugudi/react-components-*` - React components
2. `@nugudi/react-hooks-*` - React hooks
3. `@nugudi/themes` - Design tokens
4. `@nugudi/assets-icons` - Icons
5. Domain-specific code
6. Shared utilities

---

## 📋 Import Conventions

### Within Same Domain - Use Relative Imports

```typescript
// ✅ CORRECT - Within same domain (e.g., auth/sign-up)
// From: src/domains/auth/sign-up/presentation/ui/views/sign-up-view/index.tsx
import { SignUpForm } from '../../components/sign-up-form';
import { useSignUpStore } from '../../../stores/use-sign-up-store';
import { signUpSchema } from '../../../schemas/sign-up-schema';
import type { SignUpFormData } from '../../../types/sign-up';

// ✅ CORRECT - From section to component in same domain
// From: src/domains/auth/sign-up/presentation/ui/sections/sign-up-section/index.tsx
import { EmailForm } from '../../components/sign-up-form/steps/email-form';
import { PasswordForm } from '../../components/sign-up-form/steps/password-form';

// ✅ CORRECT - Within same folder
// From: src/domains/auth/sign-up/presentation/ui/components/sign-up-form/steps/email-form/index.tsx
import * as styles from './index.css';
```

### Cross-Domain or from App - Use Absolute Imports

```typescript
// ✅ CORRECT - Cross-domain imports
// From: src/domains/cafeteria/...
import { useAuth } from '@/src/domains/auth/hooks/use-auth';

// ✅ CORRECT - From app pages (public routes)
// From: app/(public)/auth/sign-up/page.tsx
import { SignUpView } from '@/src/domains/auth/sign-up/presentation/ui/views/sign-up-view';

// ✅ CORRECT - From app pages (protected routes)
// From: app/(auth)/profile/page.tsx
import { ProfilePageView } from '@/src/domains/auth/profile/presentation/ui/views/profile-page-view';
```

### Core Utilities - Use @core Alias

```typescript
// ✅ CORRECT - Core utilities and types
import { formatPriceWithCurrency } from '@core/utils/currency';
import type { UserId } from '@core/types/user';
import { AppHeader } from '@core/ui/components/app-header';

// ❌ WRONG - Don't use full paths
import { formatPriceWithCurrency } from '@/src/core/shared/util/currency';
```

> **Note**: The `@core/utils` alias resolves to `src/core/shared/util/`, not direct `src/core/utils/`. Similarly, `@core/types` resolves to `src/core/shared/type/`. This is because utilities and types are nested inside the `shared/` subdirectory within `core/`.

### Package Imports - Always Use Package Path

```typescript
// ✅ CORRECT - Always use package imports for packages
import { Button } from '@nugudi/react-components-button';
import { vars } from '@nugudi/themes';

// ❌ WRONG - Never use relative imports for packages
import { Button } from '../../../../../packages/react/components/button'; // NO!
```

---

## 💡 Mock Repository Pattern (Domains Without Backend APIs)

For domains that don't have backend APIs yet (Notification, Benefit, Stamp), we use the **Mock Repository Pattern** to enable UI development while maintaining complete DDD architecture.

### Pattern Overview

```
┌─────────────────────────────────────────────────────────────┐
│  Mock Repository Pattern (No Backend API Yet)               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  DTO (snake_case)  ──────────────────┐                     │
│      ↓                                │                     │
│  Mapper (bidirectional)               │                     │
│      ↓                                │                     │
│  Entity (camelCase)                   │                     │
│      ↓                                │                     │
│  Mock DataSource ←───────────────────┘                     │
│  (Hardcoded data + 100ms delay)                             │
│      ↓                                                      │
│  Repository Implementation                                  │
│      ↓                                                      │
│  UseCase (Business Logic)                                   │
│      ↓                                                      │
│  DI Container (Server/Client)                               │
│      ↓                                                      │
│  UI Components                                              │
│                                                             │
│  ⚡ When Backend Ready: Replace Mock DataSource            │
│     with Remote DataSource (API calls)                     │
└─────────────────────────────────────────────────────────────┘
```

### Why Mock Repository Pattern?

- ✅ **Enable UI Development**: Frontend development doesn't wait for backend APIs
- ✅ **Maintain Architecture**: Complete DDD structure from day one
- ✅ **Type Safety**: Full TypeScript support with DTOs and Entities
- ✅ **Easy Replacement**: Swap Mock DataSource with Remote DataSource when API is ready
- ✅ **Testing**: Business logic works with both mock and real data
- ✅ **Consistent Patterns**: Same DI Container pattern across all domains

### Implementation Example (Notification Domain)

**Step 1: Define DTO (snake_case - API contract)**

```typescript
// domains/notification/data/dto/notification.dto.ts
export interface NotificationDTO {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  is_read: boolean;
  created_at: string;
  read_at?: string;
}

export interface GetNotificationListResponseDTO {
  notifications: NotificationDTO[];
  total_count: number;
  unread_count: number;
}
```

**Step 2: Create Mapper (DTO ↔ Entity conversion)**

```typescript
// domains/notification/data/mappers/notification.mapper.ts
import type { NotificationDTO } from '../dto/notification.dto';
import type { Notification } from '../../domain/entities/notification.entity';

export function notificationDtoToDomain(dto: NotificationDTO): Notification {
  return {
    id: dto.id,
    userId: dto.user_id,
    title: dto.title,
    message: dto.message,
    type: dto.type,
    isRead: dto.is_read,
    createdAt: dto.created_at,
    readAt: dto.read_at,
  };
}

export function notificationDtoListToDomain(
  dtos: NotificationDTO[]
): Notification[] {
  return dtos.map(notificationDtoToDomain);
}
```

**Step 3: Implement Mock DataSource**

```typescript
// domains/notification/data/data-sources/notification-mock-data-source.ts
const MOCK_NOTIFICATIONS: NotificationDTO[] = [
  {
    id: 'notif-1',
    user_id: 'user-123',
    title: '새로운 할인 혜택',
    message: '학생식당에서 20% 할인 혜택이 추가되었습니다.',
    type: 'INFO',
    is_read: false,
    created_at: '2024-01-15T10:00:00Z',
  },
  // ... more mock data
];

export interface NotificationDataSource {
  getNotificationList(): Promise<GetNotificationListResponseDTO>;
  markAsRead(notificationId: string): Promise<void>;
}

export class NotificationMockDataSource implements NotificationDataSource {
  private notifications: NotificationDTO[] = [...MOCK_NOTIFICATIONS];

  async getNotificationList(): Promise<GetNotificationListResponseDTO> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 100));

    const unreadCount = this.notifications.filter((n) => !n.is_read).length;
    return {
      notifications: this.notifications,
      total_count: this.notifications.length,
      unread_count: unreadCount,
    };
  }

  async markAsRead(notificationId: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 100));

    const notification = this.notifications.find(
      (n) => n.id === notificationId
    );
    if (notification) {
      notification.is_read = true;
      notification.read_at = new Date().toISOString();
    }
  }
}
```

**Step 4: Implement Repository**

```typescript
// domains/notification/data/repositories/notification-repository.impl.ts
import type { NotificationRepository } from '../../domain/repositories/notification-repository.interface';
import type { NotificationDataSource } from '../data-sources/notification-mock-data-source';
import { notificationDtoListToDomain } from '../mappers/notification.mapper';

export class NotificationRepositoryImpl implements NotificationRepository {
  constructor(private readonly dataSource: NotificationDataSource) {}

  async getNotificationList(): Promise<NotificationList> {
    const response = await this.dataSource.getNotificationList();
    const notifications = notificationDtoListToDomain(response.notifications);
    return {
      notifications,
      totalCount: response.total_count,
      unreadCount: response.unread_count,
    };
  }

  async markAsRead(notificationId: string): Promise<void> {
    await this.dataSource.markAsRead(notificationId);
  }
}
```

**Step 5: Create UseCase**

```typescript
// domains/notification/domain/usecases/get-notification-list.usecase.ts
export interface GetNotificationListUseCase {
  execute(): Promise<NotificationList>;
}

export class GetNotificationListUseCaseImpl
  implements GetNotificationListUseCase
{
  constructor(
    private readonly notificationRepository: NotificationRepository
  ) {}

  async execute(): Promise<NotificationList> {
    return await this.notificationRepository.getNotificationList();
  }
}
```

**Step 6: Setup DI Containers**

```typescript
// domains/notification/di/notification-server-container.ts (Server-side)
export class NotificationServerContainer {
  private _dataSource?: NotificationMockDataSource;
  private _repository?: NotificationRepositoryImpl;
  private _getNotificationListUseCase?: GetNotificationListUseCase;

  private getDataSource(): NotificationMockDataSource {
    if (!this._dataSource) {
      this._dataSource = new NotificationMockDataSource();
    }
    return this._dataSource;
  }

  private getRepository(): NotificationRepositoryImpl {
    if (!this._repository) {
      this._repository = new NotificationRepositoryImpl(this.getDataSource());
    }
    return this._repository;
  }

  getGetNotificationList(): GetNotificationListUseCase {
    if (!this._getNotificationListUseCase) {
      this._getNotificationListUseCase = new GetNotificationListUseCaseImpl(
        this.getRepository()
      );
    }
    return this._getNotificationListUseCase;
  }
}

export function createNotificationServerContainer(): NotificationServerContainer {
  return new NotificationServerContainer();
}

// domains/notification/di/notification-client-container.ts (Client-side)
let clientContainer: NotificationClientContainer | null = null;

export function getNotificationClientContainer(): NotificationClientContainer {
  if (!clientContainer) {
    clientContainer = new NotificationClientContainer();
  }
  return clientContainer;
}
```

**Step 7: Use in Pages and Sections**

```typescript
// Page (Server-side prefetch)
import { createNotificationServerContainer } from '@/src/domains/notification/di';

const NotificationPage = async () => {
  const container = createNotificationServerContainer();
  const getNotificationListUseCase = container.getGetNotificationList();

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['notifications', 'list'],
    queryFn: () => getNotificationListUseCase.execute(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotificationView />
    </HydrationBoundary>
  );
};

// Section (Client-side fetch)
('use client');
import { getNotificationClientContainer } from '@/src/domains/notification/di';

const NotificationListSection = () => {
  const container = getNotificationClientContainer();
  const getNotificationListUseCase = container.getGetNotificationList();

  const { data } = useSuspenseQuery({
    queryKey: ['notifications', 'list'],
    queryFn: () => getNotificationListUseCase.execute(),
  });

  return <NotificationList notifications={data.notifications} />;
};
```

### Replacing Mock with Real API

When the backend API is ready, simply replace the Mock DataSource with a Remote DataSource:

```typescript
// Before (Mock)
import { NotificationMockDataSource } from "../data-sources/notification-mock-data-source";

private getDataSource(): NotificationMockDataSource {
  if (!this._dataSource) {
    this._dataSource = new NotificationMockDataSource();
  }
  return this._dataSource;
}

// After (Real API)
import { NotificationRemoteDataSource } from "../data-sources/notification-remote-data-source";
import { getHttpClient } from "@core/infrastructure/http-client";

private getDataSource(): NotificationRemoteDataSource {
  if (!this._dataSource) {
    this._dataSource = new NotificationRemoteDataSource(getHttpClient());
  }
  return this._dataSource;
}

// Remote DataSource Implementation
export class NotificationRemoteDataSource implements NotificationDataSource {
  constructor(private readonly httpClient: HttpClient) {}

  async getNotificationList(): Promise<GetNotificationListResponseDTO> {
    return await this.httpClient.get<GetNotificationListResponseDTO>(
      '/api/v1/notifications'
    );
  }

  async markAsRead(notificationId: string): Promise<void> {
    await this.httpClient.patch(`/api/v1/notifications/${notificationId}/read`);
  }
}
```

**Key Benefits of This Approach:**

- ✅ Only the DI Container needs to change (2-3 lines)
- ✅ Repository, UseCase, and UI components remain unchanged
- ✅ Type safety maintained throughout
- ✅ No breaking changes to existing code

---

## 💡 Best Practices & Development Tips

### DDD Development Guidelines

1. **Use DI Containers**: Always access UseCases through DI containers

   - Server: `createAuthServerContainer()` (새 인스턴스 per request)
   - Client: `getAuthClientContainer()` (Lazy-initialized singleton)

2. **Layer Separation**: Respect architectural boundaries

   - Presentation → Application → Domain → Infrastructure
   - Never skip layers or reverse dependencies

3. **Repository Pattern**: Data access only

   - Pure API calls
   - No business logic
   - Returns raw data

4. **UseCase Pattern**: Business logic orchestration

   - Combines multiple repositories
   - Handles complex workflows
   - Manages session/state

5. **Infrastructure Abstraction**: Use interfaces
   - HttpClient interface (not direct fetch)
   - SessionManager interface (not direct localStorage/cookies)
   - TokenProvider interface (environment-agnostic)

### Server vs Client Development

#### Server-Side (Pages, Server Actions)

```typescript
// ✅ DO
const container = createAuthServerContainer();  // New instance per request
const loginUseCase = container.getLoginWithOAuth();

// ❌ DON'T
import { LoginWithOAuthUseCaseImpl } from '@/src/domains/auth/domain/usecases/login-with-oauth.usecase';
const useCase = new LoginWithOAuthUseCaseImpl(...);  // Never instantiate directly
```

#### Client-Side (Client Components, Hooks)

```typescript
// ✅ DO
import { getAuthClientContainer } from '@/src/domains/auth/di/auth-client-container';
const container = getAuthClientContainer(); // Get lazy-initialized singleton
const loginUseCase = container.getLoginWithOAuth();

// ❌ DON'T
const container = new AuthClientContainer(); // Never create new instance
```

### General Development Tips

1. **Package-First**: Always check `packages/` before creating new code
2. **Biome for Code Quality**: Use Biome commands for formatting and linting
3. **TypeScript Strict Mode**: Leverage full type safety
4. **Vanilla Extract for Styles**: Use design tokens from `@nugudi/themes`
5. **Complete Package Setup**: Add to package.json + import styles
6. **Naming Consistency**: Maintain consistent naming within domains
7. **Import Conventions**: Relative within domain, absolute cross-domain
8. **Test All Layers**: Unit tests for all Repository/UseCase/Infrastructure layers

Remember: This is a **DDD-based, package-first monorepo** - maximize reuse and respect architectural boundaries!
