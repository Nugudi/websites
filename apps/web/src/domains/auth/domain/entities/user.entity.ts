/**
 * User Entity
 *
 * 사용자 도메인 객체
 * - 프레임워크에 독립적
 * - 비즈니스 로직 포함 가능
 * - Immutable 패턴 사용
 */

import type { OAuthProvider } from "../../core/types/common";

/**
 * User Entity Interface
 */
export interface User {
  readonly userId: string;
  readonly email?: string; // Optional: OAuth providers may not provide email
  readonly name: string;
  readonly provider: OAuthProvider;
  readonly profileImageUrl?: string;
  readonly createdAt?: Date;
}

/**
 * User Entity Class (with business logic)
 *
 * Entity 클래스의 장점:
 * 1. 비즈니스 로직을 캡슐화
 * 2. 데이터 유효성 검증
 * 3. 도메인 규칙 강제
 */
export class UserEntity implements User {
  readonly userId: string;
  readonly email?: string;
  readonly name: string;
  readonly provider: OAuthProvider;
  readonly profileImageUrl?: string;
  readonly createdAt?: Date;

  constructor(params: {
    userId: string;
    email?: string;
    name: string;
    provider: OAuthProvider;
    profileImageUrl?: string;
    createdAt?: Date;
  }) {
    // 검증 로직
    if (!params.userId) {
      throw new Error("User ID is required");
    }
    if (!params.name) {
      throw new Error("Name is required");
    }
    // Email is optional, but if provided, must be valid
    if (params.email && !this.isValidEmail(params.email)) {
      throw new Error("Invalid email format");
    }

    this.userId = params.userId;
    this.email = params.email;
    this.name = params.name;
    this.provider = params.provider;
    this.profileImageUrl = params.profileImageUrl;
    this.createdAt = params.createdAt;
  }

  /**
   * 비즈니스 로직: Google 사용자인지 확인
   */
  isFromGoogle(): boolean {
    return this.provider === "google";
  }

  /**
   * 비즈니스 로직: 프로필 이미지가 있는지 확인
   */
  hasProfileImage(): boolean {
    return !!this.profileImageUrl;
  }

  /**
   * 비즈니스 로직: 이메일 유효성 검증
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * 비즈니스 로직: 사용자 표시 이름 가져오기
   */
  getDisplayName(): string {
    if (this.name) {
      return this.name;
    }
    if (this.email) {
      return this.email.split("@")[0];
    }
    return "User";
  }

  /**
   * Entity를 Plain Object로 변환 (필요시)
   */
  toPlainObject(): User {
    return {
      userId: this.userId,
      email: this.email,
      name: this.name,
      provider: this.provider,
      profileImageUrl: this.profileImageUrl,
      createdAt: this.createdAt,
    };
  }

  /**
   * 동등성 비교
   */
  equals(other: User): boolean {
    return this.userId === other.userId;
  }
}
