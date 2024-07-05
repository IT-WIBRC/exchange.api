import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, Matches } from "class-validator";

export class OtpDTO {
  @ApiProperty()
  @IsNotEmpty({ message: "Email is required" })
  @IsEmail()
  readonly email: string;

  @ApiProperty()
  @IsNotEmpty({ message: "Code is required" })
  @Matches(/^[0-9]{6}$/, {
    message: "String must contain 6 digits",
  })
  readonly code: string;
}
