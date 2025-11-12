/**
 * Review Comment Entity
 *
 * 리뷰 댓글 도메인 엔티티
 * - API DTO 구조에 맞춘 Entity
 * - commentId, content, commentStatus, createdAt 등 실제 API 필드 사용
 * - 작성자 정보(CommentAuthor)와 대댓글 메타데이터(ReplyMetadata)는 별도로 관리
 */

export type CommentStatus =
  | "ACTIVE"
  | "USER_DELETED"
  | "ADMIN_DELETED"
  | "BLOCKED"
  | "REPORTED"
  | "OWNER_WITHDRAWN";

export interface ReviewComment {
  // Getter methods
  getCommentId(): number;
  getContent(): string;
  getCommentStatus(): CommentStatus;
  getCreatedAt(): string;
  getUpdatedAt(): string | undefined;
  isAuthor(): boolean;

  // Business logic methods
  isActive(): boolean;
  isDeleted(): boolean;
  isBlocked(): boolean;
  isReported(): boolean;
  canEdit(): boolean;
  canDelete(): boolean;
  equals(other: ReviewComment): boolean;
}

export class ReviewCommentEntity implements ReviewComment {
  private readonly _commentId: number;
  private readonly _content: string;
  private readonly _commentStatus: CommentStatus;
  private readonly _createdAt: string;
  private readonly _updatedAt?: string;
  private readonly _isAuthor: boolean;

  constructor(params: {
    commentId: number;
    content: string;
    commentStatus: CommentStatus;
    createdAt: string;
    updatedAt?: string;
    isAuthor?: boolean;
  }) {
    if (!params.commentId || params.commentId <= 0) {
      throw new Error("Comment ID must be a positive number");
    }
    if (!params.content || params.content.trim().length === 0) {
      throw new Error("Comment content is required");
    }
    if (!params.commentStatus) {
      throw new Error("Comment status is required");
    }
    if (!params.createdAt) {
      throw new Error("Created date is required");
    }

    this._commentId = params.commentId;
    this._content = params.content;
    this._commentStatus = params.commentStatus;
    this._createdAt = params.createdAt;
    this._updatedAt = params.updatedAt;
    this._isAuthor = params.isAuthor ?? false;
  }

  // Getter methods
  getCommentId(): number {
    return this._commentId;
  }

  getContent(): string {
    return this._content;
  }

  getCommentStatus(): CommentStatus {
    return this._commentStatus;
  }

  getCreatedAt(): string {
    return this._createdAt;
  }

  getUpdatedAt(): string | undefined {
    return this._updatedAt;
  }

  isAuthor(): boolean {
    return this._isAuthor;
  }

  // Business logic methods
  isActive(): boolean {
    return this._commentStatus === "ACTIVE";
  }

  isDeleted(): boolean {
    return (
      this._commentStatus === "USER_DELETED" ||
      this._commentStatus === "ADMIN_DELETED"
    );
  }

  isBlocked(): boolean {
    return this._commentStatus === "BLOCKED";
  }

  isReported(): boolean {
    return this._commentStatus === "REPORTED";
  }

  canEdit(): boolean {
    return this._isAuthor && this.isActive();
  }

  canDelete(): boolean {
    return this._isAuthor && this.isActive();
  }

  equals(other: ReviewComment): boolean {
    return this._commentId === other.getCommentId();
  }
}
