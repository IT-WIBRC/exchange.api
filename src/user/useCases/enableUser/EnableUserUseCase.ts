import { UseCase } from "../../../core/domain/useCase";
import { IUserRepo } from "../../repositories/user.repository";
import { IMail } from "../../../mail/IMail";
import { Either, Result, left, right } from "../../../core/domain/Result";
import { GenericAppError } from "../../../core/domain/AppError";
import { OTPService } from "../../services/otp.service";
import { Inject, Injectable } from "@nestjs/common";
import { REPOSITORIES_PROVIDER } from "../../../helpers/constants";
import { EnableUserError } from "./EnableUserError";
import { OtpDTO } from "../../dto/OtpDTO";

type Response = Either<
  | GenericAppError.UnexpectedError
  | EnableUserError.OtpHasExpired
  | EnableUserError.UserNotFound
  | EnableUserError.WrongOtp
  | EnableUserError.NoOtpForThisUser
  | EnableUserError.UserAlreadyActive
  | Result<any>,
  Result<void>
>;

@Injectable()
export class EnableUserUseCase implements UseCase<OtpDTO, Promise<Response>> {
  constructor(
    @Inject(REPOSITORIES_PROVIDER.USER) private userRepo: IUserRepo,
    @Inject(REPOSITORIES_PROVIDER.EMAIL) private emailService: IMail,
    private otpService: OTPService,
  ) {}

  async execute(request?: OtpDTO): Promise<Response> {
    try {
      const userAlreadyExist = await this.userRepo.findUserByEmail(
        request.email,
      );

      if (!userAlreadyExist) {
        return left(
          new EnableUserError.UserNotFound(request.email),
        ) as Response;
      }

      if (userAlreadyExist.isActive) {
        return left(
          new EnableUserError.UserAlreadyActive(request.email),
        ) as Response;
      }

      const lastUserOtpCode = await this.otpService.findByEmail(
        userAlreadyExist.email,
      );

      if (!lastUserOtpCode) {
        return left(
          new EnableUserError.NoOtpForThisUser(userAlreadyExist.email),
        ) as Response;
      }

      const otpHasExpired = this.hasExpired(
        new Date(lastUserOtpCode.create_at),
      );

      if (otpHasExpired) {
        return left(new EnableUserError.OtpHasExpired()) as Response;
      }

      if (Number(request.code) !== lastUserOtpCode.code) {
        return left(new EnableUserError.WrongOtp()) as Response;
      }

      await this.userRepo.enableUser(userAlreadyExist.email);

      await this.emailService.sendUserWelcome({
        email: lastUserOtpCode.email,
        username: userAlreadyExist.username,
      });
    } catch (error: unknown) {
      return left(new GenericAppError.UnexpectedError(error)) as Response;
    }
    return right(Result.ok<void>()) as Response;
  }

  private hasExpired(date: Date): boolean {
    const differenceInMillisecond =
      (new Date().getTime() - date.getTime()) / 1_000;

    return (
      differenceInMillisecond > Number(process.env.OTP_EXPIRATION_TIME) * 60
    );
  }
}
