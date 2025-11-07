import type { NotificationItem } from "../types/notification";

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "1",
    type: "review",
    title: "초코합우유 님이 댓글을 남겼어요",
    content: "[팰런티어] 민초버널라님 팰런티어는 9월 46000원 할때도 10월 55...",
    timestamp: "1일 전",
    isRead: false,
    link: "/reviews/35",
  },
  {
    id: "2",
    type: "menu",
    title: "오늘의 구내식당 메뉴가 올라왔어요",
    content: "점심 메뉴: 제육볶음, 된장찌개, 계란말이가 준비되어 있습니다.",
    timestamp: "1일 전",
    isRead: false,
  },
  {
    id: "3",
    type: "event",
    title: "이번 주 특가 메뉴",
    content: "금요일 특식! 돈가스가 5,000원 → 3,500원으로 할인됩니다.",
    timestamp: "1일 전",
    isRead: false,
  },
  {
    id: "4",
    type: "notice",
    title: "[구내식당] 운영시간 변경 안내",
    content: "12월 24일부터 점심시간이 11:30~13:30으로 변경됩니다.",
    timestamp: "1일 전",
    isRead: false,
  },
  {
    id: "5",
    type: "point",
    title: "포인트가 적립되었어요",
    content: "구내식당 리뷰 작성으로 100포인트가 적립되었습니다.",
    timestamp: "1일 전",
    isRead: true,
  },
  {
    id: "6",
    type: "menu",
    title: "내일 구내식당 메뉴가 올라왔어요",
    content: "특식 예정: 갈비탕, 김치전, 나물 반찬이 제공됩니다.",
    timestamp: "1일 전",
    isRead: false,
  },
  {
    id: "7",
    type: "review",
    title: "내 리뷰에 좋아요를 눌렀어요",
    content: "어제 작성한 한식당 리뷰에 15명이 좋아요를 눌렀습니다.",
    timestamp: "1일 전",
    isRead: false,
  },
];

export const NOTIFICATION_TYPE_LABELS = {
  point: "포인트",
  review: "리뷰",
  menu: "메뉴",
  event: "이벤트",
  notice: "공지",
} as const;
