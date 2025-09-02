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
    direction: {
      control: "select",
      options: ["row", "row-reverse", "column", "column-reverse"],
    },
    grow: {
      control: "select",
      options: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
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

export const Default: Story = {
  args: {
    direction: "row",
    gap: 32,
  },
  render: (args) => (
    <_Stack {...args}>
      <Box background="main" p={12}>
        Default Stack Item 1
      </Box>
      <Box background="blackAlpha" p={12}>
        Default Stack Item 2
      </Box>
      <Box background="main" p={12}>
        Default Stack Item 3
      </Box>
    </_Stack>
  ),
};

export const WithColor: Story = {
  args: {
    color: "main",
  },
  render: (args) => (
    <>
      <_Stack {...args}>
        <Box background="main" p={8}>
          Item 1
        </Box>
        <Box background="blackAlpha" p={8}>
          Item 2
        </Box>
      </_Stack>
    </>
  ),
};

export const WithGap: Story = {
  args: {
    gap: 40,
    direction: "row",
  },
  render: (args) => (
    <_Stack {...args}>
      <Box background="main" p={8}>
        Item 1
      </Box>
      <Box background="blackAlpha" p={8}>
        Item 2
      </Box>
      <Box background="main" p={8}>
        Item 3
      </Box>
    </_Stack>
  ),
};

export const RowDirection: Story = {
  args: {
    direction: "row",
    gap: 32,
    align: "center",
    justify: "start",
  },
  render: (args) => (
    <div style={{ width: "100%", minWidth: "400px" }}>
      <_Stack {...args} style={{ background: "#f0f0f0", padding: "10px" }}>
        <Box background="main" p={12}>
          Row Item 1
        </Box>
        <Box background="main" p={16}>
          Row Item 2
        </Box>
        <Box background="main" p={8}>
          Row Item 3
        </Box>
      </_Stack>
    </div>
  ),
};

export const ColumnDirection: Story = {
  args: {
    direction: "column",
    gap: 32,
    align: "stretch",
  },
  render: (args) => (
    <div style={{ width: "300px" }}>
      <_Stack {...args} style={{ background: "#f0f0f0", padding: "10px" }}>
        <Box background="main" p={12}>
          Column Item 1
        </Box>
        <Box background="main" p={12}>
          Column Item 2
        </Box>
        <Box background="main" p={12}>
          Column Item 3
        </Box>
      </_Stack>
    </div>
  ),
};

export const DirectionComparison: Story = {
  args: {
    gap: 32,
  },
  render: (args) => (
    <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
      <div>
        <h4>Row Direction</h4>
        <_Stack
          {...args}
          direction="row"
          style={{ background: "#f0f0f0", padding: "10px" }}
        >
          <Box background="main" p={12}>
            1
          </Box>
          <Box background="main" p={12}>
            2
          </Box>
          <Box background="main" p={12}>
            3
          </Box>
        </_Stack>
      </div>
      <div>
        <h4>Column Direction</h4>
        <_Stack
          {...args}
          direction="column"
          style={{ background: "#f0f0f0", padding: "10px" }}
        >
          <Box background="main" p={12}>
            1
          </Box>
          <Box background="main" p={12}>
            2
          </Box>
          <Box background="main" p={12}>
            3
          </Box>
        </_Stack>
      </div>
    </div>
  ),
};

export const RowWithAlignment: Story = {
  args: {
    direction: "row",
    gap: 32,
  },
  render: (args) => (
    <div style={{ width: "100%" }}>
      <div style={{ marginBottom: "20px" }}>
        <h4>justify: start / align: center</h4>
        <_Stack
          {...args}
          justify="start"
          align="center"
          style={{ background: "#f0f0f0", padding: "10px", minHeight: "100px" }}
        >
          <Box background="main" p={8}>
            Small
          </Box>
          <Box background="main" p={16}>
            Medium
            <br />
            Height
          </Box>
          <Box background="main" p={24}>
            Large
            <br />
            Content
            <br />
            Here
          </Box>
        </_Stack>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h4>justify: center / align: start</h4>
        <_Stack
          {...args}
          justify="center"
          align="start"
          style={{ background: "#f0f0f0", padding: "10px", minHeight: "100px" }}
        >
          <Box background="main" p={8}>
            Small
          </Box>
          <Box background="main" p={16}>
            Medium
            <br />
            Height
          </Box>
          <Box background="main" p={24}>
            Large
            <br />
            Content
            <br />
            Here
          </Box>
        </_Stack>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h4>justify: between / align: end</h4>
        <_Stack
          {...args}
          justify="between"
          align="end"
          style={{ background: "#f0f0f0", padding: "10px", minHeight: "100px" }}
        >
          <Box background="main" p={8}>
            Small
          </Box>
          <Box background="main" p={16}>
            Medium
            <br />
            Height
          </Box>
          <Box background="main" p={24}>
            Large
            <br />
            Content
            <br />
            Here
          </Box>
        </_Stack>
      </div>
    </div>
  ),
};

export const NestedStacks: Story = {
  render: () => (
    <_Stack
      direction="column"
      gap={48}
      style={{ background: "#f0f0f0", padding: "20px", width: "100%" }}
    >
      <Box background="main" p={12}>
        Header
      </Box>

      <_Stack direction="row" gap={32} style={{ width: "100%" }}>
        <_Stack direction="column" gap={16} style={{ flex: "0 0 200px" }}>
          <Box background="main" p={12}>
            Sidebar Item 1
          </Box>
          <Box background="main" p={12}>
            Sidebar Item 2
          </Box>
          <Box background="main" p={12}>
            Sidebar Item 3
          </Box>
        </_Stack>

        <_Stack direction="column" gap={32} grow={1}>
          <Box background="main" p={16}>
            Main Content Area
          </Box>
          <_Stack direction="row" gap={16} justify="between">
            <Box background="main" p={8}>
              Action 1
            </Box>
            <Box background="main" p={8}>
              Action 2
            </Box>
            <Box background="main" p={8}>
              Action 3
            </Box>
          </_Stack>
        </_Stack>
      </_Stack>

      <Box background="main" p={12}>
        Footer
      </Box>
    </_Stack>
  ),
};

export const CardGrid: Story = {
  args: {
    direction: "row",
    gap: 16,
    wrap: "wrap",
  },
  render: (args) => (
    <_Stack {...args} style={{ maxWidth: "800px" }}>
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <_Stack
          key={i}
          direction="column"
          gap={32}
          style={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "16px",
            flex: "1 1 calc(33.333% - 16px)",
            minWidth: "200px",
          }}
        >
          <Box background="main" p={16} style={{ borderRadius: "4px" }}>
            Image {i}
          </Box>
          <_Stack direction="column" gap={16}>
            <div style={{ fontWeight: "bold" }}>Card Title {i}</div>
            <div style={{ fontSize: "14px", color: "#666" }}>
              Card description goes here.
            </div>
          </_Stack>
          <_Stack direction="row" gap={16} justify="between">
            <Box
              background="main"
              p={8}
              style={{ borderRadius: "4px", flex: 1, textAlign: "center" }}
            >
              Action
            </Box>
          </_Stack>
        </_Stack>
      ))}
    </_Stack>
  ),
};
