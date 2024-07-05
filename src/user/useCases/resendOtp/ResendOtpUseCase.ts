import { UseCase } from "../../../core/domain/useCase";
import { IUserRepo } from "../../repositories/user.repository";
import { IMail } from "../../../mail/IMail";
import { Either, Result, left, right } from "../../../core/domain/Result";
import { GenericAppError } from "../../../core/domain/AppError";
import { OTPService } from "../../services/otp.service";
import { Inject, Injectable } from "@nestjs/common";
import { ResendOtpError } from "./ResendOtpError";
import { ResentOtpDTO } from "../../dto/resentOtpDTO";
import { REPOSITORIES_PROVIDER } from "../../../helpers/constants";
import { generateOtpCodeOf } from "../../helpers/otp";

type Response = Either<
  | GenericAppError.UnexpectedError
  | ResendOtpError.UserNotFound
  | ResendOtpError.UserAlreadyActive
  | Result<any>,
  Result<void>
>;

@Injectable()
export class ResendOtpUseCase
  implements UseCase<ResentOtpDTO, Promise<Response>>
{
  constructor(
    @Inject(REPOSITORIES_PROVIDER.USER) private userRepo: IUserRepo,
    @Inject(REPOSITORIES_PROVIDER.EMAIL) private emailService: IMail,
    private otpService: OTPService,
  ) {}

  async execute(request?: ResentOtpDTO): Promise<Response> {
    try {
      const userAlreadyExist = await this.userRepo.findUserByEmail(
        request.email,
      );
      if (!userAlreadyExist) {
        return left(new ResendOtpError.UserNotFound(request.email)) as Response;
      }

      if (userAlreadyExist.isActive) {
        return left(
          new ResendOtpError.UserAlreadyActive(request.email),
        ) as Response;
      }

      const otpCode = generateOtpCodeOf(Number(process.env.OTP_DIGIT));
      await this.emailService.sendUserConfirmation({
        code: otpCode,
        email: userAlreadyExist.email,
        username: userAlreadyExist.username,
      });

      await this.otpService.save(userAlreadyExist.email, otpCode);
    } catch (error: unknown) {
      return left(new GenericAppError.UnexpectedError(error)) as Response;
    }
    return right(Result.ok<void>()) as Response;
  }
}
