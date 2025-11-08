import type { PageInfo } from "@core/types";
import type { Cafeteria, CafeteriaMenu } from "../entities";
import type { CafeteriaRepository } from "../repositories";

export interface GetCafeteriasWithMenuParams {
  date?: string;
  cursor?: string;
  size?: number;
}

export interface GetCafeteriasWithMenuResult {
  data: Array<{
    cafeteria: Cafeteria;
    menus: CafeteriaMenu[];
  }>;
  pageInfo: PageInfo;
}

export interface GetCafeteriasWithMenuUseCase {
  execute(
    params: GetCafeteriasWithMenuParams,
  ): Promise<GetCafeteriasWithMenuResult>;
}

export class GetCafeteriasWithMenuUseCaseImpl
  implements GetCafeteriasWithMenuUseCase
{
  constructor(private readonly repository: CafeteriaRepository) {}

  async execute(
    params: GetCafeteriasWithMenuParams,
  ): Promise<GetCafeteriasWithMenuResult> {
    return this.repository.getCafeteriasWithMenu(params);
  }
}
