import type { vars } from "@nugudi/themes";
import type { ComponentPropsWithoutRef } from "react";

export type AvatarSize = "sm" | "md" | "lg";

// themes 패키지의 색상 스케일 타입 추출
export type AvatarBadgeColor = keyof typeof vars.colors.$scale;

export interface AvatarProps
  extends Omit<ComponentPropsWithoutRef<"span">, "children"> {
  /**
   * 이미지 대체 텍스트 (웹 접근성)
   */
  alt?: string;
  /**
   * 아바타 이미지 URL
   */
  src?: string;
  /**
   * 아바타 크기
   * @default 'md'
   */
  size?: AvatarSize;
  /**
   * true일 경우 아바타에 뱃지 추가 (온라인 상태 표시)
   * @default false
   */
  showBadge?: boolean;
  /**
   * 뱃지 색상
   * @default 'main'
   */
  badgeColor?: AvatarBadgeColor;
  /**
   * 이미지 로딩 실패 시 호출되는 함수
   */
  onError?: () => void;
  /**
   * 이니셜 대신 표시할 커스텀 아이콘
   */
  icon?: React.ReactElement;
  /**
   * 아바타 모서리 둥글기
   * @default 'full'
   */
  borderRadius?: "full" | "lg" | "md" | "sm" | "none";
  /**
   * 커스텀 이미지 엘리먼트 (Next.js Image 통합용)
   */
  imgElement?: React.ReactElement;
  /**
   * 이미지 props (Next.js getImageProps 통합용)
   */
  imgProps?: React.ImgHTMLAttributes<HTMLImageElement>;
}

export interface AvatarGroupProps extends ComponentPropsWithoutRef<"div"> {
  /**
   * 표시할 최대 아바타 개수
   */
  max?: number;
  /**
   * 그룹 내 모든 아바타의 크기
   * @default 'md'
   */
  size?: AvatarSize;
  /**
   * 아바타 간 간격 (px)
   * 음수 값은 겹침 효과
   * 지정하지 않으면 size에 따른 기본값 사용:
   * - sm: -16px
   * - md: -24px
   * - lg: -40px
   */
  spacing?: number;
  /**
   * 하위 아바타 컴포넌트들
   */
  children: React.ReactNode;
}
