/**
 * Cafeteria Entity
 *
 * 구내식당 도메인 객체
 * - 프레임워크에 독립적
 * - 비즈니스 로직 포함 가능
 * - Immutable 패턴 사용
 */

/**
 * Cafeteria Entity Interface
 */
export interface Cafeteria {
  readonly id: number;
  readonly name: string;
  readonly address?: string;
  readonly phoneNumber?: string;
  readonly imageUrl?: string;
  readonly latitude?: number;
  readonly longitude?: number;
  readonly businessHours?: {
    readonly lunch?: { start: string; end: string };
    readonly dinner?: { start: string; end: string };
  };
}

/**
 * Cafeteria Entity Class (with business logic)
 *
 * Entity 클래스의 장점:
 * 1. 비즈니스 로직을 캡슐화
 * 2. 데이터 유효성 검증
 * 3. 도메인 규칙 강제
 */
export class CafeteriaEntity implements Cafeteria {
  readonly id: number;
  readonly name: string;
  readonly address?: string;
  readonly phoneNumber?: string;
  readonly imageUrl?: string;
  readonly latitude?: number;
  readonly longitude?: number;
  readonly businessHours?: {
    readonly lunch?: { start: string; end: string };
    readonly dinner?: { start: string; end: string };
  };

  constructor(params: {
    id: number;
    name: string;
    address?: string;
    phoneNumber?: string;
    imageUrl?: string;
    latitude?: number;
    longitude?: number;
    businessHours?: {
      lunch?: { start: string; end: string };
      dinner?: { start: string; end: string };
    };
  }) {
    // 검증 로직
    if (!params.id || params.id <= 0) {
      throw new Error("Cafeteria ID must be a positive number");
    }
    if (!params.name || params.name.trim().length === 0) {
      throw new Error("Cafeteria name is required");
    }

    this.id = params.id;
    this.name = params.name;
    this.address = params.address;
    this.phoneNumber = params.phoneNumber;
    this.imageUrl = params.imageUrl;
    this.latitude = params.latitude;
    this.longitude = params.longitude;
    this.businessHours = params.businessHours;
  }

  /**
   * 비즈니스 로직: 위치 정보가 있는지 확인
   */
  hasLocation(): boolean {
    return (
      this.latitude !== undefined &&
      this.longitude !== undefined &&
      !Number.isNaN(this.latitude) &&
      !Number.isNaN(this.longitude)
    );
  }

  /**
   * 비즈니스 로직: 영업시간이 설정되어 있는지 확인
   */
  hasBusinessHours(): boolean {
    return !!(
      this.businessHours &&
      (this.businessHours.lunch || this.businessHours.dinner)
    );
  }

  /**
   * 비즈니스 로직: 점심 영업 여부
   */
  hasLunchService(): boolean {
    return !!this.businessHours?.lunch;
  }

  /**
   * 비즈니스 로직: 저녁 영업 여부
   */
  hasDinnerService(): boolean {
    return !!this.businessHours?.dinner;
  }

  /**
   * 비즈니스 로직: 연락처가 있는지 확인
   */
  hasPhoneNumber(): boolean {
    return !!this.phoneNumber && this.phoneNumber.trim().length > 0;
  }

  /**
   * Entity를 Plain Object로 변환 (필요시)
   */
  toPlainObject(): Cafeteria {
    return {
      id: this.id,
      name: this.name,
      address: this.address,
      phoneNumber: this.phoneNumber,
      imageUrl: this.imageUrl,
      latitude: this.latitude,
      longitude: this.longitude,
      businessHours: this.businessHours,
    };
  }

  /**
   * 동등성 비교
   */
  equals(other: Cafeteria): boolean {
    return this.id === other.id;
  }
}
