/**
 * Benefit Mock DataSource
 *
 * Mock implementation of BenefitDataSource
 * - Simulates API responses with mock data
 * - snake_case naming (matches DTO convention)
 * - Easily replaceable with real API implementation
 *
 * Pattern:
 * 1. Define mock data in DTO format (snake_case)
 * 2. Simulate network delay (100ms)
 * 3. Return DTO responses
 *
 * Note: 실제 API 구현 시 BenefitRemoteDataSource로 교체
 */

import type { BenefitDTO, GetBenefitListResponseDTO } from "../dto/benefit.dto";

/**
 * Mock Benefit Data (DTO format - snake_case)
 */
const MOCK_BENEFIT_DTOS: BenefitDTO[] = [
  {
    id: "benefit-1",
    cafeteria_id: "cafeteria-1",
    cafeteria_name: "학생식당",
    menu_name: "불고기덮밥",
    menu_type: "LUNCH",
    price: 5000,
    discounted_price: 3500,
    description: "직접 만든 양념으로 조리한 불고기덮밥",
    image_url: "/images/benefits/bulgogi-rice.jpg",
    available_at: "2024-01-15T11:30:00Z",
    created_at: "2024-01-10T09:00:00Z",
  },
  {
    id: "benefit-2",
    cafeteria_id: "cafeteria-1",
    cafeteria_name: "학생식당",
    menu_name: "김치찌개",
    menu_type: "LUNCH",
    price: 4500,
    discounted_price: 3000,
    description: "얼큰한 김치찌개와 공기밥",
    available_at: "2024-01-15T11:30:00Z",
    created_at: "2024-01-10T09:00:00Z",
  },
  {
    id: "benefit-3",
    cafeteria_id: "cafeteria-2",
    cafeteria_name: "교직원식당",
    menu_name: "돈까스",
    menu_type: "LUNCH",
    price: 7000,
    discounted_price: 5500,
    description: "두툼한 등심 돈까스와 샐러드",
    image_url: "/images/benefits/tonkatsu.jpg",
    available_at: "2024-01-15T11:30:00Z",
    created_at: "2024-01-10T09:00:00Z",
  },
  {
    id: "benefit-4",
    cafeteria_id: "cafeteria-1",
    cafeteria_name: "학생식당",
    menu_name: "제육볶음",
    menu_type: "DINNER",
    price: 5500,
    discounted_price: 4000,
    description: "매콤한 제육볶음과 계란후라이",
    available_at: "2024-01-15T17:30:00Z",
    created_at: "2024-01-10T09:00:00Z",
  },
  {
    id: "benefit-5",
    cafeteria_id: "cafeteria-2",
    cafeteria_name: "교직원식당",
    menu_name: "삼겹살김치찌개",
    menu_type: "DINNER",
    price: 8000,
    discounted_price: 6500,
    description: "삼겹살이 듬뿍 들어간 김치찌개",
    available_at: "2024-01-15T17:30:00Z",
    created_at: "2024-01-10T09:00:00Z",
  },
  {
    id: "benefit-6",
    cafeteria_id: "cafeteria-3",
    cafeteria_name: "푸드코트",
    menu_name: "치즈돈까스",
    menu_type: "SNACK",
    price: 6000,
    discounted_price: 4500,
    description: "치즈가 듬뿍 들어간 돈까스",
    image_url: "/images/benefits/cheese-tonkatsu.jpg",
    available_at: "2024-01-15T14:00:00Z",
    created_at: "2024-01-10T09:00:00Z",
  },
  {
    id: "benefit-7",
    cafeteria_id: "cafeteria-3",
    cafeteria_name: "푸드코트",
    menu_name: "떡볶이",
    menu_type: "SNACK",
    price: 3500,
    discounted_price: 2500,
    description: "매콤달콤한 국물 떡볶이",
    available_at: "2024-01-15T14:00:00Z",
    created_at: "2024-01-10T09:00:00Z",
  },
  {
    id: "benefit-8",
    cafeteria_id: "cafeteria-1",
    cafeteria_name: "학생식당",
    menu_name: "비빔밥",
    menu_type: "LUNCH",
    price: 5000,
    discounted_price: 3500,
    description: "신선한 나물과 고추장이 어우러진 비빔밥",
    available_at: "2024-01-16T11:30:00Z",
    created_at: "2024-01-10T09:00:00Z",
  },
  {
    id: "benefit-9",
    cafeteria_id: "cafeteria-2",
    cafeteria_name: "교직원식당",
    menu_name: "치킨마요덮밥",
    menu_type: "LUNCH",
    price: 6500,
    discounted_price: 5000,
    description: "바삭한 치킨과 마요소스의 조화",
    image_url: "/images/benefits/chicken-mayo.jpg",
    available_at: "2024-01-16T11:30:00Z",
    created_at: "2024-01-10T09:00:00Z",
  },
  {
    id: "benefit-10",
    cafeteria_id: "cafeteria-1",
    cafeteria_name: "학생식당",
    menu_name: "된장찌개",
    menu_type: "DINNER",
    price: 4500,
    discounted_price: 3000,
    description: "구수한 된장찌개와 공기밥",
    available_at: "2024-01-16T17:30:00Z",
    created_at: "2024-01-10T09:00:00Z",
  },
];

/**
 * DataSource Interface
 * Repository에서 호출할 데이터 접근 메서드 정의
 */
export interface BenefitDataSource {
  getBenefitList(): Promise<GetBenefitListResponseDTO>;
}

/**
 * Mock DataSource Implementation
 * - 실제 API 대신 Mock 데이터 반환
 * - 네트워크 지연 시뮬레이션 (100ms)
 * - Repository layer에서 사용
 */
export class BenefitMockDataSource implements BenefitDataSource {
  private benefits: BenefitDTO[] = [...MOCK_BENEFIT_DTOS];

  /**
   * 혜택(메뉴) 목록 조회
   * @returns 혜택 목록과 전체 개수
   */
  async getBenefitList(): Promise<GetBenefitListResponseDTO> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 100));

    return {
      benefits: this.benefits,
      total_count: this.benefits.length,
    };
  }
}
