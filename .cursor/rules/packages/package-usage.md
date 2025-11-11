---
description: Package usage guidelines, import patterns, layout/typography components, themes, setup requirements
globs:
  - "**/*.tsx"
  - "**/*.ts"
alwaysApply: true
---

# Package Usage Guidelines

**Priority**: ALWAYS use existing packages BEFORE creating new code

## MUST Rules

1. **MUST check packages first** — Before writing any new code, check if functionality exists in `packages/`
2. **MUST use Layout components** — Use `@nugudi/react-components-layout` for ALL layout structure
3. **MUST use Typography components** — NEVER use HTML heading tags directly (`<h1>`, `<p>`, etc.)
4. **MUST use design tokens** — Use `vars` from `@nugudi/themes` for all styling
5. **MUST complete package setup** — Add to `package.json` AND import styles in `fds.module.css`
6. **MUST use named exports** — All components use named exports (except `page.tsx` which requires default)

## NEVER Rules

1. **NEVER use HTML tags directly** — Use Typography components instead of `<h1>`, `<p>`, `<span>`
2. **NEVER create custom layouts** — Use Box, Flex, VStack, HStack instead of custom flex/grid styles
3. **NEVER skip style imports** — Every package component requires its `style.css` imported
4. **NEVER use hard-coded values** — Use `vars.box.spacing[16]` NOT `16px`, use `vars.colors.$scale.zinc[500]` NOT `#71717a`
5. **NEVER use deprecated `@nugudi/api`** — Use DI Container + UseCase pattern instead

## Package Import Priority

1. **FIRST**: `@nugudi/react-components-layout` — Layout & Typography components
2. **SECOND**: `@nugudi/react-components-*` — Individual components
3. **THIRD**: `@nugudi/react-hooks-*` — React hooks
4. **FOURTH**: `@nugudi/themes` — Design tokens
5. **FIFTH**: `@nugudi/assets-icons` — Icon components
6. Domain-specific code

## Layout Components (`@nugudi/react-components-layout`)

### Import Pattern

```typescript
// ✅ CORRECT - Import multiple layout components
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

### Layout Component Usage

| Component | Use Case | Props | Example |
|-----------|----------|-------|---------|
| **Box** | Basic container | All style props | `<Box padding={16} margin={8}>` |
| **Flex** | Flexbox layouts | `direction`, `justify`, `align`, `gap` | `<Flex justify="space-between" align="center">` |
| **VStack** | Vertical stacking | `spacing`, `align` | `<VStack spacing={16}>` |
| **HStack** | Horizontal stacking | `spacing`, `align` | `<HStack spacing={8}>` |
| **Stack** | Generic stacking | `direction`, `spacing` | `<Stack direction="row" spacing={12}>` |
| **Grid** | CSS Grid layouts | `templateColumns`, `gap` | `<Grid templateColumns="1fr 2fr" gap={16}>` |
| **GridItem** | Grid children | `colSpan`, `rowSpan` | `<GridItem colSpan={2}>` |
| **Divider** | Visual separator | `orientation`, `color` | `<Divider orientation="horizontal" />` |

### Spacing System (Direct Pixel Values)

```typescript
// ✅ CORRECT - Direct pixel values
<Box padding={20} margin={16}>        // 20px padding, 16px margin
<VStack spacing={24}>                  // 24px gap between children
<Flex gap={32}>                        // 32px gap

// Numbers are treated as pixels
<Box p={10} m={20}>                    // 10px padding, 20px margin
<Box width={300} height={150}>         // 300px width, 150px height

// Special keywords
<Box width="full" height="auto">       // 100% width, auto height
<Box width="screen">                   // 100vw width
<Box width="50%" height="100vh">       // Percentage and viewport units
```

**Size Keywords**:
- `"full"` → `100%`
- `"screen"` → `100vw`
- `"auto"` → `auto`
- `"min"` → `min-content`
- `"max"` → `max-content`
- `"fit"` → `fit-content`

**Spacing Props**: `m`, `margin`, `mt`, `mr`, `mb`, `ml`, `mX`, `mY`, `p`, `padding`, `pt`, `pr`, `pb`, `pl`, `pX`, `pY`, `gap`, `columnGap`, `rowGap`, `width`, `w`, `height`, `h`, `size`

### Common Layout Patterns

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
  <GridItem>{/* Item */}</GridItem>
</Grid>
```

## Typography Components (`@nugudi/react-components-layout`)

### Import Pattern

```typescript
// ✅ CORRECT - Import typography components
import {
  Heading,
  Title,
  Body,
  Emphasis,
  Logo,
} from '@nugudi/react-components-layout';

// ❌ WRONG - Don't use HTML tags directly
<h1>Title</h1>  // NO! Use <Heading fontSize="h1">
<p>Text</p>     // NO! Use <Body fontSize="b2">
<span>Note</span> // NO! Use <Emphasis fontSize="e1">
```

### Typography Component Usage

| Component | Use Case | fontSize Options | Semantic HTML | Example |
|-----------|----------|------------------|---------------|---------|
| **Logo** | Brand/App name | `l1` (34px), `l2` (20px) | `as="h1"` or `as="span"` | `<Logo fontSize="l1">너구디</Logo>` |
| **Heading** | Page titles | `h1` (30px) | `as="h1"` (default) | `<Heading fontSize="h1">페이지 제목</Heading>` |
| **Title** | Section titles | `t1` (28px), `t2` (22px), `t3` (20px) | `as="h2"`, `as="h3"` | `<Title fontSize="t2" as="h2">섹션 제목</Title>` |
| **Body** | Body text | `b1` (17px), `b2` (16px), `b3` (15px), `b3b` (15px bold), `b4` (13px), `b4b` (13px bold) | `as="p"`, `as="span"` | `<Body fontSize="b2">본문 텍스트</Body>` |
| **Emphasis** | Small text/captions | `e1` (12px), `e2` (11px) | `as="span"`, `as="small"` | `<Emphasis fontSize="e1">캡션</Emphasis>` |

### Typography Usage by Context

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
<Body fontSize="b1">중요한 본문 내용</Body>           // Primary body text
<Body fontSize="b2">일반적인 설명 텍스트</Body>       // Regular body text
<Body fontSize="b3">추가 정보나 부가 설명</Body>       // Secondary text
<Body fontSize="b3b">강조된 작은 텍스트</Body>        // Bold small text
<Body fontSize="b4">작은 안내 텍스트</Body>           // Small text
<Body fontSize="b4b">작고 강조된 레이블</Body>        // Bold label

// Captions and metadata
<Emphasis fontSize="e1">2024년 1월 15일</Emphasis>  // Date, time
<Emphasis fontSize="e2">© 2024 Nugudi</Emphasis>    // Copyright
```

## Component Packages

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
```

## Hook Packages

```typescript
import { useButton, useToggleButton } from '@nugudi/react-hooks-button';
import { useSwitch, useToggleSwitch } from '@nugudi/react-hooks-switch';
import { useToggle } from '@nugudi/react-hooks-toggle';
import { useStepper } from '@nugudi/react-hooks-use-stepper';
```

## Themes Package (`@nugudi/themes`)

### Design Tokens Structure

```typescript
import { vars } from '@nugudi/themes';

// Colors
vars.colors.$static       // Static colors
vars.colors.$scale        // Color scales
  - whiteAlpha[100-900]
  - blackAlpha[100-900]
  - zinc[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
  - red, yellow, main, blue, purple (same scale)

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

### Usage Example

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

## Assets Package (`@nugudi/assets-icons`)

```typescript
// Import individual icons directly
import { AppleIcon, HeartIcon, CalendarIcon } from '@nugudi/assets-icons';
import { ChevronRightIcon, ArrowRightIcon } from '@nugudi/assets-icons';
import { CoinIcon } from '@nugudi/assets-icons';

// Use icons as components
<AppleIcon />
<HeartIcon />
<CalendarIcon />

// Example usage in NavigationItem
<NavigationItem
  leftIcon={<CoinIcon />}
  rightIcon={<ArrowRightIcon />}
>
  Content
</NavigationItem>
```

## Package Setup Requirements

### Two-Step Setup (MANDATORY)

When using ANY `@nugudi/react-components-*` package:

**Step 1: Add to package.json**

```json
// In apps/web/package.json
{
  "dependencies": {
    "@nugudi/react-components-layout": "workspace:*",
    "@nugudi/react-components-button": "workspace:*",
    "@nugudi/react-components-input": "workspace:*"
  }
}
```

**Step 2: Import styles in FDS Module**

```css
/* In apps/web/src/shared/styles/fds.module.css */
@import '@nugudi/themes/themes.css';
@import '@nugudi/react-components-layout/style.css';
@import '@nugudi/react-components-button/style.css';
@import '@nugudi/react-components-input/style.css';
```

### Setup Checklist

1. ✅ Check `package.json`: Ensure package is listed
2. ✅ Check `fds.module.css`: Ensure `style.css` is imported
3. ✅ Run `pnpm install`
4. ✅ Verify styles load

### Style Import Pattern

```css
/* ALWAYS import themes first */
@import '@nugudi/themes/themes.css';

/* Import layout (includes layout AND typography) */
@import '@nugudi/react-components-layout/style.css';

/* Import individual components as needed */
@import '@nugudi/react-components-[component-name]/style.css';
```

**Pattern Rule**:
- Package: `@nugudi/react-components-[name]`
- Style: `@import '@nugudi/react-components-[name]/style.css';`

## Deprecated: API Package

**⚠️ `@nugudi/api` has been COMPLETELY REMOVED**

```typescript
// ❌ OLD (REMOVED)
import { api } from '@nugudi/api';
const response = await api.users.getProfile(userId);

// ✅ NEW - Use DI Container + UseCase
// Server-side
import { createUserServerContainer } from '@/domains/user/di/user-server-container';
const container = createUserServerContainer();
const getMyProfileUseCase = container.getGetMyProfile();
const profile = await getMyProfileUseCase.execute();

// Client-side
import { getUserClientContainer } from '@/domains/user/di/user-client-container';
const container = getUserClientContainer();
const getMyProfileUseCase = container.getGetMyProfile();
const { data } = useSuspenseQuery({
  queryKey: ['user', 'profile'],
  queryFn: () => getMyProfileUseCase.execute(),
});
```

## Import Conventions

### Same Domain - Relative Imports

```typescript
// ✅ CORRECT - Within same domain
import { SignUpForm } from '../../components/sign-up-form';
import { useSignUpStore } from '../../../stores/use-sign-up-store';
```

### Cross-Domain - Absolute Imports

```typescript
// ✅ CORRECT - Cross-domain
import { useAuth } from '@/src/domains/auth/hooks/use-auth';

// ✅ CORRECT - From app pages
import { SignUpView } from '@/src/domains/auth/sign-up/presentation/ui/views/sign-up-view';
```

### Packages - Always Absolute

```typescript
// ✅ CORRECT - Package imports
import { Button } from '@nugudi/react-components-button';
import { vars } from '@nugudi/themes';

// ❌ WRONG - Never use relative for packages
import { Button } from '../../../../../packages/react/components/button'; // NO!
```

---

**Related**: See `ddd/di-containers.md` for DI Container patterns, `packages/monorepo-structure.md` for overall structure
