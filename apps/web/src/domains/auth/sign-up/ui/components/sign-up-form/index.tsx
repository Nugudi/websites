"use client";

import { useEffect } from "react";
import { useSignUpStore } from "@/src/domains/auth/sign-up/stores/use-sign-up-store";
import EmailForm from "./steps/email-form";
import EmailVerificationCodeForm from "./steps/email-verification-code-form";
import NicknameForm from "./steps/nickname-form";
import PasswordForm from "./steps/password-form";

const SignUpForm = () => {
  const { step } = useSignUpStore();

  // biome-ignore lint/correctness/useExhaustiveDependencies: Zustand Persist의 동작 방식(zustand persist는 비동기) - https://zustand.docs.pmnd.rs/integrations/persisting-store-data
  useEffect(() => {
    if (!useSignUpStore.persist.hasHydrated) return;
  }, [useSignUpStore.persist.hasHydrated]);

  return (
    <>
      {step === 1 && <EmailForm />}
      {step === 2 && <EmailVerificationCodeForm />}
      {step === 3 && <PasswordForm />}
      {step === 4 && <NicknameForm />}
    </>
  );
};

export default SignUpForm;
