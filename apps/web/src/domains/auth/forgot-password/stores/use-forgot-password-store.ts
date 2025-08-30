import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { FORGOT_PASSWORD_STORE_KEY } from "../constants/forgot-password";
import type { ForgotPasswordSchema } from "../schemas/forgot-password-schema";

type UseForgotPasswordStoreState = Partial<ForgotPasswordSchema> & {
  data: Partial<ForgotPasswordSchema>;
  setData: (data: Partial<ForgotPasswordSchema>) => void;

  resetData: () => void;
};

export const useForgotPasswordStore = create<UseForgotPasswordStoreState>()(
  persist(
    (set) => ({
      data: {},

      setData: (values) =>
        set((state) => ({
          data: { ...state.data, ...values },
        })),

      resetData: () => {
        localStorage.removeItem(FORGOT_PASSWORD_STORE_KEY);
        set({ data: {} });
      },
    }),
    {
      name: FORGOT_PASSWORD_STORE_KEY,
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
