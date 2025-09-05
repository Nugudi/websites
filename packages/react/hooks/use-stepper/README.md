# @nugudi/react-hooks-use-stepper

A React hook for managing multi-step workflows, wizards, and sequential processes.

## Installation

```bash
pnpm add @nugudi/react-hooks-use-stepper
```

## Import

```tsx
import { useStepper } from "@nugudi/react-hooks-use-stepper";
```

## Overview

The `useStepper` hook provides a clean and type-safe way to manage multi-step processes in React applications. It handles step navigation, conditional rendering, and maintains the current step state, making it perfect for forms, onboarding flows, checkout processes, and wizards.

## Basic Usage

```tsx
import { useStepper } from "@nugudi/react-hooks-use-stepper";

const STEPS = ["personal", "address", "payment", "review"] as const;

function MultiStepForm() {
  const { Stepper, Step, step, setStep } = useStepper(STEPS);

  return (
    <div>
      <h2>Current Step: {step}</h2>
      
      <Stepper>
        <Step name="personal">
          <PersonalInfoForm onNext={() => setStep("address")} />
        </Step>
        <Step name="address">
          <AddressForm 
            onNext={() => setStep("payment")}
            onBack={() => setStep("personal")}
          />
        </Step>
        <Step name="payment">
          <PaymentForm 
            onNext={() => setStep("review")}
            onBack={() => setStep("address")}
          />
        </Step>
        <Step name="review">
          <ReviewForm 
            onBack={() => setStep("payment")}
            onSubmit={handleSubmit}
          />
        </Step>
      </Stepper>
    </div>
  );
}
```

## Features

### Type-Safe Steps

```tsx
import { useStepper } from "@nugudi/react-hooks-use-stepper";

// Define steps as const for type safety
const ONBOARDING_STEPS = [
  "welcome",
  "profile_setup", 
  "preferences",
  "confirmation"
] as const;

// TypeScript will enforce these exact step names
type OnboardingStep = typeof ONBOARDING_STEPS[number];

function OnboardingFlow() {
  const { Stepper, Step, step, setStep } = useStepper(ONBOARDING_STEPS);

  // TypeScript ensures only valid step names
  const goToProfile = () => setStep("profile_setup"); // ✅ Valid
  // const goToInvalid = () => setStep("invalid"); // ❌ Type error

  return (
    <Stepper>
      <Step name="welcome">
        <WelcomeScreen />
      </Step>
      <Step name="profile_setup">
        <ProfileSetup />
      </Step>
      <Step name="preferences">
        <PreferencesForm />
      </Step>
      <Step name="confirmation">
        <ConfirmationScreen />
      </Step>
    </Stepper>
  );
}
```

### Navigation Controls

```tsx
import { useStepper } from "@nugudi/react-hooks-use-stepper";
import { HStack, Button } from "@nugudi/react-components-layout";

const WIZARD_STEPS = ["intro", "details", "summary"] as const;

function WizardWithControls() {
  const { Stepper, Step, step, setStep } = useStepper(WIZARD_STEPS);
  
  const currentIndex = WIZARD_STEPS.indexOf(step);
  const isFirstStep = currentIndex === 0;
  const isLastStep = currentIndex === WIZARD_STEPS.length - 1;
  
  const goNext = () => {
    if (!isLastStep) {
      setStep(WIZARD_STEPS[currentIndex + 1]);
    }
  };
  
  const goBack = () => {
    if (!isFirstStep) {
      setStep(WIZARD_STEPS[currentIndex - 1]);
    }
  };

  return (
    <div>
      <Stepper>
        <Step name="intro">
          <IntroContent />
        </Step>
        <Step name="details">
          <DetailsContent />
        </Step>
        <Step name="summary">
          <SummaryContent />
        </Step>
      </Stepper>
      
      <HStack gap={12} justify="space-between">
        <Button 
          onClick={goBack} 
          disabled={isFirstStep}
          variant="secondary"
        >
          Previous
        </Button>
        <Button 
          onClick={goNext}
          disabled={isLastStep}
        >
          {isLastStep ? "Finish" : "Next"}
        </Button>
      </HStack>
    </div>
  );
}
```

## Real-World Examples

### User Registration Flow

```tsx
import { useStepper } from "@nugudi/react-hooks-use-stepper";
import { VStack, HStack, Title, Body } from "@nugudi/react-components-layout";

const REGISTRATION_STEPS = [
  "account_type",
  "personal_info",
  "email_verification", 
  "password_setup",
  "profile_photo",
  "welcome"
] as const;

function RegistrationFlow() {
  const { Stepper, Step, step, setStep } = useStepper(REGISTRATION_STEPS);
  const [userData, setUserData] = React.useState({});
  
  // Progress indicator
  const currentIndex = REGISTRATION_STEPS.indexOf(step);
  const progress = ((currentIndex + 1) / REGISTRATION_STEPS.length) * 100;

  return (
    <VStack gap={24}>
      {/* Progress Bar */}
      <div className="progress-container">
        <div 
          className="progress-bar"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      {/* Step Counter */}
      <Body fontSize="b2" color="zinc" colorShade={600}>
        Step {currentIndex + 1} of {REGISTRATION_STEPS.length}
      </Body>
      
      {/* Step Content */}
      <Stepper>
        <Step name="account_type">
          <VStack gap={16}>
            <Title level={2}>Choose Account Type</Title>
            <HStack gap={12}>
              <button 
                onClick={() => {
                  setUserData({ ...userData, type: "personal" });
                  setStep("personal_info");
                }}
                className="account-type-card"
              >
                Personal Account
              </button>
              <button 
                onClick={() => {
                  setUserData({ ...userData, type: "business" });
                  setStep("personal_info");
                }}
                className="account-type-card"
              >
                Business Account
              </button>
            </HStack>
          </VStack>
        </Step>
        
        <Step name="personal_info">
          <PersonalInfoForm
            onSubmit={(data) => {
              setUserData({ ...userData, ...data });
              setStep("email_verification");
            }}
            onBack={() => setStep("account_type")}
          />
        </Step>
        
        <Step name="email_verification">
          <EmailVerification
            email={userData.email}
            onVerified={() => setStep("password_setup")}
            onBack={() => setStep("personal_info")}
          />
        </Step>
        
        <Step name="password_setup">
          <PasswordSetup
            onComplete={(password) => {
              setUserData({ ...userData, password });
              setStep("profile_photo");
            }}
            onBack={() => setStep("email_verification")}
          />
        </Step>
        
        <Step name="profile_photo">
          <ProfilePhotoUpload
            onComplete={(photo) => {
              setUserData({ ...userData, photo });
              setStep("welcome");
            }}
            onSkip={() => setStep("welcome")}
            onBack={() => setStep("password_setup")}
          />
        </Step>
        
        <Step name="welcome">
          <WelcomeScreen
            userData={userData}
            onGetStarted={() => {
              // Complete registration
              completeRegistration(userData);
            }}
          />
        </Step>
      </Stepper>
    </VStack>
  );
}
```

### Checkout Process

```tsx
import { useStepper } from "@nugudi/react-hooks-use-stepper";
import { VStack, HStack, Title, Body } from "@nugudi/react-components-layout";

const CHECKOUT_STEPS = [
  "cart_review",
  "shipping_address",
  "shipping_method",
  "payment_info",
  "order_review",
  "confirmation"
] as const;

function CheckoutFlow({ cart }) {
  const { Stepper, Step, step, setStep } = useStepper(CHECKOUT_STEPS);
  const [orderData, setOrderData] = React.useState({
    items: cart.items,
    shipping: {},
    payment: {},
    shippingMethod: null
  });

  // Step indicators
  const stepIndicators = CHECKOUT_STEPS.map((s, index) => ({
    name: s.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase()),
    completed: CHECKOUT_STEPS.indexOf(step) > index,
    active: step === s
  }));

  return (
    <VStack gap={32}>
      {/* Step Indicators */}
      <HStack gap={8} justify="center">
        {stepIndicators.map((indicator, index) => (
          <React.Fragment key={indicator.name}>
            <div 
              className={`
                step-indicator 
                ${indicator.completed ? "completed" : ""}
                ${indicator.active ? "active" : ""}
              `}
            >
              {indicator.completed ? "✓" : index + 1}
            </div>
            {index < stepIndicators.length - 1 && (
              <div className="step-connector" />
            )}
          </React.Fragment>
        ))}
      </HStack>
      
      {/* Step Labels */}
      <HStack gap={16} justify="center">
        {stepIndicators.map(indicator => (
          <Body 
            key={indicator.name}
            fontSize="b3"
            color={indicator.active ? "main" : "zinc"}
            colorShade={indicator.active ? 500 : 600}
          >
            {indicator.name}
          </Body>
        ))}
      </HStack>
      
      {/* Step Content */}
      <Stepper>
        <Step name="cart_review">
          <CartReview
            items={orderData.items}
            onContinue={() => setStep("shipping_address")}
            onUpdateCart={(items) => {
              setOrderData({ ...orderData, items });
            }}
          />
        </Step>
        
        <Step name="shipping_address">
          <ShippingAddressForm
            onSubmit={(address) => {
              setOrderData({ ...orderData, shipping: address });
              setStep("shipping_method");
            }}
            onBack={() => setStep("cart_review")}
          />
        </Step>
        
        <Step name="shipping_method">
          <ShippingMethodSelection
            address={orderData.shipping}
            onSelect={(method) => {
              setOrderData({ ...orderData, shippingMethod: method });
              setStep("payment_info");
            }}
            onBack={() => setStep("shipping_address")}
          />
        </Step>
        
        <Step name="payment_info">
          <PaymentForm
            onSubmit={(payment) => {
              setOrderData({ ...orderData, payment });
              setStep("order_review");
            }}
            onBack={() => setStep("shipping_method")}
          />
        </Step>
        
        <Step name="order_review">
          <OrderReview
            order={orderData}
            onConfirm={async () => {
              const orderId = await submitOrder(orderData);
              setOrderData({ ...orderData, orderId });
              setStep("confirmation");
            }}
            onBack={() => setStep("payment_info")}
          />
        </Step>
        
        <Step name="confirmation">
          <OrderConfirmation
            orderId={orderData.orderId}
            orderDetails={orderData}
          />
        </Step>
      </Stepper>
    </VStack>
  );
}
```

### Survey/Quiz Flow

```tsx
import { useStepper } from "@nugudi/react-hooks-use-stepper";
import { VStack, HStack, Title, Body, Button } from "@nugudi/react-components-layout";

const SURVEY_STEPS = [
  "intro",
  "demographics",
  "experience",
  "preferences",
  "feedback",
  "thank_you"
] as const;

function SurveyFlow() {
  const { Stepper, Step, step, setStep } = useStepper(SURVEY_STEPS);
  const [responses, setResponses] = React.useState({});
  const [startTime] = React.useState(Date.now());
  
  const saveResponse = (stepData) => {
    setResponses({ ...responses, [step]: stepData });
  };

  return (
    <VStack gap={24}>
      <Stepper>
        <Step name="intro">
          <VStack gap={16} align="center">
            <Title level={1}>Customer Satisfaction Survey</Title>
            <Body fontSize="b2">
              Help us improve by sharing your experience. 
              This survey takes about 5 minutes.
            </Body>
            <Button onClick={() => setStep("demographics")}>
              Start Survey
            </Button>
          </VStack>
        </Step>
        
        <Step name="demographics">
          <VStack gap={20}>
            <Title level={2}>Tell us about yourself</Title>
            <DemographicsForm
              onSubmit={(data) => {
                saveResponse(data);
                setStep("experience");
              }}
            />
          </VStack>
        </Step>
        
        <Step name="experience">
          <VStack gap={20}>
            <Title level={2}>Rate your experience</Title>
            <ExperienceRating
              onSubmit={(data) => {
                saveResponse(data);
                setStep("preferences");
              }}
              onBack={() => setStep("demographics")}
            />
          </VStack>
        </Step>
        
        <Step name="preferences">
          <VStack gap={20}>
            <Title level={2}>Your preferences</Title>
            <PreferencesForm
              onSubmit={(data) => {
                saveResponse(data);
                setStep("feedback");
              }}
              onBack={() => setStep("experience")}
            />
          </VStack>
        </Step>
        
        <Step name="feedback">
          <VStack gap={20}>
            <Title level={2}>Additional feedback</Title>
            <FeedbackForm
              onSubmit={(data) => {
                saveResponse(data);
                const duration = Date.now() - startTime;
                submitSurvey({ ...responses, feedback: data, duration });
                setStep("thank_you");
              }}
              onBack={() => setStep("preferences")}
            />
          </VStack>
        </Step>
        
        <Step name="thank_you">
          <VStack gap={16} align="center">
            <Title level={1}>Thank You!</Title>
            <Body fontSize="b2">
              Your feedback helps us serve you better.
            </Body>
            <Button onClick={() => window.location.href = "/"}>
              Return to Home
            </Button>
          </VStack>
        </Step>
      </Stepper>
    </VStack>
  );
}
```

### Tutorial/Onboarding

```tsx
import { useStepper } from "@nugudi/react-hooks-use-stepper";
import { VStack, HStack, Title, Body, Button } from "@nugudi/react-components-layout";

const TUTORIAL_STEPS = [
  "welcome",
  "dashboard_overview",
  "create_project",
  "invite_team",
  "settings",
  "complete"
] as const;

function InteractiveTutorial() {
  const { Stepper, Step, step, setStep } = useStepper(TUTORIAL_STEPS);
  const [completedSteps, setCompletedSteps] = React.useState<string[]>([]);
  
  const markComplete = (stepName: string) => {
    setCompletedSteps([...completedSteps, stepName]);
  };
  
  const currentIndex = TUTORIAL_STEPS.indexOf(step);
  const canSkip = currentIndex < TUTORIAL_STEPS.length - 1;

  return (
    <div className="tutorial-overlay">
      <VStack gap={24} className="tutorial-content">
        {/* Skip button */}
        {canSkip && (
          <HStack justify="flex-end">
            <Button 
              variant="ghost"
              onClick={() => setStep("complete")}
            >
              Skip Tutorial
            </Button>
          </HStack>
        )}
        
        <Stepper>
          <Step name="welcome">
            <VStack gap={16} align="center">
              <Title level={1}>Welcome to AppName!</Title>
              <Body fontSize="b2">
                Let's take a quick tour to get you started.
              </Body>
              <Button 
                onClick={() => {
                  markComplete("welcome");
                  setStep("dashboard_overview");
                }}
              >
                Let's Go!
              </Button>
            </VStack>
          </Step>
          
          <Step name="dashboard_overview">
            <TutorialStep
              title="Your Dashboard"
              description="This is where you'll see all your projects and recent activity."
              highlightElement="#dashboard"
              onNext={() => {
                markComplete("dashboard_overview");
                setStep("create_project");
              }}
              onBack={() => setStep("welcome")}
            />
          </Step>
          
          <Step name="create_project">
            <TutorialStep
              title="Create Your First Project"
              description="Click the 'New Project' button to get started."
              highlightElement="#new-project-btn"
              interactive={true}
              onComplete={() => {
                markComplete("create_project");
                setStep("invite_team");
              }}
              onSkip={() => setStep("invite_team")}
              onBack={() => setStep("dashboard_overview")}
            />
          </Step>
          
          <Step name="invite_team">
            <TutorialStep
              title="Collaborate with Your Team"
              description="Invite team members to collaborate on projects."
              highlightElement="#team-section"
              onNext={() => {
                markComplete("invite_team");
                setStep("settings");
              }}
              onBack={() => setStep("create_project")}
            />
          </Step>
          
          <Step name="settings">
            <TutorialStep
              title="Customize Your Experience"
              description="Access settings to personalize your workspace."
              highlightElement="#settings-menu"
              onNext={() => {
                markComplete("settings");
                setStep("complete");
              }}
              onBack={() => setStep("invite_team")}
            />
          </Step>
          
          <Step name="complete">
            <VStack gap={16} align="center">
              <Title level={1}>You're All Set!</Title>
              <Body fontSize="b2">
                You've completed {completedSteps.length} of {TUTORIAL_STEPS.length - 1} tutorial steps.
              </Body>
              <HStack gap={12}>
                <Button 
                  variant="secondary"
                  onClick={() => setStep("welcome")}
                >
                  Restart Tutorial
                </Button>
                <Button onClick={() => closeTutorial()}>
                  Start Using App
                </Button>
              </HStack>
            </VStack>
          </Step>
        </Stepper>
        
        {/* Progress dots */}
        <HStack gap={8} justify="center">
          {TUTORIAL_STEPS.slice(0, -1).map((s, index) => (
            <div
              key={s}
              className={`
                tutorial-dot
                ${completedSteps.includes(s) ? "completed" : ""}
                ${step === s ? "active" : ""}
              `}
              onClick={() => setStep(s)}
            />
          ))}
        </HStack>
      </VStack>
    </div>
  );
}
```

### Configuration Wizard

```tsx
import { useStepper } from "@nugudi/react-hooks-use-stepper";
import { VStack, Title, Body } from "@nugudi/react-components-layout";

const CONFIG_STEPS = [
  "database",
  "authentication",
  "storage",
  "notifications",
  "review",
  "deploy"
] as const;

function ConfigurationWizard() {
  const { Stepper, Step, step, setStep } = useStepper(CONFIG_STEPS);
  const [config, setConfig] = React.useState({});
  const [errors, setErrors] = React.useState({});
  
  const validateStep = (stepName: string): boolean => {
    // Validation logic for each step
    switch(stepName) {
      case "database":
        return !!config.database?.host && !!config.database?.port;
      case "authentication":
        return !!config.auth?.provider;
      default:
        return true;
    }
  };
  
  const canProceed = validateStep(step);

  return (
    <VStack gap={32}>
      <Title level={1}>Setup Wizard</Title>
      
      {/* Breadcrumb navigation */}
      <HStack gap={8}>
        {CONFIG_STEPS.map((s, index) => (
          <React.Fragment key={s}>
            <button
              className={`breadcrumb ${step === s ? "active" : ""}`}
              onClick={() => setStep(s)}
              disabled={!validateStep(CONFIG_STEPS[index - 1])}
            >
              {s.replace(/_/g, " ").toUpperCase()}
            </button>
            {index < CONFIG_STEPS.length - 1 && <span>→</span>}
          </React.Fragment>
        ))}
      </HStack>
      
      <Stepper>
        <Step name="database">
          <DatabaseConfig
            config={config.database}
            onSave={(data) => {
              setConfig({ ...config, database: data });
              setStep("authentication");
            }}
            errors={errors.database}
          />
        </Step>
        
        <Step name="authentication">
          <AuthenticationConfig
            config={config.auth}
            onSave={(data) => {
              setConfig({ ...config, auth: data });
              setStep("storage");
            }}
            onBack={() => setStep("database")}
          />
        </Step>
        
        <Step name="storage">
          <StorageConfig
            config={config.storage}
            onSave={(data) => {
              setConfig({ ...config, storage: data });
              setStep("notifications");
            }}
            onBack={() => setStep("authentication")}
          />
        </Step>
        
        <Step name="notifications">
          <NotificationConfig
            config={config.notifications}
            onSave={(data) => {
              setConfig({ ...config, notifications: data });
              setStep("review");
            }}
            onBack={() => setStep("storage")}
          />
        </Step>
        
        <Step name="review">
          <ConfigReview
            config={config}
            onEdit={(section) => setStep(section)}
            onConfirm={() => setStep("deploy")}
            onBack={() => setStep("notifications")}
          />
        </Step>
        
        <Step name="deploy">
          <DeploymentProcess
            config={config}
            onComplete={() => {
              // Navigate to dashboard
              window.location.href = "/dashboard";
            }}
          />
        </Step>
      </Stepper>
    </VStack>
  );
}
```

## API Reference

### useStepper

| Parameter | Type | Description |
|-----------|------|-------------|
| `steps` | `readonly string[]` | Array of step names (must be const assertion) |

**Returns:**

| Property | Type | Description |
|----------|------|-------------|
| `Stepper` | `React.Component` | Container component that renders the active step |
| `Step` | `React.Component` | Individual step component |
| `step` | `string` | Current active step name |
| `setStep` | `(step: string) => void` | Function to change the current step |

### Step Component Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `name` | `string` | Yes | Step identifier (must match a value in steps array) |
| `children` | `ReactNode` | Yes | Content to render when this step is active |

## Helper Utilities

### Step Navigation

```tsx
function useStepperHelpers<T extends readonly string[]>(
  steps: T,
  currentStep: T[number],
  setStep: (step: T[number]) => void
) {
  const currentIndex = steps.indexOf(currentStep);
  
  const next = () => {
    if (currentIndex < steps.length - 1) {
      setStep(steps[currentIndex + 1]);
    }
  };
  
  const previous = () => {
    if (currentIndex > 0) {
      setStep(steps[currentIndex - 1]);
    }
  };
  
  const goToStep = (index: number) => {
    if (index >= 0 && index < steps.length) {
      setStep(steps[index]);
    }
  };
  
  const reset = () => setStep(steps[0]);
  
  return {
    currentIndex,
    isFirst: currentIndex === 0,
    isLast: currentIndex === steps.length - 1,
    next,
    previous,
    goToStep,
    reset,
    totalSteps: steps.length,
    progress: ((currentIndex + 1) / steps.length) * 100
  };
}
```

### Step Validation

```tsx
function useStepValidation<T extends readonly string[]>(
  steps: T,
  validationRules: Record<T[number], () => boolean>
) {
  const [completedSteps, setCompletedSteps] = React.useState<T[number][]>([]);
  const [errors, setErrors] = React.useState<Record<T[number], string>>({});
  
  const validateStep = (step: T[number]): boolean => {
    const isValid = validationRules[step]?.() ?? true;
    
    if (isValid) {
      setCompletedSteps(prev => [...new Set([...prev, step])]);
      setErrors(prev => ({ ...prev, [step]: undefined }));
    }
    
    return isValid;
  };
  
  const canAccessStep = (step: T[number]): boolean => {
    const stepIndex = steps.indexOf(step);
    
    // Can always go back
    if (stepIndex < steps.indexOf(completedSteps[completedSteps.length - 1])) {
      return true;
    }
    
    // Check if all previous steps are completed
    return steps.slice(0, stepIndex).every(s => completedSteps.includes(s));
  };
  
  return {
    completedSteps,
    errors,
    validateStep,
    canAccessStep,
    isStepCompleted: (step: T[number]) => completedSteps.includes(step)
  };
}
```

## Best Practices

1. **Use const assertions** for step arrays to ensure type safety
2. **Validate before navigation** - Check form validity before allowing next step
3. **Save progress** - Persist step data to prevent loss on refresh
4. **Show progress** - Display step indicators or progress bars
5. **Allow navigation** - Enable going back to previous steps
6. **Handle errors gracefully** - Show validation errors clearly
7. **Consider accessibility** - Add ARIA labels and keyboard navigation

## TypeScript Support

Full TypeScript support with type inference:

```tsx
import type { StepProps, StepperProps } from "@nugudi/react-hooks-use-stepper";

// Type-safe step definitions
const STEPS = ["step1", "step2", "step3"] as const;
type StepType = typeof STEPS[number]; // "step1" | "step2" | "step3"

// Custom step component with props
interface CustomStepProps extends StepProps<StepType> {
  onComplete?: () => void;
}

function CustomStep({ name, children, onComplete }: CustomStepProps) {
  return (
    <div>
      {children}
      <button onClick={onComplete}>Complete</button>
    </div>
  );
}
```

## License

MIT