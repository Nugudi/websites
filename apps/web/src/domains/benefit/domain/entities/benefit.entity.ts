/**
 * Benefit Entity
 *
 * Domain Layer의 비즈니스 객체
 *
 * @remarks
 * - Clean Architecture: Domain 계층의 핵심 비즈니스 로직
 * - 불변성 보장 (readonly properties)
 * - 생성자에서 검증 수행 (BenefitError 사용)
 * - 비즈니스 규칙은 constants 사용 (하드코딩 방지)
 */

import {
  BENEFIT_ID_VALIDATION,
  DISCOUNT_VALIDATION,
  MENU_NAME_VALIDATION,
  MENU_TYPE,
  NEW_ITEM_DURATION_DAYS,
  PRICE_VALIDATION,
} from "../config/constants";
import { BENEFIT_ERROR_CODES, BenefitError } from "../errors/benefit-error";
import type { MenuType } from "../types/common";

export class Benefit {
  private readonly _id: string;
  private readonly _cafeteriaId: string;
  private readonly _cafeteriaName: string;
  private readonly _menuName: string;
  private readonly _menuType: MenuType;
  private readonly _price: number;
  private readonly _availableAt: string;
  private readonly _createdAt: string;
  private readonly _discountedPrice?: number;
  private readonly _description?: string;
  private readonly _imageUrl?: string;

  constructor(
    id: string,
    cafeteriaId: string,
    cafeteriaName: string,
    menuName: string,
    menuType: MenuType,
    price: number,
    availableAt: string,
    createdAt: string,
    discountedPrice?: number,
    description?: string,
    imageUrl?: string,
  ) {
    // Benefit ID 검증
    if (!id || id.trim().length === 0) {
      throw new BenefitError(
        BENEFIT_ID_VALIDATION.MESSAGES.REQUIRED,
        BENEFIT_ERROR_CODES.BENEFIT_ID_REQUIRED,
      );
    }

    // Menu Name 검증
    const trimmedMenuName = menuName?.trim() ?? "";
    if (trimmedMenuName.length === 0) {
      throw new BenefitError(
        MENU_NAME_VALIDATION.MESSAGES.REQUIRED,
        BENEFIT_ERROR_CODES.INVALID_MENU_NAME,
      );
    }
    if (trimmedMenuName.length < MENU_NAME_VALIDATION.MIN_LENGTH) {
      throw new BenefitError(
        MENU_NAME_VALIDATION.MESSAGES.TOO_SHORT,
        BENEFIT_ERROR_CODES.INVALID_MENU_NAME,
      );
    }
    if (trimmedMenuName.length > MENU_NAME_VALIDATION.MAX_LENGTH) {
      throw new BenefitError(
        MENU_NAME_VALIDATION.MESSAGES.TOO_LONG,
        BENEFIT_ERROR_CODES.INVALID_MENU_NAME,
      );
    }

    // Price 검증
    if (price < PRICE_VALIDATION.MIN_VALUE) {
      throw new BenefitError(
        PRICE_VALIDATION.MESSAGES.TOO_LOW,
        BENEFIT_ERROR_CODES.INVALID_PRICE,
      );
    }
    if (price > PRICE_VALIDATION.MAX_VALUE) {
      throw new BenefitError(
        PRICE_VALIDATION.MESSAGES.TOO_HIGH,
        BENEFIT_ERROR_CODES.INVALID_PRICE,
      );
    }

    // Discounted Price 검증
    if (discountedPrice !== undefined) {
      if (discountedPrice < PRICE_VALIDATION.MIN_VALUE) {
        throw new BenefitError(
          DISCOUNT_VALIDATION.MESSAGES.INVALID,
          BENEFIT_ERROR_CODES.INVALID_DISCOUNT_PRICE,
        );
      }
      if (discountedPrice > price) {
        throw new BenefitError(
          DISCOUNT_VALIDATION.MESSAGES.HIGHER_THAN_PRICE,
          BENEFIT_ERROR_CODES.INVALID_DISCOUNT_PRICE,
        );
      }
    }

    this._id = id;
    this._cafeteriaId = cafeteriaId;
    this._cafeteriaName = cafeteriaName;
    this._menuName = menuName;
    this._menuType = menuType;
    this._price = price;
    this._availableAt = availableAt;
    this._createdAt = createdAt;
    this._discountedPrice = discountedPrice;
    this._description = description;
    this._imageUrl = imageUrl;
  }

  // Getter methods
  getId(): string {
    return this._id;
  }

  getCafeteriaId(): string {
    return this._cafeteriaId;
  }

  getCafeteriaName(): string {
    return this._cafeteriaName;
  }

  getMenuName(): string {
    return this._menuName;
  }

  getMenuType(): MenuType {
    return this._menuType;
  }

  getPrice(): number {
    return this._price;
  }

  getAvailableAt(): string {
    return this._availableAt;
  }

  getCreatedAt(): string {
    return this._createdAt;
  }

  getDiscountedPrice(): number | undefined {
    return this._discountedPrice;
  }

  getDescription(): string | undefined {
    return this._description;
  }

  getImageUrl(): string | undefined {
    return this._imageUrl;
  }

  /**
   * Business Logic: 할인이 적용되어 있는지 확인
   * @returns 할인 여부
   */
  hasDiscount(): boolean {
    return (
      this._discountedPrice !== undefined &&
      this._discountedPrice < this._price &&
      this._discountedPrice >= 0
    );
  }

  /**
   * Business Logic: 할인율 계산 (%)
   * @returns 할인율 (0-100), 할인이 없으면 0
   */
  getDiscountPercentage(): number {
    if (!this.hasDiscount() || !this._discountedPrice) {
      return 0;
    }
    return Math.round(
      ((this._price - this._discountedPrice) / this._price) * 100,
    );
  }

  /**
   * Business Logic: 할인 금액 계산
   * @returns 할인 금액, 할인이 없으면 0
   */
  getDiscountAmount(): number {
    if (!this.hasDiscount() || !this._discountedPrice) {
      return 0;
    }
    return this._price - this._discountedPrice;
  }

  /**
   * Business Logic: 최종 결제 금액 반환
   * - 할인이 있으면 할인가, 없으면 정가
   * @returns 최종 금액
   */
  getFinalPrice(): number {
    return this.hasDiscount() && this._discountedPrice
      ? this._discountedPrice
      : this._price;
  }

  /**
   * Business Logic: 현재 시점에 이용 가능한지 확인
   * - availableAt 시간 이후에만 이용 가능
   * @returns 이용 가능 여부
   */
  isAvailableNow(): boolean {
    const availableDate = new Date(this._availableAt);
    const now = new Date();
    return now >= availableDate;
  }

  /**
   * Business Logic: 특정 시점에 이용 가능한지 확인
   * @param date 확인할 시점
   * @returns 이용 가능 여부
   */
  isAvailableAt(date: Date): boolean {
    const availableDate = new Date(this._availableAt);
    return date >= availableDate;
  }

  /**
   * Business Logic: 점심 메뉴인지 확인
   * @returns 점심 메뉴 여부
   */
  isLunchMenu(): boolean {
    return this._menuType === MENU_TYPE.LUNCH;
  }

  /**
   * Business Logic: 저녁 메뉴인지 확인
   * @returns 저녁 메뉴 여부
   */
  isDinnerMenu(): boolean {
    return this._menuType === MENU_TYPE.DINNER;
  }

  /**
   * Business Logic: 간식 메뉴인지 확인
   * @returns 간식 메뉴 여부
   */
  isSnackMenu(): boolean {
    return this._menuType === MENU_TYPE.SNACK;
  }

  /**
   * Business Logic: 이미지가 있는지 확인
   * @returns 이미지 존재 여부
   */
  hasImage(): boolean {
    return Boolean(this._imageUrl);
  }

  /**
   * Business Logic: 설명이 있는지 확인
   * @returns 설명 존재 여부
   */
  hasDescription(): boolean {
    return Boolean(this._description);
  }

  /**
   * Business Logic: 신규 메뉴인지 확인 (등록 후 7일 이내)
   * @returns 신규 메뉴 여부
   */
  isNew(): boolean {
    const createdDate = new Date(this._createdAt);
    const now = new Date();
    const diffInDays = Math.floor(
      (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24),
    );
    return diffInDays <= NEW_ITEM_DURATION_DAYS;
  }

  /**
   * Business Logic: 특가 할인 여부 확인 (30% 이상)
   * @returns 특가 여부
   */
  isSpecialSale(): boolean {
    const discountPercentage = this.getDiscountPercentage();
    return discountPercentage >= DISCOUNT_VALIDATION.SPECIAL_SALE_THRESHOLD;
  }

  /**
   * Business Logic: 일반 할인 여부 확인 (10% 이상)
   * @returns 할인 여부
   */
  isSale(): boolean {
    const discountPercentage = this.getDiscountPercentage();
    return discountPercentage >= DISCOUNT_VALIDATION.SALE_THRESHOLD;
  }
}

export interface BenefitList {
  benefits: Benefit[];
  totalCount: number;
}

// Re-export commonly used types and constants
export { MENU_TYPE } from "../config/constants";
export type { MenuType } from "../types/common";
