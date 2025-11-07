import type { NotificationRepository } from "../repositories/notification-repository.interface";

export interface MarkAsReadInput {
  notificationId: string;
}

export interface MarkAsReadUseCase {
  execute(input: MarkAsReadInput): Promise<void>;
}

export class MarkAsReadUseCaseImpl implements MarkAsReadUseCase {
  constructor(
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async execute(input: MarkAsReadInput): Promise<void> {
    if (!input.notificationId || input.notificationId.trim() === "") {
      throw new Error("Notification ID is required");
    }

    await this.notificationRepository.markAsRead(input.notificationId);
  }
}
