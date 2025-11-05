"use client";

import { Flex } from "@nugudi/react-components-layout";
import { StepIndicator } from "@nugudi/react-components-step-indicator";
import { useEffect } from "react";
import { TOTAL_SOCIAL_SIGN_UP_STEPS } from "../../constants/social-sign-up";
import { useSocialSignUpStore } from "../../stores/use-social-sign-up-store";
import * as styles from "./index.css";
import { AgreementForm } from "./steps/agreement-form";
import { NicknameForm } from "./steps/nickname-form";

export const AuthSocialSignUpForm = () => {
  const { step } = useSocialSignUpStore();

  // biome-ignore lint/correctness/useExhaustiveDependencies: Zustand Persist의 동작 방식(zustand persist는 비동기) - https://zustand.docs.pmnd.rs/integrations/persisting-store-data
  useEffect(() => {
    if (!useSocialSignUpStore.persist?.hasHydrated) return;
  }, [useSocialSignUpStore.persist?.hasHydrated]);

  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      className={styles.container}
    >
      <StepIndicator
        currentStep={step}
        totalSteps={TOTAL_SOCIAL_SIGN_UP_STEPS}
      />
      {step === 1 && <NicknameForm />}
      {step === 2 && <AgreementForm />}
    </Flex>
  );
};
