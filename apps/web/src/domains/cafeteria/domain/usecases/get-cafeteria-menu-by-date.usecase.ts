import type { CafeteriaMenu } from "../entities";
import type { CafeteriaRepository } from "../repositories";

export interface GetCafeteriaMenuByDateUseCase {
  execute(id: string, date: string): Promise<CafeteriaMenu>;
}

export class GetCafeteriaMenuByDateUseCaseImpl
  implements GetCafeteriaMenuByDateUseCase
{
  constructor(private readonly repository: CafeteriaRepository) {}

  async execute(id: string, date: string): Promise<CafeteriaMenu> {
    return this.repository.getCafeteriaMenuByDate(id, date);
  }
}
