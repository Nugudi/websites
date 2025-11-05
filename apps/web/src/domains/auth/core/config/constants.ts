/**
 * Auth Domain Constants
 *
 * API 엔드포인트, 에러 메시지, 설정값 등을 한 곳에서 관리합니다.
 */

/**
 * API 엔드포인트 상수
 */
export const AUTH_API_ENDPOINTS = {
  GOOGLE_AUTHORIZE: "/api/v1/auth/login/google/authorize-url",
  GOOGLE_LOGIN: "/api/v1/auth/login/google",
  KAKAO_AUTHORIZE: "/api/v1/auth/login/kakao/authorize-url",
  KAKAO_LOGIN: "/api/v1/auth/login/kakao",
  NAVER_AUTHORIZE: "/api/v1/auth/login/naver/authorize-url",
  NAVER_LOGIN: "/api/v1/auth/login/naver",
  REFRESH_TOKEN: "/api/v1/auth/refresh",
  LOGOUT: "/api/v1/auth/logout",
  SIGNUP_SOCIAL: "/api/v1/auth/signup/social",
} as const;

/**
 * OAuth Provider 상수
 */
export const OAUTH_PROVIDERS = {
  GOOGLE: "google",
} as const;

/**
 * 에러 코드 상수
 */
export const AUTH_ERROR_CODES = {
  INVALID_CODE: "INVALID_CODE",
  SESSION_EXPIRED: "SESSION_EXPIRED",
  REFRESH_FAILED: "REFRESH_FAILED",
  AUTHENTICATION_REQUIRED: "AUTHENTICATION_REQUIRED",
  INVALID_TOKEN: "INVALID_TOKEN",
} as const;

/**
 * 에러 메시지 상수
 */
export const AUTH_ERRORS = {
  INVALID_CODE: "Invalid authorization code",
  SESSION_EXPIRED: "Session has expired",
  REFRESH_FAILED: "Failed to refresh token",
  AUTHENTICATION_REQUIRED: "Authentication is required",
  INVALID_TOKEN: "Invalid or expired token",
  LOGOUT_FAILED: "Failed to logout",
  SIGNUP_FAILED: "Failed to sign up",
} as const;

/**
 * 세션 설정
 */
export const SESSION_CONFIG = {
  TOKEN_REFRESH_THRESHOLD_MINUTES: 5, // 토큰 만료 5분 전에 갱신
  SESSION_COOKIE_NAME: "session",
  DEVICE_ID_KEY: "deviceId",
} as const;
