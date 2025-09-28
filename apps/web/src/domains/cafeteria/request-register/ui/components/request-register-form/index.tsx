"use client";

import { useStepper } from "@nugudi/react-hooks-use-stepper";
import { CafeteriaInfoForm } from "./steps/cafeteria-info-form";
import { CompleteForm } from "./steps/complete-form";

const STEPS = ["식당_정보_입력", "완료"] as const;

export const RequestRegisterForm = () => {
  const { Stepper, Step, setStep } = useStepper(STEPS);

  return (
    <Stepper>
      <Step name="식당_정보_입력">
        <CafeteriaInfoForm onNext={() => setStep("완료")} />
      </Step>
      <Step name="완료">
        <CompleteForm />
      </Step>
    </Stepper>
  );
};
