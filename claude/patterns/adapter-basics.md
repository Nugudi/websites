---
description: "Adapter Pattern basics, when to use vs Mappers, decision criteria, 7+ method threshold"
globs:
  - "**/presentation/shared/adapters/**/*.ts"
alwaysApply: true
---

# Adapter Pattern Basics

> **Target Audience**: Frontend developers working with Entity → UI transformations
> **Prerequisites**: Read [../core/architecture.md](../core/architecture.md) and [../ddd-guide.md](../ddd-guide.md) first
> **Related Docs**: [hooks-guide.md](hooks-guide.md) for usage in Query Hooks

## 📋 Table of Contents

1. [What is the Adapter Pattern?](#what-is-the-adapter-pattern)
2. [When to Use Adapters vs Mappers](#when-to-use-adapters-vs-mappers)
3. [Adapter Structure](#adapter-structure)
4. [Quick Rules Reference](#quick-rules-reference)
5. [Next Steps](#next-steps)

## What is the Adapter Pattern?

The **Adapter Pattern** transforms Domain Entities to Presentation-layer types (UI Types) when the transformation requires orchestrating **7+ Entity methods**. It centralizes complex transformations, eliminates unsafe `as` assertions, and provides type-safe conversions.

### Problem It Solves

Without Adapters, you end up with scattered, unsafe transformations:

```typescript
// ❌ WRONG: Scattered transformation logic with unsafe 'as' assertions
const BenefitCard = ({ benefit }: { benefit: Benefit }) => {
  const menuType = benefit.getMenuTypeDisplayName() as "점심" | "저녁" | "간식"; // Unsafe!
  const badge = benefit.getDiscountBadge() as "특가" | "할인" | null; // Unsafe!

  const item = {
    id: benefit.getId(),
    cafeteriaName: benefit.getCafeteriaName(),
    menuName: benefit.getMenuName(),
    menuType,
    originalPrice: benefit.getPrice(),
    finalPrice: benefit.getFinalPrice(),
    discountBadge: badge,
    hasDiscount: benefit.hasDiscount(),
    discountPercentage: benefit.getDiscountPercentage(),
    isAvailable: benefit.isAvailableNow(),
    isNew: benefit.isNew(),
  };

  return <Card {...item} />;
};
```

With Adapter, transformations are centralized and type-safe:

```typescript
// ✅ CORRECT: Adapter centralizes transformation
const BenefitCard = ({ benefit }: { benefit: Benefit }) => {
  const item = BenefitAdapter.toUiItem(benefit); // Type-safe!
  return <Card {...item} />;
};
```

## When to Use Adapters vs Mappers

### Decision Flowchart

```
Does the Entity → UI Type transformation require 7+ Entity method calls?
  YES → Use Adapter Pattern
     Location: presentation/shared/adapters/[entity-name].adapter.ts
     Pattern: Object with methods (public + private helpers)
     Benefits: Type-safe, centralized, reusable, testable

  NO → Use Mapper Pattern
      Location: presentation/shared/mappers/ or data/mappers/
      Pattern: Pure function transformation
      Benefits: Simple, straightforward, minimal overhead
```

### Detailed Criteria

#### Use Adapter (`presentation/shared/adapters/`) When:

1. **Entity → UI Type transformation requires orchestrating 7+ Entity methods**
   ```typescript
   // Example: BenefitAdapter.toUiItem() calls:
   // 1. benefit.getId()
   // 2. benefit.getCafeteriaName()
   // 3. benefit.getMenuName()
   // 4. benefit.getPrice()
   // 5. benefit.getFinalPrice()
   // 6. benefit.hasDiscount()
   // 7. benefit.getDiscountPercentage()
   // 8. benefit.isAvailableNow()
   // 9. benefit.isNew()
   // → 9 methods = Use Adapter ✅
   ```

2. **Need type-safe conversions** to eliminate unsafe `as` assertions
   ```typescript
   // Instead of:
   const menuType = benefit.getMenuTypeDisplayName() as "점심" | "저녁" | "간식"; // ❌

   // Use private helper in Adapter:
   function getMenuTypeUi(benefit: Benefit): "점심" | "저녁" | "간식" {
     // Type-safe validation
   }
   ```

3. **Require UI-specific helper methods** (color calculation, availability checks, formatting)
   ```typescript
   // BenefitAdapter provides UI helpers:
   BenefitAdapter.getStatusColor(benefit);   // Color based on status
   BenefitAdapter.canPurchase(benefit);      // Purchase availability
   BenefitAdapter.getPriceDisplay(benefit);  // Formatted price strings
   ```

4. **Complex business logic** needs to be centralized for better testability

#### Use Mapper (`presentation/shared/mappers/` or `data/mappers/`) When:

1. **Simple 1:1 field transformations** (DTO → Entity, Entity → UI Type)
   ```typescript
   // Example: Simple DTO → Entity mapping (< 7 operations)
   export function userDtoToEntity(dto: UserDto): User {
     return new UserEntity({
       id: dto.id,
       name: dto.name,
       email: dto.email,
     });
   }
   ```

2. **Pure function transformations** without complex orchestration
3. **Minimal business logic** involved
4. **Fewer than 7 Entity method calls** required

### Threshold Rationale

**Why 7+ methods?**
- **< 7 methods**: Transformation is simple enough for inline or mapper function
- **≥ 7 methods**: Complexity warrants centralized Adapter pattern
- **Testability**: Complex transformations benefit from dedicated test suite
- **Reusability**: Multiple components benefit from shared Adapter

## Adapter Structure

Adapters are **objects with methods** (NOT classes) organized into:

### 1. Private Helper Functions (Type-Safe Conversions)

Located **above** the Adapter object, these functions:
- Eliminate unsafe `as` assertions
- Provide type-safe conversions with validation
- Handle edge cases with console errors and fallbacks
- Should NOT be exported (file-private only)

```typescript
// ✅ CORRECT: Private helper for type-safe conversion
function getMenuTypeUi(benefit: Benefit): "점심" | "저녁" | "간식" {
  const displayName = benefit.getMenuTypeDisplayName();
  if (displayName === "점심" || displayName === "저녁" || displayName === "간식") {
    return displayName;
  }
  console.error(`Invalid menuType displayName: ${displayName} for benefit ${benefit.getId()}`);
  return "점심"; // Safe fallback
}
```

### 2. Public Conversion Methods (Entity → UI Type)

Main transformation methods that orchestrate Entity methods:

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
      menuType: getMenuTypeUi(benefit),  // Private helper
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

### 3. Public UI Helper Methods (UI-Specific Logic)

Provide UI-specific calculations and formatting:

```typescript
export const BenefitAdapter = {
  // ... conversion methods ...

  /**
   * Get status color based on discount and availability
   *
   * @param benefit - Domain Benefit entity
   * @returns Color string for UI theming ("gray" | "red" | "orange" | "blue")
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

## Quick Rules Reference

### ✅ Key Requirements

1. Use Adapter when transformation requires **7+ Entity method calls**
2. Place Adapters in `presentation/shared/adapters/`
3. Use private helper functions for type-safe conversions
4. Export Adapter as **object** (NOT class)
5. Provide comprehensive JSDoc for ALL methods
6. Use Entity's boolean methods for state checks
7. Handle edge cases with console errors and safe fallbacks

### ❌ Common Mistakes

1. Using Adapter for transformations requiring < 7 Entity methods (use Mapper instead)
2. Putting Korean text or formatting in Entity layer
3. Using unsafe `as` assertions
4. Exporting private helper functions
5. Skipping JSDoc documentation
6. Creating Adapter as a class
7. Using Adapter in Domain or Data layers

## Next Steps

For detailed implementation guidance:
- **Implementation Guide**: [adapter-implementation.md](./adapter-implementation.md) - Entity boolean logic, time formatting, status messages, JSDoc standards, complete rules
- **Testing Guide**: [adapter-testing.md](./adapter-testing.md) - Testing patterns and examples

For usage in application code:
- **Query Hooks**: [./hooks-guide.md](./hooks-guide.md) - Using Adapters in Query Hooks
- **Entity Design**: [../ddd-guide.md](../ddd-guide.md) - Entity design patterns for boolean methods

---

**Cross-References**:
- [Adapter Implementation Guide](./adapter-implementation.md) - Detailed patterns and rules
- [Adapter Testing Guide](./adapter-testing.md) - Testing strategies
- [Hooks Guide](./hooks-guide.md) - Using Adapters in Query Hooks
- [DDD Guide](../ddd-guide.md) - Entity design patterns
