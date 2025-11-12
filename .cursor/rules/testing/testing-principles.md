---
description: Core testing principles, DDD layer testing patterns, test environment setup
globs:
  - "**/__tests__/**/*.ts"
  - "**/__tests__/**/*.tsx"
  - "**/*.test.ts"
  - "**/*.test.tsx"
  - "**/*.spec.ts"
  - "**/*.spec.tsx"
---

# Testing Principles & DDD Layer Testing

## Core Testing Principles

### 1. Non-UI Modules MUST Have Tests

All modules that are not directly related to UI rendering **must** have comprehensive test coverage:

- **UseCases (DDD)**: Business logic orchestration, domain operations
- **Repositories (DDD)**: Data access layer, API integration
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

## DDD Layer Testing Patterns

### Repository Testing (Data Access Layer)

**목적**: Repository는 순수 데이터 접근만 담당하므로, HttpClient mock을 사용하여 API 통신을 테스트합니다.

```typescript
// domains/auth/repositories/__tests__/auth-repository.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthRepositoryImpl } from '../auth-repository';
import type { HttpClient, HttpResponse } from '@core/infrastructure/http';

describe('AuthRepository', () => {
  let mockHttpClient: HttpClient;
  let authRepository: AuthRepositoryImpl;

  beforeEach(() => {
    // HttpClient Mock 생성
    mockHttpClient = {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      patch: vi.fn(),
      delete: vi.fn(),
    };

    authRepository = new AuthRepositoryImpl(mockHttpClient);
  });

  describe('loginWithGoogle', () => {
    it('should call HttpClient with correct parameters', async () => {
      // Arrange
      const mockResponse: HttpResponse<GoogleLoginResponse> = {
        status: 200,
        data: {
          status: 'EXISTING_USER',
          userId: 'user-123',
          accessToken: 'access-token',
          refreshToken: 'refresh-token',
        },
        headers: new Headers(),
      };

      vi.mocked(mockHttpClient.post).mockResolvedValue(mockResponse);

      const params = {
        code: 'auth-code-123',
        redirectUri: 'http://localhost:3000/callback',
      };

      // Act
      const result = await authRepository.loginWithGoogle(params);

      // Assert
      expect(mockHttpClient.post).toHaveBeenCalledWith(
        '/api/v1/auth/login/google',
        params
      );
      expect(result).toEqual({
        status: 200,
        data: mockResponse.data,
      });
    });

    it('should handle API errors correctly', async () => {
      // Arrange
      const error = new Error('Network error');
      vi.mocked(mockHttpClient.post).mockRejectedValue(error);

      // Act & Assert
      await expect(
        authRepository.loginWithGoogle({
          code: 'invalid',
          redirectUri: 'http://localhost:3000/callback',
        })
      ).rejects.toThrow('Network error');
    });
  });
});
```

**핵심 포인트**:

- ✅ HttpClient를 Mock하여 실제 API 호출 없이 테스트
- ✅ 파라미터가 올바르게 전달되는지 검증
- ✅ 응답 데이터가 올바르게 반환되는지 검증
- ✅ 에러 상황 처리 검증
- ❌ 비즈니스 로직 테스트 금지 (UseCase에서 담당)

### UseCase Testing (Business Logic Layer)

**목적**: UseCase는 비즈니스 로직을 담당하므로, Repository와 SessionManager를 Mock하여 순수 로직만 테스트합니다.

```typescript
// domains/auth/domain/usecases/__tests__/login-with-oauth.usecase.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LoginWithOAuthUseCaseImpl } from '../login-with-oauth.usecase';
import type { AuthRepository } from '../../../data/repositories/auth-repository';
import type { SessionManager } from '@core/infrastructure/storage';

describe('LoginWithOAuthUseCase', () => {
  let mockRepository: AuthRepository;
  let mockSessionManager: SessionManager;
  let loginWithOAuthUseCase: LoginWithOAuthUseCaseImpl;

  beforeEach(() => {
    // Repository Mock
    mockRepository = {
      loginWithGoogle: vi.fn(),
      loginWithKakao: vi.fn(),
      loginWithNaver: vi.fn(),
      refreshToken: vi.fn(),
      logout: vi.fn(),
    };

    // SessionManager Mock
    mockSessionManager = {
      saveSession: vi.fn(),
      getSession: vi.fn(),
      clearSession: vi.fn(),
    };

    loginWithOAuthUseCase = new LoginWithOAuthUseCaseImpl(
      mockRepository,
      mockSessionManager
    );
  });

  describe('execute', () => {
    it('should save session for existing user and return user data', async () => {
      // Arrange
      const mockResponse = {
        status: 200,
        data: {
          status: 'EXISTING_USER' as const,
          userId: 'user-123',
          accessToken: 'access-token',
          refreshToken: 'refresh-token',
        },
      };

      vi.mocked(mockRepository.loginWithGoogle).mockResolvedValue(mockResponse);

      // Act
      const result = await loginWithOAuthUseCase.execute(
        'google',
        'auth-code-123',
        'http://localhost:3000/callback'
      );

      // Assert
      expect(mockRepository.loginWithGoogle).toHaveBeenCalledWith({
        code: 'auth-code-123',
        redirectUri: 'http://localhost:3000/callback',
      });

      expect(mockSessionManager.saveSession).toHaveBeenCalledWith({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      });

      expect(result).toEqual({
        type: 'EXISTING_USER',
        userId: 'user-123',
      });
    });

    it('should return registration token for new user without saving session', async () => {
      // Arrange
      const mockResponse = {
        status: 200,
        data: {
          status: 'NEW_USER' as const,
          registrationToken: 'reg-token-123',
        },
      };

      vi.mocked(mockRepository.loginWithGoogle).mockResolvedValue(mockResponse);

      // Act
      const result = await loginWithOAuthUseCase.execute(
        'google',
        'auth-code-123',
        'http://localhost:3000/callback'
      );

      // Assert
      expect(mockSessionManager.saveSession).not.toHaveBeenCalled();
      expect(result).toEqual({
        type: 'NEW_USER',
        registrationToken: 'reg-token-123',
      });
    });

    it('should handle repository errors gracefully', async () => {
      // Arrange
      vi.mocked(mockRepository.loginWithGoogle).mockRejectedValue(
        new Error('OAuth provider unavailable')
      );

      // Act & Assert
      await expect(
        loginWithOAuthUseCase.execute(
          'google',
          'auth-code-123',
          'http://localhost:3000/callback'
        )
      ).rejects.toThrow('OAuth provider unavailable');

      // Session should not be saved on error
      expect(mockSessionManager.saveSession).not.toHaveBeenCalled();
    });
  });
});
```

**핵심 포인트**:

- ✅ Repository와 SessionManager를 Mock하여 순수 비즈니스 로직만 테스트
- ✅ 여러 시나리오 테스트 (기존 사용자, 신규 사용자, 에러 상황)
- ✅ Mock 호출 여부와 파라미터 검증
- ✅ 반환 값이 비즈니스 규칙에 맞는지 검증
- ❌ 실제 API 호출 금지 (Repository가 담당)

### Adapter Testing (Presentation Layer)

**목적**: Adapter는 Entity → UI Type 변환과 UI helper 메서드를 담당하므로, Entity를 Mock하여 순수 변환 로직과 UI 계산만 테스트합니다.

**언제 테스트하는가**:
- Adapter 메서드가 7+ Entity 메서드를 호출하는 복잡한 변환을 수행할 때
- UI helper 메서드가 비즈니스 규칙 기반 계산을 수행할 때 (색상, 가용성, 포맷팅 등)
- Type-safe 변환 헬퍼 함수가 있을 때

```typescript
// domains/benefit/presentation/adapters/__tests__/benefit.adapter.test.ts
import { describe, it, expect } from 'vitest';
import { BenefitAdapter } from '../benefit.adapter';
import type { Benefit } from '../../../domain/entities/benefit.entity';

describe('BenefitAdapter', () => {
  // Mock Entity 생성 헬퍼
  const createMockBenefit = (overrides?: Partial<Benefit>): Benefit =>
    ({
      getId: () => 1,
      getCafeteriaName: () => '카페테리아 A',
      getMenuName: () => '점심 메뉴',
      getImageUrl: () => '/images/menu.jpg',
      getDescription: () => '맛있는 점심',
      getMenuTypeDisplayName: () => '점심',
      getDiscountBadge: () => '특가',
      getPrice: () => 10000,
      getFinalPrice: () => 7000,
      hasDiscount: () => true,
      getDiscountPercentage: () => 30,
      isAvailableNow: () => true,
      isNew: () => false,
      ...overrides,
    } as Benefit);

  describe('toUiItem', () => {
    it('should transform Entity to UI Type with all required fields', () => {
      // Arrange
      const mockBenefit = createMockBenefit();

      // Act
      const result = BenefitAdapter.toUiItem(mockBenefit);

      // Assert
      expect(result).toEqual({
        id: 1,
        cafeteriaName: '카페테리아 A',
        menuName: '점심 메뉴',
        imageUrl: '/images/menu.jpg',
        description: '맛있는 점심',
        menuType: '점심',
        discountBadge: '특가',
        originalPrice: 10000,
        finalPrice: 7000,
        hasDiscount: true,
        discountPercentage: 30,
        isAvailable: true,
        isNew: false,
      });
    });
  });

  describe('getStatusColor', () => {
    it('should return gray for unavailable benefits', () => {
      const mockBenefit = createMockBenefit({
        isAvailableNow: () => false,
      });
      expect(BenefitAdapter.getStatusColor(mockBenefit)).toBe('gray');
    });

    it('should return red for high discount (30%+)', () => {
      const mockBenefit = createMockBenefit({
        isAvailableNow: () => true,
        getDiscountPercentage: () => 30,
      });
      expect(BenefitAdapter.getStatusColor(mockBenefit)).toBe('red');
    });
  });
});
```

**핵심 포인트**:
- ✅ Entity를 Mock하여 순수 변환 로직만 테스트
- ✅ UI helper 메서드의 모든 분기 테스트 (색상, 가용성 등)
- ✅ 엣지 케이스 테스트 (할인 없음, 품절 등)
- ✅ Type-safe 변환이 올바른지 검증
- ❌ Entity 비즈니스 로직 테스트 금지 (Entity 테스트에서 담당)
- ❌ 실제 Entity 인스턴스 생성 금지 (Mock 사용)

## Test Environment Strategy

### Browser Environment (JSDOM)

Use **`.browser.test.ts`** or **`.browser.test.tsx`** for code that:
- Renders React components
- Interacts with DOM APIs
- Uses browser-specific globals (window, document, localStorage)
- Tests user interactions and events
- Tests hooks that use browser APIs

### Node Environment

Use **`.node.test.ts`** for code that:
- Performs server-side logic
- Handles file system operations
- Makes direct API calls without browser context
- Tests pure business logic without UI
- Tests utility functions that don't need DOM

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

## Test File Organization

### Naming Convention

```
component-name/
├── index.tsx           # Component implementation
├── index.test.tsx      # Component tests
├── index.stories.tsx   # Storybook stories
└── index.css.ts        # Styles
```

### Test Location Strategy

- **Repository tests**: In `domains/[domain]/data/repositories/__tests__/` directory
- **UseCase tests**: In `domains/[domain]/domain/usecases/__tests__/` directory
- **Unit tests**: Co-located with source files
- **Integration tests**: In `__tests__` directories
- **E2E tests**: In root `e2e/` directory

### DDD Test File Organization

```
domains/
└── auth/
    ├── data/
    │   └── repositories/
    │       ├── auth-repository.ts
    │       └── __tests__/
    │           └── auth-repository.test.ts   # Repository unit tests
    ├── domain/
    │   └── usecases/
    │       ├── login-with-oauth.usecase.ts
    │       └── __tests__/
    │           └── login-with-oauth.usecase.test.ts  # UseCase unit tests
    └── ui/
        ├── components/
        │   └── auth-form/
        │       ├── index.tsx
        │       ├── index.test.tsx             # Component tests
        │       └── index.css.ts
        └── sections/
            └── auth-section/
                ├── index.tsx
                └── index.test.tsx             # Section tests
```

---

**Related**: See `component-testing.md` for UI testing, `entity-testing.md` for domain entity tests, `best-practices.md` for general guidelines
