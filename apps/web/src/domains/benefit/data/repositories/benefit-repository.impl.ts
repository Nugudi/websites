/**
 * Benefit Repository Implementation
 */

import type {
  Benefit,
  BenefitList,
} from "../../domain/entities/benefit.entity";
import type { BenefitRepository } from "../../domain/repositories/benefit-repository.interface";
import type { BenefitDataSource } from "../data-sources/benefit-mock-data-source";
import { benefitDtoListToDomain } from "../mappers/benefit.mapper";

export class BenefitRepositoryImpl implements BenefitRepository {
  constructor(private readonly dataSource: BenefitDataSource) {}

  async getBenefitList(): Promise<BenefitList> {
    const response = await this.dataSource.getBenefitList();
    const benefits = benefitDtoListToDomain(response.benefits);
    return {
      benefits,
      totalCount: response.total_count,
    };
  }

  async getBenefitById(benefitId: string): Promise<Benefit | null> {
    const { benefits } = await this.getBenefitList();
    return benefits.find((b) => b.getId() === benefitId) ?? null;
  }
}
