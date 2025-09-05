# Badge Component

A small status descriptor for UI elements. Badges can display text with semantic colors and optional icons.

## Installation

```bash
pnpm add @nugudi/react-components-badge
```

## Basic Usage

```tsx
import { Badge } from '@nugudi/react-components-badge';

// Basic badge
<Badge>New</Badge>

// With different sizes
<Badge size="sm">Small</Badge>
<Badge size="md">Medium</Badge>
<Badge size="lg">Large</Badge>
```

## Semantic Tones

Different tones convey different meanings:

```tsx
import { HStack } from '@nugudi/react-components-layout';

// All available tones
<HStack gap={8}>
  <Badge tone="neutral">Neutral</Badge>
  <Badge tone="informative">Informative</Badge>
  <Badge tone="positive">Positive</Badge>
  <Badge tone="warning">Warning</Badge>
  <Badge tone="negative">Negative</Badge>
  <Badge tone="purple">Purple</Badge>
</HStack>
```

## Variants

Three visual styles for different emphasis levels:

```tsx
import { VStack, HStack } from '@nugudi/react-components-layout';

// Solid variant (default) - strongest emphasis
<HStack gap={8}>
  <Badge variant="solid" tone="informative">Solid</Badge>
  <Badge variant="solid" tone="positive">Solid</Badge>
  <Badge variant="solid" tone="warning">Solid</Badge>
</HStack>

// Weak variant - subtle appearance
<HStack gap={8}>
  <Badge variant="weak" tone="informative">Weak</Badge>
  <Badge variant="weak" tone="positive">Weak</Badge>
  <Badge variant="weak" tone="warning">Weak</Badge>
</HStack>

// Outline variant - bordered style
<HStack gap={8}>
  <Badge variant="outline" tone="informative">Outline</Badge>
  <Badge variant="outline" tone="positive">Outline</Badge>
  <Badge variant="outline" tone="warning">Outline</Badge>
</HStack>
```

## With Icons

Add icons for better visual recognition:

```tsx
import { Badge } from '@nugudi/react-components-badge';
import { CheckIcon, AlertIcon, InfoIcon, CloseIcon } from '@nugudi/assets-icons';
import { HStack } from '@nugudi/react-components-layout';

// Icons with different tones
<HStack gap={8}>
  <Badge tone="positive" icon={<CheckIcon />}>
    Approved
  </Badge>
  
  <Badge tone="warning" icon={<AlertIcon />}>
    Pending
  </Badge>
  
  <Badge tone="informative" icon={<InfoIcon />}>
    Info
  </Badge>
  
  <Badge tone="negative" icon={<CloseIcon />}>
    Rejected
  </Badge>
</HStack>
```

## Sizes

Three size options for different contexts:

```tsx
import { VStack, HStack } from '@nugudi/react-components-layout';

// Size comparison
<VStack gap={12}>
  <HStack gap={8} align="center">
    <Badge size="sm" tone="informative">Small Badge</Badge>
    <Badge size="md" tone="informative">Medium Badge</Badge>
    <Badge size="lg" tone="informative">Large Badge</Badge>
  </HStack>
</VStack>
```

## Status Indicators

Common use case for showing status:

```tsx
import { HStack, VStack, Box } from '@nugudi/react-components-layout';
import { Body } from '@nugudi/react-components-layout';

function OrderStatus({ status }: { status: string }) {
  const statusConfig = {
    pending: { tone: 'warning', label: 'Pending' },
    processing: { tone: 'informative', label: 'Processing' },
    shipped: { tone: 'purple', label: 'Shipped' },
    delivered: { tone: 'positive', label: 'Delivered' },
    cancelled: { tone: 'negative', label: 'Cancelled' }
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <Badge 
      tone={config.tone as any}
      variant="solid"
      size="sm"
    >
      {config.label}
    </Badge>
  );
}

// Usage
<VStack gap={12}>
  <HStack gap={8}>
    <Body fontSize="b3">Order #1234:</Body>
    <OrderStatus status="pending" />
  </HStack>
  <HStack gap={8}>
    <Body fontSize="b3">Order #1235:</Body>
    <OrderStatus status="delivered" />
  </HStack>
</VStack>
```

## Notification Badges

For showing counts and notifications:

```tsx
import { HStack, Box } from '@nugudi/react-components-layout';
import { BellIcon, MessageIcon, CartIcon } from '@nugudi/assets-icons';

function NotificationBadge({ count }: { count: number }) {
  if (count === 0) return null;
  
  return (
    <Badge 
      tone="negative" 
      variant="solid"
      size="sm"
    >
      {count > 99 ? '99+' : count}
    </Badge>
  );
}

// Icon with badge
<HStack gap={16}>
  <Box position="relative">
    <BellIcon />
    <Box position="absolute" top={-4} right={-4}>
      <NotificationBadge count={3} />
    </Box>
  </Box>
  
  <Box position="relative">
    <MessageIcon />
    <Box position="absolute" top={-4} right={-4}>
      <NotificationBadge count={12} />
    </Box>
  </Box>
  
  <Box position="relative">
    <CartIcon />
    <Box position="absolute" top={-4} right={-4}>
      <NotificationBadge count={0} />
    </Box>
  </Box>
</HStack>
```

## Label Badges

For categorization and tagging:

```tsx
import { HStack, VStack } from '@nugudi/react-components-layout';
import { Title, Body } from '@nugudi/react-components-layout';

function ArticleCard() {
  return (
    <VStack gap={12}>
      <HStack gap={8}>
        <Badge tone="purple" variant="weak" size="sm">
          Tutorial
        </Badge>
        <Badge tone="informative" variant="weak" size="sm">
          Beginner
        </Badge>
        <Badge tone="positive" variant="weak" size="sm">
          Free
        </Badge>
      </HStack>
      
      <Title fontSize="t3">Getting Started with React</Title>
      <Body fontSize="b3">Learn the basics of React development...</Body>
    </VStack>
  );
}
```

## Priority Indicators

Show priority levels with appropriate styling:

```tsx
import { VStack, HStack } from '@nugudi/react-components-layout';

function PriorityBadge({ priority }: { priority: 'low' | 'medium' | 'high' | 'urgent' }) {
  const config = {
    low: { tone: 'neutral', variant: 'weak', label: 'Low' },
    medium: { tone: 'informative', variant: 'weak', label: 'Medium' },
    high: { tone: 'warning', variant: 'solid', label: 'High' },
    urgent: { tone: 'negative', variant: 'solid', label: 'Urgent' }
  };

  const { tone, variant, label } = config[priority];

  return (
    <Badge tone={tone as any} variant={variant as any} size="sm">
      {label}
    </Badge>
  );
}

// Usage
<HStack gap={8}>
  <PriorityBadge priority="low" />
  <PriorityBadge priority="medium" />
  <PriorityBadge priority="high" />
  <PriorityBadge priority="urgent" />
</HStack>
```

## Complex Examples

### User Profile Badges

```tsx
import { HStack, VStack, Box } from '@nugudi/react-components-layout';
import { Body, Title } from '@nugudi/react-components-layout';
import { VerifiedIcon, StarIcon } from '@nugudi/assets-icons';

function UserProfileBadges() {
  return (
    <VStack gap={12}>
      <Title fontSize="t3">John Doe</Title>
      
      <HStack gap={8}>
        <Badge 
          tone="positive" 
          variant="solid"
          icon={<VerifiedIcon />}
          size="sm"
        >
          Verified
        </Badge>
        
        <Badge 
          tone="purple" 
          variant="solid"
          icon={<StarIcon />}
          size="sm"
        >
          Pro Member
        </Badge>
        
        <Badge 
          tone="informative" 
          variant="weak"
          size="sm"
        >
          Since 2020
        </Badge>
      </HStack>
    </VStack>
  );
}
```

### Task List with Status

```tsx
import { VStack, HStack, Box } from '@nugudi/react-components-layout';
import { Body } from '@nugudi/react-components-layout';

function TaskItem({ task }) {
  const statusBadge = {
    todo: <Badge tone="neutral" variant="weak" size="sm">To Do</Badge>,
    inProgress: <Badge tone="informative" variant="solid" size="sm">In Progress</Badge>,
    review: <Badge tone="warning" variant="solid" size="sm">Review</Badge>,
    done: <Badge tone="positive" variant="solid" size="sm">Done</Badge>
  };

  return (
    <HStack gap={12} justify="space-between">
      <Body fontSize="b2">{task.title}</Body>
      {statusBadge[task.status]}
    </HStack>
  );
}
```

### Environment Badges

```tsx
import { HStack } from '@nugudi/react-components-layout';

function EnvironmentBadge({ env }: { env: 'dev' | 'staging' | 'prod' }) {
  const config = {
    dev: { tone: 'neutral', variant: 'outline', label: 'Development' },
    staging: { tone: 'warning', variant: 'solid', label: 'Staging' },
    prod: { tone: 'negative', variant: 'solid', label: 'Production' }
  };

  const { tone, variant, label } = config[env];

  return (
    <Badge tone={tone as any} variant={variant as any} size="md">
      {label}
    </Badge>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| children | `ReactNode` | - | **Required.** Badge content |
| tone | `'neutral' \| 'informative' \| 'positive' \| 'warning' \| 'negative' \| 'purple'` | `'neutral'` | Semantic color tone |
| variant | `'solid' \| 'weak' \| 'outline'` | `'solid'` | Visual style variant |
| size | `'sm' \| 'md' \| 'lg'` | `'md'` | Badge size |
| icon | `ReactElement` | - | Optional icon element |
| ...spanProps | `ComponentPropsWithoutRef<'span'>` | - | All native span attributes |

## Styling

The component uses CSS-in-JS with vanilla-extract. Import the styles:

```tsx
import '@nugudi/react-components-badge/style.css';
```

## Accessibility

- Uses semantic HTML `<span>` element
- Color combinations meet WCAG contrast requirements
- Icons are decorative and properly hidden from screen readers
- Text content is always accessible

## TypeScript

The component is fully typed. Import types as needed:

```tsx
import type { BadgeProps, BadgeSize } from '@nugudi/react-components-badge';
import type { SemanticTone, SemanticVariant } from '@nugudi/themes';

// Using in component props
interface StatusProps {
  badgeProps?: BadgeProps;
}

// Custom badge configuration
interface BadgeConfig {
  tone: SemanticTone;
  variant: SemanticVariant;
  size: BadgeSize;
}
```

## Best Practices

1. **Use semantic tones**: Choose tones that match the meaning (positive for success, negative for errors)
2. **Keep text concise**: Badges should contain short, scannable text
3. **Consider contrast**: Ensure badges are readable against their backgrounds
4. **Use consistent sizing**: Maintain size consistency within the same context
5. **Add icons sparingly**: Icons should clarify meaning, not clutter
6. **Group related badges**: Use Layout components to organize multiple badges
7. **Avoid overuse**: Too many badges can reduce their effectiveness