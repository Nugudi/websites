/**
 * Cafeteria DI Container Barrel Export
 *
 * ⚠️ CRITICAL: ALWAYS import containers directly from specific files!
 *
 * ## ✅ CORRECT Import Pattern:
 *
 * ```typescript
 * // ✅ CORRECT: Direct import from specific file
 * import { getCafeteriaClientContainer } from '@/src/domains/cafeteria/di/cafeteria-client-container';
 * import { createCafeteriaServerContainer } from '@/src/domains/cafeteria/di/cafeteria-server-container';
 *
 * // ❌ WRONG: Importing from barrel export (even through wrapper)
 * import { getCafeteriaClientContainer } from '@cafeteria/di';
 * ```
 *
 * ## Why Direct Imports?
 *
 * **The Problem**: Importing from `@cafeteria/di` (this barrel export) bundles BOTH
 * server and client containers together, even with wrapper files:
 *
 * 1. **Build Failure**: Server-only code (`ServerSessionManager`, `next/headers`)
 *    gets included in client bundles → "You're importing a component that needs 'server-only'"
 * 2. **Tree-shaking Broken**: Webpack can't separate server/client code when using barrel exports
 * 3. **Bundle Size**: Client bundle includes unnecessary server dependencies
 *
 * ## What This File Does:
 *
 * This barrel export exists ONLY for internal convenience (e.g., re-exporting types).
 * It is NOT safe for importing containers. Always use direct file imports.
 *
 * @see .cursor/rules/ddd/di-containers.md for complete DI Container rules
 */

export * from "./cafeteria-container";
