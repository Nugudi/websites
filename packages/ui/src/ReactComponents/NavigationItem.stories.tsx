import "@nugudi/react-components-navigation-item/style.css";
import { ArrowRightIcon, BusIcon } from "@nugudi/assets-icons";
import { Flex } from "@nugudi/react-components-layout";
import { NavigationItem as _NavigationItem } from "@nugudi/react-components-navigation-item";
import { classes, vars } from "@nugudi/themes";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof _NavigationItem> = {
  title: "Components/NavigationItem",
  component: _NavigationItem,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "네비게이션 메뉴에 사용되는 컴포넌트입니다.",
      },
    },
  },
  argTypes: {
    children: {
      control: "text",
      table: {
        type: { summary: "ReactNode" },
        category: "Basic",
      },
    },
    leftIcon: {
      control: "text",
      table: {
        type: { summary: "ReactNode" },
        category: "Icons",
      },
    },
    rightIcon: {
      control: "text",
      table: {
        type: { summary: "ReactNode" },
        category: "Icons",
      },
    },
    disabled: {
      control: "boolean",
      defaultValue: false,
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
        category: "State",
      },
    },
    size: {
      options: ["sm", "md", "lg"],
      control: "select",
      defaultValue: "md",
      table: {
        type: { summary: "sm | md | lg" },
        defaultValue: { summary: "md" },
        category: "Appearance",
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    size: "md",
    children: "알림 설정",
  },
};

export const Large: Story = {
  args: {
    size: "lg",
    leftIcon: <BusIcon />,
    children: (
      <Flex direction="column" gap="2">
        <span
          style={{
            ...classes.typography.body.b3b,
            color: vars.colors.$scale.zinc[800],
          }}
        >
          구디 구내식당 투어
        </span>
        <span
          style={{
            ...classes.typography.emphasis.e1,
            color: vars.colors.$scale.zinc[500],
          }}
        >
          제일 빠르게 올리고 10 포인트 받기
        </span>
      </Flex>
    ),
  },
};

export const Disabled: Story = {
  args: {
    children: "알림 설정",
    rightIcon: <ArrowRightIcon />,
    disabled: true,
    size: "md",
  },
};

export const WithLink: Story = {
  render: () => (
    <a href="/settings" style={{ textDecoration: "none" }}>
      <_NavigationItem leftIcon={<BusIcon />} rightIcon={<ArrowRightIcon />}>
        Link로 감싸서 사용
      </_NavigationItem>
    </a>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        width: "300px",
      }}
    >
      <_NavigationItem
        leftIcon={<BusIcon />}
        rightIcon={<ArrowRightIcon />}
        size="sm"
      >
        Small Navigation Item
      </_NavigationItem>
      <_NavigationItem
        leftIcon={<BusIcon />}
        rightIcon={<ArrowRightIcon />}
        size="md"
      >
        Medium Navigation Item
      </_NavigationItem>
      <_NavigationItem
        leftIcon={<BusIcon />}
        rightIcon={<ArrowRightIcon />}
        size="lg"
      >
        Large Navigation Item
      </_NavigationItem>
    </div>
  ),
};
