/**
 * Notification Mock Data Source
 *
 * Mock implementation of NotificationDataSource for development/testing
 * - Uses hardcoded mock data instead of real API calls
 * - Returns DTOs (snake_case)
 * - Replace with NotificationRemoteDataSource when backend API is ready
 *
 * Usage:
 * - Development: Use this for UI development without backend
 * - Testing: Use this in unit tests
 * - Production: Replace with NotificationRemoteDataSource
 */

import type { GetNotificationListResponseDTO, NotificationDTO } from "../dto";

/**
 * Mock 알림 데이터 (서버 응답 형식으로 작성)
 */
const MOCK_NOTIFICATION_DTOS: NotificationDTO[] = [
  {
    id: "1",
    user_id: "user-123",
    title: "초코합우유 님이 댓글을 남겼어요",
    message: "[팰런티어] 민초버널라님 팰런티어는 9월 46000원 할때도 10월 55...",
    type: "REVIEW",
    is_read: false,
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1일 전
    related_resource_type: "review",
    related_resource_id: "35",
  },
  {
    id: "2",
    user_id: "user-123",
    title: "오늘의 구내식당 메뉴가 올라왔어요",
    message: "점심 메뉴: 제육볶음, 된장찌개, 계란말이가 준비되어 있습니다.",
    type: "SYSTEM",
    is_read: false,
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "3",
    user_id: "user-123",
    title: "이번 주 특가 메뉴",
    message: "금요일 특식! 돈가스가 5,000원 → 3,500원으로 할인됩니다.",
    type: "BENEFIT",
    is_read: false,
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "4",
    user_id: "user-123",
    title: "[구내식당] 운영시간 변경 안내",
    message: "12월 24일부터 점심시간이 11:30~13:30으로 변경됩니다.",
    type: "SYSTEM",
    is_read: false,
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "5",
    user_id: "user-123",
    title: "스탬프가 적립되었어요",
    message: "구내식당 방문으로 스탬프 1개가 적립되었습니다.",
    type: "STAMP",
    is_read: true,
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    read_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12시간 전 읽음
  },
  {
    id: "6",
    user_id: "user-123",
    title: "내일 구내식당 메뉴가 올라왔어요",
    message: "특식 예정: 갈비탕, 김치전, 나물 반찬이 제공됩니다.",
    type: "SYSTEM",
    is_read: false,
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "7",
    user_id: "user-123",
    title: "내 리뷰에 좋아요를 눌렀어요",
    message: "어제 작성한 한식당 리뷰에 15명이 좋아요를 눌렀습니다.",
    type: "REVIEW",
    is_read: false,
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
];

export interface NotificationDataSource {
  getNotificationList(): Promise<GetNotificationListResponseDTO>;
  markAsRead(notificationId: string): Promise<void>;
  markAllAsRead(): Promise<void>;
}

export class NotificationRemoteDataSourceMockImpl
  implements NotificationDataSource
{
  private notifications: NotificationDTO[] = [...MOCK_NOTIFICATION_DTOS];

  /**
   * 알림 목록 조회 (Mock)
   */
  async getNotificationList(): Promise<GetNotificationListResponseDTO> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 100));

    const unreadCount = this.notifications.filter((n) => !n.is_read).length;

    return {
      notifications: this.notifications,
      total_count: this.notifications.length,
      unread_count: unreadCount,
    };
  }

  /**
   * 특정 알림 읽음 처리 (Mock)
   */
  async markAsRead(notificationId: string): Promise<void> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 100));

    const notification = this.notifications.find(
      (n) => n.id === notificationId,
    );
    if (notification) {
      notification.is_read = true;
      notification.read_at = new Date().toISOString();
    }

    // Mock: 콘솔에 로그 출력
    console.log(`[Mock] Notification ${notificationId} marked as read`);
  }

  /**
   * 모든 알림 읽음 처리 (Mock)
   */
  async markAllAsRead(): Promise<void> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 100));

    this.notifications.forEach((notification) => {
      if (!notification.is_read) {
        notification.is_read = true;
        notification.read_at = new Date().toISOString();
      }
    });

    // Mock: 콘솔에 로그 출력
    console.log("[Mock] All notifications marked as read");
  }

  /**
   * Mock 데이터 초기화 (테스트용)
   */
  resetMockData(): void {
    this.notifications = [...MOCK_NOTIFICATION_DTOS];
  }
}
