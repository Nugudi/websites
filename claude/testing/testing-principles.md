---
description: Testing principles, philosophy, what to test vs skip, testing pyramid, coverage guidelines, and testing tools overview
globs:
  - "**/*.test.ts"
  - "**/*.spec.ts"
  - "**/__tests__/**/*.ts"
alwaysApply: true
---

# Testing Principles and Philosophy

> **Document Type**: Testing Strategy Guide
> **Target Audience**: All developers
> **Related Documents**: [unit-testing.md](./unit-testing.md), [integration-testing.md](./integration-testing.md), [e2e-testing.md](./e2e-testing.md)
> **Last Updated**: 2025-11-11

This document outlines our team's core testing principles, philosophy, and what to prioritize when writing tests. Our goal is to maintain efficient test coverage while preventing productivity loss from unnecessary testing.

## Core Testing Principles

### 1. Non-UI Modules MUST Have Tests

All modules that are not directly related to UI rendering **must** have comprehensive test coverage:

- **UseCases (DDD)**: Business logic orchestration, domain operations
- **Repositories (DDD)**: Data access layer, API integration
- **Entities (DDD)**: Domain models, business rules, calculations
- **Business Logic**: Domain operations, state management, data transformations
- **Utility Functions**: Helper functions, formatters, validators, parsers
- **API Handlers**: Request/response processing, error handling, data mapping
- **Hooks**: Custom React hooks with complex logic
- **Server Actions**: Next.js server actions and data fetching logic

### 2. UI Component Testing Priority

UI components follow a priority-based testing approach to maximize value while minimizing overhead.

#### Testing Priority Matrix

| Component Type  | User Interaction | State Management | Conditional Logic | Test Priority |
| --------------- | ---------------- | ---------------- | ----------------- | ------------- |
| Presentational  | ❌               | ❌               | ❌                | **Skip**      |
| Presentational  | ✅               | ❌               | ❌                | **Medium**    |
| Container       | ❌               | ✅               | ❌                | **High**      |
| Container       | ✅               | ✅               | ✅                | **Critical**  |
| Form Components | ✅               | ✅               | ✅                | **Critical**  |

#### Components to SKIP Testing

Simple presentational components that only handle styling can be skipped:

```typescript
// ❌ No test needed - pure styling component
interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card = ({ children, className }: CardProps) => {
  return (
    <div className={cn('rounded-lg bg-white p-6 shadow', className)}>
      {children}
    </div>
  );
};
```

**Why skip?**
- No business logic
- No state management
- No user interactions beyond basic rendering
- Visual testing covered by Storybook/Chromatic

#### Components that REQUIRE Testing

Test components with the following characteristics:

##### 1. User Interactions

```typescript
// ✅ Test required - has user interaction
interface ToggleButtonProps {
  onToggle: (value: boolean) => void;
}

export const ToggleButton = ({ onToggle }: ToggleButtonProps) => {
  const [isOn, setIsOn] = useState(false);

  const handleClick = () => {
    setIsOn(!isOn);
    onToggle(!isOn);
  };

  return <button onClick={handleClick}>{isOn ? 'ON' : 'OFF'}</button>;
};
```

**Why test?**
- User interactions can have side effects
- State changes need verification
- Event handlers need to be called correctly

##### 2. Conditional Rendering

```typescript
// ✅ Test required - has conditional logic
interface UserProfileProps {
  user?: {
    id: string;
    name: string;
    isBlocked: boolean;
  };
}

export const UserProfile = ({ user }: UserProfileProps) => {
  if (!user) {
    return <EmptyState message='No user found' />;
  }

  if (user.isBlocked) {
    return <BlockedUserMessage />;
  }

  return <ProfileDetails user={user} />;
};
```

**Why test?**
- Multiple rendering paths
- Each conditional branch needs verification
- Edge cases (null, blocked) need coverage

##### 3. Form Components

```typescript
// ✅ Test required - form with validation
export const LoginForm = () => {
  const form = useForm({
    resolver: zodResolver(loginSchema),
  });

  // Test validation, submission, error states
  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>{/* form fields */}</form>
  );
};
```

**Why test?**
- Form validation is critical
- Submission handlers need verification
- Error states need coverage
- User data integrity is crucial

## Testing Pyramid

Our testing strategy follows the testing pyramid principle:

```
        /\
       /  \        E2E Tests (5-10%)
      /____\       - Critical user flows
     /      \      - Full system integration
    /        \     - Expensive, slow
   /  Integration\  Integration Tests (20-30%)
  /    Tests     \ - API endpoints
 /______________\ - Component integration
/                \ Unit Tests (60-75%)
/  Unit Tests    \ - Business logic
/________________\ - Utilities, helpers
                   - Fast, isolated
```

### Unit Tests (60-75%)

**What**: Test individual functions, classes, or components in isolation

**Why**: Fast, reliable, easy to debug

**When**:
- Testing business logic (UseCases, Entities)
- Testing utilities and helpers
- Testing data access (Repositories)
- Testing pure functions

**See**: [unit-testing.md](./unit-testing.md) for patterns

### Integration Tests (20-30%)

**What**: Test how multiple units work together

**Why**: Verify component interactions, API contracts

**When**:
- Testing API endpoints
- Testing component + hook interactions
- Testing query hooks with DI Containers
- Testing form submissions with server actions

**See**: [integration-testing.md](./integration-testing.md) for patterns

### E2E Tests (5-10%)

**What**: Test complete user flows through the application

**Why**: Ensure critical paths work end-to-end

**When**:
- Testing critical user journeys (login, checkout)
- Testing complex multi-step flows
- Testing cross-page interactions
- Testing real browser behavior

**See**: [e2e-testing.md](./e2e-testing.md) for patterns

## What to Test

### ✅ Business Logic (ALWAYS)

```typescript
// Example: Entity business rules
class Stamp {
  isExpired(): boolean {
    return new Date() > this.expiresAt;
  }

  canBeUsed(): boolean {
    return !this.isUsed && !this.isExpired();
  }
}

// Test: All business rule branches
describe('Stamp Entity', () => {
  it('should return true for expired stamps');
  it('should return false for used stamps');
  it('should return true for valid unused stamps');
});
```

### ✅ Data Transformations (ALWAYS)

```typescript
// Example: Adapter transformations
class BenefitAdapter {
  static toUiItem(benefit: Benefit): BenefitUiItem {
    return {
      id: benefit.getId(),
      price: benefit.getPrice(),
      discount: benefit.getDiscountPercentage(),
      // ... 7+ Entity method calls
    };
  }
}

// Test: Transformation correctness
describe('BenefitAdapter', () => {
  it('should transform Entity to UI Type with all fields');
  it('should handle Entity with no discount');
});
```

### ✅ Error Handling (ALWAYS)

```typescript
// Example: UseCase error handling
class LoginUseCase {
  async execute(email: string, password: string) {
    try {
      return await this.repository.login(email, password);
    } catch (error) {
      throw new AuthenticationError('Login failed');
    }
  }
}

// Test: Error scenarios
describe('LoginUseCase', () => {
  it('should throw AuthenticationError on invalid credentials');
  it('should handle network errors gracefully');
});
```

### ✅ Critical User Flows (ALWAYS)

```typescript
// Example: Form submission
export const RegistrationForm = () => {
  const onSubmit = async (data) => {
    await registerUser(data);
    router.push('/welcome');
  };

  return <form onSubmit={form.handleSubmit(onSubmit)}>...</form>;
};

// Test: Complete flow
describe('RegistrationForm', () => {
  it('should register user and redirect on success');
  it('should display validation errors');
  it('should disable submit button during submission');
});
```

## What NOT to Test

### ❌ Third-Party Libraries (NEVER)

**Don't test that libraries work** - they have their own test suites.

```typescript
// ❌ BAD: Testing TanStack Query
it('should show loading state from useQuery', () => {
  const { result } = renderHook(() => useQuery(...));
  expect(result.current.isLoading).toBe(true); // Testing the library!
});

// ✅ GOOD: Test YOUR business logic
it('should transform user data after fetching', async () => {
  const { result } = renderHook(() => useUserList());
  await waitFor(() => {
    expect(result.current.users).toEqual([
      { id: 1, fullName: 'John Doe' }, // YOUR transformation
    ]);
  });
});
```

**Libraries you should NOT test**:
- TanStack Query (useQuery, useMutation)
- React Hook Form (useForm, form validation)
- Zod (schema validation)
- React Router (routing, navigation)
- Date-fns, dayjs (date utilities)

### ❌ Trivial Code (NEVER)

```typescript
// ❌ No test needed - trivial getter
export const getFullName = (firstName: string, lastName: string) => {
  return `${firstName} ${lastName}`;
};

// ❌ No test needed - simple constant
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
```

### ❌ Implementation Details (NEVER)

```typescript
// ❌ BAD: Testing internal state
it('should call setState', () => {
  expect(setState).toHaveBeenCalled();
});

// ✅ GOOD: Testing user-visible behavior
it('should display success message after form submission', () => {
  expect(screen.getByText('Profile updated')).toBeInTheDocument();
});
```

### ❌ Pure Styling Components (NEVER)

```typescript
// ❌ No test needed - pure presentation
export const Badge = ({ children, variant }) => (
  <span className={cn(badgeVariants[variant])}>{children}</span>
);
```

**Why skip?**
- Visual testing handled by Storybook
- No business logic
- No user interactions
- Refactoring won't break tests

## Testing Tools Overview

### 1. Vitest (Unit & Integration Tests)

**Purpose**: Fast unit and integration testing framework

**Use Cases**:
- Testing business logic (UseCases, Entities, Repositories)
- Testing utilities and helpers
- Testing React hooks
- Testing transformations (Adapters)

**Key Features**:
- Fast parallel execution
- Watch mode for development
- Coverage reports
- TypeScript support
- Compatible with Jest APIs

**Commands**:
```bash
pnpm test              # Run all tests
pnpm test:watch        # Watch mode
pnpm test:coverage     # Coverage report
pnpm test auth.test.ts # Run specific test
```

### 2. Testing Library (Component Tests)

**Purpose**: User-centric component testing

**Use Cases**:
- Testing component rendering
- Testing user interactions
- Testing accessibility
- Testing form submissions

**Key Features**:
- Query by accessible roles
- User-event simulation
- Async utilities (waitFor)
- Encourages best practices

**Example**:
```typescript
import { render, screen, userEvent } from '@testing-library/react';

it('should submit form on button click', async () => {
  render(<ContactForm />);

  await userEvent.type(screen.getByLabelText(/name/i), 'John');
  await userEvent.click(screen.getByRole('button', { name: /submit/i }));

  expect(screen.getByText(/thank you/i)).toBeInTheDocument();
});
```

### 3. MSW (Mock Service Worker)

**Purpose**: API mocking for integration tests

**Use Cases**:
- Mocking API endpoints
- Testing error states
- Testing loading states
- Testing network failures

**Key Features**:
- Network-level mocking
- Works in both Node and browser
- Consistent with real API responses
- Supports REST and GraphQL

**Example**:
```typescript
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  http.get('/api/users', () => {
    return HttpResponse.json([{ id: 1, name: 'John' }]);
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

### 4. Playwright (E2E Tests)

**Purpose**: End-to-end browser automation

**Use Cases**:
- Testing critical user flows
- Testing cross-browser compatibility
- Testing visual regression
- Testing real user scenarios

**Key Features**:
- Multi-browser support (Chrome, Firefox, Safari)
- Mobile emulation
- Screenshot and video recording
- Network interception
- Parallel execution

**See**: [e2e-testing.md](./e2e-testing.md) for complete guide

### 5. Storybook (Visual Testing)

**Purpose**: Component development and visual testing

**Use Cases**:
- Component documentation
- Visual regression testing
- Interaction testing
- Design system showcase

**Key Features**:
- Component isolation
- Interactive controls
- Chromatic integration
- Accessibility testing

**Example**:
```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './index';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
};

export default meta;

export const Primary: StoryObj<typeof Button> = {
  args: {
    variant: 'primary',
    children: 'Click me',
  },
};
```

## Coverage Guidelines

### Minimum Coverage Targets

- **Overall**: 70%
- **Business Logic (UseCases, Entities)**: 90%
- **Utilities**: 95%
- **Repositories**: 85%
- **API Handlers**: 85%
- **UI Components**: Based on priority matrix (not enforced globally)

### Coverage Commands

```bash
# Run tests with coverage
pnpm test:coverage

# Generate detailed HTML report
pnpm test:coverage --reporter=html

# Check coverage thresholds
pnpm test:coverage --coverage.thresholds.lines=70
```

### Interpreting Coverage Reports

```bash
# Example output
File             | % Stmts | % Branch | % Funcs | % Lines | Uncovered Lines
-----------------|---------|----------|---------|---------|----------------
auth.usecase.ts  |   95.5  |   90.0   |  100.0  |   95.5  | 45-47
user.entity.ts   |  100.0  |  100.0   |  100.0  |  100.0  |
format.util.ts   |   87.5  |   75.0   |  100.0  |   87.5  | 12-15
```

**Focus on**:
- **Statements**: Lines of code executed
- **Branches**: All if/else paths covered
- **Functions**: All functions called
- **Lines**: Actual lines executed

**Ignore coverage for**:
- Configuration files
- Type definitions
- Style files
- Storybook stories

## MUST/NEVER Rules

### MUST ✅

#### DDD Layer Testing
- **MUST** test all UseCases with mock Repository and SessionManager
- **MUST** test all Repositories with mock HttpClient
- **MUST** test all Entities with complex business logic
- **MUST** test all Adapters with 7+ Entity method calls
- **MUST** test error scenarios for all layers
- **MUST** verify mock calls with correct parameters

#### General Testing
- **MUST** write tests for all business logic
- **MUST** test user-facing behavior, not implementation
- **MUST** use descriptive test names (what, when, expected)
- **MUST** follow AAA pattern (Arrange, Act, Assert)
- **MUST** test error states and edge cases
- **MUST** mock system time for date-dependent tests
- **MUST** isolate tests (no shared state between tests)
- **MUST** run tests locally before committing

### NEVER ❌

#### DDD Layer Testing
- **NEVER** test Repository with real API calls (always mock HttpClient)
- **NEVER** test UseCase with real Repository (always mock dependencies)
- **NEVER** test business logic in Repository (Repository는 순수 데이터 접근만)
- **NEVER** test data access in UseCase (UseCase는 비즈니스 로직만)
- **NEVER** test DI Containers directly (Container는 설정일 뿐, 로직 없음)
- **NEVER** skip error scenario tests (에러 처리는 필수 테스트 항목)

#### General Testing
- **NEVER** test third-party libraries (TanStack Query, React Hook Form, Zod, etc.)
- **NEVER** test implementation details (internal state, private methods)
- **NEVER** test trivial code (simple getters, constants)
- **NEVER** test pure styling components without logic
- **NEVER** write brittle tests that break with refactoring
- **NEVER** use real system time in date-dependent tests
- **NEVER** skip tests for complex or critical components
- **NEVER** commit code with failing tests

## Testing Workflow

### Before Writing Code
1. Think about testability
2. Design for dependency injection
3. Keep business logic separate from UI
4. Plan test scenarios

### While Writing Code
1. Write tests alongside implementation (TDD optional)
2. Test one behavior at a time
3. Keep tests simple and focused
4. Use descriptive test names

### Before Committing
1. Run all tests locally (`pnpm test`)
2. Check test coverage (`pnpm test:coverage`)
3. Ensure new code has tests
4. Fix any failing tests

### In Pull Request
1. Ensure CI tests pass
2. Review test coverage changes
3. Get peer review on test quality
4. Address test-related feedback

### After Merge
1. Monitor test coverage trends
2. Watch for flaky tests
3. Refactor tests as needed
4. Keep tests up-to-date with code changes

## Continuous Integration

All tests run automatically on:
- Pull request creation
- Push to main branch
- Pre-deployment checks

### CI Test Pipeline

```yaml
# Example CI workflow
- name: Install dependencies
  run: pnpm install

- name: Type check
  run: pnpm check-types

- name: Lint
  run: pnpm lint

- name: Unit tests
  run: pnpm test:unit

- name: Build
  run: pnpm build

- name: E2E tests
  run: pnpm test:e2e
```

## Best Practices Summary

### DO's ✅
- Write tests for all business logic
- Test user-facing behavior
- Use MSW for API mocking
- Keep tests simple and focused
- Write descriptive test names
- Test error states and edge cases
- Use Storybook for component documentation
- Mock system time for date-dependent tests
- Follow the testing pyramid
- Run tests locally before committing

### DON'Ts ❌
- Don't test implementation details
- Don't test third-party libraries
- Don't write brittle tests
- Don't skip tests for complex components
- Don't mock everything - use real implementations when possible
- Don't test simple presentational components
- Don't use real system time in tests
- Don't commit failing tests

## Related Documentation

- **[unit-testing.md](./unit-testing.md)** - Detailed unit testing patterns for all DDD layers
- **[integration-testing.md](./integration-testing.md)** - Integration testing for API routes, Server Actions, components
- **[e2e-testing.md](./e2e-testing.md)** - End-to-end testing with Playwright

---

**Remember**: Good tests enable confident refactoring and prevent regressions. Focus on testing what matters to users and business logic, not implementation details.
