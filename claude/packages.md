# CLAUDE.md

---

## 🏗️ Monorepo Architecture Overview

This is a **Turbo-powered pnpm workspace monorepo** with a **Design System-first approach** and **domain-driven architecture**.

### Repository Structure

```
nugudi/
├── apps/                    # Applications
│   └── web/                # Next.js 15 + React 19 (Main Web App)
│       └── app/           # Next.js App Router
│           ├── (auth)/    # 🔒 Protected routes - Require authentication
│           │   ├── benefits/     # Benefits page (authenticated users only)
│           │   └── my/          # My page/profile (authenticated users only)
│           └── (public)/  # 🌍 Public routes - No authentication required
│               ├── auth/        # Auth-related public pages
│               │   ├── sign-in/ # Sign in page
│               │   └── sign-up/ # Sign up page
│               └── home/        # Public home page
├── packages/               # Shared packages (ALWAYS use these!)
│   ├── ui/                # Aggregated UI library with Storybook
│   ├── api/               # OpenAPI client + MSW mocks
│   ├── themes/            # Design tokens system
│   ├── assets/            # Icons and static assets
│   └── react/             # Component packages (button, input, etc.)
│       ├── components/    # React components
│       └── hooks/         # React hooks
└── turbo.json             # Monorepo task orchestration
```

### 🔐 Route Groups: Authentication Structure

Next.js 15 route groups organize pages by authentication requirements:

- **(auth)**: Protected pages requiring user authentication
  - All pages inside this group require a logged-in user
  - Examples: `/benefits`, `/my`, user dashboard, etc.
- **(public)**: Public pages accessible without authentication
  - All pages inside this group are accessible to everyone
  - Examples: `/auth/sign-in`, `/auth/sign-up`, `/home`, etc.

**Note**: Route groups (parentheses folders) don't affect the URL structure - they're purely for organization.

---

## 🎯 Core Development Rules

### MANDATORY: Always Use Existing Packages

```typescript
// ✅ CORRECT - Use packages
import Button from '@nugudi/react-components-button';
import { useToggle } from '@nugudi/react-hooks-toggle';
import { variables } from '@nugudi/themes';
import { Icons } from '@nugudi/assets-icons';

// ❌ WRONG - Don't create new implementations
import Button from './components/button'; // NO!
```

### Package Import Priority

1. **FIRST**: Check if functionality exists in `packages/`
2. **SECOND**: Import from the appropriate package
3. **LAST RESORT**: Only create new code if absolutely necessary

---

## 📝 Commit Convention

### Commit Message Format

커밋 메시지는 `commitlint.config.ts`의 규칙을 따릅니다:

```
[NUGUDI-{번호}] {type}({scope}): {subject}

{body}
```

### Commit Types

- **feat**: 신규 기능 추가
- **fix**: 버그 수정
- **docs**: 문서 수정 (README, 문서 추가 등)
- **style**: 코드 스타일 수정 (세미콜론, 공백 등)
- **refactor**: 코드 리팩토링 (기능 변화는 없음)
- **test**: 테스트 코드 추가/수정
- **chore**: 빌드, 설정, 패키지 등 기타 작업
- **perf**: 성능 개선
- **ci**: CI 관련 변경

### Commit Rules

- 제목은 최대 72자
- 본문은 한 줄당 최대 100자
- 티켓 번호는 브랜치명에서 추출 (예: `feature/NUGUDI-105-bottomsheet` → `[NUGUDI-105]`)
- **중요**: Co-Author 라인을 절대 추가하지 마세요 (Claude, GitHub Copilot 등)

### Example

```bash
# ✅ CORRECT
git commit -m "[NUGUDI-105] feat(react): BottomSheet 컴포넌트 구현

- Backdrop과 함께 동작하는 BottomSheet 컴포넌트 추가
- 스와이프 제스처 지원"

# ❌ WRONG - Co-Author 라인 포함
git commit -m "[NUGUDI-105] feat(react): BottomSheet 구현

Co-Authored-By: Claude <noreply@anthropic.com>"  # NO!
```

---

## 🔧 Technology Stack

### Core Technologies

- **Framework**: Next.js 15 (App Router)
- **React Version**: 19.x
- **TypeScript**: 5.8.3 with strict configuration
- **Package Manager**: pnpm with workspaces
- **Build Tool**: Turborepo
- **Backend**: External API server
- **Linting/Formatting**: Biome (NOT ESLint/Prettier)
- **Styling**: Vanilla Extract + CSS Modules
- **State Management**: TanStack Query
- **Forms**: React Hook Form + Zod validation
- **Testing**: Vitest + Playwright + MSW
- **Documentation**: Storybook

---

## 📦 Package Usage Guidelines

### React Components (`@nugudi/react-components-*`)

```typescript
// Individual component imports
import Button from "@nugudi/react-components-button";
import Input from "@nugudi/react-components-input";
import { Box, Flex, VStack, HStack } from "@nugudi/react-components-layout";
import Chip from "@nugudi/react-components-chip";
import { NavigationItem } from "@nugudi/react-components-navigation-item"; // Named export
import Switch from "@nugudi/react-components-switch";
import Tab from "@nugudi/react-components-tab";
import Textarea from "@nugudi/react-components-textarea";
import InputOTP from "@nugudi/react-components-input-otp";
import StepIndicator from "@nugudi/react-components-step-indicator";
import MenuCard from "@nugudi/react-components-menu-card";
import BottomSheet from "@nugudi/react-components-bottom-sheet";
import Backdrop from "@nugudi/react-components-backdrop";

// NavigationItem usage example
<NavigationItem
  leftIcon={<CoinIcon />}
  rightIcon={<ArrowRightIcon />}
  onClick={() => console.log("clicked")}
>
  <div>Content with title and description</div>
</NavigationItem>;
```

### React Hooks (`@nugudi/react-hooks-*`)

```typescript
// Individual hook imports
import { useButton, useToggleButton } from '@nugudi/react-hooks-button';
import { useSwitch, useToggleSwitch } from '@nugudi/react-hooks-switch';
import { useToggle } from '@nugudi/react-hooks-toggle';
import { useStepper } from '@nugudi/react-hooks-use-stepper';
```

### API Client (`@nugudi/api`)

```typescript
// Use auto-generated API client from OpenAPI spec
import { api } from '@nugudi/api';
import { useQuery } from '@tanstack/react-query';

// API hooks with TanStack Query
export function useUserProfile(userId: string) {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => api.users.getProfile(userId),
  });
}

// MSW mocks available for testing
import { handlers } from '@nugudi/api/index.msw';
```

### Themes (`@nugudi/themes`)

#### Design Foundation Structure

**vars** - Design tokens available:

```typescript
// Colors
vars.colors.$static       // Static colors
vars.colors.$scale        // Color scales
  - whiteAlpha[100, 200, 300, 400, 500, 600, 700, 800, 900]
  - blackAlpha[100, 200, 300, 400, 500, 600, 700, 800, 900]
  - gray[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
  - red, yellow, green, blue, etc. (same scale)

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

## 🏛️ Architecture Patterns

### Domain-Based Structure in Next.js App

```
apps/web/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Protected routes
│   │   ├── benefits/
│   │   └── my/
│   └── (public)/          # Public routes
│       └── auth/
│           ├── sign-in/
│           └── sign-up/
├── src/
│   ├── domains/           # Domain logic
│   │   ├── auth/          # Complex domain with multiple features
│   │   │   ├── sign-in/
│   │   │   ├── sign-up/
│   │   │   ├── my/
│   │   │   └── password-forgot/
│   │   │       ├── constants/
│   │   │       ├── schemas/
│   │   │       ├── stores/
│   │   │       ├── types/
│   │   │       └── ui/
│   │   │           ├── components/
│   │   │           ├── sections/
│   │   │           └── views/
│   │   └── benefit/       # Simple domain without sub-features
│   │       └── ui/        # UI directly under domain
│   │           ├── components/
│   │           ├── sections/
│   │           └── views/
│   └── shared/            # Shared utilities
│       ├── configs/       # Configuration
│       ├── providers/     # React providers
│       ├── styles/        # Global styles
│       ├── ui/            # App-specific shared components
│       ├── utils/         # Utility functions
│       └── types/         # Global type definitions
└── tests/                 # Test files
```

### Component Organization Pattern

Each domain follows this structure:

- **components/**: Smallest reusable UI pieces
- **sections/**: Composed components forming page sections
- **views/**: Complete page views

#### Component Folder Structure

Each component MUST follow this folder structure:

```
component-name/
├── index.tsx        # Component implementation
├── index.css.ts     # Vanilla Extract styles
└── types.ts         # Type definitions (optional)
```

```typescript
// Domain component structure example
// src/domains/auth/sign-up/ui/components/sign-up-form/index.tsx
interface SignUpFormProps {
  // Props interface
}

export const SignUpForm: React.FC<SignUpFormProps> = (props) => {
  // Component implementation
};

// src/domains/auth/sign-up/ui/components/sign-up-form/index.css.ts
import { style } from '@vanilla-extract/css';
import { variables } from '@nugudi/themes';

export const formContainer = style({
  display: 'flex',
  flexDirection: 'column',
  gap: variables.box.spacing.md,
});
```

### Store Pattern with Zustand

```typescript
// domains/auth/sign-up/stores/use-sign-up-store.ts
interface SignUpStore {
  step: number;
  formData: SignUpFormData;
  setStep: (step: number) => void;
  setFormData: (data: Partial<SignUpFormData>) => void;
}

export const useSignUpStore = create<SignUpStore>((set) => ({
  // Store implementation
}));
```

---

## 🎨 Styling Guidelines

### 🚨 CRITICAL: Style Priority Rules

**YOU MUST check and use existing styles in this EXACT order:**

1. **FIRST - Check `classes`**: Always check if a pre-defined class exists
   - `classes.container`, `classes.flexCenter`, etc.
2. **SECOND - Use `vars`**: Use design tokens for all style properties
   - Colors: `vars.colors.$scale.gray[500]` NOT `#6B7280`
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
import { style } from "@vanilla-extract/css";
import { vars, classes } from "@nugudi/themes";

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
  width: "149px", // OK if specific requirement
});

// Component file
import * as styles from "./index.css";

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

## 🔌 Backend Integration

### API Connection

```typescript
// Use @nugudi/api for all backend communication
import { api } from '@nugudi/api';

// TanStack Query for data fetching
import { useQuery } from '@tanstack/react-query';

export function useMenuData(date: string) {
  return useQuery({
    queryKey: ['menu', date],
    queryFn: () => api.menu.getByDate(date),
  });
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

## 📝 Naming Conventions

### File & Folder Naming

#### Folder Structure Rules

```
✅ CORRECT Component Structure:
button/                  # Component folder (kebab-case)
├── index.tsx           # Main component file
├── index.css.ts        # Vanilla Extract styles
└── types.ts            # Type definitions (optional)

sign-up-form/           # Multi-word component folder
├── index.tsx
├── index.css.ts
└── steps/              # Sub-components folder
    ├── email-form/
    │   ├── index.tsx
    │   └── index.css.ts
    └── password-form/
        ├── index.tsx
        └── index.css.ts
```

#### File Naming Rules

```
✅ CORRECT:
- kebab-case/            # All folders use kebab-case
- index.tsx              # Main component/export files
- index.css.ts           # Vanilla Extract style files
- use-auth.ts            # Hook files (kebab-case)
- types.ts               # Type definition files

❌ WRONG:
- MyComponent.tsx        # NO PascalCase files
- myComponent.tsx        # NO camelCase files
- my_component.tsx       # NO snake_case
- Button.tsx             # NO component name as filename (use index.tsx)
- styles.css.ts          # NO other names for styles (use index.css.ts)
```

### Code Naming

```typescript
// Components: PascalCase
export const MyComponent: React.FC = () => {};

// Props: ComponentName + Props
interface MyComponentProps {}

// Hooks: camelCase with 'use' prefix
export function useMyCustomHook() {}

// Event handlers: on + Action + Target
const onClickSubmit = () => {};
const onChangeInput = () => {};

// Stores: use + Feature + Store
export const useSignUpStore = () => {};
```

---

## 🚀 Development Workflow

### Starting Development

```bash
# Install dependencies
pnpm install

# Start development (all apps)
pnpm dev

# Start specific app
pnpm dev --filter=web

# Build packages first, then apps
pnpm build
```

### Adding New Features

1. **Check packages first**: Can you use existing components/hooks?
2. **Follow domain structure**: Place code in appropriate domain
3. **Use TypeScript strictly**: No any types
4. **Apply Biome**: Format and lint before committing
5. **Write tests**: Unit tests for logic, integration tests for features

### Testing Strategy

```bash
# Unit tests
pnpm test

# Type checking
pnpm check-types

# Linting
pnpm lint

# Component testing in Storybook
pnpm storybook --filter=ui
```

---

## ⚠️ Critical Rules

### DO's ✅

- **ALWAYS** use packages from `packages/` folder
- **ALWAYS** use Biome for formatting/linting
- **ALWAYS** use kebab-case for folders, index.tsx for main files
- **ALWAYS** use TanStack Query for data fetching
- **ALWAYS** use existing components from packages
- **ALWAYS** follow domain-based architecture
- **ALWAYS** write tests for new features
- **ALWAYS** use TypeScript strict mode

### DON'Ts ❌

- **NEVER** use ESLint or Prettier (use Biome)
- **NEVER** create new API clients (use @nugudi/api)
- **NEVER** create components that exist in packages
- **NEVER** use PascalCase for file/folder names (except index.tsx)
- **NEVER** use inline styles (use Vanilla Extract)
- **NEVER** add Co-Author lines in commits
- **NEVER** use any type in TypeScript
- **NEVER** skip tests for new features

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
@nugudi/api                  // API client + mocks
@nugudi/themes               // Design tokens
@nugudi/assets-icons         // Icon components
@nugudi/ui                   // Storybook UI documentation
```

### Import Examples

```typescript
// Component usage
import Button from '@nugudi/react-components-button';
import { Box, Flex } from '@nugudi/react-components-layout';

// Hook usage
import { useToggle } from '@nugudi/react-hooks-toggle';
import { useStepper } from '@nugudi/react-hooks-use-stepper';

// API usage
import { api } from '@nugudi/api';

// Theme usage
import { variables } from '@nugudi/themes';

// Icon usage - Import individual icons
import { AppleIcon, HeartIcon, ArrowRightIcon } from '@nugudi/assets-icons';
```

---

## 🔍 Quick Reference

### Project Structure

- **Apps**: `web` (Next.js 15)
- **Architecture**: Domain-based
- **Styling**: Vanilla Extract + CSS Modules
- **State**: TanStack Query + Zustand
- **Backend**: External API
- **Linting**: Biome (NOT ESLint/Prettier)

### Common Commands

```bash
pnpm dev                     # Start development
pnpm build                   # Build all
pnpm biome check --write .   # Format & lint
pnpm test                    # Run tests
pnpm check-types            # Type checking
pnpm commit                 # Commit with commitizen
```

### Import Priority

1. `@nugudi/react-components-*` - React components
2. `@nugudi/react-hooks-*` - React hooks
3. `@nugudi/api` - API client & mocks
4. `@nugudi/themes` - Design tokens
5. `@nugudi/assets-icons` - Icons
6. Domain-specific code
7. Shared utilities

### Import Rules

#### Within Same Domain - Use Relative Imports

```typescript
// ✅ CORRECT - Within same domain (e.g., auth/sign-up)
// From: src/domains/auth/sign-up/ui/views/sign-up-view/index.tsx
import { SignUpForm } from '../../components/sign-up-form';
import { useSignUpStore } from '../../../stores/use-sign-up-store';
import { signUpSchema } from '../../../schemas/sign-up-schema';
import type { SignUpFormData } from '../../../types/sign-up';

// ✅ CORRECT - From section to component in same domain
// From: src/domains/auth/sign-up/ui/sections/sign-up-section/index.tsx
import { EmailForm } from '../../components/sign-up-form/steps/email-form';
import { PasswordForm } from '../../components/sign-up-form/steps/password-form';

// ✅ CORRECT - Within same folder
// From: src/domains/auth/sign-up/ui/components/sign-up-form/steps/email-form/index.tsx
import * as styles from './index.css';
```

#### Cross-Domain or from App - Use Absolute Imports

```typescript
// ✅ CORRECT - Cross-domain imports
// From: src/domains/menu/...
import { useAuth } from '@/domains/auth/hooks/use-auth';

// ✅ CORRECT - From app pages (public routes)
// From: app/(public)/auth/sign-up/page.tsx
import { SignUpView } from '@/domains/auth/sign-up/ui/views/sign-up-view';

// ✅ CORRECT - From app pages (protected routes)
// From: app/(auth)/benefits/page.tsx
import { BenefitPageView } from '@/domains/benefit/ui/views/benefit-page-view';
```

#### Package Imports - Always Use Package Path

```typescript
// ✅ CORRECT - Always use package imports for packages
import Button from '@nugudi/react-components-button';
import { variables } from '@nugudi/themes';

// ❌ WRONG - Never use relative imports for packages
import Button from '../../../../../packages/react/components/button'; // NO!
```

---

## 💡 Tips for Claude Code

When working in this repository:

1. **Always check `packages/` first** before creating new code
2. **Use Biome commands** for formatting and linting
3. **Follow domain structure** for organizing code
4. **Leverage TypeScript** strict mode for type safety
5. **Test with MSW mocks** from `@nugudi/api`
6. **Use Vanilla Extract** for component styles
7. **Follow the established patterns** in existing domains

Remember: This is a **package-first monorepo** - maximize reuse of existing packages!

# important-instruction-reminders

Do what has been asked; nothing more, nothing less.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (\*.md) or README files. Only create documentation files if explicitly requested by the User.
