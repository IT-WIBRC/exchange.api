import { ApiProperty } from "@nestjs/swagger";

export class SimpleLoginDTO {
  @ApiProperty({ required: true })
  readonly password: string;

  @ApiProperty({ required: true })
  readonly email: string;
}
