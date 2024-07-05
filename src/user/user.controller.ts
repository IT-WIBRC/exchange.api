import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  ValidationPipe,
} from "@nestjs/common";
import { ApiCreatedResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { CreateUserDTO } from "../user/dto/createUserDTO";
import { SignUpUseCase } from "../user/useCases/signUp/SignUpUseCase";
import { SignUpError } from "../user/useCases/signUp/SignUpError";
import { BaseController } from "../core/domain/BaseController";
import { Response } from "express";
import { OtpDTO } from "./dto/OtpDTO";
import { EnableUserUseCase } from "./useCases/enableUser/EnableUserUseCase";
import { EnableUserError } from "./useCases/enableUser/EnableUserError";
import { ResentOtpDTO } from "./dto/resentOtpDTO";
import { ResendOtpUseCase } from "./useCases/resendOtp/ResendOtpUseCase";
import { ResendOtpError } from "./useCases/resendOtp/ResendOtpError";
import { GetRoleByNameError } from "../role/useCases/getRoleByName/GetRoleByNameError";

@Controller("user")
@ApiTags("user")
export class UserController extends BaseController {
  constructor(
    private signUpUseCase: SignUpUseCase,
    private enableUserUseCase: EnableUserUseCase,
    private resendOtpUseCase: ResendOtpUseCase,
  ) {
    super();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "User registration" })
  @ApiCreatedResponse()
  async signUp(
    @Body(
      new ValidationPipe({
        stopAtFirstError: true,
        skipMissingProperties: false,
        transform: true,
        whitelist: true,
      }),
    )
    createUserDto: CreateUserDTO,
    @Res() response: Response,
  ) {
    this.execute(response);

    try {
      const result = await this.signUpUseCase.execute(createUserDto);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case SignUpError.AccountAlreadyExists:
            return this.conflict(error.errorValue().message);
          case GetRoleByNameError.RoleNotFound:
            return this.fail(error.errorValue().message);
          default:
            return this.fail(error.errorValue().message);
        }
      } else {
        return this.created(response);
      }
    } catch (error) {
      return this.fail(error);
    }
  }

  @Post("otp-confirmation")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Enable user account" })
  @ApiCreatedResponse()
  async enableUser(
    @Body(
      new ValidationPipe({
        stopAtFirstError: true,
        skipMissingProperties: false,
        transform: true,
        whitelist: true,
      }),
    )
    otpDto: OtpDTO,
    @Res() response: Response,
  ) {
    this.execute(response);

    try {
      const result = await this.enableUserUseCase.execute(otpDto);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case EnableUserError.UserNotFound:
            return this.notFound(error.errorValue().message);
          case EnableUserError.OtpHasExpired:
            return this.forbidden(error.errorValue().message);
          case EnableUserError.WrongOtp:
            return this.clientError(error.errorValue().message);
          case EnableUserError.NoOtpForThisUser:
            return this.conflict(error.errorValue().message);
          default:
            return this.fail(error.errorValue().message);
        }
      } else {
        return this.ok(response);
      }
    } catch (error) {
      return this.fail(error);
    }
  }

  @Post("otp-resend")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Resent otp code" })
  @ApiCreatedResponse()
  async resendOtp(
    @Body(
      new ValidationPipe({
        stopAtFirstError: true,
        skipMissingProperties: false,
        transform: true,
        whitelist: true,
      }),
    )
    resentOtp: ResentOtpDTO,
    @Res() response: Response,
  ) {
    this.execute(response);

    try {
      const result = await this.resendOtpUseCase.execute(resentOtp);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case ResendOtpError.UserNotFound:
            return this.notFound(error.errorValue().message);
          case ResendOtpError.UserAlreadyActive:
            return this.conflict(error.errorValue().message);
          default:
            return this.fail(error.errorValue().message);
        }
      } else {
        return this.ok(response);
      }
    } catch (error) {
      return this.fail(error);
    }
  }
}
