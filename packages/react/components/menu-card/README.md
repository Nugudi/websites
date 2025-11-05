# MenuCard Component

A structured menu display component that organizes menu items by category. Perfect for restaurant menus, cafeteria displays, meal planning, and food service applications.

## Installation

```bash
pnpm add @nugudi/react-components-menu-card
```

## Basic Usage

```tsx
import { MenuCard } from '@nugudi/react-components-menu-card';
import '@nugudi/react-components-menu-card/style.css';

const menuItems = [
  { name: 'Grilled Chicken', category: 'MAIN_DISH' },
  { name: 'Caesar Salad', category: 'SALAD' },
  { name: 'Tomato Soup', category: 'SOUP' },
  { name: 'White Rice', category: 'RICE' }
];

<MenuCard
  title="Today's Menu"
  subtitle="Cafeteria 1st Floor"
  timeRange="11:00 AM - 2:00 PM"
  items={menuItems}
/>
```

## With All Properties

```tsx
<MenuCard
  title="Lunch Special"
  subtitle="Main Building Restaurant"
  timeRange="12:00 PM - 3:00 PM"
  items={menuItems}
  isPackagingAvailable={true}
  variant="default"  // or "subtle"
/>
```

## Card Variants

The MenuCard component supports two visual variants:

```tsx
// Default variant - White background
<MenuCard
  title="Today's Menu"
  items={menuItems}
  variant="default"  // White background (default)
/>

// Subtle variant - Gray background
<MenuCard
  title="Today's Menu"
  items={menuItems}
  variant="subtle"  // zinc-50 background with zinc-100 border
/>
```

## Menu Categories

Organize items by predefined categories:

```tsx
// All available categories
const completeMenu = [
  // Rice dishes
  { name: 'White Rice', category: 'RICE' },
  { name: 'Brown Rice', category: 'RICE' },
  { name: 'Fried Rice', category: 'RICE' },
  
  // Main dishes
  { name: 'Spaghetti', category: 'MAIN_DISH' },
  { name: 'Ramen', category: 'MAIN_DISH' },
  { name: 'Udon', category: 'MAIN_DISH' },
  
  // Soups
  { name: 'Miso Soup', category: 'SOUP' },
  { name: 'Chicken Soup', category: 'SOUP' },
  { name: 'Vegetable Stew', category: 'SOUP' },
  
  // Main dishes
  { name: 'Grilled Salmon', category: 'MAIN_DISH' },
  { name: 'Beef Steak', category: 'MAIN_DISH' },
  { name: 'Chicken Teriyaki', category: 'MAIN_DISH' },
  
  // Side dishes
  { name: 'French Fries', category: 'SIDE_DISH' },
  { name: 'Steamed Vegetables', category: 'SIDE_DISH' },
  { name: 'Mashed Potatoes', category: 'SIDE_DISH' },
  
  // Kimchi & Pickles
  { name: 'Kimchi', category: 'KIMCHI' },
  { name: 'Pickled Radish', category: 'KIMCHI' },
  { name: 'Cucumber Pickle', category: 'KIMCHI' },
  
  // Side dishes
  { name: 'Club Sandwich', category: 'SIDE_DISH' },
  { name: 'Toast', category: 'SIDE_DISH' },
  { name: 'Bagel', category: 'SIDE_DISH' },
  
  // Salads & Fruits
  { name: 'Garden Salad', category: 'SALAD' },
  { name: 'Fruit Bowl', category: 'DESSERT' },
  { name: 'Greek Salad', category: 'SALAD' },
  
  // Drinks & Desserts
  { name: 'Coffee', category: 'DRINK' },
  { name: 'Ice Cream', category: 'DESSERT' },
  { name: 'Fresh Juice', category: 'DRINK' },

  // Others
  { name: 'Special Item', category: 'SPECIAL' }
];

<MenuCard
  title="Full Menu"
  items={completeMenu}
/>
```

## Daily Menu Display

Show different menus for each day:

```tsx
import { MenuCard } from '@nugudi/react-components-menu-card';
import { VStack, Title } from '@nugudi/react-components-layout';

function DailyMenus() {
  const weeklyMenus = {
    monday: [
      { name: 'Chicken Rice Bowl', category: 'RICE' },
      { name: 'Miso Soup', category: 'SOUP' },
      { name: 'Green Salad', category: 'SALAD' }
    ],
    tuesday: [
      { name: 'Beef Noodles', category: 'MAIN_DISH' },
      { name: 'Spring Rolls', category: 'SIDE_DISH' },
      { name: 'Fresh Fruit', category: 'DESSERT' }
    ],
    // ... other days
  };

  return (
    <VStack gap={24}>
      <Title fontSize="t1">This Week's Menu</Title>
      
      <MenuCard
        title="Monday"
        subtitle="Lunch Special"
        timeRange="11:30 AM - 2:00 PM"
        items={weeklyMenus.monday}
      />
      
      <MenuCard
        title="Tuesday"
        subtitle="Lunch Special"
        timeRange="11:30 AM - 2:00 PM"
        items={weeklyMenus.tuesday}
      />
    </VStack>
  );
}
```

## Corporate Cafeteria

Office building cafeteria menu:

```tsx
import { MenuCard } from '@nugudi/react-components-menu-card';
import { Grid, Title } from '@nugudi/react-components-layout';

function CorporateCafeteria() {
  const breakfastMenu = [
    { name: 'Scrambled Eggs', category: 'MAIN_DISH' },
    { name: 'Toast', category: 'SIDE_DISH' },
    { name: 'Hash Browns', category: 'SIDE_DISH' },
    { name: 'Orange Juice', category: 'DRINK' }
  ];

  const lunchMenu = [
    { name: 'Grilled Chicken', category: 'MAIN_DISH' },
    { name: 'White Rice', category: 'RICE' },
    { name: 'Caesar Salad', category: 'SALAD' },
    { name: 'Vegetable Soup', category: 'SOUP' },
    { name: 'Iced Tea', category: 'DRINK' }
  ];

  const dinnerMenu = [
    { name: 'Pasta Carbonara', category: 'MAIN_DISH' },
    { name: 'Garlic Bread', category: 'SIDE_DISH' },
    { name: 'Tomato Soup', category: 'SOUP' },
    { name: 'Tiramisu', category: 'DESSERT' }
  ];

  return (
    <VStack gap={32}>
      <Title fontSize="t1">Today's Menu - Building A Cafeteria</Title>
      
      <Grid templateColumns="repeat(auto-fit, minmax(300px, 1fr))" gap={20}>
        <MenuCard
          title="Breakfast"
          subtitle="1st Floor"
          timeRange="7:00 AM - 10:00 AM"
          items={breakfastMenu}
        />
        
        <MenuCard
          title="Lunch"
          subtitle="1st Floor"
          timeRange="11:30 AM - 2:00 PM"
          items={lunchMenu}
          isPackagingAvailable={true}
        />
        
        <MenuCard
          title="Dinner"
          subtitle="1st Floor"
          timeRange="5:30 PM - 8:00 PM"
          items={dinnerMenu}
        />
      </Grid>
    </VStack>
  );
}
```

## School Cafeteria

Educational institution menu display:

```tsx
import { MenuCard } from '@nugudi/react-components-menu-card';
import { VStack, HStack, Title, Badge } from '@nugudi/react-components-layout';

function SchoolCafeteria() {
  const elementaryMenu = [
    { name: 'Chicken Nuggets', category: 'MAIN_DISH' },
    { name: 'Mac and Cheese', category: 'MAIN_DISH' },
    { name: 'Apple Slices', category: 'DESSERT' },
    { name: 'Chocolate Milk', category: 'DRINK' }
  ];

  const middleSchoolMenu = [
    { name: 'Pizza', category: 'MAIN_DISH' },
    { name: 'Garden Salad', category: 'SALAD' },
    { name: 'French Fries', category: 'SIDE_DISH' },
    { name: 'Fruit Juice', category: 'DRINK' }
  ];

  return (
    <VStack gap={24}>
      <Title fontSize="t1">School Lunch Program</Title>
      
      <VStack gap={16}>
        <HStack gap={8}>
          <Title fontSize="t3">Elementary School</Title>
          <Badge tone="informative">Grades 1-5</Badge>
        </HStack>
        <MenuCard
          title="Today's Lunch"
          timeRange="11:00 AM - 12:30 PM"
          items={elementaryMenu}
        />
      </VStack>

      <VStack gap={16}>
        <HStack gap={8}>
          <Title fontSize="t3">Middle School</Title>
          <Badge tone="informative">Grades 6-8</Badge>
        </HStack>
        <MenuCard
          title="Today's Lunch"
          timeRange="12:00 PM - 1:30 PM"
          items={middleSchoolMenu}
        />
      </VStack>
    </VStack>
  );
}
```

## Restaurant Menu

Fine dining or casual restaurant menu:

```tsx
import { MenuCard } from '@nugudi/react-components-menu-card';
import { VStack, Title, Body } from '@nugudi/react-components-layout';

function RestaurantMenu() {
  const lunchSpecial = [
    { name: 'Soup of the Day', category: 'SOUP' },
    { name: 'Grilled Salmon', category: 'MAIN_DISH' },
    { name: 'Wild Rice Pilaf', category: 'RICE' },
    { name: 'Seasonal Vegetables', category: 'SIDE_DISH' },
    { name: 'House Salad', category: 'SALAD' },
    { name: 'Coffee or Tea', category: 'DRINK' }
  ];

  const dinnerSpecial = [
    { name: 'French Onion Soup', category: 'SOUP' },
    { name: 'Filet Mignon', category: 'MAIN_DISH' },
    { name: 'Truffle Risotto', category: 'RICE' },
    { name: 'Grilled Asparagus', category: 'SIDE_DISH' },
    { name: 'Caesar Salad', category: 'SALAD' },
    { name: 'Wine Selection', category: 'DRINK' },
    { name: 'Chocolate Souffle', category: 'DRINK' }
  ];

  return (
    <VStack gap={32}>
      <VStack gap={8} align="center">
        <Title fontSize="t1">The Gourmet Kitchen</Title>
        <Body fontSize="b2">Fine Dining Experience</Body>
      </VStack>

      <VStack gap={24}>
        <MenuCard
          title="Lunch Prix Fixe"
          subtitle="$35 per person"
          timeRange="12:00 PM - 3:00 PM"
          items={lunchSpecial}
        />

        <MenuCard
          title="Dinner Prix Fixe"
          subtitle="$65 per person"
          timeRange="6:00 PM - 10:00 PM"
          items={dinnerSpecial}
        />
      </VStack>
    </VStack>
  );
}
```

## Hospital Menu

Healthcare facility meal options:

```tsx
import { MenuCard } from '@nugudi/react-components-menu-card';
import { VStack, Title, Tabs, TabsList, TabsTrigger, TabsContent } from '@nugudi/react-components-layout';

function HospitalMenu() {
  const regularDiet = [
    { name: 'Chicken Breast', category: 'MAIN_DISH' },
    { name: 'Brown Rice', category: 'RICE' },
    { name: 'Steamed Broccoli', category: 'SIDE_DISH' },
    { name: 'Vegetable Soup', category: 'SOUP' },
    { name: 'Fresh Fruit', category: 'DESSERT' }
  ];

  const softDiet = [
    { name: 'Scrambled Eggs', category: 'MAIN_DISH' },
    { name: 'Mashed Potatoes', category: 'SIDE_DISH' },
    { name: 'Cream Soup', category: 'SOUP' },
    { name: 'Yogurt', category: 'DESSERT' },
    { name: 'Applesauce', category: 'DESSERT' }
  ];

  const diabeticDiet = [
    { name: 'Grilled Fish', category: 'MAIN_DISH' },
    { name: 'Quinoa', category: 'RICE' },
    { name: 'Green Salad', category: 'SALAD' },
    { name: 'Clear Broth', category: 'SOUP' },
    { name: 'Sugar-free Jello', category: 'DESSERT' }
  ];

  return (
    <VStack gap={24}>
      <Title fontSize="t1">Patient Menu Options</Title>

      <Tabs defaultValue="regular">
        <TabsList>
          <TabsTrigger value="regular">Regular</TabsTrigger>
          <TabsTrigger value="soft">Soft Diet</TabsTrigger>
          <TabsTrigger value="diabetic">Diabetic</TabsTrigger>
        </TabsList>

        <TabsContent value="regular">
          <MenuCard
            title="Regular Diet"
            subtitle="Standard Nutrition"
            items={regularDiet}
          />
        </TabsContent>

        <TabsContent value="soft">
          <MenuCard
            title="Soft Diet"
            subtitle="Easy to Digest"
            items={softDiet}
          />
        </TabsContent>

        <TabsContent value="diabetic">
          <MenuCard
            title="Diabetic Diet"
            subtitle="Low Glycemic"
            items={diabeticDiet}
          />
        </TabsContent>
      </Tabs>
    </VStack>
  );
}
```

## Buffet Menu

All-you-can-eat buffet display:

```tsx
import { MenuCard } from '@nugudi/react-components-menu-card';
import { VStack, Grid, Title, Badge } from '@nugudi/react-components-layout';

function BuffetMenu() {
  const hotBar = [
    { name: 'Fried Chicken', category: 'MAIN_DISH' },
    { name: 'BBQ Ribs', category: 'MAIN_DISH' },
    { name: 'Fried Rice', category: 'RICE' },
    { name: 'Lo Mein Noodles', category: 'MAIN_DISH' },
    { name: 'Corn on the Cob', category: 'SIDE_DISH' }
  ];

  const saladBar = [
    { name: 'Mixed Greens', category: 'SALAD' },
    { name: 'Caesar Salad', category: 'SALAD' },
    { name: 'Fruit Salad', category: 'DESSERT' },
    { name: 'Coleslaw', category: 'SALAD' },
    { name: 'Potato Salad', category: 'SIDE_DISH' }
  ];

  const dessertBar = [
    { name: 'Chocolate Cake', category: 'DESSERT' },
    { name: 'Ice Cream', category: 'DESSERT' },
    { name: 'Fresh Cookies', category: 'DESSERT' },
    { name: 'Fruit Tart', category: 'DESSERT' },
    { name: 'Pudding', category: 'DESSERT' }
  ];

  return (
    <VStack gap={24}>
      <HStack gap={12} align="center">
        <Title fontSize="t1">Grand Buffet</Title>
        <Badge tone="positive">All You Can Eat</Badge>
      </HStack>

      <Grid templateColumns="repeat(auto-fit, minmax(280px, 1fr))" gap={20}>
        <MenuCard
          title="Hot Bar"
          items={hotBar}
        />

        <MenuCard
          title="Salad Bar"
          items={saladBar}
        />

        <MenuCard
          title="Dessert Bar"
          items={dessertBar}
        />
      </Grid>
    </VStack>
  );
}
```

## Event Catering

Special event menu display:

```tsx
import { MenuCard } from '@nugudi/react-components-menu-card';
import { VStack, Title, Body, HStack, Badge } from '@nugudi/react-components-layout';

function EventCatering() {
  const cocktailHour = [
    { name: 'Shrimp Cocktail', category: 'MAIN_DISH' },
    { name: 'Cheese Platter', category: 'SIDE_DISH' },
    { name: 'Bruschetta', category: 'SIDE_DISH' },
    { name: 'Sparkling Wine', category: 'DRINK' }
  ];

  const dinnerService = [
    { name: 'Lobster Bisque', category: 'SOUP' },
    { name: 'Beef Wellington', category: 'MAIN_DISH' },
    { name: 'Garlic Mashed Potatoes', category: 'SIDE_DISH' },
    { name: 'Roasted Vegetables', category: 'SIDE_DISH' },
    { name: 'Wedding Cake', category: 'DESSERT' }
  ];

  return (
    <VStack gap={32}>
      <VStack gap={8} align="center">
        <Title fontSize="t1">Wedding Reception Menu</Title>
        <Body fontSize="b2">Saturday, June 15th, 2024</Body>
      </VStack>

      <VStack gap={24}>
        <MenuCard
          title="Cocktail Hour"
          subtitle="Grand Ballroom Foyer"
          timeRange="5:00 PM - 6:00 PM"
          items={cocktailHour}
        />

        <MenuCard
          title="Dinner Service"
          subtitle="Grand Ballroom"
          timeRange="6:30 PM - 8:30 PM"
          items={dinnerService}
        />
      </VStack>
    </VStack>
  );
}
```

## Meal Planning

Weekly meal prep display:

```tsx
import { MenuCard } from '@nugudi/react-components-menu-card';
import { VStack, Grid, Title, Body } from '@nugudi/react-components-layout';

function MealPlanning() {
  const mealPrep = {
    monday: [
      { name: 'Grilled Chicken', category: 'MAIN_DISH' },
      { name: 'Quinoa', category: 'RICE' },
      { name: 'Roasted Vegetables', category: 'SIDE_DISH' }
    ],
    tuesday: [
      { name: 'Salmon Fillet', category: 'MAIN_DISH' },
      { name: 'Sweet Potato', category: 'SIDE_DISH' },
      { name: 'Green Beans', category: 'SIDE_DISH' }
    ],
    wednesday: [
      { name: 'Turkey Meatballs', category: 'MAIN_DISH' },
      { name: 'Whole Wheat Pasta', category: 'MAIN_DISH' },
      { name: 'Marinara Sauce', category: 'SPECIAL' }
    ]
  };

  return (
    <VStack gap={24}>
      <VStack gap={8}>
        <Title fontSize="t1">Meal Prep Plan</Title>
        <Body fontSize="b2">Healthy eating made easy</Body>
      </VStack>

      <Grid templateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap={16}>
        <MenuCard
          title="Monday"
          items={mealPrep.monday}
          isPackagingAvailable={true}
        />

        <MenuCard
          title="Tuesday"
          items={mealPrep.tuesday}
          isPackagingAvailable={true}
        />

        <MenuCard
          title="Wednesday"
          items={mealPrep.wednesday}
          isPackagingAvailable={true}
        />
      </Grid>
    </VStack>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| title | `string` | - | **Required.** Main title of the menu |
| subtitle | `string` | - | Optional subtitle (location, price, etc.) |
| timeRange | `string` | - | Service time information |
| items | `MenuItem[]` | - | **Required.** Array of menu items |
| isPackagingAvailable | `boolean` | `false` | Show packaging/takeout availability |
| variant | `"default" \| "subtle"` | `"default"` | Visual style variant |

### MenuItem Type

```tsx
interface MenuItem {
  name: string;        // Name of the menu item
  category: MenuCategory;  // Category classification
}
```

### MenuCategory Type

```tsx
type MenuCategory =
  | "RICE"           // Rice dishes
  | "SOUP"           // Soups, stews, broths
  | "MAIN_DISH"      // Main entrees
  | "SIDE_DISH"      // Side dishes
  | "KIMCHI"         // Kimchi and pickled items
  | "SALAD"          // Salads
  | "DESSERT"        // Desserts
  | "DRINK"          // Beverages
  | "SPECIAL";       // Special items
```

## Styling

The component uses CSS-in-JS with vanilla-extract. Import the styles:

```tsx
import '@nugudi/react-components-menu-card/style.css';
```

## Accessibility

- Semantic HTML structure for menu items
- Clear categorization for easy scanning
- Proper heading hierarchy
- Screen reader friendly organization

## TypeScript

The component is fully typed. Import types as needed:

```tsx
import type { MenuCardProps, MenuItem, MenuCategory } from '@nugudi/react-components-menu-card';

// Menu data structure
interface DailyMenu {
  date: string;
  meals: {
    breakfast?: MenuItem[];
    lunch?: MenuItem[];
    dinner?: MenuItem[];
  };
}

// Using in component props
interface MenuDisplayProps {
  menuData: MenuItem[];
  cardProps?: Omit<MenuCardProps, 'items'>;
}
```

## Best Practices

1. **Group by category**: Items are automatically organized by category
2. **Use clear names**: Keep menu item names concise and descriptive
3. **Include time information**: Help users know when meals are available
4. **Show packaging options**: Indicate if takeout is available
5. **Consistent categorization**: Use appropriate categories for items
6. **Consider dietary info**: Can extend with allergen or dietary indicators
7. **Update regularly**: Keep menu information current
8. **Mobile-friendly**: Responsive design for all screen sizes