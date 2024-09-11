import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { PrismaModule } from "../prisma/prisma.module";
import { UserModule } from "../user/user.module";
import { MailModule } from "../mail/mail.module";
import { LocalStrategy } from "./strategies/local.strategy";
import { REPOSITORIES_PROVIDER } from "../helpers/constants";
import { UserRepository } from "../user/repositories/user.repository";

@Module({
  imports: [
    UserModule,
    PrismaModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: "30d" },
    }),
    MailModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    { provide: REPOSITORIES_PROVIDER.USER, useClass: UserRepository },
  ],
})
export class AuthModule {}
