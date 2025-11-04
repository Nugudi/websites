import type {
  BusinessHoursDTO,
  CafeteriaInfoDTO,
  LocalTime,
  TimeRangeDTO,
} from "../types";

type BusinessPeriod = keyof Pick<BusinessHoursDTO, "lunch" | "dinner">;

const BUSINESS_PERIOD_LABELS: Record<BusinessPeriod, string> = {
  lunch: "점심",
  dinner: "저녁",
} as const;

const EMPTY_BUSINESS_HOURS_MESSAGE = "영업시간 정보 없음";

const formatTime = (time?: LocalTime): string => {
  if (!time || time.hour === undefined || time.minute === undefined) {
    return "";
  }
  const hour = time.hour.toString().padStart(2, "0");
  const minute = time.minute.toString().padStart(2, "0");
  return `${hour}:${minute}`;
};

const isValidTimeRange = (
  range?: TimeRangeDTO,
): range is Required<TimeRangeDTO> => {
  return Boolean(range?.start && range?.end);
};

const formatTimeRange = (start: LocalTime, end: LocalTime): string => {
  const startTime = formatTime(start);
  const endTime = formatTime(end);
  return `${startTime} - ${endTime}`;
};

const formatBusinessPeriod = (
  period: BusinessPeriod,
  range?: TimeRangeDTO,
): string | null => {
  if (!isValidTimeRange(range)) {
    return null;
  }
  const label = BUSINESS_PERIOD_LABELS[period];
  const timeRange = formatTimeRange(range.start, range.end);
  return `${label} ${timeRange}`;
};

/**
 * 식당의 영업시간 정보를 포맷팅하여 반환
 * @param cafeteria - 식당 정보 (CafeteriaInfoDTO)
 * @returns 포맷팅된 영업시간 문자열 (예: "점심 11:00 - 14:00& 저녁 17:00 - 20:00"), 영업시간 정보가 없는 경우 "영업시간 정보 없음" 반환
 */
export const getFullBusinessHours = (cafeteria?: CafeteriaInfoDTO): string => {
  if (!cafeteria?.businessHours) {
    return EMPTY_BUSINESS_HOURS_MESSAGE;
  }

  const { lunch, dinner } = cafeteria.businessHours;

  const periods: string[] = [
    formatBusinessPeriod("lunch", lunch),
    formatBusinessPeriod("dinner", dinner),
  ].filter((period): period is string => period !== null);

  return periods.length > 0
    ? periods.join(" & ")
    : EMPTY_BUSINESS_HOURS_MESSAGE;
};
