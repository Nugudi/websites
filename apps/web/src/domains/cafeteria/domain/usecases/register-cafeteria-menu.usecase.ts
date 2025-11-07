import type { CafeteriaMenu, RegisterCafeteriaMenuRequest } from "../entities";
import type { CafeteriaRepository } from "../repositories";

export interface RegisterCafeteriaMenuUseCase {
  execute(data: RegisterCafeteriaMenuRequest): Promise<CafeteriaMenu>;
}

export class RegisterCafeteriaMenuUseCaseImpl
  implements RegisterCafeteriaMenuUseCase
{
  constructor(private readonly repository: CafeteriaRepository) {}

  async execute(data: RegisterCafeteriaMenuRequest): Promise<CafeteriaMenu> {
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
