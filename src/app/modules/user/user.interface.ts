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
  gender: Gender;
  profilePhoto?: string;
  needPasswordChange: boolean | null;
  role: string;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
};
