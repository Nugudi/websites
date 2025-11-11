/**
 * Notification Client DI Container
 */

// Data Layer
import {
  NotificationRemoteDataSourceMockImpl,
  NotificationRepositoryImpl,
} from "@notification/data";
import {
  type GetNotificationListUseCase,
  GetNotificationListUseCaseImpl,
} from "../domain/usecases/get-notification-list.usecase";
import {
  type MarkAllAsReadUseCase,
  MarkAllAsReadUseCaseImpl,
} from "../domain/usecases/mark-all-as-read.usecase";
import {
  type MarkAsReadUseCase,
  MarkAsReadUseCaseImpl,
} from "../domain/usecases/mark-as-read.usecase";

export interface NotificationClientContainer {
  getGetNotificationList(): GetNotificationListUseCase;
  getMarkAsRead(): MarkAsReadUseCase;
  getMarkAllAsRead(): MarkAllAsReadUseCase;
}

export class NotificationClientContainerImpl
  implements NotificationClientContainer
{
  private _dataSource?: NotificationRemoteDataSourceMockImpl;
  private _repository?: NotificationRepositoryImpl;
  private _getNotificationListUseCase?: GetNotificationListUseCase;
  private _markAsReadUseCase?: MarkAsReadUseCase;
  private _markAllAsReadUseCase?: MarkAllAsReadUseCase;

  private getDataSource(): NotificationRemoteDataSourceMockImpl {
    if (!this._dataSource) {
      this._dataSource = new NotificationRemoteDataSourceMockImpl();
    }
    return this._dataSource;
  }

  private getRepository(): NotificationRepositoryImpl {
    if (!this._repository) {
      this._repository = new NotificationRepositoryImpl(this.getDataSource());
    }
    return this._repository;
  }

  getGetNotificationList(): GetNotificationListUseCase {
    if (!this._getNotificationListUseCase) {
      this._getNotificationListUseCase = new GetNotificationListUseCaseImpl(
        this.getRepository(),
      );
    }
    return this._getNotificationListUseCase;
  }

  getMarkAsRead(): MarkAsReadUseCase {
    if (!this._markAsReadUseCase) {
      this._markAsReadUseCase = new MarkAsReadUseCaseImpl(this.getRepository());
    }
    return this._markAsReadUseCase;
  }

  getMarkAllAsRead(): MarkAllAsReadUseCase {
    if (!this._markAllAsReadUseCase) {
      this._markAllAsReadUseCase = new MarkAllAsReadUseCaseImpl(
        this.getRepository(),
      );
    }
    return this._markAllAsReadUseCase;
  }
}

let clientContainerInstance: NotificationClientContainer | null = null;

export function getNotificationClientContainer(): NotificationClientContainer {
  if (!clientContainerInstance) {
    clientContainerInstance = new NotificationClientContainerImpl();
  }
  return clientContainerInstance;
}
