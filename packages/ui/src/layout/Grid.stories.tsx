import "@nugudi/react-components-layout/style.css";
import { Grid as _Grid, Box } from "@nugudi/react-components-layout";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof _Grid> = {
  title: "Components/Layout/Grid",
  component: _Grid,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    gap: {
      control: { type: "range", min: 0, max: 24, step: 1 },
    },
    columnGap: {
      control: { type: "range", min: 0, max: 24, step: 1 },
    },
    rowGap: {
      control: { type: "range", min: 0, max: 24, step: 1 },
    },
    templateColumns: {
      control: "text",
    },
    templateRows: {
      control: "text",
    },
    templateAreas: {
      control: "text",
    },
    autoFlow: {
      control: "select",
      options: ["row", "column", "row dense", "column dense"],
    },
    autoColumns: {
      control: "text",
    },
    autoRows: {
      control: "text",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 그리드 레이아웃
export const Default: Story = {
  args: {
    gap: 4,
    templateColumns: "repeat(3, 1fr)",
    padding: 4,
    background: "whiteAlpha",
    borderRadius: "lg",
    style: {
      width: "400px",
    },
  },
  render: (args) => (
    <_Grid {...args}>
      <Box background="main" p="3" borderRadius="md" style={{ color: "white" }}>
        Item 1
      </Box>
      <Box background="zinc" p="3" borderRadius="md" style={{ color: "white" }}>
        Item 2
      </Box>
      <Box
        background="blackAlpha"
        p="3"
        borderRadius="md"
        style={{ color: "white" }}
      >
        Item 3
      </Box>
      <Box background="main" p="3" borderRadius="md" style={{ color: "white" }}>
        Item 4
      </Box>
      <Box background="zinc" p="3" borderRadius="md" style={{ color: "white" }}>
        Item 5
      </Box>
      <Box
        background="blackAlpha"
        p="3"
        borderRadius="md"
        style={{ color: "white" }}
      >
        Item 6
      </Box>
    </_Grid>
  ),
};

// 반응형 컬럼 레이아웃
export const ResponsiveColumns: Story = {
  args: {
    gap: 6,
    templateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
    padding: 4,
    background: "blackAlpha",
    borderRadius: "xl",
    style: {
      width: "500px",
    },
  },
  render: (args) => (
    <_Grid {...args}>
      {[
        "리액트 기초",
        "Next.js 가이드",
        "TypeScript 학습",
        "Tailwind CSS",
        "Node.js 빠른 시작",
        "GraphQL 튜토리얼",
        "Docker 컴테이너",
        "AWS 배포",
      ].map((title) => (
        <Box
          key={title}
          background="blackAlpha"
          p="3"
          borderRadius="md"
          style={{ color: "white", textAlign: "center" }}
        >
          {title}
        </Box>
      ))}
    </_Grid>
  ),
};

// 템플릿 영역을 사용한 레이아웃 (헤더, 사이드바, 메인, 푸터)
export const TemplateAreas: Story = {
  args: {
    gap: 3,
    templateColumns: "200px 1fr",
    templateRows: "60px 1fr 40px",
    templateAreas: `
      "header header"
      "sidebar main"
      "footer footer"
    `,
    padding: 4,
    background: "whiteAlpha",
    borderRadius: "lg",
    style: {
      width: "600px",
      height: "400px",
    },
  },
  render: (args) => (
    <_Grid {...args}>
      <Box
        background="main"
        p="3"
        borderRadius="md"
        style={{ gridArea: "header", color: "white" }}
      >
        헤더
      </Box>
      <Box
        background="zinc"
        p="3"
        borderRadius="md"
        style={{ gridArea: "sidebar", color: "white" }}
      >
        사이드바
      </Box>
      <Box
        background="blackAlpha"
        p="3"
        borderRadius="md"
        style={{ gridArea: "main", color: "white" }}
      >
        메인 콘텐츠 영역
      </Box>
      <Box
        background="whiteAlpha"
        p="3"
        borderRadius="md"
        style={{ gridArea: "footer", color: "black" }}
      >
        푸터
      </Box>
    </_Grid>
  ),
};

// 자동 흐름 방향 설정
export const AutoFlow: Story = {
  args: {
    gap: 4,
    templateColumns: "repeat(3, 100px)",
    autoFlow: "row",
    padding: 4,
    background: "blackAlpha",
    borderRadius: "lg",
    style: {
      width: "400px",
    },
  },
  render: (args) => (
    <_Grid {...args}>
      <Box background="main" p="3" borderRadius="md" style={{ color: "white" }}>
        A
      </Box>
      <Box background="zinc" p="3" borderRadius="md" style={{ color: "white" }}>
        B
      </Box>
      <Box
        background="blackAlpha"
        p="3"
        borderRadius="md"
        style={{ color: "white" }}
      >
        C
      </Box>
      <Box background="main" p="3" borderRadius="md" style={{ color: "white" }}>
        D
      </Box>
      <Box background="zinc" p="3" borderRadius="md" style={{ color: "white" }}>
        E
      </Box>
    </_Grid>
  ),
};

// 간격 설정 변형
export const GapVariations: Story = {
  args: {
    columnGap: 8,
    rowGap: 2,
    templateColumns: "repeat(4, 1fr)",
    padding: 4,
    background: "whiteAlpha",
    borderRadius: "lg",
    style: {
      width: "400px",
    },
  },
  render: (args) => (
    <_Grid {...args}>
      {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
        <Box
          key={num}
          background="blackAlpha"
          p="2"
          borderRadius="sm"
          style={{ color: "white", textAlign: "center" }}
        >
          {num}
        </Box>
      ))}
    </_Grid>
  ),
};

// 카드 레이아웃
export const CardLayout: Story = {
  args: {
    gap: 6,
    templateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
    padding: 6,
    background: "blackAlpha",
    borderRadius: "xl",
    style: {
      width: "600px",
    },
  },
  render: (args) => (
    <_Grid {...args}>
      {[
        { title: "상품 A", price: "29,000원", bg: "main" },
        { title: "상품 B", price: "35,000원", bg: "zinc" },
        { title: "상품 C", price: "42,000원", bg: "blackAlpha" },
        { title: "상품 D", price: "28,000원", bg: "main" },
        { title: "상품 E", price: "39,000원", bg: "zinc" },
        { title: "상품 F", price: "45,000원", bg: "blackAlpha" },
      ].map((product) => (
        <Box
          key={product.title}
          background={product.bg as "main" | "zinc" | "blackAlpha"}
          p="4"
          borderRadius="lg"
          style={{
            color: "white",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            minHeight: "120px",
          }}
        >
          <div style={{ fontWeight: "bold", fontSize: "14px" }}>
            {product.title}
          </div>
          <div style={{ fontSize: "12px", opacity: 0.9 }}>{product.price}</div>
        </Box>
      ))}
    </_Grid>
  ),
};

// 대시보드 레이아웃
export const Dashboard: Story = {
  args: {
    gap: 4,
    templateColumns: "1fr 1fr 1fr",
    templateRows: "auto auto 200px",
    padding: 4,
    background: "whiteAlpha",
    borderRadius: "lg",
    style: {
      width: "600px",
    },
  },
  render: (args) => (
    <_Grid {...args}>
      <Box
        background="main"
        p="4"
        borderRadius="md"
        style={{ gridColumn: "1 / -1", color: "white" }}
      >
        대시보드 헤더
      </Box>
      <Box background="zinc" p="4" borderRadius="md" style={{ color: "white" }}>
        통계 1
      </Box>
      <Box
        background="blackAlpha"
        p="4"
        borderRadius="md"
        style={{ color: "white" }}
      >
        통계 2
      </Box>
      <Box
        background="whiteAlpha"
        p="4"
        borderRadius="md"
        style={{ color: "black" }}
      >
        통계 3
      </Box>
      <Box
        background="blackAlpha"
        p="4"
        borderRadius="md"
        style={{ gridColumn: "1 / -1", color: "white" }}
      >
        차트 영역
      </Box>
    </_Grid>
  ),
};

// 갤러리 레이아웃
export const Gallery: Story = {
  args: {
    gap: 3,
    templateColumns: "repeat(4, 1fr)",
    autoRows: "120px",
    padding: 4,
    background: "blackAlpha",
    borderRadius: "lg",
    style: {
      width: "500px",
    },
  },
  render: (args) => (
    <_Grid {...args}>
      <Box
        background="main"
        borderRadius="md"
        style={{
          gridColumn: "1 / 3",
          gridRow: "1 / 3",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
        }}
      >
        대형 이미지
      </Box>
      <Box
        background="zinc"
        borderRadius="md"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
        }}
      >
        이미지 1
      </Box>
      <Box
        background="blackAlpha"
        borderRadius="md"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
        }}
      >
        이미지 2
      </Box>
      <Box
        background="whiteAlpha"
        borderRadius="md"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "black",
        }}
      >
        이미지 3
      </Box>
      <Box
        background="zinc"
        borderRadius="md"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
        }}
      >
        이미지 4
      </Box>
    </_Grid>
  ),
};
