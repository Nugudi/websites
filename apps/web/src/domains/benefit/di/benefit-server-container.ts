/**
 * Benefit Server DI Container
 */

import { BenefitMockDataSource } from "../data/data-sources/benefit-mock-data-source";
import { BenefitRepositoryImpl } from "../data/repositories/benefit-repository.impl";
import {
  type GetBenefitListUseCase,
  GetBenefitListUseCaseImpl,
} from "../domain/usecases/get-benefit-list.usecase";

export class BenefitServerContainer {
  private _dataSource?: BenefitMockDataSource;
  private _repository?: BenefitRepositoryImpl;
  private _getBenefitListUseCase?: GetBenefitListUseCase;

  private getDataSource(): BenefitMockDataSource {
    if (!this._dataSource) {
      this._dataSource = new BenefitMockDataSource();
    }
    return this._dataSource;
  }

  private getRepository(): BenefitRepositoryImpl {
    if (!this._repository) {
      this._repository = new BenefitRepositoryImpl(this.getDataSource());
    }
    return this._repository;
  }

  getGetBenefitList(): GetBenefitListUseCase {
    if (!this._getBenefitListUseCase) {
      this._getBenefitListUseCase = new GetBenefitListUseCaseImpl(
        this.getRepository(),
      );
    }
    return this._getBenefitListUseCase;
  }
}

export function createBenefitServerContainer(): BenefitServerContainer {
  return new BenefitServerContainer();
}
