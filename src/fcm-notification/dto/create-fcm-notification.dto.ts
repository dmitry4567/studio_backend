import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateFcmNotificationDto {
  @ApiProperty()
  @IsString()
  device_token: string;
}
