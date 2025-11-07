/**
 * Review Entity
 */

export interface Review {
  // Getter methods
  getId(): number;
  getContent(): string;
  getRating(): number;
  getImages(): string[] | undefined;
  getCreatedAt(): Date;
  getAuthorId(): number;
  getAuthorName(): string;
  getCafeteriaId(): number;
  getMenuId(): number;

  // Business logic methods
  hasImages(): boolean;
  isPositive(): boolean;
  isNegative(): boolean;
  isRecent(): boolean;
  isAuthoredBy(userId: number): boolean;
  toPlainObject(): {
    id: number;
    content: string;
    rating: number;
    images?: string[];
    createdAt: Date;
    authorId: number;
    authorName: string;
    cafeteriaId: number;
    menuId: number;
  };
  equals(other: Review): boolean;
}

export class ReviewEntity implements Review {
  private readonly _id: number;
  private readonly _content: string;
  private readonly _rating: number;
  private readonly _images?: string[];
  private readonly _createdAt: Date;
  private readonly _authorId: number;
  private readonly _authorName: string;
  private readonly _cafeteriaId: number;
  private readonly _menuId: number;

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

    this._id = params.id;
    this._content = params.content;
    this._rating = params.rating;
    this._images = params.images;
    this._createdAt = params.createdAt;
    this._authorId = params.authorId;
    this._authorName = params.authorName;
    this._cafeteriaId = params.cafeteriaId;
    this._menuId = params.menuId;
  }

  // Getter methods
  getId(): number {
    return this._id;
  }

  getContent(): string {
    return this._content;
  }

  getRating(): number {
    return this._rating;
  }

  getImages(): string[] | undefined {
    return this._images;
  }

  getCreatedAt(): Date {
    return this._createdAt;
  }

  getAuthorId(): number {
    return this._authorId;
  }

  getAuthorName(): string {
    return this._authorName;
  }

  getCafeteriaId(): number {
    return this._cafeteriaId;
  }

  getMenuId(): number {
    return this._menuId;
  }

  hasImages(): boolean {
    return !!this._images && this._images.length > 0;
  }

  isPositive(): boolean {
    return this._rating >= 4;
  }

  isNegative(): boolean {
    return this._rating <= 2;
  }

  isRecent(): boolean {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return this._createdAt >= sevenDaysAgo;
  }

  isAuthoredBy(userId: number): boolean {
    return this._authorId === userId;
  }

  toPlainObject() {
    return {
      id: this._id,
      content: this._content,
      rating: this._rating,
      images: this._images,
      createdAt: this._createdAt,
      authorId: this._authorId,
      authorName: this._authorName,
      cafeteriaId: this._cafeteriaId,
      menuId: this._menuId,
    };
  }

  equals(other: Review): boolean {
    return this._id === other.getId();
  }
}
