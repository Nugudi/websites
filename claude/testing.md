---
description: "Testing strategy overview, testing pyramid, unit/integration/E2E testing patterns, what to test vs skip, and testing tools"
globs:
  - "**/*.test.ts"
  - "**/*.spec.ts"
  - "**/__tests__/**/*.ts"
alwaysApply: true
---

# Testing Strategy Guide

> **Document Type**: Testing Strategy Index & Navigation
> **Target Audience**: All developers and AI agents
> **Purpose**: Central entry point for understanding testing strategies and patterns
> **Last Updated**: 2025-01-12

## 📖 What This Document Covers

This is the **central index** for understanding the testing strategy in Nugudi. Read this first to understand:

- 🎯 **Testing Philosophy**: What to test vs skip
- 🏗️ **Testing Pyramid**: Unit → Integration → E2E
- 🧪 **Testing Patterns**: Repository, UseCase, Entity testing
- 🔧 **Testing Tools**: Vitest, React Testing Library, Playwright

---

## 🚀 Quick Start (Read These in Order)

### 1. Testing Principles (Start Here) ⭐

**📄 [testing/testing-principles.md](./testing/testing-principles.md)**

**Essential reading** for understanding our testing philosophy.

**What You'll Learn**:
- Core testing principles (what MUST be tested)
- UI component testing priority matrix
- What to test vs what to skip
- Testing pyramid and coverage guidelines
- When to write unit vs integration vs E2E tests

**When to Read**:
- ✅ First time writing tests in this codebase
- ✅ Before writing ANY test
- ✅ When deciding test coverage levels

**Key Principles**:
- ✅ **MUST TEST**: UseCases, Repositories, Entities, Business Logic, Utilities
- ⚠️ **CONDITIONAL**: UI components (based on complexity)
- ❌ **SKIP**: Simple presentational components (styling only)

---

### 2. Unit Testing Patterns 🧪

**📄 [testing/unit-testing.md](./testing/unit-testing.md)**

**Unit tests** for isolated component testing (fastest, most numerous).

**What You'll Learn**:
- Testing Repository implementations (Mock HttpClient)
- Testing UseCase business logic (Mock Repository + SessionManager)
- Testing Entity domain logic (Pure functions)
- Testing utility functions
- Testing custom React hooks
- Mocking patterns and best practices

**When to Read**:
- ✅ Testing Repository data layer
- ✅ Testing UseCase domain logic
- ✅ Testing Entity methods
- ✅ Testing utility functions and helpers

**Key Pattern (Repository Test)**:
```typescript
// Mock HttpClient for Repository tests
const mockHttpClient = {
  get: vi.fn(),
  post: vi.fn(),
};

const repository = new UserRepository(mockHttpClient);

it('should fetch user by ID', async () => {
  mockHttpClient.get.mockResolvedValue({
    data: { id: '1', name: 'John' },
  });

  const user = await repository.getById('1');
  expect(user.getId()).toBe('1');
});
```

**Key Pattern (UseCase Test)**:
```typescript
// Mock Repository and SessionManager for UseCase tests
const mockRepository = {
  getById: vi.fn(),
};

const mockSessionManager = {
  getAccessToken: vi.fn(),
};

const useCase = new GetUserUseCase(mockRepository, mockSessionManager);

it('should return user when authenticated', async () => {
  mockSessionManager.getAccessToken.mockResolvedValue('token123');
  mockRepository.getById.mockResolvedValue(userEntity);

  const result = await useCase.execute('1');
  expect(result.getId()).toBe('1');
});
```

---

### 3. Integration Testing Patterns 🔗

**📄 [testing/integration-testing.md](./testing/integration-testing.md)**

**Integration tests** for multiple component interactions (medium speed, fewer tests).

**What You'll Learn**:
- Testing UseCase + Repository integration
- Testing data flow through layers
- Testing feature sections with TanStack Query
- Testing error handling across layers
- API integration testing patterns

**When to Read**:
- ✅ Testing data flow across multiple layers
- ✅ Testing feature sections with data fetching
- ✅ Testing error scenarios end-to-end

**Key Pattern**:
```typescript
// Integration: UseCase + Repository + HttpClient
const httpClient = new FetchHttpClient();
const repository = new UserRepository(httpClient);
const sessionManager = new ClientSessionManager();
const useCase = new GetUserUseCase(repository, sessionManager);

it('should fetch user through entire data flow', async () => {
  // Mock API response
  server.use(
    http.get('/api/users/1', () => {
      return HttpResponse.json({
        data: { id: '1', name: 'John' },
      });
    })
  );

  const result = await useCase.execute('1');
  expect(result.getName()).toBe('John');
});
```

---

### 4. E2E Testing Patterns 🌐

**📄 [testing/e2e-testing.md](./testing/e2e-testing.md)**

**End-to-end tests** for critical user flows (slowest, fewest tests).

**What You'll Learn**:
- Playwright setup and configuration
- Testing critical user journeys (auth, checkout, etc.)
- Browser automation patterns
- Visual regression testing
- When E2E tests are necessary vs overkill

**When to Read**:
- ✅ Testing critical business flows (login, signup, checkout)
- ✅ Testing multi-page user journeys
- ✅ Testing browser-specific behavior

**Key Pattern**:
```typescript
// E2E: Full user flow in browser
test('user can sign in and view profile', async ({ page }) => {
  // Navigate to sign-in page
  await page.goto('/auth/sign-in');

  // Fill credentials
  await page.fill('[name="email"]', 'test@example.com');
  await page.fill('[name="password"]', 'password123');

  // Submit form
  await page.click('button[type="submit"]');

  // Verify redirect to profile
  await expect(page).toHaveURL('/profile');
  await expect(page.locator('h1')).toContainText('Profile');
});
```

---

## 🎯 Common Workflows

### "I need to test a Repository"

**What to Test**:
- ✅ Data fetching (GET, POST, PUT, DELETE)
- ✅ DTO → Entity transformation
- ✅ Error handling (HTTP errors, network errors)
- ✅ Request parameters and headers

**Pattern**:
1. Mock HttpClient with `vi.fn()`
2. Pass mocked HttpClient to Repository
3. Test Repository methods
4. Verify HttpClient calls and Entity transformations

**Read**: [testing/unit-testing.md](./testing/unit-testing.md#repository-testing)

---

### "I need to test a UseCase"

**What to Test**:
- ✅ Business logic orchestration
- ✅ Repository method calls
- ✅ Error handling and validation
- ✅ SessionManager integration

**Pattern**:
1. Mock Repository with `vi.fn()`
2. Mock SessionManager with `vi.fn()`
3. Pass mocks to UseCase
4. Test UseCase.execute() methods
5. Verify business logic and mock calls

**Read**: [testing/unit-testing.md](./testing/unit-testing.md#usecase-testing)

---

### "I need to test an Entity"

**What to Test**:
- ✅ Domain validation logic
- ✅ Entity methods (getters, calculations, formatters)
- ✅ Entity state changes
- ✅ Invariants and business rules

**Pattern**:
1. Create Entity instances
2. Test validation logic
3. Test domain methods
4. Test state transformations

**Read**: [testing/unit-testing.md](./testing/unit-testing.md#entity-testing)

---

### "Should I test this UI component?"

**Use the Priority Matrix**:

| Component Type | Has User Interaction? | Has State? | Has Conditional Logic? | Test? |
|----------------|----------------------|-----------|----------------------|--------|
| Presentational | ❌ | ❌ | ❌ | **Skip** |
| Presentational | ✅ | ❌ | ❌ | **Medium** |
| Container | ❌ | ✅ | ❌ | **High** |
| Container | ✅ | ✅ | ✅ | **Critical** |
| Form | ✅ | ✅ | ✅ | **Critical** |

**Skip Testing**:
- Simple styled wrappers (Box, Card, Container)
- Components with only props.children rendering
- Pure styling components with no logic

**Require Testing**:
- Components with user interactions (onClick, onChange)
- Components with state management (useState, useReducer)
- Components with conditional rendering
- Form components with validation
- Components with side effects (useEffect)

**Read**: [testing/testing-principles.md](./testing/testing-principles.md#ui-component-testing-priority)

---

### "I need to test data fetching in a Section"

**Integration Test Approach**:

1. Use MSW (Mock Service Worker) to mock API responses
2. Render Section component with React Testing Library
3. Wait for TanStack Query to fetch data
4. Assert UI renders correctly with fetched data
5. Test error states and loading states

**Read**: [testing/integration-testing.md](./testing/integration-testing.md#testing-sections-with-data-fetching)

---

## 📋 Testing Pyramid

```
         /\
        /  \
       /E2E \ ← Fewest, Slowest, Critical user flows only
      /------\
     /        \
    /Integration\ ← Medium, Data flow across layers
   /------------\
  /              \
 /  Unit Tests   \ ← Most, Fastest, Business logic & utilities
/________________\
```

### Unit Tests (70-80% of tests)
- **Speed**: Very fast (milliseconds)
- **Scope**: Single function/class
- **What**: Repository, UseCase, Entity, Utilities
- **Read**: [testing/unit-testing.md](./testing/unit-testing.md)

### Integration Tests (15-25% of tests)
- **Speed**: Medium (seconds)
- **Scope**: Multiple components working together
- **What**: UseCase + Repository, Section + TanStack Query
- **Read**: [testing/integration-testing.md](./testing/integration-testing.md)

### E2E Tests (5-10% of tests)
- **Speed**: Slow (seconds to minutes)
- **Scope**: Full user journey in browser
- **What**: Critical flows (auth, checkout, key features)
- **Read**: [testing/e2e-testing.md](./testing/e2e-testing.md)

---

## 🔧 Testing Tools

### Vitest (Unit & Integration Tests)
- Fast, Vite-native test runner
- Compatible with Jest API
- Used for: Repository, UseCase, Entity, Utility tests

### React Testing Library (Component Tests)
- User-centric testing approach
- Used for: UI component integration tests

### MSW (Mock Service Worker)
- API mocking for tests
- Used for: Integration tests with API calls

### Playwright (E2E Tests)
- Browser automation
- Used for: Critical user flow testing

---

## 🚨 Critical Rules (MUST READ)

### MUST Test

```typescript
// ✅ ALWAYS test these
✅ Repository implementations (data layer)
✅ UseCase implementations (business logic)
✅ Entity domain logic
✅ Utility functions
✅ Custom hooks with logic
✅ Form validation logic
```

### SKIP Testing

```typescript
// ❌ SKIP these
❌ Simple presentational components (styling only)
❌ Type definitions
❌ Constants
❌ Next.js pages (test Sections instead)
❌ Simple mappers (one-line transformations)
```

### Mocking Patterns

```typescript
// ✅ CORRECT - Mock dependencies, not implementations
const mockRepository = {
  getById: vi.fn(),
};

// ❌ WRONG - Don't mock internal implementation details
const mockInternalFunction = vi.fn();
```

---

## 🔗 Related Documentation

### Architecture
- [../core/architecture.md](./core/architecture.md) — Clean Architecture overview
- [../ddd/entity-patterns.md](./ddd/entity-patterns.md) — Entity design patterns
- [../ddd/usecase-patterns.md](./ddd/usecase-patterns.md) — UseCase patterns
- [../ddd/repository-patterns.md](./ddd/repository-patterns.md) — Repository patterns

### Frontend
- [../frontend/section-patterns.md](./frontend/section-patterns.md) — Section testing patterns
- [../frontend/component-patterns.md](./frontend/component-patterns.md) — Component testing

---

## 🎓 Learning Path

For new developers or AI agents:

1. **Start** (Required): Read [testing/testing-principles.md](./testing/testing-principles.md) (15 min)
2. **Unit Tests**: Read [testing/unit-testing.md](./testing/unit-testing.md) (20 min)
3. **Integration Tests**: Read [testing/integration-testing.md](./testing/integration-testing.md) (15 min)
4. **E2E Tests**: Read [testing/e2e-testing.md](./testing/e2e-testing.md) (10 min)

**Total Time**: ~60 minutes to master testing strategies.

---

## 📞 Need Help?

- **Don't know what to test?** → Read [testing/testing-principles.md](./testing/testing-principles.md)
- **Testing Repository?** → Read [testing/unit-testing.md](./testing/unit-testing.md#repository-testing)
- **Testing UseCase?** → Read [testing/unit-testing.md](./testing/unit-testing.md#usecase-testing)
- **Testing data flow?** → Read [testing/integration-testing.md](./testing/integration-testing.md)
- **Testing user flows?** → Read [testing/e2e-testing.md](./testing/e2e-testing.md)

---

**Remember**: This is an **index document**. For detailed testing patterns and examples, follow the links to specific documents listed above.
