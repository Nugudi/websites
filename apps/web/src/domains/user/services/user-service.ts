import type {
  UserProfileData,
  UserRepository,
} from "../repositories/user-repository";

export interface NicknameAvailabilityResult {
  available: boolean;
  message?: string;
}

export interface UserService {
  getMyProfile(): Promise<UserProfileData>;
  checkNicknameAvailability(
    nickname: string,
  ): Promise<NicknameAvailabilityResult>;
}

export class UserServiceImpl implements UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getMyProfile(): Promise<UserProfileData> {
    const response = await this.userRepository.getMyProfile();

    if (!response.success || !response.data) {
      throw new Error(response.message || "Failed to get user profile");
    }

    return response.data;
  }

  async checkNicknameAvailability(
    nickname: string,
  ): Promise<NicknameAvailabilityResult> {
    try {
      const nicknameCheckResponse =
        await this.userRepository.checkNicknameAvailability({
          nickname,
        });

      return {
        available: nicknameCheckResponse.data?.available ?? false,
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
