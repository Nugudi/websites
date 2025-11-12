/**
 * Benefit Client DI Container
 */

import { BenefitMockDataSource } from "../data/remote/mock/benefit-mock-data-source";
import { BenefitRepositoryImpl } from "../data/repository/impl/benefit-repository-impl";
import {
  type GetBenefitListUseCase,
  GetBenefitListUseCaseImpl,
} from "../domain/usecases/get-benefit-list.usecase";

export interface BenefitClientContainer {
  getGetBenefitList(): GetBenefitListUseCase;
}

export class BenefitClientContainerImpl implements BenefitClientContainer {
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

let clientContainer: BenefitClientContainer | null = null;

export function getBenefitClientContainer(): BenefitClientContainer {
  if (!clientContainer) {
    clientContainer = new BenefitClientContainerImpl();
  }
  return clientContainer;
}
