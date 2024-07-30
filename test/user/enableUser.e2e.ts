import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../../src/app.module";
import prismaUtils from "../helpers/prisma";

describe("UserController (Enable User)", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  const ENABLE_USER_ROUTE = "/user/otp-confirmation";
  describe.skip("should send the email successfully", () => {
    beforeAll(async () => {
      await prismaUtils.resetDb();
    });

    const otpDto = {
      email: prismaUtils.users[0].email,
      code: "348739",
    };

    it("should send the email successfully", async () => {
      await prismaUtils.fillUserTable();
      await prismaUtils.createOtp({
        code: Number(otpDto.code),
        email: prismaUtils.users[0].email,
        date: new Date().toISOString(),
      });

      const result = await request(app.getHttpServer())
        .post(ENABLE_USER_ROUTE)
        .send(otpDto);
      expect(result.statusCode).toBe(200);
    });
  });

  describe("Validations cases", () => {
    describe("Email error cases", () => {
      it("should return an error when the email is missing", async () => {
        const otpDto = {
          code: "348739",
        };

        const result = await request(app.getHttpServer())
          .post(ENABLE_USER_ROUTE)
          .send(otpDto);
        expect(result.statusCode).toBe(400);
        expect(result.body.message).toBe("email must be an email");
      });

      it("should return an error when the email is not at the right format", async () => {
        const otpDto = {
          email: "email@.fr",
          code: "348739",
        };

        const result = await request(app.getHttpServer())
          .post(ENABLE_USER_ROUTE)
          .send(otpDto);
        expect(result.statusCode).toBe(400);
        expect(result.body.message).toBe("email must be an email");
      });
    });

    describe("Otp code error cases", () => {
      it("should return an error when the otp code is missing", async () => {
        const otpDto = {
          email: prismaUtils.users[0].email,
        };

        const result = await request(app.getHttpServer())
          .post(ENABLE_USER_ROUTE)
          .send(otpDto);
        expect(result.statusCode).toBe(400);
        expect(result.body.message).toBe("String must contain 6 digits");
      });

      it("should return an error when the otp is not a string", async () => {
        const otpDto = {
          email: prismaUtils.users[0].email,
          code: 324560,
        };

        const result = await request(app.getHttpServer())
          .post(ENABLE_USER_ROUTE)
          .send(otpDto);
        expect(result.statusCode).toBe(400);
        expect(result.body.message).toBe("String must contain 6 digits");
      });

      it("should return an error when the otp has not 6 digits", async () => {
        const otpDto = {
          email: prismaUtils.users[0].email,
          code: "32edr090",
        };

        const result = await request(app.getHttpServer())
          .post(ENABLE_USER_ROUTE)
          .send(otpDto);
        expect(result.statusCode).toBe(400);
        expect(result.body.message).toBe("String must contain 6 digits");
      });
    });
  });

  describe.skip("App errors", () => {
    beforeEach(async () => {
      await prismaUtils.resetDb();
    });

    it("should return an error message when the otp has expired", async () => {
      const otpDto = {
        email: prismaUtils.users[0].email,
        code: "348739",
      };
      await prismaUtils.fillUserTable();
      await prismaUtils.createOtp({
        code: Number(otpDto.code),
        email: prismaUtils.users[0].email,
        date: new Date("2023-10-13").toISOString(),
      });

      const result = await request(app.getHttpServer())
        .post(ENABLE_USER_ROUTE)
        .send({
          email: prismaUtils.users[0].email,
          code: otpDto.code,
        });
      expect(result.statusCode).toBe(403);
      expect(result.body.message).toBe("The otp has expired");
    });

    it("should return an error message when the otp is the wrong one", async () => {
      await prismaUtils.resetDb();
      const otpDto = {
        email: prismaUtils.users[0].email,
        code: "348739",
      };
      await prismaUtils.fillUserTable();
      await prismaUtils.createOtp({
        code: Number(otpDto.code),
        email: prismaUtils.users[0].email,
        date: new Date().toISOString(),
      });

      const result = await request(app.getHttpServer())
        .post(ENABLE_USER_ROUTE)
        .send({
          email: prismaUtils.users[0].email,
          code: "123456",
        });
      expect(result.statusCode).toBe(400);
      expect(result.body.message).toBe("Wrong otp code provide");
    });

    it("should return an error message when the user does not have any otp code", async () => {
      await prismaUtils.fillUserTable();

      const result = await request(app.getHttpServer())
        .post(ENABLE_USER_ROUTE)
        .send({
          email: prismaUtils.users[0].email,
          code: "123456",
        });
      expect(result.statusCode).toBe(409);
      expect(result.body.message).toBe(
        `The ${prismaUtils.users[0].email} does not have any otp assigned`,
      );
    });

    it("should return a not found error message when the user is not known", async () => {
      const result = await request(app.getHttpServer())
        .post(ENABLE_USER_ROUTE)
        .send({
          email: "unknownUser@email.com",
          code: "123456",
        });
      expect(result.statusCode).toBe(404);
      expect(result.body.message).toBe(
        "The unknownUser@email.com is not found",
      );
    });
  });
});
