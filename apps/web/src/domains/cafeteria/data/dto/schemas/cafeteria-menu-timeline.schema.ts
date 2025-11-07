/**
 * Cafeteria Menu Timeline Validation Schemas
 *
 * Zod schemas for runtime validation of Cafeteria Menu Timeline data from API
 */

import { z } from "zod";
import { CafeteriaMenuSchema } from "./cafeteria-menu.schema";

/** 구내식당 메뉴 타임라인 (일자별 메뉴 목록) */
export const CafeteriaMenuTimelineSchema = z.object({
  menuDate: z.string().min(1),
  menus: z.array(CafeteriaMenuSchema),
  reviewCount: z.number().int().nonnegative(),
});
