import type { MenuAvailability } from "../entities";
import type { CafeteriaRepository } from "../repositories";

export interface GetCafeteriaMenuAvailabilityParams {
  year: number;
  month: number;
}

export interface GetCafeteriaMenuAvailabilityUseCase {
  execute(
    id: string,
    params: GetCafeteriaMenuAvailabilityParams,
  ): Promise<MenuAvailability>;
}

export class GetCafeteriaMenuAvailabilityUseCaseImpl
  implements GetCafeteriaMenuAvailabilityUseCase
{
  constructor(private readonly repository: CafeteriaRepository) {}

  async execute(
    id: string,
    params: GetCafeteriaMenuAvailabilityParams,
  ): Promise<MenuAvailability> {
    if (params.year < 2000 || params.year > 2100) {
      throw new Error("Invalid year");
    }
    if (params.month < 1 || params.month > 12) {
      throw new Error("Invalid month");
    }

    return this.repository.getCafeteriaMenuAvailability(id, params);
  }
}
