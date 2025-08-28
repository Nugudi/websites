import "@nugudi/react-components-badge/style.css";
import { Badge as _Badge } from "@nugudi/react-components-badge";
import { SemanticTones, SemanticVariants } from "@nugudi/themes";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof _Badge> = {
  title: "Components/Badge",
  component: _Badge,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Badge는 객체의 속성이나 상태를 시각적으로 표현하는 작은 텍스트 라벨입니다. 사용자의 주의를 끌고 콘텐츠의 빠른 인지와 탐색을 돕기 위해 사용됩니다.",
      },
    },
  },
  argTypes: {
    children: {
      control: "text",
      description: "Badge 내용",
      table: {
        type: { summary: "React.ReactNode" },
        category: "Content",
      },
    },
    tone: {
      control: "select",
      options: Object.values(SemanticTones),
      description: "Badge의 톤 (색상 테마)",
      table: {
        type: { summary: "SemanticTone" },
        defaultValue: { summary: "neutral" },
        category: "Appearance",
      },
    },
    variant: {
      control: "select",
      options: Object.values(SemanticVariants),
      description: "Badge 스타일 변형",
      table: {
        type: { summary: "SemanticVariant" },
        defaultValue: { summary: "weak" },
        category: "Appearance",
      },
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Badge 크기",
      table: {
        type: { summary: "BadgeSize" },
        defaultValue: { summary: "sm" },
        category: "Appearance",
      },
    },
    icon: {
      control: "text",
      description: "Badge 앞에 표시될 아이콘",
      table: {
        type: { summary: "React.ReactNode" },
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
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "라벨",
  },
};

export const WithIcon: Story = {
  args: {
    children: "맛있어요",
    icon: "😊",
  },
};

export const PositiveTone: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}
    >
      <_Badge tone="positive" variant="solid">
        라벨
      </_Badge>
      <_Badge tone="positive" variant="weak">
        라벨
      </_Badge>
      <_Badge tone="positive" variant="outline">
        라벨
      </_Badge>
    </div>
  ),
};

export const NeutralTone: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}
    >
      <_Badge tone="neutral" variant="solid">
        라벨
      </_Badge>
      <_Badge tone="neutral" variant="weak">
        라벨
      </_Badge>
      <_Badge tone="neutral" variant="outline">
        라벨
      </_Badge>
    </div>
  ),
};

export const InformativeTone: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}
    >
      <_Badge tone="informative" variant="solid">
        라벨
      </_Badge>
      <_Badge tone="informative" variant="weak">
        라벨
      </_Badge>
      <_Badge tone="informative" variant="outline">
        라벨
      </_Badge>
    </div>
  ),
};

export const NegativeTone: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <_Badge tone="negative" variant="solid">
        라벨
      </_Badge>
      <_Badge tone="negative" variant="weak">
        라벨
      </_Badge>
      <_Badge tone="negative" variant="outline">
        라벨
      </_Badge>
    </div>
  ),
};

export const WarningTone: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <_Badge tone="warning" variant="solid">
        경고
      </_Badge>
      <_Badge tone="warning" variant="weak">
        경고
      </_Badge>
      <_Badge tone="warning" variant="outline">
        경고
      </_Badge>
    </div>
  ),
};

export const PurpleTone: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <_Badge tone="purple" variant="solid">
        라벨
      </_Badge>
      <_Badge tone="purple" variant="weak">
        라벨
      </_Badge>
      <_Badge tone="purple" variant="outline">
        라벨
      </_Badge>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
      <_Badge size="sm" tone="positive">
        라벨
      </_Badge>
      <_Badge size="md" tone="positive">
        라벨
      </_Badge>
      <_Badge size="lg" tone="positive">
        라벨
      </_Badge>
    </div>
  ),
};

export const AllToneVariations: Story = {
  name: "All Tones & Variants",
  render: () => {
    const tones = Object.values(SemanticTones);
    const variants = Object.values(SemanticVariants);

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {tones.map((tone) => (
          <div key={tone}>
            <h4 style={{ margin: "0 0 8px 0", textTransform: "capitalize" }}>
              {tone}
            </h4>
            <div style={{ display: "flex", gap: "8px" }}>
              {variants.map((variant) => (
                <_Badge key={variant} tone={tone} variant={variant}>
                  {variant}
                </_Badge>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  },
};
