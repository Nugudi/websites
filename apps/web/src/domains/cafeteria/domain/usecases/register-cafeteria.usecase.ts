import type { Cafeteria, RegisterCafeteriaRequest } from "../entities";
import type { CafeteriaRepository } from "../repositories";

export interface RegisterCafeteriaUseCase {
  execute(data: RegisterCafeteriaRequest): Promise<Cafeteria>;
}

export class RegisterCafeteriaUseCaseImpl implements RegisterCafeteriaUseCase {
  constructor(private readonly repository: CafeteriaRepository) {}

  async execute(data: RegisterCafeteriaRequest): Promise<Cafeteria> {
    if (!data.name || data.name.trim().length === 0) {
      throw new Error("Cafeteria name is required");
    }
    if (!data.address || data.address.trim().length === 0) {
      throw new Error("Address is required");
    }

    return this.repository.registerCafeteria(data);
  }
}
