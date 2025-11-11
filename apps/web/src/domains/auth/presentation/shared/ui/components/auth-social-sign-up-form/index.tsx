"use client";

import { useSocialSignUpStore } from "@auth/presentation/client/stores";
import { TOTAL_SOCIAL_SIGN_UP_STEPS } from "@auth/presentation/shared/constants";
import { Flex } from "@nugudi/react-components-layout";
import { StepIndicator } from "@nugudi/react-components-step-indicator";
import { useEffect } from "react";
import * as styles from "./index.css";
import { AgreementForm } from "./steps/agreement-form";
import { NicknameForm } from "./steps/nickname-form";

export const AuthSocialSignUpForm = () => {
  const { step } = useSocialSignUpStore();

  /**
   * Zustand Persist Hydration 대기 로직
   *
   * persist middleware는 비동기로 localStorage에서 상태를 복원합니다.
   * hasHydrated가 true가 될 때까지 기다려야 초기 렌더링에서 정확한 step 값을 표시할 수 있습니다.
   *
   * exhaustiveDependencies를 무시하는 이유:
   * - persist.hasHydrated는 boolean 값의 변화만 추적하면 됨
   * - useSocialSignUpStore 자체를 의존성에 추가하면 store의 모든 상태 변경 시 재실행되어 불필요한 렌더링 발생
   * - Zustand의 persist 패턴에서 권장하는 방식: https://zustand.docs.pmnd.rs/integrations/persisting-store-data
   */
  // biome-ignore lint/correctness/useExhaustiveDependencies: See comment above
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
