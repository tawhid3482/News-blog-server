// Review.service.ts
import { Request } from "express";
import prisma from "../../../shared/prisma";

const createReviewIntoDB = async (req: Request,id:string) => {
  const { content, rating, isAnonymous = false } = req.body;
  const review = await prisma.websiteReview.create({
    data: {
      content,
      rating,
      isAnonymous,
      reviewerId: isAnonymous ? null : id,
    },
  });

  return review;
};

const getAllReviewFromDB = async () => {
  const reviews = await prisma.websiteReview.findMany({
    where: { isDeleted: false },
    include: {
      reviewer: true,
    },
  });

  return reviews;
};

const getMyReviewFromDB = async (userId: string) => {
  const reviews = await prisma.websiteReview.findMany({
    where: {
      reviewerId: userId,
      isDeleted: false,
    },
    include: {
      reviewer: true,
    },
  });

  return reviews;
};

const updateReviewIntoDB = async (req: Request, userId: string) => {
  const existingUser = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!existingUser) {
    throw new Error("User does not exist!");
  }

  const { id, content, rating, isAnonymous } = req.body;

  const updatedReview = await prisma.websiteReview.update({
    where: { id, isDeleted: false },
    data: {
      content,
      rating,
      isAnonymous,
    },
  });

  return updatedReview;
};
// service
const deleteReviewFromDB = async (id: string) => {
  const deleted = await prisma.websiteReview.update({
    where: { id },
    data: {
      isDeleted: true,
    },
  });
  return deleted;
};

export const ReviewService = {
  createReviewIntoDB,
  getAllReviewFromDB,
  updateReviewIntoDB,
  deleteReviewFromDB,
  getMyReviewFromDB,
};
