/**
 * Cafeteria Domain Errors
 *
 * Domain Layer의 에러 정의
 *
 * @remarks
 * - Union Types + const assertion (Enum 제거)
 * - 비즈니스 로직 관련 에러만 정의
 * - Infrastructure 에러는 Error Mapper에서 변환
 */

export const CAFETERIA_ERROR_CODES = {
  // Cafeteria 조회 관련
  CAFETERIA_NOT_FOUND: "CAFETERIA_NOT_FOUND",
  CAFETERIA_LIST_FETCH_FAILED: "CAFETERIA_LIST_FETCH_FAILED",
  INVALID_CAFETERIA_DATA: "INVALID_CAFETERIA_DATA",

  // Cafeteria ID 검증
  INVALID_CAFETERIA_ID: "INVALID_CAFETERIA_ID",
  CAFETERIA_ID_REQUIRED: "CAFETERIA_ID_REQUIRED",

  // Cafeteria 속성 검증
  INVALID_NAME: "INVALID_NAME",
  INVALID_ADDRESS: "INVALID_ADDRESS",
  INVALID_PHONE: "INVALID_PHONE",
  INVALID_COORDINATES: "INVALID_COORDINATES",
  INVALID_MEAL_TICKET_PRICE: "INVALID_MEAL_TICKET_PRICE",

  // Review 관련
  REVIEW_NOT_FOUND: "REVIEW_NOT_FOUND",
  REVIEW_FETCH_FAILED: "REVIEW_FETCH_FAILED",
  INVALID_REVIEW_DATA: "INVALID_REVIEW_DATA",
  INVALID_RATING: "INVALID_RATING",
  INVALID_REVIEW_CONTENT: "INVALID_REVIEW_CONTENT",

  // Menu 관련
  MENU_NOT_FOUND: "MENU_NOT_FOUND",
  MENU_FETCH_FAILED: "MENU_FETCH_FAILED",
  INVALID_MENU_DATA: "INVALID_MENU_DATA",

  // 서버/네트워크 에러
  SERVER_ERROR: "SERVER_ERROR",
  NETWORK_ERROR: "NETWORK_ERROR",
  UNAUTHORIZED_ACCESS: "UNAUTHORIZED_ACCESS",
  AUTHENTICATION_REQUIRED: "AUTHENTICATION_REQUIRED",
} as const;

export type CafeteriaErrorCode =
  (typeof CAFETERIA_ERROR_CODES)[keyof typeof CAFETERIA_ERROR_CODES];

/**
 * Cafeteria Domain Error
 */
export class CafeteriaError extends Error {
  constructor(
    message: string,
    public readonly code: CafeteriaErrorCode,
    public readonly originalError?: unknown,
  ) {
    super(message);
    this.name = "CafeteriaError";
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CafeteriaError);
    }
  }
}
