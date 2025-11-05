/**
 * Cafeteria Service
 *
 * 구내식당 비즈니스 로직을 담당하는 Service Layer
 * Repository를 조합하여 복잡한 비즈니스 플로우를 처리합니다.
 */

import type { CafeteriaRepository } from "../repositories";
import type {
  GetCafeteriaMenuAvailabilityResponse,
  GetCafeteriaMenuResponse,
  // GetCafeteriaMenuReviewResponse, // TODO: OpenAPI 타입 추가되면 활성화
  // GetCafeteriaMenuTimelineResponse, // TODO: OpenAPI 타입 추가되면 활성화
  GetCafeteriaResponse,
  GetCafeteriaWithMenuResponse,
  PageInfo,
  RegisterCafeteriaMenuRequest,
  RegisterCafeteriaMenuResponse,
  RegisterCafeteriaRequest,
  RegisterCafeteriaResponse,
} from "../types";

/**
 * Cafeteria Service Interface
 */
export interface CafeteriaService {
  // ==========================================
  // Cafeteria 조회
  // ==========================================

  /**
   * 구내식당 리스트 + 메뉴 조회 (무한 스크롤)
   *
   * @param params - 조회 파라미터 (날짜, 커서, 사이즈)
   * @returns 구내식당 리스트와 페이지 정보
   */
  getCafeteriasWithMenu(params: {
    date?: string;
    cursor?: string;
    size?: number;
  }): Promise<{
    data: GetCafeteriaWithMenuResponse[];
    pageInfo: PageInfo;
  }>;

  /**
   * 구내식당 상세 조회
   *
   * @param id - 구내식당 ID
   * @returns 구내식당 상세 정보
   */
  getCafeteriaById(id: string): Promise<GetCafeteriaResponse>;

  // ==========================================
  // Menu 조회
  // ==========================================

  /**
   * 구내식당 메뉴 조회 (특정 날짜)
   *
   * @param id - 구내식당 ID
   * @param date - 조회할 날짜 (YYYY-MM-DD)
   * @returns 특정 날짜의 메뉴 정보
   */
  getCafeteriaMenuByDate(
    id: string,
    date: string,
  ): Promise<GetCafeteriaMenuResponse>;

  /**
   * TODO: OpenAPI 타입 추가되면 활성화
   * 구내식당 메뉴 타임라인 조회 (무한 스크롤)
   *
   * @param id - 구내식당 ID
   * @param params - 조회 파라미터 (커서, 사이즈)
   * @returns 메뉴 타임라인과 페이지 정보
   */
  // getCafeteriaMenuTimeline(
  //   id: string,
  //   params: {
  //     cursor?: string;
  //     size?: number;
  //   },
  // ): Promise<{
  //   data: GetCafeteriaMenuTimelineResponse[];
  //   pageInfo: PageInfo;
  // }>;

  /**
   * 구내식당 메뉴 가용성 조회 (캘린더용)
   *
   * @param id - 구내식당 ID
   * @param params - 조회 파라미터 (연도, 월)
   * @returns 메뉴가 있는 날짜 리스트
   */
  getCafeteriaMenuAvailability(
    id: string,
    params: {
      year: number;
      month: number;
    },
  ): Promise<GetCafeteriaMenuAvailabilityResponse>;

  // ==========================================
  // Review 조회
  // ==========================================

  /**
   * TODO: OpenAPI 타입 추가되면 활성화
   * 구내식당 메뉴 리뷰 조회 (무한 스크롤)
   *
   * @param id - 구내식당 ID
   * @param params - 조회 파라미터 (날짜, 커서, 사이즈)
   * @returns 리뷰 리스트와 페이지 정보
   */
  // getCafeteriaMenuReviews(
  //   id: string,
  //   params: {
  //     date?: string;
  //     cursor?: string;
  //     size?: number;
  //   },
  // ): Promise<{
  //   data: GetCafeteriaMenuReviewResponse[];
  //   pageInfo: PageInfo;
  // }>;

  // ==========================================
  // Cafeteria 등록/수정
  // ==========================================

  /**
   * 구내식당 등록
   *
   * @param data - 구내식당 등록 데이터
   * @returns 등록된 구내식당 정보
   */
  registerCafeteria(
    data: RegisterCafeteriaRequest,
  ): Promise<RegisterCafeteriaResponse>;

  /**
   * 구내식당 메뉴 등록
   *
   * @param data - 메뉴 등록 데이터
   * @returns 등록된 메뉴 정보
   */
  registerCafeteriaMenu(
    data: RegisterCafeteriaMenuRequest,
  ): Promise<RegisterCafeteriaMenuResponse>;
}

/**
 * Cafeteria Service Implementation
 */
export class CafeteriaServiceImpl implements CafeteriaService {
  constructor(private readonly repository: CafeteriaRepository) {}

  async getCafeteriasWithMenu(params: {
    date?: string;
    cursor?: string;
    size?: number;
  }): Promise<{
    data: GetCafeteriaWithMenuResponse[];
    pageInfo: PageInfo;
  }> {
    return this.repository.getCafeteriasWithMenu(params);
  }

  async getCafeteriaById(id: string): Promise<GetCafeteriaResponse> {
    const response = await this.repository.getCafeteriaById(id);

    if (!response || !response.cafeteria) {
      throw new Error("Cafeteria not found");
    }

    return response;
  }

  async getCafeteriaMenuByDate(
    id: string,
    date: string,
  ): Promise<GetCafeteriaMenuResponse> {
    return this.repository.getCafeteriaMenuByDate(id, date);
  }

  // TODO: OpenAPI 타입 추가되면 활성화
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
  //   return this.repository.getCafeteriaMenuTimeline(id, params);
  // }

  async getCafeteriaMenuAvailability(
    id: string,
    params: {
      year: number;
      month: number;
    },
  ): Promise<GetCafeteriaMenuAvailabilityResponse> {
    // Validate year and month
    if (params.year < 2000 || params.year > 2100) {
      throw new Error("Invalid year");
    }
    if (params.month < 1 || params.month > 12) {
      throw new Error("Invalid month");
    }

    return this.repository.getCafeteriaMenuAvailability(id, params);
  }

  // TODO: OpenAPI 타입 추가되면 활성화
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
  //   return this.repository.getCafeteriaMenuReviews(id, params);
  // }

  async registerCafeteria(
    data: RegisterCafeteriaRequest,
  ): Promise<RegisterCafeteriaResponse> {
    // Validate required fields
    if (!data.name || data.name.trim().length === 0) {
      throw new Error("Cafeteria name is required");
    }
    if (!data.address || data.address.trim().length === 0) {
      throw new Error("Address is required");
    }

    return this.repository.registerCafeteria(data);
  }

  async registerCafeteriaMenu(
    data: RegisterCafeteriaMenuRequest,
  ): Promise<RegisterCafeteriaMenuResponse> {
    // Validate required fields
    if (!data.restaurantId) {
      throw new Error("Restaurant ID is required");
    }
    if (!data.menuDate) {
      throw new Error("Menu date is required");
    }
    if (!data.mealType) {
      throw new Error("Meal type is required");
    }
    if (!data.menuItems || data.menuItems.length === 0) {
      throw new Error("Menu items are required");
    }

    return this.repository.registerCafeteriaMenu(data);
  }
}
