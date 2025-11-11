import { NICKNAME_RULES } from "../config/constants";
import type { User } from "../entities/user.entity";
import { AUTH_ERROR_CODES, AuthError } from "../errors/auth-error";
import type { AuthRepository } from "../repositories/auth-repository";
import type { SignUpData } from "../types/common";

export interface SignUpWithSocialParams {
  registrationToken: string;
  userData: SignUpData;
}

export interface SignUpWithSocialUseCase {
  execute(params: SignUpWithSocialParams): Promise<User>;
}

export class SignUpWithSocialUseCaseImpl implements SignUpWithSocialUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(params: SignUpWithSocialParams): Promise<User> {
    this.validateParams(params);

    try {
      const user = await this.authRepository.signUpWithSocial({
        registrationToken: params.registrationToken,
        userData: params.userData,
      });

      return user;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private validateParams(params: SignUpWithSocialParams): void {
    if (!params.registrationToken) {
      throw new AuthError(
        "Registration token is required",
        AUTH_ERROR_CODES.INVALID_CODE,
      );
    }

    if (!params.userData.nickname) {
      throw new AuthError(
        "Nickname is required",
        AUTH_ERROR_CODES.INVALID_NICKNAME,
      );
    }

    if (params.userData.nickname.length < NICKNAME_RULES.MIN_LENGTH) {
      throw new AuthError(
        `Nickname must be at least ${NICKNAME_RULES.MIN_LENGTH} characters`,
        AUTH_ERROR_CODES.INVALID_NICKNAME,
      );
    }

    if (params.userData.nickname.length > NICKNAME_RULES.MAX_LENGTH) {
      throw new AuthError(
        `Nickname must be less than ${NICKNAME_RULES.MAX_LENGTH} characters`,
        AUTH_ERROR_CODES.INVALID_NICKNAME,
      );
    }

    if (!NICKNAME_RULES.PATTERN.test(params.userData.nickname)) {
      throw new AuthError(
        "Nickname must contain only Korean, English, or numbers",
        AUTH_ERROR_CODES.INVALID_NICKNAME,
      );
    }

    if (!params.userData.privacyPolicy) {
      throw new AuthError(
        "Privacy policy agreement is required",
        AUTH_ERROR_CODES.INVALID_USER_DATA,
      );
    }

    if (!params.userData.termsOfService) {
      throw new AuthError(
        "Terms of service agreement is required",
        AUTH_ERROR_CODES.INVALID_USER_DATA,
      );
    }

    if (!params.userData.locationInfo) {
      throw new AuthError(
        "Location info agreement is required",
        AUTH_ERROR_CODES.INVALID_USER_DATA,
      );
    }
  }

  private handleError(error: unknown): AuthError {
    if (error instanceof AuthError) {
      return error;
    }

    if (error instanceof Error) {
      return new AuthError(
        error.message || "Failed to sign up",
        AUTH_ERROR_CODES.INVALID_USER_DATA,
        error,
      );
    }

    return new AuthError(
      "Unknown error occurred during sign up",
      AUTH_ERROR_CODES.INVALID_USER_DATA,
      error,
    );
  }
}
