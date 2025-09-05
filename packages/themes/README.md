# @nugudi/themes

The foundational theme system providing design tokens, CSS variables, and styling utilities for the Nugudi design system.

## Installation

```bash
pnpm add @nugudi/themes
```

## Import

```tsx
import { vars, classes, SemanticTones, COLOR_SHADES } from "@nugudi/themes";
import "@nugudi/themes/themes.css"; // Required for CSS variables
```

## Overview

The themes package provides a comprehensive design token system that includes:

- **Color System**: Semantic colors, color scales, and theme-aware palettes
- **Typography**: Font sizes, weights, line heights, and letter spacing
- **Spacing**: Consistent spacing scale for margins, padding, and gaps
- **Layout**: Border radius, shadows, and other visual properties
- **CSS Classes**: Pre-defined typography classes for rapid development

## Color System

### Semantic Tones

Semantic tones represent the intent or meaning of UI elements rather than specific colors.

```tsx
import { SemanticTones } from "@nugudi/themes";

// Available semantic tones
SemanticTones.Neutral      // "neutral" - Default, secondary elements
SemanticTones.Informative  // "informative" - Info messages, primary actions
SemanticTones.Positive     // "positive" - Success states, confirmations
SemanticTones.Warning      // "warning" - Warnings, caution states
SemanticTones.Negative     // "negative" - Errors, destructive actions
SemanticTones.Purple       // "purple" - Special highlights, premium features
```

### Semantic Variants

Variants define how semantic tones are applied to components.

```tsx
import { SemanticVariants } from "@nugudi/themes";

// Available variants
SemanticVariants.Solid    // "solid" - Filled backgrounds
SemanticVariants.Weak     // "weak" - Subtle backgrounds
SemanticVariants.Outline  // "outline" - Border only
```

### Color Scales

Color scales provide consistent color gradients for each semantic tone.

```tsx
import { vars } from "@nugudi/themes";

// Main brand colors
vars.colors.$scale.main[50]   // Lightest
vars.colors.$scale.main[100]
vars.colors.$scale.main[200]
// ... up to
vars.colors.$scale.main[900]  // Darkest

// Neutral grays
vars.colors.$scale.zinc[50]
vars.colors.$scale.zinc[100]
// ... up to
vars.colors.$scale.zinc[900]

// Semantic color scales
vars.colors.$scale.blue[500]     // Informative
vars.colors.$scale.red[500]      // Negative
vars.colors.$scale.yellow[500]   // Warning
vars.colors.$scale.purple[500]   // Purple

// Alpha colors for overlays
vars.colors.$scale.whiteAlpha[100]  // 10% white
vars.colors.$scale.whiteAlpha[200]  // 20% white
// ... up to
vars.colors.$scale.whiteAlpha[900]  // 90% white

vars.colors.$scale.blackAlpha[100]  // 10% black
vars.colors.$scale.blackAlpha[200]  // 20% black
// ... up to
vars.colors.$scale.blackAlpha[900]  // 90% black
```

### Static Colors

Pre-defined color palettes for light and dark themes.

```tsx
import { vars } from "@nugudi/themes";

// Light theme colors
vars.colors.$static.light.neutral.bg          // Background
vars.colors.$static.light.neutral.bgHover     // Hover state
vars.colors.$static.light.neutral.bgPressed   // Pressed state
vars.colors.$static.light.neutral.border      // Borders
vars.colors.$static.light.neutral.text        // Text color

// Dark theme colors
vars.colors.$static.dark.neutral.bg
vars.colors.$static.dark.neutral.bgHover
vars.colors.$static.dark.neutral.bgPressed
vars.colors.$static.dark.neutral.border
vars.colors.$static.dark.neutral.text

// Available for all semantic tones
vars.colors.$static.light.informative.bg
vars.colors.$static.light.positive.bg
vars.colors.$static.light.warning.bg
vars.colors.$static.light.negative.bg
vars.colors.$static.light.purple.bg
```

### Color Shades

Standardized shade values for consistent color application.

```tsx
import { COLOR_SHADES, type ColorShade } from "@nugudi/themes";

// Available shades
COLOR_SHADES // [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]

// Type-safe shade values
const shade: ColorShade = 500; // Primary shade
const lightShade: ColorShade = 100;
const darkShade: ColorShade = 900;
```

## Typography System

### Font Sizes

Consistent font size scale in rem units.

```tsx
import { vars } from "@nugudi/themes";

vars.typography.fontSize[34]  // "2.125rem" - Display
vars.typography.fontSize[30]  // "1.875rem" - H1
vars.typography.fontSize[28]  // "1.75rem"  - H2
vars.typography.fontSize[22]  // "1.375rem" - H3
vars.typography.fontSize[20]  // "1.25rem"  - H4
vars.typography.fontSize[17]  // "1.0625rem" - Body Large
vars.typography.fontSize[16]  // "1rem"     - Body Default
vars.typography.fontSize[15]  // "0.9375rem" - Body Small
vars.typography.fontSize[13]  // "0.8125rem" - Caption
vars.typography.fontSize[12]  // "0.75rem"  - Small
vars.typography.fontSize[11]  // "0.6875rem" - Tiny
```

### Font Weights

Standard font weight values.

```tsx
import { vars } from "@nugudi/themes";

vars.typography.fontWeight[700]  // "700" - Bold
vars.typography.fontWeight[600]  // "600" - Semibold
vars.typography.fontWeight[500]  // "500" - Medium
vars.typography.fontWeight[400]  // "400" - Regular
```

### Line Heights

Optimized line height percentages.

```tsx
import { vars } from "@nugudi/themes";

vars.typography.lineHeight[140]  // "140%" - Display
vars.typography.lineHeight[134]  // "134%" - Headings
vars.typography.lineHeight[130]  // "130%" - Titles
vars.typography.lineHeight[128]  // "128%"
vars.typography.lineHeight[124]  // "124%" - Body
vars.typography.lineHeight[123]  // "123%"
vars.typography.lineHeight[120]  // "120%" - Compact
vars.typography.lineHeight[119]  // "119%"
vars.typography.lineHeight[117]  // "117%"
vars.typography.lineHeight[116]  // "116%" - Dense
```

### Letter Spacing

Consistent letter spacing for improved readability.

```tsx
import { vars } from "@nugudi/themes";

// All font sizes use -0.3px letter spacing
vars.typography.letterSpacing[30]  // "-0.3px"
vars.typography.letterSpacing[28]  // "-0.3px"
vars.typography.letterSpacing[22]  // "-0.3px"
// ... etc
```

### Typography Classes

Pre-composed typography styles for rapid development.

```tsx
import { classes } from "@nugudi/themes";

// Heading
classes.typography.heading.h1  // { fontSize: "1.875rem", fontWeight: 700, ... }

// Titles
classes.typography.title.t1    // { fontSize: "1.75rem", fontWeight: 700, ... }
classes.typography.title.t2    // { fontSize: "1.375rem", ... }
classes.typography.title.t3    // { fontSize: "1.25rem", ... }

// Body Text
classes.typography.body.b1     // { fontSize: "1.0625rem", ... }
classes.typography.body.b2     // { fontSize: "1rem", ... }
classes.typography.body.b3     // { fontSize: "0.9375rem", ... }
classes.typography.body.b3b    // { fontSize: "0.9375rem", fontWeight: 700, ... }

// Emphasis
classes.typography.emphasis.e1  // { fontSize: "0.8125rem", ... }
classes.typography.emphasis.e2  // { fontSize: "0.75rem", ... }
classes.typography.emphasis.e3  // { fontSize: "0.6875rem", ... }
```

## Spacing System

Consistent spacing scale for layout and composition.

```tsx
import { vars } from "@nugudi/themes";

// Spacing values in rem
vars.box.spacing[0]   // "0"
vars.box.spacing[1]   // "0.25rem"  - 4px
vars.box.spacing[2]   // "0.5rem"   - 8px
vars.box.spacing[3]   // "0.75rem"  - 12px
vars.box.spacing[4]   // "1rem"     - 16px
vars.box.spacing[5]   // "1.25rem"  - 20px
vars.box.spacing[6]   // "1.5rem"   - 24px
vars.box.spacing[8]   // "2rem"     - 32px
vars.box.spacing[10]  // "2.5rem"   - 40px
vars.box.spacing[12]  // "3rem"     - 48px
vars.box.spacing[16]  // "4rem"     - 64px
vars.box.spacing[20]  // "5rem"     - 80px
vars.box.spacing[24]  // "6rem"     - 96px
// ... up to
vars.box.spacing[96]  // "24rem"    - 384px
```

## Border Radius

Consistent corner radius values.

```tsx
import { vars } from "@nugudi/themes";

vars.box.radii.none   // "0"        - Square corners
vars.box.radii.sm     // "0.125rem" - 2px
vars.box.radii.base   // "0.25rem"  - 4px (default)
vars.box.radii.md     // "0.375rem" - 6px
vars.box.radii.lg     // "0.5rem"   - 8px
vars.box.radii.xl     // "0.625rem" - 10px
vars.box.radii["2xl"] // "1rem"     - 16px
vars.box.radii["3xl"] // "1.5rem"   - 24px
vars.box.radii.full   // "9999px"   - Fully rounded
```

## Shadows

Elevation and depth through shadows.

```tsx
import { vars } from "@nugudi/themes";

// Elevation shadows
vars.box.shadows.xs     // Minimal shadow
vars.box.shadows.sm     // Small shadow
vars.box.shadows.base   // Default shadow
vars.box.shadows.md     // Medium shadow
vars.box.shadows.lg     // Large shadow
vars.box.shadows.xl     // Extra large shadow
vars.box.shadows["2xl"] // 2X large shadow

// Special shadows
vars.box.shadows.inner   // Inner shadow for pressed states
vars.box.shadows.darkLg  // Strong shadow for dark themes
vars.box.shadows.outline // Focus outline shadow
```

## Real-World Usage

### Creating a Theme-Aware Component

```tsx
import { vars, SemanticTones, SemanticVariants } from "@nugudi/themes";
import { style } from "@vanilla-extract/css";

// Button with semantic colors
const buttonStyles = {
  [SemanticVariants.Solid]: {
    [SemanticTones.Neutral]: style({
      backgroundColor: vars.colors.$static.light.neutral.bg,
      color: vars.colors.$static.light.neutral.text,
      ":hover": {
        backgroundColor: vars.colors.$static.light.neutral.bgHover,
      },
    }),
    [SemanticTones.Negative]: style({
      backgroundColor: vars.colors.$static.light.negative.bg,
      color: vars.colors.$static.light.negative.text,
      ":hover": {
        backgroundColor: vars.colors.$static.light.negative.bgHover,
      },
    }),
  },
};
```

### Using Typography Classes

```tsx
import { classes } from "@nugudi/themes";
import { style } from "@vanilla-extract/css";

// Page title
const pageTitle = style([
  classes.typography.heading.h1,
  {
    color: vars.colors.$scale.zinc[900],
    marginBottom: vars.box.spacing[6],
  },
]);

// Card description
const cardDescription = style([
  classes.typography.body.b2,
  {
    color: vars.colors.$scale.zinc[600],
    lineHeight: vars.typography.lineHeight[124],
  },
]);
```

### Consistent Spacing

```tsx
import { vars } from "@nugudi/themes";
import { style } from "@vanilla-extract/css";

const container = style({
  padding: vars.box.spacing[6],      // 24px
  marginBottom: vars.box.spacing[8], // 32px
  gap: vars.box.spacing[4],          // 16px
});

const card = style({
  borderRadius: vars.box.radii.lg,   // 8px
  boxShadow: vars.box.shadows.md,
  padding: `${vars.box.spacing[4]} ${vars.box.spacing[6]}`,
});
```

### Dark Mode Support

```tsx
import { vars } from "@nugudi/themes";
import { style } from "@vanilla-extract/css";

const themeAwareCard = style({
  backgroundColor: vars.colors.$static.light.neutral.bg,
  color: vars.colors.$static.light.neutral.text,
  borderColor: vars.colors.$static.light.neutral.border,
  
  "@media": {
    "(prefers-color-scheme: dark)": {
      backgroundColor: vars.colors.$static.dark.neutral.bg,
      color: vars.colors.$static.dark.neutral.text,
      borderColor: vars.colors.$static.dark.neutral.border,
    },
  },
});
```

### Color Scale Usage

```tsx
import { vars } from "@nugudi/themes";
import { style } from "@vanilla-extract/css";

// Status indicators
const statusDot = {
  active: style({
    backgroundColor: vars.colors.$scale.blue[500],
    boxShadow: `0 0 0 4px ${vars.colors.$scale.blue[100]}`,
  }),
  warning: style({
    backgroundColor: vars.colors.$scale.yellow[500],
    boxShadow: `0 0 0 4px ${vars.colors.$scale.yellow[100]}`,
  }),
  error: style({
    backgroundColor: vars.colors.$scale.red[500],
    boxShadow: `0 0 0 4px ${vars.colors.$scale.red[100]}`,
  }),
};

// Gradient backgrounds
const gradientBanner = style({
  background: `linear-gradient(135deg, 
    ${vars.colors.$scale.purple[400]} 0%, 
    ${vars.colors.$scale.purple[600]} 100%)`,
});
```

## TypeScript Support

All theme values are fully typed for excellent IDE support.

```tsx
import type { SemanticTone, SemanticVariant, ColorShade } from "@nugudi/themes";

// Type-safe theme values
const tone: SemanticTone = "positive";
const variant: SemanticVariant = "solid";
const shade: ColorShade = 500;

// Auto-completion for all values
const spacing = vars.box.spacing[/* auto-complete available */];
const fontSize = vars.typography.fontSize[/* auto-complete available */];
```

## CSS Variables

When you import `@nugudi/themes/themes.css`, it provides CSS custom properties that can be used directly in CSS:

```css
/* Color variables */
.my-component {
  color: var(--colors-scale-zinc-900);
  background: var(--colors-static-light-neutral-bg);
  border-color: var(--colors-static-light-neutral-border);
}

/* Typography variables */
.my-text {
  font-size: var(--typography-fontSize-16);
  font-weight: var(--typography-fontWeight-500);
  line-height: var(--typography-lineHeight-124);
}

/* Spacing variables */
.my-container {
  padding: var(--box-spacing-4);
  margin-bottom: var(--box-spacing-8);
  gap: var(--box-spacing-2);
}

/* Visual properties */
.my-card {
  border-radius: var(--box-radii-lg);
  box-shadow: var(--box-shadows-md);
}
```

## Best Practices

1. **Use semantic tones** instead of hard-coded colors for better theme support
2. **Leverage typography classes** for consistent text styling
3. **Follow the spacing scale** for harmonious layouts
4. **Use color scales** for creating color variations and states
5. **Import the CSS file** to enable CSS variable support
6. **Prefer theme tokens** over custom values for maintainability
7. **Consider dark mode** from the start using static color palettes

## Migration Guide

If migrating from custom styles to the theme system:

1. Replace hard-coded colors with semantic tones
2. Convert px values to spacing scale (e.g., `16px` → `vars.box.spacing[4]`)
3. Use typography classes instead of custom font styles
4. Replace custom shadows with shadow tokens
5. Update border-radius values to use radii tokens

## Package Exports

```tsx
// Main exports
export { vars };        // All CSS variables
export { classes };     // Pre-composed classes
export { SemanticTones, SemanticVariants };  // Constants
export { COLOR_SHADES }; // Color shade values

// Type exports
export type { SemanticTone, SemanticVariant, ColorShade };
```