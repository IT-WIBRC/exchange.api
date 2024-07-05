import { ApiProperty } from "@nestjs/swagger";
import { Transform, TransformFnParams } from "class-transformer";
import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class GetRoleDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  @MinLength(6)
  @Transform(
    ({ value }: TransformFnParams) =>
      typeof value === "string" && value.replace(/\s/g, "").length > 0,
  )
  name: string;
}
