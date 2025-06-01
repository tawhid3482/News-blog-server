import bcrypt from "bcrypt";
import {
  Gender,
  PrismaClient,
  UserRole,
  UserStatus,
} from "../../generated/prisma";
import config from "../config";

const prisma = new PrismaClient();

const ensureSuperAdmin = async () => {
  const existing = await prisma.user.findFirst({
    where: { role: UserRole.SUPER_ADMIN },
  });

  if (!existing) {
    await prisma.user.create({
      data: {
        name: "Super Admin",
        email: `${config.super_admin}`,
        password: await bcrypt.hash(`${config.super_pass}`, 10),
        role: UserRole.SUPER_ADMIN,
        profilePhoto:"https://img.freepik.com/premium-vector/silver-membership-icon-default-avatar-profile-icon-membership-icon-social-media-user-image-vector-illustration_561158-4195.jpg",
        gender: Gender.MALE,
        status: "ACTIVE",
        needPasswordChange: false,
      },
    });
  } else {
    console.log("✅ Super Admin already exists");
  }
};

export default ensureSuperAdmin;
