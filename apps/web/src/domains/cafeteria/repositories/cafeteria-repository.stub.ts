import type {
  GetCafeteriaMenuAvailabilityResponse,
  GetCafeteriaMenuResponse,
  GetCafeteriaResponse,
  GetCafeteriaWithMenuResponse,
  PageInfo,
  RegisterCafeteriaMenuRequest,
  RegisterCafeteriaMenuResponse,
  RegisterCafeteriaRequest,
  RegisterCafeteriaResponse,
} from "../types";
import type { CafeteriaRepository } from "./cafeteria-repository";

/**
 * Cafeteria Repository Stub
 *
 * Mock 데이터를 반환하는 Repository Stub 구현
 * - 환경 변수 NEXT_PUBLIC_USE_MOCK=true일 때 사용
 * - HttpClient 없이 동작하며 실제 API 호출하지 않음
 */
export class CafeteriaRepositoryStub implements CafeteriaRepository {
  async getCafeteriasWithMenu(_params: {
    date?: string;
    cursor?: string;
    size?: number;
  }): Promise<{
    data: GetCafeteriaWithMenuResponse[];
    pageInfo: PageInfo;
  }> {
    // TODO: 추후 구현 예정
    return {
      data: [],
      pageInfo: {
        nextCursor: undefined,
        size: 0,
        hasNext: false,
      },
    };
  }

  async getCafeteriaById(id: string): Promise<GetCafeteriaResponse> {
    // Mock 데이터 반환
    const MOCK_CAFETERIAS: Record<string, GetCafeteriaResponse> = {
      "1": {
        cafeteria: {
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
      },
      "2": {
        cafeteria: {
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
      },
      "3": {
        cafeteria: {
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
      },
    };

    return MOCK_CAFETERIAS[id] || MOCK_CAFETERIAS["1"];
  }

  async getCafeteriaMenuByDate(
    _id: string,
    date: string,
  ): Promise<GetCafeteriaMenuResponse> {
    // TODO: 추후 구현 예정
    return {
      menuDate: date,
      menus: [],
    };
  }

  // async getCafeteriaMenuTimeline(
  //   id: string,
  //   params: {
  //     cursor?: string;
  //     size?: number;
  //   },
  // ): Promise<{
  //   data: GetCafeteriaMenuTimelineResponse[];
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

  async getCafeteriaMenuAvailability(
    _id: string,
    params: {
      year: number;
      month: number;
    },
  ): Promise<GetCafeteriaMenuAvailabilityResponse> {
    // TODO: 추후 구현 예정
    return {
      year: params.year,
      month: params.month,
      daysWithMenu: [],
    };
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

  async registerCafeteria(
    data: RegisterCafeteriaRequest,
  ): Promise<RegisterCafeteriaResponse> {
    // TODO: 추후 구현 예정
    return {
      cafeteriaId: Date.now(),
      name: data.name,
      address: data.address,
    };
  }

  async registerCafeteriaMenu(
    data: RegisterCafeteriaMenuRequest,
  ): Promise<RegisterCafeteriaMenuResponse> {
    // TODO: 추후 구현 예정
    return {
      menuId: Date.now(),
      restaurantId: data.restaurantId,
      menuDate: data.menuDate,
    };
  }
}
