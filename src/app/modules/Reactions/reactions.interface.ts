enum ContentType {
  TOPIC = "TOPIC",
  COMMENT = "COMMENT",
    POST = "POST",
}

enum ReactionType {
  LIKE = "LIKE",
  LOVE = "LOVE",
  FUNNY = "FUNNY",
  WOW = "WOW",
  ANGRY = "ANGRY",
  SAD = "SAD",
}

export type TReaction = {
  userId: string;
  contentType: ContentType;
  reactionType: ReactionType;
  topicId?: string;
  commentId?: string;
};
