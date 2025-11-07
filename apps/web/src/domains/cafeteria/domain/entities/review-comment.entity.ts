/**
 * Review Comment Entity
 */

export interface ReviewComment {
  // Getter methods
  getId(): number;
  getContent(): string;
  getCreatedAt(): Date;
  getAuthorId(): number;
  getAuthorName(): string;
  getReviewId(): number;
  getParentCommentId(): number | undefined;
  getStatus(): "ACTIVE" | "DELETED";
  getReplyCount(): number | undefined;

  // Business logic methods
  isReply(): boolean;
  isTopLevel(): boolean;
  isActive(): boolean;
  isDeleted(): boolean;
  hasReplies(): boolean;
  isRecent(): boolean;
  isAuthoredBy(userId: number): boolean;
  toPlainObject(): {
    id: number;
    content: string;
    createdAt: Date;
    authorId: number;
    authorName: string;
    reviewId: number;
    parentCommentId?: number;
    status: "ACTIVE" | "DELETED";
    replyCount?: number;
  };
  equals(other: ReviewComment): boolean;
}

export class ReviewCommentEntity implements ReviewComment {
  private readonly _id: number;
  private readonly _content: string;
  private readonly _createdAt: Date;
  private readonly _authorId: number;
  private readonly _authorName: string;
  private readonly _reviewId: number;
  private readonly _parentCommentId?: number;
  private readonly _status: "ACTIVE" | "DELETED";
  private readonly _replyCount?: number;

  constructor(params: {
    id: number;
    content: string;
    createdAt: Date;
    authorId: number;
    authorName: string;
    reviewId: number;
    parentCommentId?: number;
    status: "ACTIVE" | "DELETED";
    replyCount?: number;
  }) {
    if (!params.id || params.id <= 0) {
      throw new Error("Comment ID must be a positive number");
    }
    if (!params.content || params.content.trim().length === 0) {
      throw new Error("Comment content is required");
    }
    if (!params.createdAt) {
      throw new Error("Created date is required");
    }

    this._id = params.id;
    this._content = params.content;
    this._createdAt = params.createdAt;
    this._authorId = params.authorId;
    this._authorName = params.authorName;
    this._reviewId = params.reviewId;
    this._parentCommentId = params.parentCommentId;
    this._status = params.status;
    this._replyCount = params.replyCount;
  }

  // Getter methods
  getId(): number {
    return this._id;
  }

  getContent(): string {
    return this._content;
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

  getReviewId(): number {
    return this._reviewId;
  }

  getParentCommentId(): number | undefined {
    return this._parentCommentId;
  }

  getStatus(): "ACTIVE" | "DELETED" {
    return this._status;
  }

  getReplyCount(): number | undefined {
    return this._replyCount;
  }

  isReply(): boolean {
    return !!this._parentCommentId;
  }

  isTopLevel(): boolean {
    return !this._parentCommentId;
  }

  isActive(): boolean {
    return this._status === "ACTIVE";
  }

  isDeleted(): boolean {
    return this._status === "DELETED";
  }

  hasReplies(): boolean {
    return (this._replyCount ?? 0) > 0;
  }

  isRecent(): boolean {
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    return this._createdAt >= oneDayAgo;
  }

  isAuthoredBy(userId: number): boolean {
    return this._authorId === userId;
  }

  toPlainObject() {
    return {
      id: this._id,
      content: this._content,
      createdAt: this._createdAt,
      authorId: this._authorId,
      authorName: this._authorName,
      reviewId: this._reviewId,
      parentCommentId: this._parentCommentId,
      status: this._status,
      replyCount: this._replyCount,
    };
  }

  equals(other: ReviewComment): boolean {
    return this._id === other.getId();
  }
}
