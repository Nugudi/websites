/**
 * Stamp DTO
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
