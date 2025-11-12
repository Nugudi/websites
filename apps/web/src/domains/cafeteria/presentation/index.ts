/**
 * Cafeteria Presentation Layer Exports
 *
 * 3-Tier Architecture:
 * - client/   : Client-side hooks and stores ('use client')
 * - shared/   : Shared schemas, types, constants, adapters, utils, and UI components
 */

// Client Layer
export * from "./client/hooks";

// Shared Layer
export * from "./shared/adapters";
export * from "./shared/constants";
export * from "./shared/schemas";
export * from "./shared/types";
// UI Components
export * from "./shared/ui/components";
export * from "./shared/ui/sections";
export * from "./shared/ui/views";
export * from "./shared/utils";
