/**
 * Benefit DTO
 *
 * Data Transfer Object for Benefit API
 * - snake_case naming (matches Spring API convention)
 * - Used for API communication only
 *
 * Note: 현재 백엔드 API가 없으므로 Entity 구조를 기반으로 정의
 * 백엔드 API 구현 시 실제 스펙에 맞게 수정 필요
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
