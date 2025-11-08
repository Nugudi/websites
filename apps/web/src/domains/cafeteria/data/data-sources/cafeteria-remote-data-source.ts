/**
 * Cafeteria Remote DataSource
 *
 * 구내식당 관련 API 호출 담당
 * - HttpClient를 통해 실제 HTTP 요청 수행
 * - DTO 타입으로 응답 반환
 * - 비즈니스 로직 없음 (순수 데이터 접근만)
 */

import type { HttpClient } from "@core/infrastructure/http/http-client.interface";
import type {
  GetCafeteriaMenuAvailabilityResponse,
  GetCafeteriaMenuResponse,
  GetCafeteriaMenuTimelineResponse,
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
} from "../dto";

/**
 * CafeteriaRemoteDataSource
 *
 * 모든 메서드는 DTO를 반환합니다.
 */
export class CafeteriaRemoteDataSource {
  constructor(private readonly httpClient: HttpClient) {}

  /**
   * 구내식당 리스트 + 메뉴 조회 (무한 스크롤)
   */
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

  /**
   * 구내식당 상세 조회
   */
  async getCafeteriaById(id: string): Promise<GetCafeteriaResponse> {
    const response =
      await this.httpClient.get<SuccessResponseGetCafeteriaResponse>(
        `/api/v1/cafeterias/${id}`,
      );

    if (!response.data.data) {
      throw new Error(
        `Failed to fetch cafeteria: ${response.data.message || "No data returned"}`,
      );
    }

    return response.data.data;
  }

  /**
   * 구내식당 메뉴 조회 (특정 날짜)
   */
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

    if (!response.data.data) {
      throw new Error(
        `Failed to fetch cafeteria menu: ${response.data.message || "No data returned"}`,
      );
    }

    return response.data.data;
  }

  /**
   * 구내식당 메뉴 타임라인 조회 (무한 스크롤)
   *
   * TODO: 백엔드 API 완성되면 실제 엔드포인트로 교체
   * TEMPORARY: 현재는 stub 구현에서만 사용됨
   */
  async getCafeteriaMenuTimeline(
    _id: string,
    _params: {
      cursor?: string;
      size?: number;
    },
  ): Promise<{
    data: GetCafeteriaMenuTimelineResponse[];
    pageInfo: PageInfo;
  }> {
    // TODO: 실제 API 구현 시 아래 코드로 교체
    // const response = await this.httpClient.get<PageResponse...>(
    //   `/api/v1/cafeterias/${id}/menus/timeline`,
    //   { params }
    // );
    // return { data: response.data.data || [], pageInfo: response.data.pageInfo || ... };

    throw new Error(
      "getCafeteriaMenuTimeline is not yet implemented in real API - use stub repository",
    );
  }

  /**
   * 구내식당 메뉴 가용성 조회 (캘린더용)
   */
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

    if (!response.data.data) {
      throw new Error(
        `Failed to fetch menu availability: ${response.data.message || "No data returned"}`,
      );
    }

    return response.data.data;
  }

  /**
   * 구내식당 등록
   */
  async registerCafeteria(
    data: RegisterCafeteriaRequest,
  ): Promise<RegisterCafeteriaResponse> {
    const response =
      await this.httpClient.post<SuccessResponseRegisterCafeteriaResponse>(
        "/api/v1/cafeterias",
        data,
      );

    if (!response.data.data) {
      throw new Error(
        `Failed to register cafeteria: ${response.data.message || "No data returned"}`,
      );
    }

    return response.data.data;
  }

  /**
   * 구내식당 메뉴 등록
   */
  async registerCafeteriaMenu(
    data: RegisterCafeteriaMenuRequest,
  ): Promise<RegisterCafeteriaMenuResponse> {
    const response =
      await this.httpClient.post<SuccessResponseRegisterCafeteriaMenuResponse>(
        "/api/v1/cafeterias/menus",
        data,
      );

    if (!response.data.data) {
      throw new Error(
        `Failed to register cafeteria menu: ${response.data.message || "No data returned"}`,
      );
    }

    return response.data.data;
  }
}
