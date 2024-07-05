import { UseCase } from "../../../core/domain/useCase";
import { CreateUserDTO } from "../../dto/createUserDTO";
import { Profile } from "../../entities/profile.entity";
import { User } from "../../entities/user.entity";
import { IUserRepo } from "../../repositories/user.repository";
import { IMail } from "../../../mail/IMail";
import { Either, Result, left, right } from "../../../core/domain/Result";
import { GenericAppError } from "../../../core/domain/AppError";
import { SignUpError } from "./SignUpError";
import { ConfigService } from "@nestjs/config";
import { OTPService } from "../../services/otp.service";
import { generateOtpCodeOf } from "../../helpers/otp";
import { IRoleRepo } from "../../../role/repository/role.repository";
import { GetRoleByNameError } from "../../../role/useCases/getRoleByName/GetRoleByNameError";
import { defaultRoles } from "../../../helpers/defaults";
import { Inject, Injectable } from "@nestjs/common";
import { REPOSITORIES_PROVIDER } from "../../../helpers/constants";
import { hashSync } from "bcrypt";

type Response = Either<
  | GenericAppError.UnexpectedError
  | SignUpError.AccountAlreadyExists
  | GetRoleByNameError.RoleNotFound
  | Result<any>,
  Result<void>
>;

@Injectable()
export class SignUpUseCase
  implements UseCase<CreateUserDTO, Promise<Response>>
{
  constructor(
    @Inject(REPOSITORIES_PROVIDER.USER) private userRepo: IUserRepo,
    @Inject(REPOSITORIES_PROVIDER.ROLE) private roleRepo: IRoleRepo,
    @Inject(REPOSITORIES_PROVIDER.EMAIL) private emailService: IMail,
    private config: ConfigService,
    private otpService: OTPService,
  ) {}

  async execute(request?: CreateUserDTO): Promise<Response> {
    const profile = Profile.create({
      lang: request.lang,
      last_connection: new Date(),
      photo: request.profilePicture ?? "",
      date_of_birth: request.dateOfBird ? new Date(request.dateOfBird) : null,
    });

    try {
      const roleExistOrNot =
        await this.roleRepo.findRoleWithPermissionsByRoleName(
          defaultRoles.user.value,
        );

      if (!roleExistOrNot) {
        return left(
          new GetRoleByNameError.RoleNotFound(defaultRoles.user.value),
        ) as Response;
      }

      const hashedPassword = hashSync(
        request.password,
        Number(this.config.get("ROUNDS_OF_HASHING")),
      );

      const user = User.create({
        email: request.email,
        isActive: false,
        password: hashedPassword,
        profile: profile,
        username: request.username,
        roles: [roleExistOrNot.id],
        createdAt: new Date(),
      });

      const userAlreadyExist = await this.userRepo.exists(user.email);

      if (userAlreadyExist) {
        return left(
          new SignUpError.AccountAlreadyExists(user.email),
        ) as Response;
      }

      await this.userRepo.save(user);

      const otpCode = generateOtpCodeOf(Number(this.config.get("OTP_DIGIT")));
      let isEmailHasBeenSend = false;
      try {
        await this.emailService.sendUserConfirmation({
          code: otpCode,
          email: user.email,
          username: user.username,
        });

        await this.otpService.save(user.email, otpCode);

        isEmailHasBeenSend = true;
      } catch (error) {
        try {
          await this.userRepo.delete(user.email);
        } catch (error2) {
          console.error(error2);
        }
      }

      if (!isEmailHasBeenSend) {
        return left(
          new GenericAppError.UnexpectedError(new Error("Email service error")),
        );
      }
    } catch (error: unknown) {
      return left(new GenericAppError.UnexpectedError(error)) as Response;
    }

    return right(Result.ok<void>()) as Response;
  }
}
