/**
 * Business Hours Domain Entity
 * Entity: camelCase | DTO: snake_case
 */

import { z } from "zod";

/** Java LocalTime 타입 (시간 정보만) */
export const LocalTimeSchema = z
  .object({
    hour: z.number().int().min(0).max(23),
    minute: z.number().int().min(0).max(59),
    second: z.number().int().min(0).max(59),
    nano: z.number().int().min(0),
  })
  .nullable();

export type LocalTime = z.infer<typeof LocalTimeSchema>;

/** 시간 범위 (시작/종료) */
export const TimeRangeSchema = z.object({
  start: LocalTimeSchema,
  end: LocalTimeSchema,
});

export type TimeRange = z.infer<typeof TimeRangeSchema>;

/** 영업시간 (점심/저녁) */
export const BusinessHoursSchema = z
  .object({
    lunch: TimeRangeSchema,
    dinner: TimeRangeSchema,
    note: z.string().nullable(),
  })
  .nullable();

export type BusinessHours = z.infer<typeof BusinessHoursSchema>;
