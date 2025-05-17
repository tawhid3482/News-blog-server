// Category.service.ts
import { Request } from "express";
import prisma from "../../../shared/prisma";

const createCategoryIntoDB = async (req: Request) => {
  const userId = req.user?.id;
  if (!userId) throw new Error("Unauthorized: Missing user ID");

  const { name, slug } = req.body;

  const Category = await prisma.category.create({
    data: {
      name,
      slug,
    },
  });

  return Category;
};

export const CategoryService = {
  createCategoryIntoDB,
};
