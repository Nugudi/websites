/**
 * Cafeteria Domain UseCases Barrel Export
 *
 * All UseCases follow Interface + Implementation pattern:
 * - Interface (e.g., GetCafeteriaByIdUseCase): Defines the contract
 * - Implementation (e.g., GetCafeteriaByIdUseCaseImpl): Concrete implementation
 *
 * Usage in DI Containers:
 * - Property types: Use Interface types (GetCafeteriaByIdUseCase)
 * - Instantiation: Use Implementation classes (new GetCafeteriaByIdUseCaseImpl())
 * - Getter return types: Use Interface types (GetCafeteriaByIdUseCase)
 *
 * Example:
 * ```typescript
 * class CafeteriaServerContainer {
 *   private getCafeteriaByIdUseCase: GetCafeteriaByIdUseCase;  // Interface type
 *
 *   constructor() {
 *     this.getCafeteriaByIdUseCase = new GetCafeteriaByIdUseCaseImpl(...);  // Impl class
 *   }
 *
 *   getGetCafeteriaById(): GetCafeteriaByIdUseCase {  // Interface type
 *     return this.getCafeteriaByIdUseCase;
 *   }
 * }
 * ```
 *
 * 각 비즈니스 로직을 독립적인 UseCase로 분리
 * Clean Architecture 원칙에 따라 단일 책임 원칙(SRP) 준수
 */

// Review UseCases
export * from "./create-review.usecase";
export * from "./create-review-comment.usecase";
export * from "./create-review-comment-reply.usecase";
export * from "./get-cafeteria-by-id.usecase";
export * from "./get-cafeteria-menu-availability.usecase";
export * from "./get-cafeteria-menu-by-date.usecase";
export * from "./get-cafeteria-menu-timeline.usecase";
// Cafeteria UseCases
export * from "./get-cafeterias-with-menu.usecase";
export * from "./get-review-comments.usecase";
export * from "./register-cafeteria.usecase";
export * from "./register-cafeteria-menu.usecase";
