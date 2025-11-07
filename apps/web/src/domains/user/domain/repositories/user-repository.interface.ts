/**
 * User Repository Interface
 *
 * Domain layer contract for user data access
 * - Defines operations without implementation details
 * - Returns domain entities, not DTOs
 * - Implemented by data layer
 */

import type {
  NicknameAvailability,
  UserProfile,
} from "../entities/user.entity";

export interface UserRepository {
  /**
   * Get authenticated user's profile
   *
   * @returns UserProfile entity
   * @throws Error if profile fetch fails
   */
  getMyProfile(): Promise<UserProfile>;

  /**
   * Check nickname availability
   *
   * @param nickname Nickname to check
   * @returns NicknameAvailability result
   */
  checkNicknameAvailability(nickname: string): Promise<NicknameAvailability>;
}
