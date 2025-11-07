/**
 * Session Entity
 */

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
  getRemainingTimeFormatted(): string;
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
    if (!params.accessToken) {
      throw new Error("Access token is required");
    }
    if (!params.refreshToken) {
      throw new Error("Refresh token is required");
    }
    if (!params.userId) {
      throw new Error("User ID is required");
    }
    if (!(params.expiresAt instanceof Date)) {
      throw new Error("Expires at must be a Date");
    }

    this._accessToken = params.accessToken;
    this._refreshToken = params.refreshToken;
    this._userId = params.userId;
    this._expiresAt = params.expiresAt;
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

  getRemainingTimeFormatted(): string {
    const seconds = this.getRemainingTimeInSeconds();

    if (seconds === 0) {
      return "만료됨";
    }

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours}시간 ${minutes}분`;
    }
    if (minutes > 0) {
      return `${minutes}분 ${remainingSeconds}초`;
    }
    return `${remainingSeconds}초`;
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
