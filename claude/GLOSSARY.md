---
description: "Glossary of technical terms used throughout the documentation"
globs:
  - "**/*"
alwaysApply: true
---

# Glossary

> **Purpose**: Define all technical terms and acronyms used in this codebase
> **Audience**: New developers, AI agents, anyone unfamiliar with technical jargon
> **Related**: [CLAUDE.md](../CLAUDE.md) for entry point

이 문서는 프로젝트 전반에서 사용되는 기술 용어들을 알파벳순으로 정리합니다.

---

## A

### Adapter Pattern
**Korean**: 어댑터 패턴

**Definition**: Entity domain model을 UI-friendly type으로 변환하는 디자인 패턴. Entity에서 7개 이상의 메서드 호출이 필요한 경우 사용.

**When to Use**:
- Entity → UI Type 변환 시 7+ Entity 메서드 호출 필요
- 복잡한 도메인 로직을 UI에서 숨기고 싶을 때
- 타입 안전성과 중앙화된 변환 로직 필요

**Example**:
```typescript
// Entity (Domain)
class BenefitEntity {
  isActive(): boolean { /* ... */ }
  isExpired(): boolean { /* ... */ }
  // ... 7+ methods
}

// Adapter (Presentation)
class BenefitAdapter {
  static toUI(entity: BenefitEntity): BenefitUIType {
    return {
      canApply: entity.isActive() && !entity.isExpired(),
      // ... using 7+ methods
    };
  }
}
```

**Related**:
- [patterns/adapter-basics.md](./patterns/adapter-basics.md)
- [patterns/adapter-implementation.md](./patterns/adapter-implementation.md)

---

### App Router
**Korean**: 앱 라우터

**Definition**: Next.js 13+에서 도입된 새로운 라우팅 시스템. `app/` 디렉토리 기반으로 Server Components를 기본으로 사용.

**Key Features**:
- Server Components by default
- Nested layouts and templates
- Loading UI and error handling
- Server Actions support
- Streaming and Suspense

**Comparison with Pages Router**:
| Feature | App Router | Pages Router |
|---------|-----------|--------------|
| Directory | `app/` | `pages/` |
| Default | Server Component | Client Component |
| Layouts | Built-in | Manual implementation |
| Data Fetching | `async` components | `getServerSideProps` |

**Related**:
- [frontend/page-patterns.md](./frontend/page-patterns.md)

---

## B

### Barrel Export
**Korean**: 배럴 익스포트

**Definition**: `index.ts` 파일에서 여러 모듈을 re-export하는 패턴. 이 프로젝트에서는 **DI Container에서 사용 금지**.

**Why Prohibited**:
- Tree-shaking 불가능 (Webpack이 server/client 코드 구분 못함)
- `server-only` 패키지가 client 번들에 포함 → 빌드 실패
- Client 번들에 불필요한 server 의존성 포함

**Example**:
```typescript
// ❌ WRONG: Barrel export (apps/web/src/domains/user/di/index.ts)
export * from './user-server-container';
export * from './user-client-container';

// Import (causes build failure)
import { getUserClientContainer } from '@user/di'; // ❌ Imports BOTH server+client

// ✅ CORRECT: Direct import
import { getUserClientContainer } from '@/src/domains/user/di/user-client-container';
```

**Related**:
- [ddd/di-client-containers.md](./ddd/di-client-containers.md)
- [ddd/di-server-containers.md](./ddd/di-server-containers.md)

---

### Bounded Context
**Korean**: 바운디드 컨텍스트

**Definition**: DDD에서 하나의 도메인 모델이 적용되는 명확한 경계. 이 프로젝트에는 6개의 bounded context 존재.

**This Project's Bounded Contexts**:
1. **auth** - Authentication & authorization
2. **benefit** - Employee benefits management
3. **cafeteria** - Cafeteria services
4. **notification** - User notifications
5. **stamp** - Loyalty stamp system
6. **user** - User profile management

**Key Rules**:
- MUST NOT import directly between bounded contexts
- Use `@core` for truly shared code
- Each context has own DI Container

**Related**:
- [core/architecture.md](./core/architecture.md)

---

## C

### Clean Architecture
**Korean**: 클린 아키텍처

**Definition**: Robert C. Martin(Uncle Bob)이 제안한 소프트웨어 아키텍처 패턴. 의존성 방향이 외부에서 내부로 향하도록 설계.

**4 Layers in This Project**:
```
Presentation → Domain → Data → Infrastructure
(UI)          (Business) (API)  (Technical)
```

**Layer Dependencies**:
- Presentation depends on Domain
- Domain depends on nothing (pure business logic)
- Data depends on Domain (implements Repository interface)
- Infrastructure provides technical capabilities

**Benefits**:
- Testability (mock dependencies easily)
- Maintainability (clear boundaries)
- Flexibility (swap implementations)
- Scalability (add domains independently)

**Related**:
- [core/architecture.md](./core/architecture.md)

---

### Client Component
**Korean**: 클라이언트 컴포넌트

**Definition**: Next.js App Router에서 브라우저에서 실행되는 React 컴포넌트. `'use client'` 지시어 필요.

**Characteristics**:
- Runs in browser (client-side)
- Can use React hooks (useState, useEffect, etc.)
- Can access browser APIs (window, document, etc.)
- Hydrated from server-rendered HTML

**When to Use**:
- Need interactivity (onClick, onChange, etc.)
- Need browser APIs (localStorage, window, etc.)
- Need React hooks (useState, useEffect, etc.)

**Example**:
```typescript
'use client'; // ✅ Required directive

import { useState } from 'react';

export const Counter = () => {
  const [count, setCount] = useState(0); // ✅ Can use hooks

  return <button onClick={() => setCount(count + 1)}>{count}</button>;
};
```

**Related**:
- [frontend/section-patterns.md](./frontend/section-patterns.md)
- [frontend/view-patterns.md](./frontend/view-patterns.md)

---

### Client DI Container
**Korean**: 클라이언트 DI 컨테이너

**Definition**: 클라이언트 사이드에서 UseCase 의존성을 관리하는 lazy singleton 패턴 컨테이너. `getXXXClientContainer()` 형식.

**Key Characteristics**:
- **Lazy Singleton**: 첫 호출 시 생성, 이후 재사용
- **Client-only**: Browser에서만 실행 (`'use client'` 필요)
- **No Parameters**: 파라미터 없음 (SessionManager 포함)
- **Consistent Cache**: 동일한 인스턴스로 TanStack Query 캐시 일관성 보장

**Example**:
```typescript
// apps/web/src/domains/user/di/user-client-container.ts
let containerInstance: UserClientContainer | null = null;

export const getUserClientContainer = (): UserClientContainer => {
  if (!containerInstance) {
    containerInstance = new UserClientContainer(); // Lazy initialization
  }
  return containerInstance; // Singleton
};
```

**Usage**:
```typescript
'use client';

import { getUserClientContainer } from '@/src/domains/user/di/user-client-container';

export const useGetMyProfile = () => {
  const container = getUserClientContainer(); // ✅ Singleton
  return useSuspenseQuery({
    queryKey: ['user', 'profile'],
    queryFn: () => container.getGetMyProfile().execute(),
  });
};
```

**NEVER**:
- ❌ Use in Server Components (causes state leakage between SSR requests)
- ❌ Create new instance (`new UserClientContainer()` - breaks singleton)

**Related**:
- [ddd/di-client-containers.md](./ddd/di-client-containers.md)
- [patterns/query-hooks.md](./patterns/query-hooks.md)

---

## D

### DDD (Domain-Driven Design)
**Korean**: 도메인 주도 설계

**Definition**: Eric Evans가 제안한 소프트웨어 설계 방법론. 비즈니스 도메인을 중심으로 코드를 구조화.

**Core Concepts**:
- **Bounded Context**: 도메인 모델의 명확한 경계
- **Entity**: 고유 식별자를 가진 도메인 객체
- **Value Object**: 식별자 없는 불변 객체
- **Repository**: 데이터 접근 추상화
- **UseCase**: 비즈니스 로직 오케스트레이션

**This Project's DDD Structure**:
```
apps/web/src/domains/
├── auth/           # Bounded Context
│   ├── domain/     # Entities, UseCases, Repository interfaces
│   ├── data/       # Repository implementations
│   └── presentation/ # UI components
└── ...
```

**Related**:
- [ddd/entity-patterns.md](./ddd/entity-patterns.md)
- [ddd/usecase-patterns.md](./ddd/usecase-patterns.md)

---

### Dependency Inversion Principle
**Korean**: 의존성 역전 원칙

**Definition**: SOLID 원칙의 D. 고수준 모듈이 저수준 모듈에 의존하지 않고, 둘 다 추상화에 의존해야 함.

**Example in This Project**:
```typescript
// ❌ WRONG: High-level UseCase depends on low-level HttpClient
class GetUserUseCase {
  constructor(private httpClient: HttpClient) {} // ❌ Direct dependency
  execute() {
    return this.httpClient.get('/users'); // ❌ Knows about HTTP
  }
}

// ✅ CORRECT: UseCase depends on abstraction (Repository interface)
// Domain Layer
interface UserRepository {
  getById(id: string): Promise<UserEntity>;
}

class GetUserUseCase {
  constructor(private repository: UserRepository) {} // ✅ Interface
  execute(id: string) {
    return this.repository.getById(id); // ✅ Doesn't know about HTTP
  }
}

// Data Layer
class UserRepositoryImpl implements UserRepository {
  constructor(private httpClient: HttpClient) {}
  async getById(id: string): Promise<UserEntity> {
    const dto = await this.httpClient.get(`/users/${id}`);
    return UserMapper.toDomain(dto);
  }
}
```

**Benefits**:
- Testability (mock Repository, not HttpClient)
- Flexibility (swap implementations)
- Domain purity (no infrastructure concerns)

**Related**:
- [ddd/repository-patterns.md](./ddd/repository-patterns.md)

---

### Design Tokens
**Korean**: 디자인 토큰

**Definition**: 디자인 시스템의 최소 단위 값(색상, 간격, 폰트 크기 등)을 중앙화한 변수. `@nugudi/themes` 패키지에서 관리.

**Categories**:
```typescript
import { vars } from '@nugudi/themes';

// Colors
vars.color.primary.blue500;
vars.color.semantic.error;

// Spacing
vars.box.spacing[4];   // 4px
vars.box.spacing[16];  // 16px

// Typography
vars.font.size.h1;
vars.font.weight.bold;

// Radius
vars.border.radius.medium;
```

**Why Use Design Tokens**:
- Visual consistency across entire app
- Centralized theme management
- Type-safe styling (TypeScript autocomplete)
- Easy theme switching (dark mode)

**NEVER**:
- ❌ Hardcode colors: `color: '#3B82F6'`
- ❌ Hardcode spacing: `padding: '16px'`
- ❌ Magic numbers: `fontSize: 18`

**ALWAYS**:
- ✅ Use tokens: `color: vars.color.primary.blue500`
- ✅ Use tokens: `padding: vars.box.spacing[16]`
- ✅ Use tokens: `fontSize: vars.font.size.b1`

**Related**:
- [packages/package-usage.md](./packages/package-usage.md)

---

### DI Container (Dependency Injection Container)
**Korean**: 의존성 주입 컨테이너

**Definition**: UseCase와 그 의존성(Repository, HttpClient 등)을 생성하고 관리하는 팩토리 패턴 객체.

**Two Types in This Project**:

1. **Server DI Container**: `createXXXServerContainer(sessionManager)`
   - Factory pattern (새 인스턴스 생성)
   - Server Components/Pages에서 사용
   - SessionManager 파라미터 필요
   - Request-level isolation

2. **Client DI Container**: `getXXXClientContainer()`
   - Lazy singleton pattern (재사용)
   - Client Components/Hooks에서 사용
   - 파라미터 없음
   - TanStack Query 캐시 일관성

**Benefits**:
- Loose coupling (UseCases don't instantiate dependencies)
- Testability (easy to mock dependencies)
- Centralized dependency management
- Type safety (TypeScript autocomplete)

**Example**:
```typescript
// Server Component
const sessionManager = new ServerSessionManager();
const container = createUserServerContainer(sessionManager);
const useCase = container.getGetMyProfile();

// Client Hook
const container = getUserClientContainer();
const useCase = container.getGetMyProfile();
```

**Related**:
- [ddd/di-server-containers.md](./ddd/di-server-containers.md)
- [ddd/di-client-containers.md](./ddd/di-client-containers.md)

---

### DTO (Data Transfer Object)
**Korean**: 데이터 전송 객체

**Definition**: 네트워크를 통해 전송되는 데이터 구조. 이 프로젝트에서는 API response를 나타내는 snake_case 타입.

**Characteristics**:
- snake_case naming (API convention)
- No methods (plain data)
- Nullable fields (`| null`)
- Used in Data layer only

**DTO → Entity Mapping**:
```typescript
// DTO (snake_case, from API)
interface BenefitDTO {
  benefit_id: string;
  benefit_name: string;
  is_active: boolean;
  created_at: string;
}

// Entity (camelCase, domain model)
class BenefitEntity {
  constructor(
    private benefitId: string,
    private benefitName: string,
    private isActive: boolean,
    private createdAt: Date,
  ) {}

  canApply(): boolean {
    return this.isActive && !this.isExpired();
  }
}

// Mapper
class BenefitMapper {
  static toDomain(dto: BenefitDTO): BenefitEntity {
    return new BenefitEntity(
      dto.benefit_id,
      dto.benefit_name,
      dto.is_active,
      new Date(dto.created_at),
    );
  }
}
```

**Related**:
- [ddd/dto-mapper.md](./ddd/dto-mapper.md)

---

## E

### Entity
**Korean**: 엔티티

**Definition**: DDD의 핵심 개념. 고유 식별자를 가지며 비즈니스 로직을 포함하는 도메인 모델.

**Characteristics**:
- Unique identifier (id)
- Business logic (methods)
- Immutable (no setters)
- Boolean-based methods (`isActive()`, `canApply()`)
- Private constructor + factory method

**Example**:
```typescript
export class BenefitEntity {
  private constructor(
    private readonly benefitId: string,
    private readonly name: string,
    private readonly status: 'ACTIVE' | 'INACTIVE',
    private readonly expiresAt: Date,
  ) {}

  // Factory method
  static create(benefitId: string, name: string, status: string, expiresAt: Date): BenefitEntity {
    if (!benefitId) throw new Error('benefitId is required');
    return new BenefitEntity(benefitId, name, status as any, expiresAt);
  }

  // Business logic
  isActive(): boolean {
    return this.status === 'ACTIVE';
  }

  isExpired(): boolean {
    return new Date() > this.expiresAt;
  }

  canApply(): boolean {
    return this.isActive() && !this.isExpired();
  }

  // Getters (no setters!)
  getId(): string { return this.benefitId; }
  getName(): string { return this.name; }
}
```

**Related**:
- [ddd/entity-patterns.md](./ddd/entity-patterns.md)

---

### ErrorBoundary
**Korean**: 에러 바운더리

**Definition**: React에서 하위 컴포넌트 트리의 JavaScript 에러를 catch하는 컴포넌트. UI 전체가 크래시되는 것을 방지.

**This Project Usage**:
```typescript
// apps/web/src/app/(main)/user/_sections/profile-section.tsx
'use client';

import { ErrorBoundary } from '@/src/core/ui/error-boundary';

export const ProfileSection = () => {
  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      <Suspense fallback={<ProfileSkeleton />}>
        <ProfileContent />
      </Suspense>
    </ErrorBoundary>
  );
};
```

**Benefits**:
- Fault isolation (error doesn't crash entire app)
- User-friendly error UI (instead of blank screen)
- Error logging (track production errors)

**MUST**: Implement in Section components (data-fetching boundary)

**Related**:
- [frontend/section-patterns.md](./frontend/section-patterns.md)

---

## H

### Hydration
**Korean**: 하이드레이션

**Definition**: Server-rendered HTML에 React가 event handler를 attach하는 과정. SSR 후 클라이언트에서 interactive하게 만드는 단계.

**Process**:
1. **Server**: React renders to HTML string
2. **Browser**: Receives HTML, displays immediately (fast FCP)
3. **Hydration**: React attaches event handlers (becomes interactive)

**Example**:
```typescript
// Server Component (Page)
const MyPage = async () => {
  // 1. Server prefetches data
  await queryClient.prefetchQuery({ ... });

  return (
    // 2. HydrationBoundary dehydrates data
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MyView />
    </HydrationBoundary>
  );
};

// Client Component (View)
'use client';
const MyView = () => {
  // 3. Client hydrates data (no re-fetch!)
  const { data } = useQuery({ ... }); // Uses prefetched data
  return <div>{data.name}</div>;
};
```

**Why Important**:
- Fast initial render (server HTML)
- No loading spinner on mount (data prefetched)
- SEO-friendly (HTML content visible to crawlers)

**Related**:
- [frontend/page-patterns.md](./frontend/page-patterns.md)

---

### HttpClient
**Korean**: HTTP 클라이언트

**Definition**: Infrastructure layer에서 HTTP 요청을 처리하는 클래스. axios, fetch 등을 wrapping.

**This Project Implementation**:
```typescript
// src/core/infrastructure/http/http-client.ts
export class HttpClient {
  constructor(private sessionManager: SessionManager) {}

  async get<T>(url: string): Promise<T> {
    const token = await this.sessionManager.getAccessToken();
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.json();
  }

  // post, put, delete, patch...
}
```

**Usage in Repository**:
```typescript
class UserRepositoryImpl implements UserRepository {
  constructor(private httpClient: HttpClient) {}

  async getById(id: string): Promise<UserEntity> {
    const dto = await this.httpClient.get<UserDTO>(`/users/${id}`);
    return UserMapper.toDomain(dto);
  }
}
```

**Benefits**:
- Centralized HTTP logic (auth, error handling)
- Easy to mock in tests
- Automatic token refresh
- Type-safe requests

**Related**:
- [ddd/infrastructure-layer.md](./ddd/infrastructure-layer.md)

---

## M

### Mapper
**Korean**: 매퍼

**Definition**: 간단한 타입 변환 함수. Entity → UI 변환이 7개 미만의 메서드 호출일 때 사용.

**When to Use**:
- Entity → UI 변환 시 < 7 메서드 호출
- 단순한 property mapping
- DTO → Entity 변환 (Data layer)

**Example**:
```typescript
// Simple mapping (< 7 method calls)
const toUI = (entity: BenefitEntity): BenefitUIType => ({
  id: entity.getId(),
  name: entity.getName(),
  canApply: entity.canApply(), // Only 3 method calls
});

// vs. Adapter (7+ method calls)
class BenefitAdapter {
  static toUI(entity: BenefitEntity): BenefitUIType {
    // 7+ method calls requiring abstraction
  }
}
```

**Comparison**:
| | Mapper | Adapter |
|---|--------|---------|
| **Method Calls** | < 7 | 7+ |
| **Location** | Simple function | Class with methods |
| **JSDoc** | Optional | Required |
| **When** | Simple mapping | Complex transformation |

**Related**:
- [patterns/adapter-basics.md](./patterns/adapter-basics.md)

---

### Monorepo
**Korean**: 모노레포

**Definition**: 여러 프로젝트/패키지를 하나의 git repository에서 관리하는 구조. 이 프로젝트는 Turbo + pnpm 사용.

**This Project Structure**:
```
nugudi/
├── apps/
│   └── web/                # Next.js application
├── packages/
│   ├── react/
│   │   ├── components/     # Shared React components
│   │   └── hooks/          # Shared React hooks
│   └── themes/             # Design tokens
└── package.json            # Root workspace configuration
```

**Benefits**:
- Code sharing between packages
- Atomic commits across projects
- Consistent versioning
- Centralized tooling (ESLint, TypeScript)

**Related**:
- [packages/monorepo-structure.md](./packages/monorepo-structure.md)

---

## P

### Presentation Layer
**Korean**: 프레젠테이션 레이어

**Definition**: Clean Architecture의 최외곽 레이어. UI 컴포넌트와 사용자 상호작용 처리.

**Responsibilities**:
- UI rendering (Pages, Views, Sections, Components)
- User interaction handling
- Data display (using UseCases via DI Container)

**4-Layer Component Hierarchy**:
```
Page (Server Component)
  ↓
View (Client Component, layout only)
  ↓
Section (Client Component, data fetch)
  ↓
Component (Presentational, props-driven)
```

**NEVER Contains**:
- ❌ Business logic (belongs in Domain layer)
- ❌ Direct API calls (use Repository via UseCase)
- ❌ Database access

**Related**:
- [frontend/component-hierarchy.md](./frontend/component-hierarchy.md)

---

## R

### Repository Pattern
**Korean**: 리포지토리 패턴

**Definition**: 데이터 접근 로직을 추상화하는 패턴. Interface는 Domain layer, Implementation은 Data layer.

**Structure**:
```typescript
// Domain Layer: Interface
export interface UserRepository {
  getById(id: string): Promise<UserEntity>;
  getAll(): Promise<UserEntity[]>;
}

// Data Layer: Implementation
export class UserRepositoryImpl implements UserRepository {
  constructor(private httpClient: HttpClient) {}

  async getById(id: string): Promise<UserEntity> {
    const dto = await this.httpClient.get<UserDTO>(`/users/${id}`);
    return UserMapper.toDomain(dto);
  }

  async getAll(): Promise<UserEntity[]> {
    const dtos = await this.httpClient.get<UserDTO[]>('/users');
    return dtos.map(UserMapper.toDomain);
  }
}
```

**Benefits**:
- Dependency Inversion (UseCase depends on interface, not implementation)
- Testability (mock Repository in UseCase tests)
- Flexibility (swap implementations without changing UseCases)

**Related**:
- [ddd/repository-patterns.md](./ddd/repository-patterns.md)

---

## S

### Server Component
**Korean**: 서버 컴포넌트

**Definition**: Next.js App Router에서 서버에서만 실행되는 React 컴포넌트. `'use client'` 없이 기본값.

**Characteristics**:
- Runs only on server (never in browser)
- Can access server-only resources (database, filesystem, secrets)
- Can be async (await data fetching)
- Zero JavaScript sent to client (smaller bundle)

**When to Use**:
- Data prefetching (SSR)
- SEO-critical pages
- Server-only resource access

**Example**:
```typescript
// No 'use client' directive = Server Component
const MyPage = async () => {
  const sessionManager = new ServerSessionManager();
  const container = createUserServerContainer(sessionManager);

  // ✅ Can await in Server Component
  await queryClient.prefetchQuery({
    queryKey: ['user', 'profile'],
    queryFn: () => container.getGetMyProfile().execute(),
  });

  return <HydrationBoundary state={dehydrate(queryClient)}>...</HydrationBoundary>;
};
```

**NEVER**:
- ❌ Use React hooks (useState, useEffect, etc.)
- ❌ Use browser APIs (window, document, localStorage)
- ❌ Use Client DI Container (`getXXXClientContainer()`)

**ALWAYS**:
- ✅ Use Server DI Container (`createXXXServerContainer()`)

**Related**:
- [frontend/page-patterns.md](./frontend/page-patterns.md)

---

### Server DI Container
**Korean**: 서버 DI 컨테이너

**Definition**: 서버 사이드에서 UseCase 의존성을 관리하는 factory 패턴 컨테이너. `createXXXServerContainer(sessionManager)` 형식.

**Key Characteristics**:
- **Factory Pattern**: 매 호출마다 새 인스턴스 생성
- **Server-only**: Server Components/Pages에서만 사용
- **SessionManager Required**: 파라미터로 전달
- **Stateless**: Request-level lifecycle (자동 cleanup)

**Example**:
```typescript
// apps/web/src/domains/user/di/user-server-container.ts
export const createUserServerContainer = (
  sessionManager: SessionManager
): UserServerContainer => {
  // Factory: always creates new instance
  return new UserServerContainer(sessionManager);
};
```

**Usage**:
```typescript
// Server Component
const MyPage = async () => {
  const sessionManager = new ServerSessionManager(); // Per-request
  const container = createUserServerContainer(sessionManager); // Factory
  const useCase = container.getGetMyProfile();

  const data = await useCase.execute(); // SSR prefetch
  return <div>{data.name}</div>;
};
```

**Why Factory Pattern**:
- Prevents memory leaks (no accumulated state)
- Avoids state pollution (concurrent requests isolated)
- Ensures thread safety (each request has own instance)
- Automatic cleanup (container lifecycle = request lifecycle)

**NEVER**:
- ❌ Use in Client Components (use Client Container instead)
- ❌ Cache instance globally (breaks request isolation)

**Related**:
- [ddd/di-server-containers.md](./ddd/di-server-containers.md)

---

### SessionManager
**Korean**: 세션 매니저

**Definition**: Infrastructure layer에서 사용자 인증 토큰을 관리하는 클래스. Server/Client 각각 구현체 존재.

**Two Implementations**:

1. **ServerSessionManager**: Next.js cookies API 사용
   ```typescript
   class ServerSessionManager {
     async getAccessToken(): Promise<string | null> {
       const cookieStore = cookies(); // Next.js server API
       return cookieStore.get('accessToken')?.value ?? null;
     }
   }
   ```

2. **ClientSessionManager**: Browser localStorage 사용
   ```typescript
   class ClientSessionManager {
     getAccessToken(): string | null {
       return localStorage.getItem('accessToken');
     }
   }
   ```

**Usage in DI Container**:
```typescript
// Server Container
const sessionManager = new ServerSessionManager();
const httpClient = new HttpClient(sessionManager);

// Client Container
const sessionManager = new ClientSessionManager();
const httpClient = new HttpClient(sessionManager);
```

**Related**:
- [ddd/infrastructure-layer.md](./ddd/infrastructure-layer.md)

---

### SSR (Server-Side Rendering)
**Korean**: 서버 사이드 렌더링

**Definition**: React 컴포넌트를 서버에서 HTML로 렌더링해서 클라이언트에 전송하는 기술.

**Benefits**:
- **Fast FCP**: Browser receives HTML immediately (no JS execution needed)
- **SEO-friendly**: Search engines can crawl HTML content
- **Perceived performance**: User sees content faster

**This Project SSR Pattern**:
```typescript
// 1. Server Component prefetches data
const MyPage = async () => {
  const queryClient = createQueryClient();
  await queryClient.prefetchQuery({ ... }); // SSR prefetch

  // 2. Dehydrate data (serialize for client)
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MyView />
    </HydrationBoundary>
  );
};

// 3. Client Component hydrates (reuses prefetched data)
'use client';
const MyView = () => {
  const { data } = useQuery({ ... }); // No re-fetch! Uses SSR data
  return <div>{data}</div>;
};
```

**Related**:
- [frontend/page-patterns.md](./frontend/page-patterns.md)

---

### Suspense
**Korean**: 서스펜스

**Definition**: React 18+에서 비동기 작업(데이터 fetch, code split)이 완료될 때까지 fallback UI를 보여주는 컴포넌트.

**This Project Usage**:
```typescript
'use client';

import { Suspense } from 'react';

export const ProfileSection = () => {
  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <ProfileContent /> {/* Data fetch inside */}
    </Suspense>
  );
};

const ProfileContent = () => {
  const { data } = useSuspenseQuery({ ... }); // Suspends until data ready
  return <ProfileCard profile={data} />;
};
```

**Benefits**:
- Granular loading states (Section-level)
- No manual loading state management
- Concurrent rendering (React 18)

**MUST**: Implement in Section components with data fetching

**Related**:
- [frontend/section-patterns.md](./frontend/section-patterns.md)

---

## T

### TanStack Query (React Query)
**Korean**: 탠스택 쿼리

**Definition**: Server state 관리 라이브러리. 데이터 fetch, cache, invalidation 자동 처리.

**Core Hooks**:
```typescript
// Query (data fetch)
const { data, isLoading } = useQuery({
  queryKey: ['user', userId],
  queryFn: () => fetchUser(userId),
});

// Suspense Query (with Suspense boundary)
const { data } = useSuspenseQuery({
  queryKey: ['user', userId],
  queryFn: () => fetchUser(userId),
});

// Mutation (data modification)
const mutation = useMutation({
  mutationFn: (data) => createUser(data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['users'] });
  },
});
```

**This Project Pattern**:
- Query Hook wraps TanStack Query + DI Container
- Server Component prefetches with `queryClient.prefetchQuery()`
- Client Component uses `useSuspenseQuery()` for hydrated data

**Related**:
- [patterns/query-hooks.md](./patterns/query-hooks.md)
- [patterns/mutation-hooks.md](./patterns/mutation-hooks.md)

---

### Tree-shaking
**Korean**: 트리 셰이킹

**Definition**: JavaScript bundler가 사용되지 않는 코드를 제거하는 최적화 기법. 번들 크기 감소.

**Why Barrel Exports Break Tree-shaking**:
```typescript
// apps/web/src/domains/user/di/index.ts
export * from './user-server-container'; // Re-exports everything
export * from './user-client-container'; // Re-exports everything

// Import (Webpack can't tree-shake)
import { getUserClientContainer } from '@user/di';
// ❌ Webpack bundles BOTH server + client code (can't determine which is used)
// ❌ server-only package gets bundled in client → BUILD FAILS
```

**Why Direct Imports Work**:
```typescript
// Direct import (Webpack can tree-shake)
import { getUserClientContainer } from '@/src/domains/user/di/user-client-container';
// ✅ Webpack bundles ONLY client code
// ✅ server-only package excluded from client bundle
```

**Related**:
- [ddd/di-client-containers.md](./ddd/di-client-containers.md)

---

### TypeScript Path Alias
**Korean**: 타입스크립트 경로 별칭

**Definition**: 절대 경로 import를 위한 단축어. `tsconfig.json`에서 설정.

**This Project Configuration**:
```json
// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@core/*": ["./src/core/*"],
      "@auth/*": ["./src/domains/auth/*"],
      "@user/*": ["./src/domains/user/*"],
      // ...
    }
  }
}
```

**Usage**:
```typescript
// ✅ GOOD: Path alias
import { getUserClientContainer } from '@user/di/user-client-container';
import { Button } from '@core/ui/button';

// ❌ BAD: Relative import hell
import { getUserClientContainer } from '../../../domains/user/di/user-client-container';
import { Button } from '../../../core/ui/button';
```

**Benefits**:
- Clearer imports (domain boundaries explicit)
- Easier refactoring (change tsconfig, not hundreds of imports)
- No relative import hell (`../../../`)

**Related**:
- [core/architecture.md](./core/architecture.md)

---

## U

### UseCase
**Korean**: 유스케이스

**Definition**: DDD에서 하나의 비즈니스 로직을 오케스트레이션하는 클래스. Single Responsibility Principle 준수.

**Structure**:
```typescript
export class GetBenefitsUseCase {
  constructor(
    private benefitRepository: BenefitRepository,
    private sessionManager: SessionManager,
  ) {}

  async execute(): Promise<BenefitEntity[]> {
    // 1. Authentication check
    const userId = await this.sessionManager.getUserId();
    if (!userId) throw new UnauthorizedError();

    // 2. Fetch data via Repository
    const benefits = await this.benefitRepository.getAll();

    // 3. Business logic (filter active)
    return benefits.filter(b => b.isActive());
  }
}
```

**Characteristics**:
- Single public method: `execute()`
- Orchestrates business logic
- Uses Repository for data access
- No UI concerns
- Testable in isolation

**Benefits**:
- Clear entry points for business operations
- Testability (mock dependencies)
- Reusability (same UseCase in different UIs)
- Single Responsibility

**Related**:
- [ddd/usecase-patterns.md](./ddd/usecase-patterns.md)

---

## V

### Vanilla Extract
**Korean**: 바닐라 익스트랙트

**Definition**: TypeScript로 CSS를 작성하는 CSS-in-JS 라이브러리. Zero-runtime, type-safe styling.

**This Project Usage**:
```typescript
// button.css.ts
import { style } from '@vanilla-extract/css';
import { vars } from '@nugudi/themes';

export const button = style({
  padding: vars.box.spacing[16],
  backgroundColor: vars.color.primary.blue500,
  color: vars.color.text.white,
  borderRadius: vars.border.radius.medium,
});

// button.tsx
import * as styles from './button.css';

export const Button = ({ children }) => (
  <button className={styles.button}>{children}</button>
);
```

**Benefits**:
- Type-safe (TypeScript autocomplete)
- Zero runtime (CSS extracted at build time)
- Design token integration
- No CSS conflicts (scoped by default)

**Related**:
- [packages/package-usage.md](./packages/package-usage.md)

---

## 📚 Related Documentation

- **[CLAUDE.md](../CLAUDE.md)** — Entry point for all documentation
- **[core/architecture.md](./core/architecture.md)** — High-level architecture overview
- **[ddd/entity-patterns.md](./ddd/entity-patterns.md)** — Entity design patterns
- **[frontend/component-hierarchy.md](./frontend/component-hierarchy.md)** — Component hierarchy

---

**Last Updated**: 2025-01-12
**Maintained By**: Development Team
**Questions?**: Refer to specific domain documentation for more details
