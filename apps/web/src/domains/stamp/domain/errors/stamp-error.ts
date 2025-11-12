/**
 * Stamp Domain Error
 *
 * 비즈니스 규칙 위반을 나타내는 도메인 에러 클래스
 *
 * @remarks
 * - HTTP 상태 코드나 UI 에러가 아닌, 도메인 규칙 위반만 처리
 * - Enum 대신 Union Type + const assertion 사용 (성능 최적화)
 * - 에러 코드는 비즈니스 의미를 가진 상수로 정의
 */

/**
 * Stamp Error Codes
 *
 * @remarks
 * Union Type 패턴 (Enum 대신 사용 - TypeScript 성능 최적화)
 */
export const STAMP_ERROR_CODES = {
  // 스탬프 조회 관련
  STAMP_NOT_FOUND: "STAMP_NOT_FOUND",
  STAMP_COLLECTION_FETCH_FAILED: "STAMP_COLLECTION_FETCH_FAILED",

  // 스탬프 사용 관련
  STAMP_CONSUME_FAILED: "STAMP_CONSUME_FAILED",
  INSUFFICIENT_STAMPS: "INSUFFICIENT_STAMPS",
  STAMP_ALREADY_CONSUMED: "STAMP_ALREADY_CONSUMED",

  // 스탬프 데이터 관련
  INVALID_STAMP_DATA: "INVALID_STAMP_DATA",
  INVALID_STAMP_ID: "INVALID_STAMP_ID",
  INVALID_STAMP_COUNT: "INVALID_STAMP_COUNT",

  // 스탬프 적립 관련
  STAMP_EARN_FAILED: "STAMP_EARN_FAILED",
  MAX_STAMPS_REACHED: "MAX_STAMPS_REACHED",

  // 권한 관련
  UNAUTHORIZED_ACCESS: "UNAUTHORIZED_ACCESS",
  AUTHENTICATION_REQUIRED: "AUTHENTICATION_REQUIRED",

  // 서버 에러
  SERVER_ERROR: "SERVER_ERROR",
  NETWORK_ERROR: "NETWORK_ERROR",
} as const;

export type StampErrorCode =
  (typeof STAMP_ERROR_CODES)[keyof typeof STAMP_ERROR_CODES];

/**
 * StampError 클래스
 *
 * @remarks
 * Domain Layer의 비즈니스 규칙 위반을 나타내는 에러
 * - HTTP 상태 코드 처리는 Data Layer의 ErrorMapper가 담당
 * - UI 에러 메시지는 Presentation Layer의 Adapter가 담당
 */
export class StampError extends Error {
  constructor(
    message: string,
    public readonly code: StampErrorCode,
    public readonly originalError?: unknown,
  ) {
    super(message);
    this.name = "StampError";

    // Error 클래스의 프로토타입 체인 유지
    Object.setPrototypeOf(this, StampError.prototype);
  }

  /**
   * 스탬프 부족 에러인지 확인
   */
  isInsufficientStamps(): boolean {
    return this.code === STAMP_ERROR_CODES.INSUFFICIENT_STAMPS;
  }

  /**
   * 스탬프를 찾을 수 없는 에러인지 확인
   */
  isStampNotFound(): boolean {
    return this.code === STAMP_ERROR_CODES.STAMP_NOT_FOUND;
  }

  /**
   * 인증 필요 에러인지 확인
   */
  isAuthenticationRequired(): boolean {
    return this.code === STAMP_ERROR_CODES.AUTHENTICATION_REQUIRED;
  }

  /**
   * 에러를 JSON으로 직렬화 (로깅용)
   */
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      stack: this.stack,
    };
  }
}
