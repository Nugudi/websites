import type { paths } from "@nugudi/types";
import type { HttpClient } from "@/src/shared/infrastructure/http";

type GetMyProfileResponse =
  paths["/api/v1/users/me"]["get"]["responses"]["200"]["content"]["*/*"];

type CheckNicknameAvailabilityResponse =
  paths["/api/v1/users/nickname/availability"]["get"]["responses"]["200"]["content"]["*/*"];

type CheckNicknameAvailabilityParams =
  paths["/api/v1/users/nickname/availability"]["get"]["parameters"]["query"];

export interface UserRepository {
  getMyProfile(): Promise<GetMyProfileResponse>;
  checkNicknameAvailability(
    params: CheckNicknameAvailabilityParams,
  ): Promise<CheckNicknameAvailabilityResponse>;
}

export class UserRepositoryImpl implements UserRepository {
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
