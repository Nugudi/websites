# 🎯 Component Development with Single Responsibility Principle

## 📐 Core Philosophy

Every component follows the **Single Responsibility Principle (SRP)**. One component should have one clear responsibility.

> **Note**: This pattern is recommended for complex components. Simple components may not require this level of decomposition.

## 🔧 Component Composition Pattern

### 1️⃣ Main Container Component

The main component only orchestrates sub-components. Always use `Box` as the top-level wrapper for complex components.

```typescript
// ✅ GOOD - CafeteriaMenuCard as a container
import { Box, VStack, HStack } from '@nugudi/react-components-layout';
import { vars } from '@nugudi/themes';

type CafeteriaMenuCardProps = {
  menu: MenuForList;
};

export function CafeteriaMenuCard({ menu }: CafeteriaMenuCardProps) {
  return (
    <Box padding={0} borderRadius="lg" background="whiteAlpha">
      <CafeteriaMenuCardImage menu={menu} />
      <VStack gap={16} padding={16}>
        <CafeteriaMenuCardHeader menu={menu} />
        <CafeteriaMenuCardNutrition menu={menu} />
        <CafeteriaMenuCardAllergens menu={menu} />
        <CafeteriaMenuCardRating menu={menu} />
        <CafeteriaMenuCardActions menu={menu} />
      </VStack>
    </Box>
  );
}
```

### 2️⃣ Sub-Component Pattern

Each sub-component has a single, clear responsibility.

```typescript
// ✅ Image Display Responsibility
type CafeteriaMenuCardImageProps = Pick<CafeteriaMenuCardProps, "menu">;

export function CafeteriaMenuCardImage({ menu }: CafeteriaMenuCardImageProps) {
  if (!menu.imageUrl) {
    return (
      <Box width="full" height={200} background="zinc">
        <Body fontSize="b3" color="zinc" colorShade={400}>
          No image available
        </Body>
      </Box>
    );
  }

  return (
    <Box width="full" height={200}>
      <img
        src={menu.imageUrl}
        alt={menu.name}
      />
      {menu.isPopular && (
        <Badge tone="positive" variant="solid" size="sm">
          인기메뉴
        </Badge>
      )}
    </Box>
  );
}

// ✅ Header Information Responsibility  
type CafeteriaMenuCardHeaderProps = Pick<CafeteriaMenuCardProps, "menu">;

function CafeteriaMenuCardHeader({ menu }: CafeteriaMenuCardHeaderProps) {
  return (
    <VStack gap={4}>
      <HStack justify="space-between" align="start">
        <Title fontSize="t3" as="h3">
          {menu.name}
        </Title>
        <Badge tone="informative" variant="outline" size="sm">
          {menu.category}
        </Badge>
      </HStack>
      <Body fontSize="b3" color="zinc" colorShade={600}>
        {menu.description}
      </Body>
      <HStack gap={12}>
        <Body fontSize="b2b">
          {menu.price.toLocaleString()}원
        </Body>
        <Emphasis fontSize="e1" color="zinc" colorShade={500}>
          {menu.calories}kcal
        </Emphasis>
      </HStack>
    </VStack>
  );
}

// ✅ Nutrition Display Responsibility
type CafeteriaMenuCardNutritionProps = Pick<CafeteriaMenuCardProps, "menu">;

function CafeteriaMenuCardNutrition({ menu }: CafeteriaMenuCardNutritionProps) {
  return (
    <HStack gap={16}>
      <VStack gap={4}>
        <Emphasis fontSize="e2" color="zinc" colorShade={500}>
          탄수화물
        </Emphasis>
        <Body fontSize="b3b">{menu.nutrition.carbs}g</Body>
      </VStack>
      <VStack gap={4}>
        <Emphasis fontSize="e2" color="zinc" colorShade={500}>
          단백질
        </Emphasis>
        <Body fontSize="b3b">{menu.nutrition.protein}g</Body>
      </VStack>
      <VStack gap={4}>
        <Emphasis fontSize="e2" color="zinc" colorShade={500}>
          지방
        </Emphasis>
        <Body fontSize="b3b">{menu.nutrition.fat}g</Body>
      </VStack>
    </HStack>
  );
}

// ✅ Allergen Display Responsibility
type CafeteriaMenuCardAllergensProps = Pick<CafeteriaMenuCardProps, "menu">;

function CafeteriaMenuCardAllergens({ menu }: CafeteriaMenuCardAllergensProps) {
  if (!menu.allergens || menu.allergens.length === 0) {
    return null;
  }
  
  return (
    <VStack gap={8}>
      <Emphasis fontSize="e1" color="zinc" colorShade={600}>
        알레르기 정보
      </Emphasis>
      <HStack gap={4} wrap="wrap">
        {menu.allergens.map((allergen) => (
          <Badge 
            key={allergen.id} 
            tone="warning" 
            variant="weak" 
            size="sm"
          >
            {allergen.name}
          </Badge>
        ))}
      </HStack>
    </VStack>
  );
}

// ✅ Rating Display Responsibility
type CafeteriaMenuCardRatingProps = Pick<CafeteriaMenuCardProps, "menu">;

function CafeteriaMenuCardRating({ menu }: CafeteriaMenuCardRatingProps) {
  return (
    <HStack gap={8} align="center">
      <HStack gap={2}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Box 
            key={star}
            style={{ 
              color: star <= menu.rating 
                ? vars.colors.$scale.yellow[500]
                : vars.colors.$scale.zinc[300]
            }}
          >
            ★
          </Box>
        ))}
      </HStack>
      <Body fontSize="b3" color="zinc" colorShade={600}>
        {menu.rating.toFixed(1)}
      </Body>
      <Emphasis fontSize="e1" color="zinc" colorShade={500}>
        ({menu.reviewCount}개 리뷰)
      </Emphasis>
    </HStack>
  );
}

// ✅ Action Buttons Responsibility with Authorization
type CafeteriaMenuCardActionsProps = Pick<CafeteriaMenuCardProps, "menu">;

function CafeteriaMenuCardActions({ menu }: CafeteriaMenuCardActionsProps) {
  const { currentUser } = useCurrentUser();
  
  const isStaff = currentUser?.role === 'staff' || currentUser?.role === 'admin';
  
  if (isStaff) {
    return <CafeteriaMenuStaffActions menu={menu} />;
  }
  
  if (currentUser) {
    return <CafeteriaMenuUserActions menu={menu} />;
  }
  
  return <CafeteriaMenuGuestActions menu={menu} />;
}

// ✅ Action Buttons Responsibility with Authorization Check
type ProductCardActionsProps = Pick<ProductCardProps, "product">;

function ProductCardActions({ product }: ProductCardActionsProps) {
  const { currentUser } = useCurrentUser();
  
  const isOwner = currentUser?.id === product.ownerId;
  
  if (isOwner) {
    return <ProductOwnerActions product={product} />;
  }
  
  if (currentUser) {
    return <ProductUserActions product={product} />;
  }
  
  return <ProductGuestActions product={product} />;
}

// ✅ Staff-specific Actions (Next.js App Router)
type CafeteriaMenuStaffActionsProps = Pick<CafeteriaMenuCardProps, "menu">;

function CafeteriaMenuStaffActions({ menu }: CafeteriaMenuStaffActionsProps) {
  return (
    <HStack gap={12}>
      <Button variant="outline" size="sm" asChild>
        <Link href={`/cafeteria/menus/${menu.id}/edit`}>
          메뉴 수정
        </Link>
      </Button>
      <CafeteriaMenuDeleteDialog menu={menu} />
    </HStack>
  );
}

// ✅ Authenticated User Actions (Next.js App Router)
type CafeteriaMenuUserActionsProps = Pick<CafeteriaMenuCardProps, "menu">;

function CafeteriaMenuUserActions({ menu }: CafeteriaMenuUserActionsProps) {
  return (
    <HStack gap={12}>
      <CafeteriaMenuFavoriteButton 
        menuId={menu.id}
        isFavorited={menu.isFavorited}
      />
      <Button variant="solid" tone="informative" size="sm" asChild>
        <Link href={`/cafeteria/menus/${menu.id}`}>
          상세보기
        </Link>
      </Button>
    </HStack>
  );
}

// ✅ Guest User Actions (Next.js App Router)
type CafeteriaMenuGuestActionsProps = Pick<CafeteriaMenuCardProps, "menu">;

function CafeteriaMenuGuestActions({ menu }: CafeteriaMenuGuestActionsProps) {
  return (
    <Button variant="outline" tone="neutral" size="sm" asChild>
      <Link href="/auth/sign-in">
        로그인하여 더 많은 기능 이용하기
      </Link>
    </Button>
  );
}
```

## 📦 Type Composition Pattern

Break types into small units and compose them for use.

```typescript
// src/domains/cafeteria/types/menu.ts

// ✅ Base Types
import { Menu, Allergen, User, Nutrition } from '@/src/shared/types';

// ✅ Relationship Types
type MenuWithNutrition = Menu & {
  nutrition: Nutrition;
};

type MenuWithAllergens = Menu & {
  allergens: Allergen[];
};

type MenuWithCreator = Menu & {
  creator: User;
};

// ✅ Context Types (Current User Related)
type MenuWithUserContext = Menu & {
  isFavorited: boolean;
  hasOrdered: boolean;
  userRating?: number;
};

// ✅ Metric Types
type MenuWithRating = Menu & {
  rating: number;
  reviewCount: number;
};

type MenuWithOrderCount = Menu & {
  orderCount: number;
  todayOrderCount: number;
};

type MenuWithPopularity = Menu & {
  isPopular: boolean;
  popularityScore: number;
};

// ✅ Composed Types for Different Use Cases
export type MenuForList = MenuWithNutrition &
  MenuWithAllergens &
  MenuWithUserContext &
  MenuWithRating &
  MenuWithPopularity & {
    category: string;
    imageUrl?: string;
  };

export type MenuForDetail = MenuWithNutrition &
  MenuWithAllergens &
  MenuWithCreator &
  MenuWithUserContext &
  MenuWithRating &
  MenuWithOrderCount &
  MenuWithPopularity & {
    reviews: Review[];
    similarMenus: MenuForList[];
    ingredients: Ingredient[];
  };

export type MenuForOrder = Pick<Menu, 'id' | 'name' | 'price'> & {
  quantity: number;
  specialRequests?: string;
};

export type MenuForCalendar = Pick<Menu, 'id' | 'name' | 'calories'> & {
  date: Date;
  mealType: 'breakfast' | 'lunch' | 'dinner';
};
```

## 🏗️ Layout Components Usage

Maximize usage of Nugudi's layout components.

```typescript
// ✅ GOOD - Using layout components for complex components
import { 
  Box, 
  VStack, 
  HStack, 
  Grid 
} from '@nugudi/react-components-layout';

export function ProductListSection({ products }: ProductListSectionProps) {
  return (
    <Box padding={24}>
      <VStack gap={24}>
        <ProductListHeader />
        <Grid templateColumns="repeat(3, 1fr)" gap={16}>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </Grid>
      </VStack>
    </Box>
  );
}

// ❌ BAD - Using div instead of layout components
export function ProductListSection({ products }: ProductListSectionProps) {
  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <ProductListHeader />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
```

## ✅ Benefits of SRP

1. **Testability**: Each component with single responsibility can be tested independently
2. **Maintainability**: Changes only affect specific components
3. **Reusability**: Small unit components can be reused in various places
4. **Readability**: Clear role for each component makes code easy to understand
5. **Collaboration**: Team members can work on different components simultaneously

## 📋 Checklist

### Component Development
```
□ Does the component have a single responsibility?
□ Are props types clearly defined with Pick?
□ Are layout components utilized?
□ Is conditional rendering clear?
□ Is it properly separated into sub-components?
□ For complex components, is Box used as the top-level wrapper?
```

### Type Definition
```
□ Are base types separated into small units?
□ Are types composed for use?
□ Are context-related types separated?
□ Are use-case specific types defined?
```

### Code Quality
```
□ Does each function/component do only one thing?
□ Is naming clear and consistent?
□ Is code self-documenting without unnecessary comments?
□ Is the structure testable?
```

## 🚫 Anti-Patterns

```typescript
// ❌ BAD - Multiple responsibilities in one component
export function ProductCard({ product }) {
  const { currentUser } = useCurrentUser();
  const { data: reviews } = useQuery(...);
  const [isEditMode, setIsEditMode] = useState(false);
  
  // Business logic mixed with presentation
  const calculateDiscount = () => {...};
  const validatePurchase = () => {...};
  
  // Too many conditions and logic
  if (isEditMode) {
    return <ProductEditForm />;
  }
  
  return (
    <div>
      {/* Everything in one component */}
      <img src={product.image} />
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      {reviews.map(...)}
      {currentUser && ...}
      {/* ... */}
    </div>
  );
}

// ✅ GOOD - Separated responsibilities
export function ProductCard({ product }) {
  return (
    <Box padding={0} borderRadius="lg" background="whiteAlpha">
      <ProductCardMedia product={product} />
      <ProductCardContent product={product} />
      <ProductCardActions product={product} />
    </Box>
  );
}
```

## 🎯 Real Example: Cafeteria Menu Card

```typescript
// src/domains/cafeteria/ui/components/menu-card/index.tsx

import { Box, VStack, HStack } from '@nugudi/react-components-layout';
import { Card } from '@nugudi/react-components-card';
import { Badge } from '@nugudi/react-components-badge';
import { Button } from '@nugudi/react-components-button';
import { useCurrentUser } from '@/src/domains/auth/hooks/use-current-user';
import type { MenuForList } from '../../types';

type MenuCardProps = {
  menu: MenuForList;
};

// Main component for complex structure
export function MenuCard({ menu }: MenuCardProps) {
  return (
    <Box padding={0} borderRadius="lg" background="whiteAlpha">
      <MenuCardImage menu={menu} />
      <VStack gap={16} padding={16}>
        <MenuCardHeader menu={menu} />
        <MenuCardNutrition menu={menu} />
        <MenuCardAllergens menu={menu} />
        <MenuCardRating menu={menu} />
        <MenuCardActions menu={menu} />
      </VStack>
    </Box>
  );
}

// Image Display Responsibility
type MenuCardImageProps = Pick<MenuCardProps, "menu">;

function MenuCardImage({ menu }: MenuCardImageProps) {
  if (!menu.imageUrl) {
    return (
      <Box height={192} background="zinc">
        <Body fontSize="b3" color="zinc" colorShade={400}>No image</Body>
      </Box>
    );
  }
  
  return (
    <Box height={192} style={{ position: 'relative' }}>
      <img 
        src={menu.imageUrl} 
        alt={menu.name}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
      {menu.isPopular && (
        <Box style={{ position: 'absolute', top: 8, right: 8 }}>
          <Badge variant="success">Popular</Badge>
        </Box>
      )}
    </Box>
  );
}

// Header Information Responsibility
type MenuCardHeaderProps = Pick<MenuCardProps, "menu">;

function MenuCardHeader({ menu }: MenuCardHeaderProps) {
  return (
    <VStack gap={4}>
      <HStack justify="space-between" align="start">
        <Title fontSize="t3" as="h3">{menu.name}</Title>
        <Badge variant="outline">{menu.category.name}</Badge>
      </HStack>
      <Body fontSize="b3" color="zinc" colorShade={600}>{menu.description}</Body>
      <HStack gap={8}>
        <Body fontSize="b3b">{menu.price.toLocaleString()}₩</Body>
        <Emphasis fontSize="e1" color="zinc" colorShade={500}>{menu.calories}kcal</Emphasis>
      </HStack>
    </VStack>
  );
}

// Nutrition Information Responsibility
type MenuCardNutritionProps = Pick<MenuCardProps, "menu">;

function MenuCardNutrition({ menu }: MenuCardNutritionProps) {
  return (
    <HStack gap={16}>
      <Emphasis fontSize="e1">Carbs {menu.nutrition.carbs}g</Emphasis>
      <Emphasis fontSize="e1">Protein {menu.nutrition.protein}g</Emphasis>
      <Emphasis fontSize="e1">Fat {menu.nutrition.fat}g</Emphasis>
    </HStack>
  );
}

// Allergen Information Responsibility
type MenuCardAllergensProps = Pick<MenuCardProps, "menu">;

function MenuCardAllergens({ menu }: MenuCardAllergensProps) {
  if (!menu.allergens || menu.allergens.length === 0) {
    return null;
  }
  
  return (
    <HStack gap={4} wrap="wrap">
      {menu.allergens.map((allergen) => (
        <Badge key={allergen.id} variant="warning" size="sm">
          {allergen.name}
        </Badge>
      ))}
    </HStack>
  );
}

// Rating Display Responsibility
type MenuCardRatingProps = Pick<MenuCardProps, "menu">;

function MenuCardRating({ menu }: MenuCardRatingProps) {
  return (
    <HStack gap={8}>
      <StarRating value={menu.rating} />
      <Body fontSize="b3" color="zinc" colorShade={600}>
        ({menu.reviewCount} reviews)
      </Body>
    </HStack>
  );
}

// Action Buttons Responsibility
type MenuCardActionsProps = Pick<MenuCardProps, "menu">;

function MenuCardActions({ menu }: MenuCardActionsProps) {
  const { currentUser } = useCurrentUser();
  
  if (!currentUser) {
    return null;
  }
  
  return (
    <HStack gap={8}>
      <MenuFavoriteButton 
        menuId={menu.id}
        isFavorited={menu.isFavorited}
      />
      <Button variant="outline" size="sm" asChild>
        <Link to="/cafeteria/menus/$menuId" params={{ menuId: menu.id }}>
          View Details
        </Link>
      </Button>
    </HStack>
  );
}
```

## 🔑 Key Takeaways

1. **Use Box with proper props** (padding, margin, width, etc.) instead of className
2. **Each component** should have **one clear responsibility**
3. **Compose types** using intersection types
4. **Use Pick** for prop type definitions
5. **Leverage layout components** from `@nugudi/react-components-layout`
6. **Use Typography components** (Title, Body, Emphasis) for text
7. **Test individual components** in isolation
8. **Keep components small** and focused
9. **Use VanillaExtract** for custom styles when needed

This pattern significantly improves code quality and maintainability.