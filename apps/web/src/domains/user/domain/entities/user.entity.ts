/**
 * User Entity
 *
 * Domain Layer의 비즈니스 객체
 *
 * @remarks
 * - Clean Architecture: Domain 계층의 핵심 비즈니스 로직
 * - 불변성 보장 (readonly properties)
 * - 생성자에서 검증 수행 (UserError 사용)
 * - 비즈니스 규칙은 constants 사용 (하드코딩 방지)
 */

import {
  EMAIL_VALIDATION,
  NICKNAME_VALIDATION,
  USER_ID_VALIDATION,
} from "../config/constants";
import { USER_ERROR_CODES, UserError } from "../errors/user-error";

export interface UserProfile {
  // Getter methods
  getId(): number;
  getNickname(): string;
  getEmail(): string | undefined;
  getProfileImageUrl(): string | undefined;
  getCreatedAt(): string | undefined;
  getUpdatedAt(): string | undefined;

  // Business logic methods
  isProfileComplete(): boolean;
  hasVerifiedEmail(): boolean;
  getNicknameValidationErrors(newNickname: string): string[];
  canUpdateProfile(
    changes: Partial<{
      id: number;
      nickname: string;
      email?: string;
      profileImageUrl?: string;
      createdAt?: string;
      updatedAt?: string;
    }>,
  ): boolean;
  getDisplayNameOrNull(): string | null;
  hasProfileImage(): boolean;
  isNewUser(): boolean;
  toPlainObject(): {
    id: number;
    nickname: string;
    email?: string;
    profileImageUrl?: string;
    createdAt?: string;
    updatedAt?: string;
  };
  equals(other: UserProfile): boolean;
}

export class UserProfileEntity implements UserProfile {
  private readonly _id: number;
  private readonly _nickname: string;
  private readonly _email?: string;
  private readonly _profileImageUrl?: string;
  private readonly _createdAt?: string;
  private readonly _updatedAt?: string;

  constructor(params: {
    id: number;
    nickname: string;
    email?: string;
    profileImageUrl?: string;
    createdAt?: string;
    updatedAt?: string;
  }) {
    // User ID 검증
    if (!params.id || params.id < USER_ID_VALIDATION.MIN_VALUE) {
      throw new UserError(
        USER_ID_VALIDATION.MESSAGES.INVALID,
        USER_ERROR_CODES.INVALID_USER_ID,
      );
    }

    // 닉네임 검증
    const trimmedNickname = params.nickname?.trim() ?? "";
    if (trimmedNickname.length === 0) {
      throw new UserError(
        NICKNAME_VALIDATION.MESSAGES.REQUIRED,
        USER_ERROR_CODES.NICKNAME_REQUIRED,
      );
    }

    if (trimmedNickname.length < NICKNAME_VALIDATION.MIN_LENGTH) {
      throw new UserError(
        NICKNAME_VALIDATION.MESSAGES.TOO_SHORT,
        USER_ERROR_CODES.NICKNAME_TOO_SHORT,
      );
    }

    if (trimmedNickname.length > NICKNAME_VALIDATION.MAX_LENGTH) {
      throw new UserError(
        NICKNAME_VALIDATION.MESSAGES.TOO_LONG,
        USER_ERROR_CODES.NICKNAME_TOO_LONG,
      );
    }

    if (!NICKNAME_VALIDATION.PATTERN.test(trimmedNickname)) {
      throw new UserError(
        NICKNAME_VALIDATION.MESSAGES.INVALID_FORMAT,
        USER_ERROR_CODES.NICKNAME_INVALID_FORMAT,
      );
    }

    // 이메일 검증 (선택적)
    if (params.email) {
      const trimmedEmail = params.email.trim();
      if (!EMAIL_VALIDATION.PATTERN.test(trimmedEmail)) {
        throw new UserError(
          EMAIL_VALIDATION.MESSAGES.INVALID_FORMAT,
          USER_ERROR_CODES.INVALID_EMAIL,
        );
      }
    }

    this._id = params.id;
    this._nickname = params.nickname;
    this._email = params.email;
    this._profileImageUrl = params.profileImageUrl;
    this._createdAt = params.createdAt;
    this._updatedAt = params.updatedAt;
  }

  // Getter methods
  getId(): number {
    return this._id;
  }

  getNickname(): string {
    return this._nickname;
  }

  getEmail(): string | undefined {
    return this._email;
  }

  getProfileImageUrl(): string | undefined {
    return this._profileImageUrl;
  }

  getCreatedAt(): string | undefined {
    return this._createdAt;
  }

  getUpdatedAt(): string | undefined {
    return this._updatedAt;
  }

  /**
   * Business Logic: 프로필이 완성되었는지 확인
   * 필수 필드: nickname
   * 권장 필드: email
   */
  isProfileComplete(): boolean {
    return !!(this._nickname && this._email);
  }

  /**
   * Business Logic: 이메일이 인증되었는지 확인
   */
  hasVerifiedEmail(): boolean {
    return !!this._email;
  }

  /**
   * Business Logic: 닉네임 유효성 검사 오류 반환
   *
   * @remarks
   * NICKNAME_VALIDATION constants 사용 (하드코딩 방지)
   */
  getNicknameValidationErrors(newNickname: string): string[] {
    const errors: string[] = [];

    if (!newNickname || newNickname.trim().length === 0) {
      errors.push(NICKNAME_VALIDATION.MESSAGES.REQUIRED);
      return errors;
    }

    const trimmed = newNickname.trim();

    if (trimmed.length < NICKNAME_VALIDATION.MIN_LENGTH) {
      errors.push(NICKNAME_VALIDATION.MESSAGES.TOO_SHORT);
    }

    if (trimmed.length > NICKNAME_VALIDATION.MAX_LENGTH) {
      errors.push(NICKNAME_VALIDATION.MESSAGES.TOO_LONG);
    }

    if (!NICKNAME_VALIDATION.PATTERN.test(trimmed)) {
      errors.push(NICKNAME_VALIDATION.MESSAGES.INVALID_FORMAT);
    }

    return errors;
  }

  /**
   * Business Logic: 프로필 업데이트 가능 여부 확인
   *
   * @remarks
   * EMAIL_VALIDATION constants 사용 (하드코딩 방지)
   */
  canUpdateProfile(
    changes: Partial<{
      id: number;
      nickname: string;
      email?: string;
      profileImageUrl?: string;
      createdAt?: string;
      updatedAt?: string;
    }>,
  ): boolean {
    if (changes.nickname !== undefined) {
      const errors = this.getNicknameValidationErrors(changes.nickname);
      if (errors.length > 0) {
        return false;
      }
    }

    if (changes.email !== undefined && changes.email !== "") {
      if (!EMAIL_VALIDATION.PATTERN.test(changes.email)) {
        return false;
      }
    }

    return true;
  }

  /**
   * Business Logic: Get display name with priority
   *
   * Priority: nickname > email username > null
   * Returns null when no suitable display name exists.
   * UI layer should provide fallback text via Adapter.
   *
   * @returns Display name or null
   */
  getDisplayNameOrNull(): string | null {
    if (this._nickname && this._nickname.trim().length > 0) {
      return this._nickname;
    }
    if (this._email) {
      return this._email.split("@")[0];
    }
    return null;
  }

  /**
   * Business Logic: 프로필 이미지가 있는지 확인
   */
  hasProfileImage(): boolean {
    return !!this._profileImageUrl;
  }

  /**
   * Business Logic: 프로필이 최근에 생성되었는지 확인 (7일 이내)
   */
  isNewUser(): boolean {
    if (!this._createdAt) {
      return false;
    }

    const createdDate = new Date(this._createdAt);
    const now = new Date();
    const diffInDays = Math.floor(
      (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24),
    );
    return diffInDays <= 7;
  }

  toPlainObject() {
    return {
      id: this._id,
      nickname: this._nickname,
      email: this._email,
      profileImageUrl: this._profileImageUrl,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }

  equals(other: UserProfile): boolean {
    return this._id === other.getId();
  }
}

/**
 * Nickname Availability Result
 */
export interface NicknameAvailability {
  available: boolean;
  message?: string;
}
