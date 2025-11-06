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

Next.js 16 route groups organize pages by authentication requirements:

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

### 1. Server Components by Default (🆕 with DI Container)

```typescript
// app/(auth)/benefits/page.tsx - Server Component by default
import { getQueryClient } from '@/src/shared/infrastructure/configs/tanstack-query';
import { createBenefitServerContainer } from '@/src/di';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { BenefitPageView } from '@/src/domains/benefit/ui/views/benefit-page-view';

const BenefitsPage = async ({ searchParams }) => {
  const queryClient = getQueryClient();

  // 🆕 Server Container로 UseCase 획득 (매번 새 인스턴스)
  const container = createBenefitServerContainer();
  const getBenefitsUseCase = container.getGetBenefits();

  // UseCase를 통한 데이터 prefetch (자동 토큰 주입)
  await queryClient.prefetchQuery({
    queryKey: ['benefits', 'list'],
    queryFn: () => getBenefitsUseCase.execute()
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <BenefitPageView />
    </HydrationBoundary>
  );
};

export default BenefitsPage; // Pages use default export
```

**🆕 핵심 포인트**:
- **Server Container**: 매 요청마다 새로운 컨테이너 인스턴스 생성
- **UseCase 획득**: Container에서 필요한 UseCase를 주입받음
- **자동 토큰 주입**: UseCase 내부의 Repository가 AuthenticatedHttpClient를 통해 자동으로 토큰 주입
- **NEVER**: Client Container (`xxxClientContainer`) 사용 금지 - Server에서는 항상 `createXXXServerContainer()` 사용

### 2. Route Parameters (🆕 with DI Container)

```typescript
// app/(auth)/cafeterias/[cafeteriaId]/page.tsx
import { getQueryClient } from '@/src/shared/infrastructure/configs/tanstack-query';
import { createCafeteriaServerContainer } from '@/src/di';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { CafeteriaDetailView } from '@/src/domains/cafeteria/detail/ui/views/cafeteria-detail-view';

interface PageProps {
  params: { cafeteriaId: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

const CafeteriaDetailPage = async ({ params, searchParams }: PageProps) => {
  const { cafeteriaId } = params;
  const { tab = 'menu' } = searchParams;

  const queryClient = getQueryClient();

  // 🆕 Server Container로 UseCase 획득
  const container = createCafeteriaServerContainer();
  const getCafeteriaDetailUseCase = container.getGetCafeteriaDetail();

  // Dynamic route parameter를 UseCase 메서드에 전달
  await queryClient.prefetchQuery({
    queryKey: ['cafeteria', 'detail', cafeteriaId],
    queryFn: () => getCafeteriaDetailUseCase.execute(cafeteriaId)
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CafeteriaDetailView cafeteriaId={cafeteriaId} activeTab={tab} />
    </HydrationBoundary>
  );
};

export default CafeteriaDetailPage;
```

### 3. Metadata Generation (🆕 with DI Container)

```typescript
// app/(auth)/cafeterias/[cafeteriaId]/page.tsx
import { Metadata } from 'next';
import { createCafeteriaServerContainer } from '@/src/di';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  // 🆕 Server Container로 UseCase 획득
  const container = createCafeteriaServerContainer();
  const getCafeteriaDetailUseCase = container.getGetCafeteriaDetail();

  // UseCase 메서드로 데이터 조회
  const cafeteria = await getCafeteriaDetailUseCase.execute(params.cafeteriaId);

  return {
    title: cafeteria.name,
    description: `${cafeteria.name}의 메뉴와 리뷰를 확인하세요`,
  };
}
```

**🆕 중요**:
- `generateMetadata`에서도 Server Container 사용
- 각 함수마다 새로운 Container 인스턴스 생성 (stateless)
- UseCase는 자동으로 인증 토큰 주입 처리

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
