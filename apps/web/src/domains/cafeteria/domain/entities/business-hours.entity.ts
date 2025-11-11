/**
 * Business Hours Entity
 *
 * 영업시간 도메인 엔티티 (점심/저녁 영업시간 정보)
 * User domain pattern을 따라 Interface + Implementation 구조 사용
 */

import { BUSINESS_HOURS_VALIDATION, MEAL_TYPE } from "../config/constants";

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

/**
 * BusinessHours 도메인 인터페이스
 *
 * 영업시간 관련 모든 비즈니스 로직을 정의
 * Presentation layer는 이 인터페이스를 통해서만 Entity와 통신
 */
export interface BusinessHours {
  // ===== Getters =====
  getLunch(): TimeRange | null;
  getDinner(): TimeRange | null;
  getNote(): string | null;

  // ===== Business Logic =====
  /**
   * 점심 영업을 하는지 확인
   */
  hasLunch(): boolean;

  /**
   * 저녁 영업을 하는지 확인
   */
  hasDinner(): boolean;

  /**
   * 특정 시각에 영업 중인지 확인
   * @param hour - 시간 (0-23)
   * @param minute - 분 (0-59)
   * @param mealType - 식사 타입 (lunch/dinner)
   */
  isOpenAt(hour: number, minute: number, mealType: "lunch" | "dinner"): boolean;

  // ===== Utilities =====
  /**
   * Entity를 Plain Object로 변환 (직렬화)
   */
  toPlainObject(): {
    lunch: TimeRange | null;
    dinner: TimeRange | null;
    note: string | null;
  };

  /**
   * 두 BusinessHours 엔티티가 동일한지 비교
   */
  equals(other: BusinessHours): boolean;
}

/**
 * BusinessHoursEntity 구현 클래스
 *
 * Immutable Entity - 생성 후 상태 변경 불가
 */
export class BusinessHoursEntity implements BusinessHours {
  private readonly _lunch: TimeRange | null;
  private readonly _dinner: TimeRange | null;
  private readonly _note: string | null;

  constructor(params: {
    lunch: TimeRange | null;
    dinner: TimeRange | null;
    note?: string | null;
  }) {
    this._lunch = params.lunch;
    this._dinner = params.dinner;
    this._note = params.note ?? null;

    this.validate();
  }

  /**
   * 영업시간 데이터 유효성 검증
   */
  private validate(): void {
    // Validate lunch time range
    if (this._lunch) {
      this.validateTimeRange(this._lunch, "점심");
    }

    // Validate dinner time range
    if (this._dinner) {
      this.validateTimeRange(this._dinner, "저녁");
    }
  }

  /**
   * TimeRange 유효성 검증
   */
  private validateTimeRange(range: TimeRange, label: string): void {
    // Validate start time
    this.validateLocalTime(range.start, `${label} 시작 시간`);

    // Validate end time
    this.validateLocalTime(range.end, `${label} 종료 시간`);

    // Validate time range (end must be after start)
    const startMinutes = range.start.hour * 60 + range.start.minute;
    const endMinutes = range.end.hour * 60 + range.end.minute;

    if (endMinutes <= startMinutes) {
      throw new Error(
        `${label}: ${BUSINESS_HOURS_VALIDATION.MESSAGES.INVALID_TIME_RANGE}`,
      );
    }
  }

  /**
   * LocalTime 유효성 검증
   */
  private validateLocalTime(time: LocalTime, label: string): void {
    if (time.hour < 0 || time.hour > 23) {
      throw new Error(
        `${label}: ${BUSINESS_HOURS_VALIDATION.MESSAGES.INVALID_HOUR}`,
      );
    }

    if (time.minute < 0 || time.minute > 59) {
      throw new Error(
        `${label}: ${BUSINESS_HOURS_VALIDATION.MESSAGES.INVALID_MINUTE}`,
      );
    }
  }

  // ===== Getters =====
  getLunch(): TimeRange | null {
    return this._lunch;
  }

  getDinner(): TimeRange | null {
    return this._dinner;
  }

  getNote(): string | null {
    return this._note;
  }

  // ===== Business Logic =====
  hasLunch(): boolean {
    return this._lunch !== null;
  }

  hasDinner(): boolean {
    return this._dinner !== null;
  }

  isOpenAt(
    hour: number,
    minute: number,
    mealType: "lunch" | "dinner",
  ): boolean {
    const range = mealType === MEAL_TYPE.LUNCH ? this._lunch : this._dinner;

    if (!range) {
      return false;
    }

    const currentMinutes = hour * 60 + minute;
    const startMinutes = range.start.hour * 60 + range.start.minute;
    const endMinutes = range.end.hour * 60 + range.end.minute;

    return currentMinutes >= startMinutes && currentMinutes < endMinutes;
  }

  // ===== Utilities =====
  toPlainObject(): {
    lunch: TimeRange | null;
    dinner: TimeRange | null;
    note: string | null;
  } {
    return {
      lunch: this._lunch,
      dinner: this._dinner,
      note: this._note,
    };
  }

  equals(other: BusinessHours): boolean {
    return (
      JSON.stringify(this._lunch) === JSON.stringify(other.getLunch()) &&
      JSON.stringify(this._dinner) === JSON.stringify(other.getDinner()) &&
      this._note === other.getNote()
    );
  }
}
