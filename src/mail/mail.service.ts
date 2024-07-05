import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { IMail } from "./IMail";

@Injectable()
export class MailService implements IMail {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation({ email, username, code }): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      subject: `Let's verify your email, ${username}`,
      template: "./confirmation",
      context: {
        name: username,
        code: code,
      },
    });
  }

  async sendUserWelcome({ email, username }): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      subject: `Welcome to ${username}`,
      template: "./welcome",
      context: {
        name: username,
      },
    });
  }
}
