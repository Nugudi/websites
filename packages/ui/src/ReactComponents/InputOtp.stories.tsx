import "@nugudi/react-components-input-otp/style.css";
import { InputOTP } from "@nugudi/react-components-input-otp";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof InputOTP> = {
  title: "Components/InputOTP",
  component: InputOTP,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "InputOTP는 일회용 비밀번호나 인증번호 입력을 위한 컴포넌트입니다.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    length: {
      control: { type: "range", min: 4, max: 8, step: 1 },
      description: "OTP 입력 필드의 개수를 설정합니다",
      table: {
        type: { summary: "number" },
        defaultValue: { summary: "6" },
        category: "Basic",
      },
    },
    disabled: {
      control: "boolean",
      description: "입력 필드를 비활성화합니다",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
        category: "State",
      },
    },
    isError: {
      control: "boolean",
      description: "에러 상태를 표시합니다 (빨간색 테두리)",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
        category: "State",
      },
    },
    errorMessage: {
      control: "text",
      description: "에러 상태일 때 표시할 메시지",
      table: {
        type: { summary: "string" },
        category: "State",
      },
    },
    inputMode: {
      control: "select",
      options: ["text", "numeric"],
      description: "입력 모드를 설정합니다",
      table: {
        type: { summary: "text | numeric" },
        defaultValue: { summary: "numeric" },
        category: "Input",
      },
    },
    pattern: {
      control: "text",
      description: "입력 가능한 문자를 정규식으로 제한합니다",
      table: {
        type: { summary: "string (RegExp)" },
        defaultValue: { summary: "[0-9]*" },
        category: "Input",
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    return (
      <InputOTP
        {...args}
        onChange={(value) => console.log("OTP changed:", value)}
      />
    );
  },
};

export const WithError: Story = {
  render: (args) => {
    return (
      <InputOTP
        {...args}
        isError={true}
        errorMessage="잘못된 인증번호입니다."
        onChange={(value) => console.log("OTP changed:", value)}
      />
    );
  },
};

export const DifferentLengths: Story = {
  render: () => {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        <div>
          <h3 style={{ marginBottom: "8px" }}>4자리</h3>
          <InputOTP length={4} />
        </div>
        <div>
          <h3 style={{ marginBottom: "8px" }}>6자리 (Default)</h3>
          <InputOTP length={6} />
        </div>
        <div>
          <h3 style={{ marginBottom: "8px" }}>8자리</h3>
          <InputOTP length={8} />
        </div>
      </div>
    );
  },
};

export const Disabled: Story = {
  render: () => {
    return <InputOTP disabled defaultValue="123456" />;
  },
};

export const AlphabeticPattern: Story = {
  render: () => {
    return (
      <div>
        <p style={{ marginBottom: "8px" }}>알파벳만 입력 가능</p>
        <InputOTP inputMode="text" pattern="[a-zA-Z]*" />
      </div>
    );
  },
};
