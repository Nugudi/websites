/**
 * Stamp DTO
 *
 * Data Transfer Object for Stamp API
 * - snake_case naming (matches Spring API convention)
 * - Used for API communication only
 *
 * Note: 현재 백엔드 API가 없으므로 Entity 구조를 기반으로 정의
 * 백엔드 API 구현 시 실제 스펙에 맞게 수정 필요
 */

export interface StampDTO {
  id: string;
  user_id: string;
  cafeteria_id: string;
  cafeteria_name: string;
  issued_at: string;
  expires_at?: string;
  is_used: boolean;
  used_at?: string;
}

export interface GetStampCollectionResponseDTO {
  stamps: StampDTO[];
  total_count: number;
  unused_count: number;
}
