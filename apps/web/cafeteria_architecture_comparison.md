# Cafeteria vs Auth Domain Architecture Comparison

## Architecture Alignment

### Current Cafeteria (Flat Layer)
```
src/domains/cafeteria/
├── types/                    # Mixed API + domain types
├── constants/                # Constants mixed with config
├── services/                 # ServiceImpl (mixed concerns)
├── repositories/             # RepositoryImpl + Interface
├── schemas/                  # Zod schemas
├── hooks/                    # React hooks
├── ui/                       # Components
├── mocks/                    # Test data
├── features/                 # UI-specific types
└── utils/                    # Utilities
```

**Problems:**
- Services have mixed business logic + data access logic
- No clear separation between core types and data types
- DI containers don't exist - manual instantiation
- Hard to test due to tight coupling
- Hard to reuse business logic outside React

---

### Target: Auth Domain (Clean Architecture)
```
src/domains/auth/
├── core/                     # Core domain knowledge
│   ├── config/              # Domain configuration
│   ├── errors/              # Domain exceptions
│   └── types/               # Immutable core types
├── domain/                   # Business rules
│   ├── entities/            # Domain entities
│   ├── interfaces/          # Repository contracts
│   └── usecases/            # Business logic (thin)
├── data/                     # Implementation details
│   ├── dto/                 # API data transfer objects
│   ├── mappers/             # DTO ↔ Entity transformation
│   ├── data-sources/        # API adapter
│   ├── repositories/        # Repository implementation
│   └── utils/               # Data utilities
├── di/                       # Dependency injection
│   ├── auth-server-container.ts
│   ├── auth-client-container.ts
│   └── auth-container.ts
└── ui/                       # UI layer (unchanged)
    ├── components/
    ├── sections/
    ├── views/
    └── ...
```

**Benefits:**
- Clear layer separation and responsibility
- Business logic can run independently
- Easy to test with mock repositories
- Flexible dependency injection
- Framework-agnostic core logic

---

## Layer Responsibility Mapping

| Aspect | Cafeteria Current | Cafeteria Target | Auth Reference |
|--------|------------------|------------------|-----------------|
| **Core Types** | types/ (mixed) | core/types/ | core/types/ |
| **Business Logic** | services/CafeteriaServiceImpl | domain/usecases/CafeteriaUseCase | domain/usecases/ |
| **Repository Interface** | repositories/ | domain/interfaces/ | domain/interfaces/ |
| **Repository Impl** | repositories/ | data/repositories/ | data/repositories/ |
| **DTOs** | types/ (mixed) | data/dto/ | data/dto/ |
| **Type Mapping** | None (direct use) | data/mappers/ | data/mappers/ |
| **API Calls** | Repository | data-sources/ | data-sources/ |
| **DI Container** | None | di/cafeteria-*-container | di/auth-*-container |

---

## Key Differences (Before → After)

### 1. Service to UseCase
```typescript
// Before: CafeteriaService (mixed concerns)
export class CafeteriaServiceImpl implements CafeteriaService {
  constructor(private readonly repository: CafeteriaRepository) {}
  
  async getCafeteriaById(id: string) {
    // Business logic mixed with data access
    const response = await this.repository.getCafeteriaById(id);
    if (!response || !response.cafeteria) {
      throw new Error("Cafeteria not found");  // Business rule
    }
    return response;  // Returns DTO directly
  }
}

// After: CafeteriaUseCase (single responsibility)
export class GetCafeteriaUseCase {
  constructor(private readonly repository: CafeteriaRepository) {}
  
  async execute(id: string): Promise<Cafeteria> {
    const dto = await this.repository.getCafeteriaById(id);
    const entity = CafeteriaMapper.toDomain(dto);  // DTO → Entity
    
    if (!entity) {
      throw new CafeteriaNotFoundError();  // Domain exception
    }
    
    return entity;  // Returns domain entity
  }
}
```

### 2. DI Container Pattern
```typescript
// Before: Manual instantiation
const httpClient = new HttpClient(...);
const repository = new CafeteriaRepositoryImpl(httpClient);
const service = new CafeteriaServiceImpl(repository);

// After: Container handles it
const container = createCafeteriaServerContainer();
const useCase = container.getCafeteriaUseCase();
```

### 3. Repository Split
```typescript
// Before: Single repository with API calls
export class CafeteriaRepositoryImpl implements CafeteriaRepository {
  async getCafeteriaById(id: string) {
    const response = await this.httpClient.get(...);  // API call
    return response.data.data;  // Returns DTO
  }
}

// After: Repository + DataSource
// Repository (domain/interfaces/)
export interface CafeteriaRepository {
  getCafeteriaById(id: string): Promise<Cafeteria>;
}

// Repository Implementation (data/repositories/)
export class CafeteriaRepositoryImpl implements CafeteriaRepository {
  async getCafeteriaById(id: string): Promise<Cafeteria> {
    const dto = await this.dataSource.getCafeteriaById(id);
    return CafeteriaMapper.toDomain(dto);  // Maps DTO → Entity
  }
}

// DataSource (data/data-sources/)
export class CafeteriaRemoteDataSource {
  async getCafeteriaById(id: string): Promise<CafeteriaDTO> {
    return this.httpClient.get(...);  // Raw API call
  }
}
```

---

## Type Flow

### Before (Mixed Types)
```
API Response (GetCafeteriaResponse)
         ↓
Repository returns GetCafeteriaResponse
         ↓
Service returns GetCafeteriaResponse
         ↓
Component uses GetCafeteriaResponse
```

### After (Separated DTOs & Entities)
```
API Response (CafeteriaDTO)
         ↓
DataSource returns CafeteriaDTO
         ↓
Mapper: CafeteriaDTO → Cafeteria (Entity)
         ↓
Repository returns Cafeteria
         ↓
UseCase returns Cafeteria
         ↓
Component uses Cafeteria
```

---

## Migration Impact on Components

### Before
```typescript
// Page component
const container = createCafeteriaServerContainer();
const service = container.getCafeteriaService();
const data = await service.getCafeteriaById(id);  // GetCafeteriaResponse type
```

### After
```typescript
// Page component (Same usage pattern!)
const container = createCafeteriaServerContainer();
const useCase = container.getCafeteriaUseCase();
const data = await useCase.execute(id);  // Cafeteria entity type
```

**Key Point:** Container-based injection stays the same; internal structure changes to be more testable.
