import type { PageInfo } from "@core/types";
import type {
  Cafeteria,
  CafeteriaMenu,
  CafeteriaMenuTimeline,
  MenuAvailability,
} from "../../domain/entities";
import type { CafeteriaRepository } from "../../domain/repositories/cafeteria-repository.interface";
import type {
  GetCafeteriaMenuAvailabilityResponse,
  GetCafeteriaMenuResponse,
  GetCafeteriaMenuTimelineResponse,
  GetCafeteriaResponse,
  RegisterCafeteriaMenuRequest,
  RegisterCafeteriaMenuResponse,
  RegisterCafeteriaRequest,
  RegisterCafeteriaResponse,
} from "../dto";
import {
  cafeteriaInfoDtoToDomain,
  getCafeteriaMenuAvailabilityResponseToDomain,
  getCafeteriaMenuResponseToDomain,
  getCafeteriaMenuTimelineResponseToDomain,
  registerCafeteriaMenuResponseToDomain,
  registerCafeteriaResponseToDomain,
} from "../mappers";

/**
 * Cafeteria Repository Stub
 *
 * Mock 데이터를 반환하는 Repository Stub 구현
 * - 환경 변수 NEXT_PUBLIC_USE_MOCK=true일 때 사용
 * - HttpClient 없이 동작하며 실제 API 호출하지 않음
 * - Mock DTO를 생성한 후 Mapper로 Entity 변환
 */
export class CafeteriaRepositoryStub implements CafeteriaRepository {
  async getCafeteriasWithMenu(_params: {
    date?: string;
    cursor?: string;
    size?: number;
  }): Promise<{
    data: Array<{
      cafeteria: Cafeteria;
      menus: CafeteriaMenu[];
    }>;
    pageInfo: PageInfo;
  }> {
    // TODO: 추후 구현 예정
    return {
      data: [],
      pageInfo: {
        nextCursor: null,
        size: 0,
        hasNext: false,
      },
    };
  }

  async getCafeteriaById(id: string): Promise<Cafeteria> {
    // Mock DTO 생성
    const MOCK_CAFETERIAS: Record<string, GetCafeteriaResponse> = {
      "1": {
        cafeteria: {
          id: 1,
          name: "더애옹푸드",
          address: "천안 포스트 지하 1층",
          addressDetail: "엘리베이터 이용",
          latitude: 36.8065,
          longitude: 127.1522,
          phone: "041-1234-5678",
          mealTicketPrice: 6000,
          businessHours: {
            lunch: {
              start: { hour: 11, minute: 0, second: 0, nano: 0 },
              end: { hour: 14, minute: 0, second: 0, nano: 0 },
            },
            dinner: {
              start: { hour: 17, minute: 0, second: 0, nano: 0 },
              end: { hour: 20, minute: 0, second: 0, nano: 0 },
            },
            note: null,
          },
          takeoutAvailable: true,
        },
      },
      "2": {
        cafeteria: {
          id: 2,
          name: "너구리 키친",
          address: "천안 시티 2층",
          addressDetail: "엘리베이터 이용",
          latitude: 36.8155,
          longitude: 127.1589,
          phone: "041-2345-6789",
          mealTicketPrice: 6500,
          businessHours: {
            lunch: {
              start: { hour: 11, minute: 30, second: 0, nano: 0 },
              end: { hour: 14, minute: 30, second: 0, nano: 0 },
            },
            dinner: {
              start: { hour: 17, minute: 30, second: 0, nano: 0 },
              end: { hour: 20, minute: 30, second: 0, nano: 0 },
            },
            note: null,
          },
          takeoutAvailable: false,
        },
      },
      "3": {
        cafeteria: {
          id: 3,
          name: "행복한 식당",
          address: "천안역 3번 출구",
          addressDetail: "3번 출구 앞",
          latitude: 36.8095,
          longitude: 127.1485,
          phone: "041-3456-7890",
          mealTicketPrice: 5500,
          businessHours: {
            lunch: {
              start: { hour: 12, minute: 0, second: 0, nano: 0 },
              end: { hour: 15, minute: 0, second: 0, nano: 0 },
            },
            dinner: {
              start: { hour: 18, minute: 0, second: 0, nano: 0 },
              end: { hour: 21, minute: 0, second: 0, nano: 0 },
            },
            note: null,
          },
          takeoutAvailable: true,
        },
      },
    };

    const mockResponse = MOCK_CAFETERIAS[id] || MOCK_CAFETERIAS["1"];

    // Null 체크
    if (!mockResponse) {
      throw new Error("Mock cafeteria not found");
    }

    // Mapper로 Entity 변환
    if (!mockResponse.cafeteria) {
      throw new Error("Cafeteria not found in mock response");
    }
    return cafeteriaInfoDtoToDomain(mockResponse.cafeteria);
  }

  async getCafeteriaMenuByDate(
    _id: string,
    date: string,
  ): Promise<CafeteriaMenu> {
    // Mock DTO 생성
    const mockResponse: GetCafeteriaMenuResponse = {
      menuDate: date,
      menus: [],
    };

    // Mapper로 Entity 변환
    return getCafeteriaMenuResponseToDomain(mockResponse);
  }

  async getCafeteriaMenuTimeline(
    _id: string,
    _params: {
      cursor?: string;
      size?: number;
    },
  ): Promise<{
    data: CafeteriaMenuTimeline[];
    pageInfo: PageInfo;
  }> {
    // Mock DTO 생성 - 프레젠테이션 레이어에서 가져온 목 데이터
    const mockTimelineData: GetCafeteriaMenuTimelineResponse[] = [
      {
        menuDate: "2025-10-18",
        menus: [
          {
            mealType: "LUNCH",
            menuItems: [
              {
                name: "현미밥",
                category: "RICE",
                calories: 210,
                caloriesSource: null,
                displayOrder: null,
              },
              {
                name: "김치찌개",
                category: "SOUP",
                calories: 35,
                caloriesSource: null,
                displayOrder: null,
              },
              {
                name: "돈까스",
                category: "MAIN_DISH",
                calories: 320,
                caloriesSource: null,
                displayOrder: null,
              },
              {
                name: "시금치무침",
                category: "SIDE_DISH",
                calories: 25,
                caloriesSource: null,
                displayOrder: null,
              },
              {
                name: "배추김치",
                category: "KIMCHI",
                calories: 15,
                caloriesSource: null,
                displayOrder: null,
              },
              {
                name: "양상추샐러드",
                category: "SALAD",
                calories: 45,
                caloriesSource: null,
                displayOrder: null,
              },
              {
                name: "초코케이크",
                category: "DESSERT",
                calories: 180,
                caloriesSource: null,
                displayOrder: null,
              },
              {
                name: "요거트",
                category: "DRINK",
                calories: 80,
                caloriesSource: null,
                displayOrder: null,
              },
            ],
            specialNote: "견과류 알러지 주의",
            nutritionInfo: {
              totalCalories: 910,
              dailyPercentage: null,
              walkingSteps: null,
              runningKm: null,
              cyclingKm: null,
              stairsFloors: null,
            },
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
              {
                name: "흑미밥",
                category: "RICE",
                calories: 220,
                caloriesSource: null,
                displayOrder: null,
              },
              {
                name: "된장찌개",
                category: "SOUP",
                calories: 40,
                caloriesSource: null,
                displayOrder: null,
              },
              {
                name: "불고기",
                category: "MAIN_DISH",
                calories: 280,
                caloriesSource: null,
                displayOrder: null,
              },
              {
                name: "김치전",
                category: "SIDE_DISH",
                calories: 90,
                caloriesSource: null,
                displayOrder: null,
              },
              {
                name: "깍두기",
                category: "KIMCHI",
                calories: 20,
                caloriesSource: null,
                displayOrder: null,
              },
              {
                name: "과일샐러드",
                category: "SALAD",
                calories: 65,
                caloriesSource: null,
                displayOrder: null,
              },
              {
                name: "티라미수",
                category: "DESSERT",
                calories: 145,
                caloriesSource: null,
                displayOrder: null,
              },
              {
                name: "우유",
                category: "DRINK",
                calories: 100,
                caloriesSource: null,
                displayOrder: null,
              },
            ],
            specialNote: "오늘의 추천 메뉴는 불고기입니다",
            nutritionInfo: {
              totalCalories: 960,
              dailyPercentage: null,
              walkingSteps: null,
              runningKm: null,
              cyclingKm: null,
              stairsFloors: null,
            },
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
              {
                name: "백미밥",
                category: "RICE",
                calories: 205,
                caloriesSource: null,
                displayOrder: null,
              },
              {
                name: "미역국",
                category: "SOUP",
                calories: 30,
                caloriesSource: null,
                displayOrder: null,
              },
              {
                name: "닭갈비",
                category: "MAIN_DISH",
                calories: 350,
                caloriesSource: null,
                displayOrder: null,
              },
              {
                name: "콩나물무침",
                category: "SIDE_DISH",
                calories: 20,
                caloriesSource: null,
                displayOrder: null,
              },
              {
                name: "파김치",
                category: "KIMCHI",
                calories: 18,
                caloriesSource: null,
                displayOrder: null,
              },
              {
                name: "토마토샐러드",
                category: "SALAD",
                calories: 55,
                caloriesSource: null,
                displayOrder: null,
              },
              {
                name: "바나나푸딩",
                category: "DESSERT",
                calories: 120,
                caloriesSource: null,
                displayOrder: null,
              },
              {
                name: "오렌지주스",
                category: "DRINK",
                calories: 110,
                caloriesSource: null,
                displayOrder: null,
              },
            ],
            specialNote: null,
            nutritionInfo: {
              totalCalories: 908,
              dailyPercentage: null,
              walkingSteps: null,
              runningKm: null,
              cyclingKm: null,
              stairsFloors: null,
            },
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
              {
                name: "잡곡밥",
                category: "RICE",
                calories: 215,
                caloriesSource: null,
                displayOrder: null,
              },
              {
                name: "부대찌개",
                category: "SOUP",
                calories: 95,
                caloriesSource: null,
                displayOrder: null,
              },
              {
                name: "제육볶음",
                category: "MAIN_DISH",
                calories: 310,
                caloriesSource: null,
                displayOrder: null,
              },
              {
                name: "계란찜",
                category: "SIDE_DISH",
                calories: 60,
                caloriesSource: null,
                displayOrder: null,
              },
              {
                name: "총각김치",
                category: "KIMCHI",
                calories: 15,
                caloriesSource: null,
                displayOrder: null,
              },
              {
                name: "코울슬로",
                category: "SALAD",
                calories: 70,
                caloriesSource: null,
                displayOrder: null,
              },
              {
                name: "과일젤리",
                category: "DESSERT",
                calories: 85,
                caloriesSource: null,
                displayOrder: null,
              },
              {
                name: "아메리카노",
                category: "DRINK",
                calories: 5,
                caloriesSource: null,
                displayOrder: null,
              },
            ],
            specialNote: "제육볶음은 매운 맛입니다",
            nutritionInfo: {
              totalCalories: 855,
              dailyPercentage: null,
              walkingSteps: null,
              runningKm: null,
              cyclingKm: null,
              stairsFloors: null,
            },
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
              {
                name: "비빔밥",
                category: "RICE",
                calories: 380,
                caloriesSource: null,
                displayOrder: null,
              },
              {
                name: "육개장",
                category: "SOUP",
                calories: 85,
                caloriesSource: null,
                displayOrder: null,
              },
              {
                name: "삼겹살구이",
                category: "MAIN_DISH",
                calories: 330,
                caloriesSource: null,
                displayOrder: null,
              },
              {
                name: "도토리묵",
                category: "SIDE_DISH",
                calories: 30,
                caloriesSource: null,
                displayOrder: null,
              },
              {
                name: "오이소박이",
                category: "KIMCHI",
                calories: 12,
                caloriesSource: null,
                displayOrder: null,
              },
              {
                name: "그린샐러드",
                category: "SALAD",
                calories: 45,
                caloriesSource: null,
                displayOrder: null,
              },
              {
                name: "수박화채",
                category: "DESSERT",
                calories: 75,
                caloriesSource: null,
                displayOrder: null,
              },
              {
                name: "식혜",
                category: "DRINK",
                calories: 90,
                caloriesSource: null,
                displayOrder: null,
              },
            ],
            specialNote: null,
            nutritionInfo: {
              totalCalories: 1047,
              dailyPercentage: null,
              walkingSteps: null,
              runningKm: null,
              cyclingKm: null,
              stairsFloors: null,
            },
          },
        ],
        reviewCount: 18,
      },
    ];

    // Mapper로 Entity 변환
    const timelineEntities = mockTimelineData.map((item) =>
      getCafeteriaMenuTimelineResponseToDomain(item),
    );

    return {
      data: timelineEntities,
      pageInfo: {
        nextCursor: null,
        size: timelineEntities.length,
        hasNext: false,
      },
    };
  }

  async getCafeteriaMenuAvailability(
    _id: string,
    params: {
      year: number;
      month: number;
    },
  ): Promise<MenuAvailability> {
    // Mock DTO 생성
    const mockResponse: GetCafeteriaMenuAvailabilityResponse = {
      year: params.year,
      month: params.month,
      daysWithMenu: [],
    };

    // Mapper로 Entity 변환
    return getCafeteriaMenuAvailabilityResponseToDomain(mockResponse);
  }

  // async getCafeteriaMenuReviews(
  //   id: string,
  //   params: {
  //     date?: string;
  //     cursor?: string;
  //     size?: number;
  //   },
  // ): Promise<{
  //   data: GetCafeteriaMenuReviewResponse[];
  //   pageInfo: PageInfo;
  // }> {
  //   // TODO: 추후 구현 예정
  //   return {
  //     data: [],
  //     pageInfo: {
  //       nextCursor: undefined,
  //       size: 0,
  //       hasNext: false,
  //     },
  //   };
  // }

  async registerCafeteria(data: RegisterCafeteriaRequest): Promise<Cafeteria> {
    // Mock DTO 생성
    const mockResponse: RegisterCafeteriaResponse = {
      cafeteriaId: Date.now(),
      name: data.name,
      address: data.address,
      addressDetail: data.addressDetail,
      latitude: data.latitude ?? null,
      longitude: data.longitude ?? null,
      phone: data.phone ?? null,
      description: data.description ?? null,
      oneLineIntro: data.oneLineIntro ?? null,
      mealTicketPrice: data.mealTicketPrice ?? null,
      mainImageUrl: null, // Converted from mainImageFileId on backend
      takeoutAvailable: data.takeoutAvailable ?? null,
      createdAt: new Date().toISOString(),
    };

    // Mapper로 Entity 변환
    return registerCafeteriaResponseToDomain(mockResponse);
  }

  async registerCafeteriaMenu(
    data: RegisterCafeteriaMenuRequest,
  ): Promise<CafeteriaMenu> {
    // Mock DTO 생성
    const mockResponse: RegisterCafeteriaMenuResponse = {
      menuId: Date.now(),
      restaurantId: data.restaurantId,
      menuDate: data.menuDate,
      mealType: data.mealType,
      menuItems: data.menuItems.map((item) => ({
        name: item.name,
        category: item.category,
        calories: item.calories ?? null,
        caloriesSource: null,
        displayOrder: null,
      })),
      totalCalories: null, // Calculated on backend from menuItems
      menuImageUrl: null, // Converted from menuImageFileId on backend
      specialNote: data.specialNote ?? null,
      createdAt: new Date().toISOString(),
    };

    // Mapper로 Entity 변환
    return registerCafeteriaMenuResponseToDomain(mockResponse);
  }
}
