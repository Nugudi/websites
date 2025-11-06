/**
 * Benefit Repository Interface
 *
 * Domain layer repository interface
 * - Defines data access contract
 * - Returns Domain Entities (not DTOs)
 * - Implemented by Data layer
 *
 * Pattern:
 * - Domain layer에서 interface 정의
 * - Data layer에서 implementation 제공
 * - UseCase는 interface만 의존
 */

import type { Benefit, BenefitList } from "../entities/benefit.entity";

export interface BenefitRepository {
  /**
   * 혜택(메뉴) 목록 조회
   * @returns 혜택 목록과 전체 개수
   */
  getBenefitList(): Promise<BenefitList>;

  /**
   * 특정 혜택(메뉴) 조회
   * @param benefitId - 혜택 ID
   * @returns 혜택 정보 (없으면 null)
   */
  getBenefitById(benefitId: string): Promise<Benefit | null>;
}
