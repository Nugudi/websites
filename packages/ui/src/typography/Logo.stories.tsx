import "@nugudi/react-components-layout/style.css";
import { Logo as _Logo } from "@nugudi/react-components-layout";
import { classes, vars } from "@nugudi/themes";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof _Logo> = {
  title: "Typography/Logo",
  component: _Logo,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    as: {
      options: ["span"],
      control: "select",
    },
    fontSize: {
      options: Object.keys(classes.typography.logo),
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

export const Logo: Story = {
  args: {
    as: "span",
    children: "Matthew World",
    fontSize: "l1",
    color: "zinc",
  },
};
