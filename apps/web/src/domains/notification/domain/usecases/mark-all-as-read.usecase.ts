import type { NotificationRepository } from "../repositories/notification-repository.interface";

export interface MarkAllAsReadUseCase {
  execute(): Promise<void>;
}

export class MarkAllAsReadUseCaseImpl implements MarkAllAsReadUseCase {
  constructor(
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async execute(): Promise<void> {
    await this.notificationRepository.markAllAsRead();
  }
}
