# NavigationItem Component

A versatile navigation menu item component with support for icons, different sizes, and disabled states. Perfect for sidebars, settings menus, mobile navigation, and list-based interfaces.

## Installation

```bash
pnpm add @nugudi/react-components-navigation-item
```

## Basic Usage

```tsx
import { NavigationItem } from '@nugudi/react-components-navigation-item';
import '@nugudi/react-components-navigation-item/style.css';

// Basic navigation item
<NavigationItem>
  Profile Settings
</NavigationItem>

// With left icon
<NavigationItem leftIcon={<SettingsIcon />}>
  Settings
</NavigationItem>

// With both icons
<NavigationItem 
  leftIcon={<HomeIcon />}
  rightIcon={<ChevronRightIcon />}
>
  Home
</NavigationItem>

// Disabled state
<NavigationItem disabled>
  Unavailable Option
</NavigationItem>
```

## Sizes

Different sizes for various contexts:

```tsx
// Small size
<NavigationItem size="sm">
  Compact Item
</NavigationItem>

// Medium size (default)
<NavigationItem size="md">
  Standard Item
</NavigationItem>

// Large size
<NavigationItem size="lg">
  Large Item
</NavigationItem>

// Size comparison
import { VStack } from '@nugudi/react-components-layout';

<VStack gap={8}>
  <NavigationItem size="sm" leftIcon={<Icon />}>
    Small Navigation
  </NavigationItem>
  <NavigationItem size="md" leftIcon={<Icon />}>
    Medium Navigation
  </NavigationItem>
  <NavigationItem size="lg" leftIcon={<Icon />}>
    Large Navigation
  </NavigationItem>
</VStack>
```

## With Icons

Enhance navigation with visual indicators:

```tsx
// Settings menu with icons
<NavigationItem leftIcon={<UserIcon />} rightIcon={<ChevronIcon />}>
  Account Settings
</NavigationItem>

// Notification with badge
<NavigationItem 
  leftIcon={<BellIcon />}
  rightIcon={<Badge tone="negative">3</Badge>}
>
  Notifications
</NavigationItem>

// External link indicator
<NavigationItem 
  leftIcon={<LinkIcon />}
  rightIcon={<ExternalLinkIcon />}
>
  External Resource
</NavigationItem>

// Status indicator
<NavigationItem 
  leftIcon={<StatusIcon />}
  rightIcon={<span style={{ color: 'green' }}>●</span>}
>
  Online Status
</NavigationItem>
```

## With Next.js Link

Integration with Next.js routing:

```tsx
import Link from 'next/link';
import { NavigationItem } from '@nugudi/react-components-navigation-item';

// Internal navigation
<Link href="/dashboard" style={{ textDecoration: 'none' }}>
  <NavigationItem leftIcon={<DashboardIcon />}>
    Dashboard
  </NavigationItem>
</Link>

// With dynamic route
<Link href={`/user/${userId}`} style={{ textDecoration: 'none' }}>
  <NavigationItem 
    leftIcon={<UserIcon />}
    rightIcon={<ArrowRightIcon />}
  >
    User Profile
  </NavigationItem>
</Link>

// External link
<a href="https://example.com" target="_blank" style={{ textDecoration: 'none' }}>
  <NavigationItem 
    leftIcon={<GlobeIcon />}
    rightIcon={<ExternalIcon />}
  >
    Visit Website
  </NavigationItem>
</a>
```

## Sidebar Navigation

Complete sidebar menu implementation:

```tsx
import { NavigationItem } from '@nugudi/react-components-navigation-item';
import { VStack, Box, Title } from '@nugudi/react-components-layout';
import Link from 'next/link';

function Sidebar() {
  const menuItems = [
    { href: '/dashboard', icon: <DashboardIcon />, label: 'Dashboard' },
    { href: '/profile', icon: <UserIcon />, label: 'Profile' },
    { href: '/messages', icon: <MessageIcon />, label: 'Messages', badge: 5 },
    { href: '/settings', icon: <SettingsIcon />, label: 'Settings' },
    { href: '/help', icon: <HelpIcon />, label: 'Help' }
  ];

  return (
    <Box 
      width={280}
      height="100vh"
      backgroundColor="gray"
      backgroundColorShade={50}
      padding={16}
    >
      <Title fontSize="t3" marginBottom={24}>
        Navigation
      </Title>
      
      <VStack gap={4}>
        {menuItems.map((item) => (
          <Link 
            key={item.href}
            href={item.href}
            style={{ textDecoration: 'none' }}
          >
            <NavigationItem 
              leftIcon={item.icon}
              rightIcon={
                item.badge ? (
                  <Badge tone="negative" size="sm">
                    {item.badge}
                  </Badge>
                ) : (
                  <ChevronRightIcon />
                )
              }
            >
              {item.label}
            </NavigationItem>
          </Link>
        ))}
      </VStack>
    </Box>
  );
}
```

## Mobile Navigation

Mobile-friendly navigation menu:

```tsx
import { NavigationItem } from '@nugudi/react-components-navigation-item';
import { VStack, Divider } from '@nugudi/react-components-layout';

function MobileMenu({ isOpen, onClose }) {
  const menuItems = [
    { icon: <HomeIcon />, label: 'Home', onClick: () => navigate('/') },
    { icon: <SearchIcon />, label: 'Search', onClick: () => navigate('/search') },
    { icon: <CartIcon />, label: 'Cart', badge: 3, onClick: () => navigate('/cart') },
    { icon: <UserIcon />, label: 'Account', onClick: () => navigate('/account') },
    { divider: true },
    { icon: <LogoutIcon />, label: 'Sign Out', onClick: handleSignOut }
  ];

  return (
    <VStack gap={0}>
      {menuItems.map((item, index) => (
        item.divider ? (
          <Divider key={index} />
        ) : (
          <NavigationItem
            key={item.label}
            size="lg"
            leftIcon={item.icon}
            rightIcon={item.badge && (
              <Badge tone="negative">{item.badge}</Badge>
            )}
            onClick={() => {
              item.onClick();
              onClose();
            }}
          >
            {item.label}
          </NavigationItem>
        )
      ))}
    </VStack>
  );
}
```

## Settings Menu

Application settings interface:

```tsx
import { NavigationItem } from '@nugudi/react-components-navigation-item';
import { VStack, Title, Body } from '@nugudi/react-components-layout';

function SettingsMenu() {
  const settingsGroups = [
    {
      title: 'Account',
      items: [
        { icon: <UserIcon />, label: 'Profile', href: '/settings/profile' },
        { icon: <SecurityIcon />, label: 'Security', href: '/settings/security' },
        { icon: <BellIcon />, label: 'Notifications', href: '/settings/notifications' }
      ]
    },
    {
      title: 'Preferences',
      items: [
        { icon: <ThemeIcon />, label: 'Appearance', href: '/settings/appearance' },
        { icon: <LanguageIcon />, label: 'Language', href: '/settings/language' },
        { icon: <AccessibilityIcon />, label: 'Accessibility', href: '/settings/accessibility' }
      ]
    },
    {
      title: 'Support',
      items: [
        { icon: <HelpIcon />, label: 'Help Center', href: '/help' },
        { icon: <FeedbackIcon />, label: 'Send Feedback', href: '/feedback' },
        { icon: <InfoIcon />, label: 'About', href: '/about' }
      ]
    }
  ];

  return (
    <VStack gap={32}>
      {settingsGroups.map((group) => (
        <VStack key={group.title} gap={12}>
          <Title fontSize="t4">{group.title}</Title>
          <VStack gap={4}>
            {group.items.map((item) => (
              <Link 
                key={item.label}
                href={item.href}
                style={{ textDecoration: 'none' }}
              >
                <NavigationItem
                  leftIcon={item.icon}
                  rightIcon={<ChevronRightIcon />}
                >
                  {item.label}
                </NavigationItem>
              </Link>
            ))}
          </VStack>
        </VStack>
      ))}
    </VStack>
  );
}
```

## File Explorer

File and folder navigation:

```tsx
import { NavigationItem } from '@nugudi/react-components-navigation-item';
import { VStack } from '@nugudi/react-components-layout';

function FileExplorer({ files, folders }) {
  return (
    <VStack gap={2}>
      {folders.map((folder) => (
        <NavigationItem
          key={folder.id}
          leftIcon={<FolderIcon />}
          rightIcon={<ChevronRightIcon />}
          onClick={() => openFolder(folder.id)}
        >
          {folder.name}
        </NavigationItem>
      ))}
      
      {files.map((file) => (
        <NavigationItem
          key={file.id}
          leftIcon={<FileIcon />}
          onClick={() => openFile(file.id)}
        >
          {file.name}
        </NavigationItem>
      ))}
    </VStack>
  );
}
```

## Admin Dashboard

Administrative menu structure:

```tsx
import { NavigationItem } from '@nugudi/react-components-navigation-item';
import { VStack, Box, Title, Badge } from '@nugudi/react-components-layout';

function AdminNavigation() {
  const adminMenus = [
    { 
      icon: <DashboardIcon />, 
      label: 'Dashboard',
      href: '/admin'
    },
    { 
      icon: <UsersIcon />, 
      label: 'Users',
      href: '/admin/users',
      badge: '1.2k'
    },
    { 
      icon: <OrdersIcon />, 
      label: 'Orders',
      href: '/admin/orders',
      badge: '23 new'
    },
    { 
      icon: <ProductsIcon />, 
      label: 'Products',
      href: '/admin/products'
    },
    { 
      icon: <AnalyticsIcon />, 
      label: 'Analytics',
      href: '/admin/analytics'
    },
    { 
      icon: <SettingsIcon />, 
      label: 'Settings',
      href: '/admin/settings'
    }
  ];

  return (
    <Box 
      width={260}
      padding={20}
      backgroundColor="white"
      borderRight="1px solid #e0e0e0"
    >
      <Title fontSize="t3" marginBottom={24}>
        Admin Panel
      </Title>
      
      <VStack gap={4}>
        {adminMenus.map((menu) => (
          <Link 
            key={menu.href}
            href={menu.href}
            style={{ textDecoration: 'none' }}
          >
            <NavigationItem
              leftIcon={menu.icon}
              rightIcon={
                menu.badge ? (
                  <Badge tone="informative" size="sm">
                    {menu.badge}
                  </Badge>
                ) : undefined
              }
            >
              {menu.label}
            </NavigationItem>
          </Link>
        ))}
      </VStack>
    </Box>
  );
}
```

## Category List

E-commerce category navigation:

```tsx
import { NavigationItem } from '@nugudi/react-components-navigation-item';
import { VStack, Title } from '@nugudi/react-components-layout';

function CategoryList() {
  const categories = [
    { id: 1, name: 'Electronics', icon: <ElectronicsIcon />, count: 245 },
    { id: 2, name: 'Clothing', icon: <ClothingIcon />, count: 892 },
    { id: 3, name: 'Home & Garden', icon: <HomeIcon />, count: 456 },
    { id: 4, name: 'Sports', icon: <SportsIcon />, count: 123 },
    { id: 5, name: 'Books', icon: <BookIcon />, count: 678 },
    { id: 6, name: 'Toys', icon: <ToyIcon />, count: 234 }
  ];

  return (
    <VStack gap={16}>
      <Title fontSize="t3">Browse Categories</Title>
      
      <VStack gap={4}>
        {categories.map((category) => (
          <NavigationItem
            key={category.id}
            leftIcon={category.icon}
            rightIcon={
              <Body fontSize="b4" color="zinc" colorShade={500}>
                {category.count}
              </Body>
            }
            onClick={() => navigateToCategory(category.id)}
          >
            {category.name}
          </NavigationItem>
        ))}
      </VStack>
    </VStack>
  );
}
```

## Social Media Menu

Social platform navigation:

```tsx
import { NavigationItem } from '@nugudi/react-components-navigation-item';
import { VStack, HStack, Avatar } from '@nugudi/react-components-layout';

function SocialMenu({ user }) {
  return (
    <VStack gap={8}>
      <NavigationItem
        size="lg"
        leftIcon={<Avatar src={user.avatar} name={user.name} size="sm" />}
        rightIcon={<ChevronRightIcon />}
      >
        <VStack gap={2}>
          <Body fontSize="b2b">{user.name}</Body>
          <Body fontSize="b4" color="zinc" colorShade={500}>
            View Profile
          </Body>
        </VStack>
      </NavigationItem>
      
      <Divider />
      
      <VStack gap={4}>
        <NavigationItem leftIcon={<FeedIcon />}>
          News Feed
        </NavigationItem>
        <NavigationItem 
          leftIcon={<MessagesIcon />}
          rightIcon={<Badge tone="negative">5</Badge>}
        >
          Messages
        </NavigationItem>
        <NavigationItem leftIcon={<GroupsIcon />}>
          Groups
        </NavigationItem>
        <NavigationItem leftIcon={<EventsIcon />}>
          Events
        </NavigationItem>
        <NavigationItem leftIcon={<PhotosIcon />}>
          Photos
        </NavigationItem>
      </VStack>
      
      <Divider />
      
      <NavigationItem leftIcon={<LogoutIcon />}>
        Log Out
      </NavigationItem>
    </VStack>
  );
}
```

## Accordion Navigation

Expandable navigation sections:

```tsx
import { NavigationItem } from '@nugudi/react-components-navigation-item';
import { VStack, Box } from '@nugudi/react-components-layout';
import { useState } from 'react';

function AccordionNav() {
  const [expanded, setExpanded] = useState({});

  const sections = [
    {
      title: 'Products',
      icon: <ProductIcon />,
      items: ['All Products', 'Categories', 'Brands', 'New Arrivals']
    },
    {
      title: 'Orders',
      icon: <OrderIcon />,
      items: ['Recent Orders', 'Pending', 'Completed', 'Cancelled']
    },
    {
      title: 'Customers',
      icon: <CustomerIcon />,
      items: ['All Customers', 'VIP', 'New', 'Blocked']
    }
  ];

  return (
    <VStack gap={4}>
      {sections.map((section) => (
        <Box key={section.title}>
          <NavigationItem
            leftIcon={section.icon}
            rightIcon={
              expanded[section.title] ? <ChevronDownIcon /> : <ChevronRightIcon />
            }
            onClick={() => 
              setExpanded(prev => ({
                ...prev,
                [section.title]: !prev[section.title]
              }))
            }
          >
            {section.title}
          </NavigationItem>
          
          {expanded[section.title] && (
            <Box paddingLeft={40} marginTop={4}>
              <VStack gap={2}>
                {section.items.map((item) => (
                  <NavigationItem key={item} size="sm">
                    {item}
                  </NavigationItem>
                ))}
              </VStack>
            </Box>
          )}
        </Box>
      ))}
    </VStack>
  );
}
```

## Breadcrumb Navigation

Path-based navigation:

```tsx
import { NavigationItem } from '@nugudi/react-components-navigation-item';
import { HStack } from '@nugudi/react-components-layout';

function Breadcrumbs({ path }) {
  return (
    <HStack gap={8} align="center">
      {path.map((item, index) => (
        <HStack key={item.id} gap={8} align="center">
          <NavigationItem
            size="sm"
            onClick={() => navigateTo(item.href)}
            disabled={index === path.length - 1}
          >
            {item.label}
          </NavigationItem>
          {index < path.length - 1 && (
            <ChevronRightIcon size={16} />
          )}
        </HStack>
      ))}
    </HStack>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| children | `React.ReactNode` | - | **Required.** Content of the navigation item |
| leftIcon | `React.ReactNode` | - | Icon or element on the left side |
| rightIcon | `React.ReactNode` | - | Icon or element on the right side |
| disabled | `boolean` | `false` | Disabled state |
| size | `'sm' \| 'md' \| 'lg'` | `'md'` | Size variant |
| ...divProps | `Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>` | - | All other div attributes |

## Styling

The component uses CSS-in-JS with vanilla-extract. Import the styles:

```tsx
import '@nugudi/react-components-navigation-item/style.css';
```

## Accessibility

- Semantic HTML structure
- Keyboard navigation support
- Disabled state handling
- ARIA attributes support through div props
- Focus management for interactive items

## TypeScript

The component is fully typed. Import types as needed:

```tsx
import type { NavigationItemProps } from '@nugudi/react-components-navigation-item';

// Navigation menu structure
interface MenuItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
  badge?: number | string;
  disabled?: boolean;
}

// Using in component props
interface NavigationProps {
  items: MenuItem[];
  itemProps?: Omit<NavigationItemProps, 'children'>;
}
```

## Best Practices

1. **Use consistent icons**: Maintain visual consistency across navigation
2. **Indicate active state**: Show which item is currently selected
3. **Group related items**: Organize navigation logically
4. **Provide visual feedback**: Use hover and active states
5. **Consider mobile**: Ensure touch-friendly sizes on mobile
6. **Add badges for notifications**: Show counts or status indicators
7. **Use proper semantic markup**: Wrap in nav elements when appropriate
8. **Implement keyboard navigation**: Support arrow keys and tab navigation