/**
 * Register Cafeteria UseCase
 *
 * 구내식당을 등록하는 비즈니스 로직
 */

import type {
  RegisterCafeteriaRequest,
  RegisterCafeteriaResponse,
} from "../../data/dto";
import type { CafeteriaRepository } from "../repositories";

/**
 * Register Cafeteria UseCase
 */
export interface RegisterCafeteriaUseCase {
  execute(data: RegisterCafeteriaRequest): Promise<RegisterCafeteriaResponse>;
}

/**
 * Register Cafeteria UseCase Implementation
 */
export class RegisterCafeteriaUseCaseImpl implements RegisterCafeteriaUseCase {
  constructor(private readonly repository: CafeteriaRepository) {}

  /**
   * UseCase 실행
   */
  async execute(
    data: RegisterCafeteriaRequest,
  ): Promise<RegisterCafeteriaResponse> {
    // Validate required fields
    if (!data.name || data.name.trim().length === 0) {
      throw new Error("Cafeteria name is required");
    }
    if (!data.address || data.address.trim().length === 0) {
      throw new Error("Address is required");
    }

    return this.repository.registerCafeteria(data);
  }
}
