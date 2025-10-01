"use client";

import { Flex } from "@nugudi/react-components-layout";
import { StepIndicator } from "@nugudi/react-components-step-indicator";
import { useStepper } from "@nugudi/react-hooks-use-stepper";
import { useEffect } from "react";
import { useSocialSignUpStore } from "../../../stores/use-social-sign-up-store";
import * as styles from "./index.css";
import { SocialAgreementForm } from "./steps/social-agreement-form";
import { SocialNicknameForm } from "./steps/social-nickname-form";

const STEPS = ["닉네임_입력", "약관_동의"] as const;

export const SocialSignUpForm = () => {
  const { Stepper, Step, setStep, step } = useStepper(STEPS);
  const { registrationToken } = useSocialSignUpStore();

  // biome-ignore lint/correctness/useExhaustiveDependencies: Zustand Persist의 동작 방식
  useEffect(() => {
    if (!useSocialSignUpStore.persist?.hasHydrated) return;
  }, [useSocialSignUpStore.persist?.hasHydrated]);

  if (!registrationToken) {
    return null;
  }

  const currentStepIndex = STEPS.indexOf(step) + 1;

  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      className={styles.container}
    >
      <StepIndicator currentStep={currentStepIndex} totalSteps={STEPS.length} />
      <Stepper>
        <Step name="닉네임_입력">
          <SocialNicknameForm onNext={() => setStep("약관_동의")} />
        </Step>
        <Step name="약관_동의">
          <SocialAgreementForm />
        </Step>
      </Stepper>
    </Flex>
  );
};
