import "@nugudi/react-components-layout/style.css";
import { Stack as _Stack, Box } from "@nugudi/react-components-layout";
import { vars } from "@nugudi/themes";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof _Stack> = {
  title: "Components/Layout/Stack",
  component: _Stack,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    align: {
      control: "select",
      options: ["stretch", "center", "start", "end", "baseline"],
    },
    basis: {
      control: "select",
      options: ["auto", "content", "fit-content", "max-content", "min-content"],
    },
    grow: {
      control: "select",
      options: Object.keys(vars.box.spacing).map(Number),
    },
    justify: {
      control: "select",
      options: ["start", "end", "center", "between", "around", "evenly"],
    },
    shrink: {
      control: "select",
      options: Object.keys(vars.box.spacing).map(Number),
    },
    wrap: {
      control: "select",
      options: ["nowrap", "wrap", "wrap-reverse"],
    },
    gap: {
      control: { type: "range", min: 0, max: 24, step: 1 },
    },
    color: {
      control: "select",
      options: Object.keys(vars.colors.$scale),
    },
    background: {
      control: "select",
      options: Object.keys(vars.colors.$scale),
    },
  },
};

type Story = StoryObj<typeof meta>;

export default meta;

export const Default: Story = {};

export const WithColor: Story = {
  args: {
    color: "main",
  },
  render: (args) => (
    <>
      <_Stack {...args}>
        <Box background="main" padding={2}>
          Item 1
        </Box>
        <Box background="blackAlpha" padding={2}>
          Item 2
        </Box>
      </_Stack>
    </>
  ),
};

export const WithGap: Story = {
  args: {
    gap: 10,
  },
  render: (args) => (
    <_Stack {...args}>
      <Box background="main" padding={2}>
        Item 1
      </Box>
      <Box background="blackAlpha" padding={2}>
        Item 2
      </Box>
      <Box background="main" padding={2}>
        Item 3
      </Box>
    </_Stack>
  ),
};
