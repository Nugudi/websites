---
description: Code quality with Biome, naming conventions, development workflow, best practices
globs:
  - "**/*.ts"
  - "**/*.tsx"
alwaysApply: true
---

# Code Quality & Development Workflow

## Code Quality with Biome

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

## Naming Conventions

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
export const useMyCustomHook = () => {};

// Event handlers: on + Action + Target
const onClickSubmit = () => {};
const onChangeInput = () => {};

// Stores: use + Feature + Store
export const useSignUpStore = () => {};
```

### Domain Entity Naming Consistency

When working with domain entities, maintain consistent naming throughout the codebase:

#### Example: Cafeteria Domain

```typescript
// ✅ CORRECT - Consistent "cafeteria" naming
interface CafeteriaRecommendCardProps {
  cafeteriaId: string;
  cafeteriaName: string;
  cafeteriaAddress: string;
  cafeteriaTime: string;
}

export interface Cafeteria {
  id: string;
  name: string;
  // ...
}

const MOCK_CAFETERIA_LIST: Cafeteria[] = [];

// Link routing
<Link href={`/cafeterias/${cafeteriaId}`}>

// ❌ WRONG - Mixed naming (restaurant/cafeteria)
interface CafeteriaRecommendCardProps {
  restaurantId: string;  // NO! Use cafeteriaId
  restaurantName: string;  // NO! Use cafeteriaName
}
```

#### Example: Benefit Domain

```typescript
// ✅ CORRECT - Consistent "benefit" naming
export const BenefitPageView = () => {};
export const BenefitHighlightSection = () => {};
export const BenefitCard = () => {};

// Routes should match
// app/(auth)/benefits/page.tsx
```

### Import/Export Consistency

```typescript
// ✅ CORRECT - Named exports for ALL components/sections/views
// domains/cafeteria/presentation/ui/components/cafeteria-menu-list/index.tsx
export const CafeteriaMenuList = () => {};

// domains/cafeteria/presentation/ui/sections/cafeteria-recommend-section/index.tsx
export const CafeteriaRecommendSection = () => {};

// domains/cafeteria/presentation/ui/views/cafeteria-home-view/index.tsx
export const CafeteriaHomeView = () => {};

// ✅ CORRECT - Default export ONLY for page.tsx files
// app/page.tsx
import { CafeteriaHomeView } from '@/src/domains/cafeteria/presentation/ui/views/cafeteria-home-view';
const HomePage = () => {
  return <CafeteriaHomeView />;
};
export default HomePage;

// ✅ CORRECT - Named exports for hooks and utilities
export const useCafeteriaList = () => {};
export type CafeteriaData = {};
```

## Development Workflow

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

## Critical Rules

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
- **NEVER** bypass DI Containers (직접 UseCase/Repository 인스턴스 생성하지 말것)
- **NEVER** use HttpClient directly (always use through DI Container)
- **NEVER** create components that exist in packages
- **NEVER** use PascalCase for file/folder names (except index.tsx)
- **NEVER** use inline styles (use Vanilla Extract)
- **NEVER** add Co-Author lines in commits
- **NEVER** use any type in TypeScript
- **NEVER** skip tests for new features
- **NEVER** mix server and client containers (서버는 서버 컨테이너, 클라이언트는 클라이언트 컨테이너)
- **NEVER** create new instances of Client Container (항상 singleton 사용)

## Package Setup Requirements

### When Using Any `@nugudi` Package Component

When you import any component from `@nugudi` packages, you MUST complete TWO setup steps:

#### Step 1: Add Package to package.json

```json
// In apps/web/package.json
{
  "dependencies": {
    "@nugudi/react-components-layout": "workspace:*",
    "@nugudi/react-components-button": "workspace:*",
    "@nugudi/react-components-input": "workspace:*"
    // Add any other packages you use
  }
}
```

#### Step 2: Import Package Styles in FDS Module

```css
/* In apps/web/src/shared/styles/fds.module.css */
@import '@nugudi/themes/themes.css';
@import '@nugudi/react-components-layout/style.css';
@import '@nugudi/react-components-button/style.css';
@import '@nugudi/react-components-input/style.css';
/* Add style.css for EVERY package component you use */
```

### CRITICAL: Complete Setup Checklist

When using ANY `@nugudi/react-components-*` package:

1. ✅ **Check package.json**: Ensure the package is listed in dependencies
2. ✅ **Check fds.module.css**: Ensure the package's `style.css` is imported
3. ✅ **Run `pnpm install`**: After adding new packages to package.json
4. ✅ **Verify styles load**: Component should render with proper styles

### Example: Adding a New Component

If you want to use `@nugudi/react-components-textarea`:

```typescript
// 1. First, add to package.json dependencies:
"@nugudi/react-components-textarea": "workspace:*",

// 2. Then, add to fds.module.css:
@import '@nugudi/react-components-textarea/style.css';

// 3. Run pnpm install:
pnpm install

// 4. Now you can use it:
import { Textarea } from '@nugudi/react-components-textarea';
```

### Package Style Import Pattern

```css
/* In apps/web/src/shared/styles/fds.module.css */

/* 1. ALWAYS import themes first (required) */
@import '@nugudi/themes/themes.css';

/* 2. Import layout package (contains layout AND typography components) */
@import '@nugudi/react-components-layout/style.css';
/* Layout includes: Box, Flex, VStack, HStack, Stack, Grid, GridItem, Divider */
/* Typography includes: Heading, Title, Body, Emphasis, Logo */

/* 3. Import individual component packages as needed */
@import '@nugudi/react-components-[component-name]/style.css';
/* Examples: button, input, chip, tab, switch, textarea, etc. */
```

### Import Rule Pattern

For ANY `@nugudi/react-components-*` package:

```
Package name: @nugudi/react-components-[name]
Style import: @import '@nugudi/react-components-[name]/style.css';
```

**The pattern is consistent:**

- Package: `@nugudi/react-components-button`
- Style: `@import '@nugudi/react-components-button/style.css';`

- Package: `@nugudi/react-components-input`
- Style: `@import '@nugudi/react-components-input/style.css';`

- Package: `@nugudi/react-components-bottom-sheet`
- Style: `@import '@nugudi/react-components-bottom-sheet/style.css';`

### Common Mistakes to Avoid

- **Forgetting to import style.css**: Component renders without styles
- **Not adding to package.json**: Import fails with "module not found"
- **Not running pnpm install**: Package not available in node_modules
- **Importing wrong path**: Use `workspace:*` for local packages

## Best Practices & Development Tips

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

## Available Packages

### Component Packages

```typescript
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
```

### Hook Packages

```typescript
@nugudi/react-hooks-button
@nugudi/react-hooks-switch
@nugudi/react-hooks-toggle
@nugudi/react-hooks-use-stepper
```

### Core Packages

```typescript
@nugudi/types                // Shared TypeScript types
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

## Quick Reference

### Project Structure

- **Apps**: `web` (Next.js 16)
- **Architecture**: Domain-based DDD
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

1. `@nugudi/react-components-layout` - Layout & Typography
2. `@nugudi/react-components-*` - Individual components
3. `@nugudi/react-hooks-*` - React hooks
4. `@nugudi/themes` - Design tokens
5. `@nugudi/assets-icons` - Icons
6. Domain-specific code

### Import Rules

#### Within Same Domain - Use Relative Imports

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

#### Cross-Domain or from App - Use Absolute Imports

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

#### Package Imports - Always Use Package Path

```typescript
// ✅ CORRECT - Always use package imports for packages
import { Button } from '@nugudi/react-components-button';
import { vars } from '@nugudi/themes';

// ❌ WRONG - Never use relative imports for packages
import { Button } from '../../../../../packages/react/components/button'; // NO!
```

---

**Remember**: This is a **DDD-based, package-first monorepo** - maximize reuse and respect architectural boundaries!

**Related**: See `monorepo-structure.md` for architecture, `package-usage.md` for components, `architecture-patterns.md` for DDD patterns
