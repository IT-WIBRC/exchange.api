import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class OTPService {
  constructor(private prisma: PrismaService) {}

  async save(email: string, code: number): Promise<void> {
    await this.prisma.otp.create({ data: { email, code } });
  }

  async findByEmail(email: string) {
    const otpRecordOrderByDateAsc = await this.prisma.otp.findMany({
      where: { email },
      orderBy: { create_at: "desc" },
    });
    return otpRecordOrderByDateAsc[0];
  }
}
