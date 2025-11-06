/**
 * Mark As Read UseCase
 *
 * 특정 알림 읽음 처리 UseCase
 * - 특정 알림을 읽음 상태로 변경합니다
 *
 * Responsibilities:
 * - Repository를 통한 알림 읽음 처리
 * - 입력 데이터 검증
 */

import type { NotificationRepository } from "../repositories/notification-repository.interface";

/**
 * MarkAsReadUseCase Input DTO
 */
export interface MarkAsReadInput {
  notificationId: string;
}

/**
 * MarkAsReadUseCase Interface
 */
export interface MarkAsReadUseCase {
  execute(input: MarkAsReadInput): Promise<void>;
}

/**
 * MarkAsReadUseCase Implementation
 */
export class MarkAsReadUseCaseImpl implements MarkAsReadUseCase {
  constructor(
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async execute(input: MarkAsReadInput): Promise<void> {
    // 입력 검증
    if (!input.notificationId || input.notificationId.trim() === "") {
      throw new Error("Notification ID is required");
    }

    // Repository를 통해 알림 읽음 처리
    await this.notificationRepository.markAsRead(input.notificationId);
  }
}
