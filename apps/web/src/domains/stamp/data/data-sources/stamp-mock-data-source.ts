/**
 * Stamp Mock DataSource
 *
 * Mock implementation of StampDataSource
 * - Simulates API responses with mock data
 * - snake_case naming (matches DTO convention)
 * - Easily replaceable with real API implementation
 *
 * Pattern:
 * 1. Define mock data in DTO format (snake_case)
 * 2. Simulate network delay (100ms)
 * 3. Return DTO responses
 *
 * Note: 실제 API 구현 시 StampRemoteDataSource로 교체
 */

import type { GetStampCollectionResponseDTO, StampDTO } from "../dto/stamp.dto";

/**
 * Mock Stamp Data (DTO format - snake_case)
 */
const MOCK_STAMP_DTOS: StampDTO[] = [
  {
    id: "stamp-1",
    user_id: "user-1",
    cafeteria_id: "cafeteria-1",
    cafeteria_name: "학생식당",
    issued_at: "2024-01-15T12:00:00Z",
    expires_at: "2024-02-15T23:59:59Z",
    is_used: false,
  },
  {
    id: "stamp-2",
    user_id: "user-1",
    cafeteria_id: "cafeteria-1",
    cafeteria_name: "학생식당",
    issued_at: "2024-01-14T12:30:00Z",
    expires_at: "2024-02-14T23:59:59Z",
    is_used: false,
  },
  {
    id: "stamp-3",
    user_id: "user-1",
    cafeteria_id: "cafeteria-2",
    cafeteria_name: "교직원식당",
    issued_at: "2024-01-13T18:00:00Z",
    expires_at: "2024-02-13T23:59:59Z",
    is_used: false,
  },
  {
    id: "stamp-4",
    user_id: "user-1",
    cafeteria_id: "cafeteria-1",
    cafeteria_name: "학생식당",
    issued_at: "2024-01-10T12:15:00Z",
    expires_at: "2024-02-10T23:59:59Z",
    is_used: true,
    used_at: "2024-01-12T13:00:00Z",
  },
  {
    id: "stamp-5",
    user_id: "user-1",
    cafeteria_id: "cafeteria-3",
    cafeteria_name: "푸드코트",
    issued_at: "2024-01-08T15:30:00Z",
    expires_at: "2024-02-08T23:59:59Z",
    is_used: true,
    used_at: "2024-01-11T14:30:00Z",
  },
  {
    id: "stamp-6",
    user_id: "user-1",
    cafeteria_id: "cafeteria-2",
    cafeteria_name: "교직원식당",
    issued_at: "2024-01-05T12:45:00Z",
    is_used: true,
    used_at: "2024-01-09T13:15:00Z",
  },
  {
    id: "stamp-7",
    user_id: "user-1",
    cafeteria_id: "cafeteria-1",
    cafeteria_name: "학생식당",
    issued_at: "2024-01-16T12:00:00Z",
    expires_at: "2024-02-16T23:59:59Z",
    is_used: false,
  },
  {
    id: "stamp-8",
    user_id: "user-1",
    cafeteria_id: "cafeteria-2",
    cafeteria_name: "교직원식당",
    issued_at: "2024-01-16T18:30:00Z",
    expires_at: "2024-02-16T23:59:59Z",
    is_used: false,
  },
];

/**
 * DataSource Interface
 * Repository에서 호출할 데이터 접근 메서드 정의
 */
export interface StampDataSource {
  getStampCollection(): Promise<GetStampCollectionResponseDTO>;
  useStamp(stampId: string): Promise<void>;
}

/**
 * Mock DataSource Implementation
 * - 실제 API 대신 Mock 데이터 반환
 * - 네트워크 지연 시뮬레이션 (100ms)
 * - Repository layer에서 사용
 */
export class StampMockDataSource implements StampDataSource {
  private stamps: StampDTO[] = [...MOCK_STAMP_DTOS];

  /**
   * 스탬프 컬렉션 조회
   * @returns 스탬프 목록과 통계 정보
   */
  async getStampCollection(): Promise<GetStampCollectionResponseDTO> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 100));

    const unusedCount = this.stamps.filter((s) => !s.is_used).length;

    return {
      stamps: this.stamps,
      total_count: this.stamps.length,
      unused_count: unusedCount,
    };
  }

  /**
   * 스탬프 사용 처리
   * @param stampId - 사용할 스탬프 ID
   */
  async useStamp(stampId: string): Promise<void> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 100));

    const stamp = this.stamps.find((s) => s.id === stampId);
    if (stamp && !stamp.is_used) {
      stamp.is_used = true;
      stamp.used_at = new Date().toISOString();
    }
  }
}
