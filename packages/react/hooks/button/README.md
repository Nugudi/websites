# @nugudi/react-hooks-button

React hooks for creating accessible, interactive button components with any HTML element.

## Installation

```bash
pnpm add @nugudi/react-hooks-button
```

## Import

```tsx
import { 
  useButton, 
  useToggleButton 
} from "@nugudi/react-hooks-button";
```

## Overview

This package provides flexible hooks for creating button components with proper accessibility, keyboard navigation, and loading states. It supports multiple HTML elements (`button`, `a`, `div`, `span`, `input`) while maintaining consistent behavior and accessibility.

## Basic Usage

### useButton

The core hook for creating accessible button interactions.

```tsx
import { useButton } from "@nugudi/react-hooks-button";

function CustomButton() {
  const { buttonProps } = useButton({
    onClick: () => console.log("Clicked!"),
    isDisabled: false,
    isLoading: false
  });

  return <button {...buttonProps}>Click Me</button>;
}
```

### Different Element Types

```tsx
import { useButton } from "@nugudi/react-hooks-button";
import { VStack } from "@nugudi/react-components-layout";

function ButtonVariants() {
  // Standard button element
  const { buttonProps: standardButton } = useButton({
    elementType: "button",
    onClick: () => console.log("Button clicked")
  });

  // Anchor element as button
  const { buttonProps: linkButton } = useButton({
    elementType: "a",
    href: "/dashboard",
    onClick: () => console.log("Link clicked")
  });

  // Div element as button
  const { buttonProps: divButton } = useButton({
    elementType: "div",
    onClick: () => console.log("Div clicked")
  });

  // Span element as button
  const { buttonProps: spanButton } = useButton({
    elementType: "span",
    onClick: () => console.log("Span clicked")
  });

  // Input element as button
  const { buttonProps: inputButton } = useButton({
    elementType: "input",
    type: "button",
    value: "Input Button",
    onClick: () => console.log("Input clicked")
  });

  return (
    <VStack gap={16}>
      <button {...standardButton}>Standard Button</button>
      <a {...linkButton}>Link Button</a>
      <div {...divButton}>Div Button</div>
      <span {...spanButton}>Span Button</span>
      <input {...inputButton} />
    </VStack>
  );
}
```

### Loading and Disabled States

```tsx
import { useButton } from "@nugudi/react-hooks-button";
import { VStack } from "@nugudi/react-components-layout";

function ButtonStates() {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    await submitForm();
    setIsLoading(false);
  };

  const { buttonProps } = useButton({
    onClick: handleSubmit,
    isLoading,
    isDisabled: false
  });

  return (
    <button {...buttonProps}>
      {isLoading ? "Processing..." : "Submit"}
    </button>
  );
}
```

## useToggleButton

Hook for creating toggle buttons with selection state.

### Basic Toggle

```tsx
import { useToggleButton } from "@nugudi/react-hooks-button";

function ToggleButton() {
  const [isSelected, setIsSelected] = React.useState(false);

  const { buttonProps, isSelected: selected } = useToggleButton(
    {
      onClick: () => setIsSelected(!isSelected)
    },
    isSelected
  );

  return (
    <button 
      {...buttonProps}
      style={{
        backgroundColor: selected ? "#007bff" : "#f0f0f0",
        color: selected ? "#fff" : "#000"
      }}
    >
      {selected ? "Selected" : "Not Selected"}
    </button>
  );
}
```

### Toggle Group

```tsx
import { useToggleButton } from "@nugudi/react-hooks-button";
import { HStack } from "@nugudi/react-components-layout";

function ToggleGroup() {
  const [selectedValue, setSelectedValue] = React.useState("option1");

  const options = [
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    { value: "option3", label: "Option 3" }
  ];

  return (
    <HStack gap={8}>
      {options.map(option => {
        const isSelected = selectedValue === option.value;
        const { buttonProps } = useToggleButton(
          {
            onClick: () => setSelectedValue(option.value)
          },
          isSelected
        );

        return (
          <button
            key={option.value}
            {...buttonProps}
            className={isSelected ? "selected" : ""}
          >
            {option.label}
          </button>
        );
      })}
    </HStack>
  );
}
```

## Real-World Examples

### Form Submit Button

```tsx
import { useButton } from "@nugudi/react-hooks-button";
import { VStack } from "@nugudi/react-components-layout";

function ContactForm() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [formData, setFormData] = React.useState({ email: "", message: "" });

  const isFormValid = formData.email && formData.message;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await submitContactForm(formData);
      alert("Form submitted successfully!");
      setFormData({ email: "", message: "" });
    } catch (error) {
      alert("Submission failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const { buttonProps: submitButton } = useButton({
    type: "submit",
    onClick: handleSubmit,
    isDisabled: !isFormValid,
    isLoading: isSubmitting
  });

  const { buttonProps: resetButton } = useButton({
    type: "reset",
    onClick: () => setFormData({ email: "", message: "" }),
    isDisabled: isSubmitting
  });

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <VStack gap={16}>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="Email"
        />
        <textarea
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder="Message"
        />
        
        <HStack gap={12}>
          <button {...submitButton}>
            {isSubmitting ? "Sending..." : "Send Message"}
          </button>
          <button {...resetButton}>
            Reset
          </button>
        </HStack>
      </VStack>
    </form>
  );
}
```

### Icon Button

```tsx
import { useButton } from "@nugudi/react-hooks-button";

function IconButton({ icon, label, onClick, variant = "primary" }) {
  const { buttonProps } = useButton({
    onClick,
    "aria-label": label
  });

  return (
    <button 
      {...buttonProps}
      className={`icon-button icon-button--${variant}`}
    >
      <span className="icon">{icon}</span>
      <span className="sr-only">{label}</span>
    </button>
  );
}

// Usage
function Toolbar() {
  return (
    <HStack gap={8}>
      <IconButton 
        icon="🔍" 
        label="Search" 
        onClick={() => openSearch()} 
      />
      <IconButton 
        icon="⚙️" 
        label="Settings" 
        onClick={() => openSettings()} 
      />
      <IconButton 
        icon="👤" 
        label="Profile" 
        onClick={() => openProfile()} 
      />
    </HStack>
  );
}
```

### Card with Clickable Area

```tsx
import { useButton } from "@nugudi/react-hooks-button";
import { VStack, HStack, Title, Body } from "@nugudi/react-components-layout";

function ClickableCard({ title, description, image, href }) {
  const { buttonProps } = useButton({
    elementType: "a",
    href,
    onKeyDown: (e) => {
      // Additional keyboard handling if needed
    }
  });

  return (
    <a {...buttonProps} className="card-link">
      <VStack gap={16} className="card">
        <img src={image} alt="" />
        <VStack gap={8}>
          <Title level={3}>{title}</Title>
          <Body fontSize="b2">{description}</Body>
        </VStack>
      </VStack>
    </a>
  );
}
```

### Toggle Button Group (Tabs)

```tsx
import { useToggleButton } from "@nugudi/react-hooks-button";
import { HStack, VStack } from "@nugudi/react-components-layout";

function TabGroup() {
  const [activeTab, setActiveTab] = React.useState("overview");
  
  const tabs = [
    { id: "overview", label: "Overview", content: <OverviewPanel /> },
    { id: "features", label: "Features", content: <FeaturesPanel /> },
    { id: "pricing", label: "Pricing", content: <PricingPanel /> },
    { id: "reviews", label: "Reviews", content: <ReviewsPanel /> }
  ];

  return (
    <VStack gap={24}>
      <HStack gap={4} role="tablist">
        {tabs.map(tab => {
          const isSelected = activeTab === tab.id;
          const { buttonProps } = useToggleButton(
            {
              onClick: () => setActiveTab(tab.id),
              role: "tab",
              "aria-selected": isSelected,
              "aria-controls": `panel-${tab.id}`
            },
            isSelected
          );

          return (
            <button
              key={tab.id}
              {...buttonProps}
              className={`tab ${isSelected ? "tab--active" : ""}`}
            >
              {tab.label}
            </button>
          );
        })}
      </HStack>

      <div role="tabpanel" id={`panel-${activeTab}`}>
        {tabs.find(tab => tab.id === activeTab)?.content}
      </div>
    </VStack>
  );
}
```

### Multi-Select Toggle Buttons

```tsx
import { useToggleButton } from "@nugudi/react-hooks-button";
import { HStack } from "@nugudi/react-components-layout";

function MultiSelectTags() {
  const [selectedTags, setSelectedTags] = React.useState<string[]>([]);
  
  const availableTags = [
    "React", "TypeScript", "JavaScript", 
    "CSS", "HTML", "Node.js", "GraphQL"
  ];

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <VStack gap={16}>
      <HStack gap={8} wrap>
        {availableTags.map(tag => {
          const isSelected = selectedTags.includes(tag);
          const { buttonProps } = useToggleButton(
            {
              onClick: () => toggleTag(tag),
              "aria-pressed": isSelected
            },
            isSelected
          );

          return (
            <button
              key={tag}
              {...buttonProps}
              className={`tag ${isSelected ? "tag--selected" : ""}`}
            >
              {tag}
            </button>
          );
        })}
      </HStack>
      
      <Body fontSize="b2">
        Selected: {selectedTags.join(", ") || "None"}
      </Body>
    </VStack>
  );
}
```

### Async Action Button

```tsx
import { useButton } from "@nugudi/react-hooks-button";

function AsyncActionButton({ action, label, successMessage, errorMessage }) {
  const [status, setStatus] = React.useState<"idle" | "loading" | "success" | "error">("idle");
  
  const handleClick = async () => {
    setStatus("loading");
    try {
      await action();
      setStatus("success");
      setTimeout(() => setStatus("idle"), 2000);
    } catch (error) {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  const { buttonProps } = useButton({
    onClick: handleClick,
    isLoading: status === "loading",
    isDisabled: status === "loading" || status === "success"
  });

  const getButtonContent = () => {
    switch (status) {
      case "loading":
        return "Processing...";
      case "success":
        return successMessage || "Success!";
      case "error":
        return errorMessage || "Error! Try again";
      default:
        return label;
    }
  };

  return (
    <button 
      {...buttonProps}
      className={`btn btn--${status}`}
    >
      {getButtonContent()}
    </button>
  );
}
```

## Accessibility Features

### Keyboard Navigation

The hooks automatically handle keyboard interactions:

- **Space**: Triggers click on non-button elements
- **Enter**: Triggers click on appropriate elements
- **Tab**: Navigate between buttons (respects disabled state)

```tsx
import { useButton } from "@nugudi/react-hooks-button";

function AccessibleButton() {
  const { buttonProps } = useButton({
    elementType: "div",
    onClick: () => console.log("Activated!"),
    tabIndex: 0, // Ensure keyboard focusable
    "aria-label": "Perform action"
  });

  return (
    <div {...buttonProps} className="custom-button">
      Custom Button Element
    </div>
  );
}
```

### ARIA Attributes

The hooks automatically manage ARIA attributes:

```tsx
function AriaExample() {
  const { buttonProps } = useButton({
    isDisabled: true,
    isLoading: false,
    "aria-describedby": "help-text"
  });

  return (
    <>
      <button {...buttonProps}>
        Submit Form
      </button>
      <span id="help-text">
        This button submits your information
      </span>
    </>
  );
}
```

## API Reference

### useButton

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `elementType` | `"button" \| "a" \| "div" \| "span" \| "input"` | `"button"` | HTML element type to render |
| `isDisabled` | `boolean` | `false` | Disabled state |
| `isLoading` | `boolean` | `false` | Loading state (also disables) |
| `type` | `"button" \| "submit" \| "reset"` | `"button"` | Button type attribute |
| `tabIndex` | `number` | `0` | Tab index for keyboard navigation |
| `onClick` | `(event) => void` | - | Click handler |
| `onKeyDown` | `(event) => void` | - | Keydown handler |
| `...props` | `ComponentProps<T>` | - | All native HTML attributes |

**Returns:**

| Property | Type | Description |
|----------|------|-------------|
| `buttonProps` | `object` | Props to spread on the element including all accessibility attributes |

### useToggleButton

Accepts all `useButton` parameters plus:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `isSelected` | `boolean` | `false` | Current selection state |

**Returns:**

| Property | Type | Description |
|----------|------|-------------|
| `buttonProps` | `object` | Props to spread on the element |
| `isSelected` | `boolean` | Current selection state |

## Element-Specific Behavior

### Button Element
- Native `disabled` attribute
- Preserves `type` attribute
- Default keyboard behavior

### Anchor Element
- Removes `href` when disabled
- Adds `role="button"`
- Custom keyboard handling

### Div/Span Elements
- Adds `role="button"`
- Full keyboard support
- ARIA attributes for accessibility

### Input Element
- Native `disabled` attribute
- Preserves input `type`
- Enhanced keyboard support

## Best Practices

1. **Use semantic HTML** - Prefer `<button>` when possible
2. **Provide accessible labels** - Always include aria-label or visible text
3. **Handle loading states** - Show visual feedback during async operations
4. **Test keyboard navigation** - Ensure all interactive elements are reachable
5. **Consider focus management** - Manage focus for dynamic content
6. **Use appropriate element types** - Choose based on semantic meaning
7. **Implement error handling** - Provide feedback for failed actions

## TypeScript Support

Full TypeScript support with proper type inference:

```tsx
import type { BaseButtonProps, ButtonElementType } from "@nugudi/react-hooks-button";

// Type-safe button props
const buttonConfig: BaseButtonProps<"button"> = {
  elementType: "button",
  isDisabled: false,
  isLoading: false,
  onClick: (e) => console.log(e.currentTarget) // HTMLButtonElement
};

// Type-safe anchor props
const anchorConfig: BaseButtonProps<"a"> = {
  elementType: "a",
  href: "/home",
  target: "_blank",
  onClick: (e) => console.log(e.currentTarget) // HTMLAnchorElement
};
```

## License

MIT