import { ApiProperty } from "@nestjs/swagger";

export class ClientError {
  @ApiProperty()
  message: string;
}
