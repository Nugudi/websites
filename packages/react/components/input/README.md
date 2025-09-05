# Input Component

A flexible and accessible input field component with support for labels, error states, icons, and various styling options.

## Installation

```bash
pnpm add @nugudi/react-components-input
```

## Basic Usage

```tsx
import { Input } from '@nugudi/react-components-input';

// Basic input
<Input placeholder="Enter text" />

// With value and onChange
<Input
  value={value}
  onChange={(e) => setValue(e.target.value)}
  placeholder="Your name"
/>

// With label
<Input
  label="Email Address"
  type="email"
  placeholder="user@example.com"
/>
```

## With Label

The input component supports an integrated label:

```tsx
// Label with required field
<Input
  label="Username"
  required
  placeholder="Choose a username"
/>

// Label with helper text
<Input
  label="Password"
  type="password"
  placeholder="Enter your password"
  aria-describedby="password-help"
/>
<span id="password-help">Must be at least 8 characters</span>
```

## Error States

Display validation errors and error messages:

```tsx
// Error state
<Input
  isError
  placeholder="Invalid input"
/>

// With error message
<Input
  label="Email"
  isError
  errorMessage="Please enter a valid email address"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>

// Using invalid prop for ARIA
<Input
  invalid
  aria-invalid="true"
  aria-describedby="email-error"
  placeholder="Email with error"
/>
<span id="email-error">Email format is incorrect</span>
```

## With Icons

Add icons to the right side of the input:

```tsx
import { Input } from '@nugudi/react-components-input';
import { SearchIcon, EyeIcon, CalendarIcon } from '@nugudi/assets-icons';

// Search input
<Input
  placeholder="Search..."
  rightIcon={<SearchIcon />}
/>

// Password with visibility toggle
<Input
  type={showPassword ? "text" : "password"}
  placeholder="Password"
  rightIcon={
    <button onClick={() => setShowPassword(!showPassword)}>
      <EyeIcon />
    </button>
  }
/>

// Date input with calendar icon
<Input
  type="date"
  label="Select Date"
  rightIcon={<CalendarIcon />}
/>
```

## Variants

Different visual styles for various contexts:

```tsx
// Default variant
<Input
  variant="default"
  placeholder="Default style"
/>

// Filled variant
<Input
  variant="filled"
  placeholder="Filled style"
/>

// Filled with label
<Input
  variant="filled"
  label="Company Name"
  placeholder="Enter company name"
/>
```

## Size Options

Control the input width:

```tsx
// Full width
<Input
  size="full"
  placeholder="Full width input"
/>

// Full width with label
<Input
  size="full"
  label="Address"
  placeholder="Enter your full address"
/>
```

## Input Types

Support for all HTML5 input types:

```tsx
// Text (default)
<Input type="text" placeholder="Name" />

// Email
<Input
  type="email"
  label="Email"
  placeholder="user@example.com"
/>

// Password
<Input
  type="password"
  label="Password"
  placeholder="••••••••"
/>

// Number
<Input
  type="number"
  label="Age"
  min="0"
  max="120"
  placeholder="25"
/>

// Tel
<Input
  type="tel"
  label="Phone"
  placeholder="+82-10-1234-5678"
/>

// URL
<Input
  type="url"
  label="Website"
  placeholder="https://example.com"
/>

// Date
<Input
  type="date"
  label="Birthday"
/>

// Time
<Input
  type="time"
  label="Appointment Time"
/>

// File
<Input
  type="file"
  label="Upload Document"
  accept=".pdf,.doc,.docx"
/>
```

## Form Integration

```tsx
// In a form with validation
<form onSubmit={handleSubmit}>
  <Input
    label='Email'
    type='email'
    name='email'
    required
    value={formData.email}
    onChange={handleChange}
    isError={!!errors.email}
    errorMessage={errors.email}
  />

  <Input
    label='Password'
    type='password'
    name='password'
    required
    minLength={8}
    value={formData.password}
    onChange={handleChange}
    isError={!!errors.password}
    errorMessage={errors.password}
  />

  <button type='submit'>Submit</button>
</form>
```

## Disabled and Read-only States

```tsx
// Disabled input
<Input
  disabled
  value="Cannot edit"
  label="Disabled Field"
/>

// Read-only input
<Input
  readOnly
  value="Read only value"
  label="Read-only Field"
/>
```

## With Placeholder and Value

```tsx
// Placeholder only
<Input
  placeholder="Enter your name"
/>

// With default value
<Input
  defaultValue="Default text"
  placeholder="Enter text"
/>

// Controlled component
<Input
  value={controlledValue}
  onChange={(e) => setControlledValue(e.target.value)}
  placeholder="Controlled input"
/>
```

## Accessibility Features

```tsx
// With ARIA attributes
<Input
  label="Search"
  aria-label="Search products"
  aria-describedby="search-hint"
  aria-required="true"
  required
/>
<span id="search-hint">Enter product name or category</span>

// With error announcement
<Input
  label="Username"
  isError
  errorMessage="Username already taken"
  aria-invalid="true"
  aria-describedby="username-error"
/>

// With autocomplete
<Input
  label="Email"
  type="email"
  autoComplete="email"
  placeholder="your@email.com"
/>
```

## Complex Examples

### Form Field with Validation

```tsx
function EmailField() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) {
      setError('Email is required');
    } else if (!emailRegex.test(value)) {
      setError('Please enter a valid email');
    } else {
      setError('');
    }
  };

  return (
    <Input
      label='Email Address'
      type='email'
      value={email}
      onChange={(e) => {
        setEmail(e.target.value);
        validateEmail(e.target.value);
      }}
      onBlur={() => validateEmail(email)}
      isError={!!error}
      errorMessage={error}
      required
      size='full'
    />
  );
}
```

### Password Input with Toggle

```tsx
function PasswordInput() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Input
      label='Password'
      type={showPassword ? 'text' : 'password'}
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      rightIcon={
        <button
          type='button'
          onClick={() => setShowPassword(!showPassword)}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      }
      placeholder='Enter password'
      size='full'
    />
  );
}
```

### Search Input with Clear

```tsx
function SearchInput() {
  const [query, setQuery] = useState('');

  return (
    <Input
      placeholder='Search...'
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      rightIcon={
        query ? (
          <button
            type='button'
            onClick={() => setQuery('')}
            aria-label='Clear search'
          >
            <CloseIcon />
          </button>
        ) : (
          <SearchIcon />
        )
      }
      size='full'
    />
  );
}
```

## Props

| Prop          | Type                                          | Default     | Description                             |
| ------------- | --------------------------------------------- | ----------- | --------------------------------------- |
| size          | `'full'`                                      | -           | Input width (full width when specified) |
| variant       | `'default' \| 'filled'`                       | `'default'` | Visual style variant                    |
| label         | `string`                                      | -           | Label text displayed above input        |
| isError       | `boolean`                                     | `false`     | Error state styling                     |
| errorMessage  | `string`                                      | -           | Error message displayed below input     |
| invalid       | `boolean`                                     | -           | Sets aria-invalid attribute             |
| rightIcon     | `React.ReactNode`                             | -           | Icon or element on the right side       |
| ...inputProps | `React.InputHTMLAttributes<HTMLInputElement>` | -           | All native input attributes             |

### Native Input Props Support

The component extends all native HTML input attributes:

- `type`: All HTML5 input types
- `placeholder`: Placeholder text
- `value`, `defaultValue`: Input value
- `onChange`, `onBlur`, `onFocus`: Event handlers
- `disabled`, `readOnly`: State attributes
- `required`, `pattern`, `min`, `max`, `minLength`, `maxLength`: Validation attributes
- `autoComplete`, `autoFocus`: Browser behavior
- `name`, `id`: Form identification
- `className`, `style`: Styling
- `aria-*`: Accessibility attributes
- And all other input HTML attributes

## Styling

The component uses CSS-in-JS with vanilla-extract. Import the styles:

```tsx
import '@nugudi/react-components-input/style.css';
```

## Accessibility

- Proper label association with input
- ARIA attributes for error states
- Keyboard navigation support
- Screen reader announcements for errors
- Support for aria-describedby for help text
- Proper focus management

## TypeScript

The component is fully typed. Import types as needed:

```tsx
import type { InputProps } from '@nugudi/react-components-input';

// Using in component props
interface FormFieldProps {
  inputProps?: InputProps;
}

// Extending input props
interface CustomInputProps extends InputProps {
  customValidation?: (value: string) => boolean;
}
```

## Best Practices

1. **Always provide labels**: Use the `label` prop or associate with external label
2. **Show clear error states**: Use `isError` and `errorMessage` for validation feedback
3. **Use appropriate input types**: Helps with mobile keyboards and browser validation
4. **Add helpful placeholders**: Guide users on expected format
5. **Consider full width on mobile**: Use `size="full"` for better mobile UX
6. **Implement proper validation**: Validate on blur and provide immediate feedback
7. **Use semantic HTML**: Leverage native input attributes for better accessibility
