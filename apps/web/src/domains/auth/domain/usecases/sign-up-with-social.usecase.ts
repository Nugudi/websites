import { AuthError } from "../../core/errors/auth-error";
import type { SignUpData } from "../../core/types/common";
import type { User } from "../entities/user.entity";
import type { AuthRepository } from "../repositories/auth-repository";

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
