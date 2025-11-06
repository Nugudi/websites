/**
 * Get Cafeterias With Menu UseCase
 *
 * 구내식당 리스트와 메뉴를 조회하는 비즈니스 로직 (무한 스크롤)
 */

import type { GetCafeteriaWithMenuResponse, PageInfo } from "../../data/dto";
import type { CafeteriaRepository } from "../repositories";

/**
 * UseCase 입력 파라미터
 */
export interface GetCafeteriasWithMenuParams {
  date?: string;
  cursor?: string;
  size?: number;
}

/**
 * UseCase 출력 결과
 */
export interface GetCafeteriasWithMenuResult {
  data: GetCafeteriaWithMenuResponse[];
  pageInfo: PageInfo;
}

/**
 * GetCafeteriasWithMenu UseCase
 */
export class GetCafeteriasWithMenu {
  constructor(private readonly repository: CafeteriaRepository) {}

  /**
   * UseCase 실행
   */
  async execute(
    params: GetCafeteriasWithMenuParams,
  ): Promise<GetCafeteriasWithMenuResult> {
    return this.repository.getCafeteriasWithMenu(params);
  }
}
