import type {
  CafeteriaInfoDTO,
  GetCafeteriaResponse,
  MenuItemDTO,
} from "../dto";

// Local types for mock data (not in OpenAPI yet)
// Simplified MenuDTO for mock data - uses actual OpenAPI MenuItemDTO
type MenuDTO = {
  menuDate?: string;
  mealType?: string;
  menuItems?: Partial<MenuItemDTO>[]; // Allow partial data for mocking
  specialNote?: string;
  totalCalories?: number;
};

export type GetCafeteriaMenuTimelineResponse = {
  menuDate?: string;
  menus?: MenuDTO[];
  reviewCount?: number;
};

const MOCK_CAFETERIA: CafeteriaInfoDTO = {
  id: 1,
  name: "더애옹푸드",
  address: "천안 포스트 지하 1층",
  addressDetail: "엘리베이터 이용",
  phone: "041-550-1234",
  takeoutAvailable: true,
  latitude: 36.8065,
  longitude: 127.1522,
  mealTicketPrice: 6000,
  businessHours: {
    lunch: {
      start: { hour: 11, minute: 30, second: 0, nano: 0 },
      end: { hour: 13, minute: 30, second: 0, nano: 0 },
    },
    dinner: {
      start: { hour: 17, minute: 30, second: 0, nano: 0 },
      end: { hour: 19, minute: 30, second: 0, nano: 0 },
    },
    note: null,
  },
};

export const getMockCafeteriaData = (): GetCafeteriaResponse => {
  return {
    cafeteria: MOCK_CAFETERIA,
  };
};

export const getMockMenuData = (): GetCafeteriaMenuTimelineResponse[] => [
  {
    menuDate: "2025-10-18",
    menus: [
      {
        mealType: "LUNCH",
        menuItems: [
          { name: "현미밥", category: "RICE", calories: 210 },
          { name: "김치찌개", category: "SOUP", calories: 35 },
          { name: "돈까스", category: "MAIN_DISH", calories: 320 },
          { name: "시금치무침", category: "SIDE_DISH", calories: 25 },
          { name: "배추김치", category: "KIMCHI", calories: 15 },
          { name: "양상추샐러드", category: "SALAD", calories: 45 },
          { name: "초코케이크", category: "DESSERT", calories: 180 },
          { name: "요거트", category: "DRINK", calories: 80 },
        ],
        specialNote: "견과류 알러지 주의",
        totalCalories: 910,
      },
    ],
    reviewCount: 15,
  },
  {
    menuDate: "2025-10-19",
    menus: [
      {
        mealType: "LUNCH",
        menuItems: [
          { name: "흑미밥", category: "RICE", calories: 220 },
          { name: "된장찌개", category: "SOUP", calories: 40 },
          { name: "불고기", category: "MAIN_DISH", calories: 280 },
          { name: "김치전", category: "SIDE_DISH", calories: 90 },
          { name: "깍두기", category: "KIMCHI", calories: 20 },
          { name: "과일샐러드", category: "SALAD", calories: 65 },
          { name: "티라미수", category: "DESSERT", calories: 145 },
          { name: "우유", category: "DRINK", calories: 100 },
        ],
        specialNote: "오늘의 추천 메뉴는 불고기입니다",
        totalCalories: 960,
      },
    ],
    reviewCount: 22,
  },
  {
    menuDate: "2025-10-20",
    menus: [
      {
        mealType: "LUNCH",
        menuItems: [
          { name: "백미밥", category: "RICE", calories: 205 },
          { name: "미역국", category: "SOUP", calories: 30 },
          { name: "닭갈비", category: "MAIN_DISH", calories: 350 },
          { name: "콩나물무침", category: "SIDE_DISH", calories: 20 },
          { name: "파김치", category: "KIMCHI", calories: 18 },
          { name: "토마토샐러드", category: "SALAD", calories: 55 },
          { name: "바나나푸딩", category: "DESSERT", calories: 120 },
          { name: "오렌지주스", category: "DRINK", calories: 110 },
        ],
        specialNote: undefined,
        totalCalories: 908,
      },
    ],
    reviewCount: 12,
  },
  {
    menuDate: "2025-10-21",
    menus: [
      {
        mealType: "LUNCH",
        menuItems: [
          { name: "잡곡밥", category: "RICE", calories: 215 },
          { name: "부대찌개", category: "SOUP", calories: 95 },
          { name: "제육볶음", category: "MAIN_DISH", calories: 310 },
          { name: "계란찜", category: "SIDE_DISH", calories: 60 },
          { name: "총각김치", category: "KIMCHI", calories: 15 },
          { name: "코울슬로", category: "SALAD", calories: 70 },
          { name: "과일젤리", category: "DESSERT", calories: 85 },
          { name: "아메리카노", category: "DRINK", calories: 5 },
        ],
        specialNote: "제육볶음은 매운 맛입니다",
        totalCalories: 855,
      },
    ],
    reviewCount: 8,
  },
  {
    menuDate: "2025-10-22",
    menus: [
      {
        mealType: "DINNER",
        menuItems: [
          { name: "비빔밥", category: "RICE", calories: 380 },
          { name: "육개장", category: "SOUP", calories: 85 },
          { name: "삼겹살구이", category: "MAIN_DISH", calories: 330 },
          { name: "도토리묵", category: "SIDE_DISH", calories: 30 },
          { name: "오이소박이", category: "KIMCHI", calories: 12 },
          { name: "그린샐러드", category: "SALAD", calories: 45 },
          { name: "수박화채", category: "DESSERT", calories: 75 },
          { name: "식혜", category: "DRINK", calories: 90 },
        ],
        specialNote: undefined,
        totalCalories: 1047,
      },
    ],
    reviewCount: 18,
  },
];

export type ReviewMockData = {
  id: string;
  userId: string;
  userName: string;
  userLevel: number;
  content: string;
  imageUrl?: string;
  date: string;
  badges: Array<{ emoji: string; label: string }>;
  commentCount: number;
};

export const getMockReviews = (): ReviewMockData[] => [
  {
    id: "1",
    userId: "user1",
    userName: "안예원",
    userLevel: 7,
    content: "오늘 점심 정말 맛있었어요! 김치찌개가 진짜 최고였습니다.",
    imageUrl: "/images/cafeterias-test.png",
    date: "2025-10-18",
    badges: [
      { emoji: "⭐", label: "맛있어요" },
      { emoji: "👍", label: "추천해요" },
    ],
    commentCount: 5,
  },
  {
    id: "2",
    userId: "user2",
    userName: "김용민",
    userLevel: 12,
    content: "보통이었어요. 양은 충분했는데 맛이 조금 아쉬웠습니다.",
    imageUrl: undefined,
    date: "2025-10-18",
    badges: [{ emoji: "😐", label: "보통이에요" }],
    commentCount: 2,
  },
  {
    id: "3",
    userId: "user3",
    userName: "정혜원",
    userLevel: 25,
    content: "완벽한 한 끼였습니다! 가격 대비 최고예요.",
    imageUrl: undefined,
    date: "2025-10-18",
    badges: [
      { emoji: "⭐", label: "맛있어요" },
      { emoji: "💰", label: "가성비" },
    ],
    commentCount: 8,
  },
];
