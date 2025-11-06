/**
 * Get Cafeteria Menu Timeline UseCase
 *
 * 구내식당 메뉴 타임라인을 조회하는 비즈니스 로직
 * - 무한 스크롤용 메뉴 타임라인 조회
 */

import type { PageInfo } from "@shared/domain/entities";
import type { CafeteriaMenuTimeline } from "../entities";
import type { CafeteriaRepository } from "../repositories";

/**
 * Get Cafeteria Menu Timeline UseCase
 */
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

/**
 * Get Cafeteria Menu Timeline UseCase Implementation
 */
export class GetCafeteriaMenuTimelineUseCaseImpl
  implements GetCafeteriaMenuTimelineUseCase
{
  constructor(private readonly repository: CafeteriaRepository) {}

  /**
   * UseCase 실행
   */
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
    // Repository에서 타임라인 데이터 조회
    return this.repository.getCafeteriaMenuTimeline(id, params);
  }
}
