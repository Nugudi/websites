/**
 * Notification Entity
 */

export const NOTIFICATION_CATEGORY = {
  SYSTEM: "SYSTEM",
  REVIEW: "REVIEW",
  STAMP: "STAMP",
  BENEFIT: "BENEFIT",
} as const;

export type NotificationCategory =
  (typeof NOTIFICATION_CATEGORY)[keyof typeof NOTIFICATION_CATEGORY];

export class Notification {
  private readonly _id: string;
  private readonly _userId: string;
  private readonly _title: string;
  private readonly _message: string;
  private readonly _type: NotificationCategory;
  private readonly _isRead: boolean;
  private readonly _createdAt: string;
  private readonly _readAt?: string;
  private readonly _relatedResourceId?: string;
  private readonly _relatedResourceType?: string;

  constructor(
    id: string,
    userId: string,
    title: string,
    message: string,
    type: NotificationCategory,
    isRead: boolean,
    createdAt: string,
    readAt?: string,
    relatedResourceId?: string,
    relatedResourceType?: string,
  ) {
    this._id = id;
    this._userId = userId;
    this._title = title;
    this._message = message;
    this._type = type;
    this._isRead = isRead;
    this._createdAt = createdAt;
    this._readAt = readAt;
    this._relatedResourceId = relatedResourceId;
    this._relatedResourceType = relatedResourceType;
  }

  // Getter methods
  getId(): string {
    return this._id;
  }

  getUserId(): string {
    return this._userId;
  }

  getTitle(): string {
    return this._title;
  }

  getMessage(): string {
    return this._message;
  }

  getType(): NotificationCategory {
    return this._type;
  }

  getIsRead(): boolean {
    return this._isRead;
  }

  getCreatedAt(): string {
    return this._createdAt;
  }

  getReadAt(): string | undefined {
    return this._readAt;
  }

  getRelatedResourceId(): string | undefined {
    return this._relatedResourceId;
  }

  getRelatedResourceType(): string | undefined {
    return this._relatedResourceType;
  }

  /**
   * Business Logic: 읽음 처리된 알림 생성
   * @returns 읽음 상태로 변경된 새 Notification 인스턴스
   */
  markAsRead(): Notification {
    if (this._isRead) {
      return this; // 이미 읽음 상태면 그대로 반환
    }

    return new Notification(
      this._id,
      this._userId,
      this._title,
      this._message,
      this._type,
      true, // isRead = true
      this._createdAt,
      new Date().toISOString(), // readAt = 현재 시간
      this._relatedResourceId,
      this._relatedResourceType,
    );
  }

  /**
   * Business Logic: 알림이 만료되었는지 확인
   * - 생성 후 30일이 지나면 만료
   * @returns 만료 여부
   */
  isExpired(): boolean {
    const createdDate = new Date(this._createdAt);
    const now = new Date();
    const diffInDays = Math.floor(
      (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24),
    );
    return diffInDays > 30;
  }

  /**
   * Business Logic: 알림이 삭제 가능한지 확인
   * - 읽음 상태이거나 만료된 알림만 삭제 가능
   * @returns 삭제 가능 여부
   */
  canBeDeleted(): boolean {
    return this._isRead || this.isExpired();
  }

  /**
   * Business Logic: 알림 배지 표시 여부
   * - 안 읽은 알림이고 만료되지 않은 경우에만 표시
   * @returns 배지 표시 여부
   */
  shouldShowBadge(): boolean {
    return !this._isRead && !this.isExpired();
  }

  /**
   * Business Logic: 알림 우선순위 계산
   * - SYSTEM: 3 (최우선)
   * - REVIEW: 2
   * - STAMP: 1
   * - BENEFIT: 1
   * @returns 우선순위 (높을수록 우선)
   */
  getPriority(): number {
    const priorityMap: Record<NotificationCategory, number> = {
      [NOTIFICATION_CATEGORY.SYSTEM]: 3,
      [NOTIFICATION_CATEGORY.REVIEW]: 2,
      [NOTIFICATION_CATEGORY.STAMP]: 1,
      [NOTIFICATION_CATEGORY.BENEFIT]: 1,
    };
    return priorityMap[this._type] || 0;
  }

  /**
   * Business Logic: 알림이 최근 것인지 확인 (24시간 이내)
   * @returns 최근 알림 여부
   */
  isRecent(): boolean {
    const createdDate = new Date(this._createdAt);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60),
    );
    return diffInHours < 24;
  }

  /**
   * Business Logic: 알림에 연결된 리소스가 있는지 확인
   * @returns 리소스 연결 여부
   */
  hasRelatedResource(): boolean {
    return Boolean(this._relatedResourceId && this._relatedResourceType);
  }
}

export interface NotificationList {
  notifications: Notification[];
  totalCount: number;
  unreadCount: number;
}
