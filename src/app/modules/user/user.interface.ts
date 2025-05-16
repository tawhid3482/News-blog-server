import { UserStatus } from "../../../../generated/prisma";

export type TUser = {
  id: string;
  email: string;
  name: string;
  gender: string;
  profilePhoto?: string;
  role: string;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
};
