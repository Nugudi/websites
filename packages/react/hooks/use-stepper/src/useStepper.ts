import React, { type ReactNode, useState } from "react";
import type { StepProps, StepperProps } from "./types";

/**
 * @param steps - The steps to use in the stepper.
 * @returns The Stepper, Step, and setStep functions.
 * @example
 * ```tsx
 * export type StepType = typeof SIGNUP_REGISTRATION_STEPS;
 *
 * const SIGNUP_REGISTRATION_STEPS = ["이름_입력", "이메일_입력", "비밀번호_입력", "비밀번호_확인", "전화번호_입력"] as const;
 *
 * const { Stepper, Step, setStep } = useStepper<StepType>(SIGNUP_REGISTRATION_STEPS);
 *
 * return (
 *   <Stepper>
 *     <Step name="이름_입력">이름_입력</Step>
 *     <Step name="이메일_입력">이메일_입력</Step>
 *     <Step name="비밀번호_입력">비밀번호_입력</Step>
 *     <Step name="비밀번호_확인">비밀번호_확인</Step>
 *     <Step name="전화번호_입력">전화번호_입력</Step>
 *   </Stepper>
 * );
 * ```
 */
export const useStepper = <T extends readonly string[]>(steps: T) => {
  const initialStep = steps[0];
  const [step, setStep] = useState<T[number]>(initialStep);

  const Step = React.memo((props: StepProps<T[number]>): ReactNode => {
    return React.createElement(React.Fragment, null, props.children);
  });

  const Stepper = React.memo(({ children }: StepperProps<T[number]>) => {
    const targetStep = children.find(
      (childStep) => childStep.props.name === step,
    );

    return React.createElement(React.Fragment, null, targetStep);
  });

  return { Stepper, Step, setStep };
};
