# Next.js App Router Route Structure

**Important**: For detailed component architecture rules (Page → View → Section → Component hierarchy), layer responsibilities, and component patterns, see [claude/frontend.md](./frontend.md).

This file focuses specifically on Next.js App Router structure and route organization.

## Next.js App Router Directory Structure

```
apps/web/
├── app/                       # Next.js App Router pages
│   ├── (auth)/               # 🔒 Protected routes (require authentication)
│   │   ├── benefits/         # Benefits page for logged-in users
│   │   │   └── page.tsx
│   │   ├── cafeterias/       # Cafeteria management pages
│   │   │   ├── page.tsx
│   │   │   ├── [cafeteriaId]/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── menu-upload/
│   │   │   │   └── reviews/
│   │   │   ├── stamps/
│   │   │   └── request-register/
│   │   └── my/               # My page/profile for logged-in users
│   │       └── page.tsx
│   └── (public)/             # 🌍 Public routes (no authentication required)
│       ├── auth/             # Authentication-related public pages
│       │   ├── sign-in/
│       │   │   ├── page.tsx
│       │   │   └── email/
│       │   │       └── page.tsx
│       │   ├── sign-up/
│       │   │   └── page.tsx
│       │   └── password/
│       │       └── forgot/
│       │           └── page.tsx
│       └── home/             # Public home page
│           └── page.tsx
└── src/
    └── domains/              # Domain-based architecture
        └── [domain]/         # e.g., auth, cafeteria, benefit
            # Option 1: Complex domains with multiple features
            └── [feature]/    # e.g., auth/sign-in, auth/sign-up, auth/profile
                ├── constants/
                ├── schemas/
                ├── stores/
                ├── types/
                └── ui/
                    ├── views/
                    ├── sections/
                    └── components/

            # Option 2: Simple domains without sub-features
            └── ui/           # e.g., benefit/ui, cafeteria/ui (directly under domain)
                ├── views/
                ├── sections/
                └── components/
```

## Route Groups: Authentication Structure

Next.js 15 route groups organize pages by authentication requirements:

- **(auth)**: Protected pages requiring user authentication
  - All pages inside this group require a logged-in user
  - Examples: `/benefits`, `/cafeterias`, `/my`, etc.
- **(public)**: Public pages accessible without authentication
  - All pages inside this group are accessible to everyone
  - Examples: `/auth/sign-in`, `/auth/sign-up`, `/home`, etc.

**Note**: Route groups (parentheses folders) don't affect the URL structure - they're purely for organization.

## Page-to-Domain Mapping

### Protected Routes (auth)
```
/benefits          → domains/benefit/ui/views/benefit-page-view
/cafeterias        → domains/cafeteria/home/ui/views/cafeteria-home-view
/cafeterias/[id]   → domains/cafeteria/detail/ui/views/cafeteria-detail-view
/my                → domains/user/ui/views/my-page-view
```

### Public Routes (public)
```
/auth/sign-in       → domains/auth/ui/views/credentials-sign-in-view
/auth/sign-up/social → domains/auth/ui/views/social-sign-up-view
/home              → domains/cafeteria/home/ui/views/cafeteria-home-view (same as root)
```

## Next.js App Router Specific Patterns

### 1. Server Components by Default
```typescript
// app/(auth)/benefits/page.tsx - Server Component by default
const BenefitsPage = async ({ searchParams }) => {
  // Server-side data fetching
  const benefits = await getBenefits();
  
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <BenefitPageView benefits={benefits} />
    </HydrationBoundary>
  );
};

export default BenefitsPage; // Pages use default export
```

### 2. Route Parameters
```typescript
// app/(auth)/cafeterias/[cafeteriaId]/page.tsx
interface PageProps {
  params: { cafeteriaId: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

const CafeteriaDetailPage = async ({ params, searchParams }: PageProps) => {
  const { cafeteriaId } = params;
  const { tab = 'menu' } = searchParams;
  
  return <CafeteriaDetailView cafeteriaId={cafeteriaId} activeTab={tab} />;
};
```

### 3. Metadata Generation
```typescript
// app/(auth)/cafeterias/[cafeteriaId]/page.tsx
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const cafeteria = await getCafeteria(params.cafeteriaId);
  
  return {
    title: cafeteria.name,
    description: `${cafeteria.name}의 메뉴와 리뷰를 확인하세요`,
  };
}
```

### 4. Loading and Error UI
```typescript
// app/(auth)/cafeterias/loading.tsx
export default function Loading() {
  return <CafeteriaListSkeleton />;
}

// app/(auth)/cafeterias/error.tsx
'use client';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return <ErrorBoundary error={error} onRetry={reset} />;
}
```

### 5. Layout Files
```typescript
// app/(auth)/layout.tsx - Authentication layout
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="auth-layout">
      <AuthGuard>
        <Navigation />
        {children}
      </AuthGuard>
    </div>
  );
}

// app/(public)/layout.tsx - Public layout
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="public-layout">
      <PublicHeader />
      {children}
      <Footer />
    </div>
  );
}
```

## Key Differences from Pages Router

1. **File-based routing**: Use `page.tsx` instead of `index.tsx`
2. **Server Components**: Components are Server Components by default
3. **Route Groups**: Use `(groupName)` for organization without affecting URLs
4. **Co-located files**: `loading.tsx`, `error.tsx`, `layout.tsx` co-located with routes
5. **Async components**: Page components can be async for data fetching

## Best Practices for App Router

1. **Use Server Components** for data fetching at the page level
2. **Leverage route groups** to organize pages by authentication or feature areas
3. **Co-locate layouts** with their respective route groups
4. **Use loading.tsx** for consistent loading states
5. **Implement error.tsx** for proper error boundaries
6. **Generate metadata** dynamically for better SEO

---

For detailed component architecture, layer responsibilities, naming conventions, and import patterns, see:
- **[claude/frontend.md](./frontend.md)** - Complete component architecture rules
- **[claude/packages.md](./packages.md)** - Import patterns and package usage