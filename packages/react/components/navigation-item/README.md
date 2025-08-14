# NavigationItem

네비게이션 메뉴에 사용되는 컴포넌트입니다.

## 설치

```bash
pnpm install @nugudi/react-components-navigation-item
```

## Usage

```tsx
import { NavigationItem } from "@nugudi/react-components-navigation-item";

// Basic usage
<NavigationItem>
  알림 설정
</NavigationItem>

// With icons
<NavigationItem
  leftIcon={<BusIcon />}
  rightIcon={<ArrowRightIcon />}
>
  구디 구내식당 투어
</NavigationItem>

// With Next.js Link
<Link href="/settings" style={{ textDecoration: "none" }}>
  <NavigationItem leftIcon={<Icon />}>
    설정
  </NavigationItem>
</Link>

// Disabled state
<NavigationItem disabled>
  비활성화
</NavigationItem>
```
