/**
 * Session Entity
 */

import { AUTH_ERROR_CODES, AuthError } from "../errors/auth-error";

export interface Session {
  // Getter methods
  getAccessToken(): string;
  getRefreshToken(): string;
  getUserId(): string;
  getExpiresAt(): Date;

  // Business logic methods
  isExpired(): boolean;
  willExpireSoon(thresholdMinutes?: number): boolean;
  isValid(): boolean;
  getRemainingTimeInSeconds(): number;
  toPlainObject(): {
    accessToken: string;
    refreshToken: string;
    userId: string;
    expiresAt: Date;
  };
}

export class SessionEntity implements Session {
  private readonly _accessToken: string;
  private readonly _refreshToken: string;
  private readonly _userId: string;
  private readonly _expiresAt: Date;

  constructor(params: {
    accessToken: string;
    refreshToken: string;
    userId: string;
    expiresAt: Date;
  }) {
    this._accessToken = params.accessToken;
    this._refreshToken = params.refreshToken;
    this._userId = params.userId;
    this._expiresAt = params.expiresAt;

    this.validate();
  }

  private validate(): void {
    if (!this._accessToken) {
      throw new AuthError(
        "Access token is required",
        AUTH_ERROR_CODES.INVALID_TOKEN,
      );
    }
    if (!this._refreshToken) {
      throw new AuthError(
        "Refresh token is required",
        AUTH_ERROR_CODES.INVALID_TOKEN,
      );
    }
    if (!this._userId) {
      throw new AuthError(
        "User ID is required",
        AUTH_ERROR_CODES.INVALID_USER_DATA,
      );
    }
    if (!(this._expiresAt instanceof Date)) {
      throw new AuthError(
        "Expires at must be a Date",
        AUTH_ERROR_CODES.INVALID_TOKEN,
      );
    }
  }

  // Getter methods
  getAccessToken(): string {
    return this._accessToken;
  }

  getRefreshToken(): string {
    return this._refreshToken;
  }

  getUserId(): string {
    return this._userId;
  }

  getExpiresAt(): Date {
    return this._expiresAt;
  }

  isExpired(): boolean {
    return new Date() >= this._expiresAt;
  }

  /**
   * @param thresholdMinutes 임계값 (분 단위), 기본값 5분
   */
  willExpireSoon(thresholdMinutes: number = 5): boolean {
    if (this.isExpired()) {
      return true;
    }

    const threshold = new Date();
    threshold.setMinutes(threshold.getMinutes() + thresholdMinutes);

    return this._expiresAt <= threshold;
  }

  isValid(): boolean {
    return !this.isExpired() && this._accessToken.length > 0;
  }

  getRemainingTimeInSeconds(): number {
    const now = Date.now();
    const expiresAt = this._expiresAt.getTime();
    const remaining = Math.floor((expiresAt - now) / 1000);

    return Math.max(0, remaining);
  }

  toPlainObject() {
    return {
      accessToken: this._accessToken,
      refreshToken: this._refreshToken,
      userId: this._userId,
      expiresAt: this._expiresAt,
    };
  }
}
