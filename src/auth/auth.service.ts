import { Inject, Injectable } from "@nestjs/common";
import { compareSync } from "bcrypt";
import { REPOSITORIES_PROVIDER } from "../helpers/constants";
import { User } from "../user/entities/user.entity";
import { IUserRepo } from "../user/repositories/user.repository";
import { JwtService } from "@nestjs/jwt";
import { UserDTO } from "./dto/userDTO";
import { LANG } from "../user/dto/LANGUAGE";
import { TokenDTO } from "./dto/tokenDTO";

@Injectable()
export class AuthService {
  constructor(
    @Inject(REPOSITORIES_PROVIDER.USER) private userRepo: IUserRepo,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const isUserExist = await this.userRepo.exists(email);
    if (!isUserExist) {
      return null;
    }
    const user = await this.userRepo.findUserByEmail(email);
    const hasSamePassword = compareSync(password, user.password);
    if (hasSamePassword) {
      return user;
    }
    return null;
  }

  async getAccessToken(user: User): Promise<TokenDTO> {
    const payload: UserDTO = {
      id: user.id.toString(),
      lang: LANG[user.profile.lang],
      email: user.email,
      username: user.username,
    };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
