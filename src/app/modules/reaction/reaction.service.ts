import prisma from "../../../shared/prisma";
import { CreateReactionDTO } from "./reaction.interface";
import { Reaction } from "../../../../generated/prisma"; // Adjust path if needed

const createReaction = async (
  payload: CreateReactionDTO,
  userId: string
): Promise<Reaction> => {
  // Remove existing reaction by the same user on the same post (ensures 1 reaction per user per post)
  await prisma.reaction.deleteMany({
    where: {
      userId,
      postId: payload.postId,
    },
  });

  // Create new reaction
  const result = await prisma.reaction.create({
    data: {
      type: payload.type,
      userId,
      postId: payload.postId,
    },
  });

  return result;
};

const getReactionsByPost = async (postId: string): Promise<Reaction[]> => {
  const result = await prisma.reaction.findMany({
    where: {
      postId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return result;
};

const deleteReaction = async (
  userId: string,
  postId: string
): Promise<void> => {
  await prisma.reaction.deleteMany({
    where: {
      userId,
      postId,
    },
  });
};

export const reactionService = {
  createReaction,
  getReactionsByPost,
  deleteReaction,
};
