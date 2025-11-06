/**
 * Get Stamp Collection UseCase
 *
 * 스탬프 컬렉션 조회 UseCase
 * - 사용자의 스탬프 목록과 통계 정보를 조회합니다
 *
 * Responsibilities:
 * - Repository를 통한 스탬프 데이터 조회
 * - 비즈니스 로직 검증 (필요시)
 */

import type { StampCollection } from "../entities/stamp.entity";
import type { StampRepository } from "../repositories/stamp-repository.interface";

export interface GetStampCollectionUseCase {
  execute(): Promise<StampCollection>;
}

export class GetStampCollectionUseCaseImpl
  implements GetStampCollectionUseCase
{
  constructor(private readonly stampRepository: StampRepository) {}

  async execute(): Promise<StampCollection> {
    return await this.stampRepository.getStampCollection();
  }
}
