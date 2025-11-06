/**
 * Benefit Client DI Container
 *
 * Client-side Dependency Injection Container
 * - Lazy-initialized singleton (Stateful)
 * - Use in Client Components, Hooks, Browser-side logic
 *
 * Usage:
 * ```typescript
 * const container = getBenefitClientContainer();
 * const getBenefitListUseCase = container.getGetBenefitList();
 * const result = await getBenefitListUseCase.execute();
 * ```
 */

import { BenefitMockDataSource } from "../data/data-sources/benefit-mock-data-source";
import { BenefitRepositoryImpl } from "../data/repositories/benefit-repository.impl";
import {
  type GetBenefitListUseCase,
  GetBenefitListUseCaseImpl,
} from "../domain/usecases/get-benefit-list.usecase";

export class BenefitClientContainer {
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

/**
 * Global singleton instance
 */
let clientContainer: BenefitClientContainer | null = null;

/**
 * Get or create singleton instance
 * - Lazy initialization
 * - Ensures single instance across application
 */
export function getBenefitClientContainer(): BenefitClientContainer {
  if (!clientContainer) {
    clientContainer = new BenefitClientContainer();
  }
  return clientContainer;
}
