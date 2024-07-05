import { Test, TestingModule } from "@nestjs/testing";
import { ResendOtpUseCase } from "./ResendOtpUseCase";
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
  sendUserConfirmation: jest.fn(),
};

const OtpService = {
  save: jest.fn(),
};

describe("ResendOtpUseCase", () => {
  let resendOtpUseCase: ResendOtpUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [
        ResendOtpUseCase,
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

    resendOtpUseCase = module.get<ResendOtpUseCase>(ResendOtpUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const otp = {
    email: "otpemail@email.com",
  };
  const userEntity = User.create({
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

  it("should be defined", () => {
    expect(resendOtpUseCase).toBeDefined();
  });

  it("should return an error message when the user is not found", async () => {
    userRepo.findUserByEmail.mockResolvedValueOnce(null);
    const result = await resendOtpUseCase.execute(otp);
    expect(userRepo.findUserByEmail).toHaveBeenCalledTimes(1);
    expect(userRepo.findUserByEmail).toHaveBeenCalledWith(otp.email);
    expect(result.value.errorValue()).toEqual({
      message: `The ${otp.email} is not found`,
    });
  });

  it("should return an error message when the user is already enabled", async () => {
    userRepo.findUserByEmail.mockResolvedValueOnce(userEntity);

    const result = await resendOtpUseCase.execute(otp);
    expect(userRepo.findUserByEmail).toHaveBeenCalledTimes(1);
    expect(userRepo.findUserByEmail).toHaveBeenCalledWith(otp.email);

    expect(result.value.isFailure).toBe(true);
    expect(result.value.errorValue()).toEqual({
      message: `The ${userEntity.email} is already active`,
    });
  });

  it("should send the new otp by email and save it", async () => {
    global.Math.random = jest.fn(() => 0.1);
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
    OtpService.save.mockResolvedValueOnce({});

    const result = await resendOtpUseCase.execute(otp);
    expect(userRepo.findUserByEmail).toHaveBeenCalledTimes(1);
    expect(userRepo.findUserByEmail).toHaveBeenCalledWith(otp.email);

    expect(emailService.sendUserConfirmation).toHaveBeenCalledTimes(1);
    expect(emailService.sendUserConfirmation).toHaveBeenCalledWith({
      code: 111111,
      email: userEntity.email,
      username: userEntity.username,
    });

    expect(OtpService.save).toHaveBeenCalledTimes(1);
    expect(OtpService.save).toHaveBeenCalledWith(userEntity.email, 111111);

    expect(result.value.isSuccess).toBe(true);
    expect(result.value.getValue()).toBeUndefined();
  });
});
