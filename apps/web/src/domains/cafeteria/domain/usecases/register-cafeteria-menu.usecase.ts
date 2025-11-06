/**
 * Register Cafeteria Menu UseCase
 *
 * 구내식당 메뉴를 등록하는 비즈니스 로직
 */

import type {
  RegisterCafeteriaMenuRequest,
  RegisterCafeteriaMenuResponse,
} from "../../data/dto";
import type { CafeteriaRepository } from "../repositories";

/**
 * Register Cafeteria Menu UseCase
 */
export interface RegisterCafeteriaMenuUseCase {
  execute(
    data: RegisterCafeteriaMenuRequest,
  ): Promise<RegisterCafeteriaMenuResponse>;
}

/**
 * Register Cafeteria Menu UseCase Implementation
 */
export class RegisterCafeteriaMenuUseCaseImpl
  implements RegisterCafeteriaMenuUseCase
{
  constructor(private readonly repository: CafeteriaRepository) {}

  /**
   * UseCase 실행
   */
  async execute(
    data: RegisterCafeteriaMenuRequest,
  ): Promise<RegisterCafeteriaMenuResponse> {
    // Validate required fields
    if (!data.restaurantId) {
      throw new Error("Restaurant ID is required");
    }
    if (!data.menuDate) {
      throw new Error("Menu date is required");
    }
    if (!data.mealType) {
      throw new Error("Meal type is required");
    }
    if (!data.menuItems || data.menuItems.length === 0) {
      throw new Error("Menu items are required");
    }

    return this.repository.registerCafeteriaMenu(data);
  }
}
