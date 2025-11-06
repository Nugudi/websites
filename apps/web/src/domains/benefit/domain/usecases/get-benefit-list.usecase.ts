/**
 * Get Benefit List UseCase
 *
 * 혜택(메뉴) 목록 조회 UseCase
 * - 사용자의 혜택 목록을 조회합니다
 *
 * Responsibilities:
 * - Repository를 통한 혜택 데이터 조회
 * - 비즈니스 로직 검증 (필요시)
 */

import type { BenefitList } from "../entities/benefit.entity";
import type { BenefitRepository } from "../repositories/benefit-repository.interface";

export interface GetBenefitListUseCase {
  execute(): Promise<BenefitList>;
}

export class GetBenefitListUseCaseImpl implements GetBenefitListUseCase {
  constructor(private readonly benefitRepository: BenefitRepository) {}

  async execute(): Promise<BenefitList> {
    return await this.benefitRepository.getBenefitList();
  }
}
