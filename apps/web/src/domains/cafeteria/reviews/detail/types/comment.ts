export interface CafeteriaReviewCommentData {
  id: string;
  username: string;
  level: number;
  timeAgo: string;
  content: string;
  replies?: CafeteriaReviewCommentData[];
}

export interface CafeteriaReviewReplyingTo {
  commentId: string;
  username: string;
}
