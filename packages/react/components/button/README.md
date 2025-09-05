# Button Component

A flexible and accessible button component with multiple variants, sizes, and states.

## Installation

```bash
pnpm add @nugudi/react-components-button
```

## Basic Usage

```tsx
import { Button } from '@nugudi/react-components-button';

// Basic button
<Button>Click me</Button>

// With onClick handler
<Button onClick={() => console.log('Clicked!')}>
  Submit
</Button>

// Different sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>

// Different variants
<Button variant="brand">Brand</Button>
<Button variant="neutral">Neutral</Button>
```

## With Icons

The button supports both left and right icons:

```tsx
import { Button } from '@nugudi/react-components-button';
import { ArrowRightIcon, DownloadIcon } from '@nugudi/assets-icons';

// Left icon
<Button leftIcon={<DownloadIcon />}>
  Download
</Button>

// Right icon
<Button rightIcon={<ArrowRightIcon />}>
  Next Step
</Button>

// Both icons
<Button
  leftIcon={<DownloadIcon />}
  rightIcon={<ArrowRightIcon />}
>
  Download and Continue
</Button>
```

## Loading State

Display a loading spinner and disable interactions:

```tsx
// Loading state
<Button isLoading>
  Processing...
</Button>

// Loading with custom text
<Button isLoading size="lg">
  Please wait
</Button>

// Loading with icons (icons hidden during loading)
<Button isLoading leftIcon={<SaveIcon />}>
  Saving...
</Button>
```

## Color Variants

Use any color from the theme's color scale:

```tsx
// Theme colors
<Button color="zinc">Zinc</Button>
<Button color="red">Red</Button>
<Button color="yellow">Yellow</Button>
<Button color="main">Main</Button>
<Button color="blue">Blue</Button>
<Button color="purple">Purple</Button>

// With different variants
<Button variant="brand" color="blue">Brand Blue</Button>
<Button variant="neutral" color="zinc">Neutral Zinc</Button>
```

## Width Options

Control button width behavior:

```tsx
// Auto width (default) - fits content
<Button width="auto">
  Fit Content
</Button>

// Full width - spans container
<Button width="full">
  Full Width Button
</Button>

// Full width with icons
<Button width="full" leftIcon={<LoginIcon />}>
  Sign In with Google
</Button>
```

## Disabled State

```tsx
// Disabled button
<Button disabled>
  Unavailable
</Button>

// Disabled with loading
<Button disabled isLoading>
  Processing...
</Button>
```

## As Different HTML Elements

The button can be rendered as different HTML elements while maintaining styling:

```tsx
// As a link
<Button as="a" href="/next-page">
  Go to Next Page
</Button>

// As a div (rare cases)
<Button as="div" role="button" tabIndex={0}>
  Custom Element
</Button>
```

## Form Integration

```tsx
// Submit button
<form onSubmit={handleSubmit}>
  <Button type="submit">
    Submit Form
  </Button>
</form>

// Reset button
<Button type="reset">
  Clear Form
</Button>

// Regular button in form (doesn't submit)
<Button type="button" onClick={handleAction}>
  Perform Action
</Button>
```

## Complex Examples

### Action Button with Loading State

```tsx
function SaveButton() {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await saveData();
    setIsSaving(false);
  };

  return (
    <Button
      onClick={handleSave}
      isLoading={isSaving}
      leftIcon={<SaveIcon />}
      color='green'
      size='lg'
    >
      {isSaving ? 'Saving...' : 'Save Changes'}
    </Button>
  );
}
```

### Button Group

```tsx
import { HStack } from '@nugudi/react-components-layout';

<HStack gap={8}>
  <Button variant='neutral'>Cancel</Button>
  <Button variant='brand' color='blue'>
    Confirm
  </Button>
</HStack>;
```

### Conditional Rendering

```tsx
<Button
  variant={isPrimary ? 'brand' : 'neutral'}
  color={isUrgent ? 'red' : 'blue'}
  size={isMobile ? 'sm' : 'md'}
  width={isMobile ? 'full' : 'auto'}
  disabled={!isValid}
>
  {isEdit ? 'Update' : 'Create'}
</Button>
```

## Props

| Prop           | Type                                            | Default   | Description                             |
| -------------- | ----------------------------------------------- | --------- | --------------------------------------- |
| color          | `keyof typeof vars.colors.$scale`               | -         | Button color from theme colors          |
| isLoading      | `boolean`                                       | `false`   | Show loading spinner and disable button |
| leftIcon       | `React.ReactNode`                               | -         | Icon element to display on the left     |
| rightIcon      | `React.ReactNode`                               | -         | Icon element to display on the right    |
| size           | `'sm' \| 'md' \| 'lg'`                          | `'md'`    | Button size                             |
| variant        | `'brand' \| 'neutral'`                          | `'brand'` | Button variant style                    |
| width          | `'auto' \| 'full'`                              | `'auto'`  | Button width behavior                   |
| ...buttonProps | `React.ButtonHTMLAttributes<HTMLButtonElement>` | -         | All native button attributes            |

### Native Button Props Support

The component extends all native HTML button attributes:

- `type`: `'button' \| 'submit' \| 'reset'`
- `disabled`: `boolean`
- `onClick`: Click event handler
- `onFocus`, `onBlur`: Focus event handlers
- `className`: Additional CSS classes
- `style`: Inline styles
- `aria-*`: Accessibility attributes
- And all other button HTML attributes

## Sizes

Available sizes with their typical use cases:

- `sm`: Small buttons for compact interfaces
- `md`: Default size for most use cases
- `lg`: Large buttons for primary actions or mobile interfaces

## Variants

- `brand`: Primary brand-colored button for main actions
- `neutral`: Neutral-colored button for secondary actions

## Styling

The component uses CSS-in-JS with vanilla-extract. Import the styles:

```tsx
import '@nugudi/react-components-button/style.css';
```

## Accessibility

- Proper ARIA attributes for screen readers
- Keyboard navigation support (Tab, Enter, Space)
- Focus indicators for keyboard users
- Disabled state properly communicated
- Loading state announced to screen readers

## TypeScript

The component is fully typed. Import types as needed:

```tsx
import type { ButtonProps } from '@nugudi/react-components-button';

// Using in component props
interface MyComponentProps {
  buttonProps?: ButtonProps;
}

// Extending button props
interface CustomButtonProps extends ButtonProps {
  customProp?: string;
}
```

## Best Practices

1. **Use semantic variants**: Use `brand` for primary actions and `neutral` for secondary actions
2. **Provide loading feedback**: Always show loading state during async operations
3. **Use appropriate sizes**: Consider touch targets on mobile (minimum 44x44px)
4. **Add icons meaningfully**: Icons should support the button text, not replace it
5. **Handle disabled states**: Disable buttons during loading or when actions are unavailable
6. **Full width on mobile**: Consider using `width="full"` for better mobile UX
