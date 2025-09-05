# 📚 Nugudi Platform Development Guide

## 🎯 Core Principle

Nugudi Platform is a **package-first monorepo**. Always check and reuse existing packages before writing new code.

## 📖 Documentation Structure

### 1. Architecture & Structure

- **[packages.md](../rules/packages.md)** — Monorepo structure, package system, commit rules
- **[frontend.md](../rules/frontend.md)** — Frontend development patterns and architecture
- **[nextjs-component-structure-guideline.md](../rules/nextjs-component-structure-guideline.md)** — Next.js App Router component hierarchy

### 2. Development Guidelines

- **[storybook-guideline.md](../rules/storybook-guideline.md)** — Shared component development and documentation
- **[testing.md](../rules/testing.md)** — Testing strategy and requirements

### 3. Package Documentation

- `packages/react/components/*/README.md` — All component API documentation
- `packages/react/hooks/*/README.md` — All hook API documentation
- `packages/themes/README.md` — Design token system

## 🚀 Quick Start Workflow

1. **Check** existing packages before writing new code
2. **Reuse** components/hooks when they meet requirements
3. **Extend** existing solutions when possible
4. **Create** new code only when absolutely necessary

## 📋 Development Checklist

### Before Starting Any Task:

- [ ] Read relevant documentation in `claude/` folder
- [ ] Check existing components in `packages/react/components/`
- [ ] Check existing hooks in `packages/react/hooks/`
- [ ] Review theme tokens in `packages/themes/`

### When Creating Components:

- [ ] Follow Page → View → Section → Component hierarchy
- [ ] Use layout components from `@nugudi/react-components-layout`
- [ ] Apply design tokens from `@nugudi/themes`
- [ ] Add proper TypeScript types
- [ ] Include Storybook documentation

### When Committing:

- [ ] Follow commit format: `[NUGUDI-XXX] type(scope): message`
- [ ] No Co-Author lines
- [ ] Run tests before committing

## ⚠️ Important Rules

- **Package-first**: Always use existing packages before creating new code
- **Type-safe**: Use TypeScript strictly (no `any` types)
- **Component hierarchy**: Never skip layers in Page → View → Section → Component
- **Design tokens**: Use `vars` from `@nugudi/themes`, not hard-coded values
- **Testing**: Write tests for business logic and complex components
