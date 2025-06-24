import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from ".";

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
      options: ["brand", "neutral", "disabled"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg", "full"],
    },
    disabled: { control: "boolean" },
    onClick: { action: "clicked" },
  },
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Brand: Story = {
  args: {
    variant: "brand",
    size: "md",
  },
};

export const Neutral: Story = {
  args: {
    variant: "neutral",
    size: "md",
  },
};

export const Disabled: Story = {
  args: {
    variant: "brand",
    size: "md",
    disabled: true,
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-4">
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
