import "@nugudi/react-components-layout/style.css";
import { Box as _Box } from "@nugudi/react-components-layout";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof _Box> = {
  title: "Components/Layout/Box",
  component: _Box,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const BoxStory: Story = {
  args: {
    as: "button",
    padding: "5",
    background: "main",
    boxShadow: "xl",
    borderRadius: "md",
  },
};
