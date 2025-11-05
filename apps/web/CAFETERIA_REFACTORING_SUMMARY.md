# Cafeteria Domain Clean Architecture Refactoring - Executive Summary

## Overview

Transform cafeteria domain from flat layer architecture to Clean Architecture (matching auth domain pattern).

**Status**: Ready for implementation
**Scope**: 7 staged refactoring tasks
**Effort**: 2-3 hours
**Risk**: Low (follows established auth domain pattern)

---

## What Changes & Why

### Current Problem
```
services/CafeteriaServiceImpl         ← Mixed business + data logic
repositories/CafeteriaRepositoryImpl  ← Direct HTTP calls
types/                               ← Mixed API + domain types
                                     ← No DI containers (manual wiring)
```

### After Refactoring
```
domain/usecases/GetCafeteriaUseCase          ← Pure business logic
domain/interfaces/CafeteriaRepository         ← Contract only
data/repositories/CafeteriaRepositoryImpl     ← Implements contract
data/data-sources/CafeteriaRemoteDataSource  ← API calls isolated
data/mappers/CafeteriaMapper                 ← DTO ↔ Entity conversion
data/dto/cafeteria.dto.ts                    ← API response structure
core/types/cafeteria.type.ts                 ← Domain entities
di/cafeteria-server-container.ts             ← Auto-wiring (DI)
```

**Benefits**:
- Testable business logic (mock repository easily)
- Clear separation of concerns
- Reusable outside React (core domain is framework-agnostic)
- Consistent with auth domain pattern
- Flexible dependency injection

---

## File Inventory

### What Gets Created (18 files)
```
core/
  ├── errors/index.ts             (domain exceptions)
  ├── config/index.ts             (moved from constants/)
  └── types/                       (moved from types/)

domain/
  ├── interfaces/cafeteria-repository.interface.ts
  ├── interfaces/cafeteria-review-repository.interface.ts
  ├── entities/index.ts
  └── usecases/                    (renamed from services/)

data/
  ├── dto/cafeteria.dto.ts
  ├── dto/cafeteria-review.dto.ts
  ├── mappers/cafeteria.mapper.ts
  ├── mappers/cafeteria-review.mapper.ts
  ├── data-sources/cafeteria-remote.datasource.ts
  ├── repositories/                (moved from repositories/)
  └── index.ts

di/
  ├── cafeteria-server-container.ts
  ├── cafeteria-client-container.ts
  └── index.ts
```

### What Gets Moved (7 files)
```
types/cafeteria.type.ts              → core/types/cafeteria.type.ts
types/cafeteria-review.type.ts       → core/types/cafeteria-review.type.ts
types/review-rating.ts               → core/types/review-rating.ts
constants/review.ts                  → core/config/review.ts
services/cafeteria-service.ts        → domain/usecases/get-cafeteria.usecase.ts
services/cafeteria-review-service.ts → domain/usecases/get-cafeteria-review.usecase.ts
repositories/                        → data/repositories/
```

### What Gets Deleted (3 directories)
```
services/          ← merged into domain/usecases/
types/             ← merged into core/types/
constants/         ← merged into core/config/
```

### What Stays (4 directories - unchanged)
```
ui/                ← components, sections, views (no change)
schemas/           → ui/schemas/ (optional move)
hooks/             → ui/hooks/ (optional move)
mocks/             ← keep as-is
```

---

## Implementation Timeline

| Stage | Task | Duration | Complexity |
|-------|------|----------|-----------|
| 1 | Create directory structure | 30 min | Minimal |
| 2 | Move core layer files | 30 min | Low |
| 3 | Create domain layer | 45 min | Low |
| 4 | Create data layer | 60 min | Medium |
| 5 | Create DI containers | 45 min | Medium |
| 6 | Update all imports (40-50 files) | 45 min | High (tedious) |
| 7 | Validate & test | 30 min | Medium |
| **TOTAL** | | **265 min (4.4 hrs)** | |

---

## Import Path Changes

### Add to tsconfig.json
```json
"paths": {
  "@cafeteria/core": ["./src/domains/cafeteria/core"],
  "@cafeteria/domain": ["./src/domains/cafeteria/domain"],
  "@cafeteria/data": ["./src/domains/cafeteria/data"],
  "@cafeteria/di": ["./src/domains/cafeteria/di"],
  "@cafeteria/ui": ["./src/domains/cafeteria/ui"]
}
```

### Example Import Updates
```typescript
// Before
import { CafeteriaServiceImpl } from "@/domains/cafeteria/services";
import type { GetCafeteriaResponse } from "@/domains/cafeteria/types";

// After  
import { createCafeteriaServerContainer } from "@cafeteria/di";
import type { Cafeteria } from "@cafeteria/core";
```

---

## Key Architectural Patterns

### UseCase (Business Logic)
```typescript
export class GetCafeteriaUseCase {
  constructor(private readonly repository: CafeteriaRepository) {}

  async execute(id: string): Promise<Cafeteria> {
    const dto = await this.repository.getCafeteriaById(id);
    const entity = CafeteriaMapper.toDomain(dto);
    
    if (!entity) {
      throw new CafeteriaNotFoundError();  // Business exception
    }
    
    return entity;  // Return domain entity
  }
}
```

### Repository Implementation (Data Access)
```typescript
export class CafeteriaRepositoryImpl implements CafeteriaRepository {
  constructor(private readonly dataSource: CafeteriaRemoteDataSource) {}

  async getCafeteriaById(id: string): Promise<Cafeteria> {
    const dto = await this.dataSource.getCafeteriaById(id);  // Get DTO
    return CafeteriaMapper.toDomain(dto);  // Map to entity
  }
}
```

### Server Container (DI)
```typescript
export function createCafeteriaServerContainer() {
  // Infrastructure
  const httpClient = new AuthenticatedHttpClient(...);
  
  // Data
  const dataSource = new CafeteriaRemoteDataSource(httpClient);
  const repository = new CafeteriaRepositoryImpl(dataSource);
  
  // Domain
  const useCase = new GetCafeteriaUseCase(repository);
  
  return { useCase };  // Return only what's needed
}
```

### Component Usage (Unchanged Pattern)
```typescript
// Page component (Server Component)
const container = createCafeteriaServerContainer();
const useCase = container.getCafeteriaUseCase();
const cafeteria = await useCase.execute(id);
```

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Circular imports | Low | High | Use interfaces in domain, impl in data |
| Import path errors | Medium | Medium | Use strict TypeScript checking |
| Test failures | Low | High | Update test imports with aliases |
| Missed old imports | Medium | Low | Grep search before deletion |
| DTO vs Entity confusion | Low | Medium | Clear naming & documentation |

---

## Success Criteria

- [ ] TypeScript compilation passes (`tsc --noEmit`)
- [ ] Build succeeds (`npm run build`)
- [ ] All tests pass (`npm test`)
- [ ] No unused imports or exports
- [ ] Path aliases resolve correctly in IDE
- [ ] Components use DI containers consistently
- [ ] Old directories (services/, types/, constants/) deleted
- [ ] No circular dependencies detected

---

## Reference Documents

1. **cafeteria_refactoring_plan.md** - Detailed file mapping & structure
2. **cafeteria_architecture_comparison.md** - Before/after comparison with auth domain
3. **cafeteria_implementation_steps.md** - Step-by-step code examples (7 stages)

---

## Next Steps

1. Read all three reference documents above
2. Create directory structure (Stage 1)
3. Execute stages 2-7 in order
4. Run validation checks
5. Commit with message following project conventions

---

## Questions to Answer

**Q: Do we need to rename "services" to "usecases"?**
A: Yes, clearer intent. Services do business logic; usecases represent user flows.

**Q: Do we need mappers?**
A: Yes, separates API response structure (DTO) from domain model (Entity).

**Q: Will this break existing components?**
A: No, if using DI containers. Only update import paths.

**Q: Can we do this incrementally?**
A: Yes, but it's cleaner to do all at once (2-3 hours vs. scattered work).

**Q: What about tests?**
A: Easier to test with this structure. Mock repository in tests instead of HTTP.

