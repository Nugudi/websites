/**
 * Cafeteria Domain Public API
 *
 * Clean Architecture Layers:
 * - Core: Domain primitives, configs, errors
 * - Domain: Business logic, entities, use cases
 * - DI: Dependency injection containers
 * - Presentation: UI components, hooks, actions
 *
 * NOTE: Data layer (DTOs, DataSources, Mappers) is NOT exported
 * as it contains implementation details that should not be used externally.
 */

// Core Layer
export * from "./core";
// DI Layer
export * from "./di";
// Domain Layer
export * from "./domain";

// Presentation Layer
export * from "./presentation";
