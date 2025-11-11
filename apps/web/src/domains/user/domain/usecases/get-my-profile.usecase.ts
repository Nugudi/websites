/**
 * Get My Profile Use Case
 *
 * Domain Layer의 비즈니스 로직
 *
 * @remarks
 * - Clean Architecture: Domain 계층 UseCase
 * - Repository를 통한 데이터 조회
 * - UserError 전파 (Repository에서 발생)
 */

import type { UserProfile } from "../entities/user.entity";
import type { UserRepository } from "../repositories/user-repository.interface";

/**
 * 내 프로필 조회 UseCase 인터페이스
 */
export interface GetMyProfileUseCase {
  /**
   * 내 프로필 조회 실행
   *
   * @returns 사용자 프로필 Entity
   * @throws UserError - 프로필 조회 실패 시
   */
  execute(): Promise<UserProfile>;
}

/**
 * 내 프로필 조회 UseCase 구현
 */
export class GetMyProfileUseCaseImpl implements GetMyProfileUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(): Promise<UserProfile> {
    // Repository에서 UserError 발생 시 그대로 전파
    return this.userRepository.getMyProfile();
  }
}
