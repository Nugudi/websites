/**
 * Get Stamp Collection For UI UseCase
 *
 * 스탬프 컬렉션 조회 UseCase (UI-ready data)
 * - UI에서 바로 사용 가능한 형태로 데이터를 반환합니다
 * - Repository의 mapper를 통해 변환된 데이터를 그대로 전달
 *
 * Responsibilities:
 * - Repository를 통한 UI-ready 스탬프 데이터 조회
 * - Presentation layer로 데이터 전달
 */

import type {
  StampCollectionResponse,
  StampRepositoryImpl,
} from "../../data/repositories/stamp-repository.impl";

/**
 * GetStampCollectionForUIUseCase Interface
 */
export interface GetStampCollectionForUIUseCase {
  execute(): Promise<StampCollectionResponse>;
}

/**
 * GetStampCollectionForUIUseCase Implementation
 */
export class GetStampCollectionForUIUseCaseImpl
  implements GetStampCollectionForUIUseCase
{
  constructor(private readonly stampRepository: StampRepositoryImpl) {}

  async execute(): Promise<StampCollectionResponse> {
    // Repository에서 UI-ready data를 바로 반환
    return await this.stampRepository.getStampCollectionForUI();
  }
}
