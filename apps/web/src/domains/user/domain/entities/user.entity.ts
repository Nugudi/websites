/**
 * User Entity
 */

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
  getDisplayName(): string;
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
    if (!params.id || params.id <= 0) {
      throw new Error("User ID must be a positive number");
    }
    if (!params.nickname || params.nickname.trim().length === 0) {
      throw new Error("Nickname is required");
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
   * - 2-20자 제한
   * - 특수문자 제한 (언더스코어, 하이픈만 허용)
   * - 공백 불허
   */
  getNicknameValidationErrors(newNickname: string): string[] {
    const errors: string[] = [];

    if (!newNickname || newNickname.trim().length === 0) {
      errors.push("닉네임은 필수입니다");
      return errors;
    }

    const trimmed = newNickname.trim();

    if (trimmed.length < 2) {
      errors.push("닉네임은 최소 2자 이상이어야 합니다");
    }

    if (trimmed.length > 20) {
      errors.push("닉네임은 최대 20자까지 가능합니다");
    }

    if (/\s/.test(trimmed)) {
      errors.push("닉네임에 공백을 포함할 수 없습니다");
    }

    const invalidCharRegex = /[^a-zA-Z0-9가-힣ㄱ-ㅎㅏ-ㅣ_-]/;
    if (invalidCharRegex.test(trimmed)) {
      errors.push("닉네임에 특수문자는 _ 와 - 만 사용할 수 있습니다");
    }

    return errors;
  }

  /**
   * Business Logic: 프로필 업데이트 가능 여부 확인
   * 변경하려는 닉네임이 유효한지 검증
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
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(changes.email)) {
        return false;
      }
    }

    return true;
  }

  /**
   * Business Logic: 표시할 이름 반환
   * 우선순위: nickname > email username > "사용자"
   */
  getDisplayName(): string {
    if (this._nickname && this._nickname.trim().length > 0) {
      return this._nickname;
    }
    if (this._email) {
      return this._email.split("@")[0];
    }
    return "사용자";
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
