---
description: "Entity design patterns, boolean-based business logic, encapsulation rules"
globs:
  - "src/domains/**/domain/entities/**/*.ts"
alwaysApply: true
---

# Entity Design Patterns

> **Related Documents**: [usecase-patterns.md](./usecase-patterns.md), [domain-errors.md](./domain-errors.md)

## Overview

Entities are the heart of your domain model. They represent core business concepts with identity and behavior. This guide establishes **CRITICAL** rules for entity design that ensure domain purity and UI-agnostic business logic.

## Core Principles

### Boolean-Based Business Logic

**🚨 CRITICAL ARCHITECTURAL RULE**

Entities MUST contain ONLY business logic that returns boolean or primitive values. **NO UI formatting, NO Korean text, NO display logic.**

This separation ensures:
- Domain layer remains UI-agnostic
- Entities are reusable across different UIs (web, mobile, CLI)
- Business logic is testable without UI dependencies
- Adapters handle ALL UI concerns (Korean text, colors, formatted strings)

### Entity Pattern

```typescript
// ✅ CORRECT: Entity with behavior, not just data
export interface User {
  getUserId(): string;
  getEmail(): string;
  getNickname(): string;
  isActive(): boolean;
  isEmailVerified(): boolean;
}

export class UserEntity implements User {
  constructor(
    private readonly userId: string,
    private readonly email: string,
    private readonly nickname: string,
    private readonly status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED',
    private readonly emailVerified: boolean
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.email.includes('@')) {
      throw new UserError('Invalid email format', 'INVALID_EMAIL');
    }
  }

  getUserId(): string {
    return this.userId;
  }

  getEmail(): string {
    return this.email;
  }

  getNickname(): string {
    return this.nickname;
  }

  isActive(): boolean {
    return this.status === 'ACTIVE';
  }

  isEmailVerified(): boolean {
    return this.emailVerified;
  }

  // Business logic methods
  canAccessPremiumFeatures(): boolean {
    return this.isActive() && this.isEmailVerified();
  }
}
```

## Correct Entity Patterns

### ✅ CORRECT: Boolean Business Logic Only

```typescript
export class Benefit {
  private readonly _menuType: MenuType;
  private readonly _discountPercentage: number;

  /**
   * Business Logic: Check if this is a lunch menu
   * @returns boolean indicating lunch menu
   */
  isLunchMenu(): boolean {
    return this._menuType === MENU_TYPE.LUNCH;
  }

  /**
   * Business Logic: Check if this is a dinner menu
   * @returns boolean indicating dinner menu
   */
  isDinnerMenu(): boolean {
    return this._menuType === MENU_TYPE.DINNER;
  }

  /**
   * Business Logic: Check if this is a snack menu
   * @returns boolean indicating snack menu
   */
  isSnackMenu(): boolean {
    return this._menuType === MENU_TYPE.SNACK;
  }

  /**
   * Business Logic: Check if discount is 30% or more
   * @returns boolean indicating special sale status
   */
  isSpecialSale(): boolean {
    const discountPercentage = this.getDiscountPercentage();
    return discountPercentage >= DISCOUNT_VALIDATION.SPECIAL_SALE_THRESHOLD;
  }

  /**
   * Business Logic: Check if discount is between 10-29%
   * @returns boolean indicating sale status
   */
  isSale(): boolean {
    const discountPercentage = this.getDiscountPercentage();
    return discountPercentage >= DISCOUNT_VALIDATION.SALE_THRESHOLD;
  }

  /**
   * Business Logic: Get discount percentage (primitive value)
   * @returns number representing discount percentage (0-100)
   */
  getDiscountPercentage(): number {
    if (!this.hasDiscount() || !this._discountedPrice) {
      return 0;
    }
    return Math.round(
      ((this._price - this._discountedPrice) / this._price) * 100
    );
  }
}
```

### ❌ WRONG: UI Logic in Entity (DO NOT USE)

```typescript
export class Benefit {
  // ❌ WRONG: Entity should NOT contain Korean text
  getMenuTypeDisplayName(): string {
    return MENU_TYPE_DISPLAY_NAMES[this._menuType]; // Returns "점심", "저녁"
  }

  // ❌ WRONG: Entity should NOT contain UI-specific badge logic
  getDiscountBadge(): '특가' | '할인' | null {
    if (this.getDiscountPercentage() >= 30) {
      return '특가'; // Korean text
    }
    if (this.getDiscountPercentage() >= 10) {
      return '할인'; // Korean text
    }
    return null;
  }

  // ❌ WRONG: Entity should NOT format status messages
  getStatusMessage(): string {
    if (this._isUsed) {
      return '사용 완료'; // Korean text with formatting
    }
    if (this.isExpired()) {
      return '기간 만료';
    }
    return '사용 가능';
  }

  // ❌ WRONG: Entity should NOT format time strings
  getFormattedBusinessHours(): string {
    return `점심: ${this.formatTime(lunch)} / 저녁: ${this.formatTime(dinner)}`;
  }
}
```

## Validation Pattern

**CRITICAL RULE**: Entity validation MUST be in a private `validate()` method called from constructor. DO NOT validate inline in constructor.

### ✅ CORRECT Validation Pattern

```typescript
export class SessionEntity implements Session {
  private readonly _accessToken: string;
  private readonly _refreshToken: string;
  private readonly _userId: string;
  private readonly _expiresAt: Date;

  constructor(params: {
    accessToken: string;
    refreshToken: string;
    userId: string;
    expiresAt: Date;
  }) {
    // 1. Assign properties first
    this._accessToken = params.accessToken;
    this._refreshToken = params.refreshToken;
    this._userId = params.userId;
    this._expiresAt = params.expiresAt;

    // 2. Then validate
    this.validate();
  }

  private validate(): void {
    if (!this._accessToken) {
      throw new AuthError(
        'Access token is required',
        AUTH_ERROR_CODES.INVALID_TOKEN
      );
    }
    if (!this._refreshToken) {
      throw new AuthError(
        'Refresh token is required',
        AUTH_ERROR_CODES.INVALID_TOKEN
      );
    }
    if (!this._userId) {
      throw new AuthError(
        'User ID is required',
        AUTH_ERROR_CODES.INVALID_USER_DATA
      );
    }
    if (!(this._expiresAt instanceof Date)) {
      throw new AuthError(
        'Expires at must be a Date',
        AUTH_ERROR_CODES.INVALID_TOKEN
      );
    }
  }

  // Business logic methods...
  isExpired(): boolean {
    return new Date() >= this._expiresAt;
  }

  willExpireSoon(thresholdMinutes: number = 5): boolean {
    if (this.isExpired()) {
      return true;
    }
    const threshold = new Date();
    threshold.setMinutes(threshold.getMinutes() + thresholdMinutes);
    return this._expiresAt <= threshold;
  }
}
```

### ❌ WRONG Validation Pattern (DO NOT USE)

```typescript
export class SessionEntity implements Session {
  constructor(params: {
    accessToken: string;
    refreshToken: string;
    userId: string;
    expiresAt: Date;
  }) {
    // ❌ WRONG: Inline validation before assignment
    if (!params.accessToken) {
      throw new AuthError(
        'Access token is required',
        AUTH_ERROR_CODES.INVALID_TOKEN
      );
    }
    if (!params.refreshToken) {
      throw new AuthError(
        'Refresh token is required',
        AUTH_ERROR_CODES.INVALID_TOKEN
      );
    }

    // Then assignment
    this._accessToken = params.accessToken;
    this._refreshToken = params.refreshToken;
    // ...
  }
}
```

## Real-World Examples

### Example 1: Benefit Entity

```typescript
export class Benefit {
  // ✅ Boolean business logic only
  isLunchMenu(): boolean {
    return this._menuType === MENU_TYPE.LUNCH;
  }

  isDinnerMenu(): boolean {
    return this._menuType === MENU_TYPE.DINNER;
  }

  isSnackMenu(): boolean {
    return this._menuType === MENU_TYPE.SNACK;
  }

  isSpecialSale(): boolean {
    return this.getDiscountPercentage() >= 30;
  }

  isSale(): boolean {
    return this.getDiscountPercentage() >= 10;
  }
}
```

### Example 2: Cafeteria Entity

```typescript
export class BusinessHours {
  // ✅ Boolean methods only
  hasLunch(): boolean {
    return this._lunch !== null;
  }

  hasDinner(): boolean {
    return this._dinner !== null;
  }

  // ✅ Return primitive TimeRange, not formatted string
  getLunch(): TimeRange | null {
    return this._lunch;
  }

  getDinner(): TimeRange | null {
    return this._dinner;
  }
}
```

### Example 3: Stamp Entity

```typescript
export class Stamp {
  // ✅ Boolean business logic
  isExpired(): boolean {
    if (!this._expiresAt) return false;
    return new Date() > new Date(this._expiresAt);
  }

  canBeUsed(): boolean {
    return !this._isUsed && !this.isExpired();
  }

  isExpiringSoon(): boolean {
    return this.getDaysUntilExpiry() <= 7;
  }

  // ✅ Return primitive number
  getDaysUntilExpiry(): number {
    if (!this._expiresAt) return Infinity;
    const expiryDate = new Date(this._expiresAt);
    const now = new Date();
    const diffInMs = expiryDate.getTime() - now.getTime();
    return Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  }
}
```

## When to Create Entity vs When to Use DTO

**Create Entity Class when:**

- ✅ Business rules need to be enforced (validation, state transitions)
- ✅ Domain methods are needed (calculations, derivations, checks)
- ✅ Encapsulation is required (hide implementation details)
- ✅ Multiple related behaviors exist (>3 methods beyond getters)
- ✅ Entity represents a core domain concept with identity

**Use DTO only when:**

- ✅ Simple data transfer from/to API (no business logic)
- ✅ Data structure is pure read-only (display purposes)
- ✅ No validation or business rules apply
- ✅ Data is ephemeral (not a domain concept)

**Decision Tree:**

```
Does this data have business rules or domain methods?
├─ YES → Create Entity Class (domain/entities/*.entity.ts)
│   └─ Examples: User (canAccessPremium), Stamp (isExpired), Benefit (hasDiscount)
│
└─ NO → Use DTO only (data/remote/dto/response/*-types.ts)
    └─ Examples: API response shapes, simple lists, metadata
```

**Key Principle**: If you find yourself writing `if` statements with business logic in components or hooks, that logic should be in an Entity method instead.

## Golden Rules

**Remember:** Entities answer "What is the state?" (boolean/primitives), Adapters answer "How should we display it?" (Korean text, colors, formatted strings).

1. **Entities = Boolean + Primitives ONLY**
   - NO Korean text
   - NO formatting
   - NO UI logic

2. **Validation = Private Method**
   - Constructor: assign → validate
   - Keep validation logic separate

3. **Business Logic Methods**
   - Return booleans or primitive types
   - NO UI concerns
   - Use domain constants for thresholds

4. **Encapsulation**
   - Private fields with underscore prefix
   - Public getter/boolean methods
   - Hide implementation details

## Summary

Entities are the foundation of your domain model. By keeping them pure and free of UI concerns, you ensure:
- Testable business logic
- Reusable across platforms
- Clear separation of concerns
- Maintainable codebase

For UI transformations of entity data, see the Adapter patterns in [frontend.md](../frontend.md).
