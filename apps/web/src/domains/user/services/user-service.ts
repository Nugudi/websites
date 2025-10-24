/**
 * User Service
 *
 * 사용자 관련 비즈니스 로직을 담당하는 Service Layer
 * Repository를 통해 데이터에 접근하고, 필요한 비즈니스 로직을 처리합니다.
 */

import type {
  UserProfileData,
  UserRepository,
} from "../repositories/user-repository";

/**
 * Nickname Availability Check Result
 */
export interface NicknameAvailabilityResult {
  available: boolean;
  message?: string;
}

/**
 * User Service Interface
 */
export interface UserService {
  /**
   * 내 프로필 정보 조회
   */
  getMyProfile(): Promise<UserProfileData>;

  /**
   * 닉네임 중복 체크
   */
  checkNicknameAvailability(
    nickname: string,
  ): Promise<NicknameAvailabilityResult>;
}

/**
 * User Service Implementation
 */
export class UserServiceImpl implements UserService {
  constructor(private readonly userRepository: UserRepository) {}

  /**
   * 내 프로필 정보 조회
   *
   * Repository에서 서버 응답을 받아서 실제 데이터(response.data.data)를 추출하여 반환합니다.
   */
  async getMyProfile(): Promise<UserProfileData> {
    const response = await this.userRepository.getMyProfile();

    if (!response.success || !response.data) {
      throw new Error(response.message || "Failed to get user profile");
    }

    return response.data;
  }

  /**
   * 닉네임 중복 체크
   *
   * Repository에서 이미 unwrapped된 데이터를 받아서 간단한 Result 형태로 변환합니다.
   */
  async checkNicknameAvailability(
    nickname: string,
  ): Promise<NicknameAvailabilityResult> {
    try {
      const data = await this.userRepository.checkNicknameAvailability({
        nickname,
      });

      return {
        available: data.data?.available ?? false,
      };
    } catch (error) {
      return {
        available: false,
        message:
          error instanceof Error
            ? error.message
            : "닉네임 확인에 실패했습니다.",
      };
    }
  }
}
