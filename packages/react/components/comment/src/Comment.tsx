import { ReplyIcon } from "@nugudi/assets-icons";
import { clsx } from "clsx";
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
      className={clsx(
        styles.commentContainer,
        isReply && styles.reply,
        className,
      )}
    >
      {isReply && (
        <div className={styles.replyIconWrapper}>
          <ReplyIcon />
        </div>
      )}

      <div className={styles.commentContent}>
        <div className={styles.header}>
          {/* TODO:프로필 avatar는 컴포넌트로 추후 빼서 수정할 예정 */}
          <div className={styles.avatarSection}>
            {avatar || <div className={styles.defaultAvatar} />}
          </div>

          <div className={styles.headerInfo}>
            <div className={styles.userInfo}>
              <span className={styles.level}>Lv.{level}</span>
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
