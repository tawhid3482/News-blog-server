// ✅ Opinion.service.ts
import { Request } from "express";
import prisma from "../../../shared/prisma";
import { IOpinionFilterRequest } from "./opinions.interface";
import { opinionSearchableFields } from "./opinion.constant";
import { Prisma } from "../../../../generated/prisma";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { IGenericResponse } from "../../../interfaces/common";
import { paginationHelpers } from "../../../helpers/paginationHelper";

const createOpinionIntoDB = async (req: Request, userId: string) => {
  const { title, slug, content, categoryId, tags = [] } = req.body; // tags array expected [{ name: string }, ...]

  const opinion = await prisma.opinion.create({
    data: {
      title,
      slug,
      content,
      authorId: userId,
      categoryId,
      tags: {
        connectOrCreate: tags.map((tag: { name: string }) => ({
          where: { name: tag.name },
          create: { name: tag.name },
        })),
      },
    },
    include: {
      tags: true,
      author: {
        select: {
          name: true,
          email: true,
          profilePhoto: true,
        },
      },
      category: true,
    },
  });

  return opinion;
};

const getAllOpinionFromDB = async (
  filters: IOpinionFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<any[]>> => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, fromDate, toDate, tags, ...filterData } = filters;

  const andConditions: any[] = [];

  // Search functionality
  if (searchTerm) {
    andConditions.push({
      OR: [
        ...opinionSearchableFields.map((field) => ({
          [field]: {
            contains: searchTerm,
            mode: "insensitive",
          },
        })),
        {
          category: {
            is: {
              slug: {
                contains: searchTerm,
                mode: "insensitive",
              },
            },
          },
        },
        {
          tags: {
            some: {
              name: {
                equals: searchTerm,
              },
            },
          },
        },
      ],
    });
  }

  // Filter fields
  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => {
        const value = (filterData as any)[key];

        if (key === "title" || key === "slug") {
          return {
            [key]: {
              contains: value,
              mode: "insensitive",
            },
          };
        }

        if (key === "category") {
          return {
            category: {
              is: {
                name: {
                  equals: value,
                },
              },
            },
          };
        }

        if (key === "isPublished") {
          return {
            [key]: {
              equals:
                value === "true" ? true : value === "false" ? false : value,
            },
          };
        }

        if (key === "categoryId" || key === "authorId" || key === "status") {
          return {
            [key]: {
              equals: value,
            },
          };
        }

        return {
          [key]: {
            equals: value,
          },
        };
      }),
    });
  }

  // Date range
  if (fromDate || toDate) {
    andConditions.push({
      createdAt: {
        ...(fromDate && { gte: new Date(fromDate) }),
        ...(toDate && { lte: new Date(toDate) }),
      },
    });
  }

  const whereConditions: Prisma.OpinionWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.opinion.findMany({
    where: { ...whereConditions, isPublished: true },
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : { createdAt: "desc" },
    include: {
      author: {
        select: {
          name: true,
          email: true,
          profilePhoto: true,
        },
      },
      category: true,
      tags: true,
    },
  });

  const total = await prisma.opinion.count({
    where: whereConditions,
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getSingleOpinionFromDB = async (slug: string) => {
  return await prisma.opinion.findUnique({
    where: { slug, isPublished: true },
    include: {
      author: {
        select: {
          name: true,
          email: true,
          profilePhoto: true,
        },
      },
      category: true,
      tags: true,
    },
  });
};

const updateOpinionIntoDB = async (
  req: Request,
  id: string,
  userId: string
) => {
  const { title, slug, content, categoryId, tagIds } = req.body;

  const updated = await prisma.opinion.update({
    where: { id },
    data: {
      title,
      slug,
      content,
      categoryId,
      tags: tagIds
        ? {
            set: [],
            connect: tagIds.map((tagId: string) => ({ id: tagId })),
          }
        : undefined,
    },
    include: {
      tags: true,
      author: {
        select: {
          name: true,
          email: true,
          profilePhoto: true,
        },
      },
      category: true,
    },
  });

  return updated;
};

const updateOpinionStatusIntoDB = async (
  req: Request,
  userId: string,
  id: string
) => {
  const { isPublished } = req.body;

  const updated = await prisma.opinion.update({
    where: { id },
    data: { isPublished },
  });

  return updated;
};

const deleteOpinionFromDB = async (id: string) => {
  return await prisma.opinion.delete({
    where: { id },
  });
};

export const OpinionService = {
  createOpinionIntoDB,
  getAllOpinionFromDB,
  getSingleOpinionFromDB,
  updateOpinionIntoDB,
  updateOpinionStatusIntoDB,
  deleteOpinionFromDB,
};
