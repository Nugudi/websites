import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { SIGN_UP_STORE_KEY } from "../constants/sign-up";
import type { SignUpSchema } from "../schemas/sign-up-schema";

type UseSignUpStoreState = Partial<SignUpSchema> & {
  data: Partial<SignUpSchema>;
  setData: (data: Partial<SignUpSchema>) => void;

  step: number;
  setStep: (step: number) => void;

  resetAll: () => void;
};

/**
 * 회원가입 폼의 다단계 스텝과 데이터를 관리하는 Zustand 스토어입니다.
 * localStorage에 자동으로 저장되어 페이지 새로고침 시에도 데이터가 유지됩니다.
 *
 * @example
 * ```tsx
 * // 기본 사용법
 * const { step, setStep, data, setData, resetAll } = useSignUpStore();
 *
 * // 다음 스텝으로 이동
 * setStep(2);
 *
 * // 폼 데이터 저장
 * setData({ email: 'user@example.com' });
 *
 * // 기존 데이터와 병합하여 저장
 * setData({ password: 'newPassword123!' });
 *
 * // 모든 데이터 초기화 (localStorage도 함께 삭제)
 * resetAll();
 * ```
 *
 * @example
 * ```tsx
 * // 스텝별 조건부 렌더링
 * const SignUpForm = () => {
 *   const { step } = useSignUpStore();
 *
 *   return (
 *     <>
 *       {step === 1 && <EmailForm />}
 *       {step === 2 && <PasswordForm />}
 *       {step === 3 && <ProfileForm />}
 *     </>
 *   );
 * };
 * ```
 *
 * @example
 * ```tsx
 * // 폼 컴포넌트에서 데이터 관리
 * const EmailForm = () => {
 *   const { data, setData, setStep } = useSignUpStore();
 *
 *   const handleSubmit = (formData: { email: string }) => {
 *     setData(formData);
 *     setStep(2);
 *   };
 *
 *   return (
 *     <form onSubmit={handleSubmit}>
 *       <input defaultValue={data.email} />
 *     </form>
 *   );
 * };
 * ```
 *
 * @returns 회원가입 스토어 객체
 * @returns returns.step - 현재 스텝 (1부터 시작)
 * @returns returns.setStep - 스텝 변경 함수
 * @returns returns.data - 저장된 폼 데이터
 * @returns returns.setData - 폼 데이터 저장/업데이트 함수 (기존 데이터와 병합)
 * @returns returns.resetAll - 모든 데이터 초기화 및 localStorage 삭제 함수
 */
export const useSignUpStore = create<UseSignUpStoreState>()(
  persist(
    (set) => ({
      step: 1,
      data: {},

      setStep: (step) => set({ step }),
      setData: (values) =>
        set((state) => ({ data: { ...state.data, ...values } })),

      resetAll: () => {
        localStorage.removeItem(SIGN_UP_STORE_KEY);
        set({ step: 1, data: {} });
      },
    }),
    {
      name: SIGN_UP_STORE_KEY,
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
