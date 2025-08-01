import "@nugudi/react-components-layout/style.css";
import { Emphasis as _Emphasis } from "@nugudi/react-components-layout";
import { classes, vars } from "@nugudi/themes";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof _Emphasis> = {
  title: "Typography/Emphasis",
  component: _Emphasis,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    as: {
      options: ["em"],
      control: "select",
    },
    fontSize: {
      options: Object.keys(classes.typography.emphasis),
      control: "select",
    },
    color: {
      options: Object.keys(vars.colors.$scale),
      control: "select",
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Emphasis: Story = {
  args: {
    as: "em",
    children: "Matthew World",
    fontSize: "e1",
    color: "zinc",
  },
};
