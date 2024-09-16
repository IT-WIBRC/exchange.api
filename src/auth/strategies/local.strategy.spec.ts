import { Test, TestingModule } from "@nestjs/testing";
import { LocalStrategy } from "./local.strategy";
import { AuthService } from "../auth.service";
import { LANG } from "../../user/dto/LANGUAGE";
import { User } from "../../user/entities/user.entity";
import { Profile } from "../../user/entities/profile.entity";
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";
import { BadRequestException } from "@nestjs/common";

const authService = {
  validateUser: jest.fn(),
};
describe("LocalStrategy", () => {
  let localStrategy: LocalStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: AuthService,
          useValue: authService,
        },
        LocalStrategy,
      ],
    }).compile();

    localStrategy = module.get<LocalStrategy>(LocalStrategy);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(localStrategy).toBeDefined();
  });

  it("should return the user when it does exist", async () => {
    const user = {
      email: "otpemail@email.com",
      username: "username",
      password: "12345678",
      profilePicture: "",
      dateOfBird: new Date().toISOString(),
      lang: LANG.EN,
    };
    const userEntity = User.create({
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
      roles: [],
      username: user.username,
    });
    authService.validateUser.mockResolvedValueOnce(userEntity);
    expect(await localStrategy.validate("email", "password")).toEqual(
      userEntity,
    );
  });

  it.failing("should throw an error when the user does not exist", async () => {
    authService.validateUser.mockResolvedValueOnce(null);
    const result = await localStrategy.validate("email", "password");
    expect(result).toBeInstanceOf(BadRequestException);
  });
});
