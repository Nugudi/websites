# @nugudi/react-hooks-toggle

A simple and versatile React hook for managing toggle state.

## Installation

```bash
pnpm add @nugudi/react-hooks-toggle
```

## Import

```tsx
import { useToggle } from "@nugudi/react-hooks-toggle";
```

## Overview

The `useToggle` hook provides a clean interface for managing boolean state with built-in toggle functionality. Perfect for switches, collapsible content, modals, theme toggles, and any UI element that requires on/off state management.

## Basic Usage

```tsx
import { useToggle } from "@nugudi/react-hooks-toggle";

function ToggleExample() {
  const { isSelected, toggle, setSelected } = useToggle({
    isSelected: false // Initial state
  });

  return (
    <div>
      <p>Current state: {isSelected ? "ON" : "OFF"}</p>
      <button onClick={toggle}>Toggle</button>
      <button onClick={() => setSelected(true)}>Turn ON</button>
      <button onClick={() => setSelected(false)}>Turn OFF</button>
    </div>
  );
}
```

## Features

### Simple Toggle

```tsx
import { useToggle } from "@nugudi/react-hooks-toggle";

function SimpleSwitch() {
  const { isSelected, toggle } = useToggle({ isSelected: false });

  return (
    <button 
      onClick={toggle}
      aria-pressed={isSelected}
    >
      {isSelected ? "✓ Enabled" : "○ Disabled"}
    </button>
  );
}
```

### Controlled Toggle

```tsx
import { useToggle } from "@nugudi/react-hooks-toggle";

function ControlledToggle() {
  const { isSelected, setSelected } = useToggle({ isSelected: false });

  const handleEnable = () => setSelected(true);
  const handleDisable = () => setSelected(false);
  const handleReset = () => setSelected(false);

  return (
    <div>
      <p>Status: {isSelected ? "Active" : "Inactive"}</p>
      <button onClick={handleEnable}>Enable</button>
      <button onClick={handleDisable}>Disable</button>
      <button onClick={handleReset}>Reset</button>
    </div>
  );
}
```

### With Initial State

```tsx
import { useToggle } from "@nugudi/react-hooks-toggle";

function RememberUserChoice() {
  // Load initial state from localStorage
  const savedPreference = localStorage.getItem("darkMode") === "true";
  
  const { isSelected, toggle } = useToggle({ 
    isSelected: savedPreference 
  });

  React.useEffect(() => {
    localStorage.setItem("darkMode", isSelected.toString());
    document.body.classList.toggle("dark-mode", isSelected);
  }, [isSelected]);

  return (
    <button onClick={toggle}>
      {isSelected ? "🌙 Dark Mode" : "☀️ Light Mode"}
    </button>
  );
}
```

## Real-World Examples

### Collapsible Content

```tsx
import { useToggle } from "@nugudi/react-hooks-toggle";
import { VStack } from "@nugudi/react-components-layout";

function CollapsibleSection({ title, children }) {
  const { isSelected: isExpanded, toggle } = useToggle({ 
    isSelected: false 
  });

  return (
    <VStack gap={12}>
      <button
        onClick={toggle}
        aria-expanded={isExpanded}
        aria-controls="content"
        className="collapse-header"
      >
        <span>{title}</span>
        <span className="icon">
          {isExpanded ? "▼" : "▶"}
        </span>
      </button>
      
      {isExpanded && (
        <div id="content" className="collapse-content">
          {children}
        </div>
      )}
    </VStack>
  );
}
```

### Modal Control

```tsx
import { useToggle } from "@nugudi/react-hooks-toggle";
import { Modal } from "@nugudi/react-components-modal";

function ModalExample() {
  const { 
    isSelected: isModalOpen, 
    toggle: toggleModal,
    setSelected: setModalOpen 
  } = useToggle({ isSelected: false });

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  return (
    <>
      <button onClick={openModal}>
        Open Modal
      </button>

      <Modal 
        isOpen={isModalOpen} 
        onClose={closeModal}
      >
        <h2>Modal Content</h2>
        <p>This is the modal body.</p>
        <button onClick={closeModal}>Close</button>
      </Modal>
    </>
  );
}
```

### Theme Switcher

```tsx
import { useToggle } from "@nugudi/react-hooks-toggle";

function ThemeSwitcher() {
  const { isSelected: isDarkMode, toggle } = useToggle({
    isSelected: window.matchMedia("(prefers-color-scheme: dark)").matches
  });

  React.useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.setAttribute("data-theme", "dark");
    } else {
      root.setAttribute("data-theme", "light");
    }
  }, [isDarkMode]);

  return (
    <button 
      onClick={toggle}
      className="theme-switcher"
      aria-label={`Switch to ${isDarkMode ? "light" : "dark"} mode`}
    >
      {isDarkMode ? "🌙" : "☀️"}
    </button>
  );
}
```

### Dropdown Menu

```tsx
import { useToggle } from "@nugudi/react-hooks-toggle";
import { VStack } from "@nugudi/react-components-layout";

function DropdownMenu({ trigger, items }) {
  const { 
    isSelected: isOpen, 
    toggle,
    setSelected: setOpen 
  } = useToggle({ isSelected: false });

  // Close on outside click
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".dropdown")) {
        setOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [isOpen, setOpen]);

  return (
    <div className="dropdown">
      <button 
        onClick={toggle}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {trigger}
      </button>
      
      {isOpen && (
        <VStack gap={4} className="dropdown-menu">
          {items.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                item.onClick();
                setOpen(false);
              }}
            >
              {item.label}
            </button>
          ))}
        </VStack>
      )}
    </div>
  );
}
```

### Show/Hide Password

```tsx
import { useToggle } from "@nugudi/react-hooks-toggle";
import { HStack } from "@nugudi/react-components-layout";

function PasswordInput() {
  const { isSelected: showPassword, toggle } = useToggle({ 
    isSelected: false 
  });

  return (
    <HStack gap={8}>
      <input
        type={showPassword ? "text" : "password"}
        placeholder="Enter password"
        aria-label="Password"
      />
      <button
        onClick={toggle}
        aria-label={showPassword ? "Hide password" : "Show password"}
      >
        {showPassword ? "👁️" : "👁️‍🗨️"}
      </button>
    </HStack>
  );
}
```

### Accordion Component

```tsx
import { useToggle } from "@nugudi/react-hooks-toggle";
import { VStack } from "@nugudi/react-components-layout";

function AccordionItem({ title, content, defaultOpen = false }) {
  const { isSelected: isOpen, toggle } = useToggle({ 
    isSelected: defaultOpen 
  });

  return (
    <div className="accordion-item">
      <button
        className="accordion-header"
        onClick={toggle}
        aria-expanded={isOpen}
      >
        <span>{title}</span>
        <span className={`chevron ${isOpen ? "rotate" : ""}`}>
          ▼
        </span>
      </button>
      
      <div
        className={`accordion-content ${isOpen ? "open" : ""}`}
        style={{
          maxHeight: isOpen ? "500px" : "0",
          overflow: "hidden",
          transition: "max-height 0.3s ease"
        }}
      >
        <div className="accordion-body">
          {content}
        </div>
      </div>
    </div>
  );
}

function Accordion({ items }) {
  return (
    <VStack gap={2}>
      {items.map((item, index) => (
        <AccordionItem
          key={index}
          title={item.title}
          content={item.content}
          defaultOpen={index === 0}
        />
      ))}
    </VStack>
  );
}
```

### Settings Toggle

```tsx
import { useToggle } from "@nugudi/react-hooks-toggle";
import { VStack, HStack, Title, Body } from "@nugudi/react-components-layout";

function SettingsPanel() {
  const notifications = useToggle({ isSelected: true });
  const emailAlerts = useToggle({ isSelected: true });
  const darkMode = useToggle({ isSelected: false });
  const autoSave = useToggle({ isSelected: true });

  const settings = [
    {
      label: "Push Notifications",
      description: "Receive push notifications",
      toggle: notifications
    },
    {
      label: "Email Alerts",
      description: "Get email notifications for important updates",
      toggle: emailAlerts
    },
    {
      label: "Dark Mode",
      description: "Use dark theme",
      toggle: darkMode
    },
    {
      label: "Auto-save",
      description: "Automatically save your work",
      toggle: autoSave
    }
  ];

  return (
    <VStack gap={20}>
      <Title level={2}>Settings</Title>
      
      {settings.map((setting, index) => (
        <HStack key={index} justify="space-between" align="center">
          <VStack gap={4}>
            <Body size={2} weight="medium">
              {setting.label}
            </Body>
            <Body size={3} tone="secondary">
              {setting.description}
            </Body>
          </VStack>
          
          <button
            onClick={setting.toggle.toggle}
            className={`switch ${setting.toggle.isSelected ? "on" : "off"}`}
            role="switch"
            aria-checked={setting.toggle.isSelected}
          >
            <span className="switch-slider" />
          </button>
        </HStack>
      ))}
    </VStack>
  );
}
```

### Sidebar Toggle

```tsx
import { useToggle } from "@nugudi/react-hooks-toggle";

function Layout({ children }) {
  const { 
    isSelected: isSidebarOpen, 
    toggle: toggleSidebar,
    setSelected: setSidebarOpen 
  } = useToggle({ isSelected: true });

  // Close sidebar on mobile by default
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setSidebarOpen]);

  return (
    <div className="layout">
      <button 
        onClick={toggleSidebar}
        className="menu-toggle"
        aria-label="Toggle sidebar"
      >
        ☰
      </button>
      
      <aside 
        className={`sidebar ${isSidebarOpen ? "open" : "closed"}`}
        aria-hidden={!isSidebarOpen}
      >
        <nav>
          <a href="/dashboard">Dashboard</a>
          <a href="/profile">Profile</a>
          <a href="/settings">Settings</a>
        </nav>
      </aside>
      
      <main className={isSidebarOpen ? "with-sidebar" : "full-width"}>
        {children}
      </main>
    </div>
  );
}
```

### Multi-Step Form

```tsx
import { useToggle } from "@nugudi/react-hooks-toggle";
import { VStack, HStack } from "@nugudi/react-components-layout";

function MultiStepForm() {
  const step1Complete = useToggle({ isSelected: false });
  const step2Complete = useToggle({ isSelected: false });
  const step3Complete = useToggle({ isSelected: false });

  const [currentStep, setCurrentStep] = React.useState(1);

  const handleStep1Submit = (data) => {
    // Validate and save step 1 data
    step1Complete.setSelected(true);
    setCurrentStep(2);
  };

  const handleStep2Submit = (data) => {
    // Validate and save step 2 data
    step2Complete.setSelected(true);
    setCurrentStep(3);
  };

  const handleStep3Submit = (data) => {
    // Validate and save step 3 data
    step3Complete.setSelected(true);
    // Submit entire form
  };

  return (
    <VStack gap={24}>
      <HStack gap={16}>
        <StepIndicator 
          number={1} 
          complete={step1Complete.isSelected}
          active={currentStep === 1}
        />
        <StepIndicator 
          number={2} 
          complete={step2Complete.isSelected}
          active={currentStep === 2}
        />
        <StepIndicator 
          number={3} 
          complete={step3Complete.isSelected}
          active={currentStep === 3}
        />
      </HStack>

      {currentStep === 1 && <Step1Form onSubmit={handleStep1Submit} />}
      {currentStep === 2 && <Step2Form onSubmit={handleStep2Submit} />}
      {currentStep === 3 && <Step3Form onSubmit={handleStep3Submit} />}
    </VStack>
  );
}
```

## API Reference

### useToggle

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `isSelected` | `boolean` | `false` | Initial toggle state |

**Returns:**

| Property | Type | Description |
|----------|------|-------------|
| `isSelected` | `boolean` | Current toggle state |
| `toggle` | `() => void` | Function to toggle the state |
| `setSelected` | `(value: boolean) => void` | Function to set specific state |

## Use Cases

- **UI Controls**: Switches, checkboxes, radio buttons
- **Content Visibility**: Collapsibles, accordions, tooltips
- **Modals & Overlays**: Dialogs, drawers, popups
- **Theme Switching**: Dark/light mode toggles
- **Settings**: Preference toggles, feature flags
- **Forms**: Show/hide fields, multi-step forms
- **Navigation**: Sidebars, mobile menus
- **Data Display**: List/grid view toggles

## Best Practices

1. **Use semantic naming** - Name your destructured values meaningfully
2. **Provide initial state** - Set appropriate default values
3. **Handle side effects** - Use useEffect for state-dependent logic
4. **Accessibility first** - Include proper ARIA attributes
5. **Persist state when needed** - Save to localStorage for user preferences
6. **Clean up listeners** - Remove event listeners when components unmount
7. **Consider performance** - Memoize callbacks if used in large lists

## TypeScript Support

Full TypeScript support with exported types:

```tsx
import type { ToggleProps, UseToggleReturn } from "@nugudi/react-hooks-toggle";

// Type-safe configuration
const config: ToggleProps = {
  isSelected: false
};

// Type-safe return value
const toggleState: UseToggleReturn = useToggle(config);

// With generics in your components
interface ToggleButtonProps {
  initialState?: boolean;
  onToggle?: (state: boolean) => void;
}

function ToggleButton({ initialState = false, onToggle }: ToggleButtonProps) {
  const { isSelected, toggle } = useToggle({ isSelected: initialState });
  
  const handleToggle = () => {
    toggle();
    onToggle?.(isSelected);
  };
  
  return <button onClick={handleToggle}>{isSelected ? "ON" : "OFF"}</button>;
}
```

## License

MIT