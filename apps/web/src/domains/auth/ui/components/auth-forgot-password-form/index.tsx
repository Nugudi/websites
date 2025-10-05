"use client";

import { Flex } from "@nugudi/react-components-layout";
import { StepIndicator } from "@nugudi/react-components-step-indicator";
import { useStepper } from "@nugudi/react-hooks-use-stepper";
import { useRouter } from "next/navigation";
import * as styles from "./index.css";
import { EmailForm } from "./steps/email-form";
import { EmailVerificationCodeForm } from "./steps/email-verification-code-form";
import { ResetPasswordForm } from "./steps/reset-password-form";

type ForgotPasswordStep = typeof FORGOT_PASSWORD_STEPS;

export const FORGOT_PASSWORD_STEPS = [
  "이메일_입력",
  "인증번호_입력",
  "새_비밀번호_입력",
] as const;

const AuthForgotPasswordForm = () => {
  const router = useRouter();

  const { setStep, Step, Stepper, step } = useStepper<ForgotPasswordStep>(
    FORGOT_PASSWORD_STEPS,
  );

  const onChangeStep = (step: 0 | 1 | 2) => {
    setStep(FORGOT_PASSWORD_STEPS[step]);
  };

  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      className={styles.container}
    >
      <StepIndicator
        currentStep={FORGOT_PASSWORD_STEPS.indexOf(step) + 1}
        totalSteps={FORGOT_PASSWORD_STEPS.length}
      />
      <Stepper>
        <Step name="이메일_입력">
          <EmailForm onNext={() => onChangeStep(1)} />
        </Step>
        <Step name="인증번호_입력">
          <EmailVerificationCodeForm
            onPrevious={() => onChangeStep(0)}
            onNext={() => onChangeStep(2)}
          />
        </Step>
        <Step name="새_비밀번호_입력">
          <ResetPasswordForm
            onPrevious={() => onChangeStep(1)}
            onSubmit={() => {
              alert("비밀번호 변경 완료");
              router.push("/");
            }}
          />
        </Step>
      </Stepper>
    </Flex>
  );
};

export default AuthForgotPasswordForm;
