# Cafeteria Domain Clean Architecture Refactoring Plan

## Current State Analysis

**Current Structure:** Flat layer organization
- `types/` (OpenAPI types)
- `constants/` (UI constants)
- `services/` (Business logic)
- `repositories/` (Data access)
- `schemas/`, `hooks/`, `utils/`, `ui/`, `mocks/`, `features/`

**Target:** Auth domain's Clean Architecture pattern (Already exists and working)

---

## Refactoring Strategy

### Phase 1: Create Directory Structure
```
src/domains/cafeteria/
├── core/                    # NEW - Core layer
│   ├── config/             # Configuration constants
│   ├── errors/             # Domain exceptions
│   └── types/              # Core domain types (from types/)
├── domain/                 # NEW - Domain layer
│   ├── entities/           # Domain entities
│   ├── interfaces/         # Repository interfaces
│   └── usecases/           # Business logic (from services/)
├── data/                   # NEW - Data layer
│   ├── dto/                # Data Transfer Objects (from types/)
│   ├── mappers/            # Entity ↔ DTO mappers
│   ├── data-sources/       # API adapters
│   ├── repositories/       # Repository implementations
│   └── utils/              # Data utilities
├── di/                     # NEW - Dependency Injection
│   ├── cafeteria-server-container.ts
│   ├── cafeteria-client-container.ts
│   └── cafeteria-container.ts
├── ui/                     # KEEP AS-IS
│   ├── components/
│   ├── sections/
│   ├── views/
│   ├── constants/          # UI-specific constants
│   ├── types/              # UI-specific types (from features/)
│   ├── schemas/            # Zod schemas (validation)
│   └── stores/             # Zustand stores
└── index.ts                # Main barrel export
```

---

## File Mapping (Move/Create/Delete)

### Move to Core Layer
```
types/cafeteria.type.ts          → core/types/cafeteria.type.ts
types/cafeteria-review.type.ts   → core/types/cafeteria-review.type.ts
types/review-rating.ts           → core/types/review-rating.ts
constants/                       → core/config/ (review constants)
```

### Move to Domain Layer (UseCases)
```
services/cafeteria-service.ts        → domain/usecases/cafeteria-usecase.ts
services/cafeteria-review-service.ts → domain/usecases/cafeteria-review-usecase.ts

Create domain/interfaces/
- cafeteria-repository.interface.ts (from repositories/cafeteria-repository.ts interface)
- cafeteria-review-repository.interface.ts
```

### Move to Data Layer
```
repositories/cafeteria-repository.ts      → data/repositories/cafeteria-repository.ts
repositories/cafeteria-repository.stub.ts → tests/ (or delete)
repositories/cafeteria-review-repository.ts  → data/repositories/cafeteria-review-repository.ts

Create data/data-sources/
- cafeteria-remote-data-source.ts

Create data/mappers/
- cafeteria-mapper.ts (DTO ↔ Entity)
- cafeteria-review-mapper.ts

Create data/dto/
- cafeteria.dto.ts
- cafeteria-review.dto.ts
- cafeteria-menu.dto.ts
```

### Keep in UI Layer (No Move)
```
ui/                    → UNCHANGED
schemas/               → ui/schemas/
hooks/                 → ui/hooks/
features/              → ui/types/ (rename from features/)
mocks/                 → ui/mocks/ (move or keep external)
```

### Create DI Containers
```
di/cafeteria-server-container.ts
di/cafeteria-client-container.ts
di/cafeteria-container.ts
di/index.ts
```

---

## Import Path Updates

### Add TypeScript Path Aliases (if not exists)
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

### Update Imports in Components
```typescript
// Before
import { CafeteriaService } from "@/domains/cafeteria/services"

// After
import { CafeteriaUseCase } from "@cafeteria/domain"
import { createCafeteriaServerContainer } from "@cafeteria/di"
```

---

## Key Changes by Layer

| Layer | Responsibility | Files |
|-------|-----------------|-------|
| **Core** | Constants, types, errors | config/, types/, errors/ |
| **Domain** | UseCases, Repository interfaces | usecases/, interfaces/ |
| **Data** | Repository impl, mappers, DTOs | repositories/, mappers/, dto/, data-sources/ |
| **DI** | Container factories | cafeteria-server/client-container.ts |
| **UI** | React components, hooks, schemas | components/, sections/, views/, hooks/, schemas/ |

---

## Implementation Order

1. **Create directory structure** → Create all new folders
2. **Move types** → types/ → core/types/
3. **Create DTOs** → data/dto/ (based on OpenAPI types)
4. **Create mappers** → data/mappers/
5. **Rename services to usecases** → domain/usecases/
6. **Extract repository interfaces** → domain/interfaces/
7. **Move repository implementations** → data/repositories/
8. **Create DI containers** → di/
9. **Update all imports** → Use path aliases
10. **Update barrel exports** → core/index.ts, domain/index.ts, etc.

---

## Breaking Changes & Migrations

### Service Injection Pattern
```typescript
// Before (old services/)
const service = new CafeteriaServiceImpl(repository);

// After (new DI containers)
const container = createCafeteriaServerContainer();
const useCase = container.getCafeteriaUseCase();
```

### Type Imports
```typescript
// Before
import type { Cafeteria } from "@/domains/cafeteria/types"

// After
import type { Cafeteria } from "@cafeteria/core"
```

---

## Estimated Impact

- **Files to move:** 15-20
- **Files to create:** 12-15
- **Import updates required:** 40-50 files in UI/pages layers
- **Time estimate:** 2-3 hours (structured refactoring)

---

## Validation Checklist

- [ ] All tests pass
- [ ] No circular imports
- [ ] DI containers properly instantiate all usecases
- [ ] Type safety maintained
- [ ] Path aliases resolve correctly
- [ ] Stale services/ directory can be deleted
