---
description: "DTO patterns, Entity-DTO mapping, data transformation"
globs:
  - "src/domains/**/data/remote/dto/**/*.ts"
  - "src/domains/**/data/mapper/**/*.ts"
alwaysApply: true
---

# DTO and Mapper Patterns

> **Related Documents**: [entity-patterns.md](./entity-patterns.md), [repository-patterns.md](./repository-patterns.md)

## Overview

DTOs (Data Transfer Objects) are simple data structures for transferring data between layers. Mappers transform DTOs to/from Domain Entities. This separation keeps the domain layer free of infrastructure concerns.

## DTO Patterns

### Response DTO (Simple Interface)

```typescript
// ✅ CORRECT: Simple DTO interface
// data/remote/dto/response/user-types.ts
export interface UserDto {
  id: string;
  email: string;
  nickname: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### Request DTO

```typescript
// ✅ CORRECT: Request DTO
// data/remote/dto/request/user-request.dto.ts
export interface CreateUserRequest {
  email: string;
  nickname: string;
  password: string;
}

export interface UpdateUserRequest {
  email?: string;
  nickname?: string;
}
```

### Nested DTOs

```typescript
// ✅ CORRECT: Nested DTO structures
export interface BenefitDto {
  id: string;
  cafeteriaId: string;
  cafeteriaName: string;
  menuName: string;
  menuType: 'LUNCH' | 'DINNER' | 'SNACK';
  price: number;
  discountedPrice: number | null;
  businessHours: BusinessHoursDto | null;
  isNew: boolean;
}

export interface BusinessHoursDto {
  lunch: TimeRangeDto | null;
  dinner: TimeRangeDto | null;
  note: string | null;
}

export interface TimeRangeDto {
  start: LocalTimeDto;
  end: LocalTimeDto;
}

export interface LocalTimeDto {
  hour: number;
  minute: number;
}
```

## Mapper Patterns

### Basic Mapper

```typescript
// ✅ CORRECT: Bidirectional mapper
// data/mapper/user.mapper.ts
export class UserMapper {
  /**
   * Convert DTO to Domain Entity
   */
  static toDomain(dto: UserDto): User {
    return new UserEntity(
      dto.id,
      dto.email,
      dto.nickname,
      dto.status,
      dto.emailVerified
    );
  }

  /**
   * Convert Domain Entity to DTO
   */
  static toDto(entity: User): UserDto {
    return {
      id: entity.getUserId(),
      email: entity.getEmail(),
      nickname: entity.getNickname(),
      status: entity.isActive() ? 'ACTIVE' : 'INACTIVE',
      emailVerified: entity.isEmailVerified(),
      createdAt: new Date().toISOString(), // Set by backend
      updatedAt: new Date().toISOString(), // Set by backend
    };
  }
}
```

### Mapper with Nested Entities

```typescript
// ✅ CORRECT: Mapper for nested structures
export class BenefitMapper {
  static toDomain(dto: BenefitDto): Benefit {
    const businessHours = dto.businessHours
      ? this.mapBusinessHours(dto.businessHours)
      : null;

    return new Benefit({
      id: dto.id,
      cafeteriaId: dto.cafeteriaId,
      cafeteriaName: dto.cafeteriaName,
      menuName: dto.menuName,
      menuType: dto.menuType,
      price: dto.price,
      discountedPrice: dto.discountedPrice,
      businessHours,
      isNew: dto.isNew,
    });
  }

  static toDto(entity: Benefit): BenefitDto {
    const businessHours = entity.getBusinessHours();
    const businessHoursDto = businessHours
      ? this.mapBusinessHoursToDto(businessHours)
      : null;

    return {
      id: entity.getId(),
      cafeteriaId: entity.getCafeteriaId(),
      cafeteriaName: entity.getCafeteriaName(),
      menuName: entity.getMenuName(),
      menuType: entity.getMenuType(),
      price: entity.getPrice(),
      discountedPrice: entity.getDiscountedPrice(),
      businessHours: businessHoursDto,
      isNew: entity.isNew(),
    };
  }

  private static mapBusinessHours(dto: BusinessHoursDto): BusinessHours {
    const lunch = dto.lunch ? this.mapTimeRange(dto.lunch) : null;
    const dinner = dto.dinner ? this.mapTimeRange(dto.dinner) : null;

    return new BusinessHours(lunch, dinner, dto.note);
  }

  private static mapBusinessHoursToDto(
    businessHours: BusinessHours
  ): BusinessHoursDto {
    const lunch = businessHours.getLunch();
    const dinner = businessHours.getDinner();

    return {
      lunch: lunch ? this.mapTimeRangeToDto(lunch) : null,
      dinner: dinner ? this.mapTimeRangeToDto(dinner) : null,
      note: businessHours.getNote(),
    };
  }

  private static mapTimeRange(dto: TimeRangeDto): TimeRange {
    const start = new LocalTime(dto.start.hour, dto.start.minute);
    const end = new LocalTime(dto.end.hour, dto.end.minute);
    return new TimeRange(start, end);
  }

  private static mapTimeRangeToDto(timeRange: TimeRange): TimeRangeDto {
    const start = timeRange.getStart();
    const end = timeRange.getEnd();

    return {
      start: { hour: start.getHour(), minute: start.getMinute() },
      end: { hour: end.getHour(), minute: end.getMinute() },
    };
  }
}
```

### Collection Mapping

```typescript
// ✅ CORRECT: Map collections
export class StampMapper {
  static toDomain(dto: StampDto): Stamp {
    return new Stamp({
      id: dto.id,
      userId: dto.userId,
      cafeteriaId: dto.cafeteriaId,
      isUsed: dto.isUsed,
      usedAt: dto.usedAt ? new Date(dto.usedAt) : null,
      expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
      createdAt: new Date(dto.createdAt),
    });
  }

  static toDomainList(dtos: StampDto[]): Stamp[] {
    return dtos.map(dto => this.toDomain(dto));
  }

  static toDto(entity: Stamp): StampDto {
    return {
      id: entity.getId(),
      userId: entity.getUserId(),
      cafeteriaId: entity.getCafeteriaId(),
      isUsed: entity.getIsUsed(),
      usedAt: entity.getUsedAt()?.toISOString() ?? null,
      expiresAt: entity.getExpiresAt()?.toISOString() ?? null,
      createdAt: entity.getCreatedAt().toISOString(),
    };
  }

  static toDtoList(entities: Stamp[]): StampDto[] {
    return entities.map(entity => this.toDto(entity));
  }
}
```

## Re-exporting DTOs from Domain

To maintain Clean Architecture while allowing Repository interfaces to use DTOs:

```typescript
// domain/entities/index.ts
/**
 * Re-export DTOs from Data Layer for Repository interfaces
 *
 * ARCHITECTURAL NOTE:
 * Repository interfaces in Domain layer return DTO types (not Entity classes).
 * To maintain Clean Architecture dependency rules (Domain should not import from Data),
 * we re-export DTO types here so that Repository interfaces can import from Domain layer.
 *
 * This is acceptable because:
 * - DTOs are simple data structures without business logic (not breaking domain purity)
 * - Repository pattern is about data access, DTOs are the natural return type
 * - The actual dependency (Data → Domain) is correct in implementation
 */
export type {
  // Response DTOs (used by Repository interfaces and Adapters)
  UserProfile,
  UserSettings,
  // Request DTOs
  CreateUserRequest,
  UpdateUserRequest,
} from '../../data/remote/dto';

// Export real Entity classes
export * from './user.entity';
```

## Date/Time Handling

### DTO with ISO Strings

```typescript
// ✅ CORRECT: DTOs use ISO strings for dates
export interface StampDto {
  id: string;
  userId: string;
  cafeteriaId: string;
  isUsed: boolean;
  usedAt: string | null; // ISO 8601 string
  expiresAt: string | null; // ISO 8601 string
  createdAt: string; // ISO 8601 string
}
```

### Mapper with Date Conversion

```typescript
// ✅ CORRECT: Mapper converts ISO strings to Date objects
export class StampMapper {
  static toDomain(dto: StampDto): Stamp {
    return new Stamp({
      id: dto.id,
      userId: dto.userId,
      cafeteriaId: dto.cafeteriaId,
      isUsed: dto.isUsed,
      usedAt: dto.usedAt ? new Date(dto.usedAt) : null, // ISO → Date
      expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null, // ISO → Date
      createdAt: new Date(dto.createdAt), // ISO → Date
    });
  }

  static toDto(entity: Stamp): StampDto {
    return {
      id: entity.getId(),
      userId: entity.getUserId(),
      cafeteriaId: entity.getCafeteriaId(),
      isUsed: entity.getIsUsed(),
      usedAt: entity.getUsedAt()?.toISOString() ?? null, // Date → ISO
      expiresAt: entity.getExpiresAt()?.toISOString() ?? null, // Date → ISO
      createdAt: entity.getCreatedAt().toISOString(), // Date → ISO
    });
  }
}
```

## Enum Mapping

### DTO with String Literals

```typescript
// ✅ CORRECT: DTOs use string literals
export interface BenefitDto {
  menuType: 'LUNCH' | 'DINNER' | 'SNACK';
  status: 'AVAILABLE' | 'UNAVAILABLE' | 'EXPIRED';
}
```

### Mapper with Enum Conversion

```typescript
// Domain constants
export const MENU_TYPE = {
  LUNCH: 'LUNCH',
  DINNER: 'DINNER',
  SNACK: 'SNACK',
} as const;

export type MenuType = typeof MENU_TYPE[keyof typeof MENU_TYPE];

// ✅ CORRECT: Mapper validates enums
export class BenefitMapper {
  static toDomain(dto: BenefitDto): Benefit {
    // Validate enum value
    if (!this.isValidMenuType(dto.menuType)) {
      throw new BenefitError(
        `Invalid menu type: ${dto.menuType}`,
        'INVALID_MENU_TYPE'
      );
    }

    return new Benefit({
      menuType: dto.menuType as MenuType,
      // ... other fields
    });
  }

  private static isValidMenuType(value: string): value is MenuType {
    return Object.values(MENU_TYPE).includes(value as MenuType);
  }
}
```

## Partial Updates

### Update Request DTO

```typescript
// ✅ CORRECT: Partial update DTO
export interface UpdateBenefitRequest {
  menuName?: string;
  price?: number;
  discountedPrice?: number | null;
  businessHours?: BusinessHoursDto | null;
}
```

### Mapper for Partial Updates

```typescript
// ✅ CORRECT: Apply partial updates
export class BenefitMapper {
  static applyUpdate(
    entity: Benefit,
    update: UpdateBenefitRequest
  ): Benefit {
    return new Benefit({
      id: entity.getId(),
      cafeteriaId: entity.getCafeteriaId(),
      cafeteriaName: entity.getCafeteriaName(),
      menuName: update.menuName ?? entity.getMenuName(),
      menuType: entity.getMenuType(),
      price: update.price ?? entity.getPrice(),
      discountedPrice:
        update.discountedPrice !== undefined
          ? update.discountedPrice
          : entity.getDiscountedPrice(),
      businessHours:
        update.businessHours !== undefined
          ? this.mapBusinessHours(update.businessHours)
          : entity.getBusinessHours(),
      isNew: entity.isNew(),
    });
  }
}
```

## Error Handling in Mappers

```typescript
// ✅ CORRECT: Handle mapping errors
export class UserMapper {
  static toDomain(dto: UserDto): User {
    try {
      // Validate required fields
      if (!dto.id || dto.id.trim().length === 0) {
        throw new Error('User ID is required');
      }
      if (!dto.email || dto.email.trim().length === 0) {
        throw new Error('Email is required');
      }

      return new UserEntity(
        dto.id,
        dto.email,
        dto.nickname,
        dto.status,
        dto.emailVerified
      );
    } catch (error) {
      // Wrap mapping errors
      throw new UserError(
        'Failed to map user DTO to domain entity',
        'MAPPING_ERROR',
        error instanceof Error ? error : undefined
      );
    }
  }
}
```

## Nullable Fields

```typescript
// ✅ CORRECT: Handle nullable fields
export interface BenefitDto {
  discountedPrice: number | null; // Explicitly nullable
  businessHours: BusinessHoursDto | null; // Explicitly nullable
}

export class BenefitMapper {
  static toDomain(dto: BenefitDto): Benefit {
    // Handle null values explicitly
    const discountedPrice = dto.discountedPrice ?? null;
    const businessHours = dto.businessHours
      ? this.mapBusinessHours(dto.businessHours)
      : null;

    return new Benefit({
      discountedPrice,
      businessHours,
      // ... other fields
    });
  }
}
```

## Testing Mappers

```typescript
describe('UserMapper', () => {
  describe('toDomain', () => {
    it('should map DTO to Entity', () => {
      const dto: UserDto = {
        id: '123',
        email: 'test@example.com',
        nickname: 'Test User',
        status: 'ACTIVE',
        emailVerified: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      };

      const entity = UserMapper.toDomain(dto);

      expect(entity.getUserId()).toBe('123');
      expect(entity.getEmail()).toBe('test@example.com');
      expect(entity.getNickname()).toBe('Test User');
      expect(entity.isActive()).toBe(true);
      expect(entity.isEmailVerified()).toBe(true);
    });

    it('should throw error for invalid DTO', () => {
      const invalidDto = {
        id: '',
        email: 'test@example.com',
        nickname: 'Test',
        status: 'ACTIVE',
        emailVerified: true,
      } as UserDto;

      expect(() => UserMapper.toDomain(invalidDto)).toThrow(UserError);
    });
  });

  describe('toDto', () => {
    it('should map Entity to DTO', () => {
      const entity = new UserEntity(
        '123',
        'test@example.com',
        'Test User',
        'ACTIVE',
        true
      );

      const dto = UserMapper.toDto(entity);

      expect(dto.id).toBe('123');
      expect(dto.email).toBe('test@example.com');
      expect(dto.nickname).toBe('Test User');
      expect(dto.status).toBe('ACTIVE');
      expect(dto.emailVerified).toBe(true);
    });
  });
});
```

## Best Practices

1. **DTOs are Simple**: No business logic, just data structures
2. **Mappers are Stateless**: All mapper methods are static
3. **Bidirectional Mapping**: Support both DTO → Entity and Entity → DTO
4. **Null Safety**: Handle nullable fields explicitly
5. **Date Conversion**: Convert ISO strings to Date objects in entities
6. **Enum Validation**: Validate enum values during mapping
7. **Error Handling**: Wrap mapping errors in domain errors
8. **Testing**: Test both directions of mapping

## DTO vs Entity Decision

**Use DTO when:**
- ✅ Simple data transfer from/to API
- ✅ No business logic needed
- ✅ Data is ephemeral

**Use Entity when:**
- ✅ Business rules exist
- ✅ Domain methods needed
- ✅ Core domain concept

## Summary

DTOs and Mappers provide:
- **Separation**: Keep domain independent of API structure
- **Flexibility**: API changes don't affect domain
- **Type Safety**: Compile-time validation of data structure
- **Testability**: Easy to test transformation logic
- **Clean Boundaries**: Clear layer separation

Mappers are the translation layer between the data world (API/DTOs) and the domain world (Entities/Business Logic).
