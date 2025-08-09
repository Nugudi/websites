import "@nugudi/react-components-input/style.css";
import { HeartIcon } from "@nugudi/assets-icons";
import { Input as _Input } from "@nugudi/react-components-input";
import type { Meta, StoryObj } from "@storybook/react-vite";

const iconOptions = {
  none: null,
  heart: <HeartIcon />,
};

const meta: Meta<typeof _Input> = {
  title: "Components/Input",
  component: _Input,
  tags: ["autodocs"],
  argTypes: {
    label: {
      control: "text",
      table: {
        type: { summary: "string" },
        category: "Basic",
      },
    },
    placeholder: {
      control: "text",
      table: {
        type: { summary: "string" },
        category: "Basic",
      },
    },
    disabled: {
      control: "boolean",
      defaultValue: false,
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
        category: "State",
      },
    },
    isError: {
      control: "boolean",
      defaultValue: false,
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
        category: "State",
      },
    },
    errorMessage: {
      control: "text",
      defaultValue: "",
      table: {
        type: { summary: "string" },
        category: "State",
      },
    },
    variant: {
      options: ["default", "filled"],
      control: "select",
      defaultValue: "default",
      table: {
        type: { summary: "default | filled" },
        defaultValue: { summary: "default" },
        category: "Appearance",
      },
    },
    rightIcon: {
      options: Object.keys(iconOptions),
      mapping: iconOptions,
      control: { type: "select" },
      description: "오른쪽에 표시될 아이콘",
      table: {
        type: { summary: "ReactNode" },
        defaultValue: { summary: "none" },
        category: "Appearance",
      },
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

export const DefaultWithRightIcon: Story = {
  args: {
    variant: "default",
    placeholder: "너구리를 입력해주세요.",
    rightIcon: "heart",
  },
};

export const FilledWithRightIcon: Story = {
  args: {
    variant: "filled",
    placeholder: "너구리를 입력해주세요.",
    rightIcon: "heart",
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

export const AllStates: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
        width: "100%",
      }}
    >
      <h3>모든 Input 상태</h3>

      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}
      >
        <div>
          <h4>Default Variant</h4>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <_Input label="기본 상태" placeholder="텍스트를 입력하세요" />
            <_Input
              label="에러 상태"
              placeholder="010-2"
              isError={true}
              errorMessage="전화번호가 올바르지 않습니다"
            />
            <_Input label="비활성화" placeholder="비활성화된 입력" disabled />
            <_Input
              label="오른쪽 아이콘"
              placeholder="너구리를 입력해주세요."
              rightIcon={<HeartIcon />}
            />
          </div>
        </div>

        <div>
          <h4>Filled Variant</h4>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <_Input variant="filled" placeholder="텍스트를 입력하세요" />
            <_Input variant="filled" placeholder="에러 입력" isError={true} />
            <_Input variant="filled" placeholder="비활성화된 입력" disabled />
            <_Input
              variant="filled"
              placeholder="너구리를 입력해주세요."
              rightIcon={<HeartIcon />}
            />
          </div>
        </div>
      </div>
    </div>
  ),
};
