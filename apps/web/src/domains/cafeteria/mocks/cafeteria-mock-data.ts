import type { MenuItem } from "@nugudi/react-components-menu-card";
import type { CafeteriaInfoDTO, GetCafeteriaResponse } from "../types";

/**
 * 임시 타입: UI에서 사용하는 메뉴 아이템
 * TODO: API 구조 변경 시 제거 예정
 */
type MenuItemForUI = MenuItem & {
  calories?: number;
};

/**
 * 임시 타입: UI에서 사용하는 확장된 식당 정보
 * TODO: API 구조 변경 시 제거 예정
 */
type CafeteriaWithMenus = GetCafeteriaResponse & {
  // UI 호환성을 위한 추가 필드들
  name: string;
  location: string;
  operatingHours: string;
  price: number;
  isPackagingAvailable: boolean;
  rating: number;
  reviewCount: number;
  menus: {
    breakfast: MenuItemForUI[];
    lunch: MenuItemForUI[];
  };
};

/**
 * 임시 타입: UI에서 사용하는 메뉴 데이터 형식
 * TODO: API 구조 변경 시 제거 예정
 */
type MenuDataForUI = {
  id: string;
  date: string;
  items: MenuItemForUI[];
  reviewCount: number;
  averageRating: number;
};

/**
 * Mock: 여러 식당 데이터
 */
const MOCK_CAFETERIAS: Record<string, CafeteriaInfoDTO> = {
  "1": {
    id: 1,
    name: "더애옹푸드",
    address: "천안 포스트 지하 1층",
    phone: "041-1234-5678",
    businessHours: {
      lunch: {
        start: { hour: 11, minute: 0, second: 0, nano: 0 },
        end: { hour: 14, minute: 0, second: 0, nano: 0 },
      },
      dinner: {
        start: { hour: 17, minute: 0, second: 0, nano: 0 },
        end: { hour: 20, minute: 0, second: 0, nano: 0 },
      },
    },
    takeoutAvailable: true,
  },
  "2": {
    id: 2,
    name: "너구리 키친",
    address: "천안 시티 2층",
    phone: "041-2345-6789",
    businessHours: {
      lunch: {
        start: { hour: 11, minute: 30, second: 0, nano: 0 },
        end: { hour: 14, minute: 30, second: 0, nano: 0 },
      },
      dinner: {
        start: { hour: 17, minute: 30, second: 0, nano: 0 },
        end: { hour: 20, minute: 30, second: 0, nano: 0 },
      },
    },
    takeoutAvailable: false,
  },
  "3": {
    id: 3,
    name: "행복한 식당",
    address: "천안역 3번 출구",
    phone: "041-3456-7890",
    businessHours: {
      lunch: {
        start: { hour: 12, minute: 0, second: 0, nano: 0 },
        end: { hour: 15, minute: 0, second: 0, nano: 0 },
      },
      dinner: {
        start: { hour: 18, minute: 0, second: 0, nano: 0 },
        end: { hour: 21, minute: 0, second: 0, nano: 0 },
      },
    },
    takeoutAvailable: true,
  },
};

/**
 * Mock: 식당 상세 정보 (메뉴 포함)
 * @param cafeteriaId 식당 ID
 * @returns CafeteriaWithMenus 타입의 식당 상세 정보 (메뉴 포함)
 */
export const getMockCafeteriaData = (
  cafeteriaId: string,
): CafeteriaWithMenus => {
  const cafeteria = MOCK_CAFETERIAS[cafeteriaId] || MOCK_CAFETERIAS["1"];

  // UI 호환성을 위한 필드 변환
  return {
    cafeteria,
    // UI에서 사용하는 필드들
    name: cafeteria.name || "식당 이름 없음",
    location: cafeteria.address || "주소 정보 없음",
    operatingHours: "11:00 - 20:00",
    price: 5000,
    isPackagingAvailable: cafeteria.takeoutAvailable ?? false,
    rating: 4.5,
    reviewCount: 120,
    menus: {
      breakfast: [{ name: "식단 확인하기", category: "OTHER" }],
      lunch: [
        { name: "밥류", category: "RICE" },
        { name: "면류", category: "NOODLE" },
        { name: "국/탕/찌개", category: "SOUP" },
        { name: "주요 반찬", category: "MAIN_DISH" },
        { name: "사브반찬", category: "SIDE_DISH" },
        { name: "김치 샐러드", category: "KIMCHI" },
        { name: "빵/토스트/샌드위치 미니", category: "BREAD_SANDWICH" },
        { name: "샐러드 / 과일", category: "SALAD_FRUIT" },
        { name: "음료 후식류", category: "DRINK" },
        { name: "기타", category: "OTHER" },
      ],
    },
  };
};

/**
 * Mock: 메뉴 타임라인 데이터 (UI 형식)
 * @returns MenuDataForUI[] 타입의 메뉴 타임라인 리스트
 */
export const getMockMenuData = (): MenuDataForUI[] => [
  {
    id: "1",
    date: "2025-10-18",
    items: [
      { name: "현미밥", category: "RICE" },
      { name: "잔치국수", category: "NOODLE" },
      { name: "김치찌개", category: "SOUP" },
      { name: "돈까스", category: "MAIN_DISH" },
      { name: "멸치볶음", category: "SIDE_DISH" },
      { name: "배추김치", category: "KIMCHI" },
      { name: "크로와상", category: "BREAD_SANDWICH" },
      { name: "과일샐러드", category: "SALAD_FRUIT" },
      { name: "아이스크림", category: "DRINK" },
      { name: "견과류", category: "OTHER" },
    ],
    reviewCount: 15,
    averageRating: 4.5,
  },
  {
    id: "2",
    date: "2025-10-19",
    items: [
      { name: "흰밥", category: "RICE" },
      { name: "우동", category: "NOODLE" },
      { name: "미역국", category: "SOUP" },
      { name: "치킨너겟", category: "MAIN_DISH" },
      { name: "무나물", category: "SIDE_DISH" },
      { name: "오이소박이", category: "KIMCHI" },
      { name: "토스트", category: "BREAD_SANDWICH" },
      { name: "사과", category: "SALAD_FRUIT" },
      { name: "요거트", category: "DRINK" },
      { name: "땅콩", category: "OTHER" },
    ],
    reviewCount: 12,
    averageRating: 4.2,
  },
  {
    id: "3",
    date: "2025-10-20",
    items: [
      { name: "보리밥", category: "RICE" },
      { name: "라면", category: "NOODLE" },
      { name: "된장찌개", category: "SOUP" },
      { name: "갈비찜", category: "MAIN_DISH" },
      { name: "시금치나물", category: "SIDE_DISH" },
      { name: "깍두기", category: "KIMCHI" },
      { name: "샌드위치", category: "BREAD_SANDWICH" },
      { name: "포도", category: "SALAD_FRUIT" },
      { name: "우유", category: "DRINK" },
      { name: "김", category: "OTHER" },
    ],
    reviewCount: 20,
    averageRating: 4.8,
  },
  {
    id: "4",
    date: "2025-10-21",
    items: [
      { name: "잡곡밥", category: "RICE" },
      { name: "칼국수", category: "NOODLE" },
      { name: "부대찌개", category: "SOUP" },
      { name: "제육볶음", category: "MAIN_DISH" },
      { name: "계란찜", category: "SIDE_DISH" },
      { name: "총각김치", category: "KIMCHI" },
      { name: "베이글", category: "BREAD_SANDWICH" },
      { name: "딸기", category: "SALAD_FRUIT" },
      { name: "커피", category: "DRINK" },
      { name: "치즈", category: "OTHER" },
    ],
    reviewCount: 8,
    averageRating: 4.0,
  },
  {
    id: "5",
    date: "2025-10-22",
    items: [
      { name: "쌀밥", category: "RICE" },
      { name: "비빔밥", category: "NOODLE" },
      { name: "육개장", category: "SOUP" },
      { name: "삼겹살구이", category: "MAIN_DISH" },
      { name: "콩나물무침", category: "SIDE_DISH" },
      { name: "깍두기", category: "KIMCHI" },
      { name: "핫도그", category: "BREAD_SANDWICH" },
      { name: "수박", category: "SALAD_FRUIT" },
      { name: "주스", category: "DRINK" },
      { name: "젤리", category: "OTHER" },
    ],
    reviewCount: 18,
    averageRating: 4.6,
  },
];

/**
 * TODO: OpenAPI ReviewInfo, ReviewerInfo 타입이 생성되면 활성화
 */
// export const getMockReviews = () => [
//   {
//     id: "1",
//     imageUrl: "/images/cafeterias-test.png",
//     imageAlt: "식당 음식 사진",
//     date: "2025.7.7.화",
//     reviewText:
//       "고기가 아주 맛있고, 미트볼 듬뿍이었어요 그런데 ..\n줄마다 미트볼이 없는 줄이 있을 수 있습니다. 랜덤핑",
//     badges: [
//       { emoji: "😋", label: "맛있어요" },
//       { emoji: "🤩", label: "달달해요" },
//     ],
//   },
//   // ... 추가 리뷰 데이터
// ];
