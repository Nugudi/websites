/**
 * Cafeteria Presentation Layer Barrel Export
 *
 * Clean Architecture: Presentation Layer는 UI와 관련된 모든 것을 포함
 * - UI Components: Views, Sections, Components (Page → View → Section → Component hierarchy)
 * - Hooks: Custom React hooks for data fetching and state management
 * - Types: UI-specific types (NOT DTOs - those are in data layer)
 * - Schemas: Zod validation schemas for forms
 * - Constants: UI constants and configurations
 * - Utils: UI utility functions (formatting, transformation)
 */

// Constants
export * from "./constants";

// Hooks
export * from "./hooks";

// Schemas
export * from "./schemas";

// Types
export * from "./types";

// UI Components
export * from "./ui";

// Utils
export * from "./utils";
