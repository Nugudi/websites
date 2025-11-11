---
description: Test commands, best practices checklist, third-party library testing, testing workflow, CI/CD pipeline, troubleshooting
globs:
  - "**/__tests__/**/*.ts"
  - "**/__tests__/**/*.tsx"
  - "**/*.test.ts"
  - "**/*.test.tsx"
  - "**/*.spec.ts"
  - "**/*.spec.tsx"
alwaysApply: true
---

# Testing Best Practices & Guidelines

## Test Commands

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run specific test file
pnpm test auth.service.test.ts

# Run tests with coverage
pnpm test:coverage

# Run Storybook tests
pnpm storybook
npm run test-storybook

# Run E2E tests
pnpm test:e2e
```

## Best Practices Checklist

### DO's ✅

#### DDD Layer Testing

- **Repository Tests**: MUST mock HttpClient to test API integration
- **UseCase Tests**: MUST mock Repository and SessionManager to test business logic
- **Test all scenarios**: Success cases, error cases, edge cases
- **Verify mock calls**: Check correct parameters are passed
- **Isolated testing**: Each layer tested independently with mocks
- **Test error handling**: Ensure errors propagate correctly

#### General Testing

- **MUST** write tests for all business logic
- **MUST** test user-facing behavior
- **MUST** use MSW for API mocking
- **MUST** keep tests simple and focused
- **MUST** write descriptive test names
- **MUST** test error states and edge cases
- **MUST** use Storybook for component documentation and testing
- **MUST** mock system time for date-dependent tests

### DON'Ts ❌

#### DDD Layer Testing

- **NEVER** test Repository with real API calls: Always mock HttpClient
- **NEVER** test UseCase with real Repository: Always mock dependencies
- **NEVER** test business logic in Repository: Repository는 순수 데이터 접근만
- **NEVER** test data access in UseCase: UseCase는 비즈니스 로직만
- **NEVER** test DI Containers directly: Container는 설정일 뿐, 로직 없음
- **NEVER** skip error scenario tests: 에러 처리는 필수 테스트 항목

#### General Testing

- **NEVER** test implementation details
- **NEVER** test third-party libraries (TanStack Query, React Hook Form, Zod, etc.)
- **NEVER** write brittle tests that break with refactoring
- **NEVER** skip tests for complex components
- **NEVER** mock everything - use real implementations when possible
- **NEVER** test simple presentational components without logic
- **NEVER** use real system time in tests that depend on dates

## Third-Party Library Testing Guidelines

### Core Principle: Trust the Libraries

**You DO NOT need to test that third-party libraries work correctly.** Well-maintained libraries like TanStack Query, React Hook Form, Zod, and others have their own comprehensive test suites. Testing their functionality is redundant and adds maintenance burden without value.

### ❌ Examples of What NOT to Test

```typescript
// ❌ BAD: Testing TanStack Query's loading state management
it('should show loading state from useQuery', () => {
  const { result } = renderHook(() =>
    useQuery({ queryKey: ['users'], queryFn: fetchUsers })
  );

  // Testing the library - DO NOT DO THIS!
  expect(result.current.isLoading).toBe(true);
});

// ❌ BAD: Testing React Hook Form's validation
it('should validate required field with React Hook Form', () => {
  const { result } = renderHook(() =>
    useForm({
      defaultValues: { email: '' },
      resolver: zodResolver(schema),
    })
  );

  // Testing the library - DO NOT DO THIS!
  expect(result.current.formState.errors.email).toBeDefined();
});

// ❌ BAD: Testing Zod's schema validation
it('should validate email with Zod', () => {
  const schema = z.string().email();

  // Testing Zod - DO NOT DO THIS!
  expect(() => schema.parse('invalid')).toThrow();
});
```

**Why These Are Bad:**

- You're testing library code, not your code
- Libraries already have extensive tests
- Wastes developer time and CI resources
- Creates maintenance burden when libraries update
- Doesn't test YOUR business logic

### ✅ Examples of What to Test

```typescript
// ✅ GOOD: Test YOUR business logic that uses the library
it('should transform user data after fetching', async () => {
  // Arrange - Mock YOUR API response
  server.use(
    http.get('/api/users', () => {
      return HttpResponse.json([
        { id: 1, firstName: 'John', lastName: 'Doe' }
      ]);
    })
  );

  // Act
  const { result } = renderHook(() => useUserList());

  // Assert - Test YOUR transformation logic
  await waitFor(() => {
    expect(result.current.users).toEqual([
      {
        id: 1,
        fullName: 'John Doe', // YOUR transformation
        initials: 'JD',        // YOUR business logic
      },
    ]);
  });
});

// ✅ GOOD: Test YOUR form submission handler
it('should add timestamp to form data on submit', async () => {
  // Arrange
  const onSubmit = vi.fn();
  render(<ContactForm onSubmit={onSubmit} />);

  // Act - Fill and submit form
  await userEvent.type(screen.getByLabelText(/name/i), 'John');
  await userEvent.type(screen.getByLabelText(/email/i), 'john@example.com');
  await userEvent.click(screen.getByRole('button', { name: /submit/i }));

  // Assert - Test YOUR business logic additions
  await waitFor(() => {
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'John',
        email: 'john@example.com',
        submittedAt: expect.any(Date), // YOUR added field
        formVersion: '1.0',             // YOUR added metadata
      })
    );
  });
});

// ✅ GOOD: Test YOUR error handling logic
it('should show custom error message for API failures', async () => {
  // Arrange - Mock API error
  server.use(
    http.post('/api/contact', () => {
      return HttpResponse.error();
    })
  );

  render(<ContactForm />);

  // Act - Submit form
  await userEvent.click(screen.getByRole('button', { name: /submit/i }));

  // Assert - Test YOUR custom error handling
  await waitFor(() => {
    expect(
      screen.getByText(/서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요./i)
    ).toBeInTheDocument();
  });
});
```

**Why These Are Good:**

- Testing YOUR code, not library code
- Testing business logic transformations
- Testing user-facing behavior
- Testing error handling that users will see
- Testing integration points with libraries

### When to Mock Libraries

Mock libraries ONLY when:

1. **Testing in isolation**: When testing a component that uses a hook, mock the hook to test the component independently
2. **Avoiding side effects**: Mock libraries that would cause unwanted side effects in tests (e.g., analytics, monitoring)
3. **Performance**: Mock heavy libraries that would slow down tests significantly

```typescript
// ✅ GOOD: Mock a custom hook that uses TanStack Query internally
vi.mock('@/src/hooks/use-user', () => ({
  useUser: () => ({
    user: { id: '1', name: 'Test User' },
    isLoading: false,
    error: null,
  }),
}));

// Now test YOUR component's behavior with this data
it('should display user name', () => {
  render(<UserProfile />);

  // Test YOUR rendering logic
  expect(screen.getByText('Test User')).toBeInTheDocument();
});

// ✅ GOOD: Mock analytics to avoid side effects
vi.mock('@/src/utils/analytics', () => ({
  trackEvent: vi.fn(),
}));

it('should track purchase event', async () => {
  const { trackEvent } = await import('@/src/utils/analytics');

  render(<PurchaseButton productId="123" />);
  await userEvent.click(screen.getByRole('button'));

  // Test YOUR analytics integration
  expect(trackEvent).toHaveBeenCalledWith('purchase', {
    productId: '123',
    timestamp: expect.any(Number),
  });
});
```

### Summary: Third-Party Testing Guidelines

| Aspect | Guideline |
|--------|-----------|
| **Library Functionality** | ❌ DO NOT test - trust the library |
| **Your Business Logic** | ✅ MUST test - your transformations |
| **Integration Points** | ✅ MUST test - how you use library results |
| **Error Handling** | ✅ MUST test - your custom error messages |
| **Mocking** | ✅ Only when necessary for isolation/performance |

**Key Takeaway**: Trust that libraries work. Test YOUR code.

## Testing Workflow

### 1. Before Writing Code
- Think about testability
- Consider how to structure code for easy testing
- Identify dependencies that need to be injectable

### 2. While Writing Code
- Write tests alongside implementation
- Follow Test-Driven Development (TDD) when possible
- Red → Green → Refactor cycle

### 3. Before Committing
- Run tests locally: `pnpm test`
- Check coverage: `pnpm test:coverage`
- Fix any failing tests
- Ensure new code has adequate test coverage

### 4. In Pull Request
- Ensure CI tests pass
- Review test coverage reports
- Address test-related feedback
- Verify Storybook builds successfully

### 5. After Merge
- Monitor test coverage trends
- Watch for flaky tests in CI
- Update tests as requirements change
- Refactor tests when code structure changes

## Continuous Integration

All tests run automatically on:

- Pull request creation
- Push to main branch
- Pre-deployment checks

### CI Test Pipeline

```yaml
# Example CI workflow (.github/workflows/test.yml)
name: Test

on:
  pull_request:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8

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

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/coverage-final.json
```

### CI Pipeline Stages

| Stage | Command | Purpose | Failure Impact |
|-------|---------|---------|----------------|
| **Type Check** | `pnpm check-types` | Verify TypeScript types | Blocks merge |
| **Lint** | `pnpm lint` | Check code quality | Blocks merge |
| **Unit Tests** | `pnpm test:unit` | Test business logic | Blocks merge |
| **Build** | `pnpm build` | Verify app builds | Blocks merge |
| **E2E Tests** | `pnpm test:e2e` | Test user flows | Blocks merge |
| **Coverage** | Upload to Codecov | Track coverage trends | Warning only |

## Troubleshooting Common Issues

### Test Timeout Issues

**Problem**: Tests fail with timeout errors

```typescript
// ❌ BAD: Default timeout too short for slow operations
it('should fetch large dataset', async () => {
  const result = await fetchLargeDataset();
  expect(result).toBeDefined();
});

// ✅ GOOD: Increase timeout for async operations
it('should fetch large dataset', async () => {
  const result = await fetchLargeDataset();
  expect(result).toBeDefined();
}, 10000); // 10 second timeout

// ✅ GOOD: Configure timeout globally
// vitest.config.ts
export default defineConfig({
  test: {
    testTimeout: 10000, // 10 seconds for all tests
  },
});
```

### Flaky Tests

**Problem**: Tests sometimes pass, sometimes fail

```typescript
// ❌ BAD: Racing condition without proper waiting
it('should show user data', async () => {
  render(<UserProfile />);

  // Immediately asserting - data might not be loaded yet!
  expect(screen.getByText('John Doe')).toBeInTheDocument();
});

// ✅ GOOD: Use waitFor for async assertions
it('should show user data', async () => {
  render(<UserProfile />);

  // Wait for async data to load
  await waitFor(() => {
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
});

// ✅ GOOD: Use findBy queries (built-in waitFor)
it('should show user data', async () => {
  render(<UserProfile />);

  // findBy queries automatically wait
  const userName = await screen.findByText('John Doe');
  expect(userName).toBeInTheDocument();
});
```

**Common Causes of Flaky Tests:**

1. **Not waiting for async operations**: Use `waitFor`, `findBy*` queries
2. **Timing dependencies**: Mock system time with `vi.useFakeTimers()`
3. **External dependencies**: Mock APIs with MSW
4. **Shared state**: Clean up properly with `afterEach(() => cleanup())`
5. **Test order dependencies**: Tests should be independent

### Module Resolution Errors

**Problem**: Tests can't find modules

```typescript
// ❌ BAD: Relative imports break when files move
import { useAuth } from '../../../auth/hooks/use-auth';

// ✅ GOOD: Use path aliases consistently
import { useAuth } from '@/src/domains/auth/hooks/use-auth';
```

**Solution**: Configure path aliases in `tsconfig.json` and `vitest.config.ts`

```typescript
// vitest.config.ts
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()], // Enable tsconfig path resolution
  test: {
    // ...
  },
});
```

### DOM Cleanup Issues

**Problem**: Tests interfere with each other

```typescript
// ❌ BAD: Not cleaning up after tests
it('test 1', () => {
  render(<Component />);
  // No cleanup - DOM elements remain
});

it('test 2', () => {
  render(<Component />);
  // DOM now has elements from both tests!
});

// ✅ GOOD: Auto cleanup with setup file
// vitest.browser.setup.ts
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(() => {
  cleanup(); // Automatic cleanup after each test
});
```

### MSW Handler Not Working

**Problem**: API mocks not intercepting requests

```typescript
// ❌ BAD: Handler URL doesn't match request
export const handlers = [
  http.get('/api/users', () => { // Wrong path
    return HttpResponse.json([]);
  }),
];

// Actual request
fetch('http://localhost:3000/api/v1/users'); // Different path!

// ✅ GOOD: Match exact request path
export const handlers = [
  http.get('http://localhost:3000/api/v1/users', () => {
    return HttpResponse.json([]);
  }),
];

// ✅ GOOD: Use base URL pattern
export const handlers = [
  http.get('*/api/v1/users', () => { // Matches any domain
    return HttpResponse.json([]);
  }),
];
```

### Type Errors in Tests

**Problem**: TypeScript errors in test files

```typescript
// ❌ BAD: Missing type imports
const mockUseAuth = useAuth as vi.Mock; // Type error!

// ✅ GOOD: Import and use proper types
import { vi } from 'vitest';
import type { Mock } from 'vitest';

vi.mock('@/src/hooks/use-auth');
const mockUseAuth = useAuth as Mock;

// ✅ GOOD: Use vi.mocked utility
import { vi } from 'vitest';

vi.mock('@/src/hooks/use-auth');
const mockUseAuth = vi.mocked(useAuth); // Type-safe!
```

## Quick Reference: Testing Decision Tree

```
Is this business logic or a utility function?
├─ YES → MUST write unit tests
└─ NO → Is this a UI component?
    ├─ YES → Has user interactions or conditional logic?
    │   ├─ YES → MUST write component tests
    │   └─ NO → Skip tests (simple presentational component)
    └─ NO → Is this a critical user flow?
        ├─ YES → MUST write E2E tests
        └─ NO → Optional
```

## Summary: Testing Priorities

| Code Type | Test Priority | Test Type | Example |
|-----------|---------------|-----------|---------|
| **Business Logic** | 🔴 Critical | Unit | UseCase, Repository, Utilities |
| **User Interactions** | 🔴 Critical | Component | Forms, Buttons, Navigation |
| **Critical Flows** | 🟡 High | E2E | Login, Purchase, Signup |
| **Conditional Rendering** | 🟡 High | Component | Error states, Loading, Empty |
| **Simple Components** | 🟢 Low | Skip | Pure styling, no logic |

---

**Remember**: Good tests enable confident refactoring and prevent regressions. Focus on testing what matters to users and business logic, not implementation details.

**Related**: See `testing-principles.md` for DDD layer testing, `entity-component-testing.md` for entity/component patterns, `mocking-strategies.md` for MSW and Storybook testing
