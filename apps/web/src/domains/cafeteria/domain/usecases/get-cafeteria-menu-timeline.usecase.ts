import type { PageInfo } from "@core/types";
import type { CafeteriaMenuTimeline } from "../entities";
import type { CafeteriaRepository } from "../repositories";

export interface GetCafeteriaMenuTimelineUseCase {
  execute(
    id: string,
    params: {
      cursor?: string;
      size?: number;
    },
  ): Promise<{
    data: CafeteriaMenuTimeline[];
    pageInfo: PageInfo;
  }>;
}

export class GetCafeteriaMenuTimelineUseCaseImpl
  implements GetCafeteriaMenuTimelineUseCase
{
  constructor(private readonly repository: CafeteriaRepository) {}

  async execute(
    id: string,
    params: {
      cursor?: string;
      size?: number;
    },
  ): Promise<{
    data: CafeteriaMenuTimeline[];
    pageInfo: PageInfo;
  }> {
    return this.repository.getCafeteriaMenuTimeline(id, params);
  }
}
