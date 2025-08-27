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
      options: [
        "div",
        "section",
        "article",
        "main",
        "header",
        "footer",
        "nav",
        "aside",
      ],
    },
    // Size properties
    w: {
      control: "select",
      options: [...Object.keys(vars.box.spacing), "auto", "full", "screen"],
      description: "Width",
    },
    h: {
      control: "select",
      options: [...Object.keys(vars.box.spacing), "auto", "full", "screen"],
      description: "Height",
    },
    minW: {
      control: "select",
      options: [
        ...Object.keys(vars.box.spacing),
        "auto",
        "full",
        "min",
        "max",
        "fit",
      ],
      description: "Minimum width",
    },
    maxW: {
      control: "select",
      options: [...Object.keys(vars.box.spacing), "auto", "full", "none"],
      description: "Maximum width",
    },
    minH: {
      control: "select",
      options: [
        ...Object.keys(vars.box.spacing),
        "auto",
        "full",
        "min",
        "max",
        "fit",
      ],
      description: "Minimum height",
    },
    maxH: {
      control: "select",
      options: [...Object.keys(vars.box.spacing), "auto", "full", "none"],
      description: "Maximum height",
    },
    // Color properties
    color: {
      control: "select",
      options: Object.keys(vars.colors.$scale),
      description: "Text color",
    },
    background: {
      control: "select",
      options: Object.keys(vars.colors.$scale),
      description: "Background color",
    },
    // Padding properties
    p: {
      control: "select",
      options: Object.keys(vars.box.spacing),
      description: "Padding (all sides)",
    },
    pt: {
      control: "select",
      options: Object.keys(vars.box.spacing),
      description: "Padding top",
    },
    pr: {
      control: "select",
      options: Object.keys(vars.box.spacing),
      description: "Padding right",
    },
    pb: {
      control: "select",
      options: Object.keys(vars.box.spacing),
      description: "Padding bottom",
    },
    pl: {
      control: "select",
      options: Object.keys(vars.box.spacing),
      description: "Padding left",
    },
    pX: {
      control: "select",
      options: Object.keys(vars.box.spacing),
      description: "Padding horizontal (left & right)",
    },
    pY: {
      control: "select",
      options: Object.keys(vars.box.spacing),
      description: "Padding vertical (top & bottom)",
    },
    // Margin properties
    m: {
      control: "select",
      options: [...Object.keys(vars.box.spacing), "auto"],
      description: "Margin (all sides)",
    },
    mt: {
      control: "select",
      options: [...Object.keys(vars.box.spacing), "auto"],
      description: "Margin top",
    },
    mr: {
      control: "select",
      options: [...Object.keys(vars.box.spacing), "auto"],
      description: "Margin right",
    },
    mb: {
      control: "select",
      options: [...Object.keys(vars.box.spacing), "auto"],
      description: "Margin bottom",
    },
    ml: {
      control: "select",
      options: [...Object.keys(vars.box.spacing), "auto"],
      description: "Margin left",
    },
    mX: {
      control: "select",
      options: [...Object.keys(vars.box.spacing), "auto"],
      description: "Margin horizontal (left & right)",
    },
    mY: {
      control: "select",
      options: [...Object.keys(vars.box.spacing), "auto"],
      description: "Margin vertical (top & bottom)",
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

export const Default: Story = {
  args: {
    as: "div",
    p: "10",
    background: "main",
    boxShadow: "xl",
    borderRadius: "md",
    children: "Box Component",
  },
};

export const WithMargin: Story = {
  args: {
    p: "4",
    m: "8",
    background: "zinc",
    borderRadius: "lg",
    children: "Box with margin",
  },
};

export const WithDirectionalPadding: Story = {
  args: {
    pt: "8",
    pr: "12",
    pb: "8",
    pl: "12",
    background: "main",
    borderRadius: "md",
    children: "Different padding on each side",
  },
};

export const WithDirectionalMargin: Story = {
  args: {
    p: "4",
    mt: "4",
    mr: "auto",
    mb: "4",
    ml: "auto",
    background: "blackAlpha",
    borderRadius: "xl",
    children: "Centered with auto margins",
    style: { width: "200px" },
  },
};

export const WithAxisPadding: Story = {
  args: {
    pX: "16",
    pY: "8",
    background: "main",
    borderRadius: "lg",
    boxShadow: "md",
    children: "Horizontal and vertical padding",
  },
};
