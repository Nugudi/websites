/**
 * Auth Domain UseCases Barrel Export
 *
 * All UseCases follow Interface + Implementation pattern:
 * - Interface (e.g., LoginWithOAuthUseCase): Defines the contract
 * - Implementation (e.g., LoginWithOAuthUseCaseImpl): Concrete implementation
 *
 * Usage in DI Containers:
 * - Property types: Use Interface types (LoginWithOAuthUseCase)
 * - Instantiation: Use Implementation classes (new LoginWithOAuthUseCaseImpl())
 * - Getter return types: Use Interface types (LoginWithOAuthUseCase)
 *
 * Example:
 * ```typescript
 * class AuthServerContainer {
 *   private loginUseCase: LoginWithOAuthUseCase;  // Interface type
 *
 *   constructor() {
 *     this.loginUseCase = new LoginWithOAuthUseCaseImpl(...);  // Impl class
 *   }
 *
 *   getLoginWithOAuth(): LoginWithOAuthUseCase {  // Interface type
 *     return this.loginUseCase;
 *   }
 * }
 * ```
 */

export * from "./get-current-session.usecase";
export * from "./get-oauth-authorize-url.usecase";
export * from "./login-with-oauth.usecase";
export * from "./logout.usecase";
export * from "./refresh-token.usecase";
export * from "./sign-up-with-social.usecase";
