/**
 * User Remote Data Source Interface
 *
 * Data Layer의 DataSource 계약
 *
 * @remarks
 * - Repository가 의존하는 세부 계약
 * - DTO 타입 사용 (Data Layer 관심사)
 * - Clean Architecture: Data Layer가 정의, Infrastructure가 구현
 */

import type {
  CheckNicknameAvailabilityParams,
  CheckNicknameAvailabilityResponse,
  GetMyProfileResponse,
} from "../../remote/dto";

/**
 * User Remote Data Source
 *
 * @remarks
 * HTTP 통신을 추상화한 인터페이스
 * Infrastructure Layer에서 구현
 */
export interface UserRemoteDataSource {
  /**
   * 내 프로필 조회
   *
   * @returns 프로필 응답 DTO
   * @throws HttpError - HTTP 요청 실패 시
   */
  getMyProfile(): Promise<GetMyProfileResponse>;

  /**
   * 닉네임 중복 확인
   *
   * @param params - 닉네임 확인 파라미터
   * @returns 중복 확인 응답 DTO
   * @throws HttpError - HTTP 요청 실패 시
   */
  checkNicknameAvailability(
    params: CheckNicknameAvailabilityParams,
  ): Promise<CheckNicknameAvailabilityResponse>;
}
