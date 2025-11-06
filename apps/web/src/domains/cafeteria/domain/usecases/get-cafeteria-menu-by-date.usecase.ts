/**
 * Get Cafeteria Menu By Date UseCase
 *
 * 특정 날짜의 구내식당 메뉴를 조회하는 비즈니스 로직
 */

import type { GetCafeteriaMenuResponse } from "../../data/dto";
import type { CafeteriaRepository } from "../repositories";

/**
 * Get Cafeteria Menu By Date UseCase
 */
export interface GetCafeteriaMenuByDateUseCase {
  execute(id: string, date: string): Promise<GetCafeteriaMenuResponse>;
}

/**
 * Get Cafeteria Menu By Date UseCase Implementation
 */
export class GetCafeteriaMenuByDateUseCaseImpl
  implements GetCafeteriaMenuByDateUseCase
{
  constructor(private readonly repository: CafeteriaRepository) {}

  /**
   * UseCase 실행
   */
  async execute(id: string, date: string): Promise<GetCafeteriaMenuResponse> {
    return this.repository.getCafeteriaMenuByDate(id, date);
  }
}
