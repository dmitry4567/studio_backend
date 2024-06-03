import { ApiProperty } from '@nestjs/swagger';
import { IsISO8601, IsInt, IsNotEmpty } from 'class-validator';

export class CreateStudioSessionDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsISO8601()
  from: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsISO8601()
  until: Date;

  @ApiProperty()
  @IsNotEmpty()
  user_admin_id: number;

  @ApiProperty()
  @IsNotEmpty()
  user_client_id: number;
}