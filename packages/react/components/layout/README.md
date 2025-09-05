# Layout & Typography Components

A comprehensive set of layout and typography components for building consistent and responsive user interfaces. This package includes both structural layout components (Box, Flex, Grid) and typographic components (Heading, Title, Body, etc.).

## Installation

```bash
pnpm add @nugudi/react-components-layout
```

## Layout Components

### Box

The fundamental building block that renders a customizable container element.

```tsx
import { Box } from '@nugudi/react-components-layout';

// Basic box
<Box>Content</Box>

// With padding and margin (direct pixel values)
<Box padding={20} margin={16}>
  Padded content
</Box>

// With specific directional spacing
<Box paddingTop={24} paddingBottom={24} marginX={16}>
  Content with vertical padding and horizontal margin
</Box>

// With size constraints
<Box width={300} height={200} maxWidth={500}>
  Fixed dimensions
</Box>

// With background and border
<Box 
  backgroundColor="gray"
  borderRadius="lg"
  padding={16}
>
  Styled box
</Box>

// As different HTML element
<Box as="section" id="main-content">
  <Box as="article">Article content</Box>
</Box>
```

### Flex

A Box component with flexbox layout properties.

```tsx
import { Flex } from '@nugudi/react-components-layout';

// Basic flex container
<Flex>
  <div>Item 1</div>
  <div>Item 2</div>
</Flex>

// With direction and alignment
<Flex direction="column" align="center" justify="space-between">
  <div>Top</div>
  <div>Middle</div>
  <div>Bottom</div>
</Flex>

// With gap between items
<Flex gap={16} wrap="wrap">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</Flex>

// Row with spacing
<Flex 
  direction="row"
  justify="space-between"
  align="center"
  padding={20}
  gap={12}
>
  <div>Left</div>
  <div>Center</div>
  <div>Right</div>
</Flex>
```

### VStack (Vertical Stack)

Pre-configured Flex component for vertical layouts.

```tsx
import { VStack } from '@nugudi/react-components-layout';

// Basic vertical stack
<VStack>
  <div>First</div>
  <div>Second</div>
  <div>Third</div>
</VStack>

// With gap between items
<VStack gap={16}>
  <h2>Title</h2>
  <p>Paragraph</p>
  <button>Action</button>
</VStack>

// With alignment
<VStack gap={20} align="center">
  <img src="logo.png" alt="Logo" />
  <h1>Welcome</h1>
  <p>Description text</p>
</VStack>

// Complex form layout
<VStack gap={24} width="full">
  <VStack gap={8}>
    <label>Name</label>
    <input type="text" />
  </VStack>
  <VStack gap={8}>
    <label>Email</label>
    <input type="email" />
  </VStack>
  <button>Submit</button>
</VStack>
```

### HStack (Horizontal Stack)

Pre-configured Flex component for horizontal layouts.

```tsx
import { HStack } from '@nugudi/react-components-layout';

// Basic horizontal stack
<HStack>
  <button>Save</button>
  <button>Cancel</button>
</HStack>

// With gap
<HStack gap={12}>
  <span>Label 1</span>
  <span>Label 2</span>
  <span>Label 3</span>
</HStack>

// With alignment and justification
<HStack gap={16} align="center" justify="space-between">
  <div>Logo</div>
  <nav>Navigation</nav>
  <button>Menu</button>
</HStack>

// Wrapping items
<HStack gap={8} wrap="wrap">
  {tags.map(tag => (
    <span key={tag}>{tag}</span>
  ))}
</HStack>
```

### Stack

Generic stack component with configurable direction.

```tsx
import { Stack } from '@nugudi/react-components-layout';

// Horizontal stack (default)
<Stack gap={16}>
  <div>Item 1</div>
  <div>Item 2</div>
</Stack>

// Vertical stack
<Stack direction="column" gap={20}>
  <div>Item 1</div>
  <div>Item 2</div>
</Stack>

// Responsive direction
<Stack 
  direction={{ base: "column", md: "row" }} 
  gap={16}
>
  <div>Responsive Item 1</div>
  <div>Responsive Item 2</div>
</Stack>
```

### Grid

CSS Grid layout component for complex layouts.

```tsx
import { Grid, GridItem } from '@nugudi/react-components-layout';

// Basic grid
<Grid templateColumns="repeat(3, 1fr)" gap={16}>
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</Grid>

// With specific column and row gaps
<Grid 
  templateColumns="repeat(2, 1fr)"
  columnGap={20}
  rowGap={12}
>
  <div>Cell 1</div>
  <div>Cell 2</div>
  <div>Cell 3</div>
  <div>Cell 4</div>
</Grid>

// Responsive grid
<Grid
  templateColumns={{ 
    base: "1fr", 
    md: "repeat(2, 1fr)", 
    lg: "repeat(3, 1fr)" 
  }}
  gap={16}
>
  <div>Responsive 1</div>
  <div>Responsive 2</div>
  <div>Responsive 3</div>
</Grid>

// With GridItem for spanning
<Grid templateColumns="repeat(4, 1fr)" gap={16}>
  <GridItem colSpan={2}>Wide item</GridItem>
  <GridItem>Normal</GridItem>
  <GridItem>Normal</GridItem>
  <GridItem colSpan={4}>Full width</GridItem>
  <GridItem rowSpan={2}>Tall item</GridItem>
  <GridItem>Normal</GridItem>
</Grid>

// Grid template areas
<Grid
  templateAreas={`
    "header header"
    "sidebar main"
    "footer footer"
  `}
  templateColumns="200px 1fr"
  gap={20}
>
  <GridItem area="header">Header</GridItem>
  <GridItem area="sidebar">Sidebar</GridItem>
  <GridItem area="main">Main Content</GridItem>
  <GridItem area="footer">Footer</GridItem>
</Grid>
```

### Divider

Visual separator between content sections.

```tsx
import { Divider } from '@nugudi/react-components-layout';

// Horizontal divider (default)
<VStack gap={16}>
  <div>Section 1</div>
  <Divider />
  <div>Section 2</div>
</VStack>

// Vertical divider
<HStack gap={16}>
  <div>Left</div>
  <Divider orientation="vertical" />
  <div>Right</div>
</HStack>

// With custom color
<Divider color="gray" />

// With different styles
<Divider variant="dashed" />
<Divider variant="dotted" />
<Divider variant="double" />

// With custom size (thickness)
<Divider size={2} />
<Divider size={4} color="blue" />
```

### List Components

Semantic list components for organized content.

```tsx
import { List, ListItem, OrderedList, UnorderedList } from '@nugudi/react-components-layout';

// Unordered list
<UnorderedList gap={8}>
  <ListItem>First item</ListItem>
  <ListItem>Second item</ListItem>
  <ListItem>Third item</ListItem>
</UnorderedList>

// Ordered list
<OrderedList gap={12}>
  <ListItem>Step one</ListItem>
  <ListItem>Step two</ListItem>
  <ListItem>Step three</ListItem>
</OrderedList>

// Generic list (no bullets/numbers)
<List gap={16}>
  <ListItem>
    <HStack gap={8}>
      <CheckIcon />
      <span>Completed task</span>
    </HStack>
  </ListItem>
  <ListItem>
    <HStack gap={8}>
      <CloseIcon />
      <span>Incomplete task</span>
    </HStack>
  </ListItem>
</List>
```

## Typography Components

### Logo

For brand names and app titles.

```tsx
import { Logo } from '@nugudi/react-components-layout';

// Large logo
<Logo fontSize="l1">NUGUDI</Logo>

// Small logo
<Logo fontSize="l2">nugudi</Logo>

// As h1 element
<Logo fontSize="l1" as="h1">Brand Name</Logo>

// With color
<Logo fontSize="l1" color="blue" colorShade={500}>
  Colored Brand
</Logo>
```

### Heading

Main page headings.

```tsx
import { Heading } from '@nugudi/react-components-layout';

// h1 heading (default)
<Heading fontSize="h1">Page Title</Heading>

// As different element
<Heading fontSize="h1" as="h2">Section Heading</Heading>

// With color
<Heading fontSize="h1" color="gray" colorShade={900}>
  Dark Heading
</Heading>
```

### Title

Section and subsection titles.

```tsx
import { Title } from '@nugudi/react-components-layout';

// Different sizes
<Title fontSize="t1" as="h2">Major Section</Title>
<Title fontSize="t2" as="h3">Subsection</Title>
<Title fontSize="t3" as="h4">Minor Section</Title>

// With styling
<Title fontSize="t2" color="blue" colorShade={600}>
  Colored Title
</Title>
```

### Body

Body text and paragraphs.

```tsx
import { Body } from '@nugudi/react-components-layout';

// Different sizes
<Body fontSize="b1">Large body text for important content</Body>
<Body fontSize="b2">Regular body text for main content</Body>
<Body fontSize="b3">Small body text for secondary content</Body>
<Body fontSize="b3b">Small bold text for emphasis</Body>
<Body fontSize="b4">Tiny text for captions</Body>
<Body fontSize="b4b">Tiny bold text for labels</Body>

// As different elements
<Body fontSize="b2" as="p">
  This is a paragraph of body text.
</Body>

<Body fontSize="b3" as="span" color="gray" colorShade={600}>
  Inline text with color
</Body>
```

### Emphasis

Small text for captions and metadata.

```tsx
import { Emphasis } from '@nugudi/react-components-layout';

// Different sizes
<Emphasis fontSize="e1">Caption text</Emphasis>
<Emphasis fontSize="e2">Fine print</Emphasis>

// Common use cases
<Emphasis fontSize="e1" color="gray" colorShade={500}>
  Last updated: 2024-01-15
</Emphasis>

<Emphasis fontSize="e2" as="small">
  © 2024 Your Company
</Emphasis>
```

## Common Layout Patterns

### Card Layout

```tsx
import { Box, VStack, HStack, Title, Body, Emphasis } from '@nugudi/react-components-layout';

function Card() {
  return (
    <Box padding={24} borderRadius="lg" backgroundColor="white">
      <VStack gap={16}>
        <Title fontSize="t2">Card Title</Title>
        <Body fontSize="b2">
          This is the main content of the card. It can contain multiple 
          paragraphs and other elements.
        </Body>
        <HStack gap={8} justify="space-between">
          <Emphasis fontSize="e1" color="gray" colorShade={500}>
            2 hours ago
          </Emphasis>
          <Body fontSize="b4b" color="blue" colorShade={600}>
            Read more
          </Body>
        </HStack>
      </VStack>
    </Box>
  );
}
```

### Page Layout

```tsx
import { VStack, HStack, Box, Heading, Title, Body } from '@nugudi/react-components-layout';

function PageLayout() {
  return (
    <VStack gap={32} padding={24}>
      {/* Header */}
      <HStack justify="space-between" align="center">
        <Logo fontSize="l2">App Name</Logo>
        <HStack gap={16}>
          <Body fontSize="b3">Home</Body>
          <Body fontSize="b3">About</Body>
          <Body fontSize="b3">Contact</Body>
        </HStack>
      </HStack>

      {/* Main Content */}
      <VStack gap={24}>
        <Heading fontSize="h1">Welcome</Heading>
        
        <Grid templateColumns="2fr 1fr" gap={24}>
          <VStack gap={16}>
            <Title fontSize="t2" as="h2">Main Content</Title>
            <Body fontSize="b2">Content goes here...</Body>
          </VStack>
          
          <VStack gap={16}>
            <Title fontSize="t3" as="h3">Sidebar</Title>
            <Body fontSize="b3">Sidebar content...</Body>
          </VStack>
        </Grid>
      </VStack>

      {/* Footer */}
      <Divider />
      <Emphasis fontSize="e1" color="gray" colorShade={500}>
        © 2024 Company Name
      </Emphasis>
    </VStack>
  );
}
```

### Form Layout

```tsx
import { VStack, HStack, Box, Title, Body, Emphasis } from '@nugudi/react-components-layout';

function FormLayout() {
  return (
    <VStack gap={24} width="full" maxWidth={500}>
      <Title fontSize="t2">Create Account</Title>
      
      <VStack gap={16}>
        <VStack gap={4}>
          <Body fontSize="b3b">Name</Body>
          <input type="text" />
          <Emphasis fontSize="e1" color="gray" colorShade={500}>
            Enter your full name
          </Emphasis>
        </VStack>

        <VStack gap={4}>
          <Body fontSize="b3b">Email</Body>
          <input type="email" />
          <Emphasis fontSize="e1" color="gray" colorShade={500}>
            We'll never share your email
          </Emphasis>
        </VStack>

        <VStack gap={4}>
          <Body fontSize="b3b">Password</Body>
          <input type="password" />
        </VStack>
      </VStack>

      <HStack gap={12} justify="flex-end">
        <button>Cancel</button>
        <button>Submit</button>
      </HStack>
    </VStack>
  );
}
```

## Spacing System

All layout components accept direct pixel values for spacing:

```tsx
// Padding and margin accept pixel values
<Box padding={20} margin={16} />
<Box p={10} m={20} />

// Directional spacing
<Box paddingTop={24} paddingBottom={24} />
<Box pt={24} pb={24} />
<Box paddingX={16} paddingY={24} />
<Box pX={16} pY={24} />

// Gap in flex/grid
<Flex gap={16} />
<VStack gap={24} />
<Grid gap={20} columnGap={16} rowGap={24} />
```

## Size Keywords

Special keywords for common size values:

```tsx
// Width/Height keywords
<Box width="full" />     // 100%
<Box width="screen" />   // 100vw
<Box width="auto" />     // auto
<Box width="min" />      // min-content
<Box width="max" />      // max-content
<Box width="fit" />      // fit-content

// Also works with numbers and strings
<Box width={300} />      // 300px
<Box width="50%" />      // 50%
<Box width="100vh" />    // viewport units
```

## TypeScript

All components are fully typed. Import types as needed:

```tsx
import type {
  BoxProps,
  FlexProps,
  GridProps,
  HeadingProps,
  TitleProps,
  BodyProps,
  EmphasisProps,
  LogoProps
} from '@nugudi/react-components-layout';
```

## Styling

Import the styles:

```tsx
import '@nugudi/react-components-layout/style.css';
```

## Best Practices

1. **Use semantic components**: Choose Heading for page titles, Title for sections, Body for content
2. **Maintain hierarchy**: Use consistent font sizes to establish visual hierarchy
3. **Leverage spacing props**: Use gap instead of margin on children
4. **Prefer layout components**: Use VStack/HStack instead of custom flex styles
5. **Use Grid for complex layouts**: Grid is more efficient than nested Flex for 2D layouts
6. **Keep responsive**: Use responsive props when layouts need to adapt
7. **Combine thoughtfully**: Mix layout and typography components for complete interfaces