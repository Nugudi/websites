/**
 * Cafeteria Domain Constants
 *
 * 비즈니스 규칙을 상수로 정의
 *
 * @remarks
 * - 하드코딩 방지
 * - 비즈니스 규칙 중앙 관리
 * - 테스트 용이성 향상
 */

export const CAFETERIA_VALIDATION = {
  NAME: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 100,
    MESSAGES: {
      REQUIRED: "Cafeteria name is required",
      TOO_SHORT: "Cafeteria name must be at least 1 character",
      TOO_LONG: "Cafeteria name must be 100 characters or less",
    },
  },
  ADDRESS: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 200,
    MESSAGES: {
      REQUIRED: "Cafeteria address is required",
      TOO_SHORT: "Cafeteria address must be at least 1 character",
      TOO_LONG: "Cafeteria address must be 200 characters or less",
    },
  },
  PHONE: {
    PATTERN: /^\d{2,3}-\d{3,4}-\d{4}$/,
    MESSAGES: {
      INVALID: "Invalid phone number format",
    },
  },
  MEAL_TICKET_PRICE: {
    MIN_VALUE: 0,
    MAX_VALUE: 1000000,
    MESSAGES: {
      INVALID: "Invalid meal ticket price",
      TOO_LOW: "Meal ticket price must be at least 0",
      TOO_HIGH: "Meal ticket price must be 1,000,000 or less",
    },
  },
} as const;

export const REVIEW_VALIDATION = {
  RATING: {
    MIN_VALUE: 1,
    MAX_VALUE: 5,
    MESSAGES: {
      INVALID: "Rating must be between 1 and 5",
    },
  },
  CONTENT: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 500,
    MESSAGES: {
      REQUIRED: "Review content is required",
      TOO_SHORT: "Review content must be at least 1 character",
      TOO_LONG: "Review content must be 500 characters or less",
    },
  },
} as const;

export const MENU_VALIDATION = {
  NAME: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 100,
    MESSAGES: {
      REQUIRED: "Menu name is required",
      TOO_SHORT: "Menu name must be at least 1 character",
      TOO_LONG: "Menu name must be 100 characters or less",
    },
  },
  PRICE: {
    MIN_VALUE: 0,
    MAX_VALUE: 1000000,
    MESSAGES: {
      INVALID: "Invalid menu price",
      TOO_LOW: "Menu price must be at least 0",
      TOO_HIGH: "Menu price must be 1,000,000 or less",
    },
  },
} as const;

export const BUSINESS_HOURS_VALIDATION = {
  MESSAGES: {
    INVALID_TIME_FORMAT: "시간 형식이 올바르지 않습니다 (HH:mm)",
    INVALID_TIME_RANGE: "종료 시간은 시작 시간보다 늦어야 합니다",
    INVALID_HOUR: "시간은 0-23 사이의 값이어야 합니다",
    INVALID_MINUTE: "분은 0-59 사이의 값이어야 합니다",
  },
} as const;

export const MEAL_TYPE = {
  LUNCH: "lunch",
  DINNER: "dinner",
} as const;

export const TIME_FORMAT = {
  DISPLAY: "HH:mm",
  PERIOD_SEPARATOR: " ~ ",
} as const;
