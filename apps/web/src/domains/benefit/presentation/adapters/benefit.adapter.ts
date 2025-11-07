import type {
  Benefit,
  BenefitList,
} from "../../domain/entities/benefit.entity";
import type { BenefitItem } from "../types/benefit";

function getMenuTypeUi(benefit: Benefit): "점심" | "저녁" | "간식" {
  const displayName = benefit.getMenuTypeDisplayName();

  if (
    displayName === "점심" ||
    displayName === "저녁" ||
    displayName === "간식"
  ) {
    return displayName;
  }

  console.error(
    `Invalid menuType displayName: ${displayName} for benefit ${benefit.getId()}`,
  );
  return "점심";
}

function getDiscountBadgeUi(benefit: Benefit): "특가" | "할인" | null {
  const badge = benefit.getDiscountBadge();

  if (badge === null) {
    return null;
  }

  if (badge === "특가" || badge === "할인") {
    return badge;
  }

  console.error(
    `Invalid discountBadge: ${badge} for benefit ${benefit.getId()}`,
  );
  return null;
}

export const BenefitAdapter = {
  /**
   * Private helpers ensure invalid states can't escape to presentation.
   */
  toUiItem(benefit: Benefit): BenefitItem {
    return {
      id: benefit.getId(),
      cafeteriaName: benefit.getCafeteriaName(),
      menuName: benefit.getMenuName(),
      imageUrl: benefit.getImageUrl(),
      description: benefit.getDescription(),

      menuType: getMenuTypeUi(benefit),
      originalPrice: benefit.getPrice(),
      finalPrice: benefit.getFinalPrice(),
      discountBadge: getDiscountBadgeUi(benefit),
      hasDiscount: benefit.hasDiscount(),
      discountPercentage: benefit.getDiscountPercentage(),
      isAvailable: benefit.isAvailableNow(),
      isNew: benefit.isNew(),
    };
  },

  toUiList(benefits: Benefit[]): BenefitItem[] {
    return benefits.map((benefit) => this.toUiItem(benefit));
  },

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
