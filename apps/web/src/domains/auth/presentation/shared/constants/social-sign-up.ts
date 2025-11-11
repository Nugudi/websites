/**
 * Social Sign Up Constants
 *
 * Constants for social OAuth sign-up flow
 */

export const TOTAL_SOCIAL_SIGN_UP_STEPS = 2;

export interface SocialTerms {
  id: number;
  title: string;
  mandatory: boolean;
  link?: string;
}

export const SOCIAL_TERMS_LIST: SocialTerms[] = [
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
    title: "위치정보 이용약관",
    mandatory: true,
    link: "/terms/location",
  },
  {
    id: 4,
    title: "마케팅 정보 수신 동의 (선택)",
    mandatory: false,
  },
];
