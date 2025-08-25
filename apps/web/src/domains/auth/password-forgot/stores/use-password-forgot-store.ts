import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { PASSWORD_FORGOT_STORE_KEY } from "../constants/password-forgot";
import type { PasswordForgotSchema } from "../schemas/password-forgot-schema";

type UsePasswordForgotStoreState = Partial<PasswordForgotSchema> & {
  data: Partial<PasswordForgotSchema>;
  setData: (data: Partial<PasswordForgotSchema>) => void;

  resetData: () => void;
};

export const usePasswordForgotStore = create<UsePasswordForgotStoreState>()(
  persist(
    (set) => ({
      data: {},

      setData: (values) =>
        set((state) => ({
          data: { ...state.data, ...values },
        })),

      resetData: () => {
        localStorage.removeItem(PASSWORD_FORGOT_STORE_KEY);
        set({ data: {} });
      },
    }),
    {
      name: PASSWORD_FORGOT_STORE_KEY,
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
