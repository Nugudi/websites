import type { User } from "../../../domain/entities/user.entity";

export const UserAdapter = {
  /**
   * Get display name for user with UI fallback
   *
   * @description
   * Uses Entity's getDisplayNameOrNull() to determine display name priority,
   * then provides Korean UI fallback text when null.
   *
   * Priority:
   * 1. User name → return name
   * 2. Email username → return email split by @
   * 3. No data → return "사용자" (Korean fallback)
   *
   * @param user - Domain User entity
   * @returns Display name string with Korean fallback
   *
   * @example
   * // User with name
   * getDisplayName(user) // => "김철수"
   *
   * @example
   * // User with only email
   * getDisplayName(user) // => "user" (from user@example.com)
   *
   * @example
   * // User with no data
   * getDisplayName(user) // => "사용자"
   */
  getDisplayName(user: User): string {
    const name = user.getDisplayNameOrNull();
    return name ?? "사용자"; // ✅ UI fallback in Adapter
  },
};
