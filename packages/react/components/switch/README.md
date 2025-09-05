# Switch Component

A flexible toggle switch component with customizable colors, sizes, and label placement options.

## Installation

```bash
pnpm add @nugudi/react-components-switch
```

## Basic Usage

```tsx
import { Switch } from '@nugudi/react-components-switch';

// Basic switch
<Switch />

// Controlled switch
const [isOn, setIsOn] = useState(false);
<Switch 
  isSelected={isOn}
  onToggle={setIsOn}
/>

// With default state
<Switch defaultSelected={true} />
```

## With Labels

Add labels with flexible placement:

```tsx
// Label at the end (default)
<Switch label="Enable notifications" />

// Label at the start
<Switch 
  label="Dark mode"
  labelPlacement="start"
/>

// With custom label element
<Switch 
  label={
    <span>
      Agree to <a href="/terms">terms and conditions</a>
    </span>
  }
/>

// Label with description
<Switch 
  label={
    <div>
      <div>Auto-save</div>
      <div style={{ fontSize: '12px', color: 'gray' }}>
        Automatically save your work
      </div>
    </div>
  }
/>
```

## Sizes

Three size options for different contexts:

```tsx
// Small
<Switch size="sm" label="Small switch" />

// Medium (default)
<Switch size="md" label="Medium switch" />

// Large
<Switch size="lg" label="Large switch" />

// Different sizes with same functionality
import { VStack } from '@nugudi/react-components-layout';

<VStack gap={16}>
  <Switch size="sm" label="Compact option" />
  <Switch size="md" label="Standard option" />
  <Switch size="lg" label="Prominent option" />
</VStack>
```

## Colors

Use any color from the theme's color scale:

```tsx
// Theme colors
<Switch color="gray" label="Gray" />
<Switch color="red" label="Red" />
<Switch color="yellow" label="Yellow" />
<Switch color="green" label="Green" />
<Switch color="blue" label="Blue" />
<Switch color="teal" label="Teal" />
<Switch color="purple" label="Purple" />
<Switch color="pink" label="Pink" />

// Different colors for different states
<Switch 
  color="green" 
  label="Active"
  defaultSelected={true}
/>
<Switch 
  color="red" 
  label="Inactive"
  defaultSelected={false}
/>
```

## Controlled vs Uncontrolled

### Uncontrolled (with defaultSelected)

```tsx
// Component manages its own state
<Switch 
  defaultSelected={false}
  onToggle={(isSelected) => console.log('Toggled:', isSelected)}
  label="Remember me"
/>
```

### Controlled (with isSelected)

```tsx
function ControlledExample() {
  const [enabled, setEnabled] = useState(false);

  return (
    <>
      <Switch 
        isSelected={enabled}
        onToggle={setEnabled}
        label="Enable feature"
      />
      <p>Feature is {enabled ? 'enabled' : 'disabled'}</p>
    </>
  );
}
```

## Disabled State

```tsx
// Disabled in off position
<Switch 
  isDisabled
  label="Unavailable option"
/>

// Disabled in on position
<Switch 
  isDisabled
  defaultSelected={true}
  label="Locked feature"
/>

// Conditionally disabled
<Switch 
  isDisabled={!hasPermission}
  label="Admin only"
/>
```

## Form Integration

```tsx
// In a settings form
function SettingsForm() {
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    autoSave: true
  });

  const handleToggle = (key: string) => (value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <form>
      <Switch 
        id="notifications"
        isSelected={settings.notifications}
        onToggle={handleToggle('notifications')}
        label="Push notifications"
      />
      
      <Switch 
        id="dark-mode"
        isSelected={settings.darkMode}
        onToggle={handleToggle('darkMode')}
        label="Dark mode"
        color="purple"
      />
      
      <Switch 
        id="auto-save"
        isSelected={settings.autoSave}
        onToggle={handleToggle('autoSave')}
        label="Auto-save"
        color="green"
      />
    </form>
  );
}
```

## Label Placement Examples

```tsx
// End placement (default) - label after switch
<Switch 
  label="Option A"
  labelPlacement="end"
/>

// Start placement - label before switch
<Switch 
  label="Option B"
  labelPlacement="start"
/>

// In a list with consistent alignment
import { VStack } from '@nugudi/react-components-layout';

<VStack gap={12}>
  <Switch label="Email notifications" labelPlacement="start" />
  <Switch label="SMS notifications" labelPlacement="start" />
  <Switch label="Push notifications" labelPlacement="start" />
</VStack>
```

## Complex Examples

### Settings Panel

```tsx
function NotificationSettings() {
  const [settings, setSettings] = useState({
    email: true,
    push: false,
    sms: false,
    marketing: true
  });

  return (
    <VStack gap={16}>
      <Title fontSize="t2">Notification Preferences</Title>
      
      <VStack gap={16}>
        <Switch 
          isSelected={settings.email}
          onToggle={(val) => setSettings({...settings, email: val})}
          label="Email notifications"
          color="blue"
          size="md"
        />
        
        <Switch 
          isSelected={settings.push}
          onToggle={(val) => setSettings({...settings, push: val})}
          label="Push notifications"
          color="green"
          size="md"
        />
        
        <Switch 
          isSelected={settings.sms}
          onToggle={(val) => setSettings({...settings, sms: val})}
          label="SMS notifications"
          color="yellow"
          size="md"
        />
        
        <Switch 
          isSelected={settings.marketing}
          onToggle={(val) => setSettings({...settings, marketing: val})}
          label={
            <VStack gap={4}>
              <Body fontSize="b2">Marketing emails</Body>
              <Emphasis fontSize="e1" color="gray">
                Receive updates about new features and promotions
              </Emphasis>
            </VStack>
          }
          color="purple"
          size="md"
        />
      </VStack>
    </VStack>
  );
}
```

### Feature Flags

```tsx
function FeatureFlags() {
  const [features, setFeatures] = useState({
    beta: false,
    experimental: false,
    debug: false
  });

  return (
    <VStack gap={12}>
      <Switch 
        isSelected={features.beta}
        onToggle={(val) => setFeatures({...features, beta: val})}
        label="Beta features"
        color="yellow"
        size="sm"
      />
      
      <Switch 
        isSelected={features.experimental}
        onToggle={(val) => setFeatures({...features, experimental: val})}
        label="Experimental features"
        color="red"
        size="sm"
        isDisabled={!features.beta}
      />
      
      <Switch 
        isSelected={features.debug}
        onToggle={(val) => setFeatures({...features, debug: val})}
        label="Debug mode"
        color="gray"
        size="sm"
      />
    </VStack>
  );
}
```

### Accessibility Settings

```tsx
function AccessibilitySettings() {
  return (
    <VStack gap={16} role="group" aria-labelledby="accessibility-heading">
      <Title fontSize="t2" id="accessibility-heading">Accessibility</Title>
      
      <Switch 
        id="high-contrast"
        label="High contrast mode"
        labelPlacement="start"
        size="lg"
        color="purple"
      />
      
      <Switch 
        id="reduce-motion"
        label="Reduce motion"
        labelPlacement="start"
        size="lg"
        color="blue"
      />
      
      <Switch 
        id="screen-reader"
        label="Optimize for screen readers"
        labelPlacement="start"
        size="lg"
        color="green"
      />
    </div>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| color | `keyof typeof vars.colors.$scale` | - | Switch color from theme colors |
| size | `'sm' \| 'md' \| 'lg'` | `'md'` | Switch size |
| isDisabled | `boolean` | `false` | Disable the switch |
| defaultSelected | `boolean` | `false` | Default selected state (uncontrolled) |
| isSelected | `boolean` | - | Selected state (controlled) |
| onToggle | `(isSelected: boolean) => void` | - | Callback when toggled |
| id | `string` | - | HTML id attribute |
| label | `React.ReactNode` | - | Label content |
| labelPlacement | `'start' \| 'end'` | `'end'` | Label position relative to switch |
| ...buttonProps | Omit<`React.ButtonHTMLAttributes`, 'onClick' \| 'disabled' \| 'type' \| 'role' \| 'id'> | - | Additional button attributes |

## Styling

The component uses CSS-in-JS with vanilla-extract. Import the styles:

```tsx
import '@nugudi/react-components-switch/style.css';
```

## Accessibility

- **ARIA role**: Uses `role="switch"` for proper semantics
- **ARIA checked**: `aria-checked` attribute reflects the state
- **ARIA disabled**: `aria-disabled` for disabled state
- **Keyboard support**: Toggle with Space or Enter keys
- **Focus management**: Visible focus indicator for keyboard navigation
- **Label association**: Proper label connection for screen readers
- **Tab navigation**: Included in tab order when not disabled

## TypeScript

The component is fully typed. Import types as needed:

```tsx
import type { SwitchProps } from '@nugudi/react-components-switch';

// Using in component props
interface SettingItemProps {
  switchProps?: SwitchProps;
}

// Extending switch props
interface CustomSwitchProps extends SwitchProps {
  category?: string;
}
```

## Best Practices

1. **Use clear labels**: Always provide a descriptive label for the switch purpose
2. **Choose appropriate colors**: Use colors that match the action (green for enable, red for danger)
3. **Group related switches**: Organize multiple switches in logical groups
4. **Provide feedback**: Show the result of toggling when not immediately obvious
5. **Consider label placement**: Use consistent placement within a group
6. **Size appropriately**: Use larger sizes for important or frequently-used toggles
7. **Handle disabled states**: Clearly indicate why a switch is disabled when necessary