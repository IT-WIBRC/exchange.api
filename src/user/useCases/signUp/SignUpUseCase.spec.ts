jest.mock("uuid", () => ({
  v4: jest.fn(() => "12345"),
}));

jest.mock("bcrypt", () => ({
  hashSync: jest.fn((password) => password),
}));

import { Test, TestingModule } from "@nestjs/testing";
import { SignUpUseCase } from "./SignUpUseCase";
import { PrismaModule } from "../../../prisma/prisma.module";
import { OTPService } from "../../services/otp.service";
import { REPOSITORIES_PROVIDER } from "../../../helpers/constants";
import { ConfigModule } from "@nestjs/config";
import { LANG } from "../../dto/LANGUAGE";
import { defaultRoles } from "../../../helpers/defaults";
import { Role } from "../../../role/entities/role.entity";
import { User } from "../../entities/user.entity";
import { Profile } from "../../entities/profile.entity";
import { UniqueEntityID } from "../../../core/domain/UniqueEntityID";

const userRepo = {
  exists: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
};

const roleRepo = {
  findRoleWithPermissionsByRoleName: jest.fn(),
};

const emailService = {
  sendUserConfirmation: jest.fn(),
};

const OtpService = {
  save: jest.fn(),
};

describe("SignUpUseCase", () => {
  let signUpUseCase: SignUpUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule, ConfigModule],
      providers: [
        SignUpUseCase,
        { provide: OTPService, useValue: OtpService },
        {
          provide: REPOSITORIES_PROVIDER.USER,
          useValue: userRepo,
        },
        {
          provide: REPOSITORIES_PROVIDER.EMAIL,
          useValue: emailService,
        },
        {
          provide: REPOSITORIES_PROVIDER.ROLE,
          useValue: roleRepo,
        },
      ],
    }).compile();

    signUpUseCase = module.get<SignUpUseCase>(SignUpUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const user = {
    email: "otpemail@email.com",
    username: "username",
    password: "12345678",
    profilePicture: "",
    dateOfBird: new Date().toISOString(),
    lang: LANG.EN,
  };

  it("should be defined", () => {
    expect(signUpUseCase).toBeDefined();
  });

  it("should return an error message when the role doesn't exist yet", async () => {
    roleRepo.findRoleWithPermissionsByRoleName.mockReturnValueOnce(null);
    const result = await signUpUseCase.execute(user);
    expect(roleRepo.findRoleWithPermissionsByRoleName).toHaveBeenCalledTimes(1);
    expect(roleRepo.findRoleWithPermissionsByRoleName).toHaveBeenCalledWith(
      defaultRoles.user.value,
    );
    expect(result.value.isFailure).toBe(true);
    expect(result.value.errorValue()).toEqual({
      message: `The role ${defaultRoles.user.value} is not found`,
    });
  });

  it("should return an error message when an user already exist with this email", async () => {
    const role = Role.create({
      name: defaultRoles.user.value,
    });
    roleRepo.findRoleWithPermissionsByRoleName.mockReturnValueOnce(role);
    userRepo.exists.mockResolvedValueOnce({});

    const result = await signUpUseCase.execute(user);

    expect(roleRepo.findRoleWithPermissionsByRoleName).toHaveBeenCalledTimes(1);
    expect(roleRepo.findRoleWithPermissionsByRoleName).toHaveBeenCalledWith(
      defaultRoles.user.value,
    );

    expect(userRepo.exists).toHaveBeenCalledTimes(1);
    expect(userRepo.exists).toHaveBeenCalledWith(user.email);

    expect(result.value.isFailure).toBe(true);
    expect(result.value.errorValue()).toEqual({
      message: `The email ${user.email} associated for this account already exists`,
    });
  });

  it("should create the user and send the otp by email", async () => {
    jest.useFakeTimers();
    global.Math.random = jest.fn(() => 0.1);

    const user = {
      email: "otpemail@email.com",
      username: "username",
      password: "12345678",
      profilePicture: "",
      dateOfBird: new Date().toISOString(),
      lang: LANG.EN,
    };
    const role = Role.create(
      {
        name: defaultRoles.user.value,
      },
      new UniqueEntityID("12345"),
    );
    roleRepo.findRoleWithPermissionsByRoleName.mockReturnValueOnce(role);
    userRepo.exists.mockResolvedValueOnce(null);
    userRepo.save.mockResolvedValueOnce({});
    emailService.sendUserConfirmation.mockResolvedValueOnce({});

    const result = await signUpUseCase.execute(user);

    expect(roleRepo.findRoleWithPermissionsByRoleName).toHaveBeenCalledTimes(1);
    expect(roleRepo.findRoleWithPermissionsByRoleName).toHaveBeenCalledWith(
      defaultRoles.user.value,
    );

    expect(userRepo.exists).toHaveBeenCalledTimes(1);
    expect(userRepo.exists).toHaveBeenCalledWith(user.email);

    expect(userRepo.save).toHaveBeenCalledTimes(1);
    expect(userRepo.save).toHaveBeenCalledWith(
      User.create({
        email: user.email,
        isActive: false,
        createdAt: new Date(),
        password: user.password,
        profile: Profile.create(
          {
            lang: LANG.EN,
            last_connection: new Date(),
            photo: user.profilePicture,
            date_of_birth: new Date(),
          },
          new UniqueEntityID("12345"),
        ),
        roles: [role.id],
        username: user.username,
      }),
    );

    expect(emailService.sendUserConfirmation).toHaveBeenCalledTimes(1);
    expect(emailService.sendUserConfirmation).toHaveBeenCalledWith({
      code: 111111,
      email: user.email,
      username: user.username,
    });

    expect(OtpService.save).toHaveBeenCalledTimes(1);
    expect(OtpService.save).toHaveBeenCalledWith(user.email, 111111);

    expect(result.value.isSuccess).toBe(true);
    jest.useRealTimers();
  });
});
