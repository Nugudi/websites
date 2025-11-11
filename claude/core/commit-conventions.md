---
description: "Git commit message format, types, scopes, ticket numbers, and conventions"
globs:
  - "**/*"
alwaysApply: true
---

# Commit Conventions Guide

> **Target Audience**: All developers, AI agents making commits
> **Reading Time**: 3 minutes
> **Related Docs**: [../packages/monorepo-structure.md](../packages/monorepo-structure.md) for monorepo structure

## 📝 Commit Message Format

All commit messages MUST follow the format defined in `commitlint.config.ts`:

```
[NUGUDI-{번호}] {type}({scope}): {subject}

{body}
```

### Format Components

| Component         | Required    | Description                                     | Example                     |
| ----------------- | ----------- | ----------------------------------------------- | --------------------------- |
| **Ticket Number** | ✅ YES      | Linear ticket number extracted from branch name | `[NUGUDI-105]`              |
| **Type**          | ✅ YES      | Commit type (see below)                         | `feat`, `fix`, `docs`       |
| **Scope**         | ⚠️ OPTIONAL | Affected package or domain                      | `(react)`, `(auth)`         |
| **Subject**       | ✅ YES      | Brief description (max 72 chars)                | `BottomSheet 컴포넌트 구현` |
| **Body**          | ⚠️ OPTIONAL | Detailed explanation (100 chars per line)       | Multi-line description      |

## 📋 Commit Types

| Type         | Purpose               | When to Use                                           | Example                                     |
| ------------ | --------------------- | ----------------------------------------------------- | ------------------------------------------- |
| **feat**     | 신규 기능 추가        | New feature, component, hook, or capability           | `feat(react): BottomSheet 컴포넌트 추가`    |
| **fix**      | 버그 수정             | Bug fixes, error corrections                          | `fix(auth): 로그인 토큰 갱신 오류 수정`     |
| **docs**     | 문서 수정             | README, documentation, comments                       | `docs: Adapter pattern 가이드 추가`         |
| **style**    | 코드 스타일 수정      | Formatting, whitespace, semicolons (NO logic changes) | `style(react): Biome 규칙에 맞게 포맷팅`    |
| **refactor** | 코드 리팩토링         | Code restructuring (NO functionality changes)         | `refactor(auth): UseCase 레이어 분리`       |
| **test**     | 테스트 코드 추가/수정 | Test files, test cases                                | `test(auth): LoginUseCase 단위 테스트 추가` |
| **chore**    | 빌드, 설정, 패키지 등 | Build scripts, configs, dependencies                  | `chore: pnpm 의존성 업데이트`               |
| **perf**     | 성능 개선             | Performance optimizations                             | `perf(cafeteria): 이미지 로딩 최적화`       |
| **ci**       | CI 관련 변경          | GitHub Actions, CI/CD configs                         | `ci: GitHub Actions 워크플로우 수정`        |

## 🎯 Scope Guidelines

### Domain Scopes

Use domain names when changes affect a specific domain:

- `(auth)` - Authentication domain
- `(benefit)` - Benefit domain
- `(cafeteria)` - Cafeteria domain
- `(notification)` - Notification domain
- `(stamp)` - Stamp domain
- `(user)` - User domain

### Package Scopes

Use package names when changes affect shared packages:

- `(react)` - `@nugudi/react-components-*` or `@nugudi/react-hooks-*`
- `(themes)` - `@nugudi/themes`
- `(ui)` - `packages/ui` (Storybook)

### Monorepo Scopes

Use these for cross-cutting changes:

- `(web)` - Next.js app-level changes
- `(monorepo)` - Root-level monorepo changes

## 📏 Commit Rules

### ✅ MUST

1. **MUST** include ticket number from branch name

   - Branch: `feature/NUGUDI-105-bottomsheet` → Commit: `[NUGUDI-105]`

2. **MUST** use one of the defined commit types

   - Valid: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `perf`, `ci`

3. **MUST** keep subject line under 72 characters

   - Subject is after `{type}({scope}):`

4. **MUST** keep body lines under 100 characters

   - Use line breaks for longer descriptions

5. **MUST** use imperative mood in subject

   - ✅ CORRECT: `feat(react): BottomSheet 컴포넌트 추가`
   - ❌ WRONG: `feat(react): BottomSheet 컴포넌트를 추가했음`

6. **MUST** write commit messages in Korean for this project
   - This is a project-specific convention

### ❌ MUST NOT

1. **MUST NOT** add Co-Author lines

   - ❌ NO `Co-Authored-By: Claude <noreply@anthropic.com>`
   - ❌ NO `Co-Authored-By: GitHub Copilot <...>`
   - ⚠️ **CRITICAL**: This breaks our CI/CD pipeline

2. **MUST NOT** exceed subject line limit (72 chars)

   - Commitlint will reject the commit

3. **MUST NOT** exceed body line limit (100 chars)

   - Commitlint will reject the commit

4. **MUST NOT** use undefined commit types

   - Only use the 9 types listed above

5. **MUST NOT** mix multiple types in one commit
   - ❌ WRONG: `feat+fix(auth): 로그인 추가 및 버그 수정`
   - ✅ CORRECT: Split into two commits

## 💡 Examples

### Example 1: New Feature

```bash
git commit -m "[NUGUDI-105] feat(react): BottomSheet 컴포넌트 구현

- Backdrop과 함께 동작하는 BottomSheet 컴포넌트 추가
- 스와이프 제스처 지원
- Portal을 사용한 모달 렌더링"
```

### Example 2: Bug Fix

```bash
git commit -m "[NUGUDI-203] fix(auth): 토큰 갱신 시 세션 만료 오류 수정

SessionManager에서 토큰 갱신 시 기존 세션이 만료되는 버그 수정
RefreshTokenUseCase에서 세션 유지 로직 추가"
```

### Example 3: Documentation

```bash
git commit -m "[NUGUDI-201] docs: Clean Architecture 가이드 추가

- architecture.md: 고수준 아키텍처 개요 추가
- di-containers.md: DI Container 패턴 가이드 추가
- adapter-pattern.md: Adapter 패턴 상세 가이드 추가"
```

### Example 4: Refactoring

```bash
git commit -m "[NUGUDI-150] refactor(auth): Repository 레이어 분리

AuthRepository를 인터페이스와 구현체로 분리
- domain/repositories/auth.repository.ts: 인터페이스 정의
- data/repositories/auth.repository.impl.ts: 구현체"
```

### Example 5: Test

```bash
git commit -m "[NUGUDI-180] test(auth): LoginUseCase 단위 테스트 추가

- Mock Repository를 사용한 UseCase 테스트
- 성공/실패 시나리오 커버리지 100%"
```

### Example 6: Style (Formatting)

```bash
git commit -m "[NUGUDI-190] style: Biome 규칙에 맞게 전체 포맷팅

pnpm biome check --apply로 전체 코드베이스 포맷팅 적용"
```

### Example 7: Chore (Dependencies)

```bash
git commit -m "[NUGUDI-175] chore: pnpm 의존성 업데이트

- @tanstack/react-query 5.61.7 → 5.62.0
- next 16.0.0 → 16.0.1
- react 19.0.0 → 19.0.1"
```

## ⚠️ Common Mistakes

### Mistake 1: Co-Author Lines (CRITICAL)

```bash
# ❌ WRONG - Co-Author breaks CI/CD
git commit -m "[NUGUDI-105] feat(react): BottomSheet 구현

Co-Authored-By: Claude <noreply@anthropic.com>"

# ✅ CORRECT - No Co-Author
git commit -m "[NUGUDI-105] feat(react): BottomSheet 구현

- Backdrop과 함께 동작하는 BottomSheet 컴포넌트 추가"
```

### Mistake 2: Missing Ticket Number

```bash
# ❌ WRONG - No ticket number
git commit -m "feat(react): BottomSheet 추가"

# ✅ CORRECT - Ticket number included
git commit -m "[NUGUDI-105] feat(react): BottomSheet 추가"
```

### Mistake 3: Subject Line Too Long

```bash
# ❌ WRONG - 73 characters (exceeds 72 limit)
git commit -m "[NUGUDI-105] feat(react): BottomSheet 컴포넌트를 구현하고 Backdrop과 통합했습니다"

# ✅ CORRECT - 60 characters
git commit -m "[NUGUDI-105] feat(react): BottomSheet 컴포넌트 구현

- Backdrop과 함께 동작하는 BottomSheet 추가"
```

### Mistake 4: Wrong Commit Type

```bash
# ❌ WRONG - 'add' is not a valid type
git commit -m "[NUGUDI-105] add(react): BottomSheet 추가"

# ✅ CORRECT - Use 'feat' for new features
git commit -m "[NUGUDI-105] feat(react): BottomSheet 추가"
```

### Mistake 5: Mixed Types

```bash
# ❌ WRONG - Multiple types mixed
git commit -m "[NUGUDI-105] feat+fix(auth): 로그인 추가 및 버그 수정"

# ✅ CORRECT - Split into separate commits
git commit -m "[NUGUDI-105] feat(auth): 소셜 로그인 추가"
git commit -m "[NUGUDI-105] fix(auth): 토큰 갱신 버그 수정"
```

## 🔍 Ticket Number Extraction

The ticket number is automatically extracted from your branch name:

| Branch Name                      | Extracted Ticket | Commit Prefix  |
| -------------------------------- | ---------------- | -------------- |
| `feature/NUGUDI-105-bottomsheet` | `NUGUDI-105`     | `[NUGUDI-105]` |
| `fix/NUGUDI-203-token-refresh`   | `NUGUDI-203`     | `[NUGUDI-203]` |
| `refactor/NUGUDI-150-repository` | `NUGUDI-150`     | `[NUGUDI-150]` |

**Branch Naming Pattern**: `{type}/NUGUDI-{number}-{description}`

## 📚 Related Documents

- **[../packages/monorepo-structure.md](../packages/monorepo-structure.md)** — Monorepo structure, technology stack
- **[architecture.md](./architecture.md)** — High-level architecture overview
- **[../frontend/component-hierarchy.md](../frontend/component-hierarchy.md)** — Frontend development patterns

## 🔗 Configuration Files

- **`commitlint.config.ts`** — Commit message linting rules
- **`.husky/commit-msg`** — Pre-commit hook that runs commitlint

---

**Key Takeaway**: NEVER add Co-Author lines to commits. This breaks our CI/CD pipeline and will cause your commits to be rejected.
