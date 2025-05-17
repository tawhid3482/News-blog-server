import bcrypt from "bcrypt";
import { Gender, PrismaClient, UserRole, UserStatus } from "../../generated/prisma";

const prisma = new PrismaClient();

const ensureSuperAdmin = async () => {
  const existing = await prisma.user.findFirst({
    where: { role: UserRole.SUPER_ADMIN },
  });

  if (!existing) {
    await prisma.user.create({
      data: {
        name: "Super Admin",
        email: "tawhidulislam3482@gmail.com",
        password: await bcrypt.hash("724568", 10),
        role: UserRole.SUPER_ADMIN,
        gender: Gender.MALE,
        status: "ACTIVE",
        needPasswordChange: false,
      },
    });
    console.log("✅ Default Super Admin Created");
  } else {
    console.log("✅ Super Admin already exists");
  }
};

export default ensureSuperAdmin;
