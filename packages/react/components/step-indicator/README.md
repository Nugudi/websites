# StepIndicator Component

A visual progress indicator that shows the current step in a multi-step process. Perfect for wizards, forms, onboarding flows, and any sequential process.

## Installation

```bash
pnpm add @nugudi/react-components-step-indicator
```

## Basic Usage

```tsx
import { StepIndicator } from '@nugudi/react-components-step-indicator';

// Basic step indicator
<StepIndicator currentStep={2} totalSteps={5} />

// Different sizes
<StepIndicator currentStep={1} totalSteps={3} size="sm" />
<StepIndicator currentStep={2} totalSteps={3} size="md" />
<StepIndicator currentStep={3} totalSteps={3} size="lg" />

// Different colors
<StepIndicator currentStep={2} totalSteps={4} color="main" />
<StepIndicator currentStep={2} totalSteps={4} color="zinc" />
```

## In Multi-Step Forms

Common use case for form wizards:

```tsx
import { StepIndicator } from '@nugudi/react-components-step-indicator';
import { VStack, Title, Body, HStack } from '@nugudi/react-components-layout';
import { Button } from '@nugudi/react-components-button';
import { useState } from 'react';

function MultiStepForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <VStack gap={24}>
      <StepIndicator 
        currentStep={currentStep} 
        totalSteps={totalSteps}
        size="md"
      />
      
      <VStack gap={16}>
        <Title fontSize="t2">Step {currentStep} of {totalSteps}</Title>
        
        {currentStep === 1 && (
          <Body fontSize="b2">Personal Information</Body>
        )}
        {currentStep === 2 && (
          <Body fontSize="b2">Contact Details</Body>
        )}
        {currentStep === 3 && (
          <Body fontSize="b2">Preferences</Body>
        )}
        {currentStep === 4 && (
          <Body fontSize="b2">Review & Submit</Body>
        )}
      </VStack>

      <HStack gap={12} justify="space-between">
        <Button 
          variant="neutral" 
          onClick={prevStep}
          disabled={currentStep === 1}
        >
          Previous
        </Button>
        <Button 
          variant="brand"
          onClick={nextStep}
          disabled={currentStep === totalSteps}
        >
          {currentStep === totalSteps ? 'Submit' : 'Next'}
        </Button>
      </HStack>
    </VStack>
  );
}
```

## Onboarding Flow

Guide users through initial setup:

```tsx
import { StepIndicator } from '@nugudi/react-components-step-indicator';
import { VStack, Title, Body } from '@nugudi/react-components-layout';

function OnboardingFlow() {
  const [step, setStep] = useState(1);
  
  const onboardingSteps = [
    { title: 'Welcome', description: 'Get started with our app' },
    { title: 'Profile Setup', description: 'Tell us about yourself' },
    { title: 'Preferences', description: 'Customize your experience' },
    { title: 'Ready to Go', description: 'Start using the app' }
  ];

  const currentStepData = onboardingSteps[step - 1];

  return (
    <VStack gap={32} align="center">
      <StepIndicator 
        currentStep={step} 
        totalSteps={onboardingSteps.length}
        size="lg"
        color="main"
      />
      
      <VStack gap={12} align="center">
        <Title fontSize="t1">{currentStepData.title}</Title>
        <Body fontSize="b2">{currentStepData.description}</Body>
      </VStack>
    </VStack>
  );
}
```

## Order Progress

Show order fulfillment stages:

```tsx
import { StepIndicator } from '@nugudi/react-components-step-indicator';
import { VStack, HStack, Title, Body, Emphasis } from '@nugudi/react-components-layout';

function OrderProgress({ orderStatus }) {
  const statusMap = {
    'confirmed': 1,
    'processing': 2,
    'shipped': 3,
    'delivered': 4
  };

  const currentStep = statusMap[orderStatus] || 1;

  return (
    <VStack gap={20}>
      <Title fontSize="t3">Order Status</Title>
      
      <StepIndicator 
        currentStep={currentStep} 
        totalSteps={4}
        size="md"
        color="main"
      />
      
      <HStack justify="space-between">
        <Emphasis fontSize="e1">Confirmed</Emphasis>
        <Emphasis fontSize="e1">Processing</Emphasis>
        <Emphasis fontSize="e1">Shipped</Emphasis>
        <Emphasis fontSize="e1">Delivered</Emphasis>
      </HStack>
    </VStack>
  );
}
```

## Task Progress

Track completion of multi-part tasks:

```tsx
import { StepIndicator } from '@nugudi/react-components-step-indicator';
import { VStack, Title, Body, Box } from '@nugudi/react-components-layout';

function TaskProgress() {
  const [completedTasks, setCompletedTasks] = useState(0);
  const totalTasks = 5;

  const tasks = [
    'Upload documents',
    'Verify information',
    'Review terms',
    'Sign agreement',
    'Submit application'
  ];

  return (
    <Box padding={24} borderRadius="lg" background="whiteAlpha">
      <VStack gap={20}>
        <Title fontSize="t3">Application Progress</Title>
        
        <StepIndicator 
          currentStep={completedTasks} 
          totalSteps={totalTasks}
          size="sm"
          color="zinc"
        />
        
        <Body fontSize="b3">
          {completedTasks} of {totalTasks} tasks completed
        </Body>
        
        <VStack gap={8}>
          {tasks.map((task, index) => (
            <HStack key={index} gap={8}>
              <input 
                type="checkbox" 
                checked={index < completedTasks}
                onChange={() => {
                  if (index < completedTasks) {
                    setCompletedTasks(index);
                  } else {
                    setCompletedTasks(index + 1);
                  }
                }}
              />
              <Body fontSize="b3">{task}</Body>
            </HStack>
          ))}
        </VStack>
      </VStack>
    </Box>
  );
}
```

## Tutorial Progress

Guide users through tutorials:

```tsx
import { StepIndicator } from '@nugudi/react-components-step-indicator';
import { VStack, Title, Body, HStack } from '@nugudi/react-components-layout';
import { Button } from '@nugudi/react-components-button';

function TutorialProgress() {
  const [currentLesson, setCurrentLesson] = useState(1);
  
  const lessons = [
    'Introduction',
    'Basic Concepts',
    'Advanced Features',
    'Best Practices',
    'Final Quiz'
  ];

  return (
    <VStack gap={24}>
      <VStack gap={12}>
        <Title fontSize="t2">Learning Progress</Title>
        <StepIndicator 
          currentStep={currentLesson} 
          totalSteps={lessons.length}
          size="md"
          color="main"
        />
      </VStack>

      <VStack gap={8}>
        <Body fontSize="b3b">Current Lesson:</Body>
        <Title fontSize="t3">{lessons[currentLesson - 1]}</Title>
      </VStack>

      <HStack gap={8}>
        {lessons.map((lesson, index) => (
          <Button
            key={index}
            size="sm"
            variant={index + 1 === currentLesson ? 'brand' : 'neutral'}
            onClick={() => setCurrentLesson(index + 1)}
          >
            {index + 1}
          </Button>
        ))}
      </HStack>
    </VStack>
  );
}
```

## Profile Completion

Show profile setup progress:

```tsx
import { StepIndicator } from '@nugudi/react-components-step-indicator';
import { VStack, Title, Body, Box } from '@nugudi/react-components-layout';

function ProfileCompletion() {
  const profileSections = [
    { name: 'Basic Info', completed: true },
    { name: 'Profile Photo', completed: true },
    { name: 'Bio', completed: true },
    { name: 'Interests', completed: false },
    { name: 'Social Links', completed: false }
  ];

  const completedCount = profileSections.filter(s => s.completed).length;

  return (
    <Box padding={20} borderRadius="lg" background="zinc">
      <VStack gap={16}>
        <Title fontSize="t3">Complete Your Profile</Title>
        
        <StepIndicator 
          currentStep={completedCount} 
          totalSteps={profileSections.length}
          size="sm"
          color="main"
        />
        
        <Body fontSize="b3">
          {Math.round((completedCount / profileSections.length) * 100)}% Complete
        </Body>
        
        <VStack gap={8}>
          {profileSections.map((section, index) => (
            <HStack key={index} gap={8}>
              <Body 
                fontSize="b3" 
                style={{ 
                  textDecoration: section.completed ? 'line-through' : 'none',
                  opacity: section.completed ? 0.6 : 1
                }}
              >
                {section.name}
              </Body>
            </HStack>
          ))}
        </VStack>
      </VStack>
    </Box>
  );
}
```

## Dynamic Steps

Handle variable number of steps:

```tsx
import { StepIndicator } from '@nugudi/react-components-step-indicator';
import { VStack, HStack, Title, Body } from '@nugudi/react-components-layout';
import { Button } from '@nugudi/react-components-button';

function DynamicStepProcess() {
  const [steps, setSteps] = useState(['Step 1', 'Step 2', 'Step 3']);
  const [currentStep, setCurrentStep] = useState(1);

  const addStep = () => {
    setSteps([...steps, `Step ${steps.length + 1}`]);
  };

  const removeStep = () => {
    if (steps.length > 1) {
      setSteps(steps.slice(0, -1));
      if (currentStep > steps.length - 1) {
        setCurrentStep(steps.length - 1);
      }
    }
  };

  return (
    <VStack gap={24}>
      <StepIndicator 
        currentStep={currentStep} 
        totalSteps={steps.length}
        size="md"
      />
      
      <VStack gap={12}>
        <Title fontSize="t3">{steps[currentStep - 1]}</Title>
        <Body fontSize="b3">
          Step {currentStep} of {steps.length}
        </Body>
      </VStack>

      <HStack gap={8}>
        <Button size="sm" onClick={addStep}>
          Add Step
        </Button>
        <Button 
          size="sm" 
          variant="neutral"
          onClick={removeStep}
          disabled={steps.length === 1}
        >
          Remove Step
        </Button>
      </HStack>

      <HStack gap={8}>
        <Button
          variant="neutral"
          onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
          disabled={currentStep === 1}
        >
          Previous
        </Button>
        <Button
          onClick={() => setCurrentStep(Math.min(steps.length, currentStep + 1))}
          disabled={currentStep === steps.length}
        >
          Next
        </Button>
      </HStack>
    </VStack>
  );
}
```

## With Navigation

Click to jump between steps:

```tsx
import { StepIndicator } from '@nugudi/react-components-step-indicator';
import { VStack, HStack, Title, Body } from '@nugudi/react-components-layout';

function NavigableSteps() {
  const [activeStep, setActiveStep] = useState(1);
  const totalSteps = 5;

  return (
    <VStack gap={24}>
      <StepIndicator 
        currentStep={activeStep} 
        totalSteps={totalSteps}
        size="lg"
        color="main"
      />
      
      <HStack gap={8} justify="center">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map(step => (
          <button
            key={step}
            onClick={() => setActiveStep(step)}
            style={{
              padding: '8px 12px',
              background: step === activeStep ? '#007bff' : '#f0f0f0',
              color: step === activeStep ? 'white' : 'black',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Step {step}
          </button>
        ))}
      </HStack>
      
      <Title fontSize="t2">Currently on Step {activeStep}</Title>
    </VStack>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| currentStep | `number` | - | **Required.** Current active step (1-based index) |
| totalSteps | `number` | - | **Required.** Total number of steps |
| size | `'sm' \| 'md' \| 'lg'` | `'md'` | Size of the step indicators |
| color | `'main' \| 'zinc'` | `'main'` | Color theme |
| className | `string` | - | Additional CSS class |
| style | `CSSProperties` | - | Inline styles |

## Styling

The component uses CSS-in-JS with vanilla-extract. Import the styles:

```tsx
import '@nugudi/react-components-step-indicator/style.css';
```

## Accessibility

- Uses semantic HTML structure
- Provides visual indication of progress
- Current step is clearly highlighted
- Can be enhanced with ARIA labels for screen readers

## TypeScript

The component is fully typed. Import types as needed:

```tsx
import type { StepIndicatorProps } from '@nugudi/react-components-step-indicator';

// Using in component props
interface WizardProps {
  stepIndicatorProps?: Omit<StepIndicatorProps, 'currentStep' | 'totalSteps'>;
}

// Custom step configuration
interface StepConfig {
  current: number;
  total: number;
  size?: StepIndicatorProps['size'];
  color?: StepIndicatorProps['color'];
}
```

## Best Practices

1. **Start from 1**: Use 1-based indexing for user-facing step numbers
2. **Show clear progress**: Always display current and total steps
3. **Provide navigation**: Allow users to go back to previous steps
4. **Save progress**: Persist step state for multi-session processes
5. **Validate before proceeding**: Ensure current step is complete before advancing
6. **Use appropriate size**: Match size to the importance and context
7. **Keep steps manageable**: Limit to 3-7 steps for better UX
8. **Show step labels**: Provide descriptive names for each step when possible