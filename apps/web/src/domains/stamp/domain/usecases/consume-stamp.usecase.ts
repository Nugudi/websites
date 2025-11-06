/**
 * Consume Stamp UseCase
 *
 * 스탬프 사용(소비/교환) 처리 UseCase
 * - 특정 스탬프를 사용 처리합니다
 *
 * Responsibilities:
 * - Repository를 통한 스탬프 사용 처리
 * - 입력 데이터 검증
 * - 비즈니스 규칙 검증 (필요시)
 */

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

    // 스탬프 존재 여부 및 사용 가능 여부 검증
    const stamp = await this.stampRepository.getStampById(input.stampId);
    if (!stamp) {
      throw new Error("Stamp not found");
    }

    if (stamp.isUsed) {
      throw new Error("Stamp is already used");
    }

    // 만료 여부 검증 (expiresAt이 있는 경우)
    if (stamp.expiresAt) {
      const expiresAt = new Date(stamp.expiresAt);
      const now = new Date();
      if (now > expiresAt) {
        throw new Error("Stamp is expired");
      }
    }

    await this.stampRepository.useStamp(input.stampId);
  }
}
