import { ApiProperty } from "@nestjs/swagger";

export class TokenDTO {
  @ApiProperty()
  accessToken: string;
}
