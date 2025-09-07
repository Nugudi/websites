export const CAFETERIA_STEPS = [
  "cafeteria1",
  "cafeteria2",
  "cafeteria3",
  "cafeteria4",
  "cafeteria5",
  "cafeteria6",
] as const;

export type CafeteriaStep = (typeof CAFETERIA_STEPS)[number];

export const POINTS_PER_STAMP = 20;
export const TOTAL_STAMPS_REQUIRED = 6;

export const MOCK_STAMPS = [
  {
    id: "stamp1",
    cafeteriaId: "cafeteria1",
    cafeteriaName: "구디푸드",
    cafeteriaAddress: "구로구 구로동 123-45",
    isCollected: false,
    points: POINTS_PER_STAMP,
    isVerifying: false,
  },
  {
    id: "stamp2",
    cafeteriaId: "cafeteria2",
    cafeteriaName: "맛있는집",
    cafeteriaAddress: "구로구 구로동 234-56",
    isCollected: false,
    points: POINTS_PER_STAMP,
    isVerifying: false,
  },
  {
    id: "stamp3",
    cafeteriaId: "cafeteria3",
    cafeteriaName: "행복식당",
    cafeteriaAddress: "구로구 구로동 345-67",
    isCollected: false,
    points: POINTS_PER_STAMP,
    isVerifying: false,
  },
  {
    id: "stamp4",
    cafeteriaId: "cafeteria4",
    cafeteriaName: "든든한끼",
    cafeteriaAddress: "구로구 구로동 456-78",
    isCollected: false,
    points: POINTS_PER_STAMP,
    isVerifying: false,
  },
  {
    id: "stamp5",
    cafeteriaId: "cafeteria5",
    cafeteriaName: "정성가득",
    cafeteriaAddress: "구로구 구로동 567-89",
    isCollected: false,
    points: POINTS_PER_STAMP,
    isVerifying: false,
  },
  {
    id: "stamp6",
    cafeteriaId: "cafeteria6",
    cafeteriaName: "오늘의밥상",
    cafeteriaAddress: "구로구 구로동 678-90",
    isCollected: false,
    points: POINTS_PER_STAMP,
    isVerifying: false,
  },
];

export const VERIFICATION_MESSAGES = {
  verifying: "정말 간거맞는지 확인중이에요",
  success: "인증 완료! 포인트가 적립되었습니다",
  error: "인증에 실패했습니다. 다시 시도해주세요",
};
