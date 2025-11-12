---
description: View patterns - Layout composition, Section orchestration, page-level UI state management, and View layer responsibilities
globs:
  - "**/presentation/ui/views/**/*.tsx"
alwaysApply: true
---

# View Layer Patterns

> **Document Type**: Frontend Component Architecture - View Layer
> **Target Audience**: Frontend developers implementing View components
> **Related Documents**: [component-hierarchy.md](./component-hierarchy.md), [page-patterns.md](./page-patterns.md), [section-patterns.md](./section-patterns.md)
> **Last Updated**: 2025-11-11

## What is a View?

A **View** is a layout composition component that:
- Defines the overall page structure and visual hierarchy
- Orchestrates multiple Sections into a cohesive page
- Manages page-level UI state (tabs, filters, active sections)
- Receives props from Pages (route params, search params)
- Acts as the bridge between routing (Page) and features (Sections)

**Type**: Client or Server Component (can be either)
**Location**: `domains/[domain]/presentation/ui/views/[feature]-view/`
**Export**: MUST use named export (e.g., `export const ProfileView`)

## View Responsibilities

### ✅ What Views MUST Do

1. **Compose Sections** - Views are Section containers, orchestrating multiple feature sections
2. **Define Page-Level Layout** - Use Layout components (Flex, Grid) to structure the page
3. **Pass Props to Sections** - Forward route params, search params, or user preferences to Sections
4. **Use Named Export** - Views use named export (e.g., `export const CafeteriaHomeView`)
5. **Be Stateless or Minimal State** - Only page-level UI state (e.g., active tab), no business logic

### ❌ What Views MUST NOT Do

1. **Fetch Data** - Views never call APIs or UseCases directly (Sections handle data fetching)
2. **Contain Business Logic** - Business logic belongs in Domain layer (UseCases)
3. **Implement Error/Loading States** - Sections handle their own error boundaries and Suspense
4. **Import Components Directly** - Views → Sections → Components (respect layer hierarchy)
5. **Use DI Container** - Views don't fetch data, so no Container needed

## Section Composition

### Basic Section Composition

```typescript
// ✅ CORRECT - Simple View with Multiple Sections
// File: domains/user/presentation/ui/views/profile-view/index.tsx
import { Flex } from '@nugudi/react-components-layout';
import { AppHeader } from '@core/ui/components/app-header';
import { ProfileSection } from '../../sections/profile-section';
import { ProfileStatsSection } from '../../sections/profile-stats-section';
import { ProfileActivitySection } from '../../sections/profile-activity-section';
import * as styles from './index.css';

export const ProfileView = () => {
  return (
    <Flex direction="column" gap={16} className={styles.container}>
      <AppHeader title="My Profile" />
      <ProfileSection />
      <ProfileStatsSection />
      <ProfileActivitySection />
    </Flex>
  );
};
```

### Section Composition with Props

```typescript
// ✅ CORRECT - View Passing Props to Sections
// File: domains/cafeteria/presentation/ui/views/cafeteria-list-view/index.tsx
import { Flex } from '@nugudi/react-components-layout';
import { CafeteriaListSection } from '../../sections/cafeteria-list-section';
import { CafeteriaFiltersSection } from '../../sections/cafeteria-filters-section';

interface CafeteriaListViewProps {
  filter: string;
  page: number;
}

export const CafeteriaListView = ({ filter, page }: CafeteriaListViewProps) => {
  return (
    <Flex direction="column" gap={24}>
      <CafeteriaFiltersSection currentFilter={filter} />
      <CafeteriaListSection filter={filter} page={page} />
    </Flex>
  );
};
```

### Cross-Domain Section Composition

```typescript
// ✅ CORRECT - View Using Sections from Multiple Domains
// File: domains/cafeteria/presentation/ui/views/cafeteria-home-view/index.tsx
import { Flex } from '@nugudi/react-components-layout';
import { AppHeader } from '@core/ui/components/app-header';
// User domain Section (cross-domain import - use absolute path)
import { UserWelcomeSection } from '@/src/domains/user/presentation/ui/sections/user-welcome-section';
// Cafeteria domain Sections (same domain - use relative path)
import { CafeteriaBrowseMenuSection } from '../../sections/cafeteria-browse-menu-section';
import { CafeteriaRecommendSection } from '../../sections/cafeteria-recommend-section';
import * as styles from './index.css';

export const CafeteriaHomeView = () => {
  return (
    <Flex direction="column" className={styles.container} gap={16}>
      <AppHeader />
      <UserWelcomeSection /> {/* Cross-domain: User Section in Cafeteria View */}
      <CafeteriaBrowseMenuSection />
      <CafeteriaRecommendSection />
    </Flex>
  );
};
```

## Layout Structure

### Grid Layout Example

```typescript
// ✅ CORRECT - Grid Layout for Dashboard
// File: domains/user/presentation/ui/views/dashboard-view/index.tsx
import { Box, Flex, Grid } from '@nugudi/react-components-layout';
import { ProfileSection } from '../../sections/profile-section';
import { StatsSection } from '../../sections/stats-section';
import { ActivitySection } from '../../sections/activity-section';
import { BenefitsSection } from '../../sections/benefits-section';
import * as styles from './index.css';

export const DashboardView = () => {
  return (
    <Box className={styles.container}>
      {/* Header - Full Width */}
      <Flex direction="column" gap={16} className={styles.header}>
        <ProfileSection />
      </Flex>

      {/* Grid Layout - 2 columns on desktop, 1 on mobile */}
      <Grid columns={{ mobile: 1, desktop: 2 }} gap={24}>
        <StatsSection />
        <BenefitsSection />
      </Grid>

      {/* Activity - Full Width */}
      <Box className={styles.activity}>
        <ActivitySection />
      </Box>
    </Box>
  );
};
```

```typescript
// index.css.ts
import { style } from '@vanilla-extract/css';
import { vars } from '@nugudi/themes';

export const container = style({
  padding: vars.box.spacing[16],
  backgroundColor: vars.colors.$scale.zinc[50],
});

export const header = style({
  marginBottom: vars.box.spacing[24],
});

export const activity = style({
  marginTop: vars.box.spacing[24],
});
```

### Responsive Layout with Flex

```typescript
// ✅ CORRECT - Responsive Flex Layout
// File: domains/benefit/presentation/ui/views/benefit-view/index.tsx
import { Flex, Box } from '@nugudi/react-components-layout';
import { BenefitFiltersSection } from '../../sections/benefit-filters-section';
import { BenefitListSection } from '../../sections/benefit-list-section';
import { BenefitStatsSection } from '../../sections/benefit-stats-section';
import * as styles from './index.css';

export const BenefitView = () => {
  return (
    <Flex direction="column" gap={24} className={styles.container}>
      {/* Stats Banner */}
      <Box className={styles.banner}>
        <BenefitStatsSection />
      </Box>

      {/* Main Content - Filters + List */}
      <Flex
        direction={{ mobile: 'column', desktop: 'row' }}
        gap={24}
        className={styles.content}
      >
        {/* Sidebar Filters */}
        <Box className={styles.sidebar}>
          <BenefitFiltersSection />
        </Box>

        {/* Main List */}
        <Box className={styles.main}>
          <BenefitListSection />
        </Box>
      </Flex>
    </Flex>
  );
};
```

## Page-Level UI State

### Tab State Management

```typescript
// ✅ CORRECT - View Managing Tab State
// File: domains/user/presentation/ui/views/settings-view/index.tsx
'use client'; // Need client component for useState

import { useState } from 'react';
import { Flex, Box } from '@nugudi/react-components-layout';
import { TabNav } from '@core/ui/components/tab-nav';
import { ProfileSettingsSection } from '../../sections/profile-settings-section';
import { PrivacySettingsSection } from '../../sections/privacy-settings-section';
import { NotificationSettingsSection } from '../../sections/notification-settings-section';

type SettingsTab = 'profile' | 'privacy' | 'notifications';

export const SettingsView = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');

  return (
    <Flex direction="column" gap={24}>
      {/* Tab Navigation */}
      <TabNav
        tabs={[
          { id: 'profile', label: 'Profile' },
          { id: 'privacy', label: 'Privacy' },
          { id: 'notifications', label: 'Notifications' },
        ]}
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab as SettingsTab)}
      />

      {/* Conditional Section Rendering */}
      <Box>
        {activeTab === 'profile' && <ProfileSettingsSection />}
        {activeTab === 'privacy' && <PrivacySettingsSection />}
        {activeTab === 'notifications' && <NotificationSettingsSection />}
      </Box>
    </Flex>
  );
};
```

### Filter State Management

```typescript
// ✅ CORRECT - View Managing Filter State
// File: domains/cafeteria/presentation/ui/views/cafeteria-browse-view/index.tsx
'use client';

import { useState } from 'react';
import { Flex } from '@nugudi/react-components-layout';
import { FilterBar } from '@core/ui/components/filter-bar';
import { CafeteriaListSection } from '../../sections/cafeteria-list-section';

type CafeteriaFilter = 'all' | 'nearby' | 'favorites' | 'popular';

export const CafeteriaBrowseView = () => {
  const [filter, setFilter] = useState<CafeteriaFilter>('all');

  return (
    <Flex direction="column" gap={16}>
      {/* Filter Controls */}
      <FilterBar
        filters={[
          { id: 'all', label: 'All' },
          { id: 'nearby', label: 'Nearby' },
          { id: 'favorites', label: 'Favorites' },
          { id: 'popular', label: 'Popular' },
        ]}
        activeFilter={filter}
        onFilterChange={(f) => setFilter(f as CafeteriaFilter)}
      />

      {/* Section with Filter Prop */}
      <CafeteriaListSection filter={filter} />
    </Flex>
  );
};
```

### URL-Based State (Preferred for Filters)

```typescript
// ✅ BETTER - View Using URL Search Params (Shareable Links)
// File: domains/cafeteria/presentation/ui/views/cafeteria-browse-view/index.tsx
'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Flex } from '@nugudi/react-components-layout';
import { FilterBar } from '@core/ui/components/filter-bar';
import { CafeteriaListSection } from '../../sections/cafeteria-list-section';

type CafeteriaFilter = 'all' | 'nearby' | 'favorites' | 'popular';

export const CafeteriaBrowseView = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filter = (searchParams.get('filter') ?? 'all') as CafeteriaFilter;

  const handleFilterChange = (newFilter: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('filter', newFilter);
    router.push(`?${params.toString()}`);
  };

  return (
    <Flex direction="column" gap={16}>
      <FilterBar
        filters={[
          { id: 'all', label: 'All' },
          { id: 'nearby', label: 'Nearby' },
          { id: 'favorites', label: 'Favorites' },
          { id: 'popular', label: 'Popular' },
        ]}
        activeFilter={filter}
        onFilterChange={handleFilterChange}
      />

      <CafeteriaListSection filter={filter} />
    </Flex>
  );
};
```

**Why URL-Based State is Better**:
- **Shareable** - Users can share filtered views with links
- **Bookmarkable** - Users can bookmark specific filter states
- **Back/Forward Navigation** - Browser history works naturally
- **SSR-Friendly** - Page can prefetch data based on URL params

## Implementation Examples

### Example 1: Simple View (Server Component)

```typescript
// ✅ CORRECT - Stateless Server Component View
// File: domains/auth/presentation/ui/views/sign-up-view/index.tsx
import { Flex, Box } from '@nugudi/react-components-layout';
import { Heading } from '@nugudi/react-components-layout';
import { SignUpSection } from '../../sections/sign-up-section';
import * as styles from './index.css';

export const SignUpView = () => {
  return (
    <Flex direction="column" align="center" className={styles.container}>
      <Box className={styles.header}>
        <Heading level={1}>Create Account</Heading>
      </Box>
      <SignUpSection />
    </Flex>
  );
};
```

### Example 2: View with Props (Server Component)

```typescript
// ✅ CORRECT - View Receiving Props from Page
// File: domains/cafeteria/presentation/ui/views/cafeteria-detail-view/index.tsx
import { Flex } from '@nugudi/react-components-layout';
import { AppHeader } from '@core/ui/components/app-header';
import { CafeteriaDetailSection } from '../../sections/cafeteria-detail-section';
import { CafeteriaMenuSection } from '../../sections/cafeteria-menu-section';
import { CafeteriaReviewsSection } from '../../sections/cafeteria-reviews-section';

interface CafeteriaDetailViewProps {
  cafeteriaId: string;
}

export const CafeteriaDetailView = ({ cafeteriaId }: CafeteriaDetailViewProps) => {
  return (
    <Flex direction="column" gap={24}>
      <AppHeader showBackButton />
      <CafeteriaDetailSection cafeteriaId={cafeteriaId} />
      <CafeteriaMenuSection cafeteriaId={cafeteriaId} />
      <CafeteriaReviewsSection cafeteriaId={cafeteriaId} />
    </Flex>
  );
};
```

### Example 3: View with UI State (Client Component)

```typescript
// ✅ CORRECT - Client Component View with UI State
// File: domains/cafeteria/presentation/ui/views/cafeteria-menu-view/index.tsx
'use client';

import { useState } from 'react';
import { Flex, Box } from '@nugudi/react-components-layout';
import { SegmentedControl } from '@core/ui/components/segmented-control';
import { MenuListSection } from '../../sections/menu-list-section';
import { MenuCalendarSection } from '../../sections/menu-calendar-section';

type ViewMode = 'list' | 'calendar';

export const CafeteriaMenuView = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  return (
    <Flex direction="column" gap={16}>
      {/* View Mode Switcher */}
      <Box>
        <SegmentedControl
          options={[
            { value: 'list', label: 'List View' },
            { value: 'calendar', label: 'Calendar View' },
          ]}
          value={viewMode}
          onChange={(value) => setViewMode(value as ViewMode)}
        />
      </Box>

      {/* Conditional Section Rendering */}
      {viewMode === 'list' && <MenuListSection />}
      {viewMode === 'calendar' && <MenuCalendarSection />}
    </Flex>
  );
};
```

## MUST/NEVER Rules for Views

### ✅ MUST Rules

1. **MUST compose Sections** - Views are Section containers

   **Why?** Views serve as composition layers that orchestrate multiple Sections into cohesive pages, providing clear separation of concerns where Views handle layout while Sections handle data and logic. This composition pattern enables independent Section development, reusability across different Views, and easier testing. Without Section composition, Views would either duplicate Section logic or become monolithic components.

2. **MUST define page-level layout** - Use Layout components (Flex, Grid)

   **Why?** Page-level layout is View's primary responsibility in the component hierarchy, determining how Sections are arranged spatially (grid, flex, columns). Defining layout in Views keeps this concern centralized and separate from Section business logic, making layout changes easier and ensuring Sections remain focused on their domain responsibilities without layout coupling.

3. **MUST pass props to Sections** - Forward params from Page to Sections

   **Why?** Sections need route parameters (IDs, slugs, filters) to fetch appropriate data, but they can't access Next.js route params directly as Server Component features. Views bridge this gap by receiving params from Pages and forwarding them to Sections, maintaining proper data flow in the component hierarchy and keeping Sections decoupled from routing implementation.

4. **MUST use named export** - `export const MyView`

   **Why?** Named exports provide better IDE autocomplete, explicit imports, and consistency with Section/Component patterns, improving code maintainability and developer experience. Unlike Pages which require default exports for Next.js routing, Views have no such constraint and benefit from named exports' advantages including better refactoring support and preventing naming inconsistencies.

5. **MUST be stateless or minimal state** - Only page-level UI state

   **Why?** Views should manage only presentational state (sidebar open/closed, tab selection) that affects page-level layout, not business data or complex state. Complex state belongs in Sections (via TanStack Query) or global stores (Zustand), keeping Views lightweight and focused on composition. Stateless Views are easier to understand, test, and maintain.

6. **MUST respect import patterns** - Relative for same domain, absolute for cross-domain

   **Why?** Consistent import patterns improve code readability and make domain boundaries explicit—relative imports (`../../sections`) indicate same-domain coupling while absolute imports (`@user/presentation`) signal cross-domain dependencies. This convention helps identify and prevent unwanted cross-domain coupling, supports refactoring, and makes dependency graphs clearer for maintaining bounded contexts.

7. **MUST use Layout components** - Box, Flex, Grid from `@nugudi/react-components-layout`

   **Why?** Layout components from the design system provide consistent spacing, responsive behavior, and design tokens integration, preventing hard-coded layout styles and ensuring visual consistency across the application. Using standardized Layout components makes code more maintainable, reduces CSS duplication, and ensures layouts follow design system guidelines automatically.

8. **MUST use design tokens** - vars and classes from `@nugudi/themes`

   **Why?** Design tokens centralize design decisions (colors, spacing, typography) ensuring visual consistency and making theme changes (like dark mode) trivial across the entire application. Hard-coded values create maintenance nightmares and visual inconsistencies. Design tokens provide single source of truth for styling, type safety, and automatic updates when the design system changes.

### ❌ NEVER Rules

1. **NEVER fetch data** - No API calls, no UseCases, no TanStack Query

   **Why?** Data fetching is Section layer's responsibility in the component hierarchy, ensuring proper error boundaries, loading states, and cache management. Views fetching data violates separation of concerns, duplicates Section functionality, and prevents proper Suspense/ErrorBoundary implementation. Keeping data fetching in Sections maintains clear layer boundaries and enables independent Section testing and reusability.

2. **NEVER contain business logic** - Business logic belongs in Domain layer

   **Why?** Business logic (validation, calculations, rules) belongs in the Domain layer (Entities, UseCases), not Presentation layer. Views with business logic violate Clean Architecture, create tight coupling to business rules, and make logic untestable and unreusable. Domain layer provides single source of truth for business rules, ensuring consistency and enabling independent testing.

3. **NEVER implement error/loading states** - Sections handle their own boundaries

   **Why?** Error and loading boundaries are Section-level concerns, allowing each Section to fail or load independently without affecting others. View-level error handling would create all-or-nothing scenarios where one Section error breaks the entire View. Section-level boundaries provide fault isolation, better UX (partial page loading), and more granular error handling.

4. **NEVER import Components directly** - Use hierarchy (View → Section → Component)

   **Why?** Skipping the Section layer violates component hierarchy (View → Section → Component), creating tight coupling and preventing proper data fetching and boundary implementation. Direct Component imports force Views to duplicate Section logic (data fetching, error handling), reduce reusability, and make testing difficult. Respecting hierarchy maintains clear separation of concerns.

5. **NEVER use DI Container** - Views don't fetch data

   **Why?** DI Containers exist for dependency injection when fetching data via UseCases, which Views never do by design. Views using DI Containers indicates architectural violation—data fetching belongs in Sections, not Views. This rule enforces proper layer boundaries and ensures Views remain focused on composition and layout, not data management.

6. **NEVER manage complex state** - Use Zustand stores or move to Section

   **Why?** Complex state (form data, filters, multi-step flows) requires sophisticated state management that clutters Views and violates Single Responsibility Principle. Global state belongs in Zustand stores (cross-Section state) or Sections (Section-specific state with TanStack Query). Views should manage only simple presentational state like UI toggles, keeping them lightweight and focused.

7. **NEVER handle authentication** - Auth checks happen in Page or middleware

   **Why?** Authentication is a cross-cutting concern handled at Page level (SSR) or middleware (edge), not in Views, ensuring consistent auth checks before any UI renders. View-level auth checks create security gaps (client-side only), duplicate logic across Views, and provide poor UX (rendering then redirecting). Centralized auth in Pages/middleware ensures security and consistency.

8. **NEVER call Server Actions directly** - Sections handle mutations

   **Why?** Server Actions are data mutation mechanisms that Sections manage with proper error handling, optimistic updates, and cache invalidation via TanStack Query mutations. Views calling Server Actions bypasses Section boundaries, prevents proper error/loading states, and duplicates mutation logic. Sections provide the correct layer for mutation handling with all necessary patterns.

## Common Patterns

### Pattern 1: Multi-Section Dashboard

```typescript
// File: domains/user/presentation/ui/views/dashboard-view/index.tsx
import { Flex, Grid } from '@nugudi/react-components-layout';
import { UserWelcomeSection } from '../../sections/user-welcome-section';
import { UserStatsSection } from '../../sections/user-stats-section';
import { RecentActivitySection } from '../../sections/recent-activity-section';
import { QuickActionsSection } from '../../sections/quick-actions-section';

export const DashboardView = () => {
  return (
    <Flex direction="column" gap={24}>
      {/* Welcome Banner - Full Width */}
      <UserWelcomeSection />

      {/* Stats + Quick Actions - Side by Side */}
      <Grid columns={{ mobile: 1, desktop: 2 }} gap={24}>
        <UserStatsSection />
        <QuickActionsSection />
      </Grid>

      {/* Recent Activity - Full Width */}
      <RecentActivitySection />
    </Flex>
  );
};
```

### Pattern 2: Conditional Section Loading

```typescript
// File: domains/benefit/presentation/ui/views/benefit-detail-view/index.tsx
import { Flex } from '@nugudi/react-components-layout';
import { BenefitDetailSection } from '../../sections/benefit-detail-section';
import { BenefitUsageSection } from '../../sections/benefit-usage-section';
import { BenefitRelatedSection } from '../../sections/benefit-related-section';

interface BenefitDetailViewProps {
  benefitId: string;
  showUsage?: boolean; // Optional prop
}

export const BenefitDetailView = ({
  benefitId,
  showUsage = true,
}: BenefitDetailViewProps) => {
  return (
    <Flex direction="column" gap={24}>
      <BenefitDetailSection benefitId={benefitId} />
      {showUsage && <BenefitUsageSection benefitId={benefitId} />}
      <BenefitRelatedSection benefitId={benefitId} />
    </Flex>
  );
};
```

### Pattern 3: Nested Layout Sections

```typescript
// File: domains/cafeteria/presentation/ui/views/cafeteria-management-view/index.tsx
import { Flex, Box, Grid } from '@nugudi/react-components-layout';
import { CafeteriaInfoSection } from '../../sections/cafeteria-info-section';
import { MenuManagementSection } from '../../sections/menu-management-section';
import { ReviewManagementSection } from '../../sections/review-management-section';
import { StampManagementSection } from '../../sections/stamp-management-section';

interface CafeteriaManagementViewProps {
  cafeteriaId: string;
}

export const CafeteriaManagementView = ({
  cafeteriaId,
}: CafeteriaManagementViewProps) => {
  return (
    <Flex direction="column" gap={32}>
      {/* Info Section - Full Width */}
      <CafeteriaInfoSection cafeteriaId={cafeteriaId} />

      {/* Management Sections - Grid Layout */}
      <Grid columns={{ mobile: 1, tablet: 2, desktop: 3 }} gap={24}>
        <MenuManagementSection cafeteriaId={cafeteriaId} />
        <ReviewManagementSection cafeteriaId={cafeteriaId} />
        <StampManagementSection cafeteriaId={cafeteriaId} />
      </Grid>
    </Flex>
  );
};
```

## Related Documentation

- **[component-hierarchy.md](./component-hierarchy.md)** - Overall component hierarchy
- **[page-patterns.md](./page-patterns.md)** - Page layer and data prefetching
- **[section-patterns.md](./section-patterns.md)** - Section layer and data fetching
- **[component-patterns.md](./component-patterns.md)** - Component layer patterns
- **[../packages.md](../packages.md)** - Monorepo package usage and import patterns
