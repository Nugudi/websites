# Backdrop Component

A semi-transparent overlay component used to create modal backgrounds, drawer overlays, and focus traps. Commonly paired with modals, bottom sheets, and other overlay components.

## Installation

```bash
pnpm add @nugudi/react-components-backdrop
```

## Basic Usage

```tsx
import { Backdrop } from '@nugudi/react-components-backdrop';

// Basic backdrop
{isOpen && <Backdrop />}

// With click handler to close
{isOpen && (
  <Backdrop onClick={() => setIsOpen(false)} />
)}

// With children (modal/dialog content)
{isOpen && (
  <Backdrop onClick={() => setIsOpen(false)}>
    <div onClick={(e) => e.stopPropagation()}>
      Modal content here
    </div>
  </Backdrop>
)}
```

## With Modal Dialog

Creating a modal with backdrop:

```tsx
import { Backdrop } from '@nugudi/react-components-backdrop';
import { Box, VStack, Title, Body, HStack } from '@nugudi/react-components-layout';
import { Button } from '@nugudi/react-components-button';

function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <Backdrop onClick={onClose}>
      <Box
        background="whiteAlpha"
        borderRadius="lg"
        padding={24}
        maxWidth={500}
        width="full"
        onClick={(e) => e.stopPropagation()}
      >
        <VStack gap={16}>
          <Title fontSize="t2">{title}</Title>
          <Body fontSize="b2">{children}</Body>
          <HStack gap={8} justify="flex-end">
            <Button variant="neutral" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="brand">
              Confirm
            </Button>
          </HStack>
        </VStack>
      </Box>
    </Backdrop>
  );
}

// Usage
function App() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Button onClick={() => setShowModal(true)}>
        Open Modal
      </Button>
      
      <Modal 
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Confirm Action"
      >
        Are you sure you want to proceed with this action?
      </Modal>
    </>
  );
}
```

## With Bottom Sheet

Backdrop for bottom sheet components:

```tsx
import { Backdrop } from '@nugudi/react-components-backdrop';
import { BottomSheet } from '@nugudi/react-components-bottom-sheet';

function BottomSheetWithBackdrop({ isOpen, onClose, children }) {
  return (
    <>
      {isOpen && <Backdrop onClick={onClose} />}
      <BottomSheet isOpen={isOpen} onClose={onClose}>
        {children}
      </BottomSheet>
    </>
  );
}
```

## With Drawer/Sidebar

Creating a slide-out drawer:

```tsx
import { Backdrop } from '@nugudi/react-components-backdrop';
import { Box, VStack, Title } from '@nugudi/react-components-layout';

function Drawer({ isOpen, onClose, children }) {
  return (
    <>
      {isOpen && <Backdrop onClick={onClose} />}
      
      <Box
        position="fixed"
        left={isOpen ? 0 : -300}
        top={0}
        width={300}
        height="100vh"
        background="whiteAlpha"
        transition="left 0.3s ease"
        zIndex={1001}
      >
        <VStack gap={16} padding={20}>
          <Title fontSize="t2">Menu</Title>
          {children}
        </VStack>
      </Box>
    </>
  );
}
```

## Image Lightbox

Full-screen image viewer with backdrop:

```tsx
import { Backdrop } from '@nugudi/react-components-backdrop';
import { Box } from '@nugudi/react-components-layout';

function ImageLightbox({ src, alt, isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <Backdrop onClick={onClose}>
      <Box 
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="100vh"
        padding={20}
      >
        <img 
          src={src} 
          alt={alt}
          style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
          onClick={(e) => e.stopPropagation()}
        />
      </Box>
    </Backdrop>
  );
}
```

## Loading Overlay

Block interactions during loading:

```tsx
import { Backdrop } from '@nugudi/react-components-backdrop';
import { VStack, Body } from '@nugudi/react-components-layout';

function LoadingOverlay({ isLoading, message = "Loading..." }) {
  if (!isLoading) return null;

  return (
    <Backdrop>
      <VStack gap={16} align="center" justify="center" height="100vh">
        <div className="spinner" />
        <Body fontSize="b2" color="whiteAlpha">
          {message}
        </Body>
      </VStack>
    </Backdrop>
  );
}
```

## Confirmation Dialog

Alert dialog with backdrop:

```tsx
import { Backdrop } from '@nugudi/react-components-backdrop';
import { Box, VStack, Title, Body, HStack } from '@nugudi/react-components-layout';
import { Button } from '@nugudi/react-components-button';

function ConfirmDialog({ 
  isOpen, 
  title, 
  message, 
  onConfirm, 
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel"
}) {
  if (!isOpen) return null;

  return (
    <Backdrop onClick={onCancel}>
      <Box
        position="fixed"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        background="whiteAlpha"
        borderRadius="lg"
        padding={24}
        minWidth={300}
        maxWidth={400}
        onClick={(e) => e.stopPropagation()}
      >
        <VStack gap={20}>
          <VStack gap={12}>
            <Title fontSize="t3">{title}</Title>
            <Body fontSize="b2">{message}</Body>
          </VStack>
          
          <HStack gap={8} justify="flex-end">
            <Button variant="neutral" onClick={onCancel}>
              {cancelText}
            </Button>
            <Button variant="brand" onClick={onConfirm}>
              {confirmText}
            </Button>
          </HStack>
        </VStack>
      </Box>
    </Backdrop>
  );
}
```

## Focus Management

Trap focus within modal content:

```tsx
import { Backdrop } from '@nugudi/react-components-backdrop';
import { useEffect, useRef } from 'react';

function FocusTrapModal({ isOpen, onClose, children }) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Save current focus
      const previouslyFocused = document.activeElement;
      
      // Focus first focusable element in modal
      const focusable = contentRef.current?.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      (focusable as HTMLElement)?.focus();

      // Restore focus on close
      return () => {
        (previouslyFocused as HTMLElement)?.focus();
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <Backdrop onClick={onClose}>
      <div 
        ref={contentRef}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            onClose();
          }
        }}
      >
        {children}
      </div>
    </Backdrop>
  );
}
```

## Portal Rendering

Render backdrop in document body:

```tsx
import { Backdrop } from '@nugudi/react-components-backdrop';
import { createPortal } from 'react-dom';

function PortalBackdrop({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return createPortal(
    <Backdrop onClick={onClose}>
      {children}
    </Backdrop>,
    document.body
  );
}
```

## Animated Backdrop

With fade-in/fade-out animation:

```tsx
import { Backdrop } from '@nugudi/react-components-backdrop';
import { useState, useEffect } from 'react';

function AnimatedBackdrop({ isOpen, onClose, children }) {
  const [shouldRender, setShouldRender] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      requestAnimationFrame(() => {
        setIsVisible(true);
      });
    } else {
      setIsVisible(false);
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!shouldRender) return null;

  return (
    <Backdrop 
      onClick={onClose}
      style={{
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.3s ease'
      }}
    >
      {children}
    </Backdrop>
  );
}
```

## Nested Modals

Handle multiple backdrop layers:

```tsx
import { Backdrop } from '@nugudi/react-components-backdrop';
import { useState } from 'react';

function NestedModals() {
  const [showFirst, setShowFirst] = useState(false);
  const [showSecond, setShowSecond] = useState(false);

  return (
    <>
      <Button onClick={() => setShowFirst(true)}>
        Open First Modal
      </Button>

      {showFirst && (
        <Backdrop onClick={() => setShowFirst(false)} style={{ zIndex: 1000 }}>
          <Box onClick={(e) => e.stopPropagation()}>
            <VStack gap={16}>
              <Title fontSize="t2">First Modal</Title>
              <Button onClick={() => setShowSecond(true)}>
                Open Second Modal
              </Button>
            </VStack>
          </Box>
        </Backdrop>
      )}

      {showSecond && (
        <Backdrop onClick={() => setShowSecond(false)} style={{ zIndex: 1100 }}>
          <Box onClick={(e) => e.stopPropagation()}>
            <Title fontSize="t2">Second Modal</Title>
            <Button onClick={() => setShowSecond(false)}>
              Close
            </Button>
          </Box>
        </Backdrop>
      )}
    </>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| children | `React.ReactNode` | - | Content to render over the backdrop |
| ...divProps | `HTMLAttributes<HTMLDivElement>` | - | All native div attributes |

### Native HTML Props Support

The component extends all native HTML div attributes:
- `onClick`: Click event handler (commonly used for closing)
- `className`: Additional CSS classes
- `style`: Inline styles for customization
- `id`: HTML id attribute
- `aria-*`: Accessibility attributes
- `data-*`: Data attributes
- And all other div HTML attributes

## Styling

The component uses CSS-in-JS with vanilla-extract. Import the styles:

```tsx
import '@nugudi/react-components-backdrop/style.css';
```

Default styling includes:
- Semi-transparent black background
- Fixed positioning covering entire viewport
- High z-index for overlay behavior
- Centered content using flexbox

## Accessibility

- Prevents scrolling of background content when active
- Supports keyboard navigation (Escape key to close)
- Focus management should be implemented in modal content
- Screen readers announce modal presence
- Click outside to close pattern

## TypeScript

The component is fully typed. Import types as needed:

```tsx
import type { BackdropProps } from '@nugudi/react-components-backdrop';

// Using in component props
interface ModalProps {
  backdropProps?: BackdropProps;
}

// Extending backdrop props
interface CustomBackdropProps extends BackdropProps {
  intensity?: 'light' | 'medium' | 'dark';
}
```

## Best Practices

1. **Always provide close mechanism**: Click outside or close button
2. **Prevent event bubbling**: Use `stopPropagation` on modal content
3. **Handle Escape key**: Close on Escape for better UX
4. **Manage focus**: Trap focus within modal content
5. **Use Portal**: Render in document.body to avoid z-index issues
6. **Animate transitions**: Smooth fade-in/fade-out for better UX
7. **Block scroll**: Prevent background scrolling when backdrop is active
8. **Stack properly**: Handle z-index for nested modals