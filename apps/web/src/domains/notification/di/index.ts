/**
 * Notification DI Container Barrel Export
 *
 * Dependency Injection Containers for Notification domain
 *
 * @warning ⚠️ CRITICAL: DO NOT use barrel exports (`export *`) for DI containers!
 *
 * ## Why Barrel Exports are PROHIBITED:
 *
 * 1. **Next.js 16 Bundling Issue**: Barrel exports (`export *`) bundle BOTH
 *    client and server containers together, causing server-only code
 *    (like `ServerSessionManager` with `next/headers`) to be included in
 *    client bundles, which breaks the build.
 *
 * 2. **"use client" / "server-only" Conflicts**: Server containers contain
 *    `"server-only"` directive and server-only APIs. When bundled with
 *    client code via barrel exports, Next.js throws:
 *    "You're importing a component that needs 'server-only'"
 *
 * 3. **Tree-shaking Defeated**: `export *` prevents webpack from properly
 *    tree-shaking unused code, increasing bundle size unnecessarily.
 *
 * 4. **Build Failure**: This WILL break production builds with errors like:
 *    "Error: You're importing a component that needs next/headers"
 *
 * ## ✅ CORRECT Pattern (Auth Domain):
 *
 * Use a wrapper file that re-exports ONLY function references:
 *
 * ```typescript
 * // notification-container.ts (wrapper)
 * export { getNotificationClientContainer } from "./notification-client-container";
 * export { createNotificationServerContainer } from "./notification-server-container";
 *
 * // index.ts
 * export * from "./notification-container"; // ✅ Safe - only function references
 * ```
 *
 * This pattern allows webpack to properly tree-shake and prevents server-only
 * code from being bundled into client bundles.
 *
 * @see {@link https://nextjs.org/docs/app/building-your-application/rendering/server-components}
 */

export * from "./notification-container";
