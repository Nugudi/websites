import type { Cafeteria } from "../entities";
import type { CafeteriaRepository } from "../repositories";

export interface GetCafeteriaByIdUseCase {
  execute(id: string): Promise<Cafeteria>;
}

export class GetCafeteriaByIdUseCaseImpl implements GetCafeteriaByIdUseCase {
  constructor(private readonly repository: CafeteriaRepository) {}

  async execute(id: string): Promise<Cafeteria> {
    const cafeteria = await this.repository.getCafeteriaById(id);
    return cafeteria;
  }
}
