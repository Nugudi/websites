/**
 * Benefit DTO
 */

export interface BenefitDTO {
  id: string;
  cafeteria_id: string;
  cafeteria_name: string;
  menu_name: string;
  menu_type: MenuTypeDTO;
  price: number;
  discounted_price?: number;
  description?: string;
  image_url?: string;
  available_at: string;
  created_at: string;
}

export type MenuTypeDTO = "LUNCH" | "DINNER" | "SNACK";

export interface GetBenefitListResponseDTO {
  benefits: BenefitDTO[];
  total_count: number;
}
