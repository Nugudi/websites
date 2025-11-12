---
description: Component patterns - Pure/presentational components, props-only data flow, callback handlers, UI-only state, styling with Vanilla Extract and design tokens
globs:
  - "**/presentation/ui/components/**/*.tsx"
alwaysApply: true
---

# Component Layer Patterns

> **Document Type**: Frontend Component Architecture - Component Layer
> **Target Audience**: Frontend developers implementing reusable Components
> **Related Documents**: [component-hierarchy.md](./component-hierarchy.md), [section-patterns.md](./section-patterns.md), [view-patterns.md](./view-patterns.md)
> **Last Updated**: 2025-11-11

## What is a Component?

A **Component** is a pure, presentational UI element that:
- Renders UI based solely on props
- Has no side effects (no API calls, no external state)
- Emits events via callback props
- Can be reused in any context with the same props
- Manages only UI-specific state (isOpen, isHovered, etc.)

**Type**: Client or Server Component (can be either)
**Location**: `domains/[domain]/presentation/ui/components/[component-name]/`
**Export**: MUST use named export (e.g., `export const UserProfileCard`)

## Component Responsibilities

### ✅ What Components MUST Do

1. **Be Pure/Presentational** - Components only render UI, no side effects
2. **Accept Data via Props** - All data comes from parent components through props
3. **Emit Events via Callback Props** - Use callback props (e.g., `onClick`, `onSubmit`) for interactions
4. **Be Reusable** - Components should work in any context with the same props
5. **Use Named Export** - `export const MyComponent`
6. **Have Minimal or No State** - Only UI state (e.g., `isOpen`, `isHovered`), no business state

### ❌ What Components MUST NOT Do

1. **Fetch Data** - Components never call APIs, UseCases, or use TanStack Query
2. **Use DI Container** - Components don't fetch data, so no Container needed
3. **Contain Business Logic** - Business logic belongs in Domain layer (UseCases)
4. **Know About Routes** - Components are route-agnostic, no `useRouter` or navigation
5. **Import Sections or Views** - Components are the lowest layer in presentation hierarchy
6. **Manage Complex State** - Complex state belongs in Sections or use Zustand stores

## Pure/Presentational Design

### Props-Only Data Flow

```typescript
// ✅ CORRECT - Pure Component with Props
// File: domains/user/presentation/ui/components/user-profile-card/index.tsx
import { Box } from '@nugudi/react-components-layout';
import { Avatar } from '@nugudi/react-components-avatar';
import * as styles from './index.css';

interface UserProfileCardProps {
  nickname: string;
  profileImageUrl?: string;
  level: number;
  onEditClick: () => void;
}

export const UserProfileCard = ({
  nickname,
  profileImageUrl,
  level,
  onEditClick,
}: UserProfileCardProps) => {
  return (
    <Box className={styles.container}>
      <Avatar src={profileImageUrl} alt={nickname} size="large" />
      <div className={styles.info}>
        <h3 className={styles.nickname}>{nickname}</h3>
        <span className={styles.level}>Lv. {level}</span>
      </div>
      <button onClick={onEditClick} className={styles.editButton}>
        편집
      </button>
    </Box>
  );
};
```

**Key Points:**
- **All data from props** - `nickname`, `profileImageUrl`, `level` come from parent
- **No data fetching** - Component doesn't know where data comes from
- **Event emission** - `onEditClick` prop for parent to handle click
- **Reusable** - Works anywhere with same props

### Wrong Patterns to Avoid

```typescript
// ❌ WRONG - Component Fetching Data
import { useSuspenseQuery } from '@tanstack/react-query';
import { getUserClientContainer } from '@/src/domains/user/di/user-client-container';

export const UserProfileCard = () => {
  // ❌ NO! Components don't fetch data
  const container = getUserClientContainer();
  const getMyProfileUseCase = container.getGetMyProfile();
  const { data } = useSuspenseQuery({
    queryKey: ['user', 'profile'],
    queryFn: () => getMyProfileUseCase.execute(),
  });

  return <div>{data.nickname}</div>;
};

// ❌ WRONG - Component Handling Navigation
import { useRouter } from 'next/navigation';

export const UserProfileCard = ({ userId }: { userId: string }) => {
  // ❌ NO! Components don't handle routing
  const router = useRouter();

  const handleClick = () => {
    router.push(`/profile/${userId}`);
  };

  return <button onClick={handleClick}>View Profile</button>;
};

// ❌ WRONG - Component with Business Logic
export const BenefitCard = ({ benefit }: { benefit: Benefit }) => {
  // ❌ NO! Business logic belongs in Domain layer
  const canUseBenefit = () => {
    const now = new Date();
    return benefit.startDate <= now && benefit.endDate >= now && benefit.stock > 0;
  };

  return <div>{canUseBenefit() ? 'Available' : 'Unavailable'}</div>;
};
```

## Props Interface Design

### Basic Props Pattern

```typescript
// ✅ CORRECT - Well-Designed Props Interface
interface BenefitCardProps {
  // Data props
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  discountRate: number;
  stock: number;
  isAvailable: boolean; // Pre-computed by parent (Section or Adapter)

  // Event props
  onClick?: () => void;
  onFavoriteToggle?: (id: string) => void;

  // UI props
  variant?: 'default' | 'compact';
  showFavorite?: boolean;
}

export const BenefitCard = ({
  id,
  title,
  description,
  imageUrl,
  discountRate,
  stock,
  isAvailable,
  onClick,
  onFavoriteToggle,
  variant = 'default',
  showFavorite = true,
}: BenefitCardProps) => {
  return (
    <div className={styles.card} onClick={onClick}>
      <img src={imageUrl} alt={title} />
      <h3>{title}</h3>
      <p>{description}</p>
      <span>{discountRate}% OFF</span>
      <span>{stock} left</span>
      {showFavorite && (
        <button onClick={() => onFavoriteToggle?.(id)}>
          ⭐
        </button>
      )}
      {!isAvailable && <div className={styles.unavailable}>Unavailable</div>}
    </div>
  );
};
```

**Props Categories:**
1. **Data Props** - Display data (strings, numbers, booleans)
2. **Event Props** - Callbacks for user interactions
3. **UI Props** - Visual variants, flags, styling options

### Optional Props with Defaults

```typescript
// ✅ CORRECT - Optional Props with Sensible Defaults
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
}

export const Button = ({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
}: ButtonProps) => {
  return (
    <button
      className={cx(
        styles.button,
        styles[variant],
        styles[size],
        fullWidth && styles.fullWidth
      )}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? <Spinner /> : children}
    </button>
  );
};
```

### Complex Props with Types

```typescript
// ✅ CORRECT - Using Types for Complex Props
// File: presentation/types/menu.ts
export interface MenuItemUI {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  allergens: string[];
  isVegetarian: boolean;
  isSpicy: boolean;
}

// File: components/menu-item-card/index.tsx
interface MenuItemCardProps {
  item: MenuItemUI;
  quantity: number;
  onQuantityChange: (id: string, quantity: number) => void;
  onAddToCart: (id: string) => void;
}

export const MenuItemCard = ({
  item,
  quantity,
  onQuantityChange,
  onAddToCart,
}: MenuItemCardProps) => {
  return (
    <div className={styles.card}>
      <img src={item.imageUrl} alt={item.name} />
      <h4>{item.name}</h4>
      <p>{item.description}</p>
      <div className={styles.badges}>
        {item.isVegetarian && <Badge>Vegetarian</Badge>}
        {item.isSpicy && <Badge>Spicy</Badge>}
      </div>
      <div className={styles.price}>{item.price.toLocaleString()}원</div>
      <QuantityControl
        value={quantity}
        onChange={(q) => onQuantityChange(item.id, q)}
      />
      <button onClick={() => onAddToCart(item.id)}>Add to Cart</button>
    </div>
  );
};
```

## Callback Props for Events

### Simple Event Handlers

```typescript
// ✅ CORRECT - Simple Callback Props
interface ProfileHeaderProps {
  name: string;
  avatarUrl: string;
  onEditClick: () => void;
  onSettingsClick: () => void;
  onLogoutClick: () => void;
}

export const ProfileHeader = ({
  name,
  avatarUrl,
  onEditClick,
  onSettingsClick,
  onLogoutClick,
}: ProfileHeaderProps) => {
  return (
    <div className={styles.header}>
      <Avatar src={avatarUrl} alt={name} />
      <h2>{name}</h2>
      <div className={styles.actions}>
        <button onClick={onEditClick}>Edit</button>
        <button onClick={onSettingsClick}>Settings</button>
        <button onClick={onLogoutClick}>Logout</button>
      </div>
    </div>
  );
};
```

### Event Handlers with Parameters

```typescript
// ✅ CORRECT - Callbacks with Parameters
interface ReviewCardProps {
  reviewId: string;
  rating: number;
  comment: string;
  authorName: string;
  createdAt: string;
  canEdit: boolean;
  canDelete: boolean;
  onEdit: (reviewId: string) => void;
  onDelete: (reviewId: string) => void;
  onReport: (reviewId: string, reason: string) => void;
}

export const ReviewCard = ({
  reviewId,
  rating,
  comment,
  authorName,
  createdAt,
  canEdit,
  canDelete,
  onEdit,
  onDelete,
  onReport,
}: ReviewCardProps) => {
  const [showReportDialog, setShowReportDialog] = useState(false);

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span>{authorName}</span>
        <span>{createdAt}</span>
      </div>
      <Rating value={rating} readOnly />
      <p>{comment}</p>
      <div className={styles.actions}>
        {canEdit && <button onClick={() => onEdit(reviewId)}>Edit</button>}
        {canDelete && <button onClick={() => onDelete(reviewId)}>Delete</button>}
        <button onClick={() => setShowReportDialog(true)}>Report</button>
      </div>

      {showReportDialog && (
        <ReportDialog
          onSubmit={(reason) => {
            onReport(reviewId, reason);
            setShowReportDialog(false);
          }}
          onCancel={() => setShowReportDialog(false)}
        />
      )}
    </div>
  );
};
```

### Form Event Handlers

```typescript
// ✅ CORRECT - Form Component with Callback
interface SignUpFormProps {
  onSubmit: (data: { email: string; password: string }) => void;
  isSubmitting?: boolean;
  error?: string;
}

export const SignUpForm = ({
  onSubmit,
  isSubmitting = false,
  error,
}: SignUpFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ email, password });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={isSubmitting}
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={isSubmitting}
      />
      {error && <div className={styles.error}>{error}</div>}
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Signing up...' : 'Sign Up'}
      </button>
    </form>
  );
};
```

## UI-Only State

### Toggle State Example

```typescript
// ✅ CORRECT - Component with UI-Only State
interface CafeteriaCardProps {
  name: string;
  description: string;
  imageUrl: string;
  rating: number;
  distance: string;
  onClick: () => void;
}

export const CafeteriaCard = ({
  name,
  description,
  imageUrl,
  rating,
  distance,
  onClick,
}: CafeteriaCardProps) => {
  // ✅ UI-only state - controls description expansion
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={styles.card} onClick={onClick}>
      <img src={imageUrl} alt={name} />
      <h3>{name}</h3>
      <p className={isExpanded ? styles.expanded : styles.collapsed}>
        {description}
      </p>
      <button
        onClick={(e) => {
          e.stopPropagation(); // Prevent card onClick
          setIsExpanded(!isExpanded);
        }}
      >
        {isExpanded ? 'Show Less' : 'Show More'}
      </button>
      <div className={styles.meta}>
        <Rating value={rating} />
        <span>{distance}</span>
      </div>
    </div>
  );
};
```

### Hover State Example

```typescript
// ✅ CORRECT - Hover State for Tooltip
interface InfoTooltipProps {
  content: string;
  children: React.ReactNode;
}

export const InfoTooltip = ({ content, children }: InfoTooltipProps) => {
  // ✅ UI-only state - controls tooltip visibility
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={styles.container}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
      {isHovered && (
        <div className={styles.tooltip}>
          {content}
        </div>
      )}
    </div>
  );
};
```

### Focus State Example

```typescript
// ✅ CORRECT - Focus State for Input Enhancement
interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  placeholder?: string;
}

export const SearchInput = ({
  value,
  onChange,
  onSearch,
  placeholder = 'Search...',
}: SearchInputProps) => {
  // ✅ UI-only state - controls focus styling
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={cx(styles.container, isFocused && styles.focused)}>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onKeyDown={(e) => e.key === 'Enter' && onSearch()}
        placeholder={placeholder}
      />
      <button onClick={onSearch}>Search</button>
    </div>
  );
};
```

## Styling with Vanilla Extract

### Using Design Tokens (vars)

```typescript
// ✅ CORRECT - Always Use Design Tokens
// File: components/benefit-card/index.css.ts
import { style } from '@vanilla-extract/css';
import { vars } from '@nugudi/themes';

export const card = style({
  // ✅ Use vars for colors
  backgroundColor: vars.colors.$scale.white,
  borderColor: vars.colors.$scale.zinc[200],

  // ✅ Use vars for spacing
  padding: vars.box.spacing[16],
  gap: vars.box.spacing[12],

  // ✅ Use vars for border radius
  borderRadius: vars.box.radii.lg,

  // ✅ Use vars for shadows
  boxShadow: vars.box.shadows.sm,

  // ✅ Use vars for transitions
  transition: 'all 0.2s ease',
});

export const title = style({
  fontSize: vars.fontSize[18],
  fontWeight: vars.fontWeight.semibold,
  color: vars.colors.$scale.zinc[900],
  marginBottom: vars.box.spacing[8],
});

export const description = style({
  fontSize: vars.fontSize[14],
  color: vars.colors.$scale.zinc[600],
  lineHeight: 1.5,
});

// ❌ WRONG - Don't use hard-coded values
export const wrongCard = style({
  backgroundColor: '#ffffff', // NO! Use vars.colors.$scale.white
  padding: '16px', // NO! Use vars.box.spacing[16]
  borderRadius: '12px', // NO! Use vars.box.radii.lg
  boxShadow: '0 1px 3px rgba(0,0,0,0.1)', // NO! Use vars.box.shadows.sm
});
```

### Responsive Styles

```typescript
// ✅ CORRECT - Responsive Styles with Vanilla Extract
// File: components/cafeteria-grid/index.css.ts
import { style } from '@vanilla-extract/css';
import { vars } from '@nugudi/themes';

export const grid = style({
  display: 'grid',
  gap: vars.box.spacing[24],

  // Mobile first
  gridTemplateColumns: '1fr',

  // Tablet
  '@media': {
    'screen and (min-width: 768px)': {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
    // Desktop
    'screen and (min-width: 1024px)': {
      gridTemplateColumns: 'repeat(3, 1fr)',
    },
  },
});
```

### Variant Styles

```typescript
// ✅ CORRECT - Variants with styleVariants
// File: components/button/index.css.ts
import { style, styleVariants } from '@vanilla-extract/css';
import { vars } from '@nugudi/themes';

const baseButton = style({
  padding: `${vars.box.spacing[12]} ${vars.box.spacing[24]}`,
  borderRadius: vars.box.radii.md,
  fontSize: vars.fontSize[14],
  fontWeight: vars.fontWeight.medium,
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  border: 'none',
});

export const button = styleVariants({
  primary: [
    baseButton,
    {
      backgroundColor: vars.colors.$scale.blue[600],
      color: vars.colors.$scale.white,
      ':hover': {
        backgroundColor: vars.colors.$scale.blue[700],
      },
    },
  ],
  secondary: [
    baseButton,
    {
      backgroundColor: vars.colors.$scale.zinc[200],
      color: vars.colors.$scale.zinc[900],
      ':hover': {
        backgroundColor: vars.colors.$scale.zinc[300],
      },
    },
  ],
  ghost: [
    baseButton,
    {
      backgroundColor: 'transparent',
      color: vars.colors.$scale.blue[600],
      ':hover': {
        backgroundColor: vars.colors.$scale.blue[50],
      },
    },
  ],
});

// Usage in component
export const Button = ({ variant = 'primary', ...props }: ButtonProps) => {
  return <button className={button[variant]} {...props} />;
};
```

## Complete Implementation Examples

### Example 1: Simple Display Component

```typescript
// ✅ CORRECT - Simple Card Component
// File: domains/user/presentation/ui/components/stat-card/index.tsx
import { Box } from '@nugudi/react-components-layout';
import * as styles from './index.css';

interface StatCardProps {
  label: string;
  value: number;
  icon?: React.ReactNode;
}

export const StatCard = ({ label, value, icon }: StatCardProps) => {
  return (
    <Box className={styles.card}>
      {icon && <div className={styles.icon}>{icon}</div>}
      <div className={styles.content}>
        <span className={styles.label}>{label}</span>
        <span className={styles.value}>{value.toLocaleString()}</span>
      </div>
    </Box>
  );
};
```

```typescript
// index.css.ts
import { style } from '@vanilla-extract/css';
import { vars } from '@nugudi/themes';

export const card = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.box.spacing[12],
  padding: vars.box.spacing[16],
  backgroundColor: vars.colors.$scale.white,
  borderRadius: vars.box.radii.lg,
  boxShadow: vars.box.shadows.sm,
});

export const icon = style({
  fontSize: vars.fontSize[24],
  color: vars.colors.$scale.blue[600],
});

export const content = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.box.spacing[4],
});

export const label = style({
  fontSize: vars.fontSize[12],
  color: vars.colors.$scale.zinc[600],
  fontWeight: vars.fontWeight.medium,
});

export const value = style({
  fontSize: vars.fontSize[24],
  color: vars.colors.$scale.zinc[900],
  fontWeight: vars.fontWeight.bold,
});
```

### Example 2: Interactive Component with State

```typescript
// ✅ CORRECT - Accordion Component
// File: domains/cafeteria/presentation/ui/components/faq-accordion/index.tsx
import { useState } from 'react';
import { Box } from '@nugudi/react-components-layout';
import * as styles from './index.css';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
  onItemClick?: (id: string) => void;
}

export const FAQAccordion = ({ items, onItemClick }: FAQAccordionProps) => {
  const [openId, setOpenId] = useState<string | null>(null);

  const handleToggle = (id: string) => {
    setOpenId(openId === id ? null : id);
    onItemClick?.(id);
  };

  return (
    <div className={styles.container}>
      {items.map((item) => (
        <Box key={item.id} className={styles.item}>
          <button
            className={styles.question}
            onClick={() => handleToggle(item.id)}
          >
            <span>{item.question}</span>
            <span className={styles.icon}>
              {openId === item.id ? '−' : '+'}
            </span>
          </button>
          {openId === item.id && (
            <div className={styles.answer}>
              {item.answer}
            </div>
          )}
        </Box>
      ))}
    </div>
  );
};
```

### Example 3: Form Component

```typescript
// ✅ CORRECT - Controlled Form Component
// File: domains/auth/presentation/ui/components/email-sign-in-form/index.tsx
import { useState } from 'react';
import { Input } from '@nugudi/react-components-input';
import { Button } from '@nugudi/react-components-button';
import { Box } from '@nugudi/react-components-layout';
import * as styles from './index.css';

interface EmailSignInFormProps {
  onSubmit: (data: { email: string; password: string }) => void;
  isSubmitting?: boolean;
  error?: string;
}

export const EmailSignInForm = ({
  onSubmit,
  isSubmitting = false,
  error,
}: EmailSignInFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');

  const validateEmail = (value: string) => {
    if (!value) {
      setEmailError('Email is required');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setEmailError('Invalid email format');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) return;
    onSubmit({ email, password });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <Box>
        <Input
          type="email"
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => validateEmail(email)}
          error={emailError}
          disabled={isSubmitting}
          required
        />
      </Box>

      <Box>
        <Input
          type="password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isSubmitting}
          required
        />
      </Box>

      {error && <div className={styles.error}>{error}</div>}

      <Button
        type="submit"
        variant="primary"
        fullWidth
        disabled={isSubmitting}
        loading={isSubmitting}
      >
        Sign In
      </Button>
    </form>
  );
};
```

## MUST/NEVER Rules for Components

### ✅ MUST Rules

1. **MUST be pure/presentational** - Only render UI based on props

   **Why?** Pure components are predictable (same props = same output), easily testable (no side effects to mock), and reusable across different contexts. Mixing side effects (data fetching, business logic) into components makes them context-dependent, difficult to test, and couples them to specific use cases. Pure components following functional programming principles provide maintainability and reliability.

2. **MUST accept data via props** - All data from parent components

   **Why?** Props-driven data flow creates clear dependency graphs where data flows down from parent to child, making components predictable and testable. Components fetching their own data violate component hierarchy, create hidden dependencies, and prevent reusability in different contexts. Props make dependencies explicit, enable component composition, and support testing with mock data.

3. **MUST emit events via callbacks** - Use callback props for interactions

   **Why?** Callback props (onClick, onChange) enable upward communication while maintaining unidirectional data flow (props down, events up), keeping components decoupled from parent implementation details. Direct parent manipulation or shared state couples components tightly, reduces reusability, and makes testing difficult. Callbacks provide loose coupling and clear component contracts.

4. **MUST be reusable** - Work in any context with same props

   **Why?** Reusable components eliminate code duplication, ensure visual consistency, reduce maintenance burden (fix once, benefits everywhere), and amortize development cost across multiple use cases. Context-specific components create maintenance nightmares (duplicate fixes), visual inconsistencies, and wasted development time. Design for reusability from the start maximizes component value.

5. **MUST use named export** - `export const MyComponent`

   **Why?** Named exports provide better IDE autocomplete, explicit imports showing exactly what's imported, and prevent naming inconsistencies across the codebase. Named exports support tree-shaking better, enable multiple exports per file, and align with component library best practices. Default exports hide the actual component name and reduce discoverability.

6. **MUST have minimal state** - Only UI state (isOpen, isHovered)

   **Why?** Components should manage only presentational state (UI toggles, hover states) that doesn't affect business logic, keeping them lightweight and focused. Complex state (data, forms, workflows) belongs in parent Sections or Zustand stores, preventing components from becoming bloated and tightly coupled. Minimal state improves testability and makes components easier to understand.

7. **MUST use design tokens** - vars and classes from `@nugudi/themes`

   **Why?** Design tokens ensure visual consistency, enable theme switching (dark mode) automatically, provide type-safe styling, and centralize design decisions. Hard-coded values create maintenance nightmares (find all instances for changes), visual inconsistencies, and make theming impossible. Tokens provide single source of truth for design system.

8. **MUST use Vanilla Extract** - `index.css.ts` for styling

   **Why?** Vanilla Extract provides type-safe CSS-in-TypeScript with zero runtime cost, design token integration, and build-time CSS generation for optimal performance. CSS Modules lack type safety and design system integration. Vanilla Extract enforces consistent styling patterns, prevents CSS conflicts with scoped styles, and enables compile-time validation.

### ❌ NEVER Rules

1. **NEVER fetch data** - No API calls, UseCases, or TanStack Query

   **Why?** Data fetching is Section layer's responsibility with proper error boundaries, loading states, and cache management. Components fetching data violate component hierarchy, prevent reusability (tied to specific endpoints), make testing difficult (need to mock network), and duplicate Section functionality. Pure presentational components receiving data via props are predictable, testable, and reusable.

2. **NEVER use DI Container** - Components don't need data sources

   **Why?** DI Containers exist for dependency injection when using UseCases to fetch data, which Components never do by design. Components using DI Containers indicate architectural violation—they should be pure presentational units receiving data via props. This rule enforces component purity and proper separation of concerns in the component hierarchy.

3. **NEVER contain business logic** - Business logic in Domain layer

   **Why?** Business logic (validation, calculations, domain rules) belongs in Domain layer (Entities, UseCases), not Presentation layer, following Clean Architecture principles. Components with business logic create duplicate logic across the codebase, make changes difficult (update in multiple places), prevent reusability, and violate single source of truth. Domain layer ensures consistency.

4. **NEVER know about routes** - No `useRouter` or navigation

   **Why?** Components knowing about routes couples them to specific application navigation structure, preventing reusability across different routes or applications. Navigation is a cross-cutting concern handled by parent Sections or Pages through callback props. Route-aware components become context-dependent and difficult to test, violating component purity principles.

5. **NEVER import Sections/Views** - Lowest layer in hierarchy

   **Why?** Components are the lowest layer in component hierarchy (Page → View → Section → Component), importing higher layers creates circular dependencies and violates architectural rules. Upward imports prevent proper testing (can't test Component without Section), reduce reusability, and create tight coupling. Hierarchy must flow downward only for maintainable architecture.

6. **NEVER manage complex state** - Use Zustand or move to Section

   **Why?** Complex state (forms, multi-step workflows, shared data) requires sophisticated state management that bloats Components and violates Single Responsibility Principle. Components should manage only simple UI state (toggles, hovers). Complex state belongs in Zustand stores (global) or Sections (local with TanStack Query), keeping Components lightweight and focused on presentation.

7. **NEVER use hard-coded values** - Always use design tokens

   **Why?** Hard-coded colors, spacing, or typography create maintenance nightmares (must find and change all occurrences), visual inconsistencies across the app, and make theming impossible. Design tokens provide single source of truth, enable automatic theme switching, ensure consistency, and allow design changes to propagate automatically. Hard-coding violates DRY principle.

8. **NEVER use CSS Modules** - Use Vanilla Extract only

   **Why?** Vanilla Extract is the standardized styling solution providing type-safe CSS-in-TypeScript, design token integration, zero runtime cost, and build-time validation. CSS Modules lack type safety, can't access design tokens easily, and create inconsistent styling patterns across the codebase. Standardizing on Vanilla Extract ensures consistent styling approach and better developer experience.

## Common Patterns

### Pattern 1: List Component

```typescript
// File: components/benefit-list/index.tsx
interface BenefitListProps {
  benefits: BenefitItemUI[];
  onBenefitClick: (id: string) => void;
  emptyMessage?: string;
}

export const BenefitList = ({
  benefits,
  onBenefitClick,
  emptyMessage = 'No benefits available',
}: BenefitListProps) => {
  if (benefits.length === 0) {
    return <div className={styles.empty}>{emptyMessage}</div>;
  }

  return (
    <div className={styles.grid}>
      {benefits.map((benefit) => (
        <BenefitCard
          key={benefit.id}
          {...benefit}
          onClick={() => onBenefitClick(benefit.id)}
        />
      ))}
    </div>
  );
};
```

### Pattern 2: Compound Component

```typescript
// File: components/card/index.tsx
interface CardProps {
  children: React.ReactNode;
  onClick?: () => void;
}

export const Card = ({ children, onClick }: CardProps) => {
  return (
    <div className={styles.card} onClick={onClick}>
      {children}
    </div>
  );
};

Card.Header = ({ children }: { children: React.ReactNode }) => {
  return <div className={styles.header}>{children}</div>;
};

Card.Content = ({ children }: { children: React.ReactNode }) => {
  return <div className={styles.content}>{children}</div>;
};

Card.Footer = ({ children }: { children: React.ReactNode }) => {
  return <div className={styles.footer}>{children}</div>;
};

// Usage
<Card>
  <Card.Header>
    <h3>Title</h3>
  </Card.Header>
  <Card.Content>
    <p>Content</p>
  </Card.Content>
  <Card.Footer>
    <button>Action</button>
  </Card.Footer>
</Card>
```

### Pattern 3: Render Props

```typescript
// File: components/data-table/index.tsx
interface DataTableProps<T> {
  data: T[];
  columns: Array<{
    key: keyof T;
    label: string;
    render?: (value: T[keyof T], item: T) => React.ReactNode;
  }>;
  onRowClick?: (item: T) => void;
}

export function DataTable<T extends { id: string }>({
  data,
  columns,
  onRowClick,
}: DataTableProps<T>) {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={String(col.key)}>{col.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr
            key={item.id}
            onClick={() => onRowClick?.(item)}
            className={styles.row}
          >
            {columns.map((col) => (
              <td key={String(col.key)}>
                {col.render
                  ? col.render(item[col.key], item)
                  : String(item[col.key])}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

## Related Documentation

- **[component-hierarchy.md](./component-hierarchy.md)** - Overall component hierarchy
- **[section-patterns.md](./section-patterns.md)** - Section layer and data fetching
- **[view-patterns.md](./view-patterns.md)** - View layer composition
- **[page-patterns.md](./page-patterns.md)** - Page layer patterns
- **[../packages.md](../packages.md)** - Monorepo package usage and design tokens
