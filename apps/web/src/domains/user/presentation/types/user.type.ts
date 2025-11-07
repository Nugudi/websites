export interface UserProfileItem {
  id: number;
  nickname: string;
  email?: string;
  profileImageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface NicknameAvailabilityItem {
  available: boolean;
  message?: string;
}
