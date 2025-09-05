# Chip Component

A compact element that represents an attribute, choice, filter, or action. Chips can be interactive and include optional icons.

## Installation

```bash
pnpm add @nugudi/react-components-chip
```

## Basic Usage

```tsx
import { Chip } from '@nugudi/react-components-chip';

// Basic chip
<Chip label="Category" />

// With click handler
<Chip 
  label="Filter" 
  onClick={() => console.log('Chip clicked')}
/>

// Different sizes
<Chip label="Small" size="sm" />
<Chip label="Medium" size="md" />
```

## With Icons

Add icons to enhance visual recognition:

```tsx
import { Chip } from '@nugudi/react-components-chip';
import { TagIcon, CloseIcon, CheckIcon } from '@nugudi/assets-icons';

// Chip with icon
<Chip 
  label="Tag"
  icon={<TagIcon />}
/>

// Selected chip with check icon
<Chip 
  label="Selected"
  icon={<CheckIcon />}
  variant="primary"
/>

// Removable chip with close icon
<Chip 
  label="Removable"
  icon={<CloseIcon />}
  onClick={handleRemove}
/>
```

## Variants

Different visual styles for various use cases:

```tsx
// Default variant
<Chip label="Default" variant="default" />

// Primary variant (for selected/active state)
<Chip label="Primary" variant="primary" />

// With icons
<Chip 
  label="Active Filter"
  icon={<CheckIcon />}
  variant="primary"
/>
```

## Sizes

Two size options for different contexts:

```tsx
import { HStack } from '@nugudi/react-components-layout';

// Small size
<Chip label="Small chip" size="sm" />

// Medium size (default)
<Chip label="Medium chip" size="md" />

// Size comparison
<HStack gap={8}>
  <Chip label="Small" size="sm" />
  <Chip label="Medium" size="md" />
</HStack>
```

## As Filter Tags

Common use case for filtering and categorization:

```tsx
import { HStack, VStack } from '@nugudi/react-components-layout';

function FilterChips() {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const filters = ['All', 'Active', 'Pending', 'Completed', 'Archived'];

  const toggleFilter = (filter: string) => {
    setSelectedFilters(prev =>
      prev.includes(filter)
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  return (
    <HStack gap={8} wrap="wrap">
      {filters.map(filter => (
        <Chip
          key={filter}
          label={filter}
          variant={selectedFilters.includes(filter) ? 'primary' : 'default'}
          onClick={() => toggleFilter(filter)}
        />
      ))}
    </HStack>
  );
}
```

## As Removable Tags

For managing lists of selected items:

```tsx
import { HStack } from '@nugudi/react-components-layout';
import { CloseIcon } from '@nugudi/assets-icons';

function SelectedTags() {
  const [tags, setTags] = useState(['React', 'TypeScript', 'Node.js']);

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <HStack gap={8} wrap="wrap">
      {tags.map(tag => (
        <Chip
          key={tag}
          label={tag}
          icon={<CloseIcon />}
          onClick={() => removeTag(tag)}
          variant="primary"
        />
      ))}
    </HStack>
  );
}
```

## As Category Selectors

For choosing categories or options:

```tsx
import { Grid } from '@nugudi/react-components-layout';

function CategorySelector() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Items', icon: <GridIcon /> },
    { id: 'favorites', label: 'Favorites', icon: <HeartIcon /> },
    { id: 'recent', label: 'Recent', icon: <ClockIcon /> },
    { id: 'shared', label: 'Shared', icon: <ShareIcon /> }
  ];

  return (
    <Grid templateColumns="repeat(2, 1fr)" gap={8}>
      {categories.map(category => (
        <Chip
          key={category.id}
          label={category.label}
          icon={category.icon}
          variant={selectedCategory === category.id ? 'primary' : 'default'}
          onClick={() => setSelectedCategory(category.id)}
          size="md"
        />
      ))}
    </Grid>
  );
}
```

## As Status Indicators

Display status with appropriate styling:

```tsx
import { HStack } from '@nugudi/react-components-layout';

function StatusChips() {
  return (
    <HStack gap={8}>
      <Chip 
        label="Online"
        icon={<CircleIcon />}
        variant="primary"
      />
      <Chip 
        label="Away"
        icon={<CircleIcon />}
        variant="default"
      />
      <Chip 
        label="Offline"
        icon={<CircleIcon />}
        variant="default"
        disabled
      />
    </HStack>
  );
}
```

## Disabled State

```tsx
// Disabled chip
<Chip 
  label="Unavailable"
  disabled
/>

// Disabled with icon
<Chip 
  label="Locked"
  icon={<LockIcon />}
  disabled
/>
```

## In Forms

Using chips for multi-select inputs:

```tsx
import { VStack, HStack, Box } from '@nugudi/react-components-layout';
import { Body } from '@nugudi/react-components-layout';

function SkillsSelector() {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  
  const availableSkills = [
    'JavaScript', 'TypeScript', 'React', 'Node.js',
    'Python', 'Java', 'Go', 'Rust'
  ];

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev =>
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  return (
    <VStack gap={16}>
      <Box>
        <Body fontSize="b2">Select your skills:</Body>
        <HStack gap={8} wrap="wrap" marginTop={8}>
          {availableSkills.map(skill => (
            <Chip
              key={skill}
              label={skill}
              variant={selectedSkills.includes(skill) ? 'primary' : 'default'}
              onClick={() => toggleSkill(skill)}
              size="sm"
            />
          ))}
        </HStack>
      </Box>
      
      {selectedSkills.length > 0 && (
        <Box>
          <Body fontSize="b3">Selected: {selectedSkills.join(', ')}</Body>
        </Box>
      )}
    </VStack>
  );
}
```

## Complex Examples

### Filter Bar with Count

```tsx
import { HStack, Box } from '@nugudi/react-components-layout';
import { Body, Emphasis } from '@nugudi/react-components-layout';

function FilterBar() {
  const [filters, setFilters] = useState({
    status: 'all',
    priority: null,
    assignee: null
  });

  const filterOptions = [
    { key: 'status', value: 'all', label: 'All', count: 45 },
    { key: 'status', value: 'active', label: 'Active', count: 23 },
    { key: 'status', value: 'completed', label: 'Completed', count: 22 },
    { key: 'priority', value: 'high', label: 'High Priority', count: 5 },
    { key: 'assignee', value: 'me', label: 'Assigned to me', count: 8 }
  ];

  return (
    <HStack gap={8} wrap="wrap">
      {filterOptions.map(option => (
        <Chip
          key={`${option.key}-${option.value}`}
          label={
            <HStack gap={4}>
              <Body fontSize="b3">{option.label}</Body>
              <Emphasis fontSize="e1">({option.count})</Emphasis>
            </HStack>
          }
          variant={filters[option.key] === option.value ? 'primary' : 'default'}
          onClick={() => setFilters({...filters, [option.key]: option.value})}
          size="sm"
        />
      ))}
    </HStack>
  );
}
```

### Tag Input Field

```tsx
import { VStack, HStack, Box } from '@nugudi/react-components-layout';
import { Input } from '@nugudi/react-components-input';
import { CloseIcon } from '@nugudi/assets-icons';

function TagInput() {
  const [tags, setTags] = useState<string[]>(['react', 'typescript']);
  const [inputValue, setInputValue] = useState('');

  const addTag = (tag: string) => {
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
      setInputValue('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <VStack gap={12}>
      <Input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            addTag(inputValue.trim());
          }
        }}
        placeholder="Add a tag and press Enter"
        label="Tags"
      />
      
      <HStack gap={8} wrap="wrap">
        {tags.map(tag => (
          <Chip
            key={tag}
            label={tag}
            icon={<CloseIcon />}
            onClick={() => removeTag(tag)}
            variant="primary"
            size="sm"
          />
        ))}
      </HStack>
    </VStack>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| label | `string` | - | **Required.** The text content of the chip |
| icon | `React.ReactNode` | - | Optional icon element |
| size | `'sm' \| 'md'` | `'md'` | Chip size |
| variant | `'default' \| 'primary'` | `'default'` | Visual variant |
| ...buttonProps | `React.ButtonHTMLAttributes<HTMLButtonElement>` | - | All native button attributes |

### Native Button Props Support

The component extends all native HTML button attributes:
- `onClick`: Click event handler
- `disabled`: Disable the chip
- `type`: Button type
- `className`: Additional CSS classes
- `style`: Inline styles
- `aria-*`: Accessibility attributes
- And all other button HTML attributes

## Styling

The component uses CSS-in-JS with vanilla-extract. Import the styles:

```tsx
import '@nugudi/react-components-chip/style.css';
```

## Accessibility

- Semantic button element for interactive chips
- Keyboard navigation support (Tab, Enter, Space)
- Focus indicators for keyboard users
- Proper ARIA attributes
- Disabled state properly communicated

## TypeScript

The component is fully typed. Import types as needed:

```tsx
import type { ChipProps } from '@nugudi/react-components-chip';

// Using in component props
interface FilterProps {
  chipProps?: ChipProps;
}

// Extending chip props
interface CustomChipProps extends ChipProps {
  isActive?: boolean;
}
```

## Best Practices

1. **Keep labels concise**: Use short, clear text that fits on one line
2. **Use icons purposefully**: Icons should clarify meaning, not just decorate
3. **Indicate selection state**: Use the `primary` variant for selected chips
4. **Group related chips**: Use Layout components to organize chips logically
5. **Provide visual feedback**: Show clear hover and active states
6. **Consider touch targets**: Ensure chips are large enough for touch interfaces
7. **Handle overflow**: Use `wrap` on container for responsive layouts