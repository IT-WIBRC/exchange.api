import { PrismaClient } from "@prisma/client";
import { defaultRoles } from "./defaults";

const prisma = new PrismaClient();

const initDefaultRoles = async (): Promise<void> => {
  for (const role in defaultRoles) {
    await prisma.role.upsert({
      where: { name: defaultRoles[role].value },
      update: {},
      create: {
        name: defaultRoles[role].value,
        description: defaultRoles[role].value,
        permissions: {
          connectOrCreate: defaultRoles[role].permissions.map(
            (permission: string) => ({
              where: {
                name: permission,
              },
              create: {
                name: permission,
                description: permission,
              },
            }),
          ),
        },
      },
    });
  }
};

const initAdminUser = async (): Promise<void> => {
  await prisma.user.create({
    data: {
      email: "admin@cgge.exchange.com",
      password: "Admin@459Exc",
      username: "Admin",
      roles: {
        connect: {
          name: defaultRoles.admin.value,
        },
      },
      profile: {
        create: {
          last_connection: new Date(),
        },
      },
    },
  });
};

async function main() {
  await initDefaultRoles();
  await initAdminUser();
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
