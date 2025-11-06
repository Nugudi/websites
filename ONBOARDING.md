# 🎓 Onboarding Guide - Nugudi Clean Architecture

## 📋 Table of Contents

1. [Welcome](#welcome)
2. [What is Clean Architecture + DDD?](#what-is-clean-architecture--ddd)
3. [Why Clean Architecture?](#why-clean-architecture)
4. [Project Structure Deep Dive](#project-structure-deep-dive)
5. [Understanding the Layers](#understanding-the-layers)
6. [Data Flow: From API to UI](#data-flow-from-api-to-ui)
7. [Understanding Dependency Injection](#understanding-dependency-injection)
8. [State Management Strategy](#state-management-strategy)
9. [Step-by-Step: Reading the Codebase](#step-by-step-reading-the-codebase)
10. [Step-by-Step: Adding a New Feature](#step-by-step-adding-a-new-feature)
11. [Common Patterns Explained](#common-patterns-explained)
12. [Best Practices](#best-practices)
13. [Troubleshooting](#troubleshooting)
14. [Learning Path](#learning-path)
15. [Architecture Review & Improvements](#architecture-review--improvements)

---

## Welcome

안녕하세요! 👋 Nugudi 프로젝트에 오신 것을 환영합니다!

이 문서는 **Clean Architecture + Domain-Driven Design (DDD)**를 처음 접하는 개발자들을 위해 작성되었습니다. Next.js App Router 환경에서 Clean Architecture를 적용한 이 프로젝트의 구조를 이해하고, 코드를 읽고, 새로운 기능을 추가하는 방법을 **처음부터 끝까지** 상세하게 설명합니다.

### 이 문서에서 배울 수 있는 것

- ✅ Clean Architecture + DDD가 무엇이고 왜 사용하는지
- ✅ Next.js Server/Client 컴포넌트 환경에서의 아키텍처
- ✅ 프로젝트 구조를 어떻게 읽고 이해하는지
- ✅ 데이터가 어떻게 API에서 화면까지 흐르는지
- ✅ Server Container vs Client Container의 차이
- ✅ 새로운 기능을 어떻게 추가하는지
- ✅ 코드를 어떻게 테스트하고 디버깅하는지

### 필요한 사전 지식

- **React 기초**: 컴포넌트, Props, State, Hooks
- **Next.js 기초**: App Router, Server Components, Client Components
- **TypeScript 기초**: 타입, 인터페이스, 제네릭
- **JavaScript ES6+**: Arrow Functions, Promise, async/await
- **HTTP/REST API**: GET, POST, 요청/응답 개념

걱정하지 마세요! 모든 것을 자세히 설명하겠습니다. 🚀

---

## What is Clean Architecture + DDD?

### Clean Architecture 간단한 설명

**Clean Architecture**는 Uncle Bob (Robert C. Martin)이 제안한 소프트웨어 설계 방법입니다. 핵심 아이디어는 다음과 같습니다:

> **"비즈니스 로직을 프레임워크, 데이터베이스, UI로부터 독립적으로 만들자"**

### DDD (Domain-Driven Design) 간단한 설명

**DDD**는 Eric Evans가 제안한 설계 방법론으로, 비즈니스 도메인을 중심으로 소프트웨어를 설계합니다:

> **"복잡한 비즈니스를 도메인별로 나누고, 각 도메인을 독립적으로 관리하자"**

### Nugudi 프로젝트에서의 적용

```
┌─────────────────────────────────────────────────────┐
│  Presentation (UI)                                  │  ← Next.js Pages, Components
│  - Server Components (SSR, Prefetch)                │
│  - Client Components (Hydration, Interaction)       │
│  - Server Actions (Mutations)                       │
├─────────────────────────────────────────────────────┤
│  Application (Use Cases)                            │  ← 비즈니스 로직
│  - LoginWithOAuth, GetMyProfile, CreateReview       │
├─────────────────────────────────────────────────────┤
│  Domain (Entities, Interfaces)                      │  ← 핵심 규칙
│  - User, Session, Cafeteria, Review                 │
├─────────────────────────────────────────────────────┤
│  Data (Repositories, DTOs, Mappers)                 │  ← API 통신
│  - AuthRepositoryImpl, UserDTO, Mapper              │
├─────────────────────────────────────────────────────┤
│  Infrastructure (HTTP, Storage)                     │  ← 외부 라이브러리
│  - FetchHttpClient, AuthenticatedHttpClient         │
│  - ServerSessionManager, ClientSessionManager       │
└─────────────────────────────────────────────────────┘
```

### 비유로 이해하기 🏢

식당을 운영한다고 상상해봅시다:

```
┌─────────────────────────────────────┐
│  홀 (Presentation)                  │  ← 손님 응대, 주문 받기
├─────────────────────────────────────┤
│  주방장 (Use Cases)                 │  ← 요리 방법, 레시피
├─────────────────────────────────────┤
│  식재료 규칙 (Domain)               │  ← 신선도 기준, 품질 규칙
├─────────────────────────────────────┤
│  구매 담당 (Data)                   │  ← 재료 주문, 재고 관리
├─────────────────────────────────────┤
│  납품업체 (Infrastructure)          │  ← 외부 협력사
└─────────────────────────────────────┘
```

- **Presentation**: 손님(사용자)과 직접 소통
- **Use Cases**: 주방장이 레시피대로 요리
- **Domain**: 식재료의 품질 기준
- **Data**: 재료를 어디서 얼마나 가져올지
- **Infrastructure**: 실제 납품업체

### Next.js에서의 특별한 점

```typescript
// ❌ 전통적인 React (클라이언트만)
function ProfilePage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // 클라이언트에서 데이터 가져오기
    fetch('/api/user').then(res => setUser(res.data));
  }, []);

  if (!user) return <Loading />;
  return <UserProfile user={user} />;
}

// ✅ Next.js App Router (서버 + 클라이언트)
// 서버 컴포넌트 (Server Component)
async function ProfilePage() {
  // 서버에서 데이터 미리 가져오기 (Prefetch)
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(userProfileQueryServer);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UserProfileView /> {/* 클라이언트 컴포넌트 */}
    </HydrationBoundary>
  );
}

// 클라이언트 컴포넌트 (Client Component)
'use client';
function UserProfileView() {
  // 이미 서버에서 가져온 데이터 사용 (Hydration)
  const { data: user } = useGetMyProfile();

  return <UserProfile user={user} />;
}
```

**왜 이렇게 할까요?**

1. **초기 로딩 빠름**: 서버에서 미리 데이터를 가져와서 HTML에 포함
2. **SEO 최적화**: 검색 엔진이 완성된 HTML을 바로 읽음
3. **사용자 경험**: 로딩 스피너 대신 바로 콘텐츠 표시

---

## Why Clean Architecture?

### 실제 개발 시나리오로 이해하기

#### 시나리오 1: API 서버 변경 🔄

**상황**: 개발 서버에서 프로덕션 서버로 변경해야 합니다.

```typescript
// ❌ Clean Architecture 없이
// 문제: 모든 컴포넌트를 찾아서 수정해야 함
// profile-page.tsx
const res = await fetch('https://dev.api.nugudi.com/user/profile');

// cafeteria-page.tsx
const res = await fetch('https://dev.api.nugudi.com/cafeterias');

// ... 수십 개의 파일 수정 필요

// ✅ Clean Architecture로
// 해결: 환경 변수 한 곳만 수정하면 됨!
// .env.local
NEXT_PUBLIC_API_URL=https://prod.api.nugudi.com

// 모든 API 호출이 자동으로 프로덕션 서버로!
```

#### 시나리오 2: 인증 토큰 저장 방식 변경 🔀

**상황**: localStorage에서 Cookie로 변경하고 싶습니다.

```typescript
// ❌ Clean Architecture 없이
// 문제: 모든 곳에서 localStorage를 사용 중
localStorage.setItem('token', token);  // 100+ 곳에서 사용

// ✅ Clean Architecture로
// 해결: SessionManager 구현체만 교체
// infrastructure/storage/server-session-manager.ts
export class ServerSessionManager implements SessionManager {
  setToken(token: string) {
    // localStorage → Cookie로 한 줄만 변경!
    cookies().set('token', token, { httpOnly: true });
  }
}
```

#### 시나리오 3: 서버/클라이언트 환경 분리 🖥️

**상황**: Next.js에서는 서버와 클라이언트 코드가 다른 환경에서 실행됩니다.

```typescript
// ❌ Without proper separation
// 문제: 서버 코드에서 클라이언트 API 사용 (에러 발생!)
async function ProfilePage() {
  // ❌ 서버에서는 localStorage 없음!
  const token = localStorage.getItem('token');
  // Error: localStorage is not defined
}

// ✅ With Clean Architecture
// 해결: 환경별 구현체 자동 선택
// 서버에서는 ServerSessionManager 사용
const serverContainer = createAuthServerContainer();
const token = serverContainer.sessionManager.getToken(); // cookies() 사용

// 클라이언트에서는 ClientSessionManager 사용
const clientContainer = getAuthClientContainer();
const token = clientContainer.sessionManager.getToken(); // localStorage 사용
```

### 장점 요약

| 장점 | 설명 | Nugudi 예시 |
|------|------|------------|
| 🔧 **유지보수** | 변경 사항이 한 곳에만 영향 | API URL 변경 시 `.env` 파일만 수정 |
| 🧪 **테스트** | 각 레이어를 독립적으로 테스트 | UseCase를 API 없이 테스트 |
| 🔄 **재사용** | 비즈니스 로직을 여러 곳에서 사용 | LoginWithOAuth를 웹/앱에서 사용 |
| 🖥️ **SSR/CSR** | 서버/클라이언트 환경 자동 처리 | Container가 환경에 맞게 선택 |
| 👥 **협업** | 레이어별로 팀 분업 가능 | UI팀, API팀 독립적 작업 |
| 📚 **이해** | 각 코드의 역할이 명확 | 파일 위치만 봐도 역할 파악 |

---

## Project Structure Deep Dive

### 전체 구조 한눈에 보기 🗂️

```
nugudi/
├── apps/
│   └── web/                          # Next.js 웹 애플리케이션
│       ├── app/                      # Next.js App Router
│       │   ├── (auth)/              # 🔒 인증 필요한 페이지
│       │   ├── (public)/            # 🌍 공개 페이지
│       │   └── api/                 # API Routes
│       └── src/
│           ├── domains/             # 📦 비즈니스 도메인들 (DDD)
│           │   ├── auth/           # 인증 도메인
│           │   ├── user/           # 사용자 도메인
│           │   ├── cafeteria/      # 급식소 도메인
│           │   ├── benefit/        # 혜택 도메인
│           │   ├── notification/   # 알림 도메인
│           │   └── stamp/          # 스탬프 도메인
│           └── shared/             # 공유 인프라
│               ├── infrastructure/ # HTTP, Storage
│               └── interface-adapters/ # 공유 UI
│
└── packages/                        # 공유 패키지 (Monorepo)
    ├── react/
    │   ├── components/             # 18개 공유 컴포넌트
    │   └── hooks/                  # 8개 공유 훅
    ├── themes/                     # 디자인 토큰
    ├── types/                      # 공유 타입
    ├── assets/                     # 아이콘, 이미지
    └── ui/                         # Storybook
```

### 도메인별 구조 (Domain-Driven Design)

각 도메인은 독립적인 "미니 애플리케이션"처럼 구성됩니다:

```
domains/
└── auth/                            # 인증 도메인 예시
    ├── core/                        # 🎯 도메인 핵심 설정
    │   ├── config/                 # 상수, 설정
    │   ├── errors/                 # 도메인별 에러 (AuthError)
    │   └── types/                  # 도메인별 타입
    │
    ├── domain/                      # 🧠 비즈니스 로직 (프레임워크 독립)
    │   ├── entities/               # 엔티티 (User, Session, Token)
    │   ├── usecases/               # 유스케이스 (Use Case)
    │   │   ├── login-with-oauth-use-case.ts
    │   │   ├── logout-use-case.ts
    │   │   ├── refresh-token-use-case.ts
    │   │   └── ...
    │   ├── repositories/           # 레포지토리 인터페이스
    │   └── interfaces/             # 기타 인터페이스 (SessionManager)
    │
    ├── data/                        # 💾 데이터 접근 레이어
    │   ├── dto/                    # API 응답 형식 (DTO)
    │   │   ├── login-dto.ts
    │   │   ├── user-dto.ts
    │   │   └── token-dto.ts
    │   ├── mappers/                # DTO ↔ Entity 변환
    │   ├── repositories/           # 레포지토리 구현체
    │   └── data-sources/           # API 호출 (DataSource)
    │
    ├── infrastructure/              # 🔌 외부 서비스 연동
    │   └── services/               # RefreshTokenService
    │
    ├── presentation/                # 🎨 UI 레이어 (Next.js 특화)
    │   ├── actions/                # 🔥 Server Actions
    │   │   └── auth-actions.ts    # 서버 액션들
    │   ├── hooks/                  # 🪝 Client Hooks
    │   │   └── use-auth-queries.ts
    │   ├── ui/                     # UI 컴포넌트
    │   │   ├── components/         # 재사용 가능 컴포넌트
    │   │   ├── sections/           # 섹션 (데이터 fetch)
    │   │   └── views/              # 뷰 (페이지 레벨)
    │   ├── stores/                 # 🗄️ Client 상태 (Zustand)
    │   └── constants/              # UI 상수
    │
    ├── di/                          # 💉 Dependency Injection
    │   ├── auth-server-container.ts   # 서버 컨테이너 (per-request)
    │   ├── auth-client-container.ts   # 클라이언트 컨테이너 (singleton)
    │   └── index.ts
    │
    └── index.ts                     # 📤 Public API (Server Actions만 노출)
```

### Next.js App Router 구조

```
app/
├── (auth)/                          # 🔒 인증이 필요한 라우트 그룹
│   ├── profile/                    # 프로필 페이지
│   │   ├── page.tsx               # /profile
│   │   ├── edit/
│   │   │   └── page.tsx           # /profile/edit
│   │   ├── points/
│   │   │   └── page.tsx           # /profile/points
│   │   └── settings/
│   │       └── page.tsx           # /profile/settings
│   │
│   ├── cafeterias/                 # 급식소 페이지
│   │   ├── page.tsx               # /cafeterias (목록)
│   │   └── [cafeteriaId]/
│   │       └── page.tsx           # /cafeterias/:id (상세)
│   │
│   ├── benefits/
│   │   └── page.tsx               # /benefits
│   │
│   └── notifications/
│       └── page.tsx               # /notifications
│
├── (public)/                        # 🌍 공개 라우트 그룹
│   ├── auth/
│   │   ├── sign-in/
│   │   │   └── page.tsx           # /auth/sign-in
│   │   ├── sign-up/
│   │   │   └── page.tsx           # /auth/sign-up
│   │   └── forgot-password/
│   │       └── page.tsx           # /auth/forgot-password
│   │
│   ├── mbti/
│   │   └── page.tsx               # /mbti
│   │
│   └── debug/
│       └── page.tsx               # /debug
│
├── api/                             # API Routes
│   └── auth/
│       ├── callback/
│       │   └── [provider]/
│       │       └── route.ts       # OAuth 콜백
│       ├── refresh/
│       │   └── route.ts           # 토큰 갱신
│       └── session/
│           └── route.ts           # 세션 확인
│
├── layout.tsx                       # Root Layout
├── page.tsx                         # Home Page (/)
└── not-found.tsx                    # 404 Page
```

### 공유 패키지 구조 (Monorepo)

```
packages/
├── react/
│   ├── components/                  # 공유 컴포넌트
│   │   ├── button/                 # 각 컴포넌트는 독립 패키지
│   │   │   ├── src/
│   │   │   │   ├── button.tsx
│   │   │   │   ├── types.ts
│   │   │   │   ├── style.css.ts   # Vanilla Extract
│   │   │   │   └── index.ts
│   │   │   ├── package.json
│   │   │   └── tsconfig.json
│   │   ├── input/
│   │   ├── textarea/
│   │   ├── avatar/
│   │   └── ... (18개 컴포넌트)
│   │
│   └── hooks/                      # 공유 훅
│       ├── button/
│       ├── switch/
│       └── ... (8개 훅)
│
├── themes/                          # 디자인 시스템
│   ├── src/
│   │   ├── tokens/                # 디자인 토큰
│   │   │   ├── colors.ts
│   │   │   ├── typography.ts
│   │   │   └── spacing.ts
│   │   └── index.ts
│   └── README.md                  # 토큰 문서
│
├── types/                           # 공유 TypeScript 타입
│   └── src/
│       ├── entities/              # 도메인 엔티티 타입
│       ├── dto/                   # DTO 타입
│       └── common/                # 공통 유틸 타입
│
├── assets/                          # 정적 자산
│   └── icons/                     # SVG 아이콘
│
└── ui/                              # Storybook
    └── src/
        ├── stories/               # 스토리 파일
        └── .storybook/           # Storybook 설정
```

### 공유 인프라 구조

```
apps/web/src/shared/
├── infrastructure/                  # 공유 인프라스트럭처
│   ├── http/                       # HTTP 클라이언트
│   │   ├── fetch-http-client.ts   # 기본 HTTP 클라이언트
│   │   ├── authenticated-http-client.ts  # 인증 데코레이터
│   │   ├── server-token-provider.ts      # 서버 토큰 제공자
│   │   └── client-token-provider.ts      # 클라이언트 토큰 제공자
│   │
│   ├── storage/                    # 세션/스토리지 관리
│   │   ├── server-session-manager.ts     # 서버 세션 (cookies)
│   │   └── client-session-manager.ts     # 클라이언트 세션 (localStorage)
│   │
│   ├── configs/                    # 프레임워크 설정
│   │   └── tanstack-query/        # React Query 설정
│   │       ├── query-client.ts
│   │       └── get-query-client.ts
│   │
│   └── logging/                    # 로깅 유틸리티
│
└── interface-adapters/              # 공유 어댑터
    ├── components/                 # 공유 컴포넌트
    │   └── app-header/
    ├── sections/                   # 공유 섹션
    ├── providers/                  # 글로벌 Provider
    │   ├── tanstack-query-provider.tsx
    │   └── theme-provider.tsx
    └── styles/                     # 글로벌 스타일
```

---

## Understanding the Layers

각 레이어를 **실제 코드**와 함께 자세히 살펴보겠습니다.

### 1️⃣ Core Layer (도메인 핵심)

**역할**: 도메인별 설정, 에러, 타입 정의

#### 예시: Auth Domain Core

```typescript
// domains/auth/core/config/constants.ts

/**
 * Auth 도메인 상수
 *
 * 왜 필요한가?
 * - 상수를 한 곳에서 관리
 * - 오타 방지 (TypeScript 자동완성)
 * - 변경 시 한 곳만 수정
 */
export const AUTH_API_ENDPOINTS = {
  LOGIN: '/api/auth/login',
  LOGOUT: '/api/auth/logout',
  REFRESH: '/api/auth/refresh',
  CALLBACK: (provider: string) => `/api/auth/callback/${provider}`,
} as const;

export const OAUTH_PROVIDERS = {
  GOOGLE: 'google',
  KAKAO: 'kakao',
  NAVER: 'naver',
} as const;

export const SESSION_CONFIG = {
  TOKEN_KEY: 'access_token',
  REFRESH_TOKEN_KEY: 'refresh_token',
  MAX_AGE: 7 * 24 * 60 * 60, // 7 days
} as const;
```

```typescript
// domains/auth/core/errors/auth-error.ts

/**
 * Auth 도메인 커스텀 에러
 *
 * 왜 커스텀 에러?
 * - 에러 타입을 명확하게 구분
 * - 에러 처리 로직 통일
 * - 사용자 친화적 메시지
 */
export class AuthError extends Error {
  constructor(
    message: string,
    public code: AuthErrorCode,
    public statusCode?: number,
    public originalError?: unknown
  ) {
    super(message);
    this.name = 'AuthError';
  }

  isUnauthorized(): boolean {
    return this.statusCode === 401;
  }

  isTokenExpired(): boolean {
    return this.code === 'TOKEN_EXPIRED';
  }
}

export type AuthErrorCode =
  | 'INVALID_CREDENTIALS'
  | 'TOKEN_EXPIRED'
  | 'REFRESH_TOKEN_INVALID'
  | 'OAUTH_ERROR'
  | 'SESSION_NOT_FOUND';
```

```typescript
// domains/auth/core/types/oauth-provider.ts

/**
 * OAuth 프로바이더 타입
 */
export type OAuthProvider = 'google' | 'kakao' | 'naver';

export interface SignUpData {
  email: string;
  name: string;
  nickname?: string;
  profileImage?: string;
}
```

### 2️⃣ Domain Layer (비즈니스 로직)

**가장 중요한 레이어! 여기가 앱의 핵심입니다.**

#### Entity - 도메인 객체

```typescript
// domains/auth/domain/entities/user.entity.ts

/**
 * User Entity
 *
 * 도메인 엔티티는:
 * 1. 비즈니스 개념을 표현
 * 2. 프레임워크에 독립적
 * 3. 순수한 TypeScript 객체
 *
 * 주의: API 응답 형식(DTO)과 다릅니다!
 * - DTO: snake_case (API 응답)
 * - Entity: camelCase (앱 내부)
 */
export interface User {
  id: string;
  email: string;
  name: string;
  nickname: string;
  profileImage: string | null;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export type UserRole = 'user' | 'admin';
```

```typescript
// domains/auth/domain/entities/session.entity.ts

/**
 * Session Entity
 */
export interface Session {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: 'Bearer';
}
```

#### Repository Interface - 계약서

```typescript
// domains/auth/domain/repositories/auth-repository.ts

/**
 * Auth Repository 인터페이스
 *
 * 인터페이스는 "계약서"입니다:
 * - Domain은 "이런 기능이 필요해"라고 선언
 * - Data는 "이렇게 구현할게"라고 구현
 *
 * 장점:
 * 1. Domain은 구현 방법을 몰라도 됨
 * 2. 구현을 쉽게 교체 가능
 * 3. 테스트할 때 가짜(Mock) 객체 사용 가능
 */
export interface AuthRepository {
  /**
   * OAuth 로그인
   */
  loginWithGoogle(params: {
    code: string;
    redirectUri: string;
    deviceId: string;
  }): Promise<{ user: User; session: Session }>;

  loginWithKakao(params: {
    code: string;
    redirectUri: string;
    deviceId: string;
  }): Promise<{ user: User; session: Session }>;

  /**
   * 로그아웃
   */
  logout(refreshToken: string): Promise<void>;

  /**
   * 토큰 갱신
   */
  refreshAccessToken(refreshToken: string): Promise<Session>;

  /**
   * OAuth 인증 URL 가져오기
   */
  getOAuthAuthorizeUrl(params: {
    provider: OAuthProvider;
    redirectUri: string;
  }): Promise<string>;
}
```

#### Use Case - 비즈니스 로직

```typescript
// domains/auth/domain/usecases/login-with-oauth-use-case.ts

/**
 * Login With OAuth Use Case
 *
 * Use Case는:
 * 1. 하나의 비즈니스 기능을 담당
 * 2. Repository와 SessionManager를 통해 데이터 접근
 * 3. 비즈니스 규칙을 검증
 */

// 인터페이스 정의 (타입 안정성)
export interface LoginWithOAuthUseCase {
  execute(params: LoginWithOAuthParams): Promise<LoginWithOAuthResult>;
}

export interface LoginWithOAuthParams {
  provider: OAuthProvider;
  code: string;
  redirectUri: string;
}

export interface LoginWithOAuthResult {
  user: User;
  session: Session;
}

// 구현체
export class LoginWithOAuthUseCaseImpl implements LoginWithOAuthUseCase {
  /**
   * 생성자 주입 (Dependency Injection)
   *
   * Repository와 SessionManager의 구현체를 외부에서 주입받습니다.
   * 이렇게 하면 테스트할 때 가짜 객체를 넣을 수 있습니다.
   */
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly sessionManager: SessionManager
  ) {}

  async execute(params: LoginWithOAuthParams): Promise<LoginWithOAuthResult> {
    // 1. 입력값 검증
    if (!params.code) {
      throw new AuthError('Authorization code is required', 'OAUTH_ERROR');
    }

    if (!params.redirectUri) {
      throw new AuthError('Redirect URI is required', 'OAUTH_ERROR');
    }

    // 2. 디바이스 ID 생성 (보안)
    const deviceId = this.generateDeviceId();

    try {
      // 3. Repository를 통해 로그인
      let result;
      switch (params.provider) {
        case 'google':
          result = await this.authRepository.loginWithGoogle({
            code: params.code,
            redirectUri: params.redirectUri,
            deviceId,
          });
          break;
        case 'kakao':
          result = await this.authRepository.loginWithKakao({
            code: params.code,
            redirectUri: params.redirectUri,
            deviceId,
          });
          break;
        default:
          throw new AuthError('Unsupported OAuth provider', 'OAUTH_ERROR');
      }

      // 4. 세션 저장 (SessionManager 사용)
      await this.sessionManager.setToken(result.session.accessToken);
      await this.sessionManager.setRefreshToken(result.session.refreshToken);

      // 5. 결과 반환
      return result;
    } catch (error) {
      // 6. 에러 처리
      if (error instanceof AuthError) {
        throw error;
      }
      throw new AuthError('Login failed', 'OAUTH_ERROR', undefined, error);
    }
  }

  private generateDeviceId(): string {
    // 디바이스 ID 생성 로직
    return `device-${Date.now()}-${Math.random()}`;
  }
}
```

### 3️⃣ Data Layer (데이터 접근)

#### DTO - API 응답 형식

```typescript
// domains/auth/data/dto/user-dto.ts
import { z } from 'zod';

/**
 * User DTO Schema
 *
 * DTO (Data Transfer Object):
 * - API 응답의 정확한 형식
 * - snake_case 사용 (API 규약)
 * - Zod로 런타임 검증
 *
 * 왜 Zod?
 * 1. 타입 추론: TypeScript 타입 자동 생성
 * 2. 런타임 검증: 잘못된 데이터 걸러냄
 * 3. 에러 메시지: 어떤 필드가 잘못됐는지 알려줌
 */
export const UserDTOSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  nickname: z.string(),
  profile_image: z.string().nullable(),  // snake_case!
  role: z.enum(['user', 'admin']),
  created_at: z.string(),                // ISO 날짜 문자열
  updated_at: z.string(),
});

// TypeScript 타입 자동 생성
export type UserDTO = z.infer<typeof UserDTOSchema>;

/**
 * Login Response DTO
 */
export const LoginResponseDTOSchema = z.object({
  user: UserDTOSchema,
  session: z.object({
    access_token: z.string(),
    refresh_token: z.string(),
    expires_in: z.number(),
    token_type: z.literal('Bearer'),
  }),
});

export type LoginResponseDTO = z.infer<typeof LoginResponseDTOSchema>;
```

#### Mapper - DTO to Entity 변환

```typescript
// domains/auth/data/mappers/user-mapper.ts

/**
 * User Mapper
 *
 * Mapper의 역할:
 * 1. DTO (snake_case) → Entity (camelCase) 변환
 * 2. 데이터 정제 (null 처리, 기본값 등)
 * 3. 추가 로직 적용 (계산, 포맷팅 등)
 *
 * 왜 필요?
 * - API 형식과 앱 내부 형식을 분리
 * - API가 바뀌어도 Entity는 안정적
 */
export class UserMapper {
  /**
   * DTO를 Entity로 변환
   */
  static toDomain(dto: UserDTO): User {
    return {
      id: dto.id,
      email: dto.email,
      name: dto.name,
      nickname: dto.nickname,
      profileImage: dto.profile_image,      // snake_case → camelCase
      role: dto.role,
      createdAt: new Date(dto.created_at),  // 문자열 → Date
      updatedAt: new Date(dto.updated_at),
    };
  }

  /**
   * Entity를 DTO로 변환 (POST 요청 시 사용)
   */
  static toDTO(entity: User): UserDTO {
    return {
      id: entity.id,
      email: entity.email,
      name: entity.name,
      nickname: entity.nickname,
      profile_image: entity.profileImage,   // camelCase → snake_case
      role: entity.role,
      created_at: entity.createdAt.toISOString(),
      updated_at: entity.updatedAt.toISOString(),
    };
  }
}
```

#### Data Source - API 호출

```typescript
// domains/auth/data/data-sources/auth-remote-data-source.ts

/**
 * Auth Remote Data Source
 *
 * Data Source의 역할:
 * 1. HTTP 요청 수행
 * 2. 응답 검증 (Zod)
 * 3. DTO 반환
 *
 * 주의: Entity가 아닌 DTO를 반환!
 */
export class AuthRemoteDataSource {
  constructor(private readonly httpClient: HttpClient) {}

  /**
   * Google OAuth 로그인
   */
  async loginWithGoogle(params: {
    code: string;
    redirectUri: string;
    deviceId: string;
  }): Promise<LoginResponseDTO> {
    // 1. API 호출
    const response = await this.httpClient.post<unknown>(
      AUTH_API_ENDPOINTS.LOGIN,
      {
        provider: 'google',
        code: params.code,
        redirect_uri: params.redirectUri,
        device_id: params.deviceId,
      }
    );

    // 2. Zod로 응답 검증
    const parsed = LoginResponseDTOSchema.parse(response);

    // 3. DTO 반환
    return parsed;
  }

  /**
   * 토큰 갱신
   */
  async refreshAccessToken(refreshToken: string): Promise<SessionDTO> {
    const response = await this.httpClient.post<unknown>(
      AUTH_API_ENDPOINTS.REFRESH,
      { refresh_token: refreshToken }
    );

    return SessionDTOSchema.parse(response);
  }
}
```

#### Repository Implementation - 인터페이스 구현

```typescript
// domains/auth/data/repositories/auth-repository-impl.ts

/**
 * Auth Repository 구현체
 *
 * Repository 구현체의 역할:
 * 1. Data Source 호출
 * 2. DTO → Entity 변환 (Mapper 사용)
 * 3. Domain 인터페이스 충족
 */
export class AuthRepositoryImpl implements AuthRepository {
  constructor(private readonly dataSource: AuthRemoteDataSource) {}

  async loginWithGoogle(params: {
    code: string;
    redirectUri: string;
    deviceId: string;
  }): Promise<{ user: User; session: Session }> {
    try {
      // 1. Data Source에서 DTO 가져오기
      const dto = await this.dataSource.loginWithGoogle(params);

      // 2. Mapper로 Entity 변환
      const user = UserMapper.toDomain(dto.user);
      const session = SessionMapper.toDomain(dto.session);

      // 3. Entity 반환
      return { user, session };
    } catch (error) {
      // 에러 처리
      if (error instanceof ZodError) {
        throw new AuthError('Invalid response from server', 'OAUTH_ERROR');
      }
      throw error;
    }
  }

  async logout(refreshToken: string): Promise<void> {
    await this.dataSource.logout(refreshToken);
  }

  async refreshAccessToken(refreshToken: string): Promise<Session> {
    const dto = await this.dataSource.refreshAccessToken(refreshToken);
    return SessionMapper.toDomain(dto);
  }
}
```

### 4️⃣ Infrastructure Layer (외부 라이브러리)

#### HTTP Client 추상화

```typescript
// shared/infrastructure/http/fetch-http-client.ts

/**
 * Fetch HTTP Client
 *
 * 기본 HTTP 클라이언트 구현 (fetch API 사용)
 */
export interface HttpClient {
  get<T>(url: string, config?: RequestConfig): Promise<T>;
  post<T>(url: string, data?: unknown, config?: RequestConfig): Promise<T>;
  put<T>(url: string, data?: unknown, config?: RequestConfig): Promise<T>;
  delete<T>(url: string, config?: RequestConfig): Promise<T>;
}

export class FetchHttpClient implements HttpClient {
  constructor(private config: { baseUrl?: string } = {}) {}

  async get<T>(url: string, config?: RequestConfig): Promise<T> {
    const response = await fetch(this.buildUrl(url, config?.params), {
      method: 'GET',
      headers: this.buildHeaders(config?.headers),
    });

    return this.handleResponse<T>(response);
  }

  async post<T>(url: string, data?: unknown, config?: RequestConfig): Promise<T> {
    const response = await fetch(this.buildUrl(url), {
      method: 'POST',
      headers: this.buildHeaders(config?.headers),
      body: JSON.stringify(data),
    });

    return this.handleResponse<T>(response);
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    return response.json();
  }

  private buildUrl(url: string, params?: Record<string, unknown>): string {
    const baseUrl = this.config.baseUrl || '';
    const fullUrl = `${baseUrl}${url}`;

    if (!params) return fullUrl;

    const searchParams = new URLSearchParams(
      Object.entries(params).map(([key, value]) => [key, String(value)])
    );

    return `${fullUrl}?${searchParams.toString()}`;
  }

  private buildHeaders(headers?: Record<string, string>): HeadersInit {
    return {
      'Content-Type': 'application/json',
      ...headers,
    };
  }
}
```

```typescript
// shared/infrastructure/http/authenticated-http-client.ts

/**
 * Authenticated HTTP Client
 *
 * Decorator Pattern:
 * - FetchHttpClient를 감싸서 인증 기능 추가
 * - 자동으로 Authorization 헤더 추가
 * - 401 에러 시 토큰 갱신 시도
 */
export class AuthenticatedHttpClient implements HttpClient {
  constructor(
    private readonly baseClient: HttpClient,
    private readonly tokenProvider: TokenProvider,
    private readonly sessionManager?: SessionManager,
    private readonly refreshTokenService?: RefreshTokenService
  ) {}

  async get<T>(url: string, config?: RequestConfig): Promise<T> {
    return this.executeWithAuth(() => this.baseClient.get<T>(url, config));
  }

  async post<T>(url: string, data?: unknown, config?: RequestConfig): Promise<T> {
    return this.executeWithAuth(() => this.baseClient.post<T>(url, data, config));
  }

  /**
   * 인증이 필요한 요청 실행
   */
  private async executeWithAuth<T>(request: () => Promise<T>): Promise<T> {
    try {
      // 1. 토큰 가져오기
      const token = await this.tokenProvider.getToken();

      // 2. Authorization 헤더 추가
      if (token) {
        // TODO: 헤더 추가 로직
      }

      // 3. 요청 실행
      return await request();
    } catch (error) {
      // 4. 401 에러 시 토큰 갱신 시도
      if (this.isUnauthorizedError(error)) {
        return this.handleUnauthorizedError(request);
      }

      throw error;
    }
  }

  /**
   * 401 에러 처리 (토큰 갱신)
   */
  private async handleUnauthorizedError<T>(
    request: () => Promise<T>
  ): Promise<T> {
    if (!this.refreshTokenService || !this.sessionManager) {
      throw new AuthError('Authentication required', 'TOKEN_EXPIRED', 401);
    }

    try {
      // 1. 토큰 갱신
      await this.refreshTokenService.refreshToken();

      // 2. 원래 요청 재시도
      return await request();
    } catch (error) {
      // 3. 갱신 실패 시 로그아웃
      await this.sessionManager.clearSession();
      throw new AuthError('Session expired', 'TOKEN_EXPIRED', 401);
    }
  }

  private isUnauthorizedError(error: unknown): boolean {
    return error instanceof Error && error.message.includes('401');
  }
}
```

#### Session Management

```typescript
// shared/infrastructure/storage/server-session-manager.ts
import { cookies } from 'next/headers';

/**
 * Server Session Manager
 *
 * Next.js 서버 환경에서 세션 관리 (cookies 사용)
 */
export class ServerSessionManager implements SessionManager {
  async getToken(): Promise<string | null> {
    const cookieStore = await cookies();
    return cookieStore.get(SESSION_CONFIG.TOKEN_KEY)?.value || null;
  }

  async setToken(token: string): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.set(SESSION_CONFIG.TOKEN_KEY, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: SESSION_CONFIG.MAX_AGE,
    });
  }

  async getRefreshToken(): Promise<string | null> {
    const cookieStore = await cookies();
    return cookieStore.get(SESSION_CONFIG.REFRESH_TOKEN_KEY)?.value || null;
  }

  async setRefreshToken(token: string): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.set(SESSION_CONFIG.REFRESH_TOKEN_KEY, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: SESSION_CONFIG.MAX_AGE,
    });
  }

  async clearSession(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_CONFIG.TOKEN_KEY);
    cookieStore.delete(SESSION_CONFIG.REFRESH_TOKEN_KEY);
  }
}
```

```typescript
// shared/infrastructure/storage/client-session-manager.ts

/**
 * Client Session Manager
 *
 * 브라우저 환경에서 세션 관리 (localStorage 사용)
 */
export class ClientSessionManager implements SessionManager {
  async getToken(): Promise<string | null> {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(SESSION_CONFIG.TOKEN_KEY);
  }

  async setToken(token: string): Promise<void> {
    if (typeof window === 'undefined') return;
    localStorage.setItem(SESSION_CONFIG.TOKEN_KEY, token);
  }

  async getRefreshToken(): Promise<string | null> {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(SESSION_CONFIG.REFRESH_TOKEN_KEY);
  }

  async setRefreshToken(token: string): Promise<void> {
    if (typeof window === 'undefined') return;
    localStorage.setItem(SESSION_CONFIG.REFRESH_TOKEN_KEY, token);
  }

  async clearSession(): Promise<void> {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(SESSION_CONFIG.TOKEN_KEY);
    localStorage.removeItem(SESSION_CONFIG.REFRESH_TOKEN_KEY);
  }
}
```

### 5️⃣ DI Container (의존성 주입)

#### Server Container (Per-Request)

```typescript
// domains/auth/di/auth-server-container.ts

/**
 * Auth Server Container
 *
 * 서버 환경에서 사용하는 DI 컨테이너
 *
 * 중요:
 * - 매 요청마다 새로운 인스턴스 생성 (createAuthServerContainer 호출)
 * - 서버 전용 구현체 사용 (ServerSessionManager, ServerTokenProvider)
 * - 절대 클라이언트에서 사용하면 안 됨!
 */

export interface AuthServerContainer {
  getLoginWithOAuth: () => LoginWithOAuthUseCase;
  getLogout: () => LogoutUseCase;
  getRefreshToken: () => RefreshTokenUseCase;
  getGetCurrentSession: () => GetCurrentSessionUseCase;
  getGetOAuthAuthorizeUrl: () => GetOAuthAuthorizeUrlUseCase;
  getSignUpWithSocial: () => SignUpWithSocialUseCase;
}

export function createAuthServerContainer(
  baseUrl?: string
): AuthServerContainer {
  // 1. Infrastructure Layer 생성
  const sessionManager = new ServerSessionManager();
  const tokenProvider = new ServerTokenProvider(sessionManager);

  const baseHttpClient = new FetchHttpClient({
    baseUrl: baseUrl || process.env.NEXT_PUBLIC_API_URL,
  });

  const httpClient = new AuthenticatedHttpClient(
    baseHttpClient,
    tokenProvider,
    sessionManager,
    new RefreshTokenService(sessionManager, baseUrl)
  );

  // 2. Data Layer 생성
  const authDataSource = new AuthRemoteDataSource(httpClient);
  const authRepository = new AuthRepositoryImpl(authDataSource);

  // 3. Domain Layer (Use Cases) 생성
  return {
    getLoginWithOAuth: () =>
      new LoginWithOAuthUseCaseImpl(authRepository, sessionManager),

    getLogout: () => new LogoutUseCaseImpl(authRepository, sessionManager),

    getRefreshToken: () =>
      new RefreshTokenUseCaseImpl(authRepository, sessionManager),

    getGetCurrentSession: () =>
      new GetCurrentSessionUseCaseImpl(sessionManager),

    getGetOAuthAuthorizeUrl: () =>
      new GetOAuthAuthorizeUrlUseCaseImpl(authRepository),

    getSignUpWithSocial: () =>
      new SignUpWithSocialUseCaseImpl(authRepository, sessionManager),
  };
}
```

#### Client Container (Singleton)

```typescript
// domains/auth/di/auth-client-container.ts

/**
 * Auth Client Container
 *
 * 클라이언트 환경에서 사용하는 DI 컨테이너
 *
 * 중요:
 * - Lazy Singleton 패턴 (처음 호출 시 생성, 이후 재사용)
 * - 클라이언트 전용 구현체 사용 (ClientSessionManager, ClientTokenProvider)
 * - 절대 서버에서 사용하면 안 됨!
 */

export interface AuthClientContainer {
  getLoginWithOAuth: () => LoginWithOAuthUseCase;
  getLogout: () => LogoutUseCase;
  getGetCurrentSession: () => GetCurrentSessionUseCase;
}

class AuthClientContainerImpl implements AuthClientContainer {
  private loginWithOAuthUseCase?: LoginWithOAuthUseCase;
  private logoutUseCase?: LogoutUseCase;
  private getCurrentSessionUseCase?: GetCurrentSessionUseCase;

  // Infrastructure Layer (Lazy 초기화)
  private _sessionManager?: SessionManager;
  private _httpClient?: HttpClient;
  private _authRepository?: AuthRepository;

  private get sessionManager(): SessionManager {
    if (!this._sessionManager) {
      this._sessionManager = new ClientSessionManager();
    }
    return this._sessionManager;
  }

  private get httpClient(): HttpClient {
    if (!this._httpClient) {
      const tokenProvider = new ClientTokenProvider(this.sessionManager);
      const baseClient = new FetchHttpClient({
        baseUrl: process.env.NEXT_PUBLIC_API_URL,
      });

      this._httpClient = new AuthenticatedHttpClient(
        baseClient,
        tokenProvider,
        this.sessionManager
      );
    }
    return this._httpClient;
  }

  private get authRepository(): AuthRepository {
    if (!this._authRepository) {
      const dataSource = new AuthRemoteDataSource(this.httpClient);
      this._authRepository = new AuthRepositoryImpl(dataSource);
    }
    return this._authRepository;
  }

  // Use Case Getters (Lazy 초기화)
  getLoginWithOAuth(): LoginWithOAuthUseCase {
    if (!this.loginWithOAuthUseCase) {
      this.loginWithOAuthUseCase = new LoginWithOAuthUseCaseImpl(
        this.authRepository,
        this.sessionManager
      );
    }
    return this.loginWithOAuthUseCase;
  }

  getLogout(): LogoutUseCase {
    if (!this.logoutUseCase) {
      this.logoutUseCase = new LogoutUseCaseImpl(
        this.authRepository,
        this.sessionManager
      );
    }
    return this.logoutUseCase;
  }

  getGetCurrentSession(): GetCurrentSessionUseCase {
    if (!this.getCurrentSessionUseCase) {
      this.getCurrentSessionUseCase = new GetCurrentSessionUseCaseImpl(
        this.sessionManager
      );
    }
    return this.getCurrentSessionUseCase;
  }
}

// Singleton Instance
let clientContainerInstance: AuthClientContainer | null = null;

/**
 * Client Container 가져오기
 *
 * 처음 호출 시 인스턴스 생성, 이후 재사용
 */
export function getAuthClientContainer(): AuthClientContainer {
  if (!clientContainerInstance) {
    clientContainerInstance = new AuthClientContainerImpl();
  }
  return clientContainerInstance;
}
```

### 6️⃣ Presentation Layer (React UI)

#### Server Action (Next.js)

```typescript
// domains/auth/presentation/actions/auth-actions.ts
'use server';

import { createAuthServerContainer } from '@/domains/auth/di';

/**
 * Server Action: OAuth 로그인
 *
 * Server Actions는:
 * 1. 서버에서만 실행 ('use server')
 * 2. Server Container 사용
 * 3. 클라이언트에서 직접 호출 가능
 */
export async function loginWithOAuthAction(params: {
  provider: OAuthProvider;
  code: string;
  redirectUri: string;
}) {
  try {
    // 1. Server Container 생성 (매 요청마다 새로 생성)
    const container = createAuthServerContainer();

    // 2. Use Case 가져오기
    const loginUseCase = container.getLoginWithOAuth();

    // 3. Use Case 실행
    const result = await loginUseCase.execute(params);

    // 4. 성공 응답
    return {
      success: true,
      data: result,
    };
  } catch (error) {
    // 5. 에러 처리
    console.error('Login failed:', error);

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Login failed',
    };
  }
}

/**
 * Server Action: 로그아웃
 */
export async function logoutAction() {
  try {
    const container = createAuthServerContainer();
    const logoutUseCase = container.getLogout();

    await logoutUseCase.execute();

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Logout failed',
    };
  }
}
```

#### Client Hook (React Query)

```typescript
// domains/auth/presentation/hooks/use-auth-queries.ts
'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { getAuthClientContainer } from '@/domains/auth/di';

/**
 * 현재 세션 조회 훅
 *
 * Client Container 사용
 */
export function useGetCurrentSession() {
  const container = getAuthClientContainer();
  const getCurrentSession = container.getGetCurrentSession();

  return useQuery({
    queryKey: ['auth', 'session'],
    queryFn: () => getCurrentSession.execute(),
    staleTime: 5 * 60 * 1000, // 5분
  });
}

/**
 * 로그아웃 뮤테이션 훅
 */
export function useLogout() {
  const container = getAuthClientContainer();
  const logout = container.getLogout();

  return useMutation({
    mutationFn: () => logout.execute(),
    onSuccess: () => {
      // 로그아웃 성공 시 캐시 무효화
      queryClient.clear();
    },
  });
}
```

#### Component Hierarchy (Page → View → Section → Component)

```typescript
// app/(auth)/profile/page.tsx
/**
 * Page (Server Component)
 *
 * 역할:
 * - 서버에서 데이터 Prefetch
 * - HydrationBoundary로 클라이언트에 전달
 * - View 컴포넌트 렌더링
 */
import { getQueryClient } from '@/shared/infrastructure/configs/tanstack-query';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { UserProfileView } from '@/domains/user/presentation/ui/views';

const ProfilePage = async () => {
  const queryClient = getQueryClient();

  // 서버에서 데이터 미리 가져오기
  await queryClient.prefetchQuery({
    queryKey: ['user', 'profile'],
    queryFn: async () => {
      const container = createUserServerContainer();
      const getProfile = container.getGetMyProfile();
      return getProfile.execute();
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UserProfileView />
    </HydrationBoundary>
  );
};

export default ProfilePage;
```

```typescript
// domains/user/presentation/ui/views/user-profile-view.tsx
'use client';

/**
 * View (Client Component)
 *
 * 역할:
 * - 페이지 레벨 레이아웃
 * - 여러 Section 조합
 * - 페이지 레벨 상태 관리
 */
export function UserProfileView() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>

      {/* Suspense로 각 Section을 독립적으로 로딩 */}
      <Suspense fallback={<ProfileSkeleton />}>
        <UserProfileSection />
      </Suspense>

      <Suspense fallback={<PointsSkeleton />}>
        <UserPointsBalanceSection />
      </Suspense>

      <Suspense fallback={<MenuSkeleton />}>
        <UserProfileMenuSection />
      </Suspense>
    </div>
  );
}
```

```typescript
// domains/user/presentation/ui/sections/user-profile-section.tsx
'use client';

import { useGetMyProfile } from '../../hooks/use-user-queries';

/**
 * Section (Client Component)
 *
 * 역할:
 * - 도메인 데이터 Fetch (Client Container 사용)
 * - ErrorBoundary 처리
 * - Component 조합
 */
export function UserProfileSection() {
  // Client Container를 통한 데이터 fetch
  const { data: user } = useGetMyProfile();

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="flex items-center gap-4">
        <UserAvatar src={user.profileImage} alt={user.name} />

        <div>
          <h2 className="text-xl font-semibold">{user.name}</h2>
          <p className="text-gray-600">@{user.nickname}</p>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
      </div>

      <div className="mt-4">
        <UserProfileNavigationLink />
      </div>
    </div>
  );
}
```

```typescript
// domains/user/presentation/ui/components/user-avatar.tsx

/**
 * Component (Presentational)
 *
 * 역할:
 * - 순수 UI 렌더링
 * - Props로 데이터 받기
 * - 비즈니스 로직 없음
 */
interface UserAvatarProps {
  src: string | null;
  alt: string;
  size?: 'sm' | 'md' | 'lg';
}

export function UserAvatar({ src, alt, size = 'md' }: UserAvatarProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  return (
    <div className={`${sizeClasses[size]} rounded-full overflow-hidden`}>
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full bg-gray-300 flex items-center justify-center">
          <span className="text-gray-600 font-semibold">
            {alt.charAt(0).toUpperCase()}
          </span>
        </div>
      )}
    </div>
  );
}
```

---

## Data Flow: From API to UI

### 전체 데이터 흐름 시각화

사용자가 "내 프로필 보기" 페이지를 방문했을 때의 전체 흐름을 따라가보겠습니다.

```
🖥️ 사용자가 /profile 방문
     ↓
┌────────────────────────────────────────────────────────┐
│  1. Server Component (Page)                            │
│                                                        │
│  ProfilePage (app/(auth)/profile/page.tsx)             │
│  - 서버에서 실행                                         │
│  - Server Container 사용                               │
│  - prefetchQuery로 데이터 미리 가져오기                  │
└────────────────────────────────────────────────────────┘
     ↓
┌────────────────────────────────────────────────────────┐
│  2. Server Container                                   │
│                                                        │
│  createUserServerContainer()                           │
│  - 매 요청마다 새 인스턴스 생성                          │
│  - ServerSessionManager 사용 (cookies)                 │
│  - ServerTokenProvider 사용                            │
└────────────────────────────────────────────────────────┘
     ↓
┌────────────────────────────────────────────────────────┐
│  3. Use Case (Server-side)                             │
│                                                        │
│  GetMyProfileUseCaseImpl.execute()                     │
│  - 입력값 검증                                          │
│  - Repository 호출                                     │
└────────────────────────────────────────────────────────┘
     ↓
┌────────────────────────────────────────────────────────┐
│  4. Repository (Data Layer)                            │
│                                                        │
│  UserRepositoryImpl.getMyProfile()                     │
│  - DataSource 호출                                     │
│  - DTO → Entity 변환 (Mapper)                          │
└────────────────────────────────────────────────────────┘
     ↓
┌────────────────────────────────────────────────────────┐
│  5. DataSource (API 호출)                              │
│                                                        │
│  UserRemoteDataSource.getMyProfile()                   │
│  - AuthenticatedHttpClient로 API 호출                   │
│  - Zod로 응답 검증                                      │
│  - DTO 반환                                            │
└────────────────────────────────────────────────────────┘
     ↓
┌────────────────────────────────────────────────────────┐
│  6. HTTP Client Stack                                  │
│                                                        │
│  AuthenticatedHttpClient → FetchHttpClient             │
│  - Authorization 헤더 자동 추가                         │
│  - fetch API로 HTTP GET 요청                           │
│  - 401 시 토큰 갱신                                     │
└────────────────────────────────────────────────────────┘
     ↓
┌────────────────────────────────────────────────────────┐
│  7. External API                                       │
│                                                        │
│  GET /api/user/profile                                 │
│  Authorization: Bearer <token>                         │
│  - JSON 응답 반환                                       │
└────────────────────────────────────────────────────────┘
     ↓ (응답이 역순으로 올라감)
┌────────────────────────────────────────────────────────┐
│  8. 서버 응답 처리                                      │
│                                                        │
│  DataSource → Repository → UseCase → Page              │
│  - DTO 검증 (Zod)                                      │
│  - DTO → Entity 변환                                   │
│  - QueryClient에 캐시 저장                              │
│  - HydrationBoundary로 클라이언트에 전달                │
└────────────────────────────────────────────────────────┘
     ↓
┌────────────────────────────────────────────────────────┐
│  9. Client Component (Hydration)                       │
│                                                        │
│  UserProfileView                                       │
│  - 서버에서 가져온 데이터 사용                           │
│  - 추가 fetch 없이 바로 렌더링                          │
│  - Suspense로 로딩 처리                                │
└────────────────────────────────────────────────────────┘
     ↓
┌────────────────────────────────────────────────────────┐
│  10. Section (Client-side Re-fetch)                    │
│                                                        │
│  UserProfileSection                                    │
│  - Client Container 사용                               │
│  - useGetMyProfile() 훅 호출                           │
│  - 캐시된 데이터 사용 (또는 stale 시 재검증)             │
└────────────────────────────────────────────────────────┘
     ↓
🎉 사용자에게 프로필 표시
```

### 클라이언트 사이드 데이터 흐름 (Section에서 fetch)

```
📱 사용자가 버튼 클릭 (클라이언트 상호작용)
     ↓
┌────────────────────────────────────────────────────────┐
│  1. Section Component                                  │
│                                                        │
│  UserProfileSection                                    │
│  - useGetMyProfile() 훅 호출                           │
└────────────────────────────────────────────────────────┘
     ↓
┌────────────────────────────────────────────────────────┐
│  2. Client Hook                                        │
│                                                        │
│  useGetMyProfile()                                     │
│  - Client Container 가져오기                           │
│  - useQuery로 데이터 요청                              │
└────────────────────────────────────────────────────────┘
     ↓
┌────────────────────────────────────────────────────────┐
│  3. Client Container (Singleton)                       │
│                                                        │
│  getAuthClientContainer()                              │
│  - 이미 생성된 인스턴스 재사용                          │
│  - ClientSessionManager 사용 (localStorage)            │
│  - ClientTokenProvider 사용                            │
└────────────────────────────────────────────────────────┘
     ↓
(나머지는 서버 흐름과 동일: UseCase → Repository → DataSource → HTTP)
     ↓
🎉 UI 업데이트 (React 리렌더링)
```

---

## Understanding Dependency Injection

### DI가 없다면? (안티패턴)

```typescript
// ❌ 나쁜 예: 직접 객체 생성
export class GetMyProfileUseCase {
  async execute() {
    // 문제 1: HTTP Client를 직접 생성
    const httpClient = new FetchHttpClient();

    // 문제 2: DataSource를 직접 생성
    const dataSource = new UserRemoteDataSource(httpClient);

    // 문제 3: Repository를 직접 생성
    const repository = new UserRepositoryImpl(dataSource);

    // 문제 4: Repository 호출
    return repository.getMyProfile();
  }
}

/**
 * 이렇게 하면 안 되는 이유:
 *
 * 1. 테스트하기 어려움
 *    - 가짜 객체를 넣을 방법이 없음
 *    - 실제 API를 호출해야만 테스트 가능
 *
 * 2. 코드 변경이 어려움
 *    - fetch를 axios로 바꾸려면?
 *    - 모든 Use Case를 수정해야 함
 *
 * 3. 서버/클라이언트 환경 구분 불가
 *    - 서버에서 localStorage 사용? 에러!
 *    - 클라이언트에서 cookies() 사용? 에러!
 *
 * 4. 객체 생성 비용
 *    - 매번 새로운 객체 생성 (메모리 낭비)
 *
 * 5. 의존성이 숨겨짐
 *    - GetMyProfileUseCase가 무엇을 필요로 하는지 불명확
 */
```

### DI 사용 (올바른 방법)

```typescript
// ✅ 좋은 예: 의존성 주입
export class GetMyProfileUseCaseImpl implements GetMyProfileUseCase {
  /**
   * 생성자에서 의존성을 받습니다 (Constructor Injection)
   *
   * 장점:
   * 1. 의존성이 명확함 (타입으로 표현)
   * 2. 테스트할 때 가짜 객체 주입 가능
   * 3. 객체 생성 책임이 외부로 이동
   * 4. 환경별 구현체 자동 선택
   */
  constructor(
    private readonly userRepository: UserRepository,
    private readonly sessionManager: SessionManager
  ) {}

  async execute(): Promise<User> {
    // 1. 세션 확인 (이미 주입된 SessionManager 사용)
    const token = await this.sessionManager.getToken();

    if (!token) {
      throw new AuthError('Authentication required', 'UNAUTHORIZED');
    }

    // 2. Repository 호출 (이미 주입된 Repository 사용)
    return this.userRepository.getMyProfile();
  }
}

/**
 * 사용 예시 (Server Container에서)
 */
// 1. 서버 환경에 맞는 구현체 생성
const sessionManager = new ServerSessionManager(); // cookies 사용
const tokenProvider = new ServerTokenProvider(sessionManager);
const httpClient = new AuthenticatedHttpClient(/*...*/);
const dataSource = new UserRemoteDataSource(httpClient);
const repository = new UserRepositoryImpl(dataSource);

// 2. Use Case 생성 시 주입
const getMyProfile = new GetMyProfileUseCaseImpl(repository, sessionManager);

// 3. 재사용
const user1 = await getMyProfile.execute();
const user2 = await getMyProfile.execute();
```

### 서버/클라이언트 Container 비교

```typescript
// 🖥️ SERVER CONTAINER (매 요청마다 새로 생성)
export function createAuthServerContainer(): AuthServerContainer {
  // 서버 전용 구현체
  const sessionManager = new ServerSessionManager(); // cookies()
  const tokenProvider = new ServerTokenProvider(sessionManager);

  const httpClient = new AuthenticatedHttpClient(
    new FetchHttpClient(),
    tokenProvider,
    sessionManager,
    new RefreshTokenService(sessionManager)
  );

  const authDataSource = new AuthRemoteDataSource(httpClient);
  const authRepository = new AuthRepositoryImpl(authDataSource);

  return {
    getLoginWithOAuth: () =>
      new LoginWithOAuthUseCaseImpl(authRepository, sessionManager),
    // ... 다른 Use Cases
  };
}

// 사용 (매번 호출)
const container1 = createAuthServerContainer(); // 새 인스턴스
const container2 = createAuthServerContainer(); // 또 다른 새 인스턴스


// 📱 CLIENT CONTAINER (Lazy Singleton)
let clientContainerInstance: AuthClientContainer | null = null;

export function getAuthClientContainer(): AuthClientContainer {
  if (!clientContainerInstance) {
    // 클라이언트 전용 구현체
    const sessionManager = new ClientSessionManager(); // localStorage
    const tokenProvider = new ClientTokenProvider(sessionManager);

    const httpClient = new AuthenticatedHttpClient(
      new FetchHttpClient(),
      tokenProvider,
      sessionManager
    );

    const authDataSource = new AuthRemoteDataSource(httpClient);
    const authRepository = new AuthRepositoryImpl(authDataSource);

    clientContainerInstance = {
      getLoginWithOAuth: () =>
        new LoginWithOAuthUseCaseImpl(authRepository, sessionManager),
      // ... 다른 Use Cases
    };
  }

  return clientContainerInstance;
}

// 사용 (항상 같은 인스턴스)
const container1 = getAuthClientContainer(); // 새 인스턴스 생성
const container2 = getAuthClientContainer(); // 같은 인스턴스 재사용
```

### 왜 서버는 Per-Request, 클라이언트는 Singleton?

```typescript
// 🖥️ SERVER (Per-Request가 필요한 이유)
async function handler(request: Request) {
  // 각 요청마다 다른 사용자!
  // User A: token-A
  // User B: token-B

  // 만약 Singleton이라면?
  // User A의 토큰이 User B에게 노출될 수 있음! (보안 문제)

  // 따라서 매 요청마다 새로운 Container 생성
  const container = createAuthServerContainer();
  const useCase = container.getLoginWithOAuth();

  // 이 useCase는 이 요청에만 사용됨
  return useCase.execute({...});
}


// 📱 CLIENT (Singleton이 효율적인 이유)
function ProfilePage() {
  // 브라우저에서는 사용자가 한 명!
  // 매번 새로 생성할 필요 없음

  // Singleton으로 메모리 절약
  const container = getAuthClientContainer(); // 재사용
  const useCase = container.getGetMyProfile();

  return useCase.execute();
}
```

### 테스트에서 DI 활용

```typescript
// domains/auth/domain/usecases/login-with-oauth-use-case.test.ts

describe('LoginWithOAuthUseCase', () => {
  it('should login successfully', async () => {
    // 1. 가짜(Mock) Repository 생성
    const mockRepository: AuthRepository = {
      loginWithGoogle: jest.fn().mockResolvedValue({
        user: {
          id: '1',
          name: 'Test User',
          email: 'test@example.com',
          // ...
        },
        session: {
          accessToken: 'token',
          refreshToken: 'refresh',
          expiresIn: 3600,
          tokenType: 'Bearer',
        },
      }),
      // 다른 메서드는 구현 안 해도 됨
      loginWithKakao: jest.fn(),
      logout: jest.fn(),
      refreshAccessToken: jest.fn(),
      getOAuthAuthorizeUrl: jest.fn(),
    };

    // 2. 가짜 SessionManager 생성
    const mockSessionManager: SessionManager = {
      getToken: jest.fn(),
      setToken: jest.fn(),
      getRefreshToken: jest.fn(),
      setRefreshToken: jest.fn(),
      clearSession: jest.fn(),
    };

    // 3. Use Case에 Mock 주입
    const useCase = new LoginWithOAuthUseCaseImpl(
      mockRepository,
      mockSessionManager
    );

    // 4. 실행
    const result = await useCase.execute({
      provider: 'google',
      code: 'auth-code',
      redirectUri: 'http://localhost:3000/callback',
    });

    // 5. 검증
    expect(result.user.name).toBe('Test User');
    expect(mockRepository.loginWithGoogle).toHaveBeenCalledWith({
      code: 'auth-code',
      redirectUri: 'http://localhost:3000/callback',
      deviceId: expect.any(String),
    });
    expect(mockSessionManager.setToken).toHaveBeenCalledWith('token');
  });

  it('should throw error for invalid provider', async () => {
    const mockRepository = {} as AuthRepository;
    const mockSessionManager = {} as SessionManager;
    const useCase = new LoginWithOAuthUseCaseImpl(
      mockRepository,
      mockSessionManager
    );

    await expect(
      useCase.execute({
        provider: 'invalid' as OAuthProvider,
        code: 'code',
        redirectUri: 'uri',
      })
    ).rejects.toThrow('Unsupported OAuth provider');
  });
});
```

---

## State Management Strategy

이 프로젝트는 **세 가지 상태 관리 전략**을 사용합니다:

### 1. TanStack Query - 서버 상태 관리

**서버 상태**란? API에서 가져온 데이터 (사용자 프로필, 급식소 목록 등)

```typescript
// domains/user/presentation/hooks/use-user-queries.ts
import { useSuspenseQuery } from '@tanstack/react-query';
import { getAuthClientContainer } from '@/domains/auth/di';

/**
 * TanStack Query 사용법
 *
 * useSuspenseQuery는:
 * 1. 자동 로딩 처리 (Suspense와 연동)
 * 2. 자동 캐싱 (같은 데이터 다시 안 가져옴)
 * 3. 자동 재검증 (데이터가 오래되면 다시 가져옴)
 * 4. 에러 처리 (Error Boundary와 연동)
 */
export function useGetMyProfile() {
  const container = getAuthClientContainer();
  const getMyProfile = container.getGetMyProfile();

  return useSuspenseQuery({
    // Query Key: 캐시 식별자
    queryKey: ['user', 'profile'],

    // Query Function: 데이터를 가져오는 비동기 함수
    queryFn: () => getMyProfile.execute(),

    // Stale Time: 데이터가 "신선한" 시간 (5분)
    staleTime: 5 * 60 * 1000,

    // GC Time: 캐시 보관 시간 (10분)
    gcTime: 10 * 60 * 1000,
  });
}
```

### 2. Server Actions - 서버 뮤테이션

**Server Actions**는 Next.js 15+의 새로운 패턴입니다:

```typescript
// domains/cafeteria/presentation/actions/cafeteria-actions.ts
'use server';

import { createCafeteriaServerContainer } from '@/domains/cafeteria/di';

/**
 * Server Action: 리뷰 작성
 *
 * Server Actions는:
 * 1. 서버에서만 실행 ('use server')
 * 2. 클라이언트에서 직접 호출 가능
 * 3. Form과 자연스럽게 통합
 * 4. 타입 안정성 보장
 */
export async function createReviewAction(params: {
  cafeteriaId: string;
  rating: number;
  content: string;
}) {
  try {
    // Server Container 사용
    const container = createCafeteriaServerContainer();
    const createReview = container.getCreateReview();

    const result = await createReview.execute(params);

    // revalidatePath로 캐시 무효화
    revalidatePath(`/cafeterias/${params.cafeteriaId}`);

    return { success: true, data: result };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create review',
    };
  }
}

// 클라이언트에서 사용
'use client';
import { createReviewAction } from '@/domains/cafeteria';

function ReviewForm({ cafeteriaId }: { cafeteriaId: string }) {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const result = await createReviewAction({
        cafeteriaId,
        rating: Number(formData.get('rating')),
        content: formData.get('content') as string,
      });

      if (result.success) {
        toast.success('리뷰가 작성되었습니다!');
      } else {
        toast.error(result.error);
      }
    });
  };

  return (
    <form action={handleSubmit}>
      {/* Form fields */}
      <button type="submit" disabled={isPending}>
        {isPending ? '작성 중...' : '리뷰 작성'}
      </button>
    </form>
  );
}
```

### 3. Zustand - 클라이언트 상태 관리

**클라이언트 상태**란? 앱 내부에서 관리하는 데이터 (로그인 상태, UI 상태 등)

```typescript
// domains/auth/presentation/stores/auth-store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Zustand 인증 스토어
 *
 * Zustand는:
 * 1. 간단한 API (Redux보다 훨씬 간단)
 * 2. TypeScript 지원 (타입 안정성)
 * 3. 미들웨어 (persist로 localStorage 자동 저장)
 */
interface AuthState {
  // 상태
  user: User | null;
  isAuthenticated: boolean;

  // 액션
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // 초기 상태
      user: null,
      isAuthenticated: false,

      // 액션
      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
        }),

      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: 'auth-storage', // localStorage 키 이름
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

/**
 * 사용 예시
 */
'use client';
function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore();

  if (!isAuthenticated) {
    return <Link href="/auth/sign-in">로그인</Link>;
  }

  return (
    <div>
      <span>안녕하세요, {user?.name}님</span>
      <button onClick={logout}>로그아웃</button>
    </div>
  );
}
```

### 언제 무엇을 사용할까?

| 상태 종류 | 라이브러리 | 예시 | 이유 |
|----------|-----------|------|------|
| **서버 상태 (Query)** | TanStack Query | 사용자 프로필, 급식소 목록, 리뷰 목록 | 캐싱, 재검증, Suspense 지원 |
| **서버 뮤테이션** | Server Actions | 리뷰 작성, 좋아요, 댓글 작성 | 서버 실행, 타입 안정성, revalidatePath |
| **클라이언트 상태** | Zustand | 로그인 상태, UI 테마, 사이드바 열림 | 간단한 API, 지속성, 빠른 접근 |
| **URL 상태** | Next.js Router | 현재 페이지, 검색 쿼리, 필터 | SEO, 공유 가능한 링크 |
| **로컬 상태** | useState | 폼 입력값, 모달 열림/닫힘 | 컴포넌트 내부에서만 사용 |

---

## Step-by-Step: Reading the Codebase

코드베이스를 처음 볼 때 어떻게 읽어야 할까요?

### 읽기 순서 (추천)

#### 1단계: 프로젝트 구조 파악

```
1. CLAUDE.md 읽기
   └─ 전체 규칙과 가이드라인 이해

2. package.json 확인
   └─ 사용하는 라이브러리와 스크립트 파악

3. 폴더 구조 둘러보기
   ├─ apps/web/src/domains/  (도메인들)
   ├─ apps/web/app/           (Next.js 라우트)
   └─ packages/               (공유 패키지)
```

#### 2단계: 도메인 엔티티 (Domain)

```
domains/[domain]/domain/entities/
├─ user.entity.ts      # ← 사용자가 어떻게 표현되는지
├─ session.entity.ts   # ← 세션 객체
└─ ...
```

**왜?** 앱의 핵심 개념을 이해

#### 3단계: 유스케이스 (Domain)

```
domains/[domain]/domain/usecases/
├─ login-with-oauth-use-case.ts
├─ get-my-profile-use-case.ts
└─ ...
```

**왜?** 앱이 "무엇을 할 수 있는지" 파악

#### 4단계: UI 컴포넌트 (Presentation)

```
domains/[domain]/presentation/ui/
├─ views/          # 페이지 레벨
├─ sections/       # 섹션 (데이터 fetch)
└─ components/     # 재사용 가능 컴포넌트
```

**왜?** 사용자가 보는 화면부터 시작하면 이해하기 쉬움

#### 5단계: 데이터 흐름 추적

특정 기능을 선택해서 전체 흐름을 추적해봅시다.

**예시: "내 프로필 보기" 기능**

```
1. app/(auth)/profile/page.tsx (Page)
   ↓ getQueryClient().prefetchQuery()

2. Server Container
   ↓ createUserServerContainer()

3. GetMyProfileUseCase
   ↓ execute()

4. UserRepositoryImpl
   ↓ getMyProfile()

5. UserRemoteDataSource
   ↓ API 호출

6. API 응답
   ↓ DTO → Entity 변환

7. UserProfileView (Client Component)
   ↓ 렌더링
```

### 코드 읽기 팁

#### 팁 1: 파일 이름으로 역할 파악

```
login-with-oauth-use-case.ts     → Use Case (비즈니스 로직)
auth-repository.ts                → Interface (계약서)
auth-repository-impl.ts           → Implementation (구현체)
user-dto.ts                       → DTO (API 응답 형식)
user-mapper.ts                    → Mapper (변환기)
auth-remote-data-source.ts        → Data Source (API 호출)
use-auth-queries.ts               → Custom Hook (React)
auth-actions.ts                   → Server Actions
```

#### 팁 2: 폴더 구조로 레이어 파악

```
domain/        → 프레임워크 독립적, 순수 TypeScript
data/          → API 통신, DTO, Mapper
infrastructure → 외부 서비스 연동
presentation/  → React 컴포넌트, 훅, Server Actions
di/            → 의존성 주입 컨테이너
```

#### 팁 3: Import문 확인

```typescript
// ✅ Good: Domain은 Domain만 import
import { User } from '@/domains/auth/domain/entities/user.entity';
import { AuthRepository } from '@/domains/auth/domain/repositories/auth-repository';

// ❌ Bad: Domain이 React를 import하면 안 됨!
import { useState } from 'react'; // ← Domain에서는 안 됨

// ✅ Good: Presentation은 모든 레이어 import 가능
import { User } from '@/domains/auth/domain/entities/user.entity';
import { useGetMyProfile } from '@/domains/user/presentation/hooks/use-user-queries';
import { getAuthClientContainer } from '@/domains/auth/di';
```

#### 팁 4: 서버/클라이언트 구분

```typescript
// 🖥️ SERVER ONLY
'use server'; // ← 서버 액션
import { cookies } from 'next/headers';
import { createAuthServerContainer } from '@/domains/auth/di/auth-server-container';

// 📱 CLIENT ONLY
'use client'; // ← 클라이언트 컴포넌트
import { useGetMyProfile } from '@/domains/user/presentation/hooks/use-user-queries';
import { getAuthClientContainer } from '@/domains/auth/di/auth-client-container';

// 🖥️📱 SHARED (Server & Client)
// 'use server'도 'use client'도 없음
import { User } from '@/domains/auth/domain/entities/user.entity';
```

---

## Step-by-Step: Adding a New Feature

실제로 새로운 기능을 추가하는 과정을 따라해봅시다.

### 예제: "알림 읽음 처리" 기능 추가하기

현재 알림 도메인에서 "알림 읽음 처리" 기능을 추가한다고 가정합니다.

#### Step 1: 도메인 엔티티 확인/추가

```typescript
// domains/notification/domain/entities/notification.entity.ts

/**
 * 1단계: 엔티티 확인
 *
 * 기존 Notification 엔티티에 isRead 필드가 있는지 확인
 * 없다면 추가
 */
export interface Notification {
  id: string;
  userId: string;
  title: string;
  content: string;
  type: NotificationType;
  isRead: boolean;           // ← 읽음 여부 (추가)
  createdAt: Date;
  readAt: Date | null;       // ← 읽은 시각 (추가)
}

export type NotificationType = 'system' | 'benefit' | 'cafeteria';
```

#### Step 2: 레포지토리 인터페이스에 메서드 추가

```typescript
// domains/notification/domain/repositories/notification-repository.ts

/**
 * 2단계: 레포지토리 인터페이스
 *
 * "알림 읽음 처리" 메서드 추가
 */
export interface NotificationRepository {
  // 기존 메서드들...
  getNotifications(userId: string): Promise<Notification[]>;
  getUnreadCount(userId: string): Promise<number>;

  // 새로 추가
  /**
   * 알림을 읽음 처리
   */
  markAsRead(notificationId: string): Promise<void>;

  /**
   * 모든 알림 읽음 처리
   */
  markAllAsRead(userId: string): Promise<void>;
}
```

#### Step 3: 유스케이스 생성

```typescript
// domains/notification/domain/usecases/mark-notification-as-read-use-case.ts

/**
 * 3단계: 유스케이스 생성
 */

// 인터페이스
export interface MarkNotificationAsReadUseCase {
  execute(notificationId: string): Promise<void>;
}

// 구현체
export class MarkNotificationAsReadUseCaseImpl
  implements MarkNotificationAsReadUseCase
{
  constructor(
    private readonly notificationRepository: NotificationRepository
  ) {}

  async execute(notificationId: string): Promise<void> {
    // 1. 입력값 검증
    if (!notificationId) {
      throw new NotificationError('Notification ID is required', 'INVALID_INPUT');
    }

    // 2. Repository 호출
    await this.notificationRepository.markAsRead(notificationId);
  }
}
```

```typescript
// domains/notification/domain/usecases/mark-all-notifications-as-read-use-case.ts

/**
 * 모든 알림 읽음 처리 Use Case
 */
export interface MarkAllNotificationsAsReadUseCase {
  execute(userId: string): Promise<void>;
}

export class MarkAllNotificationsAsReadUseCaseImpl
  implements MarkAllNotificationsAsReadUseCase
{
  constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly sessionManager: SessionManager
  ) {}

  async execute(userId: string): Promise<void> {
    // 1. 권한 확인
    const currentUser = await this.sessionManager.getToken();
    if (!currentUser) {
      throw new AuthError('Authentication required', 'UNAUTHORIZED');
    }

    // 2. Repository 호출
    await this.notificationRepository.markAllAsRead(userId);
  }
}
```

#### Step 4: DTO 업데이트

```typescript
// domains/notification/data/dto/notification-dto.ts

/**
 * 4단계: DTO 업데이트
 *
 * API 응답에 is_read, read_at 필드 추가
 */
import { z } from 'zod';

export const NotificationDTOSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  title: z.string(),
  content: z.string(),
  type: z.enum(['system', 'benefit', 'cafeteria']),
  is_read: z.boolean(),          // ← 추가
  created_at: z.string(),
  read_at: z.string().nullable(), // ← 추가
});

export type NotificationDTO = z.infer<typeof NotificationDTOSchema>;
```

#### Step 5: Mapper 업데이트

```typescript
// domains/notification/data/mappers/notification-mapper.ts

/**
 * 5단계: Mapper 업데이트
 */
export class NotificationMapper {
  static toDomain(dto: NotificationDTO): Notification {
    return {
      id: dto.id,
      userId: dto.user_id,
      title: dto.title,
      content: dto.content,
      type: dto.type,
      isRead: dto.is_read,                          // ← 추가
      createdAt: new Date(dto.created_at),
      readAt: dto.read_at ? new Date(dto.read_at) : null, // ← 추가
    };
  }

  static toDomainList(dtos: NotificationDTO[]): Notification[] {
    return dtos.map((dto) => this.toDomain(dto));
  }
}
```

#### Step 6: Data Source에 메서드 추가

```typescript
// domains/notification/data/data-sources/notification-remote-data-source.ts

/**
 * 6단계: Data Source 메서드 추가
 */
export class NotificationRemoteDataSource {
  constructor(private readonly httpClient: HttpClient) {}

  // 기존 메서드들...

  /**
   * 알림 읽음 처리
   */
  async markAsRead(notificationId: string): Promise<void> {
    await this.httpClient.patch(
      `/api/notifications/${notificationId}/read`,
      {}
    );
  }

  /**
   * 모든 알림 읽음 처리
   */
  async markAllAsRead(userId: string): Promise<void> {
    await this.httpClient.post('/api/notifications/read-all', {
      user_id: userId,
    });
  }
}
```

#### Step 7: Repository 구현체 업데이트

```typescript
// domains/notification/data/repositories/notification-repository-impl.ts

/**
 * 7단계: Repository 구현체 업데이트
 */
export class NotificationRepositoryImpl implements NotificationRepository {
  constructor(
    private readonly dataSource: NotificationRemoteDataSource
  ) {}

  // 기존 메서드들...

  async markAsRead(notificationId: string): Promise<void> {
    await this.dataSource.markAsRead(notificationId);
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.dataSource.markAllAsRead(userId);
  }
}
```

#### Step 8: DI Container에 등록

```typescript
// domains/notification/di/notification-server-container.ts

/**
 * 8단계: Server Container 업데이트
 */
export interface NotificationServerContainer {
  getGetNotifications: () => GetNotificationsUseCase;
  getMarkAsRead: () => MarkNotificationAsReadUseCase;           // ← 추가
  getMarkAllAsRead: () => MarkAllNotificationsAsReadUseCase;    // ← 추가
}

export function createNotificationServerContainer(
  baseUrl?: string
): NotificationServerContainer {
  // Infrastructure
  const sessionManager = new ServerSessionManager();
  const tokenProvider = new ServerTokenProvider(sessionManager);
  const httpClient = new AuthenticatedHttpClient(/*...*/);

  // Data
  const dataSource = new NotificationRemoteDataSource(httpClient);
  const repository = new NotificationRepositoryImpl(dataSource);

  return {
    getGetNotifications: () =>
      new GetNotificationsUseCaseImpl(repository),

    // 새로 추가
    getMarkAsRead: () =>
      new MarkNotificationAsReadUseCaseImpl(repository),

    getMarkAllAsRead: () =>
      new MarkAllNotificationsAsReadUseCaseImpl(repository, sessionManager),
  };
}
```

```typescript
// domains/notification/di/notification-client-container.ts

/**
 * Client Container도 동일하게 업데이트
 */
export interface NotificationClientContainer {
  getGetNotifications: () => GetNotificationsUseCase;
  getMarkAsRead: () => MarkNotificationAsReadUseCase;
  getMarkAllAsRead: () => MarkAllNotificationsAsReadUseCase;
}

// 구현은 Server Container와 유사하되, Client 전용 구현체 사용
```

#### Step 9: Server Action 생성

```typescript
// domains/notification/presentation/actions/notification-actions.ts

/**
 * 9단계: Server Action 생성
 */
'use server';

import { createNotificationServerContainer } from '@/domains/notification/di';
import { revalidatePath } from 'next/cache';

/**
 * Server Action: 알림 읽음 처리
 */
export async function markNotificationAsReadAction(notificationId: string) {
  try {
    const container = createNotificationServerContainer();
    const markAsRead = container.getMarkAsRead();

    await markAsRead.execute(notificationId);

    // 알림 목록 캐시 무효화
    revalidatePath('/notifications');

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to mark as read',
    };
  }
}

/**
 * Server Action: 모든 알림 읽음 처리
 */
export async function markAllNotificationsAsReadAction(userId: string) {
  try {
    const container = createNotificationServerContainer();
    const markAllAsRead = container.getMarkAllAsRead();

    await markAllAsRead.execute(userId);

    revalidatePath('/notifications');

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to mark all as read',
    };
  }
}
```

#### Step 10: React Hook 생성

```typescript
// domains/notification/presentation/hooks/use-notification-mutations.ts

/**
 * 10단계: React Hook 생성 (Mutation)
 */
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  markNotificationAsReadAction,
  markAllNotificationsAsReadAction,
} from '../actions/notification-actions';

/**
 * 알림 읽음 처리 Mutation
 */
export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) =>
      markNotificationAsReadAction(notificationId),

    onSuccess: () => {
      // 성공 시 알림 목록 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: ['notifications'],
      });
    },
  });
}

/**
 * 모든 알림 읽음 처리 Mutation
 */
export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) =>
      markAllNotificationsAsReadAction(userId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['notifications'],
      });
    },
  });
}
```

#### Step 11: UI 컴포넌트 업데이트

```typescript
// domains/notification/presentation/ui/sections/notification-list-section.tsx

/**
 * 11단계: Section 컴포넌트 업데이트
 */
'use client';

import { useGetNotifications } from '../../hooks/use-notification-queries';
import {
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead,
} from '../../hooks/use-notification-mutations';

export function NotificationListSection({ userId }: { userId: string }) {
  const { data: notifications } = useGetNotifications(userId);
  const { mutate: markAsRead } = useMarkNotificationAsRead();
  const { mutate: markAllAsRead, isPending } = useMarkAllNotificationsAsRead();

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAsRead = (notificationId: string) => {
    markAsRead(notificationId, {
      onSuccess: () => {
        toast.success('알림을 읽음 처리했습니다');
      },
    });
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead(userId, {
      onSuccess: () => {
        toast.success('모든 알림을 읽음 처리했습니다');
      },
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">
          알림 ({unreadCount}개 읽지 않음)
        </h2>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            disabled={isPending}
            className="text-sm text-blue-600"
          >
            {isPending ? '처리 중...' : '모두 읽음'}
          </button>
        )}
      </div>

      <div className="space-y-2">
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onMarkAsRead={handleMarkAsRead}
          />
        ))}
      </div>
    </div>
  );
}
```

```typescript
// domains/notification/presentation/ui/components/notification-item.tsx

/**
 * Component: 알림 아이템
 */
interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
}

export function NotificationItem({
  notification,
  onMarkAsRead,
}: NotificationItemProps) {
  return (
    <div
      className={`p-4 rounded-lg ${
        notification.isRead ? 'bg-gray-50' : 'bg-blue-50'
      }`}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="font-semibold">{notification.title}</h3>
          <p className="text-sm text-gray-600 mt-1">{notification.content}</p>
          <p className="text-xs text-gray-400 mt-2">
            {notification.createdAt.toLocaleString()}
          </p>
        </div>

        {!notification.isRead && (
          <button
            onClick={() => onMarkAsRead(notification.id)}
            className="text-xs text-blue-600 ml-4"
          >
            읽음
          </button>
        )}
      </div>
    </div>
  );
}
```

#### Step 12: index.ts에서 Public API 노출

```typescript
// domains/notification/index.ts

/**
 * 12단계: Public API 노출
 *
 * Server Actions만 export (보안)
 */
export {
  markNotificationAsReadAction,
  markAllNotificationsAsReadAction,
} from './presentation/actions/notification-actions';

// 타입은 export 가능
export type { Notification } from './domain/entities/notification.entity';
```

### 체크리스트 ✅

새 기능을 추가할 때 모든 단계를 거쳤는지 확인하세요:

- [ ] 1. Domain Entity 확인/추가
- [ ] 2. Repository Interface에 메서드 추가
- [ ] 3. Use Case 생성 (Interface + Impl)
- [ ] 4. DTO 업데이트 (Zod 스키마)
- [ ] 5. Mapper 업데이트
- [ ] 6. Data Source 메서드 추가
- [ ] 7. Repository Impl 업데이트
- [ ] 8. DI Container 등록 (Server + Client)
- [ ] 9. Server Action 생성
- [ ] 10. React Hook 생성 (Query/Mutation)
- [ ] 11. UI Component 업데이트
- [ ] 12. Public API 노출 (index.ts)
- [ ] 13. 타입 체크 (`pnpm check-types`)
- [ ] 14. 빌드 테스트 (`pnpm build`)

---

## Common Patterns Explained

자주 사용되는 패턴들을 이해해봅시다.

### 1. Repository Pattern

**목적**: 데이터 접근 로직을 추상화

```typescript
// ❌ Without Repository Pattern
'use client';
function NotificationList() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // 컴포넌트가 API 구현을 직접 알고 있음
    fetch('/api/notifications')
      .then((res) => res.json())
      .then((data) => {
        // 데이터 변환 로직도 컴포넌트에
        const transformed = data.results.map((n) => ({
          id: n.id,
          title: n.title,
          isRead: n.is_read, // snake_case 변환
        }));
        setNotifications(transformed);
      });
  }, []);
}

// ✅ With Repository Pattern
'use client';
function NotificationList() {
  // 컴포넌트는 "어디서" 데이터를 가져오는지 몰라도 됨
  const { data: notifications } = useGetNotifications();

  return <NotificationListView notifications={notifications} />;
}
```

**장점**:
- UI와 데이터 소스 분리
- API 변경 시 Repository만 수정
- 테스트할 때 가짜 Repository 사용 가능

### 2. Use Case Pattern

**목적**: 비즈니스 로직을 캡슐화

```typescript
// ❌ Without Use Case
'use client';
function MarkAllAsReadButton({ userId }) {
  const onClick = async () => {
    // 비즈니스 로직이 컴포넌트에
    if (!isAuthenticated) {
      alert('로그인이 필요합니다');
      return;
    }

    if (notifications.length === 0) {
      alert('읽을 알림이 없습니다');
      return;
    }

    await fetch('/api/notifications/read-all', {
      method: 'POST',
      body: JSON.stringify({ user_id: userId }),
    });
  };
}

// ✅ With Use Case
class MarkAllNotificationsAsReadUseCaseImpl {
  async execute(userId: string) {
    // 1. 인증 확인
    if (!this.sessionManager.getToken()) {
      throw new AuthError('Authentication required');
    }

    // 2. 알림 확인
    const notifications = await this.repository.getNotifications(userId);
    if (notifications.length === 0) {
      return; // Early return
    }

    // 3. 읽음 처리
    await this.repository.markAllAsRead(userId);
  }
}

'use client';
function MarkAllAsReadButton({ userId }) {
  const { mutate } = useMarkAllNotificationsAsRead();

  const onClick = () => {
    mutate(userId); // 간단!
  };
}
```

**장점**:
- 비즈니스 로직이 한 곳에
- UI와 로직 분리
- 테스트하기 쉬움
- 재사용 가능

### 3. DTO + Mapper Pattern

**목적**: API 형식과 앱 내부 형식 분리

```typescript
// API 응답 (DTO) - snake_case
{
  "id": "123",
  "title": "새로운 혜택이 있습니다",
  "is_read": false,
  "created_at": "2024-01-15T10:30:00Z",
  "read_at": null
}

// ↓ Mapper

// 앱 내부 (Entity) - camelCase
{
  id: "123",
  title: "새로운 혜택이 있습니다",
  isRead: false,
  createdAt: new Date("2024-01-15T10:30:00Z"),
  readAt: null
}
```

**왜 필요한가?**

```typescript
// ❌ Without Mapper - API 형식 직접 사용
function NotificationItem({ notification }) {
  return (
    <div>
      <h3>{notification.title}</h3>
      {/* snake_case를 그대로 사용 - 일관성 없음 */}
      <p>{notification.created_at}</p>
      {notification.is_read ? '읽음' : '읽지 않음'}
    </div>
  );
}

// ✅ With Mapper - 일관된 형식
function NotificationItem({ notification }: { notification: Notification }) {
  return (
    <div>
      <h3>{notification.title}</h3>
      {/* camelCase로 일관성 있음 */}
      <p>{notification.createdAt.toLocaleString()}</p>
      {notification.isRead ? '읽음' : '읽지 않음'}
    </div>
  );
}
```

### 4. Decorator Pattern (HTTP Client)

**목적**: 기능을 점진적으로 추가

```typescript
// Base HTTP Client
class FetchHttpClient implements HttpClient {
  async get(url: string) {
    const response = await fetch(url);
    return response.json();
  }
}

// Decorator: 인증 기능 추가
class AuthenticatedHttpClient implements HttpClient {
  constructor(
    private baseClient: HttpClient,
    private tokenProvider: TokenProvider
  ) {}

  async get(url: string) {
    // 1. 토큰 가져오기
    const token = await this.tokenProvider.getToken();

    // 2. 헤더 추가
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    // 3. Base Client 호출 (기능 확장)
    return this.baseClient.get(url, { headers });
  }
}

// 사용
const baseClient = new FetchHttpClient();
const authedClient = new AuthenticatedHttpClient(baseClient, tokenProvider);

// authedClient.get()은 자동으로 토큰 추가!
```

**장점**:
- 기능을 점진적으로 추가
- 기존 코드 수정 없음
- 여러 Decorator 조합 가능 (Logging, Retry, etc.)

### 5. Factory Pattern (DI Container)

**목적**: 복잡한 객체 생성 로직 캡슐화

```typescript
// ❌ Without Factory - 객체 생성이 복잡
function MyComponent() {
  const sessionManager = new ServerSessionManager();
  const tokenProvider = new ServerTokenProvider(sessionManager);
  const baseClient = new FetchHttpClient();
  const httpClient = new AuthenticatedHttpClient(
    baseClient,
    tokenProvider,
    sessionManager
  );
  const dataSource = new AuthRemoteDataSource(httpClient);
  const repository = new AuthRepositoryImpl(dataSource);
  const useCase = new LoginWithOAuthUseCaseImpl(repository, sessionManager);

  // 너무 복잡!
}

// ✅ With Factory - 간단하게 생성
function MyComponent() {
  const container = createAuthServerContainer();
  const useCase = container.getLoginWithOAuth();

  // 깔끔!
}
```

### 6. Server Actions + Optimistic Updates

**목적**: 빠른 UI 반응 + 서버 검증

```typescript
// domains/cafeteria/presentation/actions/cafeteria-actions.ts
'use server';

export async function toggleFavoriteAction(cafeteriaId: string) {
  const container = createCafeteriaServerContainer();
  const toggleFavorite = container.getToggleFavorite();

  await toggleFavorite.execute(cafeteriaId);

  revalidatePath(`/cafeterias/${cafeteriaId}`);
}

// Client Component
'use client';
function FavoriteButton({ cafeteria }: { cafeteria: Cafeteria }) {
  const [isOptimisticFavorite, setIsOptimisticFavorite] = useState(
    cafeteria.isFavorite
  );

  const handleToggle = async () => {
    // 1. Optimistic Update (즉시 UI 반영)
    setIsOptimisticFavorite(!isOptimisticFavorite);

    try {
      // 2. Server Action 호출
      const result = await toggleFavoriteAction(cafeteria.id);

      if (!result.success) {
        // 3. 실패 시 롤백
        setIsOptimisticFavorite(cafeteria.isFavorite);
        toast.error(result.error);
      }
    } catch (error) {
      // 4. 에러 시 롤백
      setIsOptimisticFavorite(cafeteria.isFavorite);
      toast.error('Failed to toggle favorite');
    }
  };

  return (
    <button onClick={handleToggle}>
      {isOptimisticFavorite ? '❤️' : '🤍'}
    </button>
  );
}
```

---

## Best Practices

### 1. 명명 규칙 (Naming Conventions)

```typescript
// Files (kebab-case)
login-with-oauth-use-case.ts        // Use Case
auth-repository.ts                  // Interface
auth-repository-impl.ts             // Implementation
user-dto.ts                         // DTO
user-mapper.ts                      // Mapper
auth-remote-data-source.ts          // Data Source
use-auth-queries.ts                 // Hook
auth-actions.ts                     // Server Actions

// Folders (kebab-case)
domains/auth/
domains/user/
domains/cafeteria/

// Variables (camelCase)
const authRepository: AuthRepository;
const loginUseCase: LoginWithOAuthUseCase;

// Components (PascalCase)
function UserProfileView() {}
function NotificationListSection() {}
function UserAvatar() {}

// Constants (UPPER_CASE)
const AUTH_API_ENDPOINTS = {};
const SESSION_CONFIG = {};
```

### 2. 의존성 방향

```
Presentation → Domain ← Data ← Infrastructure
               ↑
         항상 Domain을 향함
```

```typescript
// ✅ Good: Domain은 아무것도 import 안 함
// domains/auth/domain/usecases/login-with-oauth-use-case.ts
export class LoginWithOAuthUseCaseImpl implements LoginWithOAuthUseCase {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly sessionManager: SessionManager
  ) {}
  // Domain은 순수 TypeScript만!
}

// ❌ Bad: Domain이 React import
// domains/auth/domain/usecases/login-with-oauth-use-case.ts
import { useState } from 'react'; // ← 절대 안 됨!

export class LoginWithOAuthUseCaseImpl {
  // Domain은 프레임워크 독립적이어야 함
}
```

### 3. 서버/클라이언트 분리 (절대 규칙!)

```typescript
// ❌ NEVER DO THIS: 서버에서 Client Container 사용
async function ProfilePage() {
  // ❌ 에러 발생! localStorage는 서버에 없음
  const container = getAuthClientContainer();
  const useCase = container.getGetMyProfile();
}

// ❌ NEVER DO THIS: 클라이언트에서 Server Container 사용
'use client';
function ProfileSection() {
  // ❌ 에러 발생! cookies()는 클라이언트에서 사용 불가
  const container = createAuthServerContainer();
  const useCase = container.getGetMyProfile();
}

// ✅ ALWAYS DO THIS: 서버는 Server Container
async function ProfilePage() {
  const container = createAuthServerContainer(); // ✅ 서버 전용
  const useCase = container.getGetMyProfile();
}

// ✅ ALWAYS DO THIS: 클라이언트는 Client Container
'use client';
function ProfileSection() {
  const container = getAuthClientContainer(); // ✅ 클라이언트 전용
  const useCase = container.getGetMyProfile();
}
```

### 4. 에러 처리

```typescript
// ✅ Good: 도메인별 커스텀 에러 사용
export class LoginWithOAuthUseCaseImpl {
  async execute(params: LoginWithOAuthParams) {
    try {
      return await this.authRepository.loginWithGoogle(params);
    } catch (error) {
      // 1. 도메인 에러로 변환
      if (error instanceof ApiError && error.statusCode === 401) {
        throw new AuthError(
          'Invalid credentials',
          'INVALID_CREDENTIALS',
          401
        );
      }

      // 2. 일반 에러는 래핑
      throw new AuthError(
        'Login failed',
        'OAUTH_ERROR',
        undefined,
        error
      );
    }
  }
}

// ❌ Bad: 에러를 그대로 전파
export class LoginWithOAuthUseCaseImpl {
  async execute(params: LoginWithOAuthParams) {
    return await this.authRepository.loginWithGoogle(params);
    // 에러가 발생하면 API 에러가 그대로 나감 (정보 노출 위험)
  }
}
```

### 5. 타입 안정성

```typescript
// ✅ Good: Zod로 런타임 검증 + 타입 추론
const UserDTOSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
});

type UserDTO = z.infer<typeof UserDTOSchema>; // 타입 자동 생성

const response = await api.get('/user/profile');
const validated = UserDTOSchema.parse(response); // 런타임 검증

// ❌ Bad: any 타입 사용
const response: any = await api.get('/user/profile');
const user = response.data; // 타입 체크 없음 (위험!)
```

### 6. 코드 구조

```typescript
// ✅ Good: Small, focused files
// login-with-oauth-use-case.ts - 한 가지 책임
export class LoginWithOAuthUseCaseImpl {
  async execute(params: LoginWithOAuthParams) {
    // ...
  }
}

// logout-use-case.ts - 또 다른 책임
export class LogoutUseCaseImpl {
  async execute() {
    // ...
  }
}

// ❌ Bad: Large file with multiple responsibilities
// auth-use-cases.ts - 너무 많은 책임
export class AuthUseCases {
  loginWithOAuth() { /* ... */ }
  logout() { /* ... */ }
  refreshToken() { /* ... */ }
  signUp() { /* ... */ }
  // ... 수십 개의 메서드
}
```

### 7. Server Actions vs Client Hooks

```typescript
// ✅ Good: Server Actions for mutations
'use server';
export async function createReviewAction(params: CreateReviewParams) {
  const container = createCafeteriaServerContainer();
  const createReview = container.getCreateReview();

  await createReview.execute(params);
  revalidatePath(`/cafeterias/${params.cafeteriaId}`);
}

// ✅ Good: Client Hooks for queries
'use client';
export function useGetCafeteria(id: string) {
  const container = getAuthClientContainer();
  const getCafeteria = container.getGetCafeteria();

  return useSuspenseQuery({
    queryKey: ['cafeteria', id],
    queryFn: () => getCafeteria.execute(id),
  });
}

// ❌ Bad: Client-side mutation (서버 검증 없음)
'use client';
export function useCreateReview() {
  const container = getAuthClientContainer();

  return useMutation({
    mutationFn: async (params) => {
      // 클라이언트에서 직접 API 호출 (비추천)
      return container.getCreateReview().execute(params);
    },
  });
}
```

---

## Troubleshooting

### 문제 1: "Cannot find module '@/domains/...'"

**원인**: Path alias 설정 문제

**해결**:

```json
// tsconfig.json 확인
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./apps/web/src/*"]  // ← 이 설정이 있는지 확인
    }
  }
}
```

### 문제 2: "localStorage is not defined" (서버 에러)

**원인**: 서버 컴포넌트에서 Client Container 사용

**해결**:

```typescript
// ❌ Bad
async function ProfilePage() {
  const container = getAuthClientContainer(); // ← Client Container
  // Error: localStorage is not defined
}

// ✅ Good
async function ProfilePage() {
  const container = createAuthServerContainer(); // ← Server Container
}
```

### 문제 3: "cookies() can only be called in Server Components"

**원인**: 클라이언트 컴포넌트에서 Server Container 사용

**해결**:

```typescript
// ❌ Bad
'use client';
function ProfileSection() {
  const container = createAuthServerContainer(); // ← Server Container
  // Error: cookies() can only be called in Server Components
}

// ✅ Good
'use client';
function ProfileSection() {
  const container = getAuthClientContainer(); // ← Client Container
}
```

### 문제 4: Type error: DTO is not assignable to Entity

**원인**: DTO와 Entity 타입 불일치

**해결**:

```typescript
// ❌ Bad: DTO를 Entity로 잘못 사용
const users: User[] = await dataSource.getUsers();
// dataSource는 UserDTO를 반환함!

// ✅ Good: Mapper 사용
const dtos: UserDTO[] = await dataSource.getUsers();
const users: User[] = UserMapper.toDomainList(dtos);
```

### 문제 5: Zod validation error

**원인**: API 응답이 예상과 다름

**해결**:

```typescript
// 1. 에러 메시지 확인
try {
  const parsed = UserDTOSchema.parse(response);
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error('Validation failed:', error.errors);
    // 어떤 필드가 잘못됐는지 확인
  }
}

// 2. API 응답 로깅
console.log('API Response:', response);
// 실제 응답 구조를 확인하고 스키마 수정

// 3. Optional 필드 추가
const UserDTOSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().optional(), // ← optional로 변경
});
```

### 문제 6: useSuspenseQuery에서 무한 로딩

**원인**: Query Key가 계속 변경됨

**해결**:

```typescript
// ❌ Bad: 객체를 직접 Query Key로 사용
useQuery({
  queryKey: ['user', { id: userId }],  // 매번 새 객체
});

// ✅ Good: Primitive 값 사용
useQuery({
  queryKey: ['user', userId],  // 같은 ID면 같은 키
});
```

### 문제 7: "Container is not initialized"

**원인**: DI Container를 제대로 설정 안 함

**해결**:

```typescript
// 1. Container에서 Use Case 등록 확인
export function createAuthServerContainer(): AuthServerContainer {
  // ...

  return {
    getLoginWithOAuth: () =>
      new LoginWithOAuthUseCaseImpl(repository, sessionManager),
    // ← 등록되어 있는지 확인
  };
}

// 2. 사용할 때 올바른 메서드 호출
const container = createAuthServerContainer();
const useCase = container.getLoginWithOAuth(); // ✅ 메서드 호출
// const useCase = container.getLoginWithOAuth; // ❌ 메서드 안 부름
```

---

## Learning Path

Clean Architecture + DDD를 완전히 이해하기 위한 학습 경로입니다.

### Week 1: 기초 이해

- [ ] Clean Architecture + DDD 개념 이해
- [ ] 레이어별 역할 파악
- [ ] Next.js Server/Client 컴포넌트 이해
- [ ] 간단한 코드 읽기 (Entity, Use Case)
- [ ] 데이터 흐름 따라가기

**추천 실습**: 기존 기능(내 프로필 보기)의 전체 흐름을 단계별로 따라가보기

### Week 2: 코드 읽기

- [ ] 모든 레이어의 코드 읽기
- [ ] 패턴 이해 (Repository, Use Case, DTO, Mapper, Decorator)
- [ ] DI Container 이해 (Server vs Client)
- [ ] 상태 관리 이해 (TanStack Query, Server Actions, Zustand)
- [ ] Server Actions 패턴 이해

**추천 실습**: 각 도메인의 파일을 하나씩 읽고 주석 달기

### Week 3: 작은 기능 추가

- [ ] 간단한 Use Case 추가
- [ ] Repository 메서드 추가
- [ ] Server Action 또는 Client Hook 생성
- [ ] UI 컴포넌트 작성

**추천 실습**: "알림 개수 뱃지" 기능 추가하기

### Week 4: 복잡한 기능 추가

- [ ] 여러 Use Case가 필요한 기능 (예: 리뷰 시스템)
- [ ] 완전한 CRUD 구현
- [ ] 에러 처리 추가
- [ ] 테스트 작성

**추천 실습**: 이 문서의 "알림 읽음 처리" 예제 따라하기

### Week 5: 리팩토링과 최적화

- [ ] 중복 코드 제거
- [ ] 공통 패턴 추출
- [ ] 성능 최적화
- [ ] 코드 리뷰

**추천 실습**: 기존 코드를 개선하고 더 나은 구조로 리팩토링

---

## Architecture Review & Improvements

현재 아키텍처 분석 및 개선 제안

### ✅ 현재 잘 되고 있는 점

#### 1. **도메인별 DI 컨테이너 분리**
- 각 도메인이 독립적인 Container 보유
- 도메인 간 의존성 최소화
- 테스트와 유지보수 용이

#### 2. **Server/Client Container 명확한 구분**
- Per-Request Server Container (상태 격리)
- Lazy Singleton Client Container (메모리 효율)
- Next.js 환경에 최적화

#### 3. **Decorator Pattern 활용**
- `AuthenticatedHttpClient`가 `FetchHttpClient` 감싸기
- 자동 토큰 추가 및 갱신
- 기능 확장 용이

#### 4. **Per-Domain Organization**
- 도메인별로 완전히 독립적인 구조
- 새로운 도메인 추가 시 기존 도메인 영향 없음
- 팀 분업에 유리

#### 5. **Type-Safe UseCase Interfaces**
- 모든 UseCase에 Interface + Impl 패턴
- 타입 안정성 보장
- Mock 생성 용이

#### 6. **Server Actions Pattern**
- Next.js 15+ 패턴 적극 활용
- 타입 안전한 서버 뮤테이션
- `revalidatePath`로 캐시 관리

### 🔍 개선 가능한 영역

#### 1. **Error Handling 일관성**

**현재 상황**:
- Auth 도메인: `AuthError` 클래스 존재
- 다른 도메인: 일부는 없거나 일관성 부족

**제안**:
```typescript
// domains/[domain]/core/errors/[domain]-error.ts
export class CafeteriaError extends Error {
  constructor(
    message: string,
    public code: CafeteriaErrorCode,
    public statusCode?: number,
    public originalError?: unknown
  ) {
    super(message);
    this.name = 'CafeteriaError';
  }
}

export type CafeteriaErrorCode =
  | 'CAFETERIA_NOT_FOUND'
  | 'MENU_NOT_AVAILABLE'
  | 'REVIEW_LIMIT_EXCEEDED';
```

**장점**:
- 도메인별 에러를 명확하게 구분
- 에러 처리 로직 통일
- 사용자에게 더 친화적인 메시지 제공

#### 2. **Mapper 위치 표준화**

**현재 상황**:
- 일부 도메인: `data/mappers/`
- 일부 도메인: 없거나 다른 위치

**제안**:
- 모든 도메인에서 `data/mappers/` 사용
- Mapper 파일명: `[entity]-mapper.ts`

**예시**:
```
domains/cafeteria/data/mappers/
├── cafeteria-mapper.ts
├── menu-mapper.ts
└── review-mapper.ts
```

#### 3. **Public API 노출 전략**

**현재 상황**:
- `domains/[domain]/index.ts`에서 Server Actions 노출
- Client hooks는 직접 import 필요

**제안**:
```typescript
// domains/auth/index.ts

/**
 * Public API
 *
 * 보안: Server Actions만 export
 * Client hooks는 명시적 import 권장
 */

// Server Actions (Public)
export {
  loginWithOAuthAction,
  logoutAction,
} from './presentation/actions/auth-actions';

// Types (Public)
export type { User } from './domain/entities/user.entity';
export type { Session } from './domain/entities/session.entity';
export type { OAuthProvider } from './core/types/oauth-provider';

// Client hooks는 export 안 함 (명시적 import 강제)
// import { useGetMyProfile } from '@/domains/user/presentation/hooks/use-user-queries';
```

**장점**:
- 보안: Server Actions만 공개 API로 노출
- 명확성: Client hooks는 의도적으로 import 필요
- 유지보수: Public API 변경 영향 최소화

#### 4. **테스트 구조 표준화**

**현재 상황**:
- 테스트 파일이 일부 누락되거나 일관성 부족

**제안**:
```
domains/[domain]/
├── domain/
│   └── usecases/
│       ├── login-with-oauth-use-case.ts
│       └── login-with-oauth-use-case.test.ts  # ← 추가
│
├── data/
│   └── repositories/
│       ├── auth-repository-impl.ts
│       └── auth-repository-impl.test.ts       # ← 추가
│
└── presentation/
    └── actions/
        ├── auth-actions.ts
        └── auth-actions.test.ts               # ← 추가
```

**테스트 템플릿**:

```typescript
// UseCase 테스트 템플릿
describe('LoginWithOAuthUseCase', () => {
  let useCase: LoginWithOAuthUseCase;
  let mockRepository: jest.Mocked<AuthRepository>;
  let mockSessionManager: jest.Mocked<SessionManager>;

  beforeEach(() => {
    mockRepository = {
      loginWithGoogle: jest.fn(),
      // ... 다른 메서드 mock
    };

    mockSessionManager = {
      setToken: jest.fn(),
      // ... 다른 메서드 mock
    };

    useCase = new LoginWithOAuthUseCaseImpl(
      mockRepository,
      mockSessionManager
    );
  });

  it('should login successfully', async () => {
    // Given
    const params = {
      provider: 'google',
      code: 'auth-code',
      redirectUri: 'http://localhost:3000',
    };

    mockRepository.loginWithGoogle.mockResolvedValue({
      user: { id: '1', name: 'Test User', /* ... */ },
      session: { accessToken: 'token', /* ... */ },
    });

    // When
    const result = await useCase.execute(params);

    // Then
    expect(result.user.name).toBe('Test User');
    expect(mockSessionManager.setToken).toHaveBeenCalledWith('token');
  });

  it('should throw error for invalid provider', async () => {
    // ...
  });
});
```

#### 5. **문서화 개선**

**제안**:
- 각 도메인에 `README.md` 추가
- UseCase별 사용 예시 작성

**예시**:
```markdown
# Auth Domain

## Overview
사용자 인증 및 세션 관리를 담당하는 도메인입니다.

## Use Cases

### LoginWithOAuthUseCase
OAuth를 통한 로그인을 처리합니다.

#### Usage (Server)
\`\`\`typescript
import { loginWithOAuthAction } from '@/domains/auth';

const result = await loginWithOAuthAction({
  provider: 'google',
  code: 'auth-code',
  redirectUri: 'http://localhost:3000/callback',
});
\`\`\`

#### Usage (Client)
\`\`\`typescript
import { useLoginWithOAuth } from '@/domains/auth/presentation/hooks/use-auth-mutations';

const { mutate: login } = useLoginWithOAuth();

login({ provider: 'google', code: 'auth-code', redirectUri: '...' });
\`\`\`

## Entities
- `User`: 사용자 정보
- `Session`: 세션 정보 (accessToken, refreshToken)

## Error Codes
- `INVALID_CREDENTIALS`: 잘못된 인증 정보
- `TOKEN_EXPIRED`: 토큰 만료
- `OAUTH_ERROR`: OAuth 인증 실패
```

#### 6. **Shared UseCase Base Class**

**현재 상황**:
- 각 UseCase마다 반복되는 코드 (입력 검증, 에러 처리)

**제안**:
```typescript
// domains/shared/domain/base-use-case.ts

export abstract class BaseUseCase<TParams, TResult> {
  /**
   * Use Case 실행
   */
  abstract execute(params: TParams): Promise<TResult>;

  /**
   * 입력값 검증 (Override 가능)
   */
  protected validate(params: TParams): void {
    // 기본 검증 로직
  }

  /**
   * 에러 처리 (Override 가능)
   */
  protected handleError(error: unknown): never {
    // 기본 에러 처리
    throw error;
  }
}

// 사용 예시
export class LoginWithOAuthUseCaseImpl
  extends BaseUseCase<LoginWithOAuthParams, LoginWithOAuthResult>
  implements LoginWithOAuthUseCase
{
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly sessionManager: SessionManager
  ) {
    super();
  }

  protected validate(params: LoginWithOAuthParams): void {
    if (!params.code) {
      throw new AuthError('Code is required', 'OAUTH_ERROR');
    }
  }

  async execute(params: LoginWithOAuthParams): Promise<LoginWithOAuthResult> {
    this.validate(params);

    try {
      // 실제 로직
      const result = await this.authRepository.loginWithGoogle(params);
      return result;
    } catch (error) {
      return this.handleError(error);
    }
  }
}
```

#### 7. **Logger Integration**

**제안**:
```typescript
// shared/infrastructure/logging/logger.ts

export interface Logger {
  info(message: string, context?: Record<string, unknown>): void;
  error(message: string, error?: Error, context?: Record<string, unknown>): void;
  warn(message: string, context?: Record<string, unknown>): void;
  debug(message: string, context?: Record<string, unknown>): void;
}

export class ConsoleLogger implements Logger {
  info(message: string, context?: Record<string, unknown>) {
    console.log(`[INFO] ${message}`, context);
  }

  error(message: string, error?: Error, context?: Record<string, unknown>) {
    console.error(`[ERROR] ${message}`, error, context);
  }

  // ...
}

// DI Container에서 주입
export function createAuthServerContainer(): AuthServerContainer {
  const logger = new ConsoleLogger();

  // Use Case에서 사용
  return {
    getLoginWithOAuth: () =>
      new LoginWithOAuthUseCaseImpl(repository, sessionManager, logger),
  };
}
```

### 📊 우선순위

| 개선 사항 | 우선순위 | 난이도 | 영향도 |
|----------|---------|--------|--------|
| Error Handling 일관성 | 🔴 높음 | 중간 | 높음 |
| Mapper 위치 표준화 | 🟡 중간 | 낮음 | 중간 |
| Public API 노출 전략 | 🟡 중간 | 낮음 | 높음 |
| 테스트 구조 표준화 | 🔴 높음 | 중간 | 높음 |
| 문서화 개선 | 🟢 낮음 | 낮음 | 중간 |
| Shared UseCase Base | 🟢 낮음 | 높음 | 낮음 |
| Logger Integration | 🟡 중간 | 중간 | 중간 |

### 🎯 다음 단계

1. **즉시 실행 가능**:
   - Mapper 위치 표준화
   - Public API 노출 전략 통일
   - 도메인별 README.md 추가

2. **단기 (1-2주)**:
   - Error Handling 일관성 확보
   - 테스트 구조 표준화

3. **중기 (1-2개월)**:
   - Logger Integration
   - Shared UseCase Base Class

---

## 마치며

Nugudi 프로젝트의 Clean Architecture + DDD 구조는 처음에는 복잡해 보이지만, 이해하고 나면 **코드가 얼마나 깔끔하고 유지보수하기 쉬운지** 느끼게 될 것입니다.

### 핵심 기억할 점

1. **도메인 분리**: 각 도메인은 독립적인 미니 애플리케이션
2. **레이어 분리**: Domain, Data, Infrastructure, Presentation 명확히 구분
3. **서버/클라이언트 구분**: Server Container vs Client Container 절대 혼용 금지
4. **의존성 방향**: 항상 Domain을 향함
5. **DTO ↔ Entity**: API 형식과 앱 내부 형식 분리
6. **DI Container**: 객체 생성과 관리를 한 곳에서
7. **Server Actions**: Next.js의 강력한 서버 뮤테이션 패턴
8. **타입 안정성**: Zod + TypeScript로 런타임/컴파일타임 모두 검증

### 다음 단계

1. 이 문서를 여러 번 읽으세요
2. 실제 코드를 직접 따라가보세요
3. 작은 기능부터 직접 추가해보세요
4. 막히는 부분은 다시 문서를 참고하세요
5. 점진적으로 이해의 폭을 넓혀가세요

**화이팅! 🚀**

궁금한 점이 있으면 언제든 팀원들에게 물어보거나, 이 문서를 참고하세요!

---

## 추가 학습 자료

### 공식 문서

- [Clean Architecture (Uncle Bob)](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Domain-Driven Design (DDD)](https://martinfowler.com/bliki/DomainDrivenDesign.html)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
- [Next.js App Router](https://nextjs.org/docs/app)
- [TanStack Query](https://tanstack.com/query/latest)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [Zod](https://zod.dev)

### 추천 도서

- "Clean Architecture" by Robert C. Martin
- "Clean Code" by Robert C. Martin
- "Domain-Driven Design" by Eric Evans
- "Implementing Domain-Driven Design" by Vaughn Vernon

### 내부 문서

- [CLAUDE.md](/CLAUDE.md) - AI 개발 규칙 및 가이드라인
- [claude/packages.md](/claude/packages.md) - 패키지 사용법 및 DDD 아키텍처
- [claude/frontend.md](/claude/frontend.md) - 프론트엔드 개발 패턴
- [claude/testing.md](/claude/testing.md) - 테스팅 가이드

---

**Last Updated**: 2024-11-06
**Version**: 1.0.0
