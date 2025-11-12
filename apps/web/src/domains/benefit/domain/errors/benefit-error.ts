/**
 * Benefit Domain Errors
 *
 * Domain Layer의 에러 정의
 *
 * @remarks
 * - Union Types + const assertion (Enum 제거)
 * - 비즈니스 로직 관련 에러만 정의
 * - Infrastructure 에러는 Error Mapper에서 변환
 */

export const BENEFIT_ERROR_CODES = {
  // Benefit 조회 관련
  BENEFIT_NOT_FOUND: "BENEFIT_NOT_FOUND",
  BENEFIT_LIST_FETCH_FAILED: "BENEFIT_LIST_FETCH_FAILED",
  INVALID_BENEFIT_DATA: "INVALID_BENEFIT_DATA",

  // Benefit ID 검증
  INVALID_BENEFIT_ID: "INVALID_BENEFIT_ID",
  BENEFIT_ID_REQUIRED: "BENEFIT_ID_REQUIRED",

  // Benefit 속성 검증
  INVALID_PRICE: "INVALID_PRICE",
  INVALID_DISCOUNT_PRICE: "INVALID_DISCOUNT_PRICE",
  INVALID_MENU_NAME: "INVALID_MENU_NAME",
  INVALID_MENU_TYPE: "INVALID_MENU_TYPE",
  INVALID_DATE_FORMAT: "INVALID_DATE_FORMAT",

  // 서버/네트워크 에러
  SERVER_ERROR: "SERVER_ERROR",
  NETWORK_ERROR: "NETWORK_ERROR",
  UNAUTHORIZED_ACCESS: "UNAUTHORIZED_ACCESS",
  AUTHENTICATION_REQUIRED: "AUTHENTICATION_REQUIRED",
} as const;

export type BenefitErrorCode =
  (typeof BENEFIT_ERROR_CODES)[keyof typeof BENEFIT_ERROR_CODES];

/**
 * Benefit Domain Error
 */
export class BenefitError extends Error {
  constructor(
    message: string,
    public readonly code: BenefitErrorCode,
    public readonly originalError?: unknown,
  ) {
    super(message);
    this.name = "BenefitError";
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BenefitError);
    }
  }
}
