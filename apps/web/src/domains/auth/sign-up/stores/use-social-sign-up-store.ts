import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { SocialSignUpSchema } from "../schemas/social-sign-up-schema";

const SOCIAL_SIGN_UP_STORE_KEY = "nugudi-social-sign-up";

interface SocialSignUpStoreState {
  registrationToken: string | null;
  data: Partial<SocialSignUpSchema>;

  setRegistrationToken: (token: string) => void;
  setData: (data: Partial<SocialSignUpSchema>) => void;
  resetAll: () => void;
}

/**
 * 소셜 로그인 회원가입 데이터를 관리하는 Zustand 스토어입니다.
 * localStorage에 자동으로 저장되어 페이지 새로고침 시에도 데이터가 유지됩니다.
 */
export const useSocialSignUpStore = create<SocialSignUpStoreState>()(
  persist(
    (set) => ({
      registrationToken: null,
      data: {
        marketingEmail: false,
      },

      setRegistrationToken: (token) => set({ registrationToken: token }),
      setData: (values) =>
        set((state) => ({ data: { ...state.data, ...values } })),

      resetAll: () => {
        localStorage.removeItem(SOCIAL_SIGN_UP_STORE_KEY);
        set({ registrationToken: null, data: { marketingEmail: false } });
      },
    }),
    {
      name: SOCIAL_SIGN_UP_STORE_KEY,
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
