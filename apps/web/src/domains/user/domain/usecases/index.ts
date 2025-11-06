/**
 * User Domain UseCases Barrel Export
 *
 * All UseCases follow Interface + Implementation pattern:
 * - Interface (e.g., GetMyProfileUseCase): Defines the contract
 * - Implementation (e.g., GetMyProfileUseCaseImpl): Concrete implementation
 *
 * Usage in DI Containers:
 * - Property types: Use Interface types (GetMyProfileUseCase)
 * - Instantiation: Use Implementation classes (new GetMyProfileUseCaseImpl())
 * - Getter return types: Use Interface types (GetMyProfileUseCase)
 *
 * Example:
 * ```typescript
 * class UserServerContainer {
 *   private getMyProfileUseCase: GetMyProfileUseCase;  // Interface type
 *
 *   constructor() {
 *     this.getMyProfileUseCase = new GetMyProfileUseCaseImpl(...);  // Impl class
 *   }
 *
 *   getGetMyProfile(): GetMyProfileUseCase {  // Interface type
 *     return this.getMyProfileUseCase;
 *   }
 * }
 * ```
 */

export * from "./check-nickname-availability.usecase";
export * from "./get-my-profile.usecase";
