/**
 * Notification Client DI Container
 *
 * Client-side Dependency Injection Container
 * - Lazy-initialized singleton (reused across the app)
 * - Use in Client Components, Event Handlers, Client Hooks
 *
 * Usage:
 * ```typescript
 * 'use client';
 *
 * const container = getNotificationClientContainer();
 * const markAsReadUseCase = container.getMarkAsRead();
 * await markAsReadUseCase.execute({ notificationId: '1' });
 * ```
 */

import { NotificationMockDataSource } from "../data/data-sources/notification-mock-data-source";
import { NotificationRepositoryImpl } from "../data/repositories/notification-repository.impl";
import {
  type GetNotificationListUseCase,
  GetNotificationListUseCaseImpl,
} from "../domain/usecases/get-notification-list.usecase";
import {
  type GetNotificationListForUIUseCase,
  GetNotificationListForUIUseCaseImpl,
} from "../domain/usecases/get-notification-list-for-ui.usecase";
import {
  type MarkAllAsReadUseCase,
  MarkAllAsReadUseCaseImpl,
} from "../domain/usecases/mark-all-as-read.usecase";
import {
  type MarkAsReadUseCase,
  MarkAsReadUseCaseImpl,
} from "../domain/usecases/mark-as-read.usecase";

/**
 * Notification Client Container
 */
export class NotificationClientContainer {
  // Lazy-initialized instances
  private _dataSource?: NotificationMockDataSource;
  private _repository?: NotificationRepositoryImpl;
  private _getNotificationListUseCase?: GetNotificationListUseCase;
  private _getNotificationListForUIUseCase?: GetNotificationListForUIUseCase;
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
   * Get GetNotificationListForUIUseCase instance (returns UI-ready data)
   */
  getGetNotificationListForUI(): GetNotificationListForUIUseCase {
    if (!this._getNotificationListForUIUseCase) {
      this._getNotificationListForUIUseCase =
        new GetNotificationListForUIUseCaseImpl(this.getRepository());
    }
    return this._getNotificationListForUIUseCase;
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
 * Global singleton instance
 */
let clientContainerInstance: NotificationClientContainer | null = null;

/**
 * Get NotificationClientContainer singleton instance (lazy-initialized)
 */
export function getNotificationClientContainer(): NotificationClientContainer {
  if (!clientContainerInstance) {
    clientContainerInstance = new NotificationClientContainer();
  }
  return clientContainerInstance;
}
