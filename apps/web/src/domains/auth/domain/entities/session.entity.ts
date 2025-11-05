/**
 * Session Entity
 *
 * 세션 도메인 객체
 * - 사용자 인증 세션 정보
 * - 토큰 만료 시간 관리
 * - 세션 유효성 검증 로직 포함
 */

/**
 * Session Entity Interface
 */
export interface Session {
  readonly accessToken: string;
  readonly refreshToken: string;
  readonly userId: string;
  readonly expiresAt: Date;

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
  serialize(): {
    accessToken: string;
    refreshToken: string;
    userId: string;
    expiresAt: string;
  };
}

/**
 * Session Entity Class (with business logic)
 */
export class SessionEntity implements Session {
  readonly accessToken: string;
  readonly refreshToken: string;
  readonly userId: string;
  readonly expiresAt: Date;

  constructor(params: {
    accessToken: string;
    refreshToken: string;
    userId: string;
    expiresAt: Date;
  }) {
    // 검증 로직
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

    this.accessToken = params.accessToken;
    this.refreshToken = params.refreshToken;
    this.userId = params.userId;
    this.expiresAt = params.expiresAt;
  }

  /**
   * 비즈니스 로직: 세션이 만료되었는지 확인
   */
  isExpired(): boolean {
    return new Date() >= this.expiresAt;
  }

  /**
   * 비즈니스 로직: 세션이 곧 만료될 예정인지 확인
   * @param thresholdMinutes 임계값 (분 단위), 기본값 5분
   */
  willExpireSoon(thresholdMinutes: number = 5): boolean {
    if (this.isExpired()) {
      return true;
    }

    const threshold = new Date();
    threshold.setMinutes(threshold.getMinutes() + thresholdMinutes);

    return this.expiresAt <= threshold;
  }

  /**
   * 비즈니스 로직: 세션이 유효한지 확인
   */
  isValid(): boolean {
    return !this.isExpired() && this.accessToken.length > 0;
  }

  /**
   * 비즈니스 로직: 남은 시간 계산 (초 단위)
   */
  getRemainingTimeInSeconds(): number {
    const now = Date.now();
    const expiresAt = this.expiresAt.getTime();
    const remaining = Math.floor((expiresAt - now) / 1000);

    return Math.max(0, remaining);
  }

  /**
   * 비즈니스 로직: 만료까지 남은 시간을 사람이 읽을 수 있는 형식으로 반환
   */
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

  /**
   * Entity를 Plain Object로 변환
   */
  toPlainObject() {
    return {
      accessToken: this.accessToken,
      refreshToken: this.refreshToken,
      userId: this.userId,
      expiresAt: this.expiresAt,
    };
  }

  /**
   * 세션 데이터를 저장 가능한 형태로 직렬화
   */
  serialize(): {
    accessToken: string;
    refreshToken: string;
    userId: string;
    expiresAt: string; // ISO string
  } {
    return {
      accessToken: this.accessToken,
      refreshToken: this.refreshToken,
      userId: this.userId,
      expiresAt: this.expiresAt.toISOString(),
    };
  }

  /**
   * 직렬화된 데이터에서 세션 복원
   */
  static deserialize(data: {
    accessToken: string;
    refreshToken: string;
    userId: string;
    expiresAt: string;
  }): SessionEntity {
    return new SessionEntity({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      userId: data.userId,
      expiresAt: new Date(data.expiresAt),
    });
  }
}
