import { Test, TestingModule } from "@nestjs/testing";
import { PrismaService } from "../../prisma/prisma.service";
import { PrismaModule } from "../../prisma/prisma.module";
import { OTPService } from "./otp.service";

const prismaServiceMock = {
  otp: {
    findMany: jest.fn(),
    create: jest.fn(),
  },
};

describe("OTPService", () => {
  let otpService: OTPService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [OTPService],
    })
      .overrideProvider(PrismaService)
      .useValue(prismaServiceMock)
      .compile();

    otpService = moduleRef.get<OTPService>(OTPService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("When we want to find the last user otp", () => {
    it("should return true if the user o already exist", async () => {
      jest.useFakeTimers();
      const otpResult = {
        email: "otpEmail@email.com",
        code: 123456,
        id: "2d492cea-9a4c-42ab-8151-e5c05bb4dd6c",
        create_at: new Date(),
      };

      prismaServiceMock.otp.findMany.mockResolvedValue([
        otpResult,
        { ...otpResult, id: "b0c228f4-d251-46cb-921c-5a9321827222" },
      ]);

      const lastUserOtp = await otpService.findByEmail(otpResult.email);
      expect(prismaServiceMock.otp.findMany).toHaveBeenCalledTimes(1);
      expect(prismaServiceMock.otp.findMany).toHaveBeenCalledWith({
        where: { email: otpResult.email },
        orderBy: { create_at: "desc" },
      });
      expect(lastUserOtp).toEqual(otpResult);
      jest.useRealTimers();
    });

    it("should return null if the user does not exist", async () => {
      prismaServiceMock.otp.findMany.mockResolvedValue([]);

      const lastUserOtp = await otpService.findByEmail("unknown");
      expect(prismaServiceMock.otp.findMany).toHaveBeenCalledTimes(1);
      expect(lastUserOtp).toBeUndefined();
    });
  });

  describe("When we want to create a new otp", () => {
    it("should create the otp", async () => {
      const otpToCreate = {
        email: "otpEmail@email.com",
        code: 123456,
      };
      await otpService.save(otpToCreate.email, otpToCreate.code);
      expect(prismaServiceMock.otp.create).toHaveBeenCalledTimes(1);
      expect(prismaServiceMock.otp.create).toHaveBeenCalledWith({
        data: { email: otpToCreate.email, code: otpToCreate.code },
      });
    });
  });
});
