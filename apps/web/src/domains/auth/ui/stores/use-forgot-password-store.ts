/**
 * Forgot Password Store
 *
 * Zustand store for managing forgot password flow state
 */

import { create } from "zustand";

interface ForgotPasswordState {
  email: string | null;
  code: string | null;
  password: string | null;
  passwordConfirm: string | null;
}

interface ForgotPasswordActions {
  setData: (data: Partial<ForgotPasswordState>) => void;
  reset: () => void;
  data: ForgotPasswordState; // Expose all state as 'data' for component access
}

interface ForgotPasswordStore
  extends ForgotPasswordState,
    ForgotPasswordActions {}

const initialState: ForgotPasswordState = {
  email: null,
  code: null,
  password: null,
  passwordConfirm: null,
};

export const useForgotPasswordStore = create<ForgotPasswordStore>(
  (set, get) => ({
    ...initialState,
    get data() {
      const state = get();
      return {
        email: state.email,
        code: state.code,
        password: state.password,
        passwordConfirm: state.passwordConfirm,
      };
    },
    setData: (data) =>
      set((state) => ({
        ...state,
        ...data,
      })),
    reset: () => set(initialState),
  }),
);
