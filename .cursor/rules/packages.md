## 🏗️ Monorepo Architecture Overview

This is a **Turbo-powered pnpm workspace monorepo** with a **Design System-first approach** and **DDD (Domain-Driven Design) architecture**.

### Repository Structure

```
nugudi/
├── apps/                    # Applications
│   └── web/                # Next.js 15 + React 19 (Main Web App)
│       ├── app/           # Next.js App Router
│       │   ├── (auth)/    # 🔒 Protected routes - Require authentication
│       │   │   └── profile/      # Profile page (authenticated users only)
│       │   └── (public)/  # 🌍 Public routes - No authentication required
│       │       └── auth/        # Auth-related public pages
│       │           ├── sign-in/  # Sign in with credentials page
│       │           └── sign-up/  # Sign up pages
│       └── src/
│           ├── di/        # 🆕 Dependency Injection Containers
│           │   ├── auth-server-container.ts  # Server-side DI
│           │   └── auth-client-container.ts  # Client-side DI (Singleton)
│           ├── domains/   # 🆕 DDD Domain Layer
│           │   ├── auth/
│           │   │   ├── repositories/  # Data Access Layer
│           │   │   ├── services/      # Business Logic Layer
│           │   │   ├── types/
│           │   │   ├── actions/       # Server Actions
│           │   │   └── ui/           # Presentation Layer
│           │   ├── user/
│           │   │   ├── repositories/
│           │   │   ├── services/
│           │   │   └── ui/
│           │   └── [other-domains]/
│           └── shared/    # Shared Infrastructure & Interface Adapters
│               ├── infrastructure/  # 🆕 Infrastructure Layer
│               │   ├── http/       # HttpClient, TokenProvider
│               │   ├── storage/    # SessionManager
│               │   ├── logging/    # Logger
│               │   └── configs/    # TanStack Query, PWA
│               └── interface-adapters/  # 🆕 UI Components & Providers
│                   ├── components/
│                   ├── providers/
│                   └── sections/
├── packages/               # Shared packages (ALWAYS use these!)
│   ├── ui/                # Aggregated UI library with Storybook
│   ├── types/             # 🆕 Shared TypeScript types
│   ├── themes/            # Design tokens system
│   ├── assets/            # Icons and static assets
│   └── react/             # Component packages (button, input, etc.)
│       ├── components/    # React components
│       └── hooks/         # React hooks
└── turbo.json             # Monorepo task orchestration
```

### 🔐 Route Groups: Authentication Structure

Next.js 15 route groups organize pages by authentication requirements:

- **(auth)**: Protected pages requiring user authentication
  - All pages inside this group require a logged-in user
  - Examples: `/profile`, user dashboard, etc.
- **(public)**: Public pages accessible without authentication
  - All pages inside this group are accessible to everyone
  - Examples: `/auth/login`, `/auth/sign-in/email`, `/auth/sign-up`, etc.

**Note**: Route groups (parentheses folders) don't affect the URL structure - they're purely for organization.

---

## 🏛️ DDD Architecture & Clean Architecture

This project follows **Domain-Driven Design (DDD)** principles with **Clean Architecture** layers:

### Architecture Layers

```
┌─────────────────────────────────────────────────────────────┐
│                     Presentation Layer                      │
│                    (app/, domains/*/ui/)                    │
│              Pages → Views → Sections → Components          │
└─────────────────────────────────────────────────────────────┘
                            ↓ depends on
┌─────────────────────────────────────────────────────────────┐
│                   Application Layer                         │
│              (domains/*/services/, actions/)                │
│             Business Logic & Orchestration                  │
└─────────────────────────────────────────────────────────────┘
                            ↓ depends on
┌─────────────────────────────────────────────────────────────┐
│                      Domain Layer                           │
│              (domains/*/repositories/, types/)              │
│                  Data Access Interface                      │
└─────────────────────────────────────────────────────────────┘
                            ↓ depends on
┌─────────────────────────────────────────────────────────────┐
│                  Infrastructure Layer                       │
│      (shared/infrastructure/http/, storage/, logging/)      │
│         HttpClient, SessionManager, External APIs           │
└─────────────────────────────────────────────────────────────┘
```

### Key Principles

1. **Dependency Rule**: Dependencies flow inward (Presentation → Application → Domain → Infrastructure)
2. **Interface Segregation**: Each layer defines interfaces that outer layers implement
3. **Dependency Inversion**: High-level modules don't depend on low-level modules; both depend on abstractions

### Layer Responsibilities

| Layer               | Location                          | Responsibility                                                              | Examples                                              |
| ------------------- | --------------------------------- | --------------------------------------------------------------------------- | ----------------------------------------------------- |
| **Presentation**    | `app/`, `domains/*/ui/`           | User interface, user interactions, routing                                  | Pages, Views, Sections, Components                    |
| **Application**     | `domains/*/services/`, `actions/` | Business logic, orchestration, use cases                                    | AuthService, UserService, Server Actions              |
| **Domain**          | `domains/*/repositories/`         | Data access interfaces, domain models                                       | AuthRepository, UserRepository                        |
| **Infrastructure**  | `shared/infrastructure/`          | External systems, frameworks, databases                                     | HttpClient, SessionManager, Logger                    |
| **DI Container**    | `src/di/`                         | Dependency injection, object creation, lifecycle management                 | AuthServerContainer, AuthClientContainer              |
| **Interface Adapt** | `shared/interface-adapters/`      | Shared UI components, providers (connects Infrastructure to Presentation)   | AppHeader, Providers                                  |

---

## 📦 Dependency Injection (DI) Container Pattern

### Why DI Containers?

DI Containers manage dependencies and their lifecycles, making code:

- **Testable**: Easy to mock dependencies
- **Flexible**: Easy to swap implementations
- **Maintainable**: Centralized dependency configuration
- **Type-safe**: Full TypeScript support

### Container Types

#### 1. Server Container (`auth-server-container.ts`)

**Use in**: Server Components, API Routes, Server Actions

```typescript
import { createAuthServerContainer } from '@/src/di/auth-server-container';

// Page (Server Component)
const Page = async () => {
  const container = createAuthServerContainer();  // ✅ Create new instance
  const authService = container.getAuthService();
  const userService = container.getUserService();

  // Use services...
};
```

**특징:**
- **Stateless**: 매 요청마다 새로운 인스턴스 생성
- **SessionManager**: `ServerSessionManager` (cookies 사용)
- **TokenProvider**: `ServerTokenProvider` (cookies에서 토큰 조회)
- **HttpClient**: 서버사이드 fetch 사용

#### 2. Client Container (`auth-client-container.ts`)

**Use in**: Client Components, Event Handlers, Client Hooks

```typescript
'use client';
import { authClientContainer } from '@/src/di/auth-client-container';

// Client Component
const Component = () => {
  const handleLogin = async () => {
    const authService = authClientContainer.getAuthService();  // ✅ Use singleton
    const result = await authService.loginWithOAuth(...);
  };
};
```

**특징:**
- **Singleton**: 앱 전체에서 하나의 인스턴스 재사용
- **SessionManager**: `ClientSessionManager` (localStorage 사용)
- **TokenProvider**: `ClientTokenProvider` (localStorage에서 토큰 조회)
- **HttpClient**: 브라우저 fetch 사용

### Available Services

```typescript
// Auth Domain Services
container.getAuthService()
  - getOAuthAuthorizeUrl()
  - loginWithOAuth()
  - signUpWithSocial()
  - logout()
  - refreshToken()
  - getCurrentSession()

// User Domain Services
container.getUserService()
  - getProfile()
  - updateProfile()
  // ... user-related methods
```

---

## 🔧 Infrastructure Layer

### HttpClient Architecture

```typescript
// HttpClient 인터페이스 (추상화)
interface HttpClient {
  get<T>(url: string, options?: RequestOptions): Promise<HttpResponse<T>>;
  post<T>(url: string, body?: unknown, options?: RequestOptions): Promise<HttpResponse<T>>;
  // ... put, patch, delete
}

// 구현체 1: FetchHttpClient (기본 HTTP 클라이언트)
class FetchHttpClient implements HttpClient {
  // Fetch API 기반 구현
}

// 구현체 2: AuthenticatedHttpClient (Decorator 패턴)
class AuthenticatedHttpClient implements HttpClient {
  constructor(
    private baseClient: HttpClient,
    private tokenProvider: TokenProvider
  ) {}

  // 모든 요청에 자동으로 Authorization 헤더 주입
}
```

### HttpClient Usage Pattern

```typescript
// ❌ WRONG - Don't use HttpClient directly
import { FetchHttpClient } from '@/src/shared/infrastructure/http';
const client = new FetchHttpClient({ baseUrl: '...' });

// ✅ CORRECT - Use through DI Container
const container = createAuthServerContainer();
const authService = container.getAuthService();
// AuthService internally uses AuthenticatedHttpClient
```

### SessionManager (Server vs Client)

**Server-side (`ServerSessionManager`)**:
```typescript
import { ServerSessionManager } from '@/src/shared/infrastructure/storage';

// 내부 구현: Next.js cookies() 사용
class ServerSessionManager implements SessionManager {
  async saveSession(data: SessionData) {
    cookies().set('session', JSON.stringify(data), {
      httpOnly: true,
      secure: true,
      sameSite: 'strict'
    });
  }

  async getSession() {
    const session = cookies().get('session');
    return session ? JSON.parse(session.value) : null;
  }
}
```

**Client-side (`ClientSessionManager`)**:
```typescript
import { ClientSessionManager } from '@/src/shared/infrastructure/storage';

// 내부 구현: localStorage 사용
class ClientSessionManager implements SessionManager {
  async saveSession(data: SessionData) {
    localStorage.setItem('session', JSON.stringify(data));
  }

  async getSession() {
    const session = localStorage.getItem('session');
    return session ? JSON.parse(session) : null;
  }
}
```

### TokenProvider Pattern

```typescript
// TokenProvider 인터페이스
interface TokenProvider {
  getToken(): Promise<string | null>;
}

// Server-side: Cookies에서 토큰 조회
class ServerTokenProvider implements TokenProvider {
  async getToken() {
    const session = await this.sessionManager.getSession();
    return session?.accessToken ?? null;
  }
}

// Client-side: LocalStorage에서 토큰 조회
class ClientTokenProvider implements TokenProvider {
  async getToken() {
    const session = await this.sessionManager.getSession();
    return session?.accessToken ?? null;
  }
}
```

---

## 🏗️ Repository & Service Pattern

### Repository Layer (Data Access)

**역할**: 데이터 소스와의 통신을 담당 (HTTP API, Database 등)

```typescript
// Repository Interface
export interface AuthRepository {
  loginWithGoogle(params: GoogleLoginRequest): Promise<OAuthLoginResponse>;
  loginWithKakao(params: KakaoLoginRequest): Promise<OAuthLoginResponse>;
  refreshToken(refreshToken: string, deviceId: string): Promise<TokenResponse>;
  logout(refreshToken: string, deviceId: string): Promise<LogoutResponse>;
}

// Repository Implementation
export class AuthRepositoryImpl implements AuthRepository {
  constructor(private readonly httpClient: HttpClient) {}

  async loginWithGoogle(params: GoogleLoginRequest) {
    const response = await this.httpClient.post<GoogleLoginResponse>(
      '/api/v1/auth/login/google',
      params
    );
    return { status: response.status, data: response.data };
  }
}
```

**특징:**
- HttpClient를 통해 API 호출
- 순수 데이터 접근 로직만 포함
- 비즈니스 로직 없음

### Service Layer (Business Logic)

**역할**: 비즈니스 로직과 여러 Repository를 조합하여 복잡한 플로우 처리

```typescript
export interface AuthService {
  loginWithOAuth(provider, code, redirectUri): Promise<LoginResult>;
  signUpWithSocial(token, data): Promise<SignUpResult>;
  logout(): Promise<void>;
}

export class AuthServiceImpl implements AuthService {
  constructor(
    private readonly repository: AuthRepository,
    private readonly sessionManager: SessionManager
  ) {}

  async loginWithOAuth(provider, code, redirectUri) {
    // 1. Repository를 통해 로그인
    const response = await this.repository.loginWithGoogle({ code, redirectUri });

    // 2. 비즈니스 로직: 기존 회원 vs 신규 회원 분기
    if (response.data.status === 'EXISTING_USER') {
      // 3. SessionManager를 통해 세션 저장
      await this.sessionManager.saveSession({
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken
      });

      return { type: 'EXISTING_USER', userId: response.data.userId };
    }

    return { type: 'NEW_USER', registrationToken: response.data.registrationToken };
  }
}
```

**특징:**
- Repository와 SessionManager를 조합
- 복잡한 비즈니스 로직 처리
- 도메인 규칙 적용

---

## 🎯 Core Development Rules

### MANDATORY: Always Use Existing Packages

```typescript
// ✅ CORRECT - Use packages
import { Button } from "@nugudi/react-components-button"; // Named export
import { useToggle } from "@nugudi/react-hooks-toggle";
import { vars } from "@nugudi/themes"; // Use 'vars' not 'variables'
import { AppleIcon, HeartIcon } from "@nugudi/assets-icons"; // Import individual icons

// ❌ WRONG - Don't create new implementations
import Button from "./components/button"; // NO!
```

### Package Import Priority

1. **FIRST**: Check if functionality exists in `packages/`
2. **SECOND**: Import from the appropriate package
3. **LAST RESORT**: Only create new code if absolutely necessary

---

## 📝 Commit Convention

### Commit Message Format

커밋 메시지는 `commitlint.config.ts`의 규칙을 따릅니다:

```
[NUGUDI-{번호}] {type}({scope}): {subject}

{body}
```

### Commit Types

- **feat**: 신규 기능 추가
- **fix**: 버그 수정
- **docs**: 문서 수정 (README, 문서 추가 등)
- **style**: 코드 스타일 수정 (세미콜론, 공백 등)
- **refactor**: 코드 리팩토링 (기능 변화는 없음)
- **test**: 테스트 코드 추가/수정
- **chore**: 빌드, 설정, 패키지 등 기타 작업
- **perf**: 성능 개선
- **ci**: CI 관련 변경

### Commit Rules

- 제목은 최대 72자
- 본문은 한 줄당 최대 100자
- 티켓 번호는 브랜치명에서 추출 (예: `feature/NUGUDI-105-bottomsheet` → `[NUGUDI-105]`)
- **중요**: Co-Author 라인을 절대 추가하지 마세요 (Claude, GitHub Copilot 등)

### Example

```bash
# ✅ CORRECT
git commit -m "[NUGUDI-105] feat(react): BottomSheet 컴포넌트 구현

- Backdrop과 함께 동작하는 BottomSheet 컴포넌트 추가
- 스와이프 제스처 지원"

# ❌ WRONG - Co-Author 라인 포함
git commit -m "[NUGUDI-105] feat(react): BottomSheet 구현

Co-Authored-By: Claude <noreply@anthropic.com>"  # NO!
```

---

## 🔧 Technology Stack

### Core Technologies

- **Framework**: Next.js 15 (App Router)
- **React Version**: 19.x
- **TypeScript**: 5.8.3 with strict configuration
- **Package Manager**: pnpm with workspaces
- **Build Tool**: Turborepo
- **Backend**: External API server
- **Linting/Formatting**: Biome (NOT ESLint/Prettier)
- **Styling**: Vanilla Extract + CSS Modules
- **State Management**: TanStack Query
- **Forms**: React Hook Form + Zod validation
- **Testing**: Vitest + Playwright + MSW
- **Documentation**: Storybook

---

## 📦 Package Usage Guidelines

### 🎯 PRIORITY: Layout & Typography Components

#### 🚨 MUST USE: Layout Components First (`@nugudi/react-components-layout`)

**ALWAYS use these layout components BEFORE creating custom styles:**

```typescript
// ✅ CORRECT - Use layout components for structure
import {
  Box,
  Flex,
  VStack,
  HStack,
  Stack,
  Grid,
  GridItem,
  Divider,
} from "@nugudi/react-components-layout";

// ❌ WRONG - Don't create custom layouts with vanilla extract
const customLayout = style({ display: "flex" }); // NO! Use Flex instead
```

##### Layout Component Usage Guide

| Component    | Use Case                | Props                                  | Example                                              |
| ------------ | ----------------------- | -------------------------------------- | ---------------------------------------------------- |
| **Box**      | Basic container/wrapper | All style props                        | `<Box padding={16} margin={8}>`                      |
| **Flex**     | Flexbox layouts         | `direction`, `justify`, `align`, `gap` | `<Flex justify="space-between" align="center">`      |
| **VStack**   | Vertical stacking       | `spacing`, `align`                     | `<VStack spacing={16}>` (children stack vertically)  |
| **HStack**   | Horizontal stacking     | `spacing`, `align`                     | `<HStack spacing={8}>` (children stack horizontally) |
| **Stack**    | Generic stacking        | `direction`, `spacing`                 | `<Stack direction="row" spacing={12}>`               |
| **Grid**     | CSS Grid layouts        | `templateColumns`, `gap`               | `<Grid templateColumns="1fr 2fr" gap={16}>`          |
| **GridItem** | Grid children           | `colSpan`, `rowSpan`                   | `<GridItem colSpan={2}>`                             |
| **Divider**  | Visual separator        | `orientation`, `color`                 | `<Divider orientation="horizontal" />`               |

##### 🆕 Spacing & Size System (Direct Pixel Values)

**IMPORTANT**: Layout components now accept direct pixel values instead of spacing tokens:

```typescript
// ✅ NEW SYSTEM - Direct pixel values
<Box padding={20} margin={16}>        // 20px padding, 16px margin
<VStack spacing={24}>                  // 24px gap between children
<Flex gap={32}>                        // 32px gap

// Numbers are treated as pixels
<Box p={10} m={20}>                    // 10px padding, 20px margin
<Box width={300} height={150}>         // 300px width, 150px height

// Special keywords work as expected
<Box width="full" height="auto">       // 100% width, auto height
<Box width="screen">                   // 100vw width
<Box width="50%" height="100vh">       // Percentage and viewport units

// TypeScript autocomplete for common values
<Box width="">  // Autocompletes: "full", "auto", "screen", "min", "max", "fit"
<Box gap="">    // Autocompletes: "auto", template literals like "10px", "2rem"
```

**Size Keywords**:

- `"full"` → `100%`
- `"screen"` → `100vw`
- `"auto"` → `auto`
- `"min"` → `min-content`
- `"max"` → `max-content`
- `"fit"` → `fit-content`

**All Spacing Props Accept Pixels**:

- Margin: `m`, `margin`, `mt`, `mr`, `mb`, `ml`, `mX`, `mY`
- Padding: `p`, `padding`, `pt`, `pr`, `pb`, `pl`, `pX`, `pY`
- Gap: `gap`, `columnGap`, `rowGap`
- Size: `width`, `w`, `height`, `h`, `size`, `minWidth`, `maxWidth`, etc.

##### Common Layout Patterns

```typescript
// Page wrapper
<Box padding={24}>
  <VStack spacing={32}>
    {/* Page content */}
  </VStack>
</Box>

// Card layout
<Box padding={16} borderRadius="lg" backgroundColor="white">
  <VStack spacing={12}>
    {/* Card content */}
  </VStack>
</Box>

// Header with actions
<Flex justify="space-between" align="center" padding={16}>
  <Title fontSize="t1">Page Title</Title>
  <HStack spacing={8}>
    <Button>Action 1</Button>
    <Button>Action 2</Button>
  </HStack>
</Flex>

// Responsive grid
<Grid
  templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }}
  gap={16}
>
  <GridItem>{/* Item 1 */}</GridItem>
  <GridItem>{/* Item 2 */}</GridItem>
  <GridItem>{/* Item 3 */}</GridItem>
</Grid>
```

#### 🚨 MUST USE: Typography Components (`@nugudi/react-components-layout`)

**NEVER use HTML heading tags directly. ALWAYS use typography components:**

```typescript
// ✅ CORRECT - Use typography components
import { Heading, Title, Body, Emphasis, Logo } from '@nugudi/react-components-layout';

// ❌ WRONG - Don't use HTML tags directly
<h1>Title</h1>  // NO! Use <Heading fontSize="h1">
<p>Text</p>     // NO! Use <Body fontSize="b1">
<span>Note</span> // NO! Use <Emphasis fontSize="e1">
```

##### Typography Component Usage Guide

| Component    | Use Case            | fontSize Options                                                                         | Semantic HTML             | Example                                          |
| ------------ | ------------------- | ---------------------------------------------------------------------------------------- | ------------------------- | ------------------------------------------------ |
| **Logo**     | Brand/App name      | `l1` (34px), `l2` (20px)                                                                 | `as="h1"` or `as="span"`  | `<Logo fontSize="l1">너구디</Logo>`              |
| **Heading**  | Page titles         | `h1` (30px)                                                                              | `as="h1"` (default)       | `<Heading fontSize="h1">페이지 제목</Heading>`   |
| **Title**    | Section titles      | `t1` (28px), `t2` (22px), `t3` (20px)                                                    | `as="h2"`, `as="h3"`      | `<Title fontSize="t2" as="h2">섹션 제목</Title>` |
| **Body**     | Body text           | `b1` (17px), `b2` (16px), `b3` (15px), `b3b` (15px bold), `b4` (13px), `b4b` (13px bold) | `as="p"`, `as="span"`     | `<Body fontSize="b2">본문 텍스트</Body>`         |
| **Emphasis** | Small text/captions | `e1` (12px), `e2` (11px)                                                                 | `as="span"`, `as="small"` | `<Emphasis fontSize="e1">캡션</Emphasis>`        |

##### Typography Usage by Context

```typescript
// App header/brand
<Logo fontSize="l1" as="h1">너구디</Logo>
<Logo fontSize="l2" as="span">NUGUDI</Logo>

// Page structure
<Heading fontSize="h1">마이페이지</Heading>  // Main page title

// Section titles
<Title fontSize="t1" as="h2">프로필 정보</Title>  // Major section
<Title fontSize="t2" as="h3">기본 정보</Title>    // Subsection
<Title fontSize="t3" as="h4">연락처</Title>       // Minor subsection

// Content
<Body fontSize="b1">중요한 본문 내용입니다.</Body>           // Primary body text
<Body fontSize="b2">일반적인 설명 텍스트입니다.</Body>       // Regular body text
<Body fontSize="b3">추가 정보나 부가 설명입니다.</Body>       // Secondary text
<Body fontSize="b3b">강조된 작은 텍스트입니다.</Body>        // Bold small text
<Body fontSize="b4">작은 안내 텍스트입니다.</Body>           // Small text
<Body fontSize="b4b">작고 강조된 레이블입니다.</Body>        // Bold label

// Captions and metadata
<Emphasis fontSize="e1">2024년 1월 15일</Emphasis>  // Date, time
<Emphasis fontSize="e2">© 2024 Nugudi</Emphasis>    // Copyright, fine print
```

##### Complete Example: Combining Layout & Typography

```typescript
import {
  Box,
  Flex,
  VStack,
  HStack,
  Divider,
} from "@nugudi/react-components-layout";
import {
  Heading,
  Title,
  Body,
  Emphasis,
} from "@nugudi/react-components-layout";

// Example: User profile card
export const ProfileCard = () => {
  return (
    <Box padding={24} borderRadius="lg">
      <VStack spacing={20}>
        {/* Header */}
        <Heading fontSize="h1">사용자 프로필</Heading>

        <Divider />

        {/* Content sections */}
        <VStack spacing={16}>
          <Box>
            <Title fontSize="t2" as="h2">
              기본 정보
            </Title>
            <VStack spacing={8} marginTop={8}>
              <Body fontSize="b2">홍길동</Body>
              <Body fontSize="b3" color="zinc">
                소프트웨어 엔지니어
              </Body>
            </VStack>
          </Box>

          <Box>
            <Title fontSize="t3" as="h3">
              연락처
            </Title>
            <VStack spacing={4} marginTop={8}>
              <Body fontSize="b3">email@example.com</Body>
              <Body fontSize="b3">010-1234-5678</Body>
            </VStack>
          </Box>
        </VStack>

        {/* Footer */}
        <Emphasis fontSize="e1" color="zinc">
          마지막 업데이트: 2024년 1월 15일
        </Emphasis>
      </VStack>
    </Box>
  );
};
```

#### Priority Order for Layout Development

1. **FIRST**: Check if `@nugudi/react-components-layout` has the component you need
2. **SECOND**: Use layout components (Box, Flex, VStack, etc.) for structure
3. **THIRD**: Use typography components (Heading, Title, Body, etc.) for text
4. **LAST RESORT**: Only create custom styles with vanilla extract if no existing component works

### React Components (`@nugudi/react-components-*`)

```typescript
// Individual component imports - All use named exports
import { Button } from "@nugudi/react-components-button";
import { Input } from "@nugudi/react-components-input";
import { Chip } from "@nugudi/react-components-chip";
import { NavigationItem } from "@nugudi/react-components-navigation-item";
import { Switch } from "@nugudi/react-components-switch";
import { Tab } from "@nugudi/react-components-tab";
import { Textarea } from "@nugudi/react-components-textarea";
import { InputOTP } from "@nugudi/react-components-input-otp";
import { StepIndicator } from "@nugudi/react-components-step-indicator";
import { MenuCard } from "@nugudi/react-components-menu-card";
import { BottomSheet } from "@nugudi/react-components-bottom-sheet";
import { Backdrop } from "@nugudi/react-components-backdrop";

// NavigationItem usage example
<NavigationItem
  leftIcon={<CoinIcon />}
  rightIcon={<ArrowRightIcon />}
  onClick={() => console.log("clicked")}
>
  <div>Content with title and description</div>
</NavigationItem>;
```

### React Hooks (`@nugudi/react-hooks-*`)

```typescript
// Individual hook imports
import { useButton, useToggleButton } from "@nugudi/react-hooks-button";
import { useSwitch, useToggleSwitch } from "@nugudi/react-hooks-switch";
import { useToggle } from "@nugudi/react-hooks-toggle";
import { useStepper } from "@nugudi/react-hooks-use-stepper";
```

### ~~API Client~~ → DI Container + Services

**DEPRECATED**: `@nugudi/api` has been removed. Use **DI Containers** and **Services** instead.

```typescript
// ❌ OLD (Removed)
import { api } from "@nugudi/api";
const response = await api.users.getProfile(userId);

// ✅ NEW - Server-side (in Page/Server Action)
import { createAuthServerContainer } from '@/src/di/auth-server-container';
const container = createAuthServerContainer();
const userService = container.getUserService();
const profile = await userService.getProfile();

// ✅ NEW - Client-side (in Client Component)
import { authClientContainer } from '@/src/di/auth-client-container';
const userService = authClientContainer.getUserService();
const profile = await userService.getProfile();
```

### Types Package (`@nugudi/types`)

**NEW**: Shared TypeScript types across the monorepo

```typescript
// Shared types for multiple packages
import type { ApiResponse, ErrorResponse } from "@nugudi/types";
```

### Themes (`@nugudi/themes`)

#### Design Foundation Structure

**vars** - Design tokens available:

```typescript
// Colors
vars.colors.$static       // Static colors
vars.colors.$scale        // Color scales
  - whiteAlpha[100, 200, 300, 400, 500, 600, 700, 800, 900]
  - blackAlpha[100, 200, 300, 400, 500, 600, 700, 800, 900]
  - zinc[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
  - red, yellow, main, blue, purple, etc. (same scale)

// Spacing
vars.box.spacing[0, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64]

// Border Radius
vars.box.radii
  - none, sm, md, lg, xl, 2xl, 3xl, full

// Shadows
vars.box.shadows
  - xs, sm, md, lg, xl, 2xl, inner

// Typography
vars.typography.fontSize
vars.typography.fontWeight
vars.typography.lineHeight
```

**classes** - Pre-defined utility classes:

```typescript
// Common classes available
classes.container;
classes.flexCenter;
classes.stack;
// Check the actual theme package for full list
```

#### Usage Example

```typescript
import { vars, classes } from "@nugudi/themes";
import { style } from "@vanilla-extract/css";

// Use pre-defined classes when available
export const container = classes.container;

// Use design tokens for custom styles
export const customCard = style({
  backgroundColor: vars.colors.$scale.whiteAlpha[100],
  borderRadius: vars.box.radii.lg,
  padding: vars.box.spacing[16],
  boxShadow: vars.box.shadows.sm,
});
```

### Assets (`@nugudi/assets-icons`)

```typescript
// Icon components - Import individual icons directly
import { AppleIcon, HeartIcon, CalendarIcon } from '@nugudi/assets-icons';
import { ChevronRightIcon, ArrowRightIcon } from '@nugudi/assets-icons';
import { CoinIcon } from '@nugudi/assets-icons';

// Use icons as components
<AppleIcon />
<HeartIcon />
<CalendarIcon />
<ChevronRightIcon />

// Example usage in NavigationItem
<NavigationItem
  leftIcon={<CoinIcon />}
  rightIcon={<ArrowRightIcon />}
>
  Content
</NavigationItem>
```

---

## 🏛️ Architecture Patterns

### Domain-Based DDD Structure

```
apps/web/
├── app/                           # Next.js App Router
│   ├── (auth)/                   # Protected routes
│   │   └── profile/             # Profile page
│   └── (public)/                 # Public routes
│       └── auth/
│           ├── sign-in/         # Sign in page
│           └── sign-up/         # Sign up page
├── src/
│   ├── di/                       # 🆕 Dependency Injection Containers
│   │   ├── auth-server-container.ts    # Server DI (Stateless)
│   │   └── auth-client-container.ts    # Client DI (Singleton)
│   ├── domains/                  # 🆕 DDD Domain Layer
│   │   ├── auth/                # Auth domain
│   │   │   ├── repositories/   # 🆕 Data Access Layer
│   │   │   │   └── auth-repository.ts
│   │   │   ├── services/       # 🆕 Business Logic Layer
│   │   │   │   └── auth-service.ts
│   │   │   ├── actions/        # Server Actions
│   │   │   ├── types/          # Domain types
│   │   │   ├── hooks/          # Domain hooks
│   │   │   └── ui/             # Presentation Layer
│   │   │       ├── views/
│   │   │       ├── sections/
│   │   │       └── components/
│   │   ├── user/               # User domain
│   │   │   ├── repositories/   # 🆕
│   │   │   ├── services/       # 🆕
│   │   │   ├── types/
│   │   │   ├── hooks/
│   │   │   └── ui/
│   │   ├── benefit/            # Simple domain (no repositories/services yet)
│   │   │   └── ui/
│   │   ├── cafeteria/          # Cafeteria domain
│   │   │   ├── home/
│   │   │   ├── detail/
│   │   │   └── review/
│   │   └── stamp/
│   │       └── ui/
│   └── shared/                  # Shared Infrastructure & Adapters
│       ├── infrastructure/     # 🆕 Infrastructure Layer
│       │   ├── http/          # HttpClient, AuthenticatedHttpClient
│       │   │   ├── http-client.interface.ts
│       │   │   ├── fetch-http-client.ts
│       │   │   ├── authenticated-http-client.ts
│       │   │   ├── token-provider.interface.ts
│       │   │   ├── server-token-provider.ts
│       │   │   └── client-token-provider.ts
│       │   ├── storage/       # SessionManager
│       │   │   ├── session-manager.ts (interface)
│       │   │   ├── server-session-manager.ts
│       │   │   └── client-session-manager.ts
│       │   ├── logging/       # Logger
│       │   │   └── logger.ts
│       │   └── configs/       # TanStack Query, PWA
│       │       ├── tanstack-query/
│       │       └── pwa/
│       └── interface-adapters/ # 🆕 UI Interface Adapters
│           ├── components/    # Shared components (AppHeader, etc)
│           ├── providers/     # Providers
│           ├── sections/      # Shared sections
│           └── styles/        # Global styles
└── tests/                      # Test files
```

### Component Organization Pattern

Each domain follows this structure:

- **components/**: Smallest reusable UI pieces
- **sections/**: Composed components forming page sections
- **views/**: Complete page views

#### Component Folder Structure

Each component MUST follow this folder structure:

```
component-name/
├── index.tsx        # Component implementation
├── index.css.ts     # Vanilla Extract styles
└── types.ts         # Type definitions (optional)
```

```typescript
// Domain component structure example
// src/domains/auth/sign-up/ui/components/sign-up-form/index.tsx
interface SignUpFormProps {
  // Props interface
}

export const SignUpForm = (props: SignUpFormProps) => {
  // Component implementation
};

// src/domains/auth/sign-up/ui/components/sign-up-form/index.css.ts
import { style } from "@vanilla-extract/css";
import { vars } from "@nugudi/themes";

export const formContainer = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.box.spacing[16],
});
```

### Store Pattern with Zustand

```typescript
// domains/auth/sign-up/stores/use-sign-up-store.ts
interface SignUpStore {
  step: number;
  formData: SignUpFormData;
  setStep: (step: number) => void;
  setFormData: (data: Partial<SignUpFormData>) => void;
}

export const useSignUpStore = create<SignUpStore>((set) => ({
  // Store implementation
}));
```

---

## 🎨 Styling Guidelines

### 🚨 CRITICAL: Style Priority Rules

**YOU MUST check and use existing styles in this EXACT order:**

1. **FIRST - Check `classes`**: Always check if a pre-defined class exists
   - `classes.container`, `classes.flexCenter`, etc.
2. **SECOND - Use `vars`**: Use design tokens for all style properties
   - Colors: `vars.colors.$scale.zinc[500]` NOT `#6B7280`
   - Spacing: `vars.box.spacing[16]` NOT `16px`
   - Radius: `vars.box.radii.lg` NOT `12px`
   - Shadows: `vars.box.shadows.sm` NOT custom shadows
3. **LAST - Custom values**: Only for specific requirements
   - Specific widths/heights: `width: "149px"` (when design requires exact size)

**❌ NEVER use hard-coded values when vars exist!**

### Vanilla Extract Usage

```typescript
// ✅ CORRECT - Always prioritize existing theme values
// index.css.ts
import { style } from "@vanilla-extract/css";
import { vars, classes } from "@nugudi/themes";

// FIRST: Check if there's a pre-defined class
export const container = classes.container; // If exists

// SECOND: Use design tokens from vars
export const customCard = style({
  // Always use vars for consistent design
  padding: vars.box.spacing[16], // NOT: padding: '16px'
  borderRadius: vars.box.radii.lg, // NOT: borderRadius: '12px'
  backgroundColor: vars.colors.$scale.whiteAlpha[100], // NOT: backgroundColor: 'white'
  boxShadow: vars.box.shadows.sm, // NOT: boxShadow: '0 1px 3px rgba(0,0,0,0.1)'

  // Only use custom values when absolutely necessary
  width: "149px", // OK if specific requirement
});

// Component file
import * as styles from "./index.css";

<div className={styles.customCard}>Content</div>;
```

### CSS Modules for App-specific Styles

```css
/* page.module.css */
.container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
```

---

## 🔌 Backend Integration with DI Containers

### Server-Side Data Fetching (Pages, Server Actions)

```typescript
// app/(auth)/profile/page.tsx
import { createAuthServerContainer } from '@/src/di/auth-server-container';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import getQueryClient from '@/src/shared/infrastructure/configs/tanstack-query/get-query-client';

const ProfilePage = async () => {
  // 1. DI Container로 서비스 획득
  const container = createAuthServerContainer();
  const userService = container.getUserService();

  // 2. 서버사이드에서 데이터 prefetch
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['user', 'profile'],
    queryFn: () => userService.getProfile()
  });

  // 3. HydrationBoundary로 클라이언트에 전달
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProfileView />
    </HydrationBoundary>
  );
};

export default ProfilePage;
```

### Client-Side Data Fetching (Client Components)

```typescript
// domains/user/ui/sections/user-profile-section/index.tsx
'use client';
import { authClientContainer } from '@/src/di/auth-client-container';
import { useSuspenseQuery } from '@tanstack/react-query';

const UserProfileSectionContent = () => {
  // 1. 클라이언트 컨테이너 사용 (Singleton)
  const userService = authClientContainer.getUserService();

  // 2. TanStack Query로 데이터 조회 (Page에서 prefetch한 데이터 재사용)
  const { data } = useSuspenseQuery({
    queryKey: ['user', 'profile'],
    queryFn: () => userService.getProfile()
  });

  return <div>{data.profile.nickname}</div>;
};
```

### Server Action with DI Container

```typescript
// domains/auth/actions/auth-actions.ts
'use server';
import { createAuthServerContainer } from '@/src/di/auth-server-container';

export async function loginWithGoogle(code: string) {
  const container = createAuthServerContainer();
  const authService = container.getAuthService();

  const result = await authService.loginWithOAuth('google', code, '/auth/callback/google');

  return result;
}
```

### Form Handling with React Hook Form

```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema } from "../schemas/sign-up-schema";

const form = useForm({
  resolver: zodResolver(signUpSchema),
  defaultValues: {
    email: "",
    password: "",
  },
});
```

---

## 🧹 Code Quality with Biome

### Biome Configuration

```bash
# Format code
pnpm biome format --write .

# Lint code
pnpm biome lint --write .

# Check everything
pnpm biome check --write .
```

### Biome Rules

- **Import sorting**: Automatic with Biome
- **Formatting**: Consistent across monorepo
- **Linting**: Strict TypeScript rules
- **NO ESLint/Prettier**: Biome handles everything

---

## 📝 Naming Conventions

### File & Folder Naming

#### Folder Structure Rules

```
✅ CORRECT Component Structure:
button/                  # Component folder (kebab-case)
├── index.tsx           # Main component file
├── index.css.ts        # Vanilla Extract styles
└── types.ts            # Type definitions (optional)

sign-up-form/           # Multi-word component folder
├── index.tsx
├── index.css.ts
└── steps/              # Sub-components folder
    ├── email-form/
    │   ├── index.tsx
    │   └── index.css.ts
    └── password-form/
        ├── index.tsx
        └── index.css.ts
```

#### File Naming Rules

```
✅ CORRECT:
- kebab-case/            # All folders use kebab-case
- index.tsx              # Main component/export files
- index.css.ts           # Vanilla Extract style files
- use-auth.ts            # Hook files (kebab-case)
- types.ts               # Type definition files

❌ WRONG:
- MyComponent.tsx        # NO PascalCase files
- myComponent.tsx        # NO camelCase files
- my_component.tsx       # NO snake_case
- Button.tsx             # NO component name as filename (use index.tsx)
- styles.css.ts          # NO other names for styles (use index.css.ts)
```

### Code Naming

```typescript
// Components: PascalCase
export const MyComponent: React.FC = () => {};

// Props: ComponentName + Props
interface MyComponentProps {}

// Hooks: camelCase with 'use' prefix
export function useMyCustomHook() {}

// Event handlers: on + Action + Target
const onClickSubmit = () => {};
const onChangeInput = () => {};

// Stores: use + Feature + Store
export const useSignUpStore = () => {};
```

---

## 🚀 Development Workflow

### Starting Development

```bash
# Install dependencies
pnpm install

# Start development (all apps)
pnpm dev

# Start specific app
pnpm dev --filter=web

# Build packages first, then apps
pnpm build
```

### Adding New Features

1. **Check packages first**: Can you use existing components/hooks?
2. **Follow domain structure**: Place code in appropriate domain
3. **Use TypeScript strictly**: No any types
4. **Apply Biome**: Format and lint before committing
5. **Write tests**: Unit tests for logic, integration tests for features

### Testing Strategy

```bash
# Unit tests
pnpm test

# Type checking
pnpm check-types

# Linting
pnpm lint

# Component testing in Storybook
pnpm storybook --filter=ui
```

---

## ⚠️ Critical Rules

### DO's ✅

- **ALWAYS** use packages from `packages/` folder
- **ALWAYS** use Biome for formatting/linting
- **ALWAYS** use kebab-case for folders, index.tsx for main files
- **ALWAYS** use TanStack Query for data fetching
- **ALWAYS** use existing components from packages
- **ALWAYS** follow domain-based architecture
- **ALWAYS** write tests for new features
- **ALWAYS** use TypeScript strict mode

### DON'Ts ❌

- **NEVER** use ESLint or Prettier (use Biome)
- **NEVER** bypass DI Containers (직접 Service/Repository 인스턴스 생성하지 말것)
- **NEVER** use HttpClient directly (always use through DI Container)
- **NEVER** create components that exist in packages
- **NEVER** use PascalCase for file/folder names (except index.tsx)
- **NEVER** use inline styles (use Vanilla Extract)
- **NEVER** add Co-Author lines in commits
- **NEVER** use any type in TypeScript
- **NEVER** skip tests for new features
- **NEVER** mix server and client containers (서버는 서버 컨테이너, 클라이언트는 클라이언트 컨테이너)
- **NEVER** create new instances of Client Container (항상 singleton 사용)

---

## 📚 Package Documentation

### Available Packages

```typescript
// Component Packages
@nugudi/react-components-button
@nugudi/react-components-input
@nugudi/react-components-chip
@nugudi/react-components-layout
@nugudi/react-components-navigation-item
@nugudi/react-components-switch
@nugudi/react-components-tab
@nugudi/react-components-textarea
@nugudi/react-components-input-otp
@nugudi/react-components-step-indicator
@nugudi/react-components-menu-card
@nugudi/react-components-bottom-sheet
@nugudi/react-components-backdrop

// Hook Packages
@nugudi/react-hooks-button
@nugudi/react-hooks-switch
@nugudi/react-hooks-toggle
@nugudi/react-hooks-use-stepper

// Core Packages
@nugudi/types                // 🆕 Shared TypeScript types
@nugudi/themes               // Design tokens
@nugudi/assets-icons         // Icon components
@nugudi/ui                   // Storybook UI documentation
```

### Import Examples

```typescript
// Component usage - All named exports
import { Button } from "@nugudi/react-components-button";
import { Box, Flex } from "@nugudi/react-components-layout";

// Hook usage
import { useToggle } from "@nugudi/react-hooks-toggle";
import { useStepper } from "@nugudi/react-hooks-use-stepper";

// Types usage
import type { ApiResponse } from "@nugudi/types";

// Theme usage
import { vars } from "@nugudi/themes";

// Icon usage - Import individual icons
import { AppleIcon, HeartIcon, ArrowRightIcon } from "@nugudi/assets-icons";

// DI Container usage
// Server-side
import { createAuthServerContainer } from '@/src/di/auth-server-container';

// Client-side
import { authClientContainer } from '@/src/di/auth-client-container';
```

---

## 🔍 Quick Reference

### Project Structure

- **Apps**: `web` (Next.js 15)
- **Architecture**: Domain-based
- **Styling**: Vanilla Extract + CSS Modules
- **State**: TanStack Query + Zustand
- **Backend**: External API
- **Linting**: Biome (NOT ESLint/Prettier)

### Common Commands

```bash
pnpm dev                     # Start development
pnpm build                   # Build all
pnpm biome check --write .   # Format & lint
pnpm test                    # Run tests
pnpm check-types            # Type checking
pnpm commit                 # Commit with commitizen
```

### Import Priority

1. `@nugudi/react-components-*` - React components
2. `@nugudi/react-hooks-*` - React hooks
3. `@nugudi/api` - API client & mocks
4. `@nugudi/themes` - Design tokens
5. `@nugudi/assets-icons` - Icons
6. Domain-specific code
7. Shared utilities

### Import Rules

#### Within Same Domain - Use Relative Imports

```typescript
// ✅ CORRECT - Within same domain (e.g., auth/sign-up)
// From: src/domains/auth/sign-up/ui/views/sign-up-view/index.tsx
import { SignUpForm } from "../../components/sign-up-form";
import { useSignUpStore } from "../../../stores/use-sign-up-store";
import { signUpSchema } from "../../../schemas/sign-up-schema";
import type { SignUpFormData } from "../../../types/sign-up";

// ✅ CORRECT - From section to component in same domain
// From: src/domains/auth/sign-up/ui/sections/sign-up-section/index.tsx
import { EmailForm } from "../../components/sign-up-form/steps/email-form";
import { PasswordForm } from "../../components/sign-up-form/steps/password-form";

// ✅ CORRECT - Within same folder
// From: src/domains/auth/sign-up/ui/components/sign-up-form/steps/email-form/index.tsx
import * as styles from "./index.css";
```

#### Cross-Domain or from App - Use Absolute Imports

```typescript
// ✅ CORRECT - Cross-domain imports
// From: src/domains/cafeteria/...
import { useAuth } from "@/src/domains/auth/hooks/use-auth";

// ✅ CORRECT - From app pages (public routes)
// From: app/(public)/auth/sign-up/page.tsx
import { SignUpView } from "@/src/domains/auth/sign-up/ui/views/sign-up-view";

// ✅ CORRECT - From app pages (protected routes)
// From: app/(auth)/profile/page.tsx
import { ProfilePageView } from "@/src/domains/auth/profile/ui/views/profile-page-view";
```

#### Package Imports - Always Use Package Path

```typescript
// ✅ CORRECT - Always use package imports for packages
import { Button } from "@nugudi/react-components-button";
import { vars } from "@nugudi/themes";

// ❌ WRONG - Never use relative imports for packages
import { Button } from "../../../../../packages/react/components/button"; // NO!
```

---

## 📋 Package Setup Requirements

### When Using Any `@nugudi` Package Component

When you import any component from `@nugudi` packages, you MUST complete TWO setup steps:

#### Step 1: Add Package to package.json

```json
// In apps/web/package.json
{
  "dependencies": {
    "@nugudi/react-components-layout": "workspace:*",
    "@nugudi/react-components-button": "workspace:*",
    "@nugudi/react-components-input": "workspace:*"
    // Add any other packages you use
  }
}
```

#### Step 2: Import Package Styles in FDS Module

```css
/* In apps/web/src/shared/styles/fds.module.css */
@import "@nugudi/themes/themes.css";
@import "@nugudi/react-components-layout/style.css";
@import "@nugudi/react-components-button/style.css";
@import "@nugudi/react-components-input/style.css";
/* Add style.css for EVERY package component you use */
```

### ⚠️ CRITICAL: Complete Setup Checklist

When using ANY `@nugudi/react-components-*` package:

1. ✅ **Check package.json**: Ensure the package is listed in dependencies
2. ✅ **Check fds.module.css**: Ensure the package's `style.css` is imported
3. ✅ **Run `pnpm install`**: After adding new packages to package.json
4. ✅ **Verify styles load**: Component should render with proper styles

### Example: Adding a New Component

If you want to use `@nugudi/react-components-textarea`:

```typescript
// 1. First, add to package.json dependencies:
"@nugudi/react-components-textarea": "workspace:*",

// 2. Then, add to fds.module.css:
@import '@nugudi/react-components-textarea/style.css';

// 3. Run pnpm install:
pnpm install

// 4. Now you can use it:
import { Textarea } from '@nugudi/react-components-textarea';
```

### Package Style Import Pattern

```css
/* In apps/web/src/shared/styles/fds.module.css */

/* 1. ALWAYS import themes first (required) */
@import "@nugudi/themes/themes.css";

/* 2. Import layout package (contains layout AND typography components) */
@import "@nugudi/react-components-layout/style.css";
/* Layout includes: Box, Flex, VStack, HStack, Stack, Grid, GridItem, Divider */
/* Typography includes: Heading, Title, Body, Emphasis, Logo */

/* 3. Import individual component packages as needed */
@import "@nugudi/react-components-[component-name]/style.css";
/* Examples: button, input, chip, tab, switch, textarea, etc. */
```

### Import Rule Pattern

For ANY `@nugudi/react-components-*` package:

```
Package name: @nugudi/react-components-[name]
Style import: @import '@nugudi/react-components-[name]/style.css';
```

**The pattern is consistent:**

- Package: `@nugudi/react-components-button`
- Style: `@import '@nugudi/react-components-button/style.css';`

- Package: `@nugudi/react-components-input`
- Style: `@import '@nugudi/react-components-input/style.css';`

- Package: `@nugudi/react-components-bottom-sheet`
- Style: `@import '@nugudi/react-components-bottom-sheet/style.css';`

### ❌ Common Mistakes to Avoid

- **Forgetting to import style.css**: Component renders without styles
- **Not adding to package.json**: Import fails with "module not found"
- **Not running pnpm install**: Package not available in node_modules
- **Importing wrong path**: Use `workspace:*` for local packages

## 🏷️ Naming Conventions - Real World Examples

### Domain Entity Naming Consistency

When working with domain entities, maintain consistent naming throughout the codebase:

#### Example: Cafeteria Domain

```typescript
// ✅ CORRECT - Consistent "cafeteria" naming
interface CafeteriaRecommendCardProps {
  cafeteriaId: string;
  cafeteriaName: string;
  cafeteriaAddress: string;
  cafeteriaTime: string;
}

export interface Cafeteria {
  id: string;
  name: string;
  // ...
}

const MOCK_CAFETERIA_LIST: Cafeteria[] = [];

// Link routing
<Link href={`/cafeterias/${cafeteriaId}`}>

// ❌ WRONG - Mixed naming (restaurant/cafeteria)
interface CafeteriaRecommendCardProps {
  restaurantId: string;  // NO! Use cafeteriaId
  restaurantName: string;  // NO! Use cafeteriaName
}
```

#### Example: Benefit Domain

```typescript
// ✅ CORRECT - Consistent "benefit" naming
export const BenefitPageView = () => {};
export const BenefitHighlightSection = () => {};
export const BenefitCard = () => {};

// Routes should match
// app/(auth)/benefits/page.tsx
```

### Import/Export Consistency

```typescript
// ✅ CORRECT - Named exports for ALL components/sections/views
// domains/cafeteria/ui/components/cafeteria-menu-list/index.tsx
export const CafeteriaMenuList = () => {};

// domains/cafeteria/ui/sections/cafeteria-recommend-section/index.tsx
export const CafeteriaRecommendSection = () => {};

// domains/cafeteria/ui/views/cafeteria-home-view/index.tsx
export const CafeteriaHomeView = () => {};

// ✅ CORRECT - Default export ONLY for page.tsx files
// app/page.tsx
import { CafeteriaHomeView } from "@/src/domains/cafeteria/ui/views/cafeteria-home-view";
const HomePage = () => {
  return <CafeteriaHomeView />;
};
export default HomePage;

// ✅ CORRECT - Named exports for hooks and utilities
export const useCafeteriaList = () => {};
export type CafeteriaData = {};
```

## 💡 Best Practices & Development Tips

### DDD Development Guidelines

1. **Use DI Containers**: Always access services through DI containers
   - Server: `createAuthServerContainer()` (새 인스턴스)
   - Client: `authClientContainer` (Singleton)

2. **Layer Separation**: Respect architectural boundaries
   - Presentation → Application → Domain → Infrastructure
   - Never skip layers or reverse dependencies

3. **Repository Pattern**: Data access only
   - Pure API calls
   - No business logic
   - Returns raw data

4. **Service Pattern**: Business logic orchestration
   - Combines multiple repositories
   - Handles complex workflows
   - Manages session/state

5. **Infrastructure Abstraction**: Use interfaces
   - HttpClient interface (not direct fetch)
   - SessionManager interface (not direct localStorage/cookies)
   - TokenProvider interface (environment-agnostic)

### Server vs Client Development

#### Server-Side (Pages, Server Actions)
```typescript
// ✅ DO
const container = createAuthServerContainer();  // New instance per request
const service = container.getAuthService();

// ❌ DON'T
import { AuthServiceImpl } from '@/src/domains/auth/services/auth-service';
const service = new AuthServiceImpl(...);  // Never instantiate directly
```

#### Client-Side (Client Components, Hooks)
```typescript
// ✅ DO
import { authClientContainer } from '@/src/di/auth-client-container';
const service = authClientContainer.getAuthService();  // Use singleton

// ❌ DON'T
const container = new AuthClientContainer();  // Never create new instance
```

### General Development Tips

1. **Package-First**: Always check `packages/` before creating new code
2. **Biome for Code Quality**: Use Biome commands for formatting and linting
3. **TypeScript Strict Mode**: Leverage full type safety
4. **Vanilla Extract for Styles**: Use design tokens from `@nugudi/themes`
5. **Complete Package Setup**: Add to package.json + import styles
6. **Naming Consistency**: Maintain consistent naming within domains
7. **Import Conventions**: Relative within domain, absolute cross-domain
8. **Test All Layers**: Unit tests for all Repository/Service/Infrastructure layers

Remember: This is a **DDD-based, package-first monorepo** - maximize reuse and respect architectural boundaries!

# important-instruction-reminders

Do what has been asked; nothing more, nothing less.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (\*.md) or README files. Only create documentation files if explicitly requested by the User.
