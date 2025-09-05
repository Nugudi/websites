# 📦 Monorepo Architecture & Package System

## 🏗️ Repository Structure

```
nugudi/
├── apps/
│   └── web/                 # Next.js 15 + React 19 web application
├── packages/
│   ├── react/              # React components and hooks
│   │   ├── components/     # UI components (button, input, layout, etc.)
│   │   └── hooks/          # Custom React hooks
│   ├── ui/                 # Storybook documentation
│   ├── api/                # OpenAPI client + MSW mocks
│   ├── themes/             # Design token system
│   └── assets/             # Icons and static assets
└── turbo.json             # Monorepo task orchestration
```

## 🎯 Core Development Principles

### 1. Package-First Development

**ALWAYS** check existing packages before creating new code:

```typescript
// ✅ CORRECT - Use existing packages
import { Button } from '@nugudi/react-components-button';
import { Box, VStack } from '@nugudi/react-components-layout';
import { vars } from '@nugudi/themes';

// ❌ WRONG - Creating duplicate implementations
const CustomButton = () => {
  /* ... */
}; // NO! Use existing Button
```

### 2. Import Patterns

#### Individual Component Packages

```typescript
// Each component in its own package
import { Button } from '@nugudi/react-components-button';
import { Input } from '@nugudi/react-components-input';
import { Switch } from '@nugudi/react-components-switch';
```

#### Layout Package (Multiple Components)

```typescript
// Layout package contains multiple components
import {
  Box,
  Flex,
  VStack,
  HStack,
  Grid,
} from '@nugudi/react-components-layout';
import {
  Heading,
  Title,
  Body,
  Emphasis,
} from '@nugudi/react-components-layout';
```

#### Icons Package (Multiple Icons)

```typescript
// Icons package contains all icons
import { AppleIcon, GoogleIcon, ArrowRightIcon } from '@nugudi/assets-icons';
```

## 📝 Commit Convention

### Format

```
[NUGUDI-{number}] {type}({scope}): {subject}

{body}
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, semicolons, etc.)
- `refactor`: Code refactoring (no functional changes)
- `test`: Test additions or modifications
- `chore`: Build, config, dependencies, etc.
- `perf`: Performance improvements
- `ci`: CI/CD changes

### Rules

- Subject max 72 characters
- Body max 100 characters per line
- Extract ticket number from branch name (e.g., `feature/NUGUDI-105-bottomsheet` → `[NUGUDI-105]`)
- **NEVER** add Co-Author lines (no Claude, GitHub Copilot, etc.)

### Examples

```bash
# ✅ CORRECT
git commit -m "[NUGUDI-105] feat(react): Add BottomSheet component

- Add BottomSheet with Backdrop support
- Include swipe gesture handling"

# ❌ WRONG - Has Co-Author line
git commit -m "[NUGUDI-105] feat(react): Add BottomSheet

Co-Authored-By: Claude <noreply@anthropic.com>"  # NO!
```

## 🎨 Design System Usage

### Theme Tokens

Always use design tokens from `@nugudi/themes`:

```typescript
import { vars } from '@nugudi/themes';

// ✅ CORRECT - Using theme tokens
const styles = {
  padding: vars.box.spacing[4], // 16px
  borderRadius: vars.box.radii.lg, // 8px
  background: vars.colors.$scale.main[100],
  boxShadow: vars.box.shadows.sm,
};

// ❌ WRONG - Hard-coded values
const styles = {
  padding: '16px', // NO! Use spacing tokens
  borderRadius: '8px', // NO! Use radii tokens
  background: '#e0e7ff', // NO! Use color scales
};
```

### Layout Components

Use layout components instead of raw HTML:

```typescript
// ✅ CORRECT - Using layout components
import { Box, VStack, Title, Body } from '@nugudi/react-components-layout';

<Box padding={24}>
  <VStack spacing={16}>
    <Title fontSize="t2">Section Title</Title>
    <Body fontSize="b2">Content text</Body>
  </VStack>
</Box>

// ❌ WRONG - Using raw HTML
<div style={{ padding: '24px' }}>
  <h2>Section Title</h2>
  <p>Content text</p>
</div>
```

## 🔧 Technology Stack

- **Framework**: Next.js 15 (App Router)
- **React**: Version 19.x
- **TypeScript**: 5.8.3 with strict mode
- **Package Manager**: pnpm with workspaces
- **Build Tool**: Turborepo
- **Styling**: Vanilla Extract + CSS Modules
- **State Management**: TanStack Query + Zustand
- **Form Handling**: React Hook Form + Zod
- **Testing**: Vitest + Playwright + MSW
- **Documentation**: Storybook
- **Linting/Formatting**: Biome (NOT ESLint/Prettier)

## 📚 Available Packages

### Component Packages

```
@nugudi/react-components-avatar
@nugudi/react-components-backdrop
@nugudi/react-components-badge
@nugudi/react-components-bottom-sheet
@nugudi/react-components-button
@nugudi/react-components-chip
@nugudi/react-components-comment
@nugudi/react-components-image-card
@nugudi/react-components-input
@nugudi/react-components-input-otp
@nugudi/react-components-layout     # Contains Box, Flex, VStack, Title, Body, etc.
@nugudi/react-components-menu-card
@nugudi/react-components-navigation-item
@nugudi/react-components-review-card
@nugudi/react-components-step-indicator
@nugudi/react-components-switch
@nugudi/react-components-tab
@nugudi/react-components-textarea
```

### Hook Packages

```
@nugudi/react-hooks-button
@nugudi/react-hooks-switch
@nugudi/react-hooks-toggle
@nugudi/react-hooks-use-media-query
@nugudi/react-hooks-use-stepper
```

### Core Packages

```
@nugudi/api           # API client + mocks
@nugudi/themes        # Design tokens (vars, classes)
@nugudi/assets-icons  # Icon components
@nugudi/ui           # Storybook documentation
```

## 🚀 Development Commands

```bash
# Install dependencies
pnpm install

# Start development
pnpm dev

# Build all packages
pnpm build

# Run tests
pnpm test

# Type checking
pnpm check-types

# Linting with Biome
pnpm lint

# Start Storybook
pnpm --filter=@nugudi/ui storybook
```

## ⚠️ Critical Rules

### DO's ✅

- Use existing packages from `packages/` folder
- Use Biome for formatting/linting
- Use design tokens from `@nugudi/themes`
- Follow commit format without Co-Author lines
- Use TypeScript strict mode
- Write tests for business logic

### DON'Ts ❌

- Create duplicate components that exist in packages
- Use ESLint or Prettier (use Biome)
- Use hard-coded style values
- Add Co-Author lines in commits
- Use `any` type in TypeScript
- Skip package documentation
