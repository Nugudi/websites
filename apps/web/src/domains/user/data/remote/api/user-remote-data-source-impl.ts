/**
 * User Remote Data Source Implementation
 *
 * Infrastructure Layer의 실제 HTTP 통신 구현
 *
 * @remarks
 * - HttpClient를 사용한 API 호출
 * - Data Layer의 DataSource 인터페이스 구현
 * - Clean Architecture: Infrastructure 계층 (실제 HTTP 호출)
 */

import type { HttpClient } from "@core/infrastructure/http";
import type { UserRemoteDataSource } from "../../repository/datasource/user-remote-data-source";
import type {
  CheckNicknameAvailabilityParams,
  CheckNicknameAvailabilityResponse,
  GetMyProfileResponse,
} from "../dto";
import { USER_ENDPOINTS } from "./endpoints";

/**
 * User Remote Data Source 구현체
 *
 * @remarks
 * HttpClient를 주입받아 실제 HTTP 요청 수행
 */
export class UserRemoteDataSourceImpl implements UserRemoteDataSource {
  constructor(private readonly httpClient: HttpClient) {}

  async getMyProfile(): Promise<GetMyProfileResponse> {
    const response = await this.httpClient.get<GetMyProfileResponse>(
      USER_ENDPOINTS.GET_MY_PROFILE,
    );
    return response.data;
  }

  async checkNicknameAvailability(
    params: CheckNicknameAvailabilityParams,
  ): Promise<CheckNicknameAvailabilityResponse> {
    const response =
      await this.httpClient.get<CheckNicknameAvailabilityResponse>(
        USER_ENDPOINTS.CHECK_NICKNAME,
        { params },
      );
    return response.data;
  }
}
