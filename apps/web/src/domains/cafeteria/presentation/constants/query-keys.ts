/**
 * Cafeteria Query Keys
 *
 * Centralized React Query key management following best practices
 * - Hierarchical structure for efficient invalidation
 * - Type-safe query key factories
 * - Consistent naming conventions
 *
 * Reference: https://tkdodo.eu/blog/effective-react-query-keys
 */

/**
 * Cafeteria Query Key Factory
 *
 * Hierarchical structure:
 * - all: ["cafeteria"] - All cafeteria queries
 * - lists: ["cafeteria", "list"] - All list queries
 * - list: ["cafeteria", "list", filters] - Specific list with filters
 * - details: ["cafeteria", "detail"] - All detail queries
 * - detail: ["cafeteria", "detail", id] - Specific cafeteria detail
 * - menus: ["cafeteria", "menu"] - All menu queries
 * - menu: ["cafeteria", "menu", "date", id, date] - Menu by date
 * - menuTimeline: ["cafeteria", "menu", "timeline", id] - Menu timeline
 * - menuAvailability: ["cafeteria", "menu", "availability", id, year, month] - Menu availability
 */
export const cafeteriaKeys = {
  /** All cafeteria queries */
  all: ["cafeteria"] as const,

  /** All cafeteria list queries */
  lists: () => [...cafeteriaKeys.all, "list"] as const,

  /** Cafeterias with menu list (with optional filters) */
  list: (filters: { date?: string; cursor?: string; size?: number } = {}) =>
    [...cafeteriaKeys.lists(), filters] as const,

  /** All cafeteria detail queries */
  details: () => [...cafeteriaKeys.all, "detail"] as const,

  /** Specific cafeteria detail by ID */
  detail: (id: string) => [...cafeteriaKeys.details(), id] as const,

  /** All menu-related queries */
  menus: () => [...cafeteriaKeys.all, "menu"] as const,

  /** Menu by specific date */
  menuByDate: (id: string, date: string) =>
    [...cafeteriaKeys.menus(), "date", id, date] as const,

  /** Menu timeline (infinite scroll) */
  menuTimeline: (id: string, params: { cursor?: string; size?: number } = {}) =>
    [...cafeteriaKeys.menus(), "timeline", id, params] as const,

  /** Menu availability (calendar) */
  menuAvailability: (id: string, year: number, month: number) =>
    [...cafeteriaKeys.menus(), "availability", id, year, month] as const,
} as const;

/**
 * Review Query Key Factory
 *
 * Hierarchical structure:
 * - all: ["cafeteria", "review"] - All review queries
 * - lists: ["cafeteria", "review", "list"] - All review list queries
 * - list: ["cafeteria", "review", "list", filters] - Specific list with filters
 * - comments: ["cafeteria", "review", "comments", id] - Review comments
 */
export const reviewKeys = {
  /** All review queries */
  all: ["cafeteria", "review"] as const,

  /** All review list queries */
  lists: () => [...reviewKeys.all, "list"] as const,

  /** Review list with filters */
  list: (filters: { date?: string; cursor?: string; size?: number } = {}) =>
    [...reviewKeys.lists(), filters] as const,

  /** Review comments by review ID */
  comments: (id: string, params: { cursor?: string; size?: number } = {}) =>
    [...reviewKeys.all, "comments", id, params] as const,
} as const;
