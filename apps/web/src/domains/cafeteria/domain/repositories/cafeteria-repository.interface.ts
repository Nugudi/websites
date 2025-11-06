/**
 * Cafeteria Repository Interface
 *
 * 구내식당 데이터 접근 계층 인터페이스
 * - 모든 HTTP 요청은 이 레이어에서 처리
 * - 비즈니스 로직 없음 (순수 데이터 액세스만)
 */

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
} from "../../data/dto";

export interface CafeteriaRepository {
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
