/**
 * Cafeteria Container Wrapper
 *
 * This file provides named function exports for DI containers
 * to prevent server-only code from being bundled into client bundles.
 *
 * IMPORTANT: This pattern prevents barrel export issues where
 * `export *` would include server-only imports in client bundles.
 */

export { getCafeteriaClientContainer } from "./cafeteria-client-container";
export { createCafeteriaServerContainer } from "./cafeteria-server-container";
