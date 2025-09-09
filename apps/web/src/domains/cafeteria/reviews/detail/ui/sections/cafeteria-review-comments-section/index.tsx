"use client";

import { Avatar } from "@nugudi/react-components-avatar";
import { Comment } from "@nugudi/react-components-comment";
import { VStack } from "@nugudi/react-components-layout";

interface CafeteriaReviewCommentsSectionProps {
  reviewId: string;
}

export const CafeteriaReviewCommentsSection = ({
  reviewId,
}: CafeteriaReviewCommentsSectionProps) => {
  // Mock data
  const comments = [
    {
      id: "1",
      username: "애옹",
      level: 7,
      timeAgo: "3분전",
      content: "구내식당 맛있어요. 🥟",
      replies: [
        {
          id: "2",
          username: "조울핑",
          level: 1,
          timeAgo: "3분전",
          content: "구내식당 싫어.",
        },
      ],
    },
    {
      id: "3",
      username: "조울핑",
      level: 1,
      timeAgo: "3분전",
      content: "구내식당 싫어.",
    },
    {
      id: "4",
      username: "조울핑",
      level: 1,
      timeAgo: "3분전",
      content: "구내식당 싫어.",
    },
    {
      id: "5",
      username: "조울핑",
      level: 1,
      timeAgo: "3분전",
      content: "구내식당 싫어.",
    },
    {
      id: "6",
      username: "조울핑",
      level: 1,
      timeAgo: "3분전",
      content: "구내식당 싫어.",
    },
  ];

  return (
    <VStack>
      {comments.map((comment) => (
        <Comment
          key={comment.id}
          avatar={<Avatar alt={comment.username} size="xs" />}
          username={comment.username}
          level={comment.level}
          timeAgo={comment.timeAgo}
          content={comment.content}
        >
          {comment.replies?.map((reply) => (
            <Comment
              key={reply.id}
              avatar={<Avatar alt={reply.username} size="xs" />}
              username={reply.username}
              level={reply.level}
              timeAgo={reply.timeAgo}
              content={reply.content}
              isReply
            />
          ))}
        </Comment>
      ))}
    </VStack>
  );
};
