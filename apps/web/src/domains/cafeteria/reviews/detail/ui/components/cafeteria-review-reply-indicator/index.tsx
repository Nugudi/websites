"use client";

import { Emphasis, HStack } from "@nugudi/react-components-layout";
import * as styles from "./index.css";

interface CafeteriaReviewReplyIndicatorProps {
  username: string;
  onCancel: () => void;
}

export const CafeteriaReviewReplyIndicator = ({
  username,
  onCancel,
}: CafeteriaReviewReplyIndicatorProps) => {
  return (
    <HStack
      w={"95%"}
      justify="between"
      align="center"
      className={styles.replyIndicator}
    >
      <Emphasis fontSize="e1" color="zinc" colorShade={600}>
        @{username}님에게 답글 작성 중
      </Emphasis>
      <button type="button" onClick={onCancel} className={styles.cancelButton}>
        취소
      </button>
    </HStack>
  );
};
