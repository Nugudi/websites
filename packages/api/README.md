# Nugudi API Client

Nugudi API용 TypeScript 클라이언트 라이브러리입니다. Orval을 사용하여 OpenAPI 스펙으로부터 자동 생성됩니다.

## 설치

```bash
pnpm install
```

## 사용법

### 기본 사용

```typescript
import { useUpdateMyEmail, updateMyEmail } from '@nugudi/api';

// React Query 훅 사용
const updateEmailMutation = useUpdateMyEmail();

// 직접 API 호출
const response = await updateMyEmail({
  email: 'new@example.com',
  code: '123456',
});
```

### Response Status 처리

API 응답은 다음과 같은 구조를 가집니다:

```typescript
type ApiResponse = {
  data: BaseResponseType;
  status: "AUTH_011" | "COMMON_400" | "EMAIL_002" | ... // 문자열 리터럴
  headers: Headers;
}
```

상태 코드는 문자열 리터럴로 제공되므로 안전하게 사용할 수 있습니다:

```typescript
const response = await updateMyEmail(requestData);

switch (response.status) {
  case 'AUTH_011':
    // 회원가입을 완료한 유저만 접근 가능
    break;
  case 'EMAIL_002':
    // 이메일 인증 코드가 일치하지 않음
    break;
  case 'COMMON200':
    // 성공
    break;
  default:
  // 기타 에러 처리
}
```

### React Query 훅 사용

#### Mutation 예시

```typescript
import { useUpdateMyEmail } from '@nugudi/api';

function UpdateEmailForm() {
  const updateEmail = useUpdateMyEmail({
    mutation: {
      onSuccess: (response) => {
        if (response.status === 'COMMON200') {
          console.log('이메일 업데이트 성공');
        }
      },
      onError: (error) => {
        console.error('업데이트 실패:', error);
      },
    },
  });

  const handleSubmit = () => {
    updateEmail.mutate({
      data: {
        email: 'new@example.com',
        code: '123456',
      },
    });
  };

  return (
    <button onClick={handleSubmit} disabled={updateEmail.isPending}>
      {updateEmail.isPending ? '업데이트 중...' : '이메일 업데이트'}
    </button>
  );
}
```

#### Query 예시

```typescript
import { useGetMyProfile } from '@nugudi/api';

function ProfileComponent() {
  const { data, isLoading, error } = useGetMyProfile();

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>에러 발생</div>;

  if (data?.status === 'COMMON200') {
    return <div>사용자명: {data.data.result?.member?.name}</div>;
  }

  return <div>프로필을 불러올 수 없습니다</div>;
}
```

### Suspense Query 사용

```typescript
import { useGetMyProfileSuspense } from '@nugudi/api';

function ProfileComponent() {
  const { data } = useGetMyProfileSuspense();

  return <div>사용자명: {data.data.result?.member?.name}</div>;
}

// 부모 컴포넌트에서 Suspense로 감싸기
function App() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <ProfileComponent />
    </Suspense>
  );
}
```

### 에러 처리

```typescript
import { useUpdateMyEmail } from '@nugudi/api'

function Component() {
  const updateEmail = useUpdateMyEmail({
    mutation: {
      onError: (error, variables, context) => {
        // 네트워크 에러나 기타 예외 상황
        console.error('API 호출 실패:', error)
      },
      onSuccess: (response) => {
        // 응답은 성공했지만 비즈니스 로직 에러일 수 있음
        switch (response.status) {
          case "COMMON200":
            toast.success('성공!')
            break
          case "AUTH_011":
            toast.error('로그인이 필요합니다')
            redirect('/login')
            break
          case "EMAIL_002":
            toast.error('인증 코드가 올바르지 않습니다')
            break
          default:
            toast.error('알 수 없는 오류가 발생했습니다')
        }
      }
    }
  })

  return (
    // JSX
  )
}
```

### 타입 정의

모든 요청/응답 타입들이 자동으로 생성됩니다:

```typescript
import type {
  UpdateMyEmailRequest,
  BaseResponseUpdateMyEmailResponse,
  GetMyProfileResponse,
} from '@nugudi/api';

// 타입 안전성을 보장하는 함수
function processEmailUpdate(request: UpdateMyEmailRequest) {
  // TypeScript가 자동완성과 타입 검사를 제공
}
```

## MSW (Mock Service Worker) 연동

Orval에서 자동 생성된 MSW 핸들러를 사용하여 개발 및 테스트 환경에서 API를 모킹할 수 있습니다.

### MSW 설정

먼저 MSW 관련 패키지를 설치합니다:

```bash
pnpm add -D msw
```

### 자동 생성된 Mock 핸들러 사용

Orval에서 MSW 핸들러와 데이터가 자동으로 생성됩니다:

```typescript
// src/api/api.msw.ts에서 생성된 핸들러 import
import {
  getUpdateMyEmailMockHandler,
  getGetMyProfileMockHandler,
} from './api/api.msw';

// 브라우저용 MSW 설정
import { setupWorker } from 'msw/browser';

const worker = setupWorker(
  ...getUpdateMyEmailMockHandler(),
  ...getGetMyProfileMockHandler()
  // 필요한 다른 핸들러들 추가
);

// 개발 환경에서 worker 시작
if (process.env.NODE_ENV === 'development') {
  worker.start();
}
```

### 커스텀 응답 상태 처리

특정 상태 코드를 테스트하고 싶을 때:

```typescript
import { http, HttpResponse } from 'msw';
import { setupWorker } from 'msw/browser';

const worker = setupWorker(
  // 성공 케이스
  http.put('/v1/members/profiles/email', () => {
    return HttpResponse.json(
      {
        isSuccess: true,
        code: 'COMMON200',
        message: '성공',
        result: { memberId: 1, email: 'new@example.com' },
      },
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }),

  // 에러 케이스 테스트
  http.put('/v1/members/profiles/email', () => {
    return HttpResponse.json(
      {
        isSuccess: false,
        code: 'EMAIL_002',
        message: '이메일 인증 코드가 일치하지 않습니다',
        result: null,
      },
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  })
);
```

### React 컴포넌트에서 Mock 데이터 사용

```typescript
import { useUpdateMyEmail } from '@nugudi/api';

function TestComponent() {
  const updateEmail = useUpdateMyEmail({
    mutation: {
      onSuccess: (response) => {
        // Mock 데이터로 테스트
        switch (response.status) {
          case 'COMMON200':
            console.log('Mock: 성공 응답');
            break;
          case 'EMAIL_002':
            console.log('Mock: 인증 코드 불일치');
            break;
          case 'AUTH_011':
            console.log('Mock: 로그인 필요');
            break;
        }
      },
    },
  });

  return (
    <button
      onClick={() =>
        updateEmail.mutate({
          data: { email: 'test@example.com', code: '123456' },
        })
      }
    >
      테스트 API 호출
    </button>
  );
}
```

### Vitest 테스트와 함께 사용

```typescript
// vitest.setup.ts
import { setupServer } from 'msw/node';
import { getUpdateMyEmailMockHandler } from './src/api/api.msw';
import { beforeAll, afterEach, afterAll } from 'vitest';

export const server = setupServer(...getUpdateMyEmailMockHandler());

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

```typescript
// MyComponent.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import { server } from '../vitest.setup';
import { http, HttpResponse } from 'msw';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  test('이메일 업데이트 에러 처리', async () => {
    // 특정 에러 응답 설정
    server.use(
      http.put('/v1/members/profiles/email', () => {
        return HttpResponse.json(
          {
            isSuccess: false,
            code: 'EMAIL_002',
            message: '인증 코드가 일치하지 않습니다',
            result: null,
          },
          { status: 400 }
        );
      })
    );

    render(<MyComponent />);

    fireEvent.click(screen.getByText('이메일 업데이트'));

    await waitFor(() => {
      expect(
        screen.getByText('인증 코드가 일치하지 않습니다')
      ).toBeInTheDocument();
    });
  });
});
```

### 동적 Mock 응답

개발 중에 다양한 상태를 쉽게 테스트하기 위해:

```typescript
// Mock 상태 전환 유틸리티
class MockStateManager {
  private currentState: 'success' | 'email_error' | 'auth_error' = 'success';

  setMockState(state: typeof this.currentState) {
    this.currentState = state;
  }

  getUpdateEmailHandler() {
    return http.put('/v1/members/profiles/email', () => {
      switch (this.currentState) {
        case 'success':
          return HttpResponse.json({
            isSuccess: true,
            code: 'COMMON200',
            message: '성공',
            result: { memberId: 1, email: 'new@example.com' },
          });
        case 'email_error':
          return HttpResponse.json(
            {
              isSuccess: false,
              code: 'EMAIL_002',
              message: '인증 코드 불일치',
              result: null,
            },
            { status: 400 }
          );
        case 'auth_error':
          return HttpResponse.json(
            {
              isSuccess: false,
              code: 'AUTH_011',
              message: '로그인 필요',
              result: null,
            },
            { status: 401 }
          );
      }
    });
  }
}

const mockManager = new MockStateManager();

// 개발자 도구에서 상태 변경
window.setMockState = mockManager.setMockState.bind(mockManager);
```

### Storybook과 MSW 연동

```typescript
// .storybook/preview.ts
import { initialize, mswLoader } from 'msw-storybook-addon';
import { getUpdateMyEmailMockHandler } from '../src/api/api.msw';

initialize();

export const loaders = [mswLoader];

export const parameters = {
  msw: {
    handlers: [
      ...getUpdateMyEmailMockHandler(),
      // 다른 핸들러들
    ],
  },
};
```

```typescript
// Component.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { http, HttpResponse } from 'msw';
import UpdateEmailComponent from './UpdateEmailComponent';

const meta: Meta<typeof UpdateEmailComponent> = {
  title: 'UpdateEmailComponent',
  component: UpdateEmailComponent,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Success: Story = {
  parameters: {
    msw: {
      handlers: [
        http.put('/v1/members/profiles/email', () => {
          return HttpResponse.json({
            isSuccess: true,
            code: 'COMMON200',
            message: '성공',
            result: { memberId: 1, email: 'new@example.com' },
          });
        }),
      ],
    },
  },
};

export const EmailError: Story = {
  parameters: {
    msw: {
      handlers: [
        http.put('/v1/members/profiles/email', () => {
          return HttpResponse.json(
            {
              isSuccess: false,
              code: 'EMAIL_002',
              message: '인증 코드가 일치하지 않습니다',
              result: null,
            },
            { status: 400 }
          );
        }),
      ],
    },
  },
};
```

## 미들웨어 패턴: 인증 에러 및 토큰 갱신 처리

실제 프로덕션 환경에서는 특정 에러 코드에 대해 자동으로 토큰을 갱신하고 재시도하는 미들웨어 패턴이 필요합니다. 시니어 개발자 관점에서 견고하고 확장 가능한 솔루션을 제시합니다.

### 인증 미들웨어 아키텍처

```typescript
// src/api/auth-middleware.ts
import { QueryClient } from '@tanstack/react-query';

interface TokenRefreshStrategy {
  shouldRefresh(status: string): boolean;
  refreshToken(): Promise<{ accessToken: string; refreshToken: string }>;
  onRefreshSuccess(tokens: { accessToken: string; refreshToken: string }): void;
  onRefreshFailure(): void;
}

interface RetryConfig {
  maxRetries: number;
  retryDelay: number;
  exponentialBackoff: boolean;
}

class AuthenticationMiddleware {
  private refreshPromise: Promise<void> | null = null;
  private retryConfig: RetryConfig = {
    maxRetries: 3,
    retryDelay: 1000,
    exponentialBackoff: true,
  };

  constructor(
    private tokenStrategy: TokenRefreshStrategy,
    private queryClient: QueryClient
  ) {}

  /**
   * 인증 관련 에러 코드 정의
   * 비즈니스 요구사항에 따라 확장 가능
   */
  private readonly authErrorCodes = [
    'AUTH_011', // 회원가입을 완료한 유저만 접근 가능
    'AUTH_012', // 토큰이 만료됨
    'AUTH_013', // 유효하지 않은 토큰
    'AUTH_014', // 토큰이 없음
    'AUTH_015', // 권한이 없음
    'AUTH_016', // 계정이 비활성화됨
  ] as const;

  /**
   * 토큰 갱신이 필요한 에러 코드 (갱신 후 재시도 가능)
   */
  private readonly refreshableErrorCodes = [
    'AUTH_012', // 토큰 만료
    'AUTH_013', // 유효하지 않은 토큰
  ] as const;

  /**
   * 즉시 로그아웃 처리가 필요한 에러 코드
   */
  private readonly logoutErrorCodes = [
    'AUTH_014', // 토큰이 없음
    'AUTH_015', // 권한이 없음 (역할 변경 등)
    'AUTH_016', // 계정 비활성화
  ] as const;

  /**
   * API 응답 인터셉터 - 모든 API 호출에 적용
   */
  async handleResponse<T>(
    response: T & { status: string },
    originalRequest: () => Promise<T & { status: string }>,
    context: { retryCount?: number } = {}
  ): Promise<T & { status: string }> {
    const { retryCount = 0 } = context;

    // 성공 응답은 그대로 반환
    if (!this.authErrorCodes.includes(response.status as any)) {
      return response;
    }

    // 즉시 로그아웃이 필요한 경우
    if (this.logoutErrorCodes.includes(response.status as any)) {
      this.tokenStrategy.onRefreshFailure();
      throw new AuthenticationError(response.status, '로그인이 필요합니다');
    }

    // 토큰 갱신이 가능한 에러 코드인지 확인
    if (!this.refreshableErrorCodes.includes(response.status as any)) {
      throw new AuthenticationError(response.status, '인증 오류');
    }

    // 최대 재시도 횟수 확인
    if (retryCount >= this.retryConfig.maxRetries) {
      this.tokenStrategy.onRefreshFailure();
      throw new AuthenticationError(
        response.status,
        '인증 실패: 최대 재시도 횟수 초과'
      );
    }

    try {
      // 토큰 갱신 (동시 요청 시 중복 갱신 방지)
      await this.refreshTokenSafely();

      // 재시도 지연 (exponential backoff)
      await this.delay(this.calculateRetryDelay(retryCount));

      // 원본 요청 재시도
      return await this.handleResponse(
        await originalRequest(),
        originalRequest,
        { retryCount: retryCount + 1 }
      );
    } catch (refreshError) {
      this.tokenStrategy.onRefreshFailure();
      throw new AuthenticationError(
        response.status,
        '토큰 갱신 실패',
        refreshError
      );
    }
  }

  /**
   * 중복 토큰 갱신 방지를 위한 안전한 갱신 메서드
   */
  private async refreshTokenSafely(): Promise<void> {
    if (this.refreshPromise) {
      // 이미 진행 중인 갱신 프로세스를 기다림
      return this.refreshPromise;
    }

    this.refreshPromise = this.performTokenRefresh();

    try {
      await this.refreshPromise;
    } finally {
      this.refreshPromise = null;
    }
  }

  private async performTokenRefresh(): Promise<void> {
    const tokens = await this.tokenStrategy.refreshToken();
    this.tokenStrategy.onRefreshSuccess(tokens);

    // 기존 쿼리 무효화하여 새 토큰으로 재요청하도록 함
    this.queryClient.invalidateQueries();
  }

  private calculateRetryDelay(retryCount: number): number {
    if (!this.retryConfig.exponentialBackoff) {
      return this.retryConfig.retryDelay;
    }

    return this.retryConfig.retryDelay * Math.pow(2, retryCount);
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

class AuthenticationError extends Error {
  constructor(
    public statusCode: string,
    message: string,
    public originalError?: unknown
  ) {
    super(message);
    this.name = 'AuthenticationError';
  }
}
```

### 토큰 관리 전략 구현

```typescript
// src/api/token-strategy.ts
import { useRouter } from 'next/navigation';

interface TokenStorage {
  getAccessToken(): string | null;
  getRefreshToken(): string | null;
  setTokens(accessToken: string, refreshToken: string): void;
  clearTokens(): void;
}

class SecureTokenStorage implements TokenStorage {
  private readonly ACCESS_TOKEN_KEY = 'nugudi_access_token';
  private readonly REFRESH_TOKEN_KEY = 'nugudi_refresh_token';

  getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  setTokens(accessToken: string, refreshToken: string): void {
    if (typeof window === 'undefined') return;

    localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);

    // 토큰 변경 이벤트 발생 (다른 탭에서 동기화)
    window.dispatchEvent(
      new CustomEvent('tokenChanged', {
        detail: { accessToken, refreshToken },
      })
    );
  }

  clearTokens(): void {
    if (typeof window === 'undefined') return;

    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);

    window.dispatchEvent(new CustomEvent('tokenCleared'));
  }
}

class ProductionTokenRefreshStrategy implements TokenRefreshStrategy {
  constructor(
    private storage: TokenStorage,
    private router: ReturnType<typeof useRouter>
  ) {}

  shouldRefresh(status: string): boolean {
    return ['AUTH_012', 'AUTH_013'].includes(status);
  }

  async refreshToken(): Promise<{ accessToken: string; refreshToken: string }> {
    const refreshToken = this.storage.getRefreshToken();

    if (!refreshToken) {
      throw new Error('리프레시 토큰이 없습니다');
    }

    // 토큰 갱신 API 호출 (실제 엔드포인트로 교체)
    const response = await fetch('/v1/auth/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${refreshToken}`,
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      throw new Error('토큰 갱신 실패');
    }

    const data = await response.json();

    if (data.status !== 'COMMON200') {
      throw new Error(`토큰 갱신 실패: ${data.status}`);
    }

    return {
      accessToken: data.result.accessToken,
      refreshToken: data.result.refreshToken,
    };
  }

  onRefreshSuccess(tokens: {
    accessToken: string;
    refreshToken: string;
  }): void {
    this.storage.setTokens(tokens.accessToken, tokens.refreshToken);

    // 토큰 갱신 성공 로깅 (선택사항)
    console.log('토큰 갱신 성공');
  }

  onRefreshFailure(): void {
    this.storage.clearTokens();

    // 로그인 페이지로 리다이렉트
    this.router.push('/login?reason=session_expired');

    // 사용자에게 알림 (선택사항)
    console.warn('세션이 만료되었습니다. 다시 로그인해주세요.');
  }
}
```

### React Query와 미들웨어 통합

```typescript
// src/api/http.ts - Orval mutator 파일
import { AuthenticationMiddleware } from './auth-middleware';
import {
  ProductionTokenRefreshStrategy,
  SecureTokenStorage,
} from './token-strategy';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';

// 전역 미들웨어 인스턴스 (싱글톤 패턴)
let authMiddleware: AuthenticationMiddleware | null = null;

function getAuthMiddleware() {
  if (!authMiddleware && typeof window !== 'undefined') {
    const storage = new SecureTokenStorage();
    const router = useRouter();
    const queryClient = useQueryClient();
    const strategy = new ProductionTokenRefreshStrategy(storage, router);

    authMiddleware = new AuthenticationMiddleware(strategy, queryClient);
  }

  return authMiddleware;
}

// Orval에서 사용할 HTTP 클라이언트 함수
export const http = async <T>(config: {
  url: string;
  method: string;
  params?: Record<string, any>;
  data?: any;
  headers?: Record<string, string>;
}): Promise<T> => {
  const storage = new SecureTokenStorage();
  const accessToken = storage.getAccessToken();

  // 기본 헤더 설정
  const headers = {
    'Content-Type': 'application/json',
    ...config.headers,
  };

  // 인증 토큰 추가
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  // 원본 요청 함수
  const makeRequest = async (): Promise<T> => {
    const response = await fetch(config.url, {
      method: config.method,
      headers,
      body: config.data ? JSON.stringify(config.data) : undefined,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  };

  try {
    const result = await makeRequest();

    // 미들웨어를 통한 응답 처리
    const middleware = getAuthMiddleware();
    if (
      middleware &&
      result &&
      typeof result === 'object' &&
      'status' in result
    ) {
      return middleware.handleResponse(
        result as T & { status: string },
        makeRequest
      );
    }

    return result;
  } catch (error) {
    console.error('API 요청 실패:', error);
    throw error;
  }
};
```

### 고급 사용 사례

#### 1. 선택적 인증 API

```typescript
// 일부 API는 인증이 선택적인 경우
class ConditionalAuthMiddleware extends AuthenticationMiddleware {
  constructor(
    tokenStrategy: TokenRefreshStrategy,
    queryClient: QueryClient,
    private optionalAuthEndpoints: string[] = []
  ) {
    super(tokenStrategy, queryClient);
  }

  async handleResponse<T>(
    response: T & { status: string },
    originalRequest: () => Promise<T & { status: string }>,
    context: { endpoint?: string; retryCount?: number } = {}
  ): Promise<T & { status: string }> {
    // 선택적 인증 엔드포인트는 AUTH_014(토큰 없음) 에러를 무시
    if (
      context.endpoint &&
      this.optionalAuthEndpoints.includes(context.endpoint) &&
      response.status === 'AUTH_014'
    ) {
      return response;
    }

    return super.handleResponse(response, originalRequest, context);
  }
}
```

#### 2. 에러 모니터링 통합

```typescript
// src/api/error-monitoring.ts
interface ErrorMonitoringService {
  captureAuthError(error: AuthenticationError, context: any): void;
}

class SentryErrorMonitoring implements ErrorMonitoringService {
  captureAuthError(error: AuthenticationError, context: any): void {
    // Sentry 또는 다른 모니터링 서비스로 에러 전송
    console.error('Authentication Error', {
      statusCode: error.statusCode,
      message: error.message,
      context,
      timestamp: new Date().toISOString(),
    });
  }
}

// 미들웨어에 에러 모니터링 추가
class MonitoredAuthMiddleware extends AuthenticationMiddleware {
  constructor(
    tokenStrategy: TokenRefreshStrategy,
    queryClient: QueryClient,
    private errorMonitoring: ErrorMonitoringService
  ) {
    super(tokenStrategy, queryClient);
  }

  async handleResponse<T>(
    response: T & { status: string },
    originalRequest: () => Promise<T & { status: string }>,
    context: { retryCount?: number } = {}
  ): Promise<T & { status: string }> {
    try {
      return await super.handleResponse(response, originalRequest, context);
    } catch (error) {
      if (error instanceof AuthenticationError) {
        this.errorMonitoring.captureAuthError(error, {
          response,
          context,
          userAgent: navigator.userAgent,
          url: window.location.href,
        });
      }
      throw error;
    }
  }
}
```

#### 3. 실시간 토큰 갱신 알림

```typescript
// src/hooks/useAuthStatus.ts
import { useEffect, useState } from 'react';

interface AuthStatus {
  isAuthenticated: boolean;
  isRefreshing: boolean;
  lastRefreshTime: Date | null;
}

export function useAuthStatus(): AuthStatus {
  const [authStatus, setAuthStatus] = useState<AuthStatus>({
    isAuthenticated: false,
    isRefreshing: false,
    lastRefreshTime: null,
  });

  useEffect(() => {
    const handleTokenChanged = (event: CustomEvent) => {
      setAuthStatus((prev) => ({
        ...prev,
        isAuthenticated: true,
        lastRefreshTime: new Date(),
      }));
    };

    const handleTokenCleared = () => {
      setAuthStatus({
        isAuthenticated: false,
        isRefreshing: false,
        lastRefreshTime: null,
      });
    };

    const handleRefreshStart = () => {
      setAuthStatus((prev) => ({ ...prev, isRefreshing: true }));
    };

    const handleRefreshEnd = () => {
      setAuthStatus((prev) => ({ ...prev, isRefreshing: false }));
    };

    window.addEventListener(
      'tokenChanged',
      handleTokenChanged as EventListener
    );
    window.addEventListener('tokenCleared', handleTokenCleared);
    window.addEventListener('refreshStart', handleRefreshStart);
    window.addEventListener('refreshEnd', handleRefreshEnd);

    return () => {
      window.removeEventListener(
        'tokenChanged',
        handleTokenChanged as EventListener
      );
      window.removeEventListener('tokenCleared', handleTokenCleared);
      window.removeEventListener('refreshStart', handleRefreshStart);
      window.removeEventListener('refreshEnd', handleRefreshEnd);
    };
  }, []);

  return authStatus;
}
```

### 테스트 전략

```typescript
// src/api/__tests__/auth-middleware.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AuthenticationMiddleware } from '../auth-middleware';
import { QueryClient } from '@tanstack/react-query';
import type { TokenRefreshStrategy } from '../auth-middleware';

describe('AuthenticationMiddleware', () => {
  let middleware: AuthenticationMiddleware;
  let mockTokenStrategy: TokenRefreshStrategy;
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient();
    mockTokenStrategy = {
      shouldRefresh: vi.fn(),
      refreshToken: vi.fn(),
      onRefreshSuccess: vi.fn(),
      onRefreshFailure: vi.fn(),
    };

    middleware = new AuthenticationMiddleware(mockTokenStrategy, queryClient);
  });

  it('토큰 갱신 가능한 에러 코드에서 재시도해야 함', async () => {
    const mockResponse = { status: 'AUTH_012', data: null };
    const mockOriginalRequest = vi
      .fn()
      .mockReturnValueOnce(mockResponse)
      .mockReturnValueOnce({ status: 'COMMON200', data: { success: true } });

    vi.mocked(mockTokenStrategy.refreshToken).mockResolvedValue({
      accessToken: 'new-access-token',
      refreshToken: 'new-refresh-token',
    });

    const result = await middleware.handleResponse(
      mockResponse,
      mockOriginalRequest
    );

    expect(mockTokenStrategy.refreshToken).toHaveBeenCalledTimes(1);
    expect(mockOriginalRequest).toHaveBeenCalledTimes(2);
    expect(result.status).toBe('COMMON200');
  });

  it('최대 재시도 횟수 초과시 에러를 던져야 함', async () => {
    const mockResponse = { status: 'AUTH_012', data: null };
    const mockOriginalRequest = vi.fn().mockReturnValue(mockResponse);

    vi.mocked(mockTokenStrategy.refreshToken).mockResolvedValue({
      accessToken: 'new-access-token',
      refreshToken: 'new-refresh-token',
    });

    await expect(
      middleware.handleResponse(mockResponse, mockOriginalRequest, {
        retryCount: 3,
      })
    ).rejects.toThrow('최대 재시도 횟수 초과');
  });

  it('인증이 필요하지 않은 응답은 그대로 반환해야 함', async () => {
    const mockResponse = { status: 'COMMON200', data: { success: true } };
    const mockOriginalRequest = vi.fn();

    const result = await middleware.handleResponse(
      mockResponse,
      mockOriginalRequest
    );

    expect(result).toEqual(mockResponse);
    expect(mockOriginalRequest).not.toHaveBeenCalled();
    expect(mockTokenStrategy.refreshToken).not.toHaveBeenCalled();
  });

  it('로그아웃이 필요한 에러 코드에서 즉시 실패해야 함', async () => {
    const mockResponse = { status: 'AUTH_016', data: null };
    const mockOriginalRequest = vi.fn();

    await expect(
      middleware.handleResponse(mockResponse, mockOriginalRequest)
    ).rejects.toThrow('로그인이 필요합니다');

    expect(mockTokenStrategy.onRefreshFailure).toHaveBeenCalledTimes(1);
    expect(mockOriginalRequest).not.toHaveBeenCalled();
  });
});
```

이 미들웨어 패턴은 대규모 프로덕션 환경에서 검증된 아키텍처 원칙을 따라 설계되었습니다:

- **단일 책임 원칙**: 각 클래스가 명확한 역할을 가집니다
- **확장성**: 새로운 에러 코드나 전략을 쉽게 추가할 수 있습니다
- **테스트 가능성**: 의존성 주입으로 단위 테스트가 용이합니다
- **성능 최적화**: 동시 토큰 갱신 방지 및 지수 백오프로 서버 부하를 줄입니다
- **에러 복구**: 다양한 실패 시나리오에 대한 견고한 처리

## HTTP 클라이언트 (`src/api/http.ts`)의 역할과 중요성

### 현재 HTTP 클라이언트 구현

현재 프로젝트의 `src/api/http.ts` 파일은 Orval의 **mutator** 역할을 하는 핵심 컴포넌트입니다:

```typescript
// 현재 구현된 http.ts
export const http = async <T>(url: string, init: RequestInit): Promise<T> => {
  const response = await fetch(url, init);
  try {
    const data = handleDate(await response.json());

    return {
      data,
      status: response.status,
      headers: response.headers,
    } as T;
  } catch (_error) {
    return {
      data: null,
      status: response.status,
      headers: response.headers,
    } as T;
  }
};

// 날짜 문자열을 자동으로 Date 객체로 변환
const handleDate = <T>(body: T): T => {
  // ISO 8601 형식의 날짜 문자열을 탐지하고 Date 객체로 변환
  // 예: "2024-01-15T10:30:00Z" → new Date("2024-01-15T10:30:00Z")
};
```

### HTTP 클라이언트의 핵심 역할

#### 1. **Orval Mutator로서의 역할**

```typescript
// orval.config.ts에서 설정
override: {
  mutator: { path: "./src/api/http.ts", name: "http" }
}
```

Orval이 생성하는 모든 API 함수들이 이 `http` 함수를 사용하여 실제 네트워크 요청을 수행합니다. 즉, 모든 API 호출의 **단일 진입점** 역할을 합니다.

#### 2. **표준화된 응답 형식 제공**

```typescript
// 모든 API 응답이 다음 형식으로 표준화됨
{
  data: any,        // 실제 응답 데이터
  status: number,   // HTTP 상태 코드
  headers: Headers  // 응답 헤더
}
```

#### 3. **자동 날짜 변환 처리**

서버에서 오는 ISO 8601 날짜 문자열을 자동으로 JavaScript `Date` 객체로 변환:

```typescript
// 서버 응답: { createdAt: "2024-01-15T10:30:00Z" }
// 변환 후: { createdAt: new Date("2024-01-15T10:30:00Z") }
```

#### 4. **에러 처리 표준화**

JSON 파싱 실패 시에도 일관된 응답 구조를 유지합니다.

### HTTP 클라이언트가 있을 때 vs 없을 때의 차이점

| 측면              | HTTP 클라이언트 **있을 때**                                                   | HTTP 클라이언트 **없을 때**                                                        |
| ----------------- | ----------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| **API 호출 방식** | `const user = await getUser()` <br/>→ 표준화된 `{data, status, headers}` 형식 | `const response = await fetch('/users')` <br/>→ 원시 Response 객체, 수동 처리 필요 |
| **날짜 처리**     | ✅ **자동 변환**: `user.createdAt.getTime()`                                  | ❌ **수동 변환**: `new Date(user.createdAt)`                                       |
| **에러 처리**     | ✅ **일관성**: 모든 API에서 동일한 에러 구조                                  | ❌ **불일치**: API마다 다른 에러 처리 로직                                         |
| **토큰 관리**     | ✅ **중앙 집중**: 한 곳에서 모든 인증 처리                                    | ❌ **분산**: 각 API 호출마다 개별 처리                                             |
| **로깅/모니터링** | ✅ **통합**: 모든 API 호출 추적 가능                                          | ❌ **파편화**: 개별 구현 필요                                                      |
| **캐싱 전략**     | ✅ **글로벌**: 전역 캐싱 정책 적용                                            | ❌ **로컬**: 각각 구현                                                             |
| **재시도 로직**   | ✅ **자동**: 네트워크 오류 시 자동 재시도                                     | ❌ **수동**: 개별 구현 필요                                                        |

### 실제 사용 예시 비교

#### HTTP 클라이언트 **사용 시** (현재 방식)

```typescript
// 생성된 API 함수 사용
import { useGetUserProfile } from '@nugudi/api';

function UserProfile() {
  const { data, isLoading } = useGetUserProfile();

  if (data?.status === 'COMMON200') {
    // 날짜가 이미 Date 객체로 변환됨
    const daysSinceCreated = Math.floor(
      (Date.now() - data.data.result.createdAt.getTime()) /
        (1000 * 60 * 60 * 24)
    );

    return <div>가입한 지 {daysSinceCreated}일</div>;
  }

  return <div>로딩 중...</div>;
}
```

#### HTTP 클라이언트 **미사용 시** (원시 fetch 사용)

```typescript
// 매번 수동으로 처리해야 함
function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch('/v1/users/profile', {
          headers: {
            Authorization: `Bearer ${getToken()}`, // 매번 수동 설정
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();

        // 날짜 변환을 수동으로 처리
        if (data.result?.createdAt) {
          data.result.createdAt = new Date(data.result.createdAt);
        }

        setUser(data);
      } catch (error) {
        console.error('사용자 정보 로드 실패:', error);
        // 에러 처리 로직도 매번 구현
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  if (loading) return <div>로딩 중...</div>;

  if (user?.status === 'COMMON200') {
    const daysSinceCreated = Math.floor(
      (Date.now() - user.data.result.createdAt.getTime()) /
        (1000 * 60 * 60 * 24)
    );

    return <div>가입한 지 {daysSinceCreated}일</div>;
  }

  return <div>프로필을 불러올 수 없습니다</div>;
}
```

### 확장된 HTTP 클라이언트의 이점

프로덕션 환경에서는 앞서 제시한 미들웨어 패턴을 적용하여 다음과 같은 고급 기능들을 추가할 수 있습니다:

```typescript
// 확장된 http.ts 예시
export const http = async <T>(config: RequestConfig): Promise<T> => {
  // 1. 요청 전 인터셉터
  const enhancedConfig = await requestInterceptor(config);

  // 2. 실제 요청 수행
  const response = await fetch(enhancedConfig.url, enhancedConfig.init);

  // 3. 응답 후 인터셉터 (인증, 재시도, 로깅 등)
  const processedResponse = await responseInterceptor(response);

  // 4. 날짜 변환 및 타입 안전성 보장
  return handleDate(processedResponse) as T;
};
```

**주요 이점들:**

1. **개발 생산성**: 보일러플레이트 코드 제거
2. **일관성**: 모든 API 호출에서 동일한 동작 보장
3. **유지보수성**: 중앙 집중식 관리로 변경사항 전파 용이
4. **디버깅**: 모든 네트워크 요청을 한 곳에서 모니터링
5. **성능**: 캐싱, 재시도, 중복 제거 등 최적화 적용
6. **보안**: 토큰 관리, CSRF 보호 등 보안 정책 통합 적용

**결론**: `http.ts`는 단순한 fetch 래퍼가 아니라, 애플리케이션의 모든 API 통신을 제어하는 **핵심 인프라스트럭처**입니다. 이를 통해 개발자는 비즈니스 로직에 집중할 수 있고, 네트워크 레이어의 복잡성은 추상화됩니다.

## 개발

### 코드 재생성

OpenAPI 스펙이 업데이트되면 다음 명령어로 클라이언트 코드를 재생성합니다:

```bash
pnpm run codegen:generate
```

### 빌드

```bash
pnpm run build
```

## 주요 특징

- **타입 안전성**: TypeScript로 완전한 타입 지원
- **React Query 통합**: useQuery, useMutation 훅 자동 생성
- **Suspense 지원**: Suspense Query 훅 제공
- **문자열 리터럴 상태 코드**: 서버 응답 상태를 안전하게 처리
- **자동 생성**: OpenAPI 스펙으로부터 자동 생성되어 항상 최신 상태 유지

## API 문서

생성된 모든 함수와 타입에 대한 자세한 정보는 `src/index.ts`와 `src/index.schemas.ts` 파일을 참조하세요.
