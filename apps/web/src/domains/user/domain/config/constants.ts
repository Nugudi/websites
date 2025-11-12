/**
 * User Domain Constants
 *
 * Domain Layer의 비즈니스 규칙 상수
 *
 * @remarks
 * - 비즈니스 규칙을 한 곳에서 관리
 * - 하드코딩 방지
 * - Clean Architecture: Domain 계층의 비즈니스 규칙
 */

/**
 * 닉네임 검증 규칙
 */
export const NICKNAME_VALIDATION = {
  /**
   * 최소 길이 (2자)
   */
  MIN_LENGTH: 2,

  /**
   * 최대 길이 (20자)
   */
  MAX_LENGTH: 20,

  /**
   * 허용되는 패턴
   * - 한글, 영문, 숫자만 허용
   */
  PATTERN: /^[가-힣a-zA-Z0-9]+$/,

  /**
   * 에러 메시지
   */
  MESSAGES: {
    TOO_SHORT: "닉네임은 최소 2자 이상이어야 합니다",
    TOO_LONG: "닉네임은 최대 20자까지 가능합니다",
    INVALID_FORMAT: "닉네임은 한글, 영문, 숫자만 사용할 수 있습니다",
    REQUIRED: "닉네임은 필수입니다",
  },
} as const;

/**
 * 사용자 ID 검증 규칙
 */
export const USER_ID_VALIDATION = {
  /**
   * 최소값 (1)
   */
  MIN_VALUE: 1,

  /**
   * 에러 메시지
   */
  MESSAGES: {
    INVALID: "유효하지 않은 사용자 ID입니다",
    REQUIRED: "사용자 ID는 필수입니다",
  },
} as const;

/**
 * 이메일 검증 규칙
 */
export const EMAIL_VALIDATION = {
  /**
   * 이메일 패턴
   * - 기본적인 이메일 형식 검증
   */
  PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,

  /**
   * 에러 메시지
   */
  MESSAGES: {
    INVALID_FORMAT: "유효하지 않은 이메일 형식입니다",
    REQUIRED: "이메일은 필수입니다",
  },
} as const;
