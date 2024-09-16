import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { Request, Response } from "express";
import {
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { BaseController } from "../core/domain/BaseController";
import { SimpleLoginDTO } from "./dto/simpleLoginDTO";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { AuthService } from "./auth.service";
import { User } from "../user/entities/user.entity";
import { TokenDTO } from "./dto/tokenDTO";

@Controller("auth")
@ApiTags("Auth")
export class AuthController extends BaseController {
  constructor(private authService: AuthService) {
    super();
  }

  @Post("login")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "User login",
    description: "Authenticate the user",
    operationId: "login",
  })
  @ApiOkResponse({
    description: "Operation successful",
    type: TokenDTO,
  })
  @ApiUnauthorizedResponse({ description: "User not found" })
  @UseGuards(LocalAuthGuard)
  async login(
    simpleLoginDto: SimpleLoginDTO,
    @Res() response: Response,
    @Req() request: Request,
  ) {
    this.execute(response);
    try {
      const token = await this.authService.getAccessToken(request.user as User);
      return this.ok(response, token);
    } catch (error) {
      return this.fail(error);
    }
  }
}
