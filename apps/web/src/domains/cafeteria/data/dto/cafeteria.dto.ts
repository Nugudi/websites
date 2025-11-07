/**
 * Cafeteria DTO
 */

import type { components, operations } from "@nugudi/types";

// ==========================================
// Cafeteria Entity Types
// ==========================================

/**
 * TODO: OpenAPI 스키마에 추가되면 활성화
 * 구내식당 기본 정보
 * - 리뷰 조회 응답 등에서 사용되는 간략한 구내식당 정보
 */
// export type CafeteriaInfo = components["schemas"]["CafeteriaInfo"];

/**
 * 구내식당 상세 정보 DTO
 * - 구내식당의 모든 상세 정보 포함 (주소, 연락처, 영업시간 등)
 */
export type CafeteriaInfoDTO = components["schemas"]["CafeteriaInfoDTO"];

// ==========================================
// Menu Types
// ==========================================

/**
 * TODO: OpenAPI 스키마에 추가되면 활성화
 * 메뉴 DTO (간략 버전)
 * - 타임라인 조회 등에서 사용
 */
// export type MenuDTO = components["schemas"]["MenuDTO"];

/**
 * 메뉴 정보 DTO (상세 버전)
 * - 영양 정보 포함
 */
export type MenuInfoDTO = components["schemas"]["MenuInfoDTO"];

/**
 * 메뉴 아이템 DTO
 * - 메뉴를 구성하는 개별 음식 항목
 */
export type MenuItemDTO = components["schemas"]["MenuItemDTO"];

/**
 * 메뉴 아이템 Dto (등록/수정용)
 * - category enum 포함
 */
export type MenuItemDto = components["schemas"]["MenuItemDTO"];

/**
 * 영양 정보 DTO
 * - 칼로리, 운동량 환산 정보 등
 */
export type NutritionInfoDTO = components["schemas"]["NutritionInfoDTO"];

// ==========================================
// Business Hours Types
// ==========================================

/**
 * 영업시간 DTO
 * - 점심, 저녁 시간대 정보
 */
export type BusinessHoursDTO = components["schemas"]["BusinessHoursDTO"];

/**
 * 영업시간 등록 요청
 * - 구내식당 등록 시 사용
 */
export type BusinessHoursRequest =
  components["schemas"]["BusinessHoursRequest"];

/**
 * 시간 범위 DTO
 * - 시작/종료 시간
 */
export type TimeRangeDTO = components["schemas"]["TimeRangeDTO"];

/**
 * LocalTime
 * - Java LocalTime 타입 매핑
 */
export type LocalTime = components["schemas"]["LocalTime"];

// ==========================================
// API Request Types
// ==========================================

/**
 * 구내식당 등록 요청
 */
export type RegisterCafeteriaRequest =
  components["schemas"]["RegisterCafeteriaRequest"];

/**
 * 구내식당 메뉴 등록 요청
 */
export type RegisterCafeteriaMenuRequest =
  components["schemas"]["RegisterCafeteriaMenuRequest"];

// ==========================================
// API Response Types
// ==========================================

/**
 * 구내식당 상세 조회 응답
 */
export type GetCafeteriaResponse =
  components["schemas"]["GetCafeteriaResponse"];

/**
 * 구내식당 + 메뉴 조회 응답 (리스트 아이템)
 * - 무한 스크롤 리스트에서 사용
 */
export type GetCafeteriaWithMenuResponse =
  components["schemas"]["GetCafeteriaWithMenuResponse"];

/**
 * 구내식당 메뉴 조회 응답
 * - 특정 날짜의 메뉴 조회
 */
export type GetCafeteriaMenuResponse =
  components["schemas"]["GetCafeteriaMenuResponse"];

/**
 * TODO: OpenAPI 스키마에 추가되면 이 임시 타입을 제거하고 아래 주석을 활성화
 * 구내식당 메뉴 타임라인 조회 응답 (리스트 아이템)
 * - 무한 스크롤 타임라인에서 사용
 *
 * TEMPORARY: 백엔드 API가 준비될 때까지 사용하는 임시 타입
 */
export type GetCafeteriaMenuTimelineResponse = {
  menuDate?: string;
  menus?: MenuInfoDTO[];
  reviewCount?: number;
};

// export type GetCafeteriaMenuTimelineResponse =
//   components["schemas"]["GetCafeteriaMenuTimelineResponse"];

/**
 * 구내식당 메뉴 가용성 조회 응답
 * - 캘린더에서 메뉴가 있는 날짜 표시용
 */
export type GetCafeteriaMenuAvailabilityResponse =
  components["schemas"]["GetCafeteriaMenuAvailabilityResponse"];

/**
 * TODO: OpenAPI 스키마에 추가되면 활성화
 * 구내식당 메뉴 리뷰 조회 응답 (리스트 아이템)
 * - 무한 스크롤 리뷰 리스트에서 사용
 */
// export type GetCafeteriaMenuReviewResponse =
//   components["schemas"]["GetCafeteriaMenuReviewResponse"];

/**
 * 구내식당 등록 응답
 */
export type RegisterCafeteriaResponse =
  components["schemas"]["RegisterCafeteriaResponse"];

/**
 * 구내식당 메뉴 등록 응답
 */
export type RegisterCafeteriaMenuResponse =
  components["schemas"]["RegisterCafeteriaMenuResponse"];

// ==========================================
// Wrapped Response Types (TanStack Query용)
// ==========================================

/**
 * 구내식당 상세 조회 성공 응답
 */
export type SuccessResponseGetCafeteriaResponse =
  components["schemas"]["SuccessResponseGetCafeteriaResponse"];

/**
 * 구내식당 메뉴 조회 성공 응답
 */
export type SuccessResponseGetCafeteriaMenuResponse =
  components["schemas"]["SuccessResponseGetCafeteriaMenuResponse"];

/**
 * 구내식당 메뉴 가용성 조회 성공 응답
 */
export type SuccessResponseGetCafeteriaMenuAvailabilityResponse =
  components["schemas"]["SuccessResponseGetCafeteriaMenuAvailabilityResponse"];

/**
 * 구내식당 등록 성공 응답
 */
export type SuccessResponseRegisterCafeteriaResponse =
  components["schemas"]["SuccessResponseRegisterCafeteriaResponse"];

/**
 * 구내식당 메뉴 등록 성공 응답
 */
export type SuccessResponseRegisterCafeteriaMenuResponse =
  components["schemas"]["SuccessResponseRegisterCafeteriaMenuResponse"];

/**
 * 구내식당 + 메뉴 리스트 페이지 응답 (무한 스크롤)
 */
export type PageResponseGetCafeteriaWithMenuResponse =
  components["schemas"]["PageResponseGetCafeteriaWithMenuResponse"];

/**
 * TODO: OpenAPI 스키마에 추가되면 활성화
 * 구내식당 메뉴 타임라인 페이지 응답 (무한 스크롤)
 */
// export type PageResponseGetCafeteriaMenuTimelineResponse =
//   components["schemas"]["PageResponseGetCafeteriaMenuTimelineResponse"];

/**
 * TODO: OpenAPI 스키마에 추가되면 활성화
 * 구내식당 메뉴 리뷰 페이지 응답 (무한 스크롤)
 */
// export type PageResponseGetCafeteriaMenuReviewResponse =
//   components["schemas"]["PageResponseGetCafeteriaMenuReviewResponse"];

// ==========================================
// Shared Types (from other domains, but used in Cafeteria)
// ==========================================

/**
 * 페이지 정보 (무한 스크롤용)
 * - 모든 페이지네이션 응답에서 공통으로 사용
 */
export type PageInfo = components["schemas"]["PageInfo"];

// NOTE: ReviewInfo, ReviewerInfo are exported from cafeteria-review.type.ts

// ==========================================
// Operations Types (API 엔드포인트 타입)
// ==========================================

/**
 * GET /api/v1/cafeterias - 구내식당 + 메뉴 리스트 조회 (무한 스크롤)
 */
export type GetCafeteriasWithMenuOperation =
  operations["getCafeteriasWithMenu"];

/**
 * GET /api/v1/cafeterias/{id} - 구내식당 상세 조회
 */
export type GetCafeteriaOperation = operations["getCafeteria"];

/**
 * GET /api/v1/cafeterias/{id}/menus - 구내식당 메뉴 조회
 */
export type GetCafeteriaMenuByDateOperation =
  operations["getCafeteriaMenuByDate"];

/**
 * TODO: OpenAPI operations에 추가되면 활성화
 * GET /api/v1/cafeterias/{id}/menus/timeline - 구내식당 메뉴 타임라인 조회 (무한 스크롤)
 */
// export type GetCafeteriaMenuTimelineOperation =
//   operations["getCafeteriaMenuTimeline"];

/**
 * GET /api/v1/cafeterias/{id}/menus/availability - 구내식당 메뉴 가용성 조회
 */
export type GetCafeteriaMenuAvailabilityOperation =
  operations["getCafeteriaMenuAvailability"];

/**
 * TODO: OpenAPI operations에 추가되면 활성화
 * GET /api/v1/cafeterias/{id}/reviews - 구내식당 메뉴 리뷰 조회 (무한 스크롤)
 */
// export type GetCafeteriaMenuReviewsOperation =
//   operations["getCafeteriaMenuReviews"];

/**
 * POST /api/v1/cafeterias - 구내식당 등록
 */
export type RegisterCafeteriaOperation = operations["registerCafeteria"];

/**
 * POST /api/v1/cafeterias/menus - 구내식당 메뉴 등록
 */
export type RegisterCafeteriaMenuOperation =
  operations["registerCafeteriaMenu"];
