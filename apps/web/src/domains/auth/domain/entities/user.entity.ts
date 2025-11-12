/**
 * User Entity
 */

import { AUTH_ERROR_CODES, AuthError } from "../errors/auth-error";
import type { OAuthProvider } from "../types/common";

export class User {
  private readonly _userId: string;
  private readonly _email?: string;
  private readonly _name: string;
  private readonly _provider: OAuthProvider;
  private readonly _profileImageUrl?: string;
  private readonly _createdAt?: Date;

  constructor(params: {
    userId: string;
    email?: string;
    name: string;
    provider: OAuthProvider;
    profileImageUrl?: string;
    createdAt?: Date;
  }) {
    if (!params.userId) {
      throw new AuthError(
        "User ID is required",
        AUTH_ERROR_CODES.INVALID_USER_DATA,
      );
    }
    if (!params.name) {
      throw new AuthError(
        "Name is required",
        AUTH_ERROR_CODES.INVALID_USER_DATA,
      );
    }
    if (params.email && !this.isValidEmail(params.email)) {
      throw new AuthError(
        "Invalid email format",
        AUTH_ERROR_CODES.INVALID_USER_DATA,
      );
    }

    this._userId = params.userId;
    this._email = params.email;
    this._name = params.name;
    this._provider = params.provider;
    this._profileImageUrl = params.profileImageUrl;
    this._createdAt = params.createdAt;
  }

  // Getter methods
  getUserId(): string {
    return this._userId;
  }

  getEmail(): string | undefined {
    return this._email;
  }

  getName(): string {
    return this._name;
  }

  getProvider(): OAuthProvider {
    return this._provider;
  }

  getProfileImageUrl(): string | undefined {
    return this._profileImageUrl;
  }

  getCreatedAt(): Date | undefined {
    return this._createdAt;
  }

  isFromGoogle(): boolean {
    return this._provider === "google";
  }

  hasProfileImage(): boolean {
    return !!this._profileImageUrl;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Business Logic: Get display name with priority
   *
   * Priority: name > email username > null
   * Returns null when no suitable display name exists.
   * UI layer should provide fallback text via Adapter.
   *
   * @returns Display name or null
   */
  getDisplayNameOrNull(): string | null {
    if (this._name) {
      return this._name;
    }
    if (this._email) {
      return this._email.split("@")[0];
    }
    return null;
  }

  toPlainObject() {
    return {
      userId: this._userId,
      email: this._email,
      name: this._name,
      provider: this._provider,
      profileImageUrl: this._profileImageUrl,
      createdAt: this._createdAt,
    };
  }

  equals(other: User): boolean {
    return this._userId === other.getUserId();
  }
}

/**
 * Nickname Availability Result
 */
export interface NicknameAvailability {
  available: boolean;
  message?: string;
}
