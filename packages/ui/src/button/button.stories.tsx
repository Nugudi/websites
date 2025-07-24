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
      options: ["brand", "neutral"],
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

export const ThemeShowcase: Story = {
  render: (args) => (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="font-semibold text-lg">Button Variants</h3>
        <div className="flex gap-4">
          <Button {...args} variant="brand">
            Brand Button
          </Button>
          <Button {...args} variant="neutral">
            Neutral Button
          </Button>
          <Button {...args} variant="brand" disabled>
            Disabled Button
          </Button>
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="font-semibold text-lg">Button Sizes</h3>
        <div className="flex flex-wrap gap-4">
          <Button {...args} size="sm">
            Small
          </Button>
          <Button {...args} size="md">
            Medium
          </Button>
          <Button {...args} size="lg">
            Large
          </Button>
        </div>
      </div>
    </div>
  ),
};
