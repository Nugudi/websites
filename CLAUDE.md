# AI Rules (Single Entry Point)

## 🚨 MANDATORY: READ ALL DOCUMENTS BEFORE ANY TASK

**IMPORTANT**: You MUST read ALL documents listed below BEFORE performing ANY task in this repository. These documents contain CRITICAL rules that override default behaviors.

### Required Reading Order:

1. **FIRST**: Read [claude/packages.md](./claude/packages.md) — Contains commit rules, import conventions, and monorepo structure (HIGHEST PRIORITY)
2. **SECOND**: Read [claude/frontend.md](./claude/frontend.md) — Frontend development patterns and code style
3. **THIRD**: Read [claude/testing.md](./claude/testing.md) — Testing requirements and patterns

### 📚 Package Documentation (READ BEFORE WRITING ANY CODE):

Before writing ANY new code, you MUST check existing package documentation:

- **Component APIs**: Read `packages/react/components/*/README.md` — All component API documentation
- **Hook APIs**: Read `packages/react/hooks/*/README.md` — All hook API documentation
- **Design Tokens**: Read `packages/themes/README.md` — Design token system documentation

#### Development Priority (MANDATORY):

1. **CHECK** existing packages before writing new code
2. **REUSE** components/hooks when they meet requirements
3. **EXTEND** existing solutions when possible
4. **CREATE** new code only when absolutely necessary

**DO NOT PROCEED** with any development until you have:

- ✅ Read all package README files relevant to your task
- ✅ Verified no existing solution meets the requirements
- ✅ Confirmed that extension is not possible
- ✅ Justified why new code creation is necessary

### Context-Specific Guidelines:

#### When Working with Next.js Components:

- **IF** creating or modifying pages in `app/(auth)/` or `app/(public)/` or components in `src/domains/*/ui/`
- **THEN** read [claude/frontend.md](./claude/frontend.md) — Complete component architecture rules (Page → View → Section → Component hierarchy)
- **AND** read [claude/nextjs-component-structure-guideline.md](./claude/nextjs-component-structure-guideline.md) — Next.js App Router route structure and specific patterns

#### When Creating Shared Components & Storybook:

- **IF** developing shared components in `packages/react/components/` or `packages/react/hooks/`
- **OR** adding Storybook documentation in `packages/ui/src/`
- **THEN** read [claude/storybook-guideline.md](./claude/storybook-guideline.md) — Storybook-specific development workflow and story guidelines
- **AND** read [claude/packages.md](./claude/packages.md) — Import patterns, package usage, and naming conventions

## ⚠️ CRITICAL REMINDERS

### 🆕 DDD Architecture (HIGHEST PRIORITY)

- **ALWAYS** use DI Containers to get UseCases
  - Server-side: `createXXXServerContainer()` (creates new instance per request)
  - Client-side: `getXXXClientContainer()` (Lazy-initialized singleton)
  - **Location**: Per-domain in `apps/web/src/domains/*/di/` (NOT global `src/di/`)
- **NEVER** directly instantiate Repository or UseCase (only through DI Container)
- **NEVER** use Client Container (`getXXXClientContainer()`) in Server Components/Pages
- **NEVER** use `@nugudi/api` package (deprecated - use UseCases instead)
- **ALWAYS** use UseCase layer for business logic (Repository only for data access)
- **ALWAYS** use Repository layer for API calls (UseCase only for business logic)

### Commit and Code Quality

- **NEVER** make commits without reading `claude/packages.md` first (contains Co-Author prohibition)
- **NEVER** create new components without checking existing packages
- **ALWAYS** follow the import rules specified in the documents
- **ALWAYS** use the exact commit format from `claude/packages.md`

### Component-Specific Reminders:

When creating Next.js components:

- **ALWAYS** follow the Page → View → Section → Component hierarchy
- **ALWAYS** use Server Container (`createXXXServerContainer()`) in Pages for data prefetch
- **ALWAYS** use Client Container (`getXXXClientContainer()`) in Sections for data fetch
- **NEVER** skip layers (e.g., Page directly importing Components)
- **ALWAYS** implement Suspense and ErrorBoundary in Section components
- **NEVER** fetch data in View or Component layers

When creating shared components & Storybook:

- **ALWAYS** develop components in `packages/react/components/` first
- **ALWAYS** create hooks in `packages/react/hooks/` first
- **ALWAYS** document components with Storybook in `packages/ui/src/`
- **ALWAYS** follow the correct import patterns (Layout/Icons: multiple, Individual components: single)
- **NEVER** skip CSS imports for main components in stories
- **NEVER** create components directly in `packages/ui/`

## Why This Matters

Failure to read these documents will result in:

- ❌ **🆕 Wrong DI Container usage** (Client container on server, breaking SSR)
- ❌ **🆕 Direct Repository/UseCase instantiation** (breaking dependency injection)
- ❌ **🆕 Using deprecated `@nugudi/api`** (should use UseCase layer)
- ❌ Incorrect commit messages (Co-Author lines that break our CI/CD)
- ❌ Duplicate component creation (wasting existing packages)
- ❌ Wrong import patterns (breaking build process)
- ❌ Inconsistent code style (failing code reviews)
- ❌ Incorrect component architecture (violating established patterns)

**DO NOT PROCEED** with any development task until you have confirmed understanding of ALL the rules in the referenced documents.

## 📋 Document Hierarchy and Responsibilities

To avoid confusion, each document has a specific focus:

- **[claude/packages.md](./claude/packages.md)** - **AUTHORITATIVE SOURCE** for:
  - **🆕 DDD Architecture** (Repository, UseCase, Infrastructure layers)
  - **🆕 Dependency Injection Containers** (Server vs Client)
  - **🆕 Infrastructure Layer** (HttpClient, SessionManager, TokenProvider)
  - Import/export patterns
  - Package usage guidelines
  - Naming conventions
  - Setup requirements
  - Component priority rules

- **[claude/frontend.md](./claude/frontend.md)** - **COMPLETE GUIDE** for:
  - Component architecture (Page → View → Section → Component)
  - **🆕 DI Container usage** (Server Container in Pages, Client Container in Sections)
  - **🆕 UseCase-based data flow** (replacing direct API calls)
  - Layer responsibilities and patterns
  - Error handling with Suspense/ErrorBoundary
  - Data flow and state management

- **[claude/nextjs-component-structure-guideline.md](./claude/nextjs-component-structure-guideline.md)** - **NEXT.JS SPECIFIC** for:
  - App Router route structure
  - **🆕 Server Container usage in Pages** (SSR data prefetch)
  - Route groups and authentication patterns
  - Next.js-specific patterns (metadata, loading, error UI)

- **[claude/storybook-guideline.md](./claude/storybook-guideline.md)** - **STORYBOOK SPECIFIC** for:
  - Story writing patterns
  - CSS import rules with underscore aliases
  - Storybook configuration

- **[claude/testing.md](./claude/testing.md)** - **TESTING FOCUSED** for:
  - **🆕 Repository testing patterns** (Mock HttpClient)
  - **🆕 UseCase testing patterns** (Mock Repository and SessionManager)
  - Testing strategies and patterns
  - What to test vs what to skip
  - Testing tool usage
