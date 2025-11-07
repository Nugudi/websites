/**
 * User Entity
 */

import type { OAuthProvider } from "../../core/types/common";

export interface User {
  // Getter methods
  getUserId(): string;
  getEmail(): string | undefined;
  getName(): string;
  getProvider(): OAuthProvider;
  getProfileImageUrl(): string | undefined;
  getCreatedAt(): Date | undefined;

  // Business logic methods
  isFromGoogle(): boolean;
  hasProfileImage(): boolean;
  getDisplayName(): string;
  toPlainObject(): {
    userId: string;
    email?: string;
    name: string;
    provider: OAuthProvider;
    profileImageUrl?: string;
    createdAt?: Date;
  };
  equals(other: User): boolean;
}

export class UserEntity implements User {
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
      throw new Error("User ID is required");
    }
    if (!params.name) {
      throw new Error("Name is required");
    }
    if (params.email && !this.isValidEmail(params.email)) {
      throw new Error("Invalid email format");
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

  getDisplayName(): string {
    if (this._name) {
      return this._name;
    }
    if (this._email) {
      return this._email.split("@")[0];
    }
    return "User";
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
