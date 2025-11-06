/**
 * Stamp Entity
 *
 * Core domain object representing a stamp
 * - Contains business logic and validation
 * - Independent of external APIs/DTOs
 */

export interface Stamp {
  id: string;
  userId: string;
  cafeteriaId: string;
  cafeteriaName: string;
  issuedAt: string;
  expiresAt?: string;
  isUsed: boolean;
  usedAt?: string;
}

export interface StampCollection {
  stamps: Stamp[];
  totalCount: number;
  unusedCount: number;
}
