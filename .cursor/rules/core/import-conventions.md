---
description: Import patterns, TypeScript path aliases, domain isolation rules
globs:
  - "**/*.ts"
  - "**/*.tsx"
alwaysApply: true
---

# Import Convention Rules

## TypeScript Path Aliases

### Domain Aliases

**Pattern**: `@{domain}/presentation/*`, `@{domain}/di`, `@{domain}/domain/*`, `@{domain}/data/*`

**Location**: `apps/web/tsconfig.json`

```json
{
  "paths": {
    "@auth/presentation/*": ["src/domains/auth/presentation/*"],
    "@auth/di": ["src/domains/auth/di"],
    "@auth/domain/*": ["src/domains/auth/domain/*"],
    "@auth/data/*": ["src/domains/auth/data/*"],
    "@user/presentation/*": ["src/domains/user/presentation/*"],
    "@benefit/presentation/*": ["src/domains/benefit/presentation/*"],
    "@cafeteria/presentation/*": ["src/domains/cafeteria/presentation/*"],
    "@notification/presentation/*": ["src/domains/notification/presentation/*"],
    "@stamp/presentation/*": ["src/domains/stamp/presentation/*"]
  }
}
```

### Core Aliases

**Pattern**: `@core/*`, `@/src/*`

```json
{
  "paths": {
    "@core/*": ["src/core/*"],
    "@core/infrastructure/*": ["src/core/infrastructure/*"],
    "@core/ui/*": ["src/core/ui/*"],
    "@core/utils/*": ["src/core/utils/*"],
    "@/src/*": ["src/*"]
  }
}
```

## Import Rules by Context

### Within Same Domain (Relative Imports)

**MUST** use relative imports for same-domain references.

```typescript
// ✅ CORRECT - Same domain
// From: src/domains/auth/sign-up/presentation/ui/views/sign-up-view/index.tsx

// To components in same domain
import { SignUpForm } from '../../components/sign-up-form';

// To stores in same domain
import { useSignUpStore } from '../../../stores/use-sign-up-store';

// To schemas in same domain
import { signUpSchema } from '../../../schemas/sign-up-schema';

// To types in same domain
import type { SignUpFormData } from '../../../types/sign-up';
```

**Relative Path Patterns**:
- `../../components/` - To components from view/section
- `../../../stores/` - To stores from UI layer
- `./index.css` - To styles in same folder

### Cross-Domain or From App (Absolute Imports)

**MUST** use absolute imports when crossing domain boundaries or importing from app pages.

```typescript
// ✅ CORRECT - Cross-domain
// From: src/domains/cafeteria/...
import { useAuth } from '@/src/domains/auth/hooks/use-auth';
import type { User } from '@/src/domains/user/domain/entities/user';

// ✅ CORRECT - From app pages (public routes)
// From: app/(public)/auth/sign-up/page.tsx
import { SignUpView } from '@/src/domains/auth/sign-up/presentation/ui/views/sign-up-view';

// ✅ CORRECT - From app pages (protected routes)
// From: app/(auth)/profile/page.tsx
import { ProfilePageView } from '@/src/domains/auth/profile/presentation/ui/views/profile-page-view';
```

### Package Imports (Always Absolute)

**MUST** always use package path aliases for `@nugudi` packages.

```typescript
// ✅ CORRECT - Package imports
import { Button } from '@nugudi/react-components-button';
import { Box, Flex, VStack } from '@nugudi/react-components-layout';
import { Heading, Title, Body } from '@nugudi/react-components-layout';
import { vars } from '@nugudi/themes';
import { useToggle } from '@nugudi/react-hooks-toggle';
import { AppleIcon, HeartIcon } from '@nugudi/assets-icons';
import type { ApiResponse } from '@nugudi/types';

// ❌ WRONG - Relative imports for packages
import { Button } from '../../../../../packages/react/components/button'; // NO!
```

## Package Import Patterns

### Layout Components (Multiple Named Exports)

```typescript
// ✅ CORRECT - Import multiple components at once
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

// Typography components (from same package)
import {
  Logo,
  Heading,
  Title,
  Body,
  Emphasis,
} from '@nugudi/react-components-layout';
```

### Individual Components (Single Named Export)

```typescript
// ✅ CORRECT - Each component from its own package
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

// ❌ WRONG - No default exports
import Button from '@nugudi/react-components-button'; // NO!
```

### Icon Imports (Multiple Named Exports)

```typescript
// ✅ CORRECT - Import individual icons directly
import { AppleIcon, HeartIcon, CalendarIcon } from '@nugudi/assets-icons';
import { ChevronRightIcon, ArrowRightIcon } from '@nugudi/assets-icons';
import { CoinIcon } from '@nugudi/assets-icons';

// Usage
<AppleIcon />
<HeartIcon />
```

### Hooks (Multiple Named Exports)

```typescript
// ✅ CORRECT - Import hooks from package
import { useButton, useToggleButton } from '@nugudi/react-hooks-button';
import { useSwitch, useToggleSwitch } from '@nugudi/react-hooks-switch';
import { useToggle } from '@nugudi/react-hooks-toggle';
import { useStepper } from '@nugudi/react-hooks-use-stepper';
```

### Themes (Named Export: `vars`)

```typescript
// ✅ CORRECT - Use 'vars' not 'variables'
import { vars } from '@nugudi/themes';

// Colors
vars.colors.$static
vars.colors.$scale.zinc[500]
vars.colors.$scale.red[600]

// Spacing
vars.box.spacing[16]

// Border Radius
vars.box.radii.lg

// Shadows
vars.box.shadows.sm

// Typography
vars.typography.fontSize
vars.typography.fontWeight
vars.typography.lineHeight
```

## DI Container Imports

### ⚠️ Critical: Direct File Imports Required

**ALWAYS import containers directly from the specific container file**, NOT from barrel exports at `@domain/di`.

```typescript
// ✅ CORRECT: Direct imports from specific files
import { createUserServerContainer } from '@/src/domains/user/di/user-server-container';
import { getUserClientContainer } from '@/src/domains/user/di/user-client-container';

// ❌ WRONG: Barrel export from @user/di
import { createUserServerContainer } from '@user/di';
import { getUserClientContainer } from '@user/di';
```

**Why Direct Imports?**
- Barrel exports bundle BOTH `*-server-container.ts` AND `*-client-container.ts` together
- Webpack cannot tree-shake properly → server code leaks into client bundles
- `server-only` package error in client code → **Build fails**
- Bundle size increases with unused server dependencies

**Solution:** Always use absolute path imports to specific container files.

### Server Container

**Location**: `domains/{domain}/di/{domain}-server-container.ts`
**Function**: `createXXXServerContainer(baseUrl?: string)`

```typescript
// ✅ CORRECT - Server Components, Pages, Server Actions
import { createAuthServerContainer } from '@/src/domains/auth/di/auth-server-container';
import { createUserServerContainer } from '@/src/domains/user/di/user-server-container';

const container = createAuthServerContainer(); // New instance per request
const useCase = container.getLoginWithOAuth();
```

### Client Container

**Location**: `domains/{domain}/di/{domain}-client-container.ts`
**Function**: `getXXXClientContainer()`

```typescript
// ✅ CORRECT - Client Components, Hooks
import { getAuthClientContainer } from '@/src/domains/auth/di/auth-client-container';
import { getUserClientContainer } from '@/src/domains/user/di/user-client-container';

const container = getAuthClientContainer(); // Lazy singleton
const useCase = container.getLoginWithOAuth();
```

## Core Infrastructure Imports

### HttpClient & TokenProvider

```typescript
// ✅ CORRECT - Import from core infrastructure
import { FetchHttpClient, AuthenticatedHttpClient } from '@core/infrastructure/http';
import { ServerTokenProvider, ClientTokenProvider } from '@core/infrastructure/http';
```

### SessionManager

```typescript
// ✅ CORRECT - Server vs Client SessionManager
import { ServerSessionManager } from '@core/infrastructure/storage';
import { ClientSessionManager } from '@core/infrastructure/storage';
```

### TanStack Query

```typescript
// ✅ CORRECT - Query client utilities
import getQueryClient from '@core/infrastructure/configs/tanstack-query/get-query-client';
```

## Import Priority Order

**When importing, follow this priority**:

1. **React & Next.js** (if needed)
2. **@nugudi packages** (components, hooks, themes, icons)
3. **@tanstack/react-query** (if needed)
4. **Domain-specific** (DI Containers, UseCases, types)
5. **Core utilities** (`@core/*`)
6. **Relative imports** (same-domain components, styles)

```typescript
// ✅ CORRECT - Proper import order
import React from 'react';
import { redirect } from 'next/navigation';

import { Button } from '@nugudi/react-components-button';
import { Box, VStack } from '@nugudi/react-components-layout';
import { vars } from '@nugudi/themes';

import { useSuspenseQuery } from '@tanstack/react-query';

import { getUserClientContainer } from '@/src/domains/user/di/user-client-container';
import type { User } from '@/src/domains/user/domain/entities/user';

import { formatDate } from '@core/utils/date';

import { ProfileCard } from '../../components/profile-card';
import * as styles from './index.css';
```

## Domain Isolation Rules

### MUST Rules

- **MUST** keep domains isolated (no direct cross-domain imports except via `@core`)
- **MUST** use `@core/shared/type` for domain-agnostic types
- **MUST** use relative imports within same domain
- **MUST** use absolute imports for cross-domain references

### NEVER Rules

- **NEVER** import Entity directly from another domain
  - ❌ `import { UserEntity } from '@user/domain/entities'`
  - ✅ `import type { UserId } from '@core/shared/type/user'`

- **NEVER** use relative imports for packages
  - ❌ `import { Button } from '../../../../../packages/react/components/button'`
  - ✅ `import { Button } from '@nugudi/react-components-button'`

- **NEVER** bypass DI Containers with direct imports
  - ❌ `import { UserRepository } from '@user/data/repositories'`
  - ✅ `const container = getUserClientContainer(); const repo = container.getUserRepository();`

## Package Setup Requirements

### When Using ANY `@nugudi/react-components-*` Package:

**Step 1**: Add package to `package.json`

```json
{
  "dependencies": {
    "@nugudi/react-components-button": "workspace:*",
    "@nugudi/react-components-input": "workspace:*"
  }
}
```

**Step 2**: Import package styles in `fds.module.css`

```css
/* apps/web/src/shared/styles/fds.module.css */

/* 1. ALWAYS import themes first (required) */
@import '@nugudi/themes/themes.css';

/* 2. Import layout package (contains layout AND typography) */
@import '@nugudi/react-components-layout/style.css';

/* 3. Import individual component packages */
@import '@nugudi/react-components-button/style.css';
@import '@nugudi/react-components-input/style.css';
```

**Step 3**: Run `pnpm install`

## Quick Reference

| Import Type | Pattern | Example |
|-------------|---------|---------|
| Same domain | Relative (`../../`) | `import { Form } from '../../components/form'` |
| Cross-domain | Absolute (`@/src/domains/`) | `import { useAuth } from '@/src/domains/auth/hooks'` |
| Packages | Package alias (`@nugudi/`) | `import { Button } from '@nugudi/react-components-button'` |
| Core | Core alias (`@core/`) | `import { formatDate } from '@core/utils/date'` |
| DI Container (Server) | Absolute (`@/src/domains/`) | `import { createAuthServerContainer } from '@/src/domains/auth/di/auth-server-container'` |
| DI Container (Client) | Absolute (`@/src/domains/`) | `import { getAuthClientContainer } from '@/src/domains/auth/di/auth-client-container'` |

---

**Related**: See `core/architecture.md` for layer hierarchy, `ddd/di-containers.md` for Container usage
