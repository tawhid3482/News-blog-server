// Review.service.ts
import { Request } from "express";
import prisma from "../../../shared/prisma";

const createReviewIntoDB = async (req: Request, id: string) => {
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
const showAllReviewFromDB = async () => {
  const reviews = await prisma.websiteReview.findMany({
    where: {
      isDeleted: false,
      isApproved: true,
    },
    orderBy: {
      createdAt: 'desc', // সর্বশেষ রিভিউ প্রথমে আসবে
    },
    take: 10, // সর্বশেষ ১০টি রিভিউ নেবে
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

const updateReviewStatusIntoDB = async (
  req: Request,
  userId: string,
  id: string
) => {
  const { isApproved, isDeleted } = req.body;

  // Check user
  const existingUser = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!existingUser) {
    throw new Error("User does not exist!");
  }

  // Check review existence
  const existingReview = await prisma.websiteReview.findUnique({
    where: { id },
  });

  if (!existingReview) {
    throw new Error("Review does not exist!");
  }

  const updatedReview = await prisma.websiteReview.update({
    where: { id },
    data: {
      isApproved:
        typeof isApproved === "boolean"
          ? isApproved
          : existingReview.isApproved,
      isDeleted:
        typeof isDeleted === "boolean" ? isDeleted : existingReview.isDeleted,
    },
  });

  return updatedReview;
};

export const ReviewService = {
  createReviewIntoDB,
  getAllReviewFromDB,
  updateReviewIntoDB,
  deleteReviewFromDB,
  getMyReviewFromDB,
  updateReviewStatusIntoDB,
  showAllReviewFromDB,
};
