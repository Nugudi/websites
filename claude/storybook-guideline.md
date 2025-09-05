# 📚 Storybook & Component Development Guide

## 🎯 Core Workflow

**MANDATORY**: Components are developed in `packages/react`, documented in `packages/ui`

```
1. Create component in packages/react/components/[name]
2. Create hook in packages/react/hooks/[name]  
3. Document with Storybook in packages/ui/src/
```

## 📂 Component Package Structure

### Component Package (`packages/react/components/[name]`)
```
button/
├── src/
│   ├── index.ts           # Public exports
│   ├── Button.tsx         # Component implementation
│   ├── types.ts          # TypeScript types
│   ├── style.css.ts      # Vanilla Extract styles
│   └── useButton.ts      # Component hook (if needed)
├── package.json
├── tsconfig.json
└── vite.config.mts
```

### Hook Package (`packages/react/hooks/[name]`)
```
toggle/
├── src/
│   ├── index.ts          # Public exports
│   ├── useToggle.ts      # Hook implementation
│   └── types.ts          # TypeScript types
├── package.json
├── tsconfig.json
└── vite.config.mts
```

## 📦 Import Patterns

### CRITICAL: Know Your Package Types

| Package Type | Import Pattern | Example |
|-------------|---------------|---------|
| **Individual Components** | Single named export | `import { Button } from '@nugudi/react-components-button'` |
| **Layout Package** | Multiple named exports | `import { Box, VStack } from '@nugudi/react-components-layout'` |
| **Icons Package** | Multiple named exports | `import { AppleIcon, GoogleIcon } from '@nugudi/assets-icons'` |
| **Themes** | Named exports | `import { vars, classes } from '@nugudi/themes'` |

## 📖 Storybook Story Structure

### MANDATORY: Import Rules for Stories

```typescript
// 1. CSS import - ONLY for main component being documented
import '@nugudi/react-components-button/style.css';

// 2. Main component - WITH underscore prefix
import { Button as _Button } from '@nugudi/react-components-button';

// 3. Helper components - NO underscore, NO CSS
import { Box, VStack } from '@nugudi/react-components-layout';
import { AppleIcon } from '@nugudi/assets-icons';

// 4. Storybook imports
import type { Meta, StoryObj } from '@storybook/react-vite';
```

### Complete Story Example

```typescript
// Button.stories.tsx
import '@nugudi/react-components-button/style.css';
import { Button as _Button } from '@nugudi/react-components-button';
import { ArrowRightIcon } from '@nugudi/assets-icons';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof _Button> = {
  title: 'Components/Button',
  component: _Button,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      defaultValue: 'md',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Click me',
  },
};

export const WithIcon: Story = {
  args: {
    children: 'Next',
    rightIcon: <ArrowRightIcon />,
  },
};
```

## ⚡ Quick Reference Tables

### Component Development Checklist

| Step | Action | Location |
|------|--------|----------|
| 1 | Create component | `packages/react/components/[name]/` |
| 2 | Add types | `src/types.ts` |
| 3 | Add styles | `src/style.css.ts` |
| 4 | Export component | `src/index.ts` |
| 5 | Build component | `pnpm build` |
| 6 | Create story | `packages/ui/src/ReactComponents/` |
| 7 | Test in Storybook | `pnpm --filter=@nugudi/ui storybook` |

### Import Quick Guide

| What | When | Import Pattern |
|------|------|---------------|
| **Main component CSS** | Once per story | `import '@nugudi/react-components-[name]/style.css'` |
| **Main component** | Component being documented | `import { Component as _Component }` |
| **Helper components** | Used in examples | `import { Component }` (no underscore) |
| **Icons** | Icon usage | `import { IconName } from '@nugudi/assets-icons'` |
| **Theme tokens** | Styling | `import { vars } from '@nugudi/themes'` |

## 🚨 AI Instructions

When creating a shared component:

1. **ALWAYS check existing packages first**
   - Check `packages/react/components/` for similar components
   - Check `packages/themes/` for available design tokens

2. **ALWAYS use correct structure**
   - Create in `packages/react/components/[name]`
   - Include `types.ts`, `style.css.ts`, `index.ts`
   - Use `@nugudi/themes` for ALL styling

3. **ALWAYS follow import patterns**
   - Layout: Multiple exports from one package
   - Individual: Single export per package
   - Icons: Multiple exports from icons package

4. **ALWAYS use theme tokens**
   ```typescript
   // ✅ CORRECT
   backgroundColor: vars.colors.$scale.main[100]
   padding: vars.box.spacing[4]
   
   // ❌ WRONG
   backgroundColor: '#e0e7ff'
   padding: '16px'
   ```

5. **ALWAYS use layout components**
   ```typescript
   // ✅ CORRECT
   import { Box, VStack, Title } from '@nugudi/react-components-layout';
   
   // ❌ WRONG
   <div><h2>Title</h2></div>
   ```

## 🔧 Configuration Files

### Component package.json
```json
{
  "name": "@nugudi/react-components-[name]",
  "version": "0.0.1",
  "type": "module",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    },
    "./style.css": "./dist/index.css"
  },
  "files": ["dist"],
  "scripts": {
    "build": "vite build",
    "check-types": "tsc --noEmit"
  }
}
```

### vite.config.mts
```typescript
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    react(),
    vanillaExtractPlugin(),
    dts({
      include: ['src'],
      exclude: ['src/**/*.stories.tsx'],
    }),
  ],
  build: {
    lib: {
      entry: 'src/index.ts',
      fileName: 'index',
      formats: ['es'],
    },
    rollupOptions: {
      external: ['react', 'react-dom', '@vanilla-extract/css'],
    },
  },
});
```

## ✅ Final Checklist

Before saying "component is ready":

- [ ] Component created in `packages/react/components/[name]`
- [ ] Using `@nugudi/themes` for all styles
- [ ] Using `@nugudi/react-components-layout` for structure
- [ ] Proper TypeScript types defined
- [ ] Story created in `packages/ui/src/`
- [ ] CSS import added for main component
- [ ] Underscore prefix for main component
- [ ] Build successful: `pnpm build`
- [ ] Storybook running: `pnpm --filter=@nugudi/ui storybook`