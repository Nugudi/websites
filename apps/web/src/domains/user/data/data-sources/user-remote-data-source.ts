/**
 * User Remote Data Source
 *
 * Handles HTTP communication for user-related operations
 * - Uses HttpClient for API calls
 * - Returns DTOs (from OpenAPI schema)
 * - No business logic (only data fetching)
 */

import type { HttpClient } from "@/src/shared/infrastructure/http";
import type {
  CheckNicknameAvailabilityParams,
  CheckNicknameAvailabilityResponse,
  GetMyProfileResponse,
} from "../dto";

export interface UserRemoteDataSource {
  getMyProfile(): Promise<GetMyProfileResponse>;
  checkNicknameAvailability(
    params: CheckNicknameAvailabilityParams,
  ): Promise<CheckNicknameAvailabilityResponse>;
}

export class UserRemoteDataSourceImpl implements UserRemoteDataSource {
  constructor(private readonly httpClient: HttpClient) {}

  async getMyProfile(): Promise<GetMyProfileResponse> {
    const response =
      await this.httpClient.get<GetMyProfileResponse>("/api/v1/users/me");
    return response.data;
  }

  async checkNicknameAvailability(
    params: CheckNicknameAvailabilityParams,
  ): Promise<CheckNicknameAvailabilityResponse> {
    const response =
      await this.httpClient.get<CheckNicknameAvailabilityResponse>(
        "/api/v1/users/nickname/availability",
        { params },
      );
    return response.data;
  }
}
