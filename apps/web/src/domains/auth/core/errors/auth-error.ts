/**
 * Auth Domain Custom Error
 *
 * 인증 관련 에러를 명확하게 구분하고 처리하기 위한 커스텀 에러 클래스
 */

import type { AUTH_ERROR_CODES } from "../config/constants";

/**
 * AuthError 클래스
 *
 * 장점:
 * 1. 에러 타입을 명확하게 구분
 * 2. 에러 처리 로직 통일
 * 3. 사용자 친화적 메시지 제공
 */
export class AuthError extends Error {
  constructor(
    message: string,
    public readonly code?: keyof typeof AUTH_ERROR_CODES,
    public readonly statusCode?: number,
    public readonly originalError?: unknown,
  ) {
    super(message);
    this.name = "AuthError";

    // Error 클래스의 프로토타입 체인 유지
    Object.setPrototypeOf(this, AuthError.prototype);
  }

  /**
   * 인증 에러인지 확인 (401)
   */
  isAuthenticationError(): boolean {
    return this.statusCode === 401;
  }

  /**
   * 권한 에러인지 확인 (403)
   */
  isAuthorizationError(): boolean {
    return this.statusCode === 403;
  }

  /**
   * 세션 만료 에러인지 확인
   */
  isSessionExpired(): boolean {
    return this.code === "SESSION_EXPIRED";
  }

  /**
   * 네트워크 에러인지 확인
   */
  isNetworkError(): boolean {
    return this.statusCode === undefined || this.statusCode >= 500;
  }

  /**
   * 토큰 갱신 실패 에러인지 확인
   */
  isRefreshFailed(): boolean {
    return this.code === "REFRESH_FAILED";
  }

  /**
   * 에러를 사용자 친화적 메시지로 변환
   */
  toUserFriendlyMessage(): string {
    switch (this.code) {
      case "SESSION_EXPIRED":
        return "세션이 만료되었습니다. 다시 로그인해주세요.";
      case "INVALID_CODE":
        return "인증 코드가 올바르지 않습니다.";
      case "REFRESH_FAILED":
        return "로그인 상태를 유지할 수 없습니다. 다시 로그인해주세요.";
      case "AUTHENTICATION_REQUIRED":
        return "로그인이 필요합니다.";
      case "INVALID_TOKEN":
        return "유효하지 않은 인증 정보입니다.";
      default:
        return this.message || "인증 중 오류가 발생했습니다.";
    }
  }

  /**
   * 에러를 JSON으로 직렬화 (로깅용)
   */
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      stack: this.stack,
    };
  }
}
