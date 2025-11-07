import type { UserProfile } from "../../domain/entities/user.entity";
import type { UserProfileItem } from "../types/user.type";

type UserProfileData = {
  id: number;
  nickname: string;
  email?: string;
  profileImageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
};

export const UserAdapter = {
  toUiItem(profile: UserProfile): UserProfileItem {
    return {
      id: profile.getId(),
      nickname: profile.getNickname(),
      email: profile.getEmail(),
      profileImageUrl: profile.getProfileImageUrl(),
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
   * Priority: entity.getDisplayName() > nickname > "사용자"
   */
  getDisplayName(profile: UserProfile): string {
    if (
      "getDisplayName" in profile &&
      typeof profile.getDisplayName === "function"
    ) {
      return profile.getDisplayName();
    }
    return profile.getNickname() || "사용자";
  },

  /**
   * Check if user was created within 7 days
   */
  shouldShowNewUserBadge(profile: UserProfile): boolean {
    if ("isNewUser" in profile && typeof profile.isNewUser === "function") {
      return profile.isNewUser();
    }
    return false;
  },

  getProfileImageUrl(profile: UserProfile): string {
    return profile.getProfileImageUrl() || "/images/default-profile.png";
  },

  getEmailDisplayText(profile: UserProfile): string {
    return profile.getEmail() || "이메일 미등록";
  },

  /**
   * Validates nickname format, email format, etc.
   */
  canEdit(profile: UserProfile, changes: Partial<UserProfileData>): boolean {
    if (
      "canUpdateProfile" in profile &&
      typeof profile.canUpdateProfile === "function"
    ) {
      return profile.canUpdateProfile(changes);
    }
    return true; // Fallback: 항상 수정 가능
  },

  /**
   * Validation rules: 2-20자, 특수문자 _ - 만 허용, 공백 불가
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
