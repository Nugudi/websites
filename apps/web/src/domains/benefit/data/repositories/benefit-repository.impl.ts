/**
 * Benefit Repository Implementation
 *
 * Data layer repository implementation
 * - Uses DataSource for data access
 * - Converts DTOs to Domain Entities using Mapper
 * - Implements BenefitRepository interface
 *
 * Pattern:
 * 1. DataSource에서 DTO 가져오기 (snake_case)
 * 2. Mapper로 Entity 변환 (camelCase)
 * 3. Domain Entity 반환
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
    return benefits.find((b) => b.id === benefitId) ?? null;
  }
}
