import { Author, Category, Tag } from "../../../../generated/prisma";


export type IOpinionFilterRequest = {
  searchTerm?: string;
  categoryId?: string;
  authorId?: string;
  isPublished?: boolean;
  tags?: string[]; // tag names or tag IDs depending on your implementation
  fromDate?: string; // ISO date string
  toDate?: string;   // ISO date string
};



export type TOpinons = {
  title: string;
  slug: string;
  content: string;
  authorId: string;
  author: Author;
  categoryId: string;
  category: Category;
  tags: Tag[];
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
};
 