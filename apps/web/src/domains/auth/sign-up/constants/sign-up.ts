import type { Term } from "../types/sign-up";

export const TOTAL_SIGN_UP_STEPS = 5;
export const SIGN_UP_STORE_KEY = "sign-up-store";

export const 약관목록 = [
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
] as Term[];
