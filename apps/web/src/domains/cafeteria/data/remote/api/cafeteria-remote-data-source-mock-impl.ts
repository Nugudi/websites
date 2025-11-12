/**
 * Cafeteria Mock DataSource
 *
 * Mock implementation of CafeteriaRemoteDataSource
 * - Simulates API responses with mock data in DTO format
 * - Matches Remote DataSource interface
 * - Easily replaceable with real API implementation
 *
 * Pattern:
 * 1. Define mock data in DTO format (matching OpenAPI types)
 * 2. Simulate network delay (100ms)
 * 3. Return DTO responses
 *
 * Note: 실제 API 구현 시 CafeteriaRemoteDataSourceImpl로 교체
 */

import type { CafeteriaRemoteDataSource } from "../../repository/datasource/cafeteria-remote-data-source";
import type {
  GetCafeteriaMenuAvailabilityResponse,
  GetCafeteriaMenuResponse,
  GetCafeteriaMenuTimelineResponse,
  GetCafeteriaResponse,
  GetCafeteriaWithMenuResponse,
  MenuInfoDTO,
  PageInfo,
  RegisterCafeteriaMenuResponse,
  RegisterCafeteriaResponse,
} from "../dto";

/**
 * Mock Cafeteria Data (DTO format)
 */
const MOCK_CAFETERIAS_DTO: GetCafeteriaResponse[] = [
  {
    cafeteria: {
      id: 1,
      name: "삼성전자 서초캠퍼스 구내식당",
      address: "서울특별시 서초구 서초대로74길 11",
      addressDetail: "삼성전자 타워 지하 1층",
      phone: "02-2055-0114",
      mealTicketPrice: 7000,
      takeoutAvailable: true,
      businessHours: {
        lunch: {
          start: { hour: 11, minute: 30, second: 0, nano: 0 },
          end: { hour: 13, minute: 30, second: 0, nano: 0 },
        },
        dinner: {
          start: { hour: 17, minute: 30, second: 0, nano: 0 },
          end: { hour: 19, minute: 0, second: 0, nano: 0 },
        },
        note: "공휴일 휴무",
      },
      latitude: 37.4833,
      longitude: 127.0322,
    },
  },
  {
    cafeteria: {
      id: 2,
      name: "네이버 그린팩토리 구내식당",
      address: "경기도 성남시 분당구 불정로 6",
      addressDetail: "그린팩토리 B동 1층",
      phone: "031-784-2000",
      mealTicketPrice: 6500,
      takeoutAvailable: true,
      businessHours: {
        lunch: {
          start: { hour: 11, minute: 0, second: 0, nano: 0 },
          end: { hour: 14, minute: 0, second: 0, nano: 0 },
        },
        dinner: {
          start: { hour: 17, minute: 0, second: 0, nano: 0 },
          end: { hour: 19, minute: 30, second: 0, nano: 0 },
        },
        note: "주말 휴무",
      },
      latitude: 37.3595,
      longitude: 127.1052,
    },
  },
  {
    cafeteria: {
      id: 3,
      name: "카카오 판교오피스 구내식당",
      address: "경기도 성남시 분당구 판교역로 235",
      addressDetail: "카카오 판교오피스 지하 2층",
      phone: "1577-3754",
      mealTicketPrice: 7500,
      takeoutAvailable: false,
      businessHours: {
        lunch: {
          start: { hour: 11, minute: 30, second: 0, nano: 0 },
          end: { hour: 13, minute: 30, second: 0, nano: 0 },
        },
        dinner: {
          start: { hour: 17, minute: 30, second: 0, nano: 0 },
          end: { hour: 19, minute: 0, second: 0, nano: 0 },
        },
        note: "공휴일 휴무",
      },
      latitude: 37.3939,
      longitude: 127.1109,
    },
  },
];

/**
 * Mock Menu Data (DTO format)
 */
const MOCK_MENUS_DTO: MenuInfoDTO[] = [
  {
    mealType: "LUNCH",
    menuItems: [
      {
        name: "김치찌개",
        category: "SOUP",
        calories: 250,
        caloriesSource: "MANUAL",
        displayOrder: 1,
      },
      {
        name: "제육볶음",
        category: "MAIN_DISH",
        calories: 350,
        caloriesSource: "MANUAL",
        displayOrder: 2,
      },
      {
        name: "계란후라이",
        category: "SIDE_DISH",
        calories: 150,
        caloriesSource: "MANUAL",
        displayOrder: 3,
      },
      {
        name: "김치",
        category: "KIMCHI",
        calories: 30,
        caloriesSource: "MANUAL",
        displayOrder: 4,
      },
    ],
    specialNote: null,
    nutritionInfo: {
      totalCalories: 850,
      dailyPercentage: 42,
      walkingSteps: 12000,
      runningKm: 8,
      cyclingKm: 15,
      stairsFloors: 120,
    },
  },
  {
    mealType: "DINNER",
    menuItems: [
      {
        name: "된장찌개",
        category: "SOUP",
        calories: 200,
        caloriesSource: "MANUAL",
        displayOrder: 1,
      },
      {
        name: "고등어구이",
        category: "MAIN_DISH",
        calories: 300,
        caloriesSource: "MANUAL",
        displayOrder: 2,
      },
      {
        name: "두부조림",
        category: "SIDE_DISH",
        calories: 180,
        caloriesSource: "MANUAL",
        displayOrder: 3,
      },
      {
        name: "김치",
        category: "KIMCHI",
        calories: 30,
        caloriesSource: "MANUAL",
        displayOrder: 4,
      },
    ],
    specialNote: null,
    nutritionInfo: {
      totalCalories: 780,
      dailyPercentage: 39,
      walkingSteps: 11000,
      runningKm: 7,
      cyclingKm: 14,
      stairsFloors: 110,
    },
  },
];

/**
 * Mock Page Info
 */
const MOCK_PAGE_INFO: PageInfo = {
  nextCursor: null,
  size: 10,
  hasNext: false,
};

/**
 * Mock Cafeteria With Menu Response
 */
const MOCK_CAFETERIAS_WITH_MENU: GetCafeteriaWithMenuResponse[] = [
  {
    // biome-ignore lint/style/noNonNullAssertion: Mock data is guaranteed to exist
    cafeteria: MOCK_CAFETERIAS_DTO[0]!.cafeteria,
    menus: MOCK_MENUS_DTO,
  },
  {
    // biome-ignore lint/style/noNonNullAssertion: Mock data is guaranteed to exist
    cafeteria: MOCK_CAFETERIAS_DTO[1]!.cafeteria,
    menus: MOCK_MENUS_DTO,
  },
  {
    // biome-ignore lint/style/noNonNullAssertion: Mock data is guaranteed to exist
    cafeteria: MOCK_CAFETERIAS_DTO[2]!.cafeteria,
    menus: MOCK_MENUS_DTO,
  },
];

/**
 * Mock Menu Timeline Response
 */
const MOCK_TIMELINE_DTO: GetCafeteriaMenuTimelineResponse[] = [
  {
    menuDate: "2025-01-10",
    menus: MOCK_MENUS_DTO,
    reviewCount: 5,
  },
  {
    menuDate: "2025-01-09",
    menus: [
      {
        mealType: "LUNCH",
        menuItems: [
          {
            name: "불고기",
            category: "MAIN_DISH",
            calories: 400,
            caloriesSource: "MANUAL",
            displayOrder: 1,
          },
          {
            name: "계란찜",
            category: "SIDE_DISH",
            calories: 120,
            caloriesSource: "MANUAL",
            displayOrder: 2,
          },
          {
            name: "김치",
            category: "KIMCHI",
            calories: 30,
            caloriesSource: "MANUAL",
            displayOrder: 3,
          },
        ],
        specialNote: null,
        nutritionInfo: {
          totalCalories: 820,
          dailyPercentage: 41,
          walkingSteps: 11500,
          runningKm: 7,
          cyclingKm: 14,
          stairsFloors: 115,
        },
      },
    ],
    reviewCount: 3,
  },
];

/**
 * Mock Menu Availability Response
 */
const MOCK_MENU_AVAILABILITY: GetCafeteriaMenuAvailabilityResponse = {
  year: 2025,
  month: 1,
  daysWithMenu: [
    1, 2, 3, 6, 7, 8, 9, 10, 13, 14, 15, 16, 17, 20, 21, 22, 23, 24, 27, 28, 29,
    30, 31,
  ],
};

/**
 * Mock Register Cafeteria Response
 */
const MOCK_REGISTER_CAFETERIA_RESPONSE: RegisterCafeteriaResponse = {
  cafeteriaId: 999,
  name: "Mock 구내식당",
  address: "Mock 주소",
  addressDetail: "Mock 상세주소",
  latitude: 37.5,
  longitude: 127.0,
  phone: "02-1234-5678",
  description: "Mock 설명",
  oneLineIntro: "Mock 한 줄 소개",
  mealTicketPrice: 8000,
  mainImageUrl: null,
  takeoutAvailable: true,
  createdAt: "2025-01-10T00:00:00Z",
};

/**
 * Mock Register Menu Response
 */
const MOCK_REGISTER_MENU_RESPONSE: RegisterCafeteriaMenuResponse = {
  menuId: 888,
  restaurantId: 1,
  menuDate: "2025-01-10",
  mealType: "LUNCH",
  menuItems: [
    {
      name: "Mock 메뉴",
      category: "MAIN_DISH",
      calories: 500,
      caloriesSource: "MANUAL",
      displayOrder: 1,
    },
  ],
  totalCalories: 500,
  menuImageUrl: null,
  specialNote: null,
  createdAt: "2025-01-10T00:00:00Z",
};

/**
 * Mock Get Menu Response
 */
const MOCK_GET_MENU_RESPONSE: GetCafeteriaMenuResponse = {
  menuDate: "2025-01-10",
  menus: MOCK_MENUS_DTO,
};

export class CafeteriaRemoteDataSourceMockImpl
  implements CafeteriaRemoteDataSource
{
  async getCafeteriasWithMenu(): Promise<{
    data: GetCafeteriaWithMenuResponse[];
    pageInfo: PageInfo;
  }> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return {
      data: MOCK_CAFETERIAS_WITH_MENU,
      pageInfo: MOCK_PAGE_INFO,
    };
  }

  async getCafeteriaById(): Promise<GetCafeteriaResponse> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    // biome-ignore lint/style/noNonNullAssertion: Mock data is guaranteed to exist
    return MOCK_CAFETERIAS_DTO[0]!;
  }

  async getCafeteriaMenuByDate(): Promise<GetCafeteriaMenuResponse> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return MOCK_GET_MENU_RESPONSE;
  }

  async getCafeteriaMenuTimeline(): Promise<{
    data: GetCafeteriaMenuTimelineResponse[];
    pageInfo: PageInfo;
  }> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return {
      data: MOCK_TIMELINE_DTO,
      pageInfo: MOCK_PAGE_INFO,
    };
  }

  async getCafeteriaMenuAvailability(): Promise<GetCafeteriaMenuAvailabilityResponse> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return MOCK_MENU_AVAILABILITY;
  }

  async registerCafeteria(): Promise<RegisterCafeteriaResponse> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return MOCK_REGISTER_CAFETERIA_RESPONSE;
  }

  async registerCafeteriaMenu(): Promise<RegisterCafeteriaMenuResponse> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return MOCK_REGISTER_MENU_RESPONSE;
  }
}
