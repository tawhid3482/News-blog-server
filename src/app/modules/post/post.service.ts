// post.service.ts
import { Request } from "express";
import { IUploadFile } from "../../../interfaces/file";
import { FileUploadHelper } from "../../../helpers/fileUploadHelper";
import prisma from "../../../shared/prisma"; // assuming this is your Prisma client instance

const createPostIntoDB = async (req: Request, userId: string) => {
  const file = req.file as IUploadFile;

  let coverImage: string | undefined = undefined;

  if (file) {
    const uploadedImage = (await FileUploadHelper.uploadToCloudinary(file)) as {
      secure_url?: string;
    };
    coverImage = uploadedImage?.secure_url;
  }
  if (!userId) throw new Error("Unauthorized: Missing user ID");

  const { title, slug, summary, content, categoryId, tags } = req.body;

  const post = await prisma.post.create({
    data: {
      title,
      slug,
      summary,
      content,
      coverImage,
      categoryId,
      authorId: userId,
      tags: {
        connect: tags?.map((tag: { id: string }) => ({ id: tag.id })),
      },
    },
    include: {
      category: true,
      tags: true,
    },
  });
  return post;
};

export const postService = {
  createPostIntoDB,
};
