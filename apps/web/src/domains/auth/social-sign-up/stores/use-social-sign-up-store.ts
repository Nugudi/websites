import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { SOCIAL_SIGN_UP_STORE_KEY } from "../constants/social-sign-up";
import type { SocialSignUpSchema } from "../schemas/social-sign-up-schema";

type UseSocialSignUpStoreState = Partial<SocialSignUpSchema> & {
  data: Partial<SocialSignUpSchema>;
  setData: (data: Partial<SocialSignUpSchema>) => void;

  step: number;
  setStep: (step: number) => void;

  provider: string | null;
  setProvider: (provider: string) => void;

  registrationToken: string | null;
  setRegistrationToken: (token: string) => void;

  resetAll: () => void;
};

/**
 * 소셜 회원가입 폼의 다단계 스텝과 데이터를 관리하는 Zustand 스토어입니다.
 * localStorage에 자동으로 저장되어 페이지 새로고침 시에도 데이터가 유지됩니다.
 *
 * @example
 * ```tsx
 * const { step, setStep, data, setData, registrationToken } = useSocialSignUpStore();
 *
 * // 다음 스텝으로 이동
 * setStep(2);
 *
 * // 폼 데이터 저장
 * setData({ nickname: 'user123' });
 *
 * // 모든 데이터 초기화
 * resetAll();
 * ```
 */
export const useSocialSignUpStore = create<UseSocialSignUpStoreState>()(
  persist(
    (set) => ({
      step: 1,
      data: {},
      provider: null,
      registrationToken: null,

      setStep: (step) => set({ step }),
      setData: (values) =>
        set((state) => ({ data: { ...state.data, ...values } })),
      setProvider: (provider) => set({ provider }),
      setRegistrationToken: (token) => set({ registrationToken: token }),

      resetAll: () => {
        localStorage.removeItem(SOCIAL_SIGN_UP_STORE_KEY);
        set({
          step: 1,
          data: {},
          provider: null,
          registrationToken: null,
        });
      },
    }),
    {
      name: SOCIAL_SIGN_UP_STORE_KEY,
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
