import type { Meta, StoryObj } from "@storybook/react-vite";
import { NugudiButton } from "./index";

const meta: Meta<typeof NugudiButton> = {
  title: "Components/NugudiButton",
  component: NugudiButton,
  tags: ["autodocs"],
  args: {
    children: "Click me",
  },
};

export default meta;

type Story = StoryObj<typeof NugudiButton>;

export const Default: Story = {};

export const WithCustom: Story = {
  args: {
    children: "Custom Styled",
    className: "bg-blue-500 dark:bg-blue-500 dark:text-white hover:bg-blue-600",
  },
};

export const Disabled: Story = {
  args: {
    children: "Disabled",
    className:
      "bg-gray-500 dark:bg-gray-100 dark:text-gray-300 hover:bg-gray-400 hover:border-gray-400 focus:border-gray-400",
  },
};
