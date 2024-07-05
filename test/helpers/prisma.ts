import { PrismaClient } from "@prisma/client";
import { hashSync } from "bcrypt";
import { LANG } from "../../src/user/dto/LANGUAGE";

const prisma = new PrismaClient();

const resetDb = async (): Promise<void> => {
  await prisma.$transaction([
    prisma.profile.deleteMany(),
    prisma.user.deleteMany(),
    prisma.conversation.deleteMany(),
    prisma.groupMember.deleteMany(),
    prisma.otp.deleteMany(),
    prisma.conversationConfig.deleteMany(),
    prisma.message.deleteMany(),
  ]);
  await new Promise(process.nextTick);
};

const users = [
  {
    email: "test@email.com",
    username: "testUsername",
    password: "pAsswordail@234948",
    isActive: false,
  },
  {
    email: "test2@email.com",
    username: "test1Username",
    password: "pAsswordail@234940",
    isActive: true,
  },
];

const fillUserTable = async (): Promise<void> => {
  for (const user of users) {
    const hasPassword = hashSync(
      user.password,
      Number(process.env.ROUNDS_OF_HASHING),
    );
    await prisma.user.create({
      data: {
        email: user.email,
        password: hasPassword,
        username: user.username,
        is_active: user.isActive,
        profile: {
          create: {
            last_connection: new Date(),
            date_of_birth: null,
            lang: LANG.EN,
          },
        },
      },
    });
  }
};

const createOtp = async ({
  code,
  email,
  date,
}: {
  code: number;
  email: string;
  date?: string;
}): Promise<void> => {
  await prisma.otp.create({
    data: {
      code,
      email,
      create_at: date ? new Date(date) : new Date(),
    },
  });
};

export default {
  resetDb,
  fillUserTable,
  createOtp,
  users,
};
