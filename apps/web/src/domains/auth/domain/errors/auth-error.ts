/**
 * Auth Domain Error
 *
 * 비즈니스 규칙 위반을 나타내는 도메인 에러 클래스
 *
 * @remarks
 * - HTTP 상태 코드나 UI 에러가 아닌, 도메인 규칙 위반만 처리
 * - Enum 대신 Union Type + const assertion 사용 (성능 최적화)
 * - 에러 코드는 비즈니스 의미를 가진 상수로 정의
 */

/**
 * Auth Error Codes
 *
 * @remarks
 * Union Type 패턴 (Enum 대신 사용 - TypeScript 성능 최적화)
 */
export const AUTH_ERROR_CODES = {
  // 세션 관련
  SESSION_EXPIRED: "SESSION_EXPIRED",
  INVALID_TOKEN: "INVALID_TOKEN",
  TOKEN_REFRESH_FAILED: "TOKEN_REFRESH_FAILED",

  // 인증 관련
  INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
  AUTHENTICATION_REQUIRED: "AUTHENTICATION_REQUIRED",
  INVALID_CODE: "INVALID_CODE",

  // 권한 관련
  UNAUTHORIZED_ACCESS: "UNAUTHORIZED_ACCESS",

  // OAuth 관련
  INVALID_OAUTH_PROVIDER: "INVALID_OAUTH_PROVIDER",

  // 사용자 데이터 관련
  INVALID_USER_DATA: "INVALID_USER_DATA",
  DUPLICATE_NICKNAME: "DUPLICATE_NICKNAME",
  INVALID_NICKNAME: "INVALID_NICKNAME",
} as const;

export type AuthErrorCode =
  (typeof AUTH_ERROR_CODES)[keyof typeof AUTH_ERROR_CODES];

/**
 * AuthError 클래스
 *
 * @remarks
 * Domain Layer의 비즈니스 규칙 위반을 나타내는 에러
 * - HTTP 상태 코드 처리는 Data Layer의 ErrorMapper가 담당
 * - UI 에러 메시지는 Presentation Layer의 Adapter가 담당
 */
export class AuthError extends Error {
  constructor(
    message: string,
    public readonly code: AuthErrorCode,
    public readonly originalError?: unknown,
  ) {
    super(message);
    this.name = "AuthError";

    // Error 클래스의 프로토타입 체인 유지
    Object.setPrototypeOf(this, AuthError.prototype);
  }

  /**
   * 세션 만료 에러인지 확인
   */
  isSessionExpired(): boolean {
    return this.code === AUTH_ERROR_CODES.SESSION_EXPIRED;
  }

  /**
   * 토큰 갱신 실패 에러인지 확인
   */
  isRefreshFailed(): boolean {
    return this.code === AUTH_ERROR_CODES.TOKEN_REFRESH_FAILED;
  }

  /**
   * 인증 필요 에러인지 확인
   */
  isAuthenticationRequired(): boolean {
    return this.code === AUTH_ERROR_CODES.AUTHENTICATION_REQUIRED;
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
