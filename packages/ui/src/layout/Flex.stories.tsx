import "@nugudi/react-components-layout/style.css";
import { Flex as _Flex, Box } from "@nugudi/react-components-layout";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof _Flex> = {
  title: "Components/Layout/Flex",
  component: _Flex,
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
      options: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
    },
    justify: {
      control: "select",
      options: ["start", "end", "center", "between", "around", "evenly"],
    },
    shrink: {
      control: "select",
      options: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
    },
    wrap: {
      control: "select",
      options: ["nowrap", "wrap", "wrap-reverse"],
    },
    gap: {
      control: "select",
      options: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    gap: 4,
    padding: 4,
    background: "whiteAlpha",
    borderRadius: "lg",
    boxShadow: "md" as const,
  },
  render: (args) => (
    <_Flex {...args}>
      <Box background="main" padding={3} borderRadius="md">
        Item 1
      </Box>
      <Box background="blackAlpha" padding={3} borderRadius="md">
        Item 2
      </Box>
      <Box background="main" padding={3} borderRadius="md">
        Item 3
      </Box>
    </_Flex>
  ),
};

export const Directions: Story = {
  args: {
    gap: 3,
    padding: 4,
    background: "whiteAlpha",
    borderRadius: "lg",
  },
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div>
        <h4>Row (기본값)</h4>
        <_Flex {...args} direction="row">
          <Box background="main" padding={2}>
            1
          </Box>
          <Box background="blackAlpha" padding={2}>
            2
          </Box>
          <Box background="main" padding={2}>
            3
          </Box>
        </_Flex>
      </div>
      <div>
        <h4>Column</h4>
        <_Flex {...args} direction="column">
          <Box background="main" padding={2}>
            1
          </Box>
          <Box background="blackAlpha" padding={2}>
            2
          </Box>
          <Box background="main" padding={2}>
            3
          </Box>
        </_Flex>
      </div>
      <div>
        <h4>Row Reverse</h4>
        <_Flex {...args} direction="row-reverse">
          <Box background="main" padding={2}>
            1
          </Box>
          <Box background="blackAlpha" padding={2}>
            2
          </Box>
          <Box background="main" padding={2}>
            3
          </Box>
        </_Flex>
      </div>
    </div>
  ),
};

export const JustifyContent: Story = {
  args: {
    gap: 2,
    padding: 4,
    background: "whiteAlpha",
    borderRadius: "lg",
    style: { width: "400px" },
  },
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div>
        <h4>Start (기본값)</h4>
        <_Flex {...args} justify="start">
          <Box background="main" padding={2}>
            1
          </Box>
          <Box background="blackAlpha" padding={2}>
            2
          </Box>
          <Box background="main" padding={2}>
            3
          </Box>
        </_Flex>
      </div>
      <div>
        <h4>Center</h4>
        <_Flex {...args} justify="center">
          <Box background="main" padding={2}>
            1
          </Box>
          <Box background="blackAlpha" padding={2}>
            2
          </Box>
          <Box background="main" padding={2}>
            3
          </Box>
        </_Flex>
      </div>
      <div>
        <h4>Space Between</h4>
        <_Flex {...args} justify="between">
          <Box background="main" padding={2}>
            1
          </Box>
          <Box background="blackAlpha" padding={2}>
            2
          </Box>
          <Box background="main" padding={2}>
            3
          </Box>
        </_Flex>
      </div>
      <div>
        <h4>Space Around</h4>
        <_Flex {...args} justify="around">
          <Box background="main" padding={2}>
            1
          </Box>
          <Box background="blackAlpha" padding={2}>
            2
          </Box>
          <Box background="main" padding={2}>
            3
          </Box>
        </_Flex>
      </div>
    </div>
  ),
};

export const AlignItems: Story = {
  args: {
    gap: 2,
    padding: 4,
    background: "whiteAlpha",
    borderRadius: "lg",
    style: { width: "400px", height: "150px" },
  },
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div>
        <h4>Stretch (기본값)</h4>
        <_Flex {...args} align="stretch">
          <Box background="main" padding={2}>
            Short
          </Box>
          <Box background="blackAlpha" padding={2}>
            Medium Height
          </Box>
          <Box background="main" padding={2}>
            Long
            <br />
            Content
            <br />
            Here
          </Box>
        </_Flex>
      </div>
      <div>
        <h4>Center</h4>
        <_Flex {...args} align="center">
          <Box background="main" padding={2}>
            Short
          </Box>
          <Box background="blackAlpha" padding={2}>
            Medium Height
          </Box>
          <Box background="main" padding={2}>
            Long
            <br />
            Content
            <br />
            Here
          </Box>
        </_Flex>
      </div>
      <div>
        <h4>Start</h4>
        <_Flex {...args} align="start">
          <Box background="main" padding={2}>
            Short
          </Box>
          <Box background="blackAlpha" padding={2}>
            Medium Height
          </Box>
          <Box background="main" padding={2}>
            Long
            <br />
            Content
            <br />
            Here
          </Box>
        </_Flex>
      </div>
    </div>
  ),
};

export const FlexWrap: Story = {
  args: {
    gap: 2,
    padding: 4,
    background: "whiteAlpha",
    borderRadius: "lg",
    style: { width: "250px" },
  },
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div>
        <h4>No Wrap (기본값)</h4>
        <_Flex {...args} wrap="nowrap">
          <Box background="main" padding={2} style={{ minWidth: "80px" }}>
            Item 1
          </Box>
          <Box background="blackAlpha" padding={2} style={{ minWidth: "80px" }}>
            Item 2
          </Box>
          <Box background="main" padding={2} style={{ minWidth: "80px" }}>
            Item 3
          </Box>
          <Box background="blackAlpha" padding={2} style={{ minWidth: "80px" }}>
            Item 4
          </Box>
        </_Flex>
      </div>
      <div>
        <h4>Wrap</h4>
        <_Flex {...args} wrap="wrap">
          <Box background="main" padding={2} style={{ minWidth: "80px" }}>
            Item 1
          </Box>
          <Box background="blackAlpha" padding={2} style={{ minWidth: "80px" }}>
            Item 2
          </Box>
          <Box background="main" padding={2} style={{ minWidth: "80px" }}>
            Item 3
          </Box>
          <Box background="blackAlpha" padding={2} style={{ minWidth: "80px" }}>
            Item 4
          </Box>
        </_Flex>
      </div>
    </div>
  ),
};

export const FlexGrowShrink: Story = {
  args: {
    gap: 2,
    padding: 4,
    background: "whiteAlpha",
    borderRadius: "lg",
    style: { width: "400px" },
  },
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div>
        <h4>Flex Grow</h4>
        <_Flex {...args}>
          <Box background="main" padding={2}>
            고정
          </Box>
          <Box background="blackAlpha" padding={2} style={{ flexGrow: 1 }}>
            확장됨 (grow: 1)
          </Box>
          <Box background="main" padding={2}>
            고정
          </Box>
        </_Flex>
      </div>
      <div>
        <h4>Flex Shrink</h4>
        <_Flex {...args}>
          <Box background="main" padding={2} style={{ minWidth: "150px" }}>
            축소 안됨
          </Box>
          <Box
            background="blackAlpha"
            padding={2}
            style={{ minWidth: "150px", flexShrink: 1 }}
          >
            축소됨
          </Box>
          <Box background="main" padding={2} style={{ minWidth: "150px" }}>
            축소 안됨
          </Box>
        </_Flex>
      </div>
    </div>
  ),
};

export const GapVariations: Story = {
  args: {
    padding: 4,
    background: "whiteAlpha",
    borderRadius: "lg",
  },
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div>
        <h4>Gap: 0</h4>
        <_Flex {...args} gap="0">
          <Box background="main" padding={2}>
            Item 1
          </Box>
          <Box background="blackAlpha" padding={2}>
            Item 2
          </Box>
          <Box background="main" padding={2}>
            Item 3
          </Box>
        </_Flex>
      </div>
      <div>
        <h4>Gap: 2</h4>
        <_Flex {...args} gap="2">
          <Box background="main" padding={2}>
            Item 1
          </Box>
          <Box background="blackAlpha" padding={2}>
            Item 2
          </Box>
          <Box background="main" padding={2}>
            Item 3
          </Box>
        </_Flex>
      </div>
      <div>
        <h4>Gap: 6</h4>
        <_Flex {...args} gap="6">
          <Box background="main" padding={2}>
            Item 1
          </Box>
          <Box background="blackAlpha" padding={2}>
            Item 2
          </Box>
          <Box background="main" padding={2}>
            Item 3
          </Box>
        </_Flex>
      </div>
    </div>
  ),
};

export const RealWorldExamples: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
      <div>
        <h4>네비게이션 바</h4>
        <_Flex
          justify="between"
          align="center"
          padding={4}
          background="whiteAlpha"
          borderRadius="lg"
          boxShadow="md"
        >
          <Box background="main" padding={2} borderRadius="md">
            로고
          </Box>
          <_Flex gap={4}>
            <Box background="blackAlpha" padding={2} borderRadius="md">
              메뉴1
            </Box>
            <Box background="blackAlpha" padding={2} borderRadius="md">
              메뉴2
            </Box>
            <Box background="blackAlpha" padding={2} borderRadius="md">
              메뉴3
            </Box>
          </_Flex>
          <Box
            background="main"
            padding={2}
            borderRadius="md"
            color="whiteAlpha"
          >
            로그인
          </Box>
        </_Flex>
      </div>

      <div>
        <h4>카드 레이아웃</h4>
        <_Flex
          direction="column"
          gap={3}
          padding={4}
          background="whiteAlpha"
          borderRadius="lg"
          boxShadow="md"
        >
          <_Flex justify="between" align="center">
            <Box background="main" padding={2} borderRadius="md">
              제목
            </Box>
            <Box background="blackAlpha" padding={1} borderRadius="sm">
              •••
            </Box>
          </_Flex>
          <Box padding={3}>
            카드 컨텐츠 영역입니다. 여기에 다양한 내용이 들어갈 수 있습니다.
          </Box>
          <_Flex justify="end" gap={2}>
            <Box background="blackAlpha" padding={2} borderRadius="md">
              취소
            </Box>
            <Box background="main" padding={2} borderRadius="md">
              확인
            </Box>
          </_Flex>
        </_Flex>
      </div>
    </div>
  ),
};
