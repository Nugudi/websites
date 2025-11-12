---
description: View layer rules - Page layout composition and section orchestration
globs:
  - "**/presentation/ui/views/**/*.tsx"
  - "**/presentation/ui/views/**/*.ts"
alwaysApply: true
---

# View Layer Rules

**Type**: Client or Server Component
**Purpose**: Page layout composition and section orchestration

## Table of Contents

- [MUST Rules](#must-rules)
- [NEVER Rules](#never-rules)
- [Example: Correct View Implementation](#example-correct-view-implementation)
- [Example: Wrong Patterns](#example-wrong-patterns)
- [Layout Composition Pattern](#layout-composition-pattern)
- [Import Patterns](#import-patterns)
- [State Management](#state-management)
- [Responsibilities Summary](#responsibilities-summary)

## MUST Rules

1. **MUST compose Sections** — Views are Section containers, orchestrating multiple feature sections
2. **MUST define page-level layout** — Use Layout components (Flex, Grid) to structure the page
3. **MUST pass props to Sections** — Forward route params, search params, or user preferences to Sections
4. **MUST use named export** — Views use named export (e.g., `export const CafeteriaHomeView`)
5. **MUST be stateless or minimal state** — Only page-level UI state (e.g., active tab), no business logic

## NEVER Rules

1. **NEVER fetch data** — Views never call APIs or UseCases directly (Sections handle data fetching)
2. **NEVER contain business logic** — Business logic belongs in Domain layer (UseCases)
3. **NEVER implement error/loading states** — Sections handle their own error boundaries and Suspense
4. **NEVER import Components directly** — Views → Sections → Components (respect layer hierarchy)
5. **NEVER use DI Container** — Views don't fetch data, so no Container needed

**Why These Rules Exist:**

**MUST Rules Explained:**

1. **Why MUST compose Sections?**
   - **Separation of Concerns**: View = Layout orchestration, Section = Feature logic
   - **Maintainability**: Feature changes happen in Sections, layout changes in Views
   - **Reusability**: Sections can be reused across multiple Views
   - **Clear Hierarchy**: Enforces Page → View → Section → Component pattern
   - **Testing**: Can test Sections independently from View layout

2. **Why MUST define page-level layout?**
   - **Single Responsibility**: View's ONLY job is arranging Sections spatially
   - **Layout Components**: Use `Flex`, `Grid`, `VStack`, `HStack` from `@nugudi/react-components-layout`
   - **Responsive Design**: Layout logic centralized in one place
   - **Visual Consistency**: All pages use same layout primitives
   - **No Logic**: Layout is purely structural, no data or business logic

3. **Why MUST pass props to Sections?**
   - **Data Flow**: View receives props from Page, forwards to Sections
   - **Configuration**: Sections need route params, search params, user preferences
   - **Decoupling**: Sections don't access URL directly, remain pure functions
   - **Testability**: Can test Sections with different prop values
   - **Props Drilling**: Acceptable at View layer, keeps Sections flexible

4. **Why MUST use named export?**
   - **Component Clarity**: Named export = Clear component name in imports
   - **Tree-shaking**: Named exports enable better dead code elimination
   - **Refactoring**: Easier to rename with IDE tools
   - **Consistency**: All Views use named export convention
   - **Not a Page**: Only Pages require default export for Next.js routing

5. **Why MUST be stateless or minimal state?**
   - **Simplicity**: Views are thin layout layers, not stateful components
   - **State Ownership**: Business state belongs in Sections, global state in stores
   - **Acceptable UI State**: Tab selection, drawer open/closed, accordion expanded
   - **No Data State**: Data fetching state belongs in Sections
   - **Pure Functions**: Stateless Views are easier to reason about and test

**NEVER Rules Explained:**

1. **Why NEVER fetch data?**
   - **Wrong Layer**: Data fetching is Section's responsibility
   - **Violates Hierarchy**: View is layout orchestrator, not data manager
   - **No Container**: Views shouldn't need DI Container
   - **Testing Difficulty**: Data fetching in View = Hard to test layout separately
   - **Reusability**: View with data fetching can't be reused with different data sources

2. **Why NEVER contain business logic?**
   - **Domain Layer**: Business logic belongs in UseCases (Domain layer)
   - **Separation of Concerns**: View = Layout, Section = Feature, UseCase = Business rules
   - **Testability**: Business logic in View = Can't unit test without UI
   - **Reusability**: Business logic tied to UI = Can't reuse across platforms
   - **Maintainability**: Business rules scattered in Views = Nightmare to maintain

3. **Why NEVER implement error/loading states?**
   - **Section Responsibility**: Sections implement ErrorBoundary and Suspense
   - **Granular Control**: Each Section handles its own errors/loading independently
   - **Resilience**: One Section failing doesn't affect others
   - **Layout Stability**: Section-level Suspense prevents layout shift
   - **Wrong Abstraction**: View doesn't know what data Sections fetch

4. **Why NEVER import Components directly?**
   - **Layer Skipping**: Violates Page → View → Section → Component hierarchy
   - **Lost Abstraction**: Sections provide feature-level abstraction
   - **Tight Coupling**: View directly using Components = Hard to refactor
   - **No Error Handling**: Components don't have ErrorBoundary, Sections do
   - **Responsibility Blur**: Components are UI primitives, not features

5. **Why NEVER use DI Container?**
   - **No Data Fetching**: Views don't fetch data, so don't need UseCases
   - **Wrong Layer**: Container usage indicates View is doing Section's job
   - **Code Smell**: If View needs Container, logic should move to Section
   - **Simplicity**: Views should be simple layout composition
   - **Clear Signal**: Need for Container = Architectural violation

## Example: Correct View Implementation

```typescript
// ✅ CORRECT View Implementation
// domains/cafeteria/presentation/ui/views/cafeteria-home-view/index.tsx
import { Flex } from "@nugudi/react-components-layout";
import { AppHeader } from "@/src/shared/core/ui/components/app-header";
import { CafeteriaBrowseMenuSection } from "../../sections/cafeteria-browse-menu-section";
import { CafeteriaRecommendSection } from "../../sections/cafeteria-recommend-section";
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
```

## Example: Wrong Patterns

```typescript
// ❌ WRONG Examples
export const CafeteriaHomeView = () => {
  const container = getCafeteriaClientContainer(); // ❌ Views don't use Container
  const { data } = useSuspenseQuery(...); // ❌ Views don't fetch data

  if (!data) return <Skeleton />; // ❌ Views don't handle loading states

  return <CafeteriaCard data={data} />; // ❌ Views don't import Components directly
};
```

## Layout Composition Pattern

```typescript
// ✅ CORRECT - View as layout orchestrator
export const SignUpView = ({ step }) => {
  return (
    <Box className={styles.container}>
      <SignUpHeaderSection />
      <SignUpFormSection step={step} />
      <SignUpFooterSection />
    </Box>
  );
};
```

## Import Patterns

```typescript
// ✅ CORRECT - Relative imports within same domain
import { SignUpSection } from '../../sections/sign-up-section';
import { UserWelcomeSection } from '../../sections/user-welcome-section';

// ✅ CORRECT - Absolute imports for cross-domain
import { AppHeader } from '@/src/shared/core/ui/components/app-header';

// ✅ CORRECT - Package imports
import { Flex, VStack } from '@nugudi/react-components-layout';

// ❌ WRONG - Absolute imports within same domain
import { SignUpSection } from '@/src/domains/auth/presentation/ui/sections/sign-up-section';

// ❌ WRONG - Components imported directly (skip Section layer)
import { SignUpForm } from '../../components/sign-up-form';
```

## State Management

Views can have minimal page-level UI state:

```typescript
// ✅ CORRECT - Minimal UI state only
export const CafeteriaView = () => {
  const [activeTab, setActiveTab] = useState('lunch'); // ✅ UI state

  return (
    <Box>
      <TabNav activeTab={activeTab} onChange={setActiveTab} />
      <CafeteriaListSection filter={activeTab} />
    </Box>
  );
};

// ❌ WRONG - Business logic state
export const CafeteriaView = () => {
  const [cafeterias, setCafeterias] = useState([]); // ❌ Data state
  const [isLoading, setIsLoading] = useState(false); // ❌ Fetching state
};
```

## Responsibilities Summary

| Responsibility | View | Section |
|----------------|------|---------|
| **Layout** | ✅ Defines page structure | ❌ No |
| **Data Fetching** | ❌ No | ✅ Fetches data |
| **Error Handling** | ❌ No | ✅ ErrorBoundary |
| **Loading State** | ❌ No | ✅ Suspense |
| **Business Logic** | ❌ No | ✅ Via UseCases |
| **Component Orchestration** | ✅ Composes Sections | ✅ Composes Components |

---

**Related**: See `section-layer.md` for data fetching, `component-layer.md` for pure UI
