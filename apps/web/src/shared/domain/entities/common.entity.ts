/**
 * Common Domain Entities (Shared across all domains)
 * Entity: camelCase | DTO: snake_case
 */

import { z } from "zod";

/** 페이지 정보 (무한 스크롤용) */
export const PageInfoSchema = z.object({
  nextCursor: z.string().nullable(),
  size: z.number().int().min(0),
  hasNext: z.boolean(),
});

export type PageInfo = z.infer<typeof PageInfoSchema>;
