# Troubleshooting Guide

> **Target Audience**: All developers, AI agents debugging issues
> **Reading Time**: 15 minutes (reference guide, read as needed)
> **Related Docs**: [core/architecture.md](./core/architecture.md), [ddd/di-server-containers.md](./ddd/di-server-containers.md), [ddd/di-client-containers.md](./ddd/di-client-containers.md)

## 📋 Quick Navigation

- [🔨 Build Errors](#-build-errors) — Compilation failures, module resolution
- [⚡ Runtime Errors](#-runtime-errors) — Server/Client mismatches, hydration issues
- [🏗️ DI Container Errors](#️-di-container-errors) — Container usage mistakes
- [🎯 Layer Violation Errors](#-layer-violation-errors) — Architecture boundary violations
- [⚙️ Configuration Errors](#️-configuration-errors) — Setup and config issues
- [🪝 Query Hook Errors](#-query-hook-errors) — TanStack Query issues
- [📝 Commit Errors](#-commit-errors) — Git commit failures

---

## 🔨 Build Errors

### Error 1: "You're importing a component that needs 'server-only'"

**Error Message**:
```
Error: You're importing a component that needs server-only.
That only works in a Server Component but one of its parents is marked with "use client",
so it's a Client Component.
```

**Symptoms**:
- Build fails with `server-only` error
- Error points to DI Container import
- Happens when importing from `@{domain}/di`

**Root Cause**: Barrel export in `di/index.ts` bundles BOTH Server and Client Containers, causing tree-shaking failure. Webpack cannot distinguish server-only code from client code, so `server-only` package gets bundled into client, triggering error.

**Solution**: Use direct imports instead of barrel exports for DI Containers.

```typescript
// ❌ WRONG: Barrel export
import { getUserClientContainer } from '@user/di';
// This imports from di/index.ts which exports BOTH containers
// Tree-shaking FAILS → server code in client bundle → BUILD FAILS

// ✅ CORRECT: Direct import
import { getUserClientContainer } from '@/src/domains/user/di/user-client-container';
// This imports ONLY client container
// Tree-shaking WORKS → no server code in client bundle → BUILD SUCCESS
```

**Related Documentation**:
- [ddd/di-server-containers.md](./ddd/di-server-containers.md#barrel-exports-prohibited)
- [ddd/di-client-containers.md](./ddd/di-client-containers.md#import-patterns)

---

### Error 2: TypeScript Path Alias Not Resolved

**Error Message**:
```
Cannot find module '@auth/domain/entities' or its corresponding type declarations.
```

**Symptoms**:
- TypeScript cannot resolve `@{domain}/*` imports
- IDE shows red squiggles on imports
- Build fails with "Cannot find module"

**Root Cause**: TypeScript path aliases not configured in `tsconfig.json` or incorrect path mapping.

**Solution**: Verify `tsconfig.json` includes correct path mappings.

```json
// tsconfig.json (apps/web)
{
  "compilerOptions": {
    "paths": {
      "@auth/*": ["./src/domains/auth/*"],
      "@user/*": ["./src/domains/user/*"],
      "@benefit/*": ["./src/domains/benefit/*"],
      "@cafeteria/*": ["./src/domains/cafeteria/*"],
      "@notification/*": ["./src/domains/notification/*"],
      "@stamp/*": ["./src/domains/stamp/*"],
      "@core/*": ["./src/core/*"]
    }
  }
}
```

**Verification Steps**:
1. Check `tsconfig.json` has correct `paths` configuration
2. Restart TypeScript server (VSCode: Cmd+Shift+P → "Restart TS Server")
3. Clear Next.js cache: `rm -rf .next && pnpm dev`

**Related Documentation**:
- [packages/monorepo-structure.md](./packages/monorepo-structure.md#typescript-path-aliases)

---

### Error 3: Vanilla Extract CSS Import Missing

**Error Message**:
```
TypeError: Cannot read properties of undefined (reading 'container')
```

**Symptoms**:
- Component styles not applied
- `vars.box.spacing[16]` returns `undefined`
- Console error: "Cannot read properties of undefined"

**Root Cause**: Missing CSS import for Vanilla Extract styles. Every package using Vanilla Extract requires importing `style.css`.

**Solution**: Import `style.css` from package at app entry point.

```typescript
// ❌ WRONG: Missing CSS import
import { Box } from '@nugudi/react-components-layout';
// styles.css NOT imported → vars undefined → runtime error

// ✅ CORRECT: Import CSS first
import '@nugudi/react-components-layout/style.css'; // Import CSS
import { Box } from '@nugudi/react-components-layout';

// apps/web/src/app/layout.tsx
import '@nugudi/react-components-layout/style.css';
import '@nugudi/react-components-typography/style.css';
import '@nugudi/themes/fds.module.css';
```

**Related Documentation**:
- [packages/package-setup.md](./packages/package-setup.md#two-step-setup)

---

### Error 4: Module Not Found After Package Install

**Error Message**:
```
Module not found: Can't resolve '@nugudi/react-components-layout'
```

**Symptoms**:
- Import shows error after installing package
- `pnpm install` completed successfully
- Package exists in `node_modules`

**Root Cause**: Incomplete TWO-STEP SETUP. Package must be added to both `package.json` AND CSS must be imported.

**Solution**: Complete both steps of package setup.

**Step 1**: Add to `package.json`
```json
{
  "dependencies": {
    "@nugudi/react-components-layout": "workspace:*"
  }
}
```

**Step 2**: Import CSS in layout
```typescript
// apps/web/src/app/layout.tsx
import '@nugudi/react-components-layout/style.css';
```

**Verification**:
```bash
# 1. Install dependencies
pnpm install

# 2. Clear cache and rebuild
rm -rf .next && pnpm dev
```

**Related Documentation**:
- [packages/package-setup.md](./packages/package-setup.md#troubleshooting)

---

## ⚡ Runtime Errors

### Error 5: State Leakage Between SSR Requests

**Error Message**:
```
Error: Different user data showing for different users
```

**Symptoms**:
- User A sees User B's data
- Inconsistent data between page loads
- Data "bleeding" between requests in production
- Works fine in development, fails in production

**Root Cause**: Using Client DI Container (lazy singleton) in Server Component. Singleton shares same instance across ALL SSR requests, causing state pollution between different users.

**Solution**: Use Server DI Container (factory pattern) in Server Components.

```typescript
// ❌ WRONG: Client Container in Server Component
const MyPage = async () => {
  const container = getUserClientContainer(); // ❌ SINGLETON in SSR!
  const useCase = container.getGetMyProfile();
  const profile = await useCase.execute();
  // User A's request → creates singleton
  // User B's request → REUSES same singleton → sees User A's data!
};

// ✅ CORRECT: Server Container in Server Component
const MyPage = async () => {
  const sessionManager = new ServerSessionManager(); // ✅ New instance per request
  const container = createUserServerContainer(sessionManager); // ✅ Factory pattern
  const useCase = container.getGetMyProfile();
  const profile = await useCase.execute();
  // User A's request → new container instance
  // User B's request → NEW container instance → isolated state
};
```

**Why This Happens**:
- Client Container uses lazy singleton pattern (one instance for all)
- Server Components execute on EVERY request
- Same singleton gets reused → state pollution

**Related Documentation**:
- [ddd/di-server-containers.md](./ddd/di-server-containers.md#why-factory-pattern)
- [core/architecture.md](./core/architecture.md#must-not)

---

### Error 6: Hydration Mismatch

**Error Message**:
```
Warning: Text content did not match. Server: "User A" Client: "User B"
Hydration failed because the initial UI does not match what was rendered on the server.
```

**Symptoms**:
- Console warning about hydration mismatch
- UI flickers/jumps after page load
- Different content server vs client

**Root Cause**: Server and Client rendering different content. Common causes:
1. Using `Date.now()` or `Math.random()` directly in render
2. Conditional rendering based on `window` object
3. Using different data sources (server prefetch vs client fetch)

**Solution**: Ensure server and client render identical content.

```typescript
// ❌ WRONG: Different server/client render
const MyComponent = () => {
  const timestamp = Date.now(); // Different on server vs client!
  return <div>{timestamp}</div>;
};

// ✅ CORRECT: Use useEffect for client-only code
const MyComponent = () => {
  const [timestamp, setTimestamp] = useState<number | null>(null);

  useEffect(() => {
    setTimestamp(Date.now()); // Only runs on client
  }, []);

  return <div>{timestamp ?? 'Loading...'}</div>;
};

// ✅ CORRECT: Suppress hydration warning if intentional
<div suppressHydrationWarning>{Date.now()}</div>
```

**For TanStack Query Hydration**:
```typescript
// ✅ CORRECT: Ensure same queryKey and queryFn
// Page (Server)
await queryClient.prefetchQuery({
  queryKey: ['user', 'profile'],
  queryFn: () => container.getGetMyProfile().execute(),
});

// Section (Client)
const { data } = useSuspenseQuery({
  queryKey: ['user', 'profile'], // MUST MATCH server
  queryFn: () => container.getGetMyProfile().execute(), // MUST MATCH server
});
```

**Related Documentation**:
- [frontend/page-patterns.md](./frontend/page-patterns.md#ssr-data-prefetch)
- [frontend/section-patterns.md](./frontend/section-patterns.md#query-hooks)

---

### Error 7: Missing SessionManager Parameter

**Error Message**:
```
Error: Cannot read properties of undefined (reading 'getAccessToken')
```

**Symptoms**:
- Runtime error in Server Component
- `sessionManager.getAccessToken()` fails
- HttpClient cannot authenticate requests

**Root Cause**: Server Container requires `SessionManager` parameter but it was not provided.

**Solution**: Always pass `SessionManager` to Server Container.

```typescript
// ❌ WRONG: Missing SessionManager
const container = createUserServerContainer(); // Type error!

// ✅ CORRECT: Pass SessionManager
import { ServerSessionManager } from '@core/infrastructure/session/server-session-manager';

const sessionManager = new ServerSessionManager();
const container = createUserServerContainer(sessionManager);
```

**Related Documentation**:
- [ddd/di-server-containers.md](./ddd/di-server-containers.md#sessionmanager-requirement)

---

## 🏗️ DI Container Errors

### Error 8: Direct Instantiation of Repository/UseCase

**Error Message**:
```
Error: HttpClient is not defined
TypeError: Cannot read properties of undefined
```

**Symptoms**:
- Runtime error when calling UseCase
- Dependencies are `undefined`
- Manual dependency wiring required

**Root Cause**: Directly instantiating Repository/UseCase bypasses dependency injection, requiring manual wiring of all dependencies.

**Solution**: ALWAYS use DI Container to get UseCases.

```typescript
// ❌ WRONG: Direct instantiation
const httpClient = new HttpClient(/* ... */);
const tokenProvider = new TokenProvider(/* ... */);
const sessionManager = new SessionManager(/* ... */);
const repository = new UserRepository(httpClient);
const useCase = new GetUserProfileUseCase(repository);
// Manual wiring, error-prone, not testable

// ✅ CORRECT: Use DI Container
const container = getUserClientContainer();
const useCase = container.getGetMyProfile();
// Container handles ALL dependencies automatically
```

**Related Documentation**:
- [core/architecture.md](./core/architecture.md#must-not)
- [ddd/di-client-containers.md](./ddd/di-client-containers.md#usage-in-hooks)

---

### Error 9: Wrong Container Type for Component Type

**Error Message**:
```
Error: sessionManager.getAccessToken is not a function
```

**Symptoms**:
- Runtime error in Client Component
- Server Container used in client-side code
- Factory pattern fails in browser

**Root Cause**: Using Server Container in Client Component. Server Container expects `SessionManager` parameter which doesn't exist in browser context.

**Solution**: Use correct Container type for component type.

```typescript
// ❌ WRONG: Server Container in Client Component
'use client';
const MySection = () => {
  const sessionManager = new ServerSessionManager(); // ❌ Server-only!
  const container = createUserServerContainer(sessionManager);
  // Fails in browser
};

// ✅ CORRECT: Client Container in Client Component
'use client';
const MySection = () => {
  const container = getUserClientContainer(); // ✅ Lazy singleton
  const { data } = useSuspenseQuery({
    queryKey: ['user', 'profile'],
    queryFn: () => container.getGetMyProfile().execute(),
  });
};
```

**Decision Tree**:
```
Where am I calling the UseCase?
├─ Server Component/Page → Use Server Container (createXXXServerContainer())
├─ Client Component/Hook → Use Client Container (getXXXClientContainer())
└─ Server Action → Use Server Container (createXXXServerContainer())
```

**Related Documentation**:
- [ddd/di-server-containers.md](./ddd/di-server-containers.md#server-vs-client)
- [ddd/di-client-containers.md](./ddd/di-client-containers.md#client-only)

---

## 🎯 Layer Violation Errors

### Error 10: Page Directly Calling Repository

**Error Message**:
```
TypeScript Error: Property 'getUserRepository' does not exist on type 'UserClientContainer'
```

**Symptoms**:
- Page trying to access Repository directly
- Skipping UseCase layer
- Business logic in Presentation layer

**Root Cause**: Layer hierarchy violation. Presentation layer should NEVER directly access Data layer. Must go through Domain layer (UseCase).

**Solution**: Always access Repository through UseCase.

```typescript
// ❌ WRONG: Page → Repository (skipping UseCase)
const MyPage = async () => {
  const container = getUserClientContainer();
  const repository = container.getUserRepository(); // ❌ No such method!
  const user = await repository.getById(id); // ❌ Layer violation!
};

// ✅ CORRECT: Page → UseCase → Repository
const MyPage = async () => {
  const container = getUserClientContainer();
  const useCase = container.getGetMyProfile(); // ✅ Get UseCase
  const user = await useCase.execute(); // ✅ Through UseCase
};
```

**Why This Rule Exists**:
- Business logic centralization in UseCase
- Testability (mock UseCase, not Repository)
- Single Responsibility Principle
- Proper layer separation

**Related Documentation**:
- [core/architecture.md](./core/architecture.md#must-not)
- [ddd/usecase-patterns.md](./ddd/usecase-patterns.md#purpose)

---

### Error 11: Cross-Domain Imports

**Error Message**:
```
Error: Circular dependency detected between domains
```

**Symptoms**:
- Import from another domain's internals
- Tight coupling between domains
- Circular dependency errors

**Root Cause**: Domains should be isolated bounded contexts. Cross-domain imports violate domain boundaries and create tight coupling.

**Solution**: Use `@core` for shared code or duplicate types.

```typescript
// ❌ WRONG: Cross-domain import
// In @benefit domain
import { UserEntity } from '@user/domain/entities';
// Creates dependency: benefit → user

// ✅ CORRECT: Use @core for shared types
// In @core/types/user.ts
export type UserId = string;

// In @benefit domain
import type { UserId } from '@core/types/user';
// No domain dependency

// ✅ CORRECT: Duplicate type if domain-specific
// In @benefit domain
type BenefitUserId = string; // Duplicate if semantically different
```

**Related Documentation**:
- [core/architecture.md](./core/architecture.md#must)
- [packages/monorepo-structure.md](./packages/monorepo-structure.md#domain-isolation)

---

## ⚙️ Configuration Errors

### Error 12: Missing Package Dependency

**Error Message**:
```
Module not found: Can't resolve '@nugudi/themes'
```

**Symptoms**:
- Build fails with "Module not found"
- Package exists in monorepo but not in `package.json`
- Import shows TypeScript error

**Root Cause**: Package not added to `package.json` dependencies.

**Solution**: Add package to `package.json` and install.

```bash
# 1. Add to package.json
{
  "dependencies": {
    "@nugudi/themes": "workspace:*"
  }
}

# 2. Install
pnpm install

# 3. Verify
pnpm list @nugudi/themes
```

**Related Documentation**:
- [packages/package-setup.md](./packages/package-setup.md#step-1)

---

### Error 13: Next.js Config Missing Path Rewrites

**Error Message**:
```
404 | This page could not be found.
```

**Symptoms**:
- API routes return 404
- Routes work locally but fail in production
- Missing route rewrites

**Root Cause**: `next.config.js` missing custom route configuration.

**Solution**: Verify `next.config.js` includes necessary rewrites.

```javascript
// next.config.js
module.exports = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://api.example.com/:path*',
      },
    ];
  },
};
```

**Related Documentation**:
- [packages/monorepo-structure.md](./packages/monorepo-structure.md#nextjs-configuration)

---

## 🪝 Query Hook Errors

### Error 14: Using Deprecated Factory Pattern

**Error Message**:
```
Warning: Factory pattern is deprecated. Use Client Container directly.
```

**Symptoms**:
- Query Hook uses Factory pattern
- Old codebase pattern
- Migration needed

**Root Cause**: Legacy Query Hook pattern used Factory. New pattern uses Client Container directly.

**Solution**: Migrate to Client Container pattern.

```typescript
// ❌ DEPRECATED: Factory pattern
export const useUserProfile = () => {
  return useSuspenseQuery({
    queryKey: ['user', 'profile'],
    queryFn: async () => {
      const repository = UserRepositoryFactory.create(); // ❌ Deprecated
      return repository.getProfile();
    },
  });
};

// ✅ CORRECT: Client Container pattern
export const useUserProfile = () => {
  const container = getUserClientContainer(); // ✅ Get Container

  return useSuspenseQuery({
    queryKey: ['user', 'profile'],
    queryFn: () => container.getGetMyProfile().execute(), // ✅ Get UseCase
  });
};
```

**Related Documentation**:
- [patterns/query-hooks.md](./patterns/query-hooks.md#basic-pattern)
- [patterns/migration-guide.md](./patterns/migration-guide.md#factory-to-container)

---

### Error 15: Missing Suspense Boundary

**Error Message**:
```
Error: useSuspenseQuery must be wrapped in <Suspense>
```

**Symptoms**:
- Runtime error when using `useSuspenseQuery`
- Component throws error during render
- Missing Suspense boundary

**Root Cause**: `useSuspenseQuery` requires `<Suspense>` boundary in parent component.

**Solution**: Wrap component in `<Suspense>` with fallback.

```typescript
// ❌ WRONG: No Suspense boundary
const MyView = () => {
  return <MySection />; // Section uses useSuspenseQuery → ERROR!
};

// ✅ CORRECT: Suspense boundary
import { Suspense } from 'react';

const MyView = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MySection /> {/* useSuspenseQuery works */}
    </Suspense>
  );
};
```

**Best Practice**: Add Suspense in View layer, data fetch in Section layer.

**Related Documentation**:
- [frontend/view-patterns.md](./frontend/view-patterns.md#suspense-boundaries)
- [frontend/section-patterns.md](./frontend/section-patterns.md#suspense-error-handling)

---

### Error 16: Cache Invalidation Not Working

**Error Message**:
```
// No error, but data not refetching after mutation
```

**Symptoms**:
- Mutation succeeds but UI doesn't update
- Manual refresh shows new data
- Cache invalidation not triggering

**Root Cause**: Incorrect query key in `invalidateQueries` or mismatch with query key in useQuery.

**Solution**: Use exact same query key for invalidation.

```typescript
// ❌ WRONG: Mismatched query keys
// Query
const { data } = useSuspenseQuery({
  queryKey: ['user', 'profile', userId], // 3 parts
  queryFn: () => container.getGetUserProfile().execute(userId),
});

// Mutation
mutationFn: () => container.getUpdateUserProfile().execute(data),
onSuccess: () => {
  queryClient.invalidateQueries({
    queryKey: ['user', 'profile'], // 2 parts → DOESN'T MATCH!
  });
}

// ✅ CORRECT: Exact match
// Query
const { data } = useSuspenseQuery({
  queryKey: ['user', 'profile', userId],
  queryFn: () => container.getGetUserProfile().execute(userId),
});

// Mutation
onSuccess: () => {
  queryClient.invalidateQueries({
    queryKey: ['user', 'profile', userId], // Exact match
  });
  // OR invalidate all profiles
  queryClient.invalidateQueries({
    queryKey: ['user', 'profile'], // Prefix match
  });
}
```

**Related Documentation**:
- [patterns/query-keys.md](./patterns/query-keys.md#invalidation-patterns)
- [patterns/mutation-hooks.md](./patterns/mutation-hooks.md#cache-invalidation)

---

## 📝 Commit Errors

### Error 17: Co-Author Lines Break CI/CD (CRITICAL)

**Error Message**:
```
commit-msg hook failed:
✖   body must not contain Co-Authored-By trailer
```

**Symptoms**:
- Git commit rejected by commitlint
- CI/CD pipeline fails
- Cannot push to repository

**Root Cause**: commitlint.config.ts explicitly rejects Co-Author lines. This is CRITICAL project rule.

**Solution**: NEVER add Co-Author lines to commits.

```bash
# ❌ WRONG: Co-Author breaks CI/CD
git commit -m "[NUGUDI-105] feat(react): BottomSheet 구현

Co-Authored-By: Claude <noreply@anthropic.com>"
# ✖ REJECTED by commitlint

# ✅ CORRECT: No Co-Author
git commit -m "[NUGUDI-105] feat(react): BottomSheet 구현

- Backdrop과 함께 동작하는 BottomSheet 컴포넌트 추가
- 스와이프 제스처 지원"
# ✓ ACCEPTED
```

**Related Documentation**:
- [core/commit-conventions.md](./core/commit-conventions.md#must-not)

---

### Error 18: Subject Line Too Long

**Error Message**:
```
commit-msg hook failed:
✖   subject must not be longer than 72 characters
```

**Symptoms**:
- Commit rejected by commitlint
- Subject line exceeds 72 characters
- Message appears to follow format otherwise

**Root Cause**: commitlint enforces 72-character subject limit for Git tool compatibility.

**Solution**: Keep subject under 72 characters, move details to body.

```bash
# ❌ WRONG: 78 characters (exceeds limit)
git commit -m "[NUGUDI-105] feat(react): BottomSheet 컴포넌트를 구현하고 Backdrop과 통합했습니다"
#            ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

# ✅ CORRECT: 48 characters + body
git commit -m "[NUGUDI-105] feat(react): BottomSheet 컴포넌트 구현

- Backdrop과 함께 동작하는 BottomSheet 추가
- 스와이프 제스처 지원
- Portal을 사용한 모달 렌더링"
```

**Tip**: Count characters AFTER `type(scope): ` part.

**Related Documentation**:
- [core/commit-conventions.md](./core/commit-conventions.md#must)

---

### Error 19: Missing Ticket Number

**Error Message**:
```
commit-msg hook failed:
✖   subject must start with ticket number [NUGUDI-XXX]
```

**Symptoms**:
- Commit rejected by commitlint
- Missing `[NUGUDI-XXX]` prefix
- Branch has ticket number but commit doesn't

**Root Cause**: Commit message must include ticket number from branch name.

**Solution**: Extract ticket number from branch name and include in commit.

```bash
# Branch: feature/NUGUDI-105-bottomsheet

# ❌ WRONG: Missing ticket number
git commit -m "feat(react): BottomSheet 추가"

# ✅ CORRECT: Ticket number included
git commit -m "[NUGUDI-105] feat(react): BottomSheet 추가"
```

**Automatic Extraction**:
```bash
# Get ticket from branch name
git rev-parse --abbrev-ref HEAD
# Output: feature/NUGUDI-105-bottomsheet

# Extract NUGUDI-105
[NUGUDI-105]
```

**Related Documentation**:
- [core/commit-conventions.md](./core/commit-conventions.md#ticket-number-extraction)

---

## 🔍 Diagnostic Commands

### Check Build Status
```bash
# Check for build errors
pnpm build

# Check TypeScript errors
pnpm check-types

# Check linting errors
pnpm biome check
```

### Check Container Usage
```bash
# Search for barrel exports (should be none)
grep -r "export \* from" apps/web/src/domains/*/di/

# Search for direct instantiation (should be none in production code)
grep -r "new.*Repository(" apps/web/src/domains/*/presentation/

# Search for wrong Container in Server Components
grep -A 5 "getClientContainer" apps/web/src/app/
```

### Check Package Setup
```bash
# Verify package installation
pnpm list @nugudi/react-components-layout

# Check CSS imports
grep -r "@nugudi.*style.css" apps/web/src/app/layout.tsx

# Verify TypeScript paths
cat apps/web/tsconfig.json | grep -A 10 "paths"
```

### Check Commit Format
```bash
# Test commit message (before committing)
echo "[NUGUDI-105] feat(react): BottomSheet 추가" | pnpm commitlint --from=stdin

# Check recent commits
git log --oneline -10
```

---

## 🆘 Still Stuck?

If error not covered here:

1. **Search documentation**: Use Cmd+F in [CLAUDE.md](../CLAUDE.md) for related docs
2. **Check related files**: Error often points to specific file - read that file's related docs
3. **Verify prerequisites**: Did you complete TWO-STEP SETUP for packages?
4. **Check git status**: Are you on correct branch with clean state?
5. **Clear caches**: `rm -rf .next node_modules && pnpm install && pnpm dev`

**Common Debug Flow**:
```
1. Read error message carefully
2. Check this troubleshooting guide
3. Read related documentation
4. Verify your code matches ✅ CORRECT examples
5. Clear caches and rebuild
6. If still failing, check git diff for recent changes
```

---

## 📚 Related Documentation

- **[core/architecture.md](./core/architecture.md)** — Architectural rules, layer hierarchy
- **[core/commit-conventions.md](./core/commit-conventions.md)** — Commit format rules
- **[ddd/di-server-containers.md](./ddd/di-server-containers.md)** — Server Container usage
- **[ddd/di-client-containers.md](./ddd/di-client-containers.md)** — Client Container usage
- **[frontend/component-hierarchy.md](./frontend/component-hierarchy.md)** — Component layer rules
- **[packages/package-setup.md](./packages/package-setup.md)** — Package setup guide
- **[patterns/migration-guide.md](./patterns/migration-guide.md)** — Legacy code migration

---

**Remember**: Most errors stem from violating architectural rules. When in doubt, re-read the documentation for the pattern you're trying to implement.
