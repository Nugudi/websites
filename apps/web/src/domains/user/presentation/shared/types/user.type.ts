export interface UserProfileItem {
  id: number;
  nickname: string;
  email?: string;
  profileImageUrl?: string;
  height?: number;
  weight?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface NicknameAvailabilityItem {
  available: boolean;
  message?: string;
}
