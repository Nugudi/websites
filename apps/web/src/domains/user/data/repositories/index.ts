/**
 * User Repositories Barrel Export
 */

// Backward compatibility - re-export specific types to avoid conflicts
export type {
  UserRepository as UserRepositoryOld,
  UserRepositoryImpl as UserRepositoryImplOld,
} from "./user-repository";
export * from "./user-repository.impl";
