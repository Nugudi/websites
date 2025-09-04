# useMediaQuery

> 🎯 React에서 CSS 미디어 쿼리를 쉽게 사용할 수 있는 커스텀 훅 라이브러리

[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178C6.svg)](https://www.typescriptlang.org/)

## 📦 Installation

```bash
npm install @nugudi/react-hooks-use-media-query
# or
yarn add @nugudi/react-hooks-use-media-query
# or
pnpm add @nugudi/react-hooks-use-media-query
```

## ✨ Features

- 🚀 **실시간 미디어 쿼리 추적** - 화면 크기 변경 시 자동 업데이트
- 📱 **반응형 디자인 지원** - 미리 정의된 브레이크포인트 제공
- 🎨 **디바이스 타입 감지** - 모바일, 태블릿, 데스크톱 자동 구분
- 🔧 **TypeScript 지원** - 완벽한 타입 안정성
- ⚡ **최적화된 성능** - 자동 리스너 정리로 메모리 누수 방지
- 🌐 **SSR 지원** - Next.js 등 서버 사이드 렌더링 완벽 호환

---

## 📖 API Reference

### `useMediaQuery`

CSS 미디어 쿼리의 매칭 상태를 실시간으로 추적합니다.

#### Signature

```typescript
function useMediaQuery(options: UseMediaQueryOptions): UseMediaQueryResult;

interface UseMediaQueryOptions {
  query: string;
  defaultMatches?: boolean;
  onChange?: (matches: boolean) => void;
}

interface UseMediaQueryResult {
  matches: boolean;
  query: string;
}
```

#### Parameters

| Parameter        | Type                         | Required | Default | Description                           |
| ---------------- | ---------------------------- | -------- | ------- | ------------------------------------- |
| `query`          | `string`                     | ✅       | -       | CSS 미디어 쿼리 문자열                |
| `defaultMatches` | `boolean`                    | ❌       | `false` | SSR 또는 초기 렌더링 시 사용할 기본값 |
| `onChange`       | `(matches: boolean) => void` | ❌       | -       | 매칭 상태 변경 시 실행될 콜백         |

#### Returns

| Property  | Type      | Description                  |
| --------- | --------- | ---------------------------- |
| `matches` | `boolean` | 현재 미디어 쿼리 매칭 여부   |
| `query`   | `string`  | 사용 중인 미디어 쿼리 문자열 |

---

## 🎯 Examples

### 📌 Basic Usage

```typescript
import { useMediaQuery } from '@nugudi/react-hooks-use-media-query';

function MyComponent() {
  const { matches } = useMediaQuery({
    query: '(min-width: 768px)'
  });

  return (
    <div>
      {matches ? '🖥️ 데스크톱 뷰' : '📱 모바일 뷰'}
    </div>
  );
}
```

### 🌙 Dark Mode Detection

```typescript
function ThemeAwareComponent() {
  const { matches } = useMediaQuery({
    query: '(prefers-color-scheme: dark)',
    onChange: (isDark) => {
      console.log(`다크 모드: ${isDark ? '켜짐' : '꺼짐'}`);
    }
  });

  return (
    <div style={{
      backgroundColor: matches ? '#1a1a1a' : '#ffffff',
      color: matches ? '#ffffff' : '#000000'
    }}>
      {matches ? '🌙 다크 모드' : '☀️ 라이트 모드'}
    </div>
  );
}
```

---

## 📏 Breakpoint Hooks

### Available Breakpoint Hooks

| Hook         | 브레이크포인트 | 화면 크기 | 용도        |
| ------------ | -------------- | --------- | ----------- |
| `useIsXs()`  | `xs`           | ≥ 0px     | 모든 화면   |
| `useIsSm()`  | `sm`           | ≥ 640px   | 모바일 가로 |
| `useIsMd()`  | `md`           | ≥ 768px   | 태블릿      |
| `useIsLg()`  | `lg`           | ≥ 1024px  | 데스크톱    |
| `useIsXl()`  | `xl`           | ≥ 1280px  | 큰 데스크톱 |
| `useIs2xl()` | `2xl`          | ≥ 1536px  | 초대형 화면 |

### Example

```typescript
import { useIsMd, useIsLg } from '@nugudi/react-hooks-use-media-query';

function ResponsiveLayout() {
  const { matches: isMd } = useIsMd();
  const { matches: isLg } = useIsLg();

  if (isLg) return <DesktopLayout columns={3} />;
  if (isMd) return <TabletLayout columns={2} />;
  return <MobileLayout columns={1} />;
}
```

---

## 📱 Device Type Detection

### `useDeviceType`

현재 디바이스 타입을 자동으로 감지합니다.

#### Signature

```typescript
function useDeviceType(): DeviceTypeResult;

interface DeviceTypeResult {
  isMobile: boolean; // 모바일 여부
  isTablet: boolean; // 태블릿 여부
  isDesktop: boolean; // 데스크톱 여부
  deviceType: 'mobile' | 'tablet' | 'desktop';
}
```

#### Device Type Ranges

| 디바이스   | 화면 너비      | 설명            |
| ---------- | -------------- | --------------- |
| 📱 Mobile  | ≤ 767px        | 스마트폰        |
| 📱 Tablet  | 768px ~ 1023px | 태블릿          |
| 🖥️ Desktop | ≥ 1024px       | 데스크톱 & 랩톱 |

#### Example

```typescript
import { useDeviceType } from '@nugudi/react-hooks-use-media-query';

function AdaptiveComponent() {
  const { isMobile, isTablet, isDesktop, deviceType } = useDeviceType();

  return (
    <div>
      <h1>현재 디바이스: {deviceType}</h1>

      {isMobile && <MobileOnlyFeature />}
      {isTablet && <TabletOptimizedView />}
      {isDesktop && <DesktopFullFeature />}
    </div>
  );
}
```

---

## 🚀 Advanced Examples

### 🎨 Responsive Grid System

```typescript
import { useIsMd, useIsLg } from '@nugudi/react-hooks-use-media-query';

function ResponsiveGrid({ items }) {
  const { matches: isMd } = useIsMd();
  const { matches: isLg } = useIsLg();

  const columns = isLg ? 3 : isMd ? 2 : 1;

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${columns}, 1fr)`,
      gap: '1rem'
    }}>
      {items.map(item => (
        <GridItem key={item.id} {...item} />
      ))}
    </div>
  );
}
```

### 🔄 Multiple Media Queries

```typescript
function MultiQueryComponent() {
  const { matches: isLandscape } = useMediaQuery({
    query: '(orientation: landscape)'
  });

  const { matches: hasHover } = useMediaQuery({
    query: '(hover: hover)'
  });

  const { matches: isRetina } = useMediaQuery({
    query: '(min-resolution: 2dppx)'
  });

  return (
    <div>
      <p>화면 방향: {isLandscape ? '🔄 가로' : '📱 세로'}</p>
      <p>포인터 지원: {hasHover ? '🖱️ 마우스' : '👆 터치'}</p>
      <p>디스플레이: {isRetina ? '🔬 레티나' : '📺 일반'}</p>
    </div>
  );
}
```

### 📊 Responsive Navigation

```typescript
import { useDeviceType } from '@nugudi/react-hooks-use-media-query';

function Navigation() {
  const { isMobile } = useDeviceType();

  return (
    <nav>
      {isMobile ? (
        <HamburgerMenu />
      ) : (
        <DesktopNavBar />
      )}
    </nav>
  );
}
```

---

## ⚙️ Configuration

### SSR Support

서버 사이드 렌더링 환경에서 `defaultMatches`를 사용하여 초기 상태를 설정합니다:

```typescript
// Next.js 예제
const { matches } = useMediaQuery({
  query: '(min-width: 768px)',
  defaultMatches:
    typeof window !== 'undefined' ? window.innerWidth >= 768 : true,
});
```

### Custom Breakpoints

프로젝트의 디자인 시스템에 맞춰 커스텀 브레이크포인트를 정의할 수 있습니다:

```typescript
// utils/breakpoints.ts
export const useIsPhone = () =>
  useMediaQuery({
    query: '(max-width: 480px)',
  });

export const useIsTabletPortrait = () =>
  useMediaQuery({
    query: '(min-width: 481px) and (max-width: 768px)',
  });

export const useIsTabletLandscape = () =>
  useMediaQuery({
    query: '(min-width: 769px) and (max-width: 1024px)',
  });
```

---

## 🌍 Browser Compatibility

| Browser | Version |
| ------- | ------- |
| Chrome  | 9+      |
| Firefox | 6+      |
| Safari  | 5.1+    |
| Edge    | 12+     |
| IE      | 10+     |

> 💡 구형 브라우저를 위한 폴백 처리가 내장되어 있습니다.

---

## 📝 Notes

### Performance

- ✅ 미디어 쿼리 리스너는 컴포넌트 언마운트 시 자동 정리
- ✅ 불필요한 리렌더링 방지를 위한 최적화
- ✅ 메모리 누수 방지

### TypeScript

- ✅ 완벽한 타입 정의 제공
- ✅ 자동 완성 및 IntelliSense 지원
- ✅ 타입 안정성 보장

### Best Practices

- 📌 컴포넌트 최상위에서 훅 호출
- 📌 조건문 내에서 훅 호출 금지
- 📌 SSR 환경에서는 `defaultMatches` 활용

---

## 🤝 Contributing

기여는 언제나 환영합니다! 이슈나 PR을 남겨주세요.

---

## 📄 License

**MIT License**

Copyright (c) 2025 dydals3440

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---

<div align="center">
  <p>Made with 🍠 by <a href="https://github.com/dydals3440">dydals3440</a></p>
</div>
