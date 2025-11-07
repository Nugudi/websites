import { formatDate } from "@/src/shared/core/utils/date";
import type {
  Stamp,
  StampCollection,
} from "../../domain/entities/stamp.entity";
import type { StampItem } from "../types/stamp";

export const StampAdapter = {
  toUiItem(stamp: Stamp): StampItem {
    return {
      id: stamp.getId(),
      cafeteriaName: stamp.getCafeteriaName(),
      isUsed: stamp.getIsUsed(),
      issuedDate: formatDate(stamp.getIssuedAt()),
    };
  },

  toUiList(stamps: Stamp[]): StampItem[] {
    return stamps.map((stamp) => this.toUiItem(stamp));
  },

  stampCollectionToUi(collection: StampCollection) {
    return {
      stamps: this.toUiList(collection.stamps),
      totalCount: collection.totalCount,
      unusedCount: collection.unusedCount,
    };
  },

  /**
   * Get UI color based on stamp status and expiry
   *
   * Status mapping: used → gray, expired → red, expiring soon → orange, valid → green
   *
   * @param stamp - Domain stamp entity
   * @returns Color string for UI theming
   */
  getStatusColor(stamp: Stamp): string {
    if (stamp.getIsUsed()) {
      return "gray";
    }
    if (stamp.isExpired()) {
      return "red";
    }
    if (stamp.isExpiringSoon()) {
      return "orange";
    }
    return "green";
  },

  getStatusMessage(stamp: Stamp): string {
    return stamp.getStatusMessage();
  },

  /**
   * Determine if badge should be displayed
   *
   * Shows badge only for usable stamps that are expiring soon.
   *
   * @param stamp - Domain stamp entity
   * @returns True if badge should be shown
   */
  shouldShowBadge(stamp: Stamp): boolean {
    return stamp.canBeUsed() && stamp.isExpiringSoon();
  },

  canUse(stamp: Stamp): boolean {
    return stamp.canBeUsed();
  },

  /**
   * Get action button label based on stamp status
   *
   * Returns "사용 완료" for used stamps, "만료됨" for expired, "사용하기" otherwise.
   *
   * @param stamp - Domain stamp entity
   * @returns Korean label text for action button
   */
  getActionLabel(stamp: Stamp): string {
    if (stamp.getIsUsed()) {
      return "사용 완료";
    }
    if (stamp.isExpired()) {
      return "만료됨";
    }
    return "사용하기";
  },

  shouldShowInList(_stamp: Stamp): boolean {
    return true;
  },

  filterUsable(stamps: Stamp[]): Stamp[] {
    return stamps.filter((stamp) => stamp.canBeUsed());
  },

  filterExpiringSoon(stamps: Stamp[]): Stamp[] {
    return stamps.filter((stamp) => stamp.isExpiringSoon());
  },

  /**
   * Sort stamps by expiry date and usability
   *
   * Sorting order:
   * 1. Usable stamps first
   * 2. Within same usability status, sort by days until expiry (ascending)
   *
   * @param stamps - Array of domain entities
   * @returns New sorted array (does not mutate input)
   */
  sortByExpiry(stamps: Stamp[]): Stamp[] {
    return [...stamps].sort((a, b) => {
      const aUsable = a.canBeUsed();
      const bUsable = b.canBeUsed();

      if (aUsable && !bUsable) return -1;
      if (!aUsable && bUsable) return 1;

      const aDays = a.getDaysUntilExpiry();
      const bDays = b.getDaysUntilExpiry();
      return aDays - bDays;
    });
  },
};
