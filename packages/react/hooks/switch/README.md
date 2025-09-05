# @nugudi/react-hooks-switch

React hooks for creating accessible switch components with any HTML element.

## Installation

```bash
pnpm add @nugudi/react-hooks-switch
```

## Import

```tsx
import { 
  useSwitch, 
  useToggleSwitch 
} from "@nugudi/react-hooks-switch";
```

## Overview

This package provides hooks for creating switch components (on/off toggles) with full accessibility support. It handles keyboard navigation, ARIA attributes, and works with multiple HTML elements while maintaining semantic correctness.

## Basic Usage

### useSwitch

The core hook for creating controlled switch components.

```tsx
import { useSwitch } from "@nugudi/react-hooks-switch";

function ControlledSwitch() {
  const [isOn, setIsOn] = React.useState(false);

  const { switchProps } = useSwitch({
    isSelected: isOn,
    onToggle: () => setIsOn(!isOn),
    isDisabled: false
  });

  return (
    <button {...switchProps}>
      {isOn ? "ON" : "OFF"}
    </button>
  );
}
```

### useToggleSwitch

Hook with built-in state management for uncontrolled switches.

```tsx
import { useToggleSwitch } from "@nugudi/react-hooks-switch";

function SimpleSwitch() {
  const { switchProps, isSelected } = useToggleSwitch(
    { isDisabled: false },
    false // default selected state
  );

  return (
    <button {...switchProps}>
      {isSelected ? "Enabled" : "Disabled"}
    </button>
  );
}
```

## Features

### Different Element Types

```tsx
import { useSwitch } from "@nugudi/react-hooks-switch";
import { VStack } from "@nugudi/react-components-layout";

function SwitchVariants() {
  const [isOn, setIsOn] = React.useState(false);

  // Button element (default)
  const { switchProps: buttonSwitch } = useSwitch({
    elementType: "button",
    isSelected: isOn,
    onToggle: () => setIsOn(!isOn)
  });

  // Div element
  const { switchProps: divSwitch } = useSwitch({
    elementType: "div",
    isSelected: isOn,
    onToggle: () => setIsOn(!isOn)
  });

  // Input element
  const { switchProps: inputSwitch } = useSwitch({
    elementType: "input",
    isSelected: isOn,
    onToggle: () => setIsOn(!isOn)
  });

  return (
    <VStack gap={16}>
      <button {...buttonSwitch}>
        Button Switch: {isOn ? "ON" : "OFF"}
      </button>

      <div {...divSwitch} className="custom-switch">
        Div Switch: {isOn ? "ON" : "OFF"}
      </div>

      <label>
        <input {...inputSwitch} />
        Input Switch
      </label>
    </VStack>
  );
}
```

### Disabled State

```tsx
import { useToggleSwitch } from "@nugudi/react-hooks-switch";

function DisabledSwitch() {
  const { switchProps, isSelected } = useToggleSwitch(
    { isDisabled: true },
    true
  );

  return (
    <button 
      {...switchProps}
      className="switch disabled"
    >
      {isSelected ? "ON" : "OFF"} (Disabled)
    </button>
  );
}
```

## Real-World Examples

### Settings Toggle Switch

```tsx
import { useSwitch } from "@nugudi/react-hooks-switch";
import { HStack, VStack, Body } from "@nugudi/react-components-layout";

function SettingSwitch({ label, description, value, onChange, disabled = false }) {
  const { switchProps } = useSwitch({
    isSelected: value,
    onToggle: () => onChange(!value),
    isDisabled: disabled
  });

  return (
    <HStack justify="space-between" align="center" padding={16}>
      <VStack gap={4}>
        <Body fontSize="b2">{label}</Body>
        <Body fontSize="b3" color="zinc" colorShade={600}>{description}</Body>
      </VStack>
      
      <button 
        {...switchProps}
        className={`switch-control ${value ? "on" : "off"}`}
      >
        <span className="switch-thumb" />
      </button>
    </HStack>
  );
}

// Usage
function NotificationSettings() {
  const [settings, setSettings] = React.useState({
    pushNotifications: true,
    emailAlerts: false,
    smsAlerts: false,
    marketing: true
  });

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <VStack gap={0}>
      <SettingSwitch
        label="Push Notifications"
        description="Receive push notifications on your device"
        value={settings.pushNotifications}
        onChange={(val) => updateSetting("pushNotifications", val)}
      />
      <SettingSwitch
        label="Email Alerts"
        description="Get important updates via email"
        value={settings.emailAlerts}
        onChange={(val) => updateSetting("emailAlerts", val)}
      />
      <SettingSwitch
        label="SMS Alerts"
        description="Receive text messages for urgent notifications"
        value={settings.smsAlerts}
        onChange={(val) => updateSetting("smsAlerts", val)}
      />
      <SettingSwitch
        label="Marketing Communications"
        description="Receive promotional offers and newsletters"
        value={settings.marketing}
        onChange={(val) => updateSetting("marketing", val)}
      />
    </VStack>
  );
}
```

### Theme Mode Switch

```tsx
import { useToggleSwitch } from "@nugudi/react-hooks-switch";

function ThemeSwitch() {
  const savedTheme = localStorage.getItem("theme") || "light";
  const { switchProps, isSelected } = useToggleSwitch(
    {},
    savedTheme === "dark"
  );

  React.useEffect(() => {
    const theme = isSelected ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [isSelected]);

  return (
    <div className="theme-switch-container">
      <span className="theme-icon">☀️</span>
      <button 
        {...switchProps}
        className="theme-switch"
        aria-label="Toggle dark mode"
      >
        <span className="switch-track">
          <span 
            className="switch-thumb"
            style={{
              transform: `translateX(${isSelected ? "24px" : "0"})`
            }}
          />
        </span>
      </button>
      <span className="theme-icon">🌙</span>
    </div>
  );
}
```

### Feature Flags

```tsx
import { useSwitch } from "@nugudi/react-hooks-switch";
import { VStack, HStack, Title, Badge } from "@nugudi/react-components-layout";

function FeatureFlag({ feature, onUpdate }) {
  const { switchProps } = useSwitch({
    isSelected: feature.enabled,
    onToggle: () => onUpdate(feature.id, !feature.enabled),
    isDisabled: feature.locked
  });

  return (
    <HStack justify="space-between" padding={12} className="feature-flag">
      <VStack gap={8}>
        <HStack gap={8} align="center">
          <Title level={4}>{feature.name}</Title>
          {feature.beta && <Badge tone="purple">BETA</Badge>}
          {feature.experimental && <Badge tone="warning">EXPERIMENTAL</Badge>}
        </HStack>
        <Body fontSize="b3" color="zinc" colorShade={600}>
          {feature.description}
        </Body>
      </VStack>
      
      <div className="switch-wrapper">
        <button 
          {...switchProps}
          className={`feature-switch ${feature.enabled ? "active" : ""}`}
        >
          <span className="switch-indicator" />
        </button>
        {feature.locked && (
          <Body fontSize="b3" color="zinc" colorShade={600}>
            Requires upgrade
          </Body>
        )}
      </div>
    </HStack>
  );
}

function FeatureManagement() {
  const [features, setFeatures] = React.useState([
    { id: 1, name: "Advanced Analytics", description: "Track detailed user behavior", enabled: true, beta: false, locked: false },
    { id: 2, name: "AI Suggestions", description: "Get AI-powered recommendations", enabled: false, beta: true, locked: false },
    { id: 3, name: "Custom Workflows", description: "Create automated workflows", enabled: false, experimental: true, locked: true }
  ]);

  const updateFeature = (id, enabled) => {
    setFeatures(prev => 
      prev.map(f => f.id === id ? { ...f, enabled } : f)
    );
  };

  return (
    <VStack gap={16}>
      <Title level={2}>Feature Flags</Title>
      {features.map(feature => (
        <FeatureFlag
          key={feature.id}
          feature={feature}
          onUpdate={updateFeature}
        />
      ))}
    </VStack>
  );
}
```

### Privacy Settings

```tsx
import { useSwitch } from "@nugudi/react-hooks-switch";
import { VStack, HStack, Title, Body, Divider } from "@nugudi/react-components-layout";

function PrivacySettings() {
  const [privacy, setPrivacy] = React.useState({
    profileVisible: true,
    showActivity: true,
    allowMessages: true,
    shareData: false
  });

  const updatePrivacy = (key, value) => {
    setPrivacy(prev => ({ ...prev, [key]: value }));
    // Save to backend
    savePrivacySettings({ [key]: value });
  };

  const privacyOptions = [
    {
      key: "profileVisible",
      title: "Public Profile",
      description: "Make your profile visible to everyone"
    },
    {
      key: "showActivity",
      title: "Activity Status",
      description: "Show when you're online"
    },
    {
      key: "allowMessages",
      title: "Direct Messages",
      description: "Allow others to send you messages"
    },
    {
      key: "shareData",
      title: "Data Sharing",
      description: "Share usage data for product improvement"
    }
  ];

  return (
    <VStack gap={20}>
      <Title level={2}>Privacy Settings</Title>
      
      {privacyOptions.map((option, index) => {
        const { switchProps } = useSwitch({
          isSelected: privacy[option.key],
          onToggle: () => updatePrivacy(option.key, !privacy[option.key])
        });

        return (
          <React.Fragment key={option.key}>
            {index > 0 && <Divider />}
            <HStack justify="space-between">
              <VStack gap={4} flex={1}>
                <Body fontSize="b2">
                  {option.title}
                </Body>
                <Body fontSize="b3" color="zinc" colorShade={600}>
                  {option.description}
                </Body>
              </VStack>
              
              <button 
                {...switchProps}
                className="privacy-switch"
              >
                <span className="switch-slider" />
              </button>
            </HStack>
          </React.Fragment>
        );
      })}
    </VStack>
  );
}
```

### Form Field Toggle

```tsx
import { useToggleSwitch } from "@nugudi/react-hooks-switch";
import { VStack, HStack } from "@nugudi/react-components-layout";

function ConditionalFormField() {
  const { switchProps: hasAccountSwitch, isSelected: hasAccount } = useToggleSwitch({}, false);
  const { switchProps: subscribeSwitch, isSelected: subscribe } = useToggleSwitch({}, true);

  return (
    <VStack gap={20}>
      <HStack gap={12} align="center">
        <label htmlFor="has-account">
          I have an existing account
        </label>
        <button 
          {...hasAccountSwitch}
          id="has-account"
          className="form-switch"
        >
          <span className="switch-handle" />
        </button>
      </HStack>

      {hasAccount && (
        <VStack gap={12}>
          <input 
            type="email" 
            placeholder="Email address"
            aria-label="Email"
          />
          <input 
            type="password" 
            placeholder="Password"
            aria-label="Password"
          />
        </VStack>
      )}

      {!hasAccount && (
        <VStack gap={12}>
          <input 
            type="text" 
            placeholder="Full name"
            aria-label="Full name"
          />
          <input 
            type="email" 
            placeholder="Email address"
            aria-label="Email"
          />
          <input 
            type="password" 
            placeholder="Create password"
            aria-label="Create password"
          />
        </VStack>
      )}

      <HStack gap={12} align="center">
        <button 
          {...subscribeSwitch}
          id="subscribe"
          className="form-switch"
        >
          <span className="switch-handle" />
        </button>
        <label htmlFor="subscribe">
          Subscribe to newsletter
        </label>
      </HStack>
    </VStack>
  );
}
```

### Accessibility Settings

```tsx
import { useSwitch } from "@nugudi/react-hooks-switch";
import { VStack, Title, Body } from "@nugudi/react-components-layout";

function AccessibilityPanel() {
  const [a11ySettings, setA11ySettings] = React.useState({
    highContrast: false,
    largeText: false,
    reduceMotion: false,
    screenReader: false
  });

  const updateSetting = (setting, value) => {
    setA11ySettings(prev => ({ ...prev, [setting]: value }));
    
    // Apply settings
    if (setting === "highContrast") {
      document.body.classList.toggle("high-contrast", value);
    }
    if (setting === "largeText") {
      document.body.classList.toggle("large-text", value);
    }
    if (setting === "reduceMotion") {
      document.body.classList.toggle("reduce-motion", value);
    }
  };

  const settings = [
    {
      key: "highContrast",
      label: "High Contrast",
      description: "Increase color contrast for better visibility"
    },
    {
      key: "largeText",
      label: "Large Text",
      description: "Increase font size across the application"
    },
    {
      key: "reduceMotion",
      label: "Reduce Motion",
      description: "Minimize animations and transitions"
    },
    {
      key: "screenReader",
      label: "Screen Reader Mode",
      description: "Optimize for screen reader usage"
    }
  ];

  return (
    <VStack gap={24}>
      <Title level={2}>Accessibility</Title>
      
      <VStack gap={16}>
        {settings.map(setting => {
          const { switchProps } = useSwitch({
            isSelected: a11ySettings[setting.key],
            onToggle: () => updateSetting(setting.key, !a11ySettings[setting.key])
          });

          return (
            <div key={setting.key} className="a11y-setting">
              <HStack justify="space-between" align="start">
                <VStack gap={4} flex={1}>
                  <Body fontSize="b2">
                    {setting.label}
                  </Body>
                  <Body fontSize="b3" color="zinc" colorShade={600}>
                    {setting.description}
                  </Body>
                </VStack>
                
                <button 
                  {...switchProps}
                  className="a11y-switch"
                  aria-describedby={`${setting.key}-desc`}
                >
                  <span className="switch-track">
                    <span className="switch-thumb" />
                  </span>
                </button>
              </HStack>
              <span id={`${setting.key}-desc`} className="sr-only">
                {setting.description}
              </span>
            </div>
          );
        })}
      </VStack>
    </VStack>
  );
}
```

## API Reference

### useSwitch

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `elementType` | `"button" \| "a" \| "div" \| "span" \| "input"` | `"button"` | HTML element type |
| `isSelected` | `boolean` | `false` | Current switch state |
| `onToggle` | `(isSelected: boolean) => void` | - | Toggle callback |
| `isDisabled` | `boolean` | `false` | Disabled state |
| `type` | `"button" \| "submit" \| "reset"` | `"button"` | Button type |
| `tabIndex` | `number` | `0` | Tab index |
| `onClick` | `(event) => void` | - | Click handler |
| `onKeyDown` | `(event) => void` | - | Keydown handler |
| `...props` | `ComponentProps<T>` | - | Native HTML attributes |

**Returns:**

| Property | Type | Description |
|----------|------|-------------|
| `switchProps` | `object` | Props to spread on the element with ARIA attributes |

### useToggleSwitch

Accepts all `useSwitch` parameters plus:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `defaultSelected` | `boolean` | `false` | Initial selection state |

**Returns:**

| Property | Type | Description |
|----------|------|-------------|
| `switchProps` | `object` | Props to spread on the element |
| `isSelected` | `boolean` | Current selection state |

## Accessibility Features

- **ARIA Support**: Automatic `role="switch"` and `aria-checked` attributes
- **Keyboard Navigation**: Space and Enter key support
- **Focus Management**: Proper tabIndex handling
- **Disabled State**: Removes from tab order when disabled
- **Screen Reader**: Full compatibility with assistive technologies

## Styling

The hooks provide unstyled functionality. Here's a basic CSS example:

```css
.switch-control {
  position: relative;
  width: 48px;
  height: 24px;
  background: #ccc;
  border-radius: 24px;
  border: none;
  cursor: pointer;
  transition: background 0.3s;
}

.switch-control.on {
  background: #4CAF50;
}

.switch-control:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.switch-thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  background: white;
  border-radius: 50%;
  transition: transform 0.3s;
}

.switch-control.on .switch-thumb {
  transform: translateX(24px);
}

.switch-control:focus-visible {
  outline: 2px solid #007bff;
  outline-offset: 2px;
}
```

## Best Practices

1. **Use semantic HTML** - Prefer button elements for switches
2. **Provide labels** - Always associate switches with descriptive text
3. **Show state clearly** - Make ON/OFF states visually distinct
4. **Handle keyboard** - Ensure full keyboard accessibility
5. **Add transitions** - Smooth state changes improve UX
6. **Test with screen readers** - Verify ARIA implementation
7. **Consider touch targets** - Ensure adequate size for mobile

## TypeScript Support

Full TypeScript support with exported types:

```tsx
import type { 
  BaseSwitchProps, 
  UseSwitchReturn,
  UseToggleSwitchReturn 
} from "@nugudi/react-hooks-switch";

// Type-safe configuration
const switchConfig: BaseSwitchProps<"button"> = {
  elementType: "button",
  isSelected: true,
  isDisabled: false,
  onToggle: (isSelected) => console.log(isSelected)
};

// Type-safe returns
const switchResult: UseSwitchReturn<HTMLButtonElement> = useSwitch(switchConfig);
const toggleResult: UseToggleSwitchReturn<HTMLButtonElement> = useToggleSwitch(switchConfig);
```

## License

MIT