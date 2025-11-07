import type { UserProfile } from "../entities/user.entity";
import type { UserRepository } from "../repositories/user-repository.interface";

export interface GetMyProfileUseCase {
  execute(): Promise<UserProfile>;
}

export class GetMyProfileUseCaseImpl implements GetMyProfileUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(): Promise<UserProfile> {
    return this.userRepository.getMyProfile();
  }
}
