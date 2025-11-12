/**
 * Cafeteria Remote DataSource Interface
 *
 * Data Layer의 DataSource 인터페이스
 *
 * @remarks
 * - Repository에서 사용하는 계약(Contract)
 * - 구체적인 구현은 remote/api/에 위치
 * - Clean Architecture: Data Layer
 */

import type {
  GetCafeteriaMenuAvailabilityResponse,
  GetCafeteriaMenuResponse,
  GetCafeteriaMenuTimelineResponse,
  GetCafeteriaResponse,
  GetCafeteriaWithMenuResponse,
  PageInfo,
  RegisterCafeteriaMenuRequest,
  RegisterCafeteriaMenuResponse,
  RegisterCafeteriaRequest,
  RegisterCafeteriaResponse,
} from "../../remote/dto";

export interface CafeteriaRemoteDataSource {
  getCafeteriasWithMenu(params: {
    date?: string;
    cursor?: string;
    size?: number;
  }): Promise<{
    data: GetCafeteriaWithMenuResponse[];
    pageInfo: PageInfo;
  }>;

  getCafeteriaById(id: string): Promise<GetCafeteriaResponse>;

  getCafeteriaMenuByDate(
    id: string,
    date: string,
  ): Promise<GetCafeteriaMenuResponse>;

  getCafeteriaMenuTimeline(
    id: string,
    params: {
      cursor?: string;
      size?: number;
    },
  ): Promise<{
    data: GetCafeteriaMenuTimelineResponse[];
    pageInfo: PageInfo;
  }>;

  getCafeteriaMenuAvailability(
    id: string,
    params: {
      year: number;
      month: number;
    },
  ): Promise<GetCafeteriaMenuAvailabilityResponse>;

  registerCafeteria(
    data: RegisterCafeteriaRequest,
  ): Promise<RegisterCafeteriaResponse>;

  registerCafeteriaMenu(
    data: RegisterCafeteriaMenuRequest,
  ): Promise<RegisterCafeteriaMenuResponse>;
}
