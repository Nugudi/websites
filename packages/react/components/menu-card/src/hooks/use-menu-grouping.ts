import { useMemo } from "react";
import type { MenuCategory, MenuItem } from "../types";

const CATEGORY_ORDER: MenuCategory[] = [
  "RICE",
  "SOUP",
  "MAIN_DISH",
  "SIDE_DISH",
  "KIMCHI",
  "SALAD",
  "DESSERT",
  "DRINK",
  "SPECIAL",
];

/**
 * 메뉴 아이템들을 카테고리별로 그룹화하는 커스텀 훅
 *
 * @param items - 그룹화할 메뉴 아이템 배열
 * @returns 카테고리를 키로 하고 해당 카테고리의 메뉴 아이템 배열을 값으로 하는 Map
 *
 * @example
 * ```tsx
 * const menuItems = [
 *   { name: "백미밥", category: "RICE" },
 *   { name: "현미밥", category: "RICE" },
 *   { name: "김치찌개", category: "SOUP" },
 *   { name: "된장찌개", category: "SOUP" },
 *   { name: "제육볶음", category: "MAIN_DISH" }
 * ];
 *
 * const groupedItems = useMenuGrouping(menuItems);
 * // 결과: Map {
 * //   "RICE" => [
 * //     { name: "백미밥", category: "RICE" },
 * //     { name: "현미밥", category: "RICE" }
 * //   ],
 * //   "SOUP" => [
 * //     { name: "김치찌개", category: "SOUP" },
 * //     { name: "된장찌개", category: "SOUP" }
 * //   ],
 * //   "MAIN_DISH" => [
 * //     { name: "제육볶음", category: "MAIN_DISH" }
 * //   ]
 * // }
 * ```
 */
const useMenuGrouping = (items: MenuItem[]) => {
  return useMemo(() => {
    const grouped = new Map<string, MenuItem[]>();

    items.forEach((item) => {
      if (!item.category) return;

      const existing = grouped.get(item.category) || [];
      grouped.set(item.category, [...existing, item]);
    });

    const orderedGrouped = new Map<string, MenuItem[]>();
    CATEGORY_ORDER.forEach((category) => {
      const items = grouped.get(category);
      if (items) {
        orderedGrouped.set(category, items);
      }
    });

    return orderedGrouped;
  }, [items]);
};

export default useMenuGrouping;
