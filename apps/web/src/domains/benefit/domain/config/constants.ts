/**
 * Benefit Domain Constants
 *
 * Domain Layer의 비즈니스 규칙 상수
 *
 * @remarks
 * - 하드코딩 방지
 * - 단일 진실 공급원 (Single Source of Truth)
 * - Entity와 UseCase에서 사용
 */

/**
 * Menu Type Constants
 */
export const MENU_TYPE = {
  LUNCH: "LUNCH",
  DINNER: "DINNER",
  SNACK: "SNACK",
} as const;

/**
 * Menu Type Display Names (한글)
 */
export const MENU_TYPE_DISPLAY_NAMES = {
  [MENU_TYPE.LUNCH]: "점심",
  [MENU_TYPE.DINNER]: "저녁",
  [MENU_TYPE.SNACK]: "간식",
} as const;

/**
 * Price Validation Rules
 */
export const PRICE_VALIDATION = {
  MIN_VALUE: 0,
  MAX_VALUE: 1000000,
  MESSAGES: {
    INVALID: "유효하지 않은 가격입니다",
    TOO_LOW: "가격은 0원 이상이어야 합니다",
    TOO_HIGH: "가격은 1,000,000원 이하여야 합니다",
  },
} as const;

/**
 * Discount Validation Rules
 */
export const DISCOUNT_VALIDATION = {
  MIN_PERCENTAGE: 0,
  MAX_PERCENTAGE: 100,
  SPECIAL_SALE_THRESHOLD: 30, // 30% 이상: "특가"
  SALE_THRESHOLD: 10, // 10% 이상: "할인"
  MESSAGES: {
    INVALID: "유효하지 않은 할인가입니다",
    HIGHER_THAN_PRICE: "할인가가 정가보다 높습니다",
  },
} as const;

/**
 * Menu Name Validation Rules
 */
export const MENU_NAME_VALIDATION = {
  MIN_LENGTH: 1,
  MAX_LENGTH: 100,
  MESSAGES: {
    REQUIRED: "메뉴 이름은 필수입니다",
    TOO_SHORT: "메뉴 이름은 최소 1자 이상이어야 합니다",
    TOO_LONG: "메뉴 이름은 최대 100자까지 가능합니다",
  },
} as const;

/**
 * Benefit ID Validation Rules
 */
export const BENEFIT_ID_VALIDATION = {
  MESSAGES: {
    REQUIRED: "Benefit ID는 필수입니다",
    INVALID: "유효하지 않은 Benefit ID입니다",
  },
} as const;

/**
 * New Item Duration (days)
 */
export const NEW_ITEM_DURATION_DAYS = 7;
