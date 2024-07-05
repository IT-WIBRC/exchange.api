import { Test, TestingModule } from "@nestjs/testing";
import { PrismaService } from "../../prisma/prisma.service";
import { UserRepository } from "./user.repository";
import { User } from "../entities/user.entity";
import { PrismaModule } from "../../prisma/prisma.module";
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";
import { Profile } from "../entities/profile.entity";
import { LANG } from "../dto/LANGUAGE";

const prismaServiceMock = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  profile: {
    delete: jest.fn(),
  },
  $transaction: jest.fn(),
};

describe("UserRepository", () => {
  let userRepository: UserRepository;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [UserRepository],
    })
      .overrideProvider(PrismaService)
      .useValue(prismaServiceMock)
      .compile();

    userRepository = moduleRef.get<UserRepository>(UserRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const userData = {
    id: "d8ec74ae-88ed-45b6-abb8-ab666e2b7ceb",
    email: "email@email.com",
    username: "emailUsername",
    password: "12345",
    group_members: [],
    roles: [
      {
        name: "USER",
        id: "2d492cea-9a4c-42ab-8151-e5c05bb4dd6c",
      },
    ],
    is_active: false,
    profile: {
      id: "6109c51f-cea0-416d-af11-d470edd7ef02",
      last_connection: new Date(),
    },
    create_at: new Date(),
  };

  const userEntity = User.create(
    {
      username: userData.username,
      roles: [],
      email: userData.email,
      isActive: userData.is_active,
      profile: Profile.create(
        {
          last_connection: userData.profile.last_connection,
          lang: LANG.EN,
        },
        new UniqueEntityID(userData.profile.id),
      ),
      password: "12345",
      createdAt: userData.create_at,
    },
    new UniqueEntityID(userData.id),
  );

  describe("When we find a user with all its information using its email", () => {
    it("should find the user", async () => {
      prismaServiceMock.user.findUnique.mockResolvedValue(userData);

      const result = await userRepository.findUserByEmailWithRelations(
        userData.email,
      );
      expect(prismaServiceMock.user.findUnique).toHaveBeenCalledTimes(1);
      expect(prismaServiceMock.user.findUnique).toHaveBeenCalledWith({
        where: {
          email: userData.email,
        },
        include: {
          profile: true,
          group_members: {
            select: {
              group_member_id: true,
            },
          },
          roles: {
            select: {
              id: true,
            },
          },
        },
      });
      expect(result.equals(userEntity)).toBe(true);
    });

    it("should not find any role with the name", async () => {
      prismaServiceMock.user.findUnique.mockResolvedValue(null);

      const result =
        await userRepository.findUserByEmailWithRelations("unknown");
      expect(prismaServiceMock.user.findUnique).toHaveBeenCalledTimes(1);
      expect(result).toBeNull();
    });
  });

  describe("When we find a user using its email", () => {
    it("should find the user", async () => {
      prismaServiceMock.user.findUnique.mockResolvedValue(userData);

      const result = await userRepository.findUserByEmail(userData.email);
      expect(prismaServiceMock.user.findUnique).toHaveBeenCalledTimes(1);
      expect(prismaServiceMock.user.findUnique).toHaveBeenCalledWith({
        where: {
          email: userData.email,
        },
        include: {
          profile: true,
        },
      });
      expect(result.equals(userEntity)).toBe(true);
    });

    it("should not find any role with the name", async () => {
      prismaServiceMock.user.findUnique.mockResolvedValue(null);

      const result = await userRepository.findUserByEmail("unknown");
      expect(prismaServiceMock.user.findUnique).toHaveBeenCalledTimes(1);
      expect(result).toBeNull();
    });
  });

  describe("When we check if the user already exist", () => {
    it("should return true if the user already exist", async () => {
      prismaServiceMock.user.findUnique.mockResolvedValue(userData);

      const isUserExist = await userRepository.exists(userData.email);
      expect(prismaServiceMock.user.findUnique).toHaveBeenCalledTimes(1);
      expect(prismaServiceMock.user.findUnique).toHaveBeenCalledWith({
        where: { email: userData.email },
      });
      expect(isUserExist).toBe(true);
    });

    it("should return false if the user does not exist", async () => {
      prismaServiceMock.user.findUnique.mockResolvedValue(null);

      const isUserExist = await userRepository.exists("unknown");
      expect(prismaServiceMock.user.findUnique).toHaveBeenCalledTimes(1);
      expect(isUserExist).toBe(false);
    });
  });

  describe("When we want to create a new user", () => {
    it("should create a user", async () => {
      jest.useFakeTimers();
      const myUserEntity = User.create(
        {
          username: userData.username,
          roles: [],
          email: userData.email,
          isActive: userData.is_active,
          profile: Profile.create(
            {
              last_connection: userData.profile.last_connection,
              lang: LANG.EN,
            },
            new UniqueEntityID(userData.profile.id),
          ),
          password: "12345",
          createdAt: userData.create_at,
        },
        new UniqueEntityID(userData.id),
      );
      await userRepository.save(myUserEntity);
      expect(prismaServiceMock.user.create).toHaveBeenCalledTimes(1);
      expect(prismaServiceMock.user.create).toHaveBeenCalledWith({
        data: {
          email: myUserEntity.email,
          password: myUserEntity.password,
          username: myUserEntity.username,
          roles: {
            connect: myUserEntity.roles.map((roleId) => ({
              id: roleId.toValue(),
            })),
          },
          profile: {
            create: {
              last_connection: new Date(),
              date_of_birth: myUserEntity.profile.date_of_birth,
              lang: myUserEntity.profile.lang,
              photo: myUserEntity.profile.photo,
            },
          },
        },
      });
      jest.useRealTimers();
    });
  });

  describe("When we want to delete a user", () => {
    it("should delete the user", async () => {
      prismaServiceMock.user.delete.mockResolvedValue({});
      prismaServiceMock.profile.delete.mockResolvedValue({});

      await userRepository.delete(userData.email);
      expect(prismaServiceMock.user.delete).toHaveBeenCalledTimes(1);
      expect(prismaServiceMock.profile.delete).toHaveBeenCalledTimes(1);
      expect(prismaServiceMock.$transaction).toHaveBeenCalledTimes(1);

      expect(prismaServiceMock.profile.delete).toHaveBeenCalledWith({
        where: { userEmail: userData.email },
      });

      expect(prismaServiceMock.user.delete).toHaveBeenCalledWith({
        where: { email: userData.email },
      });
    });
  });

  describe("When we want to enable a user", () => {
    it("should enable the user", async () => {
      prismaServiceMock.user.update.mockResolvedValue({});

      await userRepository.enableUser(userData.email);
      expect(prismaServiceMock.user.update).toHaveBeenCalledTimes(1);
      expect(prismaServiceMock.user.update).toHaveBeenCalledWith({
        where: { email: userData.email },
        data: {
          is_active: true,
        },
      });
    });
  });
});
