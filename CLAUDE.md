# AI Agent Instructions (Entry Point)

> **Purpose**: This is the ONLY entry point for AI agents (Claude, GPT, etc.) working on this codebase
> **When to Read**: At the start of EVERY session and before ANY development task
> **Critical**: All documents use MUST/MUST NOT format for unambiguous AI agent behavior

## 🚨 MANDATORY PRE-FLIGHT CHECKLIST

Before performing ANY task in this repository, you MUST:

1. ✅ Read the **Quick Start Guide** below
2. ✅ Confirm understanding of Clean Architecture 4-layer system
3. ✅ Confirm understanding of DI Container patterns (Server vs Client)
4. ✅ Verify no existing solution exists before writing new code
5. ✅ Follow MUST/MUST NOT rules in all documents

**DO NOT PROCEED** without completing this checklist.

---

## 🚀 Quick Start Guide (New to the Project?)

### Step 1: Understand Architecture Fundamentals (10 minutes)

**Read FIRST**:
- **[claude/core/architecture.md](./claude/core/architecture.md)** — High-level overview, monorepo structure, Clean Architecture 4 layers, 6 bounded contexts
- **[claude/core/commit-conventions.md](./claude/core/commit-conventions.md)** — Git commit format (CRITICAL: no Co-Author lines)

**Key Takeaways**:
```
Clean Architecture Layers:
Presentation → Domain → Data → Infrastructure

6 Bounded Contexts (Domains):
auth, benefit, cafeteria, notification, stamp, user

Technology Stack:
Next.js 16 + React 19 + TypeScript 5.8.3 + Vanilla Extract
```

### Step 2: Learn DDD Patterns (20 minutes)

**Read the DDD Core**:
- **[claude/ddd/entity-patterns.md](./claude/ddd/entity-patterns.md)** — Entity design, boolean-based logic, validation rules
- **[claude/ddd/usecase-patterns.md](./claude/ddd/usecase-patterns.md)** — UseCase pattern, business logic orchestration, single responsibility
- **[claude/ddd/repository-patterns.md](./claude/ddd/repository-patterns.md)** — Repository pattern, interface in Domain, implementation in Data
- **[claude/ddd/di-server-containers.md](./claude/ddd/di-server-containers.md)** — Server Container (stateless, per-request, `createXXXServerContainer()`)
- **[claude/ddd/di-client-containers.md](./claude/ddd/di-client-containers.md)** — Client Container (lazy singleton, `getXXXClientContainer()`)

**Key Takeaways**:
```typescript
// CRITICAL: Import containers directly from specific files
import { createUserServerContainer } from '@/src/domains/user/di/user-server-container';
import { getUserClientContainer } from '@/src/domains/user/di/user-client-container';

// ALWAYS use DI Container to get UseCases

// Server-side (requires SessionManager parameter)
const sessionManager = new ServerSessionManager();
const container = createUserServerContainer(sessionManager);
const useCase = container.getGetMyProfile();

// Client-side (lazy singleton, no parameters)
const container = getUserClientContainer();
const useCase = container.getGetMyProfile();

// NEVER directly instantiate
new UserRepository(httpClient); // ❌ WRONG
```

### Step 3: Learn Frontend Patterns (15 minutes)

**Read the Frontend Guides**:
- **[claude/frontend/component-hierarchy.md](./claude/frontend/component-hierarchy.md)** — Component hierarchy (Page → View → Section → Component)
- **[claude/frontend/page-patterns.md](./claude/frontend/page-patterns.md)** — Server Components, SSR data prefetch, Server Container usage
- **[claude/frontend/section-patterns.md](./claude/frontend/section-patterns.md)** — Client Components, data fetch, Client Container usage, Suspense/ErrorBoundary

**Key Takeaways**:
```typescript
// CRITICAL: Import containers directly from specific files
import { createUserServerContainer } from '@/src/domains/user/di/user-server-container';
import { getUserClientContainer } from '@/src/domains/user/di/user-client-container';

// Page (Server Component) - Prefetch with Server Container
const sessionManager = new ServerSessionManager();
const container = createUserServerContainer(sessionManager);
await queryClient.prefetchQuery({
  queryKey: ['user', 'profile'],
  queryFn: () => container.getGetMyProfile().execute(),
});

// Section (Client Component) - Fetch with Client Container
const container = getUserClientContainer();
const { data } = useSuspenseQuery({
  queryKey: ['user', 'profile'],
  queryFn: () => container.getGetMyProfile().execute(),
});
```

### Step 4: Learn Package Usage (10 minutes)

**Read Package Guides**:
- **[claude/packages/package-usage.md](./claude/packages/package-usage.md)** — Layout/Typography components, React components, hooks, themes, styling
- **[claude/packages/package-setup.md](./claude/packages/package-setup.md)** — TWO-STEP SETUP (package.json + fds.module.css)

**Key Takeaways**:
```typescript
// MUST use Layout components BEFORE creating custom layouts
import { Box, Flex, VStack, HStack } from '@nugudi/react-components-layout';

// MUST use Typography components INSTEAD of HTML tags
import { Heading, Title, Body, Emphasis } from '@nugudi/react-components-layout';
<Heading fontSize="h1">제목</Heading> // ✅ CORRECT
<h1>제목</h1> // ❌ WRONG

// MUST use design tokens
import { vars } from '@nugudi/themes';
padding: vars.box.spacing[16] // ✅ CORRECT
padding: '16px' // ❌ WRONG
```

### Step 5: Ready to Code! 🎉

You now understand the fundamentals. For specific tasks, see the **📚 Complete Documentation Map** below.

---

## 📚 Complete Documentation Map

All documentation is organized into 6 categories:

### 📦 Core (Foundational Guides)

**Must Read for All Developers**:
- **[claude/core/architecture.md](./claude/core/architecture.md)** — Architecture overview, monorepo structure, Clean Architecture layers, technology stack
- **[claude/core/commit-conventions.md](./claude/core/commit-conventions.md)** — Git commit format, types, scopes, ticket numbers (**CRITICAL**: no Co-Author lines)

### 🏛️ DDD (Domain-Driven Design Patterns)

**Complete DDD Implementation Guide**:
- **[claude/ddd/entity-patterns.md](./claude/ddd/entity-patterns.md)** — Entity design, boolean-based logic, validation, immutability
- **[claude/ddd/usecase-patterns.md](./claude/ddd/usecase-patterns.md)** — UseCase pattern, business logic, single responsibility, error handling
- **[claude/ddd/repository-patterns.md](./claude/ddd/repository-patterns.md)** — Repository pattern, interface in Domain, implementation in Data
- **[claude/ddd/infrastructure-layer.md](./claude/ddd/infrastructure-layer.md)** — HttpClient, SessionManager, TokenProvider, cross-cutting concerns
- **[claude/ddd/di-server-containers.md](./claude/ddd/di-server-containers.md)** — Server Container (stateless, per-request, eager initialization)
- **[claude/ddd/di-client-containers.md](./claude/ddd/di-client-containers.md)** — Client Container (lazy singleton, client-side only)
- **[claude/ddd/dto-mapper.md](./claude/ddd/dto-mapper.md)** — DTO pattern, snake_case ↔ camelCase mapping, API contracts
- **[claude/ddd/domain-errors.md](./claude/ddd/domain-errors.md)** — Domain errors, error hierarchies, error handling strategies
- **[claude/ddd/testing-ddd.md](./claude/ddd/testing-ddd.md)** — Testing Repository, UseCase, Entity with mocks

### 🎨 Frontend (Component Architecture)

**Complete Frontend Patterns**:
- **[claude/frontend/component-hierarchy.md](./claude/frontend/component-hierarchy.md)** — Component hierarchy (Page → View → Section → Component), layer responsibilities
- **[claude/frontend/page-patterns.md](./claude/frontend/page-patterns.md)** — Server Components, metadata, SSR prefetch, Server Container usage
- **[claude/frontend/view-patterns.md](./claude/frontend/view-patterns.md)** — Client Components, UI orchestration, no data fetching
- **[claude/frontend/section-patterns.md](./claude/frontend/section-patterns.md)** — Client Components, data fetch, Suspense/ErrorBoundary, Client Container usage
- **[claude/frontend/component-patterns.md](./claude/frontend/component-patterns.md)** — Presentational components, props-driven, reusability

### 📦 Packages (Monorepo & Shared Code)

**Package System Documentation**:
- **[claude/packages/monorepo-structure.md](./claude/packages/monorepo-structure.md)** — Monorepo architecture, repository structure, DDD layers, route groups, naming conventions
- **[claude/packages/package-usage.md](./claude/packages/package-usage.md)** — Layout/Typography components, React components/hooks, themes, styling, backend integration
- **[claude/packages/package-setup.md](./claude/packages/package-setup.md)** — TWO-STEP SETUP (package.json + fds.module.css), troubleshooting

### 🔧 Patterns (Implementation Patterns)

**Specialized Development Patterns**:
- **[claude/patterns/adapter-basics.md](./claude/patterns/adapter-basics.md)** — When to use Adapter (7+ Entity methods), Adapter vs Mapper, UI Type design
- **[claude/patterns/adapter-implementation.md](./claude/patterns/adapter-implementation.md)** — Adapter structure, private helpers, JSDoc standards, Entity boolean logic
- **[claude/patterns/adapter-testing.md](./claude/patterns/adapter-testing.md)** — Testing Adapters, mock Entities, comprehensive test coverage
- **[claude/patterns/query-hooks.md](./claude/patterns/query-hooks.md)** — Query Hook pattern, file/hook naming, Client Container usage
- **[claude/patterns/mutation-hooks.md](./claude/patterns/mutation-hooks.md)** — Mutation Hook pattern, optimistic updates, cache invalidation
- **[claude/patterns/query-keys.md](./claude/patterns/query-keys.md)** — Query Key conventions, hierarchical structure, invalidation patterns
- **[claude/patterns/storybook-guideline.md](./claude/patterns/storybook-guideline.md)** — Storybook development workflow, story writing, CSS imports
- **[claude/patterns/migration-guide.md](./claude/patterns/migration-guide.md)** — Migration from legacy code to Clean Architecture

### 🧪 Testing (Testing Strategies)

**Complete Testing Guide**:
- **[claude/testing/testing-principles.md](./claude/testing/testing-principles.md)** — Testing philosophy, what to test vs skip, testing tools
- **[claude/testing/unit-testing.md](./claude/testing/unit-testing.md)** — Unit testing patterns, mocking strategies, test organization
- **[claude/testing/integration-testing.md](./claude/testing/integration-testing.md)** — Integration testing, API mocking with MSW, database tests
- **[claude/testing/e2e-testing.md](./claude/testing/e2e-testing.md)** — E2E testing with Playwright, user flows, visual regression

---

## ⚠️ CRITICAL ARCHITECTURAL RULES

These rules override ANY default AI behavior. You MUST follow them EXACTLY:

### 🔴 DI Container Rules (HIGHEST PRIORITY)

#### ⚠️ Critical: Direct Container Import Pattern

**ALWAYS import containers directly from the specific file**, NOT from barrel exports at `@domain/di`.

```typescript
// ✅ CORRECT: Direct imports from specific container files
import { createUserServerContainer } from '@/src/domains/user/di/user-server-container';
import { getUserClientContainer } from '@/src/domains/user/di/user-client-container';

// ❌ WRONG: Barrel export from @domain/di
import { createUserServerContainer } from '@user/di';
import { getUserClientContainer } from '@user/di';
```

**Why?** Barrel exports at `@domain/di` bundle BOTH server and client containers together, causing:
- ❌ Webpack cannot separate server-only code from client code
- ❌ `server-only` package gets bundled in client → **Build fails**
- ❌ Bundle size increases with unused server dependencies
- ✅ **Solution**: Always use absolute path imports to specific container files

---

**ALWAYS:**
- ✅ Use DI Container to get UseCases (e.g., `container.getGetUser()` or natural names like `container.getUserProfile()`)
- ✅ Use Server Container in Server Components (`createXXXServerContainer()`)
- ✅ Use Client Container in Client Components/Hooks (`getXXXClientContainer()`)
- ✅ Place containers in per-domain di/ directories (`apps/web/src/domains/*/di/`)
- ✅ Import containers directly from specific files (`@/src/domains/*/di/*-container.ts`)

**NEVER:**
- ❌ Import from barrel exports at `@domain/di` (use direct file imports instead)
- ❌ Directly instantiate Repository or UseCase (`new UserRepository()`)
- ❌ Use Client Container in Server Components (breaks SSR with singleton)
- ❌ Use Server Container in Client Components (stateless factory won't work)
- ❌ Use deprecated `@nugudi/api` package (use UseCase layer instead)

### 🔴 Layer Hierarchy Rules

**ALWAYS:**
- ✅ Follow strict layer order: Presentation → Domain → Data → Infrastructure
- ✅ Use Repository pattern for all data access (interface in Domain, impl in Data)
- ✅ Use UseCase pattern for business logic (single responsibility)
- ✅ Use TypeScript path aliases (`@auth/domain/*`, `@core/*`)

**NEVER:**
- ❌ Skip layers (e.g., Page directly calling Repository)
- ❌ Put business logic in Presentation layer
- ❌ Access external APIs from Presentation layer
- ❌ Make cross-domain imports (use @core for shared code)

### 🔴 Commit Rules (BREAKS CI/CD)

**ALWAYS:**
- ✅ Follow format: `[NUGUDI-XXX] type(scope): subject`
- ✅ Keep subject under 72 characters
- ✅ Use defined commit types (feat, fix, docs, style, refactor, test, chore, perf, ci)

**NEVER:**
- ❌ Add Co-Author lines (`Co-Authored-By: Claude <...>`) — **THIS BREAKS CI/CD**
- ❌ Exceed character limits (72 for subject, 100 for body lines)
- ❌ Use undefined commit types
- ❌ Mix multiple types in one commit

### 🔴 Component Rules

**ALWAYS:**
- ✅ Follow hierarchy: Page → View → Section → Component
- ✅ Use Server Container in Pages for data prefetch
- ✅ Use Client Container in Sections/Hooks for data fetch
- ✅ Implement Suspense and ErrorBoundary in Section components
- ✅ Use Adapter when 7+ Entity method calls required
- ✅ Add comprehensive JSDoc to all Adapter methods

**NEVER:**
- ❌ Skip layers (e.g., Page directly importing Components)
- ❌ Fetch data in View or Component layers
- ❌ Use deprecated Factory pattern for Query Hooks
- ❌ Skip JSDoc documentation on Adapter methods

### 🔴 Package Usage Rules

**ALWAYS:**
- ✅ Use Layout components (`Box`, `Flex`, `VStack`, `HStack`) for structure
- ✅ Use Typography components (`Heading`, `Title`, `Body`, `Emphasis`) instead of HTML tags
- ✅ Use design tokens from `@nugudi/themes` (never hardcode colors/spacing)
- ✅ Complete TWO-STEP SETUP (package.json + fds.module.css style import)

**NEVER:**
- ❌ Use HTML heading tags directly (`<h1>`, `<p>`, `<span>`)
- ❌ Create custom layouts (use Layout components)
- ❌ Skip style imports (every package requires `style.css` import)
- ❌ Use hard-coded values (use `vars.box.spacing[16]` NOT `16px`)

---

## 🎯 Development Priority Checklist

Before writing ANY new code, follow this priority order:

### Priority 1: CHECK Existing Solutions
1. Read `packages/react/components/*/README.md` — Component APIs
2. Read `packages/react/hooks/*/README.md` — Hook APIs
3. Read `packages/themes/README.md` — Design tokens
4. **Question**: Does an existing solution meet requirements?
   - ✅ YES → REUSE it (go to Priority 2)
   - ❌ NO → Can it be extended? (go to Priority 3)

### Priority 2: REUSE Components/Hooks
- Use Layout components (`Box`, `Flex`, `VStack`, `HStack`) for structure
- Use existing UI components from `@nugudi/react-components-*`
- Use design tokens from `@nugudi/themes` (never hardcode colors/spacing)

### Priority 3: EXTEND Existing Solutions
- Can existing component be extended with new props?
- Can existing hook be enhanced with new options?
- Is the extension backward-compatible?

### Priority 4: CREATE New Code (ONLY IF NECESSARY)
- Justify why reuse/extension is not possible
- Create in `packages/react/components/` or `packages/react/hooks/` first
- Document with Storybook in `packages/ui/src/`
- Follow all MUST/MUST NOT rules

---

## 🚦 Context-Specific Quick Reference

### When Implementing Features:
1. Read [core/architecture.md](./claude/core/architecture.md) — Understand domain structure
2. Read [ddd/di-server-containers.md](./claude/ddd/di-server-containers.md) or [ddd/di-client-containers.md](./claude/ddd/di-client-containers.md) — Set up DI Container
3. Read [ddd/entity-patterns.md](./claude/ddd/entity-patterns.md), [ddd/usecase-patterns.md](./claude/ddd/usecase-patterns.md), [ddd/repository-patterns.md](./claude/ddd/repository-patterns.md) — Implement Entity/UseCase/Repository
4. Read [patterns/adapter-basics.md](./claude/patterns/adapter-basics.md) — Transform Entity → UI (if 7+ methods)
5. Read [patterns/query-hooks.md](./claude/patterns/query-hooks.md) or [patterns/mutation-hooks.md](./claude/patterns/mutation-hooks.md) — Create Query/Mutation hooks
6. Read [frontend/component-hierarchy.md](./claude/frontend/component-hierarchy.md) — Build UI components

### When Creating UI Components:
1. Read [frontend/component-hierarchy.md](./claude/frontend/component-hierarchy.md) — Component hierarchy
2. Read [packages/package-usage.md](./claude/packages/package-usage.md) — Import patterns, check existing packages
3. Read [patterns/storybook-guideline.md](./claude/patterns/storybook-guideline.md) — Document component

### When Writing Tests:
1. Read [testing/testing-principles.md](./claude/testing/testing-principles.md) — Testing philosophy
2. Read [testing/unit-testing.md](./claude/testing/unit-testing.md) or [ddd/testing-ddd.md](./claude/ddd/testing-ddd.md) — Testing patterns
3. Read [ddd/di-server-containers.md](./claude/ddd/di-server-containers.md) — Mock containers

### When Refactoring Legacy Code:
1. Read [patterns/migration-guide.md](./claude/patterns/migration-guide.md) — Migration strategies
2. Read [core/architecture.md](./claude/core/architecture.md) — Target architecture
3. Read [ddd/entity-patterns.md](./claude/ddd/entity-patterns.md) — DDD patterns

### When Making Commits:
1. Read [core/commit-conventions.md](./claude/core/commit-conventions.md) — Commit format
2. **CRITICAL**: NEVER add Co-Author lines

---

## 🎓 Understanding This Codebase

### What Makes This Architecture Special?

1. **Clean Architecture + DDD**: 4-layer separation with bounded contexts
2. **Per-Domain DI Containers**: Each domain has its own Server/Client containers
3. **TypeScript Path Aliases**: Clean imports with `@{domain}/layer/*` pattern
4. **Adapter Pattern**: Entity → UI transformation when 7+ methods required
5. **Query Hook Pattern**: Client Container + TanStack Query integration
6. **Next.js 16 App Router**: Server Components with SSR data prefetch
7. **Monorepo Structure**: Turbo + pnpm with shared packages

### Why These Patterns?

- **DI Containers**: Testability, flexibility, type safety, separation of concerns
- **Adapters**: Type-safe conversions, eliminate unsafe `as`, centralized logic
- **4 Layers**: Clear boundaries, maintainable, scalable, testable
- **Per-Domain Containers**: Domain isolation, independent evolution
- **Server/Client Split**: SSR prefetch (fast) + CSR hydration (interactive)

---

## 💡 Common Mistakes and How to Avoid Them

### Mistake 1: Wrong Container Import Pattern (BREAKS BUILD)
```typescript
// ❌ WRONG: Using barrel export from @domain/di
import { getUserClientContainer } from '@user/di';
import { createAuthServerContainer } from '@auth/di';
// Result: Bundler includes BOTH server and client code → Build fails with server-only error

// ✅ CORRECT: Direct imports from specific files
import { getUserClientContainer } from '@/src/domains/user/di/user-client-container';
import { createAuthServerContainer } from '@/src/domains/auth/di/auth-server-container';
```

### Mistake 2: Wrong Container Usage
```typescript
// ❌ WRONG: Using Client Container in Server Component
const MyPage = async () => {
  const container = getAuthClientContainer(); // ❌ Singleton in SSR!
};

// ✅ CORRECT: Using Server Container in Server Component
const MyPage = async () => {
  const sessionManager = new ServerSessionManager();
  const container = createAuthServerContainer(sessionManager); // ✅ New instance per request
};
```

### Mistake 3: Direct Instantiation
```typescript
// ❌ WRONG: Direct instantiation
const repository = new UserRepository(httpClient);
const useCase = new GetUserUseCase(repository);

// ✅ CORRECT: Use DI Container
const container = getAuthClientContainer();
const useCase = container.getGetUser();
```

### Mistake 4: Skipping Layers
```typescript
// ❌ WRONG: Page directly calling Repository
const MyPage = async () => {
  const repository = container.getUserRepository();
  const user = await repository.getById(id); // ❌ Skipping UseCase layer!
};

// ✅ CORRECT: Page → UseCase → Repository
const MyPage = async () => {
  const useCase = container.getGetUser();
  const user = await useCase.execute(id); // ✅ Through UseCase
};
```

### Mistake 5: Co-Author Lines (BREAKS CI/CD)
```bash
# ❌ WRONG - Co-Author breaks CI/CD
git commit -m "[NUGUDI-105] feat(react): BottomSheet 구현

Co-Authored-By: Claude <noreply@anthropic.com>"  # ❌ NO!

# ✅ CORRECT - No Co-Author
git commit -m "[NUGUDI-105] feat(react): BottomSheet 구현

- Backdrop과 함께 동작하는 BottomSheet 추가"
```

### Mistake 6: Using HTML Tags Instead of Typography Components
```typescript
// ❌ WRONG: HTML tags
<h1>제목</h1>
<p>본문</p>
<span>캡션</span>

// ✅ CORRECT: Typography components
import { Heading, Body, Emphasis } from '@nugudi/react-components-layout';
<Heading fontSize="h1">제목</Heading>
<Body fontSize="b2">본문</Body>
<Emphasis fontSize="e1">캡션</Emphasis>
```

---

## 🎯 Quick Decision Trees

### "Should I use Adapter or Mapper?"
```
Does transformation require 7+ Entity method calls?
├─ YES → Use Adapter (presentation/adapters/)
└─ NO  → Use Mapper (presentation/mappers/ or data/mappers/)
```

### "Should I use Server or Client Container?"
```
Where am I calling the UseCase?
├─ Server Component/Page → Use Server Container (createXXXServerContainer())
├─ Client Component/Hook → Use Client Container (getXXXClientContainer())
└─ Server Action → Use Server Container (createXXXServerContainer())
```

### "Should I create a new component?"
```
Does an existing component exist?
├─ YES → Can I reuse it?
│   ├─ YES → REUSE (Priority 1)
│   └─ NO  → Can I extend it?
│       ├─ YES → EXTEND (Priority 2)
│       └─ NO  → Justify and CREATE (Priority 3)
└─ NO  → CREATE in packages/ first, then use in domain
```

---

## 🔍 Verification Checklist

Before committing ANY code, verify:

- [ ] Used DI Container (not direct instantiation)
- [ ] Used correct container (Server in SSR, Client in CSR)
- [ ] Followed layer hierarchy (no layer skipping)
- [ ] Used TypeScript path aliases (not relative imports)
- [ ] Added JSDoc to Adapter methods (if using Adapter)
- [ ] Checked existing packages (before creating new code)
- [ ] Followed commit format (no Co-Author lines)
- [ ] Used design tokens (no hardcoded colors/spacing)
- [ ] Used Layout/Typography components (no HTML tags)
- [ ] Implemented error boundaries (in Section components)
- [ ] Added tests (for Repository, UseCase, critical components)

---

## 🆘 Need Help?

1. **Architecture Questions**: Read [core/architecture.md](./claude/core/architecture.md)
2. **DDD Questions**: Read [ddd/entity-patterns.md](./claude/ddd/entity-patterns.md), [ddd/usecase-patterns.md](./claude/ddd/usecase-patterns.md), [ddd/repository-patterns.md](./claude/ddd/repository-patterns.md)
3. **Container Questions**: Read [ddd/di-server-containers.md](./claude/ddd/di-server-containers.md) or [ddd/di-client-containers.md](./claude/ddd/di-client-containers.md)
4. **Component Questions**: Read [frontend/component-hierarchy.md](./claude/frontend/component-hierarchy.md)
5. **Pattern Questions**: Read specific guide ([patterns/adapter-basics.md](./claude/patterns/adapter-basics.md), [patterns/query-hooks.md](./claude/patterns/query-hooks.md))
6. **Still Stuck**: Check [patterns/migration-guide.md](./claude/patterns/migration-guide.md) for similar examples

---

**Remember**: This codebase follows strict architectural rules for a reason. These patterns ensure:
- ✅ Testability (mock containers in tests)
- ✅ Maintainability (clear layer boundaries)
- ✅ Scalability (domain isolation)
- ✅ Type Safety (Adapter eliminates unsafe `as`)
- ✅ Performance (SSR prefetch + CSR hydration)

**DO NOT** bypass these patterns without understanding why they exist. Read the documents FIRST.
