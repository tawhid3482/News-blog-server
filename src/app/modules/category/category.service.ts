// Category.service.ts
import { Request } from "express";
import prisma from "../../../shared/prisma";

const createCategoryIntoDB = async (req: Request) => {
  const { name, slug } = req.body;

  const existingCategory = await prisma.category.findUnique({
    where: { slug },
  });

  if (existingCategory) {
    throw new Error("Slug already exists. Please choose a different slug.");
  }

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

const updateCategoryIntoDB = async (req: Request, id: string) => {
  const existingUser = await prisma.user.findUnique({
    where: { id },
  });

  if (!existingUser) {
    throw new Error("User does not exist!");
  }
  const { name, slug } = req.body;
  const existingCategoryWithSlug = await prisma.category.findFirst({
    where: {
      slug,
      NOT: { id: req.body.id },
    },
  });

  if (existingCategoryWithSlug) {
    throw new Error("Slug already exists!");
  }

  await prisma.category.update({
    where: {
      id: req.body.id,
    },
    data: {
      name,
      slug,
    },
  });
};
export const CategoryService = {
  createCategoryIntoDB,
  getAllCategoryFromDB,
  updateCategoryIntoDB,
};
