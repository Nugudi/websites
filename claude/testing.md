# Testing Rules and Guidelines

This document outlines our team's conventions for writing tests, test priorities, and coverage strategies.
We write tests for non-UI logic, while UI components are tested based on complexity and interactivity levels.
Our goal is to maintain efficient test coverage while preventing productivity loss from unnecessary testing.

[[toc]]

## Core Testing Principles

### 1. Non-UI Modules MUST Have Tests

All modules that are not directly related to UI rendering **must** have comprehensive test coverage:

- **🆕 UseCases (DDD)**: Business logic orchestration, domain operations
- **🆕 Repositories (DDD)**: Data access layer, API integration
- **Business Logic**: Domain operations, state management, data transformations
- **Utility Functions**: Helper functions, formatters, validators, parsers
- **API Handlers**: Request/response processing, error handling, data mapping
- **Hooks**: Custom React hooks with complex logic
- **Server Actions**: Next.js server actions and data fetching logic

### 🆕 2. DDD Layer Testing Patterns

#### Repository Testing (Data Access Layer)

**목적**: Repository는 순수 데이터 접근만 담당하므로, HttpClient mock을 사용하여 API 통신을 테스트합니다.

```typescript
// domains/auth/repositories/__tests__/auth-repository.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthRepositoryImpl } from '../auth-repository';
import type { HttpClient, HttpResponse } from '@/src/shared/infrastructure/http';

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

#### UseCase Testing (Business Logic Layer)

**목적**: UseCase는 비즈니스 로직을 담당하므로, Repository와 SessionManager를 Mock하여 순수 로직만 테스트합니다.

```typescript
// domains/auth/domain/usecases/__tests__/login-with-oauth.usecase.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LoginWithOAuthUseCaseImpl } from '../login-with-oauth.usecase';
import type { AuthRepository } from '../../../data/repositories/auth-repository';
import type { SessionManager } from '@/src/shared/infrastructure/storage';

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

    loginWithOAuthUseCase = new LoginWithOAuthUseCaseImpl(mockRepository, mockSessionManager);
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

#### Adapter Testing (Presentation Layer)

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
  const createMockBenefit = (overrides?: Partial<Benefit>): Benefit => ({
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

    it('should handle Entity with no discount', () => {
      // Arrange
      const mockBenefit = createMockBenefit({
        hasDiscount: () => false,
        getDiscountPercentage: () => 0,
        getDiscountBadge: () => null,
        getFinalPrice: () => 10000,
      });

      // Act
      const result = BenefitAdapter.toUiItem(mockBenefit);

      // Assert
      expect(result.hasDiscount).toBe(false);
      expect(result.discountPercentage).toBe(0);
      expect(result.discountBadge).toBe(null);
      expect(result.finalPrice).toBe(10000);
    });
  });

  describe('getStatusColor', () => {
    it('should return gray for unavailable benefits', () => {
      // Arrange
      const mockBenefit = createMockBenefit({
        isAvailableNow: () => false,
      });

      // Act
      const result = BenefitAdapter.getStatusColor(mockBenefit);

      // Assert
      expect(result).toBe('gray');
    });

    it('should return red for high discount (30%+)', () => {
      // Arrange
      const mockBenefit = createMockBenefit({
        isAvailableNow: () => true,
        getDiscountPercentage: () => 30,
      });

      // Act
      const result = BenefitAdapter.getStatusColor(mockBenefit);

      // Assert
      expect(result).toBe('red');
    });

    it('should return orange for medium discount (10-29%)', () => {
      // Arrange
      const mockBenefit = createMockBenefit({
        isAvailableNow: () => true,
        getDiscountPercentage: () => 15,
      });

      // Act
      const result = BenefitAdapter.getStatusColor(mockBenefit);

      // Assert
      expect(result).toBe('orange');
    });

    it('should return blue for low/no discount (<10%)', () => {
      // Arrange
      const mockBenefit = createMockBenefit({
        isAvailableNow: () => true,
        getDiscountPercentage: () => 5,
      });

      // Act
      const result = BenefitAdapter.getStatusColor(mockBenefit);

      // Assert
      expect(result).toBe('blue');
    });
  });

  describe('toUiList', () => {
    it('should transform array of Entities to array of UI Types', () => {
      // Arrange
      const mockBenefits = [
        createMockBenefit({ getId: () => 1 }),
        createMockBenefit({ getId: () => 2 }),
        createMockBenefit({ getId: () => 3 }),
      ];

      // Act
      const result = BenefitAdapter.toUiList(mockBenefits);

      // Assert
      expect(result).toHaveLength(3);
      expect(result[0].id).toBe(1);
      expect(result[1].id).toBe(2);
      expect(result[2].id).toBe(3);
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

#### Entity Testing (Domain Layer)

**목적**: Entity는 도메인 비즈니스 로직을 담당하므로, Entity 메서드의 계산과 규칙이 올바른지 테스트합니다.

**언제 테스트하는가**:
- Entity가 복잡한 계산 메서드를 가질 때 (할인율, 만료일 계산 등)
- Entity가 비즈니스 규칙 검증 메서드를 가질 때 (가용성, 유효성 등)
- Entity가 상태 변환 로직을 가질 때

```typescript
// domains/stamp/domain/entities/__tests__/stamp.entity.test.ts
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Stamp } from '../stamp.entity';

describe('Stamp Entity', () => {
  beforeEach(() => {
    // Mock current date for consistent testing
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-15T00:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('isExpired', () => {
    it('should return true for expired stamps', () => {
      // Arrange - stamp expired 1 day ago
      const stamp = new Stamp(
        '1',                          // id
        'user-1',                     // userId
        'cafeteria-1',                // cafeteriaId
        '카페테리아 A',                // cafeteriaName
        '2024-01-01T00:00:00Z',       // issuedAt
        false,                        // isUsed
        '2024-01-14T00:00:00Z',       // expiresAt - Yesterday
      );

      // Act & Assert
      expect(stamp.isExpired()).toBe(true);
    });

    it('should return false for valid stamps', () => {
      // Arrange - stamp expires tomorrow
      const stamp = new Stamp(
        '1',                          // id
        'user-1',                     // userId
        'cafeteria-1',                // cafeteriaId
        '카페테리아 A',                // cafeteriaName
        '2024-01-01T00:00:00Z',       // issuedAt
        false,                        // isUsed
        '2024-01-16T00:00:00Z',       // expiresAt - Tomorrow
      );

      // Act & Assert
      expect(stamp.isExpired()).toBe(false);
    });
  });

  describe('isExpiringSoon', () => {
    it('should return true for stamps expiring within 7 days', () => {
      // Arrange - expires in 5 days
      const stamp = new Stamp(
        '1',                          // id
        'user-1',                     // userId
        'cafeteria-1',                // cafeteriaId
        '카페테리아 A',                // cafeteriaName
        '2024-01-01T00:00:00Z',       // issuedAt
        false,                        // isUsed
        '2024-01-20T00:00:00Z',       // expiresAt - 5 days from now
      );

      // Act & Assert
      expect(stamp.isExpiringSoon()).toBe(true);
    });

    it('should return false for stamps expiring later than 7 days', () => {
      // Arrange - expires in 10 days
      const stamp = new Stamp(
        '1',                          // id
        'user-1',                     // userId
        'cafeteria-1',                // cafeteriaId
        '카페테리아 A',                // cafeteriaName
        '2024-01-01T00:00:00Z',       // issuedAt
        false,                        // isUsed
        '2024-01-25T00:00:00Z',       // expiresAt - 10 days from now
      );

      // Act & Assert
      expect(stamp.isExpiringSoon()).toBe(false);
    });
  });

  describe('canBeUsed', () => {
    it('should return false for used stamps', () => {
      // Arrange
      const stamp = new Stamp(
        '1',                          // id
        'user-1',                     // userId
        'cafeteria-1',                // cafeteriaId
        '카페테리아 A',                // cafeteriaName
        '2024-01-01T00:00:00Z',       // issuedAt
        true,                         // isUsed - Already used
        '2024-01-20T00:00:00Z',       // expiresAt
      );

      // Act & Assert
      expect(stamp.canBeUsed()).toBe(false);
    });

    it('should return false for expired stamps', () => {
      // Arrange
      const stamp = new Stamp(
        '1',                          // id
        'user-1',                     // userId
        'cafeteria-1',                // cafeteriaId
        '카페테리아 A',                // cafeteriaName
        '2024-01-01T00:00:00Z',       // issuedAt
        false,                        // isUsed
        '2024-01-14T00:00:00Z',       // expiresAt - Expired
      );

      // Act & Assert
      expect(stamp.canBeUsed()).toBe(false);
    });

    it('should return true for valid unused stamps', () => {
      // Arrange
      const stamp = new Stamp(
        '1',                          // id
        'user-1',                     // userId
        'cafeteria-1',                // cafeteriaId
        '카페테리아 A',                // cafeteriaName
        '2024-01-01T00:00:00Z',       // issuedAt
        false,                        // isUsed
        '2024-01-20T00:00:00Z',       // expiresAt
      );

      // Act & Assert
      expect(stamp.canBeUsed()).toBe(true);
    });
  });

  describe('getDaysUntilExpiry', () => {
    it('should calculate correct days until expiry', () => {
      // Arrange - expires in 5 days
      const stamp = new Stamp(
        '1',                          // id
        'user-1',                     // userId
        'cafeteria-1',                // cafeteriaId
        '카페테리아 A',                // cafeteriaName
        '2024-01-01T00:00:00Z',       // issuedAt
        false,                        // isUsed
        '2024-01-20T00:00:00Z',       // expiresAt
      );

      // Act & Assert
      expect(stamp.getDaysUntilExpiry()).toBe(5);
    });

    it('should return negative for expired stamps', () => {
      // Arrange - expired 2 days ago
      const stamp = new Stamp(
        '1',                          // id
        'user-1',                     // userId
        'cafeteria-1',                // cafeteriaId
        '카페테리아 A',                // cafeteriaName
        '2024-01-01T00:00:00Z',       // issuedAt
        false,                        // isUsed
        '2024-01-13T00:00:00Z',       // expiresAt
      );

      // Act & Assert
      expect(stamp.getDaysUntilExpiry()).toBe(-2);
    });
  });

  describe('getStatusMessage', () => {
    it('should return used message for used stamps', () => {
      // Arrange
      const stamp = new Stamp(
        '1',                          // id
        'user-1',                     // userId
        'cafeteria-1',                // cafeteriaId
        '카페테리아 A',                // cafeteriaName
        '2024-01-01T00:00:00Z',       // issuedAt
        true,                         // isUsed
        '2024-01-20T00:00:00Z',       // expiresAt
      );

      // Act & Assert
      expect(stamp.getStatusMessage()).toBe('사용 완료');
    });

    it('should return expired message for expired stamps', () => {
      // Arrange
      const stamp = new Stamp(
        '1',                          // id
        'user-1',                     // userId
        'cafeteria-1',                // cafeteriaId
        '카페테리아 A',                // cafeteriaName
        '2024-01-01T00:00:00Z',       // issuedAt
        false,                        // isUsed
        '2024-01-14T00:00:00Z',       // expiresAt
      );

      // Act & Assert
      expect(stamp.getStatusMessage()).toBe('기간 만료');
    });

    it('should return expiring soon message with days', () => {
      // Arrange - expires in 2 days
      const stamp = new Stamp(
        '1',                          // id
        'user-1',                     // userId
        'cafeteria-1',                // cafeteriaId
        '카페테리아 A',                // cafeteriaName
        '2024-01-01T00:00:00Z',       // issuedAt
        false,                        // isUsed
        '2024-01-17T00:00:00Z',       // expiresAt
      );

      // Act & Assert
      expect(stamp.getStatusMessage()).toBe('2일 후 만료');
    });

    it('should return valid message for normal stamps', () => {
      // Arrange - expires in 10 days
      const stamp = new Stamp(
        '1',                          // id
        'user-1',                     // userId
        'cafeteria-1',                // cafeteriaId
        '카페테리아 A',                // cafeteriaName
        '2024-01-01T00:00:00Z',       // issuedAt
        false,                        // isUsed
        '2024-01-25T00:00:00Z',       // expiresAt
      );

      // Act & Assert
      expect(stamp.getStatusMessage()).toBe('사용 가능');
    });
  });
});
```

**핵심 포인트**:
- ✅ Entity 비즈니스 로직의 모든 분기 테스트
- ✅ 날짜 계산 시 시스템 시간 Mock (`vi.useFakeTimers()`)
- ✅ 엣지 케이스 테스트 (만료, 사용됨, 임박 등)
- ✅ 비즈니스 규칙이 올바르게 구현되었는지 검증
- ✅ 상태별 메시지가 올바른지 검증
- ❌ 데이터 접근 로직 테스트 금지 (Repository가 담당)
- ❌ UI 변환 로직 테스트 금지 (Adapter가 담당)

#### Example: Testing Business Logic (Legacy - 참고용)

```typescript
// domains/auth/domain/usecases/validate-password.usecase.test.ts
import { describe, it, expect } from 'vitest';
import { validatePassword, hashPassword } from './validate-password.usecase';

describe('ValidatePasswordUseCase', () => {
  describe('execute', () => {
    it('should reject passwords shorter than 8 characters', () => {
      expect(validatePassword('short')).toBe(false);
    });

    it('should accept valid passwords', () => {
      expect(validatePassword('ValidPass123!')).toBe(true);
    });
  });
});
```

#### Example: Testing Utility Functions

```typescript
// shared/utils/format.test.ts
import { describe, it, expect } from 'vitest';
import { formatCurrency, formatDate } from './format';

describe('Format Utils', () => {
  describe('formatCurrency', () => {
    it('should format numbers as Korean Won', () => {
      expect(formatCurrency(1000)).toBe('1,000');
      expect(formatCurrency(1500000)).toBe('1,500,000');
    });
  });
});
```

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

  return (
    <button onClick={handleClick}>
      {isOn ? 'ON' : 'OFF'}
    </button>
  );
};
```

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
    return <EmptyState message="No user found" />;
  }

  if (user.isBlocked) {
    return <BlockedUserMessage />;
  }

  return <ProfileDetails user={user} />;
};
```

##### 3. Form Components

```typescript
// ✅ Test required - form with validation
export const LoginForm = () => {
  const form = useForm({
    resolver: zodResolver(loginSchema),
  });

  // Test validation, submission, error states
  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* form fields */}
    </form>
  );
};
```

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

We use different test environments based on what we're testing. This ensures tests run in the most appropriate context for their purpose.

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

    expect(screen.getByText('Time\'s up!')).toBeInTheDocument();
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

- **🆕 Repository tests**: In `domains/[domain]/data/repositories/__tests__/` directory
- **🆕 UseCase tests**: In `domains/[domain]/domain/usecases/__tests__/` directory
- **Unit tests**: Co-located with source files
- **Integration tests**: In `__tests__` directories
- **E2E tests**: In root `e2e/` directory

### 🆕 DDD Test File Organization

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

## Writing Effective Tests

### 1. Use Descriptive Test Names

```typescript
// ❌ Bad
it('works', () => {});

// ✅ Good
it('should display error message when password is invalid', () => {});
```

### 2. Follow AAA Pattern

```typescript
it('should update user profile successfully', async () => {
  // Arrange
  const user = createMockUser();
  const updatedData = { name: 'New Name' };

  // Act
  const result = await updateProfile(user.id, updatedData);

  // Assert
  expect(result.name).toBe('New Name');
});
```

### 3. Test User Behavior, Not Implementation

```typescript
// ❌ Bad - testing implementation details
it('should call setState', () => {
  expect(setState).toHaveBeenCalled();
});

// ✅ Good - testing user-visible behavior
it('should display success message after form submission', () => {
  expect(screen.getByText('Profile updated successfully')).toBeInTheDocument();
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
};

export default meta;

export const Default: StoryObj<typeof Button> = {
  args: {
    children: 'Click me',
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
    chromatic: { viewports: [375, 768, 1440] },
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
];
```

### Component Mocking

```typescript
// Mock external dependencies
vi.mock('@/src/domains/auth/hooks/use-auth', () => ({
  useAuth: () => ({
    user: mockUser,
    isAuthenticated: true,
  }),
}));
```

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

#### 🆕 DDD Layer Testing (NEW)

- **Repository Tests**: Mock HttpClient to test API integration
- **UseCase Tests**: Mock Repository and SessionManager to test business logic
- **Test all scenarios**: Success cases, error cases, edge cases
- **Verify mock calls**: Check correct parameters are passed
- **Isolated testing**: Each layer tested independently with mocks
- **Test error handling**: Ensure errors propagate correctly

#### General Testing

- Write tests for all business logic
- Test user-facing behavior
- Use MSW for API mocking
- Keep tests simple and focused
- Write descriptive test names
- Test error states and edge cases
- Use Storybook for component documentation and testing
- Mock system time for date-dependent tests

### DON'Ts ❌

#### 🆕 DDD Layer Testing (NEW)

- **NEVER test Repository with real API calls**: Always mock HttpClient
- **NEVER test UseCase with real Repository**: Always mock dependencies
- **NEVER test business logic in Repository**: Repository는 순수 데이터 접근만
- **NEVER test data access in UseCase**: UseCase는 비즈니스 로직만
- **NEVER test DI Containers directly**: Container는 설정일 뿐, 로직 없음
- **NEVER skip error scenario tests**: 에러 처리는 필수 테스트 항목

#### General Testing

- Don't test implementation details
- Don't test third-party libraries (TanStack Query, React Hook Form, Zod, etc.)
- Don't write brittle tests that break with refactoring
- Don't skip tests for complex components
- Don't mock everything - use real implementations when possible
- Don't test simple presentational components without logic
- Don't use real system time in tests that depend on dates

## Third-Party Library Testing Guidelines

### Core Principle: Trust the Libraries

**You DO NOT need to test that third-party libraries work correctly.** Well-maintained libraries like TanStack Query, React Hook Form, Zod, and others have their own comprehensive test suites. Testing their functionality is redundant and adds maintenance burden without value.

### ❌ Examples of What NOT to Test

```typescript
// BAD: Testing TanStack Query's loading state management
it('should show loading state from useQuery', () => {
  const { result } = renderHook(() =>
    useQuery({ queryKey: ['users'], queryFn: fetchUsers })
  );

  expect(result.current.isLoading).toBe(true); // Testing the library!
});

// BAD: Testing React Hook Form's validation
it('should validate required field with React Hook Form', () => {
  const { result } = renderHook(() =>
    useForm({
      defaultValues: { email: '' },
      resolver: zodResolver(schema),
    })
  );

  expect(result.current.formState.errors.email).toBeDefined(); // Testing the library!
});

// BAD: Testing Zod's schema validation
it('should validate email with Zod', () => {
  const schema = z.string().email();
  expect(() => schema.parse('invalid')).toThrow(); // Testing Zod!
});
```

### ✅ Examples of What to Test

```typescript
// GOOD: Test YOUR business logic that uses the library
it('should transform user data after fetching', async () => {
  // Mock YOUR API response
  server.use(
    http.get('/api/users', () => {
      return HttpResponse.json([
        { id: 1, firstName: 'John', lastName: 'Doe' }
      ]);
    })
  );

  // Test YOUR transformation logic
  const { result } = renderHook(() => useUserList());

  await waitFor(() => {
    // Test YOUR business logic, not the query itself
    expect(result.current.users).toEqual([
      { id: 1, fullName: 'John Doe', initials: 'JD' }
    ]);
  });
});

// GOOD: Test YOUR form submission handler
it('should add timestamp to form data on submit', async () => {
  const onSubmit = vi.fn();
  render(<ContactForm onSubmit={onSubmit} />);

  // Fill and submit form
  await userEvent.type(screen.getByLabelText(/name/i), 'John');
  await userEvent.type(screen.getByLabelText(/email/i), 'john@example.com');
  await userEvent.click(screen.getByRole('button', { name: /submit/i }));

  // Test YOUR business logic additions
  await waitFor(() => {
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'John',
        email: 'john@example.com',
        submittedAt: expect.any(Date), // YOUR added field
        formVersion: '1.0', // YOUR added metadata
      })
    );
  });
});

// GOOD: Test YOUR error handling logic
it('should show custom error message for API failures', async () => {
  server.use(
    http.post('/api/contact', () => {
      return HttpResponse.error();
    })
  );

  render(<ContactForm />);

  // Submit form
  await userEvent.click(screen.getByRole('button', { name: /submit/i }));

  // Test YOUR custom error handling
  await waitFor(() => {
    expect(screen.getByText(/서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요./i))
      .toBeInTheDocument();
  });
});
```

### When to Mock Libraries

Mock libraries only when:

1. **Testing in isolation**: When testing a component that uses a hook, mock the hook to test the component independently
2. **Avoiding side effects**: Mock libraries that would cause unwanted side effects in tests (e.g., analytics, monitoring)
3. **Performance**: Mock heavy libraries that would slow down tests significantly

```typescript
// Mock a custom hook that uses TanStack Query internally
vi.mock('@/src/hooks/use-user', () => ({
  useUser: () => ({
    user: { id: '1', name: 'Test User' },
    isLoading: false,
    error: null,
  })
}));

// Now test YOUR component's behavior with this data
it('should display user name', () => {
  render(<UserProfile />);
  expect(screen.getByText('Test User')).toBeInTheDocument();
});
```

### Summary

- **Trust that libraries work** - They have their own tests
- **Test YOUR code** - Business logic, transformations, error handling
- **Test integration points** - How your code uses the library results
- **Mock sparingly** - Only when necessary for isolation or performance

## Testing Workflow

1. **Before Writing Code**: Think about testability
2. **While Writing Code**: Write tests alongside implementation
3. **Before Committing**: Run tests locally
4. **In PR**: Ensure CI tests pass
5. **After Merge**: Monitor test coverage trends

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

## Troubleshooting Common Issues

### Test Timeout Issues

```typescript
// Increase timeout for async operations
it('should fetch data', async () => {
  // Test implementation
}, 10000); // 10 second timeout
```

### Flaky Tests

```typescript
// Use waitFor for async assertions
await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument();
});
```

### Module Resolution

```typescript
// Use path aliases consistently
import { useAuth } from '@/src/domains/auth/hooks/use-auth';
// Not: import { useAuth } from '../../../auth/hooks/use-auth';
```

---

Remember: **Good tests enable confident refactoring and prevent regressions.** Focus on testing what matters to users and business logic, not implementation details.
