/**
 * Benefit Remote DataSource Interface
 *
 * Data Layer의 DataSource 인터페이스
 *
 * @remarks
 * - Clean Architecture: Data Layer (Domain이 아님!)
 * - DTO 사용 (API 응답 구조)
 * - 구현은 Infrastructure Layer (data/remote/*)
 */

import type { GetBenefitListResponseDTO } from "../../remote/dto";

/**
 * Benefit Remote DataSource
 *
 * Repository에서 사용할 데이터 접근 인터페이스
 */
export interface BenefitRemoteDataSource {
  /**
   * 혜택(메뉴) 목록 조회
   * @returns 혜택 목록 DTO
   */
  getBenefitList(): Promise<GetBenefitListResponseDTO>;
}
