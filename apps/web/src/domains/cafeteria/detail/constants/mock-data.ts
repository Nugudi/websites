import type { CafeteriaDetail } from "../types/cafeteria-detail";

export const getMockCafeteriaData = (cafeteriaId: string): CafeteriaDetail => ({
  id: cafeteriaId,
  name: "더애옹푸드",
  location: "천안 포스트 지하 1층",
  operatingHours: "오전 8시 ~ 오후 14시",
  isLiked: false,
  isPackagingAvailable: true,
  menus: {
    breakfast: [{ name: "식단 확인하기", category: "OTHER" }],
    lunch: [
      { name: "밥류", category: "RICE" },
      { name: "면류", category: "NOODLE" },
      { name: "국/탕/찌개", category: "SOUP" },
      { name: "주요 반찬", category: "MAIN_DISH" },
      { name: "사브반찬", category: "SIDE_DISH" },
      { name: "김치 샐러드", category: "KIMCHI" },
      { name: "빵/토스트/샌드위치 미니", category: "BREAD_SANDWICH" },
      { name: "샐러드 / 과일", category: "SALAD_FRUIT" },
      { name: "음료 후식류", category: "DRINK" },
      { name: "기타", category: "OTHER" },
    ],
  },
});

export const getMockReviews = () => [
  {
    id: "1",
    imageUrl: "/images/cafeterias-test.png",
    imageAlt: "식당 음식 사진",
    date: "2025.7.7.화",
    reviewText:
      "고기가 아주 맛있고, 미트볼 듬뿍이었어요 그런데 ..\n줄마다 미트볼이 없는 줄이 있을 수 있습니다. 랜덤핑",
    badges: [
      { emoji: "😋", label: "맛있어요" },
      { emoji: "🤩", label: "달달해요" },
    ],
  },
  {
    id: "2",
    date: "2025.7.7.화",
    reviewText: "미친 너무 맛없어요...\n닭강정이 닭강정이 아님 빠있고 살없음",
    badges: [
      { emoji: "😢", label: "싱거워요" },
      { emoji: "😰", label: "맛없어요" },
    ],
  },
  {
    id: "3",
    imageUrl: "/images/cafeterias-test.png",
    imageAlt: "식당 음식 사진",
    date: "2025.7.7.화",
    reviewText:
      "오늘 메뉴가 정말 맛있었습니다! 특히 김치찌개가 진짜 맛있었어요.\n밥도 적당히 지어져서 좋았고, 반찬도 신선했습니다.\n내일도 이 정도 퀄리티면 좋겠네요. 직원분들도 친절하시고 식당 분위기도 좋았습니다.",
    badges: [
      { emoji: "❤️", label: "최고예요" },
      { emoji: "👍", label: "추천해요" },
    ],
  },
  {
    id: "4",
    date: "2025.7.6.월",
    reviewText:
      "양이 너무 적어요... 남자 성인 기준으로는 부족한 양입니다.\n맛은 괜찮은데 가격 대비 양이 아쉬워요.",
    badges: [
      { emoji: "😐", label: "보통이에요" },
      { emoji: "💸", label: "비싸요" },
    ],
  },
  {
    id: "5",
    imageUrl: "/images/cafeterias-test.png",
    imageAlt: "맛있는 음식",
    date: "2025.7.5.일",
    reviewText:
      "돈까스가 바삭바삭하고 소스도 맛있었어요!\n양도 넉넉하고 가격도 합리적입니다.",
    badges: [
      { emoji: "😋", label: "맛있어요" },
      { emoji: "💰", label: "가성비" },
    ],
  },
  {
    id: "6",
    date: "2025.7.4.토",
    reviewText:
      "줄이 너무 길어서 기다리기 힘들었어요.\n음식은 평범한 편이고 특별한 건 없었습니다.",
    badges: [
      { emoji: "😔", label: "대기 길어요" },
      { emoji: "😐", label: "보통이에요" },
    ],
  },
];
