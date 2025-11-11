---
description: "Frontend architecture documentation directory - Page/View/Section/Component patterns, DI Container usage, and Next.js App Router patterns"
globs:
  - "apps/web/src/domains/**/presentation/ui/**/*.tsx"
  - "apps/web/app/**/*.tsx"
alwaysApply: true
---

# Frontend Architecture Documentation

This directory contains focused documentation for Next.js App Router component architecture.

## Documentation Files

### 1. [component-hierarchy.md](./component-hierarchy.md)
**Start here** - Overall component architecture guide

- Component hierarchy: Page → View → Section → Component
- Layer responsibilities and boundaries
- Import patterns (relative vs absolute)
- Folder structure rules
- Naming conventions
- Quick reference tables

**When to read**: Before starting any frontend development

### 2. [page-patterns.md](./page-patterns.md)
Complete guide for Page layer implementation

- Server Component patterns
- Server Container usage (`createXXXServerContainer()`)
- Data prefetching with TanStack Query
- HydrationBoundary setup
- Metadata generation (static & dynamic)
- Complete implementation examples

**When to read**: Creating or modifying files in `app/**/page.tsx`

### 3. [view-patterns.md](./view-patterns.md)
Complete guide for View layer implementation

- Section composition patterns
- Layout structure (Grid, Flex)
- Page-level UI state management
- URL-based state (preferred over local state)
- Complete implementation examples

**When to read**: Creating or modifying files in `**/presentation/ui/views/**/*.tsx`

### 4. [section-patterns.md](./section-patterns.md)
Complete guide for Section layer implementation

- Client Component patterns
- Client Container usage (`getXXXClientContainer()`)
- Data fetching with TanStack Query
- Suspense/ErrorBoundary implementation
- Skeleton and Error fallback best practices
- Adapter usage for Entity → UI Type transformations
- Feature-specific state management

**When to read**: Creating or modifying files in `**/presentation/ui/sections/**/*.tsx`

### 5. [component-patterns.md](./component-patterns.md)
Complete guide for Component layer implementation

- Pure/presentational component design
- Props interface design patterns
- Callback props for event handling
- UI-only state management
- Styling with Vanilla Extract
- Design tokens usage (vars from `@nugudi/themes`)
- Complete implementation examples

**When to read**: Creating or modifying files in `**/presentation/ui/components/**/*.tsx`

## Quick Navigation

### By Task

| Task | Read This |
|------|-----------|
| **Understanding architecture** | [component-hierarchy.md](./component-hierarchy.md) |
| **Creating a new page route** | [page-patterns.md](./page-patterns.md) |
| **Building page layout** | [view-patterns.md](./view-patterns.md) |
| **Implementing feature with data** | [section-patterns.md](./section-patterns.md) |
| **Creating reusable UI component** | [component-patterns.md](./component-patterns.md) |

### By File Location

| File Path Pattern | Read This |
|-------------------|-----------|
| `app/(auth|public)/**/page.tsx` | [page-patterns.md](./page-patterns.md) |
| `**/presentation/ui/views/**/*.tsx` | [view-patterns.md](./view-patterns.md) |
| `**/presentation/ui/sections/**/*.tsx` | [section-patterns.md](./section-patterns.md) |
| `**/presentation/ui/components/**/*.tsx` | [component-patterns.md](./component-patterns.md) |

## Related Documentation

- **[../packages.md](../packages.md)** - DDD Architecture, DI Containers, Repository/UseCase patterns
- **[../adapter-pattern.md](../adapter-pattern.md)** - Entity → UI Type transformation guide
- **[../hooks-guide.md](../hooks-guide.md)** - TanStack Query custom hooks and general hooks
- **[../nextjs-component-structure-guideline.md](../nextjs-component-structure-guideline.md)** - Next.js App Router route structure
- **[../storybook-guideline.md](../storybook-guideline.md)** - Storybook development workflow

## Key Principles

### 1. Component Hierarchy (NEVER Skip Layers)
```
Page → View → Section → Component
```

### 2. Data Flow (Server → Client)
```
Page (Server Container, Prefetch)
  → View (Compose)
    → Section (Client Container, Fetch)
      → Component (Props)
```

### 3. Container Usage (CRITICAL)
- **Server Container**: Pages only (`createXXXServerContainer()`)
- **Client Container**: Sections only (`getXXXClientContainer()`)
- **NO Container**: Views and Components (no data fetching)

### 4. Import Rules
- **Same Domain**: Relative imports (`../../sections/user-section`)
- **Cross Domain**: Absolute imports (`@/src/domains/auth/...`)
- **Shared/Core**: Alias imports (`@core/ui/components/...`)
- **Packages**: Package imports (`@nugudi/react-components-button`)

### 5. Styling Rules
- **ALWAYS** use Vanilla Extract (`index.css.ts`)
- **ALWAYS** use design tokens (`vars` from `@nugudi/themes`)
- **NEVER** use hard-coded values (colors, spacing, etc.)
- **NEVER** use CSS Modules

## Common Mistakes

### ❌ Wrong Container Usage
```typescript
// ❌ WRONG - Client Container in Page (Server Component)
const Page = async () => {
  const container = getUserClientContainer(); // NO!
  // ...
};

// ❌ WRONG - Server Container in Section (Client Component)
"use client";
const Section = () => {
  const container = createUserServerContainer(); // NO!
  // ...
};
```

### ❌ Wrong Layer Skipping
```typescript
// ❌ WRONG - Page directly importing Component
import { UserProfileCard } from '@/src/domains/user/presentation/ui/components/user-profile-card';

// ✅ CORRECT - Page → View → Section → Component
import { ProfileView } from '@/src/domains/user/presentation/ui/views/profile-view';
```

### ❌ Wrong Data Fetching
```typescript
// ❌ WRONG - Component fetching data
export const UserCard = () => {
  const { data } = useSuspenseQuery(...); // NO!
  return <div>{data.name}</div>;
};

// ✅ CORRECT - Section fetches, Component receives props
export const UserCard = ({ name }: { name: string }) => {
  return <div>{name}</div>;
};
```

## File Statistics

| File | Lines | Examples | Coverage |
|------|-------|----------|----------|
| component-hierarchy.md | 489 | 9 | Architecture overview |
| page-patterns.md | 533 | 5 | Page layer complete guide |
| view-patterns.md | 564 | 10 | View layer complete guide |
| section-patterns.md | 810 | 16 | Section layer complete guide |
| component-patterns.md | 1,048 | 20 | Component layer complete guide |
| **Total** | **3,444** | **60+** | **Complete** |

## Contributing

When updating these documentation files:

1. **Maintain YAML frontmatter** - Keep globs and descriptions accurate
2. **Add examples** - Use "✅ CORRECT" and "❌ WRONG" patterns
3. **Cross-reference** - Link to related documentation
4. **Keep focused** - Each file covers one layer only
5. **Update all files** - If architecture changes, update all affected files

## Questions?

- For DDD Architecture questions: See [../packages.md](../packages.md)
- For Adapter Pattern questions: See [../adapter-pattern.md](../adapter-pattern.md)
- For Query Hooks questions: See [../hooks-guide.md](../hooks-guide.md)
- For general architecture questions: Start with [component-hierarchy.md](./component-hierarchy.md)
