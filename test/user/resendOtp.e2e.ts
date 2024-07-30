import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../../src/app.module";
import prismaUtils from "../helpers/prisma";

describe("UserController (Resend Otp)", () => {
  let app: INestApplication;

  beforeAll(async () => {
    await prismaUtils.resetDb();
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  beforeEach(async () => {
    await prismaUtils.resetDb();
  });

  afterAll(async () => {
    await app.close();
  });

  const RESEND_OTP_ROUTE = "/user/otp-resend";
  describe.skip("should resend the otp successfully", () => {
    const resendOtp = {
      email: prismaUtils.users[0].email,
    };

    it("should resend the otp successfully", async () => {
      await prismaUtils.fillUserTable();

      const result = await request(app.getHttpServer())
        .post(RESEND_OTP_ROUTE)
        .send(resendOtp);
      expect(result.statusCode).toBe(200);
    });
  });

  describe("Validations cases", () => {
    describe("Email error cases", () => {
      it("should return an error when the email is missing", async () => {
        const result = await request(app.getHttpServer())
          .post(RESEND_OTP_ROUTE)
          .send({});
        expect(result.statusCode).toBe(400);
        expect(result.body.message).toBe("email must be an email");
      });

      it("should return an error when the email is not at the right format", async () => {
        const resendOtp = {
          email: "email@.fr",
        };

        const result = await request(app.getHttpServer())
          .post(RESEND_OTP_ROUTE)
          .send(resendOtp);
        expect(result.statusCode).toBe(400);
        expect(result.body.message).toBe("email must be an email");
      });
    });
  });

  describe("App error", () => {
    it("should return a not found error message when the user is not known", async () => {
      const result = await request(app.getHttpServer())
        .post(RESEND_OTP_ROUTE)
        .send({
          email: "unknownUser@email.com",
          code: "123456",
        });
      expect(result.statusCode).toBe(404);
      expect(result.body.message).toBe(
        "The unknownUser@email.com is not found",
      );
    });

    it("should return an error message when the user is already active", async () => {
      const resendOtp = {
        email: prismaUtils.users[1].email,
      };
      await prismaUtils.fillUserTable();
      await prismaUtils.createOtp({
        code: 123456,
        email: prismaUtils.users[1].email,
      });

      const result = await request(app.getHttpServer())
        .post(RESEND_OTP_ROUTE)
        .send(resendOtp);
      expect(result.statusCode).toBe(409);
      expect(result.body.message).toBe(
        `The ${resendOtp.email} is already active`,
      );
    });
  });
});
