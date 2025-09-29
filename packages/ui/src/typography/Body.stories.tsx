import "@nugudi/react-components-layout/style.css";
import { Body as _Body } from "@nugudi/react-components-layout";
import { COLOR_SHADES, classes, vars } from "@nugudi/themes";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof _Body> = {
  title: "Typography/Body",
  component: _Body,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Body는 본문 텍스트를 표시하기 위한 타이포그래피 컴포넌트입니다.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    as: {
      control: "select",
      options: ["span", "p", "div", "h1", "h2", "h3", "h4", "h5", "h6"],
      description: "렌더링할 HTML 요소를 지정합니다",
      table: {
        type: { summary: "keyof JSX.IntrinsicElements" },
        defaultValue: { summary: "span" },
        category: "Element",
      },
    },
    fontSize: {
      control: "select",
      options: Object.keys(classes.typography.body),
      description: "텍스트의 크기를 설정합니다",
      table: {
        type: { summary: "keyof typeof classes.typography.body" },
        category: "Typography",
      },
    },
    color: {
      control: "select",
      options: Object.keys(vars.colors.$scale),
      description: "텍스트 색상을 설정합니다",
      table: {
        type: { summary: "keyof typeof vars.colors.$scale" },
        defaultValue: { summary: "zinc" },
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
        defaultValue: { summary: "600" },
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
      description: "표시할 텍스트 내용",
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
    children: "다람쥐 헌 쳇바퀴에 타고파",
    fontSize: "b1",
    color: "zinc",
    colorShade: 600,
    as: "span",
    textAlign: "left",
  },
};

export const SizeVariations: Story = {
  render: () => {
    const sizes = Object.keys(
      classes.typography.body,
    ) as (keyof typeof classes.typography.body)[];

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {sizes.map((size) => (
          <_Body key={size} fontSize={size}>
            다람쥐 헌 쳇바퀴에 타고파
          </_Body>
        ))}
      </div>
    );
  },
};

export const ZincVariations: Story = {
  render: () => {
    const shades = [...COLOR_SHADES].reverse();

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {shades.map((shade) => (
          <_Body key={shade} fontSize="b1" colorShade={shade}>
            다람쥐 헌 쳇바퀴에 타고파
          </_Body>
        ))}
      </div>
    );
  },
};

export const TextAlignVariations: Story = {
  render: () => {
    const alignments = [
      "left",
      "center",
      "right",
      "justify",
      "start",
      "end",
    ] as const;

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          width: "400px",
        }}
      >
        {alignments.map((align) => (
          <div
            key={align}
            style={{ border: "1px solid #e5e5e5", padding: "1rem" }}
          >
            <_Body
              fontSize="b4b"
              colorShade={400}
              textAlign={align}
              style={{ display: "block", marginBottom: "0.5rem" }}
            >
              textAlign: {align}
            </_Body>
            <_Body fontSize="b2" textAlign={align} as="p" style={{ margin: 0 }}>
              다람쥐 헌 쳇바퀴에 타고파. 이 문장은 한글 타이포그래피를
              테스트하기 위한 예시 문장입니다. 텍스트 정렬이 어떻게 적용되는지
              확인할 수 있습니다.
            </_Body>
          </div>
        ))}
      </div>
    );
  },
};
