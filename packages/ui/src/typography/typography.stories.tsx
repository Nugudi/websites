import type { Meta, StoryObj } from "@storybook/react-vite";
import { Typography } from "./index";

const meta: Meta<typeof Typography> = {
  title: "Components/Typography",
  component: Typography,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: { type: "select" },
      options: [
        "H1",
        "T1",
        "T2",
        "T3",
        "B1",
        "B2",
        "B3",
        "B3-BOLD",
        "B4",
        "B4-BOLD",
        "E1",
        "E2",
      ],
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
} satisfies Meta<typeof Typography>;

export default meta;

type Story = StoryObj<typeof meta>;

// 기본 스토리
export const Default: Story = {
  args: {
    variant: "B1",
    children: "이것은 기본 Typography 컴포넌트입니다.",
  },
};

// 모든 Variant를 보여주는 스토리
export const AllVariants: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <Typography variant="H1">H1 - 메인 헤더 (30px)</Typography>
        <Typography variant="H1" as="p" className="mt-1 text-gray-500 text-sm">
          H1 large Title - Semibold 30px
        </Typography>
      </div>

      <div>
        <Typography variant="T1">T1 - 제목1 (28px)</Typography>
        <Typography variant="B4" className="mt-1 text-gray-500">
          Title1 - Semibold 28px
        </Typography>
      </div>

      <div>
        <Typography variant="T2">T2 - 제목2 (22px)</Typography>
        <Typography variant="B4" className="mt-1 text-gray-500">
          Title2 - Medium 22px
        </Typography>
      </div>

      <div>
        <Typography variant="T3">T3 - 제목3 (20px)</Typography>
        <Typography variant="B4" className="mt-1 text-gray-500">
          Title3 - Bold 20px
        </Typography>
      </div>

      <div>
        <Typography variant="B1">B1 - 본문 텍스트 (17px)</Typography>
        <Typography variant="B4" className="mt-1 text-gray-500">
          Body1 Regular - 17px
        </Typography>
      </div>

      <div>
        <Typography variant="B2">B2 - 콜아웃 텍스트 (16px)</Typography>
        <Typography variant="B4" className="mt-1 text-gray-500">
          Body2 Regular - 16px
        </Typography>
      </div>

      <div>
        <Typography variant="B3">B3 - 서브헤드라인 (15px)</Typography>
        <Typography variant="B4" className="mt-1 text-gray-500">
          Subheadline Regular - 15px
        </Typography>
      </div>

      <div>
        <Typography variant="B3-BOLD">
          B3B - 서브헤드라인 Bold (15px)
        </Typography>
        <Typography variant="B4" className="mt-1 text-gray-500">
          Subheadline Semibold - 15px
        </Typography>
      </div>

      <div>
        <Typography variant="B4">B4 - 각주 텍스트 (13px)</Typography>
        <Typography variant="B4" className="mt-1 text-gray-500">
          Footnote Regular - 13px
        </Typography>
      </div>

      <div>
        <Typography variant="B4-BOLD">B4-BOLD - 각주 Bold (13px)</Typography>
        <Typography variant="B4" className="mt-1 text-gray-500">
          Footnote Semibold - 13px
        </Typography>
      </div>

      <div>
        <Typography variant="E1">E1 - 캡션1 (12px)</Typography>
        <Typography variant="B4" className="mt-1 text-gray-500">
          Caption1 Regular - 12px
        </Typography>
      </div>

      <div>
        <Typography variant="E2">E2 - 캡션2 (11px)</Typography>
        <Typography variant="B4" className="mt-1 text-gray-500">
          Caption2 Regular - 11px
        </Typography>
      </div>
    </div>
  ),
};

export const PolymorphicExample: Story = {
  render: () => (
    <div className="space-y-4">
      <Typography variant="T1" as="h1">
        H1 태그로 렌더링된 T1 스타일
      </Typography>
      <Typography variant="B1" as="span">
        Span 태그로 렌더링된 B1 스타일
      </Typography>
      <Typography variant="B3" as="div">
        Div 태그로 렌더링된 B3 스타일
      </Typography>
      <Typography
        variant="E1"
        as="button"
        className="cursor-pointer hover:text-blue-500"
      >
        Button 태그로 렌더링된 E1 스타일
      </Typography>
    </div>
  ),
};

// 커스텀 스타일링 예시
export const CustomStyling: Story = {
  render: () => (
    <div className="space-y-4">
      <Typography variant="T1" className="text-blue-600">
        파란색 T1 텍스트
      </Typography>
      <Typography variant="B1" className="text-red-500 underline">
        빨간색이고 밑줄이 있는 B1 텍스트
      </Typography>
      <Typography variant="B3-BOLD" className="rounded bg-yellow-100 p-2">
        배경색이 있는 B3-BOLD 텍스트
      </Typography>
    </div>
  ),
};

// 텍스트 길이별 예시
export const TextLength: Story = {
  render: () => (
    <div className="max-w-2xl space-y-6">
      <div>
        <Typography variant="T2" className="mb-2">
          짧은 제목
        </Typography>
        <Typography variant="B1">이것은 짧은 본문 텍스트입니다.</Typography>
      </div>

      <div>
        <Typography variant="T2" className="mb-2">
          조금 더 긴 제목이 있는 섹션
        </Typography>
        <Typography variant="B1">
          이것은 조금 더 긴 본문 텍스트입니다. 여러 줄에 걸쳐 표시될 수 있으며,
          줄 간격과 자간이 적절히 설정되어 가독성이 좋습니다.
        </Typography>
      </div>

      <div>
        <Typography variant="T2" className="mb-2">
          매우 긴 제목이 포함된 섹션으로 여러 줄에 걸쳐 표시될 수 있는 경우
        </Typography>
        <Typography variant="B1">
          이것은 매우 긴 본문 텍스트 예시입니다. 실제 서비스에서 사용될 수 있는
          길이의 텍스트로, 여러 문단에 걸쳐 내용이 표시될 때의 가독성을 확인할
          수 있습니다. 각 Typography variant가 적절한 줄 높이와 자간을 가지고
          있어 긴 텍스트에서도 편안한 읽기 경험을 제공합니다. 한글과 영문이
          혼재되어 있을 때도 Typography system이 일관된 스타일을 유지하는지
          확인할 수 있습니다.
        </Typography>
      </div>
    </div>
  ),
};
