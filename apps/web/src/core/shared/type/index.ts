/**
 * Core Types (Barrel Export)
 *
 * Central export point for all core types used across the application.
 * These are NOT domain entities - they are shared data structures.
 *
 * @module shared/core/types
 */

export type { PageInfo, PaginatedResponse } from "./pagination.types";
export { PageInfoSchema } from "./pagination.types";
