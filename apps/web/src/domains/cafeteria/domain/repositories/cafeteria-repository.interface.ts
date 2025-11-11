/**
 * Cafeteria Repository Interface
 *
 * 구내식당 데이터 접근 계층 인터페이스
 * - 모든 HTTP 요청은 이 레이어에서 처리
 * - 비즈니스 로직 없음 (순수 데이터 액세스만)
 */

import type { PageInfo } from "@core/types";
// Import Request DTOs
import type {
  RegisterCafeteriaMenuRequest,
  RegisterCafeteriaRequest,
} from "../../data/remote/dto";
// Import Domain Types (simple data structures without business logic)
import type {
  CafeteriaMenu,
  CafeteriaMenuTimeline,
  MenuAvailability,
} from "../../data/remote/dto/response/cafeteria-menu-types";
// Import Entity classes
import type { Cafeteria } from "../entities";

export interface CafeteriaRepository {
  getCafeteriasWithMenu(params: {
    date?: string;
    cursor?: string;
    size?: number;
  }): Promise<{
    data: Array<{
      cafeteria: Cafeteria;
      menus: CafeteriaMenu[];
    }>;
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
