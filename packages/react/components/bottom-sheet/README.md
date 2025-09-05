# BottomSheet Component

A draggable panel that slides up from the bottom of the screen. Perfect for mobile interfaces, action menus, filters, and additional content display.

## Installation

```bash
pnpm add @nugudi/react-components-bottom-sheet
```

## Basic Usage

```tsx
import { BottomSheet } from '@nugudi/react-components-bottom-sheet';
import { useState } from 'react';

function App() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        Open Bottom Sheet
      </button>
      
      <BottomSheet
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <div>Bottom sheet content</div>
      </BottomSheet>
    </>
  );
}
```

## With Snap Points

Define specific heights where the sheet will snap:

```tsx
import { BottomSheet } from '@nugudi/react-components-bottom-sheet';

<BottomSheet
  isOpen={isOpen}
  onClose={handleClose}
  snapPoints={[100, 300, 500]}
  defaultSnapPoint={300}
>
  <div>
    Content that can be viewed at different heights
  </div>
</BottomSheet>
```

## Initial Height

Set a specific initial height:

```tsx
<BottomSheet
  isOpen={isOpen}
  onClose={handleClose}
  initialHeight={400}
>
  <div>Content with 400px initial height</div>
</BottomSheet>
```

## Maximum Height Control

Limit the maximum height as percentage of viewport:

```tsx
<BottomSheet
  isOpen={isOpen}
  onClose={handleClose}
  maxHeightPercentage={75} // Max 75% of viewport height
>
  <div>Content limited to 75% viewport height</div>
</BottomSheet>
```

## Close Threshold

Customize when dragging down closes the sheet:

```tsx
<BottomSheet
  isOpen={isOpen}
  onClose={handleClose}
  closeThresholdRatio={0.5} // Close when dragged down 50% of height
>
  <div>Drag down 50% to close</div>
</BottomSheet>
```

## With Container Reference

Render within a specific container:

```tsx
import { useRef } from 'react';

function ContainedBottomSheet() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} style={{ position: 'relative', height: '100vh' }}>
      <BottomSheet
        isOpen={isOpen}
        onClose={handleClose}
        containerRef={containerRef}
      >
        <div>Sheet contained within parent div</div>
      </BottomSheet>
    </div>
  );
}
```

## Action Menu Example

Common mobile action menu pattern:

```tsx
import { BottomSheet } from '@nugudi/react-components-bottom-sheet';
import { VStack, HStack, Body } from '@nugudi/react-components-layout';

function ActionMenu({ isOpen, onClose }) {
  const actions = [
    { icon: <ShareIcon />, label: 'Share', onClick: handleShare },
    { icon: <EditIcon />, label: 'Edit', onClick: handleEdit },
    { icon: <DeleteIcon />, label: 'Delete', onClick: handleDelete }
  ];

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      initialHeight={250}
    >
      <VStack gap={0} padding={16}>
        {actions.map((action, index) => (
          <HStack
            key={index}
            gap={12}
            padding={16}
            onClick={() => {
              action.onClick();
              onClose();
            }}
            style={{ cursor: 'pointer' }}
          >
            {action.icon}
            <Body fontSize="b2">{action.label}</Body>
          </HStack>
        ))}
      </VStack>
    </BottomSheet>
  );
}
```

## Filter Panel

Use for filtering and sorting options:

```tsx
import { BottomSheet } from '@nugudi/react-components-bottom-sheet';
import { VStack, HStack, Title, Body } from '@nugudi/react-components-layout';
import { Button } from '@nugudi/react-components-button';
import { Chip } from '@nugudi/react-components-chip';

function FilterSheet({ isOpen, onClose, filters, onApply }) {
  const [selectedFilters, setSelectedFilters] = useState(filters);

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      snapPoints={[300, 500]}
      defaultSnapPoint={300}
    >
      <VStack gap={20} padding={20}>
        <Title fontSize="t3">Filters</Title>
        
        <VStack gap={12}>
          <Body fontSize="b3b">Categories</Body>
          <HStack gap={8} wrap="wrap">
            {categories.map(cat => (
              <Chip
                key={cat}
                label={cat}
                variant={selectedFilters.includes(cat) ? 'primary' : 'default'}
                onClick={() => toggleFilter(cat)}
              />
            ))}
          </HStack>
        </VStack>

        <HStack gap={8} justify="space-between">
          <Button variant="neutral" onClick={() => setSelectedFilters([])}>
            Clear
          </Button>
          <Button 
            variant="brand"
            onClick={() => {
              onApply(selectedFilters);
              onClose();
            }}
          >
            Apply Filters
          </Button>
        </HStack>
      </VStack>
    </BottomSheet>
  );
}
```

## Product Details

Expandable product information:

```tsx
import { BottomSheet } from '@nugudi/react-components-bottom-sheet';
import { VStack, HStack, Title, Body, Box } from '@nugudi/react-components-layout';

function ProductDetails({ product, isOpen, onClose }) {
  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      snapPoints={[200, 400, '90%']}
      defaultSnapPoint={400}
    >
      <VStack gap={16} padding={20}>
        <Box 
          width={40}
          height={4}
          backgroundColor="gray"
          borderRadius="full"
          margin="0 auto"
        />
        
        <HStack gap={16}>
          <img src={product.image} alt={product.name} width={80} height={80} />
          <VStack gap={8}>
            <Title fontSize="t3">{product.name}</Title>
            <Body fontSize="b2">${product.price}</Body>
          </VStack>
        </HStack>

        <Body fontSize="b2">{product.description}</Body>
        
        <Button width="full">Add to Cart</Button>
      </VStack>
    </BottomSheet>
  );
}
```

## Search Results

Display search results in a sheet:

```tsx
import { BottomSheet } from '@nugudi/react-components-bottom-sheet';
import { VStack, HStack, Title, Body, Divider } from '@nugudi/react-components-layout';
import { Input } from '@nugudi/react-components-input';

function SearchSheet({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      maxHeightPercentage={80}
      initialHeight={500}
    >
      <VStack gap={16} padding={20}>
        <Input
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          size="full"
        />
        
        <Divider />
        
        <VStack gap={12}>
          {results.map((result, index) => (
            <HStack key={index} gap={12} padding={12}>
              <Body fontSize="b2">{result.title}</Body>
            </HStack>
          ))}
        </VStack>
      </VStack>
    </BottomSheet>
  );
}
```

## Media Picker

Select photos or videos:

```tsx
import { BottomSheet } from '@nugudi/react-components-bottom-sheet';
import { Grid, Box, Title } from '@nugudi/react-components-layout';

function MediaPicker({ isOpen, onClose, onSelect }) {
  const mediaItems = [/* ... your media items ... */];

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      snapPoints={[300, 600]}
      defaultSnapPoint={300}
    >
      <Box padding={20}>
        <Title fontSize="t3" marginBottom={16}>Select Media</Title>
        
        <Grid templateColumns="repeat(3, 1fr)" gap={8}>
          {mediaItems.map((item, index) => (
            <Box
              key={index}
              onClick={() => {
                onSelect(item);
                onClose();
              }}
              style={{ cursor: 'pointer' }}
            >
              <img src={item.thumbnail} alt="" style={{ width: '100%' }} />
            </Box>
          ))}
        </Grid>
      </Box>
    </BottomSheet>
  );
}
```

## Settings Panel

App settings in a bottom sheet:

```tsx
import { BottomSheet } from '@nugudi/react-components-bottom-sheet';
import { VStack, HStack, Title, Body, Divider } from '@nugudi/react-components-layout';
import { Switch } from '@nugudi/react-components-switch';

function SettingsSheet({ isOpen, onClose, settings, onUpdate }) {
  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      initialHeight={400}
    >
      <VStack gap={0} padding={20}>
        <Title fontSize="t3" marginBottom={20}>Settings</Title>
        
        <HStack justify="space-between" padding="12px 0">
          <Body fontSize="b2">Notifications</Body>
          <Switch
            isSelected={settings.notifications}
            onToggle={(val) => onUpdate({ notifications: val })}
          />
        </HStack>
        
        <Divider />
        
        <HStack justify="space-between" padding="12px 0">
          <Body fontSize="b2">Dark Mode</Body>
          <Switch
            isSelected={settings.darkMode}
            onToggle={(val) => onUpdate({ darkMode: val })}
          />
        </HStack>
        
        <Divider />
        
        <HStack justify="space-between" padding="12px 0">
          <Body fontSize="b2">Auto-save</Body>
          <Switch
            isSelected={settings.autoSave}
            onToggle={(val) => onUpdate({ autoSave: val })}
          />
        </HStack>
      </VStack>
    </BottomSheet>
  );
}
```

## With Backdrop

Combine with backdrop for better focus:

```tsx
import { BottomSheet } from '@nugudi/react-components-bottom-sheet';
import { Backdrop } from '@nugudi/react-components-backdrop';

function SheetWithBackdrop({ isOpen, onClose, children }) {
  return (
    <>
      {isOpen && <Backdrop onClick={onClose} />}
      <BottomSheet
        isOpen={isOpen}
        onClose={onClose}
      >
        {children}
      </BottomSheet>
    </>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| isOpen | `boolean` | - | **Required.** Controls sheet visibility |
| onClose | `() => void` | - | **Required.** Callback when sheet should close |
| children | `React.ReactNode` | - | Content to display in the sheet |
| initialHeight | `number` | - | Initial height in pixels |
| snapPoints | `number[]` | - | Array of heights where sheet will snap |
| defaultSnapPoint | `number` | - | Default snap point from snapPoints array |
| containerRef | `React.RefObject<HTMLElement \| null>` | - | Container element reference |
| maxHeightPercentage | `number` | `90` | Maximum height as viewport percentage |
| closeThresholdRatio | `number` | `0.3` | Drag ratio to trigger close |

## Gestures

The component supports:
- **Drag to resize**: Drag the sheet up and down
- **Snap points**: Sheet snaps to predefined heights
- **Drag to close**: Drag down past threshold to close
- **Smooth animations**: All transitions are animated

## Styling

The component uses CSS-in-JS with vanilla-extract. Import the styles:

```tsx
import '@nugudi/react-components-bottom-sheet/style.css';
```

## Accessibility

- Keyboard accessible (Escape to close)
- Focus management when opened/closed
- ARIA attributes for screen readers
- Touch-friendly drag handles

## TypeScript

The component is fully typed. Import types as needed:

```tsx
import type { BottomSheetProps } from '@nugudi/react-components-bottom-sheet';

// Using in component props
interface SheetContentProps {
  sheetProps?: Omit<BottomSheetProps, 'isOpen' | 'onClose'>;
}
```

## Best Practices

1. **Provide drag handle**: Visual indicator for draggable area
2. **Set appropriate snap points**: Common heights for different content states
3. **Handle backdrop**: Use backdrop to prevent interaction with background
4. **Mobile-first design**: Optimize for touch interactions
5. **Limit initial height**: Start with minimal height, allow expansion
6. **Smooth animations**: Ensure all transitions are smooth
7. **Prevent scroll conflicts**: Handle scroll within sheet content properly
8. **Clear close affordance**: Make it obvious how to dismiss the sheet