/**
 * Get Cafeteria By Id UseCase
 *
 * 구내식당 상세 정보를 조회하는 비즈니스 로직
 */

import type { Cafeteria } from "../entities";
import type { CafeteriaRepository } from "../repositories";

/**
 * Get Cafeteria By Id UseCase
 */
export interface GetCafeteriaByIdUseCase {
  execute(id: string): Promise<Cafeteria>;
}

/**
 * Get Cafeteria By Id UseCase Implementation
 */
export class GetCafeteriaByIdUseCaseImpl implements GetCafeteriaByIdUseCase {
  constructor(private readonly repository: CafeteriaRepository) {}

  /**
   * UseCase 실행
   */
  async execute(id: string): Promise<Cafeteria> {
    // Repository now returns Cafeteria entity directly
    const cafeteria = await this.repository.getCafeteriaById(id);

    return cafeteria;
  }
}
