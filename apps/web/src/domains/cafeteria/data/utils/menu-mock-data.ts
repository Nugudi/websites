import type { MenuItem } from "@nugudi/react-components-menu-card";

// TODO: Phase 4 - Replace with proper OpenAPI types
type Cafeteria = {
  id: string;
  name: string;
  subtitle: string;
  timeRange: string;
  isPackagingAvailable?: boolean;
  items: MenuItem[];
};

// api 연결 후 삭제
export const MOCK_MENU_ITEMS: MenuItem[] = [
  // 밥류
  { name: "백미밥", category: "RICE" },
  { name: "잡곡밥", category: "RICE" },
  { name: "현미밥", category: "RICE" },
  { name: "김치볶음밥", category: "RICE" },

  // 국/탕/찌개
  { name: "김치찌개", category: "SOUP" },
  { name: "된장찌개", category: "SOUP" },
  { name: "갈비탕", category: "SOUP" },
  { name: "우동", category: "SOUP" },

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

  // 샐러드
  { name: "그린샐러드", category: "SALAD_FRUIT" },
  { name: "과일샐러드", category: "SALAD_FRUIT" },

  // 디저트
  { name: "크로와상", category: "OTHER" },
  { name: "베이글", category: "OTHER" },
  { name: "케이크", category: "OTHER" },

  // 음료
  { name: "아메리카노", category: "DRINK" },
  { name: "요거트", category: "DRINK" },
  { name: "식혜", category: "DRINK" },

  // 특별 메뉴
  { name: "잔치국수", category: "OTHER" },
  { name: "비빔냉면", category: "OTHER" },
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
