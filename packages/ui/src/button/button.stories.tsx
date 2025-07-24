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
      options: ["brand", "neutral", "outline"],
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
        <h3>Button Variants</h3>
        <div className={styles.storyRow}>
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
      <div className={styles.storySection}>
        <h3>Button Sizes</h3>
        <div className={styles.storyRow}>
          <Button {...args} size="sm" variant="brand">
            Small
          </Button>
          <Button {...args} size="md" variant="brand">
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
