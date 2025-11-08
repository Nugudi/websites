/**
 * Time Formatting Utilities
 *
 * 시간 포맷팅 유틸리티 함수들
 */

/**
 * 시간 객체를 "HH:MM" 형식으로 변환
 *
 * @param hour - 시간 (0-23)
 * @param minute - 분 (0-59)
 * @returns "HH:MM" 형식 문자열 (예: "14:30", "09:00")
 *
 * @example
 * formatTime(14, 30) // "14:30"
 * formatTime(9, 5)   // "09:05"
 * formatTime(0, 0)   // "00:00"
 */
export function formatTime(hour: number, minute: number): string {
  const h = String(hour).padStart(2, "0");
  const m = String(minute).padStart(2, "0");
  return `${h}:${m}`;
}

/**
 * 시간 범위를 "HH:MM - HH:MM" 형식으로 변환
 *
 * @param startHour - 시작 시간 (0-23)
 * @param startMinute - 시작 분 (0-59)
 * @param endHour - 종료 시간 (0-23)
 * @param endMinute - 종료 분 (0-59)
 * @returns "HH:MM - HH:MM" 형식 문자열 (예: "11:30 - 14:00")
 *
 * @example
 * formatTimeRange(11, 30, 14, 0) // "11:30 - 14:00"
 * formatTimeRange(9, 0, 18, 30)  // "09:00 - 18:30"
 */
export function formatTimeRange(
  startHour: number,
  startMinute: number,
  endHour: number,
  endMinute: number,
): string {
  return `${formatTime(startHour, startMinute)} - ${formatTime(endHour, endMinute)}`;
}
