/**
 * Cafeteria Repository Interface
 *
 * 구내식당 데이터 접근 계층 인터페이스
 * - 모든 HTTP 요청은 이 레이어에서 처리
 * - 비즈니스 로직 없음 (순수 데이터 액세스만)
 */

import type { PageInfo } from "@shared/domain/entities";
import type {
  Cafeteria,
  CafeteriaMenu,
  CafeteriaMenuTimeline,
  CafeteriaWithMenu,
  MenuAvailability,
  RegisterCafeteriaMenuRequest,
  RegisterCafeteriaRequest,
} from "../entities";

export interface CafeteriaRepository {
  getCafeteriasWithMenu(params: {
    date?: string;
    cursor?: string;
    size?: number;
  }): Promise<{
    data: CafeteriaWithMenu[];
    pageInfo: PageInfo;
  }>;

  getCafeteriaById(id: string): Promise<Cafeteria>;

  getCafeteriaMenuByDate(id: string, date: string): Promise<CafeteriaMenu>;

  getCafeteriaMenuTimeline(
    id: string,
    params: {
      cursor?: string;
      size?: number;
    },
  ): Promise<{
    data: CafeteriaMenuTimeline[];
    pageInfo: PageInfo;
  }>;

  getCafeteriaMenuAvailability(
    id: string,
    params: {
      year: number;
      month: number;
    },
  ): Promise<MenuAvailability>;

  registerCafeteria(data: RegisterCafeteriaRequest): Promise<Cafeteria>;

  registerCafeteriaMenu(
    data: RegisterCafeteriaMenuRequest,
  ): Promise<CafeteriaMenu>;
}
