import { act, render, renderHook, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useStepper } from "./useStepper";

export type StepType = typeof TEST_STEPS;
const TEST_STEPS = ["step1", "step2", "step3"] as const;

describe("useStepper", () => {
  it("기본 동작 테스트", () => {
    const { result } = renderHook(() => useStepper<StepType>(TEST_STEPS));

    expect(result.current.setStep).toBeDefined();
    expect(result.current.Stepper).toBeDefined();
    expect(result.current.Step).toBeDefined();
  });

  it("스텝 렌더링 테스트", () => {
    const { result } = renderHook(() => useStepper<StepType>(TEST_STEPS));
    const { Stepper, Step } = result.current;

    render(
      <Stepper>
        <Step name="step1">첫 번째 스텝</Step>
        <Step name="step2">두 번째 스텝</Step>
        <Step name="step3">세 번째 스텝</Step>
      </Stepper>,
    );

    expect(screen.getByText("첫 번째 스텝")).toBeInTheDocument();
    expect(screen.queryByText("두 번째 스텝")).not.toBeInTheDocument();
  });

  it("스텝 변경 테스트", () => {
    const { result } = renderHook(() => useStepper<StepType>(TEST_STEPS));

    act(() => {
      result.current.setStep("step2");
    });

    const { Stepper, Step } = result.current;

    render(
      <Stepper>
        <Step name="step1">첫 번째 스텝</Step>
        <Step name="step2">두 번째 스텝</Step>
        <Step name="step3">세 번째 스텝</Step>
      </Stepper>,
    );

    expect(screen.getByText("두 번째 스텝")).toBeInTheDocument();
    expect(screen.queryByText("첫 번째 스텝")).not.toBeInTheDocument();
  });
});
