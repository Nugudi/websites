/**
 * Get Notification List UseCase
 *
 * 알림 목록 조회 UseCase
 * - 사용자의 알림 목록과 통계 정보를 조회합니다
 *
 * Responsibilities:
 * - Repository를 통한 알림 데이터 조회
 * - 비즈니스 로직 검증 (필요시)
 */

import type { NotificationList } from "../entities/notification.entity";
import type { NotificationRepository } from "../repositories/notification-repository.interface";

/**
 * GetNotificationListUseCase Interface
 */
export interface GetNotificationListUseCase {
  execute(): Promise<NotificationList>;
}

/**
 * GetNotificationListUseCase Implementation
 */
export class GetNotificationListUseCaseImpl
  implements GetNotificationListUseCase
{
  constructor(
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async execute(): Promise<NotificationList> {
    // Repository를 통해 알림 목록 조회
    return await this.notificationRepository.getNotificationList();
  }
}
