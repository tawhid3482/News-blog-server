import { ReactionType } from "../../../../generated/prisma";

export interface IReaction {
  id: string;
  type: ReactionType;
  userId: string;
  postId: string;
  createdAt: Date;
}

export interface CreateReactionDTO {
  type: ReactionType;
  userId: string;
  postId: string;
}
