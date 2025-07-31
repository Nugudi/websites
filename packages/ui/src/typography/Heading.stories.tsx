import { Heading as _Heading } from "@nugudi/react-components-layout";
import { classes, vars } from "@nugudi/themes";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof _Heading> = {
  title: "Typography/Heading",
  component: _Heading,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    as: {
      options: ["h1"],
      control: "select",
    },
    fontSize: {
      options: Object.keys(classes.typography.heading),
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

export const Heading: Story = {
  args: {
    as: "h1",
    children: "Matthew World",
    fontSize: "h1",
    color: "zinc",
  },
};
