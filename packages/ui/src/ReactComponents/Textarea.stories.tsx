import "@nugudi/react-components-textarea/style.css";
import { Textarea as _Textarea } from "@nugudi/react-components-textarea";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof _Textarea> = {
  title: "Components/Textarea",
  component: _Textarea,
  tags: ["autodocs"],

  argTypes: {
    resize: {
      options: ["none", "vertical", "horizontal", "both"],
      control: "select",
      defaultValue: "vertical",
      table: {
        type: { summary: "none | vertical | horizontal | both" },
        defaultValue: { summary: "vertical" },
        category: "Basic",
      },
    },
    label: {
      control: "text",
      defaultValue: "",
      table: {
        type: { summary: "string" },
        category: "Basic",
      },
    },
    placeholder: {
      control: "text",
      defaultValue: "오늘의 메뉴 어떠셨나요?",
      table: {
        type: { summary: "string" },
        category: "Basic",
      },
    },
    maxLength: {
      control: "number",
      table: {
        type: { summary: "number" },
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
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: "오늘의 메뉴 어떠셨나요?",
  },
};

export const WithLabel: Story = {
  args: {
    label: "의견",
    placeholder: "오늘의 메뉴 어떠셨나요?",
  },
};

export const WithError: Story = {
  args: {
    label: "리뷰",
    placeholder: "리뷰를 작성해주세요",
    isError: true,
    errorMessage: "리뷰는 10자 이상 작성해주세요.",
  },
};

export const Disabled: Story = {
  args: {
    placeholder: "비활성화된 입력",
    disabled: true,
  },
};

export const NoResize: Story = {
  args: {
    placeholder: "크기 조절이 불가능한 텍스트 영역",
    resize: "none",
  },
};

export const WithMaxLength: Story = {
  args: {
    label: "리뷰",
    placeholder: "최대 200자까지 입력할 수 있습니다.",
    maxLength: 20,
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
      <h3>모든 Textarea 상태</h3>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <_Textarea placeholder="오늘의 메뉴 어떠셨나요?" />
        <_Textarea label="의견" placeholder="오늘의 메뉴 어떠셨나요?" />
        <_Textarea
          label="에러 상태"
          placeholder="리뷰를 작성해주세요"
          isError={true}
          errorMessage="리뷰는 10자 이상 작성해주세요"
        />
        <_Textarea placeholder="비활성화된 입력" disabled />
        <_Textarea
          label="문자 수 제한"
          placeholder="최대 100자까지 입력 가능합니다."
          maxLength={100}
        />
      </div>

      <div>
        <h4>Resize Options</h4>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1rem",
          }}
        >
          <_Textarea label="None" placeholder="크기 조절 불가" resize="none" />
          <_Textarea
            label="Vertical (기본값)"
            placeholder="세로로만 조절"
            resize="vertical"
          />
          <_Textarea
            label="Horizontal"
            placeholder="가로로만 조절"
            resize="horizontal"
          />
          <_Textarea label="Both" placeholder="모든 방향 조절" resize="both" />
        </div>
      </div>
    </div>
  ),
};
