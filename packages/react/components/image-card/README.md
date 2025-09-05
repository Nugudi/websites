# ImageCard Component

A flexible image wrapper component that can render as any HTML element while preserving image-related props. Perfect for creating custom image containers, links with images, or any image-based card layouts.

## Installation

```bash
pnpm add @nugudi/react-components-image-card
```

## Basic Usage

```tsx
import { ImageCard } from '@nugudi/react-components-image-card';

// Basic image
<ImageCard src="/photo.jpg" alt="Description" />

// As a different element
<ImageCard as="div" />

// As a link with image
<ImageCard as="a" href="/gallery" />
```

## As Different Elements

Render the ImageCard as various HTML elements:

```tsx
// As div container
<ImageCard as="div" />

// As article
<ImageCard as="article" />

// As section
<ImageCard as="section" />

// As figure
<ImageCard as="figure" />

// As link
<ImageCard as="a" href="/detail" />

// As button
<ImageCard as="button" onClick={handleClick} />
```

## With Image Element (Default)

When no `as` prop is provided, renders as `img`:

```tsx
// Standard image
<ImageCard 
  src="/landscape.jpg" 
  alt="Beautiful landscape"
  width={800}
  height={600}
/>

// Responsive image
<ImageCard 
  src="/product.jpg" 
  alt="Product"
  loading="lazy"
  decoding="async"
/>

// With srcset
<ImageCard 
  src="/image.jpg"
  srcSet="/image@2x.jpg 2x, /image@3x.jpg 3x"
  alt="Responsive image"
/>
```

## Gallery Card

Create image gallery items:

```tsx
import { ImageCard } from '@nugudi/react-components-image-card';
import { VStack, Box, Title, Body } from '@nugudi/react-components-layout';

function GalleryCard({ image, title, description }) {
  return (
    <Box borderRadius="lg" overflow="hidden">
      <ImageCard 
        src={image}
        alt={title}
        width="100%"
        height={200}
        style={{ objectFit: 'cover' }}
      />
      <VStack gap={8} padding={16}>
        <Title fontSize="t3">{title}</Title>
        <Body fontSize="b3">{description}</Body>
      </VStack>
    </Box>
  );
}
```

## Product Card

E-commerce product display:

```tsx
import { ImageCard } from '@nugudi/react-components-image-card';
import { VStack, HStack, Box, Title, Body, Badge } from '@nugudi/react-components-layout';

function ProductCard({ product }) {
  return (
    <Box borderRadius="lg" overflow="hidden" backgroundColor="white">
      <Box position="relative">
        <ImageCard 
          src={product.image}
          alt={product.name}
          width="100%"
          height={250}
          style={{ objectFit: 'cover' }}
        />
        {product.discount && (
          <Box position="absolute" top={8} right={8}>
            <Badge tone="negative">{product.discount}% OFF</Badge>
          </Box>
        )}
      </Box>
      
      <VStack gap={12} padding={16}>
        <Title fontSize="t3">{product.name}</Title>
        <HStack gap={8}>
          <Body fontSize="b2b" style={{ textDecoration: 'line-through' }}>
            ${product.originalPrice}
          </Body>
          <Body fontSize="b1b">${product.price}</Body>
        </HStack>
      </VStack>
    </Box>
  );
}
```

## Clickable Image Card

Image that acts as a link:

```tsx
import { ImageCard } from '@nugudi/react-components-image-card';

function ClickableImageCard({ href, image, alt }) {
  return (
    <ImageCard 
      as="a"
      href={href}
      style={{ display: 'block', cursor: 'pointer' }}
    >
      <img src={image} alt={alt} style={{ width: '100%' }} />
    </ImageCard>
  );
}
```

## Article Card

Blog or news article preview:

```tsx
import { ImageCard } from '@nugudi/react-components-image-card';
import { VStack, HStack, Title, Body, Emphasis } from '@nugudi/react-components-layout';

function ArticleCard({ article }) {
  return (
    <ImageCard as="article">
      <VStack gap={0}>
        <img 
          src={article.thumbnail}
          alt={article.title}
          style={{ width: '100%', height: '200px', objectFit: 'cover' }}
        />
        
        <VStack gap={12} padding={20}>
          <HStack gap={12}>
            <Emphasis fontSize="e1">{article.category}</Emphasis>
            <Body fontSize="b4">{article.readTime} min read</Body>
          </HStack>
          
          <Title fontSize="t2">{article.title}</Title>
          <Body fontSize="b3">{article.excerpt}</Body>
          
          <HStack gap={12}>
            <img 
              src={article.author.avatar}
              alt={article.author.name}
              style={{ width: 32, height: 32, borderRadius: '50%' }}
            />
            <VStack gap={4}>
              <Body fontSize="b3b">{article.author.name}</Body>
              <Body fontSize="b4">{article.date}</Body>
            </VStack>
          </HStack>
        </VStack>
      </VStack>
    </ImageCard>
  );
}
```

## Profile Card

User profile display:

```tsx
import { ImageCard } from '@nugudi/react-components-image-card';
import { VStack, HStack, Box, Title, Body, Button } from '@nugudi/react-components-layout';

function ProfileCard({ user }) {
  return (
    <Box borderRadius="lg" overflow="hidden" backgroundColor="white">
      <ImageCard 
        src={user.coverImage}
        alt="Cover"
        width="100%"
        height={120}
        style={{ objectFit: 'cover' }}
      />
      
      <VStack gap={16} padding={20} style={{ marginTop: '-40px' }}>
        <ImageCard
          src={user.avatar}
          alt={user.name}
          width={80}
          height={80}
          style={{ 
            borderRadius: '50%',
            border: '4px solid white'
          }}
        />
        
        <VStack gap={8} align="center">
          <Title fontSize="t2">{user.name}</Title>
          <Body fontSize="b3">{user.bio}</Body>
          
          <HStack gap={16}>
            <VStack gap={4} align="center">
              <Body fontSize="b1b">{user.followers}</Body>
              <Body fontSize="b4">Followers</Body>
            </VStack>
            <VStack gap={4} align="center">
              <Body fontSize="b1b">{user.following}</Body>
              <Body fontSize="b4">Following</Body>
            </VStack>
          </HStack>
          
          <Button size="sm" variant="brand">Follow</Button>
        </VStack>
      </VStack>
    </Box>
  );
}
```

## Media Card with Overlay

Image with text overlay:

```tsx
import { ImageCard } from '@nugudi/react-components-image-card';
import { Box, VStack, Title, Body } from '@nugudi/react-components-layout';

function MediaCardWithOverlay({ media }) {
  return (
    <Box position="relative" borderRadius="lg" overflow="hidden">
      <ImageCard
        src={media.image}
        alt={media.title}
        width="100%"
        height={300}
        style={{ objectFit: 'cover' }}
      />
      
      <Box
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        padding={20}
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)'
        }}
      >
        <VStack gap={8}>
          <Title fontSize="t2" style={{ color: 'white' }}>
            {media.title}
          </Title>
          <Body fontSize="b3" style={{ color: 'rgba(255,255,255,0.9)' }}>
            {media.description}
          </Body>
        </VStack>
      </Box>
    </Box>
  );
}
```

## Portfolio Item

Creative portfolio showcase:

```tsx
import { ImageCard } from '@nugudi/react-components-image-card';
import { Box, VStack, HStack, Title, Body, Badge } from '@nugudi/react-components-layout';

function PortfolioItem({ project }) {
  return (
    <ImageCard 
      as="figure"
      style={{ margin: 0 }}
    >
      <Box position="relative" overflow="hidden">
        <img
          src={project.thumbnail}
          alt={project.title}
          style={{ 
            width: '100%',
            transition: 'transform 0.3s',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
        />
        
        <HStack 
          gap={8} 
          position="absolute" 
          top={12} 
          left={12}
        >
          {project.tags.map(tag => (
            <Badge key={tag} tone="neutral">{tag}</Badge>
          ))}
        </HStack>
      </Box>
      
      <figcaption>
        <VStack gap={8} padding={16}>
          <Title fontSize="t3">{project.title}</Title>
          <Body fontSize="b3">{project.description}</Body>
        </VStack>
      </figcaption>
    </ImageCard>
  );
}
```

## Recipe Card

Food or recipe display:

```tsx
import { ImageCard } from '@nugudi/react-components-image-card';
import { VStack, HStack, Box, Title, Body, Badge } from '@nugudi/react-components-layout';

function RecipeCard({ recipe }) {
  return (
    <Box borderRadius="lg" overflow="hidden" backgroundColor="white">
      <Box position="relative">
        <ImageCard
          src={recipe.image}
          alt={recipe.name}
          width="100%"
          height={200}
          style={{ objectFit: 'cover' }}
        />
        
        <Box position="absolute" top={12} right={12}>
          <Badge tone="positive">{recipe.difficulty}</Badge>
        </Box>
      </Box>
      
      <VStack gap={12} padding={16}>
        <Title fontSize="t3">{recipe.name}</Title>
        
        <HStack gap={16}>
          <HStack gap={4}>
            <span>⏱</span>
            <Body fontSize="b4">{recipe.cookTime}</Body>
          </HStack>
          <HStack gap={4}>
            <span>👥</span>
            <Body fontSize="b4">{recipe.servings} servings</Body>
          </HStack>
        </HStack>
        
        <HStack gap={4}>
          {[...Array(5)].map((_, i) => (
            <span key={i} style={{ color: i < recipe.rating ? '#FFD700' : '#E0E0E0' }}>
              ★
            </span>
          ))}
          <Body fontSize="b4">({recipe.reviews})</Body>
        </HStack>
      </VStack>
    </Box>
  );
}
```

## Event Card

Event or activity display:

```tsx
import { ImageCard } from '@nugudi/react-components-image-card';
import { VStack, HStack, Box, Title, Body, Button, Badge } from '@nugudi/react-components-layout';

function EventCard({ event }) {
  return (
    <Box borderRadius="lg" overflow="hidden" backgroundColor="white">
      <Box position="relative">
        <ImageCard
          src={event.image}
          alt={event.title}
          width="100%"
          height={180}
          style={{ objectFit: 'cover' }}
        />
        
        {event.isOnline && (
          <Box position="absolute" top={12} left={12}>
            <Badge tone="informative">Online Event</Badge>
          </Box>
        )}
        
        <Box 
          position="absolute"
          top={12}
          right={12}
          padding={8}
          backgroundColor="white"
          borderRadius="md"
        >
          <VStack gap={0} align="center">
            <Body fontSize="b1b">{event.date.day}</Body>
            <Body fontSize="b4">{event.date.month}</Body>
          </VStack>
        </Box>
      </Box>
      
      <VStack gap={12} padding={16}>
        <Title fontSize="t3">{event.title}</Title>
        <Body fontSize="b3">{event.location}</Body>
        
        <HStack gap={8}>
          <Body fontSize="b4">{event.time}</Body>
          <Body fontSize="b4">•</Body>
          <Body fontSize="b4">{event.attendees} attending</Body>
        </HStack>
        
        <Button size="sm" variant="brand" width="full">
          Register
        </Button>
      </VStack>
    </Box>
  );
}
```

## Property Card

Real estate listing:

```tsx
import { ImageCard } from '@nugudi/react-components-image-card';
import { VStack, HStack, Box, Title, Body, Badge } from '@nugudi/react-components-layout';

function PropertyCard({ property }) {
  return (
    <Box borderRadius="lg" overflow="hidden" backgroundColor="white">
      <Box position="relative">
        <ImageCard
          src={property.images[0]}
          alt={property.title}
          width="100%"
          height={220}
          style={{ objectFit: 'cover' }}
        />
        
        <Box position="absolute" top={12} left={12}>
          <Badge tone={property.type === 'For Sale' ? 'positive' : 'informative'}>
            {property.type}
          </Badge>
        </Box>
        
        <Box 
          position="absolute"
          bottom={12}
          right={12}
          padding={8}
          backgroundColor="rgba(0,0,0,0.7)"
          borderRadius="md"
        >
          <Body fontSize="b4" style={{ color: 'white' }}>
            1/{property.images.length}
          </Body>
        </Box>
      </Box>
      
      <VStack gap={12} padding={16}>
        <Title fontSize="t1b">${property.price.toLocaleString()}</Title>
        <Title fontSize="t3">{property.title}</Title>
        <Body fontSize="b3">{property.address}</Body>
        
        <HStack gap={16}>
          <HStack gap={4}>
            <span>🛏</span>
            <Body fontSize="b4">{property.bedrooms} beds</Body>
          </HStack>
          <HStack gap={4}>
            <span>🚿</span>
            <Body fontSize="b4">{property.bathrooms} baths</Body>
          </HStack>
          <HStack gap={4}>
            <span>📐</span>
            <Body fontSize="b4">{property.area} sqft</Body>
          </HStack>
        </HStack>
      </VStack>
    </Box>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| as | `ElementType` | `"img"` | The HTML element or component to render as |
| ...props | `ComponentPropsWithoutRef<T>` | - | All props of the specified element type |

The component accepts all props of the element type specified by the `as` prop. When `as` is not specified, it defaults to `img` and accepts all standard image attributes.

## Styling

The component is unstyled by default and accepts all standard HTML attributes including `className` and `style`. It can be combined with any CSS-in-JS solution or traditional CSS.

## TypeScript

The component is fully typed with generic support:

```tsx
import type { ImageCardProps } from '@nugudi/react-components-image-card';

// Type for specific element
type DivImageCardProps = ImageCardProps<'div'>;

// Using in component props
interface CardProps {
  imageProps?: ImageCardProps;
}

// With specific element type
function CustomCard() {
  const imageProps: ImageCardProps<'a'> = {
    as: 'a',
    href: '/link'
  };
  
  return <ImageCard {...imageProps} />;
}
```

## Accessibility

- When rendering as `img`, always provide an `alt` attribute
- For decorative images, use `alt=""`
- When used as interactive elements (button, link), ensure proper keyboard support
- Consider using `role` and ARIA attributes when changing semantic meaning

## Best Practices

1. **Always provide alt text**: Essential for accessibility
2. **Optimize images**: Use appropriate formats and sizes
3. **Lazy loading**: Use `loading="lazy"` for below-the-fold images
4. **Responsive images**: Use srcSet for different screen sizes
5. **Object fit**: Use CSS object-fit for consistent layouts
6. **Semantic HTML**: Choose appropriate `as` value for context
7. **Performance**: Consider using Next.js Image or similar optimization tools