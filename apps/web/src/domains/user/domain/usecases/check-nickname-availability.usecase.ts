import type { NicknameAvailability } from "../entities/user.entity";
import type { UserRepository } from "../repositories/user-repository.interface";

export interface CheckNicknameAvailabilityUseCase {
  execute(nickname: string): Promise<NicknameAvailability>;
}

export class CheckNicknameAvailabilityUseCaseImpl
  implements CheckNicknameAvailabilityUseCase
{
  constructor(private readonly userRepository: UserRepository) {}

  async execute(nickname: string): Promise<NicknameAvailability> {
    return this.userRepository.checkNicknameAvailability(nickname);
  }
}
