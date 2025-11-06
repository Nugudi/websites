/**
 * Stamp Client DI Container
 *
 * Client-side Dependency Injection Container
 * - Lazy-initialized singleton (Stateful)
 * - Use in Client Components, Hooks, Browser-side logic
 *
 * Usage:
 * ```typescript
 * const container = getStampClientContainer();
 * const getStampCollectionUseCase = container.getGetStampCollection();
 * const result = await getStampCollectionUseCase.execute();
 * ```
 */

import { StampMockDataSource } from "../data/data-sources/stamp-mock-data-source";
import { StampRepositoryImpl } from "../data/repositories/stamp-repository.impl";
import {
  type ConsumeStampUseCase,
  ConsumeStampUseCaseImpl,
} from "../domain/usecases/consume-stamp.usecase";
import {
  type GetStampCollectionUseCase,
  GetStampCollectionUseCaseImpl,
} from "../domain/usecases/get-stamp-collection.usecase";
import {
  type GetStampCollectionForUIUseCase,
  GetStampCollectionForUIUseCaseImpl,
} from "../domain/usecases/get-stamp-collection-for-ui.usecase";

export class StampClientContainer {
  private _dataSource?: StampMockDataSource;
  private _repository?: StampRepositoryImpl;
  private _getStampCollectionUseCase?: GetStampCollectionUseCase;
  private _getStampCollectionForUIUseCase?: GetStampCollectionForUIUseCase;
  private _consumeStampUseCase?: ConsumeStampUseCase;

  private getDataSource(): StampMockDataSource {
    if (!this._dataSource) {
      this._dataSource = new StampMockDataSource();
    }
    return this._dataSource;
  }

  private getRepository(): StampRepositoryImpl {
    if (!this._repository) {
      this._repository = new StampRepositoryImpl(this.getDataSource());
    }
    return this._repository;
  }

  getGetStampCollection(): GetStampCollectionUseCase {
    if (!this._getStampCollectionUseCase) {
      this._getStampCollectionUseCase = new GetStampCollectionUseCaseImpl(
        this.getRepository(),
      );
    }
    return this._getStampCollectionUseCase;
  }

  getGetStampCollectionForUI(): GetStampCollectionForUIUseCase {
    if (!this._getStampCollectionForUIUseCase) {
      this._getStampCollectionForUIUseCase =
        new GetStampCollectionForUIUseCaseImpl(this.getRepository());
    }
    return this._getStampCollectionForUIUseCase;
  }

  getConsumeStamp(): ConsumeStampUseCase {
    if (!this._consumeStampUseCase) {
      this._consumeStampUseCase = new ConsumeStampUseCaseImpl(
        this.getRepository(),
      );
    }
    return this._consumeStampUseCase;
  }
}

/**
 * Global singleton instance
 */
let clientContainer: StampClientContainer | null = null;

/**
 * Get or create singleton instance
 * - Lazy initialization
 * - Ensures single instance across application
 */
export function getStampClientContainer(): StampClientContainer {
  if (!clientContainer) {
    clientContainer = new StampClientContainer();
  }
  return clientContainer;
}
