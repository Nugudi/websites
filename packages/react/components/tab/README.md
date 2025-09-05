# Tab Component

A flexible and accessible tab component with compound pattern API, mobile swipe support, and automatic height adjustment. Perfect for organizing content into switchable panels, settings interfaces, and multi-section displays.

## Installation

```bash
pnpm add @nugudi/react-components-tab
```

## Basic Usage

```tsx
import { Tabs } from '@nugudi/react-components-tab';
import '@nugudi/react-components-tab/style.css';

// Basic tabs
<Tabs defaultValue='tab1'>
  <Tabs.List>
    <Tabs.Item value='tab1'>Profile</Tabs.Item>
    <Tabs.Item value='tab2'>Settings</Tabs.Item>
    <Tabs.Item value='tab3'>Privacy</Tabs.Item>
  </Tabs.List>

  <Tabs.Panel value='tab1'>Profile content here</Tabs.Panel>
  <Tabs.Panel value='tab2'>Settings content here</Tabs.Panel>
  <Tabs.Panel value='tab3'>Privacy content here</Tabs.Panel>
</Tabs>;
```

## Compound Pattern

Using the compound component pattern for cleaner API:

```tsx
import { Tabs } from '@nugudi/react-components-tab';

function CompoundTabs() {
  return (
    <Tabs defaultValue='overview'>
      <Tabs.List>
        <Tabs.Item value='overview'>Overview</Tabs.Item>
        <Tabs.Item value='features'>Features</Tabs.Item>
        <Tabs.Item value='pricing'>Pricing</Tabs.Item>
        <Tabs.Item value='support' disabled>
          Support
        </Tabs.Item>
      </Tabs.List>

      <Tabs.Panel value='overview'>
        <h3>Product Overview</h3>
        <p>Learn about our product and its capabilities.</p>
      </Tabs.Panel>

      <Tabs.Panel value='features'>
        <h3>Key Features</h3>
        <ul>
          <li>Feature 1</li>
          <li>Feature 2</li>
          <li>Feature 3</li>
        </ul>
      </Tabs.Panel>

      <Tabs.Panel value='pricing'>
        <h3>Pricing Plans</h3>
        <p>Choose the plan that works for you.</p>
      </Tabs.Panel>

      <Tabs.Panel value='support'>
        <h3>Support</h3>
        <p>Support information coming soon.</p>
      </Tabs.Panel>
    </Tabs>
  );
}
```

## With Disabled Tabs

Disable specific tabs when needed:

```tsx
<Tabs defaultValue='active'>
  <Tabs.List>
    <Tabs.Item value='active'>Active Tab</Tabs.Item>
    <Tabs.Item value='disabled1' disabled>
      Coming Soon
    </Tabs.Item>
    <Tabs.Item value='disabled2' disabled>
      Not Available
    </Tabs.Item>
    <Tabs.Item value='another'>Another Tab</Tabs.Item>
  </Tabs.List>

  <Tabs.Panel value='active'>This tab is active and functional</Tabs.Panel>
  <Tabs.Panel value='another'>This tab is also available</Tabs.Panel>
</Tabs>
```

## Mobile Swipe Support

Built-in mobile swipe gestures for natural navigation:

```tsx
import { Tabs } from '@nugudi/react-components-tab';
import { VStack, Title, Body } from '@nugudi/react-components-layout';

function MobileFriendlyTabs() {
  return (
    <Tabs defaultValue='tab1'>
      <Tabs.List>
        <Tabs.Item value='tab1'>Photos</Tabs.Item>
        <Tabs.Item value='tab2'>Videos</Tabs.Item>
        <Tabs.Item value='tab3'>Albums</Tabs.Item>
      </Tabs.List>

      <Tabs.Panel value='tab1'>
        <VStack gap={16}>
          <Title fontSize='t3'>Photos</Title>
          <Body fontSize='b3'>Swipe left or right to navigate tabs</Body>
          {/* Photo grid here */}
        </VStack>
      </Tabs.Panel>

      <Tabs.Panel value='tab2'>
        <VStack gap={16}>
          <Title fontSize='t3'>Videos</Title>
          <Body fontSize='b3'>Your video collection</Body>
          {/* Video list here */}
        </VStack>
      </Tabs.Panel>

      <Tabs.Panel value='tab3'>
        <VStack gap={16}>
          <Title fontSize='t3'>Albums</Title>
          <Body fontSize='b3'>Organized collections</Body>
          {/* Album grid here */}
        </VStack>
      </Tabs.Panel>
    </Tabs>
  );
}
```

## Product Details Page

E-commerce product information tabs:

```tsx
import { Tabs } from '@nugudi/react-components-tab';
import {
  VStack,
  HStack,
  Title,
  Body,
  Badge,
} from '@nugudi/react-components-layout';

function ProductDetails({ product }) {
  return (
    <Tabs defaultValue='description'>
      <Tabs.List>
        <Tabs.Item value='description'>Description</Tabs.Item>
        <Tabs.Item value='specifications'>Specs</Tabs.Item>
        <Tabs.Item value='reviews'>
          <HStack gap={4}>
            Reviews
            <Badge tone='informative' size='sm'>
              {product.reviewCount}
            </Badge>
          </HStack>
        </Tabs.Item>
        <Tabs.Item value='shipping'>Shipping</Tabs.Item>
      </Tabs.List>

      <Tabs.Panel value='description'>
        <VStack gap={16} padding={20}>
          <Title fontSize='t3'>About this product</Title>
          <Body fontSize='b3'>{product.description}</Body>

          <Title fontSize='t4'>Key Features</Title>
          <ul>
            {product.features.map((feature, i) => (
              <li key={i}>{feature}</li>
            ))}
          </ul>
        </VStack>
      </Tabs.Panel>

      <Tabs.Panel value='specifications'>
        <VStack gap={12} padding={20}>
          <Title fontSize='t3'>Technical Specifications</Title>
          {product.specifications.map((spec) => (
            <HStack key={spec.name} justify='space-between'>
              <Body fontSize='b3b'>{spec.name}</Body>
              <Body fontSize='b3'>{spec.value}</Body>
            </HStack>
          ))}
        </VStack>
      </Tabs.Panel>

      <Tabs.Panel value='reviews'>
        <VStack gap={16} padding={20}>
          <Title fontSize='t3'>Customer Reviews</Title>
          {/* Review components here */}
        </VStack>
      </Tabs.Panel>

      <Tabs.Panel value='shipping'>
        <VStack gap={12} padding={20}>
          <Title fontSize='t3'>Shipping Information</Title>
          <Body fontSize='b3'>{product.shippingInfo}</Body>
        </VStack>
      </Tabs.Panel>
    </Tabs>
  );
}
```

## User Profile Tabs

Social media or user profile sections:

```tsx
import { Tabs } from '@nugudi/react-components-tab';
import { VStack, Grid, Title, Body } from '@nugudi/react-components-layout';

function UserProfile({ user }) {
  return (
    <Tabs defaultValue='posts'>
      <Tabs.List>
        <Tabs.Item value='posts'>Posts</Tabs.Item>
        <Tabs.Item value='about'>About</Tabs.Item>
        <Tabs.Item value='friends'>Friends</Tabs.Item>
        <Tabs.Item value='photos'>Photos</Tabs.Item>
      </Tabs.List>

      <Tabs.Panel value='posts'>
        <VStack gap={16} padding={20}>
          {user.posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </VStack>
      </Tabs.Panel>

      <Tabs.Panel value='about'>
        <VStack gap={20} padding={20}>
          <Section title='Bio'>
            <Body fontSize='b3'>{user.bio}</Body>
          </Section>

          <Section title='Work'>
            <Body fontSize='b3'>{user.work}</Body>
          </Section>

          <Section title='Education'>
            <Body fontSize='b3'>{user.education}</Body>
          </Section>
        </VStack>
      </Tabs.Panel>

      <Tabs.Panel value='friends'>
        <Grid
          templateColumns='repeat(auto-fill, minmax(100px, 1fr))'
          gap={12}
          padding={20}
        >
          {user.friends.map((friend) => (
            <FriendCard key={friend.id} friend={friend} />
          ))}
        </Grid>
      </Tabs.Panel>

      <Tabs.Panel value='photos'>
        <Grid
          templateColumns='repeat(auto-fill, minmax(150px, 1fr))'
          gap={8}
          padding={20}
        >
          {user.photos.map((photo) => (
            <img key={photo.id} src={photo.url} alt='' />
          ))}
        </Grid>
      </Tabs.Panel>
    </Tabs>
  );
}
```

## Settings Interface

Application settings organized by category:

```tsx
import { Tabs } from '@nugudi/react-components-tab';
import {
  VStack,
  HStack,
  Title,
  Body,
  Switch,
} from '@nugudi/react-components-layout';

function Settings() {
  return (
    <Tabs defaultValue='general'>
      <Tabs.List>
        <Tabs.Item value='general'>General</Tabs.Item>
        <Tabs.Item value='notifications'>Notifications</Tabs.Item>
        <Tabs.Item value='privacy'>Privacy</Tabs.Item>
        <Tabs.Item value='security'>Security</Tabs.Item>
      </Tabs.List>

      <Tabs.Panel value='general'>
        <VStack gap={16} padding={20}>
          <Title fontSize='t3'>General Settings</Title>

          <HStack justify='space-between'>
            <Body fontSize='b3'>Language</Body>
            <select>
              <option>English</option>
              <option>한국어</option>
            </select>
          </HStack>

          <HStack justify='space-between'>
            <Body fontSize='b3'>Theme</Body>
            <select>
              <option>Light</option>
              <option>Dark</option>
              <option>Auto</option>
            </select>
          </HStack>
        </VStack>
      </Tabs.Panel>

      <Tabs.Panel value='notifications'>
        <VStack gap={16} padding={20}>
          <Title fontSize='t3'>Notification Preferences</Title>

          <HStack justify='space-between'>
            <Body fontSize='b3'>Email Notifications</Body>
            <Switch />
          </HStack>

          <HStack justify='space-between'>
            <Body fontSize='b3'>Push Notifications</Body>
            <Switch />
          </HStack>

          <HStack justify='space-between'>
            <Body fontSize='b3'>SMS Notifications</Body>
            <Switch />
          </HStack>
        </VStack>
      </Tabs.Panel>

      <Tabs.Panel value='privacy'>
        <VStack gap={16} padding={20}>
          <Title fontSize='t3'>Privacy Settings</Title>

          <HStack justify='space-between'>
            <Body fontSize='b3'>Profile Visibility</Body>
            <select>
              <option>Public</option>
              <option>Friends Only</option>
              <option>Private</option>
            </select>
          </HStack>

          <HStack justify='space-between'>
            <Body fontSize='b3'>Show Online Status</Body>
            <Switch />
          </HStack>
        </VStack>
      </Tabs.Panel>

      <Tabs.Panel value='security'>
        <VStack gap={16} padding={20}>
          <Title fontSize='t3'>Security Settings</Title>

          <Button variant='brand'>Change Password</Button>
          <Button variant='neutral'>Enable Two-Factor Authentication</Button>
          <Button variant='neutral'>Manage Sessions</Button>
        </VStack>
      </Tabs.Panel>
    </Tabs>
  );
}
```

## Dashboard Analytics

Multi-metric dashboard views:

```tsx
import { Tabs } from '@nugudi/react-components-tab';
import {
  VStack,
  Grid,
  Title,
  Body,
  Box,
} from '@nugudi/react-components-layout';

function AnalyticsDashboard() {
  return (
    <Tabs defaultValue='overview'>
      <Tabs.List>
        <Tabs.Item value='overview'>Overview</Tabs.Item>
        <Tabs.Item value='traffic'>Traffic</Tabs.Item>
        <Tabs.Item value='revenue'>Revenue</Tabs.Item>
        <Tabs.Item value='users'>Users</Tabs.Item>
      </Tabs.List>

      <Tabs.Panel value='overview'>
        <Grid
          templateColumns='repeat(auto-fit, minmax(250px, 1fr))'
          gap={20}
          padding={20}
        >
          <MetricCard title='Total Revenue' value='$124,500' change='+12%' />
          <MetricCard title='Active Users' value='8,421' change='+5%' />
          <MetricCard title='Conversion Rate' value='3.2%' change='-0.5%' />
          <MetricCard title='Avg Order Value' value='$87' change='+8%' />
        </Grid>
      </Tabs.Panel>

      <Tabs.Panel value='traffic'>
        <VStack gap={20} padding={20}>
          <Title fontSize='t3'>Traffic Analytics</Title>
          {/* Traffic charts and metrics */}
        </VStack>
      </Tabs.Panel>

      <Tabs.Panel value='revenue'>
        <VStack gap={20} padding={20}>
          <Title fontSize='t3'>Revenue Analytics</Title>
          {/* Revenue charts and breakdown */}
        </VStack>
      </Tabs.Panel>

      <Tabs.Panel value='users'>
        <VStack gap={20} padding={20}>
          <Title fontSize='t3'>User Analytics</Title>
          {/* User demographics and behavior */}
        </VStack>
      </Tabs.Panel>
    </Tabs>
  );
}
```

## Documentation Tabs

API or documentation organization:

```tsx
import { Tabs } from '@nugudi/react-components-tab';
import { VStack, Title, Body, Box } from '@nugudi/react-components-layout';

function Documentation() {
  return (
    <Tabs defaultValue='installation'>
      <Tabs.List>
        <Tabs.Item value='installation'>Installation</Tabs.Item>
        <Tabs.Item value='usage'>Usage</Tabs.Item>
        <Tabs.Item value='api'>API</Tabs.Item>
        <Tabs.Item value='examples'>Examples</Tabs.Item>
      </Tabs.List>

      <Tabs.Panel value='installation'>
        <VStack gap={16} padding={20}>
          <Title fontSize='t3'>Installation</Title>

          <Box padding={12} background='zinc' borderRadius='md'>
            <code>npm install @nugudi/react-components-tab</code>
          </Box>

          <Body fontSize='b3'>
            Import the component and styles in your application.
          </Body>
        </VStack>
      </Tabs.Panel>

      <Tabs.Panel value='usage'>
        <VStack gap={16} padding={20}>
          <Title fontSize='t3'>Basic Usage</Title>

          <CodeBlock language='tsx'>
            {`<Tabs defaultValue="tab1">
  <Tabs.List>
    <Tabs.Item value="tab1">Tab 1</Tabs.Item>
  </Tabs.List>
  <Tabs.Panel value="tab1">Content</Tabs.Panel>
</Tabs>`}
          </CodeBlock>
        </VStack>
      </Tabs.Panel>

      <Tabs.Panel value='api'>
        <VStack gap={16} padding={20}>
          <Title fontSize='t3'>API Reference</Title>
          {/* API documentation */}
        </VStack>
      </Tabs.Panel>

      <Tabs.Panel value='examples'>
        <VStack gap={16} padding={20}>
          <Title fontSize='t3'>Examples</Title>
          {/* Code examples */}
        </VStack>
      </Tabs.Panel>
    </Tabs>
  );
}
```

## Restaurant Menu Tabs

Restaurant or food service menu categories:

```tsx
import { Tabs } from '@nugudi/react-components-tab';
import {
  VStack,
  Grid,
  Title,
  Body,
  Badge,
} from '@nugudi/react-components-layout';

function RestaurantMenu() {
  return (
    <Tabs defaultValue='appetizers'>
      <Tabs.List>
        <Tabs.Item value='appetizers'>Appetizers</Tabs.Item>
        <Tabs.Item value='mains'>Main Courses</Tabs.Item>
        <Tabs.Item value='desserts'>Desserts</Tabs.Item>
        <Tabs.Item value='beverages'>Beverages</Tabs.Item>
      </Tabs.List>

      <Tabs.Panel value='appetizers'>
        <VStack gap={16} padding={20}>
          {appetizers.map((item) => (
            <HStack key={item.id} justify='space-between'>
              <VStack gap={4}>
                <HStack gap={8}>
                  <Body fontSize='b2b'>{item.name}</Body>
                  {item.isVegetarian && (
                    <Badge tone='positive' size='sm'>
                      Veg
                    </Badge>
                  )}
                </HStack>
                <Body fontSize='b4' color='zinc' colorShade={500}>
                  {item.description}
                </Body>
              </VStack>
              <Body fontSize='b2b'>${item.price}</Body>
            </HStack>
          ))}
        </VStack>
      </Tabs.Panel>

      {/* Other panels... */}
    </Tabs>
  );
}
```

## Course Content Tabs

Educational course structure:

```tsx
import { Tabs } from '@nugudi/react-components-tab';
import {
  VStack,
  HStack,
  Title,
  Body,
  Badge,
  Button,
} from '@nugudi/react-components-layout';

function CourseContent({ course }) {
  return (
    <Tabs defaultValue='overview'>
      <Tabs.List>
        <Tabs.Item value='overview'>Overview</Tabs.Item>
        <Tabs.Item value='curriculum'>Curriculum</Tabs.Item>
        <Tabs.Item value='instructor'>Instructor</Tabs.Item>
        <Tabs.Item value='reviews'>Reviews</Tabs.Item>
      </Tabs.List>

      <Tabs.Panel value='overview'>
        <VStack gap={20} padding={20}>
          <Title fontSize='t2'>{course.title}</Title>
          <Body fontSize='b3'>{course.description}</Body>

          <HStack gap={16}>
            <Badge tone='informative'>{course.level}</Badge>
            <Body fontSize='b4'>{course.duration}</Body>
            <Body fontSize='b4'>{course.students} students</Body>
          </HStack>

          <Button variant='brand' size='lg'>
            Enroll Now
          </Button>
        </VStack>
      </Tabs.Panel>

      <Tabs.Panel value='curriculum'>
        <VStack gap={16} padding={20}>
          <Title fontSize='t3'>Course Curriculum</Title>
          {course.modules.map((module, index) => (
            <Box
              key={index}
              padding={16}
              background='zinc'
              borderRadius='md'
            >
              <HStack justify='space-between'>
                <Body fontSize='b2b'>
                  Module {index + 1}: {module.title}
                </Body>
                <Body fontSize='b4'>{module.duration}</Body>
              </HStack>
            </Box>
          ))}
        </VStack>
      </Tabs.Panel>

      {/* Other panels... */}
    </Tabs>
  );
}
```

## Dynamic Height Adjustment

Tabs automatically adjust height based on content:

```tsx
import { Tabs } from '@nugudi/react-components-tab';

function DynamicHeightTabs() {
  return (
    <Tabs defaultValue='short'>
      <Tabs.List>
        <Tabs.Item value='short'>Short Content</Tabs.Item>
        <Tabs.Item value='medium'>Medium Content</Tabs.Item>
        <Tabs.Item value='tall'>Tall Content</Tabs.Item>
      </Tabs.List>

      <Tabs.Panel value='short'>
        <div style={{ height: '100px' }}>Short content area</div>
      </Tabs.Panel>

      <Tabs.Panel value='medium'>
        <div style={{ height: '300px' }}>Medium height content area</div>
      </Tabs.Panel>

      <Tabs.Panel value='tall'>
        <div style={{ height: '600px' }}>
          Tall content area - tab container adjusts automatically
        </div>
      </Tabs.Panel>
    </Tabs>
  );
}
```

## Props

### Tabs Props

| Prop         | Type                  | Default | Description                                |
| ------------ | --------------------- | ------- | ------------------------------------------ |
| children     | `React.ReactNode`     | -       | **Required.** Tab components (List, Panel) |
| defaultValue | `string`              | -       | Initially selected tab value               |
| className    | `string`              | -       | Additional CSS class                       |
| style        | `React.CSSProperties` | -       | Inline styles                              |

### Tabs.List Props

| Prop      | Type              | Default | Description                       |
| --------- | ----------------- | ------- | --------------------------------- |
| children  | `React.ReactNode` | -       | **Required.** Tab.Item components |
| className | `string`          | -       | Additional CSS class              |

### Tabs.Item Props

| Prop      | Type              | Default | Description                         |
| --------- | ----------------- | ------- | ----------------------------------- |
| value     | `string`          | -       | **Required.** Unique tab identifier |
| children  | `React.ReactNode` | -       | **Required.** Tab label content     |
| disabled  | `boolean`         | `false` | Disabled state                      |
| className | `string`          | -       | Additional CSS class                |
| onClick   | `() => void`      | -       | Click handler                       |

### Tabs.Panel Props

| Prop      | Type              | Default | Description                           |
| --------- | ----------------- | ------- | ------------------------------------- |
| value     | `string`          | -       | **Required.** Tab identifier to match |
| children  | `React.ReactNode` | -       | **Required.** Panel content           |
| className | `string`          | -       | Additional CSS class                  |

## Features

- ✨ Compound component pattern for clean API
- 📱 Mobile swipe support
- 📏 Automatic height adjustment
- ♿ Full accessibility (WAI-ARIA compliant)
- ⌨️ Keyboard navigation (arrow keys)
- 🎨 Customizable styling
- 🚫 Disabled tab support
- 🔄 Smooth transitions

## Styling

The component uses CSS-in-JS with vanilla-extract. Import the styles:

```tsx
import '@nugudi/react-components-tab/style.css';
```

## Accessibility

The component follows WAI-ARIA guidelines:

- Uses proper ARIA roles: `tablist`, `tab`, `tabpanel`
- Manages ARIA states: `aria-selected`, `aria-disabled`, `aria-controls`, `aria-labelledby`
- Keyboard navigation with arrow keys
- Focus management
- Screen reader announcements

## Keyboard Navigation

- **Tab**: Move focus to next element
- **Shift + Tab**: Move focus to previous element
- **Arrow Left/Right**: Navigate between tabs
- **Home**: Go to first tab
- **End**: Go to last tab
- **Enter/Space**: Select focused tab

## TypeScript

The component is fully typed. Import types as needed:

```tsx
import type {
  TabsProps,
  TabListProps,
  TabProps,
  TabPanelProps,
} from '@nugudi/react-components-tab';

// Custom tab configuration
interface TabConfig {
  value: string;
  label: string;
  content: React.ReactNode;
  disabled?: boolean;
}

// Using in component props
interface TabSectionProps {
  tabs: TabConfig[];
  defaultTab?: string;
}
```

## Best Practices

1. **Use descriptive values**: Tab values should be meaningful identifiers
2. **Provide default selection**: Always set a defaultValue
3. **Group related content**: Use tabs for logically related sections
4. **Limit tab count**: Avoid more than 5-7 tabs for better UX
5. **Consider mobile**: Test swipe gestures on mobile devices
6. **Handle disabled states**: Clearly indicate unavailable tabs
7. **Maintain consistent height**: Consider content height variations
8. **Add loading states**: Show loading indicators for async content
