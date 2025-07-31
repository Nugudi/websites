import "@nugudi/react-components-button/style.css";
import { Button as _Button } from "@nugudi/react-components-button";
import { Title } from "@nugudi/react-components-layout";
import { vars } from "@nugudi/themes";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof _Button> = {
  title: "Button",
  component: _Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      options: ["xs", "sm", "md", "lg"],
      control: "select",
      defaultValue: "md",
    },
    color: {
      options: Object.keys(vars.colors.$scale),
      control: "select",
      defaultValue: "main",
    },
    variant: {
      options: ["brand", "neutral"],
      control: "select",
      defaultValue: "brand",
    },
    isLoading: {
      control: "boolean",
      defaultValue: false,
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const ButtonStory: Story = {
  args: {
    size: "lg",
    children: "Button",
    variant: "brand",
    color: "main",
    leftIcon: "😀",
  },
};

export const TextButtonStory: Story = {
  render: () => {
    return (
      <Title
        as="div"
        fontSize="t2"
        color="main"
        style={{
          userSelect: "none",
          cursor: "pointer",
        }}
      >
        텍스트 버튼입니다.
      </Title>
    );
  },
};

export const ToggleButtonStory: Story = {
  render: () => {
    const isSelected = true;
    return (
      <_Button variant={isSelected ? "brand" : "neutral"} color="main">
        {isSelected ? "😀" : "😂"}
      </_Button>
    );
  },
};
