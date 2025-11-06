/**
 * Benefit Entity
 *
 * Core domain object representing a benefit/menu
 * - Contains business logic and validation
 * - Independent of external APIs/DTOs
 */

export interface Benefit {
  id: string;
  cafeteriaId: string;
  cafeteriaName: string;
  menuName: string;
  menuType: MenuType;
  price: number;
  discountedPrice?: number;
  description?: string;
  imageUrl?: string;
  availableAt: string;
  createdAt: string;
}

export enum MenuType {
  LUNCH = "LUNCH",
  DINNER = "DINNER",
  SNACK = "SNACK",
}

export interface BenefitList {
  benefits: Benefit[];
  totalCount: number;
}
