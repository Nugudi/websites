/**
 * Stamp Server DI Container
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

export class StampServerContainer {
  private _dataSource?: StampMockDataSource;
  private _repository?: StampRepositoryImpl;
  private _getStampCollectionUseCase?: GetStampCollectionUseCase;
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

  getConsumeStamp(): ConsumeStampUseCase {
    if (!this._consumeStampUseCase) {
      this._consumeStampUseCase = new ConsumeStampUseCaseImpl(
        this.getRepository(),
      );
    }
    return this._consumeStampUseCase;
  }
}

export function createStampServerContainer(): StampServerContainer {
  return new StampServerContainer();
}
