import "@nugudi/react-components-step-indicator/style.css";
import { Button } from "@nugudi/react-components-button";
import { StepIndicator as _StepIndicator } from "@nugudi/react-components-step-indicator";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

const meta: Meta<typeof _StepIndicator> = {
  title: "Components/StepIndicator",
  component: _StepIndicator,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    currentStep: {
      control: { type: "number", min: 1, max: 5 },
      defaultValue: 1,
      table: {
        type: { summary: "number" },
        defaultValue: { summary: "1" },
        category: "Basic",
      },
    },
    totalSteps: {
      control: { type: "number", min: 2, max: 10 },
      defaultValue: 4,
      table: {
        type: { summary: "number" },
        defaultValue: { summary: "4" },
        category: "Basic",
      },
    },
    size: {
      options: ["sm", "md", "lg"],
      control: "select",
      defaultValue: "sm",
      table: {
        type: { summary: "sm | md | lg" },
        defaultValue: { summary: "sm" },
        category: "Appearance",
      },
    },
    color: {
      options: ["main", "zinc"],
      control: "select",
      defaultValue: "main",
      table: {
        type: { summary: "main | zinc" },
        defaultValue: { summary: "main" },
        category: "Appearance",
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    currentStep: 1,
    totalSteps: 4,
    size: "sm",
    color: "main",
  },
};

export const zinc: Story = {
  args: {
    currentStep: 2,
    totalSteps: 4,
    color: "zinc",
  },
};

export const TenSteps: Story = {
  args: {
    currentStep: 5,
    totalSteps: 10,
    color: "main",
  },
};

export const AllSizes: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
      }}
    >
      <div>
        <p style={{ marginBottom: "0.5rem", fontSize: "14px" }}>Small</p>
        <_StepIndicator currentStep={2} totalSteps={4} size="sm" color="main" />
      </div>
      <div>
        <p style={{ marginBottom: "0.5rem", fontSize: "14px" }}>Medium</p>
        <_StepIndicator currentStep={2} totalSteps={4} size="md" color="main" />
      </div>
      <div>
        <p style={{ marginBottom: "0.5rem", fontSize: "14px" }}>Large</p>
        <_StepIndicator currentStep={2} totalSteps={4} size="lg" color="main" />
      </div>
    </div>
  ),
};

export const Interactive: Story = {
  render: () => {
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 4;

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "2rem",
          alignItems: "center",
        }}
      >
        <_StepIndicator
          currentStep={currentStep}
          totalSteps={totalSteps}
          size="md"
          color="main"
        />
        <div style={{ display: "flex", gap: "1rem" }}>
          <Button
            color="zinc"
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
          >
            이전
          </Button>
          <Button
            color="zinc"
            onClick={() =>
              setCurrentStep(Math.min(totalSteps, currentStep + 1))
            }
            disabled={currentStep === totalSteps}
          >
            다음
          </Button>
        </div>
      </div>
    );
  },
};
