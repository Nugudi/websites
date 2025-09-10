import "@nugudi/react-components-comment/style.css";
import "@nugudi/react-components-avatar/style.css";

import { Avatar } from "@nugudi/react-components-avatar";
import { Comment as _Comment } from "@nugudi/react-components-comment";
import { VStack } from "@nugudi/react-components-layout";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof _Comment> = {
  title: "Components/Comment",
  component: _Comment,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "댓글 및 대댓글을 표시하는 컴포넌트입니다. 사용자 아바타, 레벨, 작성시간 등을 함께 표시할 수 있습니다.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    avatar: {
      control: false,
      description:
        "사용자 아바타 React 엘리먼트 (예: Next.js Image, img 태그 또는 커스텀 컴포넌트)",
      table: {
        type: { summary: "ReactNode" },
        category: "콘텐츠",
      },
    },
    username: {
      control: "text",
      description: "사용자명 또는 표시 이름",
      table: {
        type: { summary: "string" },
        category: "콘텐츠",
      },
    },
    level: {
      control: "number",
      description: '사용자 레벨 숫자 ("Lv." 접두사는 자동 추가됨) - 필수',
      table: {
        type: { summary: "number" },
        category: "콘텐츠",
      },
    },
    timeAgo: {
      control: "text",
      description: '작성 시간 문자열 (예: "3분전", "1시간전")',
      table: {
        type: { summary: "string" },
        category: "콘텐츠",
      },
    },
    content: {
      control: "text",
      description: "댓글 내용",
      table: {
        type: { summary: "string" },
        category: "콘텐츠",
      },
    },
    isReply: {
      control: "boolean",
      description: "대댓글 여부 (들여쓰기 및 ReplyIcon 표시)",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
        category: "상태",
      },
    },
    className: {
      control: "text",
      description: "추가 CSS 클래스",
      table: {
        type: { summary: "string" },
        category: "스타일",
      },
    },
    children: {
      control: false,
      description: "하위 댓글/대댓글",
      table: {
        type: { summary: "ReactNode" },
        category: "콘텐츠",
      },
    },
    showReplyButton: {
      control: "boolean",
      description: "답글 남기기 버튼 표시 여부",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
        category: "상태",
      },
    },
    onReplyClick: {
      action: "onReplyClick",
      description: "답글 버튼 클릭 시 호출되는 콜백",
      table: {
        type: { summary: "() => void" },
        category: "이벤트",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    username: "사용자명",
    level: 1,
    timeAgo: "방금 전",
    content: "이것은 기본 댓글입니다. 댓글 내용이 여기에 표시됩니다.",
  },
};

export const WithAvatar: Story = {
  args: {
    avatar: (
      <Avatar
        src="https://i.pravatar.cc/150?img=1"
        alt="애옹 프로필 이미지"
        size="xs"
      />
    ),
    username: "애옹",
    level: 3,
    timeAgo: "5분전",
    content: "아바타가 있는 댓글입니다. 사용자 프로필 이미지가 표시됩니다.",
  },
};

export const Reply: Story = {
  args: {
    avatar: (
      <Avatar src="https://i.pravatar.cc/150?img=3" alt="애옹옹옹" size="xs" />
    ),
    username: "애옹옹옹",
    level: 7,
    timeAgo: "3분전",
    content: "대댓글 내용이 여기에 표시됩니다.",
    isReply: true,
  },
};

export const CommentWithReplies: Story = {
  render: () => (
    <VStack maxWidth="600px">
      <_Comment
        avatar={
          <Avatar
            src="https://i.pravatar.cc/150?img=5"
            alt="원댓글작성자"
            size="xs"
          />
        }
        username="원댓글작성자"
        level={10}
        timeAgo="1시간전"
        content="이것은 원댓글입니다. 아래에 대댓글들이 있습니다."
      >
        <_Comment
          avatar={
            <Avatar
              src="https://i.pravatar.cc/150?img=6"
              alt="대댓글작성자1"
              size="xs"
            />
          }
          username="대댓글작성자1"
          level={5}
          timeAgo="30분전"
          content="첫 번째 대댓글입니다."
          isReply
        />
        <_Comment
          avatar={
            <Avatar
              src="https://i.pravatar.cc/150?img=7"
              alt="대댓글작성자2"
              size="xs"
            />
          }
          username="대댓글작성자2"
          level={8}
          timeAgo="15분전"
          content="두 번째 대댓글입니다."
          isReply
        />
      </_Comment>
    </VStack>
  ),
};

export const WithReplyButton: Story = {
  args: {
    avatar: (
      <Avatar
        src="https://i.pravatar.cc/150?img=2"
        alt="사용자 프로필"
        size="xs"
      />
    ),
    username: "댓글작성자",
    level: 5,
    timeAgo: "10분전",
    content:
      "답글 버튼이 있는 댓글입니다. 오른쪽 끝에 답글 남기기 버튼이 표시됩니다.",
    showReplyButton: true,
  },
};

export const CommentWithRepliesAndButton: Story = {
  render: () => (
    <VStack maxWidth="600px">
      <_Comment
        avatar={
          <Avatar
            src="https://i.pravatar.cc/150?img=4"
            alt="메인댓글작성자"
            size="xs"
          />
        }
        username="메인댓글작성자"
        level={7}
        timeAgo="1시간전"
        content="구내식당 맛있어요. 🥟"
        showReplyButton={true}
        onReplyClick={() => console.log("답글 클릭됨")}
      >
        <_Comment
          avatar={
            <Avatar
              src="https://i.pravatar.cc/150?img=11"
              alt="대댓글작성자"
              size="xs"
            />
          }
          username="대댓글작성자"
          level={1}
          timeAgo="30분전"
          content="저도 동의합니다!"
          isReply
        />
      </_Comment>
    </VStack>
  ),
};

export const MultipleComments: Story = {
  render: () => (
    <VStack maxWidth="600px">
      <_Comment
        avatar={
          <Avatar
            src="https://i.pravatar.cc/150?img=8"
            alt="사용자1"
            size="xs"
          />
        }
        username="사용자1"
        level={12}
        timeAgo="2시간전"
        content="첫 번째 댓글입니다."
        showReplyButton={true}
        onReplyClick={() => console.log("첫 번째 댓글에 답글")}
      />
      <_Comment
        avatar={
          <Avatar
            src="https://i.pravatar.cc/150?img=9"
            alt="사용자2"
            size="xs"
          />
        }
        username="사용자2"
        level={3}
        timeAgo="1시간전"
        content="두 번째 댓글입니다. 멋진 게시물이네요!"
        showReplyButton={true}
        onReplyClick={() => console.log("두 번째 댓글에 답글")}
      />
      <_Comment
        avatar={
          <Avatar
            src="https://i.pravatar.cc/150?img=10"
            alt="사용자3"
            size="xs"
          />
        }
        username="사용자3"
        level={1}
        timeAgo="30분전"
        content="세 번째 댓글입니다."
        showReplyButton={true}
        onReplyClick={() => console.log("세 번째 댓글에 답글")}
      />
    </VStack>
  ),
};
