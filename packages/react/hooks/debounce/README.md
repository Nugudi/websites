# @nugudi/react-hooks-debounce

React에서 사용할 수 있는 debounce 함수로, leading/trailing edges와 max wait time 같은 고급 옵션을 제공합니다.

## Installation

```bash
pnpm add @nugudi/react-hooks-debounce
```

## Import

```tsx
import { debounce } from "@nugudi/react-hooks-debounce";
```

## Overview

`debounce` 함수는 React 애플리케이션에서 함수 호출을 디바운싱하는 강력한 방법을 제공합니다. 함수가 실행될 수 있는 빈도를 제한하여 성능을 최적화하며, 검색 입력, API 호출, 스크롤/리사이즈 핸들러, 폼 검증 등에 적합합니다.

## Basic Usage

```tsx
import { debounce } from "@nugudi/react-hooks-debounce";
import { useState, useCallback } from "react";

function SearchInput() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);

  const searchAPI = useCallback(async (term: string) => {
    const response = await fetch(`/api/search?q=${term}`);
    const data = await response.json();
    setResults(data);
  }, []);

  const debouncedSearch = debounce(searchAPI, 500);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={handleChange}
        placeholder="Search..."
      />
      <ul>
        {results.map((result) => (
          <li key={result.id}>{result.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

## Features

### Cancel Pending Calls

```tsx
import { debounce } from "@nugudi/react-hooks-debounce";

function AutoSaveEditor() {
  const [content, setContent] = useState("");
  const [saveStatus, setSaveStatus] = useState("idle");

  const saveContent = useCallback(async (text: string) => {
    setSaveStatus("saving");
    await fetch("/api/save", {
      method: "POST",
      body: JSON.stringify({ content: text }),
    });
    setSaveStatus("saved");
  }, []);

  const debouncedSave = debounce(saveContent, 1000);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setContent(value);
    setSaveStatus("typing");
    debouncedSave(value);
  };

  const handleSubmit = () => {
    // Cancel any pending auto-save
    debouncedSave.cancel();
    // Save immediately
    saveContent(content);
  };

  return (
    <div>
      <textarea value={content} onChange={handleChange} />
      <div>Status: {saveStatus}</div>
      <button onClick={handleSubmit}>Save Now</button>
    </div>
  );
}
```

### Flush Immediately

```tsx
import { debounce } from "@nugudi/react-hooks-debounce";

function FormWithValidation() {
  const [email, setEmail] = useState("");
  const [validationError, setValidationError] = useState("");

  const validateEmail = useCallback((email: string) => {
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    setValidationError(isValid ? "" : "Invalid email format");
  }, []);

  const debouncedValidate = debounce(validateEmail, 500);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    debouncedValidate(value);
  };

  const handleBlur = () => {
    // Validate immediately when user leaves the field
    debouncedValidate.flush();
  };

  return (
    <div>
      <input
        type="email"
        value={email}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="Enter email"
      />
      {validationError && <span className="error">{validationError}</span>}
    </div>
  );
}
```

### Check Pending Status

```tsx
import { debounce } from "@nugudi/react-hooks-debounce";

function SearchWithLoader() {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const performSearch = useCallback(async (searchQuery: string) => {
    setIsSearching(true);
    try {
      const response = await fetch(`/api/search?q=${searchQuery}`);
      const data = await response.json();
      // Handle results
    } finally {
      setIsSearching(false);
    }
  }, []);

  const debouncedSearch = debounce(performSearch, 300);

  const handleSearch = (value: string) => {
    setQuery(value);
    if (value) {
      debouncedSearch(value);
    }
  };

  const isPending = debouncedSearch.pending();

  return (
    <div>
      <input
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search..."
      />
      {(isPending || isSearching) && <span>Searching...</span>}
    </div>
  );
}
```

## Real-World Examples

### Live Search with API

```tsx
import { debounce } from "@nugudi/react-hooks-debounce";
import { useState, useCallback } from "react";
import { VStack, HStack, Input, Body } from "@nugudi/react-components-layout";

function ProductSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const searchProducts = useCallback(async (query: string) => {
    if (!query.trim()) {
      setProducts([]);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(
        `/api/products/search?q=${encodeURIComponent(query)}`
      );

      if (!response.ok) {
        throw new Error("Search failed");
      }

      const data = await response.json();
      setProducts(data.products);
    } catch (err) {
      setError("Failed to search products");
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debounce search with 400ms delay
  const debouncedSearch = debounce(searchProducts, 400);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Cancel previous search if typing continues
    debouncedSearch.cancel();

    // Start new search
    debouncedSearch(value);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setProducts([]);
    debouncedSearch.cancel();
  };

  return (
    <VStack gap={16}>
      <HStack gap={8}>
        <Input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search products..."
        />
        {searchTerm && <button onClick={handleClearSearch}>Clear</button>}
      </HStack>

      {error && (
        <Body fontSize="b3" color="red">
          {error}
        </Body>
      )}

      {isLoading && <Body fontSize="b3">Searching...</Body>}

      {!isLoading && products.length > 0 && (
        <VStack gap={8}>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </VStack>
      )}

      {!isLoading && searchTerm && products.length === 0 && (
        <Body fontSize="b3" color="zinc">
          No products found for "{searchTerm}"
        </Body>
      )}
    </VStack>
  );
}
```

### Auto-save Form

```tsx
import { debounce } from "@nugudi/react-hooks-debounce";
import { useState, useCallback, useEffect } from "react";
import {
  VStack,
  HStack,
  Title,
  Body,
  Textarea,
} from "@nugudi/react-components-layout";

function AutoSaveNoteEditor() {
  const [note, setNote] = useState({ title: "", content: "" });
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const saveNote = useCallback(async (noteData: typeof note) => {
    setSaveStatus("saving");

    try {
      const response = await fetch("/api/notes/auto-save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(noteData),
      });

      if (!response.ok) {
        throw new Error("Save failed");
      }

      setSaveStatus("saved");
      setLastSaved(new Date());

      // Reset status after 2 seconds
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch (error) {
      setSaveStatus("error");
      console.error("Failed to save note:", error);
    }
  }, []);

  // Debounce with 1 second delay
  const debouncedSave = debounce(saveNote, 1000);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newNote = { ...note, title: e.target.value };
    setNote(newNote);
    setSaveStatus("idle");
    debouncedSave(newNote);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newNote = { ...note, content: e.target.value };
    setNote(newNote);
    setSaveStatus("idle");
    debouncedSave(newNote);
  };

  // Save immediately when component unmounts
  useEffect(() => {
    return () => {
      if (debouncedSave.pending()) {
        debouncedSave.flush();
      }
    };
  }, [debouncedSave]);

  const getSaveStatusMessage = () => {
    switch (saveStatus) {
      case "saving":
        return "Saving...";
      case "saved":
        return "Saved";
      case "error":
        return "Failed to save";
      default:
        return lastSaved ? `Last saved: ${lastSaved.toLocaleTimeString()}` : "";
    }
  };

  return (
    <VStack gap={16}>
      <HStack justify="space-between">
        <Title fontSize="t2">Note Editor</Title>
        <Body fontSize="b4" color={saveStatus === "error" ? "red" : "zinc"}>
          {getSaveStatusMessage()}
        </Body>
      </HStack>

      <input
        type="text"
        value={note.title}
        onChange={handleTitleChange}
        placeholder="Note title..."
        className="note-title-input"
      />

      <Textarea
        value={note.content}
        onChange={handleContentChange}
        placeholder="Start writing..."
        rows={20}
      />

      <HStack gap={12}>
        <button
          onClick={() => {
            debouncedSave.cancel();
            saveNote(note);
          }}
        >
          Save Now
        </button>
        <button
          onClick={() => {
            debouncedSave.cancel();
            setSaveStatus("idle");
          }}
        >
          Cancel Auto-save
        </button>
      </HStack>
    </VStack>
  );
}
```

### Infinite Scroll

```tsx
import { debounce } from "@nugudi/react-hooks-debounce";
import { useState, useCallback, useEffect, useRef } from "react";
import { VStack, Body } from "@nugudi/react-components-layout";

function InfiniteScrollList() {
  const [items, setItems] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);

  const loadMoreItems = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);

    try {
      const response = await fetch(`/api/items?page=${page}&limit=20`);
      const data = await response.json();

      setItems((prev) => [...prev, ...data.items]);
      setHasMore(data.hasMore);
      setPage((prev) => prev + 1);
    } catch (error) {
      console.error("Failed to load items:", error);
    } finally {
      setIsLoading(false);
    }
  }, [page, isLoading, hasMore]);

  // Debounce scroll loading to prevent too many requests
  const debouncedLoadMore = debounce(loadMoreItems, 300);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          debouncedLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [debouncedLoadMore, hasMore, isLoading]);

  return (
    <VStack gap={16}>
      {items.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}

      {/* Loading indicator */}
      {isLoading && (
        <Body fontSize="b3" color="zinc">
          Loading more items...
        </Body>
      )}

      {/* Observer target for infinite scroll */}
      <div ref={observerTarget} style={{ height: 1 }} />

      {!hasMore && items.length > 0 && (
        <Body fontSize="b3" color="zinc">
          No more items to load
        </Body>
      )}
    </VStack>
  );
}
```

### Window Resize Handler

```tsx
import { debounce } from "@nugudi/react-hooks-debounce";
import { useState, useCallback, useEffect } from "react";
import { VStack, HStack, Title, Body } from "@nugudi/react-components-layout";

function ResponsiveLayout() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [layout, setLayout] = useState<"mobile" | "tablet" | "desktop">(
    "desktop"
  );

  const updateLayout = useCallback((width: number) => {
    if (width < 768) {
      setLayout("mobile");
    } else if (width < 1024) {
      setLayout("tablet");
    } else {
      setLayout("desktop");
    }
  }, []);

  const handleResize = useCallback(() => {
    const newSize = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
    setWindowSize(newSize);
    updateLayout(newSize.width);
  }, [updateLayout]);

  // Debounce resize events with 200ms delay
  const debouncedResize = debounce(handleResize, 200);

  useEffect(() => {
    // Initial layout setup
    updateLayout(window.innerWidth);

    const resizeListener = () => {
      // Show immediate feedback (optional)
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });

      // Debounce expensive layout calculations
      debouncedResize();
    };

    window.addEventListener("resize", resizeListener);

    return () => {
      window.removeEventListener("resize", resizeListener);
      debouncedResize.cancel();
    };
  }, [debouncedResize, updateLayout]);

  return (
    <VStack gap={16}>
      <Title fontSize="t2">Responsive Layout Demo</Title>

      <HStack gap={12}>
        <Body fontSize="b3">
          Current layout: <strong>{layout}</strong>
        </Body>
        <Body fontSize="b3">
          Window size: {windowSize.width} x {windowSize.height}
        </Body>
      </HStack>

      <div className={`layout-container layout-${layout}`}>
        {layout === "mobile" && <MobileLayout />}
        {layout === "tablet" && <TabletLayout />}
        {layout === "desktop" && <DesktopLayout />}
      </div>
    </VStack>
  );
}
```

### Form Field Validation

```tsx
import { debounce } from "@nugudi/react-hooks-debounce";
import { useState, useCallback } from "react";
import { VStack, HStack, Body, Input } from "@nugudi/react-components-layout";

function RegistrationForm() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [checking, setChecking] = useState<Record<string, boolean>>({});

  // Username availability check
  const checkUsernameAvailability = useCallback(async (username: string) => {
    if (username.length < 3) {
      setErrors((prev) => ({ ...prev, username: "Username too short" }));
      return;
    }

    setChecking((prev) => ({ ...prev, username: true }));

    try {
      const response = await fetch(`/api/check-username?username=${username}`);
      const { available } = await response.json();

      setErrors((prev) => ({
        ...prev,
        username: available ? "" : "Username already taken",
      }));
    } catch (error) {
      setErrors((prev) => ({ ...prev, username: "Failed to check username" }));
    } finally {
      setChecking((prev) => ({ ...prev, username: false }));
    }
  }, []);

  // Email validation
  const validateEmail = useCallback((email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      setErrors((prev) => ({ ...prev, email: "" }));
    } else if (!emailRegex.test(email)) {
      setErrors((prev) => ({ ...prev, email: "Invalid email format" }));
    } else {
      setErrors((prev) => ({ ...prev, email: "" }));
    }
  }, []);

  // Password strength check
  const checkPasswordStrength = useCallback((password: string) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*]/.test(password);

    if (password.length < minLength) {
      setErrors((prev) => ({
        ...prev,
        password: `Password must be at least ${minLength} characters`,
      }));
    } else if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
      setErrors((prev) => ({
        ...prev,
        password: "Password must include uppercase, lowercase, and numbers",
      }));
    } else if (!hasSpecialChar) {
      setErrors((prev) => ({
        ...prev,
        password: "Consider adding special characters for stronger security",
      }));
    } else {
      setErrors((prev) => ({ ...prev, password: "" }));
    }
  }, []);

  // Debounced validators
  const debouncedCheckUsername = debounce(checkUsernameAvailability, 500);
  const debouncedValidateEmail = debounce(validateEmail, 300);
  const debouncedCheckPassword = debounce(checkPasswordStrength, 400);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error immediately when user starts typing
    setErrors((prev) => ({ ...prev, [field]: "" }));

    // Run debounced validation
    switch (field) {
      case "username":
        debouncedCheckUsername(value);
        break;
      case "email":
        debouncedValidateEmail(value);
        break;
      case "password":
        debouncedCheckPassword(value);
        break;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Cancel any pending validations
    debouncedCheckUsername.cancel();
    debouncedValidateEmail.cancel();
    debouncedCheckPassword.cancel();

    // Validate all fields immediately
    await checkUsernameAvailability(formData.username);
    validateEmail(formData.email);
    checkPasswordStrength(formData.password);

    // Check if there are any errors
    const hasErrors = Object.values(errors).some((error) => error !== "");
    if (!hasErrors) {
      // Submit form
      console.log("Form submitted:", formData);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <VStack gap={20}>
        <div>
          <Input
            type="text"
            value={formData.username}
            onChange={(e) => handleInputChange("username", e.target.value)}
            placeholder="Username"
          />
          {checking.username && (
            <Body fontSize="b4" color="zinc">
              Checking availability...
            </Body>
          )}
          {errors.username && (
            <Body fontSize="b4" color="red">
              {errors.username}
            </Body>
          )}
        </div>

        <div>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            placeholder="Email"
          />
          {errors.email && (
            <Body fontSize="b4" color="red">
              {errors.email}
            </Body>
          )}
        </div>

        <div>
          <Input
            type="password"
            value={formData.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
            placeholder="Password"
          />
          {errors.password && (
            <Body
              fontSize="b4"
              color={errors.password.includes("Consider") ? "yellow" : "red"}
            >
              {errors.password}
            </Body>
          )}
        </div>

        <button type="submit">Register</button>
      </VStack>
    </form>
  );
}
```

## Advanced Options

### Leading and Trailing Edges

```tsx
import { debounce } from "@nugudi/react-hooks-debounce";

function AdvancedDebounceExample() {
  const handleClick = useCallback((count: number) => {
    console.log(`Clicked ${count} times`);
  }, []);

  // Execute on the leading edge (immediately on first call)
  const leadingDebounce = debounce(handleClick, 1000, {
    leading: true,
    trailing: false,
  });

  // Execute on the trailing edge (default behavior)
  const trailingDebounce = debounce(handleClick, 1000, {
    leading: false,
    trailing: true,
  });

  // Execute on both edges
  const bothEdgesDebounce = debounce(handleClick, 1000, {
    leading: true,
    trailing: true,
  });

  return (
    <div>
      <button onClick={() => leadingDebounce(1)}>
        Leading Edge (Immediate)
      </button>
      <button onClick={() => trailingDebounce(2)}>
        Trailing Edge (Delayed)
      </button>
      <button onClick={() => bothEdgesDebounce(3)}>Both Edges</button>
    </div>
  );
}
```

### Maximum Wait Time

```tsx
import { debounce } from "@nugudi/react-hooks-debounce";

function MaxWaitExample() {
  const [scrollPosition, setScrollPosition] = useState(0);

  const updateScrollPosition = useCallback((position: number) => {
    console.log("Saving scroll position:", position);
    // Save to backend or localStorage
  }, []);

  // Debounce with max wait to ensure position is saved at least every 2 seconds
  const debouncedUpdate = debounce(updateScrollPosition, 500, {
    maxWait: 2000,
  });

  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY;
      setScrollPosition(position);
      debouncedUpdate(position);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      debouncedUpdate.cancel();
    };
  }, [debouncedUpdate]);

  return <div>Current scroll: {scrollPosition}px</div>;
}
```

## API Reference

### debounce

| Parameter  | Type              | Default | Description              |
| ---------- | ----------------- | ------- | ------------------------ |
| `callback` | `Function`        | -       | The function to debounce |
| `delay`    | `number`          | `500`   | Delay in milliseconds    |
| `options`  | `DebounceOptions` | `{}`    | Additional options       |

**Options:**

| Option     | Type      | Default     | Description                                   |
| ---------- | --------- | ----------- | --------------------------------------------- |
| `leading`  | `boolean` | `false`     | Execute on the leading edge                   |
| `trailing` | `boolean` | `true`      | Execute on the trailing edge                  |
| `maxWait`  | `number`  | `undefined` | Maximum time to wait before forcing execution |

**Returns:** `DebouncedFunction<T>`

| Method      | Type            | Description                          |
| ----------- | --------------- | ------------------------------------ |
| `(...args)` | `Function`      | The debounced function               |
| `cancel()`  | `() => void`    | Cancel pending execution             |
| `flush()`   | `() => void`    | Execute pending call immediately     |
| `pending()` | `() => boolean` | Check if there's a pending execution |

## Best Practices

1. **Use appropriate delays** - Too short delays may not provide benefits, too long delays may feel unresponsive
2. **Cancel on unmount** - Always cancel pending calls when component unmounts
3. **Consider user feedback** - Show loading states for debounced operations
4. **Use maxWait for critical updates** - Ensure important data is saved within reasonable time
5. **Memoize callbacks** - Use `useCallback` for functions passed to `debounce`
6. **Handle errors gracefully** - Debounced functions should include error handling
7. **Test edge cases** - Consider rapid clicks, component unmounting, and network failures

## TypeScript Support

Full TypeScript support with type inference:

```tsx
import type {
  DebouncedFunction,
  DebounceOptions,
} from "@nugudi/react-hooks-debounce";

// Type-safe debounced function
const searchProducts = async (
  query: string,
  category?: string
): Promise<Product[]> => {
  // Implementation
};

const debouncedSearch: DebouncedFunction<typeof searchProducts> = debounce(
  searchProducts,
  500
);

// Typed options
const options: DebounceOptions = {
  leading: true,
  trailing: true,
  maxWait: 1000,
};

const customDebounce = debounce(myFunction, 300, options);
```

## Performance Considerations

- 컴포넌트 언마운트 시 자동으로 클린업 처리
- 디바운스 상태를 잃지 않고 함수 참조 업데이트
- 최적화를 위해 `useCallback`과 `useMemo` 사용
- 디바운스된 함수 참조가 안정적이므로 리렌더링 최소화

## License

MIT
