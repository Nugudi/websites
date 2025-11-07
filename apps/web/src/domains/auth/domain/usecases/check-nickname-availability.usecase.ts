/**
 * Check Nickname Availability UseCase
 *
 * 닉네임 사용 가능 여부 확인
 * - 회원가입 시 닉네임 중복 검증에 사용
 * - Auth Domain의 책임 (회원가입 프로세스의 일부)
 */

import type { NicknameAvailability } from "../entities/user.entity";
import type { AuthRepository } from "../repositories/auth-repository";

export interface CheckNicknameAvailabilityUseCase {
  execute(nickname: string): Promise<NicknameAvailability>;
}

export class CheckNicknameAvailabilityUseCaseImpl
  implements CheckNicknameAvailabilityUseCase
{
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(nickname: string): Promise<NicknameAvailability> {
    return this.authRepository.checkNicknameAvailability(nickname);
  }
}
