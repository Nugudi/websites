/**
 * Review Entity
 *
 * 리뷰 도메인 엔티티
 * - API DTO 구조에 맞춘 Entity
 * - restaurantId, reviewDate, mealType, tasteTypeId 등 실제 API 필드 사용
 */

export interface Review {
  // Getter methods
  getId(): number;
  getContent(): string;
  getRestaurantId(): number;
  getReviewDate(): string;
  getMealType(): string;
  getTasteTypeId(): number;
  getMainImageUrl(): string | null;
  getLikeCount(): number;
  getCreatedAt(): string;

  // Business logic methods
  hasMainImage(): boolean;
  isLiked(): boolean;
  equals(other: Review): boolean;
}

export class ReviewEntity implements Review {
  private readonly _id: number;
  private readonly _content: string;
  private readonly _restaurantId: number;
  private readonly _reviewDate: string;
  private readonly _mealType: string;
  private readonly _tasteTypeId: number;
  private readonly _mainImageUrl: string | null;
  private readonly _likeCount: number;
  private readonly _createdAt: string;

  constructor(params: {
    id: number;
    content: string;
    restaurantId: number;
    reviewDate: string;
    mealType: string;
    tasteTypeId: number;
    mainImageUrl: string | null;
    likeCount: number;
    createdAt: string;
  }) {
    if (!params.id || params.id <= 0) {
      throw new Error("Review ID must be a positive number");
    }
    if (!params.content || params.content.trim().length === 0) {
      throw new Error("Review content is required");
    }
    if (!params.restaurantId || params.restaurantId <= 0) {
      throw new Error("Restaurant ID must be a positive number");
    }
    if (!params.reviewDate) {
      throw new Error("Review date is required");
    }
    if (!params.mealType) {
      throw new Error("Meal type is required");
    }
    if (!params.createdAt) {
      throw new Error("Created date is required");
    }

    this._id = params.id;
    this._content = params.content;
    this._restaurantId = params.restaurantId;
    this._reviewDate = params.reviewDate;
    this._mealType = params.mealType;
    this._tasteTypeId = params.tasteTypeId;
    this._mainImageUrl = params.mainImageUrl;
    this._likeCount = params.likeCount;
    this._createdAt = params.createdAt;
  }

  // Getter methods
  getId(): number {
    return this._id;
  }

  getContent(): string {
    return this._content;
  }

  getRestaurantId(): number {
    return this._restaurantId;
  }

  getReviewDate(): string {
    return this._reviewDate;
  }

  getMealType(): string {
    return this._mealType;
  }

  getTasteTypeId(): number {
    return this._tasteTypeId;
  }

  getMainImageUrl(): string | null {
    return this._mainImageUrl;
  }

  getLikeCount(): number {
    return this._likeCount;
  }

  getCreatedAt(): string {
    return this._createdAt;
  }

  // Business logic methods
  hasMainImage(): boolean {
    return !!this._mainImageUrl;
  }

  isLiked(): boolean {
    return this._likeCount > 0;
  }

  equals(other: Review): boolean {
    return this._id === other.getId();
  }
}
