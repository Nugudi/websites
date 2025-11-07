/**
 * Stamp UI Types
 *
 * Presentation layer types for stamp display
 */

export interface StampItem {
  id: string;
  cafeteriaName: string;
  isUsed: boolean;
  issuedDate: string; // Formatted date string for display
}
