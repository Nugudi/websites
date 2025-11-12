/**
 * Stamp Presentation Layer Exports
 *
 * 3-Tier Architecture:
 * - client/   : Client-side hooks and stores ('use client')
 * - shared/   : Shared types, constants, adapters, and UI components
 */

// Client Layer
export * from "./client/hooks";

// Shared Layer
export * from "./shared/adapters";
export * from "./shared/constants";
export * from "./shared/types";

// UI Components
export * from "./shared/ui/components";
export * from "./shared/ui/sections";
export * from "./shared/ui/views";
