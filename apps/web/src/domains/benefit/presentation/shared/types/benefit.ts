export interface BenefitItem {
  id: string;
  cafeteriaName: string;
  menuName: string;
  menuType: "점심" | "저녁" | "간식";
  originalPrice: number;
  finalPrice: number;
  discountBadge?: "특가" | "할인" | null;
  hasDiscount: boolean;
  discountPercentage: number;
  isAvailable: boolean;
  isNew: boolean;
  imageUrl?: string;
  description?: string;
}
