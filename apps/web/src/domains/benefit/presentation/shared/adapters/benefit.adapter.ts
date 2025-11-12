import type {
  Benefit,
  BenefitList,
} from "../../../domain/entities/benefit.entity";
import type { BenefitItem } from "../types/benefit";

/**
 * Private helper: Maps menu type boolean checks to Korean UI text
 *
 * @description
 * Uses Entity's boolean methods (isLunchMenu, isDinnerMenu, isSnackMenu)
 * to determine meal type and returns appropriate Korean label.
 *
 * @param benefit - Domain Benefit entity
 * @returns Korean menu type label
 */
function _getMenuTypeUi(benefit: Benefit): "점심" | "저녁" | "간식" {
  if (benefit.isLunchMenu()) {
    return "점심";
  }
  if (benefit.isDinnerMenu()) {
    return "저녁";
  }
  if (benefit.isSnackMenu()) {
    return "간식";
  }

  // Fallback - should never happen with proper data
  console.error(`Unknown menuType for benefit ${benefit.getId()}`);
  return "점심";
}

/**
 * Private helper: Maps discount boolean checks to Korean badge text
 *
 * @description
 * Uses Entity's boolean methods (isSpecialSale, isSale) to determine
 * discount level and returns appropriate Korean badge label.
 * - isSpecialSale (30%+) → "특가"
 * - isSale (10-29%) → "할인"
 * - < 10% → null
 *
 * @param benefit - Domain Benefit entity
 * @returns Korean discount badge or null
 */
function _getDiscountBadgeUi(benefit: Benefit): "특가" | "할인" | null {
  if (benefit.isSpecialSale()) {
    return "특가";
  }
  if (benefit.isSale()) {
    return "할인";
  }
  return null;
}

export const BenefitAdapter = {
  /**
   * Transform Benefit entity to UI item
   *
   * Converts domain Benefit entity to presentation-layer BenefitItem type.
   * Validates menu type and discount badge values to ensure type safety.
   *
   * @param benefit - Domain Benefit entity
   * @returns UI-safe BenefitItem type
   */
  toUiItem(benefit: Benefit): BenefitItem {
    return {
      id: benefit.getId(),
      cafeteriaName: benefit.getCafeteriaName(),
      menuName: benefit.getMenuName(),
      imageUrl: benefit.getImageUrl(),
      description: benefit.getDescription(),

      menuType: _getMenuTypeUi(benefit),
      originalPrice: benefit.getPrice(),
      finalPrice: benefit.getFinalPrice(),
      discountBadge: _getDiscountBadgeUi(benefit),
      hasDiscount: benefit.hasDiscount(),
      discountPercentage: benefit.getDiscountPercentage(),
      isAvailable: benefit.isAvailableNow(),
      isNew: benefit.isNew(),
    };
  },

  /**
   * Transform array of Benefit entities to UI item array
   *
   * @param benefits - Array of domain Benefit entities
   * @returns Array of UI-safe BenefitItem types
   */
  toUiList(benefits: Benefit[]): BenefitItem[] {
    return benefits.map((benefit) => this.toUiItem(benefit));
  },

  /**
   * Transform BenefitList entity to UI list object
   *
   * @param list - Domain BenefitList entity containing benefits and metadata
   * @returns UI object with benefits array and total count
   */
  benefitListToUi(list: BenefitList) {
    return {
      benefits: this.toUiList(list.benefits),
      totalCount: list.totalCount,
    };
  },

  /**
   * Get UI color based on benefit availability and discount rate
   *
   * Discount mapping: 30%+ → red, 10%+ → orange, <10% → blue
   * Unavailable benefits → gray
   *
   * @param benefit - Domain benefit entity
   * @returns Color string for UI theming
   */
  getStatusColor(benefit: Benefit): string {
    if (!benefit.isAvailableNow()) {
      return "gray";
    }

    const discountPercentage = benefit.getDiscountPercentage();
    if (discountPercentage >= 30) {
      return "red";
    }
    if (discountPercentage >= 10) {
      return "orange";
    }

    return "blue";
  },

  /**
   * Determine if benefit can be purchased
   *
   * @param benefit - Domain Benefit entity
   * @returns True if benefit is available for purchase
   */
  canPurchase(benefit: Benefit): boolean {
    return benefit.isAvailableNow();
  },

  /**
   * Get formatted price display for UI rendering
   *
   * Returns Korean-formatted prices with strikethrough flag for discounted items.
   *
   * @param benefit - Domain benefit entity
   * @returns Object with formatted original/final prices and strikethrough flag
   */
  getPriceDisplay(benefit: Benefit): {
    original: string;
    final: string;
    showStrikethrough: boolean;
  } {
    const hasDiscount = benefit.hasDiscount();
    const originalPrice = benefit.getPrice().toLocaleString("ko-KR");
    const finalPrice = benefit.getFinalPrice().toLocaleString("ko-KR");

    return {
      original: `${originalPrice}원`,
      final: `${finalPrice}원`,
      showStrikethrough: hasDiscount,
    };
  },
};
