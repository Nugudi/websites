---
description: "Adapter testing patterns, unit tests, example test suites"
globs:
  - "**/presentation/shared/adapters/**/*.test.ts"
  - "**/presentation/shared/adapters/**/*.spec.ts"
alwaysApply: false
---

# Adapter Testing Guide

> **Target Audience**: Frontend developers testing Adapter Pattern implementations
> **Prerequisites**: Read [adapter-basics.md](./adapter-basics.md) and [adapter-implementation.md](./adapter-implementation.md) first
> **Related Docs**: [../testing.md](../testing.md) for general testing patterns

## 📋 Table of Contents

1. [Testing Philosophy](#testing-philosophy)
2. [Test Structure](#test-structure)
3. [Testing Adapter Methods](#testing-adapter-methods)
4. [Testing Private Helpers](#testing-private-helpers)
5. [Testing Edge Cases](#testing-edge-cases)
6. [Complete Test Examples](#complete-test-examples)
7. [Best Practices](#best-practices)

## Testing Philosophy

### What to Test in Adapters

Adapters are **pure transformation logic** that orchestrate Entity methods to produce UI-safe types. Testing focuses on:

1. **Correct transformation**: Entity → UI Type conversions produce expected results
2. **Type-safe conversions**: Private helpers correctly map Entity values to UI types
3. **Edge case handling**: Fallbacks work correctly for invalid/unexpected data
4. **UI helper methods**: Status colors, availability checks, formatting logic
5. **Batch operations**: Array transformations work correctly

### What NOT to Test

- **Entity business logic**: Tested in Entity layer, not Adapter layer
- **UI component rendering**: Tested in component tests, not Adapter tests
- **API calls**: Adapters don't make API calls
- **UseCase logic**: Tested in UseCase layer, not Adapter layer

### Testing Benefits

1. **Catch type-safe conversion bugs**: Ensure fallbacks work
2. **Document expected behavior**: Tests serve as living documentation
3. **Prevent regressions**: Changes to Entity methods caught by Adapter tests
4. **Validate UI logic**: Color schemes, status messages, formatting rules

## Test Structure

### File Organization

```
domains/
└── benefit/
    └── presentation/
        └── shared/
            └── adapters/
                ├── benefit.adapter.ts
                └── __tests__/
                    └── benefit.adapter.test.ts
```

### Basic Test File Structure

```typescript
// File: domains/benefit/presentation/shared/adapters/__tests__/benefit.adapter.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { BenefitAdapter } from "../benefit.adapter";
import { BenefitEntity } from "@benefit/domain/entities";
import { MenuType } from "@benefit/domain/value-objects";

describe("BenefitAdapter", () => {
  describe("toUiItem", () => {
    // Conversion tests
  });

  describe("toUiList", () => {
    // Batch conversion tests
  });

  describe("getStatusColor", () => {
    // UI helper tests
  });

  describe("canPurchase", () => {
    // UI helper tests
  });
});
```

## Testing Adapter Methods

### Testing Entity → UI Transformations

Test that the main transformation method correctly orchestrates Entity methods:

```typescript
describe("BenefitAdapter", () => {
  describe("toUiItem", () => {
    it("should transform benefit entity to UI item with all fields", () => {
      // Arrange: Create test entity with known values
      const benefit = new BenefitEntity({
        id: "benefit-1",
        cafeteriaName: "본관식당",
        menuName: "김치찌개",
        menuType: MenuType.LUNCH,
        price: 5000,
        discountedPrice: 3500,
        availableFrom: new Date("2025-01-01T00:00:00Z"),
        availableUntil: new Date("2025-12-31T23:59:59Z"),
        createdAt: new Date("2025-01-01T00:00:00Z"),
      });

      // Mock current date to control time-dependent methods
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2025-06-15T12:00:00Z"));

      // Act: Transform entity to UI item
      const uiItem = BenefitAdapter.toUiItem(benefit);

      // Assert: Verify all fields transformed correctly
      expect(uiItem.id).toBe("benefit-1");
      expect(uiItem.cafeteriaName).toBe("본관식당");
      expect(uiItem.menuName).toBe("김치찌개");
      expect(uiItem.menuType).toBe("점심");
      expect(uiItem.originalPrice).toBe(5000);
      expect(uiItem.finalPrice).toBe(3500);
      expect(uiItem.discountBadge).toBe("특가"); // 30% discount
      expect(uiItem.hasDiscount).toBe(true);
      expect(uiItem.discountPercentage).toBe(30);
      expect(uiItem.isAvailable).toBe(true);
      expect(uiItem.isNew).toBe(false); // > 7 days old

      // Cleanup
      vi.useRealTimers();
    });

    it("should handle benefit with no discount", () => {
      const benefit = new BenefitEntity({
        id: "benefit-2",
        cafeteriaName: "본관식당",
        menuName: "김치찌개",
        menuType: MenuType.DINNER,
        price: 5000,
        discountedPrice: 5000, // No discount
        availableFrom: new Date("2025-01-01T00:00:00Z"),
        availableUntil: new Date("2025-12-31T23:59:59Z"),
        createdAt: new Date("2025-01-01T00:00:00Z"),
      });

      const uiItem = BenefitAdapter.toUiItem(benefit);

      expect(uiItem.menuType).toBe("저녁");
      expect(uiItem.discountBadge).toBe(null); // No discount badge
      expect(uiItem.hasDiscount).toBe(false);
      expect(uiItem.discountPercentage).toBe(0);
    });

    it("should handle newly created benefit (< 7 days)", () => {
      const now = new Date("2025-06-15T12:00:00Z");
      const threeDaysAgo = new Date("2025-06-12T12:00:00Z");

      const benefit = new BenefitEntity({
        id: "benefit-3",
        cafeteriaName: "본관식당",
        menuName: "김치찌개",
        menuType: MenuType.SNACK,
        price: 3000,
        discountedPrice: 2700, // 10% discount
        availableFrom: new Date("2025-01-01T00:00:00Z"),
        availableUntil: new Date("2025-12-31T23:59:59Z"),
        createdAt: threeDaysAgo,
      });

      vi.useFakeTimers();
      vi.setSystemTime(now);

      const uiItem = BenefitAdapter.toUiItem(benefit);

      expect(uiItem.menuType).toBe("간식");
      expect(uiItem.discountBadge).toBe("할인"); // 10-29% discount
      expect(uiItem.isNew).toBe(true); // < 7 days old
      expect(uiItem.discountPercentage).toBe(10);

      vi.useRealTimers();
    });
  });
});
```

### Testing Batch Conversions

Test that array transformations work correctly:

```typescript
describe("BenefitAdapter", () => {
  describe("toUiList", () => {
    it("should transform array of benefits to UI items", () => {
      const benefits = [
        new BenefitEntity({
          id: "benefit-1",
          cafeteriaName: "본관식당",
          menuName: "김치찌개",
          menuType: MenuType.LUNCH,
          price: 5000,
          discountedPrice: 3500,
          availableFrom: new Date("2025-01-01"),
          availableUntil: new Date("2025-12-31"),
          createdAt: new Date("2025-01-01"),
        }),
        new BenefitEntity({
          id: "benefit-2",
          cafeteriaName: "제2식당",
          menuName: "불고기",
          menuType: MenuType.DINNER,
          price: 6000,
          discountedPrice: 4800,
          availableFrom: new Date("2025-01-01"),
          availableUntil: new Date("2025-12-31"),
          createdAt: new Date("2025-01-01"),
        }),
      ];

      const uiItems = BenefitAdapter.toUiList(benefits);

      expect(uiItems).toHaveLength(2);
      expect(uiItems[0].id).toBe("benefit-1");
      expect(uiItems[0].menuType).toBe("점심");
      expect(uiItems[1].id).toBe("benefit-2");
      expect(uiItems[1].menuType).toBe("저녁");
    });

    it("should handle empty array", () => {
      const uiItems = BenefitAdapter.toUiList([]);
      expect(uiItems).toEqual([]);
    });
  });
});
```

### Testing UI Helper Methods

Test UI-specific calculations and formatting:

```typescript
describe("BenefitAdapter", () => {
  describe("getStatusColor", () => {
    it("should return gray for unavailable benefit", () => {
      const benefit = new BenefitEntity({
        id: "benefit-1",
        cafeteriaName: "본관식당",
        menuName: "김치찌개",
        menuType: MenuType.LUNCH,
        price: 5000,
        discountedPrice: 3500,
        availableFrom: new Date("2025-01-01"),
        availableUntil: new Date("2025-01-02"), // Past date
        createdAt: new Date("2025-01-01"),
      });

      vi.useFakeTimers();
      vi.setSystemTime(new Date("2025-06-15"));

      expect(BenefitAdapter.getStatusColor(benefit)).toBe("gray");

      vi.useRealTimers();
    });

    it("should return red for 30%+ discount", () => {
      const benefit = new BenefitEntity({
        id: "benefit-1",
        cafeteriaName: "본관식당",
        menuName: "김치찌개",
        menuType: MenuType.LUNCH,
        price: 5000,
        discountedPrice: 3000, // 40% discount
        availableFrom: new Date("2025-01-01"),
        availableUntil: new Date("2025-12-31"),
        createdAt: new Date("2025-01-01"),
      });

      vi.useFakeTimers();
      vi.setSystemTime(new Date("2025-06-15"));

      expect(BenefitAdapter.getStatusColor(benefit)).toBe("red");

      vi.useRealTimers();
    });

    it("should return orange for 10-29% discount", () => {
      const benefit = new BenefitEntity({
        id: "benefit-1",
        cafeteriaName: "본관식당",
        menuName: "김치찌개",
        menuType: MenuType.LUNCH,
        price: 5000,
        discountedPrice: 4000, // 20% discount
        availableFrom: new Date("2025-01-01"),
        availableUntil: new Date("2025-12-31"),
        createdAt: new Date("2025-01-01"),
      });

      vi.useFakeTimers();
      vi.setSystemTime(new Date("2025-06-15"));

      expect(BenefitAdapter.getStatusColor(benefit)).toBe("orange");

      vi.useRealTimers();
    });

    it("should return blue for no discount", () => {
      const benefit = new BenefitEntity({
        id: "benefit-1",
        cafeteriaName: "본관식당",
        menuName: "김치찌개",
        menuType: MenuType.LUNCH,
        price: 5000,
        discountedPrice: 5000, // No discount
        availableFrom: new Date("2025-01-01"),
        availableUntil: new Date("2025-12-31"),
        createdAt: new Date("2025-01-01"),
      });

      vi.useFakeTimers();
      vi.setSystemTime(new Date("2025-06-15"));

      expect(BenefitAdapter.getStatusColor(benefit)).toBe("blue");

      vi.useRealTimers();
    });
  });

  describe("canPurchase", () => {
    it("should return true for available benefit", () => {
      const benefit = new BenefitEntity({
        id: "benefit-1",
        cafeteriaName: "본관식당",
        menuName: "김치찌개",
        menuType: MenuType.LUNCH,
        price: 5000,
        discountedPrice: 3500,
        availableFrom: new Date("2025-01-01"),
        availableUntil: new Date("2025-12-31"),
        createdAt: new Date("2025-01-01"),
      });

      vi.useFakeTimers();
      vi.setSystemTime(new Date("2025-06-15"));

      expect(BenefitAdapter.canPurchase(benefit)).toBe(true);

      vi.useRealTimers();
    });

    it("should return false for unavailable benefit", () => {
      const benefit = new BenefitEntity({
        id: "benefit-1",
        cafeteriaName: "본관식당",
        menuName: "김치찌개",
        menuType: MenuType.LUNCH,
        price: 5000,
        discountedPrice: 3500,
        availableFrom: new Date("2025-01-01"),
        availableUntil: new Date("2025-01-02"), // Past date
        createdAt: new Date("2025-01-01"),
      });

      vi.useFakeTimers();
      vi.setSystemTime(new Date("2025-06-15"));

      expect(BenefitAdapter.canPurchase(benefit)).toBe(false);

      vi.useRealTimers();
    });
  });
});
```

## Testing Private Helpers

### Indirect Testing via Public Methods

Private helper functions are NOT directly testable (and should not be exported). Instead, test them **indirectly** through public methods:

```typescript
describe("BenefitAdapter", () => {
  describe("toUiItem (tests private helpers indirectly)", () => {
    it("should map lunch menu type correctly (tests getMenuTypeUi)", () => {
      const benefit = new BenefitEntity({
        // ... other fields
        menuType: MenuType.LUNCH,
      });

      const uiItem = BenefitAdapter.toUiItem(benefit);
      expect(uiItem.menuType).toBe("점심");
    });

    it("should map dinner menu type correctly (tests getMenuTypeUi)", () => {
      const benefit = new BenefitEntity({
        // ... other fields
        menuType: MenuType.DINNER,
      });

      const uiItem = BenefitAdapter.toUiItem(benefit);
      expect(uiItem.menuType).toBe("저녁");
    });

    it("should map snack menu type correctly (tests getMenuTypeUi)", () => {
      const benefit = new BenefitEntity({
        // ... other fields
        menuType: MenuType.SNACK,
      });

      const uiItem = BenefitAdapter.toUiItem(benefit);
      expect(uiItem.menuType).toBe("간식");
    });

    it("should map special sale badge correctly (tests getDiscountBadgeUi)", () => {
      const benefit = new BenefitEntity({
        // ... other fields
        price: 5000,
        discountedPrice: 3000, // 40% discount
      });

      const uiItem = BenefitAdapter.toUiItem(benefit);
      expect(uiItem.discountBadge).toBe("특가");
    });

    it("should map sale badge correctly (tests getDiscountBadgeUi)", () => {
      const benefit = new BenefitEntity({
        // ... other fields
        price: 5000,
        discountedPrice: 4000, // 20% discount
      });

      const uiItem = BenefitAdapter.toUiItem(benefit);
      expect(uiItem.discountBadge).toBe("할인");
    });

    it("should map no discount badge correctly (tests getDiscountBadgeUi)", () => {
      const benefit = new BenefitEntity({
        // ... other fields
        price: 5000,
        discountedPrice: 4600, // 8% discount
      });

      const uiItem = BenefitAdapter.toUiItem(benefit);
      expect(uiItem.discountBadge).toBe(null);
    });
  });
});
```

## Testing Edge Cases

### Testing Fallback Behavior

Test that private helpers correctly handle invalid/unexpected data:

```typescript
describe("BenefitAdapter", () => {
  describe("edge cases", () => {
    it("should handle zero price gracefully", () => {
      const benefit = new BenefitEntity({
        id: "benefit-1",
        cafeteriaName: "본관식당",
        menuName: "김치찌개",
        menuType: MenuType.LUNCH,
        price: 0, // Edge case: zero price
        discountedPrice: 0,
        availableFrom: new Date("2025-01-01"),
        availableUntil: new Date("2025-12-31"),
        createdAt: new Date("2025-01-01"),
      });

      const uiItem = BenefitAdapter.toUiItem(benefit);

      expect(uiItem.originalPrice).toBe(0);
      expect(uiItem.finalPrice).toBe(0);
      expect(uiItem.discountPercentage).toBe(0);
      expect(uiItem.hasDiscount).toBe(false);
      expect(uiItem.discountBadge).toBe(null);
    });

    it("should handle boundary discount percentage (exactly 30%)", () => {
      const benefit = new BenefitEntity({
        id: "benefit-1",
        cafeteriaName: "본관식당",
        menuName: "김치찌개",
        menuType: MenuType.LUNCH,
        price: 5000,
        discountedPrice: 3500, // Exactly 30% discount
        availableFrom: new Date("2025-01-01"),
        availableUntil: new Date("2025-12-31"),
        createdAt: new Date("2025-01-01"),
      });

      const uiItem = BenefitAdapter.toUiItem(benefit);

      expect(uiItem.discountPercentage).toBe(30);
      expect(uiItem.discountBadge).toBe("특가"); // Should be "특가" at 30%
    });

    it("should handle boundary discount percentage (exactly 10%)", () => {
      const benefit = new BenefitEntity({
        id: "benefit-1",
        cafeteriaName: "본관식당",
        menuName: "김치찌개",
        menuType: MenuType.LUNCH,
        price: 5000,
        discountedPrice: 4500, // Exactly 10% discount
        availableFrom: new Date("2025-01-01"),
        availableUntil: new Date("2025-12-31"),
        createdAt: new Date("2025-01-01"),
      });

      const uiItem = BenefitAdapter.toUiItem(benefit);

      expect(uiItem.discountPercentage).toBe(10);
      expect(uiItem.discountBadge).toBe("할인"); // Should be "할인" at 10%
    });

    it("should handle benefit created exactly 7 days ago", () => {
      const now = new Date("2025-06-15T12:00:00Z");
      const sevenDaysAgo = new Date("2025-06-08T12:00:00Z");

      const benefit = new BenefitEntity({
        id: "benefit-1",
        cafeteriaName: "본관식당",
        menuName: "김치찌개",
        menuType: MenuType.LUNCH,
        price: 5000,
        discountedPrice: 3500,
        availableFrom: new Date("2025-01-01"),
        availableUntil: new Date("2025-12-31"),
        createdAt: sevenDaysAgo,
      });

      vi.useFakeTimers();
      vi.setSystemTime(now);

      const uiItem = BenefitAdapter.toUiItem(benefit);

      expect(uiItem.isNew).toBe(true); // Should be true at exactly 7 days

      vi.useRealTimers();
    });
  });
});
```

### Testing Console Error Logging

Test that invalid data triggers console errors:

```typescript
describe("BenefitAdapter", () => {
  describe("error handling", () => {
    it("should log console error for invalid menu type (if implementation allows)", () => {
      // Note: This test requires Entity to allow invalid state,
      // which should not happen in practice with proper validation.
      // Include only if your Entity allows construction with invalid data.

      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      // Create benefit with invalid menu type (if possible)
      // ... test implementation ...

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining("Unknown menuType")
      );

      consoleErrorSpy.mockRestore();
    });
  });
});
```

## Complete Test Examples

### Complete BenefitAdapter Test Suite

```typescript
// File: domains/benefit/presentation/shared/adapters/__tests__/benefit.adapter.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { BenefitAdapter } from "../benefit.adapter";
import { BenefitEntity } from "@benefit/domain/entities";
import { MenuType } from "@benefit/domain/value-objects";

describe("BenefitAdapter", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-06-15T12:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("toUiItem", () => {
    it("should transform lunch benefit with special sale", () => {
      const benefit = new BenefitEntity({
        id: "benefit-1",
        cafeteriaName: "본관식당",
        menuName: "김치찌개",
        menuType: MenuType.LUNCH,
        price: 5000,
        discountedPrice: 3500,
        availableFrom: new Date("2025-01-01"),
        availableUntil: new Date("2025-12-31"),
        createdAt: new Date("2025-06-10"), // 5 days ago
      });

      const result = BenefitAdapter.toUiItem(benefit);

      expect(result).toEqual({
        id: "benefit-1",
        cafeteriaName: "본관식당",
        menuName: "김치찌개",
        menuType: "점심",
        originalPrice: 5000,
        finalPrice: 3500,
        discountBadge: "특가",
        hasDiscount: true,
        discountPercentage: 30,
        isAvailable: true,
        isNew: true,
      });
    });

    it("should transform dinner benefit with sale", () => {
      const benefit = new BenefitEntity({
        id: "benefit-2",
        cafeteriaName: "제2식당",
        menuName: "불고기",
        menuType: MenuType.DINNER,
        price: 6000,
        discountedPrice: 4800,
        availableFrom: new Date("2025-01-01"),
        availableUntil: new Date("2025-12-31"),
        createdAt: new Date("2025-01-01"), // Old
      });

      const result = BenefitAdapter.toUiItem(benefit);

      expect(result.menuType).toBe("저녁");
      expect(result.discountBadge).toBe("할인"); // 20% discount
      expect(result.isNew).toBe(false);
    });

    it("should transform snack benefit with no discount", () => {
      const benefit = new BenefitEntity({
        id: "benefit-3",
        cafeteriaName: "카페테리아",
        menuName: "샌드위치",
        menuType: MenuType.SNACK,
        price: 3000,
        discountedPrice: 3000,
        availableFrom: new Date("2025-01-01"),
        availableUntil: new Date("2025-12-31"),
        createdAt: new Date("2025-01-01"),
      });

      const result = BenefitAdapter.toUiItem(benefit);

      expect(result.menuType).toBe("간식");
      expect(result.discountBadge).toBe(null);
      expect(result.hasDiscount).toBe(false);
      expect(result.discountPercentage).toBe(0);
    });
  });

  describe("toUiList", () => {
    it("should transform multiple benefits", () => {
      const benefits = [
        new BenefitEntity({
          id: "benefit-1",
          cafeteriaName: "본관식당",
          menuName: "김치찌개",
          menuType: MenuType.LUNCH,
          price: 5000,
          discountedPrice: 3500,
          availableFrom: new Date("2025-01-01"),
          availableUntil: new Date("2025-12-31"),
          createdAt: new Date("2025-01-01"),
        }),
        new BenefitEntity({
          id: "benefit-2",
          cafeteriaName: "제2식당",
          menuName: "불고기",
          menuType: MenuType.DINNER,
          price: 6000,
          discountedPrice: 4800,
          availableFrom: new Date("2025-01-01"),
          availableUntil: new Date("2025-12-31"),
          createdAt: new Date("2025-01-01"),
        }),
      ];

      const result = BenefitAdapter.toUiList(benefits);

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe("benefit-1");
      expect(result[1].id).toBe("benefit-2");
    });

    it("should handle empty array", () => {
      expect(BenefitAdapter.toUiList([])).toEqual([]);
    });
  });

  describe("getStatusColor", () => {
    it("should return correct colors based on status", () => {
      const unavailable = new BenefitEntity({
        id: "1",
        cafeteriaName: "식당",
        menuName: "메뉴",
        menuType: MenuType.LUNCH,
        price: 5000,
        discountedPrice: 3500,
        availableFrom: new Date("2025-01-01"),
        availableUntil: new Date("2025-01-02"), // Past
        createdAt: new Date("2025-01-01"),
      });

      const specialSale = new BenefitEntity({
        id: "2",
        cafeteriaName: "식당",
        menuName: "메뉴",
        menuType: MenuType.LUNCH,
        price: 5000,
        discountedPrice: 3000, // 40%
        availableFrom: new Date("2025-01-01"),
        availableUntil: new Date("2025-12-31"),
        createdAt: new Date("2025-01-01"),
      });

      const sale = new BenefitEntity({
        id: "3",
        cafeteriaName: "식당",
        menuName: "메뉴",
        menuType: MenuType.LUNCH,
        price: 5000,
        discountedPrice: 4000, // 20%
        availableFrom: new Date("2025-01-01"),
        availableUntil: new Date("2025-12-31"),
        createdAt: new Date("2025-01-01"),
      });

      const noDiscount = new BenefitEntity({
        id: "4",
        cafeteriaName: "식당",
        menuName: "메뉴",
        menuType: MenuType.LUNCH,
        price: 5000,
        discountedPrice: 5000, // 0%
        availableFrom: new Date("2025-01-01"),
        availableUntil: new Date("2025-12-31"),
        createdAt: new Date("2025-01-01"),
      });

      expect(BenefitAdapter.getStatusColor(unavailable)).toBe("gray");
      expect(BenefitAdapter.getStatusColor(specialSale)).toBe("red");
      expect(BenefitAdapter.getStatusColor(sale)).toBe("orange");
      expect(BenefitAdapter.getStatusColor(noDiscount)).toBe("blue");
    });
  });

  describe("canPurchase", () => {
    it("should return true for available benefit", () => {
      const benefit = new BenefitEntity({
        id: "1",
        cafeteriaName: "식당",
        menuName: "메뉴",
        menuType: MenuType.LUNCH,
        price: 5000,
        discountedPrice: 3500,
        availableFrom: new Date("2025-01-01"),
        availableUntil: new Date("2025-12-31"),
        createdAt: new Date("2025-01-01"),
      });

      expect(BenefitAdapter.canPurchase(benefit)).toBe(true);
    });

    it("should return false for unavailable benefit", () => {
      const benefit = new BenefitEntity({
        id: "1",
        cafeteriaName: "식당",
        menuName: "메뉴",
        menuType: MenuType.LUNCH,
        price: 5000,
        discountedPrice: 3500,
        availableFrom: new Date("2025-01-01"),
        availableUntil: new Date("2025-01-02"), // Past
        createdAt: new Date("2025-01-01"),
      });

      expect(BenefitAdapter.canPurchase(benefit)).toBe(false);
    });
  });
});
```

## Best Practices

### 1. Use Fake Timers for Time-Dependent Tests

```typescript
beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2025-06-15T12:00:00Z"));
});

afterEach(() => {
  vi.useRealTimers();
});
```

### 2. Test All Boundary Conditions

```typescript
// Test boundary values (exactly 10%, exactly 30%, etc.)
it("should handle exactly 10% discount", () => {
  // ...
});

it("should handle exactly 30% discount", () => {
  // ...
});
```

### 3. Use Descriptive Test Names

```typescript
// ✅ GOOD: Clear what is being tested
it("should return 특가 badge for 30%+ discount")

// ❌ BAD: Unclear test purpose
it("should work")
```

### 4. Group Related Tests with describe()

```typescript
describe("BenefitAdapter", () => {
  describe("toUiItem", () => {
    // All toUiItem tests
  });

  describe("getStatusColor", () => {
    // All getStatusColor tests
  });
});
```

### 5. Test One Behavior Per Test

```typescript
// ✅ GOOD: Single responsibility
it("should return 특가 for 30%+ discount", () => {
  // Test only this one behavior
});

// ❌ BAD: Testing multiple behaviors
it("should handle all discount types", () => {
  // Testing 특가, 할인, and null in one test
});
```

### 6. Use Factory Functions for Test Data

```typescript
function createTestBenefit(overrides?: Partial<BenefitEntityProps>) {
  return new BenefitEntity({
    id: "test-1",
    cafeteriaName: "테스트식당",
    menuName: "테스트메뉴",
    menuType: MenuType.LUNCH,
    price: 5000,
    discountedPrice: 5000,
    availableFrom: new Date("2025-01-01"),
    availableUntil: new Date("2025-12-31"),
    createdAt: new Date("2025-01-01"),
    ...overrides,
  });
}

// Usage
const benefit = createTestBenefit({ discountedPrice: 3500 });
```

## Summary

Adapter testing ensures transformation logic is correct and handles edge cases properly:

1. **Test transformation methods**: Verify Entity → UI conversions work correctly
2. **Test UI helpers**: Validate color schemes, status logic, formatting
3. **Test edge cases**: Boundary values, zero prices, time boundaries
4. **Use indirect testing**: Test private helpers through public methods
5. **Mock time**: Use fake timers for time-dependent tests
6. **Descriptive names**: Clear test descriptions for maintainability

**Key Takeaways**:
- Adapters have pure transformation logic (easy to test)
- Focus on type-safe conversions and UI helper methods
- Test edge cases and boundary conditions thoroughly
- Use fake timers for time-dependent tests
- One behavior per test for clarity

---

**Cross-References**:
- [Adapter Basics](./adapter-basics.md) - When to use, structure overview
- [Adapter Implementation](./adapter-implementation.md) - Implementation patterns and rules
- [General Testing Guide](../testing.md) - Overall testing strategies
- [Hooks Guide](../hooks-guide.md) - Integration with Query Hooks
