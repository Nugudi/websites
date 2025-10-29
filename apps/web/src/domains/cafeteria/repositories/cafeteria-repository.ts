import type { HttpClient } from "@/src/shared/infrastructure/http";
import type {
  GetCafeteriaMenuAvailabilityResponse,
  GetCafeteriaMenuResponse,
  GetCafeteriaResponse,
  GetCafeteriaWithMenuResponse,
  PageInfo,
  PageResponseGetCafeteriaWithMenuResponse,
  RegisterCafeteriaMenuRequest,
  RegisterCafeteriaMenuResponse,
  RegisterCafeteriaRequest,
  RegisterCafeteriaResponse,
  SuccessResponseGetCafeteriaMenuAvailabilityResponse,
  SuccessResponseGetCafeteriaMenuResponse,
  SuccessResponseGetCafeteriaResponse,
  SuccessResponseRegisterCafeteriaMenuResponse,
  SuccessResponseRegisterCafeteriaResponse,
} from "../types";

/**
 * Cafeteria Repository Interface
 *
 * 구내식당 데이터 접근 계층
 * - 모든 HTTP 요청은 이 레이어에서 처리
 * - 비즈니스 로직 없음 (순수 데이터 액세스만)
 */
export interface CafeteriaRepository {
  // ==========================================
  // Cafeteria 조회
  // ==========================================

  /**
   * 구내식당 리스트 + 메뉴 조회 (무한 스크롤)
   * GET /api/v1/cafeterias
   *
   * @param params - 조회 파라미터 (날짜, 커서, 사이즈)
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
   * GET /api/v1/cafeterias/{id}
   *
   * @param id - 구내식당 ID
   */
  getCafeteriaById(id: string): Promise<GetCafeteriaResponse>;

  // ==========================================
  // Menu 조회
  // ==========================================

  /**
   * 구내식당 메뉴 조회 (특정 날짜)
   * GET /api/v1/cafeterias/{id}/menus
   *
   * @param id - 구내식당 ID
   * @param date - 조회할 날짜 (YYYY-MM-DD)
   */
  getCafeteriaMenuByDate(
    id: string,
    date: string,
  ): Promise<GetCafeteriaMenuResponse>;

  /**
   * TODO: OpenAPI 타입이 추가되면 활성화
   * 구내식당 메뉴 타임라인 조회 (무한 스크롤)
   * GET /api/v1/cafeterias/{id}/menus/timeline
   *
   * @param id - 구내식당 ID
   * @param params - 조회 파라미터 (커서, 사이즈)
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
   * GET /api/v1/cafeterias/{id}/menus/availability
   *
   * @param id - 구내식당 ID
   * @param params - 조회 파라미터 (연도, 월)
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
   * TODO: OpenAPI 타입이 추가되면 활성화
   * 구내식당 메뉴 리뷰 조회 (무한 스크롤)
   * GET /api/v1/cafeterias/{id}/reviews
   *
   * @param id - 구내식당 ID
   * @param params - 조회 파라미터 (날짜, 커서, 사이즈)
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
   * POST /api/v1/cafeterias
   *
   * @param data - 구내식당 등록 데이터
   */
  registerCafeteria(
    data: RegisterCafeteriaRequest,
  ): Promise<RegisterCafeteriaResponse>;

  /**
   * 구내식당 메뉴 등록
   * POST /api/v1/cafeterias/menus
   *
   * @param data - 메뉴 등록 데이터
   */
  registerCafeteriaMenu(
    data: RegisterCafeteriaMenuRequest,
  ): Promise<RegisterCafeteriaMenuResponse>;
}

/**
 * Cafeteria Repository Implementation
 *
 * HttpClient를 사용하여 실제 API 호출 수행
 */
export class CafeteriaRepositoryImpl implements CafeteriaRepository {
  constructor(private readonly httpClient: HttpClient) {}

  async getCafeteriasWithMenu(params: {
    date?: string;
    cursor?: string;
    size?: number;
  }): Promise<{
    data: GetCafeteriaWithMenuResponse[];
    pageInfo: PageInfo;
  }> {
    const response =
      await this.httpClient.get<PageResponseGetCafeteriaWithMenuResponse>(
        "/api/v1/cafeterias",
        { params },
      );

    return {
      data: response.data.data || [],
      pageInfo: response.data.pageInfo || {
        nextCursor: undefined,
        size: 0,
        hasNext: false,
      },
    };
  }

  async getCafeteriaById(id: string): Promise<GetCafeteriaResponse> {
    const response =
      await this.httpClient.get<SuccessResponseGetCafeteriaResponse>(
        `/api/v1/cafeterias/${id}`,
      );
    return response.data.data!;
  }

  async getCafeteriaMenuByDate(
    id: string,
    date: string,
  ): Promise<GetCafeteriaMenuResponse> {
    const response =
      await this.httpClient.get<SuccessResponseGetCafeteriaMenuResponse>(
        `/api/v1/cafeterias/${id}/menus`,
        {
          params: { date },
        },
      );
    return response.data.data!;
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
  //   const response =
  //     await this.httpClient.get<PageResponseGetCafeteriaMenuTimelineResponse>(
  //       `/api/v1/cafeterias/${id}/menus/timeline`,
  //       { params },
  //     );

  //   return {
  //     data: response.data.data || [],
  //     pageInfo: response.data.pageInfo || {
  //       nextCursor: undefined,
  //       size: 0,
  //       hasNext: false,
  //     },
  //   };
  // }

  async getCafeteriaMenuAvailability(
    id: string,
    params: {
      year: number;
      month: number;
    },
  ): Promise<GetCafeteriaMenuAvailabilityResponse> {
    const response =
      await this.httpClient.get<SuccessResponseGetCafeteriaMenuAvailabilityResponse>(
        `/api/v1/cafeterias/${id}/menus/availability`,
        { params },
      );
    return response.data.data!;
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
  //   const response =
  //     await this.httpClient.get<PageResponseGetCafeteriaMenuReviewResponse>(
  //       `/api/v1/cafeterias/${id}/reviews`,
  //       { params },
  //     );

  //   return {
  //     data: response.data.data || [],
  //     pageInfo: response.data.pageInfo || {
  //       nextCursor: undefined,
  //       size: 0,
  //       hasNext: false,
  //     },
  //   };
  // }

  async registerCafeteria(
    data: RegisterCafeteriaRequest,
  ): Promise<RegisterCafeteriaResponse> {
    const response =
      await this.httpClient.post<SuccessResponseRegisterCafeteriaResponse>(
        "/api/v1/cafeterias",
        data,
      );
    return response.data.data!;
  }

  async registerCafeteriaMenu(
    data: RegisterCafeteriaMenuRequest,
  ): Promise<RegisterCafeteriaMenuResponse> {
    const response =
      await this.httpClient.post<SuccessResponseRegisterCafeteriaMenuResponse>(
        "/api/v1/cafeterias/menus",
        data,
      );
    return response.data.data!;
  }
}
