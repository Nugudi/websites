/**
 * Notification Container Wrapper
 *
 * This file provides named function exports for DI containers
 * to prevent server-only code from being bundled into client bundles.
 *
 * IMPORTANT: This pattern prevents barrel export issues where
 * `export *` would include server-only imports in client bundles.
 */

export { getNotificationClientContainer } from "./notification-client-container";
export { createNotificationServerContainer } from "./notification-server-container";
