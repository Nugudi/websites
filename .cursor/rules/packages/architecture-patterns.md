---
description: Component organization, styling guidelines, backend integration patterns, Mock Repository pattern
globs:
  - "src/domains/**/presentation/**/*.tsx"
  - "src/domains/**/presentation/**/*.ts"
  - "src/domains/**/data/**/*.ts"
  - "src/domains/**/di/**/*.ts"
alwaysApply: true
---

# Architecture Patterns

## Component Organization Pattern

Each domain follows this structure:
- **components/**: Smallest reusable UI pieces
- **sections/**: Composed components forming page sections
- **views/**: Complete page views

### Component Folder Structure (MANDATORY)

Every component MUST follow this folder structure:

```
component-name/
├── index.tsx        # Component implementation
├── index.css.ts     # Vanilla Extract styles
└── types.ts         # Type definitions (optional)
```

**Example**:

```typescript
// Domain component structure
// src/domains/auth/sign-up/presentation/ui/components/sign-up-form/index.tsx
interface SignUpFormProps {
  // Props interface
}

export const SignUpForm = (props: SignUpFormProps) => {
  // Component implementation
};

// src/domains/auth/sign-up/presentation/ui/components/sign-up-form/index.css.ts
import { style } from '@vanilla-extract/css';
import { vars } from '@nugudi/themes';

export const formContainer = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.box.spacing[16],
});
```

## Styling Guidelines

### CRITICAL: Style Priority Rules

**YOU MUST check and use existing styles in this EXACT order:**

1. **FIRST - Check `classes`**: Always check if a pre-defined class exists
   - `classes.container`, `classes.flexCenter`, etc.
2. **SECOND - Use `vars`**: Use design tokens for all style properties
   - Colors: `vars.colors.$scale.zinc[500]` NOT `#6B7280`
   - Spacing: `vars.box.spacing[16]` NOT `16px`
   - Radius: `vars.box.radii.lg` NOT `12px`
   - Shadows: `vars.box.shadows.sm` NOT custom shadows
3. **LAST - Custom values**: Only for specific requirements
   - Specific widths/heights: `width: "149px"` (when design requires exact size)

**❌ NEVER use hard-coded values when vars exist!**

### Vanilla Extract Usage

```typescript
// ✅ CORRECT - Always prioritize existing theme values
// index.css.ts
import { style } from '@vanilla-extract/css';
import { vars, classes } from '@nugudi/themes';

// FIRST: Check if there's a pre-defined class
export const container = classes.container; // If exists

// SECOND: Use design tokens from vars
export const customCard = style({
  // Always use vars for consistent design
  padding: vars.box.spacing[16], // NOT: padding: '16px'
  borderRadius: vars.box.radii.lg, // NOT: borderRadius: '12px'
  backgroundColor: vars.colors.$scale.whiteAlpha[100], // NOT: backgroundColor: 'white'
  boxShadow: vars.box.shadows.sm, // NOT: boxShadow: '0 1px 3px rgba(0,0,0,0.1)'

  // Only use custom values when absolutely necessary
  width: '149px', // OK if specific requirement
});

// Component file
import * as styles from './index.css';

<div className={styles.customCard}>Content</div>;
```

### CSS Modules for App-specific Styles

```css
/* page.module.css */
.container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
```

## Store Pattern with Zustand

```typescript
// domains/auth/sign-up/stores/use-sign-up-store.ts
import { create } from 'zustand';

interface SignUpStore {
  step: number;
  formData: SignUpFormData;
  setStep: (step: number) => void;
  setFormData: (data: Partial<SignUpFormData>) => void;
}

export const useSignUpStore = create<SignUpStore>((set) => ({
  step: 1,
  formData: {},
  setStep: (step) => set({ step }),
  setFormData: (data) => set((state) => ({
    formData: { ...state.formData, ...data }
  })),
}));
```

## Backend Integration with DI Containers

### Server-Side Data Fetching (Pages, Server Actions)

```typescript
// app/(auth)/profile/page.tsx
import { createUserServerContainer } from '@/src/domains/user/di/user-server-container';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import getQueryClient from '@core/infrastructure/configs/tanstack-query/get-query-client';

const ProfilePage = async () => {
  // 1. DI Container로 UseCase 획득
  const container = createUserServerContainer();
  const getMyProfileUseCase = container.getGetMyProfile();

  // 2. 서버사이드에서 데이터 prefetch
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['user', 'profile'],
    queryFn: () => getMyProfileUseCase.execute(),
  });

  // 3. HydrationBoundary로 클라이언트에 전달
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProfileView />
    </HydrationBoundary>
  );
};

export default ProfilePage;
```

### Client-Side Data Fetching (Client Components)

```typescript
// domains/user/presentation/sections/user-profile-section/index.tsx
'use client';
import { getUserClientContainer } from '@/src/domains/user/di/user-client-container';
import { useSuspenseQuery } from '@tanstack/react-query';

const UserProfileSectionContent = () => {
  // 1. 클라이언트 컨테이너 사용 (Lazy-initialized singleton)
  const container = getUserClientContainer();
  const getMyProfileUseCase = container.getGetMyProfile();

  // 2. TanStack Query로 데이터 조회 (Page에서 prefetch한 데이터 재사용)
  const { data } = useSuspenseQuery({
    queryKey: ['user', 'profile'],
    queryFn: () => getMyProfileUseCase.execute(),
  });

  return <div>{data.profile.nickname}</div>;
};
```

### Server Action with DI Container

```typescript
// domains/auth/infrastructure/actions/auth-actions.ts
'use server';
import { createAuthServerContainer } from '@/src/domains/auth/di/auth-server-container';

export async function loginWithGoogle(code: string) {
  const container = createAuthServerContainer();
  const loginWithOAuthUseCase = container.getLoginWithOAuth();

  const result = await loginWithOAuthUseCase.execute({
    provider: 'google',
    code,
    redirectUri: '/auth/callback/google',
  });

  return result;
}
```

### Form Handling with React Hook Form

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signUpSchema } from '../schemas/sign-up-schema';

const form = useForm({
  resolver: zodResolver(signUpSchema),
  defaultValues: {
    email: '',
    password: '',
  },
});
```

## Mock Repository Pattern (Domains Without Backend APIs)

For domains that don't have backend APIs yet (Notification, Benefit, Stamp), use the **Mock Repository Pattern** to enable UI development while maintaining complete DDD architecture.

### Pattern Overview

```
┌─────────────────────────────────────────────────────────────┐
│  Mock Repository Pattern (No Backend API Yet)               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  DTO (snake_case)  ──────────────────┐                     │
│      ↓                                │                     │
│  Mapper (bidirectional)               │                     │
│      ↓                                │                     │
│  Entity (camelCase)                   │                     │
│      ↓                                │                     │
│  Mock DataSource ←───────────────────┘                     │
│  (Hardcoded data + 100ms delay)                             │
│      ↓                                                      │
│  Repository Implementation                                  │
│      ↓                                                      │
│  UseCase (Business Logic)                                   │
│      ↓                                                      │
│  DI Container (Server/Client)                               │
│      ↓                                                      │
│  UI Components                                              │
│                                                             │
│  ⚡ When Backend Ready: Replace Mock DataSource            │
│     with Remote DataSource (API calls)                     │
└─────────────────────────────────────────────────────────────┘
```

### Why Mock Repository Pattern?

- ✅ **Enable UI Development**: Frontend development doesn't wait for backend APIs
- ✅ **Maintain Architecture**: Complete DDD structure from day one
- ✅ **Type Safety**: Full TypeScript support with DTOs and Entities
- ✅ **Easy Replacement**: Swap Mock DataSource with Remote DataSource when API is ready
- ✅ **Testing**: Business logic works with both mock and real data
- ✅ **Consistent Patterns**: Same DI Container pattern across all domains

### Implementation Steps (Notification Domain Example)

#### Step 1: Define DTO (snake_case - API contract)

```typescript
// domains/notification/data/dto/notification.dto.ts
export interface NotificationDTO {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  is_read: boolean;
  created_at: string;
  read_at?: string;
}

export interface GetNotificationListResponseDTO {
  notifications: NotificationDTO[];
  total_count: number;
  unread_count: number;
}
```

#### Step 2: Create Mapper (DTO ↔ Entity conversion)

```typescript
// domains/notification/data/mappers/notification.mapper.ts
import type { NotificationDTO } from '../dto/notification.dto';
import type { Notification } from '../../domain/entities/notification.entity';

export function notificationDtoToDomain(dto: NotificationDTO): Notification {
  return {
    id: dto.id,
    userId: dto.user_id,
    title: dto.title,
    message: dto.message,
    type: dto.type,
    isRead: dto.is_read,
    createdAt: dto.created_at,
    readAt: dto.read_at,
  };
}

export function notificationDtoListToDomain(
  dtos: NotificationDTO[]
): Notification[] {
  return dtos.map(notificationDtoToDomain);
}
```

#### Step 3: Implement Mock DataSource

```typescript
// domains/notification/data/data-sources/notification-mock-data-source.ts
const MOCK_NOTIFICATIONS: NotificationDTO[] = [
  {
    id: 'notif-1',
    user_id: 'user-123',
    title: '새로운 할인 혜택',
    message: '학생식당에서 20% 할인 혜택이 추가되었습니다.',
    type: 'INFO',
    is_read: false,
    created_at: '2024-01-15T10:00:00Z',
  },
  // ... more mock data
];

export interface NotificationDataSource {
  getNotificationList(): Promise<GetNotificationListResponseDTO>;
  markAsRead(notificationId: string): Promise<void>;
}

export class NotificationMockDataSource implements NotificationDataSource {
  private notifications: NotificationDTO[] = [...MOCK_NOTIFICATIONS];

  async getNotificationList(): Promise<GetNotificationListResponseDTO> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 100));

    const unreadCount = this.notifications.filter((n) => !n.is_read).length;
    return {
      notifications: this.notifications,
      total_count: this.notifications.length,
      unread_count: unreadCount,
    };
  }

  async markAsRead(notificationId: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 100));

    const notification = this.notifications.find(
      (n) => n.id === notificationId
    );
    if (notification) {
      notification.is_read = true;
      notification.read_at = new Date().toISOString();
    }
  }
}
```

#### Step 4: Implement Repository

```typescript
// domains/notification/data/repositories/notification-repository.impl.ts
import type { NotificationRepository } from '../../domain/repositories/notification-repository.interface';
import type { NotificationDataSource } from '../data-sources/notification-mock-data-source';
import { notificationDtoListToDomain } from '../mappers/notification.mapper';

export class NotificationRepositoryImpl implements NotificationRepository {
  constructor(private readonly dataSource: NotificationDataSource) {}

  async getNotificationList(): Promise<NotificationList> {
    const response = await this.dataSource.getNotificationList();
    const notifications = notificationDtoListToDomain(response.notifications);
    return {
      notifications,
      totalCount: response.total_count,
      unreadCount: response.unread_count,
    };
  }

  async markAsRead(notificationId: string): Promise<void> {
    await this.dataSource.markAsRead(notificationId);
  }
}
```

#### Step 5: Create UseCase

```typescript
// domains/notification/domain/usecases/get-notification-list.usecase.ts
export interface GetNotificationListUseCase {
  execute(): Promise<NotificationList>;
}

export class GetNotificationListUseCaseImpl
  implements GetNotificationListUseCase
{
  constructor(
    private readonly notificationRepository: NotificationRepository
  ) {}

  async execute(): Promise<NotificationList> {
    return await this.notificationRepository.getNotificationList();
  }
}
```

#### Step 6: Setup DI Containers

```typescript
// domains/notification/di/notification-server-container.ts (Server-side)
export class NotificationServerContainer {
  private _dataSource?: NotificationMockDataSource;
  private _repository?: NotificationRepositoryImpl;
  private _getNotificationListUseCase?: GetNotificationListUseCase;

  private getDataSource(): NotificationMockDataSource {
    if (!this._dataSource) {
      this._dataSource = new NotificationMockDataSource();
    }
    return this._dataSource;
  }

  private getRepository(): NotificationRepositoryImpl {
    if (!this._repository) {
      this._repository = new NotificationRepositoryImpl(this.getDataSource());
    }
    return this._repository;
  }

  getGetNotificationList(): GetNotificationListUseCase {
    if (!this._getNotificationListUseCase) {
      this._getNotificationListUseCase = new GetNotificationListUseCaseImpl(
        this.getRepository()
      );
    }
    return this._getNotificationListUseCase;
  }
}

export function createNotificationServerContainer(): NotificationServerContainer {
  return new NotificationServerContainer();
}

// domains/notification/di/notification-client-container.ts (Client-side)
let clientContainer: NotificationClientContainer | null = null;

export function getNotificationClientContainer(): NotificationClientContainer {
  if (!clientContainer) {
    clientContainer = new NotificationClientContainer();
  }
  return clientContainer;
}
```

#### Step 7: Use in Pages and Sections

```typescript
// Page (Server-side prefetch)
import { createNotificationServerContainer } from '@/src/domains/notification/di';

const NotificationPage = async () => {
  const container = createNotificationServerContainer();
  const getNotificationListUseCase = container.getGetNotificationList();

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['notifications', 'list'],
    queryFn: () => getNotificationListUseCase.execute(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotificationView />
    </HydrationBoundary>
  );
};

// Section (Client-side fetch)
('use client');
import { getNotificationClientContainer } from '@/src/domains/notification/di';

const NotificationListSection = () => {
  const container = getNotificationClientContainer();
  const getNotificationListUseCase = container.getGetNotificationList();

  const { data } = useSuspenseQuery({
    queryKey: ['notifications', 'list'],
    queryFn: () => getNotificationListUseCase.execute(),
  });

  return <NotificationList notifications={data.notifications} />;
};
```

### Replacing Mock with Real API

When the backend API is ready, simply replace the Mock DataSource with a Remote DataSource:

```typescript
// Before (Mock)
import { NotificationMockDataSource } from "../data-sources/notification-mock-data-source";

private getDataSource(): NotificationMockDataSource {
  if (!this._dataSource) {
    this._dataSource = new NotificationMockDataSource();
  }
  return this._dataSource;
}

// After (Real API)
import { NotificationRemoteDataSource } from "../data-sources/notification-remote-data-source";
import { getHttpClient } from "@core/infrastructure/http-client";

private getDataSource(): NotificationRemoteDataSource {
  if (!this._dataSource) {
    this._dataSource = new NotificationRemoteDataSource(getHttpClient());
  }
  return this._dataSource;
}

// Remote DataSource Implementation
export class NotificationRemoteDataSource implements NotificationDataSource {
  constructor(private readonly httpClient: HttpClient) {}

  async getNotificationList(): Promise<GetNotificationListResponseDTO> {
    return await this.httpClient.get<GetNotificationListResponseDTO>(
      '/api/v1/notifications'
    );
  }

  async markAsRead(notificationId: string): Promise<void> {
    await this.httpClient.patch(`/api/v1/notifications/${notificationId}/read`);
  }
}
```

**Key Benefits of This Approach:**

- ✅ Only the DI Container needs to change (2-3 lines)
- ✅ Repository, UseCase, and UI components remain unchanged
- ✅ Type safety maintained throughout
- ✅ No breaking changes to existing code

---

**Related**: See `monorepo-structure.md` for overall architecture, `package-usage.md` for component imports
