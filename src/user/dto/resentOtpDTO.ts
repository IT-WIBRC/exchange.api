import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class ResentOtpDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  @IsEmail()
  email: string;
}
