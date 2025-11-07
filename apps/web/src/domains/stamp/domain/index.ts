/**
 * Stamp Domain Layer Barrel Export
 *
 * Clean Architecture: 도메인 레이어는 핵심 비즈니스 로직
 * - Entities: 비즈니스 규칙을 포함한 도메인 객체
 * - Repository Interfaces: 데이터 액세스 계약 (TODO: API 연동 시 추가)
 * - UseCases: 애플리케이션 비즈니스 로직 (TODO: API 연동 시 추가)
 */

// Entities (domain objects with business logic)
export * from "./entities";

// Repository Interfaces (contracts for data access)
export * from "./repositories";

// Use Cases (application business logic)
export * from "./usecases";
