import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { REPOSITORIES_PROVIDER } from "../helpers/constants";
import { LANG } from "../user/dto/LANGUAGE";
import { User } from "../user/entities/user.entity";
import { Profile } from "../user/entities/profile.entity";
import { UniqueEntityID } from "../core/domain/UniqueEntityID";
import { hashSync } from "bcrypt";

const userRepo = {
  exists: jest.fn(),
  findUserByEmail: jest.fn(),
};
const jwtService = {
  sign: jest.fn(),
};

describe("AuthService", () => {
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule],
      providers: [
        AuthService,
        {
          provide: REPOSITORIES_PROVIDER.USER,
          useValue: userRepo,
        },
        {
          provide: JwtService,
          useValue: jwtService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
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
  const userEntity = User.create({
    email: user.email,
    isActive: false,
    createdAt: new Date(),
    password: hashSync(user.password, 10),
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

  it("should be defined", () => {
    expect(authService).toBeDefined();
  });

  describe("validateUser", () => {
    it("should return null when the user does not exist", async () => {
      userRepo.exists.mockResolvedValueOnce(false);
      const validateUser = await authService.validateUser(
        "unexist@gmail.com",
        "12345698",
      );
      expect(userRepo.exists).toHaveBeenCalledTimes(1);
      expect(userRepo.exists).toHaveBeenCalledWith("unexist@gmail.com");
      expect(validateUser).toBeNull();
    });

    it("should return null when the user exist but has the wrong password", async () => {
      userRepo.exists.mockResolvedValueOnce(true);
      userRepo.findUserByEmail.mockResolvedValueOnce(userEntity);
      const validateUser = await authService.validateUser(
        "unexist@gmail.com",
        "12345698",
      );
      expect(userRepo.exists).toHaveBeenCalledTimes(1);
      expect(userRepo.findUserByEmail).toHaveBeenCalledTimes(1);
      expect(validateUser).toBeNull();
    });

    it("should return the user when the user exist and has the right password", async () => {
      userRepo.exists.mockResolvedValueOnce(true);
      userRepo.findUserByEmail.mockResolvedValueOnce(userEntity);
      const validateUser = await authService.validateUser(
        "unexist@gmail.com",
        user.password,
      );
      expect(userRepo.exists).toHaveBeenCalledTimes(1);
      expect(userRepo.exists).toHaveBeenCalledWith("unexist@gmail.com");

      expect(userRepo.findUserByEmail).toHaveBeenCalledTimes(1);
      expect(userRepo.findUserByEmail).toHaveBeenCalledWith(
        "unexist@gmail.com",
      );
      expect(validateUser).toEqual(userEntity);
    });
  });

  describe("getAccessToken", () => {
    it("should get the access token", async () => {
      jwtService.sign.mockReturnValueOnce("12345678Token");
      const accessToken = await authService.getAccessToken(userEntity);
      expect(jwtService.sign).toHaveBeenCalledTimes(1);
      expect(jwtService.sign).toHaveBeenCalledWith({
        id: userEntity.id.toString(),
        lang: LANG[userEntity.profile.lang],
        email: userEntity.email,
        username: userEntity.username,
      });
      expect(accessToken).toEqual({
        accessToken: "12345678Token",
      });
    });
  });
});
