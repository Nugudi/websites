/**
 * Cafeteria Mock Data for UI Development
 *
 * Temporary mock data used for UI development until backend APIs are ready.
 * Review-related mock data will be removed once real API integration is complete.
 */

export type ReviewMockData = {
  id: string;
  userId: string;
  userName: string;
  userLevel: number;
  content: string;
  imageUrl?: string;
  date: string;
  badges: Array<{ emoji: string; label: string }>;
  commentCount: number;
};

export const getMockReviews = (): ReviewMockData[] => [
  {
    id: "1",
    userId: "user1",
    userName: "안예원",
    userLevel: 7,
    content: "오늘 점심 정말 맛있었어요! 김치찌개가 진짜 최고였습니다.",
    imageUrl: "/images/cafeterias-test.png",
    date: "2025-10-18",
    badges: [
      { emoji: "⭐", label: "맛있어요" },
      { emoji: "👍", label: "추천해요" },
    ],
    commentCount: 5,
  },
  {
    id: "2",
    userId: "user2",
    userName: "김용민",
    userLevel: 12,
    content: "보통이었어요. 양은 충분했는데 맛이 조금 아쉬웠습니다.",
    imageUrl: undefined,
    date: "2025-10-18",
    badges: [{ emoji: "😐", label: "보통이에요" }],
    commentCount: 2,
  },
  {
    id: "3",
    userId: "user3",
    userName: "정혜원",
    userLevel: 25,
    content: "완벽한 한 끼였습니다! 가격 대비 최고예요.",
    imageUrl: undefined,
    date: "2025-10-18",
    badges: [
      { emoji: "⭐", label: "맛있어요" },
      { emoji: "💰", label: "가성비" },
    ],
    commentCount: 8,
  },
];
