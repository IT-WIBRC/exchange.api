import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { PrismaService } from "./prisma/prisma.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { MailModule } from "./mail/mail.module";
import { RoleModule } from "./role/role.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: process.env.NODE_ENV === "production",
    }),
    PrismaModule,
    AuthModule,
    UserModule,
    MailModule,
    RoleModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, ConfigService],
  exports: [ConfigService],
})
export class AppModule {}
