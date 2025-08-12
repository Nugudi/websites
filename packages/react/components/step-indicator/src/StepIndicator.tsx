import { vars } from "@nugudi/themes";
import { assignInlineVars } from "@vanilla-extract/dynamic";
import { clsx } from "clsx";
import * as React from "react";
import {
  activeColorVariant,
  containerStyle,
  inactiveColorVariant,
  stepStyle,
} from "./style.css";
import type { StepIndicatorProps } from "./types";

const StepIndicator = (
  props: StepIndicatorProps,
  ref: React.Ref<HTMLDivElement>,
) => {
  const {
    currentStep,
    totalSteps,
    size = "sm",
    color = "main",
    className,
    style,
    ...restProps
  } = props;

  const activeColor = vars.colors.$scale[color][500];
  const inactiveColor = vars.colors.$scale.zinc[300];

  const steps = Array.from({ length: totalSteps }, (_, index) => index + 1);

  return (
    <div
      {...restProps}
      ref={ref}
      className={clsx([containerStyle({ size }), className])}
      style={{
        ...assignInlineVars({
          [activeColorVariant]: activeColor,
          [inactiveColorVariant]: inactiveColor,
        }),
        ...style,
      }}
      role="progressbar"
      aria-valuenow={currentStep}
      aria-valuemin={1}
      aria-valuemax={totalSteps}
    >
      {steps.map((step) => (
        <div
          key={step}
          className={stepStyle({
            size,
            state: step === currentStep ? "active" : "inactive",
          })}
          aria-current={step === currentStep ? "step" : undefined}
        />
      ))}
    </div>
  );
};

const _StepIndicator = React.forwardRef(StepIndicator);
export { _StepIndicator as StepIndicator };
