import { Test, TestingModule } from "@nestjs/testing";
import { EnableUserUseCase } from "./EnableUserUseCase";
import { OTPService } from "../../services/otp.service";
import { REPOSITORIES_PROVIDER } from "../../../helpers/constants";
import { PrismaModule } from "../../../prisma/prisma.module";
import { User } from "../../entities/user.entity";
import { Profile } from "../../entities/profile.entity";
import { LANG } from "../../dto/LANGUAGE";

const userRepo = {
  findUserByEmail: jest.fn(),
  enableUser: jest.fn(),
};

const emailService = {
  sendUserWelcome: jest.fn(),
};

const OtpService = {
  findByEmail: jest.fn(),
};

describe("EnableUserUseCase", () => {
  let enableUserUseCase: EnableUserUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [
        EnableUserUseCase,
        { provide: OTPService, useValue: OtpService },
        {
          provide: REPOSITORIES_PROVIDER.USER,
          useValue: userRepo,
        },
        {
          provide: REPOSITORIES_PROVIDER.EMAIL,
          useValue: emailService,
        },
      ],
    }).compile();

    enableUserUseCase = module.get<EnableUserUseCase>(EnableUserUseCase);
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  const otp = {
    email: "otpemail@email.com",
    code: "123456",
  };
  const userEntity = User.create({
    email: otp.email,
    password: "12345",
    username: "username",
    roles: [],
    isActive: false,
    profile: Profile.create({
      lang: LANG.EN,
      last_connection: new Date(),
    }),
    createdAt: new Date(),
  });

  it("should be defined", () => {
    expect(enableUserUseCase).toBeDefined();
  });

  it("should return an error message when the user is not found", async () => {
    userRepo.findUserByEmail.mockResolvedValueOnce(null);
    const result = await enableUserUseCase.execute(otp);
    expect(userRepo.findUserByEmail).toHaveBeenCalledTimes(1);
    expect(userRepo.findUserByEmail).toHaveBeenCalledWith(otp.email);
    expect(result.value.errorValue()).toEqual({
      message: `The ${otp.email} is not found`,
    });
  });

  it("should return an error message when the user is already active", async () => {
    const myUserEntity = User.create({
      email: otp.email,
      password: "12345",
      username: "username",
      roles: [],
      isActive: true,
      profile: Profile.create({
        lang: LANG.EN,
        last_connection: new Date(),
      }),
      createdAt: new Date(),
    });
    userRepo.findUserByEmail.mockResolvedValueOnce(myUserEntity);

    const result = await enableUserUseCase.execute(otp);
    expect(userRepo.findUserByEmail).toHaveBeenCalledTimes(1);
    expect(userRepo.findUserByEmail).toHaveBeenCalledWith(otp.email);

    expect(result.value.isFailure).toBe(true);
    expect(result.value.errorValue()).toEqual({
      message: `The ${myUserEntity.email} is already active`,
    });
  });

  it("should return an error message when the user does not have any otp in database", async () => {
    userRepo.findUserByEmail.mockResolvedValueOnce(userEntity);
    OtpService.findByEmail.mockResolvedValueOnce(undefined);

    const result = await enableUserUseCase.execute(otp);
    expect(userRepo.findUserByEmail).toHaveBeenCalledTimes(1);
    expect(userRepo.findUserByEmail).toHaveBeenCalledWith(otp.email);

    expect(OtpService.findByEmail).toHaveBeenCalledTimes(1);
    expect(OtpService.findByEmail).toHaveBeenCalledWith(userEntity.email);
    expect(result.value.isFailure).toBe(true);
    expect(result.value.errorValue()).toEqual({
      message: `The ${userEntity.email} does not have any otp assigned`,
    });
  });

  it("should return an error message when the otp has expired", async () => {
    jest.useFakeTimers().setSystemTime(new Date("2024-10-11"));
    const otpResult = {
      ...otp,
      code: Number(otp.code),
      create_at: new Date("2020-10-11"),
    };
    const userEntity = User.create({
      email: otp.email,
      password: "12345",
      username: "username",
      roles: [],
      isActive: false,
      profile: Profile.create({
        lang: LANG.EN,
        last_connection: new Date(),
      }),
      createdAt: new Date(),
    });
    userRepo.findUserByEmail.mockResolvedValueOnce(userEntity);
    OtpService.findByEmail.mockResolvedValueOnce(otpResult);

    const result = await enableUserUseCase.execute(otp);
    expect(userRepo.findUserByEmail).toHaveBeenCalledTimes(1);
    expect(userRepo.findUserByEmail).toHaveBeenCalledWith(otp.email);

    expect(OtpService.findByEmail).toHaveBeenCalledTimes(1);
    expect(OtpService.findByEmail).toHaveBeenCalledWith(userEntity.email);
    expect(result.value.isFailure).toBe(true);
    expect(result.value.errorValue()).toEqual({
      message: "The otp has expired",
    });
    jest.useRealTimers();
  });

  it("should return an error message when the otp are different", async () => {
    const otpResult = {
      ...otp,
      code: 239845,
      create_at: new Date(),
    };
    userRepo.findUserByEmail.mockResolvedValueOnce(userEntity);
    OtpService.findByEmail.mockResolvedValueOnce(otpResult);

    const result = await enableUserUseCase.execute(otp);
    expect(userRepo.findUserByEmail).toHaveBeenCalledTimes(1);
    expect(userRepo.findUserByEmail).toHaveBeenCalledWith(otp.email);

    expect(OtpService.findByEmail).toHaveBeenCalledTimes(1);
    expect(OtpService.findByEmail).toHaveBeenCalledWith(userEntity.email);
    expect(result.value.isFailure).toBe(true);
    expect(result.value.errorValue()).toEqual({
      message: "Wrong otp code provide",
    });
  });

  it("should enable the user when opt is still valid", async () => {
    const otpResult = {
      ...otp,
      code: Number(otp.code),
      create_at: new Date(),
    };
    userRepo.findUserByEmail.mockResolvedValueOnce(userEntity);
    OtpService.findByEmail.mockResolvedValueOnce(otpResult);

    const result = await enableUserUseCase.execute(otp);
    expect(userRepo.findUserByEmail).toHaveBeenCalledTimes(1);
    expect(userRepo.findUserByEmail).toHaveBeenCalledWith(otp.email);

    expect(OtpService.findByEmail).toHaveBeenCalledTimes(1);
    expect(OtpService.findByEmail).toHaveBeenCalledWith(userEntity.email);

    expect(userRepo.enableUser).toHaveBeenCalledTimes(1);
    expect(userRepo.enableUser).toHaveBeenCalledWith(userEntity.email);

    expect(emailService.sendUserWelcome).toHaveBeenCalledTimes(1);
    expect(emailService.sendUserWelcome).toHaveBeenCalledWith({
      email: userEntity.email,
      username: userEntity.username,
    });

    expect(result.value.isSuccess).toBe(true);
    expect(result.value.getValue()).toBeUndefined();
  });
});
