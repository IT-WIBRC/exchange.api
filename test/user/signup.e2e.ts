import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../../src/app.module";
import prismaUtils from "../helpers/prisma";

describe("UserController (SignUp)", () => {
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

  const CREATE_USER_ROUTE = "/user";
  describe("should create the user successfully", () => {
    const newUser = {
      email: "emailtest@email.com",
      password: "Wibrc@34839",
      username: "username",
    };

    it("should create an account successfully", async () => {
      const result = await request(app.getHttpServer())
        .post(CREATE_USER_ROUTE)
        .send(newUser);
      expect(result.statusCode).toBe(201);
    });
  });

  describe("Validations cases", () => {
    describe("Email error cases", () => {
      it("should return an error when the email is missing", async () => {
        const newUser = {
          password: "Wibrc@34839",
          username: "username",
          profilePicture: "http://url",
          dateOfBird: "2024-10-10",
        };

        const result = await request(app.getHttpServer())
          .post(CREATE_USER_ROUTE)
          .send(newUser);
        expect(result.statusCode).toBe(400);
        expect(result.body.message).toBe("Email is required");
      });

      it("should return an error when the email does not respect the format", async () => {
        const newUser = {
          email: "email",
          password: "Wibrc@34839",
          username: "username",
        };
        const result = await request(app.getHttpServer())
          .post(CREATE_USER_ROUTE)
          .send(newUser);
        expect(result.statusCode).toBe(400);
        expect(result.body.message).toBe("Invalid email");
      });
    });

    describe("Username error cases", () => {
      it("should return an error when the username is missing", async () => {
        const newUser = {
          email: "email@gmail.com",
          password: "Wibrc@34839",
          profilePicture: "http://url",
          dateOfBird: "2024-10-10",
        };

        const result = await request(app.getHttpServer())
          .post(CREATE_USER_ROUTE)
          .send(newUser);
        expect(result.statusCode).toBe(400);
        expect(result.body.message).toBe("Username is required");
      });

      it("should return an error when the username is less than 6", async () => {
        const newUser = {
          email: "email@gmail.com",
          password: "Wibrc@34839",
          username: "usern",
        };
        const result = await request(app.getHttpServer())
          .post(CREATE_USER_ROUTE)
          .send(newUser);
        expect(result.statusCode).toBe(400);
        expect(result.body.message).toBe(
          "username must be longer than or equal to 6 characters",
        );
      });

      it("should return an error when the username is more than 12", async () => {
        const newUser = {
          email: "email@gmail.com",
          password: "Wibrc@34839",
          username: "usernaneUsername",
        };
        const result = await request(app.getHttpServer())
          .post(CREATE_USER_ROUTE)
          .send(newUser);
        expect(result.statusCode).toBe(400);
        expect(result.body.message).toBe(
          "username must be shorter than or equal to 12 characters",
        );
      });
    });

    describe("Password error cases", () => {
      it("should return an error when the password is missing", async () => {
        const newUser = {
          email: "email@gmail.com",
          username: "wibrc_34839",
          profilePicture: "url",
          dateOfBird: "2024-10-10",
        };

        const result = await request(app.getHttpServer())
          .post(CREATE_USER_ROUTE)
          .send(newUser);
        expect(result.statusCode).toBe(400);
        expect(result.body.message).toBe("Password is required");
      });

      it("should return an error when the password is less than 10", async () => {
        const newUser = {
          email: "email@gmail.com",
          password: "wibrc@34839",
          username: "wibrc_34839",
        };
        const result = await request(app.getHttpServer())
          .post(CREATE_USER_ROUTE)
          .send(newUser);
        expect(result.statusCode).toBe(400);
        expect(result.body.message).toBe(
          "Minimum eight and maximum 10 characters, at least one uppercase letter, one lowercase letter, one number and one special character",
        );
      });

      it("should return an error when the password is more than 20", async () => {
        const newUser = {
          email: "email@gmail.com",
          password: "wibrc_3483910wibrc-3483910",
          username: "wibrc_34839",
        };
        const result = await request(app.getHttpServer())
          .post(CREATE_USER_ROUTE)
          .send(newUser);
        expect(result.statusCode).toBe(400);
        expect(result.body.message).toBe(
          "Minimum eight and maximum 10 characters, at least one uppercase letter, one lowercase letter, one number and one special character",
        );
      });
    });

    describe("Other fields", () => {
      it("should return an error message when the profile url provided is not an url", async () => {
        const newUser = {
          email: "email@gmail.com",
          username: "wibrc_34839",
          profilePicture: "url",
          dateOfBird: "2024-10-10",
          password: "Wibrc@34839",
        };

        const result = await request(app.getHttpServer())
          .post(CREATE_USER_ROUTE)
          .send(newUser);
        expect(result.statusCode).toBe(400);
        expect(result.body.message).toBe("Must be an url");
      });

      it("should return an error message when the date of bird provided is not at  at the right format", async () => {
        const newUser = {
          email: "email@gmail.com",
          username: "wibrc_34839",
          dateOfBird: "2024/10/10",
          password: "Wibrc@34839",
        };

        const result = await request(app.getHttpServer())
          .post(CREATE_USER_ROUTE)
          .send(newUser);
        expect(result.statusCode).toBe(400);
        expect(result.body.message).toBe("Date of bird has a wrong format");
      });

      it("should return an error message when the language provided is not among those supported", async () => {
        const newUser = {
          email: "email@gmail.com",
          username: "wibrc_34839",
          dateOfBird: "2024-10-10",
          password: "Wibrc@34839",
          lang: "JP",
        };

        const result = await request(app.getHttpServer())
          .post(CREATE_USER_ROUTE)
          .send(newUser);
        expect(result.statusCode).toBe(400);
        expect(result.body.message).toBe(
          "lang must be one of the following values: FR, EN",
        );
      });
    });
  });

  it("should return an error message when the user already exist", async () => {
    await prismaUtils.fillUserTable();

    const newUser = {
      email: prismaUtils.users[0].email,
      username: prismaUtils.users[0].username,
      password: prismaUtils.users[0].password,
      dateOfBird: "2024-10-10",
    };

    const result = await request(app.getHttpServer())
      .post(CREATE_USER_ROUTE)
      .send(newUser);
    expect(result.statusCode).toBe(409);
    expect(result.body.message).toBe(
      `The email ${prismaUtils.users[0].email} associated for this account already exists`,
    );
  });
});
