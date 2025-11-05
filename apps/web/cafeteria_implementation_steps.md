# Cafeteria Clean Architecture - Detailed Implementation Steps

## Quick Reference

| Stage | Priority | Duration | Files |
|-------|----------|----------|-------|
| **Stage 1: Structure** | CRITICAL | 30 min | Create 8 new directories |
| **Stage 2: Core Layer** | HIGH | 30 min | Move 3 files (types, constants) |
| **Stage 3: Domain Layer** | HIGH | 45 min | Create interfaces, rename services → usecases |
| **Stage 4: Data Layer** | HIGH | 60 min | Create DTOs, mappers, split repos |
| **Stage 5: DI Containers** | MEDIUM | 45 min | Create 3 container files |
| **Stage 6: Imports** | CRITICAL | 45 min | Update 40-50 import statements |
| **Stage 7: Validation** | CRITICAL | 30 min | Run tests, fix issues |

---

## Stage 1: Create Directory Structure (30 min)

```bash
# Create core layer
mkdir -p src/domains/cafeteria/core/{config,errors,types}

# Create domain layer
mkdir -p src/domains/cafeteria/domain/{entities,interfaces,usecases}

# Create data layer
mkdir -p src/domains/cafeteria/data/{data-sources,dto,mappers,repositories,utils}

# Create DI layer
mkdir -p src/domains/cafeteria/di

# Move UI-related folders into ui/
mkdir -p src/domains/cafeteria/ui/{constants,types,schemas,stores}
```

---

## Stage 2: Move Core Layer Files (30 min)

### 2.1 Move Types to Core
```bash
# Move all types
mv src/domains/cafeteria/types/cafeteria.type.ts \
   src/domains/cafeteria/core/types/cafeteria.type.ts
   
mv src/domains/cafeteria/types/cafeteria-review.type.ts \
   src/domains/cafeteria/core/types/cafeteria-review.type.ts
   
mv src/domains/cafeteria/types/review-rating.ts \
   src/domains/cafeteria/core/types/review-rating.ts
```

### 2.2 Move Constants to Core Config
```bash
# Move constants
mv src/domains/cafeteria/constants/review.ts \
   src/domains/cafeteria/core/config/review.ts
   
mv src/domains/cafeteria/constants/index.ts \
   src/domains/cafeteria/core/config/index.ts
```

### 2.3 Create Core Barrel Export
Create `src/domains/cafeteria/core/index.ts`:
```typescript
export * from "./types";
export * from "./config";
export * from "./errors";
```

### 2.4 Create Core Errors
Create `src/domains/cafeteria/core/errors/index.ts`:
```typescript
export class CafeteriaNotFoundError extends Error {
  constructor(id?: string) {
    super(id ? `Cafeteria ${id} not found` : "Cafeteria not found");
    this.name = "CafeteriaNotFoundError";
  }
}

export class InvalidCafeteriaDataError extends Error {
  constructor(message: string) {
    super(`Invalid cafeteria data: ${message}`);
    this.name = "InvalidCafeteriaDataError";
  }
}
```

---

## Stage 3: Create Domain Layer (45 min)

### 3.1 Extract Repository Interface
Create `src/domains/cafeteria/domain/interfaces/cafeteria-repository.interface.ts`:
```typescript
import type { Cafeteria, CafeteriaMenu } from "@cafeteria/core";

export interface CafeteriaRepository {
  getCafeteriasWithMenu(params: {
    date?: string;
    cursor?: string;
    size?: number;
  }): Promise<{ data: Cafeteria[]; pageInfo: PageInfo }>;

  getCafeteriaById(id: string): Promise<Cafeteria>;

  getCafeteriaMenuByDate(id: string, date: string): Promise<CafeteriaMenu>;

  getCafeteriaMenuAvailability(
    id: string,
    params: { year: number; month: number },
  ): Promise<{ dates: string[] }>;
}
```

### 3.2 Create Review Repository Interface
Create `src/domains/cafeteria/domain/interfaces/cafeteria-review-repository.interface.ts`:
```typescript
import type { CafeteriaReview } from "@cafeteria/core";

export interface CafeteriaReviewRepository {
  getReviewsByMenuId(menuId: string): Promise<CafeteriaReview[]>;
  createReview(data: CreateReviewRequest): Promise<CafeteriaReview>;
}
```

### 3.3 Create Interfaces Barrel
Create `src/domains/cafeteria/domain/interfaces/index.ts`:
```typescript
export type { CafeteriaRepository } from "./cafeteria-repository.interface";
export type { CafeteriaReviewRepository } from "./cafeteria-review-repository.interface";
```

### 3.4 Create Entities Folder
Create `src/domains/cafeteria/domain/entities/index.ts`:
```typescript
// Re-export types as entities (can extend with business methods later)
export type { Cafeteria, CafeteriaMenu, CafeteriaReview } from "@cafeteria/core";
```

### 3.5 Rename Services to UseCases
```bash
# Move services to domain/usecases
mv src/domains/cafeteria/services/cafeteria-service.ts \
   src/domains/cafeteria/domain/usecases/get-cafeteria.usecase.ts

mv src/domains/cafeteria/services/cafeteria-review-service.ts \
   src/domains/cafeteria/domain/usecases/get-cafeteria-review.usecase.ts
```

### 3.6 Create Domain Barrel
Create `src/domains/cafeteria/domain/index.ts`:
```typescript
export { CafeteriaRepository } from "./interfaces/cafeteria-repository.interface";
export { CafeteriaReviewRepository } from "./interfaces/cafeteria-review-repository.interface";
export { GetCafeteriaUseCase } from "./usecases/get-cafeteria.usecase";
export { GetCafeteriaReviewUseCase } from "./usecases/get-cafeteria-review.usecase";
```

---

## Stage 4: Create Data Layer (60 min)

### 4.1 Create DTOs
Create `src/domains/cafeteria/data/dto/cafeteria.dto.ts`:
```typescript
/**
 * Cafeteria DTO (Data Transfer Object)
 * Direct mapping from API response
 */
export interface CafeteriaDTO {
  id: string;
  name: string;
  address: string;
  businessHours?: {
    dayOfWeek: string;
    openTime: string;
    closeTime: string;
  }[];
}

export interface CafeteriaMenuDTO {
  id: string;
  restaurantId: string;
  date: string;
  mealType: "breakfast" | "lunch" | "dinner";
  items: {
    name: string;
    price?: number;
    calories?: number;
  }[];
}
```

### 4.2 Create Mappers
Create `src/domains/cafeteria/data/mappers/cafeteria.mapper.ts`:
```typescript
import type { Cafeteria } from "@cafeteria/core";
import type { CafeteriaDTO } from "../dto/cafeteria.dto";

export class CafeteriaMapper {
  static toDomain(dto: CafeteriaDTO): Cafeteria {
    return {
      id: dto.id,
      name: dto.name,
      address: dto.address,
      businessHours: dto.businessHours ?? [],
    };
  }

  static toDTO(domain: Cafeteria): CafeteriaDTO {
    return {
      id: domain.id,
      name: domain.name,
      address: domain.address,
      businessHours: domain.businessHours,
    };
  }
}
```

### 4.3 Create DataSource
Create `src/domains/cafeteria/data/data-sources/cafeteria-remote.datasource.ts`:
```typescript
import type { HttpClient } from "@/src/shared/infrastructure/http";
import type { CafeteriaDTO, CafeteriaMenuDTO } from "../dto/cafeteria.dto";

export class CafeteriaRemoteDataSource {
  constructor(private readonly httpClient: HttpClient) {}

  async getCafeteriaById(id: string): Promise<CafeteriaDTO> {
    const response = await this.httpClient.get(`/api/v1/cafeterias/${id}`);
    return response.data.data;
  }

  async getCafeteriaMenuByDate(
    id: string,
    date: string,
  ): Promise<CafeteriaMenuDTO> {
    const response = await this.httpClient.get(
      `/api/v1/cafeterias/${id}/menus`,
      { params: { date } },
    );
    return response.data.data;
  }
}
```

### 4.4 Move & Update Repository Implementation
Update `src/domains/cafeteria/data/repositories/cafeteria-repository.ts`:
```typescript
import type { Cafeteria } from "@cafeteria/core";
import type { CafeteriaRepository } from "@cafeteria/domain";
import { CafeteriaMapper } from "../mappers/cafeteria.mapper";
import { CafeteriaRemoteDataSource } from "../data-sources/cafeteria-remote.datasource";

export class CafeteriaRepositoryImpl implements CafeteriaRepository {
  constructor(private readonly dataSource: CafeteriaRemoteDataSource) {}

  async getCafeteriaById(id: string): Promise<Cafeteria> {
    const dto = await this.dataSource.getCafeteriaById(id);
    return CafeteriaMapper.toDomain(dto);
  }

  async getCafeteriaMenuByDate(
    id: string,
    date: string,
  ): Promise<CafeteriaMenu> {
    const dto = await this.dataSource.getCafeteriaMenuByDate(id, date);
    return CafeteriaMenuMapper.toDomain(dto);
  }
}
```

### 4.5 Create Data Barrel
Create `src/domains/cafeteria/data/index.ts`:
```typescript
export { CafeteriaRemoteDataSource } from "./data-sources/cafeteria-remote.datasource";
export { CafeteriaRepositoryImpl } from "./repositories/cafeteria-repository";
export { CafeteriaReviewRepositoryImpl } from "./repositories/cafeteria-review-repository";
export { CafeteriaMapper } from "./mappers/cafeteria.mapper";
```

---

## Stage 5: Create DI Containers (45 min)

### 5.1 Create Server Container
Create `src/domains/cafeteria/di/cafeteria-server-container.ts`:
```typescript
import "server-only";

import { CafeteriaRemoteDataSource } from "@cafeteria/data";
import { CafeteriaRepositoryImpl } from "@cafeteria/data";
import { GetCafeteriaUseCase } from "@cafeteria/domain";
import { AuthenticatedHttpClient } from "@/src/shared/infrastructure/http";
import { FetchHttpClient } from "@/src/shared/infrastructure/http";
import { ServerTokenProvider } from "@/src/shared/infrastructure/http";
import { ServerSessionManager } from "@/src/shared/infrastructure/storage";

export function createCafeteriaServerContainer() {
  // Infrastructure
  const sessionManager = new ServerSessionManager();
  const tokenProvider = new ServerTokenProvider(sessionManager);
  const baseClient = new FetchHttpClient({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "",
  });
  const httpClient = new AuthenticatedHttpClient(
    baseClient,
    tokenProvider,
  );

  // Data Layer
  const remoteDataSource = new CafeteriaRemoteDataSource(httpClient);
  const repository = new CafeteriaRepositoryImpl(remoteDataSource);

  // Domain Layer (UseCases)
  const getCafeteriaUseCase = new GetCafeteriaUseCase(repository);

  return {
    getCafeteriaUseCase,
  };
}
```

### 5.2 Create Client Container
Create `src/domains/cafeteria/di/cafeteria-client-container.ts`:
```typescript
import { CafeteriaRemoteDataSource } from "@cafeteria/data";
import { CafeteriaRepositoryImpl } from "@cafeteria/data";
import { GetCafeteriaUseCase } from "@cafeteria/domain";
import { httpClientInstance } from "@/src/shared/infrastructure/http/client";

class CafeteriaClientContainer {
  private static instance: CafeteriaClientContainer;

  private getCafeteriaUseCase: GetCafeteriaUseCase;

  private constructor() {
    const remoteDataSource = new CafeteriaRemoteDataSource(httpClientInstance);
    const repository = new CafeteriaRepositoryImpl(remoteDataSource);
    this.getCafeteriaUseCase = new GetCafeteriaUseCase(repository);
  }

  static getInstance(): CafeteriaClientContainer {
    if (!CafeteriaClientContainer.instance) {
      CafeteriaClientContainer.instance = new CafeteriaClientContainer();
    }
    return CafeteriaClientContainer.instance;
  }

  getCafeteriaUseCaseInstance() {
    return this.getCafeteriaUseCase;
  }
}

export const cafeteriaClientContainer = CafeteriaClientContainer.getInstance();
```

### 5.3 Create DI Barrel
Create `src/domains/cafeteria/di/index.ts`:
```typescript
export { createCafeteriaServerContainer } from "./cafeteria-server-container";
export { cafeteriaClientContainer } from "./cafeteria-client-container";
```

---

## Stage 6: Update Imports (45 min)

### 6.1 Update tsconfig Path Aliases
In `tsconfig.json` or `tsconfig.app.json`:
```json
{
  "compilerOptions": {
    "paths": {
      "@cafeteria/core": ["./src/domains/cafeteria/core"],
      "@cafeteria/domain": ["./src/domains/cafeteria/domain"],
      "@cafeteria/data": ["./src/domains/cafeteria/data"],
      "@cafeteria/di": ["./src/domains/cafeteria/di"],
      "@cafeteria/ui": ["./src/domains/cafeteria/ui"]
    }
  }
}
```

### 6.2 Search and Replace Pattern
Find all files importing from old paths:
```bash
grep -r "from.*cafeteria/types" src/
grep -r "from.*cafeteria/services" src/
grep -r "from.*cafeteria/repositories" src/
```

Replace patterns:
```
src/domains/cafeteria/types -> @cafeteria/core
src/domains/cafeteria/services -> @cafeteria/domain
src/domains/cafeteria/repositories/cafeteria-repository -> @cafeteria/domain
src/domains/cafeteria/constants -> @cafeteria/core
```

### 6.3 Update Component Imports Example
```typescript
// Before
import { CafeteriaServiceImpl } from "@/domains/cafeteria/services";
import type { GetCafeteriaResponse } from "@/domains/cafeteria/types";

// After
import { createCafeteriaServerContainer } from "@cafeteria/di";
import type { Cafeteria } from "@cafeteria/core";
```

---

## Stage 7: Validation & Testing (30 min)

### 7.1 TypeScript Check
```bash
npx tsc --noEmit
```

### 7.2 Build Test
```bash
npm run build
```

### 7.3 Run Tests
```bash
npm test -- cafeteria
```

### 7.4 Delete Old Directories
```bash
# Only after everything works
rm -rf src/domains/cafeteria/services
rm -rf src/domains/cafeteria/repositories (if using data/repositories now)
rm -rf src/domains/cafeteria/types (if moved to core/types)
```

---

## Common Gotchas & Solutions

| Problem | Solution |
|---------|----------|
| Circular imports between domain/data | Use interfaces in domain, implementations in data |
| Tests still importing old paths | Update test import paths to use aliases |
| Old barrel exports still used | Search for remaining imports of old structure |
| DTO vs Entity confusion | DTO = API response structure; Entity = domain model |
| Container instantiation wrong | Server: `createX()`, Client: `xClientContainer` (singleton) |
