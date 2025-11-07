import type { NotificationList } from "../entities/notification.entity";
import type { NotificationRepository } from "../repositories/notification-repository.interface";

export interface GetNotificationListUseCase {
  execute(): Promise<NotificationList>;
}

export class GetNotificationListUseCaseImpl
  implements GetNotificationListUseCase
{
  constructor(
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async execute(): Promise<NotificationList> {
    return await this.notificationRepository.getNotificationList();
  }
}
