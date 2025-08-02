import "@nugudi/react-components-input/style.css";
import { Input as _Input } from "@nugudi/react-components-input";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof _Input> = {
  title: "Input",
  component: _Input,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      options: ["default", "filled"],
      control: "select",
      defaultValue: "default",
    },
    disabled: {
      control: "boolean",
      defaultValue: false,
    },
    isError: {
      control: "boolean",
      defaultValue: false,
    },
    errorMessage: {
      control: "text",
      defaultValue: "",
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: "default",
    placeholder: "너구리를 입력해주세요.",
  },
};

export const Filled: Story = {
  args: {
    variant: "filled",
    placeholder: "너구리를 입력해주세요.",
  },
};

export const WithError: Story = {
  args: {
    variant: "default",
    label: "전화번호",
    placeholder: "010-2",
    isError: true,
    errorMessage: "전화번호가 올바르지 않습니다.",
  },
};

export const FilledWithError: Story = {
  args: {
    variant: "filled",
    placeholder: "너구리를 입력해주세요.",
    isError: true,
  },
};

export const ErrorStates: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
        width: "100%",
      }}
    >
      <_Input label="기본 상태" placeholder="너구리를 입력해주세요." />
      <_Input
        label="포커스 상태 (타이핑 중)"
        placeholder="포커스 시 메인 컬러로 변경"
        autoFocus
      />
      <_Input
        label="에러 상태 (Default)"
        placeholder="010-2"
        isError
        errorMessage="전화번호가 올바르지 않습니다"
      />
      <_Input variant="filled" placeholder="너구리를 입력해주세요" isError />
    </div>
  ),
};
