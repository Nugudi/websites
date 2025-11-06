/**
 * Get Notification List For UI UseCase
 *
 * 알림 목록 조회 UseCase (UI-ready data)
 * - UI에서 바로 사용 가능한 형태로 데이터를 반환합니다
 * - Repository의 mapper를 통해 변환된 데이터를 그대로 전달
 *
 * Responsibilities:
 * - Repository를 통한 UI-ready 알림 데이터 조회
 * - Presentation layer로 데이터 전달
 */

import type {
  NotificationListResponse,
  NotificationRepositoryImpl,
} from "../../data/repositories/notification-repository.impl";

/**
 * GetNotificationListForUIUseCase Interface
 */
export interface GetNotificationListForUIUseCase {
  execute(): Promise<NotificationListResponse>;
}

/**
 * GetNotificationListForUIUseCase Implementation
 */
export class GetNotificationListForUIUseCaseImpl
  implements GetNotificationListForUIUseCase
{
  constructor(
    private readonly notificationRepository: NotificationRepositoryImpl,
  ) {}

  async execute(): Promise<NotificationListResponse> {
    // Repository에서 UI-ready data를 바로 반환
    return await this.notificationRepository.getNotificationListForUI();
  }
}
