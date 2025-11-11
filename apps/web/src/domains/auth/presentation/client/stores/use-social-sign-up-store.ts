/**
 * Social Sign Up Store
 *
 * Zustand store for managing social OAuth sign-up flow state with persistence
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SocialSignUpState {
  step: number;
  provider: string | null;
  registrationToken: string | null;
  nickname: string | null;
  privacyPolicy: boolean;
  termsOfService: boolean;
  locationInfo: boolean;
  marketingEmail: boolean;
}

interface SocialSignUpActions {
  setStep: (step: number) => void;
  setProvider: (provider: string) => void;
  setRegistrationToken: (token: string) => void;
  setData: (data: Partial<SocialSignUpState>) => void;
  reset: () => void;
  data: SocialSignUpState;
}

interface SocialSignUpStore extends SocialSignUpState, SocialSignUpActions {
  persist?: {
    hasHydrated?: boolean;
  };
}

const initialState: SocialSignUpState = {
  step: 1,
  provider: null,
  registrationToken: null,
  nickname: null,
  privacyPolicy: false,
  termsOfService: false,
  locationInfo: false,
  marketingEmail: false,
};

export const useSocialSignUpStore = create<SocialSignUpStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      get data() {
        const state = get();
        return {
          step: state.step,
          provider: state.provider,
          registrationToken: state.registrationToken,
          nickname: state.nickname,
          privacyPolicy: state.privacyPolicy,
          termsOfService: state.termsOfService,
          locationInfo: state.locationInfo,
          marketingEmail: state.marketingEmail,
        };
      },
      setStep: (step) => set({ step }),
      setProvider: (provider) => set({ provider }),
      setRegistrationToken: (token) => set({ registrationToken: token }),
      setData: (data) =>
        set((state) => ({
          ...state,
          ...data,
        })),
      reset: () => set(initialState),
    }),
    {
      name: "nugudi-social-sign-up-storage",
    },
  ),
);
