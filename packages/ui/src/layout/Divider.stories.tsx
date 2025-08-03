import "@nugudi/react-components-layout/style.css";
import { Divider as _Divider, Box } from "@nugudi/react-components-layout";
import { vars } from "@nugudi/themes";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof _Divider> = {
  title: "Components/Layout/Divider",
  component: _Divider,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    orientation: {
      options: ["horizontal", "vertical"],
      control: "select",
    },
    variant: {
      options: ["solid", "dashed", "dotted", "double"],
      control: "select",
    },
    color: {
      options: Object.keys(vars.colors.$scale),
      control: "select",
    },
    size: {
      control: { type: "number", min: 1, max: 10 },
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

// Horizontal Divider Stories
export const Horizontal: Story = {
  args: {
    color: "blackAlpha",
    size: 1,
    variant: "solid",
    orientation: "horizontal",
  },
  render: (args) => (
    <Box style={{ width: "400px" }}>
      <Box padding={3}>
        <p>Content above divider</p>
      </Box>
      <_Divider {...args} />
      <Box padding={3}>
        <p>Content below divider</p>
      </Box>
    </Box>
  ),
};

// Vertical Divider Story
export const Vertical: Story = {
  args: {
    color: "blackAlpha",
    size: 1,
    variant: "solid",
    orientation: "vertical",
  },
  render: (args) => (
    <Box style={{ display: "flex", height: "200px", alignItems: "stretch" }}>
      <Box padding={3} style={{ flex: 1 }}>
        <p>Left content</p>
      </Box>
      <_Divider {...args} />
      <Box padding={3} style={{ flex: 1 }}>
        <p>Right content</p>
      </Box>
    </Box>
  ),
};

// Different Variants
export const Variants: Story = {
  render: () => (
    <Box style={{ width: "400px" }}>
      <Box padding={2}>
        <p>Solid Divider</p>
        <_Divider
          color="blackAlpha"
          size={2}
          variant="solid"
          orientation="horizontal"
        />
      </Box>

      <Box padding={2}>
        <p>Dashed Divider</p>
        <_Divider
          color="blackAlpha"
          size={2}
          variant="dashed"
          orientation="horizontal"
        />
      </Box>

      <Box padding={2}>
        <p>Dotted Divider</p>
        <_Divider
          color="blackAlpha"
          size={2}
          variant="dotted"
          orientation="horizontal"
        />
      </Box>

      <Box padding={2}>
        <p>Double Divider</p>
        <_Divider
          color="blackAlpha"
          size={3}
          variant="double"
          orientation="horizontal"
        />
      </Box>
    </Box>
  ),
};

// Different Colors
export const Colors: Story = {
  render: () => (
    <Box style={{ width: "400px" }}>
      <Box padding={2}>
        <p>Main Color</p>
        <_Divider
          color="main"
          size={2}
          variant="solid"
          orientation="horizontal"
        />
      </Box>

      <Box padding={2}>
        <p>Zinc Color</p>
        <_Divider
          color="zinc"
          size={2}
          variant="solid"
          orientation="horizontal"
        />
      </Box>

      <Box padding={2}>
        <p>White Alpha</p>
        <_Divider
          color="whiteAlpha"
          size={2}
          variant="solid"
          orientation="horizontal"
        />
      </Box>

      <Box padding={2}>
        <p>Black Alpha</p>
        <_Divider
          color="blackAlpha"
          size={2}
          variant="solid"
          orientation="horizontal"
        />
      </Box>
    </Box>
  ),
};

// Different Sizes
export const Sizes: Story = {
  render: () => (
    <Box style={{ width: "400px" }}>
      <Box padding={2}>
        <p>Size 1px</p>
        <_Divider
          color="blackAlpha"
          size={1}
          variant="solid"
          orientation="horizontal"
        />
      </Box>

      <Box padding={2}>
        <p>Size 2px</p>
        <_Divider
          color="blackAlpha"
          size={2}
          variant="solid"
          orientation="horizontal"
        />
      </Box>

      <Box padding={2}>
        <p>Size 3px</p>
        <_Divider
          color="blackAlpha"
          size={3}
          variant="solid"
          orientation="horizontal"
        />
      </Box>

      <Box padding={2}>
        <p>Size 5px</p>
        <_Divider
          color="blackAlpha"
          size={5}
          variant="solid"
          orientation="horizontal"
        />
      </Box>
    </Box>
  ),
};

// Complex Layout Example
export const InComplexLayout: Story = {
  render: () => (
    <Box
      style={{ width: "600px", border: "1px solid #ddd", borderRadius: "8px" }}
    >
      <Box padding={4}>
        <h2 style={{ margin: 0 }}>Card Header</h2>
      </Box>

      <_Divider
        color="blackAlpha"
        size={1}
        variant="solid"
        orientation="horizontal"
      />

      <Box style={{ display: "flex", height: "200px" }}>
        <Box padding={4} style={{ flex: 1 }}>
          <h3>Section 1</h3>
          <p>This is the first section of content.</p>
        </Box>

        <_Divider
          color="blackAlpha"
          size={1}
          variant="solid"
          orientation="vertical"
        />

        <Box padding={4} style={{ flex: 1 }}>
          <h3>Section 2</h3>
          <p>This is the second section of content.</p>
        </Box>

        <_Divider
          color="blackAlpha"
          size={1}
          variant="solid"
          orientation="vertical"
        />

        <Box padding={4} style={{ flex: 1 }}>
          <h3>Section 3</h3>
          <p>This is the third section of content.</p>
        </Box>
      </Box>

      <_Divider
        color="zinc"
        size={1}
        variant="solid"
        orientation="horizontal"
      />

      <Box padding={4}>
        <p style={{ margin: 0, fontSize: "14px", color: "#666" }}>
          Card Footer
        </p>
      </Box>
    </Box>
  ),
};

// Playground Story for Testing
export const Playground: Story = {
  args: {
    color: "zinc",
    size: 2,
    variant: "solid",
    orientation: "horizontal",
  },
  render: (args) => (
    <Box
      style={{
        width: args.orientation === "horizontal" ? "400px" : "auto",
        height: args.orientation === "vertical" ? "200px" : "auto",
        display: args.orientation === "vertical" ? "flex" : "block",
      }}
    >
      {args.orientation === "horizontal" ? (
        <>
          <Box padding={3}>
            <p>Content above divider</p>
          </Box>
          <_Divider {...args} />
          <Box padding={3}>
            <p>Content below divider</p>
          </Box>
        </>
      ) : (
        <>
          <Box padding={3} style={{ flex: 1 }}>
            <p>Left content</p>
          </Box>
          <_Divider {...args} />
          <Box padding={3} style={{ flex: 1 }}>
            <p>Right content</p>
          </Box>
        </>
      )}
    </Box>
  ),
};
