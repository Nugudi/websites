import type { UserProfileData } from "../../presentation/types/user.type";
import type { UserRepository } from "../repositories/user-repository";

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

    if (!response.data) {
      throw new Error("Failed to fetch user profile: No data returned");
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

      if (!nicknameCheckResponse.data) {
        return {
          available: false,
          message: "닉네임 확인에 실패했습니다: 데이터를 받지 못했습니다.",
        };
      }

      return {
        available: nicknameCheckResponse.data.available,
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
