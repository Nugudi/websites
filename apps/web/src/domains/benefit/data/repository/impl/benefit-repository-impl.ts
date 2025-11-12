/**
 * Benefit Repository Implementation
 *
 * Data Layer의 Repository 구현
 *
 * @remarks
 * - Domain Repository 인터페이스 구현
 * - DataSource를 통한 데이터 조회
 * - DTO → Entity 변환 (Mapper 사용)
 * - BenefitError 사용
 * - Clean Architecture: Data Layer
 */

import type {
  Benefit,
  BenefitList,
} from "../../../domain/entities/benefit.entity";
import {
  BENEFIT_ERROR_CODES,
  BenefitError,
} from "../../../domain/errors/benefit-error";
import type { BenefitRepository } from "../../../domain/repositories/benefit-repository.interface";
import { benefitDtoListToDomain } from "../../mapper/benefit.mapper";
import type { BenefitRemoteDataSource } from "../datasource/benefit-remote-data-source";

export class BenefitRepositoryImpl implements BenefitRepository {
  constructor(private readonly dataSource: BenefitRemoteDataSource) {}

  async getBenefitList(): Promise<BenefitList> {
    try {
      const response = await this.dataSource.getBenefitList();

      if (!response.benefits) {
        throw new BenefitError(
          "혜택 목록 데이터가 없습니다.",
          BENEFIT_ERROR_CODES.INVALID_BENEFIT_DATA,
        );
      }

      const benefits = benefitDtoListToDomain(response.benefits);
      return {
        benefits,
        totalCount: response.total_count,
      };
    } catch (error) {
      // BenefitError인 경우 그대로 전파
      if (error instanceof BenefitError) {
        throw error;
      }

      // 그 외 Unknown Error
      throw new BenefitError(
        "혜택 목록 조회에 실패했습니다.",
        BENEFIT_ERROR_CODES.BENEFIT_LIST_FETCH_FAILED,
        error,
      );
    }
  }

  async getBenefitById(benefitId: string): Promise<Benefit | null> {
    try {
      if (!benefitId || benefitId.trim().length === 0) {
        throw new BenefitError(
          "Benefit ID가 필요합니다.",
          BENEFIT_ERROR_CODES.BENEFIT_ID_REQUIRED,
        );
      }

      const { benefits } = await this.getBenefitList();
      const found = benefits.find((b) => b.getId() === benefitId);

      if (!found) {
        return null;
      }

      return found;
    } catch (error) {
      // BenefitError인 경우 그대로 전파
      if (error instanceof BenefitError) {
        throw error;
      }

      // 그 외 Unknown Error
      throw new BenefitError(
        "혜택 조회에 실패했습니다.",
        BENEFIT_ERROR_CODES.BENEFIT_NOT_FOUND,
        error,
      );
    }
  }
}
