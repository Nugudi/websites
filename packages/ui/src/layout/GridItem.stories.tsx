import "@nugudi/react-components-layout/style.css";
import { Box, Grid, GridItem } from "@nugudi/react-components-layout";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Components/Layout/GridItem",
  component: GridItem,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    area: {
      control: "text",
      description: "grid-area 속성 값 (예: 'header', 'sidebar', 'content')",
    },
    colEnd: {
      control: { type: "number", min: 1, max: 13 },
      description: "grid-column-end 속성 값",
    },
    colStart: {
      control: { type: "number", min: 1, max: 13 },
      description: "grid-column-start 속성 값",
    },
    colSpan: {
      control: { type: "number", min: 1, max: 12 },
      description: "grid-column span 값",
    },
    rowEnd: {
      control: { type: "number", min: 1, max: 13 },
      description: "grid-row-end 속성 값",
    },
    rowStart: {
      control: { type: "number", min: 1, max: 13 },
      description: "grid-row-start 속성 값",
    },
    rowSpan: {
      control: { type: "number", min: 1, max: 12 },
      description: "grid-row span 값",
    },
  },
} satisfies Meta<typeof GridItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  render: (args) => (
    <Grid
      templateColumns="repeat(3, 1fr)"
      gap={16}
      p={16}
      background="whiteAlpha"
      borderRadius="lg"
      style={{ width: "400px" }}
    >
      <GridItem {...args}>
        <Box
          background="main"
          p={12}
          borderRadius="md"
          style={{ color: "white" }}
        >
          Item 1
        </Box>
      </GridItem>
      <GridItem {...args}>
        <Box
          background="zinc"
          p={12}
          borderRadius="md"
          style={{ color: "white" }}
        >
          Item 2
        </Box>
      </GridItem>
      <GridItem {...args}>
        <Box
          background="blackAlpha"
          p={12}
          borderRadius="md"
          style={{ color: "white" }}
        >
          Item 3
        </Box>
      </GridItem>
    </Grid>
  ),
};

export const ColumnSpan: Story = {
  args: {},
  render: () => (
    <Grid
      templateColumns="repeat(4, 1fr)"
      gap={16}
      p={16}
      background="blackAlpha"
      borderRadius="lg"
      style={{ width: "500px" }}
    >
      <GridItem colSpan={2}>
        <Box
          background="main"
          p={12}
          borderRadius="md"
          style={{ color: "white" }}
        >
          2 칸 차지
        </Box>
      </GridItem>
      <GridItem>
        <Box
          background="zinc"
          p={12}
          borderRadius="md"
          style={{ color: "white" }}
        >
          1 칸
        </Box>
      </GridItem>
      <GridItem>
        <Box
          background="whiteAlpha"
          p={12}
          borderRadius="md"
          style={{ color: "black" }}
        >
          1 칸
        </Box>
      </GridItem>
      <GridItem colSpan={3}>
        <Box
          background="blackAlpha"
          p={12}
          borderRadius="md"
          style={{ color: "white" }}
        >
          3 칸 차지
        </Box>
      </GridItem>
      <GridItem>
        <Box
          background="main"
          p={12}
          borderRadius="md"
          style={{ color: "white" }}
        >
          1 칸
        </Box>
      </GridItem>
    </Grid>
  ),
};

export const RowSpan: Story = {
  args: {},
  render: () => (
    <Grid
      templateColumns="repeat(3, 1fr)"
      templateRows="repeat(3, 100px)"
      gap={16}
      p={16}
      background="whiteAlpha"
      borderRadius="lg"
      style={{ width: "400px" }}
    >
      <GridItem rowSpan={2}>
        <Box
          background="main"
          p={12}
          borderRadius="md"
          style={{ color: "white", height: "100%" }}
        >
          2 행 차지
        </Box>
      </GridItem>
      <GridItem>
        <Box
          background="zinc"
          p={12}
          borderRadius="md"
          style={{ color: "white" }}
        >
          일반 아이템
        </Box>
      </GridItem>
      <GridItem>
        <Box
          background="blackAlpha"
          p={12}
          borderRadius="md"
          style={{ color: "white" }}
        >
          일반 아이템
        </Box>
      </GridItem>
      <GridItem>
        <Box
          background="whiteAlpha"
          p={12}
          borderRadius="md"
          style={{ color: "black" }}
        >
          일반 아이템
        </Box>
      </GridItem>
      <GridItem>
        <Box
          background="zinc"
          p={12}
          borderRadius="md"
          style={{ color: "white" }}
        >
          일반 아이템
        </Box>
      </GridItem>
      <GridItem colSpan={2}>
        <Box
          background="main"
          p={12}
          borderRadius="md"
          style={{ color: "white" }}
        >
          2 칸 차지
        </Box>
      </GridItem>
      <GridItem>
        <Box
          background="blackAlpha"
          p={12}
          borderRadius="md"
          style={{ color: "white" }}
        >
          일반 아이템
        </Box>
      </GridItem>
    </Grid>
  ),
};

export const GridArea: Story = {
  args: {},
  render: () => (
    <Grid
      templateColumns="1fr 2fr 1fr"
      templateRows="60px 1fr 40px"
      templateAreas={`
        "header header header"
        "sidebar content aside"
        "footer footer footer"
      `}
      gap={12}
      p={16}
      background="blackAlpha"
      borderRadius="lg"
      style={{ width: "600px", height: "400px" }}
    >
      <GridItem area="header">
        <Box
          background="main"
          p={12}
          borderRadius="md"
          style={{ color: "white", height: "100%" }}
        >
          헤더 영역
        </Box>
      </GridItem>
      <GridItem area="sidebar">
        <Box
          background="zinc"
          p={12}
          borderRadius="md"
          style={{ color: "white", height: "100%" }}
        >
          사이드바
        </Box>
      </GridItem>
      <GridItem area="content">
        <Box
          background="blackAlpha"
          p={12}
          borderRadius="md"
          style={{ color: "white", height: "100%" }}
        >
          메인 콘텐츠
        </Box>
      </GridItem>
      <GridItem area="aside">
        <Box
          background="whiteAlpha"
          p={12}
          borderRadius="md"
          style={{ color: "black", height: "100%" }}
        >
          사이드 정보
        </Box>
      </GridItem>
      <GridItem area="footer">
        <Box
          background="main"
          p={12}
          borderRadius="md"
          style={{ color: "white", height: "100%" }}
        >
          푸터 영역
        </Box>
      </GridItem>
    </Grid>
  ),
};

export const DashboardWidgets: Story = {
  args: {},
  render: () => (
    <Grid
      templateColumns="repeat(4, 1fr)"
      templateRows="repeat(3, 120px)"
      gap={16}
      p={16}
      background="whiteAlpha"
      borderRadius="lg"
      style={{ width: "600px" }}
    >
      <GridItem colSpan={2} rowSpan={2}>
        <Box
          background="main"
          p={16}
          borderRadius="lg"
          style={{ color: "white", height: "100%" }}
        >
          <h3>매출 차트</h3>
          <p style={{ fontSize: "24px", marginTop: "16px" }}>₩1,234,567</p>
        </Box>
      </GridItem>
      <GridItem>
        <Box
          background="zinc"
          p={12}
          borderRadius="lg"
          style={{ color: "white", height: "100%" }}
        >
          <h4>방문자</h4>
          <p style={{ fontSize: "20px", marginTop: "8px" }}>1,234</p>
        </Box>
      </GridItem>
      <GridItem>
        <Box
          background="blackAlpha"
          p={12}
          borderRadius="lg"
          style={{ color: "white", height: "100%" }}
        >
          <h4>전환율</h4>
          <p style={{ fontSize: "20px", marginTop: "8px" }}>3.4%</p>
        </Box>
      </GridItem>
      <GridItem>
        <Box
          background="whiteAlpha"
          p={12}
          borderRadius="lg"
          style={{ color: "black", height: "100%" }}
        >
          <h4>페이지뷰</h4>
          <p style={{ fontSize: "20px", marginTop: "8px" }}>5,678</p>
        </Box>
      </GridItem>
      <GridItem>
        <Box
          background="main"
          p={12}
          borderRadius="lg"
          style={{ color: "white", height: "100%" }}
        >
          <h4>신규 가입</h4>
          <p style={{ fontSize: "20px", marginTop: "8px" }}>89</p>
        </Box>
      </GridItem>
      <GridItem colSpan={4}>
        <Box
          background="blackAlpha"
          p={16}
          borderRadius="lg"
          style={{ color: "white", height: "100%" }}
        >
          <h3>최근 활동 로그</h3>
        </Box>
      </GridItem>
    </Grid>
  ),
};

export const PhotoGallery: Story = {
  args: {},
  render: () => (
    <Grid
      templateColumns="repeat(4, 1fr)"
      templateRows="repeat(4, 100px)"
      gap={12}
      p={16}
      background="blackAlpha"
      borderRadius="lg"
      style={{ width: "500px" }}
    >
      <GridItem colSpan={2} rowSpan={2}>
        <Box
          background="main"
          borderRadius="md"
          style={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: "18px",
          }}
        >
          대형 이미지
        </Box>
      </GridItem>
      <GridItem>
        <Box
          background="zinc"
          borderRadius="md"
          style={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
          }}
        >
          이미지 1
        </Box>
      </GridItem>
      <GridItem>
        <Box
          background="whiteAlpha"
          borderRadius="md"
          style={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "black",
          }}
        >
          이미지 2
        </Box>
      </GridItem>
      <GridItem>
        <Box
          background="blackAlpha"
          borderRadius="md"
          style={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
          }}
        >
          이미지 3
        </Box>
      </GridItem>
      <GridItem>
        <Box
          background="main"
          borderRadius="md"
          style={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
          }}
        >
          이미지 4
        </Box>
      </GridItem>
      <GridItem colSpan={3}>
        <Box
          background="zinc"
          borderRadius="md"
          style={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
          }}
        >
          와이드 이미지
        </Box>
      </GridItem>
      <GridItem rowSpan={2}>
        <Box
          background="blackAlpha"
          borderRadius="md"
          style={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
          }}
        >
          세로 이미지
        </Box>
      </GridItem>
      <GridItem>
        <Box
          background="whiteAlpha"
          borderRadius="md"
          style={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "black",
          }}
        >
          이미지 5
        </Box>
      </GridItem>
      <GridItem>
        <Box
          background="main"
          borderRadius="md"
          style={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
          }}
        >
          이미지 6
        </Box>
      </GridItem>
      <GridItem>
        <Box
          background="zinc"
          borderRadius="md"
          style={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
          }}
        >
          이미지 7
        </Box>
      </GridItem>
    </Grid>
  ),
};

export const ComplexLayout: Story = {
  args: {},
  render: () => (
    <Grid
      templateColumns="repeat(6, 1fr)"
      templateRows="repeat(4, 80px)"
      gap={12}
      p={16}
      background="whiteAlpha"
      borderRadius="lg"
      style={{ width: "600px" }}
    >
      <GridItem colStart="1" colEnd="4" rowStart="1" rowEnd="3">
        <Box
          background="main"
          p={16}
          borderRadius="lg"
          style={{ color: "white", height: "100%" }}
        >
          메인 콘텐츠 영역
        </Box>
      </GridItem>
      <GridItem colStart="4" colEnd="7" rowStart="1" rowEnd="2">
        <Box
          background="zinc"
          p={12}
          borderRadius="lg"
          style={{ color: "white", height: "100%" }}
        >
          상단 사이드바
        </Box>
      </GridItem>
      <GridItem colStart="4" colEnd="6" rowStart="2" rowEnd="3">
        <Box
          background="blackAlpha"
          p={12}
          borderRadius="lg"
          style={{ color: "white", height: "100%" }}
        >
          위젯 1
        </Box>
      </GridItem>
      <GridItem colStart="6" colEnd="7" rowStart="2" rowEnd="4">
        <Box
          background="whiteAlpha"
          p={12}
          borderRadius="lg"
          style={{ color: "black", height: "100%" }}
        >
          세로 위젯
        </Box>
      </GridItem>
      <GridItem colStart="1" colEnd="3" rowStart="3" rowEnd="5">
        <Box
          background="zinc"
          p={12}
          borderRadius="lg"
          style={{ color: "white", height: "100%" }}
        >
          하단 왼쪽
        </Box>
      </GridItem>
      <GridItem colStart="3" colEnd="5" rowStart="3" rowEnd="4">
        <Box
          background="main"
          p={12}
          borderRadius="lg"
          style={{ color: "white", height: "100%" }}
        >
          하단 중앙
        </Box>
      </GridItem>
      <GridItem colStart="5" colEnd="6" rowStart="3" rowEnd="4">
        <Box
          background="blackAlpha"
          p={12}
          borderRadius="lg"
          style={{ color: "white", height: "100%" }}
        >
          작은 위젯
        </Box>
      </GridItem>
      <GridItem colStart="3" colEnd="7" rowStart="4" rowEnd="5">
        <Box
          background="whiteAlpha"
          p={12}
          borderRadius="lg"
          style={{ color: "black", height: "100%" }}
        >
          하단 푸터 영역
        </Box>
      </GridItem>
    </Grid>
  ),
};
