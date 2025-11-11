---
description: Date/time testing, API mocking with MSW, component/module mocking, Storybook UI testing, visual regression
globs:
  - "**/__tests__/**/*.ts"
  - "**/__tests__/**/*.tsx"
  - "**/*.test.ts"
  - "**/*.test.tsx"
  - "**/*.spec.ts"
  - "**/*.spec.tsx"
  - "**/*.stories.tsx"
---

# Testing Tools, Mocking Strategies & Storybook

## Testing Tools and Frameworks

### Unit Testing

- **Framework**: Vitest
- **Utilities**: Testing Library, MSW for API mocking
- **Coverage**: Business logic, utilities, hooks

### Component Testing

- **Framework**: Storybook with UI Test addon
- **Interaction Testing**: Play functions for user interactions
- **Visual Testing**: Chromatic for visual regression

### E2E Testing

- **Framework**: Playwright
- **Scope**: Critical user journeys
- **Environment**: Staging/Preview deployments

## Test Environment Strategy

### Browser Environment (JSDOM)

Use **`.browser.test.ts`** or **`.browser.test.tsx`** for code that:
- Renders React components
- Interacts with DOM APIs
- Uses browser-specific globals (window, document, localStorage)
- Tests user interactions and events
- Tests hooks that use browser APIs

#### Examples of Browser Tests

```typescript
// components/button/button.browser.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './index';

describe('Button Component', () => {
  it('should handle click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledOnce();
  });
});
```

```typescript
// hooks/use-local-storage.browser.test.ts
import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from './use-local-storage';

describe('useLocalStorage Hook', () => {
  it('should persist value to localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('key', 'initial'));

    act(() => {
      result.current[1]('updated');
    });

    expect(localStorage.getItem('key')).toBe('"updated"');
  });
});
```

### Node Environment

Use **`.node.test.ts`** for code that:
- Performs server-side logic
- Handles file system operations
- Makes direct API calls without browser context
- Tests pure business logic without UI
- Tests utility functions that don't need DOM

#### Examples of Node Tests

```typescript
// domains/auth/domain/usecases/hash-password.usecase.node.test.ts
import { hashPassword, verifyPassword } from './hash-password.usecase';

describe('HashPasswordUseCase', () => {
  it('should hash and verify passwords', async () => {
    const password = 'SecurePass123!';
    const hash = await hashPassword(password);

    expect(await verifyPassword(password, hash)).toBe(true);
    expect(await verifyPassword('wrong', hash)).toBe(false);
  });
});
```

```typescript
// utils/format.node.test.ts
import { formatCurrency, parseDate } from './format';

describe('Format Utils', () => {
  it('should format currency without DOM dependency', () => {
    expect(formatCurrency(1000)).toBe('₩1,000');
  });

  it('should parse dates correctly', () => {
    const date = parseDate('2024-01-01');
    expect(date.getFullYear()).toBe(2024);
  });
});
```

### Choosing the Right Environment

| Test Type        | File Suffix         | Environment | Use Cases                              |
| ---------------- | ------------------- | ----------- | -------------------------------------- |
| React Components | `.browser.test.tsx` | JSDOM       | Component rendering, user interactions |
| React Hooks      | `.browser.test.ts`  | JSDOM       | Hooks using browser APIs               |
| DOM Utilities    | `.browser.test.ts`  | JSDOM       | DOM manipulation, events               |
| Server Actions   | `.node.test.ts`     | Node        | Next.js server actions                 |
| API Handlers     | `.node.test.ts`     | Node        | API routes, backend logic              |
| Pure Functions   | `.node.test.ts`     | Node        | Business logic, calculations           |
| File Operations  | `.node.test.ts`     | Node        | File system, database operations       |

### Vitest Configuration

Our Vitest setup automatically runs tests in the appropriate environment:

```typescript
// vitest.config.ts
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    projects: [
      {
        extends: true,
        plugins: [react(), tsconfigPaths()],
        test: {
          name: 'js-dom',
          environment: 'jsdom',
          include: ['tests/**/*.browser.{test,spec}.?(c|m)[jt]s?(x)'],
          setupFiles: ['./vitest.browser.setup.ts'],
        },
      },
      {
        extends: true,
        plugins: [tsconfigPaths()],
        test: {
          name: 'node',
          environment: 'node',
          include: ['tests/**/*.node.{test,spec}.?(c|m)[jt]s?(x)'],
        },
      },
    ],
  },
});
```

### Setup Files

#### Browser Setup (`vitest.browser.setup.ts`)

```typescript
// Mock browser APIs and set up testing utilities
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));
```

#### Node Setup (if needed)

```typescript
// Setup for Node environment tests
import { beforeAll, afterAll } from 'vitest';

beforeAll(() => {
  // Setup test database connection
  // Initialize test fixtures
});

afterAll(() => {
  // Clean up resources
  // Close connections
});
```

## Testing Date and Time

When testing code that depends on the current date/time, always mock the system clock to ensure consistent, reproducible tests.

### Using Vitest's Time Mocking

```typescript
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import { formatRelativeTime, isExpired, getAge } from './date-utils';

describe('Date Utils', () => {
  beforeEach(() => {
    // Set system time to a fixed date
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-15T10:00:00Z'));
  });

  afterEach(() => {
    // Restore real timers after each test
    vi.useRealTimers();
  });

  it('should format relative time correctly', () => {
    const pastDate = new Date('2024-01-14T10:00:00Z');
    expect(formatRelativeTime(pastDate)).toBe('1 day ago');

    const futureDate = new Date('2024-01-16T10:00:00Z');
    expect(formatRelativeTime(futureDate)).toBe('in 1 day');
  });

  it('should check expiration correctly', () => {
    const expiredDate = new Date('2024-01-14T10:00:00Z');
    expect(isExpired(expiredDate)).toBe(true);

    const validDate = new Date('2024-01-16T10:00:00Z');
    expect(isExpired(validDate)).toBe(false);
  });

  it('should calculate age based on fixed date', () => {
    const birthDate = new Date('2000-01-15T00:00:00Z');
    expect(getAge(birthDate)).toBe(24);
  });
});
```

### Testing Time-Dependent Components

```typescript
// components/countdown/countdown.browser.test.tsx
import { render, screen, act } from '@testing-library/react';
import { beforeEach, afterEach, it, expect, vi } from 'vitest';
import { Countdown } from './index';

describe('Countdown Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-01T00:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should update countdown every second', () => {
    const targetDate = new Date('2024-01-01T00:01:00Z'); // 1 minute from now
    render(<Countdown targetDate={targetDate} />);

    expect(screen.getByText('60 seconds remaining')).toBeInTheDocument();

    // Fast-forward 30 seconds
    act(() => {
      vi.advanceTimersByTime(30000);
    });

    expect(screen.getByText('30 seconds remaining')).toBeInTheDocument();

    // Fast-forward to completion
    act(() => {
      vi.advanceTimersByTime(30000);
    });

    expect(screen.getByText("Time's up!")).toBeInTheDocument();
  });
});
```

### Testing Scheduled Tasks

```typescript
// utils/scheduler.test.ts
import { beforeEach, afterEach, it, expect, vi } from 'vitest';
import { scheduleTask, runScheduledTasks } from './scheduler';

describe('Scheduler', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-01T00:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should execute task at scheduled time', () => {
    const callback = vi.fn();
    const runAt = new Date('2024-01-01T00:05:00Z'); // 5 minutes from now

    scheduleTask(callback, runAt);

    // Task should not run before scheduled time
    vi.advanceTimersByTime(4 * 60 * 1000); // 4 minutes
    runScheduledTasks();
    expect(callback).not.toHaveBeenCalled();

    // Task should run at scheduled time
    vi.advanceTimersByTime(60 * 1000); // 1 more minute
    runScheduledTasks();
    expect(callback).toHaveBeenCalledOnce();
  });
});
```

### Testing Date Formatting Across Timezones

```typescript
// utils/timezone.test.ts
import { beforeEach, it, expect } from 'vitest';
import { formatInTimezone } from './timezone';

describe('Timezone Utils', () => {
  const testDate = new Date('2024-01-15T10:00:00Z');

  it('should format date in different timezones', () => {
    // Test with fixed date to ensure consistency
    expect(formatInTimezone(testDate, 'America/New_York')).toBe(
      'Jan 15, 2024, 5:00 AM'
    );
    expect(formatInTimezone(testDate, 'Asia/Seoul')).toBe(
      'Jan 15, 2024, 7:00 PM'
    );
    expect(formatInTimezone(testDate, 'Europe/London')).toBe(
      'Jan 15, 2024, 10:00 AM'
    );
  });
});
```

### Best Practices for Date/Time Testing

1. **Always mock the system time** for reproducible tests
2. **Use `vi.useFakeTimers()` and `vi.useRealTimers()`** in beforeEach/afterEach
3. **Set a fixed date** with `vi.setSystemTime()`
4. **Use `vi.advanceTimersByTime()`** to simulate time passing
5. **Test edge cases** like daylight saving time transitions, leap years, month boundaries
6. **Be explicit about timezones** when testing timezone-sensitive code

## Mocking Strategies

### API Mocking with MSW

```typescript
// mocks/handlers.ts
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/api/user', () => {
    return HttpResponse.json({
      id: '1',
      name: 'Test User',
    });
  }),

  http.post('/api/login', async ({ request }) => {
    const body = await request.json();

    if (body.email === 'test@example.com' && body.password === 'password') {
      return HttpResponse.json({
        token: 'mock-token',
        user: { id: '1', email: 'test@example.com' },
      });
    }

    return HttpResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    );
  }),

  http.get('/api/posts/:id', ({ params }) => {
    return HttpResponse.json({
      id: params.id,
      title: 'Test Post',
      content: 'This is a test post',
    });
  }),
];
```

```typescript
// mocks/server.ts
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);
```

```typescript
// vitest.setup.ts
import { beforeAll, afterEach, afterAll } from 'vitest';
import { server } from './mocks/server';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

**Using MSW in Tests**:

```typescript
import { server } from '@/mocks/server';
import { http, HttpResponse } from 'msw';

it('should handle API error', async () => {
  // Override default handler for this test
  server.use(
    http.get('/api/user', () => {
      return HttpResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    })
  );

  // Test error handling
  const result = await fetchUser('123');
  expect(result.error).toBe('User not found');
});
```

### Component Mocking

```typescript
// Mock external dependencies
vi.mock('@/src/domains/auth/hooks/use-auth', () => ({
  useAuth: () => ({
    user: { id: '1', name: 'Test User' },
    isAuthenticated: true,
    login: vi.fn(),
    logout: vi.fn(),
  }),
}));

// Test component that uses useAuth
it('should display user name when authenticated', () => {
  render(<UserProfile />);
  expect(screen.getByText('Test User')).toBeInTheDocument();
});
```

### Module Mocking

```typescript
// Mock entire module
vi.mock('@/src/utils/logger', () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
  },
}));

// Test that uses logger
import { logger } from '@/src/utils/logger';

it('should log error on failure', () => {
  performAction();
  expect(logger.error).toHaveBeenCalledWith('Action failed');
});
```

### Partial Module Mocking

```typescript
// Mock only specific exports
vi.mock('@/src/utils/analytics', async () => {
  const actual = await vi.importActual('@/src/utils/analytics');
  return {
    ...actual,
    trackEvent: vi.fn(), // Mock only trackEvent
  };
});
```

## Storybook UI Testing

### Setting Up Stories with Tests

```typescript
// components/button/index.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { within, userEvent, expect } from '@storybook/test';
import { Button } from './index';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'danger'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
};

export default meta;

export const Default: StoryObj<typeof Button> = {
  args: {
    children: 'Click me',
    variant: 'primary',
    size: 'md',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');

    // Test interaction
    await userEvent.click(button);

    // Assert expected behavior
    await expect(button).toHaveTextContent('Click me');
  },
};

export const Disabled: StoryObj<typeof Button> = {
  args: {
    children: 'Disabled',
    disabled: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');

    // Verify button is disabled
    await expect(button).toBeDisabled();
  },
};

export const WithIcon: StoryObj<typeof Button> = {
  args: {
    children: 'Send',
    leftIcon: <SendIcon />,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');
    const icon = canvas.getByTestId('send-icon');

    // Test icon rendering
    await expect(icon).toBeInTheDocument();
    await expect(button).toHaveTextContent('Send');
  },
};
```

### Interaction Testing with Play Functions

```typescript
// Form interaction example
export const LoginForm: StoryObj<typeof Form> = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Fill form
    await userEvent.type(
      canvas.getByLabelText(/email/i),
      'test@example.com'
    );
    await userEvent.type(
      canvas.getByLabelText(/password/i),
      'password123'
    );

    // Submit form
    await userEvent.click(canvas.getByRole('button', { name: /login/i }));

    // Verify submission
    await expect(canvas.getByText(/logged in/i)).toBeInTheDocument();
  },
};
```

### Visual Regression Testing

```typescript
// Run visual tests with Chromatic
export const AllVariants: StoryObj = {
  render: () => (
    <div className="flex gap-4">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="danger">Danger</Button>
    </div>
  ),
  parameters: {
    chromatic: {
      viewports: [375, 768, 1440],
      delay: 300, // Wait 300ms before taking snapshot
    },
  },
};

export const DarkMode: StoryObj = {
  render: () => <Button variant="primary">Dark Mode</Button>,
  parameters: {
    backgrounds: { default: 'dark' },
    chromatic: {
      modes: {
        light: { disable: true },
        dark: { enable: true },
      },
    },
  },
};
```

### Testing Loading States

```typescript
export const Loading: StoryObj<typeof DataTable> = {
  args: {
    isLoading: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Verify loading spinner
    await expect(canvas.getByRole('status')).toBeInTheDocument();
    await expect(canvas.getByText(/loading/i)).toBeInTheDocument();
  },
};
```

### Testing Error States

```typescript
export const Error: StoryObj<typeof DataFetcher> = {
  args: {
    error: new Error('Failed to fetch data'),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Verify error message
    await expect(
      canvas.getByText(/failed to fetch data/i)
    ).toBeInTheDocument();

    // Verify retry button
    const retryButton = canvas.getByRole('button', { name: /retry/i });
    await expect(retryButton).toBeInTheDocument();
  },
};
```

## Coverage Requirements

### Minimum Coverage Targets

- **Overall**: 70%
- **Business Logic**: 90%
- **Utilities**: 95%
- **API Handlers**: 85%
- **UI Components**: Based on priority matrix

### Running Coverage Reports

```bash
# Run tests with coverage
pnpm test:coverage

# Generate detailed HTML report
pnpm test:coverage --reporter=html

# Check coverage thresholds
pnpm test:coverage --coverage.thresholds.lines=70
```

### Coverage Configuration

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        '**/*.stories.tsx',
        '**/*.test.ts',
        '**/*.test.tsx',
        '**/types.ts',
        '**/*.css.ts',
      ],
      thresholds: {
        lines: 70,
        functions: 70,
        branches: 70,
        statements: 70,
      },
    },
  },
});
```

---

**Related**: See `testing-principles.md` for DDD layer testing, `entity-component-testing.md` for Entity and Component patterns, `best-practices.md` for testing guidelines
