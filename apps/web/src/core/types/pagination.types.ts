/**
 * Pagination Types (Core Layer)
 *
 * Shared pagination types used across all domains.
 * These are NOT entities - they are pure data structures for pagination metadata.
 *
 * @module shared/core/types
 */

import { z } from "zod";

/**
 * Page Information Schema (Cursor-based pagination metadata)
 *
 * Used for infinite scroll patterns with cursor-based pagination.
 *
 * @example
 * ```typescript
 * const pageInfo: PageInfo = {
 *   nextCursor: "123",
 *   size: 10,
 *   hasNext: true
 * };
 * ```
 */
export const PageInfoSchema = z.object({
  /** 다음 페이지 커서 (ID, 날짜 등). null이면 마지막 페이지 */
  nextCursor: z.string().nullable(),
  /** 현재 페이지의 아이템 개수 */
  size: z.number().int().min(0),
  /** 다음 페이지 존재 여부 */
  hasNext: z.boolean(),
});

/**
 * Page Information Type
 *
 * Cursor-based pagination metadata for infinite scroll.
 */
export type PageInfo = z.infer<typeof PageInfoSchema>;

/**
 * Generic Paginated Response
 *
 * Wraps any data type T with pagination metadata.
 * Used by Repository interfaces and UseCases.
 *
 * @template T - The type of data items in the response
 *
 * @example
 * ```typescript
 * // Repository interface
 * interface MovieRepository {
 *   getPopular(page?: number): Promise<PaginatedResponse<Movie>>;
 * }
 *
 * // UseCase return type
 * async execute(): Promise<PaginatedResponse<CafeteriaWithMenu>> {
 *   return {
 *     data: [...],
 *     pageInfo: { nextCursor: "123", size: 10, hasNext: true }
 *   };
 * }
 * ```
 */
export interface PaginatedResponse<T> {
  /** Array of data items */
  data: T[];
  /** Pagination metadata */
  pageInfo: PageInfo;
}
