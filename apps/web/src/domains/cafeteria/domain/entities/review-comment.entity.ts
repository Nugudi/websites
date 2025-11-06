/**
 * Review Comment Entity
 *
 * 리뷰 댓글 도메인 객체
 * - 프레임워크에 독립적
 * - 비즈니스 로직 포함 가능
 * - Immutable 패턴 사용
 */

/**
 * ReviewComment Entity Interface
 */
export interface ReviewComment {
  readonly id: number;
  readonly content: string;
  readonly createdAt: Date;
  readonly authorId: number;
  readonly authorName: string;
  readonly reviewId: number;
  readonly parentCommentId?: number;
  readonly status: "ACTIVE" | "DELETED";
  readonly replyCount?: number;
}

/**
 * ReviewComment Entity Class (with business logic)
 */
export class ReviewCommentEntity implements ReviewComment {
  readonly id: number;
  readonly content: string;
  readonly createdAt: Date;
  readonly authorId: number;
  readonly authorName: string;
  readonly reviewId: number;
  readonly parentCommentId?: number;
  readonly status: "ACTIVE" | "DELETED";
  readonly replyCount?: number;

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
    // 검증 로직
    if (!params.id || params.id <= 0) {
      throw new Error("Comment ID must be a positive number");
    }
    if (!params.content || params.content.trim().length === 0) {
      throw new Error("Comment content is required");
    }
    if (!params.createdAt) {
      throw new Error("Created date is required");
    }

    this.id = params.id;
    this.content = params.content;
    this.createdAt = params.createdAt;
    this.authorId = params.authorId;
    this.authorName = params.authorName;
    this.reviewId = params.reviewId;
    this.parentCommentId = params.parentCommentId;
    this.status = params.status;
    this.replyCount = params.replyCount;
  }

  /**
   * 비즈니스 로직: 대댓글인지 확인
   */
  isReply(): boolean {
    return !!this.parentCommentId;
  }

  /**
   * 비즈니스 로직: 최상위 댓글인지 확인
   */
  isTopLevel(): boolean {
    return !this.parentCommentId;
  }

  /**
   * 비즈니스 로직: 활성 상태인지 확인
   */
  isActive(): boolean {
    return this.status === "ACTIVE";
  }

  /**
   * 비즈니스 로직: 삭제된 상태인지 확인
   */
  isDeleted(): boolean {
    return this.status === "DELETED";
  }

  /**
   * 비즈니스 로직: 대댓글이 있는지 확인
   */
  hasReplies(): boolean {
    return (this.replyCount ?? 0) > 0;
  }

  /**
   * 비즈니스 로직: 최근 댓글인지 (24시간 이내)
   */
  isRecent(): boolean {
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    return this.createdAt >= oneDayAgo;
  }

  /**
   * 비즈니스 로직: 댓글 작성자가 특정 사용자인지 확인
   */
  isAuthoredBy(userId: number): boolean {
    return this.authorId === userId;
  }

  /**
   * Entity를 Plain Object로 변환
   */
  toPlainObject(): ReviewComment {
    return {
      id: this.id,
      content: this.content,
      createdAt: this.createdAt,
      authorId: this.authorId,
      authorName: this.authorName,
      reviewId: this.reviewId,
      parentCommentId: this.parentCommentId,
      status: this.status,
      replyCount: this.replyCount,
    };
  }

  /**
   * 동등성 비교
   */
  equals(other: ReviewComment): boolean {
    return this.id === other.id;
  }
}
