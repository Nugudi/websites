---
description: Git commit message format and conventions
globs:
  - "**/*"
alwaysApply: true
---

# Commit Convention Rules

## Table of Contents

- [Format](#format)
- [Commit Types (9 types only)](#commit-types-9-types-only)
- [Scope Options](#scope-options)
- [MUST Rules](#must-rules)
- [NEVER Rules (CRITICAL)](#never-rules-critical)
- [Quick Examples](#quick-examples)
- [Branch Naming Pattern](#branch-naming-pattern)
- [Configuration Files](#configuration-files)

## Format

```
[NUGUDI-{번호}] {type}({scope}): {subject}

{body}
```

### Components

| Component | Required | Max Length | Example |
|-----------|----------|------------|---------|
| **Ticket Number** | ✅ YES | - | `[NUGUDI-105]` |
| **Type** | ✅ YES | - | `feat`, `fix`, `docs` |
| **Scope** | ⚠️ OPTIONAL | - | `(react)`, `(auth)` |
| **Subject** | ✅ YES | 72 chars | `BottomSheet 컴포넌트 구현` |
| **Body** | ⚠️ OPTIONAL | 100 chars/line | Multi-line description |

## Commit Types (9 types only)

| Type | When to Use | Example |
|------|-------------|---------|
| **feat** | New feature, component, hook | `feat(react): BottomSheet 추가` |
| **fix** | Bug fixes, error corrections | `fix(auth): 토큰 갱신 오류 수정` |
| **docs** | Documentation, README, comments | `docs: Adapter pattern 가이드 추가` |
| **style** | Formatting (NO logic changes) | `style(react): Biome 포맷팅` |
| **refactor** | Code restructuring (NO functionality changes) | `refactor(auth): UseCase 분리` |
| **test** | Test files, test cases | `test(auth): LoginUseCase 테스트` |
| **chore** | Build, configs, dependencies | `chore: pnpm 의존성 업데이트` |
| **perf** | Performance optimizations | `perf(cafeteria): 이미지 최적화` |
| **ci** | CI/CD configs | `ci: GitHub Actions 수정` |

## Scope Options

### Domain Scopes
- `(auth)`, `(benefit)`, `(cafeteria)`, `(notification)`, `(stamp)`, `(user)`

### Package Scopes
- `(react)` - `@nugudi/react-components-*` or `@nugudi/react-hooks-*`
- `(themes)` - `@nugudi/themes`
- `(ui)` - `packages/ui` (Storybook)

### Monorepo Scopes
- `(web)` - Next.js app-level
- `(monorepo)` - Root-level

## MUST Rules

1. **MUST** include ticket number from branch name
   - Branch: `feature/NUGUDI-105-bottomsheet` → `[NUGUDI-105]`

2. **MUST** use defined types only (feat, fix, docs, style, refactor, test, chore, perf, ci)

3. **MUST** keep subject under 72 characters

4. **MUST** keep body lines under 100 characters

5. **MUST** use imperative mood
   - ✅ `BottomSheet 추가`
   - ❌ `BottomSheet를 추가했음`

6. **MUST** write in Korean (project convention)

## NEVER Rules (CRITICAL)

1. **NEVER** add Co-Author lines
   - ❌ `Co-Authored-By: Claude <noreply@anthropic.com>`
   - ❌ `Co-Authored-By: GitHub Copilot <...>`
   - ⚠️ **This breaks CI/CD pipeline**

2. **NEVER** exceed subject limit (72 chars) → Commitlint rejects

3. **NEVER** exceed body limit (100 chars/line) → Commitlint rejects

4. **NEVER** use undefined types (only 9 types allowed)

5. **NEVER** mix multiple types
   - ❌ `feat+fix(auth): 로그인 추가 및 버그 수정`
   - ✅ Split into two commits

**Why These NEVER Rules Exist:**

1. **Why NEVER add Co-Author lines?** 🚨 **MOST CRITICAL**
   - **CI/CD Breakage**: Commitlint config does NOT allow Co-Author trailers
   - **Build Pipeline Failure**: Pre-commit hook runs commitlint → Rejects commit → Blocks push
   - **Team Convention**: This project attributes work through commit author, not co-authors
   - **AI Agent Safety**: AI tools (Claude, Copilot) often auto-add these lines → Always remove them
   - **Git History**: Co-Authors pollute git log, making it harder to track actual contributors

2. **Why NEVER exceed subject limit (72 chars)?**
   - **Git Log Display**: 72 chars fits in standard terminal width (80 cols with decorations)
   - **GitHub UI**: Truncates subjects beyond 72 chars with "..." (loses information)
   - **Commitlint Enforcement**: Automated rejection prevents merging
   - **Readability**: Short subjects force clear, concise messaging

3. **Why NEVER exceed body limit (100 chars/line)?**
   - **Terminal Readability**: Long lines wrap awkwardly in `git log`
   - **Code Review**: GitHub/GitLab diff view has limited width
   - **Best Practice**: Industry standard from Linux kernel conventions
   - **Commitlint Enforcement**: Automated rejection

4. **Why NEVER use undefined types?**
   - **Changelog Generation**: Only defined types (9 types) get included in CHANGELOG
   - **Semantic Versioning**: Types map to version bumps (feat = minor, fix = patch)
   - **Team Understanding**: Everyone knows what `feat`, `fix`, `refactor` mean
   - **CI/CD Automation**: Scripts rely on type classification for release notes

5. **Why NEVER mix multiple types?**
   - **Atomic Commits**: Each commit should do ONE thing (Single Responsibility)
   - **Revert Safety**: Can't partially revert a mixed commit
   - **Changelog Clarity**: Mixed commits confuse changelog categorization
   - **Code Review**: Easier to review focused commits
   - **Git Bisect**: Binary search for bugs works better with atomic commits

## Quick Examples

### ✅ CORRECT

```bash
# Feature
git commit -m "[NUGUDI-105] feat(react): BottomSheet 컴포넌트 구현

- Backdrop과 함께 동작하는 BottomSheet 추가
- 스와이프 제스처 지원"

# Bug Fix
git commit -m "[NUGUDI-203] fix(auth): 토큰 갱신 오류 수정

SessionManager에서 세션 유지 로직 추가"

# Documentation
git commit -m "[NUGUDI-201] docs: Clean Architecture 가이드 추가

- architecture.md, di-containers.md, adapter-pattern.md"
```

### ❌ WRONG

```bash
# ❌ Co-Author breaks CI/CD
git commit -m "[NUGUDI-105] feat(react): BottomSheet 구현

Co-Authored-By: Claude <noreply@anthropic.com>"

# ❌ Missing ticket number
git commit -m "feat(react): BottomSheet 추가"

# ❌ Subject too long (73 chars)
git commit -m "[NUGUDI-105] feat(react): BottomSheet 컴포넌트를 구현하고 Backdrop과 통합했습니다"

# ❌ Invalid type
git commit -m "[NUGUDI-105] add(react): BottomSheet 추가"

# ❌ Mixed types
git commit -m "[NUGUDI-105] feat+fix(auth): 로그인 추가 및 버그 수정"
```

## Branch Naming Pattern

`{type}/NUGUDI-{number}-{description}`

| Branch | Extracted Ticket | Commit Prefix |
|--------|------------------|---------------|
| `feature/NUGUDI-105-bottomsheet` | `NUGUDI-105` | `[NUGUDI-105]` |
| `fix/NUGUDI-203-token-refresh` | `NUGUDI-203` | `[NUGUDI-203]` |

## Configuration Files

- `commitlint.config.ts` - Linting rules
- `.husky/commit-msg` - Pre-commit hook

---

**Key Takeaway**: NEVER add Co-Author lines - breaks CI/CD pipeline
