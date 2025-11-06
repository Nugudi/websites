/**
 * Stamp Repository Interface
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

import type { Stamp, StampCollection } from "../entities/stamp.entity";

export interface StampRepository {
  /**
   * 스탬프 컬렉션 조회
   * @returns 스탬프 목록과 통계 정보
   */
  getStampCollection(): Promise<StampCollection>;

  /**
   * 특정 스탬프 조회
   * @param stampId - 스탬프 ID
   * @returns 스탬프 정보 (없으면 null)
   */
  getStampById(stampId: string): Promise<Stamp | null>;

  /**
   * 스탬프 사용 처리
   * @param stampId - 사용할 스탬프 ID
   */
  useStamp(stampId: string): Promise<void>;
}
