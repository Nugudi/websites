/**
 * Sign Up Constants
 *
 * Constants for sign-up flow
 */

export const TOTAL_SIGN_UP_STEPS = 5;

export interface TermsAndCondition {
  id: number;
  title: string;
  mandatory: boolean;
  link?: string;
}

export const TERMS_AND_CONDITIONS_LIST: TermsAndCondition[] = [
  {
    id: 1,
    title: "개인정보 처리방침",
    mandatory: true,
    link: "/terms/privacy",
  },
  {
    id: 2,
    title: "서비스 이용약관",
    mandatory: true,
    link: "/terms/service",
  },
  {
    id: 3,
    title: "마케팅 정보 수신 동의 (선택)",
    mandatory: false,
  },
];
