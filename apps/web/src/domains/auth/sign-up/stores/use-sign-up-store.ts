import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { SignUpSchema } from "@/src/domains/auth/sign-up/schemas/sign-up-schema";

type UseSignUpStoreState = Partial<SignUpSchema> & {
  data: Partial<SignUpSchema>;
  setData: (data: Partial<SignUpSchema>) => void;

  step: number;
  setStep: (step: number) => void;

  resetAll: () => void;
};

export const useSignUpStore = create<UseSignUpStoreState>()(
  persist(
    (set) => ({
      step: 1,
      data: {},

      setStep: (step) => set({ step }),
      setData: (values) =>
        set((state) => ({ data: { ...state.data, ...values } })),

      resetAll: () => {
        localStorage.removeItem("sign-up-store");
      },
    }),
    {
      name: "sign-up-store",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
