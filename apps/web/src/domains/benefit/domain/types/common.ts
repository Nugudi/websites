/**
 * Benefit Domain Common Types
 *
 * Domain Layer의 공통 타입 정의
 */

/**
 * Menu Type (Domain Type)
 */
export type MenuType = "LUNCH" | "DINNER" | "SNACK";

/**
 * Benefit List Result
 */
export interface BenefitListResult {
  benefits: unknown[]; // Will be typed as Benefit[] in entity file
  totalCount: number;
}
