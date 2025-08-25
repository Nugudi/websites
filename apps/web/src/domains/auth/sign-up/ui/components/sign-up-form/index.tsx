"use client";

import { Flex } from "@nugudi/react-components-layout";
import { StepIndicator } from "@nugudi/react-components-step-indicator";
import { useEffect } from "react";
import { TOTAL_SIGN_UP_STEPS } from "../../../constants/sign-up";
import { useSignUpStore } from "../../../stores/use-sign-up-store";
import * as styles from "./index.css";
import AgreementForm from "./steps/agreement-form";
import EmailForm from "./steps/email-form";
import EmailVerificationCodeForm from "./steps/email-verification-code-form";
import NicknameForm from "./steps/nickname-form";
import PasswordForm from "./steps/password-form";

const SignUpForm = () => {
  const { step } = useSignUpStore();

  // biome-ignore lint/correctness/useExhaustiveDependencies: Zustand Persist의 동작 방식(zustand persist는 비동기) - https://zustand.docs.pmnd.rs/integrations/persisting-store-data
  useEffect(() => {
    if (!useSignUpStore.persist?.hasHydrated) return;
  }, [useSignUpStore.persist?.hasHydrated]);

  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      className={styles.container}
    >
      <StepIndicator currentStep={step} totalSteps={TOTAL_SIGN_UP_STEPS} />
      {step === 1 && <EmailForm />}
      {step === 2 && <EmailVerificationCodeForm />}
      {step === 3 && <PasswordForm />}
      {step === 4 && <NicknameForm />}
      {step === 5 && <AgreementForm />}
    </Flex>
  );
};

export default SignUpForm;
