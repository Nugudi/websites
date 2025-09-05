# @nugudi/react-hooks-use-media-query

A React hook for responsive design with media query tracking and breakpoint utilities.

## Installation

```bash
pnpm add @nugudi/react-hooks-use-media-query
```

## Import

```tsx
import { 
  useMediaQuery, 
  useDeviceType,
  useIsXs,
  useIsSm,
  useIsMd,
  useIsLg,
  useIsXl,
  useIs2xl,
  BREAKPOINTS 
} from "@nugudi/react-hooks-use-media-query";
```

## Overview

This hook provides a robust solution for handling responsive design in React applications. It tracks media query matches in real-time, supports SSR, and includes convenient breakpoint utilities matching Tailwind CSS defaults.

## Basic Usage

### useMediaQuery

The core hook for tracking any media query.

```tsx
import { useMediaQuery } from "@nugudi/react-hooks-use-media-query";

function ResponsiveComponent() {
  const { matches, query } = useMediaQuery({
    query: "(min-width: 768px)"
  });

  return (
    <div>
      {matches ? (
        <DesktopLayout />
      ) : (
        <MobileLayout />
      )}
    </div>
  );
}
```

### With onChange Callback

React to media query changes with a callback.

```tsx
function AdaptiveComponent() {
  const [layout, setLayout] = React.useState("mobile");

  const { matches } = useMediaQuery({
    query: "(min-width: 1024px)",
    onChange: (isDesktop) => {
      setLayout(isDesktop ? "desktop" : "mobile");
      // Analytics tracking
      trackLayoutChange(isDesktop ? "desktop" : "mobile");
    }
  });

  return <Layout type={layout} />;
}
```

### SSR Support

Provide default matches for server-side rendering.

```tsx
function SSRFriendlyComponent() {
  // Assume desktop on server for better SEO
  const { matches } = useMediaQuery({
    query: "(min-width: 1024px)",
    defaultMatches: true // Initial state for SSR
  });

  return matches ? <DesktopContent /> : <MobileContent />;
}
```

## Breakpoint Hooks

Pre-configured hooks for common breakpoints (matching Tailwind CSS).

### Available Breakpoint Hooks

| Hook | Breakpoint | Description |
|------|------------|-------------|
| `useIsXs()` | ≥ 0px | All screens (always true) |
| `useIsSm()` | ≥ 640px | Large mobile and up |
| `useIsMd()` | ≥ 768px | Tablet and up |
| `useIsLg()` | ≥ 1024px | Small desktop and up |
| `useIsXl()` | ≥ 1280px | Desktop and up |
| `useIs2xl()` | ≥ 1536px | Large desktop and up |

### Breakpoint Hook Examples

```tsx
import { useIsMd, useIsLg, useIsXl } from "@nugudi/react-hooks-use-media-query";
import { VStack, HStack } from "@nugudi/react-components-layout";

function ResponsiveLayout() {
  const { matches: isTablet } = useIsMd();
  const { matches: isDesktop } = useIsLg();
  const { matches: isLargeDesktop } = useIsXl();

  // Progressive enhancement
  const columns = isLargeDesktop ? 4 : isDesktop ? 3 : isTablet ? 2 : 1;

  return (
    <div>
      {/* Navigation changes based on screen size */}
      {isDesktop ? (
        <HStack gap={20}>
          <Logo />
          <NavItems />
          <UserMenu />
        </HStack>
      ) : (
        <VStack gap={16}>
          <HStack justify="space-between">
            <Logo size="small" />
            <HamburgerMenu />
          </HStack>
        </VStack>
      )}

      {/* Grid layout adapts to screen size */}
      <Grid columns={columns} gap={16}>
        {items.map(item => (
          <GridItem key={item.id} {...item} />
        ))}
      </Grid>
    </div>
  );
}
```

## Device Type Detection

Use the `useDeviceType` hook for simplified device categorization.

```tsx
import { useDeviceType } from "@nugudi/react-hooks-use-media-query";

function DeviceAwareComponent() {
  const deviceType = useDeviceType();

  switch (deviceType) {
    case "mobile":
      return <MobileView />;
    case "tablet":
      return <TabletView />;
    case "desktop":
      return <DesktopView />;
    default:
      return <DefaultView />;
  }
}

// Custom device type logic
function CustomDeviceDetection() {
  const deviceType = useDeviceType({
    mobile: "(max-width: 639px)",
    tablet: "(min-width: 640px) and (max-width: 1023px)",
    desktop: "(min-width: 1024px)"
  });

  return <Layout variant={deviceType} />;
}
```

## BREAKPOINTS Constants

Use the BREAKPOINTS object for consistent media queries.

```tsx
import { BREAKPOINTS, useMediaQuery } from "@nugudi/react-hooks-use-media-query";

function CustomBreakpoint() {
  // Use predefined breakpoints
  const { matches: isTablet } = useMediaQuery({
    query: BREAKPOINTS.md // "(min-width: 768px)"
  });

  // Combine breakpoints for ranges
  const { matches: isTabletOnly } = useMediaQuery({
    query: `${BREAKPOINTS.md} and (max-width: 1023px)`
  });

  // Custom combinations
  const { matches: isLandscapeTablet } = useMediaQuery({
    query: `${BREAKPOINTS.md} and (orientation: landscape)`
  });

  return (
    <div>
      {isTabletOnly && <TabletOptimizedContent />}
      {isLandscapeTablet && <LandscapeLayout />}
    </div>
  );
}
```

## Real-World Examples

### Responsive Navigation

```tsx
import { useIsLg } from "@nugudi/react-hooks-use-media-query";
import { VStack, HStack, Drawer } from "@nugudi/react-components-layout";

function Navigation() {
  const { matches: isDesktop } = useIsLg();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  if (isDesktop) {
    return (
      <nav>
        <HStack gap={32} align="center">
          <Logo />
          <HStack gap={24}>
            <NavLink href="/products">Products</NavLink>
            <NavLink href="/about">About</NavLink>
            <NavLink href="/contact">Contact</NavLink>
          </HStack>
          <UserActions />
        </HStack>
      </nav>
    );
  }

  return (
    <>
      <nav>
        <HStack justify="space-between" padding={16}>
          <Logo size="small" />
          <MenuButton onClick={() => setMobileMenuOpen(true)} />
        </HStack>
      </nav>
      
      <Drawer
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        position="right"
      >
        <VStack gap={16} padding={20}>
          <NavLink href="/products" mobile>Products</NavLink>
          <NavLink href="/about" mobile>About</NavLink>
          <NavLink href="/contact" mobile>Contact</NavLink>
          <Divider />
          <UserActions mobile />
        </VStack>
      </Drawer>
    </>
  );
}
```

### Adaptive Image Loading

```tsx
import { useMediaQuery, BREAKPOINTS } from "@nugudi/react-hooks-use-media-query";

function ResponsiveImage({ src, alt }) {
  const { matches: isRetina } = useMediaQuery({
    query: "(-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi)"
  });
  
  const { matches: isDesktop } = useMediaQuery({
    query: BREAKPOINTS.lg
  });
  
  const { matches: isTablet } = useMediaQuery({
    query: BREAKPOINTS.md
  });

  // Choose image size based on device
  const imageSize = isDesktop ? "large" : isTablet ? "medium" : "small";
  const quality = isRetina ? "@2x" : "";
  
  const imageSrc = `${src}-${imageSize}${quality}.jpg`;

  return (
    <picture>
      <source
        media="(min-width: 1024px)"
        srcSet={`${src}-large${quality}.webp`}
        type="image/webp"
      />
      <source
        media="(min-width: 768px)"
        srcSet={`${src}-medium${quality}.webp`}
        type="image/webp"
      />
      <img
        src={imageSrc}
        alt={alt}
        loading="lazy"
      />
    </picture>
  );
}
```

### Conditional Rendering

```tsx
import { useIsMd, useIsLg } from "@nugudi/react-hooks-use-media-query";
import { VStack, Grid } from "@nugudi/react-components-layout";

function ProductGrid({ products }) {
  const { matches: isTablet } = useIsMd();
  const { matches: isDesktop } = useIsLg();

  // Don't render sidebar on mobile
  const showSidebar = isTablet;
  
  // Show more products on larger screens
  const productsPerPage = isDesktop ? 12 : isTablet ? 8 : 4;
  
  // Different layouts for different screens
  const gridColumns = isDesktop ? 4 : isTablet ? 3 : 2;

  return (
    <VStack gap={20}>
      {showSidebar && (
        <Sidebar>
          <FilterOptions />
          <SortOptions />
        </Sidebar>
      )}
      
      <Grid columns={gridColumns} gap={16}>
        {products.slice(0, productsPerPage).map(product => (
          <ProductCard 
            key={product.id} 
            {...product}
            compact={!isDesktop}
          />
        ))}
      </Grid>
      
      {!isDesktop && (
        <MobileFilterButton />
      )}
    </VStack>
  );
}
```

### Dynamic Component Props

```tsx
import { useMediaQuery } from "@nugudi/react-hooks-use-media-query";
import { Button, Modal } from "@nugudi/react-components";

function AdaptiveModal({ isOpen, onClose, children }) {
  const { matches: isDesktop } = useMediaQuery({
    query: "(min-width: 1024px)"
  });
  
  const { matches: isTablet } = useMediaQuery({
    query: "(min-width: 768px)"
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={isDesktop ? "large" : isTablet ? "medium" : "full"}
      position={isDesktop ? "center" : "bottom"}
      animation={isDesktop ? "fade" : "slide"}
    >
      <VStack gap={isDesktop ? 24 : 16}>
        {children}
        
        <Button 
          onClick={onClose}
          fullWidth={!isDesktop}
          size={isDesktop ? "md" : "lg"}
        >
          Close
        </Button>
      </VStack>
    </Modal>
  );
}
```

### Performance Optimization

```tsx
import { useIsLg } from "@nugudi/react-hooks-use-media-query";

function OptimizedDashboard() {
  const { matches: isDesktop } = useIsLg();

  // Lazy load heavy components on desktop only
  const HeavyChart = isDesktop 
    ? React.lazy(() => import("./HeavyChart"))
    : null;

  // Reduce data fetching on mobile
  const dataLimit = isDesktop ? 100 : 20;
  
  // Disable animations on mobile for better performance
  const enableAnimations = isDesktop;

  return (
    <Dashboard>
      {isDesktop && (
        <React.Suspense fallback={<ChartSkeleton />}>
          <HeavyChart />
        </React.Suspense>
      )}
      
      <DataTable 
        limit={dataLimit}
        animated={enableAnimations}
        virtualScroll={isDesktop}
      />
    </Dashboard>
  );
}
```

### Dark Mode Detection

```tsx
import { useMediaQuery } from "@nugudi/react-hooks-use-media-query";

function ThemeAwareComponent() {
  const { matches: prefersDark } = useMediaQuery({
    query: "(prefers-color-scheme: dark)",
    onChange: (isDark) => {
      document.documentElement.classList.toggle("dark", isDark);
    }
  });

  const { matches: prefersReducedMotion } = useMediaQuery({
    query: "(prefers-reduced-motion: reduce)"
  });

  return (
    <div className={prefersDark ? "dark-theme" : "light-theme"}>
      <AnimatedLogo animate={!prefersReducedMotion} />
      <ThemeToggle defaultChecked={prefersDark} />
    </div>
  );
}
```

### Orientation Detection

```tsx
import { useMediaQuery } from "@nugudi/react-hooks-use-media-query";

function VideoPlayer() {
  const { matches: isLandscape } = useMediaQuery({
    query: "(orientation: landscape)"
  });

  const { matches: isPortrait } = useMediaQuery({
    query: "(orientation: portrait)"
  });

  return (
    <div className="video-container">
      {isLandscape ? (
        <FullscreenVideo />
      ) : (
        <InlineVideo />
      )}
      
      {isPortrait && (
        <RotateDeviceHint />
      )}
    </div>
  );
}
```

## API Reference

### useMediaQuery

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `query` | `string` | - | Media query string to evaluate |
| `defaultMatches` | `boolean` | `false` | Initial match state for SSR |
| `onChange` | `(matches: boolean) => void` | - | Callback when match state changes |
| `matchMedia` | `Window["matchMedia"]` | - | Custom matchMedia for testing |

**Returns:**

| Property | Type | Description |
|----------|------|-------------|
| `matches` | `boolean` | Current match state of the media query |
| `query` | `string` | The media query string being evaluated |

### Breakpoint Hooks

All breakpoint hooks accept the same optional parameters as `useMediaQuery` except for `query`.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `defaultMatches` | `boolean` | `false` | Initial match state for SSR |
| `onChange` | `(matches: boolean) => void` | - | Callback when match state changes |

### useDeviceType

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `queries` | `{ mobile?: string, tablet?: string, desktop?: string }` | Default breakpoints | Custom media queries for device types |

**Returns:** `"mobile" | "tablet" | "desktop" | "unknown"`

## Best Practices

1. **Use semantic breakpoint hooks** instead of hardcoded pixel values
2. **Provide defaultMatches for SSR** to avoid hydration mismatches
3. **Consider mobile-first design** - start with mobile layout and enhance
4. **Minimize re-renders** by using onChange callbacks strategically
5. **Test on real devices** as media queries can behave differently
6. **Use BREAKPOINTS constants** for consistency across your app
7. **Combine with CSS media queries** for critical styling

## TypeScript Support

Full TypeScript support with exported types:

```tsx
import type { 
  UseMediaQueryProps, 
  UseMediaQueryReturn 
} from "@nugudi/react-hooks-use-media-query";

// Type-safe media query configuration
const config: UseMediaQueryProps = {
  query: "(min-width: 768px)",
  defaultMatches: false,
  onChange: (matches: boolean) => console.log(matches)
};

// Type-safe return value
const result: UseMediaQueryReturn = useMediaQuery(config);
```

## Browser Compatibility

- Modern browsers: Full support with `addEventListener`
- Legacy browsers: Fallback to `addListener` for older browsers
- SSR: Full support with `defaultMatches` parameter
- Testing: Supports custom `matchMedia` injection

## Performance Notes

- Uses `useSyncExternalStore` for optimal React 18+ performance
- Automatically cleans up listeners on unmount
- Prevents unnecessary re-renders
- Zero memory leaks
- Hydration-safe for SSR

## License

MIT