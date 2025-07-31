import { Title as _Title } from "@nugudi/react-components-layout";
import { classes, vars } from "@nugudi/themes";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof _Title> = {
  title: "Typography/Title",
  component: _Title,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    as: {
      options: ["h2", "h3", "h4", "h5", "h6"],
      control: "select",
    },
    fontSize: {
      options: Object.keys(classes.typography.title),
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

export const Title: Story = {
  args: {
    as: "h2",
    children: "Matthew World",
    fontSize: "t1",
    color: "zinc",
  },
};
