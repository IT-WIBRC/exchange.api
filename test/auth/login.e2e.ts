import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../../src/app.module";
import prismaUtils from "../helpers/prisma";

describe("AuthController (Login)", () => {
  let app: INestApplication;

  beforeAll(async () => {
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

  const LOGIN_ROUTE = "/auth/login";
  describe("should log in the user successfully", () => {
    const currentUser = {
      email: prismaUtils.users[0].email,
      password: prismaUtils.users[0].password,
    };

    it("should login successfully", async () => {
      await Promise.all([prismaUtils.fillUserTable()]);
      const result = await request(app.getHttpServer())
        .post(LOGIN_ROUTE)
        .send(currentUser);
      expect(result.statusCode).toBe(200);
      expect(result.body.accessToken).toMatch(
        new RegExp(/^[A-Za-z0-9-_]*\.[A-Za-z0-9-_]*\.[A-Za-z0-9-_]*$/),
      );
    });
  });

  describe("Error cases", () => {
    beforeAll(async () => {
      await prismaUtils.resetDb();
    });

    describe("Email error cases", () => {
      it("should return an error when the email is missing", async () => {
        const newUser = {
          password: "Wibrc@34839",
        };

        const result = await request(app.getHttpServer())
          .post(LOGIN_ROUTE)
          .send(newUser);
        expect(result.statusCode).toBe(401);
        expect(result.body.message).toBe("Unauthorized");
      });
    });

    describe("Password error cases", () => {
      it("should return an error when the password is missing", async () => {
        const newUser = {
          email: "email@gmail.com",
        };

        const result = await request(app.getHttpServer())
          .post(LOGIN_ROUTE)
          .send(newUser);
        expect(result.statusCode).toBe(401);
        expect(result.body.message).toBe("Unauthorized");
      });
    });

    it("should return an error message when the user does not exist", async () => {
      const newUser = {
        email: "email@gmail.com",
        password: "password18EW",
      };
      const result = await request(app.getHttpServer())
        .post(LOGIN_ROUTE)
        .send(newUser);
      expect(result.statusCode).toBe(400);
      expect(result.body.message).toBe("User not found!");
    });
  });
});
