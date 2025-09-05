# InputOTP Component

A flexible OTP (One-Time Password) input component with automatic focus management, validation, and mobile-optimized keyboard support. Perfect for verification codes, PIN entries, and multi-factor authentication.

## Installation

```bash
pnpm add @nugudi/react-components-input-otp
```

## Basic Usage

```tsx
import { InputOTP } from '@nugudi/react-components-input-otp';

// Basic OTP input
<InputOTP onChange={(value) => console.log('OTP:', value)} />

// With default value
<InputOTP 
  defaultValue="123" 
  onChange={(value) => console.log('OTP:', value)} 
/>

// Custom length
<InputOTP length={4} />

// With error state
<InputOTP 
  isError={true} 
  errorMessage="Invalid verification code" 
/>
```

## Controlled vs Uncontrolled

### Uncontrolled Mode (Simple)

```tsx
import { InputOTP } from '@nugudi/react-components-input-otp';

function UncontrolledExample() {
  return (
    <InputOTP
      defaultValue="123"
      onChange={(value) => {
        console.log('Current OTP:', value);
        if (value.length === 6) {
          // Auto-submit when complete
          handleSubmit(value);
        }
      }}
    />
  );
}
```

### Controlled Mode

```tsx
import { InputOTP } from '@nugudi/react-components-input-otp';
import { useState } from 'react';

function ControlledExample() {
  const [otp, setOtp] = useState('');

  return (
    <>
      <InputOTP 
        value={otp} 
        onChange={setOtp}
      />
      <button onClick={() => setOtp('')}>
        Clear
      </button>
    </>
  );
}
```

## Different Lengths

Support various OTP lengths:

```tsx
// 4-digit PIN
<InputOTP length={4} />

// 6-digit verification code (default)
<InputOTP length={6} />

// 8-digit security code
<InputOTP length={8} />

// Custom length
<InputOTP length={5} />
```

## Input Patterns

Control what characters are allowed:

```tsx
// Numeric only (default)
<InputOTP 
  inputMode="numeric"
  pattern="[0-9]*"
/>

// Alphabetic only
<InputOTP 
  inputMode="text"
  pattern="[a-zA-Z]*"
/>

// Alphanumeric
<InputOTP 
  inputMode="text"
  pattern="[a-zA-Z0-9]*"
/>

// Uppercase letters only
<InputOTP 
  inputMode="text"
  pattern="[A-Z]*"
/>

// Custom pattern (hex)
<InputOTP 
  inputMode="text"
  pattern="[0-9a-fA-F]*"
/>
```

## Error States

Display validation errors:

```tsx
import { InputOTP } from '@nugudi/react-components-input-otp';
import { VStack, Body } from '@nugudi/react-components-layout';

function OTPWithError() {
  const [error, setError] = useState(false);

  return (
    <VStack gap={8}>
      <InputOTP 
        isError={error}
        errorMessage={error ? "Invalid code. Please try again." : undefined}
        onChange={(value) => {
          setError(false); // Clear error on change
          if (value.length === 6) {
            validateOTP(value).catch(() => setError(true));
          }
        }}
      />
      {error && (
        <Body fontSize="b4" color="negative">
          Invalid code. Please try again.
        </Body>
      )}
    </VStack>
  );
}
```

## With React Hook Form

Integration with form libraries:

```tsx
import { InputOTP } from '@nugudi/react-components-input-otp';
import { useForm, Controller } from 'react-hook-form';
import { VStack, Button } from '@nugudi/react-components-layout';

function OTPForm() {
  const { control, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    console.log('OTP:', data.otp);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <VStack gap={16}>
        <Controller
          name="otp"
          control={control}
          rules={{ 
            required: "Verification code is required",
            minLength: {
              value: 6,
              message: "Please enter all 6 digits"
            }
          }}
          render={({ field, fieldState }) => (
            <InputOTP
              {...field}
              isError={!!fieldState.error}
              errorMessage={fieldState.error?.message}
            />
          )}
        />
        <Button type="submit" variant="brand">
          Verify
        </Button>
      </VStack>
    </form>
  );
}
```

## Email Verification

Two-factor authentication flow:

```tsx
import { InputOTP } from '@nugudi/react-components-input-otp';
import { VStack, Title, Body, Button } from '@nugudi/react-components-layout';
import { useState } from 'react';

function EmailVerification({ email }) {
  const [code, setCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = async () => {
    setIsVerifying(true);
    try {
      await verifyEmail(email, code);
      // Success
    } catch (error) {
      // Handle error
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <VStack gap={24} align="center">
      <VStack gap={8} align="center">
        <Title fontSize="t2">Verify Your Email</Title>
        <Body fontSize="b3">
          We sent a verification code to {email}
        </Body>
      </VStack>

      <InputOTP
        length={6}
        value={code}
        onChange={setCode}
        disabled={isVerifying}
      />

      <VStack gap={12} width="full">
        <Button 
          variant="brand"
          onClick={handleVerify}
          disabled={code.length !== 6 || isVerifying}
        >
          {isVerifying ? 'Verifying...' : 'Verify'}
        </Button>
        
        <Button variant="neutral" size="sm">
          Resend Code
        </Button>
      </VStack>
    </VStack>
  );
}
```

## Phone Verification

SMS OTP verification:

```tsx
import { InputOTP } from '@nugudi/react-components-input-otp';
import { VStack, Title, Body, Button, HStack } from '@nugudi/react-components-layout';

function PhoneVerification({ phoneNumber }) {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(60);

  return (
    <VStack gap={20}>
      <VStack gap={8}>
        <Title fontSize="t3">Enter Verification Code</Title>
        <Body fontSize="b3">
          Code sent to {phoneNumber}
        </Body>
      </VStack>

      <InputOTP
        length={6}
        value={otp}
        onChange={(value) => {
          setOtp(value);
          setError(''); // Clear error on change
        }}
        isError={!!error}
        errorMessage={error}
      />

      <HStack justify="space-between">
        <Body fontSize="b4">
          {timer > 0 ? `Resend in ${timer}s` : 'Code expired'}
        </Body>
        <Button 
          variant="neutral" 
          size="sm"
          disabled={timer > 0}
        >
          Resend Code
        </Button>
      </HStack>

      <Button 
        variant="brand"
        width="full"
        disabled={otp.length !== 6}
      >
        Verify Phone Number
      </Button>
    </VStack>
  );
}
```

## Bank PIN Entry

Secure PIN input:

```tsx
import { InputOTP } from '@nugudi/react-components-input-otp';
import { VStack, Title, Body, Button } from '@nugudi/react-components-layout';

function BankPINEntry() {
  const [pin, setPin] = useState('');
  const [isConfirming, setIsConfirming] = useState(false);
  const [confirmPin, setConfirmPin] = useState('');

  return (
    <VStack gap={24}>
      {!isConfirming ? (
        <>
          <Title fontSize="t3">Create Your PIN</Title>
          <InputOTP
            length={4}
            value={pin}
            onChange={setPin}
            inputMode="numeric"
          />
          <Button 
            variant="brand"
            onClick={() => setIsConfirming(true)}
            disabled={pin.length !== 4}
          >
            Continue
          </Button>
        </>
      ) : (
        <>
          <Title fontSize="t3">Confirm Your PIN</Title>
          <InputOTP
            length={4}
            value={confirmPin}
            onChange={setConfirmPin}
            inputMode="numeric"
            isError={confirmPin.length === 4 && confirmPin !== pin}
            errorMessage={
              confirmPin.length === 4 && confirmPin !== pin 
                ? "PINs do not match" 
                : undefined
            }
          />
          <Button 
            variant="brand"
            disabled={confirmPin.length !== 4 || confirmPin !== pin}
          >
            Set PIN
          </Button>
        </>
      )}
    </VStack>
  );
}
```

## Game Code Entry

Enter game or promo codes:

```tsx
import { InputOTP } from '@nugudi/react-components-input-otp';
import { VStack, Title, Body, Button } from '@nugudi/react-components-layout';

function GameCodeEntry() {
  const [code, setCode] = useState('');
  const [reward, setReward] = useState(null);

  return (
    <VStack gap={20}>
      <VStack gap={8}>
        <Title fontSize="t2">Enter Promo Code</Title>
        <Body fontSize="b3">
          Redeem your special rewards
        </Body>
      </VStack>

      <InputOTP
        length={8}
        value={code}
        onChange={setCode}
        inputMode="text"
        pattern="[A-Z0-9]*"
        inputClassName="text-uppercase"
      />

      <Button 
        variant="brand"
        onClick={() => redeemCode(code)}
        disabled={code.length !== 8}
      >
        Redeem Code
      </Button>

      {reward && (
        <Box padding={16} background="yellow" borderRadius="md">
          <Body fontSize="b2">🎉 {reward.message}</Body>
        </Box>
      )}
    </VStack>
  );
}
```

## Backup Code Entry

Recovery code input:

```tsx
import { InputOTP } from '@nugudi/react-components-input-otp';
import { VStack, Title, Body, Button, HStack } from '@nugudi/react-components-layout';

function BackupCodeEntry() {
  const [code, setCode] = useState('');
  const [attempts, setAttempts] = useState(3);

  return (
    <VStack gap={24}>
      <VStack gap={8}>
        <Title fontSize="t2">Enter Backup Code</Title>
        <Body fontSize="b3">
          Use one of your saved backup codes
        </Body>
      </VStack>

      <InputOTP
        length={10}
        value={code}
        onChange={setCode}
        inputMode="text"
        pattern="[a-z0-9]*"
        isError={attempts < 3}
        errorMessage={attempts < 3 ? `${attempts} attempts remaining` : undefined}
      />

      <VStack gap={12}>
        <Button 
          variant="brand"
          width="full"
          disabled={code.length !== 10 || attempts === 0}
        >
          Verify Backup Code
        </Button>

        <HStack justify="center" gap={8}>
          <Body fontSize="b4">Don't have a backup code?</Body>
          <Button variant="neutral" size="sm">
            Try another method
          </Button>
        </HStack>
      </VStack>
    </VStack>
  );
}
```

## Auto-Submit on Complete

Automatically submit when OTP is complete:

```tsx
import { InputOTP } from '@nugudi/react-components-input-otp';
import { VStack, Title, Body } from '@nugudi/react-components-layout';

function AutoSubmitOTP() {
  const [isVerifying, setIsVerifying] = useState(false);
  const [status, setStatus] = useState('');

  const handleAutoSubmit = async (value) => {
    if (value.length === 6) {
      setIsVerifying(true);
      setStatus('Verifying...');
      
      try {
        await verifyOTP(value);
        setStatus('✅ Verified successfully!');
      } catch (error) {
        setStatus('❌ Invalid code');
      } finally {
        setIsVerifying(false);
      }
    }
  };

  return (
    <VStack gap={16}>
      <Title fontSize="t3">Enter Code</Title>
      
      <InputOTP
        length={6}
        onChange={handleAutoSubmit}
        disabled={isVerifying}
      />
      
      {status && (
        <Body fontSize="b3">{status}</Body>
      )}
    </VStack>
  );
}
```

## Custom Styling

Apply custom styles:

```tsx
import { InputOTP } from '@nugudi/react-components-input-otp';

function StyledOTP() {
  return (
    <InputOTP
      length={6}
      className="custom-otp-container"
      inputClassName="custom-otp-input"
      style={{ gap: '12px' }}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| length | `number` | `6` | Number of OTP input fields |
| value | `string` | - | Controlled value |
| defaultValue | `string` | - | Default value for uncontrolled mode |
| onChange | `(value: string) => void` | - | Called when value changes |
| onBlur | `(e: FocusEvent<HTMLDivElement>) => void` | - | Blur event handler |
| onFocus | `(e: FocusEvent<HTMLDivElement>) => void` | - | Focus event handler |
| disabled | `boolean` | `false` | Disable all inputs |
| className | `string` | - | Container CSS class |
| inputClassName | `string` | - | Individual input CSS class |
| isError | `boolean` | `false` | Error state styling |
| errorMessage | `string` | - | Error message to display |
| inputMode | `"text" \| "numeric"` | `"numeric"` | Mobile keyboard type |
| pattern | `string` | `"[0-9]*"` | Input validation pattern |
| id | `string` | - | Container element ID |
| name | `string` | - | Input name attribute |
| aria-describedby | `string` | - | ARIA description reference |

## Features

- ✅ Auto-focus management between fields
- ✅ Backspace navigation to previous field
- ✅ Arrow key navigation
- ✅ Paste support (auto-fills all fields)
- ✅ Pattern validation
- ✅ Error state display
- ✅ Mobile keyboard optimization
- ✅ React Hook Form compatibility
- ✅ Controlled/Uncontrolled modes
- ✅ TypeScript support

## Keyboard Shortcuts

- **Arrow Keys**: Navigate between fields
- **Backspace**: Clear current field or move to previous
- **Delete**: Clear current field
- **Paste**: Auto-fill all fields from clipboard

## Styling

The component uses CSS-in-JS with vanilla-extract. Import the styles:

```tsx
import '@nugudi/react-components-input-otp/style.css';
```

## Accessibility

- Keyboard navigation support
- ARIA attributes for screen readers
- Proper focus management
- Mobile-optimized input modes
- Clear error state announcements

## TypeScript

The component is fully typed. Import types as needed:

```tsx
import type { InputOTPProps } from '@nugudi/react-components-input-otp';

// Using in component props
interface VerificationProps {
  otpProps?: Omit<InputOTPProps, 'onChange'>;
  onVerify: (code: string) => void;
}
```

## Best Practices

1. **Use appropriate length**: Match expected code length
2. **Provide clear instructions**: Tell users where to find the code
3. **Show timer for resend**: Indicate when new code can be requested
4. **Auto-submit when complete**: Better UX for known-length codes
5. **Clear error feedback**: Show what went wrong
6. **Mobile optimization**: Use numeric inputMode for number-only OTPs
7. **Paste support**: Allow users to paste codes from SMS/email
8. **Visual feedback**: Clear indication of focus and error states