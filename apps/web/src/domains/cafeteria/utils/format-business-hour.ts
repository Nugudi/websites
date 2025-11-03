import type { CafeteriaInfoDTO } from "../types";

// TODO: OpenAPI 타입 옵셔널 수정 후 변경 필요
type TimeInfo = {
  hour?: number;
  minute?: number;
  second?: number;
  nano?: number;
};

const formatTime = (time?: TimeInfo): string => {
  if (!time || time.hour === undefined || time.minute === undefined) {
    return "";
  }
  const hour = time.hour.toString().padStart(2, "0");
  const minute = time.minute.toString().padStart(2, "0");
  return `${hour}:${minute}`;
};

export const getFullBusinessHours = (cafeteria?: CafeteriaInfoDTO): string => {
  if (!cafeteria?.businessHours) {
    return "영업시간 정보 없음";
  }

  const { lunch, dinner } = cafeteria.businessHours;
  const times: string[] = [];

  if (lunch?.start && lunch?.end) {
    times.push(`점심 ${formatTime(lunch.start)} - ${formatTime(lunch.end)}`);
  }

  if (dinner?.start && dinner?.end) {
    times.push(`저녁 ${formatTime(dinner.start)} - ${formatTime(dinner.end)}`);
  }

  return times.join(", ") || "영업시간 정보 없음";
};
