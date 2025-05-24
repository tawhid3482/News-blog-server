import { Gender, UserRole, UserStatus } from "../../../../generated/prisma";

export type IUserFilterRequest = {
  searchTerm?: string | undefined;
  email?: string | undefined;
  status?: UserStatus | undefined;
};

export type TUser = {
  id: string;
  email: string;
  name: string;
  password?:string;
  gender: Gender;
  profilePhoto?: string;
  needPasswordChange: boolean | null;
  role: string;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
};

export type UserStats = {
  reactionCount: number;
  reactionTypeCounts: Record<string, number>;
  commentCount: number;
  totalReadingTime: number;
  lastInteraction: {
    postId: string;
    postTitle: string;
    type: 'reaction' | 'comment';
    subtype?: string;
    createdAt: Date;
  } | null;
  lastComment: {
    id: string;
    content: string;
    postId: string;
    postTitle: string;
    createdAt: Date;
  } | null;
};

