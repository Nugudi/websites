---
description: "Package system overview, monorepo structure, import rules, and setup requirements"
globs:
  - "packages/**/*"
  - "apps/web/src/**/*"
  - "apps/web/package.json"
alwaysApply: true
---

# Package System Guide

> **Document Type**: Package System Index & Navigation
> **Target Audience**: All developers and AI agents
> **Purpose**: Central entry point for understanding the monorepo package system
> **Last Updated**: 2025-01-12

## 📖 What This Document Covers

This is the **central index** for understanding how packages work in the Nugudi monorepo. Read this first to understand:

- 🏗️ **Monorepo Architecture**: Turbo workspace structure, DDD organization
- 📦 **Package Usage**: Import patterns, component priorities, styling
- ⚙️ **Setup Requirements**: package.json dependencies, CSS imports

---

## 🚀 Quick Start (Read These in Order)

### 1. Understanding the Structure (Start Here)

**📄 [packages/monorepo-structure.md](./packages/monorepo-structure.md)**

Essential reading for understanding the codebase organization.

**What You'll Learn**:
- Turbo monorepo architecture with pnpm workspaces
- 6 DDD bounded contexts (auth, user, cafeteria, benefit, notification, stamp)
- 4-layer Clean Architecture (Presentation → Domain → Data → Infrastructure)
- Directory structure: `apps/web/src/domains/` vs `packages/`
- TypeScript path aliases (`@auth/*`, `@user/*`, `@core/*`)

**When to Read**:
- ✅ First time working on the codebase
- ✅ Before creating new features
- ✅ When confused about where files belong

---

### 2. Using Packages Correctly (Critical for Development)

**📄 [packages/package-usage.md](./packages/package-usage.md)**

**CRITICAL RULES** for using shared packages in your code.

**What You'll Learn**:
- **PRIORITY #1**: Use Layout components (`@nugudi/react-components-layout`) FIRST
- **PRIORITY #2**: Use Typography components (`@nugudi/react-components-typography`) SECOND
- Import patterns: Multiple imports for Layout/Typography, single imports for others
- Component hierarchy and priority order
- When to use packages vs custom components

**When to Read**:
- ✅ Before importing ANY `@nugudi/*` package
- ✅ Before creating ANY new UI component
- ✅ When deciding between package component vs custom component

**Key Takeaway**:
```typescript
// ✅ CORRECT - Use packages first
import { Box, Flex, VStack } from '@nugudi/react-components-layout';
import { Text, Heading } from '@nugudi/react-components-typography';

// ❌ WRONG - Don't create custom layouts/text
const customLayout = style({ display: 'flex' }); // NO!
```

---

### 3. Setting Up Packages (Setup Checklist)

**📄 [packages/package-setup.md](./packages/package-setup.md)**

Step-by-step setup requirements when adding new package dependencies.

**What You'll Learn**:
- TWO required steps when using any `@nugudi` package
- How to add packages to `apps/web/package.json`
- How to import styles in `apps/web/src/core/ui/styles/fds.module.css`
- Complete setup checklist and verification steps

**When to Read**:
- ✅ When adding a new `@nugudi/*` package to your code
- ✅ When components render without styles
- ✅ When setting up development environment

**Setup Checklist**:
1. ✅ Add package to `package.json` dependencies
2. ✅ Import `style.css` in `fds.module.css`
3. ✅ Run `pnpm install`
4. ✅ Verify component renders with styles

---

## 🎯 Common Workflows

### "I need to create a new UI component"

**Step 1**: Read [packages/package-usage.md](./packages/package-usage.md) first
- Check if Layout components can solve your need (Box, Flex, Stack, Grid)
- Check if Typography components can solve your need (Text, Heading)

**Step 2**: If packages exist for your need
- Follow [packages/package-setup.md](./packages/package-setup.md) to set them up
- Use the package components

**Step 3**: If NO package exists
- Read [../frontend/component-hierarchy.md](./frontend/component-hierarchy.md)
- Create component in correct layer (View/Section/Component)

---

### "I don't know where to put my code"

**Step 1**: Read [packages/monorepo-structure.md](./packages/monorepo-structure.md)
- Understand the 6 bounded contexts (domains)
- Understand the 4 Clean Architecture layers

**Step 2**: Determine the domain
- Authentication? → `src/domains/auth/`
- User profile? → `src/domains/user/`
- Cafeteria? → `src/domains/cafeteria/`
- Benefits? → `src/domains/benefit/`
- Notifications? → `src/domains/notification/`
- Stamps? → `src/domains/stamp/`

**Step 3**: Determine the layer
- UI component? → `presentation/ui/`
- Business logic? → `domain/usecases/`
- API call? → `data/repositories/`
- HTTP client? → `core/infrastructure/http/`

---

### "I need to understand DDD and DI Containers"

**This document covers package usage only.**

For DDD patterns and Dependency Injection:
- Read [../ddd/entity-patterns.md](./ddd/entity-patterns.md) — Entity design
- Read [../ddd/usecase-patterns.md](./ddd/usecase-patterns.md) — UseCase implementation
- Read [../ddd/di-server-containers.md](./ddd/di-server-containers.md) — Server DI containers
- Read [../ddd/di-client-containers.md](./ddd/di-client-containers.md) — Client DI containers

---

## 📋 Package Categories

### Design System Packages

Located in `packages/react/components/` and `packages/themes/`:

- **Layout** (`@nugudi/react-components-layout`) — Box, Flex, Stack, Grid
- **Typography** (`@nugudi/react-components-typography`) — Text, Heading
- **Button** (`@nugudi/react-components-button`) — Button components
- **Input** (`@nugudi/react-components-input`) — Form inputs
- **Icons** (`@nugudi/react-components-icons`) — Icon components
- **Themes** (`@nugudi/themes`) — Design tokens (colors, spacing, fonts)

### Custom React Hooks

Located in `packages/react/hooks/`:

- **useBoolean** — Boolean state management
- **useCounter** — Counter state management
- **useDisclosure** — Open/close state management
- **useLocalStorage** — LocalStorage hook
- And more... (see `packages/react/hooks/` directory)

---

## 🔗 Related Documentation

### Architecture & Patterns
- [../core/architecture.md](./core/architecture.md) — High-level architecture overview
- [../ddd/entity-patterns.md](./ddd/entity-patterns.md) — DDD Entity patterns
- [../frontend/component-hierarchy.md](./frontend/component-hierarchy.md) — Component hierarchy

### Development Workflow
- [../patterns/storybook-guideline.md](./patterns/storybook-guideline.md) — Storybook development
- [../core/commit-conventions.md](./core/commit-conventions.md) — Commit message format

### Testing
- [../testing/testing-principles.md](./testing/testing-principles.md) — Testing strategies

---

## 🚨 Critical Rules (MUST READ)

### Package Usage Priority

1. **ALWAYS** check Layout components FIRST (`@nugudi/react-components-layout`)
2. **ALWAYS** check Typography components SECOND (`@nugudi/react-components-typography`)
3. **ONLY** create custom components if packages don't meet requirements

### Setup Requirements

- **MUST** add package to `package.json` dependencies
- **MUST** import `style.css` in `fds.module.css`
- **MUST** run `pnpm install` after adding packages

### Import Patterns

```typescript
// ✅ CORRECT - Multiple imports for Layout/Typography
import { Box, Flex, VStack, HStack } from '@nugudi/react-components-layout';
import { Text, Heading } from '@nugudi/react-components-typography';

// ✅ CORRECT - Single import for other components
import { Button } from '@nugudi/react-components-button';
import { Input } from '@nugudi/react-components-input';

// ❌ WRONG - Multiple exports for non-Layout/Typography packages
import { Button, IconButton } from '@nugudi/react-components-button'; // NO!
```

### Monorepo Structure

- **apps/web/src/domains/** — 6 DDD bounded contexts with Clean Architecture
- **apps/web/src/core/** — Shared infrastructure and UI (NOT `src/shared/core`)
- **packages/react/** — Design system components and hooks
- **packages/themes/** — Design tokens

---

## 🎓 Learning Path

For new developers or AI agents:

1. **Start**: Read [packages/monorepo-structure.md](./packages/monorepo-structure.md) (10 min)
2. **Next**: Read [packages/package-usage.md](./packages/package-usage.md) (15 min)
3. **Then**: Read [packages/package-setup.md](./packages/package-setup.md) (5 min)
4. **Finally**: Read [../frontend/component-hierarchy.md](./frontend/component-hierarchy.md) (10 min)

**Total Time**: ~40 minutes to understand the complete package system.

---

## 📞 Need Help?

- **Can't find where code belongs?** → Read [packages/monorepo-structure.md](./packages/monorepo-structure.md)
- **Don't know which package to use?** → Read [packages/package-usage.md](./packages/package-usage.md)
- **Component has no styles?** → Read [packages/package-setup.md](./packages/package-setup.md)
- **Need DDD/DI help?** → Read [../ddd/entity-patterns.md](./ddd/entity-patterns.md)
- **Need frontend architecture help?** → Read [../frontend/component-hierarchy.md](./frontend/component-hierarchy.md)

---

**Remember**: This is an **index document**. For detailed information, follow the links to specific documents listed above.
