# Next.js App Router Component Architecture Rules

## Component Hierarchy Overview

```
Page (Server Component) → View → Section (with Suspense/ErrorBoundary) → Component
```

## 🎨 IMPORTANT: Always Use Design Tokens

**MUST use `vars` and `classes` from `@nugudi/themes`:**

- Colors: Use `vars.colors.$scale.zinc[500]` NOT hard-coded colors
- Spacing: Use `vars.box.spacing[16]` NOT `16px`
- Radius: Use `vars.box.radii.lg` NOT `12px`
- Shadows: Use `vars.box.shadows.sm` NOT custom shadows

## Domain Structure Patterns (DDD Architecture)

```
domains/
├── auth/                          # Auth Domain (DDD Layered)
│   ├── di/                       # 🆕 DI Containers (per-domain)
│   │   ├── auth-server-container.ts   # Server Container (Stateless)
│   │   └── auth-client-container.ts   # Client Container (Lazy Singleton)
│   ├── domain/                   # Domain Layer
│   │   ├── repositories/        #     Repository Interfaces
│   │   ├── usecases/            #     Business Logic (UseCase pattern)
│   │   ├── entities/            #     Domain Entities
│   │   └── interfaces/          #     Domain Interfaces
│   ├── data/                     # Data Layer
│   │   ├── repositories/        #     Repository Implementations
│   │   ├── data-sources/        #     Data Sources
│   │   ├── mappers/             #     DTO → Entity Mappers
│   │   └── dto/                 #     Data Transfer Objects
│   ├── infrastructure/           # Infrastructure Layer
│   │   ├── services/            #     External Services
│   │   └── actions/             #     Next.js Server Actions
│   ├── presentation/             # Presentation Layer
│   │   ├── ui/                  #     UI Components Hierarchy
│   │   │   ├── views/          #       Page-level layouts
│   │   │   ├── sections/       #       Feature sections with boundaries
│   │   │   └── components/     #       Reusable components
│   │   ├── adapters/            # 🆕 Entity → UI Type Adapters (optional)
│   │   ├── hooks/               #     React Hooks & TanStack Query
│   │   ├── mappers/             #     Simple transformations (alternative to adapters)
│   │   ├── types/               #     UI-specific types
│   │   ├── utils/               #     Presentation utilities
│   │   ├── constants/           #     Presentation constants
│   │   ├── schemas/             #     Validation schemas
│   │   ├── stores/              #     State management stores
│   │   └── actions/             #     Server Actions
│   └── core/                     # Core Domain Concepts (deprecated structure)
│       ├── types/               #     Domain Types
│       ├── config/              #     Domain Configuration
│       ├── errors/              #     Domain Errors
│       └── hooks/               #     React Hooks & Query Factories
├── user/                          # User Domain (DDD Layered)
│   ├── di/
│   ├── domain/
│   ├── data/
│   ├── infrastructure/
│   └── presentation/
│       ├── ui/
│       ├── hooks/
│       └── utils/
├── benefit/                       # Benefit Domain
│   ├── di/
│   ├── domain/
│   ├── data/
│   ├── infrastructure/
│   └── presentation/
│       ├── ui/
│       ├── adapters/             # 🆕 Entity → UI Type Adapters
│       ├── hooks/
│       └── types/
├── cafeteria/                     # Cafeteria Domain (feature-based)
│   ├── home/                     # Home feature
│   │   └── presentation/        #     Has its own presentation layer
│   ├── detail/                   # Detail feature
│   │   └── presentation/
│   ├── review/                   # Review feature
│   │   └── presentation/
│   └── di/                       # Shared DI for cafeteria
└── stamp/                         # Stamp Domain
    ├── di/
    ├── domain/
    ├── data/
    ├── infrastructure/
    └── presentation/
        ├── ui/
        ├── mappers/              # Simple transformations (alternative to adapters)
        ├── hooks/
        └── types/
```

**DDD Layer Responsibilities:**

- **di/**: DI Containers (per-domain) - Server Container (stateless) & Client Container (lazy singleton)
- **domain/repositories/**: Repository Interfaces (의존성 역전)
- **domain/usecases/**: Business Logic (UseCase pattern), Repository & Infrastructure 조합
- **domain/entities/**: Domain Entities (비즈니스 객체)
- **data/repositories/**: Repository Implementations (실제 HTTP API 호출)
- **data/data-sources/**: Data Sources (HTTP Client 사용)
- **data/mappers/**: DTO → Entity 변환
- **infrastructure/services/**: External Services (third-party integrations)
- **infrastructure/actions/**: Next.js Server Actions (Page/Component에서 호출)
- **presentation/**: Presentation Layer (UI and related logic)
  - **presentation/ui/**: UI Components Hierarchy (Views/Sections/Components)
  - **presentation/adapters/**: Entity → UI Type transformation with orchestration (🆕 optional pattern)
  - **presentation/mappers/**: Simple pure function transformations (alternative to adapters)
  - **presentation/hooks/**: React Hooks & TanStack Query custom hooks
  - **presentation/types/**: UI-specific TypeScript types
  - **presentation/utils/**: Presentation-layer utilities
  - **presentation/constants/**: Presentation constants
  - **presentation/schemas/**: Validation schemas
  - **presentation/stores/**: State management stores
  - **presentation/actions/**: Server Actions (UI-triggered)
- **core/** (deprecated): Legacy structure - migrate to presentation/ subfolders

## Adapter Pattern (🆕 Optional Pattern)

### When to Use Adapters vs Mappers

**Use Adapter** (`presentation/adapters/`) when:
- Entity → UI Type transformation requires **orchestrating 7+ Entity methods**
- Need **type-safe conversions** to eliminate unsafe `as` assertions
- Require **UI-specific helper methods** (color calculation, availability checks, formatting)
- Complex business logic needs to be centralized for better testability

**Use Mapper** (`presentation/mappers/` or `data/mappers/`) when:
- Simple 1:1 field transformations (DTO → Entity, Entity → UI Type)
- Pure function transformations without complex orchestration
- Minimal business logic involved

### Adapter Pattern Structure

Adapters are **objects with methods** (not classes) that:
1. **Private helper functions**: Type-safe conversions (e.g., `getMenuTypeUi()`, `getDiscountBadgeUi()`)
2. **Public conversion methods**: Entity → UI Type transformations (e.g., `toUiItem()`, `toUiList()`)
3. **Public UI helpers**: UI-specific calculations (e.g., `getStatusColor()`, `canPurchase()`)

### JSDoc Documentation Standards

**IMPORTANT**: All Adapter methods MUST have comprehensive JSDoc documentation:

**Required JSDoc Structure**:
1. **Summary**: One-line description of what the method does
2. **Detailed Description**: Explanation of behavior, rules, edge cases, examples
3. **@param**: Document each parameter with type and description
4. **@returns**: Document return value with type and description

**Example from actual codebase**:
```typescript
/**
 * Get UI color based on stamp status and expiry
 *
 * Status mapping: used → gray, expired → red, expiring soon → orange, valid → green
 *
 * @param stamp - Domain stamp entity
 * @returns Color string for UI theming
 */
getStatusColor(stamp: Stamp): string {
  // Implementation
}
```

**Why Comprehensive JSDoc**:
- Methods contain UI business logic that may not be obvious
- Rules and mappings (e.g., discount thresholds, color schemes) should be documented
- Helps maintainers understand behavior without reading implementation
- Provides IntelliSense documentation in IDEs

### Real Example: BenefitAdapter

**Note**: The example below shows simplified JSDoc for brevity. In actual code, use comprehensive JSDoc as shown in the standards above.

```typescript
// File: domains/benefit/presentation/adapters/benefit.adapter.ts
import type { Benefit, BenefitList } from "../../domain/entities";
import type { BenefitItem } from "../types/benefit";

// Private helper: Type-safe conversion (eliminates unsafe 'as' assertions)
function getMenuTypeUi(benefit: Benefit): "점심" | "저녁" | "간식" {
  const displayName = benefit.getMenuTypeDisplayName();
  if (displayName === "점심" || displayName === "저녁" || displayName === "간식") {
    return displayName;
  }
  console.error(`Invalid menuType displayName: ${displayName} for benefit ${benefit.getId()}`);
  return "점심"; // Safe fallback
}

function getDiscountBadgeUi(benefit: Benefit): "특가" | "할인" | null {
  const badge = benefit.getDiscountBadge();
  if (badge === null) return null;
  if (badge === "특가" || badge === "할인") return badge;
  console.error(`Invalid discountBadge: ${badge} for benefit ${benefit.getId()}`);
  return null; // Safe fallback
}

// Adapter object with public API
export const BenefitAdapter = {
  /**
   * Entity → UI Item transformation (orchestrates 7+ Entity methods)
   */
  toUiItem(benefit: Benefit): BenefitItem {
    return {
      id: benefit.getId(),
      cafeteriaName: benefit.getCafeteriaName(),
      menuName: benefit.getMenuName(),
      imageUrl: benefit.getImageUrl(),
      description: benefit.getDescription(),

      // Type-safe conversions
      menuType: getMenuTypeUi(benefit),
      discountBadge: getDiscountBadgeUi(benefit),

      // Entity method orchestration (7+ calls)
      originalPrice: benefit.getPrice(),
      finalPrice: benefit.getFinalPrice(),            // Entity method #1
      hasDiscount: benefit.hasDiscount(),             // Entity method #2
      discountPercentage: benefit.getDiscountPercentage(), // Entity method #3
      isAvailable: benefit.isAvailableNow(),         // Entity method #4
      isNew: benefit.isNew(),                        // Entity method #5
    };
  },

  /**
   * Batch conversion helper
   */
  toUiList(benefits: Benefit[]): BenefitItem[] {
    return benefits.map((benefit) => this.toUiItem(benefit));
  },

  /**
   * List wrapper conversion
   */
  benefitListToUi(list: BenefitList) {
    return {
      benefits: this.toUiList(list.benefits),
      totalCount: list.totalCount,
    };
  },

  /**
   * UI helper: Status color based on discount and availability
   */
  getStatusColor(benefit: Benefit): string {
    if (!benefit.isAvailableNow()) return "gray";
    const discountPercentage = benefit.getDiscountPercentage();
    if (discountPercentage >= 30) return "red";
    if (discountPercentage >= 10) return "orange";
    return "blue";
  },

  /**
   * UI helper: Purchase availability check
   */
  canPurchase(benefit: Benefit): boolean {
    return benefit.isAvailableNow();
  },

  /**
   * UI helper: Price display with formatting
   */
  getPriceDisplay(benefit: Benefit): {
    original: string;
    final: string;
    showStrikethrough: boolean;
  } {
    const hasDiscount = benefit.hasDiscount();
    const originalPrice = benefit.price.toLocaleString("ko-KR");
    const finalPrice = benefit.getFinalPrice().toLocaleString("ko-KR");
    return {
      original: `${originalPrice}원`,
      final: `${finalPrice}원`,
      showStrikethrough: hasDiscount,
    };
  },
};
```

### Usage in Query Hooks

Adapters are typically used in **TanStack Query custom hooks** to transform Entity → UI Type:

```typescript
// File: domains/benefit/presentation/hooks/queries/get-benefit-list.query.ts
import { useQuery } from "@tanstack/react-query";
import { getBenefitClientContainer } from "@/src/domains/benefit/di/benefit-client-container";
import { BenefitAdapter } from "../../adapters/benefit.adapter";

export const useGetBenefitList = () => {
  const container = getBenefitClientContainer();
  const getBenefitListUseCase = container.getGetBenefitList();

  return useQuery({
    queryKey: ["benefits", "list"],
    queryFn: async () => {
      // 1. UseCase returns Domain Entity (BenefitList)
      const benefitList = await getBenefitListUseCase.execute();

      // 2. Adapter transforms Entity → UI Type
      return BenefitAdapter.benefitListToUi(benefitList);
    },
  });
};
```

### Usage in Components

Components consume **UI Types** (not Domain Entities) for type safety:

```typescript
// File: domains/benefit/presentation/ui/components/benefit-card/index.tsx
import type { BenefitItem } from "../../../types/benefit";  // UI Type (not Entity)

type BenefitCardProps = {
  benefit: BenefitItem;  // ✅ UI Type from Adapter
};

export const BenefitCard = ({ benefit }: BenefitCardProps) => {
  return (
    <div>
      <h3>{benefit.menuName}</h3>
      <p>{benefit.cafeteriaName}</p>
      {benefit.hasDiscount && (
        <span>{benefit.discountPercentage}% 할인</span>
      )}
      <p>{benefit.finalPrice}원</p>
    </div>
  );
};
```

### Key Benefits

1. **Type Safety**: Eliminates unsafe `as` type assertions through helper functions
2. **Centralization**: Business logic concentrated in one testable location
3. **Separation of Concerns**: Domain Entities vs UI Types clearly separated
4. **Reusability**: Adapter methods can be reused across multiple query hooks
5. **Maintainability**: Changes to Entity methods only require updating Adapter

### Location and Conventions

- **Directory**: `domains/[domain]/presentation/adapters/`
- **Naming**: `[entity-name].adapter.ts` (e.g., `benefit.adapter.ts`)
- **Export**: Named export as object (e.g., `export const BenefitAdapter = { ... }`)
- **Usage**: Import in query hooks (`queries/`) for Entity → UI Type transformation

### Comparison: Adapter vs Mapper

```typescript
// ❌ Mapper (Too simple for complex transformations)
// File: domains/benefit/presentation/mappers/benefit.mapper.ts
export const mapBenefitToUi = (benefit: Benefit): BenefitItem => {
  return {
    id: benefit.id,
    // Problem: Need to call 7+ Entity methods manually
    finalPrice: benefit.getFinalPrice(),
    hasDiscount: benefit.hasDiscount(),
    // ... repetitive Entity method calls
  };
};

// ✅ Adapter (Better for complex orchestration)
// File: domains/benefit/presentation/adapters/benefit.adapter.ts
export const BenefitAdapter = {
  toUiItem(benefit: Benefit): BenefitItem {
    // Private helpers handle type-safe conversions
    // Public method orchestrates Entity methods
    // UI helpers provide reusable calculations
  },
  getStatusColor(benefit: Benefit): string { /* ... */ },
  canPurchase(benefit: Benefit): boolean { /* ... */ },
};
```

## Layer-by-Layer Rules

### 1. Page Layer (`app/[domain]/[feature]/page.tsx`)

**Type**: Server Component
**Purpose**: Route entry point, data prefetching with DI Container, metadata setup

```typescript
// MUST: Server Component
// MUST: Use Server DI Container for UseCases
// MUST: Prefetch data for SSR
// MUST: Wrap with HydrationBoundary
// MAY: Set metadata for SEO
// NEVER: Contain UI logic directly
// NEVER: Use hooks or browser APIs
// NEVER: Use Client Container on server

// Example: app/page.tsx (home page shows cafeteria)
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { createUserServerContainer } from "@/src/domains/user/di/user-server-container";  // 🆕 Per-domain DI Container
import { CafeteriaHomeView } from "@/src/domains/cafeteria/presentation/views/cafeteria-home-view";
import getQueryClient from "@core/infrastructure/configs/tanstack-query/get-query-client";

const Page = async ({ params, searchParams }) => {
  const queryClient = getQueryClient();

  // 🆕 DI Container로 UseCase 획득 (Server Container는 매 요청마다 새 인스턴스)
  const container = createUserServerContainer();
  const getMyProfileUseCase = container.getGetMyProfile();  // 개별 UseCase 획득

  // Prefetch data using UseCase (DI Container가 자동으로 인증 토큰 주입)
  await queryClient.prefetchQuery({
    queryKey: ['user', 'profile'],
    queryFn: () => getMyProfileUseCase.execute()
  });

  // Return View wrapped in HydrationBoundary
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CafeteriaHomeView />
    </HydrationBoundary>
  );
};

export default Page; // Pages MUST use default export
```

**🔑 Key Points:**
- ✅ Use `createUserServerContainer()` (creates new instance per request, stateless)
- ✅ Get UseCases individually: `container.getGetMyProfile()` (개별 UseCase 획득)
- ✅ UseCases automatically handle token injection via `Repository → DataSource → AuthenticatedHttpClient`
- ✅ Call UseCase with `.execute()` method
- ❌ Never instantiate Repository or UseCase directly
- ❌ Never use client container (`getUserClientContainer()`) on server

### 2. View Layer (`presentation/ui/views/`)

**Type**: Client or Server Component
**Purpose**: Page layout composition and section orchestration

```typescript
// MUST: Import and compose Sections
// MUST: Define page-level layout structure
// MUST: Pass props to Sections
// MAY: Manage page-level state (if client component)
// MAY: Coordinate data flow between sections
// NEVER: Fetch data directly
// NEVER: Contain business logic
// NEVER: Implement error/loading states

// Example: domains/cafeteria/presentation/ui/views/cafeteria-home-view/index.tsx
import { Flex } from "@nugudi/react-components-layout";
import { AppHeader } from "@/src/core/ui/components/app-header";
import { CafeteriaBrowseMenuSection } from "../../sections/cafeteria-browse-menu-section";
import { CafeteriaRecommendSection } from "../../sections/cafeteria-recommend-section"  // Now in domains/cafeteria/presentation/sections/;
import * as styles from "./index.css";

export const CafeteriaHomeView = ({ filter }) => {
  return (
    <Flex direction="column" className={styles.container} gap={16}>
      <AppHeader />
      <CafeteriaBrowseMenuSection filter={filter} />
      <CafeteriaRecommendSection />
    </Flex>
  );
};

};

// Views use named export
```

### 3. Section Layer (`presentation/ui/sections/`)

**Type**: Client Component (typically)
**Purpose**: Feature-specific logic encapsulation with error and loading boundaries

```typescript
// MUST: Implement Suspense boundary
// MUST: Implement ErrorBoundary
// MUST: Provide skeleton/loading UI
// MUST: Handle data fetching (via hooks)
// MAY: Manage section-specific state
// MAY: Handle user interactions
// NEVER: Define page layout
// NEVER: Import other sections

// Example: domains/user/presentation/ui/sections/user-welcome-section/index.tsx
"use client";

import { Box } from "@nugudi/react-components-layout";
import { useSuspenseQuery } from "@tanstack/react-query";
import Image from "next/image";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { getUserClientContainer } from "@/src/domains/user/di/user-client-container";  // 🆕 Client DI Container
import * as styles from "./index.css";

// Main Section Component (with boundaries)
export const UserWelcomeSection = () => {
  return (
    <ErrorBoundary fallback={<UserWelcomeSectionError />}>
      <Suspense fallback={<UserWelcomeSectionSkeleton />}>
        <UserWelcomeSectionContent />
      </Suspense>
    </ErrorBoundary>
  );
};

// Skeleton Component (실제 레이아웃과 일치)
const UserWelcomeSectionSkeleton = () => {
  return (
    <Box borderRadius="xl" className={styles.container}>
      <div className={styles.textWrapper}>
        <div className="flex flex-col gap-2">
          <div className="h-7 w-44 animate-pulse rounded bg-zinc-200" />
          <div className="h-7 w-52 animate-pulse rounded bg-zinc-200" />
        </div>
      </div>
      <div
        className="absolute right-[-4px] bottom-[-16px] h-[110px] w-[110px] animate-pulse rounded-lg bg-zinc-100"
        aria-hidden="true"
      />
    </Box>
  );
};

// Error Component (폴백 UI)
const UserWelcomeSectionError = () => {
  return (
    <Box borderRadius="xl" className={styles.container}>
      <div className={styles.textWrapper}>
        <span className={styles.name}>손님</span>님 오늘도 <br />
        맛난 점심식사다 너굴
      </div>
      <Image
        src="/images/level-2-nuguri.png"
        alt="level-2 너구리"
        className={styles.image}
        width={150}
        height={100}
        priority
      />
    </Box>
  );
};

// Content Component (actual data fetching)
const UserWelcomeSectionContent = () => {
  // 🆕 Client-side DI Container에서 UseCase 획득 (Lazy-initialized Singleton)
  const container = getUserClientContainer();
  const getMyProfileUseCase = container.getGetMyProfile();  // 개별 UseCase 획득

  // Page에서 prefetch한 데이터를 동일한 Query로 재사용 (캐시 hit!)
  // UseCase → Repository → DataSource → AuthenticatedHttpClient (자동 토큰 주입)
  const { data } = useSuspenseQuery({
    queryKey: ['user', 'profile'],
    queryFn: () => getMyProfileUseCase.execute()
  });

  const nickname = data.profile?.nickname ?? "손님";
  const profileImageUrl = data.profile?.profileImageUrl;

  return (
    <Box borderRadius="xl" className={styles.container}>
      <div className={styles.textWrapper}>
        <span className={styles.name}>{nickname}</span>님 오늘도 <br />
        맛난 점심식사다 너굴
      </div>
      <Image
        src={profileImageUrl ?? "/images/level-2-nuguri.png"}
        alt="level-2 너구리"
        className={styles.image}
        width={150}
        height={100}
        priority
      />
    </Box>
  );
};

// Sections use named export
```

### 4. Component Layer (`presentation/ui/components/`)

**Type**: Client or Server Component
**Purpose**: Reusable, presentational UI components

```typescript
// MUST: Be pure/presentational
// MUST: Accept data via props
// MUST: Emit events via callback props
// MAY: Have internal UI state (open/closed, etc.)
// NEVER: Fetch data directly
// NEVER: Have business logic
// NEVER: Know about routes or navigation

export const [Component] = ({ data, onAction }) => {
  // Pure UI rendering
  return <div onClick={onAction}>{data}</div>;
};
```

## Folder Structure Rules

### Each Component Must Have Its Own Folder

**MANDATORY**: Every view, section, and component must be in its own folder with these files:

```
component-name/
├── index.tsx        # Component implementation
└── index.css.ts     # Vanilla Extract styles (NOT CSS Modules)
```

**Example Structure:**

```
views/
└── sign-up-view/            # Folder name in kebab-case
    ├── index.tsx            # Export: SignUpView
    └── index.css.ts         # Vanilla Extract styles

sections/
└── password-forgot-section/ # Folder name in kebab-case
    ├── index.tsx            # Export: PasswordForgotSection
    └── index.css.ts         # Optional (sections may not need styles)

components/
└── email-sign-in-form/      # Folder name in kebab-case
    ├── index.tsx            # Export: EmailSignInForm
    └── index.css.ts         # Vanilla Extract styles
    └── steps/               # Optional sub-components folder
        └── email-form/
            ├── index.tsx
            └── index.css.ts
```

## Naming Conventions

### File Structure

```
apps/web/src/
└── domains/
    └── user/                              # Domain (simple structure)
        ├── di/                            # DI Containers
        │   ├── user-server-container.ts
        │   └── user-client-container.ts
        ├── domain/                        # Domain Layer
        │   ├── entities/
        │   ├── repositories/
        │   └── usecases/
        ├── data/                          # Data Layer
        │   ├── dto/
        │   ├── mappers/
        │   └── repositories/
        ├── infrastructure/                # Infrastructure Layer
        │   └── services/
        └── presentation/                  # Presentation Layer
            ├── ui/                        # UI Components Hierarchy
            │   ├── views/
            │   │   └── user-profile-view/
            │   │       ├── index.tsx
            │   │       └── index.css.ts
            │   ├── sections/
            │   │   └── user-profile-section/
            │   │       └── index.tsx
            │   └── components/
            │       └── user-profile-card/
            │           ├── index.tsx
            │           └── index.css.ts
            ├── hooks/                     # React Hooks & TanStack Query
            │   └── queries/               # Query custom hooks
            │       └── get-user-profile.query.ts
            ├── types/                     # UI-specific types
            │   └── index.ts
            ├── utils/                     # Presentation utilities
            │   └── format-points.ts
            └── constants/                 # Presentation constants
                └── query-keys.ts          # Query Key 상수
```

### Component Naming Pattern

```typescript
// Views: [Feature]View (in feature-view folder)
// File: domains/auth/presentation/ui/views/sign-up-view/index.tsx
export const SignUpView = () => {};
// ✅ Views use named export

// Sections: [Feature]Section (in feature-section folder)
// File: domains/auth/presentation/ui/sections/sign-up-section/index.tsx
export const SignUpSection = () => {};
// ✅ Sections use named export
// Note: Skeleton and Error components are in the same file (not exported)

// Components: Descriptive name (in component-name folder)
// File: domains/auth/presentation/ui/components/sign-up-form/index.tsx
export const SignUpForm = () => {};
// ✅ Components use named export

// Sub-components in steps folder
// File: domains/auth/presentation/ui/components/sign-up-form/steps/email-form/index.tsx
export const EmailForm = () => {};
// ✅ Sub-components also use named export
```

## Hooks Folder Structure

### Query vs. General Hooks 분리

**IMPORTANT**: `presentation/hooks/` 폴더 내에서 TanStack Query 커스텀 훅과 일반 커스텀 훅을 명확히 분리합니다.

```
presentation/
└── hooks/
    ├── queries/                        # TanStack Query Custom Hooks
    │   ├── get-user-profile.query.ts  # useGetUserProfile hook
    │   └── get-user-settings.query.ts # useGetUserSettings hook
    └── use-*.ts                        # 일반 커스텀 훅
        ├── use-user-actions.ts        # UI 로직, 상태 관리
        └── use-user-validation.ts     # Side effects (데이터 fetching 제외)
```

### TanStack Query Custom Hook 작성 규칙

1. **파일명**: `get-[feature].query.ts` 형식 사용 (예: `get-user-profile.query.ts`, `get-benefit-list.query.ts`)
2. **Hook 이름**: `useGet[Feature]` 형식 사용 (예: `useGetUserProfile`, `useGetBenefitList`)
3. **Import**: Query Key는 `constants/query-keys.ts`에서 import
4. **🆕 UseCase 사용**: DI Container에서 UseCase를 획득하여 queryFn에 사용
5. **🆕 Adapter 사용**: 복잡한 Entity → UI Type 변환이 필요한 경우 Adapter 사용 (7+ Entity methods)
6. **캐싱**: 데이터 특성에 맞는 캐싱 전략 설정 (staleTime, gcTime, refetch options)

**패턴 1: 간단한 Custom Hook (Adapter 없이)**

```typescript
// ✅ CORRECT - presentation/hooks/queries/get-user-profile.query.ts
import { useQuery } from "@tanstack/react-query";
import { getUserClientContainer } from "@/src/domains/user/di/user-client-container";
import { USER_PROFILE_QUERY_KEY } from "../../constants/query-keys";

export const useGetUserProfile = () => {
  // 🆕 Client Container에서 UseCase 획득 (Lazy-initialized Singleton)
  const container = getUserClientContainer();
  const getMyProfileUseCase = container.getGetMyProfile();

  return useQuery({
    queryKey: USER_PROFILE_QUERY_KEY,
    queryFn: () => getMyProfileUseCase.execute(), // UseCase → Entity
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};
```

**패턴 2: Adapter를 사용하는 Custom Hook (복잡한 변환)**

```typescript
// ✅ CORRECT - presentation/hooks/queries/get-benefit-list.query.ts
import { useQuery } from "@tanstack/react-query";
import { getBenefitClientContainer } from "@/src/domains/benefit/di/benefit-client-container";
import { BenefitAdapter } from "../../adapters/benefit.adapter";
import { BENEFIT_LIST_QUERY_KEY } from "../../constants/query-keys";

export const useGetBenefitList = () => {
  const container = getBenefitClientContainer();
  const getBenefitListUseCase = container.getGetBenefitList();

  return useQuery({
    queryKey: BENEFIT_LIST_QUERY_KEY,
    queryFn: async () => {
      // 1. UseCase returns Domain Entity (BenefitList)
      const result = await getBenefitListUseCase.execute();

      // 2. Adapter transforms Entity → UI Type (orchestrates 7+ Entity methods)
      return BenefitAdapter.benefitListToUi(result);
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });
};
```

**패턴 3: Infinite Query Custom Hook (무한스크롤)**

```typescript
// ✅ CORRECT - presentation/hooks/queries/get-cafeteria-infinite-list.query.ts
import { useInfiniteQuery } from "@tanstack/react-query";
import { getCafeteriaClientContainer } from "@/src/domains/cafeteria/di/cafeteria-client-container";
import { CAFETERIA_LIST_QUERY_KEY } from "../../constants/query-keys";

type UseGetCafeteriaInfiniteListParams = {
  filter: string;
};

export const useGetCafeteriaInfiniteList = ({
  filter,
}: UseGetCafeteriaInfiniteListParams) => {
  const container = getCafeteriaClientContainer();
  const getCafeteriaListUseCase = container.getGetCafeteriaList();

  return useInfiniteQuery({
    queryKey: [...CAFETERIA_LIST_QUERY_KEY, filter], // 필터 파라미터 포함
    queryFn: ({ pageParam = 0 }) =>
      getCafeteriaListUseCase.execute({ filter, page: pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      return lastPage.hasNext ? lastPage.nextPage : undefined;
    },
    staleTime: 3 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
```

**Section에서 Custom Hook 사용**

```typescript
// ✅ CORRECT - presentation/ui/sections/benefit-list-section/index.tsx
"use client";

import { useGetBenefitList } from "../../../hooks/queries/get-benefit-list.query";
import { BenefitCard } from "../../components/benefit-card";

export const BenefitListSection = () => {
  // Custom Hook 사용 - UI Type 반환 (BenefitItem[])
  const { data: benefitList, isLoading } = useGetBenefitList();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {benefitList?.benefits.map((benefit) => (
        <BenefitCard key={benefit.id} benefit={benefit} />
      ))}
    </div>
  );
};
```

**❌ DEPRECATED 패턴들 (사용 금지)**

```typescript
// ❌ OLD - Factory Pattern (더 이상 사용하지 않음)
export const userProfileQueryClient = () => ({
  queryKey: USER_PROFILE_QUERY_KEY,
  queryFn: () => getMyProfileUseCase.execute(),
});

// ❌ OLD - Query Options 객체 export (더 이상 사용하지 않음)
export const userProfileQueryClient = {
  queryKey: USER_PROFILE_QUERY_KEY,
  queryFn: () => getMyProfile(),
} as const;

// ❌ DEPRECATED - 직접 API 호출 (@nugudi/api는 제거됨)
import { getMyProfile } from "@nugudi/api";
export const useGetUserProfile = () => {
  return useQuery({
    queryKey: USER_PROFILE_QUERY_KEY,
    queryFn: () => getMyProfile(), // NO! UseCase 사용해야 함
  });
};
```

### 일반 커스텀 훅 작성 규칙

1. **파일명**: `use-[feature].ts` 형식 사용
2. **Export**: Named export로 `use` prefix 필수
3. **책임**: UI 로직, 상태 관리, Side effects (데이터 fetching은 Query Options에서 처리)
4. **위치**: `hooks/` 폴더 루트 (queries 폴더 밖)

```typescript
// ✅ CORRECT - hooks/use-user-actions.ts
import { useRouter } from "next/navigation";

export const useUserActions = () => {
  const router = useRouter();

  const navigateToProfile = () => {
    router.push("/profile");
  };

  return { navigateToProfile };
};

// ❌ WRONG - 데이터 fetching은 Query Options에서
export const useUserProfile = () => {
  // Don't fetch data here, use useSuspenseQuery with xxxQueryClient instead
  const response = await fetch("/api/user/profile"); // NO!
  return response.json();
};
```

## Import Patterns

### Within the Same Domain - MUST Use Relative Imports

```typescript
// ✅ CORRECT - Use relative imports + named exports within same domain
// In: apps/web/src/domains/auth/presentation/ui/views/sign-up-view/index.tsx
import { SignUpSection } from "../../sections/sign-up-section";

// In: apps/web/src/domains/auth/presentation/ui/sections/sign-up-section/index.tsx
import { SignUpForm } from "../../components/sign-up-form";
import { useSignUpStore } from "../../../stores/use-sign-up-store"; // Named export for hooks
import type { SignUpFormData } from "../../../types/sign-up";

// In: apps/web/src/domains/auth/presentation/ui/components/sign-up-form/index.tsx
import { EmailForm } from "./steps/email-form";
import { PasswordForm } from "./steps/password-form";

// ❌ WRONG - Don't use absolute imports within same domain
import { SignUpSection } from "@/src/domains/auth/presentation/ui/sections/sign-up-section"; // NO!
```

### From Page to View - MUST Use Absolute Imports

```typescript
// ✅ CORRECT - Pages use absolute imports for views
// Public route example
// In: app/(public)/auth/sign-up/page.tsx
import { SignUpView } from "@/src/domains/auth/presentation/ui/views/sign-up-view";

// Protected route example
// In: app/(auth)/profile/page.tsx
import { ProfilePageView } from "@/src/domains/user/presentation/ui/views/profile-page-view";

// In: app/page.tsx (home page shows cafeteria)
import { CafeteriaHomeView } from "@/src/domains/cafeteria/presentation/ui/views/cafeteria-home-view";
```

### Cross-Domain Imports - MUST Use Absolute Imports

```typescript
// ✅ CORRECT - Use absolute imports for cross-domain
// In: apps/web/src/domains/cafeteria/...
import { useAuth } from "@/src/domains/auth/presentation/hooks/use-auth";
import { LoginWelcome } from "@/src/domains/auth/presentation/ui/components/login-welcome";

// In: apps/web/src/core/ui/components/...
import { ProfileSection } from "@/src/domains/user/presentation/ui/sections/profile-section";

// ❌ WRONG - Don't use relative imports for cross-domain
import { useAuth } from "../../../auth/presentation/hooks/use-auth"; // NO!
```

### Using Monorepo Packages - Package Import Rules

```typescript
// Individual component packages - Named exports
import { Button } from "@nugudi/react-components-button"; // ✅ Named
import { Input } from "@nugudi/react-components-input"; // ✅ Named
import { Switch } from "@nugudi/react-components-switch"; // ✅ Named

// Layout package - Named exports
import { Box, Flex, VStack, HStack } from "@nugudi/react-components-layout"; // ✅ Named
import {
  Heading,
  Title,
  Body,
  Emphasis,
} from "@nugudi/react-components-layout"; // ✅ Named

// Hooks - Named exports
import { useToggle } from "@nugudi/react-hooks-toggle"; // ✅ Named
import { useStepper } from "@nugudi/react-hooks-use-stepper"; // ✅ Named

// Themes - Named exports
import { vars, classes } from "@nugudi/themes"; // ✅ Named

// Icons - Named exports
import { AppleIcon, HeartIcon, ArrowRightIcon } from "@nugudi/assets-icons"; // ✅ Named

// API - Named export
import { api } from "@nugudi/api"; // ✅ Named
```

## Data Flow Rules

### Server → Client Data Flow (🆕 DDD Architecture)

**실제 UserProfile 데이터 흐름 예시**:

```typescript
// 1. Page: Server Container + UseCases로 Prefetch (SSR)
// File: app/page.tsx
import { createUserServerContainer } from "@/src/domains/user/di/user-server-container";
import getQueryClient from "@core/infrastructure/configs/tanstack-query/get-query-client";

const HomePage = async () => {
  const queryClient = getQueryClient();

  // 🆕 Server Container로 UseCase 획득 (매번 새 인스턴스, 자동 토큰 주입)
  const container = createUserServerContainer();
  const getMyProfileUseCase = container.getGetMyProfile();  // 개별 UseCase 획득

  // Server Query Factory 사용 (UseCase → Repository → DataSource, 자동 토큰 주입)
  await queryClient.prefetchQuery({
    queryKey: ['user', 'profile'],
    queryFn: () => getMyProfileUseCase.execute()
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CafeteriaHomeView />
    </HydrationBoundary>
  );
};

// 2. View: Section 조합 (변경 없음)
// File: domains/cafeteria/presentation/ui/views/cafeteria-home-view/index.tsx
export const CafeteriaHomeView = () => {
  return (
    <Flex direction="column" gap={16}>
      <UserWelcomeSection /> {/* User 도메인 Section 사용 */}
      <CafeteriaListSection />
    </Flex>
  );
};

// 3. Section: Client Container + UseCase로 캐시 재사용
// File: domains/user/presentation/ui/sections/user-welcome-section/index.tsx
import { getUserClientContainer } from "@/src/domains/user/di/user-client-container";

const UserWelcomeSectionContent = () => {
  // 🆕 Client Container에서 UseCase 획득 (Lazy-initialized Singleton, 자동 토큰 주입)
  const container = getUserClientContainer();
  const getMyProfileUseCase = container.getGetMyProfile();  // 개별 UseCase 획득

  // Page에서 prefetch한 데이터를 동일한 Query Key로 조회 (캐시 hit!)
  const { data } = useSuspenseQuery({
    queryKey: ['user', 'profile'],
    queryFn: () => getMyProfileUseCase.execute()
  });

  const nickname = data.profile?.nickname ?? "손님";

  return <WelcomeMessage nickname={nickname} />;
};

// 4. Component: Pure UI rendering (변경 없음)
// File: core/ui/components/welcome-message/index.tsx
export const WelcomeMessage = ({ nickname }: { nickname: string }) => {
  return <span>{nickname}님 환영합니다</span>;
};
```

**🆕 핵심 포인트**:
- **Server Container**: Page Layer에서 `createXXXServerContainer()` 사용 (매번 새 인스턴스)
- **Client Container**: Section/Component에서 `xxxClientContainer` 사용 (Singleton)
- **UseCase Layer**: Repository 호출 + 비즈니스 로직 처리
- **자동 토큰 주입**: DI Container가 AuthenticatedHttpClient를 통해 자동 처리
- **캐시 재사용**: Page에서 1번의 API 호출, Section에서 캐시 재사용 (추가 네트워크 요청 없음)
- **Component는 순수 UI만 담당**: Props로 데이터 받아 렌더링만

**🆕 DDD 레이어별 책임**:

| Layer | 환경 | DI Container | 책임 |
|-------|------|--------------|------|
| **Page** | Server | `createXXXServerContainer()` | SSR 데이터 prefetch |
| **UseCase** | Both | Container에서 주입 | 비즈니스 로직 + Repository 호출 |
| **Repository** | Both | Container에서 주입 | 순수 데이터 접근 (HttpClient 사용) |
| **Section** | Client | `xxxClientContainer` | 캐시 재사용 + UI 상태 관리 |
| **Component** | Both | - | 순수 UI 렌더링 (Props만) |

### State Management Rules

```
- Page: URL state only (params, searchParams)
- View: Page-level state (if needed)
- Section: Feature-specific state
- Component: UI-only state
```

## Error Handling Pattern

```typescript
// Each Section MUST follow this pattern:
export const DataSection = () => {
  return (
    <ErrorBoundary
      fallback={<DataSectionError />}
      onError={(error) => console.error("DataSection error:", error)}
    >
      <Suspense fallback={<DataSectionSkeleton />}>
        <DataSectionContent />
      </Suspense>
    </ErrorBoundary>
  );
};

// Internal components - NOT exported
const DataSectionSkeleton = () => {
  return <div className="animate-pulse">Loading...</div>;
};

const DataSectionError = ({ error }) => {
  return <div>오류가 발생했습니다: {error.message}</div>;
};

const DataSectionContent = () => {
  const { data } = useSuspenseQuery(/* ... */);
  return <div>{/* Actual content */}</div>;
};

// Only export the main section with named export
```

## TanStack Query Pattern

### Query Key 관리 규칙

**IMPORTANT**: Query Key는 `constants/query-keys.ts`에 상수로 정의합니다.

```typescript
// ✅ CORRECT - constants/query-keys.ts (Query Key만 정의)
export const USER_PROFILE_QUERY_KEY = ["user", "profile", "me"] as const;
export const BENEFIT_LIST_QUERY_KEY = ["benefits", "list"] as const;
export const CAFETERIA_LIST_QUERY_KEY = ["cafeterias", "list"] as const;
```

**🆕 CURRENT PATTERN**: TanStack Query Custom Hooks를 사용하세요 (위 "TanStack Query Custom Hook 작성 규칙" 섹션 참조)

### 네이밍 규칙

**✅ CURRENT (TanStack Query Custom Hook Pattern)**:
- **Query Key 상수**: `[DOMAIN]_[FEATURE]_QUERY_KEY` (예: `USER_PROFILE_QUERY_KEY`, `BENEFIT_LIST_QUERY_KEY`)
- **파일명**: `get-[feature].query.ts` (예: `get-user-profile.query.ts`, `get-benefit-list.query.ts`)
- **Hook 이름**: `useGet[Feature]` (예: `useGetUserProfile`, `useGetBenefitList`)
- **Adapter 이름**: `[Entity]Adapter` (예: `BenefitAdapter`, `UserAdapter`)

**❌ DEPRECATED (Factory Pattern - 더 이상 사용 금지)**:
- **Server Factory**: `[feature]QueryServer(token)` - 함수 (OLD)
- **Client Options**: `[feature]QueryClient` - 객체 (OLD)
- **Base Query**: `base[Feature]Query` - private (OLD)

## Best Practices Summary

### 🆕 DDD Architecture (NEW)

1. **DI Containers**: ALWAYS use DI containers to get UseCases
   - Server: `createXXXServerContainer()` (매번 새 인스턴스)
   - Client: `xxxClientContainer` (Singleton)
2. **UseCase Layer**: Business logic + Repository 호출 (직접 API 호출 금지)
3. **Repository Layer**: Pure data access using HttpClient (비즈니스 로직 금지)
4. **Infrastructure Layer**: HttpClient, SessionManager, TokenProvider (환경 무관 추상화)
5. **NEVER**: 직접 Repository/UseCase 인스턴스화 (Container에서만 주입)
6. **NEVER**: Page에서 Client Container 사용 (Singleton은 Client 전용)
7. **NEVER**: `@nugudi/api` 사용 (deprecated, UseCase 사용)

### Component Hierarchy

8. **Route Groups**: Use `(auth)` for protected pages, `(public)` for public pages
9. **Page**: Server Container + UseCases로 data prefetching (`app/(auth|public)/[domain]/page.tsx`)
10. **View**: Layout composition only (`domains/[domain]/presentation/ui/views/`)
11. **Section**: Client Container + UseCases로 data fetching + Error/Loading boundaries (`presentation/ui/sections/`)
12. **Component**: Pure UI components (`presentation/ui/components/`)
13. **Always use** Suspense + ErrorBoundary in Sections
14. **Never skip** the hierarchy (Page → View → Section → Component)
15. **Keep components** pure and reusable

### Code Organization

16. **Domain Structure**: Complex domains CAN use flat structure (auth) OR sub-features. Simple domains use flat structure (benefit, user)
17. **Name consistently** following the patterns above
18. **Separate concerns** strictly between layers
19. **Each component** must be in its own folder with `index.tsx` and `index.css.ts`
20. **Presentation layer** structure: DDD layers (domain, data, infrastructure) + `presentation/` (ui, hooks, adapters, types, utils)
21. **Use Vanilla Extract** with `vars` and `classes` from `@nugudi/themes`
22. **Always prefer** existing packages from `@nugudi/*` namespace
23. **Client Components**: Add `"use client"` when using event handlers or hooks
24. **Follow monorepo** import conventions from packages.md

### Data Fetching

25. **TanStack Query**: Separate Query Keys (`constants/`) from Custom Hooks (`hooks/queries/`)
26. **Query Hook Naming**: Use `get-[feature].query.ts` for files, `useGet[Feature]` for hooks (e.g., `useGetUserProfile`)
27. **Query Structure**: Use DI Container to get UseCase, call UseCase.execute() in queryFn
28. **Adapter Usage**: Use Adapters for complex Entity → UI Type transformations (7+ Entity method calls)
29. **NEVER**: 직접 API 함수 호출 (UseCase 메서드 사용), Factory pattern 사용 (deprecated)

## TypeScript Interface Rules

```typescript
// Views
interface [Feature]ViewProps {
  // Props from page params/searchParams
}

// Sections
interface [Feature]SectionProps {
  // Props from View
}

// Components
interface [Component]Props {
  // Data and callback props only
  data: DataType;
  onAction: (value: ValueType) => void;
}
```

## Quick Reference: Import/Export Rules

### Export Rules by File Type

| File Type      | Export Pattern                      | Example                            |
| -------------- | ----------------------------------- | ---------------------------------- |
| **Pages**      | `export default`                    | `export default Page`              |
| **Views**      | `export const`                      | `export const SignUpView`          |
| **Sections**   | `export const`                      | `export const SignUpSection`       |
| **Components** | `export const`                      | `export const SignUpForm`          |
| **Hooks**      | `export const` or `export function` | `export const useSignUpStore`      |
| **Types**      | `export type` or `export interface` | `export type SignUpFormData`       |
| **Constants**  | `export const`                      | `export const TOTAL_SIGN_UP_STEPS` |
| **Utils**      | `export const` or `export function` | `export const validateEmail`       |

### Import Rules by Context

| From → To               | Same Domain                                                          | Cross Domain                                                  | Shared/App      | Packages                                                   |
| ----------------------- | -------------------------------------------------------------------- | ------------------------------------------------------------- | --------------- | ---------------------------------------------------------- |
| **Pattern**             | Relative                                                             | Absolute                                                      | Absolute        | Package                                                    |
| **Example**             | `../../sections/`                                                    | `@/domains/auth/`                                             | `@core/` | `@nugudi/themes`                                           |
| **View → Section**      | `import { SignUpSection } from '../../sections/sign-up-section'`     | N/A                                                           | N/A             | N/A                                                        |
| **Section → Component** | `import { SignUpForm } from '../../components/sign-up-form'`         | N/A                                                           | N/A             | N/A                                                        |
| **Component → Store**   | `import { useSignUpStore } from '../../../stores/use-sign-up-store'` | `import { useAuth } from '@/src/domains/auth/presentation/hooks/use-auth'` | N/A             | N/A                                                        |
| **Any → Package**       | N/A                                                                  | N/A                                                           | N/A             | `import { Button } from '@nugudi/react-components-button'` |

### Common Import Patterns

```typescript
// ✅ CORRECT Examples
// Within same domain (auth)
import { SignUpSection } from "../../sections/sign-up-section";
import { useSignUpStore } from "../../../stores/use-sign-up-store";

// Cross-domain
import { LoginWelcome } from "@/src/domains/auth/presentation/ui/components/login-welcome";

// Shared components
import { AppHeader } from "@core/ui/components/app-header";

// Shared utilities
import { formatPriceWithCurrency } from "@core/utils/currency";

// Packages
import { Button } from "@nugudi/react-components-button";
import { Box, Flex } from "@nugudi/react-components-layout";

// ❌ WRONG Examples
// Using absolute path within same domain
import { SignUpSection } from "@/src/domains/auth/presentation/ui/sections/sign-up-section";

// Using relative path for cross-domain
import { LoginWelcome } from "../../../auth/presentation/ui/components/login-welcome";

// Wrong export pattern for packages
import Button from "@nugudi/react-components-button"; // Should be named export
```

This architecture ensures:

- **Predictable** component behavior
- **Maintainable** codebase
- **Testable** components
- **Optimal** performance with SSR/streaming
- **Clear** separation of concerns
