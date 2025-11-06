/**
 * Get Cafeteria Menu Availability UseCase
 *
 * 구내식당 메뉴 가용성을 조회하는 비즈니스 로직 (캘린더용)
 */

import type { GetCafeteriaMenuAvailabilityResponse } from "../../data/dto";
import type { CafeteriaRepository } from "../repositories";

/**
 * UseCase 입력 파라미터
 */
export interface GetCafeteriaMenuAvailabilityParams {
  year: number;
  month: number;
}

/**
 * GetCafeteriaMenuAvailability UseCase
 */
export class GetCafeteriaMenuAvailability {
  constructor(private readonly repository: CafeteriaRepository) {}

  /**
   * UseCase 실행
   */
  async execute(
    id: string,
    params: GetCafeteriaMenuAvailabilityParams,
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
}
