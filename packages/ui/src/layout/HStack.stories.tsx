import "@nugudi/react-components-layout/style.css";
import { HStack as _HStack, Box } from "@nugudi/react-components-layout";
import { vars } from "@nugudi/themes";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof _HStack> = {
  title: "Components/Layout/HStack",
  component: _HStack,
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
    gap: 32,
  },
  render: (args) => (
    <_HStack {...args}>
      <Box background="main" p={12}>
        HStack Item 1
      </Box>
      <Box background="blackAlpha" p={12}>
        HStack Item 2
      </Box>
      <Box background="main" p={12}>
        HStack Item 3
      </Box>
    </_HStack>
  ),
};

export const WithColor: Story = {
  args: {
    color: "main",
    gap: 32,
  },
  render: (args) => (
    <_HStack {...args}>
      <Box background="main" p={8}>
        Item 1
      </Box>
      <Box background="blackAlpha" p={8}>
        Item 2
      </Box>
    </_HStack>
  ),
};

export const WithGap: Story = {
  args: {
    gap: 64,
  },
  render: (args) => (
    <_HStack {...args}>
      <Box background="main" p={8}>
        Item 1
      </Box>
      <Box background="blackAlpha" p={8}>
        Item 2
      </Box>
      <Box background="main" p={8}>
        Item 3
      </Box>
    </_HStack>
  ),
};

export const AlignmentVariations: Story = {
  args: {
    gap: 32,
  },
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div>
        <h4>align: center</h4>
        <_HStack
          {...args}
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
        </_HStack>
      </div>

      <div>
        <h4>align: start</h4>
        <_HStack
          {...args}
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
        </_HStack>
      </div>

      <div>
        <h4>align: end</h4>
        <_HStack
          {...args}
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
        </_HStack>
      </div>

      <div>
        <h4>align: baseline</h4>
        <_HStack
          {...args}
          align="baseline"
          style={{ background: "#f0f0f0", padding: "10px" }}
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
        </_HStack>
      </div>
    </div>
  ),
};

export const JustifyContent: Story = {
  args: {
    gap: 32,
    align: "center",
  },
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div>
        <h4>justify: start</h4>
        <_HStack
          {...args}
          justify="start"
          style={{ background: "#f0f0f0", padding: "10px", width: "400px" }}
        >
          <Box background="main" p={12}>
            Item 1
          </Box>
          <Box background="main" p={12}>
            Item 2
          </Box>
          <Box background="main" p={12}>
            Item 3
          </Box>
        </_HStack>
      </div>

      <div>
        <h4>justify: center</h4>
        <_HStack
          {...args}
          justify="center"
          style={{ background: "#f0f0f0", padding: "10px", width: "400px" }}
        >
          <Box background="main" p={12}>
            Item 1
          </Box>
          <Box background="main" p={12}>
            Item 2
          </Box>
          <Box background="main" p={12}>
            Item 3
          </Box>
        </_HStack>
      </div>

      <div>
        <h4>justify: end</h4>
        <_HStack
          {...args}
          justify="end"
          style={{ background: "#f0f0f0", padding: "10px", width: "400px" }}
        >
          <Box background="main" p={12}>
            Item 1
          </Box>
          <Box background="main" p={12}>
            Item 2
          </Box>
          <Box background="main" p={12}>
            Item 3
          </Box>
        </_HStack>
      </div>

      <div>
        <h4>justify: between</h4>
        <_HStack
          {...args}
          justify="between"
          style={{ background: "#f0f0f0", padding: "10px", width: "400px" }}
        >
          <Box background="main" p={12}>
            Item 1
          </Box>
          <Box background="main" p={12}>
            Item 2
          </Box>
          <Box background="main" p={12}>
            Item 3
          </Box>
        </_HStack>
      </div>

      <div>
        <h4>justify: around</h4>
        <_HStack
          {...args}
          justify="around"
          style={{ background: "#f0f0f0", padding: "10px", width: "400px" }}
        >
          <Box background="main" p={12}>
            Item 1
          </Box>
          <Box background="main" p={12}>
            Item 2
          </Box>
          <Box background="main" p={12}>
            Item 3
          </Box>
        </_HStack>
      </div>

      <div>
        <h4>justify: evenly</h4>
        <_HStack
          {...args}
          justify="evenly"
          style={{ background: "#f0f0f0", padding: "10px", width: "400px" }}
        >
          <Box background="main" p={12}>
            Item 1
          </Box>
          <Box background="main" p={12}>
            Item 2
          </Box>
          <Box background="main" p={12}>
            Item 3
          </Box>
        </_HStack>
      </div>
    </div>
  ),
};

export const WithWrap: Story = {
  args: {
    gap: 32,
    wrap: "wrap",
  },
  render: (args) => (
    <div style={{ width: "300px" }}>
      <_HStack {...args} style={{ background: "#f0f0f0", padding: "10px" }}>
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <Box key={i} background="main" p={12}>
            Item {i}
          </Box>
        ))}
      </_HStack>
    </div>
  ),
};

export const NavigationBar: Story = {
  render: () => (
    <_HStack
      justify="between"
      align="center"
      style={{
        background: "#333",
        padding: "16px 24px",
        color: "white",
        width: "100%",
      }}
    >
      <div style={{ fontSize: "20px", fontWeight: "bold" }}>Logo</div>

      <_HStack gap={96}>
        <div>Home</div>
        <div>About</div>
        <div>Services</div>
        <div>Contact</div>
      </_HStack>

      <_HStack gap={32}>
        <Box background="main" p={8} style={{ borderRadius: "4px" }}>
          Sign In
        </Box>
        <Box background="blackAlpha" p={8} style={{ borderRadius: "4px" }}>
          Sign Up
        </Box>
      </_HStack>
    </_HStack>
  ),
};

export const Toolbar: Story = {
  render: () => (
    <_HStack
      gap={16}
      align="center"
      style={{
        background: "#f5f5f5",
        padding: "8px 12px",
        border: "1px solid #ddd",
        borderRadius: "4px",
      }}
    >
      <Box background="main" p={8} style={{ borderRadius: "4px" }}>
        Bold
      </Box>
      <Box background="main" p={8} style={{ borderRadius: "4px" }}>
        Italic
      </Box>
      <Box background="main" p={8} style={{ borderRadius: "4px" }}>
        Underline
      </Box>

      <div
        style={{
          width: "1px",
          height: "24px",
          background: "#ccc",
          margin: "0 8px",
        }}
      />

      <Box background="main" p={8} style={{ borderRadius: "4px" }}>
        Left
      </Box>
      <Box background="main" p={8} style={{ borderRadius: "4px" }}>
        Center
      </Box>
      <Box background="main" p={8} style={{ borderRadius: "4px" }}>
        Right
      </Box>

      <div
        style={{
          width: "1px",
          height: "24px",
          background: "#ccc",
          margin: "0 8px",
        }}
      />

      <Box background="blackAlpha" p={8} style={{ borderRadius: "4px" }}>
        Link
      </Box>
      <Box background="blackAlpha" p={8} style={{ borderRadius: "4px" }}>
        Image
      </Box>
    </_HStack>
  ),
};

export const CardWithActions: Story = {
  render: () => (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "16px",
        width: "400px",
      }}
    >
      <_HStack justify="between" align="start" style={{ marginBottom: "12px" }}>
        <div>
          <h3 style={{ margin: "0 0 8px 0" }}>Card Title</h3>
          <p style={{ margin: 0, color: "#666", fontSize: "14px" }}>
            This is a description of the card content. It provides more details
            about what's inside.
          </p>
        </div>
        <Box background="main" p={8} style={{ borderRadius: "4px" }}>
          Options
        </Box>
      </_HStack>

      <_HStack justify="end" gap={32}>
        <Box background="blackAlpha" p={8} style={{ borderRadius: "4px" }}>
          Cancel
        </Box>
        <Box background="main" p={8} style={{ borderRadius: "4px" }}>
          Confirm
        </Box>
      </_HStack>
    </div>
  ),
};

export const Badges: Story = {
  render: () => (
    <_HStack gap={32} wrap="wrap">
      <_HStack
        gap={16}
        align="center"
        style={{
          background: "#e3f2fd",
          padding: "4px 12px",
          borderRadius: "16px",
          border: "1px solid #90caf9",
        }}
      >
        <div
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: "#2196f3",
          }}
        />
        <span style={{ fontSize: "14px", color: "#1976d2" }}>Active</span>
      </_HStack>

      <_HStack
        gap={16}
        align="center"
        style={{
          background: "#fff3e0",
          padding: "4px 12px",
          borderRadius: "16px",
          border: "1px solid #ffb74d",
        }}
      >
        <div
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: "#ff9800",
          }}
        />
        <span style={{ fontSize: "14px", color: "#f57c00" }}>Pending</span>
      </_HStack>

      <_HStack
        gap={16}
        align="center"
        style={{
          background: "#f3e5f5",
          padding: "4px 12px",
          borderRadius: "16px",
          border: "1px solid #ba68c8",
        }}
      >
        <div
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: "#9c27b0",
          }}
        />
        <span style={{ fontSize: "14px", color: "#7b1fa2" }}>Draft</span>
      </_HStack>

      <_HStack
        gap={16}
        align="center"
        style={{
          background: "#e8f5e9",
          padding: "4px 12px",
          borderRadius: "16px",
          border: "1px solid #81c784",
        }}
      >
        <div
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: "#4caf50",
          }}
        />
        <span style={{ fontSize: "14px", color: "#388e3c" }}>Completed</span>
      </_HStack>
    </_HStack>
  ),
};

export const SocialMediaIcons: Story = {
  render: () => (
    <_HStack gap={48}>
      <Box
        background="main"
        p={12}
        style={{
          borderRadius: "50%",
          width: "48px",
          height: "48px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        FB
      </Box>
      <Box
        background="main"
        p={12}
        style={{
          borderRadius: "50%",
          width: "48px",
          height: "48px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        TW
      </Box>
      <Box
        background="main"
        p={12}
        style={{
          borderRadius: "50%",
          width: "48px",
          height: "48px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        IG
      </Box>
      <Box
        background="main"
        p={12}
        style={{
          borderRadius: "50%",
          width: "48px",
          height: "48px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        LI
      </Box>
    </_HStack>
  ),
};
