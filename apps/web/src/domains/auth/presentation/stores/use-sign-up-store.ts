/**
 * Sign Up Store
 *
 * Zustand store for managing sign-up flow state with persistence
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SignUpState {
  step: number;
  email: string | null;
  code: string | null;
  password: string | null;
  passwordConfirm: string | null;
  nickname: string | null;
  acceptPrivacyPolicy: boolean;
  acceptTermsOfService: boolean;
  acceptMarketingEmail: boolean;
}

interface SignUpActions {
  setStep: (step: number) => void;
  setData: (data: Partial<SignUpState>) => void;
  resetAll: () => void;
  data: SignUpState; // Expose all state as 'data' for component access
}

interface SignUpStore extends SignUpState, SignUpActions {
  persist?: {
    hasHydrated?: boolean;
  };
}

const initialState: SignUpState = {
  step: 1,
  email: null,
  code: null,
  password: null,
  passwordConfirm: null,
  nickname: null,
  acceptPrivacyPolicy: false,
  acceptTermsOfService: false,
  acceptMarketingEmail: false,
};

export const useSignUpStore = create<SignUpStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      get data() {
        const state = get();
        return {
          step: state.step,
          email: state.email,
          code: state.code,
          password: state.password,
          passwordConfirm: state.passwordConfirm,
          nickname: state.nickname,
          acceptPrivacyPolicy: state.acceptPrivacyPolicy,
          acceptTermsOfService: state.acceptTermsOfService,
          acceptMarketingEmail: state.acceptMarketingEmail,
        };
      },
      setStep: (step) => set({ step }),
      setData: (data) =>
        set((state) => ({
          ...state,
          ...data,
        })),
      resetAll: () => set(initialState),
    }),
    {
      name: "nugudi-sign-up-storage",
    },
  ),
);
