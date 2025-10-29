# Cafeteria Mock Data

This directory contains mock data generators and fixtures for the Cafeteria domain.

## Purpose

Mock data serves two main purposes:

1. **Stub Repository Support** - Provides data for `*.stub.ts` repository implementations when `NEXT_PUBLIC_USE_MOCK=true`
2. **UI Development** - Enables frontend development and prototyping without backend dependency

## Files

- `index.ts` - Main export file
- `cafeteria-mock-data.ts` - Mock cafeteria and menu data generators
- `menu-mock-data.ts` - Additional menu-specific mock data
- `review-mock-data.ts` - Mock review and comment data

## Usage

### In Stub Repositories

```typescript
// cafeteria-repository.stub.ts
import { getMockCafeteriaData } from "../mocks";

class CafeteriaRepositoryStub implements CafeteriaRepository {
  async getCafeteria(id: string) {
    const mockData = getMockCafeteriaData();
    return { data: mockData, error: null };
  }
}
```

### In Components (for development/testing)

```typescript
// Only for temporary development - should use Services in production
import { getMockMenuData } from "@/domains/cafeteria/mocks";

const mockMenu = getMockMenuData();
```

## Temporary Types

⚠️ **Important**: This directory contains **temporary UI-compatibility types**:

```typescript
/**
 * 임시 타입: UI에서 사용하는 확장된 식당 정보
 * TODO: API 구조 변경 시 제거 예정
 */
type CafeteriaWithMenus = GetCafeteriaResponse & {
  // Additional fields for UI compatibility
};
```

These types bridge the gap between current API responses and UI requirements. They will be removed once:
- Backend API is updated to match UI needs, OR
- An Adapter layer is created to transform API responses

## Best Practices

### DO ✅
- Use mock data through Stub repositories (via DI Container)
- Update mock data when API responses change
- Document temporary types with TODO comments
- Keep mock data realistic and representative

### DON'T ❌
- Import mock data directly in production code
- Commit `NEXT_PUBLIC_USE_MOCK=true` to git
- Use mock data instead of proper testing fixtures
- Leave outdated mock data after API changes

## Relationship with Stub Repositories

```
Mock Data Generators
        ↓
    Stub Repositories (*.stub.ts)
        ↓
    DI Container (NEXT_PUBLIC_USE_MOCK=true)
        ↓
    Services & UI Components
```

Mock data is the **source of truth** for Stub repositories, ensuring consistent mock behavior across the application.

## TODO

- [ ] Complete mock implementations for all repository methods
- [ ] Add JSDoc comments to mock generators
- [ ] Create more realistic mock data based on actual API responses
- [ ] Remove temporary UI compatibility types once backend is updated
