import "@nugudi/react-components-review-card/style.css";
import "@nugudi/react-components-badge/style.css";
import { CommentIcon } from "@nugudi/assets-icons";
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
    username: {
      control: "text",
      description: "사용자명",
      table: {
        type: { summary: "string" },
        category: "User",
      },
    },
    userLevel: {
      control: "number",
      description: "사용자 레벨",
      table: {
        type: { summary: "number" },
        category: "User",
      },
    },
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
    imageAlt: {
      control: "text",
      description: "이미지 대체 텍스트 (웹 접근성)",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "리뷰 이미지" },
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
    rightIcon: {
      control: false,
      description: "우하단에 표시될 아이콘 (20x20 크기 권장)",
      table: {
        type: { summary: "React.ReactNode" },
        category: "Actions",
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
    username: "애웅웅웅",
    userLevel: 7,
    imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38",
    imageAs: "img",
    imageAlt: "미트볼이 올라간 음식 사진",
    date: "3분전",
    reviewText:
      "고기가 아주 맛있고, 미트볼 듬뿍이었어요 그런데 .. 미트볼이 없는 줄이 있을 수 있습니다. 랜덤핑",
    badges: [
      { emoji: "😋", label: "맛있거든" },
      { emoji: "🤤", label: "달달허요" },
    ],
    rightIcon: <CommentIcon width={20} height={20} />,
  },
};

export const NoImage: Story = {
  args: {
    username: "샐러드킹",
    userLevel: 3,
    date: "10분전",
    reviewText:
      "오늘의 샐러드는 신선한 야채들로 가득했습니다. 드레싱도 적절하고 건강한 맛이었어요.",
    badges: [
      { emoji: "🥗", label: "건강식" },
      { emoji: "👍", label: "좋아요" },
    ],
    rightIcon: <CommentIcon width={20} height={20} />,
  },
};

export const LongReviewText: Story = {
  args: {
    username: "피자마스터",
    userLevel: 12,
    imageUrl: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445",
    imageAs: "img",
    imageAlt: "페퍼로니 피자 사진",
    date: "1시간전",
    reviewText:
      "오늘의 피자는 정말 특별했습니다. 도우는 얇고 바삭했으며, 토핑은 신선하고 풍부했습니다. 치즈는 쭉쭉 늘어나는 모짜렐라를 사용해서 먹는 재미가 있었고, 토마토 소스는 적당히 새콤달콤해서 느끼하지 않았습니다. 특히 페퍼로니의 매콤한 맛이 전체적인 맛의 균형을 잘 잡아주었습니다. 다음에도 꼭 다시 먹고 싶은 메뉴입니다.",
    badges: [
      { emoji: "🍕", label: "피자데이" },
      { emoji: "😍", label: "최고예요" },
    ],
    rightIcon: <CommentIcon width={20} height={20} />,
  },
};

export const WithCommentButton: Story = {
  args: {
    username: "음식평론가",
    userLevel: 25,
    date: "방금전",
    reviewText:
      "오늘의 메뉴는 정말 완벽했습니다! 댓글로 더 자세한 후기를 남겨보세요.",
    badges: [
      { emoji: "⭐", label: "5점" },
      { emoji: "👨‍🍳", label: "셰프추천" },
    ],
    rightIcon: <CommentIcon width={20} height={20} />,
  },
};

export const NoComments: Story = {
  args: {
    username: "첫리뷰어",
    userLevel: 1,
    date: "5분전",
    reviewText: "첫 리뷰입니다. 아직 댓글이 없네요.",
    badges: [{ emoji: "🆕", label: "첫리뷰" }],
  },
};

export const HighLevelUser: Story = {
  args: {
    username: "구내식당마스터",
    userLevel: 99,
    imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
    imageAs: "img",
    imageAlt: "고급 요리 사진",
    date: "2시간전",
    reviewText:
      "레벨 99 유저의 리뷰입니다. 오랜 경험으로 얻은 깊이 있는 평가를 제공합니다.",
    badges: [
      { emoji: "👑", label: "마스터" },
      { emoji: "⭐", label: "5점" },
      { emoji: "🔥", label: "인기" },
    ],
  },
};

export const OnlyUserInfo: Story = {
  args: {
    username: "간단후기",
    userLevel: 5,
    date: "30분전",
    reviewText: "짧고 간단한 후기입니다.",
  },
};
