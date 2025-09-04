import type { ReactNode } from "react";

export interface CommentProps {
  /** User avatar React element (e.g., Next.js Image, img tag, or custom component) */
  avatar?: ReactNode;
  /** Username or display name */
  username: string;
  /** User level number (will be displayed as "Lv.{number}") */
  level: number;
  /** Time ago string (e.g., "3분전", "1시간전") */
  timeAgo: string;
  /** Comment content */
  content: string;
  /** Whether this is a reply (indented) */
  isReply?: boolean;
  /** Additional CSS class */
  className?: string;
  /** Children comments/replies */
  children?: ReactNode;
}
