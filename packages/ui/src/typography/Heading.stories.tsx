import "@nugudi/react-components-layout/style.css";
import { Heading as _Heading } from "@nugudi/react-components-layout";
import { COLOR_SHADES, classes, vars } from "@nugudi/themes";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof _Heading> = {
  title: "Typography/Heading",
  component: _Heading,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Heading은 제목과 헤딩을 표시하기 위한 타이포그래피 컴포넌트입니다.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    as: {
      control: "select",
      options: ["h1", "h2", "h3", "h4", "h5", "h6"],
      description: "렌더링할 HTML 헤딩 요소를 지정합니다",
      table: {
        type: { summary: "h1 | h2 | h3 | h4 | h5 | h6" },
        category: "Element",
      },
    },
    fontSize: {
      control: "select",
      options: Object.keys(classes.typography.heading),
      description: "헤딩 텍스트의 크기를 설정합니다",
      table: {
        type: { summary: "keyof typeof classes.typography.heading" },
        category: "Typography",
      },
    },
    color: {
      control: "select",
      options: Object.keys(vars.colors.$scale),
      description: "헤딩 텍스트 색상을 설정합니다",
      table: {
        type: { summary: "keyof typeof vars.colors.$scale" },
        category: "Color",
      },
    },
    colorShade: {
      control: "select",
      options: COLOR_SHADES,
      description: "색상의 명도를 설정합니다",
      table: {
        type: {
          summary: COLOR_SHADES.join(" | "),
        },
        category: "Color",
      },
    },
    children: {
      control: "text",
      description: "표시할 헤딩 텍스트 내용",
      table: {
        type: { summary: "ReactNode" },
        category: "Content",
      },
    },
    className: {
      control: "text",
      description: "추가 CSS 클래스",
      table: {
        type: { summary: "string" },
        category: "Styling",
      },
    },
    style: {
      description: "인라인 스타일 객체",
      table: {
        type: { summary: "CSSProperties" },
        category: "Styling",
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    as: "h1",
    children: "다람쥐 헌 쳇바퀴에 타고파",
    fontSize: "h1",
    color: "zinc",
    colorShade: 800,
  },
};

export const AllColorShades: Story = {
  render: () => {
    const shades = [...COLOR_SHADES].reverse();

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {shades.map((shade) => (
          <_Heading key={shade} fontSize="h1" colorShade={shade}>
            다람쥐 헌 쳇바퀴에 타고파
          </_Heading>
        ))}
      </div>
    );
  },
};
