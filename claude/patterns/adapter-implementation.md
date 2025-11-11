---
description: "Adapter implementation guide, Entity boolean logic, time formatting, status messages, JSDoc standards"
globs:
  - "**/presentation/shared/adapters/**/*.ts"
alwaysApply: true
---

# Adapter Implementation Guide

> **Target Audience**: Frontend developers implementing Adapter Pattern
> **Prerequisites**: Read [adapter-basics.md](./adapter-basics.md) first
> **Related Docs**: [adapter-testing.md](./adapter-testing.md) for testing patterns

## 📋 Table of Contents

1. [Entity Boolean-Based Logic](#entity-boolean-based-logic)
2. [Time Formatting with Day.js](#time-formatting-with-dayjs)
3. [Status Message Formatting](#status-message-formatting)
4. [JSDoc Documentation Standards](#jsdoc-documentation-standards)
5. [MUST / MUST NOT Rules](#must--must-not-rules)
6. [Real-World Examples](#real-world-examples)

## Entity Boolean-Based Logic

### Core Principle

**Entities** contain business logic as **boolean methods**. **Adapters** use these booleans to map to UI-specific values (Korean text, colors, formatted strings).

### ✅ CORRECT Pattern

#### Entity: Boolean Methods

```typescript
export class BenefitEntity implements Benefit {
  // ✅ CORRECT: Boolean methods for business logic
  isLunchMenu(): boolean {
    return this.menuType === MenuType.LUNCH;
  }

  isDinnerMenu(): boolean {
    return this.menuType === MenuType.DINNER;
  }

  isSnackMenu(): boolean {
    return this.menuType === MenuType.SNACK;
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

  isNew(): boolean {
    const daysSinceLaunch = this._getDaysSince(this.createdAt);
    return daysSinceLaunch <= 7;
  }

  // ✅ CORRECT: Primitive getters
  getDiscountPercentage(): number {
    if (this.price === 0) return 0;
    return ((this.price - this.discountedPrice) / this.price) * 100;
  }

  getFinalPrice(): number {
    return this.discountedPrice ?? this.price;
  }
}
```

#### Adapter: Maps Booleans to UI Values

```typescript
/**
 * Private helper: Maps menu type boolean checks to Korean UI text
 */
function getMenuTypeUi(benefit: Benefit): "점심" | "저녁" | "간식" {
  if (benefit.isLunchMenu()) return "점심";
  if (benefit.isDinnerMenu()) return "저녁";
  if (benefit.isSnackMenu()) return "간식";

  console.error(`Unknown menuType for benefit ${benefit.getId()}`);
  return "점심"; // Fallback
}

/**
 * Private helper: Maps discount boolean checks to Korean badge text
 */
function getDiscountBadgeUi(benefit: Benefit): "특가" | "할인" | null {
  if (benefit.isSpecialSale()) return "특가";  // 30%+
  if (benefit.isSale()) return "할인";          // 10-29%
  return null;                                   // < 10%
}

export const BenefitAdapter = {
  toUiItem(benefit: Benefit): BenefitItem {
    return {
      id: benefit.getId(),
      menuType: getMenuTypeUi(benefit),         // ✅ Korean text
      discountBadge: getDiscountBadgeUi(benefit), // ✅ Korean badge
      hasDiscount: benefit.hasDiscount(),        // ✅ Boolean from Entity
      isAvailable: benefit.isAvailableNow(),     // ✅ Boolean from Entity
      isNew: benefit.isNew(),                    // ✅ Boolean from Entity
      // ... other fields
    };
  },
};
```

### ❌ WRONG Pattern

#### Entity: String/Korean Getters (NEVER DO THIS)

```typescript
export class BenefitEntity implements Benefit {
  // ❌ WRONG: Entity should NOT return Korean text
  getMenuTypeDisplay(): string {
    if (this.menuType === MenuType.LUNCH) return "점심";
    if (this.menuType === MenuType.DINNER) return "저녁";
    return "간식";
  }

  // ❌ WRONG: Entity should NOT return Korean badge
  getDiscountBadge(): string | null {
    if (this.getDiscountPercentage() >= 30) return "특가";
    if (this.getDiscountPercentage() >= 10) return "할인";
    return null;
  }

  // ❌ WRONG: Entity should NOT return formatted strings
  getStatusMessage(): string {
    if (this.isAvailableNow()) return "구매 가능";
    return "구매 불가";
  }
}
```

**Why this is wrong:**
- Violates separation of concerns (Domain layer knows about UI text)
- Hard to test (requires Korean language validation)
- Not reusable (what if English UI needed?)
- Difficult to maintain (text changes require Entity changes)

## Time Formatting with Day.js

### Core Principle

**MUST** use Day.js for all time/date formatting in Adapters. Set Korean locale globally at module level.

### ✅ CORRECT Pattern

```typescript
// File: domains/cafeteria/presentation/shared/adapters/cafeteria.adapter.ts
import dayjs from "dayjs";
import "dayjs/locale/ko";

// Set Korean locale globally for this module
dayjs.locale("ko");

/**
 * Private helper: Formats LocalTime to "HH:mm" string
 */
function formatLocalTime(time: LocalTime): string {
  const hour = String(time.hour).padStart(2, "0");
  const minute = String(time.minute).padStart(2, "0");
  return `${hour}:${minute}`;
}

/**
 * Private helper: Formats TimeRange to "HH:mm ~ HH:mm" string
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
   * Formats BusinessHours entity to Korean UI text.
   * Uses boolean methods from entity (hasLunch, hasDinner) to determine availability,
   * then formats time ranges using Day.js helper functions.
   *
   * @param cafeteria - Domain Cafeteria entity
   * @returns Formatted Korean business hours string
   *
   * @example
   * // With lunch and dinner
   * "점심: 11:30 ~ 14:00 / 저녁: 17:00 ~ 20:00"
   *
   * @example
   * // With note
   * "점심: 11:30 ~ 14:00 / 저녁: 17:00 ~ 20:00 (주말 휴무)"
   */
  getFormattedBusinessHours(cafeteria: Cafeteria): string {
    const businessHours = cafeteria.getBusinessHours();

    if (!businessHours) {
      return "영업 시간 없음";
    }

    const parts: string[] = [];

    // ✅ Use entity's boolean method to check availability
    if (businessHours.hasLunch()) {
      const lunch = businessHours.getLunch();
      if (lunch) {
        parts.push(`점심: ${formatTimeRange(lunch)}`);  // ✅ Format in adapter
      }
    }

    if (businessHours.hasDinner()) {
      const dinner = businessHours.getDinner();
      if (dinner) {
        parts.push(`저녁: ${formatTimeRange(dinner)}`);  // ✅ Format in adapter
      }
    }

    if (parts.length === 0) {
      return "영업 시간 없음";
    }

    const hoursText = parts.join(" / ");
    const note = businessHours.getNote();

    return note ? `${hoursText} (${note})` : hoursText;
  },
};
```

### Relative Time Formatting

```typescript
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ko";

dayjs.extend(relativeTime);
dayjs.locale("ko");

export const StampAdapter = {
  /**
   * Get human-readable time since stamp creation
   *
   * @param stamp - Domain stamp entity
   * @returns Korean relative time string (e.g., "3시간 전", "2일 전")
   */
  getCreatedTimeAgo(stamp: Stamp): string {
    return dayjs(stamp.getCreatedAt()).fromNow();
  },
};
```

## Status Message Formatting

### Core Principle

Use Entity's **boolean methods** to determine state, then map to Korean status messages in Adapter.

### ✅ CORRECT Pattern

```typescript
export const StampAdapter = {
  /**
   * Get status message text in Korean
   *
   * @description
   * Uses Entity's boolean methods (getIsUsed, isExpired, isExpiringSoon)
   * and getDaysUntilExpiry() to determine stamp status and returns
   * appropriate Korean status message.
   *
   * Status priority:
   * 1. Used → "사용 완료"
   * 2. Expired → "기간 만료"
   * 3. Expiring soon → "X일 후 만료"
   * 4. Valid → "사용 가능"
   *
   * @param stamp - Domain stamp entity
   * @returns Korean status message
   */
  getStatusMessage(stamp: Stamp): string {
    // ✅ Use entity's boolean methods to determine state
    if (stamp.getIsUsed()) {
      return "사용 완료";
    }
    if (stamp.isExpired()) {
      return "기간 만료";
    }
    if (stamp.isExpiringSoon()) {
      const days = stamp.getDaysUntilExpiry();  // ✅ Get primitive value
      return `${days}일 후 만료`;  // ✅ Format in adapter
    }
    return "사용 가능";
  },

  /**
   * Get status color based on stamp status
   *
   * @param stamp - Domain stamp entity
   * @returns Color string for UI theming
   */
  getStatusColor(stamp: Stamp): "gray" | "red" | "orange" | "green" {
    if (stamp.getIsUsed()) return "gray";
    if (stamp.isExpired()) return "red";
    if (stamp.isExpiringSoon()) return "orange";
    return "green";
  },
};
```

### ❌ WRONG Pattern

```typescript
// ❌ WRONG: Entity should NOT format status messages
export class StampEntity implements Stamp {
  getStatusMessage(): string {
    if (this.isUsed) return "사용 완료";
    if (this.isExpired()) return "기간 만료";
    if (this.isExpiringSoon()) return `${this.getDaysUntilExpiry()}일 후 만료`;
    return "사용 가능";
  }
}
```

## JSDoc Documentation Standards

### Core Principle

**ALL Adapter methods MUST have comprehensive JSDoc** with summary, description, params, returns, and examples.

### Required JSDoc Structure

1. **Summary**: One-line description of what the method does
2. **@description**: Detailed explanation of behavior, rules, edge cases
3. **@param**: Document each parameter with type and description
4. **@returns**: Document return value with type and description
5. **@example** (optional but recommended): Show usage examples

### ✅ CORRECT JSDoc Pattern

```typescript
/**
 * Transform Benefit entity to UI item
 *
 * @description
 * Converts domain Benefit entity to presentation-layer BenefitItem type.
 * Orchestrates 9 Entity methods to create a complete UI representation.
 * Uses private helpers for type-safe conversions (menuType, discountBadge).
 *
 * Entity methods used:
 * - getId(): string
 * - getCafeteriaName(): string
 * - getMenuName(): string
 * - getPrice(): number
 * - getFinalPrice(): number
 * - hasDiscount(): boolean
 * - getDiscountPercentage(): number
 * - isAvailableNow(): boolean
 * - isNew(): boolean
 *
 * @param benefit - Domain Benefit entity with business logic
 * @returns UI-safe BenefitItem type with Korean text and formatted values
 *
 * @example
 * const benefit: Benefit = // ... from UseCase
 * const uiItem = BenefitAdapter.toUiItem(benefit);
 * // uiItem.menuType: "점심" | "저녁" | "간식"
 * // uiItem.discountBadge: "특가" | "할인" | null
 */
toUiItem(benefit: Benefit): BenefitItem {
  return {
    id: benefit.getId(),
    cafeteriaName: benefit.getCafeteriaName(),
    menuName: benefit.getMenuName(),
    menuType: getMenuTypeUi(benefit),
    originalPrice: benefit.getPrice(),
    finalPrice: benefit.getFinalPrice(),
    discountBadge: getDiscountBadgeUi(benefit),
    hasDiscount: benefit.hasDiscount(),
    discountPercentage: benefit.getDiscountPercentage(),
    isAvailable: benefit.isAvailableNow(),
    isNew: benefit.isNew(),
  };
}
```

### Why Comprehensive JSDoc?

1. **Methods contain UI business logic** that may not be obvious from code
2. **Rules and mappings** (e.g., discount thresholds, color schemes) should be documented
3. **Helps maintainers** understand behavior without reading implementation
4. **IntelliSense support** in IDEs for better developer experience
5. **Self-documenting code** reduces need for separate documentation

## MUST / MUST NOT Rules

### ✅ MUST

1. **MUST** use Adapter when Entity → UI transformation requires **7+ Entity method calls**
   ```typescript
   // ✅ CORRECT: 9 Entity methods = Use Adapter
   BenefitAdapter.toUiItem(benefit);
   ```

2. **MUST** place Adapters in `presentation/shared/adapters/`
   ```
   ✅ domains/benefit/presentation/shared/adapters/benefit.adapter.ts
   ```

3. **MUST** use private helper functions for type-safe conversions
   ```typescript
   // ✅ CORRECT: Private helper eliminates unsafe 'as'
   function getMenuTypeUi(benefit: Benefit): "점심" | "저녁" | "간식" {
     // Validation logic with safe fallback
   }
   ```

4. **MUST** use Entity's boolean methods to determine state
   ```typescript
   // ✅ CORRECT: Use boolean methods
   if (benefit.isSpecialSale()) return "특가";
   if (benefit.isSale()) return "할인";
   ```

5. **MUST** use Day.js for all time/date formatting
   ```typescript
   // ✅ CORRECT: Day.js with Korean locale
   import dayjs from "dayjs";
   import "dayjs/locale/ko";
   dayjs.locale("ko");
   ```

6. **MUST** set Korean locale globally at module level
   ```typescript
   // ✅ CORRECT: Global at top of file
   dayjs.locale("ko");
   ```

7. **MUST** provide comprehensive JSDoc for ALL Adapter methods
   ```typescript
   // ✅ CORRECT: Complete JSDoc with @description, @param, @returns
   /**
    * Transform Benefit entity to UI item
    *
    * @description ...
    * @param benefit - Domain Benefit entity
    * @returns UI-safe BenefitItem type
    */
   ```

8. **MUST** handle edge cases with console errors and safe fallbacks
   ```typescript
   // ✅ CORRECT: Error logging + fallback
   if (!isValid) {
     console.error(`Invalid value for ${id}`);
     return defaultValue; // Safe fallback
   }
   ```

9. **MUST** export Adapter as object (NOT class)
   ```typescript
   // ✅ CORRECT: Object with methods
   export const BenefitAdapter = {
     toUiItem(benefit: Benefit): BenefitItem { /* ... */ },
   };
   ```

10. **MUST** provide batch conversion helper methods
    ```typescript
    // ✅ CORRECT: toUiList for array transformations
    toUiList(benefits: Benefit[]): BenefitItem[] {
      return benefits.map((benefit) => this.toUiItem(benefit));
    }
    ```

### ❌ MUST NOT

1. **MUST NOT** use Adapter for transformations requiring < 7 Entity methods
   ```typescript
   // ❌ WRONG: Only 3 methods, use Mapper instead
   function userToUi(user: User) {
     return {
       id: user.getId(),
       name: user.getName(),
       email: user.getEmail(),
     };
   }
   ```

2. **MUST NOT** put Korean text or formatting in Entity layer
   ```typescript
   // ❌ WRONG: Entity returning Korean text
   class BenefitEntity {
     getMenuTypeDisplay(): string {
       return "점심"; // ❌ Korean text in Entity!
     }
   }

   // ✅ CORRECT: Boolean method in Entity
   class BenefitEntity {
     isLunchMenu(): boolean {
       return this.menuType === MenuType.LUNCH;
     }
   }
   ```

3. **MUST NOT** use unsafe `as` assertions
   ```typescript
   // ❌ WRONG: Unsafe type assertion
   const menuType = benefit.getMenuTypeDisplayName() as "점심" | "저녁" | "간식";

   // ✅ CORRECT: Type-safe private helper
   function getMenuTypeUi(benefit: Benefit): "점심" | "저녁" | "간식" {
     // Validation with fallback
   }
   ```

4. **MUST NOT** export private helper functions
   ```typescript
   // ❌ WRONG: Exporting private helper
   export function getMenuTypeUi(benefit: Benefit) { /* ... */ }

   // ✅ CORRECT: File-private function (no export)
   function getMenuTypeUi(benefit: Benefit) { /* ... */ }
   ```

5. **MUST NOT** skip JSDoc documentation
   ```typescript
   // ❌ WRONG: No JSDoc
   toUiItem(benefit: Benefit): BenefitItem { /* ... */ }

   // ✅ CORRECT: Comprehensive JSDoc
   /**
    * Transform Benefit entity to UI item
    * @description ...
    * @param benefit - ...
    * @returns ...
    */
   toUiItem(benefit: Benefit): BenefitItem { /* ... */ }
   ```

6. **MUST NOT** format time/date without Day.js
   ```typescript
   // ❌ WRONG: Manual formatting
   const formatted = `${hour}:${minute}`;

   // ✅ CORRECT: Day.js formatting
   const formatted = dayjs(time).format("HH:mm");
   ```

7. **MUST NOT** use Adapter in Domain or Data layers
   ```typescript
   // ❌ WRONG: Adapter used in UseCase (Domain layer)
   class GetBenefitsUseCase {
     async execute() {
       const benefits = await this.repository.getAll();
       return BenefitAdapter.toUiList(benefits); // ❌ WRONG!
     }
   }

   // ✅ CORRECT: UseCase returns Entity, Adapter used in Presentation
   class GetBenefitsUseCase {
     async execute() {
       return await this.repository.getAll(); // Returns Entity[]
     }
   }
   ```

8. **MUST NOT** create Adapter as a class
   ```typescript
   // ❌ WRONG: Adapter as class
   export class BenefitAdapter {
     toUiItem(benefit: Benefit): BenefitItem { /* ... */ }
   }

   // ✅ CORRECT: Adapter as object
   export const BenefitAdapter = {
     toUiItem(benefit: Benefit): BenefitItem { /* ... */ },
   };
   ```

## Real-World Examples

### Example 1: BenefitAdapter (Complete)

```typescript
// File: domains/benefit/presentation/shared/adapters/benefit.adapter.ts
import type { Benefit, BenefitList } from "@benefit/domain/entities";
import type { BenefitItem } from "../types/benefit";

/**
 * Private helper: Maps menu type boolean checks to Korean UI text
 *
 * @description
 * Uses Entity's boolean methods (isLunchMenu, isDinnerMenu, isSnackMenu)
 * to determine meal type and returns appropriate Korean label.
 *
 * @param benefit - Domain Benefit entity
 * @returns Korean menu type label
 */
function getMenuTypeUi(benefit: Benefit): "점심" | "저녁" | "간식" {
  if (benefit.isLunchMenu()) return "점심";
  if (benefit.isDinnerMenu()) return "저녁";
  if (benefit.isSnackMenu()) return "간식";

  // Fallback - should never happen with proper data
  console.error(`Unknown menuType for benefit ${benefit.getId()}`);
  return "점심";
}

/**
 * Private helper: Maps discount boolean checks to Korean badge text
 *
 * @description
 * Uses Entity's boolean methods (isSpecialSale, isSale) to determine
 * discount level and returns appropriate Korean badge label.
 * - isSpecialSale (30%+) → "특가"
 * - isSale (10-29%) → "할인"
 * - < 10% → null
 *
 * @param benefit - Domain Benefit entity
 * @returns Korean discount badge or null
 */
function getDiscountBadgeUi(benefit: Benefit): "특가" | "할인" | null {
  if (benefit.isSpecialSale()) return "특가";
  if (benefit.isSale()) return "할인";
  return null;
}

export const BenefitAdapter = {
  /**
   * Transform Benefit entity to UI item
   *
   * @description
   * Converts domain Benefit entity to presentation-layer BenefitItem type.
   * Orchestrates 9 Entity methods to create complete UI representation.
   * Uses private helpers for type-safe conversions.
   *
   * @param benefit - Domain Benefit entity
   * @returns UI-safe BenefitItem type
   */
  toUiItem(benefit: Benefit): BenefitItem {
    return {
      id: benefit.getId(),
      cafeteriaName: benefit.getCafeteriaName(),
      menuName: benefit.getMenuName(),
      menuType: getMenuTypeUi(benefit),
      originalPrice: benefit.getPrice(),
      finalPrice: benefit.getFinalPrice(),
      discountBadge: getDiscountBadgeUi(benefit),
      hasDiscount: benefit.hasDiscount(),
      discountPercentage: benefit.getDiscountPercentage(),
      isAvailable: benefit.isAvailableNow(),
      isNew: benefit.isNew(),
    };
  },

  /**
   * Batch conversion helper
   *
   * @param benefits - Array of domain Benefit entities
   * @returns Array of UI-safe BenefitItem types
   */
  toUiList(benefits: Benefit[]): BenefitItem[] {
    return benefits.map((benefit) => this.toUiItem(benefit));
  },

  /**
   * List wrapper conversion
   *
   * @param list - Domain BenefitList entity
   * @returns UI-safe benefit list with items and count
   */
  benefitListToUi(list: BenefitList) {
    return {
      benefits: this.toUiList(list.benefits),
      totalCount: list.totalCount,
    };
  },

  /**
   * Get status color based on discount and availability
   *
   * @description
   * Determines UI color based on benefit status:
   * - Unavailable → gray
   * - 30%+ discount → red (special sale)
   * - 10-29% discount → orange (sale)
   * - No discount → blue
   *
   * @param benefit - Domain Benefit entity
   * @returns Color string for UI theming
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
   *
   * @param benefit - Domain Benefit entity
   * @returns True if benefit is available for purchase
   */
  canPurchase(benefit: Benefit): boolean {
    return benefit.isAvailableNow();
  },
};
```

### Example 2: StampAdapter (with Day.js)

```typescript
// File: domains/stamp/presentation/shared/adapters/stamp.adapter.ts
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ko";
import type { Stamp } from "@stamp/domain/entities";
import type { StampItem } from "../types/stamp";

dayjs.extend(relativeTime);
dayjs.locale("ko");

export const StampAdapter = {
  /**
   * Transform Stamp entity to UI item
   */
  toUiItem(stamp: Stamp): StampItem {
    return {
      id: stamp.getId(),
      isUsed: stamp.getIsUsed(),
      usedAt: stamp.getUsedAt(),
      expiresAt: stamp.getExpiresAt(),
      statusMessage: this.getStatusMessage(stamp),
      statusColor: this.getStatusColor(stamp),
    };
  },

  /**
   * Get status message in Korean
   *
   * @description
   * Status priority: used → expired → expiring soon → valid
   */
  getStatusMessage(stamp: Stamp): string {
    if (stamp.getIsUsed()) return "사용 완료";
    if (stamp.isExpired()) return "기간 만료";
    if (stamp.isExpiringSoon()) {
      const days = stamp.getDaysUntilExpiry();
      return `${days}일 후 만료`;
    }
    return "사용 가능";
  },

  /**
   * Get status color
   */
  getStatusColor(stamp: Stamp): "gray" | "red" | "orange" | "green" {
    if (stamp.getIsUsed()) return "gray";
    if (stamp.isExpired()) return "red";
    if (stamp.isExpiringSoon()) return "orange";
    return "green";
  },

  /**
   * Get relative time since creation
   */
  getCreatedTimeAgo(stamp: Stamp): string {
    return dayjs(stamp.getCreatedAt()).fromNow();
  },
};
```

## Summary

This guide covers the complete implementation patterns for Adapters:

1. **Entity Boolean Logic**: Entities provide booleans, Adapters map to UI values
2. **Time Formatting**: Always use Day.js with Korean locale at module level
3. **Status Messages**: Use Entity booleans to determine state, format in Adapter
4. **JSDoc Standards**: Comprehensive documentation for all methods
5. **Complete Rules**: All MUST and MUST NOT patterns
6. **Real Examples**: Production-ready code samples

**Key Takeaways**:
- Entities contain business logic (booleans, primitives)
- Adapters contain UI logic (Korean text, colors, formatting)
- Day.js handles all time/date formatting
- JSDoc makes code self-documenting
- Never use Adapters outside Presentation layer

---

**Cross-References**:
- [Adapter Basics](./adapter-basics.md) - When to use, structure overview
- [Adapter Testing Guide](./adapter-testing.md) - Testing strategies
- [Hooks Guide](../hooks-guide.md) - Using Adapters in Query Hooks
- [DDD Guide](../ddd-guide.md) - Entity design patterns
