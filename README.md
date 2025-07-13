# Nugudi Websites

Nugudi 프로젝트의 웹사이트 모노레포입니다.

## 구조

이 프로젝트는 pnpm 워크스페이스와 Turborepo를 사용하는 모노레포입니다:

- `apps/web` - Next.js 웹 애플리케이션
- `packages/ui` - 재사용 가능한 UI 컴포넌트 라이브러리 (Storybook 포함)

## 요구사항

- Node.js >= 22
- pnpm 10.11.0

## 시작하기

### 설치

```bash
pnpm install
```

### 개발 모드 실행

```bash
# 모든 앱을 개발 모드로 실행
pnpm dev

# 특정 앱만 실행
pnpm --filter @nugudi/web dev
pnpm --filter @nugudi/nugudi-ui dev
```

### 빌드

```bash
# 모든 앱 빌드
pnpm build

# UI 컴포넌트 라이브러리만 빌드
pnpm --filter @nugudi/nugudi-ui build

# Storybook 빌드
pnpm build:storybook
```

### 테스트

```bash
# 모든 테스트 실행
pnpm test

# 특정 패키지 테스트
pnpm --filter @nugudi/nugudi-ui test
```

### 린팅 및 타입 체크

```bash
# 코드 린팅
pnpm lint

# 타입 체크
pnpm check-types
```

## 개발 도구

- **Biome**: 린팅 및 포매팅
- **Commitlint**: 컨벤셔널 커밋 강제
- **Simple Git Hooks**: pre-commit 훅
- **Turborepo**: 모노레포 빌드 시스템
- **TypeScript**: 타입 안전성

## 커밋 메시지

이 프로젝트는 [Conventional Commits](https://www.conventionalcommits.org/) 스타일을 사용합니다. 커밋할 때는 다음 명령어를 사용하세요:

```bash
pnpm commit
```

## Storybook

UI 컴포넌트 라이브러리는 Storybook을 포함하고 있습니다:

```bash
# Storybook 개발 모드
cd packages/ui
pnpm dev:storybook

# Storybook 빌드
pnpm build:storybook
```

## 라이선스

이 프로젝트는 비공개 프로젝트입니다.