/**
 * Business Hours Entity
 */

/** Java LocalTime 타입 (시간 정보만) */
export interface LocalTime {
  readonly hour: number;
  readonly minute: number;
  readonly second: number;
  readonly nano: number;
}

/** 시간 범위 (시작/종료) - TimeRange 자체가 nullable */
export interface TimeRange {
  readonly start: LocalTime;
  readonly end: LocalTime;
}

/** 영업시간 (점심/저녁) - BusinessHours 자체가 nullable */
export interface BusinessHours {
  readonly lunch: TimeRange | null; // null이면 점심 영업 안 함
  readonly dinner: TimeRange | null; // null이면 저녁 영업 안 함
  readonly note: string | null;
}
