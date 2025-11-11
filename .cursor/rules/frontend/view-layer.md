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
