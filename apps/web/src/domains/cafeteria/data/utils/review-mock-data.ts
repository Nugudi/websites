import type { CafeteriaReviewCommentData } from "../../presentation/types/cafeteria-review-comment";

// TODO: Phase 4 - Replace with proper OpenAPI types and structure
export const MOCK_CAFETERIA_REVIEW = {
  id: "1",
  cafeteriaId: "1",
  username: "애웅웅웅",
  userLevel: 7,
  imageUrl: "/mocks/test-meal.png",
  date: "2025.7.7.화",
  reviewText:
    "고기가 아주 맛있고, 미트볼 듬뿍이었어요 그런데 .. 좀마타 미트볼이 없는 줄이 있을 수 있습니다. 랜덤핑",
  badges: [
    { emoji: "😊", label: "맛있어요" },
    { emoji: "😋", label: "달달혀요" },
  ],
};

export const MOCK_CAFETERIA_REVIEW_COMMENTS: CafeteriaReviewCommentData[] = [
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
      {
        id: "2-1",
        username: "김용민",
        level: 12,
        timeAgo: "2분전",
        content: "나는 좋던데 ㅎㅎ",
      },
      {
        id: "2-2",
        username: "정혜원",
        level: 25,
        timeAgo: "1분전",
        content: "맛은 개취지!",
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
