/**
 * User Domain Error Types
 *
 * Domain Layer의 비즈니스 에러 정의
 *
 * @remarks
 * - Union Types + const assertion 사용 (Enum 대체)
 * - Clean Architecture: Domain 계층의 비즈니스 에러
 * - Data Layer의 HTTP Error → Domain Error 변환 시 사용
 */

/**
 * User Error Codes
 *
 * @remarks
 * - const assertion으로 타입 안전성 보장
 * - 모든 User 도메인 에러 코드 정의
 */
export const USER_ERROR_CODES = {
  // 사용자 프로필 관련
  PROFILE_NOT_FOUND: "PROFILE_NOT_FOUND",
  INVALID_USER_DATA: "INVALID_USER_DATA",
  PROFILE_FETCH_FAILED: "PROFILE_FETCH_FAILED",

  // 사용자 ID 검증
  INVALID_USER_ID: "INVALID_USER_ID",
  USER_ID_REQUIRED: "USER_ID_REQUIRED",

  // 닉네임 검증
  INVALID_NICKNAME: "INVALID_NICKNAME",
  NICKNAME_REQUIRED: "NICKNAME_REQUIRED",
  NICKNAME_TOO_SHORT: "NICKNAME_TOO_SHORT",
  NICKNAME_TOO_LONG: "NICKNAME_TOO_LONG",
  NICKNAME_INVALID_FORMAT: "NICKNAME_INVALID_FORMAT",
  NICKNAME_ALREADY_EXISTS: "NICKNAME_ALREADY_EXISTS",
  NICKNAME_CHECK_FAILED: "NICKNAME_CHECK_FAILED",

  // 이메일 검증
  INVALID_EMAIL: "INVALID_EMAIL",
  EMAIL_REQUIRED: "EMAIL_REQUIRED",
  EMAIL_INVALID_FORMAT: "EMAIL_INVALID_FORMAT",

  // 서버 에러
  SERVER_ERROR: "SERVER_ERROR",
  NETWORK_ERROR: "NETWORK_ERROR",

  // 권한 에러
  UNAUTHORIZED_ACCESS: "UNAUTHORIZED_ACCESS",
  AUTHENTICATION_REQUIRED: "AUTHENTICATION_REQUIRED",
} as const;

/**
 * User Error Code Type
 *
 * @remarks
 * USER_ERROR_CODES의 모든 값을 Union Type으로 추출
 */
export type UserErrorCode =
  (typeof USER_ERROR_CODES)[keyof typeof USER_ERROR_CODES];

/**
 * User Domain Error
 *
 * @remarks
 * - Error 클래스를 확장한 Domain 전용 에러
 * - 비즈니스 에러 코드와 메시지 포함
 * - originalError로 근본 원인 추적 가능
 *
 * @example
 * ```typescript
 * throw new UserError(
 *   "닉네임은 최소 2자 이상이어야 합니다",
 *   USER_ERROR_CODES.NICKNAME_TOO_SHORT,
 * );
 * ```
 */
export class UserError extends Error {
  /**
   * User Domain Error 생성자
   *
   * @param message - 사용자에게 표시할 에러 메시지
   * @param code - 비즈니스 에러 코드
   * @param originalError - 원본 에러 (선택적)
   */
  constructor(
    message: string,
    public readonly code: UserErrorCode,
    public readonly originalError?: unknown,
  ) {
    super(message);
    this.name = "UserError";

    // V8 엔진에서 Stack Trace 유지
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, UserError);
    }
  }
}
