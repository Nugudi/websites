import "@nugudi/react-components-review-card/style.css";
import "@nugudi/react-components-badge/style.css";
import { ReviewCard as _ReviewCard } from "@nugudi/react-components-review-card";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof _ReviewCard> = {
  title: "Components/ReviewCard",
  component: _ReviewCard,
  parameters: {
    layout: "padded",
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: "500px", margin: "0 auto" }}>
        <Story />
      </div>
    ),
  ],
  tags: ["autodocs"],
  argTypes: {
    imageUrl: {
      control: "text",
      description: "리뷰 이미지 URL",
      table: {
        type: { summary: "string" },
        category: "Content",
      },
    },
    imageAs: {
      control: false,
      description: "이미지 렌더링 방식 (img, Image(next/image))",
      table: {
        type: { summary: "React.ElementType" },
        defaultValue: { summary: "img" },
        category: "Content",
      },
    },
    date: {
      control: "text",
      description: "리뷰 날짜",
      table: {
        type: { summary: "string" },
        category: "Content",
      },
    },
    reviewText: {
      control: "text",
      description: "리뷰 텍스트 내용",
      table: {
        type: { summary: "string" },
        category: "Content",
      },
    },
    badges: {
      control: "object",
      description: "리뷰와 관련된 Badge 배열",
      table: {
        type: { summary: "Badge[]" },
        defaultValue: { summary: "[]" },
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
    onClick: {
      action: "clicked",
      description: "카드 클릭 시 실행될 함수",
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
    imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38",
    imageAs: "img",
    date: "2025.7.7.화",
    reviewText:
      "고기가 아주 맛있고, 미트볼 듬뿍이었어요 그런데 .. 좀마디 미트볼이 없는 줄이 있을 수 있습니다. 랜덤핑",
    badges: [
      { emoji: "😋", label: "맛있거든" },
      { emoji: "🤤", label: "달달허요" },
    ],
  },
};

export const NoImage: Story = {
  args: {
    date: "2025.7.8.수",
    reviewText:
      "오늘의 샐러드는 신선한 야채들로 가득했습니다. 드레싱도 적절하고 건강한 맛이었어요.",
    badges: [
      { emoji: "😋", label: "맛있거든" },
      { emoji: "🤤", label: "달달허요" },
    ],
  },
};

export const LongReviewText: Story = {
  args: {
    imageUrl: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445",
    imageAs: "img",
    date: "2025.7.10.금",
    reviewText:
      "오늘의 피자는 정말 특별했습니다. 도우는 얇고 바삭했으며, 토핑은 신선하고 풍부했습니다. 치즈는 쭉쭉 늘어나는 모짜렐라를 사용해서 먹는 재미가 있었고, 토마토 소스는 적당히 새콤달콤해서 느끼하지 않았습니다. 특히 페퍼로니의 매콤한 맛이 전체적인 맛의 균형을 잘 잡아주었습니다. 다음에도 꼭 다시 먹고 싶은 메뉴입니다.",
    badges: [
      { emoji: "🍕", label: "피자데이" },
      { emoji: "😍", label: "최고예요" },
    ],
  },
};
