---
description: Package setup requirements, style imports, and configuration checklist
globs:
  - 'apps/web/package.json'
  - 'apps/web/src/shared/styles/fds.module.css'
  - 'apps/web/src/core/ui/styles/**'
alwaysApply: true
---

# Package Setup Requirements

> **Document Type**: Package Setup & Configuration Guide
> **Target Audience**: All developers (especially when adding new packages)
> **Related Documents**:
> - [monorepo-structure.md](./monorepo-structure.md) — Monorepo architecture
> - [package-usage.md](./package-usage.md) — Package usage and import patterns
> - [../patterns/storybook-guideline.md](../patterns/storybook-guideline.md) — Storybook development workflow
> **Last Updated**: 2025-11-11

## 📋 Package Setup Requirements

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

---

## ⚠️ CRITICAL: Complete Setup Checklist

When using ANY `@nugudi/react-components-*` package:

1. ✅ **Check package.json**: Ensure the package is listed in dependencies
2. ✅ **Check fds.module.css**: Ensure the package's `style.css` is imported
3. ✅ **Run `pnpm install`**: After adding new packages to package.json
4. ✅ **Verify styles load**: Component should render with proper styles

---

## 🎯 Example: Adding a New Component

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

---

## 📦 Package Style Import Pattern

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

---

## 📐 Import Rule Pattern

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

---

## 🔴 Common Mistakes to Avoid

### ❌ Mistake 1: Forgetting to import style.css

```typescript
// ❌ WRONG - Component will render without styles
import { Button } from '@nugudi/react-components-button';
// Missing: @import '@nugudi/react-components-button/style.css'; in fds.module.css
```

**Result**: Component renders but has no styling

**Fix**: Add `@import '@nugudi/react-components-button/style.css';` to `fds.module.css`

### ❌ Mistake 2: Not adding to package.json

```typescript
// ❌ WRONG - Import will fail
import { Textarea } from '@nugudi/react-components-textarea';
// Missing: "@nugudi/react-components-textarea": "workspace:*" in package.json
```

**Result**: Module not found error

**Fix**: Add the package to `dependencies` in `package.json` and run `pnpm install`

### ❌ Mistake 3: Not running pnpm install

```json
// Added to package.json:
"@nugudi/react-components-switch": "workspace:*"

// ❌ WRONG - Forgot to run pnpm install
```

**Result**: Package not available in node_modules

**Fix**: Run `pnpm install` after adding packages

### ❌ Mistake 4: Wrong import path

```typescript
// ❌ WRONG - Using wrong version syntax
"@nugudi/react-components-button": "^1.0.0"

// ✅ CORRECT - Use workspace protocol for local packages
"@nugudi/react-components-button": "workspace:*"
```

**Fix**: Always use `workspace:*` for local monorepo packages

---

## 📚 Complete Package List with Setup

### Layout & Typography (HIGHEST PRIORITY)

```json
// package.json
{
  "dependencies": {
    "@nugudi/react-components-layout": "workspace:*"
  }
}
```

```css
/* fds.module.css */
@import '@nugudi/react-components-layout/style.css';
```

**Includes**:
- Layout: Box, Flex, VStack, HStack, Stack, Grid, GridItem, Divider
- Typography: Heading, Title, Body, Emphasis, Logo

### Individual Components

#### Button

```json
"@nugudi/react-components-button": "workspace:*"
```

```css
@import '@nugudi/react-components-button/style.css';
```

#### Input

```json
"@nugudi/react-components-input": "workspace:*"
```

```css
@import '@nugudi/react-components-input/style.css';
```

#### Chip

```json
"@nugudi/react-components-chip": "workspace:*"
```

```css
@import '@nugudi/react-components-chip/style.css';
```

#### NavigationItem

```json
"@nugudi/react-components-navigation-item": "workspace:*"
```

```css
@import '@nugudi/react-components-navigation-item/style.css';
```

#### Switch

```json
"@nugudi/react-components-switch": "workspace:*"
```

```css
@import '@nugudi/react-components-switch/style.css';
```

#### Tab

```json
"@nugudi/react-components-tab": "workspace:*"
```

```css
@import '@nugudi/react-components-tab/style.css';
```

#### Textarea

```json
"@nugudi/react-components-textarea": "workspace:*"
```

```css
@import '@nugudi/react-components-textarea/style.css';
```

#### InputOTP

```json
"@nugudi/react-components-input-otp": "workspace:*"
```

```css
@import '@nugudi/react-components-input-otp/style.css';
```

#### StepIndicator

```json
"@nugudi/react-components-step-indicator": "workspace:*"
```

```css
@import '@nugudi/react-components-step-indicator/style.css';
```

#### MenuCard

```json
"@nugudi/react-components-menu-card": "workspace:*"
```

```css
@import '@nugudi/react-components-menu-card/style.css';
```

#### BottomSheet

```json
"@nugudi/react-components-bottom-sheet": "workspace:*"
```

```css
@import '@nugudi/react-components-bottom-sheet/style.css';
```

#### Backdrop

```json
"@nugudi/react-components-backdrop": "workspace:*"
```

```css
@import '@nugudi/react-components-backdrop/style.css';
```

---

## 🎨 Themes Package Setup

### Always Required

```json
// package.json
{
  "dependencies": {
    "@nugudi/themes": "workspace:*"
  }
}
```

```css
/* fds.module.css - MUST be imported FIRST */
@import '@nugudi/themes/themes.css';
```

**Usage in code**:

```typescript
import { vars, classes } from '@nugudi/themes';
import { style } from '@vanilla-extract/css';

export const customCard = style({
  backgroundColor: vars.colors.$scale.whiteAlpha[100],
  borderRadius: vars.box.radii.lg,
  padding: vars.box.spacing[16],
  boxShadow: vars.box.shadows.sm,
});
```

---

## 🎭 Assets Package Setup

### Icons

```json
// package.json
{
  "dependencies": {
    "@nugudi/assets-icons": "workspace:*"
  }
}
```

**No CSS import needed for icons**

**Usage in code**:

```typescript
import { AppleIcon, HeartIcon, CalendarIcon } from '@nugudi/assets-icons';

<AppleIcon />
<HeartIcon />
<CalendarIcon />
```

---

## 🪝 Hooks Package Setup

### Hook Packages (No CSS Import Required)

```json
// package.json
{
  "dependencies": {
    "@nugudi/react-hooks-button": "workspace:*",
    "@nugudi/react-hooks-switch": "workspace:*",
    "@nugudi/react-hooks-toggle": "workspace:*",
    "@nugudi/react-hooks-use-stepper": "workspace:*"
  }
}
```

**No CSS imports needed for hooks**

**Usage in code**:

```typescript
import { useButton, useToggleButton } from '@nugudi/react-hooks-button';
import { useSwitch, useToggleSwitch } from '@nugudi/react-hooks-switch';
import { useToggle } from '@nugudi/react-hooks-toggle';
import { useStepper } from '@nugudi/react-hooks-use-stepper';
```

---

## 📝 Types Package Setup

```json
// package.json
{
  "dependencies": {
    "@nugudi/types": "workspace:*"
  }
}
```

**No CSS imports needed for types**

**Usage in code**:

```typescript
import type { ApiResponse, ErrorResponse } from '@nugudi/types';
```

---

## 🔍 Complete Setup Verification Checklist

Before deploying or committing code that uses new packages:

### 1. Package.json Check

```bash
# Verify all packages are declared
cat apps/web/package.json | grep "@nugudi"
```

Expected output should include ALL packages you're using.

### 2. FDS Module CSS Check

```bash
# Verify all styles are imported
cat apps/web/src/shared/styles/fds.module.css
```

Expected output should include:
- `@import '@nugudi/themes/themes.css';` (FIRST)
- `@import '@nugudi/react-components-[component]/style.css';` for EACH component

### 3. Install Check

```bash
# Verify packages are installed
pnpm install
pnpm list | grep "@nugudi"
```

Should show all packages with versions.

### 4. Build Check

```bash
# Verify build succeeds
pnpm build --filter=web
```

Should complete without errors.

### 5. Runtime Check

```bash
# Start dev server and verify styles
pnpm dev --filter=web
```

Visit the page and verify:
- Components render correctly
- Styles are applied
- No console errors

---

## 🎯 Quick Setup Reference

### New Component Workflow

1. **Add to package.json**:
   ```json
   "@nugudi/react-components-[name]": "workspace:*"
   ```

2. **Add to fds.module.css**:
   ```css
   @import '@nugudi/react-components-[name]/style.css';
   ```

3. **Install**:
   ```bash
   pnpm install
   ```

4. **Use in code**:
   ```typescript
   import { ComponentName } from '@nugudi/react-components-[name]';
   ```

### New Hook Workflow

1. **Add to package.json**:
   ```json
   "@nugudi/react-hooks-[name]": "workspace:*"
   ```

2. **Install** (no CSS needed):
   ```bash
   pnpm install
   ```

3. **Use in code**:
   ```typescript
   import { useHookName } from '@nugudi/react-hooks-[name]';
   ```

### New Theme Usage

1. **Ensure themes in package.json**:
   ```json
   "@nugudi/themes": "workspace:*"
   ```

2. **Ensure themes.css imported FIRST in fds.module.css**:
   ```css
   @import '@nugudi/themes/themes.css';
   ```

3. **Use in code**:
   ```typescript
   import { vars, classes } from '@nugudi/themes';
   ```

---

## 🔄 Current Package Configuration

### apps/web/package.json (Current State)

Check your current `package.json` to see which packages are already configured:

```bash
cat apps/web/package.json | grep "@nugudi"
```

### apps/web/src/shared/styles/fds.module.css (Current State)

Check your current `fds.module.css` to see which styles are already imported:

```bash
cat apps/web/src/shared/styles/fds.module.css
```

---

## 💡 Development Tips

### Tip 1: Check Before Adding

Before adding a new package, verify if it's already configured:

```bash
# Check if package exists in package.json
grep "@nugudi/react-components-button" apps/web/package.json

# Check if style is imported
grep "@nugudi/react-components-button" apps/web/src/shared/styles/fds.module.css
```

### Tip 2: Batch Setup

If adding multiple components, add them all at once:

```json
// Add all packages
{
  "dependencies": {
    "@nugudi/react-components-button": "workspace:*",
    "@nugudi/react-components-input": "workspace:*",
    "@nugudi/react-components-chip": "workspace:*"
  }
}
```

```css
/* Add all styles */
@import '@nugudi/react-components-button/style.css';
@import '@nugudi/react-components-input/style.css';
@import '@nugudi/react-components-chip/style.css';
```

Then run `pnpm install` once.

### Tip 3: Alphabetical Order

Keep packages and imports in alphabetical order for easy maintenance:

```css
/* ✅ GOOD - Alphabetical */
@import '@nugudi/react-components-backdrop/style.css';
@import '@nugudi/react-components-bottom-sheet/style.css';
@import '@nugudi/react-components-button/style.css';
@import '@nugudi/react-components-chip/style.css';

/* ❌ BAD - Random order */
@import '@nugudi/react-components-button/style.css';
@import '@nugudi/react-components-backdrop/style.css';
@import '@nugudi/react-components-chip/style.css';
@import '@nugudi/react-components-bottom-sheet/style.css';
```

### Tip 4: Verify After Merging

After pulling/merging changes, always run:

```bash
pnpm install
```

This ensures all team members' package additions are installed.

---

## 🚨 Troubleshooting

### Issue: Component renders but has no styles

**Symptom**: Component appears but looks unstyled

**Cause**: Missing CSS import in `fds.module.css`

**Solution**:
```css
/* Add to fds.module.css */
@import '@nugudi/react-components-[component]/style.css';
```

### Issue: Module not found error

**Symptom**: `Cannot find module '@nugudi/react-components-...'`

**Cause**: Package not in `package.json` or not installed

**Solution**:
```bash
# 1. Add to package.json
"@nugudi/react-components-[name]": "workspace:*"

# 2. Install
pnpm install
```

### Issue: Styles not updating

**Symptom**: Changes to components don't reflect

**Cause**: Build cache issue

**Solution**:
```bash
# Clear cache and rebuild
pnpm clean
pnpm build
```

### Issue: Type errors with package

**Symptom**: TypeScript errors when importing

**Cause**: Missing type definitions or stale types

**Solution**:
```bash
# Rebuild packages
pnpm build --filter="@nugudi/*"
```

---

## 📖 Related Documentation

- **[monorepo-structure.md](./monorepo-structure.md)** — Understanding the monorepo architecture
- **[package-usage.md](./package-usage.md)** — How to use packages in your code
- **[../patterns/storybook-guideline.md](../patterns/storybook-guideline.md)** — Creating Storybook documentation
- **[../frontend.md](../frontend.md)** — Frontend development patterns

---

## ✅ Final Checklist

Before committing code with new package usage:

- [ ] Package added to `apps/web/package.json`
- [ ] Style imported in `apps/web/src/shared/styles/fds.module.css` (if component)
- [ ] `pnpm install` executed successfully
- [ ] Component renders correctly in development
- [ ] Styles are applied correctly
- [ ] No console errors or warnings
- [ ] Build completes successfully (`pnpm build --filter=web`)
- [ ] Code formatted with Biome (`pnpm biome check --write .`)
