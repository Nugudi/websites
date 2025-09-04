import { ReplyIcon } from "@nugudi/assets-icons";
import * as styles from "./style.css";
import type { CommentProps } from "./types";

export const Comment = ({
  avatar,
  username,
  level,
  timeAgo,
  content,
  isReply = false,
  className,
  children,
}: CommentProps) => {
  return (
    <div
      className={`${styles.commentContainer} ${isReply ? styles.reply : ""} ${className || ""}`}
    >
      {isReply && (
        <div className={styles.replyIconWrapper}>
          <ReplyIcon />
        </div>
      )}

      <div className={styles.commentContent}>
        <div className={styles.header}>
          <div className={styles.avatarSection}>
            {avatar || <div className={styles.defaultAvatar} />}
          </div>

          <div className={styles.headerInfo}>
            <div className={styles.userInfo}>
              <span className={styles.level}>{level}</span>
              <span className={styles.username}>{username}</span>
            </div>
            <span className={styles.timeAgo}>{timeAgo}</span>
          </div>
        </div>

        <div className={styles.body}>
          <p className={styles.content}>{content}</p>
        </div>

        {children && <div className={styles.replies}>{children}</div>}
      </div>
    </div>
  );
};
