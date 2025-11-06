/**
 * Get Cafeteria By Id UseCase
 *
 * 구내식당 상세 정보를 조회하는 비즈니스 로직
 */

import type { GetCafeteriaResponse } from "../../data/dto";
import type { CafeteriaRepository } from "../repositories";

/**
 * GetCafeteriaById UseCase
 */
export class GetCafeteriaById {
  constructor(private readonly repository: CafeteriaRepository) {}

  /**
   * UseCase 실행
   */
  async execute(id: string): Promise<GetCafeteriaResponse> {
    const response = await this.repository.getCafeteriaById(id);

    if (!response || !response.cafeteria) {
      throw new Error("Cafeteria not found");
    }

    return response;
  }
}
