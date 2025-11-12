/**
 * Business Hours Validation Schemas
 *
 * Zod schemas for runtime validation of Business Hours data from API
 */

import { z } from "zod";

/** Java LocalTime 타입 (시간 정보만) */
export const LocalTimeSchema = z.object({
  hour: z.number().int().min(0).max(23),
  minute: z.number().int().min(0).max(59),
  second: z.number().int().min(0).max(59),
  nano: z.number().int().min(0),
});

/** 시간 범위 (시작/종료) - TimeRange 자체가 nullable */
export const TimeRangeSchema = z
  .object({
    start: LocalTimeSchema,
    end: LocalTimeSchema,
  })
  .nullable();

/** 영업시간 (점심/저녁) - BusinessHours 자체가 nullable */
export const BusinessHoursSchema = z
  .object({
    lunch: TimeRangeSchema, // null이면 점심 영업 안 함
    dinner: TimeRangeSchema, // null이면 저녁 영업 안 함
    note: z.string().nullable(),
  })
  .nullable();
