import { ApiProperty } from "@nestjs/swagger";
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsUrl,
  Matches,
  MaxLength,
  MinLength,
} from "class-validator";
import { LANG } from "./LANGUAGE";

export class CreateUserDTO {
  @ApiProperty({ required: true })
  @MaxLength(12)
  @MinLength(6)
  @Matches(/^[a-zA-Z0-9]+([a-zA-Z0-9](_|-| )[a-zA-Z0-9])*[a-zA-Z0-9]+$/, {
    message: "Only alphanumeric characters with some separators (_- )",
  })
  @IsNotEmpty({ message: "Username is required" })
  readonly username: string;

  @ApiProperty({ required: true })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,20}$/,
    {
      message:
        "Minimum eight and maximum 10 characters, at least one uppercase letter, one lowercase letter, one number and one special character",
    },
  )
  @IsNotEmpty({ message: "Password is required" })
  readonly password: string;

  @ApiProperty({ required: true })
  @IsEmail(
    {
      allow_utf8_local_part: true,
    },
    { message: "Invalid email" },
  )
  @IsNotEmpty({ message: "Email is required" })
  readonly email: string;

  @IsUrl({}, { message: "Must be an url" })
  @IsOptional()
  @ApiProperty({ required: false })
  readonly profilePicture?: string;

  @IsDateString(
    {
      strict: true,
      strictSeparator: true,
    },
    {
      message: "Date of bird has a wrong format",
    },
  )
  @ApiProperty({ required: false })
  @IsOptional()
  readonly dateOfBird?: string;

  @ApiProperty({
    description: "User language",
    enum: LANG,
    example: LANG.EN,
    required: false,
    default: LANG.EN,
  })
  @IsEnum(LANG)
  @IsOptional()
  readonly lang: LANG = LANG.EN;
}
