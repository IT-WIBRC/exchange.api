import { Test, TestingModule } from "@nestjs/testing";
import { GetByNameUseCase } from "./GetByNameUseCase";
import { REPOSITORIES_PROVIDER } from "../../../helpers/constants";
import { Role } from "../../entities/role.entity";
import { RoleModule } from "../../../role/role.module";
import { PrismaModule } from "../../../prisma/prisma.module";

const roleRepo = {
  findRoleWithPermissionsByRoleName: jest.fn(),
};

describe("GetRoleByNameUseCase", () => {
  let getRoleByNameUseCase: GetByNameUseCase;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [RoleModule, PrismaModule],
      providers: [
        GetByNameUseCase,
        {
          provide: REPOSITORIES_PROVIDER.ROLE,
          useValue: roleRepo,
        },
      ],
    }).compile();

    getRoleByNameUseCase = moduleRef.get<GetByNameUseCase>(GetByNameUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const role = {
    name: "USER",
  };

  it("should be defined", () => {
    expect(getRoleByNameUseCase).toBeDefined();
  });

  it("should return the role if it exists", async () => {
    const roleResult = Role.create({ name: role.name });
    roleRepo.findRoleWithPermissionsByRoleName.mockResolvedValueOnce(
      roleResult,
    );
    const result = await getRoleByNameUseCase.execute(role);
    expect(roleRepo.findRoleWithPermissionsByRoleName).toHaveBeenCalledTimes(1);
    expect(roleRepo.findRoleWithPermissionsByRoleName).toHaveBeenCalledWith(
      role.name,
    );
    expect(result.value.getValue()).toBeInstanceOf(Role);
    expect((result.value.getValue() as Role).name).toBe(role.name);
  });

  it("should return the role not found message", async () => {
    roleRepo.findRoleWithPermissionsByRoleName.mockResolvedValueOnce(null);
    const result = await getRoleByNameUseCase.execute(role);
    expect(roleRepo.findRoleWithPermissionsByRoleName).toHaveBeenCalledTimes(1);
    expect(roleRepo.findRoleWithPermissionsByRoleName).toHaveBeenCalledWith(
      role.name,
    );
    expect(result.value.errorValue()).toEqual({
      message: `The role ${role.name} is not found`,
    });
  });

  it.skip("should return the awaited message when we encounter an error", async () => {
    roleRepo.findRoleWithPermissionsByRoleName.mockRejectedValueOnce(
      "unexpected one",
    );
    const result = await getRoleByNameUseCase.execute(role);
    expect(roleRepo.findRoleWithPermissionsByRoleName).toHaveBeenCalledTimes(1);
    expect(roleRepo.findRoleWithPermissionsByRoleName).toHaveBeenCalledWith(
      role.name,
    );
    expect(result.value.errorValue()).toEqual({
      message: "An unexpected error occurred.",
      error: "unexpected one",
    });
  });
});
