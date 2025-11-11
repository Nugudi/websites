/**
 * Auth Presentation Layer Exports
 *
 * 3-Tier Architecture:
 * - server/   : Server Actions ('use server')
 * - client/   : Client-side hooks and stores ('use client')
 * - shared/   : Shared schemas, types, constants, and UI components
 */

// Client Layer
export * from "./client/hooks";
export * from "./client/stores";
// Server Layer
export * from "./server/actions";

// Shared Layer
export * from "./shared/constants";
export * from "./shared/schemas";
export * from "./shared/types";

// UI Components
export * from "./shared/ui/components";
export * from "./shared/ui/sections";
export * from "./shared/ui/views";
