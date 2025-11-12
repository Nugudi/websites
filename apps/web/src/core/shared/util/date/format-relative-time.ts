/**
 * Relative Time Formatting Utilities
 *
 * 상대 시간 포맷팅 유틸리티 함수들
 */

import dayjs from "dayjs";

/**
 * 상대 시간 포맷 옵션
 */
export interface RelativeTimeOptions {
  /**
   * 상세도 레벨
   * - "basic": 일까지만 표시 (기본값)
   * - "detailed": 주, 개월, 년까지 표시
   */
  detail?: "basic" | "detailed";
}

/**
 * ISO 8601 날짜 문자열을 상대 시간 문자열로 변환
 *
 * @param isoString - ISO 8601 형식의 날짜 문자열
 * @param options - 포맷 옵션
 * @returns 상대 시간 문자열 (예: "3일 전", "2시간 전", "방금 전")
 *
 * @example
 * // 기본 모드 (일까지만)
 * formatRelativeTime("2024-11-04T10:00:00Z") // "3일 전"
 * formatRelativeTime("2024-11-07T13:30:00Z") // "2시간 전"
 * formatRelativeTime("2024-11-07T14:55:00Z") // "5분 전"
 *
 * // 상세 모드 (년까지)
 * formatRelativeTime("2023-01-01T00:00:00Z", { detail: "detailed" }) // "1년 전"
 * formatRelativeTime("2024-08-01T00:00:00Z", { detail: "detailed" }) // "3개월 전"
 */
export function formatRelativeTime(
  isoString: string,
  options: RelativeTimeOptions = {},
): string {
  const { detail = "basic" } = options;

  const date = dayjs(isoString);
  const now = dayjs();
  const diffInMs = now.diff(date);

  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  // 기본 모드: 일까지만
  if (detail === "basic") {
    if (diffInDays > 0) return `${diffInDays}일 전`;
    if (diffInHours > 0) return `${diffInHours}시간 전`;
    if (diffInMinutes > 0) return `${diffInMinutes}분 전`;
    if (diffInSeconds > 0) return `${diffInSeconds}초 전`;
    return "방금 전";
  }

  // 상세 모드: 년까지
  const diffInWeeks = Math.floor(diffInDays / 7);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInDays / 365);

  if (diffInYears > 0) return `${diffInYears}년 전`;
  if (diffInMonths > 0) return `${diffInMonths}개월 전`;
  if (diffInWeeks > 0) return `${diffInWeeks}주 전`;
  if (diffInDays > 0) return `${diffInDays}일 전`;
  if (diffInHours > 0) return `${diffInHours}시간 전`;
  if (diffInMinutes > 0) return `${diffInMinutes}분 전`;
  if (diffInSeconds > 0) return `${diffInSeconds}초 전`;
  return "방금 전";
}
