---
description: "Visual architecture diagrams using Mermaid - Clean Architecture layers, component hierarchy, data flows, DI containers"
globs:
  - "**/*"
alwaysApply: true
---

# Architecture Diagrams

> **Purpose**: Visual reference for system architecture using Mermaid diagrams
> **Target Audience**: New developers, visual learners, architecture overview
> **Related Docs**: [core/architecture.md](./core/architecture.md), [frontend/component-hierarchy.md](./frontend/component-hierarchy.md), [ddd/di-server-containers.md](./ddd/di-server-containers.md)

## Table of Contents

1. [Clean Architecture 4 Layers](#1-clean-architecture-4-layers)
2. [Component Hierarchy](#2-component-hierarchy)
3. [Data Flow: SSR → Hydration → CSR](#3-data-flow-ssr--hydration--csr)
4. [DI Container Patterns](#4-di-container-patterns)
5. [Domain Isolation (6 Bounded Contexts)](#5-domain-isolation-6-bounded-contexts)
6. [UseCase → Repository → HttpClient Flow](#6-usecase--repository--httpclient-flow)
7. [Query Hook Pattern](#7-query-hook-pattern)
8. [Adapter Pattern Flow](#8-adapter-pattern-flow)

---

## 1. Clean Architecture 4 Layers

### Overview
Shows the 4-layer Clean Architecture with dependency flow from Presentation → Domain → Data → Infrastructure.

```mermaid
graph TB
    subgraph PRESENTATION["📱 PRESENTATION LAYER"]
        Pages["Pages<br/>(Server Components)"]
        Views["Views<br/>(Client/Server)"]
        Sections["Sections<br/>(Client Components)"]
        Components["Components<br/>(Pure UI)"]
        Hooks["Hooks<br/>(useQuery, useMutation)"]

        Pages --> Views
        Views --> Sections
        Sections --> Components
        Sections --> Hooks
    end

    subgraph DICONTAINER["🔧 DI CONTAINER"]
        ServerContainer["Server Container<br/>createXXXServerContainer()<br/>(Factory Pattern)"]
        ClientContainer["Client Container<br/>getXXXClientContainer()<br/>(Lazy Singleton)"]
    end

    subgraph DOMAIN["🏛️ DOMAIN LAYER"]
        UseCases["UseCases<br/>(Business Logic)"]
        Entities["Entities<br/>(Domain Models)"]
        RepoInterface["Repository<br/>(Interface)"]

        UseCases --> Entities
        UseCases --> RepoInterface
    end

    subgraph DATA["💾 DATA LAYER"]
        RepoImpl["Repository Implementation<br/>(API calls via HttpClient)"]
        DTOMappers["DTO Mappers<br/>(snake_case ↔ camelCase)"]

        RepoImpl --> DTOMappers
    end

    subgraph INFRASTRUCTURE["⚙️ INFRASTRUCTURE LAYER"]
        HttpClient["HttpClient<br/>(API communication)"]
        SessionManager["SessionManager<br/>(Token management)"]
        TokenProvider["TokenProvider<br/>(Token refresh)"]

        HttpClient --> SessionManager
        SessionManager --> TokenProvider
    end

    %% Dependencies (flow downward)
    Pages -.->|SSR prefetch| ServerContainer
    Hooks -.->|CSR fetch| ClientContainer
    ServerContainer --> UseCases
    ClientContainer --> UseCases
    RepoInterface -.->|implements| RepoImpl
    RepoImpl --> HttpClient

    style PRESENTATION fill:#e3f2fd
    style DICONTAINER fill:#fff3e0
    style DOMAIN fill:#e8f5e9
    style DATA fill:#fce4ec
    style INFRASTRUCTURE fill:#f3e5f5
```

**Key Principles**:
- ✅ Outer layers depend on inner layers (Dependency Inversion)
- ✅ Business logic isolated in Domain layer
- ✅ Infrastructure is a plugin (replaceable)
- ❌ Never skip layers (e.g., Page → Repository)

**Related Documentation**: [core/architecture.md](./core/architecture.md)

---

## 2. Component Hierarchy

### Overview
Shows the 4-tier component hierarchy: Page → View → Section → Component with their responsibilities.

```mermaid
graph TB
    subgraph PAGE["🗂️ PAGE (Server Component)"]
        PageRole["<b>Role:</b> Route entry point<br/><b>Exports:</b> default<br/><b>Container:</b> createXXXServerContainer()"]
        PageTasks["- Data prefetching (SSR)<br/>- Metadata generation<br/>- HydrationBoundary setup"]
    end

    subgraph VIEW["🎨 VIEW (Client or Server)"]
        ViewRole["<b>Role:</b> Page layout composition<br/><b>Exports:</b> named<br/><b>Container:</b> None"]
        ViewTasks["- Section orchestration<br/>- Page-level UI state<br/>- NO data fetching"]
    end

    subgraph SECTION["🧩 SECTION (Client Component)"]
        SectionRole["<b>Role:</b> Feature encapsulation<br/><b>Exports:</b> named<br/><b>Container:</b> getXXXClientContainer()"]
        SectionTasks["- Data fetching (TanStack Query)<br/>- ErrorBoundary + Suspense<br/>- Feature-specific state"]
    end

    subgraph COMPONENT["🎯 COMPONENT (Pure/Presentational)"]
        ComponentRole["<b>Role:</b> Reusable UI<br/><b>Exports:</b> named<br/><b>Container:</b> None"]
        ComponentTasks["- Props-only data<br/>- Callback props for events<br/>- NO data fetching"]
    end

    PAGE ==>|imports| VIEW
    VIEW ==>|imports| SECTION
    SECTION ==>|imports| COMPONENT

    PAGE -.->|"❌ NEVER skip"| SECTION
    PAGE -.->|"❌ NEVER skip"| COMPONENT
    VIEW -.->|"❌ NEVER skip"| COMPONENT

    style PAGE fill:#e3f2fd
    style VIEW fill:#e8f5e9
    style SECTION fill:#fff3e0
    style COMPONENT fill:#fce4ec
```

**Import Rules**:
- ✅ Same domain → Relative imports (`../../sections/`)
- ✅ Page → View → Absolute imports (`@/src/domains/auth/...`)
- ✅ Cross-domain → Absolute imports
- ❌ NEVER skip layers (Page → Component)

**Related Documentation**: [frontend/component-hierarchy.md](./frontend/component-hierarchy.md)

---

## 3. Data Flow: SSR → Hydration → CSR

### Overview
Shows complete data flow from Server-Side Rendering (SSR) through hydration to Client-Side Rendering (CSR).

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant Page as Page<br/>(Server Component)
    participant ServerContainer as Server DI Container
    participant UseCase as GetUserUseCase
    participant View as View<br/>(Client Component)
    participant Section as Section<br/>(Client Component)
    participant ClientContainer as Client DI Container

    Note over User,ClientContainer: 1️⃣ SSR Phase (Server)

    User->>Browser: Navigate to /profile
    Browser->>Page: Request page
    activate Page
    Page->>ServerContainer: createUserServerContainer(sessionManager)
    activate ServerContainer
    ServerContainer-->>Page: container
    deactivate ServerContainer

    Page->>UseCase: container.getGetMyProfile().execute()
    activate UseCase
    UseCase-->>Page: UserEntity
    deactivate UseCase

    Page->>Page: queryClient.prefetchQuery({ queryKey, queryFn })
    Page->>View: Render with HydrationBoundary
    View-->>Browser: HTML + Dehydrated State
    deactivate Page

    Note over Browser,Section: 2️⃣ Hydration Phase (Browser)

    Browser->>Browser: Display HTML immediately
    Browser->>View: Hydrate React components
    activate View
    View->>Section: Mount Section
    deactivate View

    Note over Section,ClientContainer: 3️⃣ CSR Phase (Browser)

    activate Section
    Section->>ClientContainer: getUserClientContainer()
    activate ClientContainer
    ClientContainer-->>Section: container (singleton)
    deactivrate ClientContainer

    Section->>Section: useSuspenseQuery({ queryKey, queryFn })
    Note right of Section: Same queryKey as SSR<br/>→ Cache hit!<br/>No network request

    Section-->>User: Render with cached data
    deactivate Section
```

**Key Insights**:
1. **SSR Phase**: Server prefetches data using Server Container
2. **Hydration**: Browser receives HTML + dehydrated state, displays immediately
3. **CSR Phase**: Client reuses cached data (same queryKey), no duplicate network request
4. **Performance**: User sees content instantly (SSR) + interactive UI (hydration)

**Related Documentation**: [frontend/page-patterns.md](./frontend/page-patterns.md), [frontend/section-patterns.md](./frontend/section-patterns.md)

---

## 4. DI Container Patterns

### Server DI Container (Factory Pattern)

```mermaid
graph LR
    subgraph REQUEST1["Request 1 (User A)"]
        SessionMgr1["SessionManager<br/>(User A token)"]
        ServerContainer1["Server Container<br/>(NEW instance)"]
        UseCase1["GetUserUseCase<br/>(User A data)"]

        SessionMgr1 --> ServerContainer1
        ServerContainer1 --> UseCase1
    end

    subgraph REQUEST2["Request 2 (User B)"]
        SessionMgr2["SessionManager<br/>(User B token)"]
        ServerContainer2["Server Container<br/>(NEW instance)"]
        UseCase2["GetUserUseCase<br/>(User B data)"]

        SessionMgr2 --> ServerContainer2
        ServerContainer2 --> UseCase2
    end

    Page["Page<br/>(Server Component)"] ==>|createUserServerContainer<br/>(sessionMgr1)| REQUEST1
    Page2["Page<br/>(Server Component)"] ==>|createUserServerContainer<br/>(sessionMgr2)| REQUEST2

    style REQUEST1 fill:#e3f2fd
    style REQUEST2 fill:#e8f5e9
    style Page fill:#fff3e0
    style Page2 fill:#fff3e0
```

**Factory Pattern Characteristics**:
- ✅ New instance per request → No state pollution
- ✅ Request-level lifecycle → Automatic cleanup
- ✅ SessionManager parameter → User-specific tokens
- ✅ Thread-safe → No concurrent request issues

### Client DI Container (Lazy Singleton Pattern)

```mermaid
graph LR
    subgraph SINGLETON["Client Container Lifecycle"]
        FirstCall["First Call:<br/>getUserClientContainer()"]
        CreateInstance["Create new instance<br/>(containerInstance = new ...)"]
        CacheInstance["Cache in module scope<br/>(let containerInstance)"]
        SubsequentCalls["Subsequent Calls:<br/>getUserClientContainer()"]
        ReturnCached["Return cached instance"]

        FirstCall --> CreateInstance
        CreateInstance --> CacheInstance
        CacheInstance --> SubsequentCalls
        SubsequentCalls --> ReturnCached
        ReturnCached -.->|reuse| SubsequentCalls
    end

    Section1["Section 1<br/>(Client Component)"] ==>|First call| FirstCall
    Section2["Section 2<br/>(Client Component)"] ==>|Reuses| SubsequentCalls
    Hook["useUserProfile()<br/>(Custom Hook)"] ==>|Reuses| SubsequentCalls

    style SINGLETON fill:#fff3e0
    style Section1 fill:#e3f2fd
    style Section2 fill:#e8f5e9
    style Hook fill:#fce4ec
```

**Lazy Singleton Characteristics**:
- ✅ One instance per app → Consistent cache
- ✅ Lazy initialization → Only created when needed
- ✅ No parameters → Simple API
- ❌ NEVER use in Server Components → State leakage!

**Related Documentation**: [ddd/di-server-containers.md](./ddd/di-server-containers.md), [ddd/di-client-containers.md](./ddd/di-client-containers.md)

---

## 5. Domain Isolation (6 Bounded Contexts)

### Overview
Shows 6 bounded contexts with isolated domain logic, sharing only through `@core`.

```mermaid
graph TB
    subgraph CORE["@core (Shared Infrastructure)"]
        CoreTypes["Shared Types"]
        CoreUtils["Utilities"]
        CoreUI["Shared UI Components"]
        CoreInfra["Infrastructure<br/>(HttpClient, SessionManager)"]
    end

    subgraph AUTH["🔐 auth Domain"]
        AuthPresentation["Presentation"]
        AuthDomain["Domain<br/>(Login, Token)"]
        AuthData["Data"]
    end

    subgraph BENEFIT["🎁 benefit Domain"]
        BenefitPresentation["Presentation"]
        BenefitDomain["Domain<br/>(Benefits, Applications)"]
        BenefitData["Data"]
    end

    subgraph CAFETERIA["🍽️ cafeteria Domain"]
        CafeteriaPresentation["Presentation"]
        CafeteriaDomain["Domain<br/>(Menu, Reviews)"]
        CafeteriaData["Data"]
    end

    subgraph NOTIFICATION["🔔 notification Domain"]
        NotificationPresentation["Presentation"]
        NotificationDomain["Domain<br/>(Push, Alerts)"]
        NotificationData["Data"]
    end

    subgraph STAMP["📌 stamp Domain"]
        StampPresentation["Presentation"]
        StampDomain["Domain<br/>(Stamps, Rewards)"]
        StampData["Data"]
    end

    subgraph USER["👤 user Domain"]
        UserPresentation["Presentation"]
        UserDomain["Domain<br/>(Profile, Settings)"]
        UserData["Data"]
    end

    %% All domains depend on @core
    AUTH -.->|"✅ Allowed"| CORE
    BENEFIT -.->|"✅ Allowed"| CORE
    CAFETERIA -.->|"✅ Allowed"| CORE
    NOTIFICATION -.->|"✅ Allowed"| CORE
    STAMP -.->|"✅ Allowed"| CORE
    USER -.->|"✅ Allowed"| CORE

    %% Cross-domain imports are prohibited
    BENEFIT -.->|"❌ Prohibited"| AUTH
    CAFETERIA -.->|"❌ Prohibited"| USER

    style CORE fill:#fff3e0
    style AUTH fill:#e3f2fd
    style BENEFIT fill:#e8f5e9
    style CAFETERIA fill:#fce4ec
    style NOTIFICATION fill:#f3e5f5
    style STAMP fill:#fff9c4
    style USER fill:#ffebee
```

**Domain Isolation Rules**:
- ✅ Each domain is self-contained bounded context
- ✅ All domains can depend on `@core`
- ✅ Share types/utilities via `@core/types`, `@core/utils`
- ❌ NEVER import from other domains directly
- ❌ No circular dependencies between domains

**Related Documentation**: [core/architecture.md](./core/architecture.md#6-bounded-contexts)

---

## 6. UseCase → Repository → HttpClient Flow

### Overview
Shows complete flow from UseCase execution through Repository to API call.

```mermaid
sequenceDiagram
    participant Section as Section<br/>(Client Component)
    participant Container as Client DI Container
    participant UseCase as GetUserProfileUseCase
    participant Repository as UserRepository
    participant HttpClient as HttpClient
    participant SessionMgr as SessionManager
    participant API as Backend API

    Section->>Container: getUserClientContainer()
    activate Container
    Container-->>Section: container
    deactivate Container

    Section->>Container: container.getGetMyProfile()
    activate Container
    Container->>UseCase: new GetUserProfileUseCase(repository)
    Container-->>Section: useCase
    deactivate Container

    Section->>UseCase: useCase.execute()
    activate UseCase

    UseCase->>Repository: repository.getMyProfile()
    activate Repository

    Repository->>HttpClient: httpClient.get('/api/users/me')
    activate HttpClient

    HttpClient->>SessionMgr: sessionManager.getAccessToken()
    activate SessionMgr
    SessionMgr-->>HttpClient: "Bearer abc123..."
    deactivate SessionMgr

    HttpClient->>API: GET /api/users/me<br/>Authorization: Bearer abc123...
    activate API
    API-->>HttpClient: { id, name, email, ... }
    deactivate API

    HttpClient-->>Repository: Response<UserDTO>
    deactivate HttpClient

    Repository->>Repository: UserMapper.toDomain(dto)
    Repository-->>UseCase: UserEntity
    deactivate Repository

    UseCase->>UseCase: Validation & Business Logic
    UseCase-->>Section: UserEntity
    deactivate UseCase

    Section->>Section: Render UI
```

**Layer Responsibilities**:
1. **Section**: Orchestrates data fetching via TanStack Query
2. **DI Container**: Provides UseCase with all dependencies
3. **UseCase**: Business logic, validation, orchestration
4. **Repository**: Data access abstraction, DTO → Entity mapping
5. **HttpClient**: HTTP communication, token injection
6. **SessionManager**: Token management, refresh logic

**Related Documentation**: [ddd/usecase-patterns.md](./ddd/usecase-patterns.md), [ddd/repository-patterns.md](./ddd/repository-patterns.md)

---

## 7. Query Hook Pattern

### Overview
Shows how Query Hooks integrate with Client DI Container and TanStack Query.

```mermaid
graph TB
    subgraph HOOK["Custom Query Hook"]
        HookDef["useUserProfile()<br/>(Hook Definition)"]
        GetContainer["getUserClientContainer()"]
        GetUseCase["container.getGetMyProfile()"]
        UseSuspenseQuery["useSuspenseQuery({ queryKey, queryFn })"]

        HookDef --> GetContainer
        GetContainer --> GetUseCase
        GetUseCase --> UseSuspenseQuery
    end

    subgraph SECTION["Section Component"]
        SectionComponent["ProfileSection"]
        CallHook["const { data } = useUserProfile()"]
        RenderUI["Render with data"]

        SectionComponent --> CallHook
        CallHook --> RenderUI
    end

    subgraph TANSTACK["TanStack Query"]
        QueryClient["QueryClient"]
        Cache["Cache<br/>(queryKey: ['user', 'profile'])"]
        Fetcher["queryFn: () => useCase.execute()"]

        UseSuspenseQuery -.-> QueryClient
        QueryClient --> Cache
        Cache -.->|cache miss| Fetcher
        Fetcher -.->|cache hit| Cache
    end

    SECTION ==>|calls| HOOK
    HOOK -.->|uses| TANSTACK

    style HOOK fill:#e3f2fd
    style SECTION fill:#e8f5e9
    style TANSTACK fill:#fff3e0
```

**Query Hook Pattern**:
1. ✅ Hook encapsulates Container + UseCase logic
2. ✅ Uses `useSuspenseQuery` for automatic suspense
3. ✅ Consistent queryKey for cache management
4. ✅ Centralized error handling via ErrorBoundary
5. ❌ NEVER use deprecated Factory pattern

**Related Documentation**: [patterns/query-hooks.md](./patterns/query-hooks.md)

---

## 8. Adapter Pattern Flow

### Overview
Shows when and how to use Adapter vs Mapper for Entity → UI Type transformation.

```mermaid
graph TB
    subgraph DECISION["Decision: Adapter vs Mapper"]
        Start["Entity → UI Type<br/>transformation needed"]
        Count["Count Entity<br/>method calls"]

        Start --> Count
        Count -->|"7+ methods"| UseAdapter["✅ Use Adapter"]
        Count -->|"< 7 methods"| UseMapper["✅ Use Mapper"]
    end

    subgraph ADAPTER["Adapter Pattern (7+ methods)"]
        Entity1["BenefitEntity<br/>(15 methods)"]
        AdapterClass["BenefitAdapter<br/>(static class)"]
        AdapterMethod["toUI(entity): BenefitUIType"]
        UIType1["BenefitUIType<br/>(flat, UI-friendly)"]

        Entity1 --> AdapterClass
        AdapterClass --> AdapterMethod
        AdapterMethod --> UIType1
    end

    subgraph MAPPER["Mapper Pattern (< 7 methods)"]
        Entity2["UserEntity<br/>(3 methods)"]
        MapperFn["toUserUI(entity)"]
        UIType2["UserUIType<br/>(simple)"]

        Entity2 --> MapperFn
        MapperFn --> UIType2
    end

    DECISION ==>|Complex| ADAPTER
    DECISION ==>|Simple| MAPPER

    AdapterMethod -.->|"Example:<br/>canApply: entity.isActive() &&<br/>!entity.isExpired() &&<br/>!entity.hasApplied() &&<br/>entity.isWithinApplicationPeriod() &&<br/>...7+ methods"| UIType1

    MapperFn -.->|"Example:<br/>displayName: entity.getDisplayName()<br/>avatarUrl: entity.getAvatarUrl()"| UIType2

    style DECISION fill:#fff3e0
    style ADAPTER fill:#e3f2fd
    style MAPPER fill:#e8f5e9
```

**When to Use Each**:

| Pattern | Method Calls | Location | Example |
|---------|-------------|----------|---------|
| **Adapter** | 7+ methods | `presentation/adapters/` | `BenefitAdapter.toUI(entity)` |
| **Mapper** | < 7 methods | `presentation/mappers/` or inline | `toUserUI(entity)` |

**Adapter Benefits**:
- ✅ Type-safe conversion (no unsafe `as`)
- ✅ Centralized complex logic
- ✅ Comprehensive JSDoc documentation
- ✅ Reusable across multiple components
- ✅ Testable in isolation

**Related Documentation**: [patterns/adapter-basics.md](./patterns/adapter-basics.md), [patterns/adapter-implementation.md](./patterns/adapter-implementation.md)

---

## How to Use These Diagrams

### For New Developers:
1. **Start with #1** (Clean Architecture) to understand overall system structure
2. **Read #2** (Component Hierarchy) to learn frontend organization
3. **Study #3** (Data Flow) to understand SSR → CSR process
4. **Review #4** (DI Containers) to grasp dependency injection patterns
5. **Explore #5-8** for specific pattern deep dives

### For Architecture Decisions:
- Use **#1** when explaining layer boundaries
- Use **#2** when discussing component structure
- Use **#4** when debugging Container issues
- Use **#5** when planning domain boundaries
- Use **#8** when deciding Adapter vs Mapper

### For Code Reviews:
- Reference **#2** for component hierarchy violations
- Reference **#4** for wrong Container usage
- Reference **#5** for cross-domain import violations
- Reference **#6** for layer-skipping issues

---

## Related Documentation

- **[core/architecture.md](./core/architecture.md)** — Architecture overview, MUST/NEVER rules
- **[frontend/component-hierarchy.md](./frontend/component-hierarchy.md)** — Component hierarchy details
- **[ddd/di-server-containers.md](./ddd/di-server-containers.md)** — Server Container implementation
- **[ddd/di-client-containers.md](./ddd/di-client-containers.md)** — Client Container implementation
- **[patterns/adapter-basics.md](./patterns/adapter-basics.md)** — Adapter pattern guide
- **[patterns/query-hooks.md](./patterns/query-hooks.md)** — Query Hook pattern

---

**Note**: These Mermaid diagrams complement (not replace) the ASCII diagrams in the original documentation. Both serve different purposes:
- **ASCII diagrams**: Quick reference, works in all text editors
- **Mermaid diagrams**: Visual learning, architecture presentations, onboarding

For best results, use both in combination based on your learning style and context.
