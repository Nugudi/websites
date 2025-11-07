/**
 * Stamp Entity
 */

export class Stamp {
  private readonly _id: string;
  private readonly _userId: string;
  private readonly _cafeteriaId: string;
  private readonly _cafeteriaName: string;
  private readonly _issuedAt: string;
  private readonly _isUsed: boolean;
  private readonly _expiresAt?: string;
  private readonly _usedAt?: string;

  constructor(
    id: string,
    userId: string,
    cafeteriaId: string,
    cafeteriaName: string,
    issuedAt: string,
    isUsed: boolean,
    expiresAt?: string,
    usedAt?: string,
  ) {
    this._id = id;
    this._userId = userId;
    this._cafeteriaId = cafeteriaId;
    this._cafeteriaName = cafeteriaName;
    this._issuedAt = issuedAt;
    this._isUsed = isUsed;
    this._expiresAt = expiresAt;
    this._usedAt = usedAt;
  }

  // Getter methods
  getId(): string {
    return this._id;
  }

  getUserId(): string {
    return this._userId;
  }

  getCafeteriaId(): string {
    return this._cafeteriaId;
  }

  getCafeteriaName(): string {
    return this._cafeteriaName;
  }

  getIssuedAt(): string {
    return this._issuedAt;
  }

  getIsUsed(): boolean {
    return this._isUsed;
  }

  getExpiresAt(): string | undefined {
    return this._expiresAt;
  }

  getUsedAt(): string | undefined {
    return this._usedAt;
  }

  /**
   * Business Logic: 스탬프가 만료되었는지 확인
   * - expiresAt이 없으면 만료되지 않음
   * - expiresAt이 현재 시간보다 과거면 만료
   * @returns 만료 여부
   */
  isExpired(): boolean {
    if (!this._expiresAt) {
      return false; // 만료 기한이 없으면 만료되지 않음
    }
    const expiryDate = new Date(this._expiresAt);
    const now = new Date();
    return now > expiryDate;
  }

  /**
   * Business Logic: 스탬프를 사용할 수 있는지 확인
   * - 사용되지 않았고 만료되지 않은 경우에만 사용 가능
   * @returns 사용 가능 여부
   */
  canBeUsed(): boolean {
    return !this._isUsed && !this.isExpired();
  }

  /**
   * Business Logic: 스탬프를 사용 처리
   * @returns 사용 상태로 변경된 새 Stamp 인스턴스
   */
  markAsUsed(): Stamp {
    if (this._isUsed) {
      return this; // 이미 사용된 스탬프면 그대로 반환
    }

    if (this.isExpired()) {
      throw new Error("Expired stamp cannot be used");
    }

    return new Stamp(
      this._id,
      this._userId,
      this._cafeteriaId,
      this._cafeteriaName,
      this._issuedAt,
      true, // isUsed = true
      this._expiresAt,
      new Date().toISOString(), // usedAt = 현재 시간
    );
  }

  /**
   * Business Logic: 스탬프가 유효한지 확인
   * - 발급되었고 사용되지 않았으며 만료되지 않은 경우 유효
   * @returns 유효 여부
   */
  isValid(): boolean {
    return !this._isUsed && !this.isExpired();
  }

  /**
   * Business Logic: 만료까지 남은 일수 계산
   * - expiresAt이 없으면 Infinity 반환
   * - 이미 만료된 경우 음수 반환
   * @returns 만료까지 남은 일수
   */
  getDaysUntilExpiry(): number {
    if (!this._expiresAt) {
      return Infinity; // 만료 기한이 없으면 무한대
    }

    const expiryDate = new Date(this._expiresAt);
    const now = new Date();
    const diffInMs = expiryDate.getTime() - now.getTime();
    return Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  }

  /**
   * Business Logic: 스탬프가 곧 만료되는지 확인 (7일 이내)
   * @returns 곧 만료 여부
   */
  isExpiringSoon(): boolean {
    if (!this._expiresAt) {
      return false; // 만료 기한이 없으면 곧 만료되지 않음
    }

    const daysUntilExpiry = this.getDaysUntilExpiry();
    return daysUntilExpiry >= 0 && daysUntilExpiry <= 7;
  }

  /**
   * Business Logic: 스탬프가 최근에 발급되었는지 확인 (7일 이내)
   * @returns 최근 발급 여부
   */
  isRecentlyIssued(): boolean {
    const issuedDate = new Date(this._issuedAt);
    const now = new Date();
    const diffInDays = Math.floor(
      (now.getTime() - issuedDate.getTime()) / (1000 * 60 * 60 * 24),
    );
    return diffInDays <= 7;
  }

  /**
   * Business Logic: 스탬프 사용 가능 상태를 설명하는 메시지 반환
   * @returns 상태 메시지
   */
  getStatusMessage(): string {
    if (this._isUsed) {
      return "사용 완료";
    }
    if (this.isExpired()) {
      return "기간 만료";
    }
    if (this.isExpiringSoon()) {
      const days = this.getDaysUntilExpiry();
      return `${days}일 후 만료`;
    }
    return "사용 가능";
  }
}

export interface StampCollection {
  stamps: Stamp[];
  totalCount: number;
  unusedCount: number;
}
