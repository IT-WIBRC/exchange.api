import { Test, TestingModule } from "@nestjs/testing";
import { PrismaService } from "../../prisma/prisma.service";
import { RoleRepository } from "./role.repository";
import { Role } from "../entities/role.entity";
import { PrismaModule } from "../../prisma/prisma.module";
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";

const prismaServiceMock = {
  role: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
};

describe("RoleRepository", () => {
  let roleRepository: RoleRepository;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [RoleRepository],
    })
      .overrideProvider(PrismaService)
      .useValue(prismaServiceMock)
      .compile();

    roleRepository = moduleRef.get<RoleRepository>(RoleRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("When we find role with its permissions according to the role name", () => {
    it("should find the role", async () => {
      const roleResult = {
        name: "USER",
        id: "2d492cea-9a4c-42ab-8151-e5c05bb4dd6c",
        permissions: [
          {
            name: "user:read",
            id: "3d482cea-9a4c-42ab-8151-e5c05bb4dd6c",
          },
        ],
      };

      prismaServiceMock.role.findUnique.mockResolvedValue(roleResult);

      const result = await roleRepository.findRoleWithPermissionsByRoleName(
        roleResult.name,
      );
      expect(prismaServiceMock.role.findUnique).toHaveBeenCalledTimes(1);
      expect(prismaServiceMock.role.findUnique).toHaveBeenCalledWith({
        where: {
          name: roleResult.name,
        },
        include: {
          permissions: true,
        },
      });
      expect(
        result.equals(
          Role.create(
            { name: roleResult.name, permissions: [] },
            new UniqueEntityID(roleResult.id),
          ),
        ),
      ).toBe(true);
    });

    it("should not find any role with the name", async () => {
      prismaServiceMock.role.findUnique.mockResolvedValue(null);

      const result =
        await roleRepository.findRoleWithPermissionsByRoleName("unknown");
      expect(prismaServiceMock.role.findUnique).toHaveBeenCalledTimes(1);
      expect(result).toBeNull();
    });
  });

  describe("When we check if the role already exist", () => {
    it("should return true if the role already exist", async () => {
      const roleResult = {
        name: "USER",
        id: "2d492cea-9a4c-42ab-8151-e5c05bb4dd6c",
      };

      prismaServiceMock.role.findUnique.mockResolvedValue(roleResult);

      const isRoleExist = await roleRepository.exists(roleResult.name);
      expect(prismaServiceMock.role.findUnique).toHaveBeenCalledTimes(1);
      expect(prismaServiceMock.role.findUnique).toHaveBeenCalledWith({
        where: { name: roleResult.name },
      });
      expect(isRoleExist).toBe(true);
    });

    it("should return false if the role does not exist", async () => {
      prismaServiceMock.role.findUnique.mockResolvedValue(null);

      const isRoleExist = await roleRepository.exists("unknown");
      expect(prismaServiceMock.role.findUnique).toHaveBeenCalledTimes(1);
      expect(isRoleExist).toBe(false);
    });
  });

  describe("When we want to create a new role", () => {
    it("should create a role", async () => {
      const newRole = {
        name: "USER",
      };
      await roleRepository.save(
        Role.create({
          name: newRole.name,
        }),
      );
      expect(prismaServiceMock.role.create).toHaveBeenCalledTimes(1);
      expect(prismaServiceMock.role.create).toHaveBeenCalledWith({
        data: {
          name: newRole.name,
        },
      });
    });
  });
});
