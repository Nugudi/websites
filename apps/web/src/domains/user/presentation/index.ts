/**
 * User Presentation Layer Exports
 *
 * 3-Tier Architecture:
 * - client/   : Client-side hooks and stores ('use client')
 * - shared/   : Shared schemas, types, constants, adapters, queries, utils, and UI components
 */

// Shared Layer
export * from "./shared/adapters";
export * from "./shared/constants";
export * from "./shared/queries";
export * from "./shared/types";
// UI Components
export * from "./shared/ui/components";
export * from "./shared/ui/sections";
export * from "./shared/ui/views";
export * from "./shared/utils";
