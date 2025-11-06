/**
 * Get My Profile UseCase
 *
 * Business logic for fetching authenticated user's profile
 * - Single responsibility: Get user profile
 * - Uses UserRepository for data access
 * - Returns UserProfile entity
 */

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
