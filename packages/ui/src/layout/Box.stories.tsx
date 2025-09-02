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
      control: "text",
      description: "Width in pixels or keywords (auto, full, screen)",
    },
    h: {
      control: "text",
      description: "Height in pixels or keywords (auto, full, screen)",
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
      control: "number",
      description: "Padding in pixels (all sides)",
    },
    pt: {
      control: "number",
      description: "Padding top in pixels",
    },
    pr: {
      control: "number",
      description: "Padding right in pixels",
    },
    pb: {
      control: "number",
      description: "Padding bottom in pixels",
    },
    pl: {
      control: "number",
      description: "Padding left in pixels",
    },
    pX: {
      control: "number",
      description: "Padding horizontal in pixels (left & right)",
    },
    pY: {
      control: "number",
      description: "Padding vertical in pixels (top & bottom)",
    },
    // Margin properties
    m: {
      control: "text",
      description: "Margin in pixels or 'auto' (all sides)",
    },
    mt: {
      control: "text",
      description: "Margin top in pixels or 'auto'",
    },
    mr: {
      control: "text",
      description: "Margin right in pixels or 'auto'",
    },
    mb: {
      control: "text",
      description: "Margin bottom in pixels or 'auto'",
    },
    ml: {
      control: "text",
      description: "Margin left in pixels or 'auto'",
    },
    mX: {
      control: "text",
      description: "Margin horizontal in pixels or 'auto' (left & right)",
    },
    mY: {
      control: "text",
      description: "Margin vertical in pixels or 'auto' (top & bottom)",
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
    p: 40, // 40px (was "10" = 2.5rem = 40px)
    background: "main",
    boxShadow: "xl",
    borderRadius: "md",
    children: "Box Component",
  },
};

export const WithMargin: Story = {
  args: {
    p: 16, // 16px (was "4" = 1rem = 16px)
    m: 32, // 32px (was "8" = 2rem = 32px)
    background: "zinc",
    borderRadius: "lg",
    children: "Box with margin",
  },
};

export const WithDirectionalPadding: Story = {
  args: {
    pt: 32, // 32px (was "8" = 2rem = 32px)
    pr: 48, // 48px (was "12" = 3rem = 48px)
    pb: 32, // 32px (was "8" = 2rem = 32px)
    pl: 48, // 48px (was "12" = 3rem = 48px)
    background: "main",
    borderRadius: "md",
    children: "Different padding on each side",
  },
};

export const WithDirectionalMargin: Story = {
  args: {
    p: 16, // 16px (was "4" = 1rem = 16px)
    mt: 16, // 16px (was "4" = 1rem = 16px)
    mr: "auto",
    mb: 16, // 16px (was "4" = 1rem = 16px)
    ml: "auto",
    background: "blackAlpha",
    borderRadius: "xl",
    children: "Centered with auto margins",
    style: { width: "200px" },
  },
};

export const WithAxisPadding: Story = {
  args: {
    pX: 64, // 64px (was "16" = 4rem = 64px)
    pY: 32, // 32px (was "8" = 2rem = 32px)
    background: "main",
    borderRadius: "lg",
    boxShadow: "md",
    children: "Horizontal and vertical padding",
  },
};
