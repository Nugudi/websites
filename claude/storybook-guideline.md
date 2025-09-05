# Storybook Development Guidelines

---

## 🎨 Storybook Architecture Overview

A **component-driven development system** for the Nugudi Platform. All UI components are first developed in `packages/react`, then documented with Storybook in `packages/ui`.

### Repository Structure

```
nugudi/
├── packages/
│   ├── react/                 # 1️⃣ Component Development (Source of Truth)
│   │   ├── components/        # React components
│   │   │   ├── button/
│   │   │   ├── input/
│   │   │   ├── layout/       # ⭐ Layout & Typography components
│   │   │   └── ...
│   │   └── hooks/            # React hooks
│   │       ├── button/
│   │       ├── toggle/
│   │       └── ...
│   └── ui/                   # 2️⃣ Storybook Documentation
│       └── src/
│           ├── ReactComponents/    # General component stories
│           ├── layout/             # Layout component stories
│           ├── typography/         # Typography component stories
│           ├── foundations/        # Design token stories
│           └── introduction.mdx    # Storybook intro page
```

---

## 📦 Component Development Workflow

### Step 1: Create Component in `packages/react/components/[name]`

```
packages/react/components/[component-name]/
├── src/
│   ├── index.ts              # Public exports
│   ├── [ComponentName].tsx   # Component implementation
│   ├── types.ts             # TypeScript types
│   ├── style.css.ts         # Vanilla Extract styles
│   └── use[Component].ts    # Component hook (if needed)
├── package.json
├── tsconfig.json
├── vite.config.mts
└── vitest.config.ts
```

### Step 2: Create Hook in `packages/react/hooks/[name]`

```
packages/react/hooks/[hook-name]/
├── src/
│   ├── index.ts              # Public exports
│   ├── types.ts             # TypeScript types
│   ├── use[HookName].ts     # Hook implementation
│   └── use[HookName].spec.tsx # Hook tests
├── package.json
├── tsconfig.json
├── vite.config.mts
└── vitest.config.ts
```

### Step 3: Create Story in `packages/ui/src/[category]`

```
packages/ui/src/
├── ReactComponents/          # General components
│   └── Button.stories.tsx
├── layout/                   # Layout components
│   └── Box.stories.tsx
└── typography/              # Typography components
    └── Heading.stories.tsx
```

---

## 🔧 Configuration Files

### Component `package.json`

```json
{
  "name": "@nugudi/react-components-[name]",
  "version": "0.0.1",
  "sideEffects": ["**/*.css", "./dist/index.css"],
  "type": "module",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    },
    "./style.css": "./dist/index.css" // CSS export for Storybook
  },
  "main": "./dist/index.js",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "files": ["dist"],
  "scripts": {
    "build": "vite build",
    "check-types": "tsc --noEmit",
    "lint": "biome check .",
    "test": "vitest run",
    "test:watch": "vitest --watch"
  },
  "dependencies": {
    "@nugudi/themes": "workspace:*",
    "@vanilla-extract/css": "^1.17.4",
    "@vanilla-extract/dynamic": "^2.1.5",
    "@vanilla-extract/recipes": "^0.5.7",
    "@vanilla-extract/sprinkles": "^1.6.5",
    "clsx": "^2.1.1"
  },
  "devDependencies": {
    "@tsconfig/vite-react": "^6.3.6",
    "@types/react": "^19.1.9",
    "@types/react-dom": "^19.1.7",
    "@vanilla-extract/vite-plugin": "^5.1.1",
    "@vitejs/plugin-react": "^4.7.0",
    "typescript": "^5.8.3",
    "vite": "^6.3.5",
    "vite-plugin-dts": "^4.5.4",
    "vite-tsconfig-paths": "^5.1.4",
    "vitest": "^3.2.3"
  },
  "peerDependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  }
}
```

### Hook `package.json`

```json
{
  "name": "@nugudi/react-hooks-[name]",
  "version": "0.0.1",
  "type": "module",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    }
  },
  "main": "./dist/index.js",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "files": ["dist"],
  "scripts": {
    "build": "vite build",
    "check-types": "tsc --noEmit",
    "lint": "biome check .",
    "test": "vitest run",
    "test:watch": "vitest --watch"
  },
  "dependencies": {
    // Add workspace dependencies if needed
  },
  "devDependencies": {
    "@types/react": "^19.1.9",
    "@types/react-dom": "^19.1.7",
    "typescript": "^5.8.3",
    "vite": "^6.3.5",
    "vite-plugin-dts": "^4.5.4"
  },
  "peerDependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  }
}
```

### `tsconfig.json`

```json
{
  "extends": "@tsconfig/vite-react/tsconfig.json",
  "include": [
    "**/*.ts",
    "**/*.tsx",
    "./global.d.ts",
    "vite.config.mts",
    "vitest.config.mts"
  ],
  "exclude": ["node_modules"]
}
```

### Component `vite.config.mts`

```typescript
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import tsconfigPaths from 'vite-tsconfig-paths';

const _filename = fileURLToPath(import.meta.url);
const _dirname = dirname(_filename);

export default defineConfig({
  plugins: [
    react(),
    vanillaExtractPlugin(), // For CSS-in-JS
    dts({
      include: ['src'],
      exclude: ['src/**/*.stories.tsx', 'src/**/*.test.tsx'],
      outDir: 'dist',
      entryRoot: 'src',
      insertTypesEntry: true,
      rollupTypes: false,
      tsconfigPath: './tsconfig.json',
    }),
    tsconfigPaths(),
  ],
  build: {
    lib: {
      entry: resolve(_dirname, 'src/index.ts'),
      fileName: 'index',
      formats: ['es'],
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        '@vanilla-extract/css',
      ],
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) return 'index.css';
          return assetInfo.name || 'assets/[name].[ext]';
        },
      },
    },
    sourcemap: true,
    minify: false,
    outDir: 'dist',
  },
  resolve: {
    alias: {
      '@': resolve(_dirname, './src'),
    },
  },
});
```

### Hook `vite.config.mts` (Simplified - No CSS)

```typescript
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

const _filename = fileURLToPath(import.meta.url);
const _dirname = dirname(_filename);

export default defineConfig({
  plugins: [
    dts({
      include: ['src'],
      exclude: ['src/**/*.test.*', 'src/**/*.spec.*'],
      outDir: 'dist',
      entryRoot: 'src',
      insertTypesEntry: true,
      rollupTypes: false,
      tsconfigPath: './tsconfig.json',
    }),
  ],
  build: {
    lib: {
      entry: resolve(_dirname, 'src/index.ts'),
      fileName: 'index',
      formats: ['es'],
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
    },
    sourcemap: true,
    minify: false,
    outDir: 'dist',
  },
});
```

### `vitest.config.ts`

```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./test-setup.ts'], // Optional
  },
});
```

---

## 🎯 Hook Development Guidelines

### Hook Structure

```typescript
// packages/react/hooks/[name]/src/use[Name].ts
import { useState, useCallback, useMemo } from 'react';
import type { UseHookNameProps, UseHookNameReturn } from './types';

export function useHookName(props?: UseHookNameProps): UseHookNameReturn {
  const [state, setState] = useState(props?.initialValue ?? false);

  const handlers = useMemo(
    () => ({
      toggle: () => setState((prev) => !prev),
      set: (value: boolean) => setState(value),
      reset: () => setState(props?.initialValue ?? false),
    }),
    [props?.initialValue]
  );

  return {
    value: state,
    ...handlers,
  };
}
```

### Hook Types

```typescript
// packages/react/hooks/[name]/src/types.ts
export interface UseHookNameProps {
  initialValue?: boolean;
  onChange?: (value: boolean) => void;
}

export interface UseHookNameReturn {
  value: boolean;
  toggle: () => void;
  set: (value: boolean) => void;
  reset: () => void;
}
```

### Hook Export

```typescript
// packages/react/hooks/[name]/src/index.ts
export { useHookName } from './useHookName';
export type { UseHookNameProps, UseHookNameReturn } from './types';
```

---

## 📤 Package Import Patterns

**Important**: For detailed package import patterns, export rules, and usage examples, see **[claude/packages.md](./packages.md)**.

This section focuses on Storybook-specific import requirements.

### Storybook-Specific Import Pattern

```typescript
// Main component (with underscore and CSS)
import '@nugudi/react-components-button/style.css';
import { Button as _Button } from '@nugudi/react-components-button';

// Helper components (no underscore, no CSS)
import { Input } from '@nugudi/react-components-input';
import { Box, VStack, Title, Body } from '@nugudi/react-components-layout';
import { AppleIcon, GoogleIcon } from '@nugudi/assets-icons';
```

**Key Difference**: In Storybook stories, the main component being documented requires:
1. **CSS import** - `import '@nugudi/react-components-[name]/style.css';`
2. **Underscore alias** - `import { Component as _Component } from '@nugudi/react-components-[name]';`

Helper components don't need CSS imports or underscore aliases.

---

## 📖 Story Writing Guidelines

### ⭐ PRIORITY: Always Use Existing Packages First

**Important**: For package usage priorities and component selection guidelines, see **[claude/packages.md](./packages.md)**.

In stories, always use existing `@nugudi/*` packages rather than creating custom components.

### 🚨 Import Rules for Story Files

**CRITICAL DISTINCTION**: Different import patterns for main component vs helper components

#### Main Component (The component being documented)

```typescript
// ✅ For the MAIN component in the story:
// 1. Import CSS (REQUIRED)
import '@nugudi/react-components-bottom-sheet/style.css';

// 2. Import with underscore prefix
import { BottomSheet as _BottomSheet } from '@nugudi/react-components-bottom-sheet';
```

#### Helper Components (Supporting components used in examples)

```typescript
// ✅ For HELPER components used in the story:
// NO CSS import needed
// NO underscore prefix
import { Button } from '@nugudi/react-components-button';
import { Body, Title } from '@nugudi/react-components-layout';
import { Input } from '@nugudi/react-components-input';
```

#### Complete Example

```typescript
// packages/ui/src/ReactComponents/BottomSheet.stories.tsx

// 1. CSS for MAIN component only
import "@nugudi/react-components-bottom-sheet/style.css";

// 2. MAIN component with underscore
import { BottomSheet as _BottomSheet } from "@nugudi/react-components-bottom-sheet";

// 3. HELPER components without underscore, no CSS
import { Button } from "@nugudi/react-components-button";
import { Body, Title, VStack } from "@nugudi/react-components-layout";
import { Backdrop } from "@nugudi/react-components-backdrop";

// 4. Other imports
import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof _BottomSheet> = {
  title: "Components/BottomSheet",
  component: _BottomSheet,  // Uses underscore version
  // ...
};

export const WithContent: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <>
        {/* Helper component - no underscore */}
        <Button onClick={() => setOpen(true)}>
          Open Bottom Sheet
        </Button>

        {/* Main component - with underscore */}
        <_BottomSheet open={open} onClose={() => setOpen(false)}>
          <VStack gap={4}>
            <Title>Bottom Sheet Title</Title>
            <Body>This is the content inside the bottom sheet.</Body>
            <Button onClick={() => setOpen(false)}>Close</Button>
          </VStack>
        </_BottomSheet>
      </>
    );
  },
};
```

### 🔥 Import Rule Summary

| Component Type        | CSS Import    | Underscore Alias | Example                                                                                                                        |
| --------------------- | ------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| **Main Component**    | ✅ Required   | ✅ Required      | `import "@nugudi/react-components-button/style.css"`<br/>`import { Button as _Button } from "@nugudi/react-components-button"` |
| **Helper Components** | ❌ Not needed | ❌ Not needed    | `import { Input } from "@nugudi/react-components-input"`                                                                       |
| **Icons**             | ❌ Not needed | ❌ Not needed    | `import { ArrowLeftIcon } from "@nugudi/assets-icons"`                                                                         |
| **Hooks**             | ❌ Not needed | ❌ Not needed    | `import { useToggle } from "@nugudi/react-hooks-toggle"`                                                                       |
| **Themes**            | ❌ Not needed | ❌ Not needed    | `import { vars } from "@nugudi/themes"`                                                                                        |

### Basic Story Structure

```typescript
// packages/ui/src/ReactComponents/Button.stories.tsx

// 1. CSS import (REQUIRED - for main component only)
import '@nugudi/react-components-button/style.css';

// 2. Main component with underscore alias
import { Button as _Button } from '@nugudi/react-components-button';

// 3. Helper components without underscore or CSS
import { Input } from '@nugudi/react-components-input';
import { Body } from '@nugudi/react-components-layout';

// 4. Other imports
import { ArrowLeftIcon } from '@nugudi/assets-icons';
import { useButton } from '@nugudi/react-hooks-button';
import { vars } from '@nugudi/themes';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof _Button> = {
  title: 'Components/Button', // Category/ComponentName
  component: _Button,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      options: ['sm', 'md', 'lg', 'icon'],
      control: 'select',
      defaultValue: 'lg',
      table: {
        type: { summary: 'sm | md | lg | icon' },
        defaultValue: { summary: 'lg' },
        category: 'Appearance',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Button',
  },
};
```

---

## 🎨 Design Token Integration

### Using Object.keys for Dynamic Options

```typescript
import { vars } from '@nugudi/themes';

const meta: Meta<typeof _Component> = {
  // ...
  argTypes: {
    // Spacing options
    padding: {
      control: 'select',
      options: Object.keys(vars.box.spacing), // [0, 1, 2, 4, 8, 10, 12, 16, 20, 24, 32, 40, 48, 56, 64]
    },

    // Border radius options
    borderRadius: {
      control: 'select',
      options: Object.keys(vars.box.radii), // [none, sm, md, lg, xl, 2xl, full]
    },

    // Color options
    color: {
      control: 'select',
      options: Object.keys(vars.colors.$scale), // [main, gray, red, yellow, green, blue, ...]
    },

    // Shadow options
    boxShadow: {
      control: 'select',
      options: Object.keys(vars.box.shadows), // [xs, sm, md, lg, xl, 2xl]
    },
  },
};
```

---

## 🔧 Development Commands

### Package Development

```bash
# 1. Create new component package
cd packages/react/components
mkdir new-component
cd new-component
# Copy template files (package.json, tsconfig.json, vite.config.mts, etc.)

# 2. Create new hook package
cd packages/react/hooks
mkdir new-hook
cd new-hook
# Copy template files

# 3. Build component/hook
pnpm --filter=@nugudi/react-components-[name] build
pnpm --filter=@nugudi/react-hooks-[name] build

# 4. Test
pnpm --filter=@nugudi/react-components-[name] test
```

### Storybook Development

```bash
# Start Storybook dev server
pnpm --filter=@nugudi/ui storybook

# Build Storybook static files
pnpm --filter=@nugudi/ui build-storybook

# Run all builds
pnpm build
```

---

## 📚 Story Patterns

### 1. Default Story

```typescript
export const Default: Story = {
  args: {
    children: 'Default Content',
    size: 'md',
  },
};
```

### 2. Variant Showcase

```typescript
export const Variants: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "16px" }}>
      <_Component variant="primary">Primary</_Component>
      <_Component variant="secondary">Secondary</_Component>
      <_Component variant="danger">Danger</_Component>
    </div>
  ),
};
```

### 3. Interactive with Hooks

```typescript
export const Interactive: Story = {
  render: () => {
    const { value, toggle } = useToggle();
    return (
      <_Component checked={value} onChange={toggle}>
        Click me
      </_Component>
    );
  },
};
```

### 4. Responsive Showcase

```typescript
export const Responsive: Story = {
  render: () => (
    <div style={{ width: "100%", padding: "20px" }}>
      <_Component responsive>
        Resize viewport to see changes
      </_Component>
    </div>
  ),
  parameters: {
    layout: "fullscreen",
  },
};
```

---

## ⚠️ Critical Rules

### DO's ✅

- **ALWAYS** develop components in `packages/react/components` first
- **ALWAYS** develop hooks in `packages/react/hooks` first
- **ALWAYS** import CSS using package name pattern: `@nugudi/react-components-[name]/style.css`
- **ALWAYS** use underscore prefix for component aliases (`_Button`, `_Box`)
- **ALWAYS** use `Object.keys(vars.xxx)` for design token options
- **ALWAYS** include all configuration files (package.json, tsconfig.json, vite.config.mts)
- **ALWAYS** export CSS via `"./style.css": "./dist/index.css"` in package.json

### DON'Ts ❌

- **NEVER** create components directly in `packages/ui`
- **NEVER** skip CSS imports in story files
- **NEVER** hardcode design token values
- **NEVER** modify generated files in `dist/` or `storybook-static/`
- **NEVER** use different configuration patterns than specified above

---

## 🔍 Quick Reference

### Package Structure

```
Component Package: @nugudi/react-components-[name]
Hook Package: @nugudi/react-hooks-[name]
CSS Import: @nugudi/react-components-[name]/style.css
```

### Import Order in Stories

```typescript
// 1. CSS (MANDATORY - for main component only)
import '@nugudi/react-components-[name]/style.css';

// 2. Main component (with underscore)
import { Component as _Component } from '@nugudi/react-components-[name]';

// 3. Helper components (without underscore, no CSS)
import { Button } from '@nugudi/react-components-button';
import { Box, VStack } from '@nugudi/react-components-layout';

// 4. Icons
import { IconName } from '@nugudi/assets-icons';

// 5. Hooks
import { useHook } from '@nugudi/react-hooks-[name]';

// 6. Themes (namespace exports)
import { vars, classes } from '@nugudi/themes';

// 7. Storybook types
import type { Meta, StoryObj } from '@storybook/react-vite';
```

### Story Title Categories

- `Components/[Name]` - General components
- `Components/Layout/[Name]` - Layout components
- `Components/Typography/[Name]` - Typography components
- `Foundations/[Name]` - Design system foundations

### Available Design Tokens

```typescript
vars.box.spacing; // Spacing values
vars.box.radii; // Border radius values
vars.box.shadows; // Shadow values
vars.colors.$scale; // Color scales
vars.typography; // Typography tokens
```

Remember: **Component-first, Hook-first development** - Always create in `packages/react` first, then document in `packages/ui`!
<<<<<<< HEAD

---

## 🚨 MANDATORY: Component Development Rules

**CRITICAL**: When user asks to create a public component in packages, IMMEDIATELY apply ALL these rules without being told:

#### 1. Structure & Files

- ✅ **MUST** create proper file structure: `types.ts`, `style.css.ts`, `index.ts`, `[ComponentName].tsx`
- ✅ **MUST** add `vitest.config.ts` for testing configuration
- ✅ **MUST** follow exact export patterns (see section above)

#### 2. Styling with @nugudi/themes

- ✅ **MUST** use `@nugudi/themes` for ALL design tokens
- ✅ **MUST** check if colors exist in theme before using (e.g., `vars.colors.$scale.main`, `vars.colors.$scale.zinc`)
- ❌ **NEVER** use non-existent colors like `purple`, `blue`, `gray` - use `main`, `zinc` instead
- ✅ **MUST** use `// @ts-ignore` for pseudo-selectors in vanilla-extract recipes base styles

#### 3. Layout Components Usage

- ✅ **MUST** use `@nugudi/react-components-layout` components (Box, VStack, HStack, Title, Body)
- ❌ **NEVER** use raw HTML elements like `<div>`, `<span>`, `<h1>` when layout components exist
- ✅ **MUST** use correct prop names:
  - Body component: `color="zinc"` (NOT `color="zinc.600"` or `color="gray"`)
  - Title component: `fontSize="t3"` (NOT `fontWeight="semibold"` - Title doesn't have fontWeight prop)

#### 4. TypeScript & Props

- ✅ **MUST** handle conditional rendering properly (button vs div based on onClick)
- ✅ **MUST** use `Omit<ComponentPropsWithoutRef<'div'>, 'onClick'>` for proper type safety
- ❌ **NEVER** spread props (`{...restProps}`) on button elements when they come from div props

#### 5. Storybook Integration

- ✅ **MUST** use `@storybook/react-vite` (NOT `@storybook/react`)
- ✅ **MUST** add component dependency to `packages/ui/package.json`
- ✅ **MUST** use correct story title format: `"Components/[ComponentName]"`
- ✅ **MUST** only use existing icons from `@nugudi/assets-icons`

#### 6. Visual Design Accuracy

- ✅ **MUST** carefully match the provided design screenshots
- ✅ **MUST** pay attention to:
  - Background colors and opacity
  - Padding and spacing
  - Border presence/absence
  - Icon styles and backgrounds
  - Typography sizes and weights

### Common Mistakes to Avoid

```typescript
// ❌ WRONG - Using non-existent colors
backgroundColor: vars.colors.$scale.purple[200]  // purple doesn't exist!

// ✅ CORRECT - Using existing theme colors
backgroundColor: vars.colors.$scale.main[200]

// ❌ WRONG - Using color with number in Body
<Body color="zinc.600">text</Body>

// ✅ CORRECT - Using just color name
<Body color="zinc">text</Body>

// ❌ WRONG - Using fontWeight on Title
<Title fontSize="t3" fontWeight="semibold">text</Title>

// ✅ CORRECT - Title without fontWeight
<Title fontSize="t3">text</Title>

// ❌ WRONG - Wrong Storybook import
import type { Meta } from "@storybook/react";

// ✅ CORRECT - Correct Storybook import
import type { Meta } from "@storybook/react-vite";

// ❌ WRONG - Using raw HTML
<div className={styles}>
  <h3>{title}</h3>
  <p>{description}</p>
</div>

// ✅ CORRECT - Using layout components
<Box className={styles}>
  <Title fontSize="t3" as="h3">{title}</Title>
  <Body fontSize="b3" color="zinc">{description}</Body>
</Box>
```

### Build & Test Commands

```bash
# Always run these before saying "done":
pnpm build                    # Build the component
pnpm --filter=@nugudi/ui build  # Build UI package with stories
pnpm build                    # Build entire monorepo to verify
```

### 🎯 IMMEDIATE ACTION REQUIRED

When user requests in any of these ways:

- "공용 컴포넌트로 만들어줘" (create as public component)
- "패키지에 만들어줘" (create in packages)
- "packages/react/components에 만들어줘"
- "컴포넌트 패키지로 만들어줘"
- "shared component로 만들어줘"
- "재사용 가능한 컴포넌트로 만들어줘"
- Shows a design screenshot and asks to create a component

**IMMEDIATELY**:

1. **APPLY ALL RULES ABOVE** without being told
2. **GET IT RIGHT THE FIRST TIME** - no corrections needed
3. **NEVER** wait for user to point out these basics
4. **If shown a design** - match it EXACTLY

The user should NEVER have to remind you about:

- Using `@nugudi/themes` for styling
- Using layout components from `@nugudi/react-components-layout`
- Creating proper file structure (`types.ts`, `style.css.ts`, etc.)
- Using correct prop names (e.g., `color="zinc"` not `color="zinc.600"`)
- Using correct imports (`@storybook/react-vite` not `@storybook/react`)
- Adding to `packages/ui/package.json`
- Matching the visual design exactly

# **NO EXCUSES - GET IT RIGHT ON FIRST ATTEMPT!**
