/**
 * Time Parsing Utilities
 *
 * 시간 문자열 파싱 유틸리티 함수들
 */

/**
 * 시간 문자열에서 시(hour) 파싱
 *
 * @param hourStr - 시간 문자열 (예: "11", "09")
 * @returns 0-23 범위의 숫자, 유효하지 않으면 null
 *
 * @example
 * parseHour("11") // 11
 * parseHour("09") // 9
 * parseHour("25") // null (범위 초과)
 * parseHour("abc") // null (숫자 아님)
 */
export function parseHour(hourStr: string): number | null {
  const hour = Number.parseInt(hourStr, 10);
  if (Number.isNaN(hour) || hour < 0 || hour > 23) return null;
  return hour;
}

/**
 * 시간 문자열에서 분(minute) 파싱
 *
 * @param minuteStr - 분 문자열 (예: "30", "05")
 * @returns 0-59 범위의 숫자, 유효하지 않으면 null
 *
 * @example
 * parseMinute("30") // 30
 * parseMinute("05") // 5
 * parseMinute("60") // null (범위 초과)
 */
export function parseMinute(minuteStr: string): number | null {
  const minute = Number.parseInt(minuteStr, 10);
  if (Number.isNaN(minute) || minute < 0 || minute > 59) return null;
  return minute;
}

/**
 * 시간 문자열에서 초(second) 파싱
 *
 * @param secondStr - 초 문자열 (선택적, 예: "00", "45")
 * @returns 0-59 범위의 숫자, 없으면 0, 유효하지 않으면 0
 *
 * @example
 * parseSecond("45") // 45
 * parseSecond("00") // 0
 * parseSecond(undefined) // 0
 * parseSecond("60") // 0 (범위 초과)
 */
export function parseSecond(secondStr: string | undefined): number {
  if (!secondStr) return 0;
  const second = Number.parseInt(secondStr, 10);
  if (Number.isNaN(second) || second < 0 || second > 59) return 0;
  return second;
}
