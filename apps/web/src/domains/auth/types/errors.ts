/**
 * 인증 에러 코드
 */
export const AUTH_ERROR_CODES = {
  // Provider 관련
  PROVIDER_NOT_FOUND: "PROVIDER_NOT_FOUND",
  INVALID_PROVIDER: "INVALID_PROVIDER",

  // OAuth 관련
  AUTHORIZATION_FAILED: "AUTHORIZATION_FAILED",
  TOKEN_EXCHANGE_FAILED: "TOKEN_EXCHANGE_FAILED",
  INVALID_CALLBACK_CODE: "INVALID_CALLBACK_CODE",
  NEW_USER_SIGNUP_REQUIRED: "NEW_USER_SIGNUP_REQUIRED",

  // Credentials 관련
  INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
  USER_NOT_FOUND: "USER_NOT_FOUND",
  USER_ALREADY_EXISTS: "USER_ALREADY_EXISTS",

  // 세션 관련
  SESSION_NOT_FOUND: "SESSION_NOT_FOUND",
  SESSION_EXPIRED: "SESSION_EXPIRED",
  TOKEN_REFRESH_FAILED: "TOKEN_REFRESH_FAILED",
  INVALID_SESSION_DATA: "INVALID_SESSION_DATA",
  SESSION_SETUP_FAILED: "SESSION_SETUP_FAILED",

  // 회원가입 관련
  SIGNUP_FAILED: "SIGNUP_FAILED",
  INVALID_SIGNUP_DATA: "INVALID_SIGNUP_DATA",
  MISSING_REQUIRED_FIELDS: "MISSING_REQUIRED_FIELDS",

  // 기타
  UNKNOWN_ERROR: "UNKNOWN_ERROR",
} as const;

export type AuthErrorCode =
  (typeof AUTH_ERROR_CODES)[keyof typeof AUTH_ERROR_CODES];

/**
 * 구조화된 인증 에러 클래스
 */
export class AuthError extends Error {
  constructor(
    public code: AuthErrorCode,
    message: string,
    public context?: Record<string, unknown>,
  ) {
    super(message);
    this.name = "AuthError";

    // 프로토타입 체인 유지 (TypeScript 이슈)
    Object.setPrototypeOf(this, AuthError.prototype);
  }

  /**
   * 에러를 JSON으로 직렬화
   */
  toJSON() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      context: this.context,
    };
  }

  /**
   * Provider를 찾을 수 없는 경우
   */
  static providerNotFound(providerType: string) {
    return new AuthError(
      AUTH_ERROR_CODES.PROVIDER_NOT_FOUND,
      `Provider '${providerType}' not found`,
      { providerType },
    );
  }

  /**
   * 잘못된 Provider 타입
   */
  static invalidProvider(providerType: string) {
    return new AuthError(
      AUTH_ERROR_CODES.INVALID_PROVIDER,
      `Invalid provider type: ${providerType}`,
      { providerType },
    );
  }

  /**
   * OAuth 인증 실패
   */
  static authorizationFailed(providerType: string, reason?: string) {
    return new AuthError(
      AUTH_ERROR_CODES.AUTHORIZATION_FAILED,
      `Authorization failed for ${providerType}${reason ? `: ${reason}` : ""}`,
      { providerType, reason },
    );
  }

  /**
   * 토큰 교환 실패
   */
  static tokenExchangeFailed(providerType: string, reason?: string) {
    return new AuthError(
      AUTH_ERROR_CODES.TOKEN_EXCHANGE_FAILED,
      `Token exchange failed for ${providerType}${reason ? `: ${reason}` : ""}`,
      { providerType, reason },
    );
  }

  /**
   * 잘못된 콜백 코드
   */
  static invalidCallbackCode(providerType: string) {
    return new AuthError(
      AUTH_ERROR_CODES.INVALID_CALLBACK_CODE,
      `Invalid callback code for ${providerType}`,
      { providerType },
    );
  }

  /**
   * 잘못된 로그인 정보
   */
  static invalidCredentials() {
    return new AuthError(
      AUTH_ERROR_CODES.INVALID_CREDENTIALS,
      "Invalid email or password",
    );
  }

  /**
   * 사용자를 찾을 수 없음
   */
  static userNotFound(email: string) {
    return new AuthError(AUTH_ERROR_CODES.USER_NOT_FOUND, "User not found", {
      email,
    });
  }

  /**
   * 이미 존재하는 사용자
   */
  static userAlreadyExists(email: string) {
    return new AuthError(
      AUTH_ERROR_CODES.USER_ALREADY_EXISTS,
      "User already exists",
      { email },
    );
  }

  /**
   * 세션을 찾을 수 없음
   */
  static sessionNotFound() {
    return new AuthError(
      AUTH_ERROR_CODES.SESSION_NOT_FOUND,
      "Session not found",
    );
  }

  /**
   * 세션 만료
   */
  static sessionExpired() {
    return new AuthError(AUTH_ERROR_CODES.SESSION_EXPIRED, "Session expired");
  }

  /**
   * 토큰 갱신 실패
   */
  static tokenRefreshFailed(reason?: string) {
    return new AuthError(
      AUTH_ERROR_CODES.TOKEN_REFRESH_FAILED,
      `Token refresh failed${reason ? `: ${reason}` : ""}`,
      { reason },
    );
  }

  /**
   * 잘못된 세션 데이터
   */
  static invalidSessionData(reason?: string) {
    return new AuthError(
      AUTH_ERROR_CODES.INVALID_SESSION_DATA,
      `Invalid session data${reason ? `: ${reason}` : ""}`,
      { reason },
    );
  }

  /**
   * 신규 회원 회원가입 필요
   */
  static newUserSignupRequired(
    providerType: string,
    registrationToken: string,
  ) {
    return new AuthError(
      AUTH_ERROR_CODES.NEW_USER_SIGNUP_REQUIRED,
      `New user from ${providerType} - signup required`,
      { providerType, registrationToken },
    );
  }

  /**
   * 회원가입 실패
   */
  static signupFailed(reason?: string, context?: Record<string, unknown>) {
    return new AuthError(
      AUTH_ERROR_CODES.SIGNUP_FAILED,
      `Sign up failed${reason ? `: ${reason}` : ""}`,
      { reason, ...context },
    );
  }

  /**
   * 잘못된 회원가입 데이터
   */
  static invalidSignupData(reason?: string) {
    return new AuthError(
      AUTH_ERROR_CODES.INVALID_SIGNUP_DATA,
      `Invalid sign up data${reason ? `: ${reason}` : ""}`,
      { reason },
    );
  }

  /**
   * 필수 필드 누락
   */
  static missingRequiredFields(fields: string[]) {
    return new AuthError(
      AUTH_ERROR_CODES.MISSING_REQUIRED_FIELDS,
      `Missing required fields: ${fields.join(", ")}`,
      { fields },
    );
  }

  /**
   * 세션 설정 실패
   */
  static sessionSetupFailed(reason?: string) {
    return new AuthError(
      AUTH_ERROR_CODES.SESSION_SETUP_FAILED,
      `Session setup failed${reason ? `: ${reason}` : ""}`,
      { reason },
    );
  }

  /**
   * 알 수 없는 에러
   */
  static unknown(message: string, context?: Record<string, unknown>) {
    return new AuthError(AUTH_ERROR_CODES.UNKNOWN_ERROR, message, context);
  }
}
