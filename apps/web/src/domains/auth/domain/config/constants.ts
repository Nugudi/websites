/**
 * Auth Domain Configuration
 *
 * 비즈니스 규칙 상수 정의
 *
 * @remarks
 * - 도메인 로직에서 사용하는 정적 설정 값
 * - 외부 환경(process.env, window)에 의존하지 않음
 * - API 엔드포인트는 Data Layer에서 관리
 */

/**
 * Session Configuration
 *
 * @remarks
 * 세션 관리 비즈니스 규칙
 */
export const SESSION_CONFIG = {
  /**
   * 토큰 만료 N분 전에 갱신 (단위: 분)
   */
  TOKEN_REFRESH_THRESHOLD_MINUTES: 5,

  /**
   * 세션 쿠키 이름
   */
  SESSION_COOKIE_NAME: "session",

  /**
   * 디바이스 ID 저장 키
   */
  DEVICE_ID_KEY: "deviceId",
} as const;

/**
 * Nickname Validation Rules
 *
 * @remarks
 * 닉네임 유효성 검증 비즈니스 규칙
 */
export const NICKNAME_RULES = {
  /**
   * 최소 길이
   */
  MIN_LENGTH: 2,

  /**
   * 최대 길이
   */
  MAX_LENGTH: 20,

  /**
   * 허용 문자 패턴 (한글, 영문, 숫자)
   */
  PATTERN: /^[가-힣a-zA-Z0-9]+$/,
} as const;

/**
 * Token Configuration
 *
 * @remarks
 * 토큰 관리 비즈니스 규칙
 */
export const TOKEN_CONFIG = {
  /**
   * Access Token 만료 시간 (단위: 초)
   */
  ACCESS_TOKEN_EXPIRY_SECONDS: 3600, // 1시간

  /**
   * Refresh Token 만료 시간 (단위: 초)
   */
  REFRESH_TOKEN_EXPIRY_SECONDS: 2592000, // 30일
} as const;

/**
 * Auth Error Messages (Domain Level)
 *
 * @remarks
 * 도메인 에러 메시지 (비즈니스 규칙 위반)
 */
export const AUTH_ERROR_MESSAGES = {
  INVALID_CODE: "Invalid authorization code",
  SESSION_EXPIRED: "Session has expired",
  TOKEN_REFRESH_FAILED: "Failed to refresh token",
  AUTHENTICATION_REQUIRED: "Authentication is required",
  INVALID_TOKEN: "Invalid or expired token",
  INVALID_CREDENTIALS: "Invalid credentials",
  DUPLICATE_NICKNAME: "Nickname already exists",
  INVALID_NICKNAME: "Invalid nickname format",
  INVALID_USER_DATA: "Invalid user data",
  UNAUTHORIZED_ACCESS: "Unauthorized access",
  INVALID_OAUTH_PROVIDER: "Invalid OAuth provider",
} as const;
