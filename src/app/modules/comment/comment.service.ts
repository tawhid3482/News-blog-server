import prisma from "../../../shared/prisma";
import { CreateCommentDTO } from "./comment.interface";

const createComment = async (payload: CreateCommentDTO, userId: string) => {
  const result = await prisma.comment.create({
    data: {
      postId: payload.postId,
      userId,
      content: payload.content,
    },
  });

  return result;
};

const getCommentsByPost = async (postId: string) => {
  const result = await prisma.comment.findMany({
    where: { postId },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      post: {
        select: {
          title: true,
        },
      },
    },
  });

  return result;
};

export const commentService = {
  createComment,
  getCommentsByPost,
};
