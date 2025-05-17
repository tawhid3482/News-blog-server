import { PostStatus } from "../../../../generated/prisma";
import { Author, Category, Tag, Reaction, Comment, PostView } from "../../../../generated/prisma";

export type TPost = {
  title: string;
  slug: string;
  summary?: string;
  content: string;
  coverImage?: string;
  authorId: string;
  author: Author;
  categoryId: string;
  category: Category;
  tags: Tag[];
  isPublished: boolean;
  publishedAt?: Date;
  status: PostStatus;
  reactions: Reaction[];
  comments: Comment[];
  viewsCount: number;
  postViews: PostView[];
  readingTime?: number;
  createdAt: Date;
  updatedAt: Date;
};
 