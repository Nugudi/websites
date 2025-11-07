/**
 * Date Formatting Utilities
 *
 * 날짜 포맷팅 유틸리티 함수들
 */

import dayjs from "dayjs";

/**
 * ISO 8601 날짜 문자열을 "YYYY.MM.DD" 형식으로 변환
 *
 * @param isoString - ISO 8601 형식의 날짜 문자열
 * @returns "YYYY.MM.DD" 형식 문자열 (예: "2024.11.07")
 *
 * @example
 * formatDate("2024-11-07T12:30:00Z") // "2024.11.07"
 */
export function formatDate(isoString: string): string {
  return dayjs(isoString).format("YYYY.MM.DD");
}

/**
 * ISO 8601 날짜 문자열을 "YYYY.MM.DD HH:mm" 형식으로 변환
 *
 * @param isoString - ISO 8601 형식의 날짜 문자열
 * @returns "YYYY.MM.DD HH:mm" 형식 문자열 (예: "2024.11.07 14:30")
 *
 * @example
 * formatDateTime("2024-11-07T14:30:00Z") // "2024.11.07 14:30"
 */
export function formatDateTime(isoString: string): string {
  return dayjs(isoString).format("YYYY.MM.DD HH:mm");
}

/**
 * ISO 8601 날짜 문자열을 "YYYY년 MM월 DD일" 형식으로 변환
 *
 * @param isoString - ISO 8601 형식의 날짜 문자열
 * @returns "YYYY년 MM월 DD일" 형식 문자열 (예: "2024년 11월 07일")
 *
 * @example
 * formatDateKorean("2024-11-07T12:30:00Z") // "2024년 11월 07일"
 */
export function formatDateKorean(isoString: string): string {
  return dayjs(isoString).format("YYYY년 MM월 DD일");
}
