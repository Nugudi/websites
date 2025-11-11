---
description: Unit testing patterns for Entities, UseCases, Repositories, Adapters, utilities with complete examples and mocking strategies
globs:
  - "**/__tests__/**/*.test.ts"
  - "**/*.test.ts"
  - "**/__tests__/**/*.spec.ts"
  - "**/*.spec.ts"
alwaysApply: true
---

# Unit Testing Patterns

> **Document Type**: Unit Testing Guide
> **Target Audience**: All developers
> **Related Documents**: [testing-principles.md](./testing-principles.md), [integration-testing.md](./integration-testing.md)
> **Last Updated**: 2025-11-11

This document provides comprehensive unit testing patterns for all DDD layers: Repositories, UseCases, Entities, and Adapters. Unit tests are the foundation of our testing pyramid (60-75% of all tests).

## What is Unit Testing?

**Unit Testing** tests individual functions, classes, or components in isolation from their dependencies.

**Key Characteristics**:
- **Fast**: No network calls, no database, no file system
- **Isolated**: Each test is independent, no shared state
- **Focused**: Tests one behavior at a time
- **Deterministic**: Same input always produces same output

**Why Unit Tests?**:
- Catch bugs early in development
- Enable confident refactoring
- Serve as living documentation
- Fast feedback loop

## DDD Layer Testing Patterns

### Repository Testing (Data Access Layer)

**Purpose**: Repository는 순수 데이터 접근만 담당하므로, HttpClient mock을 사용하여 API 통신을 테스트합니다.

**What to Test**:
- API endpoint가 올바르게 호출되는가?
- Request parameters가 올바르게 전달되는가?
- Response data가 올바르게 반환되는가?
- Error handling이 올바르게 동작하는가?

**What NOT to Test**:
- Business logic (UseCase에서 담당)
- Data transformation beyond API contract (Adapter에서 담당)
- Real API calls (항상 HttpClient를 Mock)

#### Complete Repository Test Example

```typescript
// domains/auth/data/repositories/__tests__/auth-repository.test.ts
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

    it('should handle different response status codes', async () => {
      // Arrange
      const mockResponse: HttpResponse<GoogleLoginResponse> = {
        status: 201,
        data: {
          status: 'NEW_USER',
          registrationToken: 'reg-token-123',
        },
        headers: new Headers(),
      };

      vi.mocked(mockHttpClient.post).mockResolvedValue(mockResponse);

      // Act
      const result = await authRepository.loginWithGoogle({
        code: 'auth-code-456',
        redirectUri: 'http://localhost:3000/callback',
      });

      // Assert
      expect(result.status).toBe(201);
      expect(result.data.status).toBe('NEW_USER');
    });
  });

  describe('refreshToken', () => {
    it('should refresh access token successfully', async () => {
      // Arrange
      const mockResponse: HttpResponse<RefreshTokenResponse> = {
        status: 200,
        data: {
          accessToken: 'new-access-token',
        },
        headers: new Headers(),
      };

      vi.mocked(mockHttpClient.post).mockResolvedValue(mockResponse);

      // Act
      const result = await authRepository.refreshToken('old-refresh-token');

      // Assert
      expect(mockHttpClient.post).toHaveBeenCalledWith(
        '/api/v1/auth/refresh',
        { refreshToken: 'old-refresh-token' }
      );
      expect(result.data.accessToken).toBe('new-access-token');
    });

    it('should handle invalid refresh token', async () => {
      // Arrange
      const error = new Error('Invalid refresh token');
      vi.mocked(mockHttpClient.post).mockRejectedValue(error);

      // Act & Assert
      await expect(
        authRepository.refreshToken('invalid-token')
      ).rejects.toThrow('Invalid refresh token');
    });
  });

  describe('logout', () => {
    it('should call logout endpoint', async () => {
      // Arrange
      const mockResponse: HttpResponse<void> = {
        status: 204,
        data: undefined,
        headers: new Headers(),
      };

      vi.mocked(mockHttpClient.post).mockResolvedValue(mockResponse);

      // Act
      await authRepository.logout();

      // Assert
      expect(mockHttpClient.post).toHaveBeenCalledWith('/api/v1/auth/logout');
    });
  });
});
```

**Key Points**:
- ✅ HttpClient를 Mock하여 실제 API 호출 없이 테스트
- ✅ 파라미터가 올바르게 전달되는지 검증
- ✅ 응답 데이터가 올바르게 반환되는지 검증
- ✅ 에러 상황 처리 검증
- ✅ 다양한 HTTP status code 처리 검증
- ❌ 비즈니스 로직 테스트 금지 (UseCase에서 담당)

### UseCase Testing (Business Logic Layer)

**Purpose**: UseCase는 비즈니스 로직을 담당하므로, Repository와 SessionManager를 Mock하여 순수 로직만 테스트합니다.

**What to Test**:
- Business logic이 올바르게 실행되는가?
- Dependencies (Repository, SessionManager)가 올바르게 호출되는가?
- 다양한 시나리오(성공, 실패, 엣지 케이스)를 올바르게 처리하는가?
- Error handling이 올바르게 동작하는가?

**What NOT to Test**:
- Data access logic (Repository가 담당)
- Real API calls (Repository를 Mock)
- UI concerns (Presentation layer가 담당)

#### Complete UseCase Test Example

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

    it('should handle different OAuth providers', async () => {
      // Arrange - Kakao
      const kakaoResponse = {
        status: 200,
        data: {
          status: 'EXISTING_USER' as const,
          userId: 'kakao-user-456',
          accessToken: 'kakao-access-token',
          refreshToken: 'kakao-refresh-token',
        },
      };

      vi.mocked(mockRepository.loginWithKakao).mockResolvedValue(kakaoResponse);

      // Act
      const result = await loginWithOAuthUseCase.execute(
        'kakao',
        'kakao-code-123',
        'http://localhost:3000/callback'
      );

      // Assert
      expect(mockRepository.loginWithKakao).toHaveBeenCalledWith({
        code: 'kakao-code-123',
        redirectUri: 'http://localhost:3000/callback',
      });

      expect(result.type).toBe('EXISTING_USER');
      expect(result.userId).toBe('kakao-user-456');
    });

    it('should handle session save failures', async () => {
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
      vi.mocked(mockSessionManager.saveSession).mockRejectedValue(
        new Error('Session storage failed')
      );

      // Act & Assert
      await expect(
        loginWithOAuthUseCase.execute(
          'google',
          'auth-code-123',
          'http://localhost:3000/callback'
        )
      ).rejects.toThrow('Session storage failed');
    });
  });
});
```

**Key Points**:
- ✅ Repository와 SessionManager를 Mock하여 순수 비즈니스 로직만 테스트
- ✅ 여러 시나리오 테스트 (기존 사용자, 신규 사용자, 에러 상황)
- ✅ Mock 호출 여부와 파라미터 검증
- ✅ 반환 값이 비즈니스 규칙에 맞는지 검증
- ✅ 에러 발생 시 side effect가 없는지 검증
- ❌ 실제 API 호출 금지 (Repository가 담당)

### Entity Testing (Domain Layer)

**Purpose**: Entity는 도메인 비즈니스 로직을 담당하므로, Entity 메서드의 계산과 규칙이 올바른지 테스트합니다.

**When to Test**:
- Entity가 복잡한 계산 메서드를 가질 때 (할인율, 만료일 계산 등)
- Entity가 비즈니스 규칙 검증 메서드를 가질 때 (가용성, 유효성 등)
- Entity가 상태 변환 로직을 가질 때

**What to Test**:
- Business rules이 올바르게 구현되었는가?
- 모든 분기 (if/else)가 올바르게 동작하는가?
- Edge cases (만료, 사용됨, 임박 등)가 올바르게 처리되는가?
- Calculated values (할인율, 남은 일수 등)가 정확한가?

**What NOT to Test**:
- Data access logic (Repository가 담당)
- UI transformation logic (Adapter가 담당)
- Simple getters with no logic

#### Complete Entity Test Example

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
        '1', // id
        'user-1', // userId
        'cafeteria-1', // cafeteriaId
        '카페테리아 A', // cafeteriaName
        '2024-01-01T00:00:00Z', // issuedAt
        false, // isUsed
        '2024-01-14T00:00:00Z' // expiresAt - Yesterday
      );

      // Act & Assert
      expect(stamp.isExpired()).toBe(true);
    });

    it('should return false for valid stamps', () => {
      // Arrange - stamp expires tomorrow
      const stamp = new Stamp(
        '1', // id
        'user-1', // userId
        'cafeteria-1', // cafeteriaId
        '카페테리아 A', // cafeteriaName
        '2024-01-01T00:00:00Z', // issuedAt
        false, // isUsed
        '2024-01-16T00:00:00Z' // expiresAt - Tomorrow
      );

      // Act & Assert
      expect(stamp.isExpired()).toBe(false);
    });

    it('should handle edge case of exact expiry time', () => {
      // Arrange - expires at current time
      const stamp = new Stamp(
        '1',
        'user-1',
        'cafeteria-1',
        '카페테리아 A',
        '2024-01-01T00:00:00Z',
        false,
        '2024-01-15T00:00:00Z' // Exact current time
      );

      // Act & Assert
      expect(stamp.isExpired()).toBe(false); // Not expired yet
    });
  });

  describe('isExpiringSoon', () => {
    it('should return true for stamps expiring within 7 days', () => {
      // Arrange - expires in 5 days
      const stamp = new Stamp(
        '1', // id
        'user-1', // userId
        'cafeteria-1', // cafeteriaId
        '카페테리아 A', // cafeteriaName
        '2024-01-01T00:00:00Z', // issuedAt
        false, // isUsed
        '2024-01-20T00:00:00Z' // expiresAt - 5 days from now
      );

      // Act & Assert
      expect(stamp.isExpiringSoon()).toBe(true);
    });

    it('should return false for stamps expiring later than 7 days', () => {
      // Arrange - expires in 10 days
      const stamp = new Stamp(
        '1', // id
        'user-1', // userId
        'cafeteria-1', // cafeteriaId
        '카페테리아 A', // cafeteriaName
        '2024-01-01T00:00:00Z', // issuedAt
        false, // isUsed
        '2024-01-25T00:00:00Z' // expiresAt - 10 days from now
      );

      // Act & Assert
      expect(stamp.isExpiringSoon()).toBe(false);
    });

    it('should handle edge case of exactly 7 days', () => {
      // Arrange - expires in exactly 7 days
      const stamp = new Stamp(
        '1',
        'user-1',
        'cafeteria-1',
        '카페테리아 A',
        '2024-01-01T00:00:00Z',
        false,
        '2024-01-22T00:00:00Z' // Exactly 7 days
      );

      // Act & Assert
      expect(stamp.isExpiringSoon()).toBe(true); // Including 7 days
    });
  });

  describe('canBeUsed', () => {
    it('should return false for used stamps', () => {
      // Arrange
      const stamp = new Stamp(
        '1', // id
        'user-1', // userId
        'cafeteria-1', // cafeteriaId
        '카페테리아 A', // cafeteriaName
        '2024-01-01T00:00:00Z', // issuedAt
        true, // isUsed - Already used
        '2024-01-20T00:00:00Z' // expiresAt
      );

      // Act & Assert
      expect(stamp.canBeUsed()).toBe(false);
    });

    it('should return false for expired stamps', () => {
      // Arrange
      const stamp = new Stamp(
        '1', // id
        'user-1', // userId
        'cafeteria-1', // cafeteriaId
        '카페테리아 A', // cafeteriaName
        '2024-01-01T00:00:00Z', // issuedAt
        false, // isUsed
        '2024-01-14T00:00:00Z' // expiresAt - Expired
      );

      // Act & Assert
      expect(stamp.canBeUsed()).toBe(false);
    });

    it('should return true for valid unused stamps', () => {
      // Arrange
      const stamp = new Stamp(
        '1', // id
        'user-1', // userId
        'cafeteria-1', // cafeteriaId
        '카페테리아 A', // cafeteriaName
        '2024-01-01T00:00:00Z', // issuedAt
        false, // isUsed
        '2024-01-20T00:00:00Z' // expiresAt
      );

      // Act & Assert
      expect(stamp.canBeUsed()).toBe(true);
    });
  });

  describe('getDaysUntilExpiry', () => {
    it('should calculate correct days until expiry', () => {
      // Arrange - expires in 5 days
      const stamp = new Stamp(
        '1', // id
        'user-1', // userId
        'cafeteria-1', // cafeteriaId
        '카페테리아 A', // cafeteriaName
        '2024-01-01T00:00:00Z', // issuedAt
        false, // isUsed
        '2024-01-20T00:00:00Z' // expiresAt
      );

      // Act & Assert
      expect(stamp.getDaysUntilExpiry()).toBe(5);
    });

    it('should return negative for expired stamps', () => {
      // Arrange - expired 2 days ago
      const stamp = new Stamp(
        '1', // id
        'user-1', // userId
        'cafeteria-1', // cafeteriaId
        '카페테리아 A', // cafeteriaName
        '2024-01-01T00:00:00Z', // issuedAt
        false, // isUsed
        '2024-01-13T00:00:00Z' // expiresAt
      );

      // Act & Assert
      expect(stamp.getDaysUntilExpiry()).toBe(-2);
    });

    it('should return 0 for stamps expiring today', () => {
      // Arrange - expires today
      const stamp = new Stamp(
        '1',
        'user-1',
        'cafeteria-1',
        '카페테리아 A',
        '2024-01-01T00:00:00Z',
        false,
        '2024-01-15T23:59:59Z' // Later today
      );

      // Act & Assert
      expect(stamp.getDaysUntilExpiry()).toBe(0);
    });
  });

  describe('getStatusMessage', () => {
    it('should return used message for used stamps', () => {
      // Arrange
      const stamp = new Stamp(
        '1', // id
        'user-1', // userId
        'cafeteria-1', // cafeteriaId
        '카페테리아 A', // cafeteriaName
        '2024-01-01T00:00:00Z', // issuedAt
        true, // isUsed
        '2024-01-20T00:00:00Z' // expiresAt
      );

      // Act & Assert
      expect(stamp.getStatusMessage()).toBe('사용 완료');
    });

    it('should return expired message for expired stamps', () => {
      // Arrange
      const stamp = new Stamp(
        '1', // id
        'user-1', // userId
        'cafeteria-1', // cafeteriaId
        '카페테리아 A', // cafeteriaName
        '2024-01-01T00:00:00Z', // issuedAt
        false, // isUsed
        '2024-01-14T00:00:00Z' // expiresAt
      );

      // Act & Assert
      expect(stamp.getStatusMessage()).toBe('기간 만료');
    });

    it('should return expiring soon message with days', () => {
      // Arrange - expires in 2 days
      const stamp = new Stamp(
        '1', // id
        'user-1', // userId
        'cafeteria-1', // cafeteriaId
        '카페테리아 A', // cafeteriaName
        '2024-01-01T00:00:00Z', // issuedAt
        false, // isUsed
        '2024-01-17T00:00:00Z' // expiresAt
      );

      // Act & Assert
      expect(stamp.getStatusMessage()).toBe('2일 후 만료');
    });

    it('should return valid message for normal stamps', () => {
      // Arrange - expires in 10 days
      const stamp = new Stamp(
        '1', // id
        'user-1', // userId
        'cafeteria-1', // cafeteriaId
        '카페테리아 A', // cafeteriaName
        '2024-01-01T00:00:00Z', // issuedAt
        false, // isUsed
        '2024-01-25T00:00:00Z' // expiresAt
      );

      // Act & Assert
      expect(stamp.getStatusMessage()).toBe('사용 가능');
    });
  });
});
```

**Key Points**:
- ✅ Entity 비즈니스 로직의 모든 분기 테스트
- ✅ 날짜 계산 시 시스템 시간 Mock (`vi.useFakeTimers()`)
- ✅ 엣지 케이스 테스트 (만료, 사용됨, 임박, 정확히 일치 등)
- ✅ 비즈니스 규칙이 올바르게 구현되었는지 검증
- ✅ 상태별 메시지가 올바른지 검증
- ❌ 데이터 접근 로직 테스트 금지 (Repository가 담당)
- ❌ UI 변환 로직 테스트 금지 (Adapter가 담당)

### Adapter Testing (Presentation Layer)

**Purpose**: Adapter는 Entity → UI Type 변환과 UI helper 메서드를 담당하므로, Entity를 Mock하여 순수 변환 로직과 UI 계산만 테스트합니다.

**When to Test**:
- Adapter 메서드가 7+ Entity 메서드를 호출하는 복잡한 변환을 수행할 때
- UI helper 메서드가 비즈니스 규칙 기반 계산을 수행할 때 (색상, 가용성, 포맷팅 등)
- Type-safe 변환 헬퍼 함수가 있을 때

**What to Test**:
- Entity → UI Type 변환이 올바른가?
- UI helper 메서드의 모든 분기가 올바른가?
- Edge cases (할인 없음, 품절 등)가 올바르게 처리되는가?

**What NOT to Test**:
- Entity 비즈니스 로직 (Entity 테스트에서 담당)
- Simple 1:1 field mapping (테스트 가치 낮음)

#### Complete Adapter Test Example

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

    it('should handle unavailable benefits', () => {
      // Arrange
      const mockBenefit = createMockBenefit({
        isAvailableNow: () => false,
      });

      // Act
      const result = BenefitAdapter.toUiItem(mockBenefit);

      // Assert
      expect(result.isAvailable).toBe(false);
    });

    it('should handle new benefits', () => {
      // Arrange
      const mockBenefit = createMockBenefit({
        isNew: () => true,
      });

      // Act
      const result = BenefitAdapter.toUiItem(mockBenefit);

      // Assert
      expect(result.isNew).toBe(true);
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

    it('should handle edge case of exactly 10% discount', () => {
      // Arrange
      const mockBenefit = createMockBenefit({
        isAvailableNow: () => true,
        getDiscountPercentage: () => 10,
      });

      // Act
      const result = BenefitAdapter.getStatusColor(mockBenefit);

      // Assert
      expect(result).toBe('orange'); // >= 10% is medium
    });

    it('should handle edge case of exactly 30% discount', () => {
      // Arrange
      const mockBenefit = createMockBenefit({
        isAvailableNow: () => true,
        getDiscountPercentage: () => 30,
      });

      // Act
      const result = BenefitAdapter.getStatusColor(mockBenefit);

      // Assert
      expect(result).toBe('red'); // >= 30% is high
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

    it('should handle empty array', () => {
      // Arrange
      const mockBenefits: Benefit[] = [];

      // Act
      const result = BenefitAdapter.toUiList(mockBenefits);

      // Assert
      expect(result).toEqual([]);
    });

    it('should preserve all transformations for each item', () => {
      // Arrange
      const mockBenefits = [
        createMockBenefit({ getId: () => 1, hasDiscount: () => true }),
        createMockBenefit({ getId: () => 2, hasDiscount: () => false }),
      ];

      // Act
      const result = BenefitAdapter.toUiList(mockBenefits);

      // Assert
      expect(result[0].hasDiscount).toBe(true);
      expect(result[1].hasDiscount).toBe(false);
    });
  });
});
```

**Key Points**:
- ✅ Entity를 Mock하여 순수 변환 로직만 테스트
- ✅ UI helper 메서드의 모든 분기 테스트 (색상, 가용성 등)
- ✅ 엣지 케이스 테스트 (할인 없음, 품절, 경계값 등)
- ✅ Type-safe 변환이 올바른지 검증
- ✅ Mock helper 함수로 테스트 데이터 생성 간소화
- ❌ Entity 비즈니스 로직 테스트 금지 (Entity 테스트에서 담당)
- ❌ 실제 Entity 인스턴스 생성 금지 (Mock 사용)

## Utility Function Testing

**Purpose**: Helper functions, formatters, validators, parsers 등 순수 함수를 테스트합니다.

**What to Test**:
- Input/Output이 올바른가?
- Edge cases가 올바르게 처리되는가?
- Error cases가 올바르게 처리되는가?

### Example: Format Utilities

```typescript
// core/utils/__tests__/format.test.ts
import { describe, it, expect } from 'vitest';
import { formatCurrency, formatDate, formatPhoneNumber } from '../format';

describe('Format Utils', () => {
  describe('formatCurrency', () => {
    it('should format numbers as Korean Won', () => {
      expect(formatCurrency(1000)).toBe('1,000원');
      expect(formatCurrency(1500000)).toBe('1,500,000원');
    });

    it('should handle zero', () => {
      expect(formatCurrency(0)).toBe('0원');
    });

    it('should handle negative numbers', () => {
      expect(formatCurrency(-1000)).toBe('-1,000원');
    });

    it('should round decimal numbers', () => {
      expect(formatCurrency(1234.56)).toBe('1,235원');
    });
  });

  describe('formatDate', () => {
    it('should format date as YYYY-MM-DD', () => {
      const date = new Date('2024-01-15T10:30:00Z');
      expect(formatDate(date)).toBe('2024-01-15');
    });

    it('should handle single digit months and days', () => {
      const date = new Date('2024-01-05T10:30:00Z');
      expect(formatDate(date)).toBe('2024-01-05');
    });
  });

  describe('formatPhoneNumber', () => {
    it('should format Korean mobile numbers', () => {
      expect(formatPhoneNumber('01012345678')).toBe('010-1234-5678');
    });

    it('should handle already formatted numbers', () => {
      expect(formatPhoneNumber('010-1234-5678')).toBe('010-1234-5678');
    });

    it('should handle invalid input', () => {
      expect(formatPhoneNumber('invalid')).toBe('invalid');
    });
  });
});
```

## AAA Pattern (Arrange, Act, Assert)

**All tests should follow the AAA pattern for clarity**:

```typescript
it('should calculate discount percentage correctly', () => {
  // Arrange - Set up test data
  const originalPrice = 10000;
  const discountedPrice = 7000;

  // Act - Execute the behavior
  const result = calculateDiscountPercentage(originalPrice, discountedPrice);

  // Assert - Verify the outcome
  expect(result).toBe(30);
});
```

**Why AAA?**
- **Readability**: Clear separation of test phases
- **Maintainability**: Easy to understand and modify
- **Consistency**: Standard pattern across all tests

## Mocking Strategies

### Using vi.fn() for Function Mocks

```typescript
// Simple function mock
const mockCallback = vi.fn();

// Act
someFunction(mockCallback);

// Assert
expect(mockCallback).toHaveBeenCalledWith('expected-arg');
expect(mockCallback).toHaveBeenCalledTimes(1);
```

### Using vi.mock() for Module Mocks

```typescript
// Mock entire module
vi.mock('@/src/lib/analytics', () => ({
  trackEvent: vi.fn(),
  trackPageView: vi.fn(),
}));

// In test
import { trackEvent } from '@/src/lib/analytics';

it('should track button click', () => {
  render(<Button onClick={handleClick} />);
  fireEvent.click(screen.getByRole('button'));

  expect(trackEvent).toHaveBeenCalledWith('button_click', {
    label: 'Submit',
  });
});
```

### Creating Mock Objects

```typescript
// Mock complex objects
const createMockHttpClient = (): HttpClient => ({
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  patch: vi.fn(),
  delete: vi.fn(),
});

// Mock with specific behavior
const mockHttpClient = createMockHttpClient();
vi.mocked(mockHttpClient.get).mockResolvedValue({
  status: 200,
  data: { users: [] },
});
```

## Test File Organization

### Naming Convention

```
component-name/
├── index.ts           # Implementation
├── __tests__/
│   └── index.test.ts  # Unit tests
```

### DDD Layer Test Organization

```
domains/
└── auth/
    ├── data/
    │   └── repositories/
    │       ├── auth-repository.ts
    │       └── __tests__/
    │           └── auth-repository.test.ts   # Repository tests
    ├── domain/
    │   ├── entities/
    │   │   ├── user.entity.ts
    │   │   └── __tests__/
    │   │       └── user.entity.test.ts        # Entity tests
    │   └── usecases/
    │       ├── login.usecase.ts
    │       └── __tests__/
    │           └── login.usecase.test.ts      # UseCase tests
    └── presentation/
        └── adapters/
            ├── user.adapter.ts
            └── __tests__/
                └── user.adapter.test.ts       # Adapter tests
```

## Best Practices

### DO's ✅

- Write descriptive test names that explain the scenario
- Follow AAA pattern (Arrange, Act, Assert)
- Test one behavior per test
- Mock dependencies, not the code under test
- Use beforeEach/afterEach for setup/teardown
- Test edge cases and error scenarios
- Keep tests simple and focused
- Use helper functions to reduce duplication

### DON'Ts ❌

- Don't test implementation details
- Don't share state between tests
- Don't test third-party libraries
- Don't write tests for trivial code
- Don't mock everything - use real implementations when simple
- Don't skip tests for complex logic
- Don't use real system time for date-dependent tests

## Related Documentation

- **[testing-principles.md](./testing-principles.md)** - Core testing philosophy and what to test
- **[integration-testing.md](./integration-testing.md)** - Testing component integration, API routes, Server Actions
- **[e2e-testing.md](./e2e-testing.md)** - End-to-end testing with Playwright

---

**Remember**: Unit tests are the foundation of your test suite. They should be fast, focused, and test business logic in isolation.
