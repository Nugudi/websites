import type { StampRepository } from "../repositories/stamp-repository.interface";

export interface ConsumeStampInput {
  stampId: string;
}

export interface ConsumeStampUseCase {
  execute(input: ConsumeStampInput): Promise<void>;
}

export class ConsumeStampUseCaseImpl implements ConsumeStampUseCase {
  constructor(private readonly stampRepository: StampRepository) {}

  async execute(input: ConsumeStampInput): Promise<void> {
    if (!input.stampId || input.stampId.trim() === "") {
      throw new Error("Stamp ID is required");
    }

    const stamp = await this.stampRepository.getStampById(input.stampId);
    if (!stamp) {
      throw new Error("Stamp not found");
    }

    if (stamp.getIsUsed()) {
      throw new Error("Stamp is already used");
    }

    const expiresAt = stamp.getExpiresAt();
    if (expiresAt) {
      const expiresAtDate = new Date(expiresAt);
      const now = new Date();
      if (now > expiresAtDate) {
        throw new Error("Stamp is expired");
      }
    }

    await this.stampRepository.useStamp(input.stampId);
  }
}
