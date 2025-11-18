/**
 * Cafeteria Entity
 */

import type { BusinessHours } from "./business-hours.entity";

/** 구내식당 Entity - Constructor Props */
export interface CafeteriaProps {
  readonly id: number;
  readonly name: string;
  readonly address: string;
  readonly addressDetail: string | null;
  readonly latitude: number | null;
  readonly longitude: number | null;
  readonly phone: string | null;
  readonly mealTicketPrice: number | null;
  readonly takeoutAvailable: boolean;
  readonly businessHours: BusinessHours | null;
}

/** 구내식당 Entity - Class */
export class CafeteriaEntity {
  private readonly _id: number;
  private readonly _name: string;
  private readonly _address: string;
  private readonly _addressDetail: string | null;
  private readonly _latitude: number | null;
  private readonly _longitude: number | null;
  private readonly _phone: string | null;
  private readonly _mealTicketPrice: number | null;
  private readonly _takeoutAvailable: boolean;
  private readonly _businessHours: BusinessHours | null;

  constructor(props: CafeteriaProps) {
    // Validation
    if (!props.name || props.name.trim().length === 0) {
      throw new Error("Cafeteria name is required");
    }
    if (props.name.length > 100) {
      throw new Error("Cafeteria name must be 100 characters or less");
    }
    if (!props.address || props.address.trim().length === 0) {
      throw new Error("Cafeteria address is required");
    }
    if (props.address.length > 200) {
      throw new Error("Cafeteria address must be 200 characters or less");
    }

    this._id = props.id;
    this._name = props.name;
    this._address = props.address;
    this._addressDetail = props.addressDetail;
    this._latitude = props.latitude;
    this._longitude = props.longitude;
    this._phone = props.phone;
    this._mealTicketPrice = props.mealTicketPrice;
    this._takeoutAvailable = props.takeoutAvailable;
    this._businessHours = props.businessHours;
  }

  // Getters
  getId(): number {
    return this._id;
  }

  getName(): string {
    return this._name;
  }

  getAddress(): string {
    return this._address;
  }

  getAddressDetail(): string | null {
    return this._addressDetail;
  }

  getLatitude(): number | null {
    return this._latitude;
  }

  getLongitude(): number | null {
    return this._longitude;
  }

  getPhone(): string | null {
    return this._phone;
  }

  getMealTicketPrice(): number | null {
    return this._mealTicketPrice;
  }

  getTakeoutAvailable(): boolean {
    return this._takeoutAvailable;
  }

  getBusinessHours(): BusinessHours | null {
    return this._businessHours;
  }

  // Business Logic Methods

  // === State Validation ===

  /**
   * 영업시간 정보가 있는지 확인
   */
  hasBusinessHours(): boolean {
    return this._businessHours !== null;
  }

  /**
   * 위치 정보(좌표)가 있는지 확인
   */
  hasLocation(): boolean {
    return this._latitude !== null && this._longitude !== null;
  }

  /**
   * 전화번호 정보가 있는지 확인
   */
  hasPhone(): boolean {
    return this._phone !== null && this._phone.trim().length > 0;
  }

  /**
   * 식권 가격 정보가 있는지 확인
   */
  hasMealTicketPrice(): boolean {
    return this._mealTicketPrice !== null && this._mealTicketPrice > 0;
  }

  /**
   * 영업시간 비고 정보가 있는지 확인
   */
  hasNote(): boolean {
    return this._businessHours?.hasNote() ?? false;
  }

  // === Operating Status ===

  /**
   * 특정 시간에 영업 중인지 확인
   * @param date 확인할 시간
   * @returns 영업 중이면 true
   */
  isOpenAt(date: Date): boolean {
    if (!this._businessHours) {
      return false;
    }

    const hour = date.getHours();
    const minute = date.getMinutes();

    // Delegate to BusinessHoursEntity
    return (
      this._businessHours.isOpenAt(hour, minute, "lunch") ||
      this._businessHours.isOpenAt(hour, minute, "dinner")
    );
  }

  /**
   * 현재 시간에 영업 중인지 확인
   */
  isOpenNow(): boolean {
    return this.isOpenAt(new Date());
  }

  /**
   * 현재 영업 시간대 확인
   * @returns 'lunch' | 'dinner' | 'closed'
   */
  getCurrentPeriod(): "lunch" | "dinner" | "closed" {
    if (!this._businessHours) {
      return "closed";
    }

    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();

    // Delegate to BusinessHoursEntity
    if (this._businessHours.isOpenAt(hour, minute, "lunch")) {
      return "lunch";
    }

    if (this._businessHours.isOpenAt(hour, minute, "dinner")) {
      return "dinner";
    }

    return "closed";
  }

  // === Feature Checks ===

  /**
   * 포장 가능 여부
   */
  canTakeout(): boolean {
    return this._takeoutAvailable;
  }

  // === Computed Values ===

  /**
   * 전체 주소 반환 (기본 주소 + 상세 주소)
   */
  getFullAddress(): string {
    if (this._addressDetail) {
      return `${this._address} ${this._addressDetail}`;
    }
    return this._address;
  }

  /**
   * 특정 위치로부터의 거리 계산 (Haversine formula)
   * @param lat 목표 위도
   * @param lng 목표 경도
   * @returns 거리 (km), 위치 정보가 없으면 null
   */
  getDistanceFrom(lat: number, lng: number): number | null {
    if (this._latitude === null || this._longitude === null) {
      return null;
    }

    const cafeteriaLat = this._latitude;
    const cafeteriaLng = this._longitude;

    const R = 6371; // 지구 반경 (km)
    const dLat = this.toRad(lat - cafeteriaLat);
    const dLon = this.toRad(lng - cafeteriaLng);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(cafeteriaLat)) *
        Math.cos(this.toRad(lat)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return Math.round(distance * 100) / 100; // 소수점 2자리까지
  }

  // === Validation ===

  /**
   * Entity 유효성 검증
   * @returns 검증 에러 배열 (빈 배열이면 유효함)
   */
  validate(): string[] {
    const errors: string[] = [];

    if (!this._name || this._name.trim().length === 0) {
      errors.push("Cafeteria name is required");
    }
    if (this._name.length > 100) {
      errors.push("Cafeteria name must be 100 characters or less");
    }
    if (!this._address || this._address.trim().length === 0) {
      errors.push("Cafeteria address is required");
    }
    if (this._address.length > 200) {
      errors.push("Cafeteria address must be 200 characters or less");
    }
    if (this._phone && this._phone.length > 20) {
      errors.push("Phone number must be 20 characters or less");
    }
    if (this._mealTicketPrice !== null && this._mealTicketPrice < 0) {
      errors.push("Meal ticket price must be non-negative");
    }

    return errors;
  }

  // === Private Helper Methods ===

  /**
   * 도를 라디안으로 변환
   */
  private toRad(degrees: number): number {
    return (degrees * Math.PI) / 180;
  }
}

/** 구내식당 Entity - Type Alias for compatibility */
export type Cafeteria = CafeteriaEntity;
