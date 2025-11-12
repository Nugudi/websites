---
description: "Frontend architecture overview, 4-layer component hierarchy (Page→View→Section→Component), data flow, and architectural patterns"
globs:
  - "src/domains/*/presentation/**/*"
  - "app/**/*.tsx"
alwaysApply: true
---

# Frontend Architecture Guide

> **Document Type**: Frontend Architecture Index & Navigation
> **Target Audience**: Frontend developers and AI agents
> **Purpose**: Central entry point for understanding frontend component architecture
> **Last Updated**: 2025-01-12

## 📖 What This Document Covers

This is the **central index** for understanding the frontend architecture in Nugudi. Read this first to understand:

- 🏗️ **4-Layer Hierarchy**: Page → View → Section → Component
- 🔄 **Data Flow**: Server DI Container → TanStack Query → Client DI Container
- 🎯 **Layer Responsibilities**: What each layer can and cannot do
- 🔗 **Import Patterns**: How layers communicate with each other

---

## 🚀 Quick Start (Read These in Order)

### 1. Understanding Component Hierarchy (Start Here) ⭐

**📄 [frontend/component-hierarchy.md](./frontend/component-hierarchy.md)**

**Essential reading** for understanding the 4-layer architecture.

**What You'll Learn**:
- Page → View → Section → Component hierarchy
- Layer responsibilities and boundaries
- When to use each layer
- Import patterns between layers
- Server Component vs Client Component usage

**When to Read**:
- ✅ First time working on frontend code
- ✅ Before creating ANY new component
- ✅ When deciding component layer placement

**Key Architecture**:
```
Page (Server Component)
  ↓
View (Client/Server Component)
  ↓
Section (Client Component with Suspense/ErrorBoundary)
  ↓
Component (Pure/Presentational)
```

---

### 2. Page Layer Patterns (Server Components) 🏛️

**📄 [frontend/page-patterns.md](./frontend/page-patterns.md)**

**Server Components** for route entry points and SSR data prefetching.

**What You'll Learn**:
- Next.js App Router page structure (`app/(auth)/`, `app/(public)/`)
- Server DI Container usage (`createXXXServerContainer()`)
- SSR data prefetching with UseCases
- HydrationBoundary setup for streaming SSR
- Metadata generation
- When to use dynamic vs static rendering

**When to Read**:
- ✅ Creating new routes in Next.js
- ✅ Setting up SSR data prefetching
- ✅ Implementing authenticated routes
- ✅ Configuring metadata for SEO

**Key Pattern**:
```typescript
// page.tsx (Server Component)
const sessionManager = new ServerSessionManager();
const container = createUserServerContainer(sessionManager);

await queryClient.prefetchQuery({
  queryKey: getUserQueryKey(userId),
  queryFn: async () => {
    const useCase = container.getGetUser();
    return await useCase.execute(userId);
  },
});
```

---

### 3. View Layer Patterns (Layout Composition) 🎨

**📄 [frontend/view-patterns.md](./frontend/view-patterns.md)**

**Page layout composition** and Section orchestration (Client or Server).

**What You'll Learn**:
- How to compose multiple Sections into page layout
- Page-level UI state management (tabs, filters, active sections)
- When to use Client Component vs Server Component for Views
- View layer boundaries (NO data fetching, NO business logic)

**When to Read**:
- ✅ Structuring page layouts
- ✅ Orchestrating multiple feature sections
- ✅ Managing page-level UI state (not data state)

**Key Pattern**:
```typescript
// ProfileView.tsx
export const ProfileView = ({ userId }: { userId: string }) => {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div>
      <Header onTabChange={setActiveTab} activeTab={activeTab} />
      {activeTab === 'profile' && <ProfileSection userId={userId} />}
      {activeTab === 'settings' && <SettingsSection userId={userId} />}
    </div>
  );
};
```

---

### 4. Section Layer Patterns (Feature Encapsulation) 🧩

**📄 [frontend/section-patterns.md](./frontend/section-patterns.md)**

**Feature sections** with data fetching, error boundaries, and loading states (Client Components).

**What You'll Learn**:
- Client DI Container usage (`getXXXClientContainer()`)
- TanStack Query hooks for data fetching
- ErrorBoundary + Suspense implementation
- Adapter pattern for Entity → UI Type transformation
- Feature-specific state management
- Query hooks and mutation hooks patterns

**When to Read**:
- ✅ Creating feature sections with data fetching
- ✅ Implementing error handling and loading states
- ✅ Working with TanStack Query
- ✅ Using Adapters for complex Entity transformations

**Key Pattern**:
```typescript
// ProfileSection.tsx (Client Component)
'use client';

const container = getUserClientContainer();
const getUserAdapter = container.getGetUserAdapter();

export const ProfileSection = ({ userId }: { userId: string }) => {
  const { data, isLoading, error } = useGetUser(userId);

  return (
    <ErrorBoundary fallback={<ErrorUI />}>
      <Suspense fallback={<LoadingSkeleton />}>
        {data && <UserProfile user={getUserAdapter(data)} />}
      </Suspense>
    </ErrorBoundary>
  );
};
```

---

### 5. Component Layer Patterns (Pure/Presentational) 🎯

**📄 [frontend/component-patterns.md](./frontend/component-patterns.md)**

**Reusable UI components** with props-only data (Client or Server).

**What You'll Learn**:
- Pure component design principles
- Props-based data passing (NO data fetching)
- Callback props for event handling
- UI-only state management (isOpen, isHovered, isActive)
- When to use package components vs custom components

**When to Read**:
- ✅ Creating reusable UI components
- ✅ Building component libraries
- ✅ Extracting common UI patterns

**Key Pattern**:
```typescript
// UserProfile.tsx (Pure Component)
interface UserProfileProps {
  user: UserProfileData; // Adapter-transformed data
  onEdit: () => void;
  onDelete: () => void;
}

export const UserProfile = ({ user, onEdit, onDelete }: UserProfileProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Box>
      <Heading>{user.displayName}</Heading>
      <Text>{user.email}</Text>
      <Button onClick={onEdit}>Edit</Button>
      <Button onClick={onDelete}>Delete</Button>
    </Box>
  );
};
```

---

## 🎯 Common Workflows

### "I need to create a new feature"

**Step 1**: Determine the entry point
- New route? → Create **Page** in `app/(auth)/` or `app/(public)/`
- Sub-feature of existing page? → Create **Section** in `presentation/ui/sections/`

**Step 2**: Read the appropriate pattern guide
- Route with SSR → [frontend/page-patterns.md](./frontend/page-patterns.md)
- Feature section → [frontend/section-patterns.md](./frontend/section-patterns.md)

**Step 3**: Follow the layer hierarchy
- Page → View → Section → Component
- Never skip layers (e.g., Page cannot directly import Component)

---

### "Where should data fetching happen?"

**Server-Side (SSR Prefetch)**:
- **Where**: Page layer (Server Component)
- **DI Container**: `createXXXServerContainer(sessionManager)`
- **Pattern**: `queryClient.prefetchQuery()` + HydrationBoundary
- **Read**: [frontend/page-patterns.md](./frontend/page-patterns.md)

**Client-Side (Interactive Data)**:
- **Where**: Section layer (Client Component)
- **DI Container**: `getXXXClientContainer()`
- **Pattern**: TanStack Query hooks (`useQuery`, `useMutation`)
- **Read**: [frontend/section-patterns.md](./frontend/section-patterns.md)

**Never Fetch Data In**:
- ❌ View layer
- ❌ Component layer

---

### "How do I transform Entity data for UI?"

**Option 1: Simple Transformations (1-6 Entity methods)**
- Use inline mappers in Section
- No need for Adapter pattern

**Option 2: Complex Transformations (7+ Entity methods)**
- Use Adapter pattern
- Create in `presentation/adapters/`
- Get from DI Container: `container.getGetUserAdapter()`

**Read More**:
- [../patterns/adapter-basics.md](./patterns/adapter-basics.md) — When and how to use Adapters
- [frontend/section-patterns.md](./frontend/section-patterns.md) — Adapter usage in Sections

---

### "How do I handle errors and loading states?"

**In Page Layer**:
- Use `loading.tsx` for route-level loading UI
- Use `error.tsx` for route-level error UI
- Read: [frontend/page-patterns.md](./frontend/page-patterns.md)

**In Section Layer**:
- Wrap with `<ErrorBoundary>` + `<Suspense>`
- Use TanStack Query states (`isLoading`, `error`)
- Read: [frontend/section-patterns.md](./frontend/section-patterns.md)

**In Component Layer**:
- NO error handling (delegated to parent Section)
- Props-based loading states (e.g., `isLoading` prop)

---

## 📋 Layer Responsibility Matrix

| Layer         | Type          | DI Container                 | Data Fetching         | State Management             | Error Handling              | Export     |
|---------------|---------------|------------------------------|----------------------|------------------------------|-----------------------------|-----------
| **Page**      | Server        | `createXXXServerContainer()` | Prefetch only        | URL (params, searchParams)   | N/A                         | `default`  |
| **View**      | Client/Server | None                         | ❌ NO                | Page-level UI (tabs, active) | ❌ NO                       | `const`    |
| **Section**   | Client        | `getXXXClientContainer()`    | ✅ YES (TanStack Query) | Feature-specific           | ✅ YES (ErrorBoundary + Suspense) | `const` |
| **Component** | Client/Server | None                         | ❌ NO                | UI-only (isOpen, isHovered)  | ❌ NO                       | `const`    |

---

## 🔗 Related Documentation

### Architecture & Patterns
- [../core/architecture.md](./core/architecture.md) — High-level Clean Architecture overview
- [../ddd/entity-patterns.md](./ddd/entity-patterns.md) — DDD Entity patterns
- [../ddd/usecase-patterns.md](./ddd/usecase-patterns.md) — UseCase implementation
- [../ddd/di-server-containers.md](./ddd/di-server-containers.md) — Server DI containers
- [../ddd/di-client-containers.md](./ddd/di-client-containers.md) — Client DI containers

### Data Fetching & State Management
- [../patterns/query-hooks.md](./patterns/query-hooks.md) — TanStack Query hooks patterns
- [../patterns/mutation-hooks.md](./patterns/mutation-hooks.md) — Mutation hooks patterns
- [../patterns/adapter-basics.md](./patterns/adapter-basics.md) — Adapter pattern for transformations

### Package System
- [../packages/package-usage.md](./packages/package-usage.md) — Package import rules
- [../packages/monorepo-structure.md](./packages/monorepo-structure.md) — Monorepo structure

---

## 🚨 Critical Rules (MUST READ)

### Layer Hierarchy (NEVER Skip Layers)

```typescript
// ✅ CORRECT - Follow hierarchy
Page
  → View
    → Section
      → Component

// ❌ WRONG - Skip layers
Page → Component  // NO! Must go through View and Section
View → Component  // NO! Must go through Section
```

### DI Container Usage (Server vs Client)

```typescript
// ✅ CORRECT - Server DI Container in Page (Server Component)
const container = createUserServerContainer(sessionManager); // New instance per request

// ✅ CORRECT - Client DI Container in Section (Client Component)
const container = getUserClientContainer(); // Lazy singleton

// ❌ WRONG - Client DI Container in Server Component
const container = getUserClientContainer(); // NO! Singleton breaks SSR
```

### Data Fetching Boundaries

```typescript
// ✅ CORRECT - Data fetching in Page (prefetch) and Section (fetch)
// Page.tsx - Prefetch
await queryClient.prefetchQuery({ ... });

// Section.tsx - Fetch
const { data } = useGetUser(userId);

// ❌ WRONG - Data fetching in View or Component
// View.tsx
const { data } = useGetUser(userId); // NO! View cannot fetch data

// Component.tsx
const { data } = useGetUser(userId); // NO! Component cannot fetch data
```

### Import Patterns

```typescript
// ✅ CORRECT - Import from lower layers only
// Section can import Component
import { UserProfile } from '@auth/presentation/ui/components/user-profile';

// ❌ WRONG - Import from higher layers
// Component cannot import Section
import { ProfileSection } from '@auth/presentation/ui/sections/profile-section'; // NO!
```

---

## 🎓 Learning Path

For new developers or AI agents:

1. **Start** (Required): Read [frontend/component-hierarchy.md](./frontend/component-hierarchy.md) (15 min)
2. **Page Layer**: Read [frontend/page-patterns.md](./frontend/page-patterns.md) (15 min)
3. **View Layer**: Read [frontend/view-patterns.md](./frontend/view-patterns.md) (10 min)
4. **Section Layer**: Read [frontend/section-patterns.md](./frontend/section-patterns.md) (20 min)
5. **Component Layer**: Read [frontend/component-patterns.md](./frontend/component-patterns.md) (10 min)

**Total Time**: ~70 minutes to master frontend architecture.

**Next Steps**:
- Read [../patterns/query-hooks.md](./patterns/query-hooks.md) for data fetching patterns
- Read [../patterns/adapter-basics.md](./patterns/adapter-basics.md) for transformation patterns
- Read [../ddd/di-client-containers.md](./ddd/di-client-containers.md) for DI patterns

---

## 📞 Need Help?

- **Don't know which layer to use?** → Read [frontend/component-hierarchy.md](./frontend/component-hierarchy.md)
- **Creating a new route?** → Read [frontend/page-patterns.md](./frontend/page-patterns.md)
- **Creating a feature section?** → Read [frontend/section-patterns.md](./frontend/section-patterns.md)
- **Creating a reusable component?** → Read [frontend/component-patterns.md](./frontend/component-patterns.md)
- **Need data fetching help?** → Read [../patterns/query-hooks.md](./patterns/query-hooks.md)
- **Need DI Container help?** → Read [../ddd/di-client-containers.md](./ddd/di-client-containers.md)

---

**Remember**: This is an **index document**. For detailed implementation patterns, follow the links to specific documents listed above.
