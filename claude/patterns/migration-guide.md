---
description: "Migration patterns from legacy code to Clean Architecture: @nugudi/api to DI Container, Factory to UseCase, Mapper to Adapter, SSR prefetch"
globs:
  - "apps/web/src/domains/**/presentation/**/*.tsx"
  - "apps/web/src/domains/**/domain/**/*.ts"
  - "apps/web/src/domains/**/data/**/*.ts"
  - "apps/web/src/domains/**/di/**/*.ts"
alwaysApply: true
---

# Migration Guide: Legacy → Clean Architecture

> **Target Audience**: Developers migrating existing code to Clean Architecture patterns
> **Related Documents**: [../packages/monorepo-structure.md](../packages/monorepo-structure.md), [../frontend/component-hierarchy.md](../frontend/component-hierarchy.md), [../core/architecture.md](../core/architecture.md)
> **Last Updated**: 2025-11-10

## Overview

This guide provides step-by-step migration patterns for transitioning from legacy code patterns to Clean Architecture. Each section includes:

- ❌ Legacy pattern (what to avoid)
- ✅ New pattern (what to use instead)
- 🔄 Migration steps
- ✅ Verification checklist

---

## Migration 1: From `@nugudi/api` to DI Container + UseCase

### ❌ Legacy Pattern (REMOVED)

```typescript
// apps/web/src/domains/user/presentation/sections/profile-section.tsx
import { api } from '@nugudi/api'; // ❌ Package has been removed

export function ProfileSection() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    api.users.getProfile(userId).then(setProfile); // ❌ Direct API call
  }, [userId]);

  return <div>{profile?.name}</div>;
}
```

**Problems:**

- ❌ Violates Clean Architecture (Presentation directly calls API)
- ❌ No business logic layer (UseCase missing)
- ❌ Hard to test (API calls tightly coupled)
- ❌ No dependency inversion

### ✅ New Pattern: DI Container + UseCase + TanStack Query

#### Step 1: Create Repository Interface (Domain Layer)

```typescript
// apps/web/src/domains/user/domain/repositories/user-repository.interface.ts
import type { UserProfile } from '../entities';

export interface UserRepository {
  getMyProfile(): Promise<UserProfile>;
}
```

#### Step 2: Implement Repository (Data Layer)

```typescript
// apps/web/src/domains/user/data/repositories/user-repository.impl.ts
import type { HttpClient } from '@/domains/user/infrastructure/http/http-client';
import type { UserRepository } from '../../domain/repositories/user-repository.interface';
import type { UserProfile } from '../../domain/entities';

export class UserRepositoryImpl implements UserRepository {
  constructor(private readonly httpClient: HttpClient) {}

  async getMyProfile(): Promise<UserProfile> {
    const response = await this.httpClient.get<UserProfile>('/api/users/me');
    return response.data;
  }
}
```

#### Step 3: Create UseCase (Domain Layer)

```typescript
// apps/web/src/domains/user/domain/usecases/get-my-profile.usecase.ts
import type { UserRepository } from '../repositories/user-repository.interface';
import type { UserProfile } from '../entities';

export class GetMyProfileUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(): Promise<UserProfile> {
    return await this.userRepository.getMyProfile();
  }
}
```

#### Step 4: Add to DI Container

```typescript
// apps/web/src/domains/user/di/user-client-container.ts
import { UserRepositoryImpl } from '../data/repositories/user-repository.impl';
import { GetMyProfileUseCase } from '../domain/usecases/get-my-profile.usecase';
import { getHttpClient } from '../infrastructure/http/http-client';

class UserClientContainer {
  private static instance: UserClientContainer | null = null;
  private httpClient = getHttpClient();

  private constructor() {}

  static getInstance(): UserClientContainer {
    if (!UserClientContainer.instance) {
      UserClientContainer.instance = new UserClientContainer();
    }
    return UserClientContainer.instance;
  }

  getGetMyProfile(): GetMyProfileUseCase {
    const repository = new UserRepositoryImpl(this.httpClient);
    return new GetMyProfileUseCase(repository);
  }
}

export const getUserClientContainer = () => UserClientContainer.getInstance();
```

#### Step 5: Create Query Hook (Presentation Layer)

```typescript
// apps/web/src/domains/user/presentation/hooks/get-my-profile.query.ts
import { useSuspenseQuery } from '@tanstack/react-query';
import { getUserClientContainer } from '../../di/user-client-container';

export const USER_PROFILE_QUERY_KEY = ['user', 'profile', 'me'] as const;

export const useGetMyProfile = () => {
  const container = getUserClientContainer();
  const getMyProfileUseCase = container.getGetMyProfile();

  return useSuspenseQuery({
    queryKey: USER_PROFILE_QUERY_KEY,
    queryFn: () => getMyProfileUseCase.execute(),
  });
};
```

#### Step 6: Use in Component

```typescript
// apps/web/src/domains/user/presentation/sections/profile-section.tsx
import { useGetMyProfile } from '../hooks/get-my-profile.query';

export function ProfileSection() {
  const { data: profile } = useGetMyProfile(); // ✅ Clean, testable

  return <div>{profile.name}</div>;
}
```

### 🔄 Migration Checklist

- [ ] Create Repository Interface in `domain/repositories/`
- [ ] Implement Repository in `data/repositories/`
- [ ] Create UseCase in `domain/usecases/`
- [ ] Add UseCase getter to DI Container
- [ ] Create Query Hook in `presentation/hooks/`
- [ ] Replace direct API calls with Query Hook
- [ ] Remove `@nugudi/api` import
- [ ] Add tests for Repository, UseCase, and Hook
- [ ] Verify TypeScript compilation
- [ ] Test in browser

---

## Migration 2: From Factory Pattern to DI Container

### ❌ Legacy Pattern (DEPRECATED)

```typescript
// ❌ Old Factory Pattern
import { createGetUserProfileQueryOptions } from '../hooks/get-user-profile.factory';

export function ProfileSection() {
  const { data } = useSuspenseQuery(
    createGetUserProfileQueryOptions() // ❌ Factory pattern
  );
}
```

**Problems:**

- ❌ Factory doesn't follow DI principles
- ❌ Hard to mock dependencies for testing
- ❌ Inconsistent with other parts of codebase

### ✅ New Pattern: Query Hook with DI Container

```typescript
// ✅ New Query Hook Pattern
import { useGetMyProfile } from '../hooks/get-my-profile.query';

export function ProfileSection() {
  const { data } = useGetMyProfile(); // ✅ Clean, consistent
}
```

### 🔄 Migration Steps

1. **Delete Factory file**: Remove `*.factory.ts` file
2. **Create Query Hook**: Follow naming convention `get-[feature].query.ts`
3. **Use DI Container**: Get UseCase from container
4. **Update imports**: Replace factory with hook
5. **Test**: Verify functionality works

---

## Migration 3: From Direct Entity Methods to Adapter Pattern

### When to Migrate to Adapter?

**Threshold**: If your component calls **7+ Entity methods** to prepare UI data, use Adapter pattern.

### ❌ Without Adapter (Component has too many Entity calls)

```typescript
// ❌ Component with 10+ Entity method calls
export function BenefitCard({ benefit }: { benefit: Benefit }) {
  const title = benefit.getTitle();
  const description = benefit.getDescription();
  const imageUrl = benefit.getImageUrl();
  const categoryName = benefit.getCategoryName();
  const usageCount = benefit.getUsageCount();
  const maxUsageCount = benefit.getMaxUsageCount();
  const isAvailable = benefit.isAvailable();
  const expiryDate = benefit.getExpiryDate();
  const formattedExpiry = benefit.getFormattedExpiryDate();
  const discountRate = benefit.getDiscountRate();
  const statusBadge = benefit.getStatusBadge();
  const canUse = benefit.canUse();

  return (
    <Card>
      <img src={imageUrl} />
      <h3>{title}</h3>
      <p>{description}</p>
      {/* ... 10+ more UI elements using Entity methods ... */}
    </Card>
  );
}
```

**Problems:**

- ❌ Component knows too much about Entity structure
- ❌ Hard to test (need full Entity setup)
- ❌ Difficult to reuse transformation logic
- ❌ UI logic mixed with component

### ✅ With Adapter (Clean separation)

#### Step 1: Create UI Type

```typescript
// apps/web/src/domains/benefit/presentation/types/benefit-card.types.ts
export interface BenefitCardData {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: {
    name: string;
    color: string;
  };
  usage: {
    current: number;
    max: number;
    canUse: boolean;
  };
  expiry: {
    date: Date;
    formatted: string;
    isExpiringSoon: boolean;
  };
  discount: {
    rate: number;
    badge: string;
  };
  availability: {
    isAvailable: boolean;
    reason?: string;
  };
}
```

#### Step 2: Create Adapter

```typescript
// apps/web/src/domains/benefit/presentation/adapters/benefit-card.adapter.ts
import type { Benefit } from '../../domain/entities';
import type { BenefitCardData } from '../types/benefit-card.types';

/**
 * Benefit Card Adapter
 *
 * Transforms Benefit Entity to BenefitCardData UI type for card display.
 * Uses Adapter pattern because transformation requires 10+ Entity method calls.
 *
 * @see BenefitCardData for UI type structure
 */
export class BenefitCardAdapter {
  /**
   * Transform Benefit Entity to Card UI data
   *
   * @param benefit - Benefit domain entity
   * @returns BenefitCardData ready for UI rendering
   */
  static toCardData(benefit: Benefit): BenefitCardData {
    return {
      id: benefit.getId(),
      title: benefit.getTitle(),
      description: benefit.getDescription(),
      imageUrl: benefit.getImageUrl(),
      category: this.adaptCategory(benefit),
      usage: this.adaptUsage(benefit),
      expiry: this.adaptExpiry(benefit),
      discount: this.adaptDiscount(benefit),
      availability: this.adaptAvailability(benefit),
    };
  }

  /**
   * Adapt category information
   * @private
   */
  private static adaptCategory(benefit: Benefit) {
    return {
      name: benefit.getCategoryName(),
      color: benefit.getCategoryColor(),
    };
  }

  /**
   * Adapt usage information
   * @private
   */
  private static adaptUsage(benefit: Benefit) {
    return {
      current: benefit.getUsageCount(),
      max: benefit.getMaxUsageCount(),
      canUse: benefit.canUse(),
    };
  }

  /**
   * Adapt expiry information
   * @private
   */
  private static adaptExpiry(benefit: Benefit) {
    return {
      date: benefit.getExpiryDate(),
      formatted: benefit.getFormattedExpiryDate(),
      isExpiringSoon: benefit.isExpiringSoon(),
    };
  }

  /**
   * Adapt discount information
   * @private
   */
  private static adaptDiscount(benefit: Benefit) {
    return {
      rate: benefit.getDiscountRate(),
      badge: benefit.getStatusBadge(),
    };
  }

  /**
   * Adapt availability information
   * @private
   */
  private static adaptAvailability(benefit: Benefit) {
    return {
      isAvailable: benefit.isAvailable(),
      reason: !benefit.isAvailable()
        ? benefit.getUnavailableReason()
        : undefined,
    };
  }
}
```

#### Step 3: Use in Component

```typescript
// ✅ Clean component using Adapter
import { BenefitCardAdapter } from '../adapters/benefit-card.adapter';
import type { Benefit } from '../../domain/entities';

export function BenefitCard({ benefit }: { benefit: Benefit }) {
  const cardData = BenefitCardAdapter.toCardData(benefit); // ✅ Single adapter call

  return (
    <Card>
      <img src={cardData.imageUrl} />
      <h3>{cardData.title}</h3>
      <p>{cardData.description}</p>
      <Badge color={cardData.category.color}>{cardData.category.name}</Badge>
      <UsageBar current={cardData.usage.current} max={cardData.usage.max} />
      <ExpiryLabel
        date={cardData.expiry.formatted}
        warning={cardData.expiry.isExpiringSoon}
      />
      <DiscountBadge rate={cardData.discount.rate}>
        {cardData.discount.badge}
      </DiscountBadge>
      {!cardData.availability.isAvailable && (
        <Alert>{cardData.availability.reason}</Alert>
      )}
    </Card>
  );
}
```

### 🔄 Migration Steps

1. **Count Entity method calls** in component
2. **If < 7 calls**: Use Mapper pattern (simple function)
3. **If ≥ 7 calls**: Create Adapter pattern:
   - [ ] Create UI Type in `presentation/types/`
   - [ ] Create Adapter class in `presentation/adapters/`
   - [ ] Add comprehensive JSDoc to ALL methods
   - [ ] Add private helper methods for complex transformations
   - [ ] Replace Entity calls with Adapter call
   - [ ] Write Adapter tests
4. **Verify**: Component is now much simpler

---

## Migration 4: Server-side Data Fetching Pattern

### ❌ Legacy Pattern (Client-side only)

```typescript
// ❌ Old pattern: Only client-side fetching
// app/(auth)/profile/page.tsx
export default function ProfilePage() {
  return (
    <Suspense fallback={<Loading />}>
      <ProfileSection /> {/* ❌ Data fetching happens here */}
    </Suspense>
  );
}

// sections/profile-section.tsx
function ProfileSection() {
  const { data } = useGetMyProfile(); // ❌ Fetches on client
  return <ProfileView profile={data} />;
}
```

**Problems:**

- ❌ No SSR data prefetching
- ❌ Slower initial page load
- ❌ SEO impact (data not in initial HTML)

### ✅ New Pattern: Server DI Container + Prefetch + Client Hydration

#### Step 1: Create Server DI Container

```typescript
// apps/web/src/domains/user/di/user-server-container.ts
import { UserRepositoryImpl } from '../data/repositories/user-repository.impl';
import { GetMyProfileUseCase } from '../domain/usecases/get-my-profile.usecase';
import { getHttpClient } from '../infrastructure/http/http-client';

/**
 * Server-side DI Container (Stateless)
 *
 * Creates NEW instances per request (no singleton).
 * Use in Server Components and Server Actions only.
 */
export function createUserServerContainer() {
  const httpClient = getHttpClient();

  return {
    getGetMyProfile(): GetMyProfileUseCase {
      const repository = new UserRepositoryImpl(httpClient);
      return new GetMyProfileUseCase(repository);
    },
  };
}
```

#### Step 2: Prefetch in Page (Server Component)

```typescript
// app/(auth)/profile/page.tsx
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query';
import { createUserServerContainer } from '@/domains/user/di/user-server-container';
import { USER_PROFILE_QUERY_KEY } from '@/domains/user/presentation/hooks/get-my-profile.query';
import { ProfileSection } from '@/domains/user/presentation/sections/profile-section';

export default async function ProfilePage() {
  const queryClient = new QueryClient();
  const container = createUserServerContainer(); // ✅ Server DI Container
  const getMyProfileUseCase = container.getGetMyProfile();

  // ✅ Prefetch data on server
  await queryClient.prefetchQuery({
    queryKey: USER_PROFILE_QUERY_KEY,
    queryFn: () => getMyProfileUseCase.execute(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<ProfileSectionSkeleton />}>
        <ProfileSection /> {/* ✅ Hydrates with server data */}
      </Suspense>
    </HydrationBoundary>
  );
}
```

#### Step 3: Client Component Uses Hydrated Data

```typescript
// sections/profile-section.tsx (unchanged!)
'use client';

import { useGetMyProfile } from '../hooks/get-my-profile.query';

export function ProfileSection() {
  const { data } = useGetMyProfile(); // ✅ Uses server-prefetched data
  return <ProfileView profile={data} />;
}
```

### 🔄 Migration Checklist

- [ ] Create Server DI Container (`create[Domain]ServerContainer`)
- [ ] Make Page component `async`
- [ ] Create `QueryClient` in Page
- [ ] Prefetch data using Server DI Container
- [ ] Wrap Section with `HydrationBoundary`
- [ ] Verify: Data appears in initial HTML (View Source)
- [ ] Verify: No loading spinner on first load
- [ ] Test: Client-side refetching still works

---

## Migration 5: From Mapper to Adapter (When Complexity Grows)

### Scenario: You started with Mapper, but now have 7+ Entity calls

### ❌ Current State: Mapper becoming too complex

```typescript
// presentation/mappers/stamp-card.mapper.ts
export function mapStampToCardData(stamp: Stamp): StampCardData {
  // Started simple, now has 10+ method calls
  return {
    id: stamp.getId(),
    title: stamp.getTitle(),
    description: stamp.getDescription(),
    imageUrl: stamp.getImageUrl(),
    progress: stamp.getCurrentCount() / stamp.getRequiredCount(),
    currentCount: stamp.getCurrentCount(),
    requiredCount: stamp.getRequiredCount(),
    isCompleted: stamp.isCompleted(),
    isExpired: stamp.isExpired(),
    expiryDate: stamp.getExpiryDate(),
    formattedExpiry: stamp.getFormattedExpiryDate(),
    canStamp: stamp.canStamp(),
    statusMessage: stamp.getStatusMessage(),
    // ... getting too complex for a simple function
  };
}
```

### ✅ Refactor to Adapter

```typescript
// presentation/adapters/stamp-card.adapter.ts
/**
 * Stamp Card Adapter
 *
 * Migrated from Mapper pattern due to increased complexity (10+ Entity method calls).
 * Provides structured transformation with helper methods for maintainability.
 */
export class StampCardAdapter {
  /**
   * Transform Stamp Entity to Card UI data
   *
   * @param stamp - Stamp domain entity
   * @returns StampCardData ready for UI rendering
   */
  static toCardData(stamp: Stamp): StampCardData {
    return {
      id: stamp.getId(),
      title: stamp.getTitle(),
      description: stamp.getDescription(),
      imageUrl: stamp.getImageUrl(),
      progress: this.calculateProgress(stamp),
      status: this.adaptStatus(stamp),
      expiry: this.adaptExpiry(stamp),
    };
  }

  /**
   * Calculate progress information
   * @private
   */
  private static calculateProgress(stamp: Stamp) {
    return {
      current: stamp.getCurrentCount(),
      required: stamp.getRequiredCount(),
      percentage: (stamp.getCurrentCount() / stamp.getRequiredCount()) * 100,
      isCompleted: stamp.isCompleted(),
    };
  }

  /**
   * Adapt status information
   * @private
   */
  private static adaptStatus(stamp: Stamp) {
    return {
      canStamp: stamp.canStamp(),
      message: stamp.getStatusMessage(),
    };
  }

  /**
   * Adapt expiry information
   * @private
   */
  private static adaptExpiry(stamp: Stamp) {
    return {
      isExpired: stamp.isExpired(),
      date: stamp.getExpiryDate(),
      formatted: stamp.getFormattedExpiryDate(),
    };
  }
}
```

### 🔄 Refactoring Steps

1. **Create Adapter class** in `presentation/adapters/`
2. **Move Mapper logic** to main adapter method
3. **Extract helper methods** for complex transformations
4. **Add comprehensive JSDoc** to all methods
5. **Update all imports** from Mapper to Adapter
6. **Delete old Mapper file**
7. **Update tests**

---

## Verification Checklist (All Migrations)

After completing any migration:

### Functionality

- [ ] All features work as before
- [ ] No console errors in browser
- [ ] Network requests succeed

### Code Quality

- [ ] TypeScript compilation succeeds (`pnpm tsc`)
- [ ] All tests pass (`pnpm test`)
- [ ] No ESLint warnings
- [ ] Code follows established patterns

### Architecture

- [ ] No direct API calls (only through Repository)
- [ ] No `@nugudi/api` imports
- [ ] DI Container used correctly (Server vs Client)
- [ ] Layer dependencies correct (Presentation → Domain → Data → Infrastructure)

### Documentation

- [ ] JSDoc added to all public methods
- [ ] Code comments explain "why", not "what"
- [ ] Migration recorded in git commit

---

## Common Pitfalls

### ❌ Using Client DI Container in Server Components

```typescript
// ❌ WRONG
import { getUserClientContainer } from '@/domains/user/di/user-client-container';

export default async function ProfilePage() {
  const container = getUserClientContainer(); // ❌ Breaks SSR
  // ...
}
```

```typescript
// ✅ CORRECT
import { createUserServerContainer } from '@/domains/user/di/user-server-container';

export default async function ProfilePage() {
  const container = createUserServerContainer(); // ✅ Works with SSR
  // ...
}
```

### ❌ Creating Adapter for Simple Transformations

```typescript
// ❌ WRONG: Only 3 Entity method calls, Mapper is sufficient
export class SimpleAdapter {
  static toData(entity: Entity) {
    return {
      id: entity.getId(),
      name: entity.getName(),
      value: entity.getValue(),
    };
  }
}
```

```typescript
// ✅ CORRECT: Use Mapper for simple transformations
export function mapEntityToData(entity: Entity) {
  return {
    id: entity.getId(),
    name: entity.getName(),
    value: entity.getValue(),
  };
}
```

### ❌ Skipping JSDoc on Adapter Methods

```typescript
// ❌ WRONG: No JSDoc
export class BenefitAdapter {
  static toCardData(benefit: Benefit) {
    // ❌ Missing JSDoc
    // ...
  }
}
```

```typescript
// ✅ CORRECT: Comprehensive JSDoc
export class BenefitAdapter {
  /**
   * Transform Benefit Entity to Card UI data
   *
   * Aggregates 10+ Entity methods into structured UI type for card rendering.
   *
   * @param benefit - Benefit domain entity with business logic
   * @returns BenefitCardData optimized for card component display
   */
  static toCardData(benefit: Benefit): BenefitCardData {
    // ...
  }
}
```

---

## Need Help?

- **Architecture questions**: See [architecture.md](../core/architecture.md)
- **Component patterns**: See [frontend.md](../frontend.md)
- **Package usage**: See [packages.md](../packages.md)
- **Testing strategies**: See [testing.md](../testing.md)
