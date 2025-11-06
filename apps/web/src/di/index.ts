/**
 * DEPRECATED: This directory is DEPRECATED
 *
 * The deprecated auth containers have been removed.
 * Use the new Clean Architecture DI containers directly from domain directories:
 *
 * Recommended imports:
 * - Auth Client: import { getAuthClientContainer } from "@/src/domains/auth/di/auth-client-container"
 * - Auth Server: import { createAuthServerContainer } from "@/src/domains/auth/di/auth-server-container"
 * - User Client: import { getUserClientContainer } from "@/src/domains/user/di/user-client-container"
 * - User Server: import { createUserServerContainer } from "@/src/domains/user/di/user-server-container"
 * - Cafeteria Client: import { getCafeteriaClientContainer } from "@/src/domains/cafeteria/di/cafeteria-client-container"
 * - Cafeteria Server: import { createCafeteriaServerContainer } from "@/src/domains/cafeteria/di/cafeteria-server-container"
 *
 * All code now uses UseCase-based Clean Architecture DI containers.
 * Services have been replaced with UseCases following Clean Architecture principles.
 */
