/**
 * Get Cafeteria Menu By Date UseCase
 *
 * 특정 날짜의 구내식당 메뉴를 조회하는 비즈니스 로직
 */

import type { GetCafeteriaMenuResponse } from "../../data/dto";
import type { CafeteriaRepository } from "../repositories";

/**
 * GetCafeteriaMenuByDate UseCase
 */
export class GetCafeteriaMenuByDate {
  constructor(private readonly repository: CafeteriaRepository) {}

  /**
   * UseCase 실행
   */
  async execute(id: string, date: string): Promise<GetCafeteriaMenuResponse> {
    return this.repository.getCafeteriaMenuByDate(id, date);
  }
}
