# MenuCard Component

메뉴 아이템을 카테고리별로 그룹화하여 식단을 표시하는 React 컴포넌트입니다.

## 설치

```bash
pnpm add @nugudi/react-components-menu-card
```

## 기본 사용법

```tsx
import { MenuCard } from "@nugudi/react-components-menu-card";
import "@nugudi/react-components-menu-card/style.css";

const menuItems = [
  { name: "현미밥", category: "RICE" },
  { name: "김치찌개", category: "SOUP" },
  { name: "제육볶음", category: "MAIN_DISH" },
];

function App() {
  return (
    <MenuCard
      title="너구리 식당"
      subtitle="구내식당 1층"
      timeRange="오전 11시 ~ 오후 2시"
      items={menuItems}
    />
  );
}
```

### MenuItem

```tsx
interface MenuItem {
  name: string; // 메뉴 이름
  category: MenuCategory; // 메뉴 카테고리
}
```

### MenuCategory

지원되는 카테고리 타입:

```tsx
type MenuCategory =
  | "RICE" // 밥류
  | "NOODLE" // 면류
  | "SOUP" // 국/탕/찌개
  | "MAIN_DISH" // 주요 반찬
  | "SIDE_DISH" // 서브반찬
  | "KIMCHI" // 김치 절임류
  | "BREAD_SANDWICH" // 빵토스트샌드위치
  | "SALAD_FRUIT" // 샐러드/과일
  | "DRINK" // 음료 후식류
  | "OTHER"; // 기타
```
