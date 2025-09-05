# 🎯 Next.js App Router Component Guidelines

## 📐 Component Hierarchy (MANDATORY)

```
Page (Server) → View (Layout) → Section (Logic) → Component (UI)
```

**NEVER skip layers. Each layer has a specific purpose.**

## 🗂️ Route Structure

```
app/
├── (auth)/          # 🔒 Protected routes - Require authentication
│   ├── profile/
│   ├── benefits/
│   └── cafeterias/
└── (public)/        # 🌍 Public routes - No authentication required
    ├── home/
    └── auth/
        ├── sign-in/
        ├── sign-up/
        └── password/
```

## 📋 Layer Rules & Examples

### 1️⃣ Page Layer

**Location**: `app/(auth|public)/[route]/page.tsx`  
**Type**: Server Component  
**Export**: `export default`

```typescript
// ✅ MANDATORY Pattern
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { ProfileView } from '@/src/domains/auth/profile/ui/views/profile-view';

export default async function Page({ params, searchParams }) {
  // 1. Extract params
  const { id } = params;
  
  // 2. Prefetch data (MANDATORY for SSR)
  await queryClient.prefetchQuery({
    queryKey: ['profile', id],
    queryFn: () => api.getProfile(id),
  });
  
  // 3. Return View with HydrationBoundary (MANDATORY)
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProfileView userId={id} />
    </HydrationBoundary>
  );
}
```

### 2️⃣ View Layer

**Location**: `src/domains/[domain]/ui/views/[name]-view/`  
**Type**: Client or Server Component  
**Export**: `export const`

```typescript
// ✅ MANDATORY Pattern
import { VStack } from '@nugudi/react-components-layout';

export const ProfileView = ({ userId }) => {
  // ONLY compose Sections, NO logic
  return (
    <VStack spacing={24}>
      <ProfileHeaderSection userId={userId} />
      <ProfileContentSection userId={userId} />
    </VStack>
  );
};
```

### 3️⃣ Section Layer

**Location**: `src/domains/[domain]/ui/sections/[name]-section/`  
**Type**: Client Component  
**Export**: `export const`

```typescript
// ✅ MANDATORY Pattern - 4 components per section
import { ErrorBoundary } from 'react-error-boundary';
import { Suspense } from 'react';

// 1. Main Section (ALWAYS has ErrorBoundary + Suspense)
export const ProfileHeaderSection = ({ userId }) => {
  return (
    <ErrorBoundary fallback={<ProfileHeaderSectionError />}>
      <Suspense fallback={<ProfileHeaderSectionSkeleton />}>
        <ProfileHeaderSectionContent userId={userId} />
      </Suspense>
    </ErrorBoundary>
  );
};

// 2. Skeleton (Loading state)
const ProfileHeaderSectionSkeleton = () => {
  return <div className="animate-pulse h-32 bg-gray-200" />;
};

// 3. Error (Error state)
const ProfileHeaderSectionError = ({ error }) => {
  return <div>Error: {error.message}</div>;
};

// 4. Content (Data fetching + rendering)
const ProfileHeaderSectionContent = ({ userId }) => {
  const { data } = useSuspenseQuery({
    queryKey: ['profile', userId],
    queryFn: () => api.getProfile(userId),
  });
  
  return <ProfileHeader data={data} />;
};
```

### 4️⃣ Component Layer

**Location**: `src/domains/[domain]/ui/components/[name]/`  
**Type**: Any Component  
**Export**: `export const`

```typescript
// ✅ MANDATORY Pattern - Pure presentational
export const ProfileHeader = ({ data, onEdit }) => {
  // NO data fetching, NO business logic
  return (
    <HStack spacing={16}>
      <Avatar src={data.avatar} />
      <Title>{data.name}</Title>
      <Button onClick={onEdit}>Edit</Button>
    </HStack>
  );
};
```

## 📦 Import Rules

### Same Domain = Relative
```typescript
// Within auth domain
import { ProfileSection } from '../../sections/profile-section';
import { useAuthStore } from '../../../stores/use-auth-store';
```

### Cross Domain = Absolute
```typescript
// From cafeteria to auth domain
import { useAuth } from '@/src/domains/auth/hooks/use-auth';
```

### Packages = Package Path
```typescript
// Always use package imports
import { Button } from '@nugudi/react-components-button';
import { Box, VStack } from '@nugudi/react-components-layout';
```

## 📁 Folder Structure (MANDATORY)

```
every-component/
├── index.tsx        # Component code
└── index.css.ts     # Vanilla Extract styles (NOT .css or .module.css)
```

## ✅ Quick Validation Checklist

### Page Component
```
□ Server Component (no "use client")
□ Uses default export
□ Prefetches data with queryClient
□ Wraps View with HydrationBoundary
□ No UI logic or hooks
```

### View Component
```
□ Uses named export
□ Only imports Sections
□ Defines layout structure
□ No data fetching
□ No business logic
```

### Section Component
```
□ Uses named export
□ Has ErrorBoundary wrapper
□ Has Suspense wrapper
□ Has Skeleton component
□ Has Error component
□ Has Content component with data fetching
```

### Component
```
□ Uses named export
□ Pure presentational
□ Receives all data via props
□ Uses callbacks for events
□ No data fetching
```

## 🚫 Common Violations

```typescript
// ❌ VIOLATION: Page directly imports Component
// pages/profile/page.tsx
import { ProfileCard } from '@/src/domains/auth/ui/components/profile-card';

// ❌ VIOLATION: View fetches data
export const ProfileView = () => {
  const { data } = useQuery(...); // NO! Only Sections fetch
};

// ❌ VIOLATION: Section without boundaries
export const ProfileSection = () => {
  const { data } = useQuery(...);
  return <div>{data}</div>; // NO! Need ErrorBoundary + Suspense
};

// ❌ VIOLATION: Component fetches data
export const ProfileCard = () => {
  const { data } = useQuery(...); // NO! Components receive props
};
```

## 🎯 Layer Responsibility Matrix

| Layer | Server/Client | Export | Data Handling | Purpose |
|-------|--------------|--------|---------------|---------|
| **Page** | Server Only | `default` | Prefetch only | Entry point, SSR |
| **View** | Any | `const` | Pass props | Layout composition |
| **Section** | Client Only | `const` | Fetch & manage | Logic + boundaries |
| **Component** | Any | `const` | Receive props | Pure presentation |

## 📝 Domain Structure

```
src/domains/
└── [domain]/
    ├── constants/      # Domain constants
    ├── schemas/        # Zod schemas
    ├── stores/         # Zustand stores  
    ├── types/          # TypeScript types
    └── ui/
        ├── views/      # Page layouts
        ├── sections/   # Feature logic
        └── components/ # UI pieces
```

**Remember**: This architecture ensures predictable behavior, maintainable code, and optimal SSR performance.