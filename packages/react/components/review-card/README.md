# ReviewCard Component

A structured review display component with support for images, badges, and formatted text. Perfect for testimonials, product reviews, service feedback, and user-generated content.

## Installation

```bash
pnpm add @nugudi/react-components-review-card
```

## Basic Usage

```tsx
import { ReviewCard } from '@nugudi/react-components-review-card';

// Basic review
<ReviewCard
  date="2024-01-15"
  reviewText="This product exceeded my expectations. Great quality!"
/>

// With image
<ReviewCard
  imageUrl="/review-photo.jpg"
  imageAlt="Product review photo"
  date="2024-01-15"
  reviewText="Amazing experience! Highly recommend."
/>

// With badges
<ReviewCard
  date="2024-01-15"
  reviewText="Perfect for my needs. Fast shipping too!"
  badges={[
    { emoji: "✅", label: "Verified Purchase" },
    { emoji: "⭐", label: "5.0" }
  ]}
/>
```

## With Images

Display review photos or product images:

```tsx
// Single review image
<ReviewCard
  imageUrl="/customer-photo.jpg"
  imageAlt="Customer's product photo"
  date="Yesterday"
  reviewText="Exactly as described. The color is perfect!"
/>

// With custom image component (e.g., Next.js Image)
import Image from 'next/image';

<ReviewCard
  imageAs={Image}
  imageUrl="/review.jpg"
  imageAlt="Review photo"
  date="2 days ago"
  reviewText="Great quality, worth every penny."
/>

// Without image
<ReviewCard
  date="Last week"
  reviewText="Excellent service and fast delivery."
/>
```

## With Badges

Add contextual badges to reviews:

```tsx
// Verified purchase badge
<ReviewCard
  date="2024-01-10"
  reviewText="Authentic product, very satisfied."
  badges={[
    { emoji: "✅", label: "Verified" }
  ]}
/>

// Multiple badges
<ReviewCard
  date="2024-01-08"
  reviewText="Best purchase I've made this year!"
  badges={[
    { emoji: "✅", label: "Verified Purchase" },
    { emoji: "⭐", label: "5 Stars" },
    { emoji: "🏆", label: "Top Reviewer" }
  ]}
/>

// Rating and helpful badges
<ReviewCard
  date="2024-01-05"
  reviewText="Very detailed and helpful review content here..."
  badges={[
    { emoji: "⭐", label: "4.5" },
    { emoji: "👍", label: "Helpful (23)" },
    { emoji: "💬", label: "3 replies" }
  ]}
/>
```

## Interactive Reviews

Make reviews clickable for detail view:

```tsx
import { ReviewCard } from '@nugudi/react-components-review-card';

function InteractiveReview({ review, onOpen }) {
  return (
    <ReviewCard
      imageUrl={review.image}
      date={review.date}
      reviewText={review.text}
      badges={review.badges}
      onClick={() => onOpen(review.id)}
      style={{ cursor: 'pointer' }}
    />
  );
}
```

## Product Reviews

E-commerce product review display:

```tsx
import { ReviewCard } from '@nugudi/react-components-review-card';
import { VStack, HStack, Title } from '@nugudi/react-components-layout';

function ProductReviews({ reviews }) {
  return (
    <VStack gap={24}>
      <Title fontSize="t2">Customer Reviews</Title>
      
      <VStack gap={16}>
        {reviews.map((review) => (
          <ReviewCard
            key={review.id}
            imageUrl={review.image}
            date={review.date}
            reviewText={review.comment}
            badges={[
              { emoji: "⭐", label: `${review.rating}/5` },
              ...(review.verified ? [{ emoji: "✅", label: "Verified Purchase" }] : []),
              ...(review.helpful > 0 ? [{ emoji: "👍", label: `Helpful (${review.helpful})` }] : [])
            ]}
          />
        ))}
      </VStack>
    </VStack>
  );
}
```

## Service Testimonials

Customer testimonials section:

```tsx
import { ReviewCard } from '@nugudi/react-components-review-card';
import { VStack, Title, Grid } from '@nugudi/react-components-layout';

function Testimonials() {
  const testimonials = [
    {
      text: "Outstanding service! The team went above and beyond.",
      date: "January 2024",
      badges: [{ emoji: "⭐", label: "5.0" }]
    },
    {
      text: "Professional, efficient, and great results.",
      date: "December 2023",
      badges: [{ emoji: "💼", label: "Business" }]
    },
    {
      text: "Highly recommend! Will definitely use again.",
      date: "November 2023",
      badges: [{ emoji: "🔄", label: "Repeat Customer" }]
    }
  ];

  return (
    <VStack gap={32}>
      <Title fontSize="t1">What Our Clients Say</Title>
      
      <Grid templateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={20}>
        {testimonials.map((testimonial, index) => (
          <ReviewCard
            key={index}
            date={testimonial.date}
            reviewText={testimonial.text}
            badges={testimonial.badges}
          />
        ))}
      </Grid>
    </VStack>
  );
}
```

## Restaurant Reviews

Food service review cards:

```tsx
import { ReviewCard } from '@nugudi/react-components-review-card';
import { VStack } from '@nugudi/react-components-layout';

function RestaurantReviews({ reviews }) {
  return (
    <VStack gap={16}>
      {reviews.map((review) => (
        <ReviewCard
          key={review.id}
          imageUrl={review.foodPhoto}
          imageAlt="Food photo"
          date={review.visitDate}
          reviewText={review.comment}
          badges={[
            { emoji: "⭐", label: `${review.rating}/5` },
            { emoji: "🍽️", label: review.mealType },
            ...(review.recommended ? [{ emoji: "👍", label: "Recommended" }] : [])
          ]}
        />
      ))}
    </VStack>
  );
}
```

## Hotel Reviews

Travel and accommodation reviews:

```tsx
import { ReviewCard } from '@nugudi/react-components-review-card';
import { VStack, HStack, Title, Body } from '@nugudi/react-components-layout';

function HotelReviews({ hotel }) {
  return (
    <VStack gap={24}>
      <HStack justify="space-between">
        <Title fontSize="t2">Guest Reviews</Title>
        <Body fontSize="b2">{hotel.averageRating}/5 ({hotel.totalReviews} reviews)</Body>
      </HStack>
      
      {hotel.reviews.map((review) => (
        <ReviewCard
          key={review.id}
          imageUrl={review.roomPhoto}
          date={review.stayDate}
          reviewText={review.comment}
          badges={[
            { emoji: "⭐", label: `${review.rating}/5` },
            { emoji: "🛏️", label: review.roomType },
            { emoji: "📅", label: `${review.nights} nights` },
            ...(review.businessTrip ? [{ emoji: "💼", label: "Business" }] : [])
          ]}
        />
      ))}
    </VStack>
  );
}
```

## App Store Reviews

Mobile app review display:

```tsx
import { ReviewCard } from '@nugudi/react-components-review-card';
import { VStack, HStack, Body } from '@nugudi/react-components-layout';

function AppReviews({ reviews }) {
  return (
    <VStack gap={16}>
      {reviews.map((review) => (
        <ReviewCard
          key={review.id}
          date={review.date}
          reviewText={review.content}
          badges={[
            { emoji: "⭐", label: `${review.stars}/5` },
            { emoji: "📱", label: review.device },
            { emoji: "✓", label: `v${review.appVersion}` }
          ]}
          onClick={() => console.log('View full review')}
        />
      ))}
    </VStack>
  );
}
```

## Course Reviews

Educational content reviews:

```tsx
import { ReviewCard } from '@nugudi/react-components-review-card';
import { VStack, Title } from '@nugudi/react-components-layout';

function CourseReviews({ course }) {
  return (
    <VStack gap={20}>
      <Title fontSize="t3">Student Reviews</Title>
      
      {course.reviews.map((review) => (
        <ReviewCard
          key={review.id}
          date={review.completionDate}
          reviewText={review.feedback}
          badges={[
            { emoji: "⭐", label: `${review.rating}/5` },
            { emoji: "✅", label: "Course Completed" },
            { emoji: "📚", label: `${review.hoursSpent}h` },
            ...(review.wouldRecommend ? [{ emoji: "👍", label: "Recommends" }] : [])
          ]}
        />
      ))}
    </VStack>
  );
}
```

## Medical/Healthcare Reviews

Patient testimonials:

```tsx
import { ReviewCard } from '@nugudi/react-components-review-card';
import { VStack } from '@nugudi/react-components-layout';

function PatientReviews({ reviews }) {
  return (
    <VStack gap={16}>
      {reviews.map((review) => (
        <ReviewCard
          key={review.id}
          date={review.visitDate}
          reviewText={review.experience}
          badges={[
            { emoji: "⭐", label: `${review.rating}/5` },
            { emoji: "✅", label: "Verified Patient" },
            { emoji: "🏥", label: review.department }
          ]}
        />
      ))}
    </VStack>
  );
}
```

## Book Reviews

Literary review cards:

```tsx
import { ReviewCard } from '@nugudi/react-components-review-card';
import { VStack, HStack, Title, Body } from '@nugudi/react-components-layout';

function BookReviews({ book }) {
  return (
    <VStack gap={24}>
      <HStack justify="space-between">
        <Title fontSize="t2">Reader Reviews</Title>
        <Body fontSize="b3">{book.rating} • {book.reviewCount} reviews</Body>
      </HStack>
      
      {book.reviews.map((review) => (
        <ReviewCard
          key={review.id}
          date={review.date}
          reviewText={review.content}
          badges={[
            { emoji: "⭐", label: `${review.rating}/5` },
            { emoji: "✅", label: "Verified Purchase" },
            { emoji: "📖", label: `${review.readingTime}` },
            ...(review.recommended ? [{ emoji: "👍", label: "Recommends" }] : [])
          ]}
        />
      ))}
    </VStack>
  );
}
```

## Real Estate Reviews

Property or agent reviews:

```tsx
import { ReviewCard } from '@nugudi/react-components-review-card';
import { VStack, Title } from '@nugudi/react-components-layout';

function AgentReviews({ agent }) {
  return (
    <VStack gap={20}>
      <Title fontSize="t2">Client Reviews</Title>
      
      {agent.reviews.map((review) => (
        <ReviewCard
          key={review.id}
          imageUrl={review.propertyImage}
          imageAlt="Property"
          date={review.date}
          reviewText={review.testimonial}
          badges={[
            { emoji: "⭐", label: `${review.rating}/5` },
            { emoji: "🏠", label: review.transactionType },
            { emoji: "✅", label: "Verified Client" }
          ]}
        />
      ))}
    </VStack>
  );
}
```

## With Custom Styling

Apply custom styles and themes:

```tsx
import { ReviewCard } from '@nugudi/react-components-review-card';
import { Box } from '@nugudi/react-components-layout';

function StyledReview({ review }) {
  return (
    <Box padding={20} backgroundColor="gray" borderRadius="lg">
      <ReviewCard
        imageUrl={review.image}
        date={review.date}
        reviewText={review.text}
        badges={review.badges}
        className="custom-review"
        style={{
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}
      />
    </Box>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| date | `string` | - | **Required.** Date of the review |
| reviewText | `string` | - | **Required.** The review content text |
| imageUrl | `string` | - | URL of the review image |
| imageAs | `React.ElementType` | - | Custom image component (e.g., Next.js Image) |
| imageAlt | `string` | `"리뷰 이미지"` | Alt text for the image |
| badges | `Badge[]` | `[]` | Array of badge objects with emoji and label |
| onClick | `() => void` | - | Click handler for interactive reviews |
| className | `string` | - | Additional CSS class |
| ...rest | `Omit<ComponentPropsWithoutRef<"div">, "onClick">` | - | All other div props except onClick |

### Badge Type

```tsx
interface Badge {
  emoji: string;  // Emoji or icon character
  label: string;  // Badge label text
}
```

## Styling

The component uses CSS-in-JS with vanilla-extract. Import the styles:

```tsx
import '@nugudi/react-components-review-card/style.css';
```

## Accessibility

- Semantic HTML structure for reviews
- Keyboard support when interactive (onClick)
- Proper alt text for images
- Role and tabIndex for clickable cards
- Enter and Space key support for activation

## TypeScript

The component is fully typed. Import types as needed:

```tsx
import type { ReviewCardProps, Badge } from '@nugudi/react-components-review-card';

// Review data structure
interface ReviewData {
  id: string;
  date: string;
  text: string;
  rating: number;
  image?: string;
  badges: Badge[];
}

// Using in component props
interface ReviewSectionProps {
  reviews: ReviewData[];
  onReviewClick?: (id: string) => void;
}
```

## Best Practices

1. **Always provide date**: Shows recency and builds trust
2. **Use meaningful badges**: Only show relevant context
3. **Optimize images**: Compress review photos for performance
4. **Limit text length**: Consider truncation for long reviews
5. **Show verified status**: Build trust with verification badges
6. **Include ratings**: Use star ratings in badges
7. **Make interactive thoughtfully**: Only if detail view exists
8. **Group related reviews**: Organize by rating, date, or relevance