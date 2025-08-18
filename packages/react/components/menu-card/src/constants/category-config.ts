import { icons } from "@nugudi/assets-icons";
import type { ComponentType, SVGProps } from "react";
import type { MenuCategory } from "../types";

/**
 * 메뉴 카테고리별 설정 정보
 * 각 카테고리의 아이콘과 표시 라벨을 정의
 */
export const CATEGORY_CONFIG: Record<
  MenuCategory,
  {
    Icon: ComponentType<SVGProps<SVGElement>>;
    label: string;
  }
> = {
  RICE: {
    Icon: icons.Rice.component,
    label: "밥류",
  },
  NOODLE: {
    Icon: icons.Noodle.component,
    label: "면류",
  },
  SOUP: {
    Icon: icons.Soup.component,
    label: "국/탕/찌개",
  },
  MAIN_DISH: {
    Icon: icons.MajorDish.component,
    label: "주요 반찬",
  },
  SIDE_DISH: {
    Icon: icons.SubDish.component,
    label: "서브반찬",
  },
  KIMCHI: {
    Icon: icons.Pickles.component,
    label: "김치 절임류",
  },
  BREAD_SANDWICH: {
    Icon: icons.Bread.component,
    label: "빵토스트샌드위치",
  },
  SALAD_FRUIT: {
    Icon: icons.Apple.component,
    label: "샐러드 / 과일",
  },
  DRINK: {
    Icon: icons.Tea.component,
    label: "음료 후식류",
  },
  OTHER: {
    Icon: icons.Etc.component,
    label: "기타",
  },
};
