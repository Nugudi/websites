import type { Meta, StoryObj } from "@storybook/react-vite";
import { Typography } from "./index";

const sizeOptions = [
  "h1",
  "t1",
  "t2",
  "t3",
  "b1",
  "b2",
  "b3",
  "b3b",
  "b4",
  "b4b",
  "e1",
  "e2",
  "l1",
  "l2",
] as const;

const colorOptions = [
  "main-500",
  "main-800",
  "zinc-50",
  "zinc-100",
  "zinc-200",
  "zinc-300",
  "zinc-400",
  "zinc-500",
  "zinc-600",
  "zinc-700",
  "zinc-800",
  "error",
  "white",
  "black",
] as const;

const meta: Meta<typeof Typography> = {
  title: "Components/Typography",
  component: Typography,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: { type: "select" },
      options: sizeOptions,
    },
    color: {
      control: { type: "select" },
      options: colorOptions,
    },
    as: {
      control: { type: "text" },
    },
    children: {
      control: { type: "text" },
    },
    className: {
      control: { type: "text" },
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    size: "b1",
    children: "이것은 기본 Typography 컴포넌트입니다.",
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="space-y-4">
      <Typography size="h1">h1 - 헤드라인 (30px)</Typography>
      <Typography size="t1">t1 - 제목1 (28px)</Typography>
      <Typography size="t2">t2 - 제목2 (22px)</Typography>
      <Typography size="t3">t3 - 제목3 (20px)</Typography>
      <Typography size="b1">b1 - 본문 (17px)</Typography>
      <Typography size="b2">b2 - 콜아웃 (16px)</Typography>
      <Typography size="b3">b3 - 서브헤드라인 (15px)</Typography>
      <Typography size="b3b">b3b - 서브헤드라인 Bold (15px)</Typography>
      <Typography size="b4">b4 - 각주 (13px)</Typography>
      <Typography size="b4b">b4b - 각주 Bold (13px)</Typography>
      <Typography size="e1">e1 - 캡션1 (12px)</Typography>
      <Typography size="e2">e2 - 캡션2 (11px)</Typography>
      <Typography size="l1">l1 - 로고 Large (34px)</Typography>
      <Typography size="l2">l2 - 로고 Title (20px)</Typography>
    </div>
  ),
};

export const ColorExamples: Story = {
  render: () => {
    return (
      <div className="space-y-2">
        {colorOptions.map((color) => (
          <Typography key={color} size="b1" color={color}>
            {color} 컬러 예시
          </Typography>
        ))}
        {/* 커스텀 컬러 유틸리티 string 예시 */}
        <Typography size="b1" className="text-blue-600">
          text-blue-600 커스텀 유틸리티 예시
        </Typography>
      </div>
    );
  },
};

export const PolymorphicExample: Story = {
  render: () => (
    <div className="space-y-4">
      <Typography size="t1" as="h1">
        h1 태그로 렌더링된 t1 스타일
      </Typography>
      <Typography size="b1" as="span">
        span 태그로 렌더링된 b1 스타일
      </Typography>
      <Typography size="b3" as="div">
        div 태그로 렌더링된 b3 스타일
      </Typography>
      <Typography
        size="e1"
        as="button"
        className="cursor-pointer hover:text-main-500"
      >
        button 태그로 렌더링된 e1 스타일
      </Typography>
    </div>
  ),
};

export const CustomStyling: Story = {
  render: () => (
    <div className="space-y-4">
      <Typography size="t1" className="text-blue-600">
        파란색 t1 텍스트
      </Typography>
      <Typography size="b1" className="text-red-500 underline">
        빨간색이고 밑줄이 있는 b1 텍스트
      </Typography>
      <Typography size="b3b" className="rounded bg-yellow-100 p-2">
        배경색이 있는 b3b 텍스트
      </Typography>
    </div>
  ),
};
