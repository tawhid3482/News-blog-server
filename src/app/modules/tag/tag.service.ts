// Tag.service.ts
import { Request } from "express";
import prisma from "../../../shared/prisma";

const createTagIntoDB = async (req: Request) => {
  const { name } = req.body;
  const Tag = await prisma.tag.create({
    data: {
      name,
    },
  });

  return Tag;
};
const getAllTagFromDB = async () => {
  const Tag = await prisma.tag.findMany({
    include: {
      posts: true,
    },
  });

  return Tag;
};

export const TagService = {
  createTagIntoDB,
  getAllTagFromDB
};
