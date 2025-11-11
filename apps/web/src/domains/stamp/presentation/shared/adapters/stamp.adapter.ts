import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ko";

import { formatDate } from "@core/utils/date";
import type {
  Stamp,
  StampCollection,
} from "../../../domain/entities/stamp.entity";
import type { StampItem } from "../types/stamp";

// Set Korean locale and enable relative time plugin
dayjs.extend(relativeTime);
dayjs.locale("ko");

export const StampAdapter = {
  /**
   * Transform Stamp entity to UI item
   *
   * Converts domain Stamp entity to presentation-layer StampItem type.
   *
   * @param stamp - Domain Stamp entity
   * @returns UI-safe StampItem type
   */
  toUiItem(stamp: Stamp): StampItem {
    return {
      id: stamp.getId(),
      cafeteriaName: stamp.getCafeteriaName(),
      isUsed: stamp.getIsUsed(),
      issuedDate: formatDate(stamp.getIssuedAt()),
    };
  },

  /**
   * Transform array of Stamp entities to UI item array
   *
   * @param stamps - Array of domain Stamp entities
   * @returns Array of UI-safe StampItem types
   */
  toUiList(stamps: Stamp[]): StampItem[] {
    return stamps.map((stamp) => this.toUiItem(stamp));
  },

  /**
   * Transform StampCollection entity to UI collection object
   *
   * @param collection - Domain StampCollection entity containing stamps and metadata
   * @returns UI object with stamps array, total count, and unused count
   */
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

  /**
   * Get status message text in Korean
   *
   * @description
   * Uses Entity's boolean methods (getIsUsed, isExpired, isExpiringSoon)
   * and getDaysUntilExpiry() to determine stamp status and returns
   * appropriate Korean status message.
   *
   * Status priority:
   * 1. Used → "사용 완료"
   * 2. Expired → "기간 만료"
   * 3. Expiring soon → "X일 후 만료"
   * 4. Valid → "사용 가능"
   *
   * @param stamp - Domain stamp entity
   * @returns Korean status message
   */
  getStatusMessage(stamp: Stamp): string {
    if (stamp.getIsUsed()) {
      return "사용 완료";
    }
    if (stamp.isExpired()) {
      return "기간 만료";
    }
    if (stamp.isExpiringSoon()) {
      const days = stamp.getDaysUntilExpiry();
      return `${days}일 후 만료`;
    }
    return "사용 가능";
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

  /**
   * Determine if stamp can be used
   *
   * @param stamp - Domain stamp entity
   * @returns True if stamp is usable
   */
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

  /**
   * Determine if stamp should be shown in list
   *
   * @param _stamp - Domain stamp entity (unused)
   * @returns Always true (all stamps shown in list)
   */
  shouldShowInList(_stamp: Stamp): boolean {
    return true;
  },

  /**
   * Filter stamps to only usable ones
   *
   * @param stamps - Array of domain stamp entities
   * @returns Array containing only usable stamps
   */
  filterUsable(stamps: Stamp[]): Stamp[] {
    return stamps.filter((stamp) => stamp.canBeUsed());
  },

  /**
   * Filter stamps to only those expiring soon
   *
   * @param stamps - Array of domain stamp entities
   * @returns Array containing only stamps expiring soon
   */
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
