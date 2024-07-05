import { Module } from "@nestjs/common";
import { UserService } from "./services/user.service";
import { PrismaModule } from "../prisma/prisma.module";
import { SignUpUseCase } from "./useCases/signUp/SignUpUseCase";
import { RoleModule } from "../role/role.module";
import { UserController } from "./user.controller";
import { OTPService } from "./services/otp.service";
import { REPOSITORIES_PROVIDER } from "../helpers/constants";
import { UserRepository } from "./repositories/user.repository";
import { MailModule } from "../mail/mail.module";
import { EnableUserUseCase } from "./useCases/enableUser/EnableUserUseCase";
import { ResendOtpUseCase } from "./useCases/resendOtp/ResendOtpUseCase";

@Module({
  imports: [PrismaModule, RoleModule, MailModule],
  providers: [
    UserService,
    SignUpUseCase,
    EnableUserUseCase,
    ResendOtpUseCase,
    OTPService,
    { provide: REPOSITORIES_PROVIDER.USER, useClass: UserRepository },
  ],
  exports: [],
  controllers: [UserController],
})
export class UserModule {}
