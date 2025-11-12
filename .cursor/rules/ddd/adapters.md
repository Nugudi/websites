---
description: Adapter Pattern rules - Entity to UI transformation (7+ method threshold)
globs:
  - "**/adapters/**/*.adapter.ts"
  - "**/adapters/**/*.adapter.tsx"
---

# Adapter Pattern Rules

## Table of Contents

- [When to Use Adapter vs Mapper](#when-to-use-adapter-vs-mapper)
- [Adapter Structure](#adapter-structure)
- [Entity Boolean-Based Logic](#entity-boolean-based-logic)
- [Time Formatting with Day.js](#time-formatting-with-dayjs)
- [JSDoc Documentation Standards](#jsdoc-documentation-standards)
- [NEVER Rules](#never-rules)
- [Quick Reference](#quick-reference)

## When to Use Adapter vs Mapper

### Decision Rule

**Count Entity method calls needed for transformation:**

- **7+ methods** → Use Adapter Pattern ✅
- **< 7 methods** → Use Mapper Pattern (pure function) ✅

### Adapter Pattern (≥ 7 methods)

**Location**: `presentation/shared/adapters/{entity-name}.adapter.ts`
**Pattern**: Object with methods (NOT class)
**Purpose**: Centralize complex Entity → UI transformations

```typescript
// ✅ 9 Entity methods = Use Adapter
BenefitAdapter.toUiItem(benefit) calls:
// 1. benefit.getId()
// 2. benefit.getCafeteriaName()
// 3. benefit.getMenuName()
// 4. benefit.getPrice()
// 5. benefit.getFinalPrice()
// 6. benefit.hasDiscount()
// 7. benefit.getDiscountPercentage()
// 8. benefit.isAvailableNow()
// 9. benefit.isNew()
```

### Mapper Pattern (< 7 methods)

**Location**: `presentation/shared/mappers/` or `data/mappers/`
**Pattern**: Pure function
**Purpose**: Simple 1:1 transformations

```typescript
// ✅ 3 fields = Use Mapper
export function userDtoToEntity(dto: UserDto): User {
  return new UserEntity({
    id: dto.id,
    name: dto.name,
    email: dto.email,
  });
}
```

## Adapter Structure

### 1. Private Helper Functions (Above Adapter Object)

**Purpose**: Type-safe conversions, eliminate unsafe `as` assertions

**MUST Rules**:
- **MUST** be file-private (NOT exported)
- **MUST** handle validation with fallbacks
- **MUST** log errors on invalid values
- **MUST** return type-safe values (no `as` assertions)

```typescript
// ✅ CORRECT: Private helper with validation
function getMenuTypeUi(benefit: Benefit): "점심" | "저녁" | "간식" {
  const displayName = benefit.getMenuTypeDisplayName();
  if (displayName === "점심" || displayName === "저녁" || displayName === "간식") {
    return displayName;
  }
  console.error(`Invalid menuType: ${displayName} for benefit ${benefit.getId()}`);
  return "점심"; // ✅ Safe fallback
}

// ❌ WRONG: Unsafe 'as' assertion
const menuType = benefit.getMenuTypeDisplayName() as "점심" | "저녁" | "간식"; // ❌
```

### 2. Public Conversion Methods

**Purpose**: Main Entity → UI Type transformation

**Naming Pattern**: `toUi{TypeName}`, `toUi{TypeName}List`

```typescript
export const BenefitAdapter = {
  /**
   * Transform Benefit entity to UI item
   *
   * @param benefit - Domain Benefit entity
   * @returns UI-safe BenefitItem type
   */
  toUiItem(benefit: Benefit): BenefitItem {
    return {
      id: benefit.getId(),
      cafeteriaName: benefit.getCafeteriaName(),
      menuName: benefit.getMenuName(),
      menuType: getMenuTypeUi(benefit),  // ✅ Private helper
      originalPrice: benefit.getPrice(),
      finalPrice: benefit.getFinalPrice(),
      hasDiscount: benefit.hasDiscount(),
      discountPercentage: benefit.getDiscountPercentage(),
      isAvailable: benefit.isAvailableNow(),
      isNew: benefit.isNew(),
    };
  },

  /**
   * Batch conversion helper
   */
  toUiList(benefits: Benefit[]): BenefitItem[] {
    return benefits.map((benefit) => this.toUiItem(benefit));
  },
};
```

### 3. Public UI Helper Methods

**Purpose**: UI-specific calculations (colors, availability, formatting)

```typescript
export const BenefitAdapter = {
  // ... conversion methods ...

  /**
   * Get status color based on discount and availability
   *
   * @param benefit - Domain Benefit entity
   * @returns Color string ("gray" | "red" | "orange" | "blue")
   */
  getStatusColor(benefit: Benefit): string {
    if (!benefit.isAvailableNow()) return "gray";
    const discountPercentage = benefit.getDiscountPercentage();
    if (discountPercentage >= 30) return "red";
    if (discountPercentage >= 10) return "orange";
    return "blue";
  },

  /**
   * Check if benefit can be purchased
   */
  canPurchase(benefit: Benefit): boolean {
    return benefit.isAvailableNow();
  },
};
```

## Entity Boolean-Based Logic

### Core Principle

**Entities**: Boolean methods (business logic)
**Adapters**: Map booleans → UI values (Korean text, colors, formatted strings)

### ✅ CORRECT Pattern

```typescript
// Entity: Boolean methods
export class BenefitEntity implements Benefit {
  isLunchMenu(): boolean {
    return this.menuType === MenuType.LUNCH;
  }

  isDinnerMenu(): boolean {
    return this.menuType === MenuType.DINNER;
  }

  isSpecialSale(): boolean {
    return this.getDiscountPercentage() >= 30;
  }

  isSale(): boolean {
    const discount = this.getDiscountPercentage();
    return discount >= 10 && discount < 30;
  }

  hasDiscount(): boolean {
    return this.getDiscountPercentage() > 0;
  }

  isAvailableNow(): boolean {
    const now = new Date();
    return now >= this.availableFrom && now <= this.availableUntil;
  }
}

// Adapter: Maps booleans → Korean UI text
function getMenuTypeUi(benefit: Benefit): "점심" | "저녁" | "간식" {
  if (benefit.isLunchMenu()) return "점심";
  if (benefit.isDinnerMenu()) return "저녁";
  if (benefit.isSnackMenu()) return "간식";
  console.error(`Unknown menuType for benefit ${benefit.getId()}`);
  return "점심";
}

function getDiscountBadgeUi(benefit: Benefit): "특가" | "할인" | null {
  if (benefit.isSpecialSale()) return "특가";  // 30%+
  if (benefit.isSale()) return "할인";          // 10-29%
  return null;                                   // < 10%
}

export const BenefitAdapter = {
  toUiItem(benefit: Benefit): BenefitItem {
    return {
      menuType: getMenuTypeUi(benefit),         // ✅ Korean text
      discountBadge: getDiscountBadgeUi(benefit), // ✅ Korean badge
      hasDiscount: benefit.hasDiscount(),        // ✅ Boolean from Entity
      isAvailable: benefit.isAvailableNow(),     // ✅ Boolean from Entity
    };
  },
};
```

### ❌ WRONG Pattern

```typescript
// ❌ NEVER: Entity returns Korean text
export class BenefitEntity implements Benefit {
  // ❌ WRONG
  getMenuTypeDisplay(): string {
    if (this.menuType === MenuType.LUNCH) return "점심";
    return "저녁";
  }

  // ❌ WRONG
  getDiscountBadge(): string | null {
    if (this.getDiscountPercentage() >= 30) return "특가";
    return null;
  }
}
```

**Why wrong:**
- Domain layer knows UI text (violates separation)
- Hard to test (Korean language validation)
- Not reusable (no English UI support)

## Time Formatting with Day.js

### MUST Rules

- **MUST** use Day.js for all time/date formatting
- **MUST** set Korean locale globally at module level
- **MUST** use private helpers for formatting
- **MUST** format in Adapter (NOT in Entity)

### Pattern

```typescript
// File: cafeteria.adapter.ts
import dayjs from "dayjs";
import "dayjs/locale/ko";

// ✅ MUST: Set Korean locale globally
dayjs.locale("ko");

/**
 * Private helper: Formats LocalTime to "HH:mm"
 */
function formatLocalTime(time: LocalTime): string {
  const hour = String(time.hour).padStart(2, "0");
  const minute = String(time.minute).padStart(2, "0");
  return `${hour}:${minute}`;
}

/**
 * Private helper: Formats TimeRange to "HH:mm ~ HH:mm"
 */
function formatTimeRange(range: TimeRange): string {
  const start = formatLocalTime(range.start);
  const end = formatLocalTime(range.end);
  return `${start} ~ ${end}`;
}

export const CafeteriaAdapter = {
  /**
   * Get formatted business hours string
   *
   * @description
   * Uses entity boolean methods (hasLunch, hasDinner) to check availability,
   * then formats time ranges using Day.js helpers.
   *
   * @param cafeteria - Domain Cafeteria entity
   * @returns Korean business hours string
   *
   * @example
   * "점심: 11:30 ~ 14:00 / 저녁: 17:00 ~ 20:00"
   */
  getFormattedBusinessHours(cafeteria: Cafeteria): string {
    const businessHours = cafeteria.getBusinessHours();
    if (!businessHours) return "영업 시간 없음";

    const parts: string[] = [];

    // ✅ Use entity boolean + adapter formatting
    if (businessHours.hasLunch()) {
      const lunch = businessHours.getLunch();
      if (lunch) {
        parts.push(`점심: ${formatTimeRange(lunch)}`);
      }
    }

    if (businessHours.hasDinner()) {
      const dinner = businessHours.getDinner();
      if (dinner) {
        parts.push(`저녁: ${formatTimeRange(dinner)}`);
      }
    }

    return parts.join(" / ");
  },
};
```

## JSDoc Documentation Standards

### MUST Rules

- **MUST** document ALL public Adapter methods
- **MUST** include `@param` for all parameters
- **MUST** include `@returns` for return values
- **MUST** add `@description` for complex methods
- **MUST** provide `@example` for non-obvious usage

### Template

```typescript
/**
 * {Brief one-line summary}
 *
 * @description
 * {Detailed explanation of what this method does, why it exists,
 * and any important considerations. Mention if it uses Entity boolean
 * methods and how it maps them to UI values.}
 *
 * @param {Type} paramName - Description of parameter
 * @returns {ReturnType} Description of return value
 *
 * @example
 * // Example usage
 * const color = BenefitAdapter.getStatusColor(benefit);
 * // Returns "red" for 30%+ discount
 */
```

## NEVER Rules

- **NEVER** export private helper functions
  - ❌ `export function getMenuTypeUi()`
  - ✅ `function getMenuTypeUi()` (file-private)

- **NEVER** use unsafe `as` assertions in transformations
  - ❌ `benefit.getMenuType() as "점심"`
  - ✅ Use private helper with validation

- **NEVER** put Korean text in Entity methods
  - ❌ `entity.getDisplayName(): string` returning Korean
  - ✅ `entity.isLunchMenu(): boolean` + adapter maps to Korean

- **NEVER** format time/date in Entity
  - ❌ `entity.getFormattedTime(): string`
  - ✅ `entity.getTime(): LocalTime` + adapter formats

- **NEVER** skip JSDoc on public Adapter methods
  - All public methods MUST have documentation

- **NEVER** use Adapter when < 7 Entity methods
  - Use simple mapper function instead

**Why These NEVER Rules Exist:**

1. **Why NEVER export private helper functions?**
   - **Encapsulation**: Helper functions are implementation details, not public API
   - **Prevents Misuse**: External code shouldn't bypass Adapter's main methods
   - **Refactoring Freedom**: Can change/remove helpers without breaking external code
   - **Clear API Surface**: Only export methods are the public Adapter interface
   - **Testing**: Test public Adapter methods, not internal helpers

2. **Why NEVER use unsafe 'as' assertions?**
   - **Runtime Safety**: `as` bypasses type checking, can cause runtime errors
   - **TypeScript Lies**: `as` tells TypeScript "trust me" without validation
   - **Production Crashes**: Invalid value cast to type = Uncaught error
   - **Use Private Helpers**: Helpers validate and provide safe fallbacks
   - **Debugging**: Validation errors logged with context, easier to debug

3. **Why NEVER put Korean text in Entity methods?**
   - **Domain Purity**: Domain layer should be language-agnostic
   - **Separation of Concerns**: Presentation concerns (Korean text) don't belong in Domain
   - **Reusability**: Entity with Korean text can't be reused in English UI
   - **Testability**: Testing Korean strings in Domain = Brittle tests
   - **Maintainability**: UI text changes shouldn't require Domain layer changes
   - **Use Boolean Methods**: `isLunchMenu()` in Entity, Adapter maps to "점심"

4. **Why NEVER format time/date in Entity?**
   - **Domain Purity**: Formatting is presentation concern, not business logic
   - **Testability**: Testing formatted strings = Fragile tests
   - **Reusability**: Different UIs need different formats (mobile vs desktop)
   - **Localization**: Formatting varies by locale (12h vs 24h, date order)
   - **Separation**: Entity returns raw `LocalTime`, Adapter formats with Day.js
   - **Multiple Formats**: Same entity can be formatted differently in different contexts

5. **Why NEVER skip JSDoc on public Adapter methods?**
   - **Developer Experience**: IDE shows JSDoc hints during autocomplete
   - **Maintainability**: New developers understand method purpose without reading code
   - **Usage Examples**: `@example` shows how to use complex methods
   - **Parameter Clarity**: `@param` explains what each parameter means
   - **Return Type Clarity**: `@returns` explains what the return value represents
   - **Contract Documentation**: JSDoc is the method's public contract

6. **Why NEVER use Adapter when < 7 Entity methods?**
   - **Over-Engineering**: Adapter pattern adds complexity without benefit
   - **Simpler Alternatives**: Pure function mapper is faster to read and write
   - **Performance**: Adapter object creation overhead for simple transformations
   - **Cognitive Load**: Unnecessary abstraction makes code harder to follow
   - **Threshold Rationale**: 7+ methods = Complex enough to justify Adapter pattern
   - **KISS Principle**: Keep it simple - use mapper for simple transformations

## Quick Reference

| Scenario | Pattern | Location |
|----------|---------|----------|
| 7+ Entity methods | Adapter | `presentation/shared/adapters/` |
| < 7 methods | Mapper | `presentation/shared/mappers/` |
| Type-safe conversion | Private helper | Above Adapter object |
| UI text mapping | Private helper | Maps Entity boolean → Korean |
| Time formatting | Day.js helper | Private function in Adapter |
| UI calculations | Public method | In Adapter object |

---

**Related**: See `patterns/hooks-guide.md` for Adapter usage in Query Hooks
