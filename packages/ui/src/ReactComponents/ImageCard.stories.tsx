import { ImageCard as _ImageCard } from "@nugudi/react-components-image-card";
import { Box } from "@nugudi/react-components-layout";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof _ImageCard> = {
  title: "Components/ImageCard",
  component: _ImageCard,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "이미지를 표시하는 기본 카드 컴포넌트입니다. img 또는 div 엘리먼트로 렌더링할 수 있습니다.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    as: {
      control: "select",
      options: ["img", "div"],
      description: "렌더링할 HTML 엘리먼트 타입을 지정합니다",
      table: {
        type: { summary: '"img" | "div" | ElementType' },
        defaultValue: { summary: '"img"' },
        category: "Props",
      },
    },
    src: {
      control: "text",
      description: "표시할 이미지의 URL 경로",
      table: {
        type: { summary: "string" },
        category: "Props",
      },
    },
    alt: {
      control: "text",
      description: "이미지를 설명하는 대체 텍스트 (웹 접근성 필수)",
      table: {
        type: { summary: "string" },
        category: "Props",
      },
    },
    className: {
      control: "text",
      description: "커스텀 스타일링을 위한 추가 CSS 클래스명",
      table: {
        type: { summary: "string" },
        category: "Styling",
      },
    },
    style: {
      control: "object",
      description: "인라인 스타일 객체",
      table: {
        type: { summary: "React.CSSProperties" },
        category: "Styling",
      },
    },
    width: {
      control: "text",
      description: "이미지 너비 (px, %, auto 등)",
      table: {
        type: { summary: "string | number" },
        category: "Size",
      },
    },
    height: {
      control: "text",
      description: "이미지 높이 (px, %, auto 등)",
      table: {
        type: { summary: "string | number" },
        category: "Size",
      },
    },
    loading: {
      control: "select",
      options: ["eager", "lazy"],
      description: "이미지 로딩 전략",
      table: {
        type: { summary: '"eager" | "lazy"' },
        defaultValue: { summary: '"eager"' },
        category: "Performance",
      },
    },
    onClick: {
      action: "clicked",
      description: "이미지 클릭 시 실행될 이벤트 핸들러",
      table: {
        type: { summary: "() => void" },
        category: "Events",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    as: "img",
    src: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500",
    alt: "Food image",
    style: {
      width: "300px",
      height: "200px",
      objectFit: "cover",
      borderRadius: "8px",
    },
  },
};

export const Square: Story = {
  args: {
    as: "img",
    src: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500",
    alt: "Salad",
    width: "200px",
    height: "200px",
    style: {
      objectFit: "cover",
      borderRadius: "12px",
    },
  },
};

export const Wide: Story = {
  args: {
    as: "img",
    src: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500",
    alt: "Burger",
    width: "400px",
    height: "200px",
    style: {
      objectFit: "cover",
      borderRadius: "16px",
    },
  },
};

export const RoundedFullImage: Story = {
  render: () => (
    <_ImageCard
      as="img"
      src="https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=500"
      alt="Pizza"
      width="200px"
      height="200px"
      style={{
        objectFit: "cover",
        borderRadius: "50%",
      }}
    />
  ),
};

export const Responsive: Story = {
  render: () => (
    <Box style={{ width: "100%", maxWidth: "500px" }}>
      <_ImageCard
        as="img"
        src="https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800"
        alt="Responsive food image"
        width="100%"
        height="auto"
        style={{
          aspectRatio: "16/9",
          objectFit: "cover",
          borderRadius: "12px",
        }}
      />
    </Box>
  ),
};
