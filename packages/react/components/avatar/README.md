# Avatar Component

A flexible avatar component that displays user images, initials, or icons with optional status badges.

## Installation

```bash
pnpm add @nugudi/react-components-avatar
```

## Basic Usage

```tsx
import { Avatar } from '@nugudi/react-components-avatar';

// With image
<Avatar
  name="Dan Abrahmov"
  src="https://example.com/avatar.jpg"
  size="md"
/>

// With initials fallback
<Avatar name="Segun Adebayo" size="lg" />

// With custom icon
import { UserIcon } from '@nugudi/assets-icons';
<Avatar icon={<UserIcon />} size="md" />

// With status badge
<Avatar
  name="Kent Dodds"
  src="https://example.com/avatar.jpg"
  showBadge
  badgeColor="green"
/>
```

## Next.js Image Integration

The Avatar component supports Next.js Image optimization in two ways:

### Method 1: Using getImageProps

```tsx
import { Avatar } from '@nugudi/react-components-avatar';
import { getImageProps } from 'next/image';

function UserAvatar() {
  const imageProps = getImageProps({
    src: '/user-avatar.png',
    width: 48,
    height: 48,
    alt: 'User Avatar',
  });

  return (
    <Avatar
      name="John Doe"
      imgProps={imageProps}
      size="md"
    />
  );
}
```

### Method 2: Using Image component directly

```tsx
import { Avatar } from '@nugudi/react-components-avatar';
import Image from 'next/image';

function UserAvatar() {
  return (
    <Avatar
      name="Jane Smith"
      imgElement={
        <Image
          src="/avatar.png"
          width={48}
          height={48}
          alt="Jane Smith"
          priority
        />
      }
      size="md"
    />
  );
}
```

## Avatar Group

Display multiple avatars with overflow indication:

```tsx
import { Avatar, AvatarGroup } from '@nugudi/react-components-avatar';

<AvatarGroup size="md" max={3}>
  <Avatar name="Ryan Florence" src="/avatar1.jpg" />
  <Avatar name="Segun Adebayo" src="/avatar2.jpg" />
  <Avatar name="Kent Dodds" src="/avatar3.jpg" />
  <Avatar name="Prosper Otemuyiwa" src="/avatar4.jpg" />
  <Avatar name="Christian Nwamba" src="/avatar5.jpg" />
</AvatarGroup>
```

## Props

### Avatar Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| alt | `string` | - | 이미지 대체 텍스트 (웹 접근성을 위한 명시적 텍스트, 스크린리더에서 우선 사용) |
| name | `string` | - | 이니셜 생성용 이름 (alt가 없을 때 대체 텍스트로도 사용) |
| src | `string` | - | Image URL |
| size | `'sm' \| 'md' \| 'lg'` | `'md'` | Avatar size |
| showBadge | `boolean` | `false` | Show status badge |
| badgeColor | `AvatarBadgeColor` (theme colors) | `'main'` | Badge color |
| borderRadius | `'full' \| 'lg' \| 'md' \| 'sm' \| 'none'` | `'full'` | Border radius |
| icon | `React.ReactElement` | - | Custom fallback icon |
| onError | `() => void` | - | Image error handler |
| imgElement | `React.ReactElement` | - | Custom image element (for Next.js Image) |
| imgProps | `React.ImgHTMLAttributes<HTMLImageElement>` | - | Image props (for Next.js getImageProps) |

### AvatarGroup Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| max | `number` | `3` | Maximum avatars to display |
| size | `AvatarSize` | `'md'` | Size for all avatars |
| children | `React.ReactNode` | - | Avatar components |

## Sizes

Available sizes with their dimensions:
- `sm`: 48px (3rem) 
- `md`: 80px (5rem) - default
- `lg`: 128px (8rem)

## Fallback Behavior

The component follows this fallback hierarchy:
1. Display image if `src`, `imgElement`, or `imgProps` is provided
2. Display initials generated from `name` if no image
3. Display custom `icon` if provided
4. Display default user icon if nothing else is available

## Styling

The component uses CSS-in-JS with vanilla-extract. Import the styles:

```tsx
import '@nugudi/react-components-avatar/style.css';
```

## Accessibility

- Proper ARIA labels for screen readers
- Alt text for images
- Status badge includes aria-label
- Keyboard accessible when interactive

## Examples

### Different Border Radius

```tsx
<Avatar name="User" src="/avatar.jpg" borderRadius="lg" />
<Avatar name="User" src="/avatar.jpg" borderRadius="md" />
<Avatar name="User" src="/avatar.jpg" borderRadius="none" />
```

### With Status Indicators

```tsx
// Online
<Avatar name="User" showBadge badgeColor="green" />

// Away
<Avatar name="User" showBadge badgeColor="yellow" />

// Busy
<Avatar name="User" showBadge badgeColor="orange" />

// Main brand color
<Avatar name="User" showBadge badgeColor="main" />
```

### Error Handling

```tsx
<Avatar
  name="Fallback Name"
  src="invalid-url.jpg"
  onError={() => console.log('Image failed to load')}
/>
```

## TypeScript

The component is fully typed. Import types as needed:

```tsx
import type { AvatarProps, AvatarGroupProps, AvatarSize } from '@nugudi/react-components-avatar';
```