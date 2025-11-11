---
description: Entity testing patterns, component testing priority matrix, user interaction testing
globs:
  - "src/domains/**/domain/entities/**/*.ts"
  - "src/domains/**/presentation/ui/**/*.test.tsx"
  - "src/domains/**/presentation/ui/**/*.spec.tsx"
  - "**/__tests__/**/*.tsx"
---

# Entity & Component Testing Patterns

## Entity Testing (Domain Layer)

### When to Test Entities

Entity tests are REQUIRED when Entity has:

- Complex calculation methods (할인율, 만료일 계산 등)
- Business rule validation methods (가용성, 유효성 검증 등)
- State transformation logic (상태 전환 로직)

### Entity Testing Pattern

```typescript
// domains/stamp/domain/entities/__tests__/stamp.entity.test.ts
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Stamp } from '../stamp.entity';

describe('Stamp Entity', () => {
  beforeEach(() => {
    // Mock current date for consistent testing
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-15T00:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('isExpired', () => {
    it('should return true for expired stamps', () => {
      // Arrange - stamp expired 1 day ago
      const stamp = new Stamp(
        '1', // id
        'user-1', // userId
        'cafeteria-1', // cafeteriaId
        '카페테리아 A', // cafeteriaName
        '2024-01-01T00:00:00Z', // issuedAt
        false, // isUsed
        '2024-01-14T00:00:00Z' // expiresAt - Yesterday
      );

      // Act & Assert
      expect(stamp.isExpired()).toBe(true);
    });

    it('should return false for valid stamps', () => {
      // Arrange - stamp expires tomorrow
      const stamp = new Stamp(
        '1',
        'user-1',
        'cafeteria-1',
        '카페테리아 A',
        '2024-01-01T00:00:00Z',
        false,
        '2024-01-16T00:00:00Z' // expiresAt - Tomorrow
      );

      // Act & Assert
      expect(stamp.isExpired()).toBe(false);
    });
  });

  describe('isExpiringSoon', () => {
    it('should return true for stamps expiring within 7 days', () => {
      // Arrange - expires in 5 days
      const stamp = new Stamp(
        '1',
        'user-1',
        'cafeteria-1',
        '카페테리아 A',
        '2024-01-01T00:00:00Z',
        false,
        '2024-01-20T00:00:00Z' // expiresAt - 5 days from now
      );

      // Act & Assert
      expect(stamp.isExpiringSoon()).toBe(true);
    });

    it('should return false for stamps expiring later than 7 days', () => {
      // Arrange - expires in 10 days
      const stamp = new Stamp(
        '1',
        'user-1',
        'cafeteria-1',
        '카페테리아 A',
        '2024-01-01T00:00:00Z',
        false,
        '2024-01-25T00:00:00Z' // expiresAt - 10 days from now
      );

      // Act & Assert
      expect(stamp.isExpiringSoon()).toBe(false);
    });
  });

  describe('canBeUsed', () => {
    it('should return false for used stamps', () => {
      const stamp = new Stamp(
        '1',
        'user-1',
        'cafeteria-1',
        '카페테리아 A',
        '2024-01-01T00:00:00Z',
        true, // isUsed - Already used
        '2024-01-20T00:00:00Z'
      );

      expect(stamp.canBeUsed()).toBe(false);
    });

    it('should return false for expired stamps', () => {
      const stamp = new Stamp(
        '1',
        'user-1',
        'cafeteria-1',
        '카페테리아 A',
        '2024-01-01T00:00:00Z',
        false,
        '2024-01-14T00:00:00Z' // expiresAt - Expired
      );

      expect(stamp.canBeUsed()).toBe(false);
    });

    it('should return true for valid unused stamps', () => {
      const stamp = new Stamp(
        '1',
        'user-1',
        'cafeteria-1',
        '카페테리아 A',
        '2024-01-01T00:00:00Z',
        false,
        '2024-01-20T00:00:00Z'
      );

      expect(stamp.canBeUsed()).toBe(true);
    });
  });

  describe('getDaysUntilExpiry', () => {
    it('should calculate correct days until expiry', () => {
      // Arrange - expires in 5 days
      const stamp = new Stamp(
        '1',
        'user-1',
        'cafeteria-1',
        '카페테리아 A',
        '2024-01-01T00:00:00Z',
        false,
        '2024-01-20T00:00:00Z'
      );

      // Act & Assert
      expect(stamp.getDaysUntilExpiry()).toBe(5);
    });

    it('should return negative for expired stamps', () => {
      // Arrange - expired 2 days ago
      const stamp = new Stamp(
        '1',
        'user-1',
        'cafeteria-1',
        '카페테리아 A',
        '2024-01-01T00:00:00Z',
        false,
        '2024-01-13T00:00:00Z'
      );

      // Act & Assert
      expect(stamp.getDaysUntilExpiry()).toBe(-2);
    });
  });

  describe('getStatusMessage', () => {
    it('should return used message for used stamps', () => {
      const stamp = new Stamp(
        '1',
        'user-1',
        'cafeteria-1',
        '카페테리아 A',
        '2024-01-01T00:00:00Z',
        true, // isUsed
        '2024-01-20T00:00:00Z'
      );

      expect(stamp.getStatusMessage()).toBe('사용 완료');
    });

    it('should return expired message for expired stamps', () => {
      const stamp = new Stamp(
        '1',
        'user-1',
        'cafeteria-1',
        '카페테리아 A',
        '2024-01-01T00:00:00Z',
        false,
        '2024-01-14T00:00:00Z' // expiresAt - Expired
      );

      expect(stamp.getStatusMessage()).toBe('기간 만료');
    });

    it('should return expiring soon message with days', () => {
      // Arrange - expires in 2 days
      const stamp = new Stamp(
        '1',
        'user-1',
        'cafeteria-1',
        '카페테리아 A',
        '2024-01-01T00:00:00Z',
        false,
        '2024-01-17T00:00:00Z'
      );

      expect(stamp.getStatusMessage()).toBe('2일 후 만료');
    });

    it('should return valid message for normal stamps', () => {
      // Arrange - expires in 10 days
      const stamp = new Stamp(
        '1',
        'user-1',
        'cafeteria-1',
        '카페테리아 A',
        '2024-01-01T00:00:00Z',
        false,
        '2024-01-25T00:00:00Z'
      );

      expect(stamp.getStatusMessage()).toBe('사용 가능');
    });
  });
});
```

**핵심 포인트**:

- ✅ Entity 비즈니스 로직의 모든 분기 테스트
- ✅ 날짜 계산 시 시스템 시간 Mock (`vi.useFakeTimers()`)
- ✅ 엣지 케이스 테스트 (만료, 사용됨, 임박 등)
- ✅ 비즈니스 규칙이 올바르게 구현되었는지 검증
- ✅ 상태별 메시지가 올바른지 검증
- ❌ 데이터 접근 로직 테스트 금지 (Repository가 담당)
- ❌ UI 변환 로직 테스트 금지 (Adapter가 담당)

### Utility Function Testing

```typescript
// core/utils/__tests__/format.test.ts
import { describe, it, expect } from 'vitest';
import { formatCurrency, formatDate } from '../format';

describe('Format Utils', () => {
  describe('formatCurrency', () => {
    it('should format numbers as Korean Won', () => {
      expect(formatCurrency(1000)).toBe('1,000');
      expect(formatCurrency(1500000)).toBe('1,500,000');
    });

    it('should handle zero correctly', () => {
      expect(formatCurrency(0)).toBe('0');
    });

    it('should handle negative numbers', () => {
      expect(formatCurrency(-5000)).toBe('-5,000');
    });
  });

  describe('formatDate', () => {
    it('should format date strings correctly', () => {
      expect(formatDate('2024-01-15')).toBe('2024년 1월 15일');
    });

    it('should handle invalid dates', () => {
      expect(formatDate('invalid')).toBe('Invalid Date');
    });
  });
});
```

## UI Component Testing Priority

### Testing Priority Matrix

| Component Type  | User Interaction | State Management | Conditional Logic | Test Priority |
| --------------- | ---------------- | ---------------- | ----------------- | ------------- |
| Presentational  | ❌               | ❌               | ❌                | **Skip**      |
| Presentational  | ✅               | ❌               | ❌                | **Medium**    |
| Container       | ❌               | ✅               | ❌                | **High**      |
| Container       | ✅               | ✅               | ✅                | **Critical**  |
| Form Components | ✅               | ✅               | ✅                | **Critical**  |

### Components to SKIP Testing

Simple presentational components that only handle styling can be skipped:

```typescript
// ❌ No test needed - pure styling component
interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card = ({ children, className }: CardProps) => {
  return (
    <div className={cn('rounded-lg bg-white p-6 shadow', className)}>
      {children}
    </div>
  );
};
```

**Skip Testing When**:

- Component only applies CSS classes
- No user interactions
- No state management
- No conditional rendering
- Props are simply passed to children

### Components that REQUIRE Testing

#### 1. User Interaction Testing

```typescript
// ✅ Test required - has user interaction
interface ToggleButtonProps {
  onToggle: (value: boolean) => void;
}

export const ToggleButton = ({ onToggle }: ToggleButtonProps) => {
  const [isOn, setIsOn] = useState(false);

  const handleClick = () => {
    setIsOn(!isOn);
    onToggle(!isOn);
  };

  return <button onClick={handleClick}>{isOn ? 'ON' : 'OFF'}</button>;
};
```

**Test Example**:

```typescript
// ToggleButton.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ToggleButton } from './ToggleButton';

describe('ToggleButton', () => {
  it('should toggle state and call callback on click', async () => {
    // Arrange
    const user = userEvent.setup();
    const onToggle = vi.fn();
    render(<ToggleButton onToggle={onToggle} />);

    // Initial state
    expect(screen.getByRole('button')).toHaveTextContent('OFF');

    // Act - First click
    await user.click(screen.getByRole('button'));

    // Assert - State changed and callback called
    expect(screen.getByRole('button')).toHaveTextContent('ON');
    expect(onToggle).toHaveBeenCalledWith(true);

    // Act - Second click
    await user.click(screen.getByRole('button'));

    // Assert - State toggled back
    expect(screen.getByRole('button')).toHaveTextContent('OFF');
    expect(onToggle).toHaveBeenCalledWith(false);
  });
});
```

#### 2. Conditional Rendering Testing

```typescript
// ✅ Test required - has conditional logic
interface UserProfileProps {
  user?: {
    id: string;
    name: string;
    isBlocked: boolean;
  };
}

export const UserProfile = ({ user }: UserProfileProps) => {
  if (!user) {
    return <EmptyState message="No user found" />;
  }

  if (user.isBlocked) {
    return <BlockedUserMessage />;
  }

  return <ProfileDetails user={user} />;
};
```

**Test Example**:

```typescript
// UserProfile.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { UserProfile } from './UserProfile';

describe('UserProfile', () => {
  it('should show empty state when no user', () => {
    render(<UserProfile user={undefined} />);
    expect(screen.getByText('No user found')).toBeInTheDocument();
  });

  it('should show blocked message for blocked users', () => {
    render(
      <UserProfile
        user={{ id: '1', name: 'John', isBlocked: true }}
      />
    );
    expect(screen.getByText(/blocked/i)).toBeInTheDocument();
  });

  it('should show profile details for normal users', () => {
    render(
      <UserProfile
        user={{ id: '1', name: 'John', isBlocked: false }}
      />
    );
    expect(screen.getByText('John')).toBeInTheDocument();
  });
});
```

#### 3. Form Component Testing

```typescript
// ✅ Test required - form with validation
export const LoginForm = () => {
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: LoginFormData) => {
    // Handle login
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Input {...form.register('email')} placeholder="Email" />
      {form.formState.errors.email && (
        <span>{form.formState.errors.email.message}</span>
      )}

      <Input {...form.register('password')} type="password" placeholder="Password" />
      {form.formState.errors.password && (
        <span>{form.formState.errors.password.message}</span>
      )}

      <Button type="submit">Login</Button>
    </form>
  );
};
```

**Test Example**:

```typescript
// LoginForm.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm } from './LoginForm';

describe('LoginForm', () => {
  it('should show validation errors for empty fields', async () => {
    // Arrange
    const user = userEvent.setup();
    render(<LoginForm />);

    // Act - Submit without filling fields
    await user.click(screen.getByRole('button', { name: /login/i }));

    // Assert - Validation errors shown
    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
  });

  it('should show error for invalid email format', async () => {
    // Arrange
    const user = userEvent.setup();
    render(<LoginForm />);

    // Act - Enter invalid email
    await user.type(screen.getByPlaceholderText('Email'), 'invalid-email');
    await user.click(screen.getByRole('button', { name: /login/i }));

    // Assert
    await waitFor(() => {
      expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();
    });
  });

  it('should submit form with valid data', async () => {
    // Arrange
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<LoginForm onSubmit={onSubmit} />);

    // Act - Fill form and submit
    await user.type(screen.getByPlaceholderText('Email'), 'test@example.com');
    await user.type(screen.getByPlaceholderText('Password'), 'password123');
    await user.click(screen.getByRole('button', { name: /login/i }));

    // Assert
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });
});
```

### Component Testing Best Practices

#### DO's ✅

- **Test user-facing behavior**: Focus on what users see and interact with
- **Use semantic queries**: Prefer `getByRole`, `getByLabelText`, `getByPlaceholderText`
- **Test all branches**: Cover all conditional rendering paths
- **Test error states**: Verify error messages and validation
- **Use userEvent**: Simulate real user interactions instead of fireEvent
- **Clean up after tests**: Use `cleanup()` or rely on automatic cleanup

#### DON'Ts ❌

- **Don't test implementation details**: Avoid testing internal state or methods
- **Don't test styling**: Focus on behavior, not CSS classes
- **Don't duplicate tests**: Test each behavior once at the appropriate level
- **Don't mock unnecessarily**: Only mock external dependencies (APIs, etc.)
- **Don't forget accessibility**: Test with screen readers in mind

---

**Related**: See `testing-principles.md` for DDD layer testing, `mocking-strategies.md` for API mocking, `best-practices.md` for overall testing guidelines
