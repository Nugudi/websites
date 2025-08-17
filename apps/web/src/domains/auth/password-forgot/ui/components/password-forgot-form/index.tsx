"use client";

import { useStepper } from "@nugudi/react-hooks-use-stepper";
import { EmailForm } from "./steps/email-form";
import { EmailVerificationCodeForm } from "./steps/email-verification-code-form";
import { ResetPasswordForm } from "./steps/reset-password-form";

type PasswordForgotStep = typeof PASSWORD_FORGOT_STEPS;

const PASSWORD_FORGOT_STEPS = [
  "이메일_입력",
  "인증번호_입력",
  "새_비밀번호_입력",
] as const;

const PasswordForgotForm = () => {
  const { Step, Stepper } = useStepper<PasswordForgotStep>(
    PASSWORD_FORGOT_STEPS,
  );

  return (
    <Stepper>
      <Step name="이메일_입력">
        <EmailForm />
      </Step>
      <Step name="인증번호_입력">
        <EmailVerificationCodeForm />
      </Step>
      <Step name="새_비밀번호_입력">
        <ResetPasswordForm />
      </Step>
    </Stepper>
  );
};

export default PasswordForgotForm;
