import type { MenuItem } from "@nugudi/react-components-menu-card";
import type { Cafeteria } from "./index";

// api 연결 후 삭제
export const MOCK_MENU_ITEMS: MenuItem[] = [
  { name: "백미밥", category: "RICE" },
  { name: "잡곡밥", category: "RICE" },
  { name: "현미밥", category: "RICE" },
  { name: "김치볶음밥", category: "RICE" },

  // 면류
  { name: "잔치국수", category: "NOODLE" },
  { name: "비빔냉면", category: "NOODLE" },
  { name: "우동", category: "NOODLE" },

  // 국/탕/찌개
  { name: "김치찌개", category: "SOUP" },
  { name: "된장찌개", category: "SOUP" },
  { name: "갈비탕", category: "SOUP" },

  // 주요 반찬
  { name: "제육볶음", category: "MAIN_DISH" },
  { name: "닭갈비", category: "MAIN_DISH" },
  { name: "고등어구이", category: "MAIN_DISH" },

  // 서브반찬
  { name: "계란찜", category: "SIDE_DISH" },
  { name: "두부조림", category: "SIDE_DISH" },
  { name: "시금치나물", category: "SIDE_DISH" },

  // 김치 절임류
  { name: "배추김치", category: "KIMCHI" },
  { name: "깍두기", category: "KIMCHI" },
  { name: "오이소박이", category: "KIMCHI" },

  // 빵토스트샌드위치
  { name: "크로와상", category: "BREAD_SANDWICH" },
  { name: "햄치즈샌드위치", category: "BREAD_SANDWICH" },
  { name: "베이글", category: "BREAD_SANDWICH" },

  // 샐러드/과일
  { name: "그린샐러드", category: "SALAD_FRUIT" },
  { name: "과일샐러드", category: "SALAD_FRUIT" },

  // 음료 후식류
  { name: "아메리카노", category: "DRINK" },
  { name: "요거트", category: "DRINK" },
  { name: "식혜", category: "DRINK" },

  // 기타
  { name: "견과류", category: "OTHER" },
];

export const MOCK_CAFETERIA_LIST: Cafeteria[] = [
  {
    id: "nuguri-food-1",
    name: "너구리 푸드",
    subtitle: "너굴너굴 14층",
    timeRange: "오전 11시 ~ 오후 2시",
    isPackagingAvailable: true,
    items: MOCK_MENU_ITEMS,
  },
  {
    id: "hyung-food",
    name: "혱혱 푸드",
    subtitle: "너굴너굴 14층",
    timeRange: "오전 11시 ~ 오후 2시",
    items: MOCK_MENU_ITEMS,
  },
  {
    id: "nuguri-food-2",
    name: "너구리 푸드 2호점",
    subtitle: "너굴너굴 14층",
    timeRange: "오전 11시 ~ 오후 2시",
    items: MOCK_MENU_ITEMS,
  },
];
