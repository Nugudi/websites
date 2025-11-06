/**
 * Cafeteria Menu Timeline Domain Entity
 * Entity: camelCase | DTO: snake_case
 */

import { z } from "zod";
import { CafeteriaMenuSchema } from "./cafeteria-menu.entity";

/** 구내식당 메뉴 타임라인 (일자별 메뉴 목록) */
export const CafeteriaMenuTimelineSchema = z.object({
  menuDate: z.string().min(1),
  menus: z.array(CafeteriaMenuSchema),
  reviewCount: z.number().int().nonnegative(),
});

export type CafeteriaMenuTimeline = z.infer<typeof CafeteriaMenuTimelineSchema>;
