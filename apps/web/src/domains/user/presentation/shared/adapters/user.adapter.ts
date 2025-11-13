import type { UserProfile } from "../../../domain/entities/user.entity";
import type { UserProfileItem } from "../types/user.type";

export const UserAdapter = {
  /**
   * Transform UserProfile entity to UI item
   *
   * Converts domain UserProfile entity to presentation-layer UserProfileItem type.
   *
   * @param profile - Domain UserProfile entity
   * @returns UI-safe UserProfileItem type
   */
  toUiItem(profile: UserProfile): UserProfileItem {
    return {
      id: profile.getId(),
      nickname: profile.getNickname(),
      email: profile.getEmail(),
      profileImageUrl: profile.getProfileImageUrl(),
      height: profile.getHeight(),
      weight: profile.getWeight(),
      createdAt: profile.getCreatedAt(),
      updatedAt: profile.getUpdatedAt(),
    };
  },

  /**
   * Get profile completion status message
   *
   * Returns Korean status messages based on profile completeness:
   * - Complete: "프로필이 완성되었습니다"
   * - Incomplete (no email): "이메일을 추가하여 프로필을 완성하세요"
   * - Default: "프로필 정보를 확인해주세요"
   *
   * @param profile - Domain profile entity
   * @returns Korean status message text
   */
  getProfileStatusMessage(profile: UserProfile): string {
    if (
      "isProfileComplete" in profile &&
      typeof profile.isProfileComplete === "function"
    ) {
      if (profile.isProfileComplete()) {
        return "프로필이 완성되었습니다";
      }
      if (!profile.getEmail()) {
        return "이메일을 추가하여 프로필을 완성하세요";
      }
    }
    return "프로필 정보를 확인해주세요";
  },

  /**
   * Calculate profile completion percentage
   *
   * Counts filled fields out of total required fields (nickname, email, profileImage).
   * Returns percentage rounded to nearest integer.
   *
   * @param profile - Domain profile entity
   * @returns Completion percentage (0-100)
   */
  getProfileCompletionPercentage(profile: UserProfile): number {
    let completedFields = 0;
    const totalFields = 3; // nickname, email, profileImage

    if (profile.getNickname()) completedFields++;
    if (profile.getEmail()) completedFields++;
    if (profile.getProfileImageUrl()) completedFields++;

    return Math.round((completedFields / totalFields) * 100);
  },

  /**
   * Get UI color based on profile completion status
   *
   * Color mapping: complete → green, incomplete → orange, fallback → gray
   *
   * @param profile - Domain profile entity
   * @returns Color string for UI theming
   */
  getProfileStatusColor(profile: UserProfile): string {
    if (
      "isProfileComplete" in profile &&
      typeof profile.isProfileComplete === "function"
    ) {
      return profile.isProfileComplete() ? "green" : "orange";
    }
    return "gray";
  },

  /**
   * Get display name for user with UI fallback
   *
   * @description
   * Uses Entity's getDisplayNameOrNull() to determine display name priority,
   * then provides Korean UI fallback text when null.
   *
   * Priority:
   * 1. Nickname → return nickname
   * 2. Email username → return email split by @
   * 3. No data → return "사용자" (Korean fallback)
   *
   * @param profile - Domain profile entity
   * @returns Display name string with Korean fallback
   *
   * @example
   * // Profile with nickname
   * getDisplayName(profile) // => "김철수"
   *
   * @example
   * // Profile with only email
   * getDisplayName(profile) // => "user" (from user@example.com)
   *
   * @example
   * // Profile with no data (edge case)
   * getDisplayName(profile) // => "사용자"
   */
  getDisplayName(profile: UserProfile): string {
    const name = profile.getDisplayNameOrNull();
    return name ?? "사용자"; // ✅ UI fallback in Adapter
  },

  /**
   * Determine if new user badge should be shown
   *
   * Check if user was created within 7 days.
   *
   * @param profile - Domain profile entity
   * @returns True if user is new (created within 7 days)
   */
  shouldShowNewUserBadge(profile: UserProfile): boolean {
    if ("isNewUser" in profile && typeof profile.isNewUser === "function") {
      return profile.isNewUser();
    }
    return false;
  },

  /**
   * Get profile image URL with fallback
   *
   * @param profile - Domain profile entity
   * @returns Profile image URL or default image path
   */
  getProfileImageUrl(profile: UserProfile): string {
    return profile.getProfileImageUrl() || "/images/default-profile.png";
  },

  /**
   * Get email display text with fallback
   *
   * @param profile - Domain profile entity
   * @returns Email address or fallback text
   */
  getEmailDisplayText(profile: UserProfile): string {
    return profile.getEmail() || "이메일 미등록";
  },

  /**
   * Determine if profile can be edited with given changes
   *
   * Validates nickname format, email format, etc.
   *
   * @param profile - Domain profile entity
   * @param changes - Partial profile data with proposed changes
   * @returns True if profile can be updated with these changes
   */
  canEdit(profile: UserProfile, changes: Partial<UserProfileItem>): boolean {
    if (
      "canUpdateProfile" in profile &&
      typeof profile.canUpdateProfile === "function"
    ) {
      return profile.canUpdateProfile(changes);
    }
    return true; // Fallback: 항상 수정 가능
  },

  /**
   * Get validation errors for new nickname
   *
   * Validation rules: 2-20자, 특수문자 _ - 만 허용, 공백 불가
   *
   * @param profile - Domain profile entity
   * @param newNickname - Proposed new nickname
   * @returns Array of error messages (empty if valid)
   */
  getNicknameErrors(profile: UserProfile, newNickname: string): string[] {
    if (
      "getNicknameValidationErrors" in profile &&
      typeof profile.getNicknameValidationErrors === "function"
    ) {
      return profile.getNicknameValidationErrors(newNickname);
    }
    return []; // Fallback: 오류 없음
  },

  /**
   * Get completion status icon for UI display
   *
   * Icon mapping based on completion percentage:
   * - 100%: ✅ (완전)
   * - 66%+: ⚠️ (경고)
   * - <66%: ❌ (미완성)
   *
   * @param profile - Domain profile entity
   * @returns Emoji icon representing completion status
   */
  getCompletionIcon(profile: UserProfile): string {
    const percentage = this.getProfileCompletionPercentage(profile);
    if (percentage === 100) return "✅";
    if (percentage >= 66) return "⚠️";
    return "❌";
  },
};
