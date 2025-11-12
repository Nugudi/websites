---
description: Entry point for AI agents - Cursor IDE rules & coding standards
globs:
  - "**/*"
alwaysApply: true
---

# Cursor IDE Rules - AI Agent Entry Point

> **Purpose**: This is the ONLY entry point for AI agents (Cursor, Claude, GPT) working with Cursor IDE rules
> **When to Read**: At the start of EVERY session and before ANY code changes
> **Critical**: All rules use frontmatter (`alwaysApply: true`) for automatic IDE integration

## 🚨 CRITICAL: Cursor Rules vs Claude Documentation

This repository has TWO documentation systems that work together:

| System | Location | Purpose | When to Use |
|--------|----------|---------|-------------|
| **Cursor IDE Rules** | `.cursor/rules/` (19 files) | Active rules enforced by Cursor IDE | During coding in Cursor IDE |
| **Claude Documentation** | `claude/` (40 files) | Comprehensive learning guide | Deep learning, onboarding, reference |

**Key Differences**:
- `.cursor/rules/` = **Concise, actionable rules** with IDE integration (frontmatter globs)
- `claude/` = **Detailed explanations** with examples, rationale, and learning paths

**Rule of Thumb**:
- 🎯 **Quick reference during coding** → Use `.cursor/rules/`
- 📚 **Deep understanding & learning** → Read `claude/` documentation
- 🔄 **Both are always in sync** → Same architectural principles

---

## 🚀 Quick Start (First Time in Cursor?)

### Step 1: Understand the Architecture (5 minutes)

**Read FIRST**:
1. **[core/architecture.md](./core/architecture.md)** — Clean Architecture 4 layers, 6 domains, tech stack
2. **[core/import-conventions.md](./core/import-conventions.md)** — TypeScript path aliases, domain isolation

**Key Takeaways**:
```
4 Layers: Presentation → Domain → Data → Infrastructure
6 Domains: auth, benefit, cafeteria, notification, stamp, user
Tech: Next.js 16 + React 19 + TypeScript 5.8.3
```

### Step 2: Learn Critical Patterns (10 minutes)

**Read ESSENTIAL**:
1. **[ddd/di-containers.md](./ddd/di-containers.md)** — DI Container patterns (Server vs Client)
2. **[frontend/component-hierarchy.md](./frontend/component-hierarchy.md)** — Component layers (Page → View → Section → Component)

**Key Takeaways**:
```typescript
// Server Container (stateless, per-request)
const container = createUserServerContainer(sessionManager);

// Client Container (lazy singleton)
const container = getUserClientContainer();
```

### Step 3: Ready to Code! 🎉

You now understand the fundamentals. For specific patterns, see the **📚 Complete Rules Map** below.

---

## 📚 Complete Rules Map (All 19 Files)

### 🏛️ Core Rules (4 files) - **ALWAYS APPLY**

| File | Description | alwaysApply |
|------|-------------|-------------|
| **[core/architecture.md](./core/architecture.md)** | Clean Architecture 4 layers, 6 bounded contexts, tech stack | ✅ YES |
| **[core/import-conventions.md](./core/import-conventions.md)** | TypeScript path aliases, domain isolation rules | ✅ YES |
| **[core/commit-conventions.md](./core/commit-conventions.md)** | Git commit format (**CRITICAL**: no Co-Author) | ✅ YES |

**When to Use**: Every file, every commit, every import statement.

---

### 🏛️ DDD Rules (2 files) - **ALWAYS APPLY**

| File | Description | Applies To | alwaysApply |
|------|-------------|------------|-------------|
| **[ddd/di-containers.md](./ddd/di-containers.md)** | Server vs Client DI Container patterns | `**/di/**/*-container.ts` | ✅ YES |
| **[ddd/adapters.md](./ddd/adapters.md)** | Adapter pattern for Entity → UI transformation | `**/presentation/adapters/**` | ✅ YES |

**When to Use**:
- Creating/using DI Containers → [ddd/di-containers.md](./ddd/di-containers.md)
- Transforming Entity to UI types → [ddd/adapters.md](./ddd/adapters.md)

---

### 🎨 Frontend Rules (5 files) - **ALWAYS APPLY**

| File | Description | Applies To | alwaysApply |
|------|-------------|------------|-------------|
| **[frontend/component-hierarchy.md](./frontend/component-hierarchy.md)** | 4-layer component hierarchy (Page → View → Section → Component) | All components | ✅ YES |
| **[frontend/page-layer.md](./frontend/page-layer.md)** | Server Components, metadata, SSR prefetch | `**/pages/**`, `app/**/page.tsx` | ✅ YES |
| **[frontend/view-layer.md](./frontend/view-layer.md)** | Client Components, UI orchestration, no data fetch | `**/views/**/*.tsx` | ✅ YES |
| **[frontend/section-layer.md](./frontend/section-layer.md)** | Client Components, data fetch, Suspense/ErrorBoundary | `**/sections/**/*.tsx` | ✅ YES |
| **[frontend/component-data-flow.md](./frontend/component-data-flow.md)** | Props flow, state management, avoid prop drilling | All components | ✅ YES |

**When to Use**:
- Creating new components → [frontend/component-hierarchy.md](./frontend/component-hierarchy.md)
- Building Pages → [frontend/page-layer.md](./frontend/page-layer.md)
- Building Sections with data → [frontend/section-layer.md](./frontend/section-layer.md)

---

### 📦 Package Rules (4 files) - **ALWAYS APPLY**

| File | Description | Applies To | alwaysApply |
|------|-------------|------------|-------------|
| **[packages/monorepo-structure.md](./packages/monorepo-structure.md)** | Monorepo architecture, folder structure, naming | All files | ✅ YES |
| **[packages/package-usage.md](./packages/package-usage.md)** | Layout/Typography components, design tokens | All UI code | ✅ YES |
| **[packages/architecture-patterns.md](./packages/architecture-patterns.md)** | Package architecture, exports, dependencies | `packages/**` | ✅ YES |
| **[packages/code-quality-workflow.md](./packages/code-quality-workflow.md)** | Linting, formatting, type checking workflow | All code files | ✅ YES |

**When to Use**:
- Using design system → [packages/package-usage.md](./packages/package-usage.md)
- Creating packages → [packages/architecture-patterns.md](./packages/architecture-patterns.md)

---

### 🔧 Pattern Rules (1 file) - **ALWAYS APPLY**

| File | Description | Applies To | alwaysApply |
|------|-------------|------------|-------------|
| **[patterns/hooks-guide.md](./patterns/hooks-guide.md)** | Query/Mutation hooks, TanStack Query patterns | `**/hooks/**/*.ts` | ✅ YES |

**When to Use**: Creating React hooks with data fetching.

---

### 🧪 Testing Rules (4 files) - **ALWAYS APPLY**

| File | Description | Applies To | alwaysApply |
|------|-------------|------------|-------------|
| **[testing/testing-principles.md](./testing/testing-principles.md)** | Testing philosophy, what to test vs skip | All tests | ✅ YES |
| **[testing/entity-component-testing.md](./testing/entity-component-testing.md)** | Testing Entities and Components | `**/*.test.ts`, `**/*.test.tsx` | ✅ YES |
| **[testing/mocking-strategies.md](./testing/mocking-strategies.md)** | Mocking DI Containers, repositories, APIs | All test files | ✅ YES |
| **[testing/best-practices.md](./testing/best-practices.md)** | Test organization, naming, coverage | All test files | ✅ YES |

**When to Use**: Writing any test file.

---

## ⚠️ CRITICAL RULES (HIGHEST PRIORITY)

These rules override ANY default AI behavior. You MUST follow them EXACTLY:

### 🔴 DI Container Rules (See [ddd/di-containers.md](./ddd/di-containers.md))

**ALWAYS**:
- ✅ Import containers **directly from specific files** (NOT barrel exports)
- ✅ Use Server Container in Server Components (`createXXXServerContainer()`)
- ✅ Use Client Container in Client Components (`getXXXClientContainer()`)

**NEVER**:
- ❌ Import from barrel exports (`@domain/di`) — **BREAKS BUILD**
- ❌ Use Client Container in Server Components — **BREAKS SSR**
- ❌ Directly instantiate Repository/UseCase

```typescript
// ✅ CORRECT: Direct import
import { createUserServerContainer } from '@/src/domains/user/di/user-server-container';

// ❌ WRONG: Barrel export (bundles server+client code together)
import { createUserServerContainer } from '@user/di';
```

### 🔴 Component Hierarchy Rules (See [frontend/component-hierarchy.md](./frontend/component-hierarchy.md))

**ALWAYS**:
- ✅ Follow hierarchy: Page → View → Section → Component
- ✅ Use Server Container in Pages for SSR prefetch
- ✅ Use Client Container in Sections for data fetch

**NEVER**:
- ❌ Skip layers (e.g., Page directly importing Components)
- ❌ Fetch data in View or Component layers

### 🔴 Commit Rules (See [core/commit-conventions.md](./core/commit-conventions.md))

**ALWAYS**:
- ✅ Format: `[NUGUDI-XXX] type(scope): subject`

**NEVER**:
- ❌ Add Co-Author lines — **THIS BREAKS CI/CD**

### 🔴 Package Usage Rules (See [packages/package-usage.md](./packages/package-usage.md))

**ALWAYS**:
- ✅ Use Layout components (`Box`, `Flex`, `VStack`, `HStack`)
- ✅ Use Typography components (`Heading`, `Title`, `Body`) instead of HTML tags
- ✅ Use design tokens from `@nugudi/themes`

**NEVER**:
- ❌ Use HTML heading tags (`<h1>`, `<p>`, `<span>`)
- ❌ Hardcode colors/spacing (use `vars.box.spacing[16]` NOT `16px`)

---

## 🎯 Context-Specific Quick Reference

### When Implementing Features:
1. [core/architecture.md](./core/architecture.md) — Understand domain
2. [ddd/di-containers.md](./ddd/di-containers.md) — Set up DI Container
3. [frontend/component-hierarchy.md](./frontend/component-hierarchy.md) — Build UI

### When Creating Components:
1. [frontend/component-hierarchy.md](./frontend/component-hierarchy.md) — Layer rules
2. [packages/package-usage.md](./packages/package-usage.md) — Use design system
3. [frontend/component-data-flow.md](./frontend/component-data-flow.md) — Props flow

### When Writing Tests:
1. [testing/testing-principles.md](./testing/testing-principles.md) — What to test
2. [testing/mocking-strategies.md](./testing/mocking-strategies.md) — Mock patterns

### When Making Commits:
1. [core/commit-conventions.md](./core/commit-conventions.md) — Format rules

---

## 🔍 Verification Checklist

Before committing ANY code, verify:

- [ ] Used correct DI Container (Server in SSR, Client in CSR)
- [ ] Imported from specific files (NOT barrel exports)
- [ ] Followed component hierarchy (no layer skipping)
- [ ] Used TypeScript path aliases (e.g., `@user/domain/*`)
- [ ] Used design tokens (NOT hardcoded values)
- [ ] Used Layout/Typography components (NOT HTML tags)
- [ ] Followed commit format (NO Co-Author lines)
- [ ] Added tests for critical logic

---

## 🆘 Need More Details?

**For comprehensive explanations**, examples, and learning paths:
→ See `claude/` documentation (40 files with detailed guides)

**For quick IDE-integrated rules**:
→ Stay in `.cursor/rules/` (this folder)

**Relationship**:
- `.cursor/rules/` = Quick reference for coding
- `claude/` = Deep learning and understanding

Both systems enforce the same architectural principles.

---

**Last Updated**: 2025-01-12
**Total Rules**: 19 files across 6 categories
**All Rules Have**: `alwaysApply: true` for IDE integration
