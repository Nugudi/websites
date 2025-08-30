export const FORGOT_PASSWORD_STORE_KEY = "forgot-password-store";

// Password validation constants (shared with sign-up)
export const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]+$/;
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 20;

// Email verification code constants
export const VERIFICATION_CODE_LENGTH = 6;
