import "@nugudi/react-components-layout/style.css";
import { Emphasis as _Emphasis } from "@nugudi/react-components-layout";
import { COLOR_SHADES, classes, vars } from "@nugudi/themes";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof _Emphasis> = {
  title: "Typography/Emphasis",
  component: _Emphasis,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Emphasis는 강조 텍스트를 표시하기 위한 타이포그래피 컴포넌트입니다.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    as: {
      control: "select",
      options: ["em", "strong", "span", "p", "div"],
      description: "렌더링할 HTML 요소를 지정합니다",
      table: {
        type: { summary: "keyof JSX.IntrinsicElements" },
        category: "Element",
      },
    },
    fontSize: {
      control: "select",
      options: Object.keys(classes.typography.emphasis),
      description: "강조 텍스트의 크기를 설정합니다",
      table: {
        type: { summary: "keyof typeof classes.typography.emphasis" },
        category: "Typography",
      },
    },
    color: {
      control: "select",
      options: Object.keys(vars.colors.$scale),
      description: "강조 텍스트 색상을 설정합니다",
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
    textAlign: {
      control: "select",
      options: ["left", "center", "right", "justify", "start", "end"],
      description: "텍스트 정렬을 설정합니다",
      defaultValue: { summary: "left" },
      table: {
        type: {
          summary: '"left" | "center" | "right" | "justify" | "start" | "end"',
        },
        category: "Typography",
      },
    },
    children: {
      control: "text",
      description: "표시할 강조 텍스트 내용",
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
    as: "em",
    children: "다람쥐 헌 쳇바퀴에 타고파",
    fontSize: "e1",
    color: "zinc",
    colorShade: 600,
    textAlign: "left",
  },
};

export const SizeVariations: Story = {
  render: () => {
    const sizes = Object.keys(
      classes.typography.emphasis,
    ) as (keyof typeof classes.typography.emphasis)[];

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {sizes.map((size) => (
          <_Emphasis key={size} fontSize={size} as="p">
            다람쥐 헌 쳇바퀴에 타고파
          </_Emphasis>
        ))}
      </div>
    );
  },
};
