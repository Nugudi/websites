import {
  formatTimeRange as formatTimeRangeUtil,
  formatTime as formatTimeUtil,
} from "@core/utils/date";
import type { Cafeteria, LocalTime, TimeRange } from "../../domain/entities";

type BusinessPeriod = "lunch" | "dinner";

const BUSINESS_PERIOD_LABELS: Record<BusinessPeriod, string> = {
  lunch: "점심",
  dinner: "저녁",
} as const;

const EMPTY_BUSINESS_HOURS_MESSAGE = "영업시간 정보 없음";

const _formatTime = (time: LocalTime): string => {
  return formatTimeUtil(time.hour, time.minute);
};

const formatTimeRange = (start: LocalTime, end: LocalTime): string => {
  return formatTimeRangeUtil(start.hour, start.minute, end.hour, end.minute);
};

const formatBusinessPeriod = (
  period: BusinessPeriod,
  range: TimeRange | null | undefined,
): string | null => {
  if (!range) return null; // TimeRange가 null이거나 undefined면 영업 안 함
  const label = BUSINESS_PERIOD_LABELS[period];
  return `${label} ${formatTimeRange(range.start, range.end)}`;
};

/**
 * 식당의 영업시간 정보를 포맷팅하여 반환
 * @param cafeteria - Cafeteria 엔티티
 * @returns 포맷팅된 영업시간 문자열 (예: "점심 11:00 - 14:00 & 저녁 17:00 - 20:00")
 */
export const getFullBusinessHours = (cafeteria: Cafeteria): string => {
  const businessHours = cafeteria.getBusinessHours();
  const { lunch, dinner } = businessHours || {};

  const periods = [
    formatBusinessPeriod("lunch", lunch),
    formatBusinessPeriod("dinner", dinner),
  ].filter((period): period is string => period !== null);

  return periods.length > 0
    ? periods.join(" & ")
    : EMPTY_BUSINESS_HOURS_MESSAGE;
};
