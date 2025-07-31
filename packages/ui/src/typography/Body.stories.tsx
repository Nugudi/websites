import { Body as _Body } from "@nugudi/react-components-layout";
import { classes, vars } from "@nugudi/themes";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof _Body> = {
  title: "Typography/Body",
  component: _Body,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    as: {
      options: ["span", "p"],
      control: "select",
    },
    fontSize: {
      options: Object.keys(classes.typography.body),
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

export const Body: Story = {
  args: {
    as: "p",
    children: "Matthew World",
    fontSize: "b1",
    color: "zinc",
  },
};
