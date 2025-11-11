---
description: Integration testing for API routes, Server Actions, Component integration, Query Hooks, and DI Container integration
globs:
  - "**/integration/**/*.test.ts"
  - "**/*.integration.test.ts"
  - "**/integration/**/*.spec.ts"
  - "**/*.integration.spec.ts"
alwaysApply: true
---

# Integration Testing Patterns

> **Document Type**: Integration Testing Guide
> **Target Audience**: All developers
> **Related Documents**: [testing-principles.md](./testing-principles.md), [unit-testing.md](./unit-testing.md), [e2e-testing.md](./e2e-testing.md)
> **Last Updated**: 2025-11-11

This document provides comprehensive integration testing patterns for testing how multiple units work together: API routes, Server Actions, Component + Hook integration, Query Hooks, and DI Container integration.

## What is Integration Testing?

**Integration Testing** tests how multiple units work together to ensure they interact correctly.

**Key Characteristics**:
- **Multi-Unit**: Tests multiple components/modules together
- **Real Dependencies**: Uses real implementations where practical
- **Focused Scope**: Tests specific integration points
- **Still Fast**: Faster than E2E, but slower than unit tests

**Why Integration Tests?**:
- Verify component interactions
- Catch integration bugs early
- Test API contracts
- Validate data flow between layers

**Testing Pyramid Position**: 20-30% of all tests

## Test Environment Strategy

We use different test environments based on what we're testing.

### Browser Environment (JSDOM)

Use **`.browser.test.ts`** or **`.browser.test.tsx`** for:
- React component rendering
- DOM interactions
- Browser-specific globals (window, document, localStorage)
- User events and interactions
- Hooks using browser APIs

### Node Environment

Use **`.node.test.ts`** for:
- Server-side logic
- API routes
- Server Actions
- File system operations
- Pure business logic

### Vitest Configuration

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
          include: ['**/*.browser.{test,spec}.?(c|m)[jt]s?(x)'],
          setupFiles: ['./vitest.browser.setup.ts'],
        },
      },
      {
        extends: true,
        plugins: [tsconfigPaths()],
        test: {
          name: 'node',
          environment: 'node',
          include: ['**/*.node.{test,spec}.?(c|m)[jt]s?(x)'],
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
import { afterEach, vi } from 'vitest';

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

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));
```

## API Route Testing

**Purpose**: Test Next.js API routes to ensure correct request/response handling.

**What to Test**:
- Request validation
- Response format
- Error handling
- Status codes
- Authentication/authorization

**Tools**: MSW (Mock Service Worker), Vitest

### Complete API Route Test Example

```typescript
// app/api/users/route.node.test.ts
import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { GET, POST } from './route';

// Setup MSW server
const server = setupServer(
  http.get('/api/users', () => {
    return HttpResponse.json([
      { id: '1', name: 'John Doe', email: 'john@example.com' },
      { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
    ]);
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('GET /api/users', () => {
  it('should return list of users', async () => {
    // Arrange
    const request = new Request('http://localhost:3000/api/users');

    // Act
    const response = await GET(request);
    const data = await response.json();

    // Assert
    expect(response.status).toBe(200);
    expect(data).toHaveLength(2);
    expect(data[0]).toMatchObject({
      id: '1',
      name: 'John Doe',
    });
  });

  it('should handle empty user list', async () => {
    // Arrange
    server.use(
      http.get('/api/users', () => {
        return HttpResponse.json([]);
      })
    );

    const request = new Request('http://localhost:3000/api/users');

    // Act
    const response = await GET(request);
    const data = await response.json();

    // Assert
    expect(response.status).toBe(200);
    expect(data).toEqual([]);
  });

  it('should handle server errors', async () => {
    // Arrange
    server.use(
      http.get('/api/users', () => {
        return HttpResponse.error();
      })
    );

    const request = new Request('http://localhost:3000/api/users');

    // Act
    const response = await GET(request);

    // Assert
    expect(response.status).toBe(500);
  });

  it('should validate authentication', async () => {
    // Arrange - Request without auth token
    const request = new Request('http://localhost:3000/api/users');

    // Act
    const response = await GET(request);

    // Assert
    expect(response.status).toBe(401);
  });

  it('should accept authenticated requests', async () => {
    // Arrange - Request with valid auth token
    const request = new Request('http://localhost:3000/api/users', {
      headers: {
        Authorization: 'Bearer valid-token',
      },
    });

    // Act
    const response = await GET(request);

    // Assert
    expect(response.status).toBe(200);
  });
});

describe('POST /api/users', () => {
  it('should create new user', async () => {
    // Arrange
    const newUser = {
      name: 'New User',
      email: 'new@example.com',
    };

    server.use(
      http.post('/api/users', async ({ request }) => {
        const body = await request.json();
        return HttpResponse.json(
          {
            id: '3',
            ...body,
          },
          { status: 201 }
        );
      })
    );

    const request = new Request('http://localhost:3000/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newUser),
    });

    // Act
    const response = await POST(request);
    const data = await response.json();

    // Assert
    expect(response.status).toBe(201);
    expect(data).toMatchObject({
      id: expect.any(String),
      name: 'New User',
      email: 'new@example.com',
    });
  });

  it('should validate required fields', async () => {
    // Arrange - Missing required email field
    const invalidUser = {
      name: 'New User',
    };

    const request = new Request('http://localhost:3000/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(invalidUser),
    });

    // Act
    const response = await POST(request);
    const data = await response.json();

    // Assert
    expect(response.status).toBe(400);
    expect(data.error).toContain('email is required');
  });

  it('should validate email format', async () => {
    // Arrange - Invalid email format
    const invalidUser = {
      name: 'New User',
      email: 'invalid-email',
    };

    const request = new Request('http://localhost:3000/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(invalidUser),
    });

    // Act
    const response = await POST(request);
    const data = await response.json();

    // Assert
    expect(response.status).toBe(400);
    expect(data.error).toContain('Invalid email format');
  });

  it('should handle duplicate email errors', async () => {
    // Arrange
    server.use(
      http.post('/api/users', () => {
        return HttpResponse.json(
          { error: 'Email already exists' },
          { status: 409 }
        );
      })
    );

    const duplicateUser = {
      name: 'Duplicate User',
      email: 'existing@example.com',
    };

    const request = new Request('http://localhost:3000/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(duplicateUser),
    });

    // Act
    const response = await POST(request);
    const data = await response.json();

    // Assert
    expect(response.status).toBe(409);
    expect(data.error).toBe('Email already exists');
  });
});
```

**Key Points**:
- ✅ Test all HTTP methods (GET, POST, PUT, DELETE)
- ✅ Test request validation (required fields, formats)
- ✅ Test response formats and status codes
- ✅ Test authentication/authorization
- ✅ Test error scenarios (404, 500, validation errors)
- ✅ Use MSW to mock external API calls

## Server Action Testing

**Purpose**: Test Next.js Server Actions for form submissions and server-side operations.

**What to Test**:
- Form data processing
- Validation
- Database operations (mocked)
- Error handling
- Redirect behavior

### Complete Server Action Test Example

```typescript
// app/actions/__tests__/create-post.action.node.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createPost } from '../create-post.action';

// Mock database
vi.mock('@/src/lib/db', () => ({
  db: {
    post: {
      create: vi.fn(),
    },
  },
}));

// Mock revalidation
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

// Mock redirect
vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}));

import { db } from '@/src/lib/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

describe('createPost Server Action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create post and redirect on success', async () => {
    // Arrange
    const formData = new FormData();
    formData.append('title', 'Test Post');
    formData.append('content', 'This is a test post content');
    formData.append('category', 'technology');

    vi.mocked(db.post.create).mockResolvedValue({
      id: '1',
      title: 'Test Post',
      content: 'This is a test post content',
      category: 'technology',
      createdAt: new Date(),
    });

    // Act
    await createPost(formData);

    // Assert
    expect(db.post.create).toHaveBeenCalledWith({
      data: {
        title: 'Test Post',
        content: 'This is a test post content',
        category: 'technology',
      },
    });

    expect(revalidatePath).toHaveBeenCalledWith('/posts');
    expect(redirect).toHaveBeenCalledWith('/posts/1');
  });

  it('should return validation errors for missing title', async () => {
    // Arrange
    const formData = new FormData();
    formData.append('content', 'Content without title');

    // Act
    const result = await createPost(formData);

    // Assert
    expect(result.errors).toMatchObject({
      title: 'Title is required',
    });

    expect(db.post.create).not.toHaveBeenCalled();
  });

  it('should return validation errors for short content', async () => {
    // Arrange
    const formData = new FormData();
    formData.append('title', 'Valid Title');
    formData.append('content', 'Too short');

    // Act
    const result = await createPost(formData);

    // Assert
    expect(result.errors).toMatchObject({
      content: 'Content must be at least 20 characters',
    });

    expect(db.post.create).not.toHaveBeenCalled();
  });

  it('should handle database errors gracefully', async () => {
    // Arrange
    const formData = new FormData();
    formData.append('title', 'Test Post');
    formData.append('content', 'This is a test post content');

    vi.mocked(db.post.create).mockRejectedValue(
      new Error('Database connection failed')
    );

    // Act
    const result = await createPost(formData);

    // Assert
    expect(result.error).toBe('Failed to create post. Please try again.');
    expect(redirect).not.toHaveBeenCalled();
  });

  it('should sanitize HTML content', async () => {
    // Arrange
    const formData = new FormData();
    formData.append('title', 'Test Post');
    formData.append('content', '<script>alert("xss")</script>Safe content');

    vi.mocked(db.post.create).mockResolvedValue({
      id: '1',
      title: 'Test Post',
      content: 'Safe content', // XSS removed
      createdAt: new Date(),
    });

    // Act
    await createPost(formData);

    // Assert
    expect(db.post.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        content: expect.not.stringContaining('<script>'),
      }),
    });
  });
});
```

**Key Points**:
- ✅ Test FormData processing
- ✅ Test validation logic
- ✅ Test successful operations and side effects (revalidation, redirect)
- ✅ Test error handling
- ✅ Test security concerns (XSS, sanitization)
- ✅ Mock database and Next.js functions

## Component Integration Testing

**Purpose**: Test React components integrated with hooks, state management, and context.

**What to Test**:
- Component + Hook interaction
- User interactions causing state changes
- Conditional rendering based on state
- Error boundaries
- Suspense boundaries

**Tools**: Testing Library, Vitest (browser environment)

### Complete Component Integration Test Example

```typescript
// domains/auth/presentation/sections/login-section/index.browser.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LoginSection } from './index';

// Mock the query hook
vi.mock('../../queries/use-login.query', () => ({
  useLogin: () => ({
    mutate: vi.fn(),
    isPending: false,
    error: null,
  }),
}));

import { useLogin } from '../../queries/use-login.query';

describe('LoginSection Integration', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    vi.clearAllMocks();
  });

  const renderWithProviders = (component: React.ReactElement) => {
    return render(
      <QueryClientProvider client={queryClient}>
        {component}
      </QueryClientProvider>
    );
  };

  it('should render login form', () => {
    // Act
    renderWithProviders(<LoginSection />);

    // Assert
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('should submit form with valid data', async () => {
    // Arrange
    const user = userEvent.setup();
    const mockMutate = vi.fn();

    vi.mocked(useLogin).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      error: null,
    } as any);

    renderWithProviders(<LoginSection />);

    // Act
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /login/i }));

    // Assert
    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });

  it('should display validation errors for invalid email', async () => {
    // Arrange
    const user = userEvent.setup();
    renderWithProviders(<LoginSection />);

    // Act
    await user.type(screen.getByLabelText(/email/i), 'invalid-email');
    await user.click(screen.getByRole('button', { name: /login/i }));

    // Assert
    await waitFor(() => {
      expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();
    });
  });

  it('should display validation errors for empty password', async () => {
    // Arrange
    const user = userEvent.setup();
    renderWithProviders(<LoginSection />);

    // Act
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    // Don't type password
    await user.click(screen.getByRole('button', { name: /login/i }));

    // Assert
    await waitFor(() => {
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
  });

  it('should disable submit button during submission', async () => {
    // Arrange
    const user = userEvent.setup();

    vi.mocked(useLogin).mockReturnValue({
      mutate: vi.fn(),
      isPending: true, // Simulating pending state
      error: null,
    } as any);

    renderWithProviders(<LoginSection />);

    // Assert
    expect(screen.getByRole('button', { name: /logging in/i })).toBeDisabled();
  });

  it('should display error message on login failure', async () => {
    // Arrange
    vi.mocked(useLogin).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
      error: new Error('Invalid credentials'),
    } as any);

    renderWithProviders(<LoginSection />);

    // Assert
    expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('should clear error message when user starts typing', async () => {
    // Arrange
    const user = userEvent.setup();

    vi.mocked(useLogin).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
      error: new Error('Invalid credentials'),
    } as any);

    renderWithProviders(<LoginSection />);

    expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();

    // Act
    await user.type(screen.getByLabelText(/email/i), 'new@example.com');

    // Assert
    await waitFor(() => {
      expect(
        screen.queryByText(/invalid credentials/i)
      ).not.toBeInTheDocument();
    });
  });

  it('should show password when toggle is clicked', async () => {
    // Arrange
    const user = userEvent.setup();
    renderWithProviders(<LoginSection />);

    const passwordInput = screen.getByLabelText(/password/i);
    const toggleButton = screen.getByRole('button', { name: /show password/i });

    expect(passwordInput).toHaveAttribute('type', 'password');

    // Act
    await user.click(toggleButton);

    // Assert
    expect(passwordInput).toHaveAttribute('type', 'text');
  });
});
```

**Key Points**:
- ✅ Test component + hook integration
- ✅ Test user interactions (typing, clicking)
- ✅ Test form validation
- ✅ Test loading states
- ✅ Test error states
- ✅ Test conditional rendering
- ✅ Provide necessary context (QueryClient)

## Query Hook Testing

**Purpose**: Test React Query hooks that integrate with DI Containers and UseCases.

**What to Test**:
- Data fetching success
- Error handling
- Loading states
- Cache behavior
- UseCase integration

### Complete Query Hook Test Example

```typescript
// domains/benefit/presentation/queries/__tests__/get-benefits.query.browser.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useGetBenefits } from '../get-benefits.query';
import type { GetBenefitsUseCase } from '../../../domain/usecases/get-benefits.usecase';

// Mock DI Container
vi.mock('../../../di/benefit-client-container', () => ({
  getBenefitClientContainer: () => ({
    getGetBenefitsUseCase: vi.fn(),
  }),
}));

import { getBenefitClientContainer } from '../../../di/benefit-client-container';

describe('useGetBenefits Query Hook', () => {
  let queryClient: QueryClient;
  let mockUseCase: GetBenefitsUseCase;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    mockUseCase = {
      execute: vi.fn(),
    } as any;

    vi.mocked(getBenefitClientContainer().getGetBenefitsUseCase).mockReturnValue(
      mockUseCase
    );
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it('should fetch benefits successfully', async () => {
    // Arrange
    const mockBenefits = [
      {
        id: 1,
        name: 'Benefit 1',
        price: 10000,
      },
      {
        id: 2,
        name: 'Benefit 2',
        price: 15000,
      },
    ];

    vi.mocked(mockUseCase.execute).mockResolvedValue(mockBenefits);

    // Act
    const { result } = renderHook(() => useGetBenefits(), { wrapper });

    // Assert - Initial loading state
    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();

    // Assert - Success state
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockBenefits);
    expect(mockUseCase.execute).toHaveBeenCalledTimes(1);
  });

  it('should handle errors gracefully', async () => {
    // Arrange
    const error = new Error('Failed to fetch benefits');
    vi.mocked(mockUseCase.execute).mockRejectedValue(error);

    // Act
    const { result } = renderHook(() => useGetBenefits(), { wrapper });

    // Assert - Error state
    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual(error);
    expect(result.current.data).toBeUndefined();
  });

  it('should cache results', async () => {
    // Arrange
    const mockBenefits = [{ id: 1, name: 'Benefit 1', price: 10000 }];
    vi.mocked(mockUseCase.execute).mockResolvedValue(mockBenefits);

    // Act - First render
    const { result: result1 } = renderHook(() => useGetBenefits(), { wrapper });

    await waitFor(() => {
      expect(result1.current.isSuccess).toBe(true);
    });

    // Act - Second render (should use cache)
    const { result: result2 } = renderHook(() => useGetBenefits(), { wrapper });

    // Assert - Should immediately have data from cache
    expect(result2.current.data).toEqual(mockBenefits);
    expect(mockUseCase.execute).toHaveBeenCalledTimes(1); // Not called again
  });

  it('should refetch on invalidation', async () => {
    // Arrange
    const mockBenefits1 = [{ id: 1, name: 'Benefit 1', price: 10000 }];
    const mockBenefits2 = [{ id: 2, name: 'Benefit 2', price: 15000 }];

    vi.mocked(mockUseCase.execute)
      .mockResolvedValueOnce(mockBenefits1)
      .mockResolvedValueOnce(mockBenefits2);

    // Act - Initial fetch
    const { result } = renderHook(() => useGetBenefits(), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockBenefits1);

    // Act - Invalidate and refetch
    await queryClient.invalidateQueries({ queryKey: ['benefits'] });

    // Assert - Should refetch with new data
    await waitFor(() => {
      expect(result.current.data).toEqual(mockBenefits2);
    });

    expect(mockUseCase.execute).toHaveBeenCalledTimes(2);
  });

  it('should support filtering parameters', async () => {
    // Arrange
    const mockFilteredBenefits = [
      { id: 1, name: 'Benefit 1', category: 'food', price: 10000 },
    ];

    vi.mocked(mockUseCase.execute).mockResolvedValue(mockFilteredBenefits);

    // Act
    const { result } = renderHook(
      () => useGetBenefits({ category: 'food' }),
      { wrapper }
    );

    // Assert
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockUseCase.execute).toHaveBeenCalledWith({ category: 'food' });
    expect(result.current.data).toEqual(mockFilteredBenefits);
  });
});
```

**Key Points**:
- ✅ Test data fetching success
- ✅ Test error handling
- ✅ Test loading states
- ✅ Test cache behavior
- ✅ Test query invalidation and refetching
- ✅ Test with different parameters
- ✅ Mock DI Container and UseCase

## DI Container Integration Testing

**Purpose**: Test that DI Containers correctly wire dependencies together.

**What to Test**:
- Container provides correct instances
- Dependencies are properly injected
- Singleton behavior (for Client Containers)
- New instance behavior (for Server Containers)

### Complete DI Container Test Example

```typescript
// domains/auth/di/__tests__/auth-client-container.node.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getAuthClientContainer } from '../auth-client-container';

describe('Auth Client Container', () => {
  beforeEach(() => {
    // Reset container singleton between tests
    vi.resetModules();
  });

  it('should provide LoginWithOAuthUseCase', () => {
    // Act
    const container = getAuthClientContainer();
    const useCase = container.getLoginWithOAuthUseCase();

    // Assert
    expect(useCase).toBeDefined();
    expect(useCase.execute).toBeInstanceOf(Function);
  });

  it('should provide same instance on multiple calls (singleton)', () => {
    // Act
    const container1 = getAuthClientContainer();
    const container2 = getAuthClientContainer();

    const useCase1 = container1.getLoginWithOAuthUseCase();
    const useCase2 = container2.getLoginWithOAuthUseCase();

    // Assert
    expect(useCase1).toBe(useCase2); // Same instance
  });

  it('should provide all required dependencies', () => {
    // Act
    const container = getAuthClientContainer();

    // Assert
    expect(container.getLoginWithOAuthUseCase()).toBeDefined();
    expect(container.getLogoutUseCase()).toBeDefined();
    expect(container.getRefreshTokenUseCase()).toBeDefined();
  });

  it('should inject dependencies correctly', () => {
    // Act
    const container = getAuthClientContainer();
    const useCase = container.getLoginWithOAuthUseCase();

    // Assert - UseCase should have repository and sessionManager
    // This is verified by successful execution
    expect(() => useCase.execute('google', 'code', 'redirect')).not.toThrow();
  });
});

// domains/auth/di/__tests__/auth-server-container.node.test.ts
import { describe, it, expect } from 'vitest';
import { createAuthServerContainer } from '../auth-server-container';

describe('Auth Server Container', () => {
  it('should provide new instance on each call', () => {
    // Act
    const container1 = createAuthServerContainer();
    const container2 = createAuthServerContainer();

    const useCase1 = container1.getLoginWithOAuthUseCase();
    const useCase2 = container2.getLoginWithOAuthUseCase();

    // Assert
    expect(useCase1).not.toBe(useCase2); // Different instances
  });

  it('should provide all required dependencies', () => {
    // Act
    const container = createAuthServerContainer();

    // Assert
    expect(container.getLoginWithOAuthUseCase()).toBeDefined();
    expect(container.getLogoutUseCase()).toBeDefined();
    expect(container.getRefreshTokenUseCase()).toBeDefined();
  });
});
```

**Key Points**:
- ✅ Test singleton behavior for Client Containers
- ✅ Test new instance behavior for Server Containers
- ✅ Test all dependencies are provided
- ✅ Test dependencies are correctly injected
- ❌ Don't test UseCase/Repository logic (tested separately)

## Testing Date and Time

When testing code that depends on the current date/time, always mock the system clock.

### Using Vitest's Time Mocking

```typescript
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import { formatRelativeTime, isExpired } from './date-utils';

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

## Best Practices

### DO's ✅

- Use MSW for API mocking
- Test real user interactions
- Test component + hook integration
- Provide necessary context (QueryClient, Router, etc.)
- Test error boundaries and suspense
- Mock external services, not your code
- Use `waitFor` for async assertions
- Mock system time for date-dependent tests

### DON'Ts ❌

- Don't test implementation details
- Don't test third-party libraries
- Don't skip error scenarios
- Don't use real API calls in tests
- Don't share state between tests
- Don't test DI Container logic (only wiring)
- Don't use real system time

## Related Documentation

- **[testing-principles.md](./testing-principles.md)** - Core testing philosophy and what to test
- **[unit-testing.md](./unit-testing.md)** - Unit testing patterns for all DDD layers
- **[e2e-testing.md](./e2e-testing.md)** - End-to-end testing with Playwright

---

**Remember**: Integration tests verify that multiple units work together correctly. Focus on integration points, data flow, and user-facing behavior.
