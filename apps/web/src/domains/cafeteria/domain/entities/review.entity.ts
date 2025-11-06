/**
 * Review Entity
 *
 * 리뷰 도메인 객체
 * - 프레임워크에 독립적
 * - 비즈니스 로직 포함 가능
 * - Immutable 패턴 사용
 */

/**
 * Review Entity Interface
 */
export interface Review {
  readonly id: number;
  readonly content: string;
  readonly rating: number;
  readonly images?: string[];
  readonly createdAt: Date;
  readonly authorId: number;
  readonly authorName: string;
  readonly cafeteriaId: number;
  readonly menuId: number;
}

/**
 * Review Entity Class (with business logic)
 */
export class ReviewEntity implements Review {
  readonly id: number;
  readonly content: string;
  readonly rating: number;
  readonly images?: string[];
  readonly createdAt: Date;
  readonly authorId: number;
  readonly authorName: string;
  readonly cafeteriaId: number;
  readonly menuId: number;

  constructor(params: {
    id: number;
    content: string;
    rating: number;
    images?: string[];
    createdAt: Date;
    authorId: number;
    authorName: string;
    cafeteriaId: number;
    menuId: number;
  }) {
    // 검증 로직
    if (!params.id || params.id <= 0) {
      throw new Error("Review ID must be a positive number");
    }
    if (!params.content || params.content.trim().length === 0) {
      throw new Error("Review content is required");
    }
    if (params.rating < 1 || params.rating > 5) {
      throw new Error("Rating must be between 1 and 5");
    }
    if (!params.createdAt) {
      throw new Error("Created date is required");
    }

    this.id = params.id;
    this.content = params.content;
    this.rating = params.rating;
    this.images = params.images;
    this.createdAt = params.createdAt;
    this.authorId = params.authorId;
    this.authorName = params.authorName;
    this.cafeteriaId = params.cafeteriaId;
    this.menuId = params.menuId;
  }

  /**
   * 비즈니스 로직: 이미지가 있는지 확인
   */
  hasImages(): boolean {
    return !!this.images && this.images.length > 0;
  }

  /**
   * 비즈니스 로직: 높은 평점인지 (4점 이상)
   */
  isPositive(): boolean {
    return this.rating >= 4;
  }

  /**
   * 비즈니스 로직: 낮은 평점인지 (2점 이하)
   */
  isNegative(): boolean {
    return this.rating <= 2;
  }

  /**
   * 비즈니스 로직: 최근 리뷰인지 (7일 이내)
   */
  isRecent(): boolean {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return this.createdAt >= sevenDaysAgo;
  }

  /**
   * 비즈니스 로직: 리뷰 작성자가 특정 사용자인지 확인
   */
  isAuthoredBy(userId: number): boolean {
    return this.authorId === userId;
  }

  /**
   * Entity를 Plain Object로 변환
   */
  toPlainObject(): Review {
    return {
      id: this.id,
      content: this.content,
      rating: this.rating,
      images: this.images,
      createdAt: this.createdAt,
      authorId: this.authorId,
      authorName: this.authorName,
      cafeteriaId: this.cafeteriaId,
      menuId: this.menuId,
    };
  }

  /**
   * 동등성 비교
   */
  equals(other: Review): boolean {
    return this.id === other.id;
  }
}
