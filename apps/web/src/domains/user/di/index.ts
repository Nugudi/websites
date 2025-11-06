/**
 * User DI Containers Barrel Export
 *
 * IMPORTANT: Server and Client containers should be imported directly
 * to avoid bundling server-only code in client bundles.
 *
 * Correct imports:
 * - Client: import { userClientContainer } from "@/src/domains/user/di/user-client-container";
 * - Server: import { createUserServerContainer } from "@/src/domains/user/di/user-server-container";
 *
 * DO NOT use: import { ... } from "@/src/domains/user/di";
 */

// Re-export for convenience, but prefer direct imports
export type { UserClientContainer } from "./user-client-container";
export type { UserServerContainer } from "./user-server-container";
