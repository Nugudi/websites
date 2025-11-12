/**
 * Stamp Client DI Container
 */

// Data Layer
import {
  StampRemoteDataSourceMockImpl,
  StampRepositoryImpl,
} from "@stamp/data";
import {
  type ConsumeStampUseCase,
  ConsumeStampUseCaseImpl,
} from "../domain/usecases/consume-stamp.usecase";
import {
  type GetStampCollectionUseCase,
  GetStampCollectionUseCaseImpl,
} from "../domain/usecases/get-stamp-collection.usecase";

export interface StampClientContainer {
  getGetStampCollection(): GetStampCollectionUseCase;
  getConsumeStamp(): ConsumeStampUseCase;
}

export class StampClientContainerImpl implements StampClientContainer {
  private _dataSource?: StampRemoteDataSourceMockImpl;
  private _repository?: StampRepositoryImpl;
  private _getStampCollectionUseCase?: GetStampCollectionUseCase;
  private _consumeStampUseCase?: ConsumeStampUseCase;

  private getDataSource(): StampRemoteDataSourceMockImpl {
    if (!this._dataSource) {
      this._dataSource = new StampRemoteDataSourceMockImpl();
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

let clientContainer: StampClientContainer | null = null;

export function getStampClientContainer(): StampClientContainer {
  if (!clientContainer) {
    clientContainer = new StampClientContainerImpl();
  }
  return clientContainer;
}
