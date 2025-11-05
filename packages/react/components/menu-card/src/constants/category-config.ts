import {
  AppleIcon,
  BreadIcon,
  EtcIcon,
  MajorDishIcon,
  PicklesIcon,
  RiceIcon,
  SoupIcon,
  SubDishIcon,
  TeaIcon,
} from "@nugudi/assets-icons";
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
    Icon: RiceIcon,
    label: "밥류",
  },
  SOUP: {
    Icon: SoupIcon,
    label: "국/탕/찌개",
  },
  MAIN_DISH: {
    Icon: MajorDishIcon,
    label: "주요 반찬",
  },
  SIDE_DISH: {
    Icon: SubDishIcon,
    label: "서브반찬",
  },
  KIMCHI: {
    Icon: PicklesIcon,
    label: "김치 절임류",
  },
  SALAD: {
    Icon: AppleIcon,
    label: "샐러드",
  },
  DESSERT: {
    Icon: BreadIcon,
    label: "디저트",
  },
  DRINK: {
    Icon: TeaIcon,
    label: "음료",
  },
  SPECIAL: {
    Icon: EtcIcon,
    label: "특별 메뉴",
  },
};
