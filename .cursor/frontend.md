# 🏗️ Next.js Component Architecture

## 📐 Component Hierarchy

**MANDATORY**: Follow this exact hierarchy for ALL components:

```
Page (Server) → View (Layout) → Section (Logic + Boundaries) → Component (UI)
```

## 📂 Project Structure

```
apps/web/
├── app/                           # Next.js App Router
│   ├── (auth)/                   # Protected routes (require login)
│   │   └── profile/page.tsx
│   └── (public)/                  # Public routes (no login required)
│       └── auth/sign-up/page.tsx
└── src/
    └── domains/                   # Business logic by domain
        └── [domain-name]/
            ├── constants/         # Domain constants
            ├── schemas/          # Zod validation schemas
            ├── stores/           # Zustand state stores
            ├── types/            # TypeScript types
            └── ui/               # UI components
                ├── views/        # Page layouts
                ├── sections/     # Feature logic
                └── components/   # UI pieces

```

## 🎭 Layer-by-Layer Rules

### 1️⃣ Page Layer (`app/.../page.tsx`)

**Type**: Server Component  
**Purpose**: Entry point, data prefetching, SEO

**MANDATORY Rules**:

```typescript
// ✅ MUST be Server Component (no "use client")
// ✅ MUST prefetch data for SSR
// ✅ MUST wrap View with HydrationBoundary
// ✅ MUST use default export
// ❌ NEVER contain UI logic
// ❌ NEVER use hooks or browser APIs

import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { ProfileView } from '@/src/domains/auth/profile/ui/views/profile-view';

export default async function Page({ params, searchParams }) {
  // 1. Extract parameters
  const { id } = params;

  // 2. Prefetch data
  await queryClient.prefetchQuery({
    queryKey: ['profile', id],
    queryFn: () => api.getProfile(id),
  });

  // 3. Return View with HydrationBoundary
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProfileView userId={id} />
    </HydrationBoundary>
  );
}
```

### 2️⃣ View Layer (`ui/views/`)

**Type**: Client or Server Component  
**Purpose**: Layout composition

**MANDATORY Rules**:

```typescript
// ✅ MUST compose Sections only
// ✅ MUST define page layout
// ✅ MUST use named export
// ❌ NEVER fetch data directly
// ❌ NEVER implement business logic

export const ProfileView = ({ userId }) => {
  return (
    <VStack spacing={24}>
      <ProfileHeaderSection userId={userId} />
      <ProfileContentSection userId={userId} />
      <ProfileActivitySection userId={userId} />
    </VStack>
  );
};
```

### 3️⃣ Section Layer (`ui/sections/`)

**Type**: Client Component  
**Purpose**: Feature logic with error/loading boundaries

**MANDATORY Pattern**:

```typescript
// Main Section - ALWAYS implement this pattern
export const ProfileHeaderSection = ({ userId }) => {
  return (
    <ErrorBoundary fallback={<ProfileHeaderSectionError />}>
      <Suspense fallback={<ProfileHeaderSectionSkeleton />}>
        <ProfileHeaderSectionContent userId={userId} />
      </Suspense>
    </ErrorBoundary>
  );
};

// Skeleton - Loading UI
const ProfileHeaderSectionSkeleton = () => {
  return <div className="animate-pulse h-32 bg-gray-200" />;
};

// Error - Error UI
const ProfileHeaderSectionError = ({ error }) => {
  return <div>Failed to load profile: {error.message}</div>;
};

// Content - Actual logic and data fetching
const ProfileHeaderSectionContent = ({ userId }) => {
  const { data } = useSuspenseQuery({
    queryKey: ['profile', userId],
    queryFn: () => api.getProfile(userId),
  });

  return <ProfileHeader profile={data} />;
};
```

### 4️⃣ Component Layer (`ui/components/`)

**Type**: Client or Server Component  
**Purpose**: Pure UI components

**MANDATORY Rules**:

```typescript
// ✅ MUST be presentational only
// ✅ MUST receive data via props
// ✅ MUST use callbacks for events
// ❌ NEVER fetch data
// ❌ NEVER have business logic

export const ProfileHeader = ({ profile, onEdit }) => {
  return (
    <HStack spacing={16}>
      <Avatar src={profile.avatar} />
      <VStack>
        <Title>{profile.name}</Title>
        <Body>{profile.bio}</Body>
      </VStack>
      <Button onClick={onEdit}>Edit</Button>
    </HStack>
  );
};
```

## 📁 File Structure Requirements

**MANDATORY**: Each component MUST have its own folder:

```
component-name/
├── index.tsx        # Component code
└── index.css.ts     # Vanilla Extract styles
```

Example:

```
views/
└── profile-view/
    ├── index.tsx
    └── index.css.ts

sections/
└── profile-header-section/
    ├── index.tsx
    └── index.css.ts

components/
└── profile-header/
    ├── index.tsx
    └── index.css.ts
```

## 📦 Import Rules

### Within Same Domain - Use Relative Imports

```typescript
// ✅ CORRECT - Within auth domain
import { ProfileSection } from '../../sections/profile-section';
import { useAuthStore } from '../../../stores/use-auth-store';
```

### Cross-Domain - Use Absolute Imports

```typescript
// ✅ CORRECT - Cross-domain
import { useAuth } from '@/src/domains/auth/hooks/use-auth';
```

### Packages - Use Package Imports

```typescript
// ✅ CORRECT - Package imports
import { Button } from '@nugudi/react-components-button';
import { Box, VStack } from '@nugudi/react-components-layout';
```

## 🔄 Data Flow Pattern

```
1. Page prefetches → 2. View layouts → 3. Section fetches → 4. Component displays
```

## ✅ Checklist for Each Layer

### Page Checklist

- [ ] Is Server Component
- [ ] Prefetches data with queryClient
- [ ] Wraps View with HydrationBoundary
- [ ] Uses default export
- [ ] No UI logic

### View Checklist

- [ ] Composes Sections only
- [ ] Defines layout structure
- [ ] Uses named export
- [ ] No data fetching
- [ ] No business logic

### Section Checklist

- [ ] Has ErrorBoundary wrapper
- [ ] Has Suspense wrapper
- [ ] Has Skeleton component
- [ ] Has Error component
- [ ] Has Content component with data fetching
- [ ] Uses named export

### Component Checklist

- [ ] Pure presentational
- [ ] Receives props
- [ ] Uses callbacks for events
- [ ] No data fetching
- [ ] Uses named export

## 🚫 Common Mistakes to Avoid

```typescript
// ❌ WRONG - Page importing Component directly
import { ProfileCard } from '@/src/domains/auth/profile/ui/components/profile-card';

// ❌ WRONG - View fetching data
export const ProfileView = () => {
  const { data } = useQuery(...);  // NO! Sections fetch data
};

// ❌ WRONG - Section without boundaries
export const ProfileSection = () => {
  const { data } = useQuery(...);
  return <div>{data}</div>;  // NO! Need Suspense + ErrorBoundary
};

// ❌ WRONG - Component fetching data
export const ProfileCard = () => {
  const { data } = useQuery(...);  // NO! Components receive props
};
```

## 🎯 Quick Reference

| Layer     | Type   | Export           | Data             | Purpose            |
| --------- | ------ | ---------------- | ---------------- | ------------------ |
| Page      | Server | `export default` | Prefetch         | Entry point        |
| View      | Any    | `export const`   | Pass props       | Layout             |
| Section   | Client | `export const`   | Fetch with hooks | Logic + Boundaries |
| Component | Any    | `export const`   | Receive props    | Pure UI            |
