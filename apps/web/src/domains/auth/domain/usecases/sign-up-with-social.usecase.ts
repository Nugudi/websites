/**
 * Sign Up With Social UseCase
 *
 * 소셜 계정으로 회원가입 비즈니스 로직을 캡슐화
 */

import { AuthError } from "../../core/errors/auth-error";
import type { SignUpData } from "../../core/types/common";
import type { User } from "../entities/user.entity";
import type { AuthRepository } from "../repositories/auth-repository";

/**
 * UseCase 입력 파라미터
 */
export interface SignUpWithSocialParams {
  registrationToken: string;
  userData: SignUpData;
}

/**
 * SignUpWithSocial UseCase
 */
export class SignUpWithSocial {
  constructor(private readonly authRepository: AuthRepository) {}

  /**
   * UseCase 실행
   */
  async execute(params: SignUpWithSocialParams): Promise<User> {
    // 1. 입력값 검증
    this.validateParams(params);

    try {
      // 2. Repository 호출
      const user = await this.authRepository.signUpWithSocial({
        registrationToken: params.registrationToken,
        userData: params.userData,
      });

      return user;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * 입력값 검증
   */
  private validateParams(params: SignUpWithSocialParams): void {
    if (!params.registrationToken) {
      throw new AuthError("Registration token is required", "INVALID_CODE");
    }

    if (!params.userData.nickname) {
      throw new AuthError("Nickname is required");
    }

    if (params.userData.nickname.length < 2) {
      throw new AuthError("Nickname must be at least 2 characters");
    }

    if (params.userData.nickname.length > 20) {
      throw new AuthError("Nickname must be less than 20 characters");
    }

    // 필수 약관 동의 확인
    if (!params.userData.privacyPolicy) {
      throw new AuthError("Privacy policy agreement is required");
    }

    if (!params.userData.termsOfService) {
      throw new AuthError("Terms of service agreement is required");
    }

    if (!params.userData.locationInfo) {
      throw new AuthError("Location info agreement is required");
    }
  }

  /**
   * 에러 처리
   */
  private handleError(error: unknown): AuthError {
    if (error instanceof AuthError) {
      return error;
    }

    if (error instanceof Error) {
      return new AuthError(
        error.message || "Failed to sign up",
        undefined,
        undefined,
        error,
      );
    }

    return new AuthError(
      "Unknown error occurred during sign up",
      undefined,
      undefined,
      error,
    );
  }
}
