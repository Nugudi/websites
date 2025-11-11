---
description: End-to-end testing with Playwright, user flows, authentication, form submissions, navigation, Page Object Model, and visual regression
globs:
  - "**/e2e/**/*.spec.ts"
  - "**/*.e2e.ts"
  - "**/e2e/**/*.test.ts"
alwaysApply: true
---

# End-to-End Testing with Playwright

> **Document Type**: E2E Testing Guide
> **Target Audience**: All developers
> **Related Documents**: [testing-principles.md](./testing-principles.md), [unit-testing.md](./unit-testing.md), [integration-testing.md](./integration-testing.md)
> **Last Updated**: 2025-11-11

This document provides comprehensive end-to-end (E2E) testing patterns using Playwright to test complete user flows through the application.

## What is E2E Testing?

**End-to-End Testing** tests complete user flows through the application in a real browser environment.

**Key Characteristics**:
- **Full Stack**: Tests the entire application (frontend + backend)
- **Real Browser**: Runs in actual browsers (Chrome, Firefox, Safari)
- **User Perspective**: Tests from the user's point of view
- **Slow but Comprehensive**: Most realistic but slowest tests

**Why E2E Tests?**:
- Verify critical user journeys work end-to-end
- Catch integration issues between systems
- Test real browser behavior (JavaScript, CSS, animations)
- Validate production-like scenarios

**Testing Pyramid Position**: 5-10% of all tests

## Playwright Setup

### Installation

```bash
# Install Playwright
pnpm add -D @playwright/test

# Install browsers
pnpm exec playwright install
```

### Configuration

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // Test directory
  testDir: './e2e',

  // Run tests in files in parallel
  fullyParallel: true,

  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,

  // Retry on CI only
  retries: process.env.CI ? 2 : 0,

  // Opt out of parallel tests on CI
  workers: process.env.CI ? 1 : undefined,

  // Reporter to use
  reporter: [
    ['html'],
    ['list'],
    ['junit', { outputFile: 'test-results/junit.xml' }],
  ],

  // Shared settings for all the projects below
  use: {
    // Base URL to use in actions like `await page.goto('/')`
    baseURL: process.env.BASE_URL || 'http://localhost:3000',

    // Collect trace when retrying the failed test
    trace: 'on-first-retry',

    // Screenshot on failure
    screenshot: 'only-on-failure',

    // Video on failure
    video: 'retain-on-failure',
  },

  // Configure projects for major browsers
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    // Mobile viewports
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  // Run local dev server before starting tests
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
```

## Critical User Flows to Test

### 1. Authentication Flow

Test the complete authentication journey from login to logout.

#### Complete Login Flow Test

```typescript
// e2e/auth/login.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Login Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to login page before each test
    await page.goto('/login');
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    // Arrange - Fill in login form
    await page.getByLabel('Email').fill('test@example.com');
    await page.getByLabel('Password').fill('password123');

    // Act - Submit form
    await page.getByRole('button', { name: 'Login' }).click();

    // Assert - Should redirect to dashboard
    await expect(page).toHaveURL('/dashboard');

    // Assert - Should display user info
    await expect(page.getByText('Welcome, Test User')).toBeVisible();

    // Assert - Should have session cookie
    const cookies = await page.context().cookies();
    expect(cookies.find((c) => c.name === 'session')).toBeDefined();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    // Arrange - Fill with invalid credentials
    await page.getByLabel('Email').fill('wrong@example.com');
    await page.getByLabel('Password').fill('wrongpassword');

    // Act - Submit form
    await page.getByRole('button', { name: 'Login' }).click();

    // Assert - Should stay on login page
    await expect(page).toHaveURL('/login');

    // Assert - Should show error message
    await expect(
      page.getByText('Invalid email or password')
    ).toBeVisible();
  });

  test('should validate required fields', async ({ page }) => {
    // Act - Submit empty form
    await page.getByRole('button', { name: 'Login' }).click();

    // Assert - Should show validation errors
    await expect(page.getByText('Email is required')).toBeVisible();
    await expect(page.getByText('Password is required')).toBeVisible();
  });

  test('should toggle password visibility', async ({ page }) => {
    // Arrange
    const passwordInput = page.getByLabel('Password');
    const toggleButton = page.getByRole('button', { name: 'Show password' });

    // Assert - Initially hidden
    await expect(passwordInput).toHaveAttribute('type', 'password');

    // Act - Click toggle
    await toggleButton.click();

    // Assert - Now visible
    await expect(passwordInput).toHaveAttribute('type', 'text');

    // Act - Click toggle again
    await toggleButton.click();

    // Assert - Hidden again
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('should redirect to intended page after login', async ({ page }) => {
    // Arrange - Try to access protected page
    await page.goto('/dashboard/settings');

    // Assert - Should redirect to login with returnUrl
    await expect(page).toHaveURL(/\/login\?returnUrl=/);

    // Act - Login
    await page.getByLabel('Email').fill('test@example.com');
    await page.getByLabel('Password').fill('password123');
    await page.getByRole('button', { name: 'Login' }).click();

    // Assert - Should redirect back to intended page
    await expect(page).toHaveURL('/dashboard/settings');
  });
});
```

#### OAuth Login Flow Test

```typescript
// e2e/auth/oauth-login.spec.ts
import { test, expect } from '@playwright/test';

test.describe('OAuth Login Flow', () => {
  test('should login with Google OAuth', async ({ page, context }) => {
    // Arrange
    await page.goto('/login');

    // Act - Click Google login button
    const googleButton = page.getByRole('button', { name: 'Continue with Google' });
    await googleButton.click();

    // Assert - Should open OAuth popup
    const [popup] = await Promise.all([
      context.waitForEvent('page'),
      googleButton.click(),
    ]);

    // Act - Complete OAuth flow in popup (mocked)
    await popup.waitForLoadState();
    await popup.getByLabel('Email').fill('test@gmail.com');
    await popup.getByLabel('Password').fill('googlepass123');
    await popup.getByRole('button', { name: 'Sign in' }).click();

    // Act - Authorize the app
    await popup.getByRole('button', { name: 'Allow' }).click();

    // Assert - Should close popup and redirect to dashboard
    await popup.waitForEvent('close');
    await expect(page).toHaveURL('/dashboard');

    // Assert - Should display user info from Google
    await expect(page.getByText('test@gmail.com')).toBeVisible();
  });

  test('should handle OAuth cancellation', async ({ page, context }) => {
    // Arrange
    await page.goto('/login');

    // Act - Click Google login button
    const googleButton = page.getByRole('button', { name: 'Continue with Google' });

    const [popup] = await Promise.all([
      context.waitForEvent('page'),
      googleButton.click(),
    ]);

    // Act - Cancel OAuth flow
    await popup.close();

    // Assert - Should stay on login page
    await expect(page).toHaveURL('/login');

    // Assert - Should show cancellation message
    await expect(
      page.getByText('Login cancelled')
    ).toBeVisible();
  });
});
```

#### Logout Flow Test

```typescript
// e2e/auth/logout.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Logout Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.getByLabel('Email').fill('test@example.com');
    await page.getByLabel('Password').fill('password123');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page).toHaveURL('/dashboard');
  });

  test('should logout successfully', async ({ page }) => {
    // Act - Click logout button
    await page.getByRole('button', { name: 'Logout' }).click();

    // Assert - Should redirect to login page
    await expect(page).toHaveURL('/login');

    // Assert - Session cookie should be cleared
    const cookies = await page.context().cookies();
    expect(cookies.find((c) => c.name === 'session')).toBeUndefined();

    // Assert - Cannot access protected page
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login/);
  });

  test('should show confirmation dialog before logout', async ({ page }) => {
    // Act - Click logout button
    await page.getByRole('button', { name: 'Logout' }).click();

    // Assert - Should show confirmation dialog
    await expect(
      page.getByText('Are you sure you want to logout?')
    ).toBeVisible();

    // Act - Cancel logout
    await page.getByRole('button', { name: 'Cancel' }).click();

    // Assert - Should stay on dashboard
    await expect(page).toHaveURL('/dashboard');
  });
});
```

### 2. Form Submission Flow

Test complete form submission with validation and success states.

```typescript
// e2e/forms/contact-form.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Contact Form Submission', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact');
  });

  test('should submit contact form successfully', async ({ page }) => {
    // Arrange - Fill form fields
    await page.getByLabel('Name').fill('John Doe');
    await page.getByLabel('Email').fill('john@example.com');
    await page.getByLabel('Subject').fill('Inquiry about services');
    await page.getByLabel('Message').fill(
      'I would like to know more about your services. Please contact me.'
    );

    // Act - Submit form
    await page.getByRole('button', { name: 'Send Message' }).click();

    // Assert - Should show success message
    await expect(
      page.getByText('Thank you! Your message has been sent.')
    ).toBeVisible();

    // Assert - Form should be cleared
    await expect(page.getByLabel('Name')).toHaveValue('');
    await expect(page.getByLabel('Email')).toHaveValue('');
    await expect(page.getByLabel('Message')).toHaveValue('');
  });

  test('should show validation errors for invalid data', async ({ page }) => {
    // Act - Fill with invalid email
    await page.getByLabel('Name').fill('John Doe');
    await page.getByLabel('Email').fill('invalid-email');
    await page.getByLabel('Message').fill('Short');

    await page.getByRole('button', { name: 'Send Message' }).click();

    // Assert - Should show validation errors
    await expect(page.getByText('Invalid email format')).toBeVisible();
    await expect(
      page.getByText('Message must be at least 20 characters')
    ).toBeVisible();
  });

  test('should disable submit button during submission', async ({ page }) => {
    // Arrange - Fill form
    await page.getByLabel('Name').fill('John Doe');
    await page.getByLabel('Email').fill('john@example.com');
    await page.getByLabel('Message').fill('This is a test message that is long enough.');

    // Act - Click submit
    const submitButton = page.getByRole('button', { name: 'Send Message' });
    await submitButton.click();

    // Assert - Button should be disabled during submission
    await expect(submitButton).toBeDisabled();
    await expect(page.getByText('Sending...')).toBeVisible();

    // Assert - Button should be enabled after submission
    await expect(submitButton).toBeEnabled({ timeout: 5000 });
  });

  test('should handle server errors gracefully', async ({ page, context }) => {
    // Arrange - Mock server error
    await context.route('**/api/contact', (route) => {
      route.fulfill({
        status: 500,
        body: JSON.stringify({ error: 'Server error' }),
      });
    });

    // Act - Submit form
    await page.getByLabel('Name').fill('John Doe');
    await page.getByLabel('Email').fill('john@example.com');
    await page.getByLabel('Message').fill('This is a test message.');
    await page.getByRole('button', { name: 'Send Message' }).click();

    // Assert - Should show error message
    await expect(
      page.getByText('Failed to send message. Please try again.')
    ).toBeVisible();

    // Assert - Form data should be preserved
    await expect(page.getByLabel('Name')).toHaveValue('John Doe');
    await expect(page.getByLabel('Email')).toHaveValue('john@example.com');
  });

  test('should support file upload', async ({ page }) => {
    // Arrange - Create test file
    const fileContent = 'Test file content';
    const file = {
      name: 'test-document.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from(fileContent),
    };

    // Act - Upload file
    await page.getByLabel('Attachment').setInputFiles(file);

    // Assert - Should show file name
    await expect(page.getByText('test-document.pdf')).toBeVisible();

    // Act - Submit form
    await page.getByLabel('Name').fill('John Doe');
    await page.getByLabel('Email').fill('john@example.com');
    await page.getByLabel('Message').fill('Message with attachment.');
    await page.getByRole('button', { name: 'Send Message' }).click();

    // Assert - Should include file in submission
    await expect(
      page.getByText('Message sent with 1 attachment')
    ).toBeVisible();
  });
});
```

### 3. Navigation Flow

Test multi-page navigation and routing.

```typescript
// e2e/navigation/main-navigation.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Main Navigation', () => {
  test('should navigate through main sections', async ({ page }) => {
    // Start at homepage
    await page.goto('/');

    // Navigate to About page
    await page.getByRole('link', { name: 'About' }).click();
    await expect(page).toHaveURL('/about');
    await expect(page.getByRole('heading', { name: 'About Us' })).toBeVisible();

    // Navigate to Services page
    await page.getByRole('link', { name: 'Services' }).click();
    await expect(page).toHaveURL('/services');
    await expect(page.getByRole('heading', { name: 'Our Services' })).toBeVisible();

    // Navigate to Contact page
    await page.getByRole('link', { name: 'Contact' }).click();
    await expect(page).toHaveURL('/contact');
    await expect(page.getByRole('heading', { name: 'Contact Us' })).toBeVisible();

    // Navigate back to homepage
    await page.getByRole('link', { name: 'Home' }).click();
    await expect(page).toHaveURL('/');
  });

  test('should handle browser back/forward navigation', async ({ page }) => {
    // Navigate through pages
    await page.goto('/');
    await page.getByRole('link', { name: 'About' }).click();
    await expect(page).toHaveURL('/about');

    await page.getByRole('link', { name: 'Services' }).click();
    await expect(page).toHaveURL('/services');

    // Use browser back button
    await page.goBack();
    await expect(page).toHaveURL('/about');

    // Use browser forward button
    await page.goForward();
    await expect(page).toHaveURL('/services');
  });

  test('should show active navigation state', async ({ page }) => {
    await page.goto('/about');

    // Assert - About link should have active class
    const aboutLink = page.getByRole('link', { name: 'About' });
    await expect(aboutLink).toHaveClass(/active/);

    // Navigate to Services
    await page.getByRole('link', { name: 'Services' }).click();

    // Assert - Services link should now be active
    const servicesLink = page.getByRole('link', { name: 'Services' });
    await expect(servicesLink).toHaveClass(/active/);

    // Assert - About link should no longer be active
    await expect(aboutLink).not.toHaveClass(/active/);
  });
});
```

### 4. Shopping/E-commerce Flow

Test complete purchase journey from browsing to checkout.

```typescript
// e2e/shop/checkout-flow.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Checkout Flow', () => {
  test('should complete full checkout process', async ({ page }) => {
    // 1. Browse products
    await page.goto('/shop');

    // 2. Add product to cart
    await page.getByRole('button', { name: 'Add to Cart' }).first().click();

    // Assert - Cart badge should update
    await expect(page.getByTestId('cart-badge')).toHaveText('1');

    // 3. View cart
    await page.getByRole('link', { name: 'Cart' }).click();
    await expect(page).toHaveURL('/cart');

    // Assert - Product should be in cart
    await expect(page.getByTestId('cart-items')).toContainText('Product Name');

    // 4. Update quantity
    await page.getByLabel('Quantity').fill('2');
    await expect(page.getByTestId('cart-total')).toContainText('$40.00');

    // 5. Proceed to checkout
    await page.getByRole('button', { name: 'Proceed to Checkout' }).click();
    await expect(page).toHaveURL('/checkout');

    // 6. Fill shipping information
    await page.getByLabel('Full Name').fill('John Doe');
    await page.getByLabel('Address').fill('123 Main St');
    await page.getByLabel('City').fill('New York');
    await page.getByLabel('Postal Code').fill('10001');

    // 7. Fill payment information
    await page.getByLabel('Card Number').fill('4242424242424242');
    await page.getByLabel('Expiry Date').fill('12/25');
    await page.getByLabel('CVC').fill('123');

    // 8. Submit order
    await page.getByRole('button', { name: 'Place Order' }).click();

    // 9. Verify order confirmation
    await expect(page).toHaveURL(/\/order\/confirmation/);
    await expect(
      page.getByText('Thank you for your order!')
    ).toBeVisible();

    // Assert - Order number should be displayed
    await expect(page.getByTestId('order-number')).toBeVisible();

    // Assert - Cart should be empty
    await page.getByRole('link', { name: 'Cart' }).click();
    await expect(page.getByText('Your cart is empty')).toBeVisible();
  });

  test('should save cart items for logged-in users', async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.getByLabel('Email').fill('test@example.com');
    await page.getByLabel('Password').fill('password123');
    await page.getByRole('button', { name: 'Login' }).click();

    // Add items to cart
    await page.goto('/shop');
    await page.getByRole('button', { name: 'Add to Cart' }).first().click();

    // Refresh page
    await page.reload();

    // Assert - Cart items should persist
    await expect(page.getByTestId('cart-badge')).toHaveText('1');
  });
});
```

## Page Object Model Pattern

**Purpose**: Organize test code by creating reusable page objects that encapsulate page structure and interactions.

**Benefits**:
- Reduce code duplication
- Improve maintainability
- Make tests more readable
- Centralize page-specific logic

### Example: Login Page Object

```typescript
// e2e/pages/login.page.ts
import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly googleLoginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByLabel('Email');
    this.passwordInput = page.getByLabel('Password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.errorMessage = page.getByRole('alert');
    this.googleLoginButton = page.getByRole('button', { name: 'Continue with Google' });
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async loginWithGoogle() {
    await this.googleLoginButton.click();
  }

  async getErrorMessage() {
    return await this.errorMessage.textContent();
  }
}
```

### Using Page Object in Tests

```typescript
// e2e/auth/login-with-pom.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';

test.describe('Login Flow with POM', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('should login successfully', async ({ page }) => {
    // Act
    await loginPage.login('test@example.com', 'password123');

    // Assert
    await expect(page).toHaveURL('/dashboard');
  });

  test('should show error for invalid credentials', async () => {
    // Act
    await loginPage.login('wrong@example.com', 'wrongpass');

    // Assert
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('Invalid email or password');
  });
});
```

### Example: Dashboard Page Object

```typescript
// e2e/pages/dashboard.page.ts
import { Page, Locator } from '@playwright/test';

export class DashboardPage {
  readonly page: Page;
  readonly welcomeMessage: Locator;
  readonly logoutButton: Locator;
  readonly navigationMenu: Locator;

  constructor(page: Page) {
    this.page = page;
    this.welcomeMessage = page.getByTestId('welcome-message');
    this.logoutButton = page.getByRole('button', { name: 'Logout' });
    this.navigationMenu = page.getByRole('navigation');
  }

  async goto() {
    await this.page.goto('/dashboard');
  }

  async logout() {
    await this.logoutButton.click();
  }

  async navigateTo(section: string) {
    await this.navigationMenu.getByRole('link', { name: section }).click();
  }

  async getWelcomeText() {
    return await this.welcomeMessage.textContent();
  }
}
```

## Visual Regression Testing

**Purpose**: Detect unintended visual changes by comparing screenshots.

### Basic Screenshot Comparison

```typescript
// e2e/visual/homepage.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Visual Regression Tests', () => {
  test('should match homepage screenshot', async ({ page }) => {
    await page.goto('/');

    // Take screenshot and compare with baseline
    await expect(page).toHaveScreenshot('homepage.png', {
      fullPage: true,
    });
  });

  test('should match button hover state', async ({ page }) => {
    await page.goto('/');

    const button = page.getByRole('button', { name: 'Get Started' });

    // Hover over button
    await button.hover();

    // Take screenshot of button
    await expect(button).toHaveScreenshot('button-hover.png');
  });

  test('should match dark mode', async ({ page }) => {
    await page.goto('/');

    // Enable dark mode
    await page.getByRole('button', { name: 'Toggle Dark Mode' }).click();

    // Take screenshot
    await expect(page).toHaveScreenshot('homepage-dark.png', {
      fullPage: true,
    });
  });
});
```

### Responsive Visual Testing

```typescript
// e2e/visual/responsive.spec.ts
import { test, expect } from '@playwright/test';

const viewports = [
  { name: 'mobile', width: 375, height: 667 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
];

test.describe('Responsive Visual Tests', () => {
  for (const viewport of viewports) {
    test(`should match ${viewport.name} layout`, async ({ page }) => {
      // Set viewport size
      await page.setViewportSize({
        width: viewport.width,
        height: viewport.height,
      });

      await page.goto('/');

      // Take screenshot
      await expect(page).toHaveScreenshot(`homepage-${viewport.name}.png`, {
        fullPage: true,
      });
    });
  }
});
```

## Test Utilities and Helpers

### Authentication Helper

```typescript
// e2e/helpers/auth.helper.ts
import { Page } from '@playwright/test';

export async function login(page: Page, email: string, password: string) {
  await page.goto('/login');
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForURL('/dashboard');
}

export async function logout(page: Page) {
  await page.getByRole('button', { name: 'Logout' }).click();
  await page.waitForURL('/login');
}

// Use in tests
import { login, logout } from '../helpers/auth.helper';

test('should access protected page after login', async ({ page }) => {
  await login(page, 'test@example.com', 'password123');
  await page.goto('/dashboard/settings');
  // ... test logic
  await logout(page);
});
```

### Data Seeding Helper

```typescript
// e2e/helpers/seed.helper.ts
import { Page } from '@playwright/test';

export async function seedTestData(page: Page) {
  // Call API to seed test data
  await page.request.post('/api/test/seed', {
    data: {
      users: [
        { email: 'test@example.com', password: 'password123' },
      ],
      products: [
        { name: 'Test Product', price: 1000 },
      ],
    },
  });
}

export async function cleanupTestData(page: Page) {
  await page.request.post('/api/test/cleanup');
}

// Use in tests
import { seedTestData, cleanupTestData } from '../helpers/seed.helper';

test.beforeEach(async ({ page }) => {
  await seedTestData(page);
});

test.afterEach(async ({ page }) => {
  await cleanupTestData(page);
});
```

## Best Practices

### DO's ✅

- Test critical user journeys
- Use Page Object Model for complex pages
- Take screenshots on failure
- Use test data factories
- Test across multiple browsers
- Test responsive layouts
- Mock external services (payment gateways, etc.)
- Use descriptive test names
- Clean up test data after tests
- Use authentication helpers for protected pages

### DON'Ts ❌

- Don't test every single page (focus on critical flows)
- Don't duplicate coverage from unit/integration tests
- Don't use hard-coded waits (use `waitFor` instead)
- Don't test third-party integrations in detail
- Don't skip cleanup (can affect other tests)
- Don't use production data in tests
- Don't test implementation details
- Don't make tests dependent on each other

## Running E2E Tests

### Commands

```bash
# Run all E2E tests
pnpm exec playwright test

# Run specific test file
pnpm exec playwright test e2e/auth/login.spec.ts

# Run in headed mode (see browser)
pnpm exec playwright test --headed

# Run in debug mode
pnpm exec playwright test --debug

# Run in specific browser
pnpm exec playwright test --project=chromium

# Run with UI mode
pnpm exec playwright test --ui

# Generate test report
pnpm exec playwright show-report
```

### CI/CD Integration

```yaml
# .github/workflows/e2e.yml
name: E2E Tests

on:
  pull_request:
  push:
    branches: [main]

jobs:
  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: pnpm install

      - name: Install Playwright browsers
        run: pnpm exec playwright install --with-deps

      - name: Build application
        run: pnpm build

      - name: Run E2E tests
        run: pnpm exec playwright test

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```

## Debugging E2E Tests

### Playwright Inspector

```bash
# Run with inspector
pnpm exec playwright test --debug

# Run specific test with inspector
pnpm exec playwright test e2e/auth/login.spec.ts --debug
```

### Trace Viewer

```typescript
// Enable tracing
test.use({
  trace: 'on',
});

// After test failure, view trace
// pnpm exec playwright show-trace trace.zip
```

### Console Logging

```typescript
test('should log console messages', async ({ page }) => {
  page.on('console', (msg) => console.log('Browser console:', msg.text()));

  await page.goto('/');
  // Browser console logs will be printed
});
```

## Related Documentation

- **[testing-principles.md](./testing-principles.md)** - Core testing philosophy and what to test
- **[unit-testing.md](./unit-testing.md)** - Unit testing patterns for all DDD layers
- **[integration-testing.md](./integration-testing.md)** - Integration testing patterns

---

**Remember**: E2E tests are expensive and slow. Focus on critical user journeys and avoid duplicating coverage from unit and integration tests. Use Page Object Model to keep tests maintainable.
