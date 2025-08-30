import type { TermsAgreement } from "../types/sign-up";

export const TOTAL_SIGN_UP_STEPS = 5;
export const SIGN_UP_STORE_KEY = "sign-up-store";

// Password validation regex: min 8, max 20, must contain lowercase, uppercase, number, and special char
export const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]+$/;
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 20;

// Email verification
export const VERIFICATION_CODE_LENGTH = 6;

export const TERMS_AND_CONDITIONS_LIST = [
  {
    id: 1,
    title: "개인정보 처리 방침",
    link: "https://yolog.com/privacy",
    mandatory: true,
  },
  {
    id: 2,
    title: "이용 약관 동의",
    link: "https://yolog.com/terms",
    mandatory: true,
  },
  {
    id: 3,
    title: "마케팅 이메일 수신 동의",
    link: "https://yolog.com/location",
    mandatory: false,
  },
] as TermsAgreement[];
