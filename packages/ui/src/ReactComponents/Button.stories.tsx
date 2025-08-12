import "@nugudi/react-components-button/style.css";
import { Button as _Button } from "@nugudi/react-components-button";
import { Title } from "@nugudi/react-components-layout";
import { useButton, useToggleButton } from "@nugudi/react-hooks-button";
import { vars } from "@nugudi/themes";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof _Button> = {
  title: "Components/Button",
  component: _Button,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    size: {
      options: ["sm", "md", "lg"],
      control: "select",
      defaultValue: "lg",
      table: {
        type: { summary: "sm | md | lg" },
        defaultValue: { summary: "lg" },
        category: "Appearance",
      },
    },
    color: {
      options: Object.keys(vars.colors.$scale),
      control: "select",
      defaultValue: "main",
      table: {
        type: { summary: "ColorScale" },
        defaultValue: { summary: "main" },
        category: "Appearance",
      },
    },
    variant: {
      options: ["brand", "neutral"],
      control: "select",
      defaultValue: "brand",
      table: {
        type: { summary: "brand | neutral" },
        defaultValue: { summary: "brand" },
        category: "Appearance",
      },
    },
    isLoading: {
      control: "boolean",
      defaultValue: false,
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
        category: "State",
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
    leftIcon: {
      control: "text",
      table: {
        type: { summary: "ReactNode" },
        category: "Icons",
      },
    },
    rightIcon: {
      control: "text",
      table: {
        type: { summary: "ReactNode" },
        category: "Icons",
      },
    },
    children: {
      control: "text",
      table: {
        type: { summary: "ReactNode" },
        category: "Basic",
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

// Basic Examples
export const Default: Story = {
  args: {
    size: "lg",
    children: "Button",
    variant: "brand",
    color: "main",
  },
};

export const Neutral: Story = {
  args: {
    size: "lg",
    children: "Button",
    variant: "neutral",
    color: "zinc",
  },
};

export const WithLeftIcon: Story = {
  args: {
    size: "lg",
    children: "Button",
    variant: "brand",
    color: "main",
    leftIcon: "👈",
  },
};

// States
export const Loading: Story = {
  args: {
    size: "lg",
    children: "Loading...",
    variant: "brand",
    color: "main",
    isLoading: true,
  },
};

export const Disabled: Story = {
  args: {
    size: "lg",
    children: "Disabled",
    variant: "brand",
    color: "main",
    disabled: true,
  },
};

// Color Variations
export const ColorMain: Story = {
  args: {
    size: "lg",
    children: "Main Color",
    variant: "brand",
    color: "main",
  },
};

export const ColorZinc: Story = {
  args: {
    size: "lg",
    children: "Zinc Color",
    variant: "brand",
    color: "zinc",
  },
};

// All Sizes Showcase
export const AllSizes: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
        width: "100%",
      }}
    >
      <_Button size="sm" color="main">
        Small Button
      </_Button>
      <_Button size="md" color="main">
        Medium Button
      </_Button>
      <_Button size="lg" color="main">
        Large Button
      </_Button>
    </div>
  ),
};

export const TextButton: Story = {
  render: () => {
    const { buttonProps } = useButton({
      elementType: "div",
      onClick: () => {
        console.log("Text button clicked!");
      },
    });

    return (
      <Title
        {...buttonProps}
        as="div"
        fontSize="t2"
        color="main"
        style={{
          userSelect: "none",
          cursor: "pointer",
        }}
      >
        너구디 텍스트 버튼
      </Title>
    );
  },
};

export const ToggleButton: Story = {
  render: () => {
    const { buttonProps, isSelected } = useToggleButton(
      { elementType: "button" },
      false,
    );
    return (
      <_Button
        {...buttonProps}
        variant={isSelected ? "brand" : "neutral"}
        color="zinc"
      >
        {isSelected ? "선택됨 ✅" : "선택 안됨 ⬜"}
      </_Button>
    );
  },
};
