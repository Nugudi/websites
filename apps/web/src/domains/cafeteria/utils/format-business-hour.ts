import type { BusinessHoursDTO, LocalTime, TimeRangeDTO } from "../types";

type BusinessPeriod = "lunch" | "dinner";

const BUSINESS_PERIOD_LABELS: Record<BusinessPeriod, string> = {
  lunch: "점심",
  dinner: "저녁",
} as const;

const EMPTY_BUSINESS_HOURS_MESSAGE = "영업시간 정보 없음";

const formatTime = (time?: LocalTime | null): string => {
  if (!time || time.hour === undefined || time.minute === undefined) {
    return "";
  }
  const hour = time.hour.toString().padStart(2, "0");
  const minute = time.minute.toString().padStart(2, "0");
  return `${hour}:${minute}`;
};

const isValidTimeRange = (
  range?: TimeRangeDTO | null,
): range is { start: LocalTime; end: LocalTime } => {
  return Boolean(range?.start && range?.end);
};

const formatTimeRange = (start: LocalTime, end: LocalTime): string => {
  return `${formatTime(start)} - ${formatTime(end)}`;
};

const formatBusinessPeriod = (
  period: BusinessPeriod,
  range?: TimeRangeDTO | null,
): string | null => {
  if (!isValidTimeRange(range)) return null;
  const label = BUSINESS_PERIOD_LABELS[period];
  return `${label} ${formatTimeRange(range.start, range.end)}`;
};

/**
 * 식당의 영업시간 정보를 포맷팅하여 반환
 * @param cafeteria - businessHours 필드를 포함한 식당 정보
 * @returns 포맷팅된 영업시간 문자열 (예: "점심 11:00 - 14:00 & 저녁 17:00 - 20:00")
 */
export const getFullBusinessHours = (cafeteria: {
  businessHours?: BusinessHoursDTO | null;
}): string => {
  const { lunch, dinner } = cafeteria.businessHours || {};

  const periods = [
    formatBusinessPeriod("lunch", lunch),
    formatBusinessPeriod("dinner", dinner),
  ].filter((period): period is string => period !== null);

  return periods.length > 0
    ? periods.join(" & ")
    : EMPTY_BUSINESS_HOURS_MESSAGE;
};
