/**
 * User Entity
 *
 * Core domain object representing a user
 * - Contains business logic and validation
 * - Independent of external APIs/DTOs
 */

/**
 * User Profile Entity
 *
 * Represents authenticated user's profile information
 */
export interface UserProfile {
  id: number;
  nickname: string;
  email?: string;
  profileImageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Nickname Availability Result
 *
 * Result of checking nickname availability
 */
export interface NicknameAvailability {
  available: boolean;
  message?: string;
}
