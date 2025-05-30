import { PostStatus } from "../../../../generated/prisma";
import {
  Author,
  Category,
  Tag,
  Reaction,
  Comment,
  PostView,
} from "../../../../generated/prisma";

export type IPostFilterRequest = {
  searchTerm?: string;
  categoryId?: string;
  authorId?: string;
  status?: PostStatus; // বা যদি PostStatus enum থাকে, সেটা use করো
  isPublished?: boolean;
  tags?: string[]; // tag names or tag IDs depending on your implementation
  fromDate?: string; // ISO date string
  toDate?: string; // ISO date string
};

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
export type TNews = {
  id: string;
  title: string;
  content: string;
  coverImage: string | null;
};

export interface ITrackPostViewPayload {
  postId: string;
  userId: string | null;
  ipAddress: string | null;
  userAgent: string;
}
