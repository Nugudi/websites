/**
 * Mark All As Read UseCase
 *
 * 모든 알림 읽음 처리 UseCase
 * - 사용자의 모든 알림을 읽음 상태로 변경합니다
 *
 * Responsibilities:
 * - Repository를 통한 모든 알림 읽음 처리
 */

import type { NotificationRepository } from "../repositories/notification-repository.interface";

/**
 * MarkAllAsReadUseCase Interface
 */
export interface MarkAllAsReadUseCase {
  execute(): Promise<void>;
}

/**
 * MarkAllAsReadUseCase Implementation
 */
export class MarkAllAsReadUseCaseImpl implements MarkAllAsReadUseCase {
  constructor(
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async execute(): Promise<void> {
    // Repository를 통해 모든 알림 읽음 처리
    await this.notificationRepository.markAllAsRead();
  }
}
