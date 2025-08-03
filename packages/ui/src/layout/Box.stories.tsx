import "@nugudi/react-components-layout/style.css";
import { Box as _Box } from "@nugudi/react-components-layout";
import { vars } from "@nugudi/themes";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof _Box> = {
  title: "Components/Layout/Box",
  component: _Box,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    as: {
      control: "select",
      options: ["div"],
    },
    padding: {
      control: "select",
      options: Object.keys(vars.box.spacing),
    },
    borderRadius: {
      control: "select",
      options: Object.keys(vars.box.radii),
    },
    boxShadow: {
      control: "select",
      options: Object.keys(vars.box.shadows),
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const BoxStory: Story = {
  args: {
    as: "button",
    padding: 10,
    background: "main",
    boxShadow: "xl",
    borderRadius: "md",
    children: "YongCoding",
  },
};
