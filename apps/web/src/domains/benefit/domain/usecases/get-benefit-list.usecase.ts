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
