/**
 * Notification Server DI Container
 *
 * Server-side Dependency Injection Container
 * - Creates new instance per request (Stateless)
 * - Use in Server Components, API Routes, Server Actions
 *
 * Usage:
 * ```typescript
 * const container = createNotificationServerContainer();
 * const getNotificationListUseCase = container.getGetNotificationList();
 * const result = await getNotificationListUseCase.execute();
 * ```
 */

import { NotificationMockDataSource } from "../data/data-sources/notification-mock-data-source";
import { NotificationRepositoryImpl } from "../data/repositories/notification-repository.impl";
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

/**
 * Notification Server Container
 */
export class NotificationServerContainer {
  // Lazy-initialized instances
  private _dataSource?: NotificationMockDataSource;
  private _repository?: NotificationRepositoryImpl;
  private _getNotificationListUseCase?: GetNotificationListUseCase;
  private _markAsReadUseCase?: MarkAsReadUseCase;
  private _markAllAsReadUseCase?: MarkAllAsReadUseCase;

  /**
   * Get NotificationMockDataSource instance
   */
  private getDataSource(): NotificationMockDataSource {
    if (!this._dataSource) {
      this._dataSource = new NotificationMockDataSource();
    }
    return this._dataSource;
  }

  /**
   * Get NotificationRepository instance
   */
  private getRepository(): NotificationRepositoryImpl {
    if (!this._repository) {
      this._repository = new NotificationRepositoryImpl(this.getDataSource());
    }
    return this._repository;
  }

  /**
   * Get GetNotificationListUseCase instance
   */
  getGetNotificationList(): GetNotificationListUseCase {
    if (!this._getNotificationListUseCase) {
      this._getNotificationListUseCase = new GetNotificationListUseCaseImpl(
        this.getRepository(),
      );
    }
    return this._getNotificationListUseCase;
  }

  /**
   * Get MarkAsReadUseCase instance
   */
  getMarkAsRead(): MarkAsReadUseCase {
    if (!this._markAsReadUseCase) {
      this._markAsReadUseCase = new MarkAsReadUseCaseImpl(this.getRepository());
    }
    return this._markAsReadUseCase;
  }

  /**
   * Get MarkAllAsReadUseCase instance
   */
  getMarkAllAsRead(): MarkAllAsReadUseCase {
    if (!this._markAllAsReadUseCase) {
      this._markAllAsReadUseCase = new MarkAllAsReadUseCaseImpl(
        this.getRepository(),
      );
    }
    return this._markAllAsReadUseCase;
  }
}

/**
 * Create new NotificationServerContainer instance (per-request)
 */
export function createNotificationServerContainer(): NotificationServerContainer {
  return new NotificationServerContainer();
}
