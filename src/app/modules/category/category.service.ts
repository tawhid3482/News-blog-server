// Category.service.ts
import { Request } from "express";
import prisma from "../../../shared/prisma";

const createCategoryIntoDB = async (req: Request) => {
  const { name, slug } = req.body;
  const Category = await prisma.category.create({
    data: {
      name,
      slug,
    },
  });

  return Category;
};
const getAllCategoryFromDB = async () => {
  const Category = await prisma.category.findMany({
    include: {
      posts: true,
    },
  });

  return Category;
};

export const CategoryService = {
  createCategoryIntoDB,
  getAllCategoryFromDB
};
