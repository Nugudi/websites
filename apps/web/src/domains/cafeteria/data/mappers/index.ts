/**
 * Cafeteria Mappers Barrel Export
 *
 * Mapper 레이어: DTO ↔ Entity 변환
 * - DTO: API 전송용 데이터 구조
 * - Entity: 비즈니스 로직을 포함한 도메인 객체
 *
 * NOTE:
 * - 복잡한 응답 타입 (GetCafeteriaResponse 등)은 DTO 그대로 사용 가능
 * - 핵심 도메인 개념 (Cafeteria, Menu, Review 등)만 Entity로 변환
 * - Repository에서 필요에 따라 선택적으로 사용
 */

export * from "./cafeteria.mapper";
export * from "./cafeteria-review.mapper";
