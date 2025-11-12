/**
 * Notification Domain Error
 *
 * 비즈니스 규칙 위반을 나타내는 도메인 에러 클래스
 *
 * @remarks
 * - HTTP 상태 코드나 UI 에러가 아닌, 도메인 규칙 위반만 처리
 * - Enum 대신 Union Type + const assertion 사용 (성능 최적화)
 * - 에러 코드는 비즈니스 의미를 가진 상수로 정의
 */

/**
 * Notification Error Codes
 *
 * @remarks
 * Union Type 패턴 (Enum 대신 사용 - TypeScript 성능 최적화)
 */
export const NOTIFICATION_ERROR_CODES = {
  // 알림 조회 관련
  NOTIFICATION_NOT_FOUND: "NOTIFICATION_NOT_FOUND",
  NOTIFICATION_FETCH_FAILED: "NOTIFICATION_FETCH_FAILED",

  // 알림 읽음 처리 관련
  MARK_AS_READ_FAILED: "MARK_AS_READ_FAILED",
  MARK_ALL_AS_READ_FAILED: "MARK_ALL_AS_READ_FAILED",
  ALREADY_READ: "ALREADY_READ",

  // 알림 데이터 관련
  INVALID_NOTIFICATION_DATA: "INVALID_NOTIFICATION_DATA",
  INVALID_NOTIFICATION_ID: "INVALID_NOTIFICATION_ID",

  // 권한 관련
  UNAUTHORIZED_ACCESS: "UNAUTHORIZED_ACCESS",
  AUTHENTICATION_REQUIRED: "AUTHENTICATION_REQUIRED",

  // 서버 에러
  SERVER_ERROR: "SERVER_ERROR",
  NETWORK_ERROR: "NETWORK_ERROR",
} as const;

export type NotificationErrorCode =
  (typeof NOTIFICATION_ERROR_CODES)[keyof typeof NOTIFICATION_ERROR_CODES];

/**
 * NotificationError 클래스
 *
 * @remarks
 * Domain Layer의 비즈니스 규칙 위반을 나타내는 에러
 * - HTTP 상태 코드 처리는 Data Layer의 ErrorMapper가 담당
 * - UI 에러 메시지는 Presentation Layer의 Adapter가 담당
 */
export class NotificationError extends Error {
  constructor(
    message: string,
    public readonly code: NotificationErrorCode,
    public readonly originalError?: unknown,
  ) {
    super(message);
    this.name = "NotificationError";

    // Error 클래스의 프로토타입 체인 유지
    Object.setPrototypeOf(this, NotificationError.prototype);
  }

  /**
   * 알림을 찾을 수 없는 에러인지 확인
   */
  isNotificationNotFound(): boolean {
    return this.code === NOTIFICATION_ERROR_CODES.NOTIFICATION_NOT_FOUND;
  }

  /**
   * 읽음 처리 실패 에러인지 확인
   */
  isMarkAsReadFailed(): boolean {
    return this.code === NOTIFICATION_ERROR_CODES.MARK_AS_READ_FAILED;
  }

  /**
   * 인증 필요 에러인지 확인
   */
  isAuthenticationRequired(): boolean {
    return this.code === NOTIFICATION_ERROR_CODES.AUTHENTICATION_REQUIRED;
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
