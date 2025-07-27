import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from ".";
import * as styles from "./button.stories.css";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  args: {
    children: "label",
  },
  argTypes: {
    children: {
      control: "text",
    },
    variant: {
      control: "select",
      options: ["brand", "neutral"],
      description: "버튼의 종류",
      table: {
        type: { summary: "brand, neutral" },
      },
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg", "full"],
      description: "버튼의 크기",
      table: {
        type: { summary: "sm, md, lg, full" },
      },
    },
    disabled: {
      control: "boolean",
      description: "버튼의 활성화 여부",
      table: {
        type: { summary: "boolean" },
      },
    },
    onClick: { action: "clicked" },
  },
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Brand: Story = {
  args: {
    variant: "brand",
    size: "full",
  },
};

export const Neutral: Story = {
  args: {
    variant: "neutral",
    size: "full",
  },
};

export const Disabled: Story = {
  args: {
    variant: "brand",
    size: "full",
    disabled: true,
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
      <Button {...args} size="sm" variant="brand">
        Small
      </Button>
      <Button {...args} size="md" variant="brand" disabled>
        Medium
      </Button>
      <Button {...args} size="lg" variant="neutral">
        Large
      </Button>
      <Button {...args} size="full" variant="neutral">
        Full Width
      </Button>
    </div>
  ),
};

export const ThemeShowcase: Story = {
  render: (args) => (
    <div className={styles.storyContainer}>
      <div className={styles.storySection}>
        <h3>버튼 변형</h3>
        <div className={styles.storyRow}>
          <Button {...args} variant="brand">
            브랜드 버튼
          </Button>
          <Button {...args} variant="neutral">
            일반 버튼
          </Button>
          <Button {...args} variant="brand" disabled>
            비활성 버튼
          </Button>
        </div>
      </div>
      <div className={styles.storySection}>
        <h3>버튼 크기</h3>
        <div className={styles.storyRow}>
          <Button {...args} size="sm" variant="brand">
            작은 크기
          </Button>
          <Button {...args} size="md" variant="brand">
            중간 크기
          </Button>
          <Button {...args} size="lg">
            큰 크기
          </Button>
        </div>
      </div>
    </div>
  ),
};
